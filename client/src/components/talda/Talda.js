import React, { useState, useEffect } from 'react';
import { Button, Container, Alert } from 'react-bootstrap';
import axios from 'axios';
import './Talda.css'; // Ensure you have this CSS file

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

    useEffect(() => {
        const fetchFirstLevel = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/talda');
                if (Array.isArray(response.data) && response.data.length > 0) {
                    const firstLevelData = response.data[0];
                    setWords(firstLevelData.text.split(' '));
                    setCorrectAnalysis(firstLevelData.analysis || []);
                } else {
                    console.error('Unexpected response structure:', response.data);
                }
            } catch (error) {
                console.error('Error fetching first level:', error);
            }
        };

        fetchFirstLevel();
    }, []);

    const handleWordClick = (index) => {
        if (selectedType) {
            const newUnderlinedWords = [...underlinedWords];
            newUnderlinedWords[index] = selectedType.lineType;
            setUnderlinedWords(newUnderlinedWords);
        }
    };

    const checkAnswers = () => {
        const results = words.map((word, index) => {
            const correctType = correctAnalysis.find(analysis => analysis.word === word)?.type;
            const selectedType = syntacticTypes.find(type => type.lineType === underlinedWords[index])?.type;
            return correctType === selectedType;
        });

        const allCorrect = results.every(result => result);

        if (allCorrect) {
            setFeedbackMessage('Correct!');
        } else {
            setFeedbackMessage('Try again.');
        }
    };

    return (
        <Container>
            <h1 className="sozjumbaq__title title">TALDA</h1>
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
                <Alert variant={feedbackMessage === 'Correct!' ? 'success' : 'danger'} className="mt-4">
                    {feedbackMessage}
                </Alert>
            )}
        </Container>
    );
};

export default Talda;
