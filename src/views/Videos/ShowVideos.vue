<template>
  <v-container fluid class="mt-3">
    <h3>วิดีโอ</h3>
    <v-row class="mt-3">
      <v-col>
        <v-data-table
          :headers="headers"
          :items="videoList"
          sort-by="username"
          class="elevation-1"
          :search="search"
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>จัดการวิดีโอ</v-toolbar-title>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-btn
                color="primary"
                class="mb-2"
                @click="showUploadInput = !showUploadInput"
                >เพิ่มวิดีโอการสอน</v-btn
              >
              <v-row no-gutters v-if="!isUpload && showUploadInput">
                <v-col :cols="lessonVideo ? 8 : 8">
                  <v-file-input
                    class="mt-4 ml-1"
                    @change="checkFileSize"
                    v-model="lessonVideo"
                    accept="video/*"
                    dense
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

              <v-row v-if="isUpload" cols="12" class="ml-2">
                <v-col cols="12">
                  <v-progress-linear
                    class="mb-2"
                    v-model="uploadPercentage"
                    color="primary"
                    height="25"
                  >
                    <template v-slot:default="{ value }">
                      <strong>{{ Math.ceil(value) }}%</strong>
                    </template>
                  </v-progress-linear>
                </v-col>
              </v-row>
            </v-toolbar>

            <v-row cols="12" class="mb-2 ml-2">
              <v-col cols="6">
                <v-text-field
                  v-model="search"
                  append-icon="mdi-magnify"
                  label="ค้นหาวิดีโอ"
                  single-line
                  hide-details
                ></v-text-field>
              </v-col>
            </v-row>
          </template>

          <template slot="item.index" scope="props">
            {{ props.index + 1 }}
          </template>

          <template v-slot:item.fileSize="{ item }">
            {{ formatBytes(item.fileSize) }}
          </template>

          <template v-slot:item.uploadDate="{ item }">
            {{ toThaiDateString(new Date(item.uploadDate)) }}
          </template>

          <template v-slot:item.actions="{ item }">
            <v-icon class="ml-2" @click="deleteVideo(item)" color="error">
              mdi-delete
            </v-icon>
          </template>
          <template v-slot:no-data> ไม่พบผู้สอน </template>
        </v-data-table>
      </v-col>
    </v-row>

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
  </v-container>
</template>

<script>
import "@/mixins/generalMixin";

export default {
  name: "ShowTeachers",
  data: () => ({
    search: "",
    uploadPercentage: 0,
    selectedFiles: [],
    showVideoModal: false,
    rules: [
      (value) =>
        !value || value.size < 500000000 || "ไฟล์ต้องมีขนาดน้อยกว่า 500 MB",
    ],
    lessonVideo: null,
    showUploadInput: false,
    isUpload: false,
    headers: [
      { text: "ลำดับที่", value: "index" },
      {
        text: "ชื่อวิดีโอ",
        align: "start",
        value: "videoName",
      },
      { text: "ขนาดไฟล์", value: "fileSize" },
      { text: "เวลาที่อัพโหลด", value: "uploadDate" },
      { text: "แก้ไข/ลบ", value: "actions", sortable: false },
    ],
    videoList: [],
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "เพิ่มผู้สอน" : "แก้ไขผู้สอน";
    },
  },

  methods: {
    deleteVideo(video, index) {
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
                  title: err.response.data.message,
                  confirmButtonText: "ตกลง",
                });
              });
          }
        });
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

    closeModal() {
      console.log("videoList", this.videoList);
      console.log("selectedFiles", this.selectedFiles);

      this.lessonForm.files = this.selectedFiles.map((file) => {
        return this.videoList[file];
      });

      console.log(this.lessonForm.files);
      this.showVideoModal = false;
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

    editUser(item) {
      this.$router.push({
        name: "EditTeacher",
        query: { adminId: item.adminId },
      });
    },

    changeStatus(status, adminId, index) {
      console.log(index);
      let adminStatus = null;
      status ? (adminStatus = 1) : (adminStatus = 0);

      let formData = new FormData();
      formData.append("status", adminStatus);
      formData.append("adminId", adminId);

      this.$http
        .post(`${process.env.VUE_APP_API_PATH}/user/updateTeaSta.php`, formData)
        .then((res) => {
          if (res.status === 200) {
            console.log(this.teachers[index]);
          }
        })
        .catch((err) => {
          this.isLoading = false;
          this.$toast.open({
            message: err.response.data.message,
            type: "warning",
            position: "top-right",
          });
          this.getAllTeacher();
        });
    },

    checkFileSize() {
      if (this.lessonVideo) {
        if (this.lessonVideo.size > 500000000) {
          this.lessonVideo = null;
        }
      }
    },

    async getVideoList() {
      this.videoList = await this.get("/lesson/getAllVideo.php");
    },
  },
  created() {
    this.getVideoList();
  },
};
</script>
