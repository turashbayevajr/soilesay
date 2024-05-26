import React, { useEffect, useState } from "react";

const SuraqJauap = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [answers, setAnswers] = useState({});
    const [results, setResults] = useState([]);
    const [score, setScore] = useState(0);
    const [showResults, setShowResults] = useState(false);

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const response = await fetch("http://localhost:8000/suraqjauap");
                const data = await response.json();
                setQuizzes(data);
            } catch (error) {
                console.error("Failed to fetch quizzes:", error);
            }
        };

        fetchQuizzes();
    }, []);

    const handleAnswerChange = (quizIndex, questionIndex, optionIndex) => {
        setAnswers({
            ...answers,
            [quizIndex]: {
                ...answers[quizIndex],
                [questionIndex]: optionIndex,
            },
        });
    };

    const handleSubmit = (e, quizIndex) => {
        e.preventDefault();
        const userAnswers = answers[quizIndex];
        const quiz = quizzes[quizIndex];
        let correctCount = 0;

        const quizResults = quiz.questions.map((question, questionIndex) => {
            const isCorrect = question.options[userAnswers[questionIndex]].isCorrect;
            if (isCorrect) correctCount += 1;
            return {
                question: question.text,
                isCorrect,
                selectedOption: question.options[userAnswers[questionIndex]].text,
                correctOption: question.options.find(option => option.isCorrect).text,
            };
        });

        setResults(quizResults);
        setScore(correctCount);
        setShowResults(true);
    };

    if (!quizzes.length) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Suraq Jauap Quizzes</h1>
            {quizzes.map((quiz, quizIndex) => (
                <div key={quiz._id} className="quiz-block">
                    <p>{quiz.passage}</p>
                    <form onSubmit={(e) => handleSubmit(e, quizIndex)}>
                        {quiz.questions.map((question, questionIndex) => (
                            <div key={questionIndex} className="question-block">
                                <p>{question.text}</p>
                                <div className="options">
                                    {question.options.map((option, optionIndex) => (
                                        <div key={optionIndex}>
                                            <label>
                                                <input
                                                    type="radio"
                                                    name={`question-${quizIndex}-${questionIndex}`}
                                                    value={optionIndex}
                                                    checked={answers[quizIndex]?.[questionIndex] === optionIndex}
                                                    onChange={() => handleAnswerChange(quizIndex, questionIndex, optionIndex)}
                                                />
                                                {option.text}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                        <button type="submit">Submit</button>
                    </form>
                    {showResults && (
                        <div className="results">
                            <h2>Results</h2>
                            <p>Your Score: {score} out of {quiz.questions.length}</p>
                            {results.map((result, index) => (
                                <div key={index} className="result">
                                    <p>Question: {result.question}</p>
                                    <p>Your Answer: {result.selectedOption}</p>
                                    <p>Correct Answer: {result.correctOption}</p>
                                    <p>{result.isCorrect ? "Correct" : "Incorrect"}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default SuraqJauap;
