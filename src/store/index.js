import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    // styleArray: [],
    stylesObject: {},
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
      state.stylesObject = payload;
    },
    clearStyles(state) {
      state.stylesObject = {};
    },
  },
  actions: {
    changeColor({ commit }, colors) {
      commit("changeColor", colors);
    },
    updateStyles({ commit }, commands) {
      commit("updateStyles", commands);
    },
    clearStyles({ commit }) {
      commit("clearStyles");
    },
  },
  modules: {},
});
