// src/components/admin/AdminLayout.jsx
import  { useState } from 'react';
import Accounts from '../pages/admin/AccountsAdmin';
import RolesAdmin from '../pages/admin/RolesAdmin';
import ResourcesAdmin from '../pages/admin/ResourcesAdmin';
import Header from '../UI/organisms/Header';
import Footer from '../UI/organisms/Footer';
import { Container } from 'react-bootstrap';

const AdminLayout = () => {
  const [activeSection, setActiveSection] = useState('accounts');
  const [newAccountsCount, setNewAccountsCount] = useState(0);

  return (
    <Container className="d-flex flex-column min-vh-100">
      <header>
        <Header />
      </header>
      <main className="flex-grow-1 py-5 admin-container">
        <div className="admin container">
          <div className="row mx-0">

            <div className="col-md-3">
              <div className="admin-sidebar card shadow-sm p-3">
                <h4 className="mb-4 f-bold secondary-txt text-uppercase">Admin Panel</h4>
                
                <div className="admin-nav-options">
                  <button
                    className={`admin-nav-btn ${activeSection === 'accounts' ? 'active' : ''}`}
                    onClick={() => setActiveSection('accounts')}
                  >
                    <span className="nav-btn-content">
                      <span>Accounts</span>
                      {newAccountsCount > 0 && (
                        <span className="new-badge">{newAccountsCount} new</span>
                      )}
                    </span>
                  </button>

                  <button
                    className={`admin-nav-btn ${activeSection === 'roles' ? 'active' : ''}`}
                    onClick={() => setActiveSection('roles')}
                  >
                    Roles & Permissions
                  </button>

                  <button
                    className={`admin-nav-btn ${activeSection === 'resources' ? 'active' : ''}`}
                    onClick={() => setActiveSection('resources')}
                  >
                    Resources Upload
                  </button>
                </div>
              </div>
            </div>


            <div className="col-md-9">
              <div className="admin-content card shadow-sm p-4">
                {activeSection === 'accounts' && (
                  <Accounts onNewAccountsCount={setNewAccountsCount} />
                )}
                {activeSection === 'roles' && <RolesAdmin />}
                {activeSection === 'resources' && <ResourcesAdmin />}
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer className="mt-auto">
        <Footer />
      </footer>
    </Container>
  );
};

export default AdminLayout;