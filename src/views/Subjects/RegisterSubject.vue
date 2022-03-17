<template>
  <v-container fluid class="mt-3">
    <v-btn color="info" @click="$router.go(-1)" class="mr-2"
      ><v-icon small class="mr-1">mdi-arrow-left</v-icon> ย้อนกลับ</v-btn
    >
    <v-card class="mt-3">
      <v-card-title>ลงทะเบียนหลักสูตรผู้เรียน</v-card-title>
      <v-card-text>
        <validation-observer ref="observer">
          <v-form @submit.prevent="submit">
            <v-container>
              <v-row no-gutters>
                <v-col cols="12">
                  <validation-provider
                    v-slot="{ errors }"
                    name="ชื่อหลักสูตรหลัก"
                    rules="required"
                  >
                    <v-select
                      dense
                      prepend-icon="mdi-book-open"
                      :items="coursesName"
                      item-value="courseId"
                      item-text="courseName"
                      v-model="subjectForm.courseId"
                      :error-messages="errors"
                      label="ชื่อหลักสูตรหลัก"
                      @change="filterCourse(subjectForm.courseId)"
                      outlined
                    ></v-select>
                  </validation-provider>
                </v-col>
              </v-row>

              <v-row no-gutters>
                <v-col cols="12">
                  <validation-provider
                    v-slot="{ errors }"
                    name="ชื่อหลักสูตร"
                    rules="required"
                  >
                    <v-autocomplete
                      prepend-icon="mdi-book-open"
                      v-model="subjectForm.subjectId"
                      :items="subjectName"
                      item-value="subjectId"
                      item-text="subjectName"
                      outlined
                      dense
                      :error-messages="errors"
                      label="ชื่อหลักสูตร"
                    ></v-autocomplete>
                  </validation-provider>
                </v-col>
              </v-row>

              <v-row no-gutters>
                <v-col cols="12">
                  <validation-provider
                    v-slot="{ errors }"
                    name="ชื่อผู้เรียน"
                    rules="required"
                  >
                    <v-autocomplete
                      prepend-icon="mdi-book-open"
                      v-model="subjectForm.stdId"
                      :items="students"
                      item-value="stdId"
                      item-text="fullName"
                      outlined
                      dense
                      :error-messages="errors"
                      label="ชื่อผู้เรียน"
                    ></v-autocomplete>
                  </validation-provider>
                </v-col>
              </v-row>

              <v-row no-gutters>
                <v-col cols="12">
                  <validation-provider
                    v-slot="{ errors }"
                    name="จุดประสงค์การเรียน"
                    rules="required"
                  >
                    <v-select
                      dense
                      prepend-icon="mdi-book-open"
                      :items="objectives"
                      v-model="subjectForm.objective"
                      :error-messages="errors"
                      label="จุดประสงค์การเรียน"
                      outlined
                    ></v-select>
                  </validation-provider>
                </v-col>
              </v-row>

              <v-row no-gutters>
                <v-col cols="6">
                  <validation-provider
                    v-slot="{ errors }"
                    name="วันที่เริ่มต้น"
                    rules="required"
                  >
                    <v-menu
                      ref="dateStartMenu"
                      v-model="dateStartMenu"
                      :close-on-content-click="false"
                      :return-value.sync="subjectForm.dates[0]"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          dense
                          outlined
                          :error-messages="errors"
                          v-model="subjectForm.dates[0]"
                          label="วันที่เริ่มต้น"
                          prepend-icon="mdi-calendar"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="subjectForm.dates[0]"
                        no-title
                        scrollable
                      >
                        <v-spacer></v-spacer>
                        <v-btn
                          text
                          color="primary"
                          @click="dateStartMenu = false"
                        >
                          Cancel
                        </v-btn>
                        <v-btn
                          text
                          color="primary"
                          @click="
                            $refs.dateStartMenu.save(subjectForm.dates[0])
                          "
                        >
                          OK
                        </v-btn>
                      </v-date-picker>
                    </v-menu>
                  </validation-provider>
                </v-col>
                <v-col cols="6">
                  <validation-provider
                    v-slot="{ errors }"
                    name="วันที่สิ้นสุด"
                    rules="required"
                  >
                    <v-menu
                      ref="dateEndMenu"
                      v-model="dateEndMenu"
                      :close-on-content-click="false"
                      :return-value.sync="subjectForm.dates[1]"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          class="ml-2"
                          dense
                          outlined
                          :error-messages="errors"
                          v-model="subjectForm.dates[1]"
                          label="วันที่สิ้นสุด"
                          prepend-icon="mdi-calendar"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="subjectForm.dates[1]"
                        no-title
                        scrollable
                      >
                        <v-spacer></v-spacer>
                        <v-btn
                          text
                          color="primary"
                          @click="dateEndMenu = false"
                        >
                          Cancel
                        </v-btn>
                        <v-btn
                          text
                          color="primary"
                          @click="$refs.dateEndMenu.save(subjectForm.dates[1])"
                        >
                          OK
                        </v-btn>
                      </v-date-picker>
                    </v-menu>
                  </validation-provider>
                </v-col>
              </v-row>

              <v-row>
                <v-btn class="mr-4" type="submit" block color="primary">
                  ยืนยัน
                </v-btn>
              </v-row>
            </v-container>
          </v-form>
        </validation-observer>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import "@/mixins/generalMixin.js";
