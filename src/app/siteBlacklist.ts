const BLACKLIST_STORAGE_KEY = "SITE_BLACKLIST";

export function getBlacklist(): string[] {
    const data = window.localStorage.getItem(BLACKLIST_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}

function setBlacklist(blacklist: string[]) {
    window.localStorage.setItem(BLACKLIST_STORAGE_KEY, JSON.stringify(blacklist));
}

export function addSiteToBlacklist(domain: string) {
    const list = getBlacklist();
    list.push(domain);
    setBlacklist(list);
}

export function removeSiteFromBlacklist(domain: string) {
    const list = getBlacklist();
    const indexToRemove = list.findIndex(listItem => listItem === domain);
    if (indexToRemove !== -1) {
        list.splice(indexToRemove, 1);
        setBlacklist(list);
    }
}
