import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  sendPasswordResetEmail, 
  deleteUser 
} from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  query, 
  where, 
  collection, 
  getDocs, 
  updateDoc, 
  deleteDoc 
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

// Function to delete user account and associated Firestore data
const deleteAccount = async (userId) => {
  const user = auth.currentUser;
  if (user) {
    try {
      // Delete user data from Firestore
      const userDocRef = doc(db, "users", userId);
      await deleteDoc(userDocRef);
      console.log('User data deleted from Firestore');

      // Delete user authentication
      await deleteUser(user);
      console.log('User deleted from Firebase Auth');
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  } else {
    console.error('No user is currently signed in.');
  }
};

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
  setDoc,
  updateDoc,
  deleteAccount // Export the deleteAccount function
};
