import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  arrayRemove,
} from "firebase/firestore";
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
          const q = query(
            collection(db, "users"),
            where("userid", "in", group.members)
          );
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
      const groupQuery = query(
        collection(db, "groups"),
        where("groupId", "==", groupIdToRemove)
      );
      const groupSnapshot = await getDocs(groupQuery);

      if (groupSnapshot.empty) {
        console.error("Group not found");
        return;
      }

      const groupDoc = groupSnapshot.docs[0];
      const groupRef = groupDoc.ref;

      await updateDoc(groupRef, {
        members: arrayRemove(userIdToRemove),
      });

      const userQuery = query(
        collection(db, "users"),
        where("userid", "==", userIdToRemove)
      );
      const userSnapshot = await getDocs(userQuery);

      if (userSnapshot.empty) {
        return;
      }

      const userDoc = userSnapshot.docs[0];
      const userRef = userDoc.ref;

      await updateDoc(userRef, {
        groups: arrayRemove(groupIdToRemove),
      });

      setMembers(members.filter((member) => member.userid !== userIdToRemove));
      window.dispatchEvent(
        new CustomEvent("groupLeft", {
          detail: { groupId: groupIdToRemove, userId: userIdToRemove },
        })
      );
    } catch (error) {
      console.error("Error leaving group:", error);
    }
  };

  return (
    <div className="GroupDetails">
      <div className="group-banner-container">
        <img
          src={group.bannerUrl}
          alt="Group Banner"
          className="group-banner"
        />
        <img
          src={group.avatarUrl}
          alt="Group Avatar"
          className="group-avatar"
        />
      </div>
      <div className="group-info">
        <h2>{group.groupName}</h2>
        <p>{group.groupBio}</p>
        <span className="group-id">@{group.groupId}</span>
      </div>
      <h3>Group Members</h3>
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
      <div className="leave-group-container">
        <button onClick={handleLeaveGroup} className="leave-group-btn">
          Leave Group
        </button>
      </div>{" "}
    </div>
  );
};

export default GroupDetails;
