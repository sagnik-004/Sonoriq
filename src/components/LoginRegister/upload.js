import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage, db } from "./firebase"; // Assuming db is your Firestore instance
import { doc, updateDoc } from "firebase/firestore";

const upload = async (file, userId) => {
  const date = new Date();
  const storageRef = ref(storage, `images/${date.getTime()}_${file.name}`);

  const uploadTask = uploadBytesResumable(storageRef, file);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
      },
      (error) => {
        reject("Something went wrong!" + error.code);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          // Update user's image URL in Firestore
          await updateDoc(doc(db, "users", userId), { imageUrl: downloadURL });
          resolve(downloadURL);
        });
      }
    );
  });
};

export default upload;
