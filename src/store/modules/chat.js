import { db } from "@/firebase.js";
import { nanoid } from "nanoid";
import moment from "moment";

const state = {
  messages: [],
  chats: [], // state for identify all the chats associated to current user
  destination: null,
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
  setDestination(state, payload) {
    state.destination = payload;
  },
};
const actions = {
  async sendMessage({ state, rootState, dispatch }) {
    const messageObject = {
      message: rootState.text.message,
      date: Date.now(),
      source: {
        user_name: rootState.user.user.name,
        user_uid: rootState.user.user.uid,
        user_photo: rootState.user.user.photo,
      },
      destination_uid: state.destination.uid,
    };
    try {
      // TODO check if destination exist in chatlist fot current users
      const chat = rootState.user.userChats.find((x) =>
        x.users.includes(state.destination.uid)
      );
      // identification for chat between 2 users
      const chat_id = nanoid();
      const content = {
        users: [rootState.user.user.uid, state.destination.uid],
        chat_id: chat_id,
      };
      if (!chat) {
        dispatch("createChatIndex", content);
      }
      const res = await db
        .collection("chats")
        .doc(chat.chat_id ?? chat_id)
        .add(messageObject);
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
  async createChatIndex({}, content) {
    try {
      const res = await db
        .collection("chat_index")
        .doc(chatId)
        .add(content);
    } catch (error) {
      console.log(error.message);
    }
  },
  setDestination({ commit }, payload) {
    commit("setDestination", payload);
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
};
