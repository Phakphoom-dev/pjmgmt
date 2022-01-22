<template>
  <v-container fluid class="mt-3">
    <v-btn color="info" @click="$router.go(-1)" class="mr-2"
      ><v-icon small class="mr-1">mdi-arrow-left</v-icon> ย้อนกลับ</v-btn
    >
    <v-card class="mt-3">
      <v-card-title> เพิ่มผู้เรียน</v-card-title>
      <v-card-text>
        <validation-observer ref="observer">
          <v-form @submit.prevent="submit">
            <v-container>
              <v-row no-gutters>
                <v-col cols="12">
                  <validation-provider
                    v-slot="{ errors }"
                    name="Username"
                    rules="required"
                  >
                    <v-text-field
                      type="text"
                      prepend-icon="mdi-account"
                      dense
                      outlined
                      maxlength="20"
                      v-model="userForm.username"
                      :error-messages="errors"
                      label="Username"
                      required
                    ></v-text-field>
                  </validation-provider>
                </v-col>
              </v-row>

              <v-row class="mt-0">
                <v-col cols="12" lg="6" xs="12">
                  <validation-provider
                    v-slot="{ errors }"
                    name="Password"
                    rules="required"
                  >
                    <v-text-field
                      type="password"
                      prepend-icon="mdi-lock"
                      dense
                      outlined
                      maxlength="20"
                      v-model="userForm.password"
                      :error-messages="errors"
                      label="Password"
                      required
                      ref="password"
                    ></v-text-field>
                  </validation-provider>
                </v-col>

                <v-col cols="12" lg="6" xs="12">
                  <validation-provider
                    v-slot="{ errors }"
                    name="Confirm Password"
                    rules="required|confirmed:Password"
                  >
                    <v-text-field
                      type="password"
                      prepend-icon="mdi-lock"
                      dense
                      outlined
                      maxlength="20"
                      v-model="confirmPassword"
                      :error-messages="errors"
                      label="Confirm Password"
                      data-vv-as="Password"
                    ></v-text-field>
                  </validation-provider>
                </v-col>
              </v-row>

              <!-- <v-row class="mb-3" align="center" justify="center">
                <v-img
                  v-if="url"
                  :src="url"
                  max-height="300"
                  max-width="300"
                ></v-img>
              </v-row> -->

              <!-- <v-row no-gutters>
                <v-col cols="12">
                  <validation-provider
                    v-slot="{ errors }"
                    name="รูปประจำตัว"
                    rules="required"
                  >
                    <v-file-input
                      :error-messages="errors"
                      @change="onFileChange"
                      accept="image/*"
                      label="รูปประจำตัว"
                      v-model="userForm.stdImg"
                      dense
                      outlined
                    ></v-file-input>
                  </validation-provider>
                </v-col>
              </v-row> -->

              <v-row no-gutters>
                <v-col cols="12" lg="4" xs="12">
                  <validation-provider
                    v-slot="{ errors }"
                    name="คำนำหน้าชื่อ"
                    rules="required"
                  >
                    <v-radio-group
                      v-model="userForm.prefix"
                      label="คำนำหน้าชื่อ"
                      :error-messages="errors"
                      row
                    >
                      <v-radio label="นาย" value="นาย"></v-radio>
                      <v-radio label="นาง" value="นาง"></v-radio>
                      <v-radio label="นางสาว" value="นางสาว"></v-radio>
                    </v-radio-group>
                  </validation-provider>
                </v-col>
              </v-row>

              <v-row no-gutters>
                <v-col cols="12" lg="6" xs="12">
                  <validation-provider
                    v-slot="{ errors }"
                    name="ชื่อ"
                    rules="required"
                  >
                    <v-text-field
                      type="text"
                      prepend-icon="mdi-account-box"
                      dense
                      outlined
                      maxlength="20"
                      v-model="userForm.firstName"
                      :error-messages="errors"
                      label="ชื่อ"
                      required
                    ></v-text-field>
                  </validation-provider>
                </v-col>

                <v-col cols="12" lg="6" xs="12">
                  <validation-provider
                    v-slot="{ errors }"
                    name="นามสกุล"
                    rules="required"
                  >
                    <v-text-field
                      type="text"
                      prepend-icon="mdi-account-box-multiple"
                      dense
                      outlined
                      maxlength="20"
                      v-model="userForm.lastName"
                      :error-messages="errors"
                      label="นามสกุล"
                      required
                    ></v-text-field>
                  </validation-provider>
                </v-col>
              </v-row>

              <v-row no-gutters>
                <v-col cols="12" lg="4" xs="12">
                  <validation-provider
                    v-slot="{ errors }"
                    name="เบอร์โทรศัพท์"
                    rules="required"
                  >
                    <v-text-field
                      type="text"
                      prepend-icon="mdi-phone"
                      dense
                      outlined
                      maxlength="20"
                      v-model="userForm.tel"
                      :error-messages="errors"
                      label="เบอร์โทรศัพท์"
                      required
                    ></v-text-field>
                  </validation-provider>
                </v-col>

                <v-col cols="12" lg="4" xs="12">
                  <validation-provider
                    v-slot="{ errors }"
                    name="อีเมล"
                    rules="required|email"
                  >
                    <v-text-field
                      type="text"
                      prepend-icon="mdi-email"
                      dense
                      outlined
                      maxlength="100"
                      v-model="userForm.email"
                      :error-messages="errors"
                      label="อีเมล"
                      required
                    ></v-text-field>
                  </validation-provider>
                </v-col>

                <v-col cols="12" lg="4" xs="12">
                  <validation-provider
                    v-slot="{ errors }"
                    name="Line ID"
                    rules="required"
                  >
                    <v-text-field
                      type="text"
                      prepend-icon="mdi-account-box-multiple"
                      dense
                      outlined
                      maxlength="100"
                      v-model="userForm.lineId"
                      :error-messages="errors"
                      label="Line ID"
                      required
                    ></v-text-field>
                  </validation-provider>
                </v-col>
              </v-row>

              <!-- <v-row no-gutters>
                <v-col cols="12">
                  <validation-provider
                    v-slot="{ errors }"
                    name="หลักสูตรที่สมัคร"
                    rules="required"
                  >
                    <v-select
                      dense
                      prepend-icon="mdi-book-open"
                      :items="courses"
                      item-value="courseId"
                      item-text="courseName"
                      v-model="userForm.courseId"
                      :error-messages="errors"
                      multiple
                      label="หลักสูตรที่สมัคร"
                      outlined
                    ></v-select>
                  </validation-provider>
                </v-col>
              </v-row> -->

              <v-col cols="12">
                <v-btn class="mr-4" type="submit" block color="primary">
                  ยืนยัน
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
import { confirmed, email } from "vee-validate/dist/rules";

