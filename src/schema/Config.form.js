export default [
    {
        'type': 'fieldset',
        'title': 'Configuration Basics',
        'items': [
            {
                'key': 'UUID',
                'title': 'Unique ID',
                'readonly': true,
                'disableSuccessState': true
            },
            {
                'key': 'Name',
                'title': 'Configuration Name',
                'description': 'The name of this configuration'
            },
            {
                'key': 'Description',
                'title': 'Configuration Description',
                'description': 'Optional. Provide a description or overview for this configuration.',
                'type': 'textarea',
                'disableSuccessState': true
            }
        ]
    },
    {
        'type': 'fieldset',
        'title': 'Site/Page URLs',
        'description': 'By default, configurations are applied to all sites/pages you visit, but you can restrict each configuration to certain sites (or even specific pages).',
        'items': [
            {
                'key': 'ApplyToAllURLs',
                'title': 'Apply to All URL(s)',
                'description': 'Disable this to specify URL pattern(s) for this configuration.',
                'disableSuccessState': true
            },
            {
                'key': 'URLs',
                'title': 'Applicable URLs',
                'add': 'Add Another URL Pattern',
                'style': {
                    'add': 'btn-default'
                },
                'items': [
                    {
                        'key': 'URLs[].Pattern',
                        'title': 'URL Pattern',
                        'description': 'A regular expression matching the URL(s) for which this configuration is applicable.'
                    }
                ],
                'condition': '!model.ApplyToAllURLs'
            }
        ]
    },
    {
        'type': 'fieldset',
        'title': 'Image Configurations',
        'items': [
            {
                'key': 'ImageSelectors',
                'title': null,  // explicity empty, so as to use the title from the parent fieldset instead
                'add': 'Add Another Image Selector',
                'style': {
                    'add': 'btn-default'
                },
                'items': [
                    {
                        'key': 'ImageSelectors[].Selector',
                        'title': 'Image Selector',
                        'description': 'A CSS selector matching the DOM path to the image(s).'
                    },
                    {
                        'key':'ImageSelectors[].Watch',
                        'title': 'Watch for New Images',
                        'description': 'Enable this to automatically capture images (matching this selector) that are loaded/injected into the page after the initial page render.',
                        'disableSuccessState': true
                    },
                    {
                        'key': 'ImageSelectors[].Transform',
                        'title': 'Transform Image URL(s)',
                        'description': 'Enable this to transform the URL of each captured image. (The transformation options will be displayed below this checkbox when enabled.)',
                        'disableSuccessState': true
                    },
                    {
                        'key': 'ImageSelectors[].Transformations',
                        'title': 'Image URL Transformations',
                        'add': 'Add Another Image URL Transformation',
                        'style': {
                            'add': 'btn-default'
                        },
                        'items': [
                            {
                                'key': 'ImageSelectors[].Transformations[].Search',
                                'title': 'Search',
                                'description': 'This is the part of the image URL that will be replaced.'
                            },
                            {
                                'key': 'ImageSelectors[].Transformations[].SearchRegExp',
                                'title': 'Regular Expression',
                                'description': 'Enable this to use a regular expression as the "Search" term.',
                                'disableSuccessState': true
                            },
                            {
                                'key': 'ImageSelectors[].Transformations[].Replacement',
                                'title': 'Replacement',
                                'description': 'This is what will be used in place of the "Search" term.'
                            }
                        ],
                        'condition': 'model.ImageSelectors[arrayIndex].Transform'
                    }
                ]
            }
        ]
    },
    {
        'type': 'help',
        'helpvalue': '<hr/>'
    },
    {
        'type': 'submit',
        'title': 'Save Configuration',
        'style': 'btn-success'
    }
];