import {
  extend,
  ValidationObserver,
  ValidationProvider,
  setInteractionMode,
} from "vee-validate";
import { required } from "vee-validate/dist/rules";

setInteractionMode("eager");

extend("required", {
  ...required,
  message: "กรุณากรอก {_field_}",
});

export default {
  name: "AddSubject",
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  data: () => ({
    coursesName: [],
    dateStartMenu: false,
    dateEndMenu: false,
    items: ["foo", "bar", "fizz", "buzz"],
    values: ["foo", "bar"],
    value: null,
    valid: true,
    subjectForm: {
      courseId: "",
      stdId: "",
      subjectId: "",
      objective: "",
      dates: [],
    },
    objectives: [
      "เพื่อไปทำงานในประเทศญี่ปุ่น",
      "เพื่อศึกษาต่อในประเทศญี่ปุ่น",
      "เพื่อใช้ในการสอบเข้ามหาวิทยาลัยภายในประเทศ",
      "เพื่อเพิ่มประสิทธิภาพในการทำงาน",
      "อื่น ๆ",
    ],
    subjectName: [],
    students: [],
  }),
  methods: {
    async filterCourse(courseId) {
      this.subjectName = await this.get("/subject/getAllSubject.php");

      this.subjectName = await this.subjectName.filter(
        (subject) => subject.courseId === courseId
      );
    },
    submit() {
      this.isLoading = true;
      if (!this.subjectForm.dates[0] || !this.subjectForm.dates[1]) {
        this.$swal({
          icon: "warning",
          text: "กรุณาระบุวันที่เริ่มต้นและสินสุด",
          confirmButtonText: "ตกลง",
          allowOutSideClick: false,
        });
        return;
      }

      this.$refs.observer.validate().then((result) => {
        if (result) {
          let formData = new FormData();

          for (const key in this.subjectForm) {
            formData.append(key, this.subjectForm[key]);
            console.log(this.subjectForm[key]);
          }

          this.$http
            .post(
              `${process.env.VUE_APP_API_PATH}/subject/addStudentSubject.php`,
              formData
            )
            .then((res) => {
              console.log(res.data);
              if (res.status === 200) {
                console.log("res", res.data);
                this.isLoading = false;
                this.$router.push({ name: "ShowStudents" });
              }
            })
            .catch((err) => {
              if (err.response.data.isErr) {
                this.$swal({
                  icon: "error",
                  text: err.response.data.message,
                  confirmButtonText: "ตกลง",
                  allowOutSideClick: false,
                });
                return;
              }
            });
        }
      });
    },
    chooseStd() {
      this.students = this.students.filter(
        (student) => student.stdId === parseInt(this.$route.query.stdId)
      );
      this.subjectForm.stdId = parseInt(this.$route.query.stdId);
    },
  },
  async created() {
    this.coursesName = await this.get("/course/getAllCourse.php");
    this.subjectName = await this.get("/subject/getAllSubject.php");
    this.students = await this.get("/student/getAllStudent.php");
    this.subjectName = this.subjectName.filter(
      (subject) => subject.subjectSta !== 0
    );

    this.students = this.students.filter((student) => student.status !== 0);

    if (this.$route.query.stdId) {
      this.chooseStd();
    }
  },
};
</script>
