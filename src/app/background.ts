import { Tracker } from "./Tracker";
import { SiteLog } from "./SiteLog";

const log = new SiteLog();
const tracker = new Tracker(log);
tracker.startTracking();
