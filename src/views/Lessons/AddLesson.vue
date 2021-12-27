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
                      item-text="subjectName"
                      item-value="subjectId"
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
                    outlined
                    truncate-length="50"
                    prepend-icon="mdi-image"
                    dense
                  ></v-file-input>
                </v-col>
              </v-row>

              <v-row class="mb-3" no-gutters>
                <v-col cols="12">
                  <h6>วิดีโอการสอน</h6>
                </v-col>
                <v-col>
                  <v-btn
                    color="primary"
                    @click="showUploadInput = !showUploadInput"
                    >เพิ่มวิดีโอการสอน</v-btn
                  >
                  <v-btn
                    class="ml-3"
                    color="success"
                    @click="showModal = !showModal"
                    >เลือกวิดีโอการสอน</v-btn
                  >
                </v-col>
              </v-row>

              <v-row no-gutters v-if="!isUpload && showUploadInput">
                <v-col :cols="lessonVideo ? 8 : 12">
                  <v-file-input
                    @change="checkFileSize"
                    v-model="lessonVideo"
                    accept="video/*"
                    label="วิดีโอการสอน"
                    :rules="rules"
                    truncate-length="50"
                    prepend-icon="mdi-record"
                  ></v-file-input>
                </v-col>
                <v-col cols="4" v-if="lessonVideo">
                  <v-btn class="ml-4 mt-3" color="primary" @click="uploadVideo"
                    >อัพโหลดวิดีโอการสอน</v-btn
                  >
                </v-col>
              </v-row>

              <v-progress-linear
                v-model="uploadPercentage"
                color="primary"
                height="25"
                v-if="isUpload"
              >
                <template v-slot:default="{ value }">
                  <strong>{{ Math.ceil(value) }}%</strong>
                </template>
              </v-progress-linear>

              <v-row no-gutters class="mb-5">
                <v-col cols="12">
                  <h6>เนื้อหา</h6>
                </v-col>
                <v-spacer></v-spacer>
                <v-col class="justify-end">
                  <v-btn class="mb-2" color="primary" @click="clearContent"
                    >ล้างเนื้อหา</v-btn
                  >
                </v-col>
                <v-col cols="12">
                  <lesson-quill
                    :content.sync="content"
                    @contentChange="contentChange"
                  ></lesson-quill>
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
                <!-- <v-col cols="12">
                  <v-file-input
                    ref="videoFile"
                    multiple
                    @change="previewFiles"
                    v-model="lessonForm.files"
                    accept="application/pdf"
                    label="แนบไฟล์"
                    truncate-length="50"
                    :show-size="1000"
                  ></v-file-input>
                </v-col> -->
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

    <v-dialog
      v-model="showModal"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="showModal = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Settings</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark text @click="showModal = false"> Save </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-list three-line subheader>
          <v-subheader>User Controls</v-subheader>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Content filtering</v-list-item-title>
              <v-list-item-subtitle
                >Set the content filtering level to restrict apps that can be
                downloaded</v-list-item-subtitle
              >
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Password</v-list-item-title>
              <v-list-item-subtitle
                >Require password for purchase or use password to restrict
                purchase</v-list-item-subtitle
              >
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-divider></v-divider>
        <v-list three-line subheader>
          <v-subheader>General</v-subheader>
          <v-list-item>
            <v-list-item-action>
              <v-checkbox v-model="notifications"></v-checkbox>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Notifications</v-list-item-title>
              <v-list-item-subtitle
                >Notify me about updates to apps or games that I
                downloaded</v-list-item-subtitle
              >
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-action>
              <v-checkbox v-model="sound"></v-checkbox>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Sound</v-list-item-title>
              <v-list-item-subtitle
                >Auto-update apps at any time. Data charges may
                apply</v-list-item-subtitle
              >
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-action>
              <v-checkbox v-model="widgets"></v-checkbox>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Auto-add widgets</v-list-item-title>
              <v-list-item-subtitle
                >Automatically add home screen widgets</v-list-item-subtitle
              >
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import "@/mixins/generalMixin";
import LessonQuill from "@/components/Editor/LessonQuill";
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
    LessonQuill,
    // pdf,
  },
  data: () => ({
    rules: [
      (value) =>
        !value || value.size < 120000000 || "ไฟล์ต้องมีขนาดน้อยกว่า 120 MB",
    ],
    showUploadInput: false,
    isUpload: false,
    isLoading: false,
    content: "",
    url: null,
    valid: true,
    uploadPercentage: 0,
    lessonForm: {
      courseName: "",
      lessonName: "",
      lessonImage: null,
      files: [],
    },
    lessonVideo: null,
    subjects: [],
    showModal: false,
    notifications: false,
    sound: true,
    widgets: false,
    videoList: [],
  }),

  methods: {
    checkFileSize() {
      if (this.lessonVideo) {
        if (this.lessonVideo.size > 120000000) {
          this.lessonVideo = null;
        }
      }
    },

    clearContent() {
      this.content = "";
      localStorage.setItem("content", "");
    },

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

    uploadVideo() {
      this.isUpload = true;
      let formData = new FormData();

      formData.append("lessonVideo", this.lessonVideo);

      this.$http
        .post(
          `${process.env.VUE_APP_API_PATH}/lesson/uploadVideo.php`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            onUploadProgress: function (progressEvent) {
              this.uploadPercentage = parseInt(
                Math.round((progressEvent.loaded / progressEvent.total) * 100)
              );
            }.bind(this),
          }
        )
        .then((res) => {
          this.$toast.open("อัพโหลดวิดีโอสำเร็จ");
          this.lessonVideo = null;
          this.isUpload = false;
          console.log(res);
        })
        .catch((err) => {
          this.isUpload = false;
          this.lessonVideo = null;
          console.log(err);
        });
    },

    submit() {
      this.isLoading = true;
      console.log(this.lessonForm);
      let formData = new FormData();

      for (const key in this.lessonForm) {
        formData.append(key, this.lessonForm[key]);
        console.log(this.lessonForm[key]);
      }

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

    contentChange(content) {
      this.content = content;
    },

    getAllSubject() {
      this.subjects = this.get("/subject/getAllActiveSubject.php");
    },
  },
  async created() {
    this.content = localStorage.getItem("content");
    this.subjects = await this.get("/subject/getAllActiveSubject.php");
    this.videoList = await this.get("/lesson/getAllVideo.php");
    console.log(this.videoList);
    setInterval(() => {
      localStorage.setItem("content", this.content);
      console.log("contentSave");
    }, 30000);
  },
};
</script>
