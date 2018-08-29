const Gallery = (() => {

    const DEFAULT_THEME = 'Dark';

    const Gallery = {

        'ID': 'SimpleGalleryViewer',    // @TODO: use `browser.runtime.id` instead? but then the CSS needs that same ID...

        'isBuilt': false,

        'isVisible': false,

        'images': [],

        /**
         * Generates and inserts the core DOM structure for a gallery
         * @param {string} title The title of the gallery
         * @param {string} [description] The description of the gallery
         * @returns {jQuery<HTMLElement>} The root gallery DOM element
         */
        'build': async function (title, description = null) {
            console.log('[Content] Gallery.build()', title, description);

            let base = jQuery(`#${this.ID}`);
            if (base !== undefined && base !== null && base.length) {
                console.warn('[Content] Gallery.build() :: Base Element Already Exists', base);
                base.remove();
            }

            base = jQuery(`
                <div id="${this.ID}">
                    <div id="${this.ID}Container">
                        <div id="${this.ID}Header">
                            <h1>${title || ''}</h1>
                            ${description ? '<p>' + description + '</p>' : ''}
                        </div>
                        <div id="${this.ID}Images"></div>
                        <div id="${this.ID}Footer"></div>
                    </div>
                </div>
            `).hide().appendTo('body');

            const container = base.find(`#${this.ID}Container`).first();

            let toggle = jQuery(`#${this.ID}Toggle`);
            if (toggle !== undefined && toggle !== null && toggle.length) {
                console.warn('[Content] Gallery.build() :: Toggle Button Already Exists', toggle);
                toggle.remove();
            }

            toggle = jQuery(`<button type="button" id="${this.ID}Toggle" data-toggle="open"><span></span></button>`).appendTo('body');
            toggle.on('click', jQuery.proxy(function (event) {
                this.toggle(event);
            }, this));

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

            this.isBuilt = true;

            return base;
        },

        'toggle': function (event) {
            console.log('[Content] Gallery.toggle()', event);

            const toggle = jQuery(event.target);

            if (this.isVisible) {
                this.hide();
                toggle.attr('data-toggle', 'open');
            } else {
                this.show();
                toggle.attr('data-toggle', 'close');
            }
        },

        /**
         * Shows the root gallery DOM element
         */
        'show': function () {
            console.log('[Content] Gallery.show()');

            if (!this.isBuilt) {
                this.build();
            }

            let base = jQuery(`#${this.ID}`);
            if (base === undefined || base === null || !base.length) {
                console.warn('[Content] Gallery.show() :: Base Element is Missing');
                base = this.build();
            }

            base.show();

            this.isVisible = true;
        },

        /**
         * Hides the root gallery DOM element
         */
        'hide': function () {
            console.log('[Content] Gallery.hide()');

            const base = jQuery(`#${this.ID}`);
            if (base !== undefined && base !== null && base.length) {
                base.hide();
            }

            this.isVisible = false;
        },

        /**
         * Inserts images into the gallery
         * @param {string[]} images The paths of the images
         */
        'addImages': function(images) {
            console.log('[Content] Gallery.addImages()', images);

            if (!this.isBuilt) {
                this.build();
            }

            const container = jQuery(`#${this.ID}Images`);

            if (images !== undefined && images !== null && images.length) {
                for (const image of images) {
                    const img = jQuery(`#${this.ID}Images img[src="${image}"]`);

                    if (img !== undefined && img !== null && img.length) {
                        console.warn('[Content] Gallery.addImages() :: Image Already Exists', img.first());
                        continue;
                    }

                    jQuery(`<p id="#${this.ID}Image` + String('00000' + parseInt(container.find('img').length + 1)).slice(-5) + `"><a href="${image}"><img src="${image}"/></a></p>`).appendTo(`#${this.ID}Images`);

                    this.images.push(image);
                }
            }
        }

    };

    return Gallery;

})();

export default Gallery;
