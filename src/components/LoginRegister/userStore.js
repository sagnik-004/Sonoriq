import { create } from "zustand";

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
      console.log(err);
      return set({ currentUser: null });
    }
  },
}));
