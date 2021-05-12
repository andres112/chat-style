const state = {
  sidebarOn: false,
  infoText: "",
};
const mutations = {
  toogleSidebar(state) {
    state.sidebarOn = !state.sidebarOn;
  },
  setNotificationInfo(state, payload) {
    state.infoText = payload;
  },
};
const actions = {
  toogleSidebar({ commit }) {
    commit("toogleSidebar");
  },
  setNotificationInfo({ commit }, info) {
    commit("setNotificationInfo", info);
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
};
