/* eslint-env browser, jquery, webextensions */

import './popup.less';

import config from './popup.config';
import PopupController from './popup.controller';

import panelHeader from './directives/panel-header/panel-header.directive';

/* global angular */
const app = angular.module('SimpleGalleryViewer.Popup', ['ngRoute', 'ngAnimate', 'browser.i18n', panelHeader]);

app.config(config);

app.controller('PopupController', PopupController);
