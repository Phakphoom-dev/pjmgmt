<template>
  <v-container fluid class="mt-3">
    <v-row class="mt-2" no-gutters>
      <h3>รายงาน</h3>
    </v-row>

    <!-- <v-row>
      <v-col>
        <v-btn color="secondary" to="courses">จัดการหลักสูตร</v-btn>
        <v-btn color="primary" class="ml-2" to="courses/subjects"
          >จัดการรายวิชา</v-btn
        >
        <v-btn color="secondary" class="ml-2">จัดการบทเรียน</v-btn>
      </v-col>
    </v-row> -->

    <v-row class="mt-3">
      <v-col>
        <v-data-table
          :loading="isLoading"
          :headers="headers"
          :items="students"
          sort-by="username"
          class="elevation-1"
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>รายงาน/สรุป</v-toolbar-title>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-spacer></v-spacer>
              <v-dialog v-model="dialog" max-width="500px">
                <v-card>
                  <v-card-title>
                    <span class="text-h5">{{ formTitle }}</span>
                  </v-card-title>

                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field
                            v-model="editedItem.courseName"
                            label="ชื่อหลักสูตร"
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
                    <v-btn color="blue darken-1" text> ยกเลิก </v-btn>
                    <v-btn color="blue darken-1" text> ยืนยัน </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-toolbar>
          </template>
          <template slot="item.index" scope="props">
            {{ props.index + 1 }}
          </template>

          <template v-slot:item.regisDate="{ item }">
            {{
              toThaiDateString(
                new Date(item.regisDate.replace(/\s/, "T") + "Z")
              )
            }}
          </template>

          <template v-slot:item.active="{ item }">
            <div>
              <v-switch
                v-model="item.active"
                color="success"
                :error="!item.active"
                dense
              ></v-switch>
            </div>
          </template>

          <template v-slot:item.courseName="{ item }">
            <v-icon color="info" @click="watchSubject(item)"
              >mdi-file-edit</v-icon
            >
          </template>

          <template v-slot:item.quizLog="{ item }">
            <v-icon @click="quizReport(item)" color="info"> mdi-eye </v-icon>
          </template>
          <template v-slot:item.examLog="{ item }">
            <v-icon @click="examReport(item)" color="info"> mdi-eye </v-icon>
          </template>
          <template v-slot:item.status="{ item }">
            <v-chip :color="stdStaColor(item.status)">
              {{ item.status === 1 ? "On" : "Off" }}
            </v-chip>
          </template>
          <template v-slot:no-data> ไม่พบผู้สอน </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import "@/mixins/generalMixin";

export default {
  name: "ShowReports",
  data: () => ({
    isLoading: false,
    dialog: false,
    dialogDelete: false,
    headers: [
      { text: "ลำดับที่", value: "index" },
      { text: "ชื่อ-นามสกุล", value: "fullName" },
      { text: "อีเมล", value: "email" },
      { text: "วันที่สมัคร", value: "regisDate" },
      {
        text: "หลักสูตรที่ลงทะเบียน",
        value: "courseName",
        sortable: false,
        align: "center",
      },
      {
        text: "การทำแบบฝึกหัด",
        value: "quizLog",
        sortable: false,
        align: "center",
      },
      {
        text: "การทำแบบทดสอบ",
        value: "examLog",
        sortable: false,
        align: "center",
      },
      { text: "สถานะการใช้งาน", value: "status" },
    ],
    courses: [],
    students: [],
    editedIndex: -1,
    editedItem: {
      subjectName: "",
      active: true,
    },
    defaultItem: {
      subjectName: "",
      active: true,
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "เพิ่มหลักสูตร" : "แก้ไขหลักสูตร";
    },
  },

  methods: {
    watchSubject(item) {
      console.log(item);
      this.$router.push({
        name: "SubjectReport",
        query: {
          stdId: item.stdId,
          stdName: item.fullName,
        },
      });
    },

    quizReport(item) {
      console.log(item);
      this.$router.push({
        name: "QuizReport",
        query: {
          stdId: item.stdId,
          stdName: item.fullName,
        },
      });
    },
    examReport(item) {
      console.log(item);
      this.$router.push({
        name: "QuizReport",
        query: {
          stdId: item.stdId,
          stdName: item.fullName,
          action: "exam",
        },
      });
    },
    stdStaColor(status) {
      let color = "";
      switch (status) {
        case 1:
          color = "success";
          break;
        case 0:
          color = "error";
          break;
      }
      return color;
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
  },
  created() {
    this.getAllStudent();
  },
};
</script>
