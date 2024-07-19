import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  sendPasswordResetEmail 
} from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  query, 
  where, 
  collection, 
  getDocs 
} from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase configuration
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

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Export Firebase services and methods
export {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  db,
  storage,
  doc,
  getDoc,
  query,
  where,
  collection,
  getDocs,
  setDoc
};