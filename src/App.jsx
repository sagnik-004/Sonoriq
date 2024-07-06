import React from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import Header from "../src/components/LandingPage/Header";
import Hero from "../src/components/LandingPage/Hero";
import Features from "../src/components/LandingPage/Features";
import About from "../src/components/LandingPage/About";
import Footer from "../src/components/LandingPage/Footer";
import LoginRegister from "../src/components/LoginRegister/LoginRegister";
import "../src/index.css"; // Global styles, including landing page styles
import Sidebar from "../src/components/sidebar/Sidebar";
import List from "../src/components/list/list";
import Chat from "../src/components/chat/Chat";

const BackgroundVideo = () => (
  <div className="video-wrapper">
    <video autoPlay muted loop id="backgroundVideo">
      <source src="../src/assets/172-135788286_medium.mp4" type="video/mp4" />
    </video>
  </div>
);

const AppContent = () => {
  const location = useLocation();

  React.useEffect(() => {
    if (location.pathname === "/login") {
      import("../src/components/LoginRegister/LoginRegister.css");
    }
  }, [location.pathname]);

  return (
    <>
      {location.pathname === '/' && <BackgroundVideo />}
      <Routes>
        <Route path="/" element={<>
          <Header />
          <Hero />
          <Features />
          <About />
          <Footer />
        </>} />
        <Route path="/login" element={<LoginRegister />} />
        <Route path="/chat" element={<>
          <div className="container">
            <Sidebar />
            {/* <LoginRegister/> */}
            <List />
            <div className="chat-container">
              <Chat />
            </div>
          </div>

        </>} />
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
