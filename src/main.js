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
import VueChatScroll from "vue-chat-scroll";
import VueApexCharts from "vue-apexcharts";

Vue.use(VueApexCharts);
Vue.use(VueChatScroll);
Vue.use(VueQuillEditor /* { default global options } */);
Vue.use(vueDebounce);

Vue.use(vueDebounce, {
  listenTo: ["input", "change"],
});

Vue.component("apexchart", VueApexCharts);

moment.tz.setDefault("Asia/Jakarta");
moment.locale("th");

Vue.use(VueToast, {
  position: "top",
});

Vue.use(CKEditor);
Vue.use(VueSweetalert2);
Vue.prototype.$http = Axios;
Vue.config.productionTip = false;
Vue.use(VueMoment, {
  moment,
});

router.beforeEach((to, from, next) => {
  let path = to.path;

  if (path === "/index" || path === "/" || path === "/view-collection") {
    next();
  } else {
    if (to.path !== "/login") {
      const userData = JSON.parse(localStorage.getItem("userData"));

      if (!userData) {
        next("login");
      }
    }
  }

  next();
});

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
