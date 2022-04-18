<template>
  <v-container fluid class="mt-3">
    <h3>จัดการเอกสารโครงงานนักศึกษา</h3>
    <v-row class="mt-5">
      <v-col
        cols="12"
        v-for="student in students"
        :key="student.userId"
        @click="chooseStudent(student)"
        style="cursor: pointer"
      >
        <v-card color="#26c6da" dark max-width="1200">
          <v-card-title>
            <v-icon large left> mdi-clipboard-file-outline </v-icon>
            <span class="text-h6 font-weight-bold">{{
              student.projectname
            }}</span>
          </v-card-title>

          <v-card-text class="text-h5 font-weight-bold">
            คณะ: {{ student.facultyName }} | สาขา: {{ student.branch }}
          </v-card-text>

          <v-card-actions>
            <v-list-item class="grow">
              <v-list-item-avatar color="grey darken-3">
                <v-img
                  class="elevation-6"
                  alt=""
                  :src="imgPath('users', student.profileImg)"
                ></v-img>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title
                  >{{ student.firstname }}
                  {{ student.lastname }}</v-list-item-title
                >
              </v-list-item-content>
            </v-list-item>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import "@/mixins/generalMixin";
import teacherAPI from "@/api/teacher";

export default {
  name: "StudentManage",
  components: {},
  data() {
    return {
      userData: JSON.parse(localStorage.getItem("userData")),
      students: [],
    };
  },
  methods: {
    chooseStudent(student) {
      this.$router.push({
        name: "TeacherManage",
        query: { stdId: student.stdId, studentName: student.fullname },
      });
    },
    getTeacherStudent() {
      let formData = new FormData();

      for (const key in this.userData) {
        formData.append(key, this.userData[key]);
      }

      teacherAPI
        .getTeacherStudent(formData)
        .then((res) => {
          this.students = res.data.students;
          console.log(this.students);
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  async created() {
    this.getTeacherStudent();
  },
};
</script>
