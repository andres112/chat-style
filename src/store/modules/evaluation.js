import { db } from "@/firebase.js";
import moment from "moment";

const state = {
  startTime: 0,
  endTime: 0,
  commands: [],
  errors: 0,
  evaluationType: null,
};
const mutations = {
  clearEvaluation(state) {
    state.startTime = 0;
    state.endTime = 0;
    state.commands = [];
    state.errors = 0;
  },
  setStartTime(state) {
    state.startTime = moment().valueOf();
  },
  setEndTime(state) {
    state.endTime = moment().valueOf();
  },
  saveCommand(state, command) {
    state.commands.push(command);
  },
  countErrors(state) {
    state.errors++;
  },
  setType(state, type) {
    state.evaluationType = type;
  },
};
const actions = {
  sendEvaluation({ state, rootState }) {},
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
};
