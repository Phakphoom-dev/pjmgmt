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
    items: ["foo", "bar", "fizz", "buzz"],
    values: ["foo", "bar"],
    value: null,
    valid: true,
    subjectForm: {
      stdId: "",
      subjectId: "",
      objective: "",
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
    submit() {
      this.isLoading = true;
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
        (student) => student.stdId === this.$route.params.stdId
      );
      this.subjectForm.stdId = this.$route.params.stdId;
    },
  },
  async created() {
    this.subjectName = await this.get("/subject/getAllSubject.php");
    this.students = await this.get("/student/getAllStudent.php");
    this.subjectName = this.subjectName.filter(
      (subject) => subject.subjectSta !== 0
    );

    this.students = this.students.filter((student) => student.status !== 0);

    if (this.$route.params.stdId) {
      this.chooseStd();
    }
  },
};
</script>
