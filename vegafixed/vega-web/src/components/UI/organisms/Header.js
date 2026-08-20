import { Row } from 'react-bootstrap'; 
import { Link } from 'react-router-dom'; // Import Link
import Logo from '../molecules/Logo';
import VenusNavBar from '../molecules/VenusNavBar';

const Header = (props) => {
  return (
    <Row>
      <Link to="/">
        <Logo />
      </Link>
      <VenusNavBar />
    </Row>
  );
}

export default Header;