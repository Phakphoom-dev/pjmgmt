import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import "roboto-fontface/css/roboto/roboto-fontface.css";
import "@mdi/font/css/materialdesignicons.css";
import Axios from "axios";
import VueSweetalert2 from "vue-sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import CKEditor from "ckeditor4-vue";
import VueMoment from "vue-moment";
import moment from "moment-timezone";
import VueToast from "vue-toast-notification";
import "vue-toast-notification/dist/theme-sugar.css";
import VueQuillEditor from "vue-quill-editor";
import vueDebounce from "vue-debounce";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

Vue.use(VueQuillEditor /* { default global options } */);
Vue.use(vueDebounce);

Vue.use(vueDebounce, {
  listenTo: ["input", "change"],
});

moment.tz.setDefault("Asia/Jakarta");
moment.locale("th");

Vue.use(VueToast, {
  position: "top-right",
});
Vue.use(CKEditor);
Vue.use(VueSweetalert2);
Vue.prototype.$http = Axios;
Vue.config.productionTip = false;
Vue.use(VueMoment, {
  moment,
});

router.beforeEach((to, from, next) => {
  if (to.path !== "/login") {
    const isLogin = JSON.parse(localStorage.getItem("isLogin"));

    if (!isLogin) {
      next("login");
    }
  }

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
