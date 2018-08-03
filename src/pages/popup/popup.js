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
    browser.runtime.sendMessage({
        'action': 'open-config-editor'
    });
});

function showConfigActionConfirmBar(configUUID, style, text, confirm) {
    const item = $(`.panel-list-item[data-config-uuid='${configUUID}']`).first();

    if (item !== undefined && item !== null) {
        let overlay = $(item).children('.overlay').first();

        if (overlay === undefined || overlay === null || !overlay.length) {
            overlay = $('<div class="overlay"></div>').appendTo(item);
        }

        overlay.addClass(style);

        overlay.append(`<div class="text">${text}</div>`);
        overlay.append('<div class="button-bar"><a class="button" data-confirm="yes">Yes</a><a class="button" data-confirm="no">No</a></div>');

        overlay.find('a[data-confirm]').on('click', async function (e) {
            const confirmation = $(this).data('confirm').toLowerCase();
            switch (confirmation) {
                case 'yes':
                    await confirm();
                    break;

                case 'no':
                    break;
            }

            overlay.removeClass('visible');
            setTimeout(function () {
                overlay.remove();
            }, 200);
        });

        // this causes the "open" transition to work; without it, the overlay just appears instantly...
        setTimeout(function () {
            overlay.addClass('visible');
        }, 0);
    }
}

async function deleteConfig(configUUID) {
    await browser.runtime.sendMessage({
        'action': 'delete-config',
        'data': {
            'configUUID': configUUID
        }
    });

    const item = $(`.panel-list-item[data-config-uuid='${configUUID}']`).first();

    item.remove();
}

async function toggleConfig(configUUID) {
    const config = await browser.runtime.sendMessage({
        'action': 'toggle-config',
        'data': {
            'configUUID': configUUID
        }
    });

    const item = $(`.panel-list-item[data-config-uuid='${configUUID}']`).first();
    const enabled = (config.Enabled === true);

    item.toggleClass('text-muted', !enabled);
    item.find('a[data-action="toggle"]').toggleClass('button-disable', enabled).toggleClass('button-enable', !enabled);
}

(async () => {
    // get values for the toggle settings from synced storage and assign default values where applicable
    const settings = Object.assign({},

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
    const {
        'Configurations': configs
    } = await browser.storage.sync.get('Configurations');

    if (configs !== undefined && configs !== null && configs.length) {
        configs.forEach((config) => {
            const enabled = config.Enabled !== false;
            $('#config_list').append(`<div class="panel-list-item ${enabled ? '' : 'text-muted'}" data-config-uuid="${config.UUID}"><div class="text">${config.Name}</div><div class="button-bar"><a class="button button-icon button-edit" data-action="edit"></a><a class="button button-icon button-delete" data-action="delete"></a><a class="button button-icon button-toggle ${enabled ? 'button-disable' : 'button-enable'}" data-action="toggle"></a></div></div>`);
        });

        // handle clicks on the buttons for individual configs
        $('.panel-list-item[data-config-uuid] a.button[data-action]').on('click', function (e) {
            const action = $(this).data('action').toLowerCase();
            const configUUID = $(this).parents('[data-config-uuid]').data('config-uuid');
            switch (action) {
                case 'edit':
                    browser.runtime.sendMessage({
                        'action': 'open-config-editor',
                        'data': {
                            'configUUID': configUUID
                        }
                    });
                    break;

                case 'delete':
                    showConfigActionConfirmBar(configUUID, 'bg-danger', 'Are you sure?', function () {
                        deleteConfig(configUUID);
                    });
                    break;

                case 'toggle':
                    toggleConfig(configUUID);
                    break;
            }
        });
    }
})();
