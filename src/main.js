import Vue from 'vue';
import App from '@/App.vue';
import axios from 'axios';
Vue.prototype.$api = axios.create();

import { Auth0Plugin } from "./auth";
import router from '@/router';
import store from '@/store';

import moment from 'moment';
import VueQrcodeReader from "vue-qrcode-reader";
import '@fortawesome/fontawesome-free/css/all.css'
import '@fortawesome/fontawesome-free/js/all.js'

import 'bootstrap';
import './css/app.scss';

import VueMaterial from 'vue-material'


window.$ = window.jQuery = require('jquery');

Vue.use(VueMaterial);
Vue.use(VueQrcodeReader);

Vue.prototype.moment = moment;


import browserDetect from "vue-browser-detect-plugin";
Vue.use(browserDetect);

async function main() {

    if ('serviceWorker' in navigator) {
        try {
            await navigator.serviceWorker.register('/sw.js');
            console.log('service worker registered');
        } catch (err) {
            console.log('service worker not registered');
            console.log(err);
        }
    }

    let resp = await Vue.prototype.$api.get('/api/auth0-config');
    let authConfig = resp.data;
    let domain = authConfig.AUTH0_DOMAIN;
    let clientId = authConfig.AUTH0_CLIENT_ID;
    let scope = authConfig.SCOPE;
    let defaultAuth = authConfig.DEFAULT_AUTH_CONN;

    Vue.use(Auth0Plugin, {
        domain,
        clientId,
        defaultAuth
    });

    Vue.config.productionTip = false;

    new Vue({
        el: '#app',
        store,
        router,
        render: h => h(App),
    });

}

main();