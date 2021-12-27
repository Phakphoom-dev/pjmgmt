<template>
  <v-container fluid class="mt-3">
    <v-row class="mt-2" no-gutters>
      <h3>รายวิชา</h3>
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
          :items="subjects"
          sort-by="username"
          class="elevation-1"
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>จัดการรายวิชา</v-toolbar-title>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-spacer></v-spacer>
              <v-btn color="primary" dark class="mb-2" to="addsubject">
                เพิ่มรายวิชา
              </v-btn>
            </v-toolbar>
          </template>
          <template slot="item.index" scope="props">
            {{ props.index + 1 }}
          </template>

          <template v-slot:item.teacher="{ item }">
            <v-chip color="info" @click="watchTeacher(item)">
              อาจารย์ที่ทำการสอน
            </v-chip>
          </template>

          <template v-slot:item.subjectSta="{ item, index }">
            <div>
              <v-switch
                v-model="item.subjectSta"
                color="success"
                dense
                @change="changeStatus(item.subjectSta, item.subjectId, index)"
              ></v-switch>
            </div>
          </template>

          <template v-slot:item.actions="{ item }">
            <v-icon small class="mr-2" @click="editSubject(item)" color="info">
              mdi-pencil
            </v-icon>
            <v-icon small @click="deleteSubject(item)" color="error">
              mdi-delete
            </v-icon>
          </template>
          <template v-slot:no-data> ไม่พบรายวิชา </template>
        </v-data-table>
      </v-col>
    </v-row>

    <v-row justify="center">
      <v-dialog v-model="dialog" scrollable max-width="400px">
        <v-card>
          <v-card-title>อาจารย์ผู้สอน</v-card-title>
          <v-divider></v-divider>
          <v-card-text style="height: 300px">
            <v-row cols="12" class="mt-2">
              <v-col
                cols="12"
                v-for="(teacher, index) in teachers"
                :key="teacher.teacherId"
                ><h6>{{ index + 1 }}. {{ teacher.teacherName }}</h6></v-col
              >
            </v-row>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-btn color="blue darken-1" text @click="dialog = false">
              ปิด
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </v-container>
</template>

<script>
import "@/mixins/generalMixin";

export default {
  name: "ShowSubjects",
  data: () => ({
    dialogm1: "",
    dialog: false,
    dialogDelete: false,
    headers: [
      { text: "ลำดับที่", value: "index" },
      {
        text: "หลักสูตร",
        align: "start",
        value: "courseName",
      },
      {
        text: "รายวิชา",
        align: "start",
        value: "subjectName",
      },
      { text: "อาจารย์ที่ทำการสอน", value: "teacher" },
      { text: "การใช้งาน", value: "subjectSta" },
      { text: "แก้ไข/ลบ", value: "actions", sortable: false },
    ],
    subjects: [],
    teachers: [],
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "เพิ่มหลักสูตร" : "แก้ไขหลักสูตร";
    },
  },

  methods: {
    deleteSubject(item) {
      this.$swal
        .fire({
          title: `ต้องการลบ ${item.subjectName} หรือไม่`,
          showDenyButton: true,
          confirmButtonText: "ยืนยัน",
          denyButtonText: `ยกเลิก`,
        })
        .then((result) => {
          if (result.isConfirmed) {
            const jsonData = JSON.stringify({
              subjectId: item.subjectId,
              courseId: item.courseId,
            });

            this.post("/subject/deleteSubject.php", jsonData).then((res) => {
              if (res.status === 200) {
                this.initialize();
                this.$toast.open("ลบรายวิชาสำเร็จ");
              }
            });
          } else if (result.isDenied) {
            return;
          }
        });
    },

    changeStatus(status, subjectId, index) {
      console.log(index);
      let subjectSta = null;
      status ? (subjectSta = 1) : (subjectSta = 0);

      let formData = new FormData();
      formData.append("subjectSta", subjectSta);
      formData.append("subjectId", subjectId);

      this.$http
        .post(
          `${process.env.VUE_APP_API_PATH}/subject/updateSubjectSta.php`,
          formData
        )
        .then((res) => {
          if (res.status === 200) {
            console.log(this.subjects[index]);
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

    async initialize() {
      this.subjects = await this.get("/subject/getAllSubject.php");
      console.log(this.subjects);
    },

    editSubject(item) {
      this.$router.push({
        name: "EditSubject",
        query: { subjectId: item.subjectId },
      });
    },

    watchTeacher(item) {
      const jsonData = JSON.stringify({ subjectId: item.subjectId });

      this.$http
        .post(
          `${process.env.VUE_APP_API_PATH}/subject/getSubjectTeacher.php`,
          jsonData
        )
        .then((res) => {
          this.dialog = true;
          this.teachers = res.data;
        })
        .catch((err) => {
          this.isLoading = false;
          console.log(err);
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
    this.initialize();
  },
};
</script>
