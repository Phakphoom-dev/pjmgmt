import axios from "axios";

const url = process.env.VUE_APP_BASE_API;

export default {
  getTeacherStudent(formData) {
    return axios.post(`${url}/teacher/getTeacherStudent.php`, formData);
  },

  getStdFolder(formData) {
    return axios.post(`${url}/teacher/getStdFolder.php`, formData);
  },

  commentChapter(formData) {
    return axios.post(`${url}/comment/commentChapter.php`, formData);
  },
};
