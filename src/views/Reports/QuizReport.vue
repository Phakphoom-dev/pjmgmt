<template>
  <v-container fluid class="mt-3">
    <v-row class="mt-2" no-gutters>
      <h3>
        รายงาน
        {{ pageTitle }}
      </h3>
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
          sort-by="subjectId"
          class="elevation-1"
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-btn color="info" @click="$router.go(-1)" class="mr-3"
                ><v-icon small class="mr-1">mdi-arrow-left</v-icon>
                ย้อนกลับ</v-btn
              >
              <v-toolbar-title
                >{{ pageTitle }} - {{ $route.query.stdName }}</v-toolbar-title
              >
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-spacer></v-spacer>
            </v-toolbar>
          </template>
          <template slot="item.index" scope="props">
            {{ props.index + 1 }}
          </template>

          <template v-slot:item.actions="{ item }">
            <v-icon class="mr-2" @click="toLessonLog(item)" color="info">
              mdi-text-box-outline
            </v-icon>
          </template>

          <template v-slot:no-data> ไม่พบหลักสูตรของผู้เรียน </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "QuizReport",
  data: () => ({
    stdId: null,
    dialog: false,
    dialogDelete: false,
    scoreData: [],
    headers: [
      { text: "ลำดับที่", value: "index" },
      { text: "subjectId", value: "subjectId", align: " d-none" },
      { text: "ชื่อหลักสูตร", value: "subjectName" },
      { text: "ดูรายการทำแบบฝึกหัด", value: "actions" },
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
    pageTitle() {
      return this.$route.query.action === "exam"
        ? "การทำแบบทดสอบ"
        : "การทำแบบฝึกหัด";
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
    toLessonLog(item) {
      if (this.$route.query.action === "exam") {
        this.$router.push({
          name: "ViewExamScore",
          query: {
            stdId: this.stdId,
            stdName: this.$route.query.stdName,
            subjectId: item.subjectId,
          },
        });
      } else {
        this.$router.push({
          name: "LessonList",
          query: {
            stdId: this.stdId,
            stdName: this.$route.query.stdName,
            subjectId: item.subjectId,
          },
        });
      }
    },
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
      const jsonData = JSON.stringify({ stdId: this.$route.query.stdId });

      this.$http
        .post(
          `${process.env.VUE_APP_API_PATH}/student/getAllStdSubject.php`,
          jsonData
        )
        .then((res) => {
          this.isLoading = false;
          console.log("getAllStdSubject", res.data);
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
