const express = require('express');
const multer = require('multer');
const path = require('path');
const User = require('../models/user');
const authenticateUser = require('../middleware/authenticateUser');
const router = express.Router();

// Set storage engine
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Initialize upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 },
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).single('avatar');

// Check file type
function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}

// Route to handle profile update
router.post('/updateProfile', authenticateUser, (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ msg: err });
        }

        const { username, email } = req.body;
        const avatar = req.file ? `uploads/${req.file.filename}` : req.user.avatar;

        try {
            const user = await User.findById(req.user._id);
            if (!user) {
                return res.status(404).json({ msg: "User not found" });
            }

            user.username = username || user.username;
            user.email = email || user.email;
            if (avatar) user.avatar = avatar;

            await user.save();
            res.json({
                username: user.username,
                email: user.email,
                avatar: user.avatar,
            });
        } catch (error) {
            res.status(500).json({ msg: "An error occurred while updating the profile" });
        }
    });
});

module.exports = router;
