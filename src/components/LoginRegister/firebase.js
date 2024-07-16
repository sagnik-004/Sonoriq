import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, query, where, collection, getDocs } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCsbyDmM5DcQBMhV2Lh7_CpUbIFcuDC2IE",
  authDomain: "sonoriq.firebaseapp.com",
  projectId: "sonoriq",
  storageBucket: "sonoriq.appspot.com",
  messagingSenderId: "964785571210",
  appId: "1:964785571210:web:4d2c6d80057a8941c77473",
  measurementId: "G-2ZPHNXJL08"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, db, storage, doc, getDoc, query, where, collection, getDocs, setDoc };
