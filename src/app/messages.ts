/**
 * Messages types from the content script to the background script.
 */
export enum AppMessageType {
    getBlacklist,
    getPlan,
    logBlockSuccess,
    logBlockIgnored
}

/**
 * Sends a message to the extension.  Returns a promise for the data in the reply.
 * 
 * @param {AppMessageType} type - type of message to send
 * @param {object} args - other data to include in the message
 * @return {Promise<any>} promise for the data in the reply
 */
export function sendAppMessage(type: AppMessageType, args?: object): Promise<any> {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({type: type, ...args}, resolve);
    });
}
