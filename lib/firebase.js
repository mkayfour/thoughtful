import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA5lm88xyJUHRtmmuHrQIYc7cFzDAuwuls",
  authDomain: "fir-app-b6af6.firebaseapp.com",
  projectId: "fir-app-b6af6",
  storageBucket: "fir-app-b6af6.appspot.com",
  messagingSenderId: "19545415599",
  appId: "1:19545415599:web:1eb78cf6b1c31b5861995a",
  measurementId: "G-029Q7WR0K9",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Auth exports
export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();

export const firestore = firebase.firestore();
export const storage = firebase.storage();

// Firestore exports
// export const firestore = firebase.firestore();
