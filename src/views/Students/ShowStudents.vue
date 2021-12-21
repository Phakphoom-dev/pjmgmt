<template>
  <v-container fluid class="mt-3">
    <h3>ผู้เรียน</h3>
    <v-row class="mt-3">
      <v-col>
        <v-data-table
          :headers="headers"
          :items="students"
          sort-by="username"
          class="elevation-1"
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>จัดการเรียน</v-toolbar-title>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-spacer></v-spacer>
              <v-dialog v-model="dialog" max-width="500px">
                <template v-slot:activator="{}">
                  <v-btn color="primary" dark class="mb-2" to="addstudent">
                    เพิ่มผู้เรียน
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title>
                    <span class="text-h5">{{ formTitle }}</span>
                  </v-card-title>

                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field
                            v-model="editedItem.fullname"
                            label="ชื่อ-นามสกุล"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-switch
                            v-model="editedItem.active"
                            color="success"
                            :error="!editedItem.active"
                            label="การใช้งาน"
                          ></v-switch>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="close">
                      ยกเลิก
                    </v-btn>
                    <v-btn color="blue darken-1" text @click="save">
                      ยืนยัน
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <v-dialog v-model="dialogDelete" max-width="500px">
                <v-card>
                  <v-card-title class="text-h5"
                    >ต้องการลบผู้สอนหรือไม่ ?</v-card-title
                  >
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="closeDelete"
                      >ยกเลิก</v-btn
                    >
                    <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                      >ยืนยัน</v-btn
                    >
                    <v-spacer></v-spacer>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-toolbar>
          </template>

          <template slot="item.index" scope="props">
            {{ props.index + 1 }}
          </template>

          <template v-slot:item.stdImg="{ item }">
            <div class="ma-3">
              <v-img
                max-height="150"
                max-width="250"
                :src="stdImgPath(item.stdImg)"
              ></v-img>
            </div>
          </template>

          <template v-slot:item.registeredDate="{ item }">
            {{ item.regisDate | moment("DD/MM/YYYY HH:mm:ss") }}
          </template>

          <template v-slot:item.courseName="{ item }">
            <v-chip color="info" @click="watchCourse(item)">
              หลักสูตรที่ลงทะเบียน
            </v-chip>
          </template>

          <template v-slot:item.actions="{ item }">
            <v-icon small class="mr-2" @click="editStd(item)" color="info">
              mdi-pencil
            </v-icon>
            <v-icon small @click="deleteStudent(item)" color="error">
              mdi-delete
            </v-icon>
          </template>
          <template v-slot:no-data> ไม่พบผู้เรียน </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import "@/mixins/generalMixin";

export default {
  name: "ShowStudents",
  data: () => ({
    imgPath: process.env.VUE_APP_IMG_PATH,
    dialog: false,
    dialogDelete: false,
    headers: [
      { text: "ลำดับที่", value: "index", sortable: false },
      { text: "รูปภาพ", value: "stdImg", sortable: false },
      {
        text: "ชื่อ-นามสกุล",
        align: "start",
        value: "fullName",
      },
      { text: "เวลาที่สมัคร", value: "registeredDate" },
      { text: "หลักสูตรที่ลงทะเบียน", value: "courseName" },
      { text: "แก้ไข/ลบ", value: "actions", sortable: false },
    ],
    students: [],
    editedIndex: -1,
    editedItem: {
      fullname: "",
      active: true,
    },
    defaultItem: {
      fullname: "",
      active: true,
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "เพิ่มผู้สอน" : "แก้ไขผู้สอน";
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
    deleteStudent(item) {
      this.$swal
        .fire({
          title: `ต้องการลบ ${item.fullName} หรือไม่`,
          showDenyButton: true,
          confirmButtonText: "ยืนยัน",
          denyButtonText: `ยกเลิก`,
        })
        .then((result) => {
          if (result.isConfirmed) {
            const jsonData = JSON.stringify({
              stdId: item.stdId,
              stdImg: item.stdImg,
            });

            this.$http
              .post(
                `${process.env.VUE_APP_API_PATH}/student/deleteStudent.php`,
                jsonData
              )
              .then((res) => {
                if (res.status === 200) {
                  this.getAllStudent();
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
          } else if (result.isDenied) {
            return;
          }
        });
    },
    editStd(item) {
      this.$router.push({
        name: "EditStudent",
        query: { stdId: item.stdId },
      });
    },
    watchCourse(item) {
      const jsonData = JSON.stringify({ stdId: item.stdId });

      this.$http
        .post(
          `${process.env.VUE_APP_API_PATH}/student/getAllStdCourse.php`,
          jsonData
        )
        .then((res) => {
          this.$swal.fire({
            title: `${res.data.map((course) => " " + course.courseName)}`,
            showConfirmButton: false,
          });
        })
        .catch((err) => {
          this.isLoading = false;
          console.log(err);
        });
    },
    getAllStudent() {
      this.$http
        .get(`${process.env.VUE_APP_API_PATH}/student/getAllStudent.php`)
        .then((res) => {
          this.students = res.data;
          console.log("students", this.students);
        })
        .catch((err) => {
          console.log(err);
        });
    },

    stdStaColor(status) {
      let color = "";
      switch (status) {
        case "กำลังศึกษา":
          color = "primary";
          break;
        case "รอการยืนยัน":
          color = "warning";
          break;
        case "สำเร็จการศึกษา":
          color = "success";
          break;
        case "ยกเลิก":
          color = "error";
          break;
        default:
          color = "grey";
          break;
      }
      return color;
    },
    editItem() {
      this.$router.push("addteacher");
    },

    deleteItem(item) {
      this.editedIndex = this.teachers.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.teachers.splice(this.editedIndex, 1);
      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.teachers[this.editedIndex], this.editedItem);
      } else {
        this.teachers.push(this.editedItem);
      }
      this.close();
    },
  },

  created() {
    this.getAllStudent();
  },
};
</script>
