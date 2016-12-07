'use strict';

const fs = require('fs');
const path = require('path');

const cheerio = require('cheerio');

const getVersion = () => {
    const config = fs.readFileSync(path.resolve(__dirname, '../src/config.js'), 'utf8');
    const match = config.match(/version:\s*['"]?(\d+\.\d+\.\d+)['"]?/);
    if(match) {
        return match[1];
    }
    return '1.0.0';
};

const makeVInfo = hash => {
    const version = 'v' + getVersion();
    const vinfo_path = path.join(__dirname, '../dist/vinfo.json');
    const fd = fs.openSync(vinfo_path, 'w+');
    fs.closeSync(fd);
    const vinfo = {};
    vinfo['buildHash'] = hash;
    vinfo['buildDate'] = (new Date()).toLocaleString();
    vinfo['buildVersion'] = version;
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
    const html_path = path.join(__dirname, '../dist', `/${ version  }/index.html`);
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
    const version = 'v' + getVersion();
    const template_path = path.join(__dirname, '../dist', `/${ version  }/index.html`);
    const html = fs.readFileSync(template_path, 'utf8');
    const $ = cheerio.load(html);
    $('body script[src]').map((index, v) => {
        const info = $(v).attr('src').match(/^v(\d+\.\d+\.\d+)\/(\w+)\/(\w+)\.js/);
        if(info) {
            $(v).remove();
        }
    });
    $('body').append(`
        <script type="text/javascript">!function(){var f;if(window.XMLHttpRequest){f=new XMLHttpRequest()}else{throw new Error("unsupport XMLHttpRequest")}if(f){f.responseType="text";f.timeout=10000;f.onreadystatechange=function(j){if(f.readyState===4){if(f.status===200){e(f.responseText)}else{b(f.responseText)}}};f.open("get","vinfo.json?rand"+Math.random().toString().slice(2),true);f.send()}var g=function(){var j=window.navigator.userAgent.toLowerCase();if((/iPhone|iPad|iPod/i).test(j)){return"ios"}else{if((/android/i).test(j)){return"android"}}return"other"};var c=g();var i;var a=0;var d=function(){var k=(i[c]&&i[c]["buildVersion"])||i["buildVersion"];var l=0,q,p,o,m;if(a<i.moduleList.length){q=i.moduleList[a]["name"];p=i.moduleList[a]["hash"];m=i.moduleList[a]["type"];if(i[c]&&i[c]["moduleList"]){for(l=0;l<i[c]["moduleList"].length;l++){if(i[c]["moduleList"][l]["name"]===q){p=i[c]["moduleList"][l]["hash"]}}}o=document.createElement("script");o.setAttribute("type","text/javascript");o.setAttribute("src",[k,q,p].join("/")+"."+m);document.body.appendChild(o);o.onload=h}};var h=function(j){a+=1;d()};var e=function(j){i=JSON.parse(j);d()};var b=function(j){throw new Error(j)}}();</script>
    `);
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
