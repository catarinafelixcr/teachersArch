import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/GradePredictions.css';
import Sidebar from '../components/SideBar';

function GradePredictions() {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [predictions, setPredictions] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:8000/api/groups/', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setGroups(data.groups || []));
  }, []);

  useEffect(() => {
    if (!selectedGroup) return;
    fetch(`http://localhost:8000/api/group_predictions/${selectedGroup}/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setPredictions(data.predictions || []));
  }, [selectedGroup]);

  const handleViewDetails = (student) => setSelectedStudent(student);
  const handleCloseModal = () => setSelectedStudent(null);

  const total = predictions.length;
  const average = total > 0
    ? (predictions.reduce((sum, s) => sum + s.predicted_grade, 0) / total).toFixed(1)
    : null;
  const stdDev = total > 1
    ? Math.sqrt(
        predictions.map(s => s.predicted_grade).reduce((acc, val, _, arr) => {
          const mean = arr.reduce((a, b) => a + b) / arr.length;
          return acc + Math.pow(val - mean, 2);
        }, 0) / total
      ).toFixed(1)
    : null;

  return (
    <div className="insert-repo-page">
      <Sidebar />
      <h1>Students' Grade <span className="highlight">Predictions</span></h1>

      <select onChange={(e) => setSelectedGroup(e.target.value)}>
        <option value="">Select Group</option>
        {groups.map((group, idx) => (
          <option key={idx} value={group}>{group}</option>
        ))}
      </select>

      <h3 className="info">→ History of grades <span title="Histórico de previsões">ℹ️</span></h3>

      <div className="grade-table">
        <table>
          <thead>
            <tr>
              <th>Handle</th>
              <th>Group</th>
              <th>Predicted Grade</th>
              <th>At Risk</th>
              <th>Date</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {predictions.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', fontStyle: 'italic' }}>
                  No grade predictions available.
                </td>
              </tr>
            ) : (
              predictions.map((p, idx) => (
                <tr key={idx}>
                  <td>{p.handle}</td>
                  <td>{selectedGroup}</td>
                  <td>{p.predicted_grade}</td>
                  <td>{p.risk ? 'Yes' : 'No'}</td>
                  <td>{new Date(p.registered_at).toLocaleDateString()}</td>
                  <td><button onClick={() => handleViewDetails(p)}>View</button></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <h3 className="info">→ Statistic Overview</h3>
      <div className="stats-box">
        <p><strong>Total Predictions:</strong> {total}</p>
        <p><strong>Average Grade:</strong> {average ?? 'N/A'}</p>
        <p><strong>Standard Deviation:</strong> {stdDev ?? 'N/A'}</p>
      </div>

      <div className="button-group">
        <button onClick={() => navigate('/comparegroups')}>Compare Groups</button>
        <button onClick={() => navigate('/generate-report')}>Generate Report</button>
        <button onClick={() => navigate('/comparepredictions')}>Compare Over Time</button>
        <button className="back-btn" onClick={() => navigate('/initialpage')}>Back to Dashboard</button>
      </div>

      {selectedStudent && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>Details for {selectedStudent.handle}</h2>
            <p><strong>Commits:</strong> {selectedStudent.metrics.total_commits}</p>
            <p><strong>Lines Added:</strong> {selectedStudent.metrics.sum_lines_added}</p>
            <p><strong>Lines Deleted:</strong> {selectedStudent.metrics.sum_lines_deleted}</p>
            <p><strong>Lines/Commit:</strong> {selectedStudent.metrics.sum_lines_per_commit}</p>
            <p><strong>Active Days:</strong> {selectedStudent.metrics.active_days}</p>
            <p><strong>Merge Requests:</strong> {selectedStudent.metrics.total_merge_requests}</p>
            <p><strong>Comments Given:</strong> {selectedStudent.metrics.review_comments_given}</p>
            <p><strong>Comments Received:</strong> {selectedStudent.metrics.review_comments_received}</p>
            <button onClick={handleCloseModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default GradePredictions;
