import React from 'react';

const AuthSelect = ({
  label,
  name,
  value,
  onChange,
  options,
  error,
  submitted,
  required
}) => (
  <div className="mb-3">
    <label className="form-label mb-0">
      {label}
      {required && <span className="text-primary">*</span>}
    </label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className={`form-select ${submitted && error ? 'is-invalid' : ''}`}
    >
      <option value="">Select Role</option>
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    {submitted && error && <div className="invalid-feedback">{error}</div>}
  </div>
);

export default AuthSelect;