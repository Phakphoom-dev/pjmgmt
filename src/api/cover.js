import axios from "axios";

const url = process.env.VUE_APP_BASE_API;
const fileUrl = process.env.VUE_APP_FILE_PATH;

export default {
  uploadCover(formData) {
    return axios.post(`${url}/cover/uploadCover.php`, formData);
  },

  getStudentCover(formData) {
    return axios.post(`${url}/user/getStudentCover.php`, formData);
  },
};
