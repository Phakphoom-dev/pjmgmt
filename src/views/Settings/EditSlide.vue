<template>
  <v-container fluid class="mt-3">
    <v-btn color="info" @click="$router.go(-1)" class="mr-2"
      ><v-icon small class="mr-1">mdi-arrow-left</v-icon> ย้อนกลับ</v-btn
    >
    <v-card class="mt-3">
      <v-card-title> แก้ไข SlideShow</v-card-title>
      <v-card-text>
        <validation-observer ref="observer">
          <v-form @submit.prevent="submit">
            <v-container>
              <v-row class="mb-3" align="center" justify="center">
                <v-img
                  v-if="!slideForm.newImg"
                  :src="imgPath(slideForm.slideImg, 'slide')"
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
                    label="รูป SlideShow"
                    v-model="slideForm.newImg"
                    dense
                    outlined
                  ></v-file-input>
                </v-col>
              </v-row>

              <v-row no-gutters>
                <v-col cols="12" xs="12">
                  <v-text-field
                    type="text"
                    prepend-icon="mdi-book"
                    dense
                    outlined
                    v-model="slideForm.slideTitle"
                    :error-messages="errors"
                    label="หัวข้อ"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-row no-gutters>
                <v-col cols="12" xs="12">
                  <v-textarea
                    type="text"
                    prepend-icon="mdi-format-align-justify"
                    dense
                    outlined
                    v-model="slideForm.slideDesc"
                    :error-messages="errors"
                    label="รายละเอียด"
                    required
                  ></v-textarea>
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
  // ValidationProvider,
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
    // ValidationProvider,
  },
  data: () => ({
    isLoading: false,
    url: null,
    slideForm: {
      slideTitle: "",
      slideDesc: "",
      slideImg: null,
      newImg: null,
      slideId: null,
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

    getSlide() {
      const jsonData = JSON.stringify({ slideId: this.$route.query.slideId });

      this.$http
        .post(`${process.env.VUE_APP_API_PATH}/slide/getSlide.php`, jsonData)
        .then((res) => {
          this.slideForm = res.data[0];
          this.isLoading = false;
        })
        .catch((err) => {
          this.isLoading = false;
          console.log(err);
        });
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
          .post(
            `${process.env.VUE_APP_API_PATH}/slide/updateSlide.php`,
            formData
          )
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
  created() {
    this.getSlide();
  },
};
</script>
