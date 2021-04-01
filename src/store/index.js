import Vue from "vue";
import Vuex from "vuex";
import { firebase, db, auth } from "@/firebase.js";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
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

    //Login section
    // email and password mode
    createUserWithEmail: async function({ commit, dispatch }, payload) {
      try {
        const res = await auth.createUserWithEmailAndPassword(
          payload.email,
          payload.password
        );

        const user = {
          uid: res.user?.uid,
          name: payload.name,
          email: res.user?.email,
          photo: null,
        };
        dispatch("createUserDB", user);
      } catch (error) {
        console.log(error.message);
      }
    },

    loginUser: async function({ commit, dispatch }, payload) {
      try {
        // Apply this persitence to mantain the session status only for window opened
        const res = await auth.signInWithEmailAndPassword(
          payload.email,
          payload.password
        );
        const user_res = {
          email: res.user.email,
          uid: res.user.uid,
        };
      } catch (error) {
        console.log(error.message);
      }
    },

    //Oauth mode
    googleAuth({ dispatch }) {
      const provider = new firebase.auth.GoogleAuthProvider();
      dispatch("loginWithPopup", provider);
    },
    githubAuth({ dispatch }) {
      const provider = new firebase.auth.GithubAuthProvider();
      dispatch("loginWithPopup", provider);
    },

    async loginWithPopup({ dispatch }, provider) {
      try {
        const res = await firebase.auth().signInWithPopup(provider);
        const user = {
          uid: res.user?.uid,
          name: res.user?.displayName,
          email: res.user?.email,
          photo: res.user?.photoURL,
        };
        dispatch("createUserDB", user);
      } catch (error) {
        console.log(error.message);
      }
    },

    async createUserDB({ commit }, user) {
      // Storage the user in User database
      await db
        .collection("user")
        .doc(user.uid)
        .set(user);
      console.log("User storaged in database", user);
    },
  },
  modules: {},
});
