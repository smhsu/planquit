import { Tracker } from "./Tracker";
import { SiteLog } from "./SiteLog";
import { AppMessageType } from "./messages";
import { getBlacklist } from "./siteBlacklist";
import { getPlan } from "./QuitPlan";

const log = new SiteLog();
const tracker = new Tracker(log);
tracker.startTracking();

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.type) {
        case AppMessageType.getBlacklist:
            sendResponse(getBlacklist());
        case AppMessageType.getPlan:
            sendResponse(getPlan());
        case AppMessageType.logBlockSuccess:
        case AppMessageType.logBlockIgnored:
        default:
            ; // Do nothing
    }
});
