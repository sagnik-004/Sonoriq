import React from "react";

function Header() {
  return (
    <div className="header">
      <div className="logo">
        <img src="/assets/logo.png" alt="logo" />
      </div>
      <nav id="navbar">
        <ul>
          <li>
            <a href="#about">About</a>
          </li>
          <li>
            <a href="#features">Features</a>
          </li>
          <li>
            <a href="#">Login</a>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Header;
