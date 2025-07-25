import React, { useEffect, useState } from 'react';
import axios from 'axios';
const Dashboard = () => {
  const [projects, setProjects] = useState([]);
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
      }
    };
    loadProjects();
  }, []);
  return (
    <div style={{ padding: '20px' }}>
      <h2>👤 My Profile</h2>
      {user ? (
        <div style={{
          border: '1px solid #ddd', 
          borderRadius: '6px', 
          padding: '10px', 
          marginBottom: '20px',
          background: '#f9f9f9'
        }}>
          <p><b>Name:</b> {user.name}</p>
          <p><b>Email:</b> {user.email}</p>
        </div>):(
        <p>User info not available. Please login again.</p>)}
      <h2>📂 My Projects</h2>
      {projects.length > 0 ? (
        projects.map(p => (
          <div 
            key={p._id} 
            style={{ 
              border: '1px solid #ccc', 
              borderRadius: '6px',
              margin: '8px 0', 
              padding: '10px',
              background: '#fff'
            }}>
            <b>{p.title}</b> <small>({p.language})</small>
            <pre style={{
              background: '#f4f4f4',
              padding: '10px',
              borderRadius: '4px',
              overflowX: 'auto'
            }}>{p.code}</pre>
          </div>
        ))):(
        <p>No projects found.</p>)}
    </div>
  );
};
export default Dashboard;