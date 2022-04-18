import axios from "axios";

const url = process.env.VUE_APP_BASE_API;
const fileUrl = process.env.VUE_APP_FILE_PATH;

export default {
  getFolder(params) {
    return axios.get(`${url}/files-manage/getFolder.php`, {
      params: params,
    });
  },

  addFolder(formData) {
    return axios.post(`${url}/files-manage/addFolder.php`, formData);
  },

  editFolder(formData) {
    return axios.post(`${url}/files-manage/editFolder.php`, formData);
  },

  deleteFolder(formData) {
    return axios.post(`${url}/files-manage/deleteFolder.php`, formData);
  },

  switchFolder(formData) {
    return axios.post(`${url}/files-manage/switchFolder.php`, formData);
  },

  checkFolder(formData) {
    return axios.post(`${url}/files-manage/checkFolder.php`, formData);
  },

  getStdChapter(formData) {
    return axios.post(`${url}/files-manage/getStdChapter.php`, formData);
  },

  uploadChapterFile(formData) {
    return axios.post(`${url}/files-manage/uploadChapterFile.php`, formData);
  },

  changeChapterSta(formData) {
    return axios.post(`${url}/files-manage/changeChapterSta.php`, formData);
  },

  changePublishSta(formData) {
    return axios.post(`${url}/files-manage/changePublishSta.php`, formData);
  },

  changeIsPublishSta(formData) {
    return axios.post(`${url}/files-manage/changeIsPublishSta.php`, formData);
  },

  deleteFile(formData) {
    return axios.post(`${url}/files-manage/deleteFile.php`, formData);
  },

  openPDF(path) {
    window.open(`${fileUrl}${path}`, "_blank");
  },

  downloadPDF(filename, sFileId) {
    window.open(`${url}/frontend/downloadPdf.php?filename=${filename}
    &sFileId=${sFileId}`);
  },
};
