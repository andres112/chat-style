import router from "@/router";
import { firebase, db, auth } from "@/firebase.js";
import { User } from "@/helpers";

const state = {
  user: {},
  isRegister: false,
};
const mutations = {
  setUser(state, payload) {
    state.user = payload;
  },
};
const actions = {
  //Login section
  // email and password Registration
  createUserWithEmail: async function({ commit, dispatch }, payload) {
    try {
      const res = await auth.createUserWithEmailAndPassword(
        payload.email,
        payload.password
      );

      // after create user update displayname in firebase
      await dispatch("updateUser", {
        displayName: payload.name,
      });

      const user = await User(res);
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
      const user = await User(res);
      dispatch("setUser", user); // set user in application when login successfuly
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
      const res = await auth.signInWithPopup(provider);
      const user = await User(res);
      dispatch("setUser", user); // set user in application when login successfuly
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

  // Update user profile in firebase
  async updateUser({ commit }, user) {
    const currentUser = auth.currentUser;
    try {
      await currentUser.updateProfile(user);
    } catch (error) {
      console.log(error.message);
    }
  },

  signOut({ commit }) {
    auth.signOut();
    commit("setUser", {});
    router.push("/user");
  },

  // Set current user
  setUser({ commit }, user) {
    commit("setUser", user);
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
};
