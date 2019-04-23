/**
 * Runs in blocked.html, the page that displays when we have blocked a website.
 */
import * as $ from 'jquery';
import * as parseUrl from 'url-parse';
import { getPlan } from '../app/QuitPlan';
import { whitelistEntryUntil, searchBlacklist } from '../app/siteBlacklist';
import { logBlockIgnored, logBlockEffective } from '../app/blockEffectiveness';

const TIME_UNTIL_SKIP_ALLOWED = 5; // Seconds
const WHITELIST_TIME = 60 * 10 // Seconds

/**
 * @param {T[]} list - list from which to get a random item
 * @return {T} a random item from the list
 */
function getRandomElement<T>(list: T[]): T {
    const randomIndex = Math.floor(Math.random() * list.length);
    return list[randomIndex];
}

// Fill in the site that was blocked
const blockedUrlEncoded = window.location.href.split("?domain=")[1];
const blockedUrl = decodeURIComponent(blockedUrlEncoded);
const parsedBlockedUrl = parseUrl(blockedUrl);
const blockedHostPlusPath = parsedBlockedUrl.hostname + parsedBlockedUrl.pathname;
let blockIgnored = false;
$("#blocked-site").text(blockedHostPlusPath);

// Fill in the block reason
const plan = getPlan();
const whyReasons = plan.whyReason.trim().split("\n");
const badEffects = plan.badEffects.trim().split("\n");
const reasons = whyReasons.concat(badEffects);
$(".stop-reason").text(getRandomElement(reasons));

// Fill in the resist advice
const advices = plan.resistUrgePlan.trim().split("\n");
$(".resist-advice").text(getRandomElement(advices));

// Bind event listener to reason textarea
$("#ignore-reason").on("input", handleReasonChanged);

let timeUntilSkipAllowed = TIME_UNTIL_SKIP_ALLOWED;
function subtractSkipTimer() {
    timeUntilSkipAllowed -= 1;
    if (timeUntilSkipAllowed > 0) {
        $("#ignore-button").text(`May continue in ${timeUntilSkipAllowed}`);
    } else {
        window.clearInterval(timerId);
        $("#ignore-button").click(ignoreBlock);
        handleReasonChanged();
    }
}

$("#ignore-button").text(`May continue in ${timeUntilSkipAllowed}`);
const timerId = window.setInterval(subtractSkipTimer, 1000);

function handleReasonChanged() {
    if ( timeUntilSkipAllowed <= 0 ) {
        const reason = (document.getElementById("ignore-reason") as HTMLTextAreaElement).value;
        if (reason.length <= 3) {
            $("#ignore-button")
                .prop("disabled", true)
                .text("Enter a reason");
        } else {
            const whitelistTimeMinutes = Math.round(WHITELIST_TIME / 60);
            $("#ignore-button")
                .prop("disabled", false)
                .text(`Allow visits for ${whitelistTimeMinutes} minutes`);
        }
    }
}

function ignoreBlock() {
    const blockedIndex = searchBlacklist(blockedHostPlusPath, true, true);
    if (blockedIndex !== -1) {
        whitelistEntryUntil(blockedIndex, Date.now() + WHITELIST_TIME * 1000);
        const reason = (document.getElementById("ignore-reason") as HTMLTextAreaElement).value;
        logBlockIgnored(blockedHostPlusPath, reason);
    }
    blockIgnored = true;
    window.location.replace(blockedUrl);
}

window.addEventListener("beforeunload", () => {
    if (!blockIgnored) {
        logBlockEffective(blockedHostPlusPath);
    }
});
