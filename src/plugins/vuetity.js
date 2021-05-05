import Vue from "vue";
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";
import "font-awesome/css/font-awesome.min.css";
import 'material-design-icons-iconfont/dist/material-design-icons.css'

Vue.use(Vuetify);

const opts = {
  icons: {
    iconfont: "fa4",
    miconfont: 'md',
  }
};

export default new Vuetify(opts);
