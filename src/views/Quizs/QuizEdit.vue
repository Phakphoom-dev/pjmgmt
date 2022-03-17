<template>
  <v-container fluid class="mt-3">
    <v-btn color="info" @click="$router.go(-1)" class="mr-2"
      ><v-icon small class="mr-1">mdi-arrow-left</v-icon> ย้อนกลับ</v-btn
    >
    <v-card class="mt-3">
      <v-card-title> แก้ไขแบบฝึกหัด</v-card-title>
      <v-card-text v-if="quizType === 'choice'">
        <validation-observer ref="observer">
          <v-form @submit.prevent="submit">
            <v-container>
              <v-row class="mb-3" align="center" justify="center">
                <FormImage
                  v-if="!questionForm.newImg"
                  :src="imgPath(questionForm.questionImg, 'quiz')"
                />
                <FormImage v-else :src="url" />
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

              <!-- answer A -->
              <v-row no-gutters>
                <v-col cols="12" v-if="showA1">
                  <v-row class="mb-3" align="center" justify="center">
                    <FormImage
                      v-if="!questionForm.newA1Img"
                      :src="imgPath(questionForm.a1, 'quiz')"
                    />
                    <FormImage v-if="a1Url" :src="a1Url" />
                  </v-row>

                  <v-file-input
                    @change="onA1Change"
                    prepend-icon="mdi-image"
                    accept="image/*"
                    label="รูปคำตอบข้อ a."
                    v-model="questionForm.newA1Img"
                    dense
                    outlined
                  >
                    <template v-slot:append-outer>
                      <v-icon color="primary" @click="addImage('a')"
                        >mdi-image-plus</v-icon
                      >
                    </template>
                  </v-file-input>
                </v-col>
                <v-col :cols="!showA1 ? 12 : 6" v-if="!showA1">
                  <validation-provider
                    v-slot="{ errors }"
                    name="คำตอบข้อ a."
                    rules="required"
                  >
                    <v-text-field
                      :class="!showA1 ? '' : 'ml-2'"
                      type="text"
                      prepend-icon="mdi-forum"
                      dense
                      outlined
                      maxlength="100"
                      v-model="questionForm.a"
                      :error-messages="errors"
                      label="คำตอบข้อ a."
                      required
                    >
                      <template v-slot:append-outer>
                        <v-icon @click="addImage('a')">mdi-image-plus</v-icon>
                      </template>
                    </v-text-field>
                  </validation-provider>
                </v-col>
              </v-row>

              <!-- answer B -->
              <v-row no-gutters>
                <v-col cols="12" v-if="showB1">
                  <v-row class="mb-3" align="center" justify="center">
                    <FormImage
                      v-if="!questionForm.newB1Img"
                      :src="imgPath(questionForm.b1, 'quiz')"
                    />
                    <FormImage :src="b1Url" />
                  </v-row>

                  <v-file-input
                    @change="onB1Change"
                    prepend-icon="mdi-image"
                    accept="image/*"
                    label="รูปคำตอบข้อ b."
                    v-model="questionForm.newB1Img"
                    dense
                    outlined
                  >
                    <template v-slot:append-outer>
                      <v-icon color="primary" @click="addImage('b')"
                        >mdi-image-plus</v-icon
                      >
                    </template>
                  </v-file-input>
                </v-col>
                <v-col :cols="!showB1 ? 12 : 6" v-if="!showB1">
                  <validation-provider
                    v-slot="{ errors }"
                    name="คำตอบข้อ b."
                    rules="required"
                  >
                    <v-text-field
                      :class="!showB1 ? '' : 'ml-2'"
                      type="text"
                      prepend-icon="mdi-forum"
                      dense
                      outlined
                      maxlength="100"
                      v-model="questionForm.b"
                      :error-messages="errors"
                      label="คำตอบข้อ b."
                      required
                    >
                      <template v-slot:append-outer>
                        <v-icon @click="addImage('b')">mdi-image-plus</v-icon>
                      </template>
                    </v-text-field>
                  </validation-provider>
                </v-col>
              </v-row>

              <!-- answer C -->
              <v-row no-gutters>
                <v-col cols="12" v-if="showC1">
                  <v-row class="mb-3" align="center" justify="center">
                    <FormImage
                      v-if="!questionForm.newC1Img"
                      :src="imgPath(questionForm.c1, 'quiz')"
                    />
                    <FormImage :src="c1Url" />
                  </v-row>

                  <v-file-input
                    @change="onC1Change"
                    prepend-icon="mdi-image"
                    accept="image/*"
                    label="รูปคำตอบข้อ c."
                    v-model="questionForm.newC1Img"
                    dense
                    outlined
                  >
                    <template v-slot:append-outer>
                      <v-icon color="primary" @click="addImage('c')"
                        >mdi-image-plus</v-icon
                      >
                    </template>
                  </v-file-input>
                </v-col>
                <v-col :cols="!showC1 ? 12 : 6" v-if="!showC1">
                  <validation-provider
                    v-slot="{ errors }"
                    name="คำตอบข้อ c."
                    rules="required"
                  >
                    <v-text-field
                      :class="!showC1 ? '' : 'ml-2'"
                      type="text"
                      prepend-icon="mdi-forum"
                      dense
                      outlined
                      maxlength="100"
                      v-model="questionForm.c"
                      :error-messages="errors"
                      label="คำตอบข้อ c."
                      required
                    >
                      <template v-slot:append-outer>
                        <v-icon @click="addImage('c')">mdi-image-plus</v-icon>
                      </template>
                    </v-text-field>
                  </validation-provider>
                </v-col>
              </v-row>

              <!-- answer D -->
              <v-row no-gutters>
                <v-col cols="12" v-if="showD1">
                  <v-row class="mb-3" align="center" justify="center">
                    <FormImage
                      v-if="!questionForm.newD1Img"
                      :src="imgPath(questionForm.d1, 'quiz')"
                    />
                    <FormImage :src="d1Url" />
                  </v-row>

                  <v-file-input
                    @change="onD1Change"
                    prepend-icon="mdi-image"
                    accept="image/*"
                    label="รูปคำตอบข้อ d."
                    v-model="questionForm.newD1Img"
                    dense
                    outlined
                  >
                    <template v-slot:append-outer>
                      <v-icon color="primary" @click="addImage('d')"
                        >mdi-image-plus</v-icon
                      >
                    </template>
                  </v-file-input>
                </v-col>
                <v-col :cols="!showD1 ? 12 : 6" v-if="!showD1">
                  <validation-provider
                    v-slot="{ errors }"
                    name="คำตอบข้อ d."
                    rules="required"
                  >
                    <v-text-field
                      :class="!showD1 ? '' : 'ml-2'"
                      type="text"
                      prepend-icon="mdi-forum"
                      dense
                      outlined
                      maxlength="100"
                      v-model="questionForm.d"
                      :error-messages="errors"
                      label="คำตอบข้อ d."
                      required
                    >
                      <template v-slot:append-outer>
                        <v-icon @click="addImage('d')">mdi-image-plus</v-icon>
                      </template>
                    </v-text-field>
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
                      <v-radio label="a." :value="'a'"></v-radio>
                      <v-radio label="b." :value="'b'"></v-radio>
                      <v-radio label="c." :value="'c'"></v-radio>
                      <v-radio label="d." :value="'d'"></v-radio>
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
                  :loading="isLoading"
                >
                  ยืนยัน
                </v-btn>
              </v-col>
            </v-container>
          </v-form>
        </validation-observer>
      </v-card-text>

      <v-card-text v-if="quizType === 'text'">
        <validation-observer ref="observer">
          <v-form @submit.prevent="textFormSubmit">
            <v-container>
              <v-row no-gutters>
                <v-col cols="12">
                  <validation-provider
                    v-slot="{ errors }"
                    name="หัวข้อ"
                    rules="required"
                  >
                    <v-text-field
                      type="text"
                      prepend-icon="mdi-book-open"
                      dense
                      outlined
                      maxlength="100"
                      v-model="textQuestion"
                      :error-messages="errors"
                      label="ชื่อหัวข้อ"
                      required
                    ></v-text-field>
                  </validation-provider>
                </v-col>
              </v-row>

              <v-row no-gutters v-for="(form, index) in textForm" :key="index">
                <v-col cols="6">
                  <validation-provider
                    v-slot="{ errors }"
                    name="คำถาม"
                    rules="required"
                  >
                    <v-text-field
                      type="text"
                      prepend-icon="mdi-forum"
                      dense
                      outlined
                      maxlength="100"
                      v-model="form.question"
                      :error-messages="errors"
                      label="คำถาม"
                      required
                    ></v-text-field>
                  </validation-provider>
                </v-col>
                <v-col cols="6">
                  <validation-provider
                    v-slot="{ errors }"
                    name="คำตอบ"
                    rules="required"
                  >
                    <v-text-field
                      class="ml-2"
                      type="text"
                      prepend-icon="mdi-check-outline"
                      dense
                      outlined
                      maxlength="100"
                      v-model="form.textAnswer"
                      :error-messages="errors"
                      label="คำตอบ"
                      required
                    >
                      <!-- <template v-slot:append-outer>
                        <v-btn
                          v-if="index !== 0 && index !== textForm.length - 1"
                          small
                          color="error"
                          @click="removeTextQuestion(index)"
                        >
                          <v-icon>mdi-minus-thick</v-icon>
                        </v-btn>

                        <v-btn
                          v-if="index === textForm.length - 1"
                          small
                          color="info"
                          @click="addTextQuestion"
                        >
                          <v-icon>mdi-plus-thick</v-icon>
                        </v-btn>
                      </template> -->
                    </v-text-field>
                  </validation-provider>
                </v-col>
              </v-row>
            </v-container>
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
          </v-form>
        </validation-observer>
      </v-card-text>

      <v-card-text v-if="showSoundForm">
        <quiz-sound-form :questionForm="questionForm"></quiz-sound-form>
      </v-card-text>
    </v-card>
    <Loading :isLoading="isLoading" />
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
import QuizSoundForm from "@/components/Quiz/QuizSoundForm.vue";
import FormImage from "@/components/Form/FormImage.vue";
import Loading from "@/components/Loading";

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
    QuizSoundForm,
    FormImage,
    Loading,
  },
  data: () => ({
    showA1: false,
    showB1: false,
    showC1: false,
    showD1: false,
    showSoundForm: false,
    quizType: "",
    isLoading: false,
    url: null,
    a1Url: null,
    b1Url: null,
    c1Url: null,
    d1Url: null,
    valid: true,
    textQuestion: "",
    textForm: [
      {
        question: "",
        textAnswer: "",
      },
    ],
    questionForm: {
      question: "",
      a: "",
      a1: "",
      b: "",
      b1: "",
      c: "",
      c1: "",
      d: "",
      d1: "",
      newA1Img: null,
      newB1Img: null,
      newC1Img: null,
      newD1Img: null,
      answer: "",
      questionImg: null,
      lessonId: "",
      newImg: null,
      subjectId: "",
    },
  }),
  methods: {
    addImage(input) {
      switch (input) {
        case "a":
          this.questionForm.a = "";
          this.showA1 = !this.showA1;
          break;
        case "b":
          this.questionForm.b = "";
          this.showB1 = !this.showB1;
          break;
        case "c":
          this.questionForm.c = "";
          this.showC1 = !this.showC1;
          break;
        case "d":
          this.questionForm.d = "";
          this.showD1 = !this.showD1;
          break;
      }
    },

    onA1Change(e) {
      if (e) {
        this.a1Url = URL.createObjectURL(e);
      } else {
        this.a1Url = null;
      }
    },

    onB1Change(e) {
      if (e) {
        this.b1Url = URL.createObjectURL(e);
      } else {
        this.b1Url = null;
      }
    },

    onC1Change(e) {
      if (e) {
        this.c1Url = URL.createObjectURL(e);
      } else {
        this.c1Url = null;
      }
    },

    onD1Change(e) {
      if (e) {
        this.d1Url = URL.createObjectURL(e);
      } else {
        this.d1Url = null;
      }
    },

    switchToSound() {
      this.questionForm.question = null;
      this.questionForm.questionType = "sound";
    },

    switchToText() {
      this.questionForm.question = null;
      this.questionForm.questionType = "choice";
    },

    removeTextQuestion(index) {
      this.textForm.splice(index, 1);
    },

    addTextQuestion() {
      this.textForm.push({
        question: "",
        textAnswer: "",
      });
    },

    async textFormSubmit() {
      const isValid = await this.$refs.observer.validate();

      if (isValid) {
        this.isLoading = true;

        this.textForm.map((form, index) => {
          this.textForm[index].subjectId = this.$route.query.subjectId;
          this.textForm[index].lessonId = this.$route.query.lessonId;
          this.textForm[index].textQuestion = this.textQuestion;
        });

        this.$http
          .post(
            `${process.env.VUE_APP_API_PATH}/quiz/editTextQuiz.php`,
            JSON.stringify(this.textForm)
          )
          .then((res) => {
            this.isLoading = false;
            console.log(res.data);
            this.$router.push({
              name: "QuizList",
              query: {
                lessonId: this.questionForm.lessonId,
                subjectId: this.$route.query.subjectId,
              },
            });
          })
          .catch((err) => {
            this.isLoading;
            console.log(err);
          });
      }
    },

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
        if (
          this.questionForm.questionType === "choice" ||
          this.questionForm.questionType === "text"
        ) {
          if (this.questionForm.question.includes(".")) {
            this.$swal.fire({
              icon: "info",
              title: "ไม่สามารถมี . ในคำถามได้",
              confirmButtonText: "ตกลง",
            });
            return;
          }
        }

        this.isLoading = true;

        console.log(this.questionForm);
        const {
          answer,
          a,
          b,
          c,
          d,
          a1,
          b1,
          c1,
          d1,
          newA1Img,
          newB1Img,
          newC1Img,
          newD1Img,
        } = this.questionForm;

        if (answer === "a") {
          if (a) {
            this.questionForm.answer = a;
          }

          if (newA1Img) {
            this.questionForm.answer = newA1Img.name;
          }

          if (a1) {
            this.questionForm.answer = a1;
          }
        }

        console.log("asdf", this.questionForm);

        if (answer === "b") {
          if (b) {
            this.questionForm.answer = b;
          }

          if (newB1Img) {
            this.questionForm.answer = newB1Img.name;
          }

          if (b1) {
            this.questionForm.answer = b1;
          }
        }

        if (answer === "c") {
          if (c) {
            this.questionForm.answer = c;
          }

          if (newC1Img) {
            this.questionForm.answer = newC1Img.name;
          }

          if (c1) {
            this.questionForm.answer = c1;
          }
        }

        if (answer === "d") {
          if (d) {
            this.questionForm.answer = d;
          }

          if (newD1Img) {
            this.questionForm.answer = newD1Img.name;
          }

          if (d1) {
            this.questionForm.answer = d1;
          }
        }

        if (a) {
          this.questionForm.a1 = "";
        }

        if (b) {
          this.questionForm.b1 = "";
        }

        if (c) {
          this.questionForm.c1 = "";
        }

        if (d) {
          this.questionForm.d1 = "";
        }

        this.isLoading = true;

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
              query: {
                lessonId: this.questionForm.lessonId,
                subjectId: this.questionForm.subjectId,
              },
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
          if (this.quizType === "choice") {
            this.questionForm = res.data[0];
            console.log("questionForm", this.questionForm);
          }

          if (this.quizType === "text") {
            this.textQuestion = res.data[0].question;
            this.textForm[0].question = res.data[0].a;
            this.textForm[0].textAnswer = res.data[0].answer;
            this.textForm[0].quizId = res.data[0].quizId;
            console.log("textForm", this.textForm);
          }

          if (this.quizType === "sound") {
            this.questionForm = res.data[0];
            this.showSoundForm = true;
          }

          if (this.questionForm.a1) this.showA1 = true;
          if (this.questionForm.b1) this.showB1 = true;
          if (this.questionForm.c1) this.showC1 = true;
          if (this.questionForm.d1) this.showD1 = true;

          this.answerSetup();
        })
        .catch((err) => {
          this.isLoading = false;
          console.log(err);
        });
    },
    answerSetup() {
      console.log("function is called");
      this.questionForm.subjectId = this.$route.query.subjectId;
      const { answer, a, a1, b, b1, c, c1, d, d1 } = this.questionForm;

      if (answer === a1 || answer === a) {
        this.questionForm.answer = "a";
      }

      if (answer === b1 || answer === b) {
        this.questionForm.answer = "b";
      }

      if (answer === c1 || answer === c) {
        this.questionForm.answer = "c";
      }

      if (answer === d1 || answer === d) {
        this.questionForm.answer = "d";
      }
    },
  },

  async created() {
    this.quizType = this.$route.query.quizType;
    await this.getQuiz();
    console.log("QuizEdit", this.$route.query);
  },
};
</script>
