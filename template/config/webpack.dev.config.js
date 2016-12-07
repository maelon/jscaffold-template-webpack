'use strict';

const webpack  = require('webpack');
const webpackDevServer = require('webpack-dev-server');
const config = require('./webpack.base.config.js');
config.entry.app.unshift('webpack-dev-server/client?http://localhost:8080/', "webpack/hot/dev-server");
config.plugins = config.plugins.concat([
    new webpack.HotModuleReplacementPlugin()
]);

const compiler = webpack(config);
const server = new webpackDevServer(compiler, {
    hot: true,
    noInfo: true,
    stats: { colors: true }
});
server.listen(8080, 'localhost', err => {
    if(err) {
        console.log('Error happened!!!!');
    } else {
        console.log('Server listening at port: 8080');
    }
});
