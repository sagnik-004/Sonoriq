import { create } from "zustand";
import { doc, getDoc, updateDoc, arrayUnion, setDoc, getDocs, collection } from "firebase/firestore";
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
        set({ currentUser: { ...docSnap.data(), uid: docSnap.id } });
      } else {
        set({ currentUser: null });
      }
    } catch (err) {
      console.error(err);
      return set({ currentUser: null });
    }
  },
}));

export const fetchUserGroups = async () => {
  const querySnapshot = await getDocs(collection(db, "groups"));
  return querySnapshot.docs.map(doc => doc.data());
};

export const getUserGroups = async (userId) => {
  const userDoc = doc(db, "users", userId);
  const userSnapshot = await getDoc(userDoc);

  if (userSnapshot.exists()) {
    const userData = userSnapshot.data();
    return userData.groups || [];
  } else {
    return [];
  }
};

export const joinGroup = async (userId, groupId) => {
  const userDoc = doc(db, "users", userId);
  await updateDoc(userDoc, {
    groups: arrayUnion(groupId)
  });

  const groupDoc = doc(db, "groups", groupId);
  await updateDoc(groupDoc, {
    members: arrayUnion(userId)
  });
};
