<template>
  <v-container fluid class="mt-3">
    <v-btn color="info" @click="$router.go(-1)" class="mr-2"
      ><v-icon small class="mr-1">mdi-arrow-left</v-icon> ย้อนกลับ</v-btn
    >
    <v-card class="mt-3">
      <v-card-title>
        เพิ่มแบบฝึกหัด
        <v-btn
          :color="activeButton === 'choice' ? 'primary' : ''"
          @click="activeButton = 'choice'"
          class="ml-3"
          ><v-icon small class="mr-1">mdi-text-box-check</v-icon>
          แบบตัวเลือก</v-btn
        >
        <v-btn
          :color="activeButton === 'text' ? 'primary' : ''"
          @click="activeButton = 'text'"
          class="ml-3"
          ><v-icon small class="mr-1">mdi-file-document-edit-outline</v-icon>
          แบบเติมคำ</v-btn
        >
      </v-card-title>
      <v-card-text v-if="activeButton === 'choice'">
        <validation-observer ref="observer">
          <v-form @submit.prevent="submit">
            <v-container>
              <v-row class="mb-3" align="center" justify="center">
                <FormImage v-if="url" :src="url" />
              </v-row>

              <v-row no-gutters>
                <v-col cols="12">
                  <v-file-input
                    @change="onFileChange"
                    accept="image/*"
                    label="รูปแบบฝึกหัด"
                    v-model="questionForm.questionImg"
                    dense
                    outlined
                  ></v-file-input>
                </v-col>
              </v-row>

              <v-row no-gutters v-if="questionForm.questionType === 'choice'">
                <v-col cols="12">
                  <validation-provider v-slot="{ errors }" name="คำถาม">
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
                    >
                      <template v-slot:append-outer>
                        <v-icon @click="switchToSound">mdi-book-open</v-icon>
                      </template>
                    </v-text-field>
                  </validation-provider>
                </v-col>
              </v-row>

              <v-row no-gutters v-if="questionForm.questionType === 'sound'">
                <v-col cols="12">
                  <validation-provider
                    v-slot="{ errors }"
                    name="ไฟล์คำถาม"
                    rules="required"
                  >
                    <v-file-input
                      accept="audio/mp3,audio/*;capture=microphone"
                      prepend-icon="mdi-music-note"
                      dense
                      outlined
                      v-model="questionForm.question2"
                      :error-messages="errors"
                      label="ไฟล์คำถาม"
                      required
                    >
                      <template v-slot:append-outer>
                        <v-icon @click="switchToText" color="green"
                          >mdi-music-note</v-icon
                        >
                      </template>
                    </v-file-input>
                  </validation-provider>
                </v-col>
              </v-row>

              <v-row no-gutters v-if="questionForm.questionType === 'sound'">
                <v-col cols="12">
                  <validation-provider v-slot="{ errors }" name="คำถาม">
                    <v-text-field
                      type="text"
                      prepend-icon="mdi-image"
                      dense
                      outlined
                      maxlength="100"
                      v-model="questionForm.question"
                      :error-messages="errors"
                      label="คำถาม"
                      required
                    >
                    </v-text-field>
                  </validation-provider>
                </v-col>
              </v-row>

              <!-- answer A -->
              <v-row no-gutters>
                <v-col cols="12" v-if="showA1">
                  <v-row class="mb-3" align="center" justify="center">
                    <FormImage v-if="a1Url" :src="a1Url" />
                  </v-row>

                  <validation-provider
                    v-slot="{ errors }"
                    name="รูปคำตอบข้อ a."
                    rules="required"
                  >
                    <v-file-input
                      @change="onA1Change"
                      prepend-icon="mdi-image"
                      accept="image/*"
                      label="รูปคำตอบข้อ a."
                      v-model="questionForm.a1"
                      :error-messages="errors"
                      dense
                      outlined
                    >
                      <template v-slot:append-outer>
                        <v-icon color="primary" @click="addImage('a')"
                          >mdi-image-plus</v-icon
                        >
                      </template>
                    </v-file-input>
                  </validation-provider>
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
                    <FormImage v-if="b1Url" :src="b1Url" />
                  </v-row>

                  <validation-provider
                    v-slot="{ errors }"
                    name="รูปคำตอบข้อ b."
                    rules="required"
                  >
                    <v-file-input
                      @change="onB1Change"
                      prepend-icon="mdi-image"
                      accept="image/*"
                      label="รูปคำตอบข้อ b."
                      v-model="questionForm.b1"
                      :error-messages="errors"
                      dense
                      outlined
                    >
                      <template v-slot:append-outer>
                        <v-icon color="primary" @click="addImage('b')"
                          >mdi-image-plus</v-icon
                        >
                      </template>
                    </v-file-input>
                  </validation-provider>
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
                    <FormImage v-if="c1Url" :src="c1Url" />
                  </v-row>

                  <validation-provider
                    v-slot="{ errors }"
                    name="รูปคำตอบข้อ c."
                    rules="required"
                  >
                    <v-file-input
                      @change="onC1Change"
                      prepend-icon="mdi-image"
                      accept="image/*"
                      label="รูปคำตอบข้อ c."
                      v-model="questionForm.c1"
                      dense
                      :error-messages="errors"
                      outlined
                    >
                      <template v-slot:append-outer>
                        <v-icon color="primary" @click="addImage('c')"
                          >mdi-image-plus</v-icon
                        >
                      </template>
                    </v-file-input>
                  </validation-provider>
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
                    <FormImage v-if="d1Url" :src="d1Url" />
                  </v-row>

                  <validation-provider
                    v-slot="{ errors }"
                    name="รูปคำตอบข้อ d."
                    rules="required"
                  >
                    <v-file-input
                      @change="onD1Change"
                      prepend-icon="mdi-image"
                      accept="image/*"
                      label="รูปคำตอบข้อ d."
                      v-model="questionForm.d1"
                      dense
                      :error-messages="errors"
                      outlined
                    >
                      <template v-slot:append-outer>
                        <v-icon color="primary" @click="addImage('d')"
                          >mdi-image-plus</v-icon
                        >
                      </template>
                    </v-file-input>
                  </validation-provider>
                </v-col>
                <v-col :cols="!showD1 ? 12 : 6" v-if="!showD1">
                  <validation-provider
                    v-slot="{ errors }"
                    name="คำตอบข้อ d."
                    rules="required"
                  >
                    <v-text-field
                      :class="!showC1 ? '' : 'ml-2'"
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

      <v-card-text v-if="activeButton === 'text'">
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
                      label="ระบุคำสั่ง"
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
                :loading="isLoading"
              >
                ยืนยัน
              </v-btn>
            </v-col>
          </v-form>
        </validation-observer>
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
import { required, is_not } from "vee-validate/dist/rules";
import FormImage from "@/components/Form/FormImage";
import Loading from "@/components/Loading";

