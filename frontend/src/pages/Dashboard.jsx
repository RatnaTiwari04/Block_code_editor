import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/projects/my', {
          headers: { Authorization: token }
        });
        setProjects(res.data.projects);
      } catch (err) {
        console.error(err);
        setError('Failed to load projects. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    loadProjects();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const getLanguageIcon = (language) => {
    const icons = {
      javascript: '🟨',
      python: '🐍',
      java: '☕',
      cpp: '⚡',
      html: '🌐',
      css: '🎨',
      react: '⚛️',
      node: '🟢',
      default: '📄'
    };
    return icons[language?.toLowerCase()] || icons.default;
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <h1 className="dashboard-title">
            My Dashboard
          </h1>
        </div>
      </header>

      <div className="dashboard-content">
        {/* Profile Section */}
        <section className="profile-section">
          <div className="section-header">
            <h2 className="section-title">
              <span className="section-icon">👤</span>
              My Profile
            </h2>
          </div>
          
          {user ? (
            <div className="profile-card">
              <div className="profile-avatar">
                {user.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="profile-info">
                <div className="profile-field">
                  <span className="field-label">Name:</span>
                  <span className="field-value">{user.name}</span>
                </div>
                <div className="profile-field">
                  <span className="field-label">Email:</span>
                  <span className="field-value">{user.email}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              User info not available. Please login again.
            </div>
          )}
        </section>

        {/* Projects Section */}
        <section className="projects-section">
          <div className="section-header">
            <h2 className="section-title">
              <span className="section-icon">📂</span>
              My Projects
              <span className="project-count">({projects.length})</span>
            </h2>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="spinner-large"></div>
              <p>Loading your projects...</p>
            </div>
          ) : error ? (
            <div className="error-message">
              <span className="error-icon">❌</span>
              {error}
            </div>
          ) : projects.length > 0 ? (
            <div className="projects-grid">
              {projects.map(project => (
                <div key={project._id} className="project-card">
                  <div className="project-header">
                    <div className="project-title-section">
                      <span className="language-icon">
                        {getLanguageIcon(project.language)}
                      </span>
                      <h3 className="project-title">{project.title}</h3>
                    </div>
                    <span className="language-badge">{project.language}</span>
                  </div>
                  
                  <div className="project-code">
                    <div className="code-header">
                      <span className="code-label">Code:</span>
                      <button 
                        className="copy-button"
                        onClick={() => navigator.clipboard.writeText(project.code)}
                        title="Copy code"
                      >
                        📋
                      </button>
                    </div>
                    <pre className="code-block">
                      <code>{project.code}</code>
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <h3>No projects found</h3>
              <p>You haven't created any projects yet. Start coding to see them here!</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Dashboard;