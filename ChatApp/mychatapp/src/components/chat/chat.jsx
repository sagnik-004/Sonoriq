import React, { useState, useRef, useEffect } from "react";
import "./chat.css";
import Detail from "../detail/detail";
import Chatlist from "../list/chatlist/chatlist";
import EmojiPicker from "emoji-picker-react";
import { useChatStore } from "../../lib/chatStore";
import { auth } from "../../lib/firebase";  // Add this import

const Chat = () => {
    const [open, setOpen] = useState(false);
    const [text, setText] = useState("");
    const [isDetailVisible, setIsDetailVisible] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isChatsSelected, setIsChatsSelected] = useState(true);
    const emojiPickerRef = useRef(null);
    const detailRef = useRef(null);
    const { selectedChat, messages, sendMessage, selectChat } = useChatStore();

    useEffect(() => {
        if (selectedChat) {
            selectChat(selectedChat);
        }
    }, [selectedChat, selectChat]);

    const handleEmoji = (e) => {
        setText((prev) => prev + e.emoji);
        setOpen(false);
    };

    const handleClickOutside = (event) => {
        if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
            setOpen(false);
        }
        if (detailRef.current && !detailRef.current.contains(event.target) && !event.target.classList.contains('top')) {
            setIsDetailVisible(false);
        }
        if (isSidebarOpen && !event.target.closest('.sidebar') && !event.target.closest('.floating-avatar')) {
            setIsSidebarOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isSidebarOpen]);

    const toggleDetail = () => {
        setIsDetailVisible((prev) => !prev);
    };

    const toggleSidebar = () => {
        setIsSidebarOpen((prev) => !prev);
    };

    const handleSend = () => {
        if (text.trim()) {
            sendMessage(selectedChat.chatId, text);
            setText("");
        }
    };

    return (
        <div className={`chat-container ${isDetailVisible ? "detail-visible" : ""}`}>
            {window.innerWidth < 1400 && (
                <div className="floating-avatar" onClick={toggleSidebar}>
                    <img src={isChatsSelected ? "sidebaropen.png" : ""} alt="Toggle Sidebar" />
                </div>
            )}
            {window.innerWidth < 1400 && isSidebarOpen && (
                <div className="sidebar">
                    <Chatlist />
                </div>
            )}
            <div className="chat">
                {selectedChat && (
                    <div className="top" onClick={toggleDetail}>
                        <div className="user">
                            <img src={selectedChat.user.imageUrl || "./avatar.jpg"} draggable="false" alt="Avatar" />
                            <div className="texts">
                                <span>{selectedChat.user.username}</span>
                            </div>
                        </div>
                    </div>
                )}
                <div className="center">
                    {messages.map((msg) => (
                        <div className={`message ${msg.senderId === auth.currentUser.uid ? "own" : ""}`} key={msg.id}>
                            <div className="texts">
                                <p>{msg.message}</p>
                                <span>{new Date(msg.timestamp?.toDate()).toLocaleTimeString()}</span>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="bottom">
                    <div className="icons">
                        <img src="./mic.svg" alt="Microphone" />
                    </div>
                    <div className="emoji" ref={emojiPickerRef}>
                        <img
                            src="./emoji.svg"
                            alt="Emoji"
                            onClick={() => setOpen((prev) => !prev)}
                        />
                        {open && (
                            <div className="picker">
                                <EmojiPicker onEmojiClick={handleEmoji} />
                            </div>
                        )}
                    </div>
                    <input
                        type="text"
                        placeholder="Type a message"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                    <button className="sendButton" onClick={handleSend}>Send</button>
                </div>
            </div>
            {window.innerWidth < 1400 && isDetailVisible && (
                <div className="overlay" onClick={() => setIsDetailVisible(false)}>
                    <div className="detail-popup" onClick={(e) => e.stopPropagation()}>
                        <div className="detail-content" ref={detailRef}>
                            <Detail />
                        </div>
                    </div>
                </div>
            )}
            {window.innerWidth >= 1400 && isDetailVisible && (
                <div className={`detail visible`} ref={detailRef}>
                    <Detail />
                </div>
            )}
        </div>
    );
};

export default Chat;
