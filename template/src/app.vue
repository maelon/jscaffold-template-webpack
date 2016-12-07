<template>
    <div>
        <div>哈哈哈</div>
        <div id="page"></div>
        <thumb></thumb>
    </div>
</template>

<script>
    import thumb from 'components/thumb';

    export default {
        components: { thumb },
        methods: {
            handleHash: hash => {
                const Vue = require('vue');
                if(window.location.hash == '#a') {
                    require.ensure(['pages/a'], require => {
                        const a = require('pages/a');
                        console.log(a);
                        document.querySelector('#page').innerHTML = new Vue(a).$mount().$el.outerHTML;
                    }, 'pagea');
                } else if(window.location.hash == '#b') {
                    require.ensure(['pages/b'], require => {
                        const b = require('pages/b');
                        console.log(b);
                        document.querySelector('#page').innerHTML = new Vue(b).$mount().$el.outerHTML;
                    }, 'pageb');
                }
            }
        },
        data() {
            return {
                p_pagename: ''
            }
        },
        mounted() {
            window.addEventListener('hashchange', this.handleHash);
            this.handleHash();
        }
    };
</script>

<style scoped>
    img {
        width: 100%;
    }
</style>
