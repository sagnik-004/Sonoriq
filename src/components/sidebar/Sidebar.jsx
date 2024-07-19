// Sidebar.jsx
import React, { useState, useEffect } from 'react';
import './Sidebar.css';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const [active, setActive] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Set the active button based on the current path
    const path = location.pathname.substring(1); // Remove the leading '/'
    setActive(path);
  }, [location]);

  const handleNavigation = (path, name) => {
    setActive(name);
    navigate(path);
  };

  const handleLogout = () => {
    // Logic for logging out (e.g., clearing tokens, etc.)
    setActive('');
    navigate('/');
  };

  return (
    <div className="sidebar">
      <button 
        className={`sidebar-btn chat ${active === 'chat' ? 'active' : ''}`} 
        data-tooltip="Chats" 
        onClick={() => handleNavigation('/chat', 'chat')}
      >
        <i className="fa-solid fa-comments"></i>
      </button>
      <button 
        className={`sidebar-btn feed ${active === 'feed' ? 'active' : ''}`} 
        data-tooltip="Live Feed" 
        onClick={() => handleNavigation('/feed', 'feed')}
      >
        <i className="fa-solid fa-rss"></i>
      </button>
      <button 
        className={`sidebar-btn playlist ${active === 'playlist' ? 'active' : ''}`} 
        data-tooltip="Create Playlists"
      >
        <i className="fa-solid fa-list-music"></i>
      </button>
      <button 
        className={`sidebar-btn music ${active === 'music' ? 'active' : ''}`} 
        data-tooltip="Music" 
        onClick={() => handleNavigation('/music', 'music')}
      >
        <i className="fa-solid fa-user-music"></i>
      </button>
      <button 
        className={`sidebar-btn groups ${active === 'groups' ? 'active' : ''}`} 
        data-tooltip="Group"
        onClick={() => handleNavigation('/group', 'group')}
      >
        <i className="fa-solid fa-people-group"></i>
      </button>
      <div className="spacer"></div>
      <button 
        className={`sidebar-btn profile ${active === 'profile' ? 'active' : ''}`} 
        data-tooltip="User Profile"
      >
        <i className="fa-solid fa-user"></i>
      </button>
      <button 
        className={`sidebar-btn logout ${active === '' ? 'active' : ''}`} 
        data-tooltip="Logout" 
        onClick={handleLogout}
      >
        <i className="fa-solid fa-sign-out-alt"></i>
      </button>
    </div>
  );
};

export default Sidebar;
