import React, { useState, useEffect } from 'react';
import { Spinner, Alert } from 'react-bootstrap';
import AdminTable from '../../UI/organisms/AdminTable';
import { useToast } from '../../../context/ToastContext';
import { getCurrentUserRoles } from '../../../service/roleService';

var RolesAdmin = function() {
  var rolesState = useState([]);
  var roles = rolesState[0];
  var setRoles = rolesState[1];

  var loadingState = useState(true);
  var loading = loadingState[0];
  var setLoading = loadingState[1];

  var errorState = useState(null);
  var error = errorState[0];
  var setError = errorState[1];

  var toastContext = useToast();
   const { showToast } = useToast();


  var renderId = function(item) {
    return <span className="text-muted">#{item.id}</span>;
  };

  var renderSystemName = function(item) {
    return <code>{item.name}</code>;
  };

  var renderDisplayName = function(item) {
    return <strong>{item.displayName || 'N/A'}</strong>;
  };


  // Columns configuration
  var columns = [
    { key: 'id', header: 'ID', render: renderId },
    { key: 'name', header: 'System Name', render: renderSystemName },
    { key: 'displayName', header: 'Display Name', render: renderDisplayName },
    { key: 'description', header: 'Description'},
  ];

  // Fetch roles on mount
  useEffect(function() {
    var loadRoles = async function() {
      try {
        var token = localStorage.getItem('jwt');
        var rolesData = await getCurrentUserRoles(token);
          const roleDescriptions = {
              ADMIN: "Admin can manage users, change roles, upload files, access the Defense app, and view all deployed application details in real-time.",
              EMPLOYEE: "Employee can access the Resources tab to see files uploaded by Admin and access the Defense app.",
              USER: "Customer can view basic Vega Absolute information pages and access the Defense app."
            };

        for (let i = 0; i < rolesData.length; i++) {
            const role = rolesData[i];
            role.description = roleDescriptions[role.name] || 'No description provided';
          }

        setRoles(rolesData);
        setError(null);
      } catch (err) {
        setError('Failed to load roles. Please try again later.');
        showToast('error', 'Failed to load roles');
      } finally {
        setLoading(false);
      }
    };

    loadRoles();
  }, [showToast]);

  return (
    <div className="roles-admin">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Roles & Permissions</h3>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <AdminTable 
          data={roles}
          columns={columns}
          loading={false}
          error={null}
          hideAddNew={true}
        />
      )}
    </div>
  );
};

export default RolesAdmin;
