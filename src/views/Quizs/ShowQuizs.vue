<template>
  <v-container fluid class="mt-3">
    <v-row class="mt-2" no-gutters>
      <h3>แบบฝึกหัด</h3>
    </v-row>

    <!-- <v-row>
      <v-col>
        <v-btn color="secondary" to="subjects">จัดการหลักสูตร</v-btn>
        <v-btn color="primary" class="ml-2" to="subjects/subjects"
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
          :items="subjects"
          sort-by="username"
          class="elevation-1"
          :search="search"
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>จัดการแบบฝึกหัด</v-toolbar-title>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="ค้นหาแบบทดสอบ"
                single-line
                hide-details
              ></v-text-field>
              <v-spacer></v-spacer>
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
                    >ต้องการลบผู้สอนหรือไม่ ?</v-card-title
                  >
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="closeDelete"
                      >ยกเลิก</v-btn
                    >
                    <v-btn color="blue darken-1" text @click="deleteItemConfirm"
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

          <template v-slot:item.actions="{ item }">
            <v-icon class="mr-2" @click="editItem(item)" color="info">
              mdi-pencil
            </v-icon>
          </template>
          <template v-slot:no-data> ไม่พบแบบฝึกหัด </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "ShowQuizs",
  data: () => ({
    search: "",
    isLoading: false,
    dialog: false,
    dialogDelete: false,
    headers: [
      { text: "ลำดับที่", value: "index" },
      { text: "หลักสูตรหลัก", value: "courseName" },
      { text: "หลักสูตร", value: "subjectName" },
      { text: "จำนวนบทเรียน", value: "lessonAmount" },
      { text: "จำนวนแบบฝึกหัด", value: "quizAmount" },
      { text: "จัดการ", value: "actions", sortable: false },
    ],
    subjects: [],
    lessons: [],
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
    editItem(item) {
      console.log(item);
      this.$router.push({
        name: "QuizLesson",
        query: {
          subjectId: item.subjectId,
          subjectName: item.subjectName,
        },
      });
    },

    deleteItem(item) {
      this.editedIndex = this.subjects.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.subjects.splice(this.editedIndex, 1);
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
        Object.assign(this.subjects[this.editedIndex], this.editedItem);
      } else {
        this.subjects.push(this.editedItem);
      }
      this.close();
    },

    getAllLesson() {
      const data = this.post("/lesson/getAllLesson.php");
      data.then((res) => {
        this.lessons = res.data;
        console.log("getAllLesson", res.data);
      });
    },

    async getData() {
      let userData = JSON.parse(localStorage.getItem("userData"));

      this.subjects = await this.get("/subject/getAllSubject.php");

      if (userData.role === "teacher") {
        let subjectIds = localStorage.getItem("subjectIds");

        if (subjectIds) {
          subjectIds = subjectIds.split(",");
        }
        subjectIds = subjectIds.map((subject) => {
          return parseInt(subject);
        });

        let arr = [];

        this.subjects = subjectIds.map((subjectId) => {
          this.subjects.filter((subject) => {
            if (subject.subjectId === subjectId) {
              arr.push(subject);
            }
          });
        });

        this.subjects = arr;
      }

      this.lessons = this.lessons.filter((lesson) => lesson.quizAmount > 0);

      this.subjects.map((subject, index) => {
        this.subjects[index].quizAmount = 0;
        this.lessons.map((lesson) => {
          if (parseInt(subject.subjectId) === parseInt(lesson.subjectId)) {
            this.subjects[index].quizAmount += lesson.quizAmount;
          }
        });
      });

      console.log(this.subjects);
    },
  },

  async created() {
    await this.getAllLesson();
    await this.getData();
  },
};
</script>
