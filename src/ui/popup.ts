import "../styles/popup.css";
import { SiteLog } from "../app/SiteLog";
import { renderSiteSelector} from "./siteSelector";

const log = new SiteLog();
console.log(log.getData());

renderSiteSelector(document.body);