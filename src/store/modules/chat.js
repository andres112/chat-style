import { db } from "@/firebase.js";
import moment from "moment";

const state = {
  messages: [],
};
const mutations = {
  setMessages(state, payload = null) {
    if (payload) {
      payload["date"] = moment(payload.date).format("lll");
      state.messages.unshift(payload);
      return;
    }
    state.messages = [];
  },
};
const actions = {
  async sendMessage({ rootState }) {
    const messageObject = {
      message: rootState.text.message,
      name: rootState.user.user.name,
      photo: rootState.user.user.photo,
      date: Date.now(),
    };
    try {
      const res = await db.collection("chats").add(messageObject);
    } catch (error) {
      console.log(error.message);
    }
  },
  snapshotMessages({ commit }) {
    db.collection("chats")
      .orderBy("date", "desc")
      .limit(10)
      .onSnapshot((querySnapshot) => {
        commit("setMessages");
        querySnapshot.forEach((msg) => {
          commit("setMessages", msg.data());
        });
      });
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
};
