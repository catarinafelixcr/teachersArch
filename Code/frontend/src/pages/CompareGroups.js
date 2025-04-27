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
  const [showInfo, setShowInfo] = useState({});

  const navigate = useNavigate();

  const colors = [
    '#636EFA', '#EF553B', '#00CC96', '#AB63FA', '#FFA15A',
    '#19D3F3', '#FF6692', '#B6E880', '#FF97FF', '#FECB52'
  ];

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

  const toggleInfo = (chart) => {
    setShowInfo(prev => ({ ...prev, [chart]: !prev[chart] }));
  };

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
      {selectedGroups.length > 0 && selectedGroups.length < 2 && (
        <div className="warning-message">
          Only one group selected. Select at least two groups to compare.
        </div>
      )}
      {loading ? (
        <div style={{ marginTop: '30px', fontStyle: 'italic' }}>Loading group data...</div>
      ) : (
        groupData.length > 0 && (
          <>
            <div className="history-header">
              <h3 className="info">
                → Comparative Table
                <span onClick={() => toggleInfo('table')}>ⓘ</span>
              </h3>
            </div>

            {showInfo.table && (
              <div className="info-box">
                <p>This table displays the average grade, standard deviation, minimum, maximum, and total predictions count for each selected group.</p>
              </div>
            )}

            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Group</th>
                    <th>Average Grade</th>
                    <th>Standard Deviation</th>
                    <th>Min</th>
                    <th>Max</th>
                    <th>Number of Students</th>
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
                  <h4>Average Grades <span className="info-icon" onClick={() => toggleInfo('avg')}>ⓘ</span></h4>
                  {showInfo.avg && <div className="info-box">Shows the average predicted grades per group.</div>}
                  <Plot
                    data={[{
                      x: groupData.map(d => d.group),
                      y: groupData.map(d => parseFloat(d.mean)),
                      type: 'bar',
                      marker: { color: colors.slice(0, groupData.length) },
                      hoverinfo: 'x+y+text',
                      text: groupData.map(g => `Std Dev: ${g.stdDev}`),
                    }]}
                    layout={{ ...commonLayout, title: 'Average Grades per Group', yaxis: { title: 'Average (%)' }, xaxis: { title: 'Groups' } }}
                    useResizeHandler
                    style={{ width: '100%', height: '100%' }}
                    config={{ responsive: true }}
                  />
                </div>

                <div className="chart">
                  <h4>Grade Distribution Comparison <span className="info-icon" onClick={() => toggleInfo('distribution')}>ⓘ</span></h4>
                  {showInfo.distribution && <div className="info-box">Shows the distribution and density of grades per group.</div>}
                  <Plot
                    data={groupData.map((g, idx) => ({
                      type: 'violin',
                      name: g.group,
                      y: g.grades,
                      points: 'all',
                      box: { visible: true },
                      line: { color: colors[idx % colors.length] },
                      meanline: { visible: true },
                    }))}
                    layout={{ ...commonLayout, title: 'Grade Distribution Comparison', yaxis: { title: 'Grade (%)' } }}
                    useResizeHandler
                    style={{ width: '100%', height: '100%' }}
                    config={{ responsive: true }}
                  />
                </div>

                <div className="chart">
                  <h4>Group Performance Radar <span className="info-icon" onClick={() => toggleInfo('radar')}>ⓘ</span></h4>
                  {showInfo.radar && <div className="info-box">Radar view comparing mean, min, max and standard deviation per group.</div>}
                  <Plot
                    data={groupData.map((g, idx) => ({
                      type: 'scatterpolar',
                      r: [parseFloat(g.mean), parseFloat(g.min), parseFloat(g.max), parseFloat(g.stdDev)],
                      theta: ['Average', 'Min', 'Max', 'Std Dev'],
                      fill: 'toself',
                      name: g.group,
                      marker: { color: colors[idx % colors.length] },
                    }))}
                    layout={{
                      ...commonLayout,
                      title: 'Group Performance Radar',
                      polar: { radialaxis: { visible: true, range: [0, 100] } }
                    }}
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