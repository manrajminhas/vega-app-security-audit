import Header from '../UI/organisms/Header';
import Footer from '../UI/organisms/Footer';
import { Container } from 'react-bootstrap';

const SignUpLayout = ({ children }) => {
  return (
    <Container className="d-flex flex-column min-vh-100">
        <Header />
      <main className="flex-grow-1 py-5">
        {children}
      </main>
        <Footer />
    </Container>
  );
};

export default SignUpLayout;