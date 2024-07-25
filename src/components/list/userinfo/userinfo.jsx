import React, { useEffect, useState } from 'react';
import "./userinfo.css";
import { useUserStore } from '../../LoginRegister/userStore';
import { doc, getDoc } from "firebase/firestore";
import { db } from '../../LoginRegister/firebase';

function Userinfo() {
    const currentUser = useUserStore(state => state.currentUser);
    const [imageUrl, setImageUrl] = useState('./avatar.png');

    useEffect(() => {
        const fetchImage = async () => {
            if (currentUser) {
                const userDoc = await getDoc(doc(db, "users", currentUser.id));
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setImageUrl(userData.avatar || './avatar.png');
                }
            }
        };

        fetchImage();
    }, [currentUser]);

    return (
        <div className="ch-userinfo">
            <div className="ch-user">
                <img src={imageUrl} draggable="false" alt="User Image" />
                <h2>{currentUser ? currentUser.username : "Your Name"}</h2>
            </div>
            <div className="icons">
                {/* Add your icons here */}
            </div>
        </div>
    );
}

export default Userinfo;
