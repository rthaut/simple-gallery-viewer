export default class MainController {

    constructor($scope) {
        this.scope = $scope;

        this.scope.heading = browser.i18n.getMessage('ExtensionName');

        this.GetSettings();
    }

    async GetSettings() {
        const settings = Object.assign({},

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

        this.scope.settings = [];
        for (const setting in settings) {
            this.scope.settings.push({
                'Name': setting,
                'Enabled': settings[setting],
                'Label': browser.i18n.getMessage(`Setting_${setting}_Label`)
            });
        }

        this.scope.$apply();
    }

    ToggleSetting(name) {
        const setting = this.scope.settings.find(s => s.Name === name);

        const obj = {};
        obj[name] = setting.Enabled;
        browser.storage.sync.set(obj).catch((error) => {
            // reset the toggle's state
            setting.Enabled = !setting.Enabled;
            this.scope.settings.splice(this.scope.settings.findIndex(s => s.Name === name), 1, setting);
            this.scope.$apply();
        });
    }

}

MainController.$inject = ['$scope'];
