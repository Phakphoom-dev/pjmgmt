<template>
  <v-container fluid class="mt-3">
    <h3>จัดการข้อมูลนักศึกษา</h3>
    <v-row class="mt-3">
      <v-col>
        <!-- DataTable -->
        <v-data-table
          :loading="isLoading"
          :headers="userHeader"
          :items="users"
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
              <v-toolbar-title>จัดการข้อมูลนักศึกษา</v-toolbar-title>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="ค้นหานักศึกษา"
                single-line
                hide-details
              ></v-text-field>
              <v-spacer></v-spacer>
              <v-btn color="primary" dark class="mb-2" @click="openAddModal">
                เพิ่มข้อมูลนักศึกษา
              </v-btn>
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

          <!-- Action -->
          <template v-slot:item.actions="{ item }">
            <v-icon class="mr-2" @click="editUser(item)" color="info">
              mdi-pencil
            </v-icon>
            <v-icon @click="deleteStudent(item)" color="error">
              mdi-delete
            </v-icon>
          </template>
          <!-- /Action -->

          <template v-slot:loading> กำลังโหลดข้อมูล... </template>
          <template v-slot:no-data> ไม่พบข้อมูล </template>
        </v-data-table>
        <!-- /DataTable -->
      </v-col>
    </v-row>

    <!-- Edit Modal -->
    <EditStudent
      :stdDialog="stdDialog"
      :student="student"
      @close="close"
      @open="stdDialog = true"
      @getUsers="getUsers"
      @submit="submit"
      :action="action"
      :resetValid="resetValid"
      :prefix="prefix"
      :faculty="faculty"
      :projectType="projectType"
    />
    <!-- /Edit Modal -->

    <!-- Delete Modal -->
    <DeleteDialog
      :showDelete="showDelete"
      @closeDelete="showDelete = false"
      @confirmDelete="deleteUser"
    />
    <!-- /Delete Modal -->
  </v-container>
</template>

<script>
import { userHeader } from "./user";
import EditStudent from "./components/EditStudent.vue";
import DeleteDialog from "@/components/DeleteDialog";
import "@/mixins/generalMixin";
import userAPI from "@/api/user";

export default {
  name: "User",
  components: {
    EditStudent,
    DeleteDialog,
  },
  data() {
    return {
      projectType: [],
      faculty: [],
      prefix: [],
      showDelete: false,
      action: "",
      isLoading: false,
      search: "",
      userHeader,
      users: [],
      stdDialog: false,
      resetValid: false,
      student: {},
      deleteData: {},
    };
  },
  methods: {
    close() {
      this.stdDialog = false;
      this.student = {};
      this.resetValid = false;
      this.getUsers();
    },

    openAddModal() {
      this.action = "add";
      this.stdDialog = true;
      this.resetValid = true;
    },

    editUser(user) {
      this.action = "edit";
      this.stdDialog = true;
      this.student = user;
      this.student.oldImg = user.profileImg;
    },

    deleteStudent(user) {
      this.deleteData = user;
      this.showDelete = true;
      console.log("deleteData", this.deleteData);
    },

    deleteUser() {
      let formData = new FormData();
      formData.append("stdId", this.deleteData.stdId);

      userAPI
        .delete(formData)
        .then((res) => {
          this.isLoading = false;
          this.$toast.open({
            type: "success",
            message: res.data.message,
          });
          this.showDelete = false;
          this.getUsers();
        })
        .catch((err) => {
          this.isLoading = false;
          this.showDelete = false;
          this.$toast.open({
            type: "error",
            message: err.response.data.message,
          });
          console.log(err);
        });
      this.isLoading = true;
    },
    getUsers() {
      this.isLoading = true;
      userAPI
        .getStudents({ role_id: 2 })
        .then((res) => {
          this.isLoading = false;
          this.users = res.data.user;
          this.prefix = res.data.prefix;
          this.faculty = res.data.faculty;
          this.projectType = res.data.projectType;
          console.log(this.users);
          console.log("users", this.users);
        })
        .catch((err) => {
          this.isLoading = false;
          console.log(err);
        });
    },
    submit(payload) {
      console.log(payload);
    },
  },
  created() {
    this.getUsers();
  },
};
</script>
