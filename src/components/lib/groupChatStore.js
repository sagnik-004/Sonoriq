import { db, auth } from "../LoginRegister/firebase";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore";

export const sendMessage = async (groupId, message) => {
    const user = auth.currentUser;
    if (!user) {
        throw new Error("User not authenticated");
    }

    const userId = user.uid;
    const messagesRef = collection(db, "groups", groupId, "messages");
    await addDoc(messagesRef, {
        message,
        userId,
        timestamp: serverTimestamp()
    });
};

export const subscribeToMessages = (groupId, setMessages) => {
    const messagesRef = collection(db, "groups", groupId, "messages");
    const q = query(messagesRef, orderBy("timestamp", "asc"));

    return onSnapshot(q, (snapshot) => {
        const messages = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        setMessages(messages);
    });
};
