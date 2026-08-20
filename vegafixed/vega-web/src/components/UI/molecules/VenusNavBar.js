import { useContext } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { UserContext } from '../../../auth/UserProvider.js';
import { useHistory } from 'react-router-dom';
import {downloadDefenseAppZip} from '../../../service/DefenseService.js'
import { useToast } from '../../../context/ToastContext';
const VenusNavBar = () => {
  const { user, logout } = useContext(UserContext);
  const history = useHistory();
  const { showToast } = useToast();
  const isLoggedIn = !!(user && user.jwt && user.email && user.role);
  const role = user?.role;
  const token=user?.jwt;
  const handleLogout = () => {
    logout();
    showToast('success', 'Logged out successfully');
    history.push("/");
  };

    const downloadDefenseZip = async () => {
        try {
        const result = await downloadDefenseAppZip(token);
          
        // Create a temporary download link
        const url = window.URL.createObjectURL(result);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "vegaDefenseApp.tar.gz");
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        showToast('success', 'Download started');
        
      } catch (error) {
        console.error("Error downloading Defense App file:", error);
        showToast('error', 'Failed to download Defense App');
      }
    };
  const commonLinks = [
    { path: "/platformInfo", label: "Platform Information" },
    { path: "/news", label: "News & Events" },
    { path: "/leadership", label: "Leadership" },
    { path: "/contactus", label: "Contact us"},
    { path: "/DefenseAppDashboard", label: "Defense Dashboard", roles: ["EMPLOYEE", "USER", "ADMIN"] },
    { label: "Download Defense App", onClick: downloadDefenseZip, roles: ["EMPLOYEE", "USER", "ADMIN"] },
    { path: "/resources", label: "Resources", roles: ["EMPLOYEE", "ADMIN"] },
    { path: "/AdminPanel", label: "Admin", roles: ["ADMIN"] }
  ];

  return (
    <Navbar bg="light" variant="light">
      <Container>
        <Nav className="w-100">
          {
            commonLinks
              .filter(link => !link.roles || (isLoggedIn && link.roles.includes(role)))
              .map(link => (
                link.path ? (
                <Nav.Link key={link.path} href={link.path}>
                  {link.label}
                </Nav.Link>
              ) : (
                <Nav.Link
                  key={link.label}
                  onClick={link.onClick}
                  style={{ cursor: 'pointer' }}
                >
                  {link.label}
                </Nav.Link>
              )
              ))
          }

          <Nav.Item className="ms-auto">
            {isLoggedIn ? (
              <Nav.Link onClick={handleLogout} style={{ cursor: 'pointer' }}>
                Logout
              </Nav.Link>
            ) : (
              <Nav className="d-flex gap-2">
                <Nav.Link href="/Login">Login</Nav.Link>
                <Nav.Link href="/SignUp">Sign Up</Nav.Link>
              </Nav>
            )}
          </Nav.Item>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default VenusNavBar;
