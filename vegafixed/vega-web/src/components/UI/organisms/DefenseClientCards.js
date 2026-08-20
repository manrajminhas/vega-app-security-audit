import { Card, Row, Col, Form, Button } from 'react-bootstrap';
import Graph from './Graph';
import PieChart from './PieChart';

const DefenseClientCards = ({
  info,
  stream,
  isStarted,
  selectedIfaces,
  selectedIds,
  resetKeys,
  handleIfaceChange,
  handleIdsChange,
  handleStart,
  handleStop,
  handleUninstall,
}) => {
  const isStartEnabled = selectedIfaces[info.appId] && selectedIds[info.appId] && !isStarted;
  const isStopEnabled = isStarted;
  const second = stream?.timestamp ? stream.timestamp.split(':')[2].split('.')[0] : null;
  return (
    <Col key={info.appId}>
      <Card className="shadow-sm">
        <Card.Body className="position-relative">
          <div
            className="d-flex align-items-center gap-2 position-absolute"
            style={{ top: '15px', right: '15px', zIndex: 10 }}
          >
            <Form.Select
              value={selectedIfaces[info.appId] || ''}
              onChange={(e) => handleIfaceChange(info.appId, e.target.value)}
              disabled={isStopEnabled}
              aria-label="Select iface"
              style={{ minWidth: '130px' }}
            >
              <option value="">Select iface</option>
              {info.iface.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </Form.Select>
            <Form.Select
              value={selectedIds[info.appId] || ''}
              onChange={(e) => handleIdsChange(info.appId, e.target.value)}
              disabled={isStopEnabled}
              aria-label="Select IDS"
              style={{ minWidth: '120px' }}
            >
              <option value="">Select IDS</option>
              {info.ids.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </Form.Select>
            <Button
              variant={isStartEnabled ? 'primary' : 'outline-primary'}
              disabled={!isStartEnabled}
              onClick={() => handleStart(info.appId)}
            >
              Start
            </Button>
            <Button
              variant={isStopEnabled ? 'primary' : 'outline-primary'}
              disabled={!isStopEnabled}
              onClick={() => handleStop(info.appId)}
            >
              Stop
            </Button>
            <Button variant="primary" onClick={() => handleUninstall(info.appId)}>
              Uninstall
            </Button>
          </div>
          <div className="mb-3">
            <div>
              <strong>Environment Name: </strong>
              {info.name}
            </div>
            <div>
              <strong>IP: </strong>
              {info.ip}
            </div>
            <div>
              <strong>Status: </strong>
              <span style={{color:stream.secStatus === 'Attacked'? 'red':'black',}}>
                {stream.secStatus ?? info.secStatus}
              </span>
            </div>
          </div>
          <Row>
            <Col md={4} style={{ height: 300 }}>
              <Graph key={resetKeys[info.appId]} type="variance" metrics={stream.metrics.payloadStats} second={Number(second)}/>
            </Col>
            <Col md={4} style={{ height: 300 }}>
              <Graph key={resetKeys[info.appId]} type="mixed" metrics={stream.metrics.rateStats} second={Number(second)}/>
            </Col>
            <Col md={4} style={{ height: 300 }}>
              <PieChart key={resetKeys[info.appId]} protocols={stream.metrics.protocols} />
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default DefenseClientCards;