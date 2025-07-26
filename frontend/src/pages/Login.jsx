import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    if(!email||!password){
        setMsg("Please fill in both email and password.");
    }
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user)); 
      window.location.href = '/dashboard';
    } catch (err) {
      setMsg(err.response?.data?.error || 'Error');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required/><br/>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required/><br/>
        <button type="submit">Login</button>
      </form>
      <p>{msg}</p>
    </div>
  );
};

export default Login;
