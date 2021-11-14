<template>
  <v-container fluid class="mt-3">
    <v-card class="mt-3">
      <v-card-title>เพิ่มข่าวสาร</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="submit">
          <v-container>
            <v-row no-gutters>
              <v-col cols="12">
                <h6>เนื้อหาข่าวสาร</h6>
              </v-col>
              <v-col cols="12">
                <ckeditor
                  v-model="editorData"
                  :config="editorConfig"
                ></ckeditor>
              </v-col>
            </v-row>

            <v-btn class="mt-3" type="submit" block color="primary">
              บันทึก
            </v-btn>
          </v-container>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { extend, setInteractionMode } from "vee-validate";
import { required } from "vee-validate/dist/rules";

setInteractionMode("eager");

extend("required", {
  ...required,
  message: "กรุณากรอก {_field_}",
});

export default {
  name: "AddLesson",
  components: {},
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
