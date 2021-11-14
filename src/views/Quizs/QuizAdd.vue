<template>
  <v-container fluid class="mt-3">
    <v-btn color="info" @click="$router.push('quiz-list')" class="mr-2"
      ><v-icon small class="mr-1">mdi-arrow-left</v-icon> ย้อนกลับ</v-btn
    >
    <v-card class="mt-3">
      <v-card-title> เพิ่มข้อสอบ</v-card-title>
      <v-card-text>
        <validation-observer ref="observer">
          <v-form @submit.prevent="submit">
            <v-container>
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
                      <v-radio label="ก." value="a"></v-radio>
                      <v-radio label="ข." value="b"></v-radio>
                      <v-radio label="ค." value="c"></v-radio>
                      <v-radio label="ง." value="d"></v-radio>
                    </v-radio-group>
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
    valid: true,
    questionForm: {
      question: "",
      a: "",
      b: "",
      c: "",
      d: "",
      answer: "",
    },
  }),
  methods: {
    submit() {
      console.log(this.questionForm);
      this.$refs.observer.validate();
    },
  },
};
</script>
