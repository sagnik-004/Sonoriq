import React from "react";

function Footer() {
  return (
    <footer className="footer">
      {/* <div className="container"> */}
        <div className="row">
          <div class="footer-col">
            <h4>Sonoriq</h4>
            <ul>
              <li>
                <a href="#about">About</a>
              </li>
              <li>
                <a href="#features">Why sonoriq</a>
              </li>
              <li>
                <a href="https://docs.google.com/forms/d/e/1FAIpQLSd5mEGwG2kWANQJaX87tCRXrsRafa91FIUvq6xS6K-CfsyEnw/viewform">Feedback</a>
              </li>
              
            </ul>
          </div>
          <div class="footer-col">
            <h4>quick links</h4>
            <ul>
              <li>
                <a href="https://mail.google.com/mail/?view=cm&fs=1&to=sonoriq@gmail.com" target="_blank">Mail us</a>
              </li>
              <li>
                <a href="/login">Login</a>
              </li>
              
            </ul>
          </div>
          {/* <div class="footer-col">
            <h4>online shop</h4>
            <ul>
              <li>
                <a href="#">watch</a>
              </li>
              <li>
                <a href="#">bag</a>
              </li>
              <li>
                <a href="#">shoes</a>
              </li>
              <li>
                <a href="#">dress</a>
              </li>
            </ul>
          </div> */}
          <div class="footer-col">
            <h4>follow us</h4>
            <div class="social-links">
              {/* <a href="#">
                <i class="fab fa-facebook-f"></i>
              </a> */}
              <a href="https://x.com/sonoriq" target="_blank">
                <i class="fab fa-twitter"></i>
              </a>
              <a href="https://www.instagram.com/sonoriq/" target="_blank">
                <i class="fab fa-instagram"></i>
              </a>
              <a href="https://www.youtube.com/@Sonoriq" target="_blank">
                <i class="fab fa-youtube"></i>
              </a>
            </div>
          </div>
        </div>
        <p class='creds'>Made with ❤️ by team Sonoriq.</p>
      {/* </div> */}
    </footer>
  );
}

export default Footer;
