import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import { getSuraqJauapById, editSuraqJauap } from './api';
import { useNavigate, useParams } from 'react-router-dom';

const AdminSJEdit = () => {
    const [levelText, setLevelText] = useState('');
    const [levelNumber, setLevelNumber] = useState(1);
    const [questions, setQuestions] = useState([{ text: '', options: [{ text: '', isCorrect: false }] }]);
    const [error, setError] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSuraqJauap = async () => {
            try {
                const sj = await getSuraqJauapById(id);
                setLevelText(sj.text);
                setLevelNumber(sj.level);
                setQuestions(sj.questions);
            } catch (error) {
                console.error('Error fetching SuraqJauap:', error);
                setError('Error fetching the level data.');
            }
        };
        fetchSuraqJauap();
    }, [id]);

    const handleQuestionChange = (index, value) => {
        const newQuestions = [...questions];
        newQuestions[index].text = value;
        setQuestions(newQuestions);
    };

    const handleOptionChange = (qIndex, oIndex, value) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].options[oIndex].text = value;
        setQuestions(newQuestions);
    };

    const handleCorrectChange = (qIndex, oIndex, value) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].options[oIndex].isCorrect = value;
        setQuestions(newQuestions);
    };

    const addQuestion = () => {
        setQuestions([...questions, { text: '', options: [{ text: '', isCorrect: false }] }]);
    };

    const addOption = (qIndex) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].options.push({ text: '', isCorrect: false });
        setQuestions(newQuestions);
    };

    const deleteOption = (qIndex, oIndex) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].options.splice(oIndex, 1);
        setQuestions(newQuestions);
    };

    const deleteQuestion = (qIndex) => {
        const newQuestions = [...questions];
        newQuestions.splice(qIndex, 1);
        setQuestions(newQuestions);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Validate questions to ensure each has exactly one correct option
        for (const question of questions) {
            const correctOptions = question.options.filter(option => option.isCorrect);
            if (correctOptions.length !== 1) {
                setError("Each question must have exactly one correct option.");
                return;
            }
        }

        try {
            await editSuraqJauap(id, {
                text: levelText,
                level: levelNumber,
                questions
            });
            navigate('/admin/sj');
        } catch (error) {
            console.error('Error editing SuraqJauap:', error);
            setError('Error editing the level.');
        }
    };

    return (
        <Container>
            <h2 className="my-4">Edit SuraqJauap Level</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formLevelText">
                    <Form.Label>Level Text</Form.Label>
                    <Form.Control
                        type="text"
                        value={levelText}
                        onChange={(e) => setLevelText(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group controlId="formLevelNumber">
                    <Form.Label>Level Number</Form.Label>
                    <Form.Control
                        type="number"
                        value={levelNumber}
                        onChange={(e) => setLevelNumber(parseInt(e.target.value, 10))}
                        required
                    />
                </Form.Group>
                {questions.map((question, qIndex) => (
                    <div key={qIndex} className="mb-4">
                        <Form.Group controlId={`formQuestionText${qIndex}`}>
                            <Form.Label>Question {qIndex + 1}</Form.Label>
                            <Form.Control
                                type="text"
                                value={question.text}
                                onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                                required
                            />
                            <Button variant="danger" onClick={() => deleteQuestion(qIndex)} className="mt-2">
                                Delete Question
                            </Button>
                        </Form.Group>
                        {question.options.map((option, oIndex) => (
                            <Row key={oIndex} className="mb-2">
                                <Col md={8}>
                                    <Form.Control
                                        type="text"
                                        placeholder={`Option ${oIndex + 1}`}
                                        value={option.text}
                                        onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                                        required
                                    />
                                </Col>
                                <Col md={4}>
                                    <Form.Check
                                        type="checkbox"
                                        label="Correct"
                                        checked={option.isCorrect}
                                        onChange={(e) => handleCorrectChange(qIndex, oIndex, e.target.checked)}
                                    />
                                    <Button variant="danger" onClick={() => deleteOption(qIndex, oIndex)} size="sm" className="ml-2">
                                        Delete
                                    </Button>
                                </Col>
                            </Row>
                        ))}
                        <Button variant="secondary" onClick={() => addOption(qIndex)}>Add Option</Button>
                    </div>
                ))}
                <Button variant="secondary" onClick={addQuestion}>Add Question</Button>
                <Button variant="primary" type="submit">Edit Level</Button>
            </Form>
            {error && <Alert variant="danger" className="mt-4">{error}</Alert>}
        </Container>
    );
};

export default AdminSJEdit;
