import Header from '../UI/organisms/Header';
import Footer from '../UI/organisms/Footer';
import { Container } from 'react-bootstrap';

const DefenseAppLayout = ({ children }) => {
  return (
    <Container className="d-flex flex-column min-vh-100 justify-content-between p-0">
      <Header />
      <main className="flex-grow-1 py-4">
        {children}
      </main>
      <Footer />
    </Container>
  );
};

export default DefenseAppLayout;
