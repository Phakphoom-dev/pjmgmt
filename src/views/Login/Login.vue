<template>
  <v-app>
    <v-container fluid>
      <v-row>
        <v-col cols="7" class="main-part d-none d-md-none d-lg-flex">
          <div class="d-flex">
            <v-img src="@/assets/logo.svg" contain></v-img>
            <p>E-learning</p>
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
                  <v-tab :href="`#tab-login`"> LOGIN </v-tab>

                  <v-tab-item :value="'tab-login'">
                    <v-form>
                      <v-container>
                        <v-row class="flex-column">
                          <v-form>
                            <v-col>
                              <v-text-field
                                v-model="email"
                                :rules="emailRules"
                                value="admin@flatlogic.com"
                                label="Email Address"
                                required
                              ></v-text-field>
                              <v-text-field
                                v-model="password"
                                :rules="passRules"
                                type="password"
                                label="Password"
                                hint="At least 6 characters"
                                required
                              ></v-text-field>
                            </v-col>
                            <v-col class="d-flex justify-space-between">
                              <v-btn
                                class="text-capitalize"
                                large
                                :disabled="
                                  password.length === 0 || email.length === 0
                                "
                                color="primary"
                                @click="login"
                                block
                              >
                                Login</v-btn
                              >
                              <!-- <v-btn
                                large
                                text
                                class="text-capitalize primary--text"
                                >Forget Password</v-btn
                              > -->
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
                  © 2014-2020
                  <a href="https://flatlogic.com/" class="text-decoration-none"
                    >Flatlogic</a
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
export default {
  name: "Login",
  data() {
    return {
      email: "test@gmail.com",
      emailRules: [
        (v) => !!v || "E-mail is required",
        (v) => /.+@.+/.test(v) || "E-mail must be valid",
      ],
      password: "123456",
      passRules: [
        (v) => !!v || "Password is required",
        (v) => v.length >= 6 || "Min 6 characters",
      ],
    };
  },
  methods: {
    login() {
      // let formData = new FormData();
      // formData.append("email", this.email);
      // formData.append("password", this.password);
      // this.$http
      //   .post(`${process.env.VUE_APP_API_PATH}/login`, formData)
      //   .then((res) => {
      //     localStorage.setItem("user", JSON.stringify(res.data.user));
      //     this.$router.push("/dashboard");
      //   })
      //   .catch((err) => {
      //     console.log(err);
      //   });
    },
  },
  created() {
    // if (window.localStorage.getItem("user") !== "") {
    //   this.$router.push("/dashboard");
    // }
  },
};
</script>

<style src="./Login.scss" lang="scss" />
