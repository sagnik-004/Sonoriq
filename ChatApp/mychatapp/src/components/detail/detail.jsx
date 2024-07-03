import React from "react";
import "./detail.css";

const Detail = () => {
    return (
        <div className="detail">
            <div className="user">
                <img src="./avatar.jpg" draggable="false" alt="user pfp" />
                <h2 className="username">Swagat Mitra</h2>
                <h3 className="userid">@swaga</h3>
                <p className="bio"></p>
                <div className="genres">
                    <span className="genre">Pop</span>
                    <span className="genre">Classical</span>
                    <span className="genre">Indian</span>
                </div>
                <button className="block-button">Block</button>
            </div>
        </div>
    );
};

export default Detail;