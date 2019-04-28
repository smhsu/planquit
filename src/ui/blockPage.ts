/**
 * Runs in blocked.html, the page that displays when we have blocked a website.
 */
import * as $ from 'jquery';
import * as parseUrl from 'url-parse';
import { getPlan } from '../app/QuitPlan';
import { whitelistEntryUntil, searchBlacklist } from '../app/siteBlacklist';
import { logBlockIgnored, logBlockEffective } from '../app/blockEffectiveness';

const TIME_UNTIL_SKIP_ALLOWED = 10; // Seconds
const WHITELIST_TIME = 60 * 10 // Seconds
const MIN_SKIP_REASON_LENGTH = 3;

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
const whyReasons = plan.whyReason.trim() ? plan.whyReason.trim().split("\n") : [];
const badEffects = plan.badEffects.trim() ? plan.badEffects.trim().split("\n") : [];
const reasons = whyReasons.concat(badEffects);
$(".stop-reason").text(getRandomElement(reasons) || "(no plan set)");

// Fill in the resist advice
const advices = plan.resistUrgePlan.trim().split("\n");
$(".resist-advice").text(getRandomElement(advices) || "(no plan set)");

// Bind event listener to reason textarea
$("#ignore-reason").on("input", handleReasonChanged);

// Set up the ignore block button, and timer
let timeUntilSkipAllowed = TIME_UNTIL_SKIP_ALLOWED;
$("#ignore-button").text(`May continue in ${timeUntilSkipAllowed}`);
const timerId = window.setInterval(subtractSkipTimer, 1000);

/**
 * Runs every second, tracking the amount of time left until ignoring the block is allowed.
 */
function subtractSkipTimer() {
    timeUntilSkipAllowed -= 1;
    if (timeUntilSkipAllowed > 0) {
        $("#ignore-button").text(`May continue in ${timeUntilSkipAllowed}`);
    } else {
        window.clearInterval(timerId);
        $("#ignore-button").click(dismissBlock);
        handleReasonChanged();
    }
}

/**
 * Runs when the ignore reason text box changes.  Disables/reenables the ignore button according to the length of the
 * reason.
 */
function handleReasonChanged() {
    if (timeUntilSkipAllowed <= 0) {
        const reason = (document.getElementById("ignore-reason") as HTMLTextAreaElement).value;
        if (reason.length <= MIN_SKIP_REASON_LENGTH) {
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

/**
 * Dismisses the block screen.
 */
function dismissBlock() {
    const blockedIndex = searchBlacklist(blockedHostPlusPath, true, true);
    if (blockedIndex !== -1) {
        whitelistEntryUntil(blockedIndex, Date.now() + WHITELIST_TIME * 1000);
        const reason = (document.getElementById("ignore-reason") as HTMLTextAreaElement).value;
        logBlockIgnored(blockedHostPlusPath, reason);
    }
    blockIgnored = true;
    window.location.replace(blockedUrl);
}

/**
 * If the reason closes the tab, count it as a block success.
 */
window.addEventListener("beforeunload", () => {
    if (!blockIgnored) {
        logBlockEffective(blockedHostPlusPath);
    }
});
