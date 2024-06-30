import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBpV8oCWVYO3i1eUkfGtOvAvID7wqzUu9s",
  authDomain: "authentication-42f50.firebaseapp.com",
  projectId: "authentication-42f50",
  storageBucket: "authentication-42f50.appspot.com",
  messagingSenderId: "519979060522",
  appId: "1:519979060522:web:5230bb5103ed0200156253"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword };
