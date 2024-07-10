import React from "react";

function About() {
  return (
    <div id="about">
      <div className="about">
        <h1>About Sonoriq</h1>
        <p>
          Welcome to Sonoriq – the ultimate music community for melophiles,
          rappers, producers, vocalists, and music enthusiasts. Connect,
          collaborate, and share your passion for music in a vibrant, supportive
          environment.
        </p>
        <h1>Our Mission</h1>
        <p>
          Our mission is to create a dynamic, inclusive space where music lovers
          can:
        </p>
        <ul>
          <li>
            <i class="fa-solid fa-music-note"></i>Connect Creators and Fans
          </li>
          <li>
            <i class="fa-solid fa-music-note"></i>Encourage Collaboration
          </li>
          <li>
            <i class="fa-solid fa-music-note"></i>Foster Learning and Growth
          </li>
        </ul>

        <p id="join-text">
          Join us and elevate your musical journey with Sonoriq. Sign up today
          and start harmonizing with our community!
        </p>
      </div>
      <div className="logo-img">
        <img src="../src/assets/logo.png" alt="logo" />
      </div>
    </div>
  );
}

export default About;
