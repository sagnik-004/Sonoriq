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
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
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
