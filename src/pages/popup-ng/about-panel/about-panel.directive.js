/* eslint-env browser, webextensions */

/* global angular */
const AboutPanel = angular.module('SimpleGalleryViewer.Popup.AboutPanel', []);

import AboutPanelTemplate from './about-panel.template.html';

AboutPanel.controller('AboutPanelCtrl', ['$scope', async function ($scope) {



}]);

AboutPanel.directive('aboutPanel', function () {
    return {
        'template': AboutPanelTemplate,
        'restrict': 'E',
        'replace': true,
        'require': ['AboutPanelCtrl'],
        'scope': {
            'panelId': '='
        },
        'controller': 'AboutPanelCtrl'
    };
});

export default AboutPanel.name;
