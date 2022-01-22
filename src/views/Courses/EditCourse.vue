<template>
  <v-container fluid class="mt-3">
    <v-btn color="info" @click="$router.go(-1)" class="mr-2"
      ><v-icon small class="mr-1">mdi-arrow-left</v-icon> ย้อนกลับ</v-btn
    >
    <v-card class="mt-3">
      <v-card-title> แก้ไขคอร์สหลัก</v-card-title>
      <v-card-text>
        <validation-observer ref="observer">
          <v-form @submit.prevent="submit">
            <v-container>
              <v-row no-gutters>
                <v-col cols="12">
                  <validation-provider
                    v-slot="{ errors }"
                    name="ชื่อคอร์สหลัก"
                    rules="required"
                  >
                    <v-text-field
                      type="text"
                      prepend-icon="mdi-book-open"
                      dense
                      outlined
                      maxlength="100"
                      v-model="courseName"
                      :error-messages="errors"
                      label="ชื่อคอร์สหลัก"
                      required
                    ></v-text-field>
                  </validation-provider>
                </v-col>
              </v-row>

              <v-col cols="12">
                <v-btn class="mr-4" type="submit" block color="primary">
                  <v-progress-circular
                    v-if="isLoading"
                    indeterminate
                    color="white"
                    :width="5"
                  ></v-progress-circular>
                  <span v-else>ยืนยัน</span>
                </v-btn>
              </v-col>
            </v-container>
          </v-form>
        </validation-observer>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
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
  name: "EditCourse",
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  data: () => ({
    isLoading: false,
    valid: true,
    courseName: "",
  }),
  methods: {
    getCourse() {
      const jsonData = JSON.stringify({ courseId: this.$route.query.courseId });

      this.$http
        .post(`${process.env.VUE_APP_API_PATH}/course/getCourse.php`, jsonData)
        .then((res) => {
          this.courseName = res.data[0].courseName;
        })
        .catch((err) => {
          this.isLoading = false;
          console.log(err);
        });
    },

    async submit() {
      const isValid = await this.$refs.observer.validate();

      if (isValid) {
        this.isLoading = true;

        let formData = new FormData();

        formData.append("courseId", this.$route.query.courseId);
        formData.append("courseName", this.courseName);

        this.$http
          .post(
            `${process.env.VUE_APP_API_PATH}/course/updateCourse.php`,
            formData
          )
          .then((res) => {
            if (res.status === 200) {
              this.isLoading = false;
              this.$router.push({ name: "ShowCourses" });
            }
          })
          .catch((err) => {
            this.isLoading;
            console.log(err);
          });
      } else {
        return;
      }
    },
  },
  created() {
    this.getCourse();
  },
};
</script>
