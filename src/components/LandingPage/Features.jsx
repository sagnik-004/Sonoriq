import React, { useEffect } from 'react';

function Features() {
  useEffect(() => {
    let items = document.querySelectorAll(".slider .item");
    let next = document.getElementById("next");
    let prev = document.getElementById("prev");
    let active = 0;

    function loadShow() {
        let stt = 0;
        items[active].style.transform = `translateX(-50%)`;
        items[active].style.zIndex = 1;
        items[active].style.filter = "none";
        items[active].style.opacity = 1;
        for (var i = active + 1; i < items.length; i++) {
          stt++;
          items[i].style.transform = `translateX(calc(-50% + ${120 * stt}px)) scale(${
            1 - 0.2 * stt
          }) perspective(16px) rotateY(-1deg)`;
          items[i].style.zIndex = -stt;
          items[i].style.filter = "blur(5px)";
          items[i].style.opacity = stt > 2 ? 0 : 0.6;
        }
        stt = 0;
        for (var i = active - 1; i >= 0; i--) {
          stt++;
          items[i].style.transform = `translateX(calc(-50% - ${120 * stt}px)) scale(${
            1 - 0.2 * stt
          }) perspective(16px) rotateY(1deg)`;
          items[i].style.zIndex = -stt;
          items[i].style.filter = "blur(5px)";
          items[i].style.opacity = stt > 2 ? 0 : 0.6;
        }
    }

    loadShow();

    next.onclick = function () {
      active = active + 1 < items.length ? active + 1 : active;
      loadShow();
    };

    prev.onclick = function () {
      active = active - 1 >= 0 ? active - 1 : active;
      loadShow();
    };
  }, []);

  return (
    <div id="features">
      <h1>Why Sonoriq</h1>
      <div className="slider">
        <div className="item">
          <div className="ft-img">
            <img src="/assets/community-icon.gif" alt="community" />
          </div>
          <h2 className="ft">Community</h2>
          <p className="ft-content">Engage in convos about the music you love; share your passion, and explore diverse musical perspectives.</p>
        </div>
        <div className="item">
          <div className="ft-img">
            <img src="/assets/trends-icon.gif" alt="community" />
          </div>
          <h2 className="ft">Trending Live Feed</h2>
          <p className="ft-content">Catch the latest music buzz, read curated articles, and see what’s trending. Stay ahead with fresh updates and the hottest tracks.</p>
        </div>
        <div className="item">
          <div className="ft-img">
            <img src="/assets/music-recs-icon.gif" alt="community" />
          </div>
          <h2 className="ft">Music Recommendations</h2>
          <p className="ft-content">Explore personalized music recommendations based on your unique taste. We'll help find your next favorite track.</p>
        </div>
        <div className="item">
          <div className="ft-img">
            <img src="/assets/playlist-icon.gif" alt="community" />
          </div>
          <h2 className="ft">Playlist Curation</h2>
          <p className="ft-content">Create custom playlists seamlessly using our intuitive tool. Personalize your music journey for every mood and moment.</p>
        </div>
        <div className="item">
          <div className="ft-img">
            <img src="/assets/collab-icon.gif" alt="community" />
          </div>
          <h2 className="ft">Collaboration</h2>
          <p className="ft-content">Engage in collaborative music exploration within our interactive community. Connect, create, and expand musical horizons collectively.</p>
        </div>
        <button id="next"><i className="fa-solid fa-chevron-right"></i></button>
        <button id="prev"><i className="fa-solid fa-chevron-left"></i></button>
      </div>
    </div>
  );
}

export default Features;
