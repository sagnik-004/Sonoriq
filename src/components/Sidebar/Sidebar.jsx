// Sidebar.jsx
import React from 'react';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <button className="sidebar-btn chat" data-tooltip="Chats">
        <i className="fa-solid fa-comments"></i>
      </button>
      <button className="sidebar-btn feed" data-tooltip="Live Feed">
        <i className="fa-solid fa-rss"></i>
      </button>
      <button className="sidebar-btn playlist" data-tooltip="Create Playlists">
        <i className="fa-solid fa-list-music"></i>
      </button>
      <button className="sidebar-btn groups" data-tooltip="Rooms">
      <i class="fa-solid fa-people-group"></i>
      </button>
      <div className="spacer"></div>
      <button className="sidebar-btn profile" data-tooltip="User Profile">
        <i className="fa-solid fa-user"></i>
      </button>
    </div>
  );
};

export default Sidebar;
