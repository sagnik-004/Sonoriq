import React from 'react';
import './chat-groupbutton.css';

const ChatGroupButton = ({ active, setActive }) => {
  return (
    <div className="capsule-button">
      <div 
        className={`button-part ${active === 'chats' ? 'active' : ''}`} 
        onClick={() => setActive('chats')}
      >
        Chats
      </div>
      <div 
        className={`button-part ${active === 'groups' ? 'active' : ''}`} 
        onClick={() => setActive('groups')}
      >
        Groups
      </div>
    </div>
  );
};

export default ChatGroupButton;
