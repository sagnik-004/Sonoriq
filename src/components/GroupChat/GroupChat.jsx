import React, { useEffect, useState, useRef } from 'react';
import "./GroupChat.css";
import { sendMessage, subscribeToMessages } from '../lib/groupChatStore';
import { useUserStore } from '../LoginRegister/userStore';
import { joinGroup, getUserGroups } from '../LoginRegister/userStore';
import { auth } from "../LoginRegister/firebase";

const GroupChat = ({ selectedGroup }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const { currentUser } = useUserStore((state) => state);
    const chatEndRef = useRef(null);
    const [joinedGroups, setJoinedGroups] = useState([]);
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setUserId(user.uid);
            } else {
                setUserId(null);
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (userId) {
            const fetchJoinedGroups = async () => {
                try {
                    const userJoinedGroups = await getUserGroups(userId);
                    setJoinedGroups(userJoinedGroups);
                } catch (error) {
                    console.error("Error fetching joined groups:", error);
                }
            };
            fetchJoinedGroups();
        }
    }, [userId]);

    useEffect(() => {
        const handleGroupJoined = (event) => {
            const joinedGroupId = event.detail;
            setJoinedGroups(prev => [...prev, joinedGroupId]);
        };

        window.addEventListener('groupJoined', handleGroupJoined);

        return () => {
            window.removeEventListener('groupJoined', handleGroupJoined);
        };
    }, []);

    useEffect(() => {
        const handleGroupLeft = (event) => {
            const { groupId, userId } = event.detail;
            if (selectedGroup && selectedGroup.groupId === groupId && currentUser && currentUser.userid === userId) {
                setJoinedGroups(prev => prev.filter(id => id !== groupId));
            }
        };

        window.addEventListener('groupLeft', handleGroupLeft);

        return () => {
            window.removeEventListener('groupLeft', handleGroupLeft);
        };
    }, [selectedGroup, currentUser]);

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

    const handleJoinGroup = async () => {
        if (userId && selectedGroup) {
            try {
                await joinGroup(userId, selectedGroup.groupId);
                const updatedJoinedGroups = await getUserGroups(userId);
                setJoinedGroups(updatedJoinedGroups);
            } catch (error) {
                console.error("Error joining group:", error);
            }
        } else {
            console.error("User not authenticated or group not selected");
        }
    };

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = hours % 12 || 12;
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
        return `${formattedHours}:${formattedMinutes} ${ampm}`;
    };

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'long' });
        const year = date.getFullYear();
        return `${day} ${month}, ${year}`;
    };

    const groupMessagesByDate = (messages) => {
        const groupedMessages = messages.reduce((acc, message) => {
            const date = formatDate(message.timestamp);
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(message);
            return acc;
        }, {});
        return groupedMessages;
    };

    if (!selectedGroup) {
        return <div className="gc-GroupChat">Please select a group to start chatting.</div>;
    }
    

    const isGroupJoined = joinedGroups.includes(selectedGroup.groupId);
    const groupedMessages = groupMessagesByDate(messages);

    

    return (
        <div className="gc-GroupChat">
            <div className="gc-groupHeader">
                <img src={selectedGroup.avatarUrl} alt="Group Avatar" className="gc-groupAvatar" />
                <span className="gc-groupName">{selectedGroup.groupName}</span>
            </div>
            <div className="gc-chatMessages">
                {Object.keys(groupedMessages).map((date) => (
                    <div key={date}>
                        <div className="gc-dateSeparator">{date}</div>
                        {groupedMessages[date].map((msg) => (
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
                        ))}
                    </div>
                ))}
                <div ref={chatEndRef} />
            </div>
            {isGroupJoined ? (
                <div className="gc-chatInputSection">
                    <i className="fa-light fa-icons gc-emojiIcon"></i>
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
            ) : (
                <div className="gc-chatInputSection">
                    <button className="gc-joinButton" onClick={handleJoinGroup}>Join</button>
                </div>
            )}
        </div>
    );
};

export default GroupChat;
