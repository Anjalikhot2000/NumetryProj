import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './SignupForm.css';

const SignupForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    cpassword: '',
  });

  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Backend URLs
  const PRIMARY_API_URL = 'https://numetry-proj.vercel.app/api/signup';
  const FALLBACK_API_URL = 'http://localhost:5000/api/signup';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    if (formData.password !== formData.cpassword) {
      setError('Passwords do not match');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      // Attempt to submit data to the primary API URL
      const response = await axios.post(PRIMARY_API_URL, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      alert(response.data.message);
    } catch (primaryError) {
      console.warn('Primary API failed, trying fallback:', primaryError);

      // Attempt to submit data to the fallback API URL
      try {
        const fallbackResponse = await axios.post(FALLBACK_API_URL, {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });

        alert(fallbackResponse.data.message);
      } catch (fallbackError) {
        console.error('Fallback API failed:', fallbackError);
        setError(
          fallbackError.response?.data?.message ||
            'Error signing up. Please try again later.'
        );
      }
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <h2>Sign Up</h2>
        {error && <p className="error-message">{error}</p>}

        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <div className="password-container">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <span
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? '👁' : '👁️'}
          </span>
        </div>
        <div className="password-container">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            name="cpassword"
            placeholder="Confirm Password"
            value={formData.cpassword}
            onChange={handleChange}
            required
          />
          <span
            className="toggle-password"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? '👁' : '👁️'}
          </span>
        </div>
        <button type="submit">Sign Up</button>
        <p>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#734F96', textDecoration: 'none' }}>
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignupForm;
