/* eslint-env browser, jquery, webextensions */
/* global angular */
angular
    .module('EditConfigurationApp', ['schemaForm', 'angular-uuid'])
    .controller('EditConfigurationCtrl', ['$scope', 'uuid', function ($scope, uuid) {
        $scope.schema = {
            'type': 'object',
            'title': 'Configuration',
            'properties': {
                'UUID': {
                    'type': 'string',
                    'title': 'Unique ID',
                },
                'Name': {
                    'type': 'string',
                    'title': 'Configuration Name',
                    'minLength': 4
                },
                'Description': {
                    'type': 'string',
                    'title': 'Configuration Description'
                },
                'Enabled': {
                    'type': 'boolean',
                    'title': 'Enabled',
                    'default': true
                },
                'ApplyToAllURLs': {
                    'type': 'boolean',
                    'title': 'Apply to All URL(s)',
                    'default': true
                },
                'URLs': {
                    'type': 'array',
                    'items': {
                        'type': 'object',
                        'properties': {
                            'Pattern': {
                                'title': 'URL Pattern',
                                'type': 'string'
                            }
                        },
                        'required': ['Pattern']
                    }
                },
                'ImageSelector': {
                    'type': 'string',
                    'title': 'Image(s) Selector'
                },
                'TransformImageURLs': {
                    'type': 'boolean',
                    'title': 'Transform Image URL(s)',
                    'default': false
                },
                'Transformations': {
                    'type': 'array',
                    'items': {
                        'type': 'object',
                        'properties': {
                            'Search': {
                                'title': 'Search',
                                'type': 'string'
                            },
                            'Replacement': {
                                'title': 'Replacement',
                                'type': 'string'
                            }
                        },
                        'required': ['Search', 'Replacement']
                    }
                }
            },
            'required': ['UUID', 'Name', 'ImageSelector']
        };

        $scope.form = [
            {
                'type': 'fieldset',
                'title': 'Configuration Basics',
                'items': [
                    {
                        'key': 'UUID',
                        'readonly': true,
                        'disableSuccessState': true
                    },
                    {
                        'key': 'Name',
                        'description': 'The name of this configuration'
                    },
                    {
                        'key': 'Description',
                        'description': 'Optional. Provide a description or overview for this configuration.',
                        'type': 'textarea',
                        'disableSuccessState': true
                    }
                ]
            },
            {
                'key': 'ImageSelector',
                'description': 'The selector to identify all images on a page.'
            },
            {
                'type': 'fieldset',
                'title': 'Site/Page URLs',
                'items': [
                    {
                        'key': 'ApplyToAllURLs',
                        'description': 'Disable this to specify URL pattern(s) for this configuration.',
                        'disableSuccessState': true
                    },
                    {
                        'type': 'help',
                        'helpvalue': '<div class="alert alert-info"><p>Use the "Applicable URLs" section below to specify URLs (or patterns for URLs) for which this configuration should be enabled.</p></div>',
                        'condition': '!model.ApplyToAllURLs'
                    },
                    {
                        'key': 'URLs',
                        'title': 'Applicable URLs',
                        'add': 'Add Another',
                        'style': {
                            'add': 'btn-success'
                        },
                        'items': ['URLs[].Pattern'],
                        'condition': '!model.ApplyToAllURLs'
                    }
                ]
            },
            {
                'type': 'fieldset',
                'title': 'Image URL Transformation',
                'items': [
                    {
                        'key': 'TransformImageURLs',
                        'description': 'Enable this to manipulate captured image URL(s).',
                        'disableSuccessState': true
                    },
                    {
                        'key': 'Transformations',
                        'title': 'Image URL Transformations',
                        'add': 'Add Another',
                        'style': {
                            'add': 'btn-success'
                        },
                        'items': [
                            'Transformations[].Search',
                            'Transformations[].Replacement'
                        ],
                        'condition': 'model.TransformImageURLs'
                    }
                ]
            },
            {
                'type': 'help',
                'helpvalue': '<hr/>'
            },
            {
                'type': 'submit',
                'style': 'btn-primary',
                'title': 'Save Configuration'
            }
        ];

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
            browser.windows.getCurrent().then((window) => {
                browser.runtime.sendMessage({
                    'action': 'close-config-editor',
                    'data': {
                        'windowID': window.id
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
