const state = {
  stylesObject: {},
  message: null,
};
const mutations = {
  updateStyles(state, payload) {
    state.stylesObject = payload;
  },
  updateMessage(state, payload) {
    state.message = payload;
  },
};
const actions = {
  updateStyles({ commit }, commands) {
    commit("updateStyles", commands);
  },
  updateMessage({ commit }, message) {
    commit("updateMessage", message);
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
};
