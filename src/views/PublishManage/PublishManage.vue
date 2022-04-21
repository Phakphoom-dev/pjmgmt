<template>
  <v-container fluid class="mt-3">
    <h3>จัดการสถานะการเผยแพร่</h3>
    <v-row class="mt-3">
      <v-col>
        <!-- DataTable -->
        <v-data-table
          :loading="isLoading"
          :headers="stdHeader"
          :items="students"
          class="elevation-1"
          :search="search"
          :footer-props="{
            showFirstLastPage: true,
            'items-per-page-text': 'รายการต่อหน้า',
          }"
          no-results-text="ไม่พบข้อมูล"
        >
          <!-- Datatable Header -->
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>จัดการสถานะการเผยแพร่</v-toolbar-title>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="ค้นหานักศึกษา"
                single-line
                hide-details
              ></v-text-field>
              <v-spacer></v-spacer>
            </v-toolbar>
          </template>
          <!-- Datatable /Header -->

          <template slot="item.index" scope="props">
            {{ props.index + 1 }}
          </template>

          <template v-slot:item.profileImg="{ item }">
            <div class="ma-3">
              <v-img
                contain
                max-height="200"
                max-width="200"
                :src="imgPath('users', item.profileImg)"
              ></v-img>
            </div>
          </template>

          <template v-slot:item.isPublish="{ item }">
            <v-switch
              :label="item.isPublish ? 'เผยแพร่' : 'ระงับการเผยแพร่'"
              color="success"
              v-model="item.isPublish"
              @change="changeSta(item.isPublish, item.stdId)"
              hide-details
            ></v-switch>
          </template>

          <!-- Action -->
          <template v-slot:item.actions="{ item }">
            <v-icon class="mr-2" @click="editPublish(item)" color="info" large>
              mdi-folder-edit
            </v-icon>
          </template>
          <!-- /Action -->

          <template v-slot:loading> กำลังโหลดข้อมูล... </template>
          <template v-slot:no-data> ไม่พบข้อมูล </template>
        </v-data-table>
        <!-- /DataTable -->
      </v-col>
    </v-row>

    <EditPublish
      :show="showEdit"
      :editData="editData"
      @close="showEdit = false"
      title="จัดการสถานะแต่ละบท"
      :projectname="projectname"
    />
  </v-container>
</template>

<script>
import "@/mixins/generalMixin";
import userAPI from "@/api/user.js";
import fileAPI from "@/api/file.js";
import teacherAPI from "@/api/teacher.js";
import { stdHeader } from "./header";
import EditPublish from "./components/EditPublish.vue";

export default {
  name: "PublishManage",
  components: { EditPublish },
  data() {
    return {
      showEdit: false,
      editData: [],
      search: "",
      stdHeader,
      isLoading: false,
      students: [],
      projectname: "",
      userData: JSON.parse(localStorage.getItem("userData")),
    };
  },
  methods: {
    editPublish(std) {
      let formData = new FormData();
      formData.append("stdId", std.stdId);
      this.editData = std;
      this.projectname = std.projectname;

      teacherAPI
        .getStdFolder(formData)
        .then((res) => {
          this.editData = res.data.stdFolder;
          console.log("editData", this.editData);
          this.showEdit = true;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    changeSta(isPublishSta, stdId) {
      this.isLoading = true;

      let sta;
      isPublishSta ? (sta = 1) : (sta = 0);

      let formData = new FormData();
      formData.append("isPublishSta", sta);
      formData.append("stdId", stdId);

      fileAPI
        .changeIsPublishSta(formData)
        .then((res) => {
          this.isLoading = false;
          this.$toast.open({
            type: "success",
            message: res.data.message,
          });
        })
        .catch((err) => {
          this.isLoading = false;
          this.$toast.open({
            type: "error",
            message: err.response.data.message,
          });
        });
    },
    getStudents() {
      this.isLoading = true;
      userAPI
        .getPublishStudents({ role_id: 2, teacherId: this.userData.userId })
        .then((res) => {
          this.isLoading = false;
          this.students = res.data.user;
          console.log("students", this.students);
        })
        .catch((err) => {
          this.isLoading = false;
          console.log(err);
        });
    },
  },
  async created() {
    this.getStudents();
  },
};
</script>
