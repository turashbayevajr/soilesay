const express = require("express");
const SuraqJauap = require("../models/SuraqJauap");

const router = express.Router();

// Route to handle quiz submission
router.post("/admin/suraqjauap", async (req, res) => {
    const { passage, questions } = req.body;

    try {
        const newQuiz = new SuraqJauap({
            passage,
            questions: questions.map((question) => ({
                text: question.text,
                options: question.options.map((option, index) => ({
                    text: option,
                    isCorrect: question.correctOption === index,
                })),
            })),
        });

        await newQuiz.save();
        res.status(201).json({ message: "Quiz created successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Failed to create quiz", error });
    }
});

// Route to fetch all quizzes
router.get("/suraqjauap", async (req, res) => {
    try {
        const quizzes = await SuraqJauap.find();
        res.status(200).json(quizzes);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch quizzes", error });
    }
});

module.exports = router;
