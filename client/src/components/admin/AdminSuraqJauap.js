import React, { useState } from "react";

const AdminSuraqJauap = () => {
    const [questions, setQuestions] = useState([{ text: "", options: ["", "", "", ""], correctOption: null }]);
    const [passage, setPassage] = useState("");

    const handlePassageChange = (e) => {
        setPassage(e.target.value);
    };

    const handleQuestionChange = (index, e) => {
        const newQuestions = [...questions];
        newQuestions[index].text = e.target.value;
        setQuestions(newQuestions);
    };

    const handleOptionChange = (questionIndex, optionIndex, e) => {
        const newQuestions = [...questions];
        newQuestions[questionIndex].options[optionIndex] = e.target.value;
        setQuestions(newQuestions);
    };

    const handleCorrectOptionChange = (questionIndex, optionIndex) => {
        const newQuestions = [...questions];
        newQuestions[questionIndex].correctOption = optionIndex;
        setQuestions(newQuestions);
    };

    const addQuestion = () => {
        setQuestions([...questions, { text: "", options: ["", "", "", ""], correctOption: null }]);
    };

    const deleteQuestion = (index) => {
        const newQuestions = questions.filter((_, questionIndex) => questionIndex !== index);
        setQuestions(newQuestions);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Check if all fields are filled
        if (passage.trim() === "" || questions.some(q => q.text.trim() === "" || q.options.some(o => o.trim() === "") || q.correctOption === null)) {
            alert("All fields are required, and a correct option must be selected for each question!");
            return;
        }

        // Handle form submission logic here, such as sending data to the server
        console.log({ passage, questions });
    };

    return (
        <div>
            <h1>Admin Suraq Jauap</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Passage:</label>
                    <textarea
                        value={passage}
                        onChange={handlePassageChange}
                        rows="4"
                        cols="50"
                        placeholder="Enter the passage here..."
                        required
                    />
                </div>
                {questions.map((question, questionIndex) => (
                    <div key={questionIndex} className="question-block">
                        <label>Question {questionIndex + 1}:</label>
                        <input
                            type="text"
                            value={question.text}
                            onChange={(e) => handleQuestionChange(questionIndex, e)}
                            placeholder={`Enter question ${questionIndex + 1}`}
                            required
                        />
                        <div className="options">
                            {question.options.map((option, optionIndex) => (
                                <div key={optionIndex}>
                                    <label>Option {optionIndex + 1}:</label>
                                    <input
                                        type="text"
                                        value={option}
                                        onChange={(e) => handleOptionChange(questionIndex, optionIndex, e)}
                                        placeholder={`Enter option ${optionIndex + 1}`}
                                        required
                                    />
                                    <input
                                        type="radio"
                                        name={`correctOption-${questionIndex}`}
                                        checked={question.correctOption === optionIndex}
                                        onChange={() => handleCorrectOptionChange(questionIndex, optionIndex)}
                                        required
                                    />
                                </div>
                            ))}
                        </div>
                        <button type="button" className="admin-button delete-button" onClick={() => deleteQuestion(questionIndex)}>Delete Question</button>
                    </div>
                ))}
                <button type="button" className="admin-button" onClick={addQuestion}>Add Question</button>
                <button type="submit" className="admin-button">Submit</button>
            </form>
        </div>
    );
};

export default AdminSuraqJauap;
