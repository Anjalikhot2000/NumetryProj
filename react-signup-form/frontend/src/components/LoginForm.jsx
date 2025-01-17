import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './SignupForm.css'; // Reuse existing styles

const LoginForm = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError(''); // Clear error when the user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/login', formData);
      setError(''); // Clear any previous error
      alert(response.data.message); // Show success message
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Invalid email or password';
      setError(errorMessage); // Set error message
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>

        {/* Display error message only if it exists */}
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
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Login</button>

        {/* Provide option to create an account below the Login button */}
        <p style={{ marginTop: '10px', textAlign: 'center', color: '#734F96' }}>
          Donot have an account?{' '}
          <Link to="/" style={{ color: '#734F96', textDecoration: 'none' }}>
            Sign up here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;
