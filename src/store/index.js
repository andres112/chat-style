import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    styleArray: [],
    color: {
      textcolor: "black",
      backgroundColor: "",
    },
  },
  mutations: {
    changeColor(state, payload) {
      state.color = payload;
    },
    updateStyles(state, payload) {
      if (!state.styleArray.includes(payload)) {
        state.styleArray.push(payload);
      }
    },
    clearStyles(state) {
      state.styleArray = [];
    },
  },
  actions: {
    changeColor({ commit }, colors) {
      commit("changeColor", colors);
    },
    updateStyles({ commit }, command) {
      commit("updateStyles", command);
    },
    clearStyles({ commit }) {
      commit("clearStyles");
    },
  },
  modules: {},
});
