import * as parseUrl from 'url-parse';
import { searchBlacklist } from './siteBlacklist';

const LOG_KEY = "sites";
const MIN_VISIT_LENGTH_TO_LOG = 2000; // Milliseconds
const MAX_VISIT_LENGTH_TO_LOG = 5 // Minutes

export interface SiteVisit {
    domain: string;
    startTime: number;
    endTime: number;
}

/**
 * Logs when time is spent on websites.  Based on code from https://github.com/navjagpal/browser-timetracker.
 * 
 * @author Silas Hsu
 */
export class SiteLog {
    private _startTime: number;
    private _currentSite: string;

    constructor() {
        this._startTime = Date.now();
        this._currentSite = "";
    }

    getData(): SiteVisit[] {
        const data = window.localStorage.getItem(LOG_KEY);
        return data ? JSON.parse(data) : [];
        /*
        return new Promise<SiteVisit[]>((resolve, reject) => {
            chrome.storage.local.get( LOG_KEY, data => resolve(data[LOG_KEY] || []) );
        });
        */
    }

    addItemToLog() {
        if (!this._currentSite ||
            this._startTime === Number.NEGATIVE_INFINITY ||
            searchBlacklist(this._currentSite, true) === -1 // Site not on the blacklist
        ) {
            return;
        }

        const endTime = Date.now();
        const delta = endTime - this._startTime;
        if (delta < MIN_VISIT_LENGTH_TO_LOG || delta/1000/60 > MAX_VISIT_LENGTH_TO_LOG) {
            return;
        }

        const log = this.getData();
        const lastItem = log[log.length - 1];
        const newItem: SiteVisit = {domain: this._currentSite, startTime: this._startTime, endTime: endTime};

        if (lastItem && lastItem.domain === newItem.domain) {
            lastItem.endTime = newItem.endTime;
        } else {
            log.push(newItem);
        }
        window.localStorage.setItem(LOG_KEY, JSON.stringify(log));
    }

    /**
     * This method should be called whenever there is a potential focus change.  Provide url = null if Chrome is out of
     * focus.
     * 
     * @param {string | null | undefined} url - the url that was focused, or null/undefined if focus was lost.
     */
    setCurrentFocus(url: string | null | undefined) {
        this.addItemToLog();

        if (!url) {
            this._currentSite = "";
            this._startTime = Number.NEGATIVE_INFINITY;
        } else {
            const parsed = parseUrl(url);
            this._currentSite = parsed.hostname + parsed.pathname;
            this._startTime = Date.now();
        }
    }
}
