import React, { useEffect } from "react";

function Hero() {
  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.querySelector(".hero");
      const content = document.getElementById("content");
      const scrollPosition = window.scrollY;

      if (scrollPosition > 100) {
        heroSection.classList.add("hidden");
        content.classList.add("hidden-content");
      } else {
        heroSection.classList.remove("hidden");
        content.classList.remove("hidden-content");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="hero" id="content">
      <h1 id="smaller">WELCOME</h1>
      <h1 id="smaller">TO</h1>
      <h1 id="larger">SONORIQ</h1>
      <p>community to discover, share and talk music</p>
    </div>
  );
}

export default Hero;
