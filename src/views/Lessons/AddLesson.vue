<template>
  <v-container fluid class="mt-3">
    <v-btn color="info" @click="$router.go(-1)" class="mr-2"
      ><v-icon small class="mr-1">mdi-arrow-left</v-icon> ย้อนกลับ</v-btn
    >
    <v-card class="mt-3">
      <v-card-title>เพิ่มบทเรียน</v-card-title>
      <v-card-text>
        <validation-observer ref="observer">
          <v-form @submit.prevent="submit">
            <v-container>
              <v-row no-gutters>
                <v-col cols="12">
                  <validation-provider
                    v-slot="{ errors }"
                    name="รายวิชา"
                    rules="required"
                  >
                    <v-select
                      dense
                      prepend-icon="mdi-book-open"
                      :items="subjects"
                      v-model="lessonForm.subject"
                      :error-messages="errors"
                      label="รายวิชา"
                      outlined
                    ></v-select>
                  </validation-provider>
                </v-col>
              </v-row>

              <v-row no-gutters>
                <v-col cols="12">
                  <validation-provider
                    v-slot="{ errors }"
                    name="ชื่อบทเรียน"
                    rules="required"
                  >
                    <v-text-field
                      type="text"
                      prepend-icon="mdi-book-open-blank-variant"
                      dense
                      outlined
                      maxlength="100"
                      v-model="lessonForm.lessonName"
                      :error-messages="errors"
                      label="ชื่อบทเรียน"
                      required
                    ></v-text-field>
                  </validation-provider>
                </v-col>
              </v-row>

              <v-row no-gutters>
                <v-col cols="12">
                  <h6>เนื้อหา</h6>
                </v-col>
                <v-col cols="12">
                  <ckeditor
                    v-model="editorData"
                    :config="editorConfig"
                  ></ckeditor>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12" v-if="lessonForm.lessonImage">
                  <v-img
                    class="mx-auto"
                    :aspect-ratio="16 / 9"
                    :src="url"
                    max-height="300"
                    max-width="500"
                  ></v-img>
                </v-col>
                <v-col cols="12">
                  <v-file-input
                    @change="previewImage"
                    v-model="lessonForm.lessonImage"
                    accept="image/*"
                    label="ภาพประกอบ"
                    truncate-length="50"
                    prepend-icon="mdi-image"
                  ></v-file-input>
                </v-col>
              </v-row>

              <!-- <pdf src="pdf/sample.pdf"></pdf> -->

              <v-row no-gutters>
                <v-row no-gutters v-if="lessonForm.files.length > 0">
                  <v-chip
                    v-for="(file, index) in lessonForm.files"
                    :key="index"
                    color="primary"
                    class="mr-1 mb-2"
                    dark
                    label
                  >
                    <label @click="openFile(file)">
                      {{ file.name }}
                    </label>
                    <v-icon class="ml-1" small @click="removeFile(index)"
                      >mdi-close-thick</v-icon
                    >
                  </v-chip>
                </v-row>
                <v-col cols="12">
                  <v-file-input
                    multiple
                    @change="previewFiles"
                    v-model="lessonForm.files"
                    accept="application/pdf"
                    label="แนบไฟล์"
                    truncate-length="50"
                    :show-size="1000"
                  ></v-file-input>
                </v-col>
              </v-row>

              <v-row>
                <v-btn class="mr-4" type="submit" block color="primary">
                  ยืนยัน
                </v-btn>
              </v-row>
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
// import pdf from "vue-pdf";

setInteractionMode("eager");

extend("required", {
  ...required,
  message: "กรุณากรอก {_field_}",
});

export default {
  name: "AddLesson",
  components: {
    ValidationProvider,
    ValidationObserver,
    // pdf,
  },
  data: () => ({
    url: null,
    editorData: "",
    editorConfig: {},
    valid: true,
    lessonForm: {
      courseName: "",
      lessonName: "",
      lessonImage: null,
      files: [],
    },
    subjects: ["ศัพท์เบื้องต้น", "ศัพท์ไทยเบื้องต้น", "ศัพท์ญี่ปุ่นเบื้องต้น"],
  }),
  methods: {
    removeFile(index) {
      this.lessonForm.files.splice(index, 1);
    },
    openFile(file) {
      console.log(file);
      const fileUrl = "pdf/sample.pdf";
      window.open(fileUrl);
    },
    previewFiles() {
      console.log(this.lessonForm.files);
    },
    previewImage() {
      if (this.lessonForm.lessonImage !== null) {
        this.url = URL.createObjectURL(this.lessonForm.lessonImage);
      }
    },
    submit() {
      this.$refs.observer.validate().then((result) => {
        if (result) {
          if (this.editorData === "") {
            this.$swal.fire({
              icon: "error",
              title: "กรุณากรอกเนื้อหา",
              confirmButtonText: "ตกลง",
            });
          }
        }
      });
    },
  },
};
</script>
