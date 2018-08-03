/* eslint-env es6, webextensions */

import Configs from './Configs';

browser.runtime.onMessage.addListener((message, sender) => {
    console.log('[Background] browser.runtime.onMessage', message, sender);

    switch (message.action) {
        case 'close-config-editor':
            if (message.data !== undefined && message.data.windowID !== undefined) {
                return browser.windows.remove(message.data.windowID);
            } else {
                return browser.tabs.query({
                    'url': browser.extension.getURL('/pages/edit/edit.html') + '*'
                }).then((tabs) => {
                    return Promise.all(tabs.map((tab) => browser.windows.remove(tab.windowId)));
                });
            }

        case 'open-config-editor':
            // eslint-disable-next-line no-case-declarations
            let url = browser.extension.getURL('/pages/edit/edit.html');
            if (message.data !== undefined && message.data.configUUID !== undefined) {
                url += '?UUID=' + message.data.configUUID;
            }

            return browser.windows.create({
                'width': 600,
                'height': 800,
                'type': 'popup',
                'url': url
            });

        case 'save-config':
            return Configs.save(message.data.config);

        case 'delete-config':
            return Configs.remove(message.data.configUUID);

        case 'toggle-config':
            return Configs.toggle(message.data.configUUID);
    }
});