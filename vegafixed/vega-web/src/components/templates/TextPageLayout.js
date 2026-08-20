import Header from '../UI/organisms/Header.js';
import Footer from '../UI/organisms/Footer.js';
import {Container} from 'react-bootstrap';

const TextPageLayout = ({children}) => {
	return (
		<Container className="d-flex flex-column min-vh-100 justify-content-between">
			<Header />
      			<main className="flex-grow-1 py-4">
        			{children}
      			</main>
			<Footer />
		</Container>
		);
}
export default TextPageLayout;