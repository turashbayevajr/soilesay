import React, { useState, useEffect } from 'react';
import { Button, Container, Alert } from 'react-bootstrap';
import { getUserProfile, getTaldaByLevel, updateTaldaLevel, getCompletedTalda } from '../api';
import './Talda.css';

const syntacticTypes = [
    { type: 'Бастауыш', lineType: 'solid' },
    { type: 'Баяндауыш', lineType: 'double' },
    { type: 'Пысықтауыш', lineType: 'dot-dash' },
    { type: 'Толықтауыш', lineType: 'dashed' },
    { type: 'Анықтауыш', lineType: 'wavy' }
];

const Talda = () => {
    const [words, setWords] = useState([]);
    const [selectedType, setSelectedType] = useState(null);
    const [underlinedWords, setUnderlinedWords] = useState([]);
    const [correctAnalysis, setCorrectAnalysis] = useState([]);
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const [taldaLevel, setTaldaLevel] = useState(1);
    const [completedLevels, setCompletedLevels] = useState([]);
    const [currentLevel, setCurrentLevel] = useState(1);
    const [noMoreLevels, setNoMoreLevels] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userData = await getUserProfile();
                setTaldaLevel(userData.taldaLevel);
                setCurrentLevel(userData.taldaLevel);

                const taldaData = await getTaldaByLevel(userData.taldaLevel);
                if (taldaData && taldaData.text) {
                    setWords(taldaData.text.split(' '));
                    setCorrectAnalysis(taldaData.analysis || []);
                } else {
                    setFeedbackMessage('Failed to load talda level');
                }

                const completedData = await getCompletedTalda();
                setCompletedLevels(completedData);
            } catch (error) {
                setFeedbackMessage('Failed to fetch user data');
            }
        };

        fetchUserData();
    }, []);

    const handleWordClick = (index) => {
        if (selectedType) {
            const newUnderlinedWords = [...underlinedWords];
            newUnderlinedWords[index] = selectedType.lineType;
            setUnderlinedWords(newUnderlinedWords);
        }
    };

    const checkAnswers = async () => {
        const results = words.map((word, index) => {
            const correctType = correctAnalysis.find(analysis => analysis.word === word)?.type;
            const selectedType = syntacticTypes.find(type => type.lineType === underlinedWords[index])?.type;
            return correctType === selectedType;
        });

        const allCorrect = results.every(result => result);

        if (allCorrect) {
            setFeedbackMessage('Correct!');
            try {
                const response = await updateTaldaLevel(currentLevel);
                if (response.message === 'No more levels') {
                    setNoMoreLevels(true);
                    setFeedbackMessage('');
                } else if (response.taldaLevel !== taldaLevel) {
                    setTaldaLevel(response.taldaLevel);
                    setCurrentLevel(response.taldaLevel);
                    // Fetch new data for the new level
                    const taldaData = await getTaldaByLevel(response.taldaLevel);
                    if (taldaData && taldaData.text) {
                        setWords(taldaData.text.split(' '));
                        setCorrectAnalysis(taldaData.analysis || []);
                        setUnderlinedWords([]);
                        setNoMoreLevels(false); // New level found, reset no more levels message
                    } else {
                        setNoMoreLevels(true); // No new level found, set no more levels message
                    }
                    // Update completed levels
                    const completedData = await getCompletedTalda();
                    setCompletedLevels(completedData);
                } else {
                    setFeedbackMessage('Correct, try the next level.');
                }
            } catch (error) {
                setFeedbackMessage('Error updating talda level');
            }
        } else {
            setFeedbackMessage('Try again.');
        }
    };

    const handleLevelClick = async (level) => {
        try {
            const taldaData = await getTaldaByLevel(level);
            if (taldaData) {
                setWords(taldaData.text.split(' '));
                setCorrectAnalysis(taldaData.analysis || []);
                setUnderlinedWords([]);
                setFeedbackMessage('');
                setCurrentLevel(level);
                setNoMoreLevels(false); // Reset no more levels message when switching levels
            } else {
                setFeedbackMessage('Failed to load talda level');
            }
        } catch (error) {
            setFeedbackMessage('Failed to load talda level');
        }
    };

    return (
        <Container>
            <h1 className="sozjumbaq__title title">TALDA</h1>
            <p>Current Level: {taldaLevel}</p>
            <div className="mb-4">
                {syntacticTypes.map(st => (
                    <Button
                        key={st.type}
                        variant="outline-primary"
                        className="m-2"
                        onClick={() => setSelectedType(st)}
                    >
                        {st.type}
                    </Button>
                ))}
            </div>
            <div className="sentence">
                {words.map((word, index) => (
                    <span
                        key={index}
                        onClick={() => handleWordClick(index)}
                        className={`word ${underlinedWords[index] || ''}`}
                    >
                        {word}{' '}
                    </span>
                ))}
            </div>
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
                    variant={currentLevel === taldaLevel ? 'primary' : 'outline-secondary'}
                    className="m-2"
                    onClick={() => handleLevelClick(taldaLevel)}
                >
                    Current Level {taldaLevel}
                </Button>
            </div>
        </Container>
    );
};

export default Talda;
