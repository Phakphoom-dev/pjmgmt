<template>
  <v-container fluid class="mt-3">
    <h3>ผู้เรียน</h3>
    <v-row class="mt-3">
      <v-col>
        <v-data-table
          :loading="isLoading"
          :headers="headers"
          :items="students"
          sort-by="username"
          class="elevation-1"
          :search="search"
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>จัดการผู้เรียน</v-toolbar-title>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="ค้นหาผู้เรียน"
                single-line
                hide-details
              ></v-text-field>
              <v-spacer></v-spacer>
              <v-btn color="primary" dark class="mb-2" to="addstudent">
                เพิ่มผู้เรียน
              </v-btn>
            </v-toolbar>
          </template>

          <template slot="item.index" scope="props">
            {{ props.index + 1 }}
          </template>

          <template v-slot:item.registeredDate="{ item }">
            {{ item.regisDate | moment("DD/MM/YYYY HH:mm:ss") }}
          </template>

          <template v-slot:item.visitLog="{ item }">
            <v-icon @click="visitReport(item)" color="info">
              mdi-file-clock
            </v-icon>
          </template>

          <template v-slot:item.courseName="{ item }">
            <v-icon color="info" @click="watchSubject(item)"
              >mdi-file-edit</v-icon
            >
          </template>

          <template v-slot:item.status="{ item, index }">
            <div>
              <v-switch
                v-model="item.status"
                color="success"
                dense
                @change="changeStatus(item.status, item.stdId, index)"
              ></v-switch>
            </div>
          </template>

          <template v-slot:item.actions="{ item }">
            <v-icon class="mr-2" @click="editStd(item)" color="info">
              mdi-pencil
            </v-icon>
            <v-icon @click="deleteStudent(item)" color="error">
              mdi-delete
            </v-icon>
          </template>
          <template v-slot:no-data> ไม่พบผู้เรียน </template>
        </v-data-table>
      </v-col>
    </v-row>

    <!-- <v-row justify="center">
      <v-dialog v-model="dialog" scrollable max-width="1000px">
        <v-card>
          <v-card-title
            >หลักสูตรที่ลงทะเบียน |
            <v-btn
              color="success"
              dark
              class="ml-3"
              :to="{
                name: 'RegisterSubject',
                params: { stdId: stdId },
              }"
            >
              ลงทะเบียน
            </v-btn></v-card-title
          >

          <v-divider></v-divider>
          <v-card-text style="height: 300px">
            <v-data-table
              :headers="subjectHeaders"
              :items="subjects"
              sort-by="regisDate"
              class="elevation-1 mt-3"
              hide-default-header
            >
              <template v-slot:header="{ props: { headers } }">
                <thead>
                  <tr class="primary">
                    <th
                      v-for="h in headers"
                      class="white--text"
                      :key="h.subjectId"
                    >
                      <span>{{ h.text }}</span>
                    </th>
                  </tr>
                </thead>
              </template>

              <template slot="item.index" scope="props">
                {{ props.index + 1 }}
              </template>

              <template v-slot:item.regisDate="{ item }">
                {{ toThaiDateString(new Date(item.regisDate)) }}
              </template>

              <template v-slot:item.finishDate="{ item }">
                <v-chip
                  :class="[
                    isFinish(item.finishDate) === 'ผ่านการทดสอบ'
                      ? 'primary'
                      : 'warning',
                  ]"
                >
                  {{ isFinish(item.finishDate) }}
                </v-chip>
              </template>

              <template v-slot:no-data> ไม่พบประวัติการลงทะเบียน </template>
            </v-data-table>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-btn color="blue darken-1" text @click="dialog = false">
              ปิด
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row> -->
  </v-container>
</template>

<script>
import "@/mixins/generalMixin";

export default {
  name: "ShowStudents",
  data: () => ({
    isLoading: false,
    search: "",
    stdId: null,
    dialog: false,
    headers: [
      { text: "ลำดับที่", value: "index", sortable: false },
      {
        text: "ชื่อ-นามสกุล",
        align: "start",
        value: "fullName",
      },
      { text: "การใช้งาน", value: "status" },
      {
        text: "การเข้า-ออกระบบ",
        value: "visitLog",
        sortable: false,
        align: "center",
      },
      { text: "หลักสูตรที่ลงทะเบียน", value: "courseName", align: "center" },
      { text: "แก้ไข/ลบ", value: "actions", sortable: false },
    ],
    students: [],
    subjects: [],
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

  methods: {
    visitReport(item) {
      this.$router.push({
        name: "StudentLog",
        query: { stdId: item.stdId },
      });
    },

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

    changeStatus(status, stdId, index) {
      let stdStatus = null;
      status ? (stdStatus = 1) : (stdStatus = 0);

      let formData = new FormData();
      formData.append("status", stdStatus);
      formData.append("stdId", stdId);

      this.$http
        .post(
          `${process.env.VUE_APP_API_PATH}/student/updateStudentSta.php`,
          formData
        )
        .then((res) => {
          if (res.status === 200) {
            console.log(this.students[index]);
          }
        })
        .catch((err) => {
          this.isLoading = false;
          this.$toast.open({
            message: err.response.data.message,
            type: "warning",
            position: "top-right",
          });
          this.getAllCourse();
        });
    },

    watchSubject(item) {
      console.log(item);
      this.$router.push({
        name: "StudentSubject",
        query: { stdId: item.stdId, stdName: item.fullName },
      });
    },

    getAllStudent() {
      this.isLoading = true;

      this.$http
        .get(`${process.env.VUE_APP_API_PATH}/student/getAllStudent.php`)
        .then((res) => {
          this.isLoading = false;
          this.students = res.data;
          console.log("students", this.students);
        })
        .catch((err) => {
          this.isLoading = false;
          console.log(err);
        });
    },

    stdStaColor(status) {
      let color = "";
      switch (status) {
        case "กำลังศึกษา":
          color = "success";
          break;
        case "ยกเลิกการใช้งาน":
          color = "warning";
          break;
      }
      return color;
    },
  },

  created() {
    this.getAllStudent();
  },
};
</script>
