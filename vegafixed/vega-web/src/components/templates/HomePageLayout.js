import Header from '../UI/organisms/Header.js';
import Footer from '../UI/organisms/Footer.js';
import MainPageCarousel from '../UI/organisms/MainPageCarousel.js';
import {Container, Row} from 'react-bootstrap';

const HomePageLayout = () => {
  return (
    <Container className="d-flex flex-column min-vh-100 justify-content-between p-0">
        <Header />
      <main className="flex-grow-1">
        <MainPageCarousel />
      </main>
        <Footer />
    </Container>
  );
};
export default HomePageLayout;