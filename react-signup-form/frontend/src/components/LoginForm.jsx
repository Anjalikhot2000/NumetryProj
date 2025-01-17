import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './SignupForm.css'; // Reuse existing styles

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Backend URLs (Primary and fallback)
  const API_URLS = [
    'https://numetry-proj.vercel.app/api/login', // Primary API
    'http://localhost:5000/api/login', // Fallback API
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError(''); // Clear error when the user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let success = false;

    for (const apiUrl of API_URLS) {
      try {
        const response = await axios.post(apiUrl, formData);
        alert(response.data.message); // Show success message
        success = true;
        break; // Exit loop if the request succeeds
      } catch (error) {
        console.warn(`API failed at ${apiUrl}:`, error);
      }
    }

    if (!success) {
      setError('Unable to log in. Please check your credentials or try again later.');
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>
        {error && <p className="error-message">{error}</p>}

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
        <button type="submit">Login</button>
        <p>
          Don’t have an account?{' '}
          <Link to="/" style={{ color: '#734F96', textDecoration: 'none' }}>
            Sign up here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;
