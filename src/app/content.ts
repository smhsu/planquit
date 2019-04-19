import * as domainParser from 'psl';
import { sendAppMessage, AppMessageType } from "./messages";

async function checkIsOnBlacklist(url) {
    const blacklist = await sendAppMessage(AppMessageType.getBlacklist) as string[];
    const currentDomain = domainParser.get(url);
    console.log(`Blacklist is ${blacklist.join(", ")}`)
    console.log(`Checking domain ${currentDomain} against blacklist...`);
    return blacklist.some(blacklisted => domainParser.get(blacklisted) === currentDomain);
}

async function runBlockCheck() {
    const shouldBlock = await checkIsOnBlacklist(window.location.hostname);
    if (shouldBlock) {
        console.log("Current domain is on the blacklist!");
        window.location.replace(
            chrome.runtime.getURL("blocked.html") + "?domain=" + encodeURIComponent(window.location.hostname)
        );
    } else {
        console.log("Current domain is NOT on the blacklist.");
    }
}

console.log("Running PlanQuit check...")
runBlockCheck();
