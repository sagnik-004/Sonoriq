import { create } from "zustand";
import { db, doc, getDoc } from "./firebase"; // Import doc and getDoc from firebase.js

export const useUserStore = create((set) => ({
  currentUser: null,
  setUser: (user) => set({ currentUser: user }),
  fetchUserInfo: async (uid) => {
    if (!uid) return set({ currentUser: null });

    try {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        set({ currentUser: docSnap.data() });
      } else {
        set({ currentUser: null });
      }
    } catch (err) {
      console.log(err);
      return set({ currentUser: null });
    }
  },
}));
