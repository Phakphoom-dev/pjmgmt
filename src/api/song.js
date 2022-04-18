import axios from "axios";

export default {
  index(params) {
    return axios.get("https://music.com/api/v1/songs", {
      params: params,
    });
  },

  show(id) {
    return axios.get("https://music.com/api/v1/songs/" + id);
  },

  create(data) {
    return axios.post("https://music.com/api/v1/songs", data);
  },

  update(id, data) {
    data._method = "PUT";
    return axios.post("https://music.com/api/v1/songs/" + id, data);
  },

  delete(id) {
    return axios.delete("https://music.com/api/v1/songs/" + id);
  },
};
