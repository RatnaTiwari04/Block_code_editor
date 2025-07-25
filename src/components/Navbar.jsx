import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const token = localStorage.getItem('token');
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };
  return (
    <nav style={{ padding: '10px', background: '#222', color: '#fff' }}>
      <Link to="/" style={{ marginRight: '10px', color: '#fff' }}>Editor</Link>
      {token ? (
        <>
          <Link to="/dashboard" style={{ marginRight: '10px', color: '#fff' }}>Dashboard</Link>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login" style={{ marginRight: '10px', color: '#fff' }}>Login</Link>
          <Link to="/register" style={{ color: '#fff' }}>Register</Link>
        </>
      )}
    </nav>
  );
};

export default Navbar;
