<template>
  <v-app>
    <v-container fluid>
      <v-row>
        <v-col cols="7" class="main-part d-none d-md-none d-lg-flex">
          <div class="d-flex">
            <v-img
              max-height="150"
              max-width="250"
              src="@/assets/Logo-feu.png"
              contain
            ></v-img>
            <p>{{ title }}</p>
          </div>
        </v-col>

        <v-col
          cols="12"
          lg="5"
          class="login-part d-flex align-center justify-center"
        >
          <v-row class="align-start">
            <v-col
              cols="12"
              class="login-part d-flex align-center justify-center flex-column"
            >
              <div class="login-wrapper pt-md-4 pt-0">
                <v-tabs grow>
                  <v-tabs-slider></v-tabs-slider>
                  <v-tab :href="`#tab-login`"> เข้าสู่ระบบ </v-tab>

                  <v-tab-item :value="'tab-login'">
                    <v-form>
                      <v-container>
                        <v-row class="flex-column">
                          <v-form>
                            <v-col>
                              <v-text-field
                                v-model="username"
                                :rules="usernameRules"
                                value="admin@flatlogic.com"
                                label="Username"
                                required
                              ></v-text-field>
                              <v-text-field
                                v-model="password"
                                :rules="passRules"
                                type="password"
                                label="Password"
                                required
                              ></v-text-field>
                            </v-col>
                            <v-col class="d-flex justify-space-between">
                              <SubmitButton
                                :isDisabled="
                                  password.length === 0 || username.length === 0
                                "
                                :isLoading="isLoading"
                                @submit="login"
                              />
                            </v-col>
                          </v-form>
                        </v-row>
                      </v-container>
                    </v-form>
                  </v-tab-item>
                </v-tabs>
              </div>
            </v-col>
            <v-col cols="12" class="d-flex justify-center">
              <v-footer>
                <div class="primary--text">
                  © 2022
                  <a
                    href="https://www.facebook.com/JustmeArtyy/"
                    class="text-decoration-none"
                    >Phakphoom Khumpuan</a
                  >, LLC. All rights reserved.
                </div>
              </v-footer>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import SubmitButton from "@/components/Button/SubmitButton";
import userAPI from "../../api/user";

export default {
  name: "Login",
  components: {
    SubmitButton,
  },
  data() {
    return {
      title: "ระบบบริหารจัดการโครงงาน มหาวิทยาลัยฟาร์อีสเทอร์น",
      isLoading: false,
      username: "superadmin",
      password: "super5678",
      usernameRules: [(v) => !!v || "Username is required"],
      passRules: [(v) => !!v || "Password is required"],
    };
  },
  methods: {
    login() {
      this.isLoading = true;
      let formData = new FormData();
      formData.append("username", this.username);
      formData.append("password", this.password);

      userAPI
        .login(formData)
        .then((res) => {
          this.isLoading = false;
          if (res.status === 200) {
            const user = res.data.user.user[0];
            localStorage.setItem(
              "userData",
              JSON.stringify(res.data.user.user[0])
            );

            this.$toast.open({
              type: "success",
              message: res.data.message,
            });

            if (user.roleId === 1) {
              this.$router.push("/dashboard");
            }

            if (user.roleId === 2) {
              this.$router.push("/file-manage");
            }

            if (user.roleId === 3) {
              this.$router.push("/student-manage");
            }
          }
        })
        .catch((err) => {
          this.isLoading = false;
          localStorage.setItem("userData", null);
          if (err.response.data.status === 500) {
            this.$toast.open({
              type: "error",
              message: err.response.data.message,
            });
          }
        });
    },
  },
  created() {},
};
</script>

<style src="./Login.scss" lang="scss" />
