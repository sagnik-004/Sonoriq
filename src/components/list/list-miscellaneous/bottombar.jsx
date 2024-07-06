import React, { useState, useRef, useEffect } from "react";
import EmojiPicker from "emoji-picker-react";
import "./bottombar.css";

const Bottombar = ({ text, setText }) => {
    const [open, setOpen] = useState(false);
    const emojiPickerRef = useRef(null);

    const handleEmoji = (e) => {
        console.log("Emoji selected:", e.emoji);
        setText((prev) => prev + e.emoji);
        setOpen(false);
    };

    const handleClickOutside = (event) => {
        if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
            setOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="bottom">
            <div className="icons">
                <img src="./mic.png" alt="Microphone" />
            </div>
            <div className="emoji" ref={emojiPickerRef}>
                <img
                    src="./emoji.png"
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
            <button className="sendButton">Send</button>
        </div>
    );
};

export default Bottombar;
