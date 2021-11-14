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
          :items="courses"
          sort-by="username"
          class="elevation-1"
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title
                >ข้อมูลการเข้าใช้งานระบบ - ทดสอบ ผู้ใช้งาน</v-toolbar-title
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

          <template v-slot:item.registeredDate="{}">
            {{ new Date() | moment("DD/MM/YYYY HH:mm:ss") }}
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

          <template v-slot:no-data> ไม่พบผู้สอน </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "ExamReport",
  data: () => ({
    dialog: false,
    dialogDelete: false,
    headers: [
      { text: "ลำดับที่", value: "index" },
      { text: "ชื่อบทเรียน", value: "lessonName" },
      { text: "ผู้เรียน", value: "fullname" },
      { text: "วันที่ทำ", value: "doDate" },
      { text: "เวลาที่สอบ", value: "startTime" },
      { text: "คะแนนเต็ม", value: "maxScore" },
      { text: "คะแนนที่ได้", value: "getScore" },
      { text: "ผลการสอบ", value: "result" },
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

  created() {
    this.initialize();
  },

  methods: {
    initialize() {
      this.courses = [
        {
          lessonName: "บทที่ 1 Basic Grammar",
          fullname: "ทดสอบ ผู้ใช้งาน",
          doDate: "14/11/2021",
          startTime: "23:46:00",
          maxScore: "10",
          getScore: "7",
          result: true,
        },
        {
          lessonName: "บทที่ 1 Basic Grammar",
          fullname: "ทดสอบ ผู้ใช้งาน",
          doDate: "14/11/2021",
          startTime: "23:46:00",
          maxScore: "10",
          getScore: "4",
          result: false,
        },
      ];
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
      // this.editedIndex = this.courses.indexOf(item);
      // this.editedItem = Object.assign({}, item);
      // this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.courses.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
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
};
</script>