setInteractionMode("eager");

extend("required", {
  ...required,
  message: "กรุณากรอก {_field_}",
});

extend("is_not", {
  ...is_not,
});

export default {
  name: "QuizAdd",
  components: {
    ValidationProvider,
    ValidationObserver,
    FormImage,
    Loading,
  },
  data: () => ({
    showA1: false,
    showB1: false,
    showC1: false,
    showD1: false,
    activeButton: "choice",
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
      questionType: "choice",
      question: "",
      question2: "",
      a: "",
      a1: null,
      b: "",
      b1: null,
      c: "",
      c1: null,
      d: "",
      d1: null,
      answer: "",
      questionImg: null,
      lessonId: "",
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

    showTextQuiz(type) {
      this.activeButton = type;
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

    onFileChange(e) {
      if (e) {
        this.url = URL.createObjectURL(e);
      } else {
        this.url = null;
      }
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
            `${process.env.VUE_APP_API_PATH}/quiz/addTextQuiz.php`,
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

        const { answer, a, a1, b, b1, c, c1, d, d1 } = this.questionForm;
        if (answer === "a") {
          a
            ? (this.questionForm.answer = a)
            : (this.questionForm.answer = a1.name);
        }
        if (answer === "b") {
          b
            ? (this.questionForm.answer = b)
            : (this.questionForm.answer = b1.name);
        }
        if (answer === "c") {
          c
            ? (this.questionForm.answer = c)
            : (this.questionForm.answer = c1.name);
        }
        if (answer === "d") {
          d
            ? (this.questionForm.answer = d)
            : (this.questionForm.answer = d1.name);
        }
        this.isLoading = true;
        let formData = new FormData();
        for (const key in this.questionForm) {
          formData.append(key, this.questionForm[key]);
          console.log(this.questionForm[key]);
        }
        this.$http
          .post(`${process.env.VUE_APP_API_PATH}/quiz/addQuiz.php`, formData)
          .then((res) => {
            this.isLoading = false;
            console.log(res.data);
            this.$router.push({
              name: "QuizList",
              query: {
                lessonId: this.questionForm.lessonId,
                subjectId: this.$route.query.subjectId,
                subjectName: this.$route.query.subjectName,
              },
            });
          })
          .catch((err) => {
            this.isLoading;
            console.log(err);
          });
      }
    },
  },

  created() {
    this.questionForm.lessonId = this.$route.query.lessonId;
    this.questionForm.subjectId = this.$route.query.subjectId;
    console.log("QuizAdd", this.$route.query);
  },
};
</script>
