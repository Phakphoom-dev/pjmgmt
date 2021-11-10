import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import "roboto-fontface/css/roboto/roboto-fontface.css";
import "@mdi/font/css/materialdesignicons.css";
import Axios from "axios";

Vue.prototype.$http = Axios;
Vue.config.productionTip = false;

router.beforeEach((to, from, next) => {
  console.log(to, from);
  // const user = JSON.parse(localStorage.getItem("user"));

  // if (to.path === "/dashboard") {
  //   user ? next() : next({ path: "/login" });
  // }

  // next();
  next();
});

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
