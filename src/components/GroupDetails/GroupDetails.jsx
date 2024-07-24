import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../LoginRegister/firebase";
import "./GroupDetails.css";

const GroupDetails = ({ group }) => {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const fetchMembers = async () => {
      if (group && group.members) {
        try {
          const q = query(collection(db, "users"), where("userid", "in", group.members));
          const querySnapshot = await getDocs(q);

          const fetchedMembers = querySnapshot.docs.map((doc) => ({
            ...doc.data(),
            uid: doc.id,
          }));

          setMembers(fetchedMembers);
        } catch (error) {
          console.error("Error fetching group members:", error);
        }
      } else {
        setMembers([]);
      }
    };

    fetchMembers();
  }, [group]);

  return (
    <div className="GroupDetails">
      <h2>Group Members</h2>
      {members.length === 0 ? (
        <p>No members in this group.</p>
      ) : (
        members.map((member) => (
          <div key={member.uid} className="gc-member">
            <img src={member.imageUrl} alt={member.username} />
            <div className="texts">
              <span>{member.username}</span>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default GroupDetails;
