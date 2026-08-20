import { useState, useContext, useRef, useEffect } from 'react';
import { Redirect } from 'react-router-dom';

import LoginPageLayout from '../templates/LoginPageLayout';
import LoginForm from '../UI/organisms/LoginForm';
import { login } from '../../service/Login';
import { UserContext } from '../../auth/UserProvider';
import { useToast } from '../../context/ToastContext';

const Login = () => {
  const { user, setUserInfo } = useContext(UserContext);
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  if (user?.jwt) {
    return <Redirect to="/" />;
  }

  async function onSubmit(credentials) {
    try {
      if (isMounted.current) setLoading(true);

      const res = await login(credentials);
      setErrorMessage('');

      const { name, email, role, accessToken: jwt } = res;
      setUserInfo(name, email, role, jwt);

      showToast('success', `Welcome back, ${name || email}!`);
    } catch (e) {
      let error = '';
      if (e.code===403) {
        error = 'Login failed. Please wait for admin approval.'
      }
      else{
        error = 'Login failed. Please check your credentials.';
      }
      showToast('error', error);
    } finally {
      if (isMounted.current) setLoading(false);
    }
  }

  return (
    <LoginPageLayout>
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: '80vh' }}
      >
        <div className="col-md-6 col-lg-4">
          <LoginForm
            onSubmit={onSubmit}
            loading={loading}
            errorMessage={errorMessage}
          />
        </div>
      </div>
    </LoginPageLayout>
  );
};

export default Login;
