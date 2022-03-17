<template>
  <v-container fluid class="mt-3">
    <v-row class="mt-2" no-gutters>
      <h3>รายงาน การลงทะเบียน</h3>
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
          :headers="subjectHeaders"
          :items="subjects"
          sort-by="subjectName"
          class="elevation-1 mt-3"
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-btn color="info" @click="$router.go(-1)" class="mr-3"
                ><v-icon small class="mr-1">mdi-arrow-left</v-icon>
                ย้อนกลับ</v-btn
              >
              <v-toolbar-title
                >รายการลงทะเบียน - {{ $route.query.stdName }}</v-toolbar-title
              >
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-spacer></v-spacer>
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
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "SubjectReport",
  data: () => ({
    subjects: [],
    stdId: null,
    dialog: false,
    dialogDelete: false,
    scoreData: [],
    subjectHeaders: [
      { text: "ลำดับที่", value: "index", sortable: false },
      { text: "วันที่ลงทะเบียน", value: "regisDate" },
      { text: "หลักสูตรที่ลงทะเบียน", value: "subjectName" },
      { text: "สถานะ", value: "finishDate" },
      { text: "จุดประสงค์การเรียน", value: "objective" },
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
    isFinish(finishDate) {
      const status = finishDate !== null ? "ผ่านการทดสอบ" : "กำลังศึกษา";
      return status;
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
    getSubjectReport() {
      this.isLoading = true;

      const jsonData = JSON.stringify({ stdId: this.stdId });

      this.$http
        .post(
          `${process.env.VUE_APP_API_PATH}/student/getAllStdSubject.php`,
          jsonData
        )
        .then((res) => {
          this.subjects = res.data;
          console.log("getSubjectReport", res.data);
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
    this.getSubjectReport();
  },
};
</script>
