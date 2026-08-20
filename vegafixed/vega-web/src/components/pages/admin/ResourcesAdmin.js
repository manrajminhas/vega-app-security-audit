import React, { useState, useRef, useEffect } from 'react';
import { Spinner, Alert, Button, Card, Row, Col } from 'react-bootstrap';
import { useToast } from '../../../context/ToastContext';
import { getFile, createFile, downloadFile } from '../../../service/AdminPanel';
import { FaFileAlt } from "react-icons/fa";


const ResourcesAdmin = function() {
  var resourcesState = useState([]);
  var resources = resourcesState[0];
  var setResources = resourcesState[1];

  var loadingState = useState(true);
  var loading = loadingState[0];
  var setLoading = loadingState[1];

  var uploadingState = useState(false);
  var uploading = uploadingState[0];
  var setUploading = uploadingState[1];

  var errorState = useState(null);
  var error = errorState[0];
  var setError = errorState[1];

  var fileInputRef = useRef(null);

  var toastContext = useToast();
  const { showToast } = useToast();

  // Load resources
  var loadResources = async function() {
    try {
      setLoading(true);
      var token = localStorage.getItem('jwt');
      var resourcesData = await getFile(token);
      setResources(resourcesData);
      setError(null);
    } catch (err) {
      setError('Failed to load resources. Please try again later.');
      showToast('error', 'Failed to load resources');
    } finally {
      setLoading(false);
    }
  };

  useEffect(function() {
    loadResources();
  }, []);

  // Handle file upload
  var handleFileUpload = async function(e) {
    var file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      var token = localStorage.getItem('jwt');
      await createFile(file, token);
      showToast('success', 'File uploaded successfully');
      await loadResources();
    } catch (err) {
      if (err?.code === 415) {
      showToast('error', 'Upload failed: Unsupported Media type (415)');
    } else {
      showToast('error','Failed to upload file');

    }
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }

  };

  // Handle download
  var handleDownload = async function(resource) {
    try {
      setLoading(true);
      var token = localStorage.getItem('jwt');
      var filename = resource.name;
      var fileData = await downloadFile(resource.path, token);
      var blob = new Blob([fileData], { type: resource.type });
      var url = window.URL.createObjectURL(blob);
      var link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('success', 'Download started');
    } catch (err) {
      showToast('error', 'Failed to download file');
    } finally {
      setLoading(false);
    }
  };

  // File icon
  var renderFileIcon = function() {
    return <FaFileAlt color="#0d6efd" />;
  };

  return (
    <div className="resources-admin">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Resources Upload</h3>
      </div>

      {/* Upload Card */}
      <Card className="mb-4">
        <Card.Body className="text-center">
          <h6 className="text-secondary mb-3">Upload New File with Max file size 50 MB</h6>
          <div className="border rounded p-4 bg-light">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              disabled={uploading}
              className="d-none"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="btn btn-primary mb-2">
              {uploading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  Uploading...
                </>
              ) : 'Select File'}
            </label>
            <p className="text-muted small mb-0">
              {uploading ? 'Uploading file...' : 'Click to choose a file'}
            </p>
          </div>
        </Card.Body>
      </Card>

      {/* File Grid */}
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <>
          {resources.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-muted">No resources available</p>
            </div>
          ) : (
            <Row className="g-3">
              {resources.map(function(resource) {
                return (
                  <Col key={resource.id} md={4} lg={3}>
                    <Card className="h-100 resource-card">
                      <Card.Body className="d-flex flex-column align-items-center text-center">
                        <div className="display-4 mb-3">{renderFileIcon()}</div>
                        <Card.Title className="h6 mb-3 text-truncate w-100">
                          {resource.name}
                        </Card.Title>
                        <Button
                          variant="outline-primary"
                          className="w-100"
                          onClick={function() { handleDownload(resource); }}
                        >
                          Download
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          )}
        </>
      )}

    </div>
  );
};

export default ResourcesAdmin;
