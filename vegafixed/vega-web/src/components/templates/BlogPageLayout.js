import { Container, Row, Col } from 'react-bootstrap';
import Header from '../UI/organisms/Header.js';
import Footer from '../UI/organisms/Footer.js';

const BlogPageLayout = ({ listOfNews }) => {
  return (
    <Container className="d-flex flex-column min-vh-100 justify-content-between">
      <Row>
        <Header />
      </Row>

      <Row>
        <Col>
          {listOfNews.map((newsItem, newsIndex) => (
            <div key={newsIndex} className="mb-4 news-item">
              <p className="news-date">{newsItem.date}</p>
              <h1 className="news-title">{newsItem.h1}</h1>
              <h2 className="news-subtitle">{newsItem.h2}</h2>
              {newsItem.para.map((paragraph, paraIndex) => (
                <p key={paraIndex}>{paragraph}</p>
              ))}
            </div>
          ))}
        </Col>
      </Row>

      <Row>
        <Footer />
      </Row>
    </Container>
  );
};

export default BlogPageLayout;
