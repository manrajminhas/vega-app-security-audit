import React, { useState, useEffect, useRef } from 'react';
import { useHistory  } from 'react-router-dom';
import AuthInput from '../molecules/AuthInput';
import AuthSelect from '../molecules/AuthSelect';
import { register } from '../../../service/registerService';
import { getCurrentUserRoles } from '../../../service/roleService';
import { useToast } from '../../../context/ToastContext';

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: ''
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const { showToast } = useToast();
  const isMounted = useRef(true);


  useEffect(() => {
    // Set mounted flag
    isMounted.current = true;
    
    const fetchRoles = async () => {
      try {
        const data = await getCurrentUserRoles();
        const filteredRoles = data.filter(role => role.name !== 'ADMIN');
        console.log(filteredRoles)
        // Only update state if component is still mounted
        if (isMounted.current) {
          setRoles(filteredRoles);
        }
      } catch (error) {
        if (isMounted.current) {
          showToast('error', error.message || 'Failed to load roles');
        }
      }
    };
    
    fetchRoles();

    // Cleanup function, runs when component unmounts
    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    } else if (formData.password.length > 24) {
      newErrors.password = 'Password cannot exceed 24 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.role) {
      newErrors.role = 'Role is required';
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await register({ 
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role
      });
      
      // Check if component is still mounted before state updates
      if (isMounted.current) {
        showToast('success', 'Registered successfully! Waiting for admin approval');
        setFormData({ name: '', email: '', password: '', confirmPassword: '', role: '' });
        setErrors({});
        history.push('/login', { fromSignUp: true });
      }
    } catch (error) {
      if (isMounted.current) {
        showToast('error', error.message || 'Registration failed');
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  };


  return (
    <div className="card shadow-sm p-4">
      <div className="text-center mb-4">
        <h4 className="text-primary fw-bold">Sign Up</h4>
      </div>
      
      <form onSubmit={handleSubmit}>
        <AuthInput
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          submitted={submitted}
          required
        />
        
        <AuthInput
          label="Email"
          type="email"
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
        
        <AuthInput
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          submitted={submitted}
          required
        />
        
        <AuthSelect
          label="Select Role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          options={roles.map(r => ({ value: r.name, label: r.displayName }))}
          error={errors.role}
          submitted={submitted}
          required
        />
        
        <div className="d-grid mt-4">
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Processing...
              </>
            ) : 'Sign Up'}
          </button>
        </div>
        
        <div className="text-center mt-4 pt-3 border-top">
          <span className="text-muted">
            Already have an account?{' '}
            <button 
              className="btn btn-link text-primary p-0"
              onClick={() => history.push('/login')}
            >
              Login Now
            </button>
          </span>
        </div>
      </form>
    </div>
  );
};

export default SignUpForm;