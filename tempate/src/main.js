'use strict';

import Vue from 'vue';

import App from 'src/app';
import config from 'src/config';

new Vue({
    el: '#app',
    template: '<App/>',
    components: { App }
});

console.log(config.version);
