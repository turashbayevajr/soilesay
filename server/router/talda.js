const express = require('express');
const Talda = require('../models/Talda');
const checkAdmin = require('../middleware/checkAdmin');

const router = express.Router();

// Create a new Talda entry
router.post('/', checkAdmin, async (req, res) => {
    try {
        const { text, analysis } = req.body;

        // Count the existing entries to determine the next level
        const count = await Talda.countDocuments();
        const level = count + 1;

        const talda = new Talda({ text, analysis, level });
        await talda.save();
        res.status(201).send(talda);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

// Get Talda entries
router.get('/', async (req, res) => {
    try {
        let talda;
        if (req.user && req.user.isAdmin) {
            // Fetch all entries for admin
            talda = await Talda.find();
        } else {
            // Fetch only the first level for regular users
            const singleTalda = await Talda.findOne({ level: 1 });
            talda = singleTalda ? [singleTalda] : [];
        }
        res.status(200).send(talda);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// Get a specific Talda entry by ID
router.get('/:id', async (req, res) => {
    try {
        const talda = await Talda.findById(req.params.id);
        if (!talda) {
            return res.status(404).send({ message: 'Talda not found' });
        }
        res.status(200).send(talda);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// Update a specific Talda entry by ID
router.put('/:id', checkAdmin, async (req, res) => {
    try {
        const { text, analysis, level } = req.body;
        const talda = await Talda.findByIdAndUpdate(
            req.params.id,
            { text, analysis, level },
            { new: true, runValidators: true }
        );
        if (!talda) {
            return res.status(404).send({ message: 'Talda not found' });
        }
        res.status(200).send(talda);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

// Delete a specific Talda entry by ID
router.delete('/:id', checkAdmin, async (req, res) => {
    try {
        const talda = await Talda.findByIdAndDelete(req.params.id);
        if (!talda) {
            return res.status(404).send({ message: 'Talda not found' });
        }
        res.status(200).send({ message: 'Talda deleted successfully' });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

module.exports = router;
