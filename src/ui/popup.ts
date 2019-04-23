import "../styles/popup.css";
import { SiteLog } from "../app/SiteLog";
import { renderSiteSelector } from "./siteSelector";
import { renderPlanEditor } from "./planEditor";
import { renderProgressPane } from "./progressPane";
import { renderConfigScreen } from "./configScreen";

const log = new SiteLog();

document.body.innerHTML = "<strong>Edit your sites and set your plan<br>";

var editSitesButton = <HTMLButtonElement>document.createElement("button");
editSitesButton.textContent = "Edit Sites";
document.body.append(editSitesButton);
var editPlanButton = <HTMLButtonElement>document.createElement("button");
editPlanButton.textContent = "Edit Plan";
document.body.append(editPlanButton);
var editConfigButton = <HTMLButtonElement>document.createElement("button");
editConfigButton.textContent = "Edit Config";
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
