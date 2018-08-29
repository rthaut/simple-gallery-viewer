export default {
    'type': 'object',
    'properties': {
        'UUID': {
            'type': 'string'
        },
        'Name': {
            'type': 'string',
            'minLength': 4
        },
        'Description': {
            'type': 'string'
        },
        'Enabled': {
            'type': 'boolean',
            'default': true
        },
        'ApplyToAllURLs': {
            'type': 'boolean',
            'default': true
        },
        'URLs': {
            'type': 'array',
            'items': {
                'type': 'object',
                'properties': {
                    'Pattern': {
                        'type': 'string'
                    }
                },
                'required': ['Pattern']
            }
        },
        'ImageSelectors': {
            'type': 'array',
            'items': {
                'type': 'object',
                'properties': {
                    'Selector': {
                        'type': 'string'
                    },
                    'Watch': {
                        'type': 'boolean'
                    },
                    'Transform': {
                        'type': 'boolean'
                    },
                    'Transformations': {
                        'type': 'array',
                        'default': [],  // required to get ASF to handle Transformations as an array instead of an object (see: https://github.com/json-schema-form/angular-schema-form/issues/207#issuecomment-127664593)
                        'items': {
                            'type': 'object',
                            'properties': {
                                'Search': {
                                    'type': 'string'
                                },
                                'SearchRegExp': {
                                    'type': 'boolean'
                                },
                                'Replacement': {
                                    'type': 'string'
                                }
                            },
                            'required': ['Search']
                        }
                    }
                },
                'required': ['Selector']
            }
        }
    },
    'required': ['Name', 'UUID', 'ImageSelectors']
};
