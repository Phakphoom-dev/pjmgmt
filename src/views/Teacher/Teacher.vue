<template>
  <v-container fluid class="mt-3">
    <h3>จัดการข้อมูลอาจารย์</h3>
    <v-row class="mt-3">
      <v-col>
        <!-- DataTable -->
        <v-data-table
          :loading="isLoading"
          :headers="teacherHeader"
          :items="teachers"
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
              <v-toolbar-title>จัดการข้อมูลอาจารย์</v-toolbar-title>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="ค้นหาอาจารย์"
                single-line
                hide-details
              ></v-text-field>
              <v-spacer></v-spacer>
              <v-btn color="primary" dark class="mb-2" @click="openAddModal">
                เพิ่มข้อมูลอาจารย์
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
            <v-icon @click="deleteteacher(item)" color="error">
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
    <EditTeacher
      :teaDialog="teaDialog"
      :teacher="teacher"
      @close="close"
      @open="teaDialog = true"
      @getTeachers="getTeachers"
      @submit="submit"
      :action="action"
      :resetValid="resetValid"
      :prefix="prefix"
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
import EditTeacher from "./components/EditTeacher";
import { teacherHeader } from "./teacher";
import DeleteDialog from "@/components/DeleteDialog";
import "@/mixins/generalMixin";
import userAPI from "@/api/user";

export default {
  name: "Teacher",
  components: {
    DeleteDialog,
    EditTeacher,
  },
  data() {
    return {
      teacherHeader,
      showDelete: false,
      action: "",
      isLoading: false,
      search: "",
      teachers: [],
      prefix: [],
      teaDialog: false,
      resetValid: false,
      teacher: {},
      deleteData: {},
    };
  },
  methods: {
    close() {
      this.teaDialog = false;
      this.teacher = {};
      this.resetValid = false;
      this.getTeachers();
    },
    openAddModal() {
      this.action = "add";
      this.teaDialog = true;
      this.resetValid = true;
    },
    editUser(user) {
      this.action = "edit";
      this.teaDialog = true;
      this.teacher = user;
      this.teacher.oldImg = user.profileImg;
    },
    deleteteacher(user) {
      this.deleteData = user;
      this.showDelete = true;
    },
    deleteUser() {
      let formData = new FormData();
      formData.append("teacherId", this.deleteData.teacherId);

      userAPI
        .deleteTeacher(formData)
        .then((res) => {
          this.isLoading = false;
          this.$toast.open({
            type: "success",
            message: res.data.message,
          });
          this.showDelete = false;
          this.getTeachers();
        })
        .catch((err) => {
          if (err.response.data.code === 23000) {
            this.$toast.open({
              type: "warning",
              message: err.response.data.message,
            });
          }

          if (err.response.data.code === 500) {
            this.$toast.open({
              type: "error",
              message: err.response.data.message,
            });
          }

          this.isLoading = false;
          this.showDelete = false;

          console.log(err);
        });
      this.isLoading = true;
    },
    getTeachers() {
      this.isLoading = true;
      userAPI
        .getTeachers({ role_id: 3 })
        .then((res) => {
          this.isLoading = false;
          this.teachers = res.data.teacher;
          this.prefix = res.data.tPrefix;
          console.log("teachers", this.teachers);
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
    this.getTeachers();
  },
};
</script>
