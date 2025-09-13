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

const firebaseConfig = {
  apiKey: "AIzaSyDIwzDaGQJpxs2FVc0ndYAgqQ05HqjwPjE",
  authDomain: "sonoriq-01.firebaseapp.com",
  projectId: "sonoriq-01",
  storageBucket: "sonoriq-01.firebasestorage.app",
  messagingSenderId: "761092786022",
  appId: "1:761092786022:web:b8655da414c5bb99546aa7",
  measurementId: "G-XPNB04JJ2F"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

const deleteAccount = async (userId) => {
  const user = auth.currentUser;
  if (user) {
    try {
      const userDocRef = doc(db, "users", userId);
      await deleteDoc(userDocRef);
      console.log('User data deleted from Firestore');

      await deleteUser(user);
      console.log('User deleted from Firebase Auth');
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  } else {
    console.error('No user is currently signed in.');
  }
};

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
  deleteAccount
};
