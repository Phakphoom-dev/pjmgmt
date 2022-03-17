<template>
  <v-container fluid class="mt-3">
    <h3>ผู้ใช้งานระบบ</h3>
    <v-row class="mt-3">
      <v-col>
        <v-data-table
          :loading="isLoading"
          :headers="headers"
          :items="admins"
          sort-by="username"
          class="elevation-1"
          :search="search"
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>จัดการผู้ใช้งานระบบ</v-toolbar-title>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="ค้นหาผู้ใช้งานระบบ"
                single-line
                hide-details
              ></v-text-field>
              <v-spacer></v-spacer>
              <v-btn color="primary" dark class="mb-2" to="adduser">
                เพิ่มผู้ใช้งาน
              </v-btn>
            </v-toolbar>
          </template>

          <template slot="item.index" scope="props">
            {{ props.index + 1 }}
          </template>

          <template v-slot:item.role="{ item }">
            <v-chip :color="userStaColor(item.role)">
              {{ item.role === "teacher" ? "อาจารย์" : "ผู้ดูแลระบบ" }}
            </v-chip>
          </template>

          <template v-slot:item.actions="{ item }">
            <v-icon class="mr-2" @click="editItem(item)" color="info">
              mdi-pencil
            </v-icon>
            <v-icon @click="deleteUser(item)" color="error">
              mdi-delete
            </v-icon>
          </template>
          <template v-slot:no-data> ไม่พบผู้ใช้งาน </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "ShowUsers",
  data: () => ({
    search: "",
    isLoading: false,
    dialog: false,
    headers: [
      { text: "ลำดับที่", value: "index" },
      {
        text: "ชื่อ-นามสกุล",
        align: "start",
        value: "fullName",
      },
      { text: "ชื่อผู้ใช้งาน", value: "username" },
      { text: "ระดับผู้ใช้งาน", value: "role" },
      { text: "แก้ไข/ลบ", value: "actions", sortable: false },
    ],
    admins: [],
    editedItem: {
      fullname: "",
      username: "",
      role: "",
    },
    defaultItem: {
      fullname: "",
      username: "",
      role: "",
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "เพิ่มผู้ใช้งาน" : "แก้ไขผู้ใช้งาน";
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  methods: {
    userStaColor(status) {
      let color = "";
      switch (status) {
        case "admin":
          color = "primary";
          break;
        case "teacher":
          color = "warning";
          break;
      }
      return color;
    },

    getAllAdmin() {
      this.isLoading = true;
      this.$http
        .get(`${process.env.VUE_APP_API_PATH}/user/getAllAdmin.php`)
        .then((res) => {
          this.isLoading = false;
          this.admins = res.data;
          this.admins = this.admins.filter(
            (admin) => admin.role !== "superAdmin"
          );
          console.log("adminData", this.admins);
        })
        .catch((err) => {
          console.log(err);
        });
    },

    addAdmin() {
      this.isLoading = true;
      let formData = new FormData();
      formData.append("username", this.username);
      formData.append("password", this.password);
      this.$http
        .post(`${process.env.VUE_APP_API_PATH}/authen/adminLogin.php`, formData)
        .then((res) => {
          this.isLoading = false;
          localStorage.setItem("userData", JSON.stringify(res.data[0]));
          localStorage.setItem("isLogin", true);
          this.$router.push("/");
        })
        .catch((err) => {
          this.isLoading = false;
          localStorage.setItem("isLogin", false);
          this.$swal({
            icon: "error",
            text: err.response.data.message,
            confirmButtonText: "ตกลง",
            allowOutSideClick: false,
          });
        });
    },

    editItem(item) {
      this.$router.push({
        name: "EditUser",
        query: { adminId: item.adminId },
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
                  this.getAllAdmin();
                  this.$toast.open("ลบผู้ใช้งานสำเร็จ");
                }
              })
              .catch((err) => {
                this.isLoading = false;
                this.$swal({
                  icon: "error",
                  text: err.response.data.message,
                  confirmButtonText: "ตกลง",
                  allowOutsideClick: false,
                });
                console.log(err);
              });
          } else if (result.isDenied) {
            return;
          }
        });
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.admins[this.editedIndex], this.editedItem);
      } else {
        this.admins.push(this.editedItem);
      }
      this.close();
    },
  },
  created() {
    this.getAllAdmin();
  },
};
</script>
