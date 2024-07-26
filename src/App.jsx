import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Header from "../src/components/LandingPage/Header";
import Hero from "../src/components/LandingPage/Hero";
import Features from "../src/components/LandingPage/Features";
import About from "../src/components/LandingPage/About";
import Footer from "../src/components/LandingPage/Footer";
import LoginRegister from "../src/components/LoginRegister/LoginRegister";
// import "../src/index.css"; // Global styles, including landing page styles
import Sidebar from "../src/components/sidebar/Sidebar";
import List from "../src/components/list/list";
import Chat from "../src/components/chat/Chat";
import MusicRecommendations from "./components/MusicRecommendations/MusicRecommendations";
// import "./App.css";
import styled from "styled-components";
import MusicCharts from "./components/TopTracks/TopTracks";
import RecentUpdates from "./components/RecentUpdates/RecentUpdates";
import GroupList from "./components/GroupList/GroupList";
import GroupChat from "./components/GroupChat/GroupChat";
import GroupDetails from "./components/GroupDetails/GroupDetails";
import ProfileSettings from "./components/ProfileSettings/ProfileSettings";
import PlaylistPage from "../src/components/playlist/PlaylistPage";
import SpotifyCallback from "./components/playlist/SpotifyCallback";

const BackgroundVideo = () => (
  <div className="video-wrapper">
    <video autoPlay muted loop id="backgroundVideo">
      <source src="/assets/172-135788286_medium.mp4" type="video/mp4" />
    </video>
  </div>
);

const AppContent = () => {
  const location = useLocation();
  const [selectedGroup, setSelectedGroup] = useState(null);

  React.useEffect(() => {
    if (location.pathname === "/login") {
      import("../src/components/LoginRegister/LoginRegister.css");
    }
  }, [location.pathname]);

  React.useEffect(() => {
    if (location.pathname === "/chat") {
      import("./App.css");
    }
  }, [location.pathname]);

  React.useEffect(() => {
    if (location.pathname === "/music") {
      import("../src/components/MusicRecommendations/MusicRecommendations.css");
    }
  }, [location.pathname]);

  React.useEffect(() => {
    if (location.pathname === "/feed") {
      import("./AppStyles.css");
    }
  }, [location.pathname]);

  React.useEffect(() => {
    if (location.pathname === "/group") {
      import("./AppStyles.css");
    }
  }, [location.pathname]);

  React.useEffect(() => {
    if (location.pathname === "/playlist") {
      import("../src/components/playlist/PlaylistPage.css");
    }
  }, [location.pathname]);

  return (
    <>
      {location.pathname === "/" && <BackgroundVideo />}
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Header />
              <Hero />
              <Features />
              <About />
              <Footer />
            </>
          }
        />
        <Route path="/login" element={<LoginRegister />} />
        <Route path="/music" element={<MusicRecommendations />} />
        <Route path="/callback" element={<SpotifyCallback />} />
        <Route
          path="/chat"
          element={
            <>
              <div className="container">
                <Sidebar />

                <List />
                <div className="chat-container">
                  <Chat />
                </div>
              </div>
            </>
          }
        />
        <Route
          path="/group"
          element={
            <>
              <Sidebar />
              <div className="groupContainer">
                <GroupList onGroupSelect={setSelectedGroup} />
                <GroupChat selectedGroup={selectedGroup} />
                {selectedGroup && <GroupDetails group={selectedGroup} />}
              </div>
            </>
          }
        />
        <Route
          path="/feed"
          element={
            <>
              <Sidebar />
              <div className="app">
                <div className="left-panel">
                  <RecentUpdates />
                </div>
                <div className="right-panel">
                  <MusicCharts />
                </div>
              </div>
            </>
          }
        />
        <Route
          path="/profile-settings"
          element={
            <>
              <Sidebar />
              <ProfileSettings />
            </>
          }
        />
        <Route path="/playlist" element={<><PlaylistPage />
          <Sidebar /></>} />
      </Routes>
    </>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
