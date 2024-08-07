import React, { useState, useEffect, useRef, useMemo } from "react";
import { fetchUserGroups, joinGroup, getUserGroups } from "../LoginRegister/userStore";
import { auth } from "../LoginRegister/firebase";
import AddGroup from "./AddGroup/AddGroup";
import "./GroupList.css";
import { FaPlus, FaMinus } from "react-icons/fa";

const GroupList = ({ onGroupSelect }) => {
  const [addMode, setAddMode] = useState(false);
  const [groups, setGroups] = useState([]);
  const [joinedGroups, setJoinedGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const searchBoxRef = useRef(null);
  const searchResultsRef = useRef(null);

  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (userId) {
      const fetchData = async () => {
        try {
          setLoading(true);
          const [allGroups, userJoinedGroups] = await Promise.all([
            fetchUserGroups(),
            getUserGroups(userId)
          ]);
          setGroups(allGroups);
          setJoinedGroups(userJoinedGroups);
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [userId]);

  useEffect(() => {
    const handleGroupLeft = (event) => {
      const { groupId } = event.detail;
      setJoinedGroups(prev => prev.filter(id => id !== groupId));
    };

    window.addEventListener('groupLeft', handleGroupLeft);

    return () => {
      window.removeEventListener('groupLeft', handleGroupLeft);
    };
  }, []);

  const sortedGroups = useMemo(() => {
    return [...groups].sort((a, b) => {
      const aTimestamp = a.latestMessage?.timestamp || 0;
      const bTimestamp = b.latestMessage?.timestamp || 0;
      return bTimestamp - aTimestamp;
    });
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
      try {
        await joinGroup(userId, groupId);
        const updatedJoinedGroups = await getUserGroups(userId);
        setJoinedGroups(updatedJoinedGroups);
        window.dispatchEvent(new CustomEvent('groupJoined', { detail: groupId }));
      } catch (error) {
        console.error("Error joining group:", error);
      }
    } else {
      console.error("User not authenticated");
    }
  };

  const handleClickOutside = (e) => {
    if (
      searchBoxRef.current &&
      !searchBoxRef.current.contains(e.target) &&
      searchResultsRef.current &&
      !searchResultsRef.current.contains(e.target)
    ) {
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

  const filteredGroups = useMemo(() => {
    return sortedGroups.filter((group) => {
      const groupName = group.groupName || "";
      const groupId = group.groupId || "";
      return groupName.toLowerCase().includes(searchInput.toLowerCase()) ||
             groupId.toLowerCase().includes(searchInput.toLowerCase());
    });
  }, [sortedGroups, searchInput]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grouplist">
      <div className="gc-search" ref={searchBoxRef}>
        <div className="gc-searchBar">
          <i className="fa-solid fa-magnifying-glass grp-search-icon"></i>
          <input
            type="text"
            placeholder="Search by name or ID"
            value={searchInput}
            onChange={handleSearchInput}
          />
        </div>
        <button className="add grp-add-btn" onClick={() => setAddMode((prev) => !prev)}>
          {addMode ? <FaMinus /> : <FaPlus />}{" "}
        </button>
      </div>
      {searchInput && filteredGroups.length > 0 && (
        <div className="gc-searchResults" ref={searchResultsRef}>
          {filteredGroups.map((group) => (
            <div
              key={group.groupId}
              className={`community ${
                selectedGroup?.groupId === group.groupId ? "selected" : ""
              }`}
              onClick={(e) => {
                if (e.target.tagName !== 'BUTTON') {
                  handleGroupSelect(group);
                }
              }}
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
        {joinedGroups.length === 0 ? (
          <p>You haven't joined any groups yet.</p>
        ) : (
          joinedGroups.map((groupId) => {
            const group = sortedGroups.find(g => g.groupId === groupId);
            return group ? (
              <div
                key={group.groupId}
                className={`community ${
                  selectedGroup?.groupId === group.groupId ? "selected" : ""
                }`}
                onClick={() => handleGroupSelect(group)}
              >
                <img src={group.avatarUrl} alt={group.groupName} />
                <div className="texts">
                  <span>{group.groupName}</span>
                  <span className="timestamp">
                    {group.latestMessage?.timestamp
                      ? new Date(group.latestMessage.timestamp).toLocaleString()
                      : ""}
                  </span>
                </div>
              </div>
            ) : null;
          })
        )}
      </div>
    </div>
  );
};

export default GroupList;
