/* eslint-env browser, es6, jquery, webextensions */

const Gallery = (() => {

    const ID = 'SimpleGalleryViewer';   // browser.runtime.id;

    const Gallery = {

        'build': function (title, description) {
            console.log('[Content] Gallery.build()', title, description);

            let container = jQuery(`#${ID}`);

            if (container !== undefined && container !== null && container.length) {
                console.warning('[Content] Gallery.build() :: Container already exists', container);
                container.remove();
            }

            container = jQuery(`
                <div id="${ID}" class="collapse in" aria-expanded="true">
                    <button type="button" class="close" aria-label="Close" onclick="javascript:jQuery('#${ID}').remove();"><span aria-hidden="true">&times;</span></button>
                    <div class="container-fluid">
                        <div class="page-header text-center">
                            <h1>${title || ''}</h1>
                            ${description ? '<pclass="lead">' + description + '</p>' : ''}
                        </div>
                        <div class="row">
                            <div class="col-xs-12">
                                <div id="${ID}Images" class="text-center"></div>
                            </div>
                        </div>
                    </div>
                </div>
                `).appendTo('body');
            console.log('[Content] Gallery.build() :: Container', container);
        },

        'addImages': function(images) {
            console.log('[Content] Gallery.addImages()', images);

            if (images !== undefined && images !== null && images.length) {
                for (let i = 0; i < images.length; i++) {
                    const img = jQuery(`#${ID}Images img[src="${images[i]}"]`);

                    if (img !== undefined && img !== null && img.length) {
                        console.warning('[Content] Gallery.addImages() :: Image already exists');
                        continue;
                    }

                    jQuery(`<p><a href="${images[i]}"><img src="${images[i]}" class="img-responsive img-thumbnail"/></a></p>`).appendTo(`#${ID}Images`);
                }
            }
        }

    };

    return Gallery;

})();

export default Gallery;
