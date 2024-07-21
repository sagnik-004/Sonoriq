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
  const querySnapshot = await getDocs(collection(db, "groups"));
  return querySnapshot.docs.map(doc => doc.data());
};
