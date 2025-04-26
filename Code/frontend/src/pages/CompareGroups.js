import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import Plot from 'react-plotly.js';
import '../styles/CompareGroups.css';

const CompareGroups = () => {
  const [groups, setGroups] = useState([]);
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [groupData, setGroupData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:8000/api/groups/', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.groups) {
          setGroups(data.groups.map(group => ({ label: group, value: group })));
        }
      })
      .catch((error) => console.error('Error fetching groups:', error));
  }, []);

  useEffect(() => {
    if (selectedGroups.length < 2) {
      setGroupData([]);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      const fetchedData = [];

      for (const group of selectedGroups) {
        try {
          const res = await fetch(`http://localhost:8000/api/group_predictions/${group.value}/`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            },
          });
          const data = await res.json();

          if (data.predictions && data.predictions.length > 0) {
            const grades = data.predictions.map(p => p.predicted_grade);
            const mean = grades.reduce((a, b) => a + b, 0) / grades.length;
            const stdDev = Math.sqrt(grades.map(g => Math.pow(g - mean, 2)).reduce((a, b) => a + b, 0) / grades.length);
            fetchedData.push({
              group: group.value,
              grades,
              mean: mean.toFixed(1),
              stdDev: stdDev.toFixed(1),
              min: Math.min(...grades),
              max: Math.max(...grades),
              count: grades.length,
            });
          }
        } catch (error) {
          console.error(`Error fetching predictions for group ${group.value}:`, error);
        }
      }

      setGroupData(fetchedData);
      setLoading(false);
    };

    fetchData();
  }, [selectedGroups]);

  return (
    <div className="compare-groups-page">
      <h1>
        <strong>Compare</strong> Predictions by <span className="highlight">Group</span>
      </h1>

      <p className="description">
        Compare grade predictions across different groups to analyze trends and patterns.
      </p>

      <div className="group-select">
        <Select
          isMulti
          options={groups}
          onChange={setSelectedGroups}
          className="react-select"
          placeholder="Select groups..."
        />
      </div>

      {loading ? (
        <div style={{ marginTop: '30px', fontStyle: 'italic' }}>Loading group data...</div>
      ) : (
        groupData.length > 0 && (
          <>
            <div className="history-header">
              <h3 className="info">
                → Comparative Table
                <span onClick={() => setShowInfo(!showInfo)}>ⓘ</span>
              </h3>
            </div>

            {showInfo && (
              <div className="info-box">
                <p>This table displays the average grade, standard deviation, minimum, maximum, and total predictions count for each selected group.</p>
              </div>
            )}

            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Group</th>
                    <th>Average Grade (%)</th>
                    <th>Standard Deviation</th>
                    <th>Min</th>
                    <th>Max</th>
                    <th>Predictions Count</th>
                  </tr>
                </thead>
                <tbody>
                  {groupData.map((g, idx) => (
                    <tr key={idx}>
                      <td>{g.group}</td>
                      <td>{g.mean}</td>
                      <td>{g.stdDev}</td>
                      <td>{g.min}</td>
                      <td>{g.max}</td>
                      <td>{g.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="charts-container">
              <div className="chart-row">
                <div className="chart">
                  <h4>Average Grades</h4>
                  <Plot
                    data={[{
                      x: groupData.map(d => d.group),
                      y: groupData.map(d => parseFloat(d.mean)),
                      type: 'bar',
                      marker: { color: '#3c66f4' },
                    }]}
                    layout={{ title: '', margin: { t: 30, l: 40, r: 30, b: 40 }, height: 300 }}
                    useResizeHandler
                    style={{ width: '100%', height: '100%' }}
                    config={{ responsive: true }}
                  />
                </div>

                <div className="chart">
                  <h4>Grades Dispersion</h4>
                  <Plot
                    data={groupData.map(g => ({
                      type: 'box',
                      name: g.group,
                      y: g.grades,
                    }))}
                    layout={{ title: '', margin: { t: 30, l: 40, r: 30, b: 40 }, height: 300 }}
                    useResizeHandler
                    style={{ width: '100%', height: '100%' }}
                    config={{ responsive: true }}
                  />
                </div>
              </div>
            </div>
          </>
        )
      )}

      <button className="back-btn" onClick={() => navigate('/gradepredictions')}>Back to Grade Predictions</button>
    </div>
  );
};

export default CompareGroups;