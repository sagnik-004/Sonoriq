import { useState, useEffect } from "react";
import "./ProfileSettings.css";
import { useUserStore } from "../LoginRegister/userStore";
import { upload } from "../LoginRegister/upload";
import { doc, setDoc, getDoc, deleteDoc } from "firebase/firestore";
import { db, auth } from "../LoginRegister/firebase";
import { deleteUser } from "firebase/auth";

const ProfileSettings = () => {
  const { user, setUser } = useUserStore((state) => ({
    user: state.currentUser,
    setUser: state.setUser,
  }));
  const [editingField, setEditingField] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    bio: "",
    genres: "",
    avatar: "",
  });
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // Initialize form data when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        email: user.email || "",
        bio: user.bio || "",
        genres: user.genres?.join(", ") || "",
        avatar: user.imageUrl || user.avatar || "", // Use imageUrl as primary, avatar as fallback
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (field) => {
    if (field === "avatar") {
      document.getElementById("fileInput").click();
    } else {
      setEditingField(field);
    }
  };

  const validateFile = (file) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      throw new Error(
        "Please select a valid image file (JPEG, PNG, GIF, or WebP)"
      );
    }

    if (file.size > maxSize) {
      throw new Error("File size must be less than 5MB");
    }
  };

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    try {
      // Validate file
      validateFile(selectedFile);

      setUploadingAvatar(true);

      // Show immediate preview
      const previewUrl = URL.createObjectURL(selectedFile);
      setFormData((prev) => ({ ...prev, avatar: previewUrl }));

      // Upload to Firebase
      const downloadURL = await upload(selectedFile, user.id);

      // Update with permanent URL
      setFormData((prev) => ({ ...prev, avatar: downloadURL }));

      // Auto-save the avatar to Firebase with imageUrl field
      const userDocRef = doc(db, "users", user.id);
      await setDoc(userDocRef, { imageUrl: downloadURL }, { merge: true });

      // Update user store
      const updatedUserDoc = await getDoc(userDocRef);
      setUser(updatedUserDoc.data());

      alert("Avatar updated successfully!");

      // Clean up preview URL
      URL.revokeObjectURL(previewUrl);
    } catch (error) {
      console.error("Error uploading file: ", error);
      alert(`Failed to upload avatar: ${error.message}`);

      // Revert to original avatar on error
      setFormData((prev) => ({
        ...prev,
        avatar: user?.imageUrl || user?.avatar || "",
      }));
    } finally {
      setUploadingAvatar(false);
      // Reset file input
      e.target.value = "";
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setLoadingSave(true);
    try {
      const userDocRef = doc(db, "users", user.id);
      const updateData = {
        username: formData.username.trim(),
        email: formData.email.trim(),
        bio: formData.bio.trim(),
        genres: formData.genres
          .split(",")
          .map((genre) => genre.trim())
          .filter((genre) => genre),
        imageUrl: formData.avatar, // Save as imageUrl for consistency
      };

      await setDoc(userDocRef, updateData, { merge: true });
      const updatedUserDoc = await getDoc(userDocRef);
      setUser(updatedUserDoc.data());
      setEditingField(null);
      alert("Changes saved successfully!");
    } catch (error) {
      console.error("Error saving changes:", error);
      alert(`Error saving changes: ${error.message}`);
    } finally {
      setLoadingSave(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );

    if (!confirmed) return;

    setLoadingDelete(true);
    try {
      // Delete user data from Firestore
      await deleteDoc(doc(db, "users", user.id));

      // Delete user authentication
      await deleteUser(auth.currentUser);

      // Clear user store
      setUser(null);

      alert("Account deleted successfully!");
    } catch (error) {
      console.error("Error deleting account:", error);
      alert(`Error deleting account: ${error.message}`);
    } finally {
      setLoadingDelete(false);
    }
  };

  const handleCopyUserId = () => {
    if (user?.userid) {
      navigator.clipboard
        .writeText(user.userid)
        .then(() => alert("UserID copied to clipboard!"))
        .catch(() => alert("Failed to copy UserID"));
    }
  };

  const handleCancel = () => {
    // Reset form data to original values
    setFormData({
      username: user?.username || "",
      email: user?.email || "",
      bio: user?.bio || "",
      genres: user?.genres?.join(", ") || "",
      avatar: user?.imageUrl || user?.avatar || "",
    });
    setEditingField(null);
  };

  if (!user) {
    return (
      <div className="profile-page">
        <div className="loading">Loading user profile...</div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <h1 className="user-profile">User Profile</h1>
      <div className="profile-content">
        {/* Avatar Section */}
        <div className="profile-field">
          <div className="avatar-container">
            <img
              src={formData.avatar || "./avatar.png"}
              alt="Avatar"
              className={`avatar${uploadingAvatar ? " avatar-blur" : ""}`}
            />
            {uploadingAvatar && (
              <div className="upload-overlay">
                <div className="spinner"></div>
                <span>Uploading...</span>
              </div>
            )}
          </div>
          <input
            type="file"
            id="fileInput"
            style={{ display: "none" }}
            onChange={handleFileChange}
            accept="image/*"
            disabled={uploadingAvatar}
          />
          <button
            title="Edit Avatar"
            onClick={() => handleEdit("avatar")}
            disabled={uploadingAvatar}
          >
            <i className="fa-solid fa-pen-to-square"></i>
          </button>
        </div>

        {/* Username Field */}
        <div className="profile-field">
          <label>Username: </label>
          {editingField === "username" ? (
            <input
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter username"
              maxLength={50}
            />
          ) : (
            <span>{formData.username || "Not set"}</span>
          )}
          <button title="Edit Username" onClick={() => handleEdit("username")}>
            <i className="fa-solid fa-pen-to-square"></i>
          </button>
        </div>

        {/* Email Field */}
        <div className="profile-field">
          <label>Email: </label>
          {editingField === "email" ? (
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email address"
            />
          ) : (
            <span>{formData.email || "Not set"}</span>
          )}
          <button title="Edit Email ID" onClick={() => handleEdit("email")}>
            <i className="fa-solid fa-pen-to-square"></i>
          </button>
        </div>

        {/* UserID Field (Read-only) */}
        <div className="profile-field">
          <label>UserID: </label>
          <span>{user.userid || "Not set"}</span>
          <button
            title="Copy User ID to Clipboard"
            onClick={handleCopyUserId}
            disabled={!user.userid}
          >
            <i className="fa-solid fa-copy"></i>
          </button>
        </div>

        {/* Bio Field */}
        <div className="profile-field">
          <label>Bio: </label>
          {editingField === "bio" ? (
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell us about yourself"
              maxLength={200}
              rows={3}
            />
          ) : (
            <span>{formData.bio || "Not set"}</span>
          )}
          <button title="Edit Bio" onClick={() => handleEdit("bio")}>
            <i className="fa-solid fa-pen-to-square"></i>
          </button>
        </div>

        {/* Genres Field */}
        <div className="profile-field">
          <label>Favourite Genres: </label>
          {editingField === "genres" ? (
            <input
              name="genres"
              value={formData.genres}
              onChange={handleChange}
              placeholder="Rock, Pop, Jazz (comma-separated)"
            />
          ) : (
            <span>{formData.genres || "Not set"}</span>
          )}
          <button
            title="Edit your favourite genres"
            onClick={() => handleEdit("genres")}
          >
            <i className="fa-solid fa-pen-to-square"></i>
          </button>
        </div>

        {/* Action Buttons */}
        {editingField && (
          <div className="action-buttons">
            <button
              className="edit-save-btn"
              onClick={handleSave}
              disabled={loadingSave}
            >
              {loadingSave ? "Saving..." : "Save Changes"}
            </button>
            <button
              className="cancel-btn"
              onClick={handleCancel}
              disabled={loadingSave}
            >
              Cancel
            </button>
          </div>
        )}

        {/* Delete Account Button */}
        <button
          className="delete-account"
          onClick={handleDeleteAccount}
          disabled={loadingDelete}
        >
          {loadingDelete ? "Deleting..." : "Delete Account"}
        </button>
      </div>
    </div>
  );
};

export default ProfileSettings;
