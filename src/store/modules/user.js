import router from "@/router";
import { firebase, db, auth } from "@/firebase.js";
import { User } from "@/helpers";

const state = {
  user: {},
  users: [],
  isRegister: false,
  userChats: [],
};
const mutations = {
  setUser(state, payload) {
    state.user = payload;
  },
  setAllUsers(state, payload) {
    state.users = payload;
  },
  setUserChats(state, chat = null) {
    if (chat) {
      state.userChats.push(chat);
      return;
    }
    state.userChats = [];
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
        photoURL:
          "https://firebasestorage.googleapis.com/v0/b/styleme-59e9a.appspot.com/o/user-solid.png?alt=media&token=ac1e6e88-5dba-4b5b-b9cd-42d5235fc347",
      });

      const user = await User(res);
      dispatch("createUserDB", user);
      dispatch("signOut");
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

  //Get all users registered in Firebaseapp
  async getAllUsers({ commit, state }) {
    try {
      const res = await db.collection("user").get();
      const userList = res.docs
        .map((x) => x.data())
        .filter((u) => u.uid != state.user.uid);
      commit("setAllUsers", userList);
    } catch (error) {
      console.log(error.message);
    }
  },

  // Get all the chats id associted to the user list
  getChatList({ commit, state }) {
    commit("setUserChats", null);
    try {
      const ref = db.collection("chat_index");
      const list = ref
        .where("users", "array-contains", state.user.uid)
        .onSnapshot((querySnapshot) => {
          commit("setMessages");
          querySnapshot.forEach((x) => {
            commit("setUserChats", x.data());
          });
        });
    } catch (error) {
      console.log(error.message);
    }
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
};
