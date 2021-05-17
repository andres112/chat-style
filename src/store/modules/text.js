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
  },
  currentCommands: {},
  invalid: false,
  message: null,
};
const getters = {
  getIsEmoji: (state) => {
    return state.currentStyle.emoji;
  },
};
const mutations = {
  updateStyles(state, payload) {
    state.currentStyle = { ...state.currentStyle, ...payload };
    state.currentCommands = payload;

    // remove emoji parameter becuase is not a text format
    if (state.currentCommands?.emoji) {
      delete state.currentCommands.emoji;
    }
  },
  updateMessage(state, payload) {
    state.message = payload;
  },
  setInvalid(state, value) {
    state.invalid = value;
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
