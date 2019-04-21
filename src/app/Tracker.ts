import { SiteLog } from "./SiteLog";

/**
 * Responsible for detecting focus change from tabs and windows.  Based on code from
 * https://github.com/navjagpal/browser-timetracker.
 * 
 * @author Silas Hsu
 */
export class Tracker {
    private static IDLE_CHECK_ALARM_NAME = "updateTime";
    private static IDLE_CHECK_PERIOD = 1; // In minutes

    private isIdle: boolean;
    private siteLog: SiteLog;

    constructor(siteLog: SiteLog) {
        this.isIdle = false;
        this.siteLog = siteLog;

        this.updateTimeWithCurrentTab = this.updateTimeWithCurrentTab.bind(this);
        this.handleTabActivated = this.handleTabActivated.bind(this);
        this.handleWindowFocusChanged = this.handleWindowFocusChanged.bind(this);
        this.doPeriodicIdleCheck = this.doPeriodicIdleCheck.bind(this);
    }

    startTracking() {
        chrome.tabs.onUpdated.addListener(this.updateTimeWithCurrentTab);
        chrome.tabs.onActivated.addListener(this.handleTabActivated);
        chrome.windows.onFocusChanged.addListener(this.handleWindowFocusChanged);
        chrome.alarms.create(Tracker.IDLE_CHECK_ALARM_NAME, {periodInMinutes: Tracker.IDLE_CHECK_PERIOD});
        chrome.alarms.onAlarm.addListener(this.doPeriodicIdleCheck);
    }

    updateTimeWithCurrentTab() {
        chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
            if (tabs.length == 1) {
                // Is the tab in the currently focused window? If not, assume Chrome is out of focus.  Although we ask
                // for the lastFocusedWindow, it's possible for that window to go out of focus quickly. If we don't do
                // this, we risk counting time towards a tab while the user is outside of
                // Chrome altogether.
                let url = tabs[0].url;
                chrome.windows.get(tabs[0].windowId, window => {
                    if (!window.focused) {
                        url = undefined;
                    }
                    this.siteLog.setCurrentFocus(url);
                });
            }
        });
    }

    handleTabActivated(activeInfo: chrome.tabs.TabActiveInfo) {
        chrome.tabs.get(activeInfo.tabId, tab => {
            this.siteLog.setCurrentFocus(tab.url);
        });
    }

    handleWindowFocusChanged(windowId: number) {
        if (windowId == chrome.windows.WINDOW_ID_NONE) {
            this.siteLog.setCurrentFocus(null);
            return;
        }
        this.updateTimeWithCurrentTab();
    }

    handleIdleStateChanged(idleState: string) {
        if (idleState == "active") {
            this.isIdle = false;
            this.updateTimeWithCurrentTab();
        } else {
            this.isIdle = true;
            this.siteLog.setCurrentFocus(null);
        }
    }

    doPeriodicIdleCheck(alarm: chrome.alarms.Alarm) {
        if (alarm.name === Tracker.IDLE_CHECK_ALARM_NAME) {
            // These event gets fired on a periodic basis and isn't triggered by a user event, like the tabs/windows
            // events. Because of that, we need to ensure the user is not idle or we'll track time for the current tab
            // forever.
            if (!this.isIdle) {
                this.updateTimeWithCurrentTab();
            }

            // Force a check of the idle state to ensure that we transition back from idle to active as soon as
            // possible.
            chrome.idle.queryState(60 * Tracker.IDLE_CHECK_PERIOD, idleState => {
                if (idleState == "active") {
                    this.isIdle = false;
                } else {
                    this.isIdle = true;
                    this.siteLog.setCurrentFocus(null);
                }
            });
        }
    }
}
