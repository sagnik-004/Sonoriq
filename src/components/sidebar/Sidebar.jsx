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
    // Clear authentication tokens and session data
    localStorage.removeItem('authToken'); // Example token name
    sessionStorage.removeItem('authToken'); // Example session token name

    // Navigate to the home page
    setActive('');
    navigate('/', { replace: true });

    // Reload the page to clear the browser history stack
    window.location.href = '/login';
  };

  return (
    <div className="sw-sidebar">
      <button 
        className={`sw-sidebar-btn sw-chat ${active === 'chat' ? 'active' : ''}`} 
        title="Chats" 
        onClick={() => handleNavigation('/chat', 'chat')}
      >
        <i className="fa-solid fa-comments"></i>
      </button>
      <button 
        className={`sw-sidebar-btn sw-feed ${active === 'feed' ? 'active' : ''}`} 
        title="Live Feed" 
        onClick={() => handleNavigation('/feed', 'feed')}
      >
        <i className="fa-solid fa-rss"></i>
      </button>
      <button 
        className={`sw-sidebar-btn sw-playlist ${active === 'playlist' ? 'active' : ''}`} 
        title="Create Playlists"
      >
        <i className="fa-solid fa-list-music"></i>
      </button>
      <button 
        className={`sw-sidebar-btn sw-music ${active === 'music' ? 'active' : ''}`} 
        title="Music" 
        onClick={() => handleNavigation('/music', 'music')}
      >
        <i className="fa-solid fa-user-music"></i>
      </button>
      <button 
        className={`sw-sidebar-btn sw-group ${active === 'group' ? 'active' : ''}`} 
        title="Group"
        onClick={() => handleNavigation('/group', 'group')}
      >
        <i className="fa-solid fa-people-group"></i>
      </button>
      <div className="sw-spacer"></div>
      <button 
        className={`sw-sidebar-btn sw-profile ${active === 'profile' ? 'active' : ''}`} 
        title="User Profile"
        onClick={() => handleNavigation('/profile-settings', 'profile-settings')}
      >
        <i className="fa-solid fa-user"></i>
      </button>
      <button 
        className={`sw-sidebar-btn sw-logout ${active === '' ? 'active' : ''}`} 
        title="Logout" 
        onClick={handleLogout}
      >
        <i className="fa-solid fa-sign-out-alt"></i>
      </button>
    </div>
  );
};

export default Sidebar;
