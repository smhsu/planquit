const BLACKLIST_STORAGE_KEY = "SITE_BLACKLIST";

/**
 * @return {string[]} the current site blacklist
 */
export function getBlacklist(): string[] {
    const data = window.localStorage.getItem(BLACKLIST_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}

function setBlacklist(blacklist: string[]) {
    window.localStorage.setItem(BLACKLIST_STORAGE_KEY, JSON.stringify(blacklist));
}

/**
 * Adds a domain to the blacklist.  Does nothing and returns `false` if the domain already exists.  Otherwise, returns
 * `true`.
 * 
 * @param {string} domain - the domain to add to the site blacklist
 * @return {boolean} whether the domain was added
 */
export function addSiteToBlacklist(domain: string): boolean {
    const list = getBlacklist();
    const isNotOnList = list.indexOf(domain) === -1;
    if (isNotOnList) {
        list.push(domain);
        setBlacklist(list);
        return true;
    } else {
        return false;
    }
}

/**
 * Removes a domain from the blacklist.  Does nothing and returns `false` if the domain doesn't exist.  Otherwise,
 * returns `true`.
 * 
 * @param {string} domain - the domain to remove from the site blacklist
 * @return {boolean} whether the domain was removed
 */
export function removeSiteFromBlacklist(domain: string): boolean {
    const list = getBlacklist();
    const indexToRemove = list.indexOf(domain);
    if (indexToRemove !== -1) {
        list.splice(indexToRemove, 1);
        setBlacklist(list);
        return true;
    } else {
        return false;
    }
}
