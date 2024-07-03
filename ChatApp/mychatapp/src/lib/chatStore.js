import { create } from "zustand";
import { db, auth } from "./firebase";
import { doc, getDoc, setDoc, updateDoc, arrayUnion, onSnapshot, serverTimestamp } from "firebase/firestore";

export const useChatStore = create((set, get) => ({
    chats: [],
    selectedChat: null,
    fetchChats: async () => {
        const currentUser = auth.currentUser;
        if (!currentUser) return;

        const chatDocRef = doc(db, "userchats", currentUser.uid);
        onSnapshot(chatDocRef, async (doc) => {
            if (doc.exists()) {
                const chatData = doc.data().chats || [];
                const promises = chatData.map(async (chat) => {
                    const userDocRef = doc(db, "users", chat.receiverId);
                    const userDocSnap = await getDoc(userDocRef);
                    return { ...chat, user: userDocSnap.data() };
                });
                const chats = await Promise.all(promises);
                set({ chats: chats.sort((a, b) => b.updatedAt - a.updatedAt) });
            }
        });
    },
    addChat: async (userId) => {
        const currentUser = auth.currentUser;
        if (!currentUser) return;

        const chatDocRef = doc(db, "userchats", currentUser.uid);
        const chatSnap = await getDoc(chatDocRef);
        if (!chatSnap.exists()) {
            await setDoc(chatDocRef, { chats: [] });
        }

        const existingChat = chatSnap.data().chats.find(chat => chat.receiverId === userId);
        if (existingChat) {
            alert("Chat already exists!");
            return;
        }

        const userDocRef = doc(db, "users", userId);
        const userDocSnap = await getDoc(userDocRef);
        if (!userDocSnap.exists()) {
            alert("User ID not found!");
            return;
        }

        await updateDoc(chatDocRef, {
            chats: arrayUnion({
                receiverId: userId,
                lastMessage: "",
                updatedAt: serverTimestamp(),
                chatId: `${currentUser.uid}_${userId}`
            })
        });
    },
    sendMessage: async (chatId, message) => {
        const currentUser = auth.currentUser;
        if (!currentUser) return;

        const chatDocRef = doc(db, "userchats", currentUser.uid);
        const updatedChats = get().chats.map(chat => {
            if (chat.chatId === chatId) {
                return {
                    ...chat,
                    lastMessage: message,
                    updatedAt: serverTimestamp(),
                };
            }
            return chat;
        });

        set({ chats: updatedChats.sort((a, b) => b.updatedAt - a.updatedAt) });

        await updateDoc(chatDocRef, {
            chats: updatedChats,
        });
    },
    selectChat: (chatId) => {
        set({ selectedChat: chatId });
    }
}));
