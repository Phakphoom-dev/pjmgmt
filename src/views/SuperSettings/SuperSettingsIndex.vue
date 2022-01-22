<template>
  <v-container fluid class="mt-3">
    <h3>การตั้งค่า</h3>
    <v-row class="mt-3">
      <v-col>
        <v-card class="pa-3">
          <v-row cols="12">
            <v-col cols="12">
              <Slider></Slider>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Slider from "@/components/Settings/Slider";
import "@/mixins/generalMixin";

export default {
  name: "SuperSettingsIndex",
  components: {
    Slider,
  },
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
