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
    
    // addSiteToBlacklist("my site");
    element.innerText = "Edit the sites you want to track\n\n";
    var blacklistSites = getBlacklist();
    let it : number = 0;
    
    for (let site of blacklistSites) {

        var button = <HTMLButtonElement>document.createElement('button');
        button.textContent = "Remove";
        var siteString = <HTMLElement>document.createElement("site" + it);
        siteString.innerText = " " + site + "\n\n";

        button.onclick = function () {
            removeSiteFromBlacklist(site);
            //element.innerText = "";
            renderSiteSelector(element);
            return;
        }

        element.appendChild(button);
        element.appendChild(siteString);

        it = it + 1;
    }

    var inputString = <HTMLInputElement>document.createElement("input");
    var button = <HTMLButtonElement>document.createElement("button");
    button.textContent = "Add Site";
    button.onclick = function() {
        addSiteToBlacklist(inputString.value);
        renderSiteSelector(element);
    }

    element.appendChild(button);
    element.appendChild(inputString);


    // render BlackListSites
    

    //removeSiteFromBlacklist("my site")

    //element.innerText = 'test';
}
