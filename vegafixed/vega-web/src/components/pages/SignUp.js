import SignUpLayout from '../templates/SignUpLayout';
import SignUpForm from '../UI/organisms/SignUpForm';

const SignUpPage = () => {
  return (
    <SignUpLayout>
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <div className="col-md-6 col-lg-4">
          <SignUpForm />
        </div>
      </div>
    </SignUpLayout>
  );
};

export default SignUpPage;