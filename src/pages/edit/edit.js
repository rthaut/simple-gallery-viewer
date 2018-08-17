/* eslint-env browser, jquery, webextensions */

import './edit.less';

/* global angular */
const app = angular.module('EditConfigurationApp', ['schemaForm', 'angular-uuid']);

app.controller('EditConfigurationCtrl', ['$scope', 'uuid', function ($scope, uuid) {
    $scope.schema = require('../../schema/Config.schema.json');
    $scope.form = require('../../schema/Config.form.json');

    $scope.action = 'Create';
    $scope.model = {
        'UUID': uuid.v4()
    };

    $scope.save = function (form) {
        $scope.$broadcast('schemaFormValidate');
        if (form.$valid) {
            $scope.error = false;

            browser.runtime.sendMessage({
                'action': 'save-config',
                'data': {
                    'config': angular.copy($scope.model)
                }
            }).then(() => {
                $('#successModal').modal('show');
            }).catch((error) => {
                $scope.error = `Failed to save configuration (${error})`;
                $scope.$apply();
            });
        } else {
            $scope.error = 'Configuration is not valid';
        }
    };

    $('button#close').on('click', function (e) {
        $('#successModal').modal('hide');
        browser.tabs.getCurrent().then((tab) => {
            browser.runtime.sendMessage({
                'action': 'close-config-editor',
                'data': {
                    'tabId': tab.id
                }
            });
        });
    });

    (async function LoadConfig() {
        const params = (new URL(document.location)).searchParams;
        const UUID = params.get('UUID');

        if (UUID !== null && UUID.length) {
            const {
                'Configurations': configurations
            } = await browser.storage.sync.get('Configurations');

            if (configurations !== undefined && configurations.length) {
                const config = configurations.find(config => config.UUID === UUID);

                if (config !== undefined) {
                    $scope.action = 'Update';
                    $scope.model = angular.copy(config);
                    $scope.$apply();
                }
            }
        }
    })();

}]);
