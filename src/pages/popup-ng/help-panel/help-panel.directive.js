/* eslint-env browser, webextensions */

/* global angular */
const HelpPanel = angular.module('SimpleGalleryViewer.Popup.HelpPanel', []);

import HelpPanelTemplate from './help-panel.template.html';

HelpPanel.controller('HelpPanelCtrl', ['$scope', async function ($scope) {



}]);

HelpPanel.directive('helpPanel', function () {
    return {
        'template': HelpPanelTemplate,
        'restrict': 'E',
        'replace': true,
        'require': ['HelpPanelCtrl'],
        'scope': {
            'panelId': '='
        },
        'controller': 'HelpPanelCtrl'
    };
});

export default HelpPanel.name;
