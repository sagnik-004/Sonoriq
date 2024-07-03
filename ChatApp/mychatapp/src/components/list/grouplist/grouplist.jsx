import React, { useState } from 'react';
import './grouplist.css';

const Grouplist = () => {
  const [addMode, setAddMode] = useState(false);
  return (
    <div className="grouplist">
      <div className="search">
        <div className="searchBar">
          <img src="./search.png" alt="search" />
          <input type="text" placeholder="Search" />
        </div>
        <img src={addMode ? "" : ""} className="add" onClick={() => setAddMode((prev) => !prev)} />
      </div>
      {/* Render list items */}
      <div className="item">
        <img src="./avatar.png" alt="" />
        <div className="texts">
          <span>Random Group</span>
          <p>Latest Chat</p>
        </div>
      </div>
      <div className="item">
        <img src="./avatar.png" alt="" />
        <div className="texts">
          <span>Random Group</span>
          <p>Latest Chat</p>
        </div>
      </div>
      <div className="item">
        <img src="./avatar.png" alt="" />
        <div className="texts">
          <span>Random Group</span>
          <p>Latest Chat</p>
        </div>
      </div>
      <div className="item">
        <img src="./avatar.png" alt="" />
        <div className="texts">
          <span>Random Group</span>
          <p>Latest Chat</p>
        </div>
      </div>
      <div className="item">
        <img src="./avatar.png" alt="" />
        <div className="texts">
          <span>Random Group</span>
          <p>Latest Chat</p>
        </div>
      </div>
      <div className="item">
        <img src="./avatar.png" alt="" />
        <div className="texts">
          <span>Random Group</span>
          <p>Latest Chat</p>
        </div>
      </div>
      <div className="item">
        <img src="./avatar.png" alt="" />
        <div className="texts">
          <span>Random Group</span>
          <p>Latest Chat</p>
        </div>
      </div>
      <div className="item">
        <img src="./avatar.png" alt="" />
        <div className="texts">
          <span>Random Group</span>
          <p>Latest Chat</p>
        </div>
      </div>
      <div className="item">
        <img src="./avatar.png" alt="" />
        <div className="texts">
          <span>Random Group</span>
          <p>Latest Chat</p>
        </div>
      </div>
      <div className="item">
        <img src="./avatar.png" alt="" />
        <div className="texts">
          <span>Random Group</span>
          <p>Latest Chat</p>
        </div>
      </div>
      <div className="item">
        <img src="./avatar.png" alt="" />
        <div className="texts">
          <span>Random Group</span>
          <p>Latest Chat</p>
        </div>
      </div>
      <div className="item">
        <img src="./avatar.png" alt="" />
        <div className="texts">
          <span>Random Group</span>
          <p>Latest Chat</p>
        </div>
      </div>
      <div className="item">
        <img src="./avatar.png" alt="" />
        <div className="texts">
          <span>Random Group</span>
          <p>Latest Chat</p>
        </div>
      </div>
      <div className="item">
        <img src="./avatar.png" alt="" />
        <div className="texts">
          <span>Random Group</span>
          <p>Latest Chat</p>
        </div>
      </div>
      <div className="item">
        <img src="./avatar.png" alt="" />
        <div className="texts">
          <span>Random Group</span>
          <p>Latest Chat</p>
        </div>
      </div>
    </div>
  );
};

export default Grouplist;