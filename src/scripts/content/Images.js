/* eslint-env browser, es6, webextensions */

const Images = (() => {

    const Images = {

        'get': function (config) {
            console.log('[Content] Images.get()', config);

            if (config.Enabled) {

                if (!config.ApplyToAllURLs) {
                    // TODO: ensure the current URL matches one of the patterns in `config.URLs`
                }

                const nodes = document.querySelectorAll(config.ImageSelector);
                console.log('[Content] Images.get() :: Nodes', nodes);

                let images = [];

                nodes.forEach(node => {
                    if (node.hasAttribute('src')) {
                        images.push(node.getAttribute('src'));
                    }
                });

                if (config.TransformImageURLs) {
                    for (const transformation of config.Transformations) {
                        console.log('[Content] Images.get() :: Applying Transformation', transformation);
                        const search = transformation.SearchRegExp ? new RegExp(transformation.Search) : transformation.Search;
                        images = images.map(image => image.replace(search, transformation.Replacement));
                    }
                }

                console.log('[Content] Images.get() :: Return', images);
                return images;
            }
        }

    };

    return Images;

})();

export default Images;
