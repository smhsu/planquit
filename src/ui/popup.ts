import "../styles/popup.css";
import { SiteLog } from "../app/SiteLog";
import { renderSiteSelector } from "./siteSelector";
import { renderPlanEditor } from "./planEditor";
import { renderProgressPane } from "./progressPane";

const log = new SiteLog();

//console.log(log.getData());
//renderSiteSelector(document.body);
//renderPlanEditor(document.body);
renderProgressPane(document.body);
