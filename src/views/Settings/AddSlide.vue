<template>
  <v-container fluid class="mt-3">
    <v-btn color="info" @click="$router.go(-1)" class="mr-2"
      ><v-icon small class="mr-1">mdi-arrow-left</v-icon> ย้อนกลับ</v-btn
    >
    <v-card class="mt-3">
      <v-card-title> เพิ่ม SlideShow</v-card-title>
      <v-card-text>
        <validation-observer ref="observer">
          <v-form @submit.prevent="submit">
            <v-container>
              <v-row class="mb-3" align="center" justify="center">
                <v-img
                  v-if="url"
                  :src="url"
                  max-height="300"
                  max-width="300"
                ></v-img>
              </v-row>

              <v-row no-gutters>
                <v-col cols="12">
                  <validation-provider
                    v-slot="{ errors }"
                    name="รูป SlideShow"
                    rules="required"
                  >
                    <v-file-input
                      suffix="*ความละเอียดรูปภาพควรมีความละเอียดตั้งแต่ 1600 * 900"
                      v-bind="attrs"
                      v-on="on"
                      :error-messages="errors"
                      @change="onFileChange"
                      accept="image/*"
                      label="รูป SlideShow"
                      v-model="slideForm.slideImg"
                      dense
                      outlined
                    ></v-file-input>
                  </validation-provider>
                </v-col>
              </v-row>

              <v-row no-gutters>
                <v-col cols="12">
                  <validation-provider
                    v-slot="{ errors }"
                    name="หัวข้อ"
                    rules="required"
                  >
                    <v-text-field
                      type="text"
                      prepend-icon="mdi-book"
                      dense
                      outlined
                      maxlength="20"
                      v-model="slideForm.slideTitle"
                      :error-messages="errors"
                      label="หัวข้อ"
                      required
                    ></v-text-field>
                  </validation-provider>
                </v-col>
              </v-row>

              <v-row no-gutters>
                <v-col cols="12">
                  <validation-provider
                    v-slot="{ errors }"
                    name="รายละเอียด"
                    rules="required"
                  >
                    <v-textarea
                      type="text"
                      prepend-icon="mdi-format-align-justify"
                      dense
                      outlined
                      maxlength="20"
                      v-model="slideForm.slideDesc"
                      :error-messages="errors"
                      label="รายละเอียด"
                      required
                    ></v-textarea>
                  </validation-provider>
                </v-col>
              </v-row>

              <v-col cols="12">
                <v-btn
                  class="mr-4"
                  type="submit"
                  block
                  color="primary"
                  :disabled="isLoading"
                >
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
  name: "AddSlide",
  components: {
    ValidationObserver,
    ValidationProvider,
  },
  data: () => ({
    showTooltip: false,
    isLoading: false,
    url: null,
    slideForm: {
      slideTitle: "",
      slideDesc: "",
      slideImg: null,
    },
  }),
  methods: {
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
        let formData = new FormData();

        for (const key in this.slideForm) {
          formData.append(key, this.slideForm[key]);
          console.log(this.slideForm[key]);
        }

        this.$http
          .post(`${process.env.VUE_APP_API_PATH}/slide/addSlide.php`, formData)
          .then((res) => {
            if (res.status === 200) {
              console.log(res);
              this.isLoading = false;
              this.$router.push({ name: "ShowSettings" });
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
  created() {},
};
</script>
