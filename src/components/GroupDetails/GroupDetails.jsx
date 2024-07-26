import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs, updateDoc, arrayRemove } from "firebase/firestore";
import { db } from "../LoginRegister/firebase";
import "./GroupDetails.css";
import { useUserStore } from "../LoginRegister/userStore";

const GroupDetails = ({ group }) => {
  const [members, setMembers] = useState([]);
  const { currentUser } = useUserStore();

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

  const handleLeaveGroup = async () => {
    if (!currentUser || !group) {
      console.error("Current user or group information is missing");
      return;
    }

    const userIdToRemove = currentUser.userid;
    const groupIdToRemove = group.groupId;

    try {
      // 1. Fetch the group document
      const groupQuery = query(collection(db, "groups"), where("groupId", "==", groupIdToRemove));
      const groupSnapshot = await getDocs(groupQuery);

      if (groupSnapshot.empty) {
        console.error("Group not found");
        return;
      }

      const groupDoc = groupSnapshot.docs[0];
      const groupRef = groupDoc.ref;

      // 2. Remove the user from the group's members array
      await updateDoc(groupRef, {
        members: arrayRemove(userIdToRemove)
      });

      // 3. Fetch the user document
      const userQuery = query(collection(db, "users"), where("userid", "==", userIdToRemove));
      const userSnapshot = await getDocs(userQuery);

      if (userSnapshot.empty) {
        return;
      }

      const userDoc = userSnapshot.docs[0];
      const userRef = userDoc.ref;

      // 4. Remove the group from the user's groups array
      await updateDoc(userRef, {
        groups: arrayRemove(groupIdToRemove)
      });

      // 5. Update the local state
      setMembers(members.filter(member => member.userid !== userIdToRemove));

      // 6. Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent('groupLeft', { detail: { groupId: groupIdToRemove, userId: userIdToRemove } }));

    } catch (error) {
      console.error("Error leaving group:", error);
    }
  };

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
      <button onClick={handleLeaveGroup} className="leave-group-btn">Leave Group</button>
    </div>
  );
};

export default GroupDetails;
