import './App.css';
import Sidebar from "./components/sidebar/Sidebar";
import Chat from "./components/chat/chat";
import List from "./components/list/list";
import LoginRegister from "../src/components/LoginRegister/LoginRegister";
import { useEffect, useState } from 'react';

function App() {
  const [isScreenSmall, setIsScreenSmall] = useState(false);
  const [text, setText] = useState("");

  useEffect(() => {
    const handleResize = () => {
      setIsScreenSmall(window.innerWidth < 1400);
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="container">
      <Sidebar/>
      {/* <LoginRegister/> */}
      {!isScreenSmall && <List />}
      <div className="chat-container">
        <Chat />
      </div>
    </div>
  );
}

export default App;
