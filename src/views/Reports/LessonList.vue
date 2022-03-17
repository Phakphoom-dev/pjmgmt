<template>
  <v-container fluid class="mt-3">
    <v-row class="mt-2" no-gutters>
      <h3>รายงาน การทำแบบฝึกหัด</h3>
    </v-row>

    <v-row class="mt-3">
      <v-col>
        <v-data-table
          :headers="headers"
          :items="lessons"
          sort-by="lessonId"
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
                {{ $route.query.stdName }}</v-toolbar-title
              >
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-spacer></v-spacer>
            </v-toolbar>
          </template>
          <template slot="item.index" scope="props">
            {{ props.index + 1 }}
          </template>

          <template v-slot:item.actions="{ item }">
            <v-icon class="mr-2" @click="toViewScore(item)" color="info">
              mdi-text-box-outline
            </v-icon>
          </template>

          <template v-slot:no-data> ไม่พบบทเรียน </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "LessonList",
  data() {
    return {
      isLoading: false,
      headers: [
        { text: "lessonId", value: "lessonId", align: " d-none" },
        { text: "ลำดับที่", value: "index" },
        { text: "ชื่อบทเรียน", value: "lessonName" },
        { text: "ดูประวัติการทำแบบฝึกหัด", value: "actions" },
      ],
      lessons: [],
    };
  },
  methods: {
    toViewScore(item) {
      this.$router.push({
        name: "ViewScore",
        query: {
          stdId: this.$route.query.stdId,
          subjectId: this.$route.query.subjectId,
          lessonId: item.lessonId,
          lessonName: item.lessonName,
        },
      });
    },
    getLessonBySubject() {
      this.isLoading = true;
      const jsonData = JSON.stringify({
        stdId: this.$route.query.stdId,
        subjectId: this.$route.query.subjectId,
      });

      this.$http
        .post(
          `${process.env.VUE_APP_API_PATH}/lesson/getLessonBySubject.php`,
          jsonData
        )
        .then((res) => {
          this.isLoading = false;
          this.lessons = res.data.lessonData;
          console.log(res.data);
        })
        .catch((err) => {
          this.isLoading = false;
          console.log(err);
        });
    },
  },
  created() {
    this.getLessonBySubject();
  },
};
</script>
