import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/GradePredictions.css';
import Sidebar from '../components/SideBar';

function GradePredictions() {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [predictions, setPredictions] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [sortOption, setSortOption] = useState('name-asc');
  const [showGeneralInfo, setShowGeneralInfo] = useState(false);
  const [showStatsInfo, setShowStatsInfo] = useState(false);
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

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setShowDropdown(true);
  };

  const handleGroupSelect = (group) => {
    setSelectedGroup(group);
    setSearchTerm(group);
    setShowDropdown(false);
  };

  const handleClearSelection = (e) => {
    e.stopPropagation();
    setSelectedGroup('');
    setSearchTerm('');
    setPredictions([]);
  };

  const filteredGroups = groups.filter(group => 
    group.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
  const highest = total > 0
    ? Math.max(...predictions.map(s => s.predicted_grade))
    : null;
  const lowest = total > 0
    ? Math.min(...predictions.map(s => s.predicted_grade))
    : null;

  const sortedPredictions = [...predictions].sort((a, b) => {
    switch (sortOption) {
      case 'name-asc':
        return a.handle.localeCompare(b.handle);
      case 'name-desc':
        return b.handle.localeCompare(a.handle);
      case 'grade-asc':
        return a.predicted_grade - b.predicted_grade;
      case 'grade-desc':
        return b.predicted_grade - a.predicted_grade;
      default:
        return 0;
    }
  });

  return (
    <div className="insert-repo-page">
      <Sidebar />
      <h1>Students' Grade <span className="highlight">Predictions</span></h1>

      <div className="group-select-container">
        <div className="searchable-dropdown">
          <input
            type="text"
            placeholder="Search or select group..."
            value={searchTerm}
            onChange={handleSearchChange}
            onFocus={() => setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
          />
          {selectedGroup && (
            <button className="clear-selection" onClick={handleClearSelection}>
              ×
            </button>
          )}
          {showDropdown && (
            <ul className="group-dropdown">
              {filteredGroups.length > 0 ? (
                filteredGroups.map((group, idx) => (
                  <li 
                    key={idx} 
                    onClick={() => handleGroupSelect(group)}
                    className={selectedGroup === group ? 'selected' : ''}
                  >
                    {group}
                  </li>
                ))
              ) : (
                <li className="no-results">No groups found</li>
              )}
            </ul>
          )}
        </div>
      </div>

      <div className="history-header">
        <h3 className="info">
          → History of grades
          <span onClick={() => setShowGeneralInfo(!showGeneralInfo)} className="info-icon">ⓘ</span>
        </h3>

        {selectedGroup && (
          <div className="sort-container">
            <label htmlFor="sort" className="sort-label">Sort by:</label>
            <select id="sort" value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="grade-asc">Grade (Lowest First)</option>
              <option value="grade-desc">Grade (Highest First)</option>
            </select>
          </div>
        )}
      </div>

      {showGeneralInfo && (
        <div className="info-box">
          <p>This section displays the predicted grades for each student in the selected group. 
             You can sort the data by student name or grade value using the dropdown menu.</p>
        </div>
      )}

      <div className="grade-table">
        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>Group</th>
              <th>Predicted Grade</th>
              <th>Date</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {sortedPredictions.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', fontStyle: 'italic' }}>
                  No grade predictions available.
                </td>
              </tr>
            ) : (
              sortedPredictions.map((p, idx) => (
                <tr key={idx} onClick={() => handleViewDetails(p)} className="clickable-row">
                  <td>{p.handle}</td>
                  <td>{selectedGroup}</td>
                  <td>{p.predicted_grade}</td>
                  <td>{new Date(p.registered_at).toLocaleDateString()}</td>
                  <td><button onClick={(e) => {e.stopPropagation(); handleViewDetails(p);}}>View</button></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <h3 className="info statistic-overview">
        → Statistic Overview
        <span onClick={() => setShowStatsInfo(!showStatsInfo)} className="info-icon">ⓘ</span>
      </h3>
      
      {showStatsInfo && (
        <div className="info-box">
          <p>This section provides statistical information about the predicted grades for the selected group, 
             including average grade, standard deviation, and highest/lowest predictions.</p>
        </div>
      )}
      
      <div className="stats-box">
        <p><strong>Total Predictions:</strong> {total}</p>
        <p><strong>Average Grade:</strong> {average ?? 'N/A'}</p>
        <p><strong>Standard Deviation:</strong> {stdDev ?? 'N/A'}</p>
        <p><strong>Highest Predicted Grade:</strong> {highest ?? 'N/A'}</p>
        <p><strong>Lowest Predicted Grade:</strong> {lowest ?? 'N/A'}</p>
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