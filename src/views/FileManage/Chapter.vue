<template>
  <v-container fluid class="mt-3">
    <h3>จัดการเอกสาร - {{ $route.params.title }}</h3>
    <v-card class="mx-auto mt-5" max-width="1000">
      <v-toolbar flat :color="userData.roleId === 2 ? 'teal' : 'orange'" dark>
        <v-icon class="mr-2" @click="$router.go(-1)"
          >mdi-arrow-left-thick</v-icon
        >
        <v-toolbar-title>{{ $route.params.title }}</v-toolbar-title>
      </v-toolbar>

      <v-tabs vertical v-model="tabs">
        <v-tab>
          <v-icon left> mdi-file </v-icon>
          จัดการไฟล์
        </v-tab>
        <v-tab>
          <v-icon left> mdi-text </v-icon>
          ความคิดเห็น
        </v-tab>

        <v-tab v-if="roleId === 3">
          <v-icon left> mdi-access-point </v-icon>
          จัดการสถานะ
        </v-tab>

        <v-tab-item>
          <v-row class="ma-1">
            <v-chip
              @click="showUpload = !showUpload"
              class="ma-3 ml-auto"
              :color="showUpload ? 'green' : 'grey'"
              label
              text-color="white"
            >
              <v-icon left> mdi-upload </v-icon>
              เพิ่มไฟล์เอกสาร
            </v-chip>
          </v-row>

          <v-row cols="12" class="ma-0" v-if="showUpload">
            <v-col>
              <v-file-input
                label="อัพโหลดไฟล์เอกสาร"
                filled
                accept="application/pdf"
                v-model="file"
              ></v-file-input>

              <v-btn
                block
                color="primary"
                @click="submitFile"
                :disabled="isLoading"
              >
                ยืนยัน
              </v-btn>
            </v-col>
          </v-row>

          <FileTab
            :showUpload="showUpload"
            :files="stdFile"
            @deleteFile="deleteFile"
            @submitFile="submitFile"
            title="ไฟล์เอกสารนักศึกษา"
          />

          <v-divider></v-divider>

          <FileTab
            :showUpload="showUpload"
            :files="teacherFile"
            @deleteFile="deleteFile"
            @submitFile="submitFile"
            title="ไฟล์เอกสารอาจารย์"
            color="orange"
          />

          <FileLog :files="fileLog" />
        </v-tab-item>
        <!-- /File Manage -->

        <!-- Comment Section -->
        <v-tab-item>
          <v-card
            class="ma-0"
            flat
            max-height="600"
            style="overflow-y: scroll"
            v-chat-scroll
          >
            <v-card-text>
              <v-row
                :justify="commentPosition(comment)"
                no-gutters
                cols="6"
                v-for="(comment, index) in comments"
                :key="comment.sCommentId"
                :class="`index-${index}`"
              >
                <v-col cols="1" :order="orderPosition(comment)">
                  <v-avatar v-if="comment.teacherProfileImg" class="ml-2">
                    <img :src="imgPath('users', comment.teacherProfileImg)" />
                  </v-avatar>
                  <v-avatar v-else class="ml-2">
                    <img :src="imgPath('users', comment.stdProfileImg)" />
                  </v-avatar>
                </v-col>
                <v-col cols="6" class="ml-2 my-1">
                  <v-text-field
                    dense
                    outlined
                    readonly
                    :label="
                      comment.teacherProfileImg
                        ? comment.teacherName
                        : comment.stdName
                    "
                    type="text"
                    :value="comment.sCommentMessage"
                    :hint="commentTime(comment.sCommentTimestamp)"
                    persistent-hint
                  >
                  </v-text-field>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <v-card>
            <v-row>
              <v-col class="mt-2 mr-2">
                <v-text-field
                  v-model="message"
                  append-outer-icon="mdi-send"
                  prepend-icon="mdi-emoticon"
                  filled
                  clear-icon="mdi-close-circle"
                  clearable
                  label="ข้อความ..."
                  type="text"
                  @click:append-outer="sendMessage"
                  @click:clear="clearMessage"
                  v-on:keyup.enter="sendMessage"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-card>
        </v-tab-item>
        <!-- /CommentSection -->

        <!-- Teacher Section -->
        <v-tab-item v-if="roleId === 3">
          <v-card-text>
            <v-sheet class="pa-5">
              <h3>จัดการสถานะ</h3>
              <hr />
              <v-switch
                @click="changeChapterSta"
                v-model="chapterStatus"
                inset
                :color="!chapterStatus ? 'amber' : 'success'"
                :label="`สถานะ: ${
                  !chapterStatus ? 'อยู่ระหว่างจัดทำ' : 'ผ่านการตรวจสอบ'
                }`"
              >
              </v-switch>
              <v-switch
                @click="changePublishSta"
                v-model="publish"
                inset
                :color="!publish ? 'amber' : 'success'"
                :label="`การเผยแพร่: ${
                  !publish ? 'ระงับการเผยแพร่' : 'เผยแพร่'
                }`"
              >
              </v-switch>
            </v-sheet>
          </v-card-text>
        </v-tab-item>
        <!-- /Teacher Section -->
      </v-tabs>
    </v-card>

    <!-- Loading -->
    <Loading :isLoading="isLoading" title="กำลังบันทึกข้อมูล..." />
    <!-- /Loading -->

    <!-- Delete Modal -->
    <DeleteDialog
      :showDelete="showDelete"
      @closeDelete="showDelete = false"
      @confirmDelete="confirmDelete"
    />
    <!-- /Delete Modal -->
  </v-container>
</template>

<script>
import "@/mixins/generalMixin";
import fileAPI from "@/api/file";
import coverAPI from "@/api/cover";
import teacherAPI from "@/api/teacher";
import Loading from "@/components/Loading.vue";
import "vue-pdf-app/dist/icons/main.css";
import DeleteDialog from "@/components/DeleteDialog";
import FileTab from "./components/FileTab.vue";
import FileLog from "./components/FileLog.vue";

export default {
  name: "Chapter",
  components: { Loading, DeleteDialog, FileTab, FileLog },
  data() {
    return {
      tabs: 0,
      chapterStatus: "",
      publish: "",
      message: "",
      comments: [],
      roleId: parseInt(this.$route.query.roleId),
      teacherId: parseInt(this.$route.query.teacherId),
      showUpload: false,
      file: null,
      showDelete: false,
      stdFile: [],
      teacherFile: [],
      fileLog: [],
      deleteData: {},
      isLoading: false,
      userData: JSON.parse(localStorage.getItem("userData")),
      stdId: parseInt(this.$route.params.stdId),
      sFolderId: parseInt(this.$route.params.sFolderId),
      url: null,
    };
  },

  computed: {},

  watch: {
    "$route.params.sFolderId": function (sFolderId) {
      if (this.userData.roleId === 2) {
        this.sFolderId = this.$route.params.sFolderId;
        this.stdId = this.$route.params.stdId;
        this.tabs = 1;
        this.getStdChapter();
      }

      if (this.userData.roleId === 3) {
        this.sFolderId = this.$route.params.sFolderId;
        this.stdId = this.$route.params.stdId;
        this.teacherId = this.$route.query.teacherId;
        this.roleId = this.$route.query.roleId;
        this.tabs = 1;
        this.getStdChapter();
      }
    },
  },

  methods: {
    previewImage() {
      this.url = URL.createObjectURL(this.coverFile);
    },

    submitFile(file) {
      this.isLoading = true;

      let formData = new FormData();
      formData.append("sFolderId", this.sFolderId);
      formData.append("userId", this.userData.userId);
      formData.append("roleId", this.userData.roleId);
      formData.append("file", this.file);
      fileAPI
        .uploadChapterFile(formData)
        .then((res) => {
          this.isLoading = false;
          this.$toast.open({
            type: "success",
            message: res.data.message,
          });
          this.getStdChapter();
          console.log(res);
        })
        .catch((err) => {
          this.isLoading = false;
          console.log(err);
        });
    },

    orderPosition(comment) {
      if (this.userData.userId === comment.teacherId) {
        return "1";
      } else if (this.userData.userId === comment.stdId) {
        return "1";
      } else {
        return "0";
      }
    },

    changePublishSta() {
      let publishSta;
      this.publish ? (publishSta = 1) : (publishSta = 0);
      let formData = new FormData();
      formData.append("publishSta", publishSta);
      formData.append("sFolderId", this.sFolderId);
      fileAPI.changePublishSta(formData);
    },

    changeChapterSta() {
      let chapterSta;
      this.chapterStatus ? (chapterSta = 2) : (chapterSta = 1);
      let formData = new FormData();
      formData.append("chapterSta", chapterSta);
      formData.append("sFolderId", this.sFolderId);
      fileAPI.changeChapterSta(formData);
    },

    commentPosition(comment) {
      if (comment.teacherId) {
        if (this.userData.userId === comment.teacherId) {
          return "end";
        } else {
          return "start";
        }
      }

      if (comment.stdId) {
        if (this.userData.userId === comment.stdId) {
          return "end";
        } else {
          return "start";
        }
      }
    },

    commentTime(sCommentTimestamp) {
      return `${this.$moment(sCommentTimestamp)
        .startOf(sCommentTimestamp)
        .fromNow()} ${this.$moment(sCommentTimestamp).format(
        "Do MMMM YYYY, HH:mm:ss"
      )}`;
    },

    // Comment Logic
    sendMessage() {
      if (this.message === "") {
        return;
      }

      let formData = new FormData();

      formData.append("roleId", this.userData.roleId);
      formData.append("studentId", this.userData.userId);
      formData.append("teacherId", this.teacherId);
      formData.append("sFolderId", this.sFolderId);
      formData.append("message", this.message);

      teacherAPI
        .commentChapter(formData)
        .then((res) => {
          this.getStdChapter();
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });

      this.clearMessage();
    },

    clearMessage() {
      this.message = "";
    },

    deleteFile(file) {
      if (file.stdId) {
        if (this.userData.roleId !== 2) {
          this.$toast.open({
            type: "warning",
            message: "ไม่สามารถลบเอกสารนักศึกษา",
          });
          return;
        }
      }

      if (file.teacherId) {
        if (this.userData.roleId !== 3) {
          this.$toast.open({
            type: "warning",
            message: "ไม่สามารถลบเอกสารอาจารย์",
          });
          return;
        }
      }

      this.deleteData = file;
      this.showDelete = true;
    },

    confirmDelete() {
      this.showDelete = false;
      this.isLoading = true;
      let formData = JSON.stringify(this.deleteData);
      fileAPI
        .deleteFile(formData)
        .then((res) => {
          this.isLoading = false;
          this.$toast.open({
            type: "success",
            message: res.data.message,
          });
          this.getStdChapter();
          console.log(res);
        })
        .catch((err) => {
          this.isLoading = false;
          console.log(err);
        });
    },

    checkId() {
      if (this.userData.userId !== this.stdId) {
        this.$router.push("/404");
      }
    },

    getStdChapter() {
      let formData = new FormData();
      formData.append("sFolderId", this.sFolderId);
      formData.append("stdId", this.stdId);
      fileAPI
        .getStdChapter(formData)
        .then((res) => {
          console.log("res", res);
          this.stdFile = res.data.stdFile;
          this.teacherFile = res.data.teacherFile;
          this.comments = res.data.stdCommentLog;
          this.chapterStatus = res.data.status;
          this.publish = res.data.publish;
          this.fileLog = res.data.fileLog;
          console.log("stdFile", this.stdFile);
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  async created() {
    if (this.userData.roleId !== 3) {
      this.checkId();
    }
    console.log("Chapter Created");
    if (this.$route.params.fromNotification) this.tabs = 1;
    this.getStdChapter();
  },
};
</script>
