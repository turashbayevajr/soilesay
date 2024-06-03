import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { addTalda } from './api';
import { useNavigate } from 'react-router-dom';

const wordTypes = ['Бастауыш', 'Баяндауыш', 'Пысықтауыш', 'Толықтауыш', 'Анықтауыш'];

const AdminTaldaAdd = () => {
    const [numWords, setNumWords] = useState(0);
    const [words, setWords] = useState([]);
    const navigate = useNavigate();

    const handleNumWordsChange = (e) => {
        const value = e.target.value;
        const num = parseInt(value, 10);

        if (value === '') {
            setNumWords(0);
            setWords([]);
        } else if (!isNaN(num) && num > 0) {
            setNumWords(num);
            setWords(Array.from({ length: num }, () => ({ text: '', type: '' })));
        } else {
            setNumWords(0);
            setWords([]);
        }
    };

    const handleWordChange = (index, value) => {
        const newWords = [...words];
        newWords[index].text = value;
        setWords(newWords);
    };

    const handleTypeChange = (index, value) => {
        const newWords = [...words];
        newWords[index].type = value;
        setWords(newWords);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const analysis = words.map(word => ({ word: word.text, type: word.type }));
            const sentence = words.map(word => word.text).join(' ');
            await addTalda({ text: sentence, analysis, level: 1 });
            navigate('/admin/talda');
        } catch (error) {
            console.error('Error adding talda:', error);
        }
    };

    return (
        <Container>
            <h2 className="my-4">Add New Talda</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formNumWords">
                    <Form.Label>Number of Words</Form.Label>
                    <Form.Control
                        type="number"
                        value={numWords === 0 ? '' : numWords}
                        onChange={handleNumWordsChange}
                        min="0"
                        required
                    />
                </Form.Group>
                {Array.from({ length: numWords }).map((_, index) => (
                    <Row key={index} className="mb-3">
                        <Col md={6}>
                            <Form.Control
                                type="text"
                                placeholder={`Word ${index + 1}`}
                                value={words[index]?.text || ''}
                                onChange={(e) => handleWordChange(index, e.target.value)}
                                required
                            />
                        </Col>
                        <Col md={6}>
                            <Form.Control
                                as="select"
                                value={words[index]?.type || ''}
                                onChange={(e) => handleTypeChange(index, e.target.value)}
                                required
                            >
                                <option value="">Select type</option>
                                {wordTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </Form.Control>
                        </Col>
                    </Row>
                ))}
                <Button variant="primary" type="submit">Add Level</Button>
            </Form>
        </Container>
    );
};

export default AdminTaldaAdd;
