import "../styles/popup.css";
import { SiteLog } from "../app/SiteLog";
import { renderSiteSelector } from "./siteSelector";
import { renderPlanEditor } from "./planEditor";

const log = new SiteLog();
console.log(log.getData());

document.body.innerHTML = "<strong>Edit your sites and set your plan<br>";

var editSitesButton = <HTMLButtonElement>document.createElement("button");
editSitesButton.textContent = "Edit Sites";
document.body.append(editSitesButton);
var editPlanButton = <HTMLButtonElement>document.createElement("button");
editPlanButton.textContent = "Edit Plan";
document.body.append(editPlanButton);

var child = document.createElement("div");
document.body.append(child);
renderSiteSelector(child);

editSitesButton.onclick = function() {
    renderSiteSelector(child);
}
editPlanButton.onclick = function() {
    renderPlanEditor(child);
}

//renderSiteSelector(document.body);
//renderPlanEditor(document.body);