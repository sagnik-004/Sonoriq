import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore"; // Import doc and getDoc
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
const db = getFirestore();
const storage = getStorage();

export { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, db, storage, doc, getDoc }; // Export doc and getDoc
