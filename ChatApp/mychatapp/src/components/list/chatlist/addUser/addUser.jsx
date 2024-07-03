import "./addUser.css";
import { db } from "../../../../lib/firebase";
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  serverTimestamp,
  query,
  where,
} from "firebase/firestore";
import { useState } from "react";
import { useUserStore } from "../../../../lib/userStore";

const AddUser = () => {
  const [user, setUser] = useState(null);
  const { currentUser } = useUserStore();

  const handleSearch = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const userid = formData.get("userid");

    try {
      const userDocRef = collection(db, "users");
      const userSnapshot = await getDocs(query(userDocRef, where("userid", "==", userid)));

      if (!userSnapshot.empty) {
        const userDocSnap = userSnapshot.docs[0];
        setUser({ ...userDocSnap.data(), id: userDocSnap.id });
      } else {
        setUser(null); // Handle case where user does not exist
        alert("User does not exist");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleAdd = async () => {
    if (!user) return;

    const chatRef = collection(db, "chats");
    const userChatsRef = collection(db, "userchats");

    try {
      const userChatDocRef = doc(userChatsRef, currentUser.id);
      const userChatDocSnap = await getDoc(userChatDocRef);

      // Check if user already exists in the chat list
      if (userChatDocSnap.exists()) {
        const chats = userChatDocSnap.data().chats;
        const chatExists = chats.some(chat => chat.receiverId === user.id);
        if (chatExists) {
          alert("User already exists in chat list");
          return;
        }
      }

      const newChatRef = doc(chatRef);

      await setDoc(newChatRef, {
        createdAt: serverTimestamp(),
        messages: [],
      });

      const updateUserChats = async (userId, chatData) => {
        const userChatDocRef = doc(userChatsRef, userId);
        const userChatDocSnap = await getDoc(userChatDocRef);

        if (userChatDocSnap.exists()) {
          await updateDoc(userChatDocRef, {
            chats: arrayUnion(chatData),
          });
        } else {
          await setDoc(userChatDocRef, {
            chats: [chatData],
          });
        }
      };

      const chatDataForUser = {
        chatId: newChatRef.id,
        lastMessage: "",
        receiverId: currentUser.id,
        updatedAt: Date.now(),
      };

      const chatDataForCurrentUser = {
        chatId: newChatRef.id,
        lastMessage: "",
        receiverId: user.id,
        updatedAt: Date.now(),
      };

      await updateUserChats(user.id, chatDataForUser);
      await updateUserChats(currentUser.id, chatDataForCurrentUser);

      // Optionally, add to chat list in UI
      alert("Chat added successfully");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="addUser">
      <form onSubmit={handleSearch}>
        <input type="text" placeholder="User ID" name="userid" />
        <button type="submit">Search</button>
      </form>
      {user && (
        <div className="user">
          <div className="detail">
            <img src={user.imageUrl || "./avatar.png"} alt="avatar" />
            <span>{user.username}</span>
          </div>
          <button onClick={handleAdd}>Add User</button>
        </div>
      )}
    </div>
  );
};

export default AddUser;
