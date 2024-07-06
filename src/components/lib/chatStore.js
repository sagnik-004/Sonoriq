import { create } from "zustand";
import { db, auth } from "../LoginRegister/firebase";
import { doc, getDoc, setDoc, updateDoc, onSnapshot, serverTimestamp, collection, query, orderBy, addDoc } from "firebase/firestore";

export const useChatStore = create((set, get) => ({
    chats: [],
    selectedChat: null,
    messages: [],
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
    },
    sendMessage: async (chatId, message) => {
        const currentUser = auth.currentUser;
        if (!currentUser) {
            console.error("No current user");
            return;
        }

        const messageData = {
            senderId: currentUser.uid,
            message,
            timestamp: serverTimestamp(),
        };

        const chatDocRef = doc(db, "chats", chatId);
        await addDoc(collection(chatDocRef, "messages"), messageData);

        const chatUserDocRef = doc(db, "userchats", currentUser.uid);
        const updatedChats = get().chats.map(chat => {
            if (chat.chatId === chatId) {
                return {
                    ...chat,
                    lastMessage: message,
                    updatedAt: Date.now(), // Use local timestamp for immediate state update
                };
            }
            return chat;
        });

        set({ chats: updatedChats.sort((a, b) => b.updatedAt - a.updatedAt) });

        await updateDoc(chatUserDocRef, {
            chats: updatedChats,
        });
    },
    changeChat: (chatId, user) => {
        set({ selectedChat: { chatId, user } });
        get().selectChat(chatId);
    },
    selectChat: async (chatId) => {
        let chatDocRef;
        try {
            chatDocRef = doc(db, "chats", String(chatId)); // Attempt to convert to string
        } catch (error) {
            console.error("Invalid chatId format:", chatId);
            return; // Exit the function early if chatId is not convertible to a string
        }
        const messagesQuery = query(collection(chatDocRef, "messages"), orderBy("timestamp", "asc"));
        onSnapshot(messagesQuery, (snapshot) => {
            const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            set({ messages });
        });
    },
}));
