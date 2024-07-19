import { collection, addDoc, query, where, getDocs, updateDoc, doc, getDoc } from "firebase/firestore";
import { db, auth } from "../LoginRegister/firebase";

// Function to create a group
export const createGroup = async (groupData) => {
  const q = query(collection(db, "groups"), where("groupId", "==", groupData.groupId));
  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) {
    await addDoc(collection(db, "groups"), groupData);
    return true;
  } else {
    return false;
  }
};

// Function to fetch user groups
export const fetchUserGroups = async () => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("User not authenticated");
  }

  const userId = user.uid; // Use the authenticated user's ID
  const userDoc = doc(db, "users", userId);
  const userSnapshot = await getDoc(userDoc);

  if (userSnapshot.exists()) {
    const userData = userSnapshot.data();
    if (!userData.groups) {
      await updateDoc(userDoc, { groups: [] });
      return [];
    }
    // Map user groups to ensure all necessary fields are present
    return userData.groups.map((group) => ({
      ...group,
      groupId: group.groupId || "",
      groupName: group.groupName || "",
      avatarUrl: group.avatarUrl || "",
    }));
  }
  return [];
};
