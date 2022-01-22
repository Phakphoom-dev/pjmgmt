<template>
  <v-container fluid class="mt-3">
    <v-card class="mt-3">
      <v-card-title> จัดการเมนูเกี่ยวกับเรา</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="submit">
          <v-container>
            <v-row no-gutters class="mb-5">
              <v-col cols="12">
                <h6>เนื้อหาเมนูเกี่ยวกับเรา</h6>
              </v-col>
              <v-spacer></v-spacer>
              <v-col cols="12">
                <lesson-quill
                  :content.sync="aboutForm.content"
                  @contentChange="contentChange"
                ></lesson-quill>
              </v-col>
            </v-row>

            <v-col cols="12">
              <v-btn class="mr-4" type="submit" block color="primary">
                ยืนยัน
              </v-btn>
            </v-col>
          </v-container>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import "@/mixins/generalMixin";
import LessonQuill from "@/components/Editor/LessonQuill";

export default {
  name: "ShowLessons",
  components: {
    LessonQuill,
  },
  data: () => ({
    aboutForm: {
      content: "",
    },
  }),

  methods: {
    contentChange(content) {
      this.aboutForm.content = content;
    },

    submit() {
      let formData = new FormData();

      formData.append("content", this.aboutForm.content);

      if (this.aboutForm.content === "") {
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
          `${process.env.VUE_APP_API_PATH}/manage/manageAbout.php`,
          formData
        )
        .then((res) => {
          this.isLoading = false;
          if (res.data) {
            this.$swal.fire({
              icon: "success",
              title: "แก้ไขสำเร็จ",
              confirmButtonText: "ตกลง",
            });
            this.getAbout();
          }
        })
        .catch((err) => {
          this.isLoading = false;
          console.log(err.response);
        });
    },

    getAbout() {
      this.$http
        .get(`${process.env.VUE_APP_API_PATH}/manage/getAbout.php`)
        .then((res) => {
          this.aboutForm.content = res.data[0].content;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },

  async created() {
    this.getAbout();
  },
};
</script>
