<template>
  <v-app dark>
    <site-header :title="title"></site-header>
    <v-main class="pa-0">
      <router-view></router-view>
      <footer-top :footerForm="footerForm"></footer-top>
    </v-main>
    <site-footer :title="title"></site-footer>
  </v-app>
</template>

<script>
import FooterTop from "@/components/FrontLayout/footerTop";
import SiteFooter from "@/components/FrontLayout/siteFooter";
import SiteHeader from "@/components/FrontLayout/siteHeader";

export default {
  name: "Layout",
  data() {
    return {
      title: "",
      footerForm: null,
    };
  },
  components: {
    SiteHeader,
    SiteFooter,
    FooterTop,
  },
  methods: {},
};
</script>
