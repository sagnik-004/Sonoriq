import React from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Features from "./components/Features";
import About from "./components/About";
import Footer from "./components/Footer";

function App() {
  return (
    <>
      <div className="video-wrapper">
        <video autoPlay muted loop id="backgroundVideo">
          <source src="/assets/172-135788286_medium.mp4" type="video/mp4" />
        </video>
      </div>
      <Header />
      <Hero />
      <Features />
      <About />
      <Footer />
    </>
  );
}

export default App;
