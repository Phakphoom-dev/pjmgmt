<template>
  <v-container fluid class="mt-3">
    <v-row class="mt-2" no-gutters>
      <h3>รายงาน การทำแบบฝึกหัด</h3>
    </v-row>

    <v-row class="mt-3">
      <v-col>
        <v-data-table
          :headers="headers"
          :items="stdScore"
          sort-by="lessonName"
          class="elevation-1"
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-btn color="info" @click="$router.go(-1)" class="mr-3"
                ><v-icon small class="mr-1">mdi-arrow-left</v-icon>
                ย้อนกลับ</v-btn
              >
              <v-toolbar-title
                >รายงานการทำแบบฝึกหัด -
                {{ $route.query.lessonName }}</v-toolbar-title
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
              mdi-pencil
            </v-icon>
          </template>

          <template v-slot:no-data> ไม่พบประวัติ </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  name: "ViewScore",
  data() {
    return {
      isLoading: false,
      stdScore: [],
      headers: [
        { text: "ลำดับที่", value: "index" },
        { text: "วันที่ทำแบบทดสอบ", value: "makeDate" },
        { text: "คะแนนที่ได้", value: "stdScore" },
        { text: "คะแนนเต็ม", value: "maxScore" },
      ],
    };
  },
  methods: {
    getAllStdScore() {
      this.isLoading = true;

      let formData = new FormData();
      formData.append("stdId", this.$route.query.stdId);
      formData.append("lessonId", this.$route.query.lessonId);

      this.$http
        .post(
          `${process.env.VUE_APP_API_PATH}/student/getAllStdScore.php`,
          formData
        )
        .then((res) => {
          this.isLoading = false;
          this.stdScore = res.data;
          console.log(res.data);
        })
        .catch((err) => {
          this.isLoading = false;
          console.log(err);
        });
    },
  },
  created() {
    this.getAllStdScore();
  },
};
</script>
