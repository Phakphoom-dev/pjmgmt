<template>
  <v-container fluid class="mt-3">
    <v-btn color="info" @click="$router.go(-1)" class="mr-2"
      ><v-icon small class="mr-1">mdi-arrow-left</v-icon> ย้อนกลับ</v-btn
    >
    <v-card class="mt-3">
      <v-card-title>เพิ่มรายวิชา</v-card-title>
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
                    <v-select
                      dense
                      prepend-icon="mdi-book-open"
                      :items="coursesName"
                      item-value="courseId"
                      item-text="courseName"
                      v-model="subjectForm.courseName"
                      :error-messages="errors"
                      label="ชื่อหลักสูตร"
                      outlined
                    ></v-select>
                  </validation-provider>
                </v-col>
              </v-row>

              <v-row no-gutters>
                <v-col cols="12">
                  <validation-provider
                    v-slot="{ errors }"
                    name="ชื่อรายวิชา"
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
                      label="ชื่อรายวิชา"
                      required
                    ></v-text-field>
                  </validation-provider>
                </v-col>
              </v-row>

              <v-row no-gutters>
                <v-col cols="12">
                  <v-row>
                    <v-col cols="12">
                      <validation-provider
                        v-slot="{ errors }"
                        name="อาจารย์ผู้สอน"
                        rules="required"
                      >
                        <v-select
                          dense
                          prepend-icon="mdi-account"
                          :items="teachers"
                          v-model="subjectForm.teacherList"
                          label="อาจารย์ผู้สอน"
                          :error-messages="errors"
                          multiple
                          chips
                          persistent-hint
                        ></v-select>
                      </validation-provider>
                    </v-col>
                  </v-row>
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
    valid: true,
    subjectForm: {
      courseName: "",
      subjectName: "",
      teacherList: [],
    },
    coursesName: [],
    teachers: ["ผู้บริหาร", "ทดสอบ ผู้สอน", "ทดสอบ ผู้สอน2"],
  }),
  computed: {
    teacherList() {
      return this.subjectForm.teacherList;
    },
  },
  methods: {
    submit() {
      this.$refs.observer.validate().then((result) => {
        if (result) {
          console.log(this.subjectForm);
        }
      });
    },
  },
  async created() {
    this.coursesName = await this.get("/course/getAllCourse.php");
  },
};
</script>
