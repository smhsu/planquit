import { Tracker } from "./Tracker";
import { SiteLog } from "./SiteLog";
import { getPlan } from "./QuitPlan";
import { Blocker } from "./Blocker";

const blocker = new Blocker();
blocker.startBlocking();

const log = new SiteLog();
const tracker = new Tracker(log);
tracker.startTracking();
