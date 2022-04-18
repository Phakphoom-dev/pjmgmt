import axios from "axios";

const url = process.env.VUE_APP_BASE_API;

export default {
  getMessage(userId, roleId) {
    return axios.get(`${url}/user/getNotifications.php?userId=${userId}&roleId=${roleId}`);
  },

  clearNotifications(userId, roleId) {
    return axios.get(`${url}/user/clearNotifications.php?userId=${userId}&roleId=${roleId}`);
  },

  index(params) {
    return axios.get(`${url}/user/index.php`, {
      params: params,
    });
  },

  getStudents(params) {
    return axios.get(`${url}/user/getStudents.php`, {
      params: params,
    });
  },

  getTeachers(params) {
    return axios.get(`${url}/user/getTeachers.php`, {
      params: params,
    });
  },

  checkUsername(formData) {
    return axios.post(`${url}/user/checkUsername.php`, formData);
  },

  delete(formData) {
    return axios.post(`${url}/user/delStudent.php`, formData);
  },

  deleteTeacher(formData) {
    return axios.post(`${url}/user/delTeacher.php`, formData);
  },

  get(formData) {
    return axios.post(`${url}/user/getByRole.php`, formData);
  },

  login(formData) {
    return axios.post(`${url}/login.php`, formData);
  },

  addStudent(formData) {
    return axios.post(`${url}/user/addStudent.php`, formData);
  },

  editStudent(formData) {
    return axios.post(`${url}/user/editStudent.php`, formData);
  },

  addTeacher(formData) {
    return axios.post(`${url}/user/addTeacher.php`, formData);
  },

  editTeacher(formData) {
    return axios.post(`${url}/user/editTeacher.php`, formData);
  },
};
