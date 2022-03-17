<template>
  <v-container fluid class="mt-3">
    <v-row class="mt-2" no-gutters>
      <h3>รายงาน การทำแบบทดสอบ</h3>
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
          :headers="headers"
          :items="scoreData"
          sort-by="subjectName"
          class="elevation-1"
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-btn color="info" @click="$router.go(-1)" class="mr-3"
                ><v-icon small class="mr-1">mdi-arrow-left</v-icon>
                ย้อนกลับ</v-btn
              >
              <v-toolbar-title
                >รายงานการการทำแบบทดสอบ -
                {{ $route.query.stdName }}</v-toolbar-title
              >
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-spacer></v-spacer>
            </v-toolbar>
          </template>
          <template slot="item.index" scope="props">
            {{ props.index + 1 }}
          </template>

          <template v-slot:item.makeDate="{ item }">
            {{
              toThaiDateString(new Date(item.makeDate.replace(/\s/, "T") + "Z"))
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

          <template v-slot:item.result="{ item }">
            <v-chip class="ma-2" :color="item.result ? 'success' : 'error'">
              {{ item.result ? "ผ่าน" : "ไม่ผ่าน" }}
            </v-chip>
          </template>

          <template v-slot:no-data> ไม่พบประวัติการทำแบบฝึกหัด </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "ExamReport",
  data: () => ({
    stdId: null,
    dialog: false,
    dialogDelete: false,
    scoreData: [],
    headers: [
      { text: "ลำดับที่", value: "index" },
      { text: "ชื่อหลักสูตร", value: "subjectName" },
      { text: "ผู้เรียน", value: "fullName" },
      { text: "วันที่ทำแบบทดสอบ", value: "makeDate" },
      { text: "คะแนนที่ได้", value: "stdScore" },
      { text: "คะแนนเต็ม", value: "maxScore" },
    ],
    courses: [],
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

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },
  methods: {
    visitReport() {
      this.$router.push("visitreport");
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
    editItem(item) {
      console.log(item);
      this.$router.push({
        name: "ExamQuizs",
        params: {
          quiz: item,
        },
      });
    },
    getAllStdScore() {
      this.isLoading = true;
      let formData = new FormData();
      formData.append("stdId", this.stdId);
      formData.append("lessonId", this.lessonId);

      this.$http
        .post(
          `${process.env.VUE_APP_API_PATH}/student/getAllStdTestScore.php`,
          formData
        )
        .then((res) => {
          this.isLoading = false;
          console.log("getAllStdScore", res.data);
          this.scoreData = res.data;
        })
        .catch((err) => {
          this.isLoading = false;
          console.log(err);
        });
    },
  },
  created() {
    console.log("QuizReport", this.$route.query);
    this.stdId = this.$route.query.stdId;
    this.getAllStdScore();
  },
};
</script>
