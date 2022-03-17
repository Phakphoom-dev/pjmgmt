import Vue from "vue";

Vue.mixin({
  methods: {
    formatBytes(bytes, decimals = 2) {
      if (bytes === 0) return "0 Bytes";

      const k = 1024;
      const dm = decimals < 0 ? 0 : decimals;
      const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

      const i = Math.floor(Math.log(bytes) / Math.log(k));

      return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
    },
    toThaiDateString(date) {
      let monthNames = [
        "มกราคม",
        "กุมภาพันธ์",
        "มีนาคม",
        "เมษายน",
        "พฤษภาคม",
        "มิถุนายน",
        "กรกฎาคม",
        "สิงหาคม.",
        "กันยายน",
        "ตุลาคม",
        "พฤศจิกายน",
        "ธันวาคม",
      ];

      let year = date.getFullYear() + 543;
      let month = monthNames[date.getMonth()];
      let numOfDay = date.getDate();

      let hour = date.getHours().toString().padStart(2, "0");
      let minutes = date.getMinutes().toString().padStart(2, "0");
      let second = date.getSeconds().toString().padStart(2, "0");

      return `${numOfDay} ${month} ${year} ` + `${hour}:${minutes}:${second} น.`;
    },
    filePath(file, folder) {
      return `${process.env.VUE_APP_IMG_PATH}/${folder}/${file}`;
    },
    imgPath(img, folder) {
      return `${process.env.VUE_APP_IMG_PATH}/${folder}/${img}`;
    },
    async get(path) {
      const data = await this.$http.get(`${process.env.VUE_APP_API_PATH}${path}`).catch((err) => console.log(err));
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
