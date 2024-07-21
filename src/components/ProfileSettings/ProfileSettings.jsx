import React, { useState, useEffect } from 'react';
import './ProfileSettings.css';
import { useUserStore } from '../LoginRegister/userStore';
import { upload } from '../LoginRegister/upload';
import { doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../LoginRegister/firebase';
import { deleteUser } from 'firebase/auth';

const ProfileSettings = () => {
  const { user, setUser } = useUserStore(state => ({ user: state.currentUser, setUser: state.setUser }));
  const [editingField, setEditingField] = useState(null);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    bio: user?.bio || '',
    genres: user?.genres?.join(', ') || '',
    avatar: user?.avatar || '',
  });
  const [loadingSave, setLoadingSave] = useState(false); // Loading state for saving changes
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [file, setFile] = useState(null);

  useEffect(() => {
    setFormData({
      username: user?.username || '',
      email: user?.email || '',
      bio: user?.bio || '',
      genres: user?.genres?.join(', ') || '',
      avatar: user?.avatar || '',
    });
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEdit = (field) => {
    setEditingField(field);
    if (field === 'avatar') {
      document.getElementById('fileInput').click();
    }
  };

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      try {
        setFile(selectedFile);
        const downloadURL = await upload(selectedFile, user.id);
        setFormData({ ...formData, avatar: downloadURL });
      } catch (error) {
        console.error("Error uploading file: ", error);
        alert("Failed to upload new avatar.");
      }
    }
  };

  const handleSave = async () => {
    setLoadingSave(true);
    try {
      const userDocRef = doc(db, "users", user.id);
      await setDoc(userDocRef, {
        ...formData,
        genres: formData.genres.split(',').map(genre => genre.trim())
      }, { merge: true });
      const updatedUserDoc = await getDoc(userDocRef);
      setUser(updatedUserDoc.data());
      setEditingField(null);
      alert('Changes saved successfully!');
    } catch (error) {
      alert(`Error saving changes: ${error.message}`);
    } finally {
      setLoadingSave(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");
    if (confirmed) {
      setLoadingDelete(true);
      try {
        await deleteDoc(doc(db, "users", user.id));
        await deleteUser(auth.currentUser);
        setUser(null);
        alert('Account deleted successfully!');
      } catch (error) {
        alert(`Error deleting account: ${error.message}`);
      } finally {
        setLoadingDelete(false);
      }
    }
  };

  const handleCopyUserId = () => {
    navigator.clipboard.writeText(user.userid);
    alert('UserID copied to clipboard!');
  };

  return (
    <div className="profile-page">
      <h1>User Profile</h1>
      <div className="profile-content">
        <div className="profile-field">
          <img src={formData.avatar} alt="Avatar" className="avatar" />
          <input type="file" id="fileInput" style={{ display: 'none' }} onChange={handleFileChange} />
          {editingField === 'avatar' ? (
            <input type="file" onChange={handleFileChange} />
          ) : (
            <button title="Edit Avatar" onClick={() => handleEdit('avatar')}><i class="fa-solid fa-pen-to-square"></i></button>
            
          )}
        </div>
        <div className="profile-field">
          <label>Username: </label>
          {editingField === 'username' ? (
            <input name="username" value={formData.username} onChange={handleChange} />
          ) : (
            <span>{formData.username}</span>
          )}
          <button title="Edit Username" onClick={() => handleEdit('username')}><i class="fa-solid fa-pen-to-square"></i></button>
        </div>
        <div className="profile-field">
          <label>Email: </label>
          {editingField === 'email' ? (
            <input name="email" value={formData.email} onChange={handleChange} />
          ) : (
            <span>{formData.email}</span>
          )}
          <button title="Edit Email ID" onClick={() => handleEdit('email')}><i class="fa-solid fa-pen-to-square"></i></button>
        </div>
        <div className="profile-field">
          <label>UserID: </label>
          <span>{user.userid}</span>
          <button title="Copy User ID to Clipboard" onClick={handleCopyUserId}><i class="fa-solid fa-copy"></i></button>
        </div>
        <div className="profile-field">
          <label>Bio: </label>
          {editingField === 'bio' ? (
            <input name="bio" value={formData.bio} onChange={handleChange} />
          ) : (
            <span>{formData.bio}</span>
          )}
          <button title="Edit Bio" onClick={() => handleEdit('bio')}><i class="fa-solid fa-pen-to-square"></i></button>
        </div>
        <div className="profile-field">
          <label>Favourite Genres: </label>
          {editingField === 'genres' ? (
            <input name="genres" value={formData.genres} onChange={handleChange} />
          ) : (
            <span>{formData.genres}</span>
          )}
          <button title="Edit your favourite genres" onClick={() => handleEdit('genres')}><i class="fa-solid fa-pen-to-square"></i></button>
        </div>
        {editingField && (
          <button className="edit-save-btn" onClick={handleSave} disabled={loadingSave}>
            {loadingSave ? 'Saving...' : 'Save Changes'}
          </button>
        )}
        <button className="delete-account" onClick={handleDeleteAccount} disabled={loadingDelete}>
          {loadingDelete ? 'Deleting...' : 'Delete Account'}
        </button>
      </div>
    </div>
  );
};

export default ProfileSettings;
