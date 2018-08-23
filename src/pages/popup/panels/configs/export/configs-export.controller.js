export default class ConfigsExportController {

    constructor($scope) {
        this.scope = $scope;

        this.LoadConfigs();

        const labels = [
            'ExportConfigsHeading',
            'ExportButtonLabel',
            'ExportSelectAll',
            'ExportDeselectAll',
        ];

        this.scope.labels = {};
        labels.forEach(label => this.scope.labels[label] = browser.i18n.getMessage(label));
    }

    async LoadConfigs() {
        this.scope.configs = await browser.runtime.sendMessage({
            'action': 'get-all-configs'
        });

        this.scope.selected = {};

        this.scope.configs.forEach(config => {
            this.scope.selected[config.UUID] = false;
        });

        this.scope.$apply();
    }

    SelectAll() {
        for (const configUUID in this.scope.selected) {
            this.scope.selected[configUUID] = true;
        }
    }

    DeselectAll() {
        for (const configUUID in this.scope.selected) {
            this.scope.selected[configUUID] = false;
        }
    }

    ExportButtonEnabled() {
        const configUUIDs = this.GetSelectedConfigUUIDs();
        return configUUIDs.length > 0;
    }

    GetSelectedConfigUUIDs() {
        const configUUIDs = [];
        for (const configUUID in this.scope.selected) {
            if (this.scope.selected[configUUID]) {
                configUUIDs.push(configUUID);
            }
        }

        return configUUIDs;
    }

    ExportConfigs($event) {
        $event.target.setAttribute('disabled', true);
        $event.target.textContent = browser.i18n.getMessage('ExportGeneratingFile');

        browser.runtime.sendMessage({
            'action': 'export-configs',
            'data': {
                'configUUIDs': this.GetSelectedConfigUUIDs()
            }
        }).then((response) => {
            const dataObj = new Blob([JSON.stringify(response)], { 'type': 'application/json' });
            const dataObjURL = URL.createObjectURL(dataObj);

            const date = new Date();
            const filename = browser.i18n.getMessage('ExtensionName').replace(' ', '_');

            const link = document.createElement('a');
            link.href = dataObjURL;
            link.download = `${filename}-${date.getUTCFullYear()}-${date.getMonth() + 1}-${date.getDate()}.json`;
            link.dispatchEvent(new MouseEvent('click'));

            this.DeselectAll();
        }).catch((error) => {
            this.scope.$emit('ShowAlert', {
                'type': 'danger',
                'msg': browser.i18n.getMessage('ExportConfigsError', [error.message || ''])
            });
        }).finally(() => {
            $event.target.removeAttribute('disabled');
            $event.target.textContent = this.scope.labels.ExportButtonLabel;
            this.scope.$apply();
        });
    }

}

ConfigsExportController.$inject = ['$scope'];
