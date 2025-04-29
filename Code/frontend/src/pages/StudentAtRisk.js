import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/SideBar';
import api from '../services/api';
import '../styles/StudentAtRisk.css'; 

function StudentsAtRisk() {
  const [students, setStudents] = useState([]);
  const [riskFilter, setRiskFilter] = useState('all');
  const [performanceFilter, setPerformanceFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/api/students_at_risk/')
      .then((res) => setStudents(res.data.students || []))
      .catch((err) => console.error('Error fetching students at risk:', err));
  }, []);

  const filteredStudents = students.filter(student => {
    if (riskFilter === 'high' && !student.is_at_risk) return false;
    if (performanceFilter === 'low' && student.performance !== 'Low') return false;
    return true;
  });

  return (
    <div className="insert-repo-page">
      <Sidebar />
      <h1>Student at <span className="highlight">Risk</span></h1>
      <p>This page allows you to view students' performance and quickly identify those who are at risk of failing.</p>


      <div className="group-select-container">
        <select value={riskFilter} onChange={(e) => setRiskFilter(e.target.value)}>
          <option value="all">All Students</option>
          <option value="high">At Risk</option>
        </select>
        <select value={performanceFilter} onChange={(e) => setPerformanceFilter(e.target.value)}>
          <option value="all">All Performance Levels</option>
          <option value="low">Low Performance</option>
        </select>
      </div>

      <div className="stats-box">
        <p><strong>Total Students:</strong> {students.length}</p>
        <p><strong>At Risk:</strong> {students.filter(s => s.is_at_risk).length}</p>
        <p><strong>Low Performance:</strong> {students.filter(s => s.performance === 'Low').length}</p>
      </div>

      <div className="grade-table">
        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>Performance</th>
              <th>Risk Status</th>
              <th>Last Active</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', fontStyle: 'italic' }}>No students found.</td>
              </tr>
            ) : (
              filteredStudents.map((student, idx) => (
                <tr key={idx} className="clickable-row">
                  <td>{student.handle}</td>
                  <td>{student.performance}</td>
                  <td>{student.is_at_risk ? 'At Risk' : 'Normal'}</td>
                  <td>{new Date(student.last_active).toLocaleDateString()}</td>
                  <td>
                    <button onClick={() => navigate(`/studentdetails/${student.id}`)}>View</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="button-group">
        <button onClick={() => navigate('/riskreport')}>Generate Risk Report</button>
        <button className="back-btn" onClick={() => navigate('/initialpage')}>Back to Dashboard</button>
      </div>
    </div>
  );
}

export default StudentsAtRisk;