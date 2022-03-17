<template>
  <v-container fluid class="mt-3">
    <v-row class="mt-2" no-gutters>
      <h3>บทเรียน - {{ $route.query.subjectName }}</h3>
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
        <v-btn color="info" @click="$router.go(-1)" class="mr-2"
          ><v-icon small class="mr-1 mb-2">mdi-arrow-left</v-icon>
          ย้อนกลับ</v-btn
        >

        <v-data-table
          :loading="isLoading"
          :headers="headers"
          :items="lessons"
          sort-by="username"
          class="elevation-1"
          :search="search"
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>จัดการบทเรียน</v-toolbar-title>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="ค้นหาบทเรียน / หลักสูตร"
                single-line
                hide-details
              ></v-text-field>
              <v-spacer></v-spacer>
              <v-btn color="primary" dark class="mb-2" @click="toAddLesson">
                เพิ่มบทเรียน
              </v-btn>
            </v-toolbar>
          </template>
          <template slot="item.index" scope="props">
            {{ props.index + 1 }}
          </template>

          <template v-slot:item.lessonImage="{ item }">
            <div class="ma-3">
              <v-img
                max-height="150"
                max-width="250"
                :src="imgPath(item.lessonImage, 'lesson')"
              ></v-img>
            </div>
          </template>

          <template v-slot:item.lessonSta="{ item, index }">
            <div>
              <v-switch
                v-model="item.lessonSta"
                @change="changeStatus(item.lessonSta, item.lessonId, index)"
                color="success"
                dense
              ></v-switch>
            </div>
          </template>

          <template v-slot:item.actions="{ item }">
            <v-icon class="mr-2" @click="editLesson(item)" color="info">
              mdi-pencil
            </v-icon>
            <v-icon @click="deleteLesson(item)" color="error">
              mdi-delete
            </v-icon>
          </template>
          <template v-slot:no-data> ไม่พบบทเรียน </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import "@/mixins/generalMixin";
export default {
  name: "ShowLessons",
  data: () => ({
    isLoading: false,
    search: "",
    dialog: false,
    dialogDelete: false,
    headers: [
      { text: "ลำดับที่", value: "index" },
      {
        text: "บทเรียน",
        align: "start",
        value: "lessonName",
      },
      { text: "รูปหน้าปก", value: "lessonImage" },
      { text: "หลักสูตร", value: "subjectName" },
      { text: "จำนวนวิดีโอ", value: "videoAmount" },
      { text: "การใช้งาน", value: "lessonSta" },
      { text: "แก้ไข/ลบ", value: "actions", sortable: false },
    ],
    lessons: [],
    editedIndex: -1,
    editedItem: {
      lesson: "",
      subjectsName: "",
      active: true,
    },
    defaultItem: {
      lesson: "",
      subjectsName: "",
      active: true,
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "เพิ่มบทเรียน" : "แก้ไขบทเรียน";
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
    deleteLesson(lesson) {
      this.$swal
        .fire({
          title: `ต้องการลบ ${lesson.lessonName} หรือไม่`,
          showDenyButton: true,
          confirmButtonText: "ยืนยัน",
          denyButtonText: `ยกเลิก`,
        })
        .then((result) => {
          if (result.isConfirmed) {
            const jsonData = JSON.stringify({
              lessonId: lesson.lessonId,
              lessonImage: lesson.lessonImage,
              subjectId: lesson.subjectId,
            });

            this.$http
              .post(
                `${process.env.VUE_APP_API_PATH}/lesson/deleteLesson.php`,
                jsonData
              )
              .then((res) => {
                if (res.status === 200) {
                  this.$toast.open("ลบบทเรียนสำเร็จ");
                  this.getAllLesson();
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

    toAddLesson() {
      this.$router.push({
        name: "AddLesson",
        query: { subjectId: this.$route.query.subjectId },
      });
    },

    editLesson(lesson) {
      this.$router.push({
        name: "EditLesson",
        query: { lessonId: lesson.lessonId },
      });
    },

    changeStatus(status, lessonId, index) {
      console.log(index);
      let lessonSta = null;
      status ? (lessonSta = 1) : (lessonSta = 0);

      let formData = new FormData();
      formData.append("lessonSta", lessonSta);
      formData.append("lessonId", lessonId);

      this.$http
        .post(
          `${process.env.VUE_APP_API_PATH}/lesson/updateLessonSta.php`,
          formData
        )
        .then((res) => {
          if (res.status === 200) {
            console.log(this.lessons[index]);
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
    },

    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.courses[this.editedIndex], this.editedItem);
      } else {
        this.courses.push(this.editedItem);
      }
      this.close();
    },

    getAllLesson() {
      this.$http
        .post(`${process.env.VUE_APP_API_PATH}/lesson/getAllLesson.php`)
        .then((res) => {
          this.lessons = res.data.filter((lesson) => {
            return lesson.subjectId == this.$route.query.subjectId;
          });
          console.log("lessons", this.lessons);
        })
        .catch((err) => {
          console.log(err);
          this.isLoading = false;
        });
    },
  },

  async created() {
    await this.getAllLesson();
  },
};
</script>
