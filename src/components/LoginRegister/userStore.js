import { create } from "zustand";
import { doc, getDoc, updateDoc, arrayUnion, setDoc, getDocs, collection, query, where } from "firebase/firestore";
import { db } from "./firebase";

// Zustand stores
export const useChatStore = create((set) => ({
  selectedChat: null,
  isReceiverBlockedByCurrentUser: false,
  changeBlock: () => set((state) => ({ isReceiverBlockedByCurrentUser: !state.isReceiverBlockedByCurrentUser })),
  resetChat: () => set({ selectedChat: null }),
}));

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
      console.error(err);
      return set({ currentUser: null });
    }
  },
}));

// Firebase functions
export const fetchUserGroups = async () => {
  const querySnapshot = await getDocs(collection(db, "groups"));
  return querySnapshot.docs.map(doc => doc.data());
};

export const getUserGroups = async (userId) => {
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("userId", "==", userId));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();
    return userData.groups || [];
  } else {
    return [];
  }
};

export const joinGroup = async (userId, groupId) => {
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("userId", "==", userId));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    const userDoc = querySnapshot.docs[0];
    const userRef = doc(db, "users", userDoc.id);

    const userSnapshot = await getDoc(userRef);
    if (userSnapshot.exists()) {
      const userData = userSnapshot.data();
      const groups = userData.groups || [];
      if (!groups.includes(groupId)) {
        await updateDoc(userRef, {
          groups: arrayUnion(groupId),
        });
      }
    }
  }

  const groupDoc = doc(db, "groups", groupId);
  const groupSnapshot = await getDoc(groupDoc);
  if (groupSnapshot.exists()) {
    await updateDoc(groupDoc, {
      members: arrayUnion(userId),
    });
  }
};