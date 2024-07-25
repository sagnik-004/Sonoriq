import React, { useState } from 'react';
// import ChatGroupButton from './list-miscellaneous/chat-groupbutton';
import Chatlist from './chatlist/chatlist';
import './list.css';
import Userinfo from "./userinfo/userinfo"

const List = () => {
  const [active, setActive] = useState('chats');

  return (
    <div className="list">
        <Userinfo/>
      <Chatlist/>
    </div>
  );
};

export default List;
