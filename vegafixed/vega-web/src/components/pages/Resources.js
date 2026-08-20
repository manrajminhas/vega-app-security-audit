import { useState, useContext, useEffect } from 'react';
import TextPageLayout from '../templates/TextPageLayout.js';
import { Button, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import { FaFileAlt } from 'react-icons/fa';
import { UserContext } from '../../auth/UserProvider';
import { getFile, downloadFile } from '../../service/AdminPanel';
import { useToast } from '../../context/ToastContext';
const Resources = () => {
  const { user } = useContext(UserContext);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showToast } = useToast();

  const loadFiles = async () => {
    if (!user?.jwt) return;
    setLoading(true);
    setError(null);
    try {
      const filesList = await getFile(user.jwt);
      setFiles(filesList);
    } catch {
      setError('Failed to load resources. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFiles();

  }, [user?.jwt]);

  const handleDownload = async (file) => {
    try {
      setLoading(true);
      var token = localStorage.getItem('jwt');
      let filename = file.name;
      if (file.type === 'application/octet-stream' && !filename.includes('.')) {
        filename += '.txt';
      }

      const fileData = await downloadFile(file.path,token);
      const blob = new Blob([fileData], { type: file.type });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('success', 'Download started');
    } catch {
      showToast('error', 'Failed to download file');
    } finally {
      setLoading(false);
    }
  };

  return (
    <TextPageLayout>
      {loading && (
        <div className="text-center py-5">
          <Spinner animation="border" role="status" />
        </div>
      )}
      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && !error && files.length === 0 && (
        <Alert variant="info" className="text-center">No resources available</Alert>
      )}

      {!loading && !error && files.length > 0 && (
        <Row className="g-3">
          {files.map((file) => (
            <Col key={file.id} md={4} lg={3}>
              <Card className="h-100 resource-card text-center">
                <Card.Body className="d-flex flex-column align-items-center">
                  <FaFileAlt size={40} color="#0d6efd" className="mb-3" />
                  <Card.Title className="h6 mb-3 w-100" title={file.name}>{file.name}</Card.Title>
                  <Button
                    variant="outline-primary"
                    className="w-100"
                    onClick={() => handleDownload(file)}
                  >
                    Download
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </TextPageLayout>
  );
};

export default Resources;
