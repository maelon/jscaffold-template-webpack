'use strict';

const exec = require('child_process').exec;
const path = require('path')

const webpack  = require('webpack');
const config = require('./webpack.base.config.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const make = require('./make');

console.log(`
     Tip:
     Built files are meant to be served over an HTTP server.
     Opening index.html over file:// won\'t work.
`)

const distPath = path.resolve(__dirname, '../dist');
const rootPath = path.join(distPath, '../');
const staticPath = path.join(rootPath, 'static');
exec('rm -rf ' + distPath);
exec('mkdir -p ' + distPath + '/static');
exec('cp -R ' + staticPath + '/* ' + distPath + '/static/');
exec('cp ' + rootPath + 'changelog.txt ' + distPath);

const version = make.getVersion()[0];
config.output.path = distPath + '/v' + version;
config.output.publicPath = 'v' + version + '/';
config.output.filename = '[name]/[chunkhash].js',
config.output.chunkFilename = 'modules/[name]/[chunkhash].js',
config.devtool = false;
config.plugins = [
    new webpack.optimize.CommonsChunkPlugin({
        name: ['baselib', 'load'],
        minChunks: Infinity
    }),
    // short-circuits all Vue.js warning code
    new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: JSON.stringify('production')
        }
    }),
    // minify with dead-code elimination
    new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false
        }
    }),
    // optimize module ids by occurence count
    new webpack.optimize.OccurenceOrderPlugin(),
    new HtmlWebpackPlugin({
        filename: 'index.html',
        template: 'index.html',
        inject: true,
        minify: {
            removeComments: true,
            collapseWhitespace: true,
            removeAttributeQuotes: true
        }
    })
];

webpack(config, (err, stats) => {
    if (err) throw err;
    process.stdout.write(stats.toString({
        colors: true,
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false
    }) + '\n');

    make.makeVInfo(stats);
    make.makeShell();
})
