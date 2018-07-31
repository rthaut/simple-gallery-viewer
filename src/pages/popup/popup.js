/* eslint-env browser, jquery, webextensions */

/**
 * Explicitly set the height of the body element to match the supplied panel's computed height
 * @param {JQuery<HTMLElement>} panel the panel for which the body should be sized to match
 */
function setBodyHeightForPanel(panel) {
    let height = 0;
    panel.children().each(function () {
        height += $(this).outerHeight();
    });

    $('body').height(height);
}

// executed when the page is first shown/opened
$(function () {
    // size the window correctly (for the first panel) right away
    const panel = $('.panel:first-of-type');
    setBodyHeightForPanel(panel);
});

$('a[href^=\\#]').on('click', function (e) {
    // re-size the window whenever a new panel is shown
    // this is done by intercepting click events for anchor links and identifying their target panel
    const target = $(this).attr('href');
    const panel = $(target);
    setBodyHeightForPanel(panel);
});

$('a#create_config').on('click', function (e) {
    browser.windows.create({
        'type': 'popup',
        'url': browser.extension.getURL('/pages/create/create.html')
    });
});

$('a#edit_config').on('click', function (e) {
    const params = (new URL(document.location)).searchParams;
    const UUID = params.get('UUID');
    browser.windows.create({
        'type': 'popup',
        'url': browser.extension.getURL('/pages/create/create.html') + '?UUID=' + UUID
    });
});

(async () => {
    // get values for the toggle settings from synced storage and assign default values where applicable
    const settings = Object.assign(
        {},

        // these are the defaults
        {
            'ThumbnailsEnabled': true,
            'SlideshowLayoutEnabled': false,
            'PreloadEnabled': true
        },

        await browser.storage.sync.get([
            'ThumbnailsEnabled',
            'SlideshowLayoutEnabled',
            'PreloadEnabled'
        ])
    );

    console.log('Settings', settings);

    Object.keys(settings).map((s) => {
        const toggle = $(`input[type='checkbox'][name='${s}']`);

        if (toggle === undefined || toggle === null || toggle.length < 1) {
            console.error(`Failed to find toggle element for "${s}" setting`);
            return;
        }

        // set the toggle's initial state
        toggle.prop('checked', settings[s]);

        // bind a change handler to the toggle to update synced storage immediately
        toggle.on('change', function (e) {
            const value = $(this).prop('checked');

            console.log(`Changing "${s}" setting to`, value ? 'true' : 'false');

            const setting = {};
            setting[s] = value;
            browser.storage.sync.set(setting).catch((error) => {
                console.error(`Failed to save "${s}" setting`, error);
                // reset the toggle's state
                $(this).prop('checked', !value);
            });

        });

        // enable the toggle, now that we are ready for the user to interact with it
        toggle.prop('disabled', false);
    });
})();

(async () => {
    // get existing configurations
    const { 'Configurations': configurations } = await browser.storage.sync.get('Configurations');
    console.log('Configurations', configurations);

    if (configurations.length) {
        configurations.forEach((config) => {
            $('#config_list').append(`<div class="panel-list-item"><div class="text">${config.Name}</div><div class="button button-edit"></div><div class="button button-delete"></div><div class="button button-disable"></div></div>`);
        });
    }
})();
