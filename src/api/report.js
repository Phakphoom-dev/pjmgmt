import axios from "axios";

const url = process.env.VUE_APP_BASE_API;

export default {
  getReport(params) {
    return axios.get(`${url}/report/getReport.php`, {
      params: params,
    });
  },

  getAdminReport(params) {
    return axios.get(`${url}/report/getAdminReport.php`, {
      params: params,
    });
  },

  // addProjectType(formData) {
  //   return axios.post(`${url}/projectType/addProjectType.php`, formData);
  // },
};
