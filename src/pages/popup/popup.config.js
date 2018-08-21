/* eslint-env browser, jquery, webextensions */

import MainPanelCtrl from './panels/main/main.controller';
import MainPanelTmpl from './panels/main/main.template.html';

import AboutPanelCtrl from './panels/about/about.controller';
import AboutPanelTmpl from './panels/about/about.template.html';

import HelpPanelCtrl from './panels/help/help.controller';
import HelpPanelTmpl from './panels/help/help.template.html';

import ConfigListPanelCtrl from './panels/configs/list/configslist.controller';
import ConfigListPanelTmpl from './panels/configs/list/configslist.template.html';

config.$inject = ['$compileProvider', '$locationProvider', '$routeProvider'];
export default function config($compileProvider, $locationProvider, $routeProvider) {

    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|file|chrome-extension|moz-extension):|data:image\//);
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|chrome-extension|moz-extension):/);

    $routeProvider
        .when('/', {
            'template': MainPanelTmpl,
            'controller': MainPanelCtrl,
            'controllerAs': 'ctrl'
        })
        .when('/about', {
            'template': AboutPanelTmpl,
            'controller': AboutPanelCtrl,
            'controllerAs': 'ctrl'
        })
        .when('/help', {
            'template': HelpPanelTmpl,
            'controller': HelpPanelCtrl,
            'controllerAs': 'ctrl'
        })
        .when('/configs/list', {
            'template': ConfigListPanelTmpl,
            'controller': ConfigListPanelCtrl,
            'controllerAs': 'ctrl'
        });

    //$locationProvider.html5Mode(true);
}
