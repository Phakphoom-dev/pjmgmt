<template>
  <v-container fluid class="mt-3">
    <v-btn color="info" @click="$router.push('subject-lesson')" class="mr-2"
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
                    name="หลักสูตร"
                    rules="required"
                  >
                    <v-autocomplete
                      dense
                      prepend-icon="mdi-book-open"
                      :items="subjects"
                      item-text="subjectName"
                      item-value="subjectId"
                      v-model="lessonForm.subjectId"
                      :error-messages="errors"
                      label="หลักสูตร"
                      outlined
                    ></v-autocomplete>
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
                  <validation-provider
                    v-slot="{ errors }"
                    name="ภาพประกอบ"
                    rules="required"
                  >
                    <v-file-input
                      class="mt-2"
                      @change="previewImage"
                      v-model="lessonForm.lessonImage"
                      accept="image/*"
                      label="ภาพประกอบ"
                      outlined
                      :error-messages="errors"
                      truncate-length="50"
                      prepend-icon="mdi-image"
                      dense
                    ></v-file-input>
                  </validation-provider>
                </v-col>
              </v-row>

              <v-row no-gutters>
                <v-col cols="12">
                  <v-autocomplete
                    prepend-icon="mdi-camera"
                    v-model="lessonForm.filesId"
                    :items="videoList"
                    item-text="videoName"
                    item-value="videoId"
                    outlined
                    dense
                    chips
                    small-chips
                    label="วิดีโอประกอบบทเรียน"
                    multiple
                  >
                    <template v-slot:selection="data">
                      <v-chip
                        small
                        color="info"
                        close
                        @click:close="remove(data.item)"
                      >
                        {{ data.item.videoName }}
                      </v-chip>
                    </template>
                  </v-autocomplete>
                </v-col>
              </v-row>

              <MultipleUploadInput
                :fileList="files"
                @fileChange="fileChange"
              ></MultipleUploadInput>

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

              <!-- <v-row no-gutters> -->
              <!-- <v-row no-gutters v-if="lessonForm.files.length > 0">
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
                </v-row> -->
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
              <!-- </v-row> -->

              <v-row>
                <v-btn class="mr-4" type="submit" block color="primary">
                  <v-progress-circular
                    v-if="isLoading"
                    indeterminate
                    color="white"
                    :width="5"
                  ></v-progress-circular>
                  <span v-else>ยืนยัน</span>
                </v-btn>
              </v-row>
            </v-container>
          </v-form>
        </validation-observer>
      </v-card-text>
    </v-card>

    <!-- DeleteModal -->
    <v-dialog
      persistent
      v-model="showDelModal"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar dark color="error">
          <v-btn icon dark @click="closeDelModal">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>ลบวิดีโอการสอน</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-list two-line>
          <v-list-item-group active-class="white">
            <template v-for="(item, index) in videoList">
              <v-list-item
                :key="item.videoId"
                @click="confirmDelete(item, index)"
              >
                <v-list-item-content>
                  <v-list-item-title
                    v-text="item.videoName"
                  ></v-list-item-title>
                </v-list-item-content>
              </v-list-item>

              <v-divider
                v-if="index < videoList.length - 1"
                :key="item.videoName"
              ></v-divider>
            </template>
          </v-list-item-group>
        </v-list>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import "@/mixins/generalMixin";
import LessonQuill from "@/components/Editor/LessonQuill";
import MultipleUploadInput from "@/components/MultipleUploadInput";
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
    MultipleUploadInput,
    // pdf,
  },
  data: () => ({
    showDelModal: false,
    selectedFiles: [],
    rules: [
      (value) =>
        !value || value.size < 500000000 || "ไฟล์ต้องมีขนาดน้อยกว่า 500 MB",
    ],
    showUploadInput: false,
    isUpload: false,
    isLoading: false,
    content: "",
    url: null,
    valid: true,
    confirmDel: false,
    uploadPercentage: 0,
    lessonForm: {
      subjectId: "",
      lessonName: "",
      lessonImage: null,
      filesId: [],
    },
    files: [],
    lessonVideo: null,
    subjects: [],
    showVideoModal: false,
    notifications: false,
    sound: true,
    widgets: false,
    videoList: [],
  }),

  methods: {
    fileChange(files) {
      this.files = files;
      console.log("files", this.files);
    },

    remove(item) {
      this.lessonForm.filesId = this.lessonForm.filesId.filter((lesson) => {
        return lesson !== item.videoId;
      });
    },

    removeSelected(video, index) {
      this.lessonForm.files = this.lessonForm.files.filter((e) => {
        return video.videoId !== e.videoId;
      });

      console.log(this.selectedFiles);

      this.selectedFiles.splice(index, 1);
    },

    submitVideo() {
      console.log("videoList", this.videoList);
      console.log("selectedFiles", this.selectedFiles);

      this.lessonForm.files = this.selectedFiles.map((file) => {
        return this.videoList[file];
      });

      console.log("lessonFiles", this.lessonForm.files);
      this.showVideoModal = false;
    },

    closeModal() {
      console.log("videoList", this.videoList);
      console.log("selectedFiles", this.selectedFiles);

      this.lessonForm.files = this.selectedFiles.map((file) => {
        return this.videoList[file];
      });

      console.log(this.lessonForm.files);
      this.showVideoModal = false;
    },

    closeDelModal() {
      this.showDelModal = false;
    },

    test(e) {
      console.log("click", e);
    },

    checkFileSize() {
      if (this.lessonVideo) {
        if (this.lessonVideo.size > 500000000) {
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
          this.getVideoList();
          console.log(res);
        })
        .catch((err) => {
          this.$toast.open({
            message: "เกิดข้อผิดพลาดไม่สามารถอัพโหลดได้",
            type: "error",
          });
          this.isUpload = false;
          this.lessonVideo = null;
          console.log(err);
        });
    },

    submit() {
      console.log("lessonForm", this.lessonForm);
      let formData = new FormData();

      for (const key in this.lessonForm) {
        formData.append(key, this.lessonForm[key]);
        console.log(this.lessonForm[key]);
      }

      for (const i of Object.keys(this.files)) {
        formData.append("files[]", this.files[i]);
      }

      formData.append("content", this.content);

      this.$refs.observer.validate().then((result) => {
        if (result) {
          if (this.content === "") {
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
              `${process.env.VUE_APP_API_PATH}/lesson/addLesson.php`,
              formData
            )
            .then((res) => {
              this.isLoading = false;
              console.log(res);
              if (res.data.isSuccess) {
                this.$router.push({
                  name: "ShowLessons",
                  query: { subjectId: this.$route.query.subjectId },
                });
              }
            })
            .catch((err) => {
              this.isLoading = false;
              console.log(err.response);
            });
        }
      });
    },

    contentChange(content) {
      this.content = content;
    },

    getAllSubject() {
      this.subjects = this.get("/subject/getAllSubject.php");
    },

    async getVideoList() {
      this.videoList = await this.get("/lesson/getAllVideo.php");
    },
  },
  async created() {
    this.subjects = await this.get("/subject/getAllSubject.php");
    this.getVideoList();
    this.lessonForm.subjectId = parseInt(this.$route.query.subjectId);
  },
};
</script>
