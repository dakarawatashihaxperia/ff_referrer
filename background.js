'use strict';

let config = {
    is_block: false
};
const handler = (e) => {
    let headers = [];
    for (let header of e.requestHeaders) {
        if (header.name.toLowerCase() !== 'referer') {
            headers.push(header);
        }
    }

    return {requestHeaders: headers};
};

initialize();

/**
 * Get current status and set browser icon.
 */
function initialize() {
    browser.storage.local.get().then((conf) => {
        config = conf;
        toggleReferrerListener();
        reloadIcon();
    });
}

/**
 * On Click, toggle Referrer Enable/Disable.
 */
browser.browserAction.onClicked.addListener(() => {
    config.is_block = !config.is_block;
    browser.storage.local.set(config);
    toggleReferrerListener();
    reloadIcon();
});

/**
 * EventListener toggle
 */
function toggleReferrerListener() {
    if (!config.is_block) {
        browser.webRequest.onBeforeSendHeaders.removeListener(handler);
    }
    else {
        browser.webRequest.onBeforeSendHeaders.addListener(
            handler,
            {urls: ['<all_urls>']},
            ['blocking', 'requestHeaders']
        );
    }
}

/**
 * Reload toolbar icon.
 */
function reloadIcon() {
    if (config.is_block) {
        browser.browserAction.setIcon({path: 'icons/icon_blocked.svg'});
    }
    else {
        browser.browserAction.setIcon({path: 'icons/icon.svg'});
    }
}