import React, { useEffect } from "react";
import { useChatStore } from "../lib/chatStore";
import { auth } from "../LoginRegister/firebase";
import { useUserStore } from "../LoginRegister/userStore";
import "./detail.css";

const Detail = () => {
  const { selectedChat, changeBlock, resetChat, isReceiverBlockedByCurrentUser } = useChatStore();
  const { currentUser } = useUserStore();

  // Log selectedChat to verify it is being received
  useEffect(() => {
    console.log("selectedChat:", selectedChat);
  }, [selectedChat]);

  if (!selectedChat) {
    return <div className="empty">Select a user to see details</div>;
  }

  const { user } = selectedChat;

  const handleBlock = () => {
    if (!user) return;
    // Here we only change the local state, no Firebase operations
    changeBlock();
  };

  const handleLogout = () => {
    auth.signOut();
    resetChat();
  };

  // Don't show profile details if the current user is blocked by the receiver
  if (isReceiverBlockedByCurrentUser) {
    return (
      <div className="detail">
        <div className="user">
          <button className="block-button" onClick={handleBlock}>
            {isReceiverBlockedByCurrentUser ? "Unblock User" : "Block User"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="detail">
      <div className="user">
        <img src={user.imageUrl || "./avatar.jpg"} draggable="false" alt="user pfp" />
        <h2 className="username">{user.username}</h2>
        <h3 className="userid">@{user.userid}</h3>
        <p className="bio">{user.bio || "No bio available"}</p>
        <div className="genres">
          {user.genres && user.genres.map((genre, index) => (
            <span key={index} className="genre">{genre}</span>
          ))}
        </div>
        <button className="block-button" onClick={handleBlock}>
          {isReceiverBlockedByCurrentUser ? "Unblock User" : "Block User"}
        </button>
      </div>
    </div>
  );
};

export default Detail;
