<template>
  <v-container fluid class="mt-3">
    <v-row class="mt-2" no-gutters>
      <h3>บทเรียนของหลักสูตร {{ subjectName }}</h3>
    </v-row>

    <!-- <v-row>
      <v-col>
        <v-btn color="secondary" to="lessons">จัดการหลักสูตร</v-btn>
        <v-btn color="primary" class="ml-2" to="lessons/subjects"
          >จัดการรายวิชา</v-btn
        >
        <v-btn color="secondary" class="ml-2">จัดการบทเรียน</v-btn>
      </v-col>
    </v-row> -->

    <v-row class="mt-3">
      <v-col>
        <v-data-table
          :headers="headers"
          :items="lessons"
          sort-by="username"
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
          <template v-slot:no-data> ไม่พบบทเรียนของหลักสูตรนี้ </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "QuizLesson",
  data: () => ({
    subjectName: "",
    quiz: [],
    dialog: false,
    dialogDelete: false,
    headers: [
      { text: "ลำดับที่", value: "index" },
      { text: "ชื่อบทเรียน", value: "lessonName" },
      { text: "จำนวนข้อ", value: "quizAmount" },
      { text: "จัดการแบบฝึกหัด", value: "actions", sortable: false },
    ],
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
      this.$router.push({
        name: "QuizList",
        query: {
          lessonId: item.lessonId,
          subjectId: item.subjectId,
          lessonName: item.lessonName,
        },
      });
      // this.editedIndex = this.lessons.indexOf(item);
      // this.editedItem = Object.assign({}, item);
      // this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.lessons.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.lessons.splice(this.editedIndex, 1);
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
        Object.assign(this.lessons[this.editedIndex], this.editedItem);
      } else {
        this.lessons.push(this.editedItem);
      }
      this.close();
    },

    getData() {
      this.subjectName = this.$route.query.subjectName;

      const jsonData = JSON.stringify({
        subjectId: this.$route.query.subjectId,
      });

      const data = this.post("/quiz/getLessonBySubject.php", jsonData);
      data.then((res) => {
        this.lessons = res.data;
        console.log("lessons", this.lessons);
      });
    },
  },

  created() {
    console.log("QuizLesson", this.$route.query);
    this.getData();
  },
};
</script>
