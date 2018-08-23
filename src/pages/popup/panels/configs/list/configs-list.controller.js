export default class ConfigsListController {

    constructor($scope) {
        this.scope = $scope;

        this.GetConfigs();

        const labels = [
            'ManageConfigsHeading',
            'CreateConfigHeading',
            'ExportConfigsHeading',
            'ImportConfigsHeading',
        ];

        this.scope.labels = {};
        labels.forEach(label => this.scope.labels[label] = browser.i18n.getMessage(label));
    }

    async GetConfigs() {
        this.configs = await browser.runtime.sendMessage({
            'action': 'get-all-configs'
        });
        this.scope.$apply();
    }

    EditConfig(config) {
        const message = {
            'action': 'open-config-editor'
        };

        if (config !== undefined && config !== null) {
            message['data'] = {
                'configUUID': config.UUID
            };
        }

        browser.runtime.sendMessage(message);
    }

    DeleteConfig(config) {
        this.confirm = config;
        this.prompt = {
            'action': 'delete',
            'class': 'bg-danger',
            'text': 'Are you sure?',
            'yes': async () => {
                await browser.runtime.sendMessage({
                    'action': 'delete-config',
                    'data': {
                        'configUUID': config.UUID
                    }
                });
                this.configs = await browser.runtime.sendMessage({
                    'action': 'get-all-configs'
                });
                this.scope.$apply();
            },
            'no': () => {
                this.confirm = null;
            }
        };
    }

    async ToggleConfig(config) {
        config = await browser.runtime.sendMessage({
            'action': 'toggle-config',
            'data': {
                'configUUID': config.UUID
            }
        });

        for (var i = 0; i < this.configs.length; i++) {
            if (this.configs[i].UUID === config.UUID) {
                this.configs.splice(i, 1, config);
            }
        }

        this.scope.$apply();
    }

}

ConfigsListController.$inject = ['$scope'];
