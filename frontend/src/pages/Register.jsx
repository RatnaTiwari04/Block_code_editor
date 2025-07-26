import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
    const[name, setName]=useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    if(!name||!email||!password){
        setMsg("Please fill in both email and password.");
    }
    try {
      await axios.post('http://localhost:5000/api/auth/register', { name, email, password });
      setMsg('Registered! Now login.');
      window.location.href = '/login';
    } catch (err) {
      setMsg(err.response?.data?.error || 'Error registering');
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" required/><br/>
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required/><br/>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required/><br/>
        <button type="submit">Register</button>
      </form>
      <p>{msg}</p>
    </div>
  );
};

export default Register;
