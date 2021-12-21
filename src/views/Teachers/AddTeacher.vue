<template>
  <v-container fluid class="mt-3">
    <v-btn color="info" @click="$router.go(-1)" class="mr-2"
      ><v-icon small class="mr-1">mdi-arrow-left</v-icon> ย้อนกลับ</v-btn
    >
    <v-card class="mt-3">
      <v-card-title> เพิ่มผู้สอน</v-card-title>
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

              <v-row class="mt-0">
                <v-col cols="12" lg="4" xs="12">
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

                <v-col cols="12" lg="4" xs="12">
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

                <v-col cols="12" lg="4" xs="12">
                  <validation-provider
                    v-slot="{ errors }"
                    name="Email"
                    rules="required|email"
                  >
                    <v-text-field
                      type="email"
                      prepend-icon="mdi-account"
                      dense
                      outlined
                      v-model="userForm.email"
                      :error-messages="errors"
                      label="อีเมล"
                      required
                    ></v-text-field>
                  </validation-provider>
                </v-col>
              </v-row>

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
import { required, confirmed, email } from "vee-validate/dist/rules";

setInteractionMode("eager");

extend("required", {
  ...required,
  message: "กรุณากรอก {_field_}",
});

extend("confirmed", {
  ...confirmed,
  message: "กรุณากรอกรหัสผ่านให้ตรงกัน",
});

extend("email", {
  ...email,
  message: "กรุณากรอกอีเมลให้ถูกต้อง",
});

export default {
  name: "AddTeacher",
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  data: () => ({
    valid: true,
    userForm: {
      username: "",
      password: "",
      firstName: "",
      lastName: "",
      email: "",
      role: "teacher",
    },
    confirmPassword: "",
  }),
  methods: {
    async submit() {
      const isValid = await this.$refs.observer.validate();

      if (isValid) {
        this.isLoading = true;

        let formData = new FormData();

        for (const key in this.userForm) {
          formData.append(key, this.userForm[key]);
        }

        this.$http
          .post(`${process.env.VUE_APP_API_PATH}/user/addAdmin.php`, formData)
          .then((res) => {
            if (res.status === 200) {
              this.isLoading = false;
              this.$router.push({ name: "ShowTeachers" });
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
};
</script>
