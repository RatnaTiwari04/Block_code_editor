import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <nav className="w-full bg-gray-900 text-white px-8 py-4 flex justify-between items-center shadow-md">
      {/* Left: Logo */}

      {/* Right: Navigation Links */}
      <div className="space-x-6 text-sm font-medium">
        <Link to="/" className="hover:text-teal-400 transition">Code Editor</Link>
        {token ? (
          <>
            <Link to="/dashboard" className="hover:text-teal-400 transition">Dashboard</Link>
            <button
              onClick={handleLogout}
              className="bg-teal-600 hover:bg-teal-700 px-3 py-1 rounded transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-teal-400 transition">Login</Link>
            <Link to="/register" className="hover:text-teal-400 transition">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
