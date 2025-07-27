import React, { useState } from 'react';
import axios from 'axios';
import './Register.css'; // Import the CSS file

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setMsg("Please fill in all fields.");
      return;
    }
    try {
      await axios.post('http://localhost:5000/api/auth/register', { name, email, password });
      setMsg('Registered successfully! Now login.');
      setTimeout(() => {
        window.location.href = '/login';
      }, 1500);
    } catch (err) {
      setMsg(err.response?.data?.error || 'Error registering');
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <h2 className="register-title">Create Account</h2>
          <p className="register-subtitle">Join us today</p>
        </div>
        
        <form onSubmit={handleRegister} className="register-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Enter your full name"
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Create a password"
              className="form-input"
              required
            />
          </div>

          <button type="submit" className="register-button">
            Create Account
          </button>
        </form>

        {msg && (
          <div className={`message ${msg.includes('successfully') ? 'success' : 'error'}`}>
            {msg}
          </div>
        )}

        <div className="login-link">
          <p>Already have an account? <a href="/login">Sign in here</a></p>
        </div>
      </div>
    </div>
  );
};

export default Register;