setInteractionMode("eager");

extend("confirmed", {
  ...confirmed,
  message: "กรุณากรอกรหัสผ่านให้ตรงกัน",
});

extend("email", {
  ...email,
  message: "กรุณากรอกอีเมลให้ถูกต้อง",
});

export default {
  name: "AddStudent",
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  data: () => ({
    isLoading: false,
    url: null,
    valid: true,
    // courses: [],
    userForm: {
      username: "",
      password: "",
      firstName: "",
      lastName: "",
      email: "",
      prefix: "",
      lineId: "",
      tel: "",
      courseId: "",
      objective: "",
      stdImg: null,
    },
    confirmPassword: "",
  }),
  methods: {
    // getAllCourse() {
    //   this.$http
    //     .get(`${process.env.VUE_APP_API_PATH}/course/getAllActiveCourse.php`)
    //     .then((res) => {
    //       this.courses = res.data;
    //       console.log("courses", this.courses);
    //     })
    //     .catch((err) => {
    //       console.log(err);
    //     });
    // },

    onFileChange(e) {
      if (e) {
        this.url = URL.createObjectURL(e);
      } else {
        this.url = null;
      }
    },

    async submit() {
      const isValid = await this.$refs.observer.validate();

      if (isValid) {
        console.log(this.userForm);
        let formData = new FormData();

        for (const key in this.userForm) {
          formData.append(key, this.userForm[key]);
          console.log(this.userForm[key]);
        }

        this.$http
          .post(
            `${process.env.VUE_APP_API_PATH}/student/addStudent.php`,
            formData
          )
          .then((res) => {
            if (res.status === 200) {
              this.isLoading = false;
              this.$router.push({ name: "ShowStudents" });
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
    // this.getAllCourse();
  },
};
</script>
