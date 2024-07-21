import { db } from '../LoginRegister/firebase';
import { collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { useUserStore } from '../LoginRegister/userStore';

// Function to get the current user information from the store
const getCurrentUser = () => {
    const { currentUser } = useUserStore.getState();
    return currentUser;
};

export const sendMessage = async (groupId, message) => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
        console.error("No current user found!");
        return;
    }

    const { userid, username, imageUrl } = currentUser;

    const messagesRef = collection(db, 'groups', groupId, 'messages');
    await addDoc(messagesRef, {
        message,
        userId: userid, // Use the unique userid
        username,
        avatarUrl: imageUrl,
        timestamp: Date.now(),
    });
};

export const subscribeToMessages = (groupId, callback) => {
    const messagesRef = collection(db, 'groups', groupId, 'messages');
    const messagesQuery = query(messagesRef, orderBy('timestamp', 'asc'));

    return onSnapshot(messagesQuery, (snapshot) => {
        const messages = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        callback(messages);
    });
};
