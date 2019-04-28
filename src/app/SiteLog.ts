import * as parseUrl from 'url-parse';
import { searchBlacklist } from './siteBlacklist';
import { isBlockingActive } from './blockTimes';

const LOG_KEY = "sites";
const MIN_VISIT_LENGTH_TO_LOG = 1000; // Milliseconds
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

    /**
     * Gets a log of when blacklist sites were visited
     */
    getData(): SiteVisit[] {
        const data = window.localStorage.getItem(LOG_KEY);
        return data ? JSON.parse(data) : [];
    }

    /**
     * Adds a site visit to the log, but only if it is on the blacklist and we are actively blocking sites.
     */
    addItemToLog() {
        if (!this._currentSite ||
            this._startTime === Number.NEGATIVE_INFINITY ||
            !isBlockingActive() ||
            searchBlacklist(this._currentSite, true) === -1 // Site is not on the blacklist
        ) {
            return;
        }

        const endTime = Date.now();
        const delta = endTime - this._startTime;
        if (delta < MIN_VISIT_LENGTH_TO_LOG || delta/1000/60 > MAX_VISIT_LENGTH_TO_LOG) {
            return;
        }

        const log = this.getData();
        const newItem: SiteVisit = {domain: this._currentSite, startTime: this._startTime, endTime: endTime};
        log.push(newItem);
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
