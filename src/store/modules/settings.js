const state = {
  sidebarOn: false,
};
const mutations = {
  toogleSidebar(state) {
    state.sidebarOn = !state.sidebarOn;
  },
};
const actions = {
  toogleSidebar({ commit }) {
    commit("toogleSidebar");
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
};
