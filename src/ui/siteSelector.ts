import * as $ from "jquery";
import { getBlacklist, addSiteToBlacklist, removeSiteFromBlacklist } from "../app/siteBlacklist";

/**
 * Renders the site selector UI in a specified HTML element.
 * 
 * @param {HTMLElement} element - the element to append the site selector UI to
 */
export function renderSiteSelector(element: HTMLElement | null) {
    if (!element) {
        return;
    }

    const jqueryEle = $(element);
    jqueryEle.children().remove();

    const blacklistSites = getBlacklist();
    for (let site of blacklistSites) {
        const item = $("<div class='blacklist-row'></div>");
        item.text(site + " ");

        const removeButton = $("<i class='fas fa-times-circle'></i>");
        removeButton.click(() => {
            removeSiteFromBlacklist(site);
            renderSiteSelector(element);
        });
        item.append(removeButton);

        jqueryEle.append(item);
    }
}

renderSiteSelector(document.getElementById("blacklist"));

function handleAddSitePressed() {
    const input = $("#site-input");
    const siteToAdd = input.val() as string;
    if (!siteToAdd) {
        return;
    }
    addSiteToBlacklist(siteToAdd);
    input.val("");
    renderSiteSelector(document.getElementById("blacklist"));
}

// Disable the button if no input
$("#site-input").on("input", event => {
    if ((event.target as HTMLInputElement).value.length > 0) {
        $("#add-site-button").prop("disabled", false);
    } else {
        $("#add-site-button").prop("disabled", true);
    }
});

$("#site-input").keyup(event => {
    if (event.keyCode === 13) { // Enter
        handleAddSitePressed();
    }
});

// Callback for the add button
$("#add-site-button").click(handleAddSitePressed);
