/**
 * Runs in blocked.html, the page that displays when we have blocked a website.
 */
import * as $ from 'jquery';

const blockedUrlEncoded = window.location.href.split("?domain=")[1];
const blockedUrl = decodeURIComponent(blockedUrlEncoded);
$("#blocked-site").text(blockedUrl);
