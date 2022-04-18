import axios from "axios";

const url = process.env.VUE_APP_BASE_API;
const fileUrl = process.env.VUE_APP_FILE_PATH;

export default {
  getAllProject(params) {
    return axios.get(`${url}/frontend/getAllProject.php`, {
      params: params,
    });
  },

  getProject(params) {
    return axios.get(`${url}/frontend/getProject.php`, {
      params: params,
    });
  },
};
