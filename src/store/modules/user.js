import { firebase, db, auth } from "@/firebase.js";

const state = {
  isRegister: false,
};
const mutations = {};
const actions = {
  //Login section
  // email and password Registration
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
      alert(error.message);
    }
  },

  // User authentication with email and password.
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
      alert(error.message);
    }
  },

  //Oauth mode
  //google auth
  googleAuth({ dispatch }) {
    const provider = new firebase.auth.GoogleAuthProvider();
    dispatch("loginWithPopup", provider);
  },
  //github auth
  githubAuth({ dispatch }) {
    const provider = new firebase.auth.GithubAuthProvider();
    dispatch("loginWithPopup", provider);
  },

  // Popup for user autentication with OAuth provider
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

  // Storage the user in User database
  async createUserDB({ commit }, user) {
    await db
      .collection("user")
      .doc(user.uid)
      .set(user);
    console.log("User storaged in database", user);
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
};
