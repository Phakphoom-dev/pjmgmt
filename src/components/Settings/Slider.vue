<template>
  <div>
    <v-card-title>ตั้งค่าเปอร์เซ็นการผ่านของแบบฝึกหัด</v-card-title>

    <v-card-text>
      <v-row>
        <v-col class="pr-4 mt-7">
          <v-slider
            @change="changePercent"
            color="teal"
            track-color="grey grey lighten-1"
            v-model="slider"
            class="align-center"
            :max="max"
            :min="min"
            hide-details
            :thumb-size="40"
            thumb-label="always"
            ticks
          >
            <template v-slot:thumb-label="{ value }">
              <span style="font-size: 12px">{{ value }} %</span>
            </template>
          </v-slider>
        </v-col>
      </v-row>
    </v-card-text>
  </div>
</template>

<script>
export default {
  name: "Slider",
  data() {
    return {
      min: 0,
      max: 100,
      slider: 0,
    };
  },
  methods: {
    changePercent() {
      this.$http.post(
        `${process.env.VUE_APP_API_PATH}/quiz/updateQuizSetting.php`,
        { quizSetting: this.slider }
      );
    },

    async getPercent() {
      const res = await this.$http.get(
        `${process.env.VUE_APP_API_PATH}/quiz/getQuizSetting.php`
      );

      this.slider = res.data[0].quizSetting;
    },
  },
  created() {
    this.getPercent();
  },
};
</script>
