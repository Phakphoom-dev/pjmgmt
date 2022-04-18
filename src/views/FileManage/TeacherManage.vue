<template>
  <v-container fluid class="mt-3">
    <h3>จัดการเอกสารโครงงาน - {{ stdName }}</h3>
    <!-- folderDialog -->
    <v-card max-width="800" class="mx-auto" v-if="folderDialog">
      <v-toolbar :color="userData.roleId === 2 ? 'teal' : 'orange'" dark>
        <v-icon
          class="mr-2"
          v-if="$route.query.studentId"
          @click="$router.go(-1)"
          >mdi-arrow-left-thick</v-icon
        >

        <v-toolbar-title
          >จัดการเอกสารโครงงาน {{ $route.query.studentName }}</v-toolbar-title
        >

        <v-spacer></v-spacer>
      </v-toolbar>

      <v-list subheader two-line>
        <v-subheader inset>บทโครงงาน</v-subheader>

        <v-list-item
          v-for="folder in folders"
          :key="folder.title"
          @click="openFolder(folder)"
          :disabled="folder.status === 0"
        >
          <v-list-item-avatar>
            <v-icon class="grey lighten-1" dark> mdi-folder </v-icon>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title v-text="folder.title"></v-list-item-title>

            <v-list-item-subtitle
              v-text="folder.subtitle"
            ></v-list-item-subtitle>
          </v-list-item-content>

          <v-list-item-action>
            <StatusChip :status="folder.status" />
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </v-card>
    <!-- /folderDialog -->
  </v-container>
</template>

<script>
import StatusChip from "./components/StatusChip.vue";
import "@/mixins/generalMixin";
import teacherAPI from "@/api/teacher";

export default {
  name: "TeacherManage",
  components: {
    StatusChip,
  },
  data() {
    return {
      folderDialog: false,
      userData: JSON.parse(localStorage.getItem("userData")),
      folders: [],
    };
  },
  computed: {
    stdName() {
      if (this.$route.query.studentName) {
        return this.$route.query.studentName;
      } else {
        return this.userData.firstname + " " + this.userData.lastname;
      }
    },
  },
  methods: {
    openFolder(folder) {
      const { sFolderId, stdId, title } = folder;
      this.$router.push({
        name: "Chapter",
        params: { sFolderId: sFolderId, stdId: stdId, title: title },
        query: {
          roleId: this.userData.roleId,
          teacherId: this.userData.userId,
        },
      });
    },
    getStdFolder() {
      this.isLoading = true;

      let formData = new FormData();

      for (const key in this.userData) {
        formData.append(key, this.userData[key]);
      }

      formData.append("stdId", this.$route.query.stdId);

      teacherAPI
        .getStdFolder(formData)
        .then((res) => {
          this.isLoading = false;
          this.folders = res.data.stdFolder;
          console.log(res.data);
        })
        .catch((err) => {
          this.isLoading = false;
          console.log(err);
        });
    },
  },
  async created() {
    this.getStdFolder();
    console.log("query", this.$route.query);
    this.folderDialog = true;
  },
};
</script>
