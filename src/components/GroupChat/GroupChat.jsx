import React, { useEffect, useState, useRef } from 'react';
import "./GroupChat.css";
import { sendMessage, subscribeToMessages } from '../lib/groupChatStore';
import { useUserStore } from '../LoginRegister/userStore';

const GroupChat = ({ selectedGroup }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const { currentUser } = useUserStore((state) => state);
    const chatEndRef = useRef(null);

    useEffect(() => {
        if (selectedGroup) {
            const unsubscribe = subscribeToMessages(selectedGroup.groupId, setMessages);
            return () => unsubscribe();
        }
    }, [selectedGroup]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSendMessage = async () => {
        if (newMessage.trim() && currentUser) {
            await sendMessage(selectedGroup.groupId, newMessage, currentUser.userid, currentUser.username, currentUser.avatarUrl);
            setNewMessage('');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = hours % 12 || 12; // convert 0 to 12 for 12 AM
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
        return `${formattedHours}:${formattedMinutes} ${ampm}`;
    };

    return (
        <div className="gc-GroupChat">
            <div className="gc-groupHeader">
                {selectedGroup && (
                    <>
                        <img src={selectedGroup.avatarUrl} alt="Group Avatar" className="gc-groupAvatar" />
                        <span className="gc-groupName">{selectedGroup.groupName}</span>
                        <input type="text" placeholder="Search in group" className="gc-searchInput" />
                    </>
                )}
            </div>
            <div className="gc-chatMessages">
                {messages.map((msg) => {
                    return (
                        <div key={msg.id} className={`gc-chatMessage ${msg.userId === currentUser?.userid ? 'user' : 'other'}`}>
                            {msg.userId !== currentUser?.userid && (
                                <div className="gc-otherUserInfo">
                                    <img src={msg.avatarUrl || './avatar.jpg'} alt="Other Avatar" className="gc-chatAvatar" />
                                    <span className="gc-otherUsername">{msg.username}</span>
                                </div>
                            )}
                            <div className="gc-message">
                                <div className="gc-messageContent">{msg.message}</div>
                                <div className="gc-timestamp">{formatTimestamp(msg.timestamp)}</div>
                            </div>
                        </div>
                    );
                })}
                <div ref={chatEndRef} />
            </div>
            <div className="gc-chatInputSection">
                <img src="./emoji.svg" alt="Emoji" className="gc-emojiIcon" />
                <input
                    type="text"
                    placeholder="Type a message"
                    className="gc-chatInput"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                />
                <button className="gc-sendButton" onClick={handleSendMessage}>Send</button>
            </div>
        </div>
    );
};

export default GroupChat;
