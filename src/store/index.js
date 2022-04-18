import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

import sidebar from "@/store/modules/sidebar";
import header from "@/store/modules/header";

export default new Vuex.Store({
  modules: {
    sidebar,
    header,
  },
});
