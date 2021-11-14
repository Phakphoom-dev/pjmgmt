const state = {
  drawer: true,
};

const mutations = {
  TOGGLE_DRAWER(state) {
    state.drawer = !state.drawer;
  },
};

const actions = {
  toggleDrawer({ commit }) {
    commit("TOGGLE_DRAWER");
  },
};

const getters = {
  DRAWER_STATE(state) {
    return state.drawer;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
