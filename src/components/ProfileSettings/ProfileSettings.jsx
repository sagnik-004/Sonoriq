import React, { useState, useEffect } from 'react';
import './ProfileSettings.css';
import { useUserStore } from '../LoginRegister/userStore';
import { upload } from '../LoginRegister/upload';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../LoginRegister/firebase';

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
  const [loading, setLoading] = useState(false);
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
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      let avatarURL = formData.avatar;
      if (file) {
        avatarURL = await upload(file, user.id);
      }
      const userDocRef = doc(db, "users", user.id);
      await setDoc(userDocRef, {
        ...formData,
        avatar: avatarURL,
        genres: formData.genres.split(',').map(genre => genre.trim())
      }, { merge: true });
      const updatedUserDoc = await getDoc(userDocRef);
      setUser(updatedUserDoc.data());
      setEditingField(null);
      alert('Changes saved successfully!');
    } catch (error) {
      alert(`Error saving changes: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyUserId = () => {
    navigator.clipboard.writeText(user.userid);
    alert('UserID copied to clipboard!');
  };

  return (
    <div className="profile-page">
      <h1>User Profile</h1>
      <div className="profile-field">
        <img src={formData.avatar} alt="Avatar" className="avatar" />
        {editingField === 'avatar' ? (
          <input type="file" onChange={handleFileChange} />
        ) : (
          <button onClick={() => handleEdit('avatar')}>Edit</button>
        )}
      </div>
      <div className="profile-field">
        <label>Username: </label>
        {editingField === 'username' ? (
          <input name="username" value={formData.username} onChange={handleChange} />
        ) : (
          <span>{formData.username}</span>
        )}
        <button onClick={() => handleEdit('username')}>Edit</button>
      </div>
      <div className="profile-field">
        <label>Email: </label>
        {editingField === 'email' ? (
          <input name="email" value={formData.email} onChange={handleChange} />
        ) : (
          <span>{formData.email}</span>
        )}
        <button onClick={() => handleEdit('email')}>Edit</button>
      </div>
      <div className="profile-field">
        <label>UserID: </label>
        <span>{user.userid}</span>
        <button onClick={handleCopyUserId}>Copy</button>
      </div>
      <div className="profile-field">
        <label>Bio: </label>
        {editingField === 'bio' ? (
          <input name="bio" value={formData.bio} onChange={handleChange} />
        ) : (
          <span>{formData.bio}</span>
        )}
        <button onClick={() => handleEdit('bio')}>Edit</button>
      </div>
      <div className="profile-field">
        <label>Favourite Genres: </label>
        {editingField === 'genres' ? (
          <input name="genres" value={formData.genres} onChange={handleChange} />
        ) : (
          <span>{formData.genres}</span>
        )}
        <button onClick={() => handleEdit('genres')}>Edit</button>
      </div>
      {editingField && (
        <button onClick={handleSave} disabled={loading}>
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      )}
    </div>
  );
};

export default ProfileSettings;

import React, { useState, useEffect } from 'react';
import './ProfileSettings.css';
import { useUserStore } from '../LoginRegister/userStore';
import { upload } from '../LoginRegister/upload';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../LoginRegister/firebase';

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
  const [loading, setLoading] = useState(false);
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
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      let avatarURL = formData.avatar;
      if (file) {
        avatarURL = await upload(file, user.id);
      }
      const userDocRef = doc(db, "users", user.id);
      await setDoc(userDocRef, {
        ...formData,
        avatar: avatarURL,
        genres: formData.genres.split(',').map(genre => genre.trim())
      }, { merge: true });
      const updatedUserDoc = await getDoc(userDocRef);
      setUser(updatedUserDoc.data());
      setEditingField(null);
      alert('Changes saved successfully!');
    } catch (error) {
      alert(`Error saving changes: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyUserId = () => {
    navigator.clipboard.writeText(user.userid);
    alert('UserID copied to clipboard!');
  };

  return (
    <div className="profile-page">
      <h1>User Profile</h1>
      <div className="profile-field">
        <img src={formData.avatar} alt="Avatar" className="avatar" />
        {editingField === 'avatar' ? (
          <input type="file" onChange={handleFileChange} />
        ) : (
          <button onClick={() => handleEdit('avatar')}>Edit</button>
        )}
      </div>
      <div className="profile-field">
        <label>Username: </label>
        {editingField === 'username' ? (
          <input name="username" value={formData.username} onChange={handleChange} />
        ) : (
          <span>{formData.username}</span>
        )}
        <button onClick={() => handleEdit('username')}>Edit</button>
      </div>
      <div className="profile-field">
        <label>Email: </label>
        {editingField === 'email' ? (
          <input name="email" value={formData.email} onChange={handleChange} />
        ) : (
          <span>{formData.email}</span>
        )}
        <button onClick={() => handleEdit('email')}>Edit</button>
      </div>
      <div className="profile-field">
        <label>UserID: </label>
        <span>{user.userid}</span>
        <button onClick={handleCopyUserId}>Copy</button>
      </div>
      <div className="profile-field">
        <label>Bio: </label>
        {editingField === 'bio' ? (
          <input name="bio" value={formData.bio} onChange={handleChange} />
        ) : (
          <span>{formData.bio}</span>
        )}
        <button onClick={() => handleEdit('bio')}>Edit</button>
      </div>
      <div className="profile-field">
        <label>Favourite Genres: </label>
        {editingField === 'genres' ? (
          <input name="genres" value={formData.genres} onChange={handleChange} />
        ) : (
          <span>{formData.genres}</span>
        )}
        <button onClick={() => handleEdit('genres')}>Edit</button>
      </div>
      {editingField && (
        <button onClick={handleSave} disabled={loading}>
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      )}
    </div>
  );
};

export default ProfileSettings;
