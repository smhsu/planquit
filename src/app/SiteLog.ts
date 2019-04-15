const DOMAIN_REGEX = /^(\w+:\/\/[^\/]+).*$/;
const LOG_KEY = "sites";

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
    private _currentDomain: string;

    constructor() {
        this._startTime = Date.now();
        this._currentDomain = null;
    }

    /**
     * Returns just the domain from the url.  Includes the protocol.
     * 
     * @example chrome://extensions/some/other?blah=ffdf -> chrome://extensions
     * @param {string} url - a URL, including the protocol.
     * @return {string} the domain name, including protocol, but not paths.
     */
    getDomainFromUrl(url: string) {
        var match = url.match(DOMAIN_REGEX);
        if (match) {
          return match[1];
        }
        return null;
    };

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
        if (this._currentDomain === null) {
            return;
        }

        const endTime = Date.now();
        const delta = endTime - this._startTime;
        if (delta/1000/60 > 2) { // Duration too long; ignored.  Ignore very short visits too?
            return;
        }

        const log = this.getData();
        const lastItem = log[log.length - 1];
        const newItem: SiteVisit = {domain: this._currentDomain, startTime: this._startTime, endTime: endTime};

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
     * @param {string} url - the url that was focused, or null if focus was lost.
     */
    setCurrentFocus(url: string) {
        this.addItemToLog();

        if (url == null) {
            this._currentDomain = null;
            this._startTime = null;
        } else {
            this._currentDomain = this.getDomainFromUrl(url);
            this._startTime = Date.now();
        }
    }
}
