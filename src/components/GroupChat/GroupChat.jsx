import React, { useEffect, useState } from 'react';
import "./GroupChat.css";
import { sendMessage, subscribeToMessages } from '../lib/groupChatStore';

const GroupChat = ({ selectedGroup }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        if (selectedGroup) {
            const unsubscribe = subscribeToMessages(selectedGroup.groupId, setMessages);
            return () => unsubscribe();
        }
    }, [selectedGroup]);

    const handleSendMessage = async () => {
        if (newMessage.trim()) {
            await sendMessage(selectedGroup.groupId, newMessage);
            setNewMessage('');
        }
    };

    return (
        <div className="GroupChat">
            <div className="groupHeader">
                {selectedGroup && (
                    <>
                        <img src={selectedGroup.avatarUrl} alt="Group Avatar" className="groupAvatar" />
                        <span className="groupName">{selectedGroup.groupName}</span>
                        <input type="text" placeholder="Search in group" className="searchInput" />
                    </>
                )}
            </div>
            <div className="chatMessages">
                {messages.map((msg) => (
                    <div key={msg.id} className={`chatMessage ${msg.userId === 'CURRENT_USER_ID' ? 'user' : 'other'}`}>
                        {msg.userId !== 'CURRENT_USER_ID' && <img src="./avatar.jpg" alt="Other Avatar" className="chatAvatar" />}
                        <div className="message">
                            {msg.message}
                            <div className="timestamp">{new Date(msg.timestamp).toLocaleString()}</div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="chatInputSection">
                <img src="./emoji.svg" alt="Emoji" className="emojiIcon" />
                <input
                    type="text"
                    placeholder="Type a message"
                    className="chatInput"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                />
                <button className="sendButton" onClick={handleSendMessage}>Send</button>
            </div>
        </div>
    );
};

export default GroupChat;