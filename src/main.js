import Vue from 'vue';
import axios from 'axios';
import VueCompositionAPI from '@vue/composition-api';

import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetity';

import './scss/_index.scss';

Vue.prototype.axios = axios;

Vue.config.productionTip = false;
Vue.use(VueCompositionAPI);

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app');
