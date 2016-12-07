'use strict';

const fs = require('fs');
const path = require('path');

const cheerio = require('cheerio');
const uglifyjs = require('uglify-js');

const getVersion = () => {
    const config = fs.readFileSync(path.resolve(__dirname, '../src/config.js'), 'utf8');
    const match = config.match(/version:\s*['"]?(\d+\.\d+\.\d+)\s+build-(\w+)['"]?/);
    if(match) {
        return [match[1], match[2]];
    }
    return ['1.0.0', Math.random().toString().slice(2, 10)];
};

const makeVInfo = hash => {
    const version = getVersion();
    const vinfo_path = path.join(__dirname, '../dist/vinfo.json');
    const fd = fs.openSync(vinfo_path, 'w+');
    fs.closeSync(fd);
    const vinfo = {};
    vinfo['buildHash'] = hash;
    vinfo['buildDate'] = (new Date()).toLocaleString();
    vinfo['buildVersion'] = 'v' + version[0];
    vinfo['buildNumber'] = version[1];
    //const params = process.argv.slice(2);
    //for(let i = 0; i < params.length; i++) {
        //if(params[i] === '--buildversion') {
            //if(i === params.length - 1) {
                //throw new Error('no build version');
            //}
            //vinfo['buildVersion'] = params[i + 1];
            //break;
        //}
    //}
    //vinfo['updatePolicy'] = 'default';
    //vinfo['storePolicy'] = 'default';
    //vinfo['cacheList'] = getCacheFiles(`./dist/${ versionHash }/`);
    vinfo['moduleList'] = [];
    const html_path = path.join(__dirname, '../dist', `/${ 'v' + version[0]  }/index.html`);
    const html = fs.readFileSync(html_path, 'utf8');
    const $ = cheerio.load(html);
    $('body script[src]').map((index, v) => {
        const info = $(v).attr('src').match(/^v(\d+\.\d+\.\d+)\/(\w+)\/(\w+)\.js/);
        if(info) {
            vinfo['moduleList'].push({
                name: info[2],
                hash: info[3],
                type: 'js',
            });
        }
    });

    fs.writeFileSync(vinfo_path, JSON.stringify(vinfo, null, '\t'), 'utf8');

    //console.log('buildinfo', vinfo);
};

const makeShell = () => {
    const version = 'v' + getVersion()[0];
    const template_path = path.join(__dirname, '../dist', `/${ version  }/index.html`);
    const html = fs.readFileSync(template_path, 'utf8');
    const $ = cheerio.load(html);
    $('body script[src]').map((index, v) => {
        const info = $(v).attr('src').match(/^v(\d+\.\d+\.\d+)\/(\w+)\/(\w+)\.js/);
        if(info) {
            $(v).remove();
        }
    });
    const loaderjs_path = path.join(__dirname, './bz.js');
    $('body').append(`<script type="text/javascript">${ uglifyjs.minify(loaderjs_path).code }</script>`);
    const minify = require('html-minifier').minify;
    const result = minify($.html(), {
      removeAttributeQuotes: true
    });
    const html_path = path.join(__dirname, '../dist/index.html');
    const fd = fs.openSync(html_path, 'w+');
    fs.closeSync(fd);
    fs.writeFileSync(html_path, result, 'utf8');
};

exports.getVersion = getVersion;
exports.makeVInfo = makeVInfo;
exports.makeShell = makeShell;
