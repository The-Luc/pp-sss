import Vue from 'vue';
import VueRx from 'vue-rx';
import axios from 'axios';
import VueCompositionAPI from '@vue/composition-api';

import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetity';

import './plugins/fabric';
import './scss/_index.scss';

import appService from './api/app';

// check and set mock data to sesstion storage if empty
appService.initData();

// beforeunload event listener to save data to sessionStorage
appService.saveOnUnloadEvent();

Vue.prototype.axios = axios;

Vue.config.productionTip = false;
Vue.use(VueCompositionAPI);
Vue.use(VueRx);

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app');
