import React, { useState, useEffect, useRef } from "react";
import { fetchUserGroups, joinGroup, getUserGroups } from "../LoginRegister/userStore";
import { auth } from "../LoginRegister/firebase"; 
import AddGroup from "./AddGroup/AddGroup";
import "./GroupList.css";

const GroupList = ({ onGroupSelect }) => {
  const [addMode, setAddMode] = useState(false);
  const [groups, setGroups] = useState([]);
  const [joinedGroups, setJoinedGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const searchBoxRef = useRef(null);

  const [userId, setUserId] = useState(null); 

  useEffect(() => {
    const fetchUserId = () => {
      const user = auth.currentUser;
      if (user) {
        setUserId(user.uid);
      }
    };

    fetchUserId();
    // Optional: Add a listener for authentication state changes
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchGroups = async () => {
      const allGroups = await fetchUserGroups();
      setGroups(allGroups);
    };
    fetchGroups();
  }, []);

  useEffect(() => {
    if (userId) {
      const fetchJoinedGroups = async () => {
        const userJoinedGroups = await getUserGroups(userId);
        setJoinedGroups(userJoinedGroups);
      };
      fetchJoinedGroups();
    }
  }, [userId]);

  useEffect(() => {
    if (groups.length > 0) {
      const sortedGroups = [...groups].sort((a, b) => {
        const aTimestamp = a.latestMessage?.timestamp || 0;
        const bTimestamp = b.latestMessage?.timestamp || 0;
        return bTimestamp - aTimestamp;
      });
      setGroups(sortedGroups);
    }
  }, [groups]);

  const handleGroupSelect = (group) => {
    setSelectedGroup(group);
    onGroupSelect(group);
  };

  const handleSearchInput = (e) => {
    setSearchInput(e.target.value);
  };

  const handleJoinGroup = async (groupId) => {
    if (userId) {
      await joinGroup(userId, groupId);
      const updatedJoinedGroups = await getUserGroups(userId);
      setJoinedGroups(updatedJoinedGroups);
    } else {
      console.error("User not authenticated");
    }
  };

  const handleClickOutside = (e) => {
    if (searchBoxRef.current && !searchBoxRef.current.contains(e.target)) {
      setSearchInput("");
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const highlightMatch = (text, highlight) => {
    const parts = text.split(new RegExp(`(${highlight})`, "gi"));
    return (
      <span>
        {parts.map((part, index) =>
          part.toLowerCase() === highlight.toLowerCase() ? (
            <mark key={index}>{part}</mark>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  const filteredGroups = groups.filter(
    (group) =>
      group.groupName.toLowerCase().includes(searchInput.toLowerCase()) ||
      group.groupId.toLowerCase().includes(searchInput.toLowerCase())
  );

  return (
    <div className="grouplist">
      <div className="gc-search" ref={searchBoxRef}>
        <div className="gc-searchBar">
          <img src="./search.svg" alt="search" />
          <input
            type="text"
            placeholder="Search by name or ID"
            value={searchInput}
            onChange={handleSearchInput}
          />
        </div>
        <img
          src={addMode ? "./minus.svg" : "./plus.svg"}
          className="gc-add"
          onClick={() => setAddMode((prev) => !prev)}
        />
      </div>
      {searchInput && filteredGroups.length > 0 && (
        <div className="gc-searchResults">
          {filteredGroups.map((group) => (
            <div
              key={group.groupId}
              className={`groups ${
                selectedGroup?.groupId === group.groupId ? "selected" : ""
              }`}
              onClick={() => handleGroupSelect(group)}
            >
              <img src={group.avatarUrl} alt={group.groupName} />
              <div className="texts">
                <span>{highlightMatch(group.groupName, searchInput)}</span>
                <p>{group.latestMessage?.text || "No messages yet"}</p>
                <span className="timestamp">
                  {group.latestMessage?.timestamp
                    ? new Date(group.latestMessage.timestamp).toLocaleString()
                    : ""}
                </span>
              </div>
              {!joinedGroups.includes(group.groupId) && (
                <button className="join-btn" onClick={(e) => { e.stopPropagation(); handleJoinGroup(group.groupId); }}>Join</button>
              )}
            </div>
          ))}
        </div>
      )}
      {addMode && <AddGroup onClose={() => setAddMode(false)} />}
      <div className="joinedGroups">
        <h2>Joined Groups</h2>
        {joinedGroups.map((groupId) => {
          const group = groups.find(g => g.groupId === groupId);
          return group && (
            <div
              key={group.groupId}
              className={`groups ${
                selectedGroup?.groupId === group.groupId ? "selected" : ""
              }`}
              onClick={() => handleGroupSelect(group)}
            >
              <img src={group.avatarUrl} alt={group.groupName} />
              <div className="texts">
                <span>{group.groupName}</span>
                <p>{group.latestMessage?.text || "No messages yet"}</p>
                <span className="timestamp">
                  {group.latestMessage?.timestamp
                    ? new Date(group.latestMessage.timestamp).toLocaleString()
                    : ""}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GroupList;
