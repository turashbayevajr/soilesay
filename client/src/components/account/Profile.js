import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { updateUserProfile } from '../api';

const Profile = () => {
    const location = useLocation();
    const { username: initialUsername, email: initialEmail, avatar: initialAvatar } = location.state || {};
    const [username, setUsername] = useState(initialUsername);
    const [email, setEmail] = useState(initialEmail);
    const [avatar, setAvatar] = useState(initialAvatar ? `http://localhost:8000/${initialAvatar}` : './images/Avatar.png');
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        setAvatar(initialAvatar ? `http://localhost:8000/${initialAvatar}` : './images/Avatar.png');
    }, [initialAvatar]);

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userData = {
            username,
            email,
            avatar: selectedFile,
        };

        try {
            const updatedUser = await updateUserProfile(userData);
            setAvatar(`http://localhost:8000/${updatedUser.avatar}`);
            setUsername(updatedUser.username);
            setEmail(updatedUser.email);
        } catch (error) {
            console.error('Error updating profile', error);
        }
    };

    return (
        <div className="profile">
            <div className="profile__inner">
                <h2 className="profile__title">My Profile</h2>
                <div className="profile__info">
                    <img className="profile__avatar" src={avatar} alt="User Avatar" />
                    <div className="profile__details">
                        <h3 className="profile__username">Username: {username}</h3>
                        <p className="profile__email">Email: {email}</p>
                    </div>
                </div>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Change Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        type="file"
                        onChange={handleFileChange}
                    />
                    <button type="submit">Update Profile</button>
                </form>
            </div>
        </div>
    );
};

export default Profile;
