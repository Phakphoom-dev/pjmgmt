<template>
  <div>
    <v-navigation-drawer v-model="drawer" fixed app temporary>
      <v-list dense>
        <v-list-item-group v-for="(item, i) in items" :key="i" color="primary">
          <v-list-item v-if="!item.submenu" :to="item.to">
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title v-text="item.title.toUpperCase()" />
            </v-list-item-content>
          </v-list-item>
          <v-list-group v-else :prepend-icon="item.icon" no-action>
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title
                  v-text="item.title.toUpperCase()"
                ></v-list-item-title>
              </v-list-item-content>
            </template>
            <v-list-item
              v-for="child in item.submenu"
              :key="child.title"
              :to="child.to"
            >
              <v-list-item-content>
                <v-list-item-title v-text="child.title"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      color="light-blue darken-4"
      fixed
      dark
      app
      hide-on-scroll
      height="64"
      elevate-on-scroll
    >
      <v-app-bar-nav-icon class="hidden-md-and-up" @click="drawer = true" />
      <v-toolbar-title
        >ระบบค้นหาโครงงาน มหาวิทยาลัยฟาร์อีสเทอร์น</v-toolbar-title
      >
      <router-link
        to="/"
        class="d-flex primary--text"
        style="text-decoration: none"
      >
        <h3>{{ title }}</h3>
      </router-link>
      <v-spacer />

      <template v-for="(name, menuitem) in items">
        <template v-if="name.submenu">
          <v-menu
            :key="menuitem"
            open-on-hover
            offset-y
            transition="slide-y-transition"
            bottom
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                plain
                class="py-8 submenubtn hidden-sm-and-down"
                :ripple="false"
                v-bind="attrs"
                v-on="on"
              >
                {{ name.title }}
                <v-icon right small class="mx-0"> mdi-chevron-down </v-icon>
              </v-btn>
            </template>
            <v-list dense>
              <v-list-item
                v-for="(item, index) in name.submenu"
                :key="index"
                link
                :to="item.to"
              >
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
        <v-btn
          v-else
          :key="menuitem"
          depressed
          tile
          plain
          class="py-8 hidden-sm-and-down"
          :to="name.to"
          >{{ name.title }}</v-btn
        >
      </template>
      <v-spacer />

      <div v-if="userData">
        <v-list-item-avatar>
          <v-avatar size="36px">
            <img :src="imgPath('users', userData.profileImg)" alt="UserImg" />
          </v-avatar>
        </v-list-item-avatar>
        {{ userData.fullName }}
        <!-- <v-btn color="primary" to="/login" v-if="!isUser"> เข้าสู่ระบบ </v-btn> -->
        <v-btn class="ml-2" color="error" @click="logout" small>
          ออกจากระบบ
        </v-btn>
      </div>
      <div v-else>
        <v-btn
          class="ml-2"
          color="primary"
          @click="$router.push('/login')"
          small
        >
          เข้าสู่ระบบ
        </v-btn>
      </div>
    </v-app-bar>
  </div>
</template>

<script>
import "@/mixins/generalMixin";

export default {
  name: "siteHeader",
  props: ["title"],
  data() {
    return {
      userData: JSON.parse(localStorage.getItem("userData")),
      isUser: false,
      studentData: {},
      clipped: false,
      drawer: false,
      items: [
        // {
        //   icon: "mdi-folder-home-outline",
        //   title: "หน้าแรก",
        //   to: "/index",
        // },
        {
          icon: "mdi-folder-image",
          title: "ค้นหาโครงงาน",
          to: "/collection",
        },
        // {
        //   icon: "mdi-account",
        //   title: "เกี่ยวกับเรา",
        //   to: "/about-us",
        // },
      ],
    };
  },
  methods: {
    logout() {
      window.localStorage.setItem("userData", null);
      window.localStorage.setItem("isLogin", false);
      this.$router.push("/login");
    },

    toMyCourse() {
      this.$router.push({
        name: "MySubject",
      });
    },
  },
  created() {
    if (this.userData.roleId === 2) {
      this.items.push({
        icon: "mdi-contacts",
        title: "จัดการเอกสาร",
        to: "file-manage",
      });
    }

    if (this.userData.roleId === 3) {
      this.items.push({
        icon: "mdi-contacts",
        title: "จัดการเอกสารนักศึกษา",
        to: "student-manage",
      });
    }

    console.log(this.items);
    console.log("userData", this.userData);
  },
};
</script>

<style scoped>
.submenubtn {
  cursor: default;
}
</style>
