!function() {
    var ajax_get = function(url, successback, errorback) {
        var xhr;
        if(window.XMLHttpRequest) {
            xhr = new XMLHttpRequest();
        } else {
            throw new Error('unsupport XMLHttpRequest');
        }

        if(xhr) {
            xhr.responseType = 'text';
            xhr.timeout = 10000;
            xhr.onreadystatechange = function(e) {
                if(xhr.readyState === 4) {
                    if(xhr.status === 200) {
                        successback(xhr.responseText);
                    } else {
                        errorback(xhr.responseText);
                    }
                }
            }
            xhr.open('get', url, true);
            xhr.send();
        }
    };

    var detectOS = function() {
        var ua = window.navigator.userAgent.toLowerCase();
        if((/iPhone|iPad|iPod/i).test(ua)) {
            return 'ios';
        } else if((/android/i).test(ua)) {
            return 'android';
        }
        return 'other';
    };
    var os = detectOS();
    var vinfo;
    var insertJS = function(index) {
        var version = (vinfo[os] && vinfo[os]['buildVersion']) || vinfo['buildVersion'];
        var j = 0, n, h, t, m, s, isHashURL;
        if(index < vinfo.moduleList.length) {
            m = vinfo.moduleList[index];
            n = m['name'];
            h = m['hash'];
            t = m['type'];
            if(vinfo[os] && vinfo[os]['moduleList']) {
                for(j = 0; j < vinfo[os]['moduleList'].length; j++) {
                    if(vinfo[os]['moduleList'][j]['name'] === n) {
                        h = vinfo[os]['moduleList'][j]['hash'];
                    }
                }
            }
            isHashURL = (/^https?:\/\//i).test(h);
            if(vinfo.cache && !isHashURL) {
                loadModule(index, n, h, t);
            } else {
                s = document.createElement('script');
                s.setAttribute('type', 'text/javascript');
                s.setAttribute('charset', 'utf-8');
                if(!isHashURL) {
                    s.setAttribute('src', [version, n, h].join('/') + '.' + t);
                } else {
                    s.setAttribute('src', h);
                }
                document.body.appendChild(s);
            }
        }
    };

    var loadModule = function(index, n, h, t) {
        var version = (vinfo[os] && vinfo[os]['buildVersion']) || vinfo['buildVersion'];
        var j = 0, m, isHashURL;
        if(index < vinfo.moduleList.length) {
            m = vinfo.moduleList[index];
            if(hasCache(n, h)) {
                m.content = getCache(n, h)['content'];
                m.done = true;
                if(checkModuleAllLoaded()) {
                    executeModuleLoaded();
                }
            } else {
                ajax_get([version, n, h].join('/') + '.' + t, function(js) {
                    m.content = js;
                    m.done = true;
                    setCache(n, h, js);
                    if(checkModuleAllLoaded()) {
                        executeModuleLoaded();
                    }
                }, function(err) {
                    throw new Error('loadm module '  + n + ' failed');
                });
            }
        }
    };

    var checkModuleAllLoaded = function() {
        for(var i = 0; i < vinfo.moduleList.length; i++) {
            if(!vinfo.moduleList[i].done) {
                return false;
            }
        }
        return true;
    };

    var executeModuleLoaded = function() {
        var s, i;
        for(i = 0; i < vinfo.moduleList.length; i++) {
            s = document.createElement('script');
            s.setAttribute('type', 'text/javascript');
            s.setAttribute('charset', 'utf-8');
            s.appendChild(document.createTextNode(vinfo['moduleList'][i]['content']));
            document.body.appendChild(s);
        }
    };

    var success = function(result) {
        vinfo = JSON.parse(result);
        if(vinfo.cache) {
            setCache('vinfo', new Date().toLocaleString(), JSON.stringify(vinfo));
        } else {
            clearCache();
        }
        if(vinfo.moduleList && vinfo.moduleList.length) {
            for(var i = 0; i < vinfo.moduleList.length; i++) {
                insertJS(i);
            }
        }
    };

    var fail = function(err) {
        if(hasCache('vinfo')) {
            vinfo = JSON.parse(getCache('vinfo')['content']);
            insertJS();
        }
    };

    ajax_get('vinfo.json?rand=' + Math.random().toString().slice(2), success, fail);

    var hasCache = function(modname, modversion) {
        if(window.localStorage && typeof modname === 'string') {
            var mod = window.localStorage.getItem('paiband_cache_' + modname);
            if(mod && modversion) {
                mod = JSON.parse(mod);
                return mod['version'] === modversion;
            } else {
                return !!mod;
            }
        }
        return false;
    };

    var setCache = function(modname, modversion, modcontent) {
        if(window.localStorage && typeof modname === 'string' && typeof modversion === 'string' && typeof modcontent === 'string') {
            try {
                window.localStorage.setItem('paiband_cache_' + modname, JSON.stringify({
                    version: modversion,
                    content: modcontent
                }))
            } catch(e) {
            }
        }
    };

    var getCache = function(modname, modversion) {
        if(window.localStorage && typeof modname === 'string') {
            var mod = window.localStorage.getItem('paiband_cache_' + modname);
            if(mod) {
                mod = JSON.parse(mod);
                if(modversion) {
                    if(mod['version'] === modversion) {
                        return mod;
                    }
                } else {
                    return mod;
                }
            }
        }
        return null;
    };

    var removeCache = function(modname, modversion) {
        if(window.localStorage) {
            if(hasCache(modname, modversion)) {
                try {
                    window.localStorage.removeItem(modname);
                } catch(e) {
                }
            }
        }
    };

    var clearCache = function() {
        if(window.localStorage) {
            var len = window.localStorage.length;
            var i = 0, key;
            for(var i = 0; i < len; i++) {
                key = window.localStorage.key(i);
                if(key.indexOf('paiband_cache_') !== -1) {
                    removeCache(key);
                }
            }
        }
    }
}();
