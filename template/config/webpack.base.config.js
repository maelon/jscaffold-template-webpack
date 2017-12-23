'use strict';

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        baselib: ['react', 'react-dom', 'babel-polyfill'],
        app: [path.join(__dirname, '../src/main')]
    },
    output: {
        path: path.join(__dirname, '../dist'),
        filename: '[name].js',
        chunkFilename: '[name].js',
        publicPath: ''
    },
    resolve: {
        extensions: ['.js', '.jsx'],
        modules: [
            path.join(__dirname, 'src'),
            'node_modules'
        ],
        alias: {
            'src': path.resolve(__dirname, '../src'),
            'assets': path.resolve(__dirname, '../src/assets'),
            'pages': path.resolve(__dirname, '../src/pages'),
            'services': path.resolve(__dirname, '../src/services'),
            'components': path.resolve(__dirname, '../src/components')
        }
    },
    devtool: 'inline-source-map',
    resolveLoader: {
        modules: [path.join(__dirname, '../node_modules')],
        moduleExtensions: ['-loader']
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                use: 'babel-loader'
            },
            {
                test: /\.css$/,
                use: [
                    { loader: 'style-loader' },
                    { loader: 'css-loader' }
                ]
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        name: path.join('static', 'images/[name].[hash:7].[ext]')
                    }
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        name: path.join('static', 'fonts/[name].[hash:7].[ext]')
                    }
                }
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'index.html',
            inject: true
        })
    ]
};
