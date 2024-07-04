import React, { useState, useRef, useEffect } from "react";
import "./chat.css";
import Detail from "../detail/detail";
import Chatlist from "../list/chatlist/chatlist";
import EmojiPicker from "emoji-picker-react";
import { useChatStore } from "../../lib/chatStore";
import { auth, db } from "../../lib/firebase";
import { doc, updateDoc, arrayUnion, getDoc, onSnapshot } from "firebase/firestore";

const Chat = () => {
    const [open, setOpen] = useState(false);
    const [text, setText] = useState("");
    const [isDetailVisible, setIsDetailVisible] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isChatsSelected, setIsChatsSelected] = useState(true);
    const [chat, setChat] = useState(null);
    const { selectedChat, selectChat, isCurrentUserBlocked, isReceiverBlocked } = useChatStore();
    const currentUser = auth.currentUser;
    const emojiPickerRef = useRef(null);
    const detailRef = useRef(null);
    const endRef = useRef(null);

    useEffect(() => {
        if (selectedChat) {
            selectChat(selectedChat);

            const unSub = onSnapshot(doc(db, "chats", selectedChat.chatId), (res) => {
                setChat(res.data());
            });

            return () => {
                unSub();
            };
        }
    }, [selectedChat, selectChat]);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chat?.messages]);

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

    const handleSend = async () => {
        if (text.trim() === "") return;

        try {
            await updateDoc(doc(db, "chats", selectedChat.chatId), {
                messages: arrayUnion({
                    senderId: currentUser.uid,
                    text,
                    createdAt: new Date(),
                }),
            });

            const userIDs = [currentUser.uid, selectedChat.user.id];

            for (const id of userIDs) {
                const userChatsRef = doc(db, "userchats", id);
                const userChatsSnapshot = await getDoc(userChatsRef);

                if (userChatsSnapshot.exists()) {
                    const userChatsData = userChatsSnapshot.data();

                    const chatIndex = userChatsData.chats.findIndex(
                        (c) => c.chatId === selectedChat.chatId
                    );

                    if (chatIndex !== -1) {
                        userChatsData.chats[chatIndex].lastMessage = text;
                        userChatsData.chats[chatIndex].isSeen =
                            id === currentUser.uid ? true : false;
                        userChatsData.chats[chatIndex].updatedAt = Date.now();

                        await updateDoc(userChatsRef, {
                            chats: userChatsData.chats,
                        });
                    } else {
                        // Handle case where the chat does not exist in the userChatsData
                        userChatsData.chats.push({
                            chatId: selectedChat.chatId,
                            lastMessage: text,
                            isSeen: id === currentUser.uid,
                            updatedAt: Date.now(),
                        });
                        await updateDoc(userChatsRef, {
                            chats: userChatsData.chats,
                        });
                    }
                }
            }
        } catch (err) {
            console.log(err);
        } finally {
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
                    {chat?.messages?.map((message) => (
                        <div className={`message ${message.senderId === currentUser?.uid ? "own" : ""}`} key={message?.createdAt}>
                            <div className="texts">
                                <p>{message.text}</p>
                                <span>{new Date(message.createdAt.toDate()).toLocaleTimeString()}</span>
                            </div>
                        </div>
                    ))}
                    <div ref={endRef}></div>
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
                        placeholder={
                            isCurrentUserBlocked || isReceiverBlocked
                                ? "You cannot send a message"
                                : "Type a message..."
                        }
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        disabled={isCurrentUserBlocked || isReceiverBlocked}
                    />
                    <button
                        className="sendButton"
                        onClick={handleSend}
                        disabled={isCurrentUserBlocked || isReceiverBlocked}
                    >
                        Send
                    </button>
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
