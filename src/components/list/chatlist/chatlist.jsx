import { useEffect, useState } from "react";
import "./chatlist.css";
import AddUser from "./addUser/addUser";
import { useUserStore } from "../../LoginRegister/userStore";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../LoginRegister/firebase";
import { useChatStore } from "../../lib/chatStore";
import { FaSearch } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { FaMinus } from "react-icons/fa";

const truncateMessage = (message, maxLength) => {
  if (message.length <= maxLength) {
    return message;
  }
  return `${message.substring(0, maxLength)}...`;
};

const ChatList = () => {
  const [chats, setChats] = useState([]);
  const [addMode, setAddMode] = useState(false);
  const [input, setInput] = useState("");

  const { currentUser } = useUserStore();
  const { changeChat, selectedChat } = useChatStore();

  useEffect(() => {
    if (!currentUser) {
      return;
    }

    const unSub = onSnapshot(
      doc(db, "userchats", currentUser.id),
      async (res) => {
        const items = res.data().chats || [];

        const promises = items.map(async (item) => {
          const userDocRef = doc(db, "users", item.receiverId);
          const userDocSnap = await getDoc(userDocRef);

          const user = userDocSnap.data();

          return { ...item, user };
        });

        // Assuming an average word length of 5 characters
        const avgWordLength = 10;
        const maxLength = avgWordLength * 4; // Change 4 to however many words you want to show

        const chatData = await Promise.all(promises);
        setChats(
          chatData
            .map((chat) => ({
              ...chat,
              lastMessage: truncateMessage(chat.lastMessage, maxLength),
            }))
            .sort((a, b) => b.updatedAt - a.updatedAt)
        );
      }
    );

    return () => {
      unSub();
    };
  }, [currentUser]);

  const handleSelect = async (chat) => {
    const userChats = chats.map((item) => {
      const { user, ...rest } = item;
      return rest;
    });

    const chatIndex = userChats.findIndex(
      (item) => item.chatId === chat.chatId
    );

    userChats[chatIndex].isSeen = true;

    const userChatsRef = doc(db, "userchats", currentUser.id);

    try {
      await updateDoc(userChatsRef, {
        chats: userChats,
      });
      changeChat(chat.chatId, chat.user);
    } catch (err) {
      console.log(err);
    }
  };

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  const filteredChats = chats.filter(
    (c) =>
      c.user.username.toLowerCase().includes(input.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(input.toLowerCase())
  );

  return (
    <div className="chatList">
      <div className="search">
        <div className="searchBar">
          <FaSearch />
          <input
            type="text"
            placeholder="Search"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>
        <button className="add" onClick={() => setAddMode((prev) => !prev)}>
          {addMode ? <FaMinus /> : <FaPlus />}{" "}
        </button>
      </div>
      {filteredChats.map((chat) => (
        <div
          className={`customer ${
            chat.isSeen
              ? selectedChat?.chatId === chat.chatId
                ? "selected"
                : ""
              : "unseen"
          }`}
          key={chat.chatId}
          onClick={() => handleSelect(chat)}
        >
          <img
            src={
              chat.user.blocked.includes(currentUser.id)
                ? "./avatar.png"
                : chat.user.imageUrl || "./avatar.png"
            }
            alt=""
          />
          <div className="texts">
            <p className="chatName">
              {chat.user.blocked.includes(currentUser.id)
                ? "User"
                : chat.user.username}
              {!chat.isSeen && (
                <span className="badge">{chat.unreadCount}</span>
              )}
            </p>
            <p>{chat.lastMessage}</p>
          </div>
        </div>
      ))}

      {addMode && <AddUser />}
    </div>
  );
};

export default ChatList;
