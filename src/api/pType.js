import axios from "axios";

const url = process.env.VUE_APP_BASE_API;

export default {
  getProjectType(params) {
    return axios.get(`${url}/projectType/getProjectType.php`, {
      params: params,
    });
  },

  addProjectType(formData) {
    return axios.post(`${url}/projectType/addProjectType.php`, formData);
  },

  editProjectType(formData) {
    return axios.post(`${url}/projectType/editProjectType.php`, formData);
  },

  deleteProjectType(formData) {
    return axios.post(`${url}/projectType/deleteProjectType.php`, formData);
  },
};
