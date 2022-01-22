<template>
  <v-container fluid class="mt-3">
    <v-row class="mt-2" no-gutters>
      <h3>จัดการแบบฝึกหัด {{ $route.query.lessonName }}</h3>
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
          :items="quizs"
          sort-by="quizId"
          class="elevation-1"
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>
                <v-btn color="info" @click="$router.go(-1)" class="mr-2"
                  ><v-icon small class="mr-1">mdi-arrow-left</v-icon>
                  ย้อนกลับ</v-btn
                ></v-toolbar-title
              >
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
                    >ต้องการลบคำถามนี้หรือไม่ ?</v-card-title
                  >
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="closeDelete"
                      >ยกเลิก</v-btn
                    >
                    <v-btn color="blue darken-1" text @click="deleteQuizConfirm"
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

          <template v-slot:item.isExam="{ item, index }">
            <div>
              <v-switch
                v-model="item.isExam"
                color="success"
                dense
                @change="changeQuizSta(item.isExam, item.quizId, index)"
              ></v-switch>
            </div>
          </template>

          <template v-slot:item.actions="{ item }">
            <v-icon small class="mr-2" @click="editQuiz(item)" color="info">
              mdi-pencil
            </v-icon>
          </template>
          <template v-slot:no-data> ไม่พบแบบฝึกหัดของบทเรียนนี้ </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "TestList",
  data: () => ({
    isLoading: false,
    quizs: [],
    dialog: false,
    dialogDelete: false,
    headers: [
      { text: "ลำดับที่", value: "index" },
      { text: "คำถาม", value: "question" },
      { text: "แก้ไข/ลบ", value: "actions", sortable: false },
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
    changeQuizSta(isExam, quizId, index) {
      let quizStatus = null;
      isExam ? (quizStatus = 1) : (quizStatus = 0);

      let formData = new FormData();
      formData.append("isExam", quizStatus);
      formData.append("quizId", quizId);

      this.$http
        .post(
          `${process.env.VUE_APP_API_PATH}/quiz/updateQuizSta.php`,
          formData
        )
        .then((res) => {
          if (res.status === 200) {
            console.log("Success");
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

    addQuiz() {
      this.$router.push({
        name: "QuizAdd",
        query: {
          lessonId: this.$route.query.lessonId,
          subjectId: this.$route.query.subjectId,
        },
      });
    },

    getData() {
      this.subjectId = this.$route.query.subjectId;

      const jsonData = JSON.stringify({
        subjectId: this.$route.query.subjectId,
      });

      const data = this.post("/quiz/getTestQuiz.php", jsonData);
      data.then((res) => {
        this.quizs = res.data;
        console.log("quiz", this.quizs);
      });
    },

    editQuiz(item) {
      this.$router.push({
        name: "QuizEdit",
        query: { quizId: item.quizId },
      });
    },

    deleteQuiz(quiz) {
      this.$swal
        .fire({
          title: `ต้องการลบแบบทดสอบหรือไม่หรือไม่`,
          showDenyButton: true,
          confirmButtonText: "ยืนยัน",
          denyButtonText: `ยกเลิก`,
        })
        .then((result) => {
          if (result.isConfirmed) {
            const jsonData = JSON.stringify({
              quizId: quiz.quizId,
              questionImg: quiz.questionImg,
              lessonId: quiz.lessonId,
            });

            this.$http
              .post(
                `${process.env.VUE_APP_API_PATH}/quiz/deleteQuiz.php`,
                jsonData
              )
              .then((res) => {
                if (res.status === 200) {
                  this.getData();
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

    deleteQuizConfirm() {
      this.courses.splice(this.editedIndex, 1);
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
        Object.assign(this.courses[this.editedIndex], this.editedItem);
      } else {
        this.courses.push(this.editedItem);
      }
      this.close();
    },
  },

  created() {
    this.getData();
  },
};
</script>
