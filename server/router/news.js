const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const multer = require('multer');

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/'); // Specify the destination folder for uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Use the original filename for the uploaded file
  }
});

const upload = multer({ storage: storage });

async function getPost(req, res, next) {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Cannot find news' });
    }
    res.post = post;
    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

// Route to get all news
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find();
    res.json({ posts });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route to get news by ID
router.get('/:id', getPost, (req, res) => {
  res.json({ post: res.post });
});

// Route to add news
router.post('/add', upload.single('image'), async (req, res) => {
  const post = new Post({
    title: req.body.title,
    message: req.body.message,
    image: req.file ? req.file.filename : null // Save filename if file was uploaded
  });

  try {
    const newPost = await post.save();
    res.status(201).json(newPost);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Route to edit news
router.post('/edit/:id', upload.single('image'), getPost, async (req, res) => {
  if (req.body.title != null) {
    res.post.title = req.body.title;
  }
  if (req.body.message != null) {
    res.post.message = req.body.message;
  }
  if (req.file != null) {
    res.post.image = req.file.filename; // Assuming multer middleware is used to handle file uploads
  }
  try {
    const updatedPost = await res.post.save();
    res.json(updatedPost);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Route to delete news
router.delete('/:id', async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'News not found' });
    }
    res.json({ message: 'News deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
