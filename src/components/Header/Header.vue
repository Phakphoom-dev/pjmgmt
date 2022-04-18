<template>
  <v-app-bar class="main-header" height="64" fixed color="primary" dark>
    <v-btn
      icon
      class="mx-1"
      @click.stop="toggleDrawer"
      v-if="$vuetify.breakpoint.smAndDown"
    >
      <template>
        <v-icon style="font-size: 28px">mdi-menu</v-icon>
      </template>
    </v-btn>

    <v-toolbar-title>{{ title }}</v-toolbar-title>
    <v-spacer></v-spacer>

    <!-- <v-menu offset-y bottom nudge-bottom="10" left>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          @click="
            notificationsBadge ? (notificationsBadge = !notificationsBadge) : ''
          "
          v-bind="attrs"
          v-on="on"
          style="font-size: 28px"
          icon
          class="mr-2"
        >
          <v-badge
            :value="notificationsBadge"
            color="error"
            content="4"
            overlap
          >
            <v-icon style="font-size: 28px" color="rgba(255, 255, 255, 0.35)"
              >mdi-bell-outline</v-icon
            >
          </v-badge>
        </v-btn>
      </template>
      <v-list>
        <v-list-item-group color="primary">
          <v-list-item v-for="(item, i) in notifications" :key="i">
            <v-list-item-icon class="mr-4 mb-1">
              <v-icon :color="item.color" v-text="item.icon"> </v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title v-text="item.text"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-menu> -->
    <v-menu
      offset-y
      origin="center center"
      class="elelvation-1"
      transition="scale-transition"
    >
      <template #activator="{ on }">
        <v-btn slot="activator" icon text v-on="on">
          <v-badge color="red" overlap>
            <span slot="badge">{{ notifications.length }}</span>
            <v-icon medium>mdi-bell</v-icon>
          </v-badge>
        </v-btn>
      </template>
      <notification-list
        v-show="notifications.length > 0"
        :items="notifications"
      />
    </v-menu>

    <v-menu min-width="180" offset-y bottom left nudge-bottom="10">
      <template v-slot:activator="{ on, attrs }">
        <v-btn class="mr-0" icon v-bind="attrs" v-on="on">
          <v-icon style="font-size: 28px">mdi-account</v-icon>
        </v-btn>
      </template>
      <v-list>
        <div class="text-subttitle grey--text text--darken-3 px-4 pt-4">
          {{ userData.fullName }}
        </div>
        <div class="d-flex justify-center my-3">
          <v-btn
            width="80%"
            large
            outlined
            color="primary"
            class="text-capitalize mt-2"
            @click="logout"
            >Sign Out
          </v-btn>
        </div>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script>
import { mapActions, mapState } from "vuex";
import NotificationList from "@/components/list/NotificationList";

export default {
  name: "Header",
  components: {
    NotificationList,
  },
  data: () => ({
    title: "ระบบบริหารจัดการโครงงาน มหาวิทยาลัยฟาร์อีสเทอร์น",
    userData: JSON.parse(localStorage.getItem("userData")),
    searchCollapse: true,
    notificationsBadge: true,
    messageBadge: true,
    polling: null,
  }),
  computed: {
    ...mapState("header", ["notifications"]),
    NOTIFICATIONS_STATE: {
      get() {
        return this.notifications;
      },
    },
  },
  methods: {
    ...mapActions("sidebar", ["toggleDrawer"]),
    ...mapActions("header", ["getNotifications"]),

    logout() {
      window.localStorage.setItem("userData", null);
      window.localStorage.setItem("isLogin", false);
      this.$router.push("/login");
    },

    intervalNotification() {
      const payload = {
        userId: this.userData.userId,
        roleId: this.userData.roleId,
      };

      this.polling = setInterval(() => {
        console.log(payload.userId);
        this.getNotifications(payload);
      }, 3000);
    },
  },

  created() {
    const payload = {
      userId: this.userData.userId,
      roleId: this.userData.roleId,
    };

    this.getNotifications(payload);
    this.intervalNotification();
  },

  beforeDestroy() {
    clearInterval(this.polling);
  },
};
</script>
