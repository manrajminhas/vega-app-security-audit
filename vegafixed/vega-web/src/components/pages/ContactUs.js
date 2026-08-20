import ContactUsPageLayout from '../templates/ContactUsPageLayout.js';
import UserContactUsForm from '../UI/organisms/UserContactUsForm.js';
const UserContactUs = (props) => {
	return (
		<ContactUsPageLayout>
			<UserContactUsForm />
		</ContactUsPageLayout>
		);
}
export default UserContactUs;