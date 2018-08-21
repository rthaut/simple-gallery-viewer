/* eslint-env browser, webextensions */

/* global angular */
const ConfigPanel = angular.module('SimpleGalleryViewer.Popup.ConfigPanel', []);

import ConfigPanelTemplate from './config-panel.template.html';

ConfigPanel.controller('ConfigPanelCtrl', ['$scope', async function ($scope) {

    const getConfigs = async function () {
        const { Configurations } = await browser.storage.sync.get('Configurations');

        $scope.configs = Configurations;
        $scope.$apply();
    };
    getConfigs();

    $scope.editConfig = function(config) {
        browser.runtime.sendMessage({
            'action': 'open-config-editor',
            'data': {
                'configUUID': config.UUID
            }
        });
    };

    $scope.deleteConfig = function(config) {
        alert('Deleting Config ' + config.Name);
    };

    $scope.toggleConfig = async function(config) {
        config = await browser.runtime.sendMessage({
            'action': 'toggle-config',
            'data': {
                'configUUID': config.UUID
            }
        });

        for (var i = 0; i < $scope.configs.length; i++) {
            if ($scope.configs[i].UUID === config.UUID) {
                $scope.configs.splice(i, 1, config);
            }
        }

        $scope.$apply();
    };

}]);

ConfigPanel.directive('configPanel', function () {
    return {
        'template': ConfigPanelTemplate,
        'restrict': 'E',
        'replace': true,
        'require': ['ConfigPanelCtrl'],
        'scope': {
            'panelId': '='
        },
        'controller': 'ConfigPanelCtrl'
    };
});

export default ConfigPanel.name;
