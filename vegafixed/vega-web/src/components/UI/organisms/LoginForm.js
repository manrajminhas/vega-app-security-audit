import React from 'react';
import AuthInput from '../molecules/AuthInput';
import { Button } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

const LoginForm = ({ onSubmit, loading, errorMessage }) => {
  const [formData, setFormData] = React.useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = React.useState({});
  const [submitted, setSubmitted] = React.useState(false);
  const history = useHistory();
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFormData = {};
    for (const key in formData) {
      newFormData[key] = formData[key];
    }
    newFormData[name] = value;
    setFormData(newFormData);

    if (errors[name]) {
      const newErrors = {};
      for (const key in errors) {
        newErrors[key] = errors[key];
      }
      newErrors[name] = '';
      setErrors(newErrors);
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    
    if (!validate()) return;

    onSubmit(formData);
  };

  return (
    <div className="card shadow-sm p-4">
      <div className="text-center mb-4">
        <h4 className="text-primary fw-bold">Login</h4>
      </div>
      <form onSubmit={handleSubmit}>
        {errorMessage && (
          <div className="alert alert-danger" role="alert">
            {errorMessage}
          </div>
        )}

        <AuthInput
          label="Email"
          type="text"
          name="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          submitted={submitted}
          required
        />
        
        <AuthInput
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          submitted={submitted}
          required
        />
        
        <div className="d-grid mt-4">
          <Button 
            variant="primary" 
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Logging in...
              </>
            ) : 'Login'}
          </Button>
        </div>
        
        <div className="text-center mt-4 pt-3 border-top">
          <span className="text-muted">
            Don't have an account?{' '}
            <button 
              className="btn btn-link text-primary p-0"
              type="button"
              onClick={() => history.push('/signup')}
            >
              Sign Up
            </button>
          </span>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;