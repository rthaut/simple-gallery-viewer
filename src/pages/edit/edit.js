/* eslint-env browser, jquery, webextensions */

import './edit.less';

import schema from '../../schema/Config.schema.js';
import form from '../../schema/Config.form.js';

/* global angular */
const app = angular.module('EditConfigurationApp', ['schemaForm', 'angular-uuid', 'browser.i18n']);

app.controller('EditConfigurationCtrl', ['$scope', '$sce', 'uuid', function ($scope, $sce, uuid) {

    $scope.title = browser.i18n.getMessage('ExtensionName');

    $scope.schema = schema;
    $scope.form = form;

    $scope.heading = browser.i18n.getMessage('CreateConfigTitle');
    $scope.model = {
        'UUID': uuid.v4()
    };

    $scope.options = {
        'formDefaults': {
            // 'feedback': false,
            'ngModelOptions': {
                'debounce': 500
            }
        }
    };

    $scope.helpText = browser.i18n.getMessage('ConfigurationEditorHelpText', [`<a href="https://github.com/rthaut/simple-gallery-viewer/wiki">${browser.i18n.getMessage('ConfigurationWikiLinkText')}</a>`]);

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
                $scope.error = browser.i18n.getMessage('ConfigurationErrorPlaceholder', [error]);
                $scope.$apply();
            });
        } else {
            $scope.error = browser.i18n.getMessage('ConfigurationInvalid');
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
            const config = await browser.runtime.sendMessage({
                'action': 'get-config',
                'data': {
                    'configUUID': UUID
                }
            });

            if (config !== undefined) {
                $scope.title = browser.i18n.getMessage('UpdateConfigTitle');
                $scope.model = angular.copy(config);
                $scope.$apply();
            }
        }
    })();

}]);
