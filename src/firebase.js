import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

var firebaseConfig = {
  apiKey: process.env.VUE_APP_FIRESTORE_APIKEY,
  authDomain: "styleme-59e9a.firebaseapp.com",
  projectId: "styleme-59e9a",
  storageBucket: "styleme-59e9a.appspot.com",
  messagingSenderId: "899713937866",
  appId: process.env.VUE_APP_FIRESTORE_APIID,
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
