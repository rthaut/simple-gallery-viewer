/* eslint-env browser, es6, jquery, webextensions */

import Gallery from './Gallery';
import Images from './Images';

jQuery(async function() {
    console.log('[Content] Initialized');

    // TODO: make a toggle setting that enables automatic building of galleries
    // TODO: additionally (at least when the toggle setting is false) add an entry to the popup to trigger building
    // TODO: should the images still be grabbed immediately? or should that wait until triggered?

    const configs = await browser.runtime.sendMessage({
        'action': 'get-enabled-configs'
    });

    console.log('[Content] Initialized :: Enabled Configs', configs);

    let images = [];
    configs.forEach((config) => {
        images = images.concat(Images.get(config));
    });

    console.log('[Content] Initialized :: Images', images);

    if (images !== undefined && images !== null && images.length) {
        Gallery.build(document.title);
        Gallery.addImages(images);
    }
});
