import React, { useState, useEffect } from 'react';
import '../styles/GradePredictions.css';
import background from '../assets/background-dei.jpg';
import Sidebar from '../components/SideBar';
import { useNavigate } from 'react-router-dom';
import Plot from 'react-plotly.js';
import api from '../services/api';

function PerformanceForecastPage() {
  const navigate = useNavigate();

  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showTableInfo, setShowTableInfo] = useState(false);
  const [showPieInfo, setShowPieInfo] = useState(false);
  const [showBarInfo, setShowBarInfo] = useState(false);
  const [sortOption, setSortOption] = useState('name-asc');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    api.get('/api/groups/')
      .then(res => setGroups(res.data.groups))
      .catch(err => console.error('Error fetching groups:', err));
  }, []);

  useEffect(() => {
    if (!selectedGroup) return;
    setLoading(true);
    api.get(`/api/group_predictions/${selectedGroup}/`)
      .then(res => setPredictions(res.data.predictions))
      .catch(err => console.error('Error fetching predictions:', err))
      .finally(() => setLoading(false));
  }, [selectedGroup]);

  const classifyCategory = (grade) => {
    const percentage = (grade / 20) * 100;
    if (percentage >= 85) return 'Very High';
    if (percentage >= 70) return 'High';
    if (percentage >= 50) return 'Medium';
    if (percentage >= 30) return 'Low';
    return 'Very Low';
  };

  const categoryColors = {
    'Very Low': '#ff4d4d',
    'Low': '#ff9933',
    'Medium': '#ffeb3b',
    'High': '#8bc34a',
    'Very High': '#4caf50'
  };

  const enrichedPredictions = predictions.map(p => {
    const percentage = (p.predicted_grade / 20) * 100;
    return {
      name: p.handle,
      group: selectedGroup,
      grade: p.predicted_grade,
      percentage: percentage,
      category: classifyCategory(p.predicted_grade)
    };
  });

  const sortedPredictions = [...enrichedPredictions].sort((a, b) => {
    switch (sortOption) {
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      case 'grade-asc':
        return a.grade - b.grade;
      case 'grade-desc':
        return b.grade - a.grade;
      default:
        return 0;
    }
  });

  const filteredPredictions = sortedPredictions.filter(p => {
    if (categoryFilter === 'all') return true;
    return p.category === categoryFilter;
  });

  const filteredGroups = groups.filter(group =>
    group.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const countCategories = filteredPredictions.reduce((acc, pred) => {
    acc[pred.category] = (acc[pred.category] || 0) + 1;
    return acc;
  }, {});

  const categories = Object.keys(countCategories);
  const values = Object.values(countCategories);

  const commonLayout = {
    title: '',
    margin: { t: 50, l: 60, r: 30, b: 60 },
    height: 400,
    legend: { orientation: 'h', y: -0.3 },
    hovermode: 'closest',
    plot_bgcolor: '#f9f9f9',
    paper_bgcolor: '#f9f9f9',
    font: { family: 'Segoe UI', size: 12, color: '#1e3a8a' }
  };

  return (
    <div className="insert-repo-page">
      <div className="forecast-background" style={{ backgroundImage: `url(${background})` }} />
      <div className="forecast-overlay" />

      <Sidebar />

      <div className="forecast-main-content">
        <h1><span className="highlight">Performance Forecast</span> by Category</h1>

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

        {loading && <p>Loading predictions...</p>}

        {selectedGroup && !loading && (
          <>
            <div className="history-header">
              <h3 className="info">→ Performance Table <span onClick={() => setShowTableInfo(!showTableInfo)} className="info-icon">ⓘ</span></h3>
            </div>

            {showTableInfo && (
              <div className="info-box">
                <p>This table shows both the predicted score (0-20) and its percentage, categorized by performance level.</p>
              </div>
            )}

            {selectedGroup && (
              <div className="sort-container">
                <label htmlFor="sort" className="sort-label">Sort by:</label>
                <select id="sort" value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
                  <option value="name-asc">Name (A-Z)</option>
                  <option value="name-desc">Name (Z-A)</option>
                  <option value="grade-asc">Grade (Lowest First)</option>
                  <option value="grade-desc">Grade (Highest First)</option>
                </select>

                <label htmlFor="categoryFilter" className="sort-label" style={{ marginLeft: '20px' }}>Category:</label>
                <select id="categoryFilter" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                  <option value="all">All</option>
                  <option value="Very High">Very High</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                  <option value="Very Low">Very Low</option>
                </select>
              </div>
            )}

            <div className="grade-table">
              {filteredPredictions.length === 0 ? (
                <p style={{ textAlign: 'center', fontStyle: 'italic' }}>No predictions available for this group.</p>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Group</th>
                      <th>Grade (0-20)</th>
                      <th>Grade (%)</th>
                      <th>Category</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPredictions.map((pred, idx) => (
                      <tr key={idx}>
                        <td>{pred.name}</td>
                        <td>{pred.group}</td>
                        <td>{pred.grade.toFixed(1)}</td>
                        <td>{pred.percentage.toFixed(1)}%</td>
                        <td style={{ color: categoryColors[pred.category], fontWeight: 'bold' }}>{pred.category}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="charts-container">
              <div className="chart-row">
                <div className="chart">
                  <h4>
                    Category Overview
                    <span className="info-icon" onClick={() => setShowPieInfo(!showPieInfo)}> ⓘ</span>
                  </h4>
                  {showPieInfo && (
                    <div className="info-box">
                      <p>This pie chart shows the percentage of students in each performance category.</p>
                    </div>
                  )}
                  <Plot
                    data={[{
                      values: values,
                      labels: categories,
                      type: 'pie',
                      marker: { colors: categories.map(c => categoryColors[c]) },
                      textinfo: 'label+percent',
                      insidetextorientation: 'radial'
                    }]}
                    layout={{ ...commonLayout, title: 'Category Overview' }}
                    useResizeHandler
                    style={{ width: '100%', height: '100%' }}
                    config={{ responsive: true }}
                  />
                </div>

                <div className="chart">
                  <h4>
                    Individual Scores
                    <span className="info-icon" onClick={() => setShowBarInfo(!showBarInfo)}> ⓘ</span>
                  </h4>
                  {showBarInfo && (
                    <div className="info-box">
                      <p>This bar chart displays the predicted grades for each student in percentage, color-coded by performance category.</p>
                    </div>
                  )}
                  <Plot
                    data={[{
                      x: filteredPredictions.map(p => p.name),
                      y: filteredPredictions.map(p => p.percentage),
                      type: 'bar',
                      marker: { color: filteredPredictions.map(p => categoryColors[p.category]) }
                    }]}
                    layout={{ ...commonLayout, title: 'Individual Scores', margin: { t: 40, b: 100 } }}
                    useResizeHandler
                    style={{ width: '100%', height: '100%' }}
                    config={{ responsive: true }}
                  />
                </div>
              </div>
            </div>
          </>
        )}

        <div className="button-group">
          <button className="back-btn" onClick={() => navigate('/initialpage')}>Back to Dashboard</button>
        </div>
      </div>
    </div>
  );
}

export default PerformanceForecastPage;