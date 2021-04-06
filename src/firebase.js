import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

var firebaseConfig = {
  apiKey: "AIzaSyA8PdcBVGAsFt2JfFvtK9P3R_u_3ipzdc4",
  authDomain: "styleme-59e9a.firebaseapp.com",
  projectId: "styleme-59e9a",
  storageBucket: "styleme-59e9a.appspot.com",
  messagingSenderId: "899713937866",
  appId: "1:899713937866:web:b15ec46abad62479365f33",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { firebase, db, auth, storage };
