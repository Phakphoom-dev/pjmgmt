<template>
  <v-container fluid class="mt-3">
    <v-row class="mt-2" no-gutters>
      <h3>หลักสูตร</h3>
    </v-row>

    <!-- <v-row>
      <v-col>
        <v-btn color="primary">จัดการหลักสูตร</v-btn>
        <v-btn color="secondary" class="ml-2" :to="{ name: 'Subjects' }"
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
              <v-toolbar-title>จัดการหลักสูตร</v-toolbar-title>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-spacer></v-spacer>
              <v-btn color="primary" dark class="mb-2" to="addcourse">
                เพิ่มหลักสูตร
              </v-btn>
            </v-toolbar>
          </template>
          <template slot="item.index" scope="props">
            {{ props.index + 1 }}
          </template>

          <template v-slot:item.courseSta="{ item, index }">
            <div>
              <v-switch
                v-model="item.courseSta"
                color="success"
                dense
                @change="changeStatus(item.courseSta, item.courseId, index)"
              ></v-switch>
            </div>
          </template>

          <template v-slot:item.actions="{ item }">
            <v-icon small class="mr-2" @click="editCourse(item)" color="info">
              mdi-pencil
            </v-icon>
            <v-icon small @click="deleteCourse(item)" color="error">
              mdi-delete
            </v-icon>
          </template>
          <template v-slot:no-data> ไม่พบผู้สอน </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import "@/mixins/generalMixin";

export default {
  name: "ShowCourses",
  data: () => ({
    isLoading: false,
    dialog: false,
    dialogDelete: false,
    headers: [
      { text: "ลำดับที่", value: "index" },
      {
        text: "หลักสูตร",
        align: "start",
        value: "courseName",
      },
      { text: "จำนวนรายวิชา", value: "subject" },
      { text: "การใช้งาน", value: "courseSta" },
      { text: "แก้ไข/ลบ", value: "actions", sortable: false },
    ],
    courses: [],
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
    getAllCourse() {
      this.$http
        .get(`${process.env.VUE_APP_API_PATH}/course/getAllCourse.php`)
        .then((res) => {
          this.courses = res.data;
          console.log("courses", this.courses);
        })
        .catch((err) => {
          console.log(err);
        });
    },

    editCourse(item) {
      this.$router.push({
        name: "EditCourse",
        query: { courseId: item.courseId },
      });
    },

    changeStatus(status, courseId, index) {
      console.log(index);
      let courseSta = null;
      status ? (courseSta = 1) : (courseSta = 0);

      let formData = new FormData();
      formData.append("courseSta", courseSta);
      formData.append("courseId", courseId);

      this.$http
        .post(
          `${process.env.VUE_APP_API_PATH}/course/updateCourseSta.php`,
          formData
        )
        .then((res) => {
          if (res.status === 200) {
            console.log(this.courses[index]);
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

    deleteCourse(item) {
      this.$swal
        .fire({
          title: `ต้องการที่จะลบหลักสูตร ${item.courseName} หรือไม่`,
          showDenyButton: true,
          confirmButtonText: "ยืนยัน",
          denyButtonText: `ยกเลิก`,
        })
        .then((result) => {
          if (result.isConfirmed) {
            const jsonData = JSON.stringify({
              courseId: item.courseId,
            });

            this.$http
              .post(
                `${process.env.VUE_APP_API_PATH}/course/deleteCourse.php`,
                jsonData
              )
              .then((res) => {
                if (res.status === 200) {
                  this.getAllCourse();
                  this.$toast.open("ลบข้อมูลหลักสูตรสำเร็จ");
                }
              })
              .catch((err) => {
                this.isLoading = false;
                console.log(err.response.data);
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
  created() {
    this.getAllCourse();
  },
};
</script>
