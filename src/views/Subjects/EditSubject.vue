<template>
  <v-container fluid class="mt-3">
    <v-btn color="info" @click="$router.go(-1)" class="mr-2"
      ><v-icon small class="mr-1">mdi-arrow-left</v-icon> ย้อนกลับ</v-btn
    >
    <Loading v-if="onLoad" />
    <v-card class="mt-3" v-else>
      <v-card-title>แก้ไขหลักสูตร</v-card-title>
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
                    <v-text-field
                      type="text"
                      prepend-icon="mdi-book-open-blank-variant"
                      dense
                      outlined
                      maxlength="100"
                      v-model="subjectForm.subjectName"
                      :error-messages="errors"
                      label="ชื่อหลักสูตร"
                      required
                    ></v-text-field>
                  </validation-provider>
                </v-col>
              </v-row>

              <v-row no-gutters>
                <v-col cols="12">
                  <validation-provider
                    v-slot="{ errors }"
                    name="จำนวนบทเรียนทั้งหมด"
                    rules="required"
                  >
                    <v-text-field
                      type="number"
                      prepend-icon="mdi-clock-time-nine"
                      dense
                      outlined
                      maxlength="11"
                      v-model="subjectForm.totalLesson"
                      :error-messages="errors"
                      label="จำนวนบทเรียนทั้งหมด"
                      required
                    ></v-text-field>
                  </validation-provider>
                </v-col>
              </v-row>

              <v-row no-gutters>
                <v-col cols="12">
                  <validation-provider
                    v-slot="{ errors }"
                    name="จำนวนชั่วโมงต่อบทเรียน"
                    rules="required"
                  >
                    <v-text-field
                      type="number"
                      prepend-icon="mdi-clock-time-five"
                      dense
                      outlined
                      maxlength="11"
                      v-model="subjectForm.hourLesson"
                      :error-messages="errors"
                      label="จำนวนชั่วโมงต่อบทเรียน"
                      required
                    ></v-text-field>
                  </validation-provider>
                </v-col>
              </v-row>

              <v-row no-gutters>
                <v-col cols="12">
                  <validation-provider
                    v-slot="{ errors }"
                    name="จำนวนชั่วโมงเรียนทั้งหมด"
                    rules="required"
                  >
                    <v-text-field
                      type="number"
                      prepend-icon="mdi-clock-time-one"
                      dense
                      outlined
                      maxlength="11"
                      v-model="subjectForm.totalHour"
                      :error-messages="errors"
                      label="จำนวนชั่วโมงเรียนทั้งหมด"
                      required
                    ></v-text-field>
                  </validation-provider>
                </v-col>
              </v-row>

              <v-row no-gutters>
                <v-col cols="12">
                  <validation-provider
                    v-slot="{ errors }"
                    name="ราคา"
                    rules="required"
                  >
                    <v-text-field
                      type="number"
                      prepend-icon="mdi-cash"
                      dense
                      outlined
                      maxlength="11"
                      v-model="subjectForm.subjectPrice"
                      :error-messages="errors"
                      label="ราคา"
                      required
                    ></v-text-field>
                  </validation-provider>
                </v-col>
              </v-row>

              <v-row class="mb-3" align="center" justify="center">
                <v-img
                  v-if="!subjectForm.newImg"
                  :src="imgPath(subjectForm.subjectImg, 'subject')"
                  max-height="300"
                  max-width="300"
                ></v-img>
                <v-img
                  v-else
                  :src="url"
                  max-height="300"
                  max-width="300"
                ></v-img>
              </v-row>

              <v-row no-gutters>
                <v-col cols="12">
                  <v-file-input
                    @change="onFileChange"
                    accept="image/*"
                    label="รูปหลักสูตร"
                    v-model="subjectForm.newImg"
                    dense
                    outlined
                  ></v-file-input>
                </v-col>
              </v-row>

              <v-row no-gutters>
                <v-col cols="12">
                  <v-row>
                    <v-col cols="12">
                      <v-select
                        dense
                        prepend-icon="mdi-account"
                        :items="teachers"
                        item-value="teacherId"
                        item-text="fullName"
                        v-model="subjectForm.teacherList"
                        label="อาจารย์ผู้สอน"
                        :error-messages="errors"
                        multiple
                        outlined
                        small-chips
                        persistent-hint
                      ></v-select>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>

              <v-row no-gutters>
                <v-col cols="12">
                  <validation-provider
                    v-slot="{ errors }"
                    name="รายละเอียดหลักสูตร"
                    rules="required"
                  >
                    <v-textarea
                      prepend-icon="mdi-text"
                      dense
                      outlined
                      v-model="subjectForm.subjectDesc"
                      :error-messages="errors"
                      label="รายละเอียดหลักสูตร"
                      required
                    ></v-textarea>
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
import Loading from "@/components/Loading";

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
  name: "EditSubject",
  components: {
    ValidationProvider,
    ValidationObserver,
    Loading,
  },
  data: () => ({
    url: "",
    onLoad: false,
    valid: true,
    subjectForm: {
      courseId: "",
      subjectName: "",
      teacherList: [],
      subjectImg: "",
      subjectPrice: null,
      totalLesson: null,
      hourLesson: null,
      totalHour: null,
      newImg: null,
      subjectDesc: null,
    },
    coursesName: [],
    teachers: [],
  }),
  computed: {
    teacherList() {
      return this.subjectForm.teacherList;
    },
  },
  methods: {
    onFileChange(e) {
      if (e) {
        this.url = URL.createObjectURL(e);
      } else {
        this.url = null;
      }
    },

    submit() {
      this.isLoading = true;
      this.$refs.observer.validate().then((result) => {
        if (result) {
          let formData = new FormData();

          for (const key in this.subjectForm) {
            formData.append(key, this.subjectForm[key]);
            console.log(this.subjectForm[key]);
          }

          formData.append("subjectId", this.$route.query.subjectId);

          this.post("/subject/updateSubject.php", formData).then((res) => {
            if (res.status) {
              this.isLoading = false;
              this.$router.push({ name: "ShowSubjects" });
            }
          });
        }
      });
    },

    getSubject() {
      const jsonData = JSON.stringify({
        subjectId: this.$route.query.subjectId,
      });
      const data = this.post("/subject/getSubject.php", jsonData);
      data.then((res) => {
        this.subjectForm.subjectName = res.data[0].subjectName;
        this.subjectForm.courseId = res.data[0].courseId;
        this.subjectForm.subjectImg = res.data[0].subjectImg;
        this.subjectForm.subjectPrice = res.data[0].subjectPrice;
        this.subjectForm.totalLesson = res.data[0].totalLesson;
        this.subjectForm.hourLesson = res.data[0].hourLesson;
        this.subjectForm.totalHour = res.data[0].totalHour;
        this.subjectForm.subjectDesc = res.data[0].subjectDesc;
        console.log(this.subjectForm);
      });
    },

    getSubjectTeacher() {
      const jsonData = JSON.stringify({
        subjectId: this.$route.query.subjectId,
      });

      this.$http
        .post(
          `${process.env.VUE_APP_API_PATH}/subject/getSubjectTeacher.php`,
          jsonData
        )
        .then((res) => {
          let teachers = res.data;
          console.log("subjectTea", teachers);
          console.log(this.onLoad);
          this.subjectForm.teacherList = teachers.map(
            (teacher) => teacher.teacherId
          );
          this.onLoad = false;
        })
        .catch((err) => {
          this.isLoading = false;
          this.onLoad = false;
          console.log(err);
        });
    },
  },

  async created() {
    this.onLoad = true;
    this.coursesName = await this.get("/course/getAllCourse.php");
    this.teachers = await this.get("/user/getAllTeacher.php");
    await this.getSubject();
    await this.getSubjectTeacher();
  },
};
</script>
