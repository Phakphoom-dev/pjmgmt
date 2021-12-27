import Vue from "vue";

Vue.mixin({
  methods: {
    stdImgPath(stdImg) {
      return `${process.env.VUE_APP_IMG_PATH}/student/${stdImg}`;
    },
    async get(path) {
      const data = await this.$http
        .get(`${process.env.VUE_APP_API_PATH}${path}`)
        .catch((err) => console.log(err));
      return data.data;
    },
    async post(path, formData) {
      const data = await this.$http
        .post(`${process.env.VUE_APP_API_PATH}${path}`, formData)
        .catch((err) => console.log(err));
      return data;
    },
  },
});