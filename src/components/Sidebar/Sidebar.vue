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

    <v-list nav dense>
      <v-list-item
        v-for="item in navItems"
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
  </v-navigation-drawer>
</template>

<script>
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
      navItems: [
        { title: "หน้าหลัก", icon: "mdi-home", link: "/" },
        { title: "ตั้งค่า", icon: "mdi-cog", link: "/super-settings" },
        {
          title: "ผู้ใช้งานระบบ",
          icon: "mdi-account-group",
          link: "/users",
        },
        {
          title: "ผู้สอน",
          icon: "mdi-briefcase-account",
          link: "/teachers",
        },
        {
          title: "ผู้เรียน",
          icon: "mdi-folder-account",
          link: "/students",
        },
        {
          title: "คอร์สหลัก",
          icon: "mdi-book-open",
          link: "/courses",
          children: [
            { title: "Icons", icon: "mdi-circle-small", link: "/icons" },
            { title: "Charts", icon: "mdi-circle-small", link: "/charts" },
            { title: "Maps", icon: "mdi-circle-small", link: "/maps" },
          ],
        },
        {
          title: "หลักสูตร",
          icon: "mdi-book-open",
          link: "/subjects",
        },
        {
          title: "บทเรียน",
          icon: "mdi-book-open",
          link: "/lessons",
        },
        {
          title: "วิดีโอ",
          icon: "mdi-camera",
          link: "/videos",
        },
        {
          title: "แบบฝึกหัด",
          icon: "mdi-head-question",
          link: "/quizs",
        },
        {
          title: "แบบทดสอบ",
          icon: "mdi-head-question",
          link: "/test",
        },
        {
          title: "รายงาน",
          icon: "mdi-chart-bar",
          link: "/#",
        },
        {
          title: "จัดการสไลด์โชว์",
          icon: "mdi-email-newsletter",
          link: "/settings",
        },
        {
          title: "จัดการเกี่ยวกับเรา",
          icon: "mdi-account",
          link: "/about",
        },
        {
          title: "จัดการติดต่อเรา",
          icon: "mdi-card-account-phone",
          link: "/contact",
        },
      ],
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
    checkRoleMenu(role, navItems) {
      if (role === "admin") {
        this.navItems = navItems.filter((navItem) => {
          return (
            navItem.title !== "ผู้ใช้งานระบบ" &&
            navItem.title !== "คอร์สหลัก" &&
            navItem.title !== "ตั้งค่า"
          );
        });
      } else if (role === "teacher") {
        this.navItems = [
          {
            title: "บทเรียน",
            icon: "mdi-book-open",
            link: "/lessons",
          },
          {
            title: "แบบฝึกหัด",
            icon: "mdi-head-question",
            link: "/quizs",
          },
          {
            title: "แบบทดสอบ",
            icon: "mdi-head-question",
            link: "/exams",
          },
          {
            title: "รายงาน",
            icon: "mdi-chart-bar",
            link: "/reports",
          },
          {
            title: "จัดการติดต่อเรา",
            icon: "mdi-contact",
            link: "/contact",
          },
        ];
      }
    },
  },
  created() {
    this.title = this.userData.fullName;
    console.log("userData", this.userData);
    this.checkRoleMenu(this.userData.role, this.navItems);
  },
};
</script>

<style src="./Sidebar.scss" lang="scss" />
