const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authenticateUser = async (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');
        console.log(`Auth Header: ${authHeader}`); // Log the authorization header
        if (!authHeader) {
            return res.status(401).send({ error: 'No token provided' });
        }

        const token = authHeader.replace('Bearer ', '');
        console.log(`Token: ${token}`); // Log the token
        const decoded = jwt.verify(token, 'qolshatyr'); // Ensure the secret is 'qolshatyr'
        console.log(`Decoded token:`, decoded); // Log decoded token

        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).send({ error: 'Invalid token' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Error verifying token:', error);
        res.status(401).send({ error: 'Invalid token' });
    }
};




module.exports = authenticateUser;
