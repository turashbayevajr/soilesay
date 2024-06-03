import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllTalda, deleteTalda } from './api'; // Adjust the import path if necessary
import { Button, Card, Container, Row, Col } from 'react-bootstrap';

const AdminTalda = () => {
    const [talda, setTalda] = useState([]);

    useEffect(() => {
        const fetchTalda = async () => {
            try {
                const fetchedTalda = await getAllTalda();
                console.log('Fetched talda:', fetchedTalda);
                if (Array.isArray(fetchedTalda)) {
                    setTalda(fetchedTalda);
                } else if (fetchedTalda) {
                    setTalda([fetchedTalda]);
                } else {
                    setTalda([]);
                }
            } catch (error) {
                console.error('Error fetching talda:', error);
                setTalda([]);
            }
        };
        fetchTalda();
    }, []);

    const handleDelete = async (id) => {
        try {
            await deleteTalda(id);
            setTalda(talda.filter(talda => talda._id !== id));
        } catch (error) {
            console.error('Error deleting talda:', error);
        }
    };

    return (
        <Container>
            <h2 className="my-4">Admin Talda</h2>
            <Link to="/admin/talda/add" className="btn btn-primary mb-4">Add Level</Link>
            <Row>
                {Array.isArray(talda) && talda.length > 0 ? (
                    talda.map(talda => (
                        <Col key={talda._id} md={4} className="mb-4">
                            <Card>
                                <Card.Body>
                                    <Card.Title>Level {talda.level}</Card.Title>
                                    <Card.Text>{talda.text}</Card.Text>
                                    <Link to={`/admin/talda/edit/${talda._id}`} className="btn btn-secondary mr-2">Edit</Link>
                                    <Button variant="danger" onClick={() => handleDelete(talda._id)}>Delete</Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                ) : (
                    <p>No talda levels found.</p>
                )}
            </Row>
        </Container>
    );
};

export default AdminTalda;
