import Vue from "vue";
import Vuex from "vuex";
import user from "./modules/user";
import text from "./modules/text";
import chat from "./modules/chat";
import settings from "./modules/settings";
import evaluation from "./modules/evaluation";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    user,
    text,
    chat,
    settings,
    evaluation,
  },
});
