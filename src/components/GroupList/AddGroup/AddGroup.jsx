import React, { useState } from "react";
import { createGroup } from "../../lib/groupStore";
import { uploadImage } from "../../LoginRegister/upload";
import "./AddGroup.css";

const AddGroup = ({ onClose }) => {
  const [avatar, setAvatar] = useState(null);
  const [banner, setBanner] = useState(null);
  const [groupName, setGroupName] = useState("");
  const [groupId, setGroupId] = useState("");
  const [groupBio, setGroupBio] = useState("");
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const avatarUrl = await uploadImage(avatar, `avatars/${groupId}`);
    const bannerUrl = await uploadImage(banner, `banners/${groupId}`);
    
    const groupData = {
      groupName,
      groupId,
      groupBio,
      avatarUrl,
      bannerUrl,
    };

    const success = await createGroup(groupData);
    if (success) {
      onClose();
    } else {
      alert("Group ID already exists");
    }
  };

  return (
    <div className="add-group-overlay" onClick={onClose}>
      <div className="add-group-form" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <label>
            Group Avatar:
            <input type="file" onChange={(e) => setAvatar(e.target.files[0])} required />
          </label>
          <label>
            Group Banner:
            <input type="file" onChange={(e) => setBanner(e.target.files[0])} required />
          </label>
          <label>
            Group Name:
            <input type="text" value={groupName} onChange={(e) => setGroupName(e.target.value)} required />
          </label>
          <label>
            Group ID:
            <input type="text" value={groupId} onChange={(e) => setGroupId(e.target.value)} required />
          </label>
          <label>
            Group Bio:
            <textarea value={groupBio} onChange={(e) => setGroupBio(e.target.value)} maxLength="100" required />
          </label>
          <button type="submit">Form Group</button>
        </form>
      </div>
    </div>
  );
};

export default AddGroup;
