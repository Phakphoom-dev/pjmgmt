<template>
  <v-container fluid>
    <v-sheet class="pa-5">
      <h3>จัดการรูปภาพหน้าปก</h3>
      <hr />

      <v-row class="ma-2" cols="12" v-if="!coverFile">
        <v-col>
          <v-img
            class="mx-auto"
            contain
            max-height="500"
            max-width="500"
            :src="imgPath('cover', cover.coverName)"
          ></v-img>
        </v-col>
      </v-row>

      <v-row class="ma-2" cols="12" v-else>
        <v-col>
          <v-img
            class="mx-auto"
            contain
            max-height="500"
            max-width="500"
            :src="url"
          ></v-img>
        </v-col>
      </v-row>

      <v-row cols="12" class="mt-2">
        <v-col>
          <v-file-input
            @change="previewImage"
            label="อัพโหลดรูปภาพหน้าปก"
            accept="image/*"
            v-model="coverFile"
          ></v-file-input>

          <v-btn
            block
            color="primary"
            v-if="coverFile"
            @click="uploadCover"
            :disabled="isLoading"
          >
            ยืนยัน
          </v-btn>
        </v-col>
      </v-row>
    </v-sheet>
  </v-container>
</template>

<script>
import "@/mixins/generalMixin";
import coverAPI from "@/api/cover";

export default {
  name: "CoverManage",

  data() {
    return {
      url: null,
      isLoading: false,
      coverFile: null,
      userData: JSON.parse(localStorage.getItem("userData")),
      cover: {},
    };
  },

  methods: {
    previewImage() {
      this.url = URL.createObjectURL(this.coverFile);
    },

    uploadCover() {
      this.isLoading = true;

      let formData = new FormData();
      formData.append("coverFile", this.coverFile);
      formData.append("stdId", this.userData.userId);

      coverAPI
        .uploadCover(formData)
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

    getData() {
      this.isLoading = true;

      let formData = new FormData();
      formData.append("stdId", this.userData.userId);

      coverAPI
        .getStudentCover(formData)
        .then((res) => {
          this.isLoading = false;
          this.cover = res.data.cover;
          console.log(res);
        })
        .catch((err) => {
          this.isLoading = false;
          console.log(err);
        });
    },
  },

  created() {
    this.getData();
  },
};
</script>
