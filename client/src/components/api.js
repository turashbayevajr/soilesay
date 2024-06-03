import axios from 'axios';

const BASE_URL = "http://localhost:8000";

// Function to get the token from localStorage
const getToken = () => localStorage.getItem('token');

export const signIn = async (email, password) => {
    try {
        const res = await axios.post(`${BASE_URL}/login`, { email, password });
        console.log(`Response data:`, res.data); // Log response data
        const token = res.data.token;
        if (token) {
            localStorage.setItem('token', token); // Store the token in localStorage
            console.log('Token stored:', localStorage.getItem('token')); // Verify the token is stored correctly
        }
        return res.data;
    } catch (error) {
        console.error("Error signing in:", error);
        throw error;
    }
};

export const signUp = async (username, email, password) => {
    try {
        const res = await axios.post(`${BASE_URL}/signup`, { username, email, password });
        const token = res.data.token;
        if (token) {
            localStorage.setItem('token', token); // Store the token in localStorage
            console.log('Token stored:', localStorage.getItem('token')); // Verify the token is stored correctly
        }
        return res.data;
    } catch (error) {
        console.error("Error signing up:", error);
        throw error;
    }
};

export const updateUserProfile = async (userData) => {
    try {
        const formData = new FormData();
        formData.append('avatar', userData.avatar);
        formData.append('username', userData.username);
        formData.append('email', userData.email);

        const token = getToken(); // Get the token from localStorage
        if (!token) {
            throw new Error('No token found'); // Ensure token is available
        }
        console.log('Using token:', token); // Log the token to check if it's retrieved correctly

        const response = await axios.post(`${BASE_URL}/api/profile/updateProfile`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}` // Include the token in the request headers
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error updating profile:', error.response ? error.response.data : error.message); // Log more detailed error info
        throw error;
    }
};

// Example: Fetch user data with authentication
export const fetchUserData = async () => {
    try {
        const token = getToken(); // Get the token from localStorage
        if (!token) {
            throw new Error('No token found'); // Ensure token is available
        }
        console.log('Using token:', token); // Log the token to check if it's retrieved correctly

        const response = await axios.get(`${BASE_URL}/api/user/data`, {
            headers: {
                'Authorization': `Bearer ${token}` // Include the token in the request headers
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching user data:', error.response ? error.response.data : error.message); // Log more detailed error info
        throw error;
    }
};
