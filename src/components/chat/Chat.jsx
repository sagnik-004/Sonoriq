import React, { useState, useRef, useEffect } from "react";
import "./chat.css";
import Detail from "../detail/detail";
import Chatlist from "../list/chatlist/chatlist";
import EmojiPicker from "emoji-picker-react";
import { useChatStore } from "../../components/lib/chatStore";
import { auth, db } from "../../components/LoginRegister/firebase";
import { doc, updateDoc, arrayUnion, getDoc, onSnapshot } from "firebase/firestore";

const Chat = () => {
    const [open, setOpen] = useState(false);
    const [text, setText] = useState("");
    const [isDetailVisible, setIsDetailVisible] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isChatsSelected, setIsChatsSelected] = useState(true);
    const [chat, setChat] = useState(null);
    const [isScrolledToBottom, setIsScrolledToBottom] = useState(true);
    const { selectedChat, selectChat, isCurrentUserBlocked, isReceiverBlocked } = useChatStore();
    const currentUser = auth.currentUser;
    const emojiPickerRef = useRef(null);
    const detailRef = useRef(null);
    const endRef = useRef(null);
    const centerRef = useRef(null);

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

    useEffect(() => {
        const handleScroll = () => {
            if (centerRef.current) {
                const { scrollTop, scrollHeight, clientHeight } = centerRef.current;
                setIsScrolledToBottom(scrollHeight - scrollTop === clientHeight);
            }
        };

        if (centerRef.current) {
            centerRef.current.addEventListener("scroll", handleScroll);
        }

        return () => {
            if (centerRef.current) {
                centerRef.current.removeEventListener("scroll", handleScroll);
            }
        };
    }, []);

    useEffect(() => {
        if (isScrolledToBottom) {
            document.querySelector(".scrollButton").classList.remove("visible");
        }
    }, [isScrolledToBottom]);

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
        const trimmedText = text.trim();
        if (trimmedText === "") return;

        try {
            await updateDoc(doc(db, "chats", selectedChat.chatId), {
                messages: arrayUnion({
                    senderId: currentUser.uid,
                    text: trimmedText,
                    createdAt: new Date(),
                    isRead: false,
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
            scrollToBottom();
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };

    const scrollToBottom = () => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
        setIsScrolledToBottom(true);
    };

    const handleReadMessage = (message) => {
        if (!message.isRead && message.senderId !== currentUser.uid) {
            updateDoc(doc(db, "chats", selectedChat.chatId), {
                messages: chat.messages.map((msg) =>
                    msg === message ? { ...msg, isRead: true } : msg
                ),
            });
        }
    };

    return (
        <div className={`chat-container ${isDetailVisible ? "detail-visible" : ""}`}>
            {window.innerWidth < 1400 && (
                <div className="floating-avatar" onClick={toggleSidebar}>
                    <i className="fa fa-bars"></i>
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
                <div className="center" ref={centerRef}>
                    {chat?.messages?.map((message) => (
                        <div 
                            className={`message ${message.senderId === currentUser?.uid ? "own" : ""} ${!message.isRead && message.senderId !== currentUser?.uid ? "unread" : ""}`} 
                            key={message?.createdAt}
                            onMouseEnter={() => handleReadMessage(message)}
                        >
                            <div className="texts">
                                <p>{message.text}</p>
                                <span>{new Date(message.createdAt.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                        </div>
                    ))}
                    <div ref={endRef}></div>
                </div>
                <div className="bottom">
                    <div className="icons">
                        <i className="fa-light fa-microphone"></i>
                    </div>
                    <div className="emoji" ref={emojiPickerRef}>
                        <i className="fa-light fa-icons" onClick={() => setOpen((prev) => !prev)}></i>
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
                        onKeyDown={handleKeyDown}
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
                <div className={`scrollButton ${!isScrolledToBottom ? 'visible' : ''}`} onClick={scrollToBottom}>
                    <i className="fa fa-arrow-down"></i>
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
