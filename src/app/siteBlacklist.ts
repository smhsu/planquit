const BLACKLIST_STORAGE_KEY = "siteBlacklist";

interface BlacklistEntry {
    url: string;
    whitelistedUntil: number;
}

/**
 * @return {BlacklistEntry[]} the current blacklist, including whitelist times
 */
function getRawBlacklist(): BlacklistEntry[] {
    const data = window.localStorage.getItem(BLACKLIST_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}

/**
 * @return {string[]} the current site blacklist
 */
export function getBlacklist(): string[] {
    const list = getRawBlacklist();
    return list.map(entry => entry.url);
}

function setBlacklist(blacklist: BlacklistEntry[]) {
    window.localStorage.setItem(BLACKLIST_STORAGE_KEY, JSON.stringify(blacklist));
}

/**
 * Adds a URL to the blacklist.  Does nothing and returns `false` if the URL already is on the list.  Otherwise,
 * returns `true`.
 * 
 * @param {string} url - the site to add to the site blacklist
 * @return {boolean} whether the url was added
 */
export function addSiteToBlacklist(url: string): boolean {
    if (searchBlacklist(url) === -1) { // i.e. not on the blacklist
        const list = getRawBlacklist();
        list.push({url: url, whitelistedUntil: 0});
        setBlacklist(list);
        return true;
    } else {
        return false;
    }
}

/**
 * Searches the blacklist for a url.  If `fuzzy` (default=false), matches need not be exact .  If
 * `ignoreWhitelisting` (default=true), considers sites on the list as-is; i.e. the blacklist takes priority over the
 * whitelist.  Returns the index of the matching entry in the blacklist, or -1 if no match was found.
 * 
 * @param {string} url - url to search
 * @param {boolean} [fuzzy] - whether to perform inexact matching.  Default=false
 * @param {boolean} [ignoreWhitelisting] - whether to ignore whitelisting.  Default=true
 * @return {number} index of matching entry in the blacklist, or -1 if no match was found
 */
export function searchBlacklist(url: string, fuzzy=false, ignoreWhitelisting=true): number {
    const list = getRawBlacklist();
    let foundIndex = -1;
    if (fuzzy) {
        foundIndex = list.findIndex(entry => url.includes(entry.url));
    } else {
        foundIndex = list.findIndex(entry => entry.url === url);
    }

    const foundEntry = list[foundIndex];
    if (!foundEntry) {
        return -1;
    }

    if (ignoreWhitelisting || Date.now() >= foundEntry.whitelistedUntil) {
        return foundIndex;
    } else {
        return -1;
    }
}

/**
 * Removes a url from the blacklist.  Does nothing and returns `false` if the url wasn't on the list.  Otherwise,
 * returns `true`.
 * 
 * @param {string} url - the url to remove from the site blacklist
 * @return {boolean} whether the url was removed
 */
export function removeSiteFromBlacklist(url: string): boolean {
    const indexToRemove = searchBlacklist(url)
    if (indexToRemove === -1) { // i.e. not on the blacklist
        return false;
    } else {
        const list = getRawBlacklist();
        list.splice(indexToRemove, 1);
        setBlacklist(list);
        return true;
    }
}

export function whitelistEntryUntil(index: number, until: number) {
    const list = getRawBlacklist();
    if (index < 0 || index >= list.length) {
        return false;
    }

    list[index].whitelistedUntil = until;
    setBlacklist(list);
    return true;
}

/**
 * Removes all items from the blacklist.
 */
export function clearBlacklist() {
    window.localStorage.removeItem(BLACKLIST_STORAGE_KEY);
}
