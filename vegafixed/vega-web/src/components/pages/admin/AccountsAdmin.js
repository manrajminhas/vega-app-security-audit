import { useState, useEffect } from 'react';
import { fetchUsers, enableAccount, changeAccountRole } from '../../../service/AdminPanel';
import { Spinner, Button, Form } from 'react-bootstrap';
import AdminTable from '../../UI/organisms/AdminTable';
import { useToast } from '../../../context/ToastContext';
import { getCurrentUserRoles } from '../../../service/roleService';

const AccountsAdmin = function(props) {
  var onNewAccountsCount = props.onNewAccountsCount;

  var activeTabState = useState('new');
  var activeTab = activeTabState[0];
  var setActiveTab = activeTabState[1];

  var usersState = useState([]);
  var users = usersState[0];
  var setUsers = usersState[1];

  var loadingState = useState(true);
  var loading = loadingState[0];
  var setLoading = loadingState[1];

  var errorState = useState(null);
  var error = errorState[0];
  var setError = errorState[1];

  var rolesState = useState([]);
  var roles = rolesState[0];
  var setRoles = rolesState[1];

  var toastContext = useToast();
  const { showToast } = useToast();

  // Load users and roles from API
  var loadData = async function() {
    try {
      setLoading(true);
      var token = localStorage.getItem('jwt');
      var usersData = await fetchUsers(token);
      setUsers(usersData);

      var rolesData = await getCurrentUserRoles();
      setRoles(rolesData);

      setError(null);
    } catch (err) {
      setError('Failed to load accounts. Please try again later.');
      showToast('error', 'Failed to load accounts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(function() { loadData(); }, [showToast]);

  // Separate users by tab
  var newAccounts = [];
  var staffAccounts = [];
  var regAccounts = [];
  for (var i = 0; i < users.length; i++) {
    var user = users[i];
    var status = user.status ? user.status.toLowerCase() : '';
    var roleName = (user.role && user.role.name) ? user.role.name.toLowerCase() : '';

    if (status === 'created') {
      newAccounts.push(user);
    } else if (status === 'active' && (roleName === 'employee' || roleName === 'admin')) {
      staffAccounts.push(user);
    } else if (status === 'active' && roleName === 'user') {
      regAccounts.push(user);
    }
  }

  var counts = {
    new: newAccounts.length,
    staff: staffAccounts.length,
    reg: regAccounts.length,
    all: users.length
  };

  useEffect(function() { onNewAccountsCount(counts.new); }, [counts.new, onNewAccountsCount]);

  // Activate user
  var handleActivate = async function(userId) {
    try {
      setLoading(true);
      var token = localStorage.getItem('jwt');
      await enableAccount(userId, token);
      await loadData();
      showToast('success', 'Account activated successfully');
    } catch (err) {
      showToast('error', 'Failed to activate account');
    } finally {
      setLoading(false);
    }
  };

  // Change user role
  var handleRoleChange = async function(userId, roleName) {
    try {
      setLoading(true);
      var token = localStorage.getItem('jwt');
      await changeAccountRole(userId, token, roleName);
      await loadData();
      showToast('success', 'Role updated successfully');
    } catch (err) {
      showToast('error', 'Failed to update role');
    } finally {
      setLoading(false);
    }
  };

  // Columns
  var roleColumn = {
    key: 'role',
    header: 'Role',
    render: function(item) {
      if (activeTab === 'new') {
        var displayText = 'N/A';
        if (item.role && item.role.displayName) displayText = item.role.displayName;
        else if (item.role && item.role.name) displayText = item.role.name;
        return <span className="text-capitalize">{displayText}</span>;
      }

      var options = [];
      if (item.role) {
        options.push(<option key={item.role.id} value={item.role.id}>{item.role.displayName}</option>);
      }

      for (var i = 0; i < roles.length; i++) {
        if (roles[i].name.toUpperCase() !== 'ADMIN' && (!item.role || roles[i].id !== item.role.id)) {
          options.push(<option key={roles[i].name} value={roles[i].name}>{roles[i].displayName}</option>);
        }
      }

      var disabled = !(item.status.toLowerCase() === 'active' && (!item.role || item.role.name !== 'ADMIN'));

      return (
        <Form.Select
          size="sm"
          value={item.role ? item.role.id : ''}
          onChange={function(e) { handleRoleChange(item.id, e.target.value); }}
          disabled={disabled}
        >
          {options}
        </Form.Select>
      );
    }
  };

  var commonColumns = [
    { key: 'email', header: 'Email' },
    { key: 'name', header: 'Name' },
    roleColumn,
    { key: 'status', header: 'Status' }
  ];

  var newAccountColumns = commonColumns.slice();
  newAccountColumns.push({
    key: 'actions',
    header: 'Actions',
    render: function(item) {
      var disabled = item.status === 'active';
      return (
        <div className="d-flex gap-2">
          <Button variant="outline-success" size="sm" onClick={function() { handleActivate(item.id); }} disabled={disabled}>
            Activate
          </Button>
        </div>
      );
    }
  });

  var getTabData = function() {
    if (activeTab === 'new') return newAccounts;
    if (activeTab === 'staff') return staffAccounts;
    if (activeTab === 'reg') return regAccounts;
    if (activeTab === 'all') return users;
    return [];
  };

  var getTabColumns = function() {
    return activeTab === 'new' ? newAccountColumns : commonColumns;
  };

  // Tabs
  var accountTabs = [
    { id: 'new', label: 'New Accounts' },
    { id: 'staff', label: 'Staff Accounts' },
    { id: 'reg', label: 'Reg. Users Accounts' },
    { id: 'all', label: 'All Accounts' }
  ];

  return (
    <div className="accounts-container">
      <div className="mb-3">
        {accountTabs.map(function(tab) {
          return (
            <Button
              key={tab.id}
              style={{ marginRight: '10px' }}
              variant={activeTab === tab.id ? 'primary' : 'outline-secondary'}
              onClick={function() { setActiveTab(tab.id); }}
              className="position-relative"
            >
              {tab.label}
              {counts[tab.id] > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {counts[tab.id]}
                </span>
              )}
            </Button>
          );
        })}
      </div>

      {loading && (
        <div className="text-center py-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      )}

      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && <AdminTable data={getTabData()} columns={getTabColumns()} />}
    </div>
  );
};

export default AccountsAdmin;
