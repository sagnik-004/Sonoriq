import React from "react";
import "./detail.css";
import { useChatStore } from "../../components/lib/chatStore";

const Detail = () => {
    const { selectedChat } = useChatStore();

    if (!selectedChat) {
        return <div className="empty">Select a user to see details</div>;
    }

    const { user } = selectedChat;

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
                <button className="block-button">Block</button>
            </div>
        </div>
    );
};

export default Detail;
