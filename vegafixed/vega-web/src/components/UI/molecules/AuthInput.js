import React from 'react';

const AuthInput = ({ 
  label, 
  type = 'text', 
  name, 
  value, 
  onChange, 
  error, 
  submitted,
  required 
}) => (
  <div className="mb-3">
    <label className="form-label mb-0">
      {label}
      {required && <span className="text-primary">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className={`form-control ${submitted && error ? 'is-invalid' : ''}`}
    />
    {submitted && error && <div className="invalid-feedback">{error}</div>}
  </div>
);

export default AuthInput;