/* eslint-env browser, jquery, webextensions */

import './popup-ng.less';

import ConfigPanel from './config-panel/config-panel.directive';
import HelpPanel from './help-panel/help-panel.directive';
import AboutPanel from './about-panel/about-panel.directive';

/* global angular */
const app = angular.module('SimpleGalleryViewer.Popup', [ConfigPanel, HelpPanel, AboutPanel]);

app.config([
    '$compileProvider',
    function ($compileProvider) {
        $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|file|chrome-extension|moz-extension):|data:image\//);
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|chrome-extension|moz-extension):/);
    }
]);

app.controller('SimpleGalleryViewerPopupCtrl', ['$scope', async function ($scope) {

    const getSettings = async function () {
        $scope.settings = Object.assign({},

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

        $scope.$apply();
    };
    getSettings();

    $scope.toggleSetting = function (name) {
        const value = $scope.settings[name];
        console.log(`Changing "${name}" setting to`, value ? 'true' : 'false');

        const setting = {};
        setting[name] = value;
        browser.storage.sync.set(setting).catch((error) => {
            console.error(`Failed to save "${name}" setting`, error);
            // reset the toggle's state
            $scope.settings[name] = !value;
            $scope.$apply();
        });
    };

}]);

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
