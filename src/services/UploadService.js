import axios from "axios";

const apiClient = axios.create({
  backURL: `${process.env.VUE_APP_API_PATH}`,
  header: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export default {
  getEvents(perPage, page) {
    return apiClient.get("");
  },
};
