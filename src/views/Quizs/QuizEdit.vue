<template>
  <v-container fluid class="mt-3">
    <v-btn color="info" @click="$router.go(-1)" class="mr-2"
      ><v-icon small class="mr-1">mdi-arrow-left</v-icon> ย้อนกลับ</v-btn
    >
    <v-card class="mt-3">
      <v-card-title> เพิ่มข้อสอบ</v-card-title>
      <v-card-text>
        <validation-observer ref="observer">
          <v-form @submit.prevent="submit">
            <v-container>
              <v-row class="mb-3" align="center" justify="center">
                <v-img
                  v-if="!questionForm.newImg"
                  :src="imgPath(questionForm.questionImg, 'quiz')"
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
                    label="รูปแบบฝึกหัด"
                    v-model="questionForm.newImg"
                    dense
                    outlined
                  ></v-file-input>
                </v-col>
              </v-row>

              <v-row no-gutters>
                <v-col cols="12">
                  <validation-provider
                    v-slot="{ errors }"
                    name="คำถาม"
                    rules="required"
                  >
                    <v-text-field
                      type="text"
                      prepend-icon="mdi-book-open"
                      dense
                      outlined
                      maxlength="100"
                      v-model="questionForm.question"
                      :error-messages="errors"
                      label="คำถาม"
                      required
                    ></v-text-field>
                  </validation-provider>
                </v-col>
              </v-row>

              <v-row no-gutters>
                <v-col cols="12">
                  <validation-provider
                    v-slot="{ errors }"
                    name="คำตอบข้อ ก."
                    rules="required"
                  >
                    <v-text-field
                      type="text"
                      prepend-icon="mdi-forum"
                      dense
                      outlined
                      maxlength="100"
                      v-model="questionForm.a"
                      :error-messages="errors"
                      label="คำตอบข้อ ก."
                      required
                    ></v-text-field>
                  </validation-provider>
                </v-col>
              </v-row>

              <v-row no-gutters>
                <v-col cols="12">
                  <validation-provider
                    v-slot="{ errors }"
                    name="คำตอบข้อ ข."
                    rules="required"
                  >
                    <v-text-field
                      type="text"
                      prepend-icon="mdi-forum"
                      dense
                      outlined
                      maxlength="100"
                      v-model="questionForm.b"
                      :error-messages="errors"
                      label="คำตอบข้อ ข."
                      required
                    ></v-text-field>
                  </validation-provider>
                </v-col>
              </v-row>

              <v-row no-gutters>
                <v-col cols="12">
                  <validation-provider
                    v-slot="{ errors }"
                    name="คำตอบข้อ ค."
                    rules="required"
                  >
                    <v-text-field
                      type="text"
                      prepend-icon="mdi-forum"
                      dense
                      outlined
                      maxlength="100"
                      v-model="questionForm.c"
                      :error-messages="errors"
                      label="คำตอบข้อ ค."
                      required
                    ></v-text-field>
                  </validation-provider>
                </v-col>
              </v-row>

              <v-row no-gutters>
                <v-col cols="12">
                  <validation-provider
                    v-slot="{ errors }"
                    name="คำตอบข้อ ง."
                    rules="required"
                  >
                    <v-text-field
                      type="text"
                      prepend-icon="mdi-forum"
                      dense
                      outlined
                      maxlength="100"
                      v-model="questionForm.d"
                      :error-messages="errors"
                      label="คำตอบข้อ ง."
                      required
                    ></v-text-field>
                  </validation-provider>
                </v-col>
              </v-row>

              <v-row no-gutters>
                <v-col cols="12" lg="4" xs="12">
                  <validation-provider
                    v-slot="{ errors }"
                    name="คำตอบที่ถูกต้อง"
                    rules="required"
                  >
                    <v-radio-group
                      v-model="questionForm.answer"
                      label="คำตอบที่ถูกต้อง"
                      :error-messages="errors"
                      row
                    >
                      <v-radio label="ก." :value="questionForm.a"></v-radio>
                      <v-radio label="ข." :value="questionForm.b"></v-radio>
                      <v-radio label="ค." :value="questionForm.c"></v-radio>
                      <v-radio label="ง." :value="questionForm.d"></v-radio>
                    </v-radio-group>
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
import { required } from "vee-validate/dist/rules";

setInteractionMode("eager");

extend("required", {
  ...required,
  message: "กรุณากรอก {_field_}",
});

export default {
  name: "QuizAdd",
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  data: () => ({
    isLoading: false,
    url: null,
    valid: true,
    questionForm: {
      question: "",
      a: "",
      b: "",
      c: "",
      d: "",
      answer: "",
      questionImg: null,
      lessonId: "",
      newImg: null,
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
      this.isLoading = true;
      const isValid = await this.$refs.observer.validate();

      if (isValid) {
        let formData = new FormData();

        for (const key in this.questionForm) {
          formData.append(key, this.questionForm[key]);
          console.log(this.questionForm[key]);
        }

        this.$http
          .post(`${process.env.VUE_APP_API_PATH}/quiz/updateQuiz.php`, formData)
          .then((res) => {
            this.isLoading = false;
            console.log(res.data);
            this.$router.push({
              name: "QuizList",
              query: { lessonId: this.questionForm.lessonId },
            });
          })
          .catch((err) => {
            this.isLoading;
            console.log(err);
          });
      }
    },

    getQuiz() {
      this.isLoading = true;

      const jsonData = JSON.stringify({ quizId: this.$route.query.quizId });

      this.$http
        .post(`${process.env.VUE_APP_API_PATH}/quiz/getQuiz.php`, jsonData)
        .then((res) => {
          this.isLoading = false;
          this.questionForm = res.data[0];
          console.log("questionForm", this.questionForm);
        })
        .catch((err) => {
          this.isLoading = false;
          console.log(err);
        });
    },
  },

  created() {
    this.getQuiz();
    console.log("QuizEdit", this.$route.query);
  },
};
</script>
