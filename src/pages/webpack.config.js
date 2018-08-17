const path = require('path');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    'mode': 'development',
    'devtool': 'source-map',
    'module': {
        'rules': [
            {
                'test': /\.less$/,
                'use': [
                    {
                        'loader': require('mini-css-extract-plugin').loader,
                    },
                    {
                        'loader': 'css-loader'
                    },
                    {
                        'loader': 'less-loader',
                        'options': {
                            'paths': [
                                path.resolve(__dirname, '../../node_modules')
                            ]
                        }
                    }
                ]
            },
            {
                'test': /\.css$/,
            }
        ]
    },
    'output': {
        'filename': '[name]/[name].js'
    },
    'plugins': [
        new MiniCssExtractPlugin({
            'filename': '[name]/[name].css'
        })
    ]
};
