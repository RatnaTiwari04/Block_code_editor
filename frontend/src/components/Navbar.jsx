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
    <nav className="w-full bg-gray-900 text-white shadow-lg">
      <div className="container mx-auto px-4 h-11 flex justify-between items-center">
        {/* Logo/Brand */}
        <div className="flex items-center">
          <Link 
            to="/" 
            className="text-xl font-bold text-teal-400 hover:text-teal-300 transition-colors duration-200 flex items-center gap-2"
          >
            <span>🧩</span>
            <span>Block Code Editor</span>
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center space-x-4">
          {token ? (
            <>
              <Link 
                to="/dashboard" 
                className="text-gray-300 hover:text-white transition-colors duration-200 font-medium px-3 py-1 rounded-md hover:bg-gray-800"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md transition-colors duration-200 font-medium text-white"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className="text-gray-300 hover:text-white transition-colors duration-200 font-medium px-3 py-2 rounded-md hover:bg-gray-800"
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="text-gray-300 hover:text-white transition-colors duration-200 font-medium px-3 py-2 rounded-md hover:bg-gray-800"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;