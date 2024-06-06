import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { updateUserProfile, getUserProfile } from '../api';
import { Container, Form, Button, Row, Col, Image, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Account.css'; // Import the CSS file for styling

const Profile = () => {
    const location = useLocation();
    const { username: initialUsername, email: initialEmail, avatar: initialAvatar } = location.state || {};
    const [username, setUsername] = useState(initialUsername);
    const [email, setEmail] = useState(initialEmail);
    const [avatar, setAvatar] = useState(initialAvatar ? `http://localhost:8000/${initialAvatar}` : './images/Avatar.png');
    const [selectedFile, setSelectedFile] = useState(null);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertVariant, setAlertVariant] = useState('success');
    const [levels, setLevels] = useState({ taldaLevel: 1, SJlevel: 1, maqalLevel: 1 });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userData = await getUserProfile();
                setAvatar(userData.avatar ? `http://localhost:8000/${userData.avatar}` : './images/Avatar.png');
                setUsername(userData.username);
                setEmail(userData.email);
                setLevels({
                    taldaLevel: userData.taldaLevel,
                    SJlevel: userData.SJlevel,
                    maqalLevel: userData.maqalLevel,
                });
            } catch (error) {
                console.error('Error fetching user profile', error);
            }
        };

        fetchUserData();
    }, []);

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
            setAlertMessage('Profile updated successfully!');
            setAlertVariant('success');
        } catch (error) {
            console.error('Error updating profile', error);
            let errorMessage = 'Failed to update profile. Please try again.';
            if (error.response?.data?.msg === 'Error: Images Only!') {
                errorMessage = 'Inappropriate file type. Please upload a JPEG, JPG, PNG, or GIF image.';
            }
            setAlertMessage(errorMessage);
            setAlertVariant('danger');
        }
    };

    return (
        <Container className="profile mt-5">
            <Row className="justify-content-center">
                <Col md={6} className="text-center">
                    <h2 className="profile__title mb-4">My Profile</h2>
                    {alertMessage && (
                        <Alert variant={alertVariant} onClose={() => setAlertMessage('')} dismissible>
                            {alertMessage}
                        </Alert>
                    )}
                    <Image src={avatar} roundedCircle className="profile__avatar mb-3" />
                    <div className="profile__details mb-3">
                        <h3 className="profile__username">Username: {username}</h3>
                        <p className="profile__email">Email: {email}</p>
                        <p className="profile__level">Talda Level: {levels.taldaLevel}</p>
                        <p className="profile__level">Suraq Jauap Level: {levels.SJlevel}</p>
                        <p className="profile__level">Maqal Level: {levels.maqalLevel}</p>
                    </div>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formUsername" className="mb-3">
                            <Form.Control
                                type="text"
                                placeholder="Change Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group controlId="formFile" className="mb-3">
                            <Form.Control
                                type="file"
                                onChange={handleFileChange}
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">Update Profile</Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default Profile;
