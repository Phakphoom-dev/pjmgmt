<template>
  <v-card tile class="notes" width="500">
    <v-toolbar tile flat>
      <v-subheader>การแจ้งเตือน</v-subheader>
      <v-spacer />
      <v-btn text @click="clear">clear</v-btn>
    </v-toolbar>
    <v-divider />
    <v-card-text class="pa-0">
      <v-list dense class="pa-0 notes_list">
        <template v-for="(item, index) in items">
          <v-list-item
            :key="index"
            @click="goToChat(item.sFolderId, item.fs_name, item.sCommentId)"
          >
            <v-list-item-avatar :color="item.color">
              <v-icon dark>{{ item.icon }}</v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-subtitle v-html="item.title"></v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action class="caption">
              {{ item.timeLabel }}
            </v-list-item-action>
          </v-list-item>
          <v-divider :key="'d' + index" />
        </template>
      </v-list>
      <v-divider></v-divider>
      <v-btn block text class="ma-0">All</v-btn>
      <v-divider></v-divider>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapActions } from "vuex";

export default {
  props: {
    items: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      userData: JSON.parse(localStorage.getItem("userData")),
    };
  },

  methods: {
    ...mapActions("header", ["clearNotifications", "removeNotification"]),

    clear() {
      const payload = {
        userId: this.userData.userId,
        roleId: this.userData.roleId,
      };

      this.clearNotifications(payload);
    },

    goToChat(sFolderId, fs_name, sCommentId) {
      if (this.userData.roleId === 2) {
        this.removeNotification(sCommentId);
        this.$router.push({
          name: "Chapter",
          params: {
            sFolderId: sFolderId,
            stdId: this.userData.userId,
            title: fs_name,
            fromNotification: true,
          },
        });
        console.log("True");
      }

      if (this.userData.roleId === 3) {
        this.removeNotification(sCommentId);
        this.$router.push({
          name: "Chapter",
          params: {
            sFolderId: sFolderId,
            stdId: this.userData.userId,
            title: fs_name,
            fromNotification: true,
          },
          query: {
            roleId: this.userData.roleId,
            teacherId: this.userData.userId,
          },
        });
      }
    },

    handleClearNotification() {},
  },
};
</script>
<style lang="sass" scoped>
.notes_list
  max-height: 360px
  overflow-y: auto
</style>
