/* eslint-env browser, es6, webextensions */

const Images = (() => {

    const Images = {

        'get': function (config, root = document.body) {
            console.log('[Content] Images.get()', config, root);

            let images = [];

            if (config.Enabled) {

                if (!config.ApplyToAllURLs) {
                    // TODO: ensure the current URL matches one of the patterns in `config.URLs`
                }

                config.ImageSelectors.forEach((selector) => {
                    console.log('[Content] Images.get() :: Selector', selector);

                    selector.Images = [];

                    const nodes = root.querySelectorAll(selector.Selector);
                    console.log('[Content] Images.get() :: Selector : Nodes', nodes);

                    nodes.forEach(node => {
                        console.log(node.tagName);
                        switch (node.tagName) {
                            case 'IMG':
                                if (node.hasAttribute('src')) {
                                    selector.Images.push(node.getAttribute('src'));
                                }
                                break;
                        }
                    });

                    if (selector.Images.length) {

                        if (selector.Transform) {
                            console.log('[Content] Images.get() :: Selector : Images (Before Transformations)', selector.Images);

                            for (const transformation of selector.Transformations) {
                                console.log('[Content] Images.get() :: Applying Transformation', transformation);

                                const search = transformation.SearchRegExp ? new RegExp(transformation.Search) : transformation.Search;
                                const replacement = transformation.Replacement || '';

                                console.log('[Content] Images.get() :: Applying Transformation : Search', search);
                                console.log('[Content] Images.get() :: Applying Transformation : Replacement', replacement);

                                selector.Images = selector.Images.map(image => image.replace(search, replacement));
                            }
                        }

                        console.log('[Content] Images.get() :: Selector : Images', selector.Images);
                        images = images.concat(selector.Images);

                    }

                });

            }

            console.log('[Content] Images.get() :: Return', images);
            return images;
        }

    };

    return Images;

})();

export default Images;
