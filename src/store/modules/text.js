const state = {
  stylesObject: {},
  isEmoji: false,
  message: null,
};
const getters = {
  getIsEmoji: (state) => {
    return state.isEmoji;
  },
};
const mutations = {
  updateStyles(state, payload) {
    state.stylesObject = payload;
  },
  updateMessage(state, payload) {
    state.message = payload;
  },
  updateEmoji(state, payload) {
    state.isEmoji = payload;
  },
};
const actions = {
  updateStyles({ commit }, commands) {
    commit("updateStyles", commands);
  },
  updateMessage({ commit }, message) {
    commit("updateMessage", message);
  },
  updateEmoji({ commit }, value) {
    commit("updateEmoji", value);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
