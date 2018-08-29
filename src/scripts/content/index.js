import Gallery from './Gallery';
import Images from './Images';

jQuery(function() {
    console.log('[Content] Initialized');

    Gallery.build(document.title);

    // TODO: make a toggle setting that enables automatic building of galleries
    // TODO: additionally (at least when the toggle setting is false) add an entry to the popup to trigger building
    // TODO: should the images still be grabbed immediately? or should that wait until triggered?

    init();
});

const init = async function() {
    console.log('[Content] init()');

    const configs = await browser.runtime.sendMessage({
        'action': 'get-enabled-configs'
    });

    console.log('[Content] init() :: Enabled Configs', configs);

    let images = [];
    configs.forEach((config) => {
        images = images.concat(Images.get(config));

        if (config.Watch) {
            watch(config);
        }
    });

    if (images.length) {
        Gallery.addImages(images);
    }

    // filter out images that have already been loaded
    images = images.filter((image) => !Gallery.images.includes(image));

    if (images.length) {
        Gallery.addImages(images);
    }
};

const watch = function(config) {
    console.log('[Content] watch()', config);

    const observer = new MutationObserver((mutations) => {
        let images = [];
        mutations.forEach((mutation) => {
            if (mutation.addedNodes !== null) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === 1) {
                        if (node.id === undefined || node.id === null || !node.id.includes(Gallery.ID)) {
                            console.log('[Content] watch() :: Getting Images for Node', node);
                            images = images.concat(Images.get(config, node));
                        }
                    }
                }
            }
        });

        // filter out images that have already been loaded
        images = images.filter((image) => !Gallery.images.includes(image));

        if (images.length) {
            Gallery.addImages(images);
        }
    });

    observer.observe(document.body, { 'childList': true, 'subtree': true });
};
