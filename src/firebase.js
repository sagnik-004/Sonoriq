import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

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
const googleProvider = new GoogleAuthProvider();

const signInWithGoogle = () => {
    return signInWithPopup(auth, googleProvider);
};

export { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithGoogle };
