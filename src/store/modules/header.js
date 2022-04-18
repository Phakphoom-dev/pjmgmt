import userAPI from "@/api/user.js";
import moment from "moment";

const state = {
  notifications: [],
};

const mutations = {
  GET_NOTIFICATIONS(state, userMessages) {
    state.notifications = userMessages;
    console.log(state.notifications);
  },

  CLEAR_NOTIFICATIONS(state) {
    state.notifications = [];
  },
};

const actions = {
  async getNotifications({ commit }, payload) {
    const data = await userAPI.getMessage(payload.userId, payload.roleId);
    let userMessages = data.data.userMessage;

    userMessages = userMessages.map((msg) => {
      const msgTime = `${moment(msg.sCommentTimestamp).startOf(msg.sCommentTimestamp).fromNow()}`;

      return {
        title: msg.sCommentMessage,
        color: "red",
        icon: "mdi-email",
        timeLabel: msgTime,
      };
    });

    commit("GET_NOTIFICATIONS", userMessages);
  },

  async clearNotifications({ commit }, payload) {
    userAPI.clearNotifications(payload.userId, payload.roleId);
    commit("CLEAR_NOTIFICATIONS");
  },
};

const getters = {
  NOTIFICATIONS_STATE(state) {
    return state.notifications;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
