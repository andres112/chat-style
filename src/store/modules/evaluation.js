import { db } from "@/firebase.js";
import moment from "moment";

// store for evaluation

const state = {
  test_id: null,
  startTime: 0,
  endTime: 0,
  commands: "",
  errors: 0,
  evaluationType: null,
};
const mutations = {
  clearEvaluation(state) {
    state.startTime = 0;
    state.endTime = 0;
    state.commands = "";
    state.errors = 0;
    state.evaluationType = null;
  },
  setStartTime(state) {
    state.startTime = moment().valueOf();
  },
  setEndTime(state) {
    state.endTime = moment().valueOf();
  },
  saveCommand(state, command) {
    state.commands += " / " + command;
  },
  countErrors(state) {
    state.errors++;
  },
  setType(state, type) {
    state.evaluationType = type;
  },
  setTestID(state, id) {
    state.test_id = id;
  },
};
const actions = {
  async sendEvaluation({ state }) {
    const content = {
      test_id: state.test_id,
      startTime: state.startTime,
      endTime: state.endTime,
      errors: state.errors,
      commands: state.commands,
      duration: state.endTime - state.startTime,
      type: state.evaluationType,
    };
    const doc_id = "evaluation" + moment().valueOf();
    try {
      const res = await db
        .collection("evaluation")
        .doc(doc_id)
        .set(content);
    } catch (error) {
      console.log(error);
    }
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
};
