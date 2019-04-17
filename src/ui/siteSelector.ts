import { getBlacklist, addSiteToBlacklist, removeSiteFromBlacklist } from "../app/SiteBlacklist";

/**
 * Renders the site selector UI in a specified HTML element.
 * 
 * @param {HTMLElement} element - the element to append the site selector UI to
 */
export function renderSiteSelector(element: HTMLElement) {
    // read stuff from localStorage SITES_TO_TRACK
    // use the information to render a list of sites currently blocked
    // append another <input type="text">
    // etc
    
    addSiteToBlacklist("my site");
    const blacklistSites = getBlacklist();
    console.log(blacklistSites);
    // render BlackListSites
    

    //removeSiteFromBlacklist("my site")

    //element.innerText = 'test';
}
