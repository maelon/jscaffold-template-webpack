!function() {
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
                    success(xhr.responseText);
                } else {
                    fail(xhr.responseText);
                }
            }
        }
        xhr.open('get', 'vinfo.json?rand' + Math.random().toString().slice(2), true);
        xhr.send();
    }

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
    var loadidx = 0;
    var insertJS = function() {
        var version = (vinfo[os] && vinfo[os]['buildVersion']) || vinfo['buildVersion'];
        var j = 0, n, h, s, t;
        if(loadidx < vinfo.moduleList.length) {
            n = vinfo.moduleList[loadidx]['name'];
            h = vinfo.moduleList[loadidx]['hash'];
            t = vinfo.moduleList[loadidx]['type'];
            if(vinfo[os] && vinfo[os]['moduleList']) {
                for(j = 0; j < vinfo[os]['moduleList'].length; j++) {
                    if(vinfo[os]['moduleList'][j]['name'] === n) {
                        h = vinfo[os]['moduleList'][j]['hash'];
                    }
                }
            }
            s = document.createElement('script');
            s.setAttribute('type', 'text/javascript');
            s.setAttribute('src', [version, n, h].join('/') + '.' + t);
            document.body.appendChild(s);
            s.onload = loadedHandler;
        }
    };

    var loadedHandler = function(e) {
        loadidx += 1;
        insertJS();
    };

    var success = function(result) {
        vinfo = JSON.parse(result);
        insertJS();
    };

    var fail = function(err) {
        throw new Error(err);
    };
}();
