import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';

const DefenseAdminCards = ({ info, stream }) => {
  return (
    <Card className="shadow-sm">
      <Card.Body>
        <Row className="text-center align-items-center">
          <Col xs={3}>
            <span><strong>User Email: </strong></span>
            <span>{info.userEmail || 'N/A'}</span>
          </Col>
          <Col xs={3}>
            <span><strong>User Name: </strong></span>
            <span>{info.userName || 'N/A'}</span>
          </Col>
          <Col xs={2}>
            <span><strong>Environment Name: </strong></span>
            <span>{info.name}</span>
          </Col>
          <Col xs={2} style={{ whiteSpace: 'nowrap' }}>
            <span><strong>IP: </strong></span>
            <span>{info.ip}</span>
          </Col>
          <Col xs={2}>
            <span><strong>Status: </strong></span>
            <span
              style={{
                color:
                  stream.secStatus === 'Attacked'
                    ? 'red':'black',}}>
              {stream.secStatus ?? info.secStatus}
            </span>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default DefenseAdminCards;
