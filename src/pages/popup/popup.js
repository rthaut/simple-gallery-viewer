/* eslint-env browser, jquery, webextensions */

import './popup.less';

import config from './popup.config';
import PopupController from './popup.controller';

/* global angular */
const app = angular.module('SimpleGalleryViewer.Popup', ['ngRoute', 'ngAnimate']);

app.config(config);

app.controller('PopupController', PopupController);
