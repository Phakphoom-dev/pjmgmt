<template>
  <v-container fluid class="mt-3">
    <v-card class="mt-3">
      <v-card-title> จัดการเมนูติดต่อเรา</v-card-title>
      <v-card-text>
        <validation-observer ref="observer">
          <v-form @submit.prevent="submit">
            <v-container>
              <v-row no-gutters>
                <v-col cols="6">
                  <validation-provider
                    v-slot="{ errors }"
                    name="Latitude"
                    rules="required"
                  >
                    <v-text-field
                      type="number"
                      prepend-icon="mdi-map-marker"
                      dense
                      outlined
                      v-model="contactForm.lat"
                      :error-messages="errors"
                      label="Latitude"
                      required
                    ></v-text-field>
                  </validation-provider>
                </v-col>
                <v-col cols="6">
                  <validation-provider
                    v-slot="{ errors }"
                    name="Longtitude"
                    rules="required"
                  >
                    <v-text-field
                      type="number"
                      prepend-icon="mdi-map-marker"
                      dense
                      outlined
                      v-model="contactForm.long"
                      :error-messages="errors"
                      label="Longtitude"
                      required
                    ></v-text-field>
                  </validation-provider>
                </v-col>
              </v-row>

              <v-row no-gutters class="mb-5">
                <v-col cols="12">
                  <h6>เนื้อหาเมนูติดต่อเรา</h6>
                </v-col>
                <v-spacer></v-spacer>
                <v-col cols="12">
                  <lesson-quill
                    :content.sync="contactForm.content"
                    @contentChange="contentChange"
                  ></lesson-quill>
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
import "@/mixins/generalMixin";
import {
  extend,
  ValidationObserver,
  ValidationProvider,
  setInteractionMode,
} from "vee-validate";
import { confirmed, email } from "vee-validate/dist/rules";
import LessonQuill from "@/components/Editor/LessonQuill";

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
  name: "ShowLessons",
  components: {
    ValidationProvider,
    ValidationObserver,
    LessonQuill,
  },
  data: () => ({
    contactForm: {
      lat: null,
      long: null,
      content: "",
    },
  }),

  methods: {
    contentChange(content) {
      this.contactForm.content = content;
    },

    submit() {
      let formData = new FormData();

      formData.append("content", this.contactForm.content);
      formData.append("latitude", this.contactForm.lat);
      formData.append("longitude", this.contactForm.long);

      this.$refs.observer.validate().then((result) => {
        if (result) {
          if (this.contactForm.content === "") {
            this.$swal.fire({
              icon: "info",
              title: "กรุณากรอกเนื้อหา",
              confirmButtonText: "ตกลง",
            });
            return;
          }

          this.isLoading = true;

          this.$http
            .post(
              `${process.env.VUE_APP_API_PATH}/manage/manageContact.php`,
              formData
            )
            .then((res) => {
              this.isLoading = false;
              if (res.data) {
                this.$swal.fire({
                  icon: "success",
                  title: "แก้ไขสำเร็จ",
                  confirmButtonText: "ตกลง",
                });
                this.getContact();
              }
            })
            .catch((err) => {
              this.isLoading = false;
              console.log(err.response);
            });
        }
      });
    },

    getContact() {
      this.$http
        .get(`${process.env.VUE_APP_API_PATH}/manage/getContact.php`)
        .then((res) => {
          this.contactForm.content = res.data[0].content;
          this.contactForm.lat = res.data[0].latitude;
          this.contactForm.long = res.data[0].longitude;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },

  async created() {
    this.getContact();
  },
};
</script>
