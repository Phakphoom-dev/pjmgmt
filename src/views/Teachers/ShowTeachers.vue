<template>
  <v-container fluid class="mt-3">
    <h3>ผู้สอน</h3>
    <v-row class="mt-3">
      <v-col>
        <v-data-table
          :headers="headers"
          :items="teachers"
          sort-by="username"
          class="elevation-1"
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>จัดการผู้สอน</v-toolbar-title>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-spacer></v-spacer>
              <v-btn color="primary" dark class="mb-2" to="addteacher">
                เพิ่มผู้สอน
              </v-btn>
            </v-toolbar>
          </template>
          <template slot="item.index" scope="props">
            {{ props.index + 1 }}
          </template>

          <template v-slot:item.active="{ item, index }">
            <div>
              <v-switch
                v-model="item.status"
                color="success"
                dense
                @change="changeStatus(item.status, item.adminId, index)"
              ></v-switch>
            </div>
          </template>

          <template v-slot:item.actions="{ item }">
            <v-icon small class="mr-2" @click="editUser(item)" color="info">
              mdi-pencil
            </v-icon>
            <v-icon small @click="deleteUser(item)" color="error">
              mdi-delete
            </v-icon>
          </template>
          <template v-slot:no-data> ไม่พบผู้สอน </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "ShowTeachers",
  data: () => ({
    headers: [
      { text: "ลำดับที่", value: "index" },
      {
        text: "ชื่อ-นามสกุล",
        align: "start",
        value: "fullName",
      },
      { text: "การใช้งาน", value: "active" },
      { text: "แก้ไข/ลบ", value: "actions", sortable: false },
    ],
    teachers: [],
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "เพิ่มผู้สอน" : "แก้ไขผู้สอน";
    },
  },

  methods: {
    editUser(item) {
      this.$router.push({
        name: "EditTeacher",
        query: { adminId: item.adminId },
      });
    },

    changeStatus(status, adminId, index) {
      console.log(index);
      let adminStatus = null;
      status ? (adminStatus = 1) : (adminStatus = 0);

      let formData = new FormData();
      formData.append("status", adminStatus);
      formData.append("adminId", adminId);

      this.$http
        .post(`${process.env.VUE_APP_API_PATH}/user/updateTeaSta.php`, formData)
        .then((res) => {
          if (res.status === 200) {
            console.log(this.teachers[index]);
          }
        })
        .catch((err) => {
          this.isLoading = false;
          this.$swal({
            icon: "error",
            text: err.response.data.message,
            confirmButtonText: "ตกลง",
            allowOutSideClick: false,
          });
        });
    },

    getAllTeacher() {
      this.$http
        .get(`${process.env.VUE_APP_API_PATH}/user/getAllAdmin.php`)
        .then((res) => {
          this.teachers = res.data;
          this.teachers = this.teachers.filter((teacher) => {
            return teacher.role === "teacher";
          });
          console.log("teachers", this.teachers);
        })
        .catch((err) => {
          console.log(err);
        });
    },

    deleteUser(item) {
      this.$swal
        .fire({
          title: `ต้องการที่จะลบ ${item.fullName} หรือไม่`,
          showDenyButton: true,
          confirmButtonText: "ยืนยัน",
          denyButtonText: `ยกเลิก`,
        })
        .then((result) => {
          if (result.isConfirmed) {
            const jsonData = JSON.stringify({
              adminId: item.adminId,
            });

            this.$http
              .post(
                `${process.env.VUE_APP_API_PATH}/user/deleteAdmin.php`,
                jsonData
              )
              .then((res) => {
                if (res.status === 200) {
                  this.getAllTeacher();
                }
              })
              .catch((err) => {
                this.isLoading = false;
                console.log(err);
              });
          } else if (result.isDenied) {
            return;
          }
        });
    },
  },
  created() {
    this.getAllTeacher();
  },
};
</script>
