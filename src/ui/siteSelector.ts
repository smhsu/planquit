import { getBlacklist, addSiteToBlacklist, removeSiteFromBlacklist } from "../app/siteBlacklist";

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
    element.innerHTML = "<br><strong>Enter the sites you want to visit less. </strong><br><br> We will track your usage for these sites. <br><br>";
    var blacklistSites = getBlacklist();
    
    for (let site of blacklistSites) {

        var button = <HTMLButtonElement>document.createElement('button');
        button.textContent = "Remove";
        var siteString = <HTMLElement>document.createElement("text");
        siteString.innerText = " " + site + "\n\n";

        button.onclick = function () {
            removeSiteFromBlacklist(site);
            renderSiteSelector(element);
            //return;
        }

        element.appendChild(button);
        element.appendChild(siteString);
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
