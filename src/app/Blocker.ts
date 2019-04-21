import * as parseUrl from 'url-parse';
import { searchBlacklist } from "./siteBlacklist";

export class Blocker {
    startBlocking() {
        chrome.tabs.onCreated.addListener(tab => this.handleTabVisitedSite(tab.id, tab.url));
        chrome.tabs.onUpdated.addListener((tabId, changeInfo) => this.handleTabVisitedSite(tabId, changeInfo.url));
    }

    handleTabVisitedSite(tabId?: number, url?: string) {
        if (tabId === undefined || !url) {
            return;
        }

        const parsedUrl = parseUrl(url);
        if (parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:") {
            const urlToSearch = parsedUrl.hostname + parsedUrl.pathname;
            console.log(`Searching blacklist for "${urlToSearch}"...`);
            const blacklistIndex = searchBlacklist(urlToSearch, true, false);
            if (blacklistIndex !== -1) {
                const blockPage = chrome.runtime.getURL("blocked.html") + "?domain=" + encodeURIComponent(url);
                chrome.tabs.update(tabId, {url: blockPage});
            }
        }
    }
}
