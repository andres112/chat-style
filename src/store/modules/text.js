const state = {
  currentStyle: {
    bold: false,
    italic: false,
    underline: false,
    strike: false,
    color: "",
    background: "",
    script: "",
    emoji: false,
    size: "large",
  },
  message: null,
};
const getters = {
  getIsEmoji: (state) => {
    return state.currentStyle.emoji;
  },
};
const mutations = {
  updateStyles(state, payload) {
    state.currentStyle = {...state.currentStyle, ...payload};
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
  getters,
  actions,
  mutations,
};
