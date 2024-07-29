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
  apiKey: "AIzaSyAz9PJ0R0sekvK9dh_hPP5sFZYPmXUxyNs",
  authDomain: "sonoriq-f4dcc.firebaseapp.com",
  projectId: "sonoriq-f4dcc",
  storageBucket: "sonoriq-f4dcc.appspot.com",
  messagingSenderId: "613507041397",
  appId: "1:613507041397:web:2b856303628a07e1ac103c",
  measurementId: "G-6FH1GMETZT"
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
