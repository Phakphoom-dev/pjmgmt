<template>
  <v-navigation-drawer
    app
    clipped
    v-model="DRAWER_STATE"
    :mini-variant="!DRAWER_STATE"
    :permanent="$vuetify.breakpoint.mdAndUp"
    :temporary="$vuetify.breakpoint.smAndDown"
    :mini-variant-width="sidebarMinWidth"
  >
    <v-list-item>
      <!-- <v-list-item-avatar>
        <v-avatar size="36px">
          <img src="@/assets/admin.png" alt="UserImg" />
        </v-avatar>
      </v-list-item-avatar> -->

      <v-list-item-content>
        <v-list-item-title>{{ title }}</v-list-item-title>
      </v-list-item-content>
    </v-list-item>

    <v-divider></v-divider>

    <!-- Admin Nav -->
    <v-list nav dense v-if="userData.roleId === 1">
      <v-list-item
        v-for="item in adminNav"
        :key="item.title"
        :to="item.link"
        :prepend-icon="item.icon"
        color="primary"
      >
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-title>{{ item.title }}</v-list-item-title>
      </v-list-item>
    </v-list>
    <!-- /Admin Nav -->

    <!-- User Nav -->
    <v-list nav dense v-if="userData.roleId === 2">
      <v-list-item
        v-for="item in userNav"
        :key="item.title"
        :to="item.link"
        :prepend-icon="item.icon"
        color="primary"
      >
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-title>{{ item.title }}</v-list-item-title>
      </v-list-item>
    </v-list>
    <!-- /User Nav -->

    <!-- Teacher Nav -->
    <v-list nav dense v-if="userData.roleId === 3">
      <v-list-item
        v-for="item in teacherNav"
        :key="item.title"
        :to="item.link"
        :prepend-icon="item.icon"
        color="primary"
      >
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-title>{{ item.title }}</v-list-item-title>
      </v-list-item>
    </v-list>
    <!-- /Teacher Nav -->
  </v-navigation-drawer>
</template>

<script>
import { adminNav, userNav, teacherNav } from "./navItems";
import { mapActions, mapState } from "vuex";

export default {
  name: "Sidebar",
  data() {
    return {
      userData: JSON.parse(localStorage.getItem("userData")),
      model: 0,
      sidebarWidth: 240,
      sidebarMinWidth: 96,
      title: "",
      adminNav,
      userNav,
      teacherNav,
    };
  },
  computed: {
    ...mapState("sidebar", ["drawer"]),
    DRAWER_STATE: {
      get() {
        return this.drawer;
      },
      set(newValue) {
        if (newValue === this.drawer) return;
        this.toggleDrawer();
      },
    },
  },
  methods: {
    ...mapActions("sidebar", ["toggleDrawer"]),
  },
  created() {
    console.log("userData", this.userData);
    this.title = this.userData.fullName;
  },
};
</script>

<style src="./Sidebar.scss" lang="scss" />
