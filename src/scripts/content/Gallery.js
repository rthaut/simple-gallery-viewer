/* eslint-env browser, es6, jquery, webextensions */

const Gallery = (() => {

    const ID = 'SimpleGalleryViewer';   // @TODO: use `browser.runtime.id` instead? but then the CSS needs that same ID...

    const DEFAULT_THEME = 'Dark';

    const Gallery = {

        /**
         * Generates and inserts the core DOM structure for a gallery
         * @param {string} title The title of the gallery
         * @param {string} [description] The description of the gallery
         */
        'build': async function (title, description = null) {
            console.log('[Content] Gallery.build()', title, description);

            let base = jQuery(`#${ID}`);

            if (base !== undefined && base !== null && base.length) {
                console.warn('[Content] Gallery.build() :: Container already exists', base);
                base.remove();
            }

            base = jQuery(`
                <div id="${ID}">
                    <button type="button" class="close" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <div id="${ID}Container">
                        <div id="${ID}Header">
                            <h1>${title || ''}</h1>
                            ${description ? '<p>' + description + '</p>' : ''}
                        </div>
                        <div id="${ID}Images"></div>
                        <div id="${ID}Footer"></div>
                    </div>
                </div>
            `).appendTo('body');

            const container = base.find(`#${ID}Container`).first();

            base.find('button.close').on('click', function (event) {
                jQuery(`#${ID}`).remove();
            });

            // apply the theme and settings asynchronously after the main structure is built
            browser.storage.sync.get([
                'Theme',
                'StickyFooter',
                'ThumbnailsEnabled',
                'SlideshowLayoutEnabled',
                'PreloadEnabled',
            ]).then((data) => {
                const theme = data.Theme || DEFAULT_THEME;
                base.removeClass().addClass(`theme--${theme.toLowerCase()}`);
                container.toggleClass('sticky-footer', data.StickyFooter);
                container.toggleClass('show-thumbnails', data.ThumbnailsEnabled);
                container.toggleClass('slideshow-layout', data.SlideshowLayoutEnabled);
                container.toggleClass('preload-images', data.PreloadEnabled);
            });

        },

        /**
         * Inserts images into the gallery
         * @param {string[]} images The paths of the images
         */
        'addImages': function(images) {
            console.log('[Content] Gallery.addImages()', images);

            if (images !== undefined && images !== null && images.length) {
                for (let i = 0; i < images.length; i++) {
                    const img = jQuery(`#${ID}Images img[src="${images[i]}"]`);

                    if (img !== undefined && img !== null && img.length) {
                        console.warn('[Content] Gallery.addImages() :: Image already exists', img.first());
                        continue;
                    }

                    jQuery(`<p><a href="${images[i]}"><img src="${images[i]}"/></a></p>`).appendTo(`#${ID}Images`);
                }
            }
        }

    };

    return Gallery;

})();

export default Gallery;
