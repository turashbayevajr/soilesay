import React, { useState, useEffect } from 'react';
import { Button, Container, Alert, Form } from 'react-bootstrap';
import { getUserProfile, getSuraqJauapByLevel, updateSuraqJauapLevel, getCompletedSuraqJauap } from '../api';

const SuraqJauap = () => {
    const [levelText, setLevelText] = useState('');
    const [questions, setQuestions] = useState([]);
    const [selectedAnswers, setSelectedAnswers] = useState([]);
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const [SJLevel, setSJLevel] = useState(1);
    const [completedLevels, setCompletedLevels] = useState([]);
    const [currentLevel, setCurrentLevel] = useState(1);
    const [noMoreLevels, setNoMoreLevels] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userData = await getUserProfile();
                setSJLevel(userData.SJlevel);
                setCurrentLevel(userData.SJlevel);

                const suraqJauapData = await getSuraqJauapByLevel(userData.SJlevel);
                if (suraqJauapData && suraqJauapData.text) {
                    setLevelText(suraqJauapData.text);
                    setQuestions(suraqJauapData.questions || []);
                    setSelectedAnswers(new Array(suraqJauapData.questions.length).fill(null));
                } else {
                    setFeedbackMessage('Failed to load SuraqJauap level');
                }

                const completedData = await getCompletedSuraqJauap();
                setCompletedLevels(completedData);
            } catch (error) {
                setFeedbackMessage('Failed to fetch user data');
            }
        };

        fetchUserData();
    }, []);

    const handleAnswerChange = (questionIndex, optionIndex) => {
        const newSelectedAnswers = [...selectedAnswers];
        newSelectedAnswers[questionIndex] = optionIndex;
        setSelectedAnswers(newSelectedAnswers);
    };

    const checkAnswers = async () => {
        const allCorrect = questions.every((question, index) => {
            const correctOptionIndex = question.options.findIndex(option => option.isCorrect);
            return selectedAnswers[index] === correctOptionIndex;
        });

        if (allCorrect) {
            setFeedbackMessage('Correct!');
            try {
                const response = await updateSuraqJauapLevel(currentLevel);
                if (response.message === 'No more levels') {
                    setNoMoreLevels(true);
                    setFeedbackMessage('');
                } else {
                    const nextLevel = response.SJLevel;
                    setSJLevel(nextLevel);
                    setCurrentLevel(nextLevel);

                    const suraqJauapData = await getSuraqJauapByLevel(nextLevel);
                    if (suraqJauapData && suraqJauapData.text) {
                        setLevelText(suraqJauapData.text);
                        setQuestions(suraqJauapData.questions || []);
                        setSelectedAnswers(new Array(suraqJauapData.questions.length).fill(null));
                        setNoMoreLevels(false);
                    } else {
                        setNoMoreLevels(true);
                    }

                    const completedData = await getCompletedSuraqJauap();
                    setCompletedLevels(completedData);
                }
            } catch (error) {
                setFeedbackMessage('Error updating SuraqJauap level');
            }
        } else {
            setFeedbackMessage('Try again.');
        }
    };

    const handleLevelClick = async (level) => {
        try {
            const suraqJauapData = await getSuraqJauapByLevel(level);
            if (suraqJauapData) {
                setLevelText(suraqJauapData.text);
                setQuestions(suraqJauapData.questions || []);
                setSelectedAnswers(new Array(suraqJauapData.questions.length).fill(null));
                setFeedbackMessage('');
                setCurrentLevel(level);
                setNoMoreLevels(false);
            } else {
                setFeedbackMessage('Failed to load SuraqJauap level');
            }
        } catch (error) {
            setFeedbackMessage('Failed to load SuraqJauap level');
        }
    };

    return (
        <Container>
            <h1 className="title">Suraq Jauap</h1>
            <p>Current Level: {SJLevel}</p>
            <div className="level-text mb-4">{levelText}</div>
            {questions.map((question, qIndex) => (
                <div key={qIndex} className="mb-4">
                    <h5> {question.text}</h5>
                    <Form>
                        {question.options.map((option, oIndex) => (
                            <Form.Check
                                type="radio"
                                name={`question-${qIndex}`}
                                key={oIndex}
                                label={option.text}
                                checked={selectedAnswers[qIndex] === oIndex}
                                onChange={() => handleAnswerChange(qIndex, oIndex)}
                            />
                        ))}
                    </Form>
                </div>
            ))}
            <Button variant="success" className="mt-4" onClick={checkAnswers}>Check</Button>
            {feedbackMessage && (
                <Alert variant={feedbackMessage === 'Correct!' || feedbackMessage === 'Correct, try the next level.' ? 'success' : 'danger'} className="mt-4">
                    {feedbackMessage}
                </Alert>
            )}
            {noMoreLevels && (
                <Alert variant="info" className="mt-4">
                    Wow, you've reached the end of our current levels. Congratulations on your achievement. We're grateful for your dedication. We're working on adding new levels, and we'll let you know as soon as they're ready.
                </Alert>
            )}
            <h2 className="mt-4">Levels</h2>
            <div>
                {completedLevels.map(level => (
                    <Button
                        key={level._id}
                        variant={level.level === currentLevel ? 'primary' : 'outline-secondary'}
                        className="m-2"
                        onClick={() => handleLevelClick(level.level)}
                    >
                        Level {level.level}
                    </Button>
                ))}
                <Button
                    variant={currentLevel === SJLevel ? 'primary' : 'outline-secondary'}
                    className="m-2"
                    onClick={() => handleLevelClick(SJLevel)}
                >
                    Current Level {SJLevel}
                </Button>
            </div>
        </Container>
    );
};

export default SuraqJauap;
