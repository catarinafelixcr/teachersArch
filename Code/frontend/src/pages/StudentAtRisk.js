// StudentAtRisk corrigido para exibir apenas a última extração
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/SideBar';
import api from '../services/api';
import '../styles/StudentAtRisk.css'; 
import Plot from 'react-plotly.js';

function StudentsAtRisk() {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [students, setStudents] = useState([]);
  const [riskCategoryFilter, setRiskCategoryFilter] = useState('all');
  const [selectedMetric, setSelectedMetric] = useState('total_commits');
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/api/groups/')
      .then(res => setGroups(res.data.groups))
      .catch(err => console.error('Error fetching groups:', err));
  }, []);

  useEffect(() => {
    if (!selectedGroup) return;
    api.get(`/api/group_predictions/${selectedGroup}/`)
      .then(res => {
        const all = res.data.predictions || [];
        const latestDate = all.reduce((max, p) => {
          const date = new Date(p.registered_at);
          return date > max ? date : max;
        }, new Date(0));

        const latest = all.filter(p =>
          new Date(p.registered_at).toDateString() === latestDate.toDateString()
        );

        setStudents(latest);
      })
      .catch(err => console.error('Error fetching predictions:', err));
  }, [selectedGroup]);

  const handleGroupSelect = (group) => {
    setSelectedGroup(group);
    setSearchTerm(group);
    setShowDropdown(false);
  };

  const handleClearSelection = (e) => {
    e.stopPropagation();
    setSelectedGroup('');
    setSearchTerm('');
    setStudents([]);
  };

  const filteredGroups = groups.filter(group =>
    group.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const classifyRiskLevel = (grade) => {
    if (grade < 6) return 'High Risk';
    if (grade < 9) return 'Medium Risk';
    if (grade < 11) return 'Low Risk';
    if (grade >= 11) return 'No Risk';
    if (grade === null) return 'No Prediction';
    return 'Not in Risk';
  };

  const rowClass = (grade) => {
    if (grade < 6) return 'high-risk-row';
    if (grade < 9) return 'medium-risk-row';
    if (grade < 11) return 'low-risk-row';
    if (grade >= 11) return 'no-risk-row';
    return '';
  };

  const filteredStudents = students.filter(student => {
    const riskLevel = classifyRiskLevel(student.predicted_grade);
    if (riskCategoryFilter === 'high' && riskLevel !== 'High Risk') return false;
    if (riskCategoryFilter === 'medium' && riskLevel !== 'Medium Risk') return false;
    if (riskCategoryFilter === 'low' && riskLevel !== 'Low Risk') return false;
    if (riskCategoryFilter === 'no' && riskLevel !== 'No Risk') return false;
    return true;
  });

  const totalStudents = filteredStudents.length;
  const atRiskCount = filteredStudents.filter(s => s.predicted_grade < 11).length;
  const riskPercentage = totalStudents ? ((atRiskCount / totalStudents) * 100).toFixed(0) : 0;
  const gradeAvg = totalStudents
    ? (filteredStudents.reduce((sum, s) => sum + (s.predicted_grade || 0), 0) / totalStudents).toFixed(1)
    : 'N/A';

  return (
    <div className="insert-repo-page">
      <Sidebar />
      <h1>Student at <span className="highlight">Risk</span></h1>
      <p>This page allows you to view students' performance and quickly identify those who are at risk of failing.</p>

      <div className="group-select-container">
        <div className="searchable-dropdown">
          <input
            type="text"
            placeholder="Search or select group..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setShowDropdown(true); }}
            onFocus={() => setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
          />
          {selectedGroup && (
            <button className="clear-selection" onClick={handleClearSelection}>×</button>
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

      {selectedGroup && (
        <>
          <div className="risk-filter-buttons">
            <button onClick={() => setRiskCategoryFilter('all')}>All</button>
            <button onClick={() => setRiskCategoryFilter('high')}>High Risk</button>
            <button onClick={() => setRiskCategoryFilter('medium')}>Medium Risk</button>
            <button onClick={() => setRiskCategoryFilter('low')}>Low Risk</button> 
            <button onClick={() => setRiskCategoryFilter('no')}>No Risk</button>
          </div>

          <div className="risk-summary-cards">
            <div className="summary-card">
              <p>Total of Students Analysed:</p>
              <h2>{totalStudents}</h2>
            </div>
            <div className="summary-card">
              <p>Students at Risk of Failure:</p>
              <h2>{atRiskCount}</h2>
            </div>
            <div className="summary-card">
              <p>% of Student at Risk:</p>
              <h2 style={{ color: 'red' }}>{riskPercentage} %</h2>
            </div>
            <div className="summary-card">
              <p>Grades Prediction Mean:</p>
              <h2>{gradeAvg}</h2>
            </div>
          </div>

          <div className="grade-table">
            <table>
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Group</th>
                  <th>Grade Prediction</th>
                  <th>Risk of Failure</th>
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
                    <tr key={idx} className={`clickable-row ${rowClass(student.predicted_grade)}`}>
                      <td>{student.handle}</td>
                      <td>{selectedGroup}</td>
                      <td>{student.predicted_grade}</td>
                      <td>{classifyRiskLevel(student.predicted_grade)}</td>
                      <td><button onClick={() => navigate(`/studentdetails/${student.id}`)}>Ver Detalhes</button></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="graph-wrapper">
            <div className="activity-type-selector">
              <label htmlFor="metric-select">Select Metric:</label>
              <select
                id="metric-select"
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
                className="metric-select"
              >
                <option value="total_commits">Commits</option>
                <option value="active_days">Active Days</option>
                <option value="issues_resolved">Issues Resolved</option>
              </select>
            </div>

            <div className="plot-container">
              <Plot
                data={[{
                  x: filteredStudents.map(s => s.handle),
                  y: filteredStudents.map(s => s.metrics?.[selectedMetric] || 0),
                  type: 'scatter',
                  mode: 'lines+markers',
                  name: selectedMetric,
                  line: { shape: 'linear', color: '#1e3a8a' },
                  marker: { size: 6 }
                }]}
                layout={{
                  title: `Student ${selectedMetric.replace('_', ' ')} Comparison`,
                  xaxis: { title: 'Student' },
                  yaxis: { title: selectedMetric.replace('_', ' ') },
                  height: 400,
                  font: { family: 'Segoe UI', color: '#1e3a8a' }
                }}
                useResizeHandler
                style={{ width: '100%', height: '100%' }}
                config={{ responsive: true }}
              />
            </div>
          </div>
        </>
      )}

      <div className="button-group">
        <button className="back-btn" onClick={() => navigate('/initialpage')}>Back to Dashboard</button>
      </div>
    </div>
  );
}

export default StudentsAtRisk;
