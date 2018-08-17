/* eslint-env browser, es6, jquery, webextensions */

import Gallery from './Gallery';
import Images from './Images';

jQuery(async function() {
    console.log('[Content] Initialized');

    const configs = await browser.runtime.sendMessage({
        'action': 'get-enabled-configs'
    });

    console.log('[Content] Initialized :: Enabled Configs', configs);

    let images = [];
    configs.forEach((config) => {
        images = images.concat(Images.get(config));
    });

    console.log('[Content] Initialized :: Images', images);

    /*
    if (images !== undefined && images !== null && images.length) {
        let galleryURL = browser.extension.getURL('/pages/gallery/gallery.html');
        galleryURL += '?title=' + encodeURIComponent(document.title);
        galleryURL += '&images=' + encodeURIComponent(images);
        window.location = galleryURL;
    }
    */
    if (images !== undefined && images !== null && images.length) {
        Gallery.build(document.title);
        Gallery.addImages(images);
    }
});
