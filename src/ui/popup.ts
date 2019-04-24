import * as $ from "jquery";

import { SiteLog } from "../app/SiteLog";
import { renderSiteSelector } from "./siteSelector";
import { renderPlanEditor } from "./planEditor";
import { renderProgressPane } from "./progressPane";
import { renderConfigScreen } from "./configScreen";

import "../styles/popup.css";

//renderConfigScreen(document.body);
/*
const blacklistButton = $("<button class='main-button'><p>Edit site blacklist</button>");

document.body.append();

document.body.innerHTML = "<strong>Edit your sites and set your plan<br>";

var editSitesButton = <HTMLButtonElement>document.createElement("button");
editSitesButton.textContent = "Edit site blacklist";
document.body.append(editSitesButton);
var editPlanButton = <HTMLButtonElement>document.createElement("button");
editPlanButton.textContent = "Edit plan";
document.body.append(editPlanButton);
var editConfigButton = <HTMLButtonElement>document.createElement("button");
editConfigButton.textContent = "Edit block times";
document.body.append(editConfigButton);

var child = document.createElement("div");
document.body.append(child);
renderSiteSelector(child);

editSitesButton.onclick = function() {
    renderSiteSelector(child);
}
editPlanButton.onclick = function() {
    renderPlanEditor(child);
}
editConfigButton.onclick = function() {
    renderConfigScreen(child);
}
*/