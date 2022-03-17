<template>
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
          <v-img v-else :src="url" max-height="300" max-width="300"></v-img>
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
              </v-text-field>
            </validation-provider>
          </v-col>
        </v-row>

        <v-row class="mb-5 ml-4 mt-0" v-if="!newFile">
          <v-col cols="6">
            <vuetify-audio
              class="audio"
              flat
              :file="filePath(questionForm.question2, 'quiz')"
              color="primary"
            ></vuetify-audio>
          </v-col>
        </v-row>

        <v-row no-gutters>
          <v-col cols="12">
            <v-file-input
              accept="audio/mp3,audio/*;capture=microphone"
              prepend-icon="mdi-music-note"
              dense
              outlined
              v-model="newFile"
              label="ไฟล์คำถาม"
              required
            >
            </v-file-input>
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
          >
            ยืนยัน
          </v-btn>
        </v-col>
        <Loading :isLoading="isLoading" />
      </v-container>
    </v-form>
  </validation-observer>
</template>

<script>
import "@/mixins/generalMixin";
import {
  extend,
  ValidationObserver,
  ValidationProvider,
  setInteractionMode,
} from "vee-validate";
import { required } from "vee-validate/dist/rules";
import "@vime/core/themes/default.css";
import Loading from "@/components/Loading";
import FormImage from "@/components/Form/FormImage";

setInteractionMode("eager");

extend("required", {
  ...required,
  message: "กรุณากรอก {_field_}",
});

export default {
  name: "QuizSoundForm",
  props: {
    questionForm: Object,
  },
  components: {
    ValidationProvider,
    ValidationObserver,
    Loading,
    FormImage,
    VuetifyAudio: () => import("vuetify-audio"),
  },
  data() {
    return {
      showA1: false,
      showB1: false,
      showC1: false,
      showD1: false,
      a1Url: null,
      b1Url: null,
      c1Url: null,
      d1Url: null,
      newFile: null,
      isLoading: false,
    };
  },
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
        formData.append("newFile", this.newFile);

        this.$http
          .post(`${process.env.VUE_APP_API_PATH}/quiz/updateQuiz.php`, formData)
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
  },
  created() {
    console.log(this.questionForm);
    if (this.questionForm.a1) this.showA1 = true;
    if (this.questionForm.b1) this.showB1 = true;
    if (this.questionForm.c1) this.showC1 = true;
    if (this.questionForm.d1) this.showD1 = true;
  },
};
</script>
