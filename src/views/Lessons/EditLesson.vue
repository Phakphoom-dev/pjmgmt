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
                      v-model="lessonForm.subjectId"
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

              <v-row class="mb-3" align="center" justify="center">
                <v-img
                  v-if="!lessonForm.newImage"
                  :src="imgPath(lessonForm.lessonImage, 'lesson')"
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
                    class="mt-2"
                    @change="previewImage"
                    v-model="lessonForm.newImage"
                    accept="image/*"
                    label="ภาพประกอบ"
                    outlined
                    truncate-length="50"
                    prepend-icon="mdi-image"
                    dense
                  ></v-file-input>
                </v-col>
              </v-row>

              <v-row class="mb-2" no-gutters>
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
                    @click="showVideoModal = !showVideoModal"
                    >เลือกวิดีโอการสอน</v-btn
                  >
                  <v-btn
                    class="ml-3"
                    color="error"
                    @click="showDelModal = !showDelModal"
                    >ลบวิดีโอการสอน</v-btn
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

              <v-row v-if="lessonForm.files.length > 0" class="mb-2">
                <v-col
                  cols="12"
                  v-for="(video, index) in lessonForm.files"
                  :key="video.videoId"
                >
                  <v-chip
                    color="green"
                    close
                    outlined
                    @click:close="removeSelected(video, index)"
                  >
                    {{ index + 1 }}. {{ video.videoName }}
                  </v-chip>
                </v-col>
              </v-row>

              <v-progress-linear
                class="mb-2"
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

    <!-- ShowVideoModal -->
    <v-dialog
      v-model="showVideoModal"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar dark color="success">
          <v-btn icon dark @click="closeModal">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>เลือกวิดีโอการสอน</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-list two-line>
          <v-list-item-group
            v-model="selectedFiles"
            active-class="success--text"
            multiple
          >
            <template v-for="(item, index) in videoList">
              <v-list-item :key="item.videoId">
                <template v-slot:default="{ active }">
                  <v-list-item-content>
                    <v-list-item-title
                      v-text="item.videoName"
                    ></v-list-item-title>
                  </v-list-item-content>

                  <v-list-item-action>
                    <!-- <v-list-item-action-text> 2 hr </v-list-item-action-text> -->

                    <v-icon v-if="!active" color="grey lighten-1">
                      mdi-checkbox-blank-outline
                    </v-icon>

                    <v-icon v-else color="primary"> mdi-minus-box </v-icon>
                  </v-list-item-action>
                </template>
              </v-list-item>

              <v-divider
                v-if="index < videoList.length - 1"
                :key="item.videoName"
              ></v-divider>
            </template>
          </v-list-item-group>
        </v-list>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="submitVideo"> ตกลง </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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
  name: "EditLesson",
  components: {
    ValidationProvider,
    ValidationObserver,
    LessonQuill,
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
      files: [],
      newImage: null,
    },
    lessonVideo: null,
    subjects: [],
    showVideoModal: false,
    notifications: false,
    sound: true,
    widgets: false,
    videoList: [],
  }),

  methods: {
    confirmDelete(video, index) {
      console.log(video, index);
      this.$swal
        .fire({
          title: `ต้องการที่จะลบ ${video.videoName} หรือไม่ ?`,
          icon: "warning",
          showCancelButton: true,
          allowOutsideClick: false,
          cancelButtonColor: "#d33",
          confirmButtonText: "ยืนยัน",
          cancelButtonText: "ยกเลิก",
        })
        .then((result) => {
          if (result.isConfirmed) {
            const jsonData = JSON.stringify({
              videoId: video.videoId,
              videoName: video.videoName,
            });

            this.$http
              .post(
                `${process.env.VUE_APP_API_PATH}/lesson/deleteVideo.php`,
                jsonData
              )
              .then((res) => {
                this.$swal.fire({
                  icon: "success",
                  title: res.data.message,
                  confirmButtonText: "ตกลง",
                });
                this.getVideoList();
              })
              .catch((err) => {
                console.log(err.response);
                this.$swal.fire({
                  icon: "error",
                  title:
                    "ไม่สามารถลบวิดีโอได้เนื่องจากมีการใช้งานวิดีโอนี้อยู่",
                  confirmButtonText: "ตกลง",
                });
              });
          }
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

    previewImage(e) {
      if (e) {
        this.url = URL.createObjectURL(e);
      } else {
        this.url = null;
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
      let filesId = [];

      filesId = this.lessonForm.files.map((file) => {
        return file.videoId;
      });

      for (const key in this.lessonForm) {
        formData.append(key, this.lessonForm[key]);
        console.log(this.lessonForm[key]);
      }

      formData.append("filesId", filesId);
      formData.append("content", this.content);
      formData.append("lessonId", this.$route.query.lessonId);

      this.$refs.observer.validate().then((result) => {
        if (result) {
          console.log(this.lessonForm.files.length);
          if (this.lessonForm.files.length <= 0) {
            this.$swal.fire({
              icon: "info",
              title: "กรุณาเลือกวิดีโอการสอน",
              confirmButtonText: "ตกลง",
            });
            return;
          }

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
              `${process.env.VUE_APP_API_PATH}/lesson/updateLesson.php`,
              formData
            )
            .then((res) => {
              this.isLoading = false;
              console.log(res);
              if (res.data.isSuccess) {
                this.$router.push({ name: "ShowLessons" });
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
      this.subjects = this.get("/subject/getAllActiveSubject.php");
    },

    getLesson() {
      let formData = new FormData();

      formData.append("lessonId", this.$route.query.lessonId);

      this.$http
        .post(`${process.env.VUE_APP_API_PATH}/lesson/getLesson.php`, formData)
        .then((res) => {
          this.lessonForm.subjectId = res.data.lessonData[0].subjectId;
          this.lessonForm.lessonName = res.data.lessonData[0].lessonName;
          this.lessonForm.lessonImage = res.data.lessonData[0].lessonImage;
          this.content = res.data.lessonData[0].content;

          this.lessonForm.files = res.data.videoData;
          console.log("res", res.data[0]);
          console.log("lessonForm", this.lessonForm);
        })
        .catch((err) => {
          this.isLoading = false;
          console.log(err);
        });
    },

    async getVideoList() {
      this.videoList = await this.get("/lesson/getAllVideo.php");
    },
  },
  async created() {
    this.subjects = await this.get("/subject/getAllActiveSubject.php");
    await this.getVideoList();
    await this.getLesson();
  },
};
</script>
