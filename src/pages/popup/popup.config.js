/* eslint-env browser, jquery, webextensions */

import MainPanelCtrl from './panels/main/main.controller.js';
import MainPanelTmpl from './panels/main/main.template.html';

import AboutPanelCtrl from './panels/about/about.controller.js';
import AboutPanelTmpl from './panels/about/about.template.html';

import HelpPanelCtrl from './panels/help/help.controller.js';
import HelpPanelTmpl from './panels/help/help.template.html';

import ConfigListPanelCtrl from './panels/configs/list/configs-list.controller.js';
import ConfigListPanelTmpl from './panels/configs/list/configs-list.template.html';

import ConfigExportPanelCtrl from './panels/configs/export/configs-export.controller.js';
import ConfigExportPanelTmpl from './panels/configs/export/configs-export.template.html';

config.$inject = ['$compileProvider', '$routeProvider'];
export default function config($compileProvider, $routeProvider) {

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
        })
        .when('/configs/export', {
            'template': ConfigExportPanelTmpl,
            'controller': ConfigExportPanelCtrl,
            'controllerAs': 'ctrl'
        });
}
