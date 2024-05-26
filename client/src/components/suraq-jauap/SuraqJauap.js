import React, { useState, useEffect } from 'react';

const SuraqJauap = () => {
    const [currentLevel, setCurrentLevel] = useState(1);
    const [titleText, setTitleText] = useState('');
    const [levelText, setLevelText] = useState('');
    const [questions, setQuestions] = useState([]);
    const [userAnswers, setUserAnswers] = useState([]);
    const [showCorrectAnswers, setShowCorrectAnswers] = useState(false);
    const [correctAnswerCount, setCorrectAnswerCount] = useState(0);
    const [answersChecked, setAnswersChecked] = useState(false);

    useEffect(() => {
        const loadQuestions = async () => {
            try {
                const response = await fetch(`./data_suraqJauap/level${currentLevel}.json`);
                if (!response.ok) {
                    throw new Error(`Failed to load questions: ${response.status} ${response.statusText}`);
                }

                const data = await response.json();
                setTitleText(data.titleText);
                setLevelText(data.levelText);
                setQuestions(data.questions);
                setUserAnswers(Array(data.questions.length).fill(null));

                setShowCorrectAnswers(false);
                setCorrectAnswerCount(0);
                setAnswersChecked(false);
            } catch (error) {
                console.error('Error loading questions:', error.message);
            }
        };

        loadQuestions();
    }, [currentLevel]);

    const handleAnswerSelect = (questionIndex, selectedAnswer) => {
        setUserAnswers((prevAnswers) => {
            const newAnswers = [...prevAnswers];
            newAnswers[questionIndex] = selectedAnswer;
            return newAnswers;
        });
    };

    const handleCheckAnswers = () => {
        setShowCorrectAnswers(true);

        // Disable radio buttons after checking
        const radioButtons = document.querySelectorAll('input[type="radio"]');
        radioButtons.forEach((radioButton) => {
            radioButton.disabled = true;
        });

        // Calculate the count of correct answers
        let correctCount = 0;
        questions.forEach((q, index) => {
            if (q.answer === userAnswers[index]) {
                correctCount += 1;
            }
        });
        setCorrectAnswerCount(correctCount);

        // Set answersChecked to true after checking
        setAnswersChecked(true);
    };

    const handleRestart = () => {
        setUserAnswers(Array(questions.length).fill(null));

        // Enable radio buttons after restarting
        const radioButtons = document.querySelectorAll('input[type="radio"]');
        radioButtons.forEach((radioButton) => {
            radioButton.disabled = false;
        });

        setShowCorrectAnswers(false);
        setCorrectAnswerCount(0);
        setAnswersChecked(false);
    };

    const handleNextLevel = () => {
        setCurrentLevel((prevLevel) => prevLevel + 1);
        setAnswersChecked(false);
    };

    return (
        <div className='suraq content__body'>
            <div className='container'>
                <div className='suraq__inner'>
                    <h1 className='suraq__title title'>SURAQ - JAUAP</h1>

                    <div className='suraq-desc'>
                        <h2 className='suraq-desc__title'>{titleText}</h2>
                        <p className='suraq-desc__text'>{levelText}</p>
                    </div>

                    {questions.length === 0 ? (
                        <p>Loading questions...</p>
                    ) : (
                        <div className='questions'>
                            {questions.map((q, index) => (
                                <div key={q.id} className='question'>
                                    <h3 className='question__title'>{q.id + ". " + q.question}</h3>
                                    <ul className='question__list'>
                                        {q.options.map((option, optionIndex) => (
                                            <li key={optionIndex} className='question__item'>
                                                <label
                                                    className={`${
                                                        showCorrectAnswers
                                                            ? q.answer === option
                                                                ? 'correct-answer'
                                                                : userAnswers[index] === option
                                                                    ? 'incorrect-answer'
                                                                    : ''
                                                            : ''
                                                    }`}
                                                >
                                                    <input
                                                        type="radio"
                                                        value={option}
                                                        checked={userAnswers[index] === option}
                                                        onChange={() => handleAnswerSelect(index, option)}
                                                        disabled={showCorrectAnswers}
                                                    />
                                                    {option}
                                                </label>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}

                            {showCorrectAnswers && (
                                <div className='suraq__results'>
                                    <p>Correct Answers: {correctAnswerCount}/{questions.length}</p>
                                </div>
                            )}

                            <div className='questions__activity'>
                                <button onClick={handleCheckAnswers} className='button button_check'>Check</button>

                                {answersChecked && (
                                    <>
                                        <button onClick={handleRestart} className='button button_restart'>Restart</button>
                                        <button onClick={handleNextLevel} className='button button_level'>Next Level</button>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SuraqJauap;
