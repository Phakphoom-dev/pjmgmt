<template>
  <v-container fluid class="mt-3">
    <h3>การตั้งค่า</h3>
    <v-row class="mt-3">
      <v-col>
        <v-card class="pa-3">
          <v-card-title
            >ตั้งค่า SlideShow
            <v-btn small class="ml-2" outlined color="info" to="add-slide">
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-simple-table class="elevation-2">
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left">ลำดับ</th>
                    <th class="text-left">หัวข้อ</th>
                    <th class="text-left">การจัดการ</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(slide, index) in slides" :key="slide.slideId">
                    <td>{{ index + 1 }}</td>
                    <td>{{ slide.slideTitle }}</td>
                    <td>
                      <v-icon
                        class="mr-2"
                        @click="editSlide(slide)"
                        color="info"
                      >
                        mdi-pencil
                      </v-icon>
                      <v-icon @click="deleteSlide(slide)" color="error">
                        mdi-delete
                      </v-icon>
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import "@/mixins/generalMixin";

export default {
  name: "ShowSettings",
  components: {},
  data: () => ({
    slides: [],
  }),
  computed: {},
  methods: {
    editSlide(slide) {
      this.$router.push({
        name: "EditSlide",
        query: {
          slideId: slide.slideId,
        },
      });
    },

    deleteSlide(slide) {
      this.$swal
        .fire({
          title: `ต้องการลบ ${slide.slideTitle} หรือไม่`,
          showDenyButton: true,
          confirmButtonText: "ยืนยัน",
          denyButtonText: `ยกเลิก`,
        })
        .then((result) => {
          if (result.isConfirmed) {
            const jsonData = JSON.stringify({
              slideId: slide.slideId,
              slideImg: slide.slideImg,
            });

            this.$http
              .post(
                `${process.env.VUE_APP_API_PATH}/slide/deleteSlide.php`,
                jsonData
              )
              .then((res) => {
                if (res.status === 200) {
                  this.getSettings();
                }
              })
              .catch((err) => {
                this.isLoading = false;
                this.$swal({
                  icon: "error",
                  text: err.response.data.message,
                  confirmButtonText: "ตกลง",
                  allowOutSideClick: false,
                });
              });
          } else if (result.isDenied) {
            return;
          }
        });
    },

    getSettings() {
      this.$http
        .get(`${process.env.VUE_APP_API_PATH}/slide/getAllSlide.php`)
        .then((res) => {
          this.slides = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },

  created() {
    this.getSettings();
  },
};
</script>
