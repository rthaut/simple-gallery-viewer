const path = require('path');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    'module': {
        'rules': [
            {
                'test': /\.less$/,
                'use': [
                    {
                        'loader': MiniCssExtractPlugin.loader,
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
            },
            {
                'test': /\.html$/,
                'loader': 'raw-loader'
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
