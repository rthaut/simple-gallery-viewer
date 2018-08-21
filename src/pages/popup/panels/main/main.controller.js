/* eslint-env browser, webextensions */

export default class MainController {

    constructor($scope) {
        this.scope = $scope;

        this.scope.id = 'main';

        this.GetSettings();
    }

    async GetSettings() {
        this.settings = Object.assign({},

            // these are the defaults
            {
                'StickyFooter': true,
                'ThumbnailsEnabled': true,
                'SlideshowLayoutEnabled': false,
                'PreloadEnabled': true
            },

            await browser.storage.sync.get([
                'StickyFooter',
                'ThumbnailsEnabled',
                'SlideshowLayoutEnabled',
                'PreloadEnabled'
            ])
        );

        this.scope.$apply();
    }

    ToggleSetting(name) {
        const value = this.settings[name];
        console.log(`Changing "${name}" setting to`, value ? 'true' : 'false');

        const setting = {};
        setting[name] = value;
        browser.storage.sync.set(setting).catch((error) => {
            console.error(`Failed to save "${name}" setting`, error);
            // reset the toggle's state
            this.settings[name] = !value;
            this.scope.$apply();
        });
    }

}

MainController.$inject = ['$scope'];
