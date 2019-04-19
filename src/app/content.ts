import * as domainParser from 'psl';
import { sendAppMessage, AppMessageType } from "./messages";

async function checkIsOnBlacklist() {
    const blacklist = await sendAppMessage(AppMessageType.getBlacklist) as string[];
    return blacklist.some(blacklisted => domainParser.get(blacklisted) === window.location.hostname);
}

async function runBlockCheck() {
    const shouldBlock = await checkIsOnBlacklist();
    if (shouldBlock) {
        window.stop();
    }
}

runBlockCheck();
