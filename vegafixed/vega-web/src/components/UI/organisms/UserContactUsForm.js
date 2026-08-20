import { useState } from 'react';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';

const UserContactUsForm = () => {
  const [submittedData, setSubmittedData] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent page reload

    const form = e.target;
    const name = form.elements[0].value;
    const email = form.elements[1].value;
    const message = form.elements[2].value;

    setSubmittedData({ name, email, message });

    form.reset();
  };

  return (
    <Row>
      <Col className="mx-auto" xs={6}>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>NAME</Form.Label>
            <Form.Control type="text" name="name" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>EMAIL</Form.Label>
            <Form.Control type="text" name="email" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>MESSAGE</Form.Label>
            <Form.Control as="textarea" rows={3} name="message" />
          </Form.Group>
          <Button variant="primary" type="submit">Submit</Button>
        </Form>

		{submittedData && (
			  <Card className="mt-4">
			    <Card.Body>
			      <Card.Title>Submitted Info</Card.Title>
			      <div
			        dangerouslySetInnerHTML={{
			          __html: `
			            <strong>Name:</strong> ${submittedData.name}<br />
			            <strong>Email:</strong> ${submittedData.email}<br />
			            <strong>Message:</strong> ${submittedData.message}
			          `
			        }}
			      />
			    </Card.Body>
			  </Card>
			)}
      </Col>
    </Row>
  );
};

export default UserContactUsForm;
