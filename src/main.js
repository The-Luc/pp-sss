import Vue from 'vue';
import VueRx from 'vue-rx';
import axios from 'axios';
import VueCompositionAPI from '@vue/composition-api';

import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetity';
import Notifications from 'vue-notification';

import './plugins/fabric';
import './scss/_index.scss';

Vue.prototype.axios = axios;

Vue.config.productionTip = false;
Vue.use(VueCompositionAPI);
Vue.use(VueRx);
Vue.use(Notifications);

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app');
