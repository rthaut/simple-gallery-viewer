function panelHeader() {
    return {
        'restrict': 'E',
        'replace': true,
        'scope': {
            'backButtonPath': '@?',
            'headerIcon': '@?',
            'headerText': '@'
        },
        'template': require('./panel-header.template.html')
    };
}

/* global angular */
export default angular.module('SimpleGalleryViewer.Popup.Directives.PanelHeader', [])
    .directive('panelHeader', panelHeader)
    .name;
