<template>
  <v-container fluid class="mt-3">
    <v-row class="mt-2" no-gutters>
      <h3>
        รายงาน
        {{ pageTitle }}
      </h3>
    </v-row>

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
  name: "ViewExamScore",
  data() {
    return {
      isLoading: false,
      scoreData: [],
      headers: [
        { text: "ลำดับที่", value: "index" },
        { text: "ชื่อหลักสูตร", value: "subjectName" },
        { text: "ผู้เรียน", value: "fullName" },
        { text: "วันที่ทำแบบทดสอบ", value: "makeDate" },
        { text: "คะแนนที่ได้", value: "stdScore" },
        { text: "คะแนนเต็ม", value: "maxScore" },
      ],
    };
  },
  computed: {
    pageTitle() {
      return this.$route.query.action === "exam"
        ? "การทำแบบทดสอบ"
        : "การทำแบบฝึกหัด";
    },
  },
  methods: {
    getAllStdTestScore() {
      this.isLoading = true;
      let formData = new FormData();
      formData.append("stdId", this.$route.query.stdId);
      formData.append("subjectId", this.$route.query.subjectId);

      this.$http
        .post(
          `${process.env.VUE_APP_API_PATH}/student/getAllStdTestScore.php`,
          formData
        )
        .then((res) => {
          this.isLoading = false;
          console.log("getAllStdTestScore", res.data);
          this.scoreData = res.data;
        })
        .catch((err) => {
          this.isLoading = false;
          console.log(err);
        });
    },
  },
  created() {
    this.getAllStdTestScore();
  },
};
</script>
