import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import Plot from 'react-plotly.js';
import '../styles/CompareGroups.css';
import api from '../services/api';

const CompareGroups = () => {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [groupData, setGroupData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showInfo, setShowInfo] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    api.get('/api/groups/')
      .then((res) => {
        if (res.data.groups) {
          setGroups(res.data.groups.map(group => ({ label: group, value: group })));
        }
      })
      .catch((error) => console.error('Error fetching groups:', error));
  }, []);

  useEffect(() => {
    if (!selectedGroup) {
      setGroupData(null);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/api/group_predictions/${selectedGroup.value}/`);
        const data = res.data;

        if (data.predictions && data.predictions.length > 0) {
          const students = data.predictions.map(p => ({
            id: p.student_id,
            grade: p.predicted_grade
          }));

          const grades = students.map(s => s.grade);
          const mean = grades.reduce((a, b) => a + b, 0) / grades.length;
          const stdDev = Math.sqrt(grades.map(g => Math.pow(g - mean, 2)).reduce((a, b) => a + b, 0) / grades.length);

          const faixaContagem = {
            '0-5': 0,
            '6-9': 0,
            '10-14': 0,
            '15-20': 0
          };

          const pointColors = [];

          students.forEach(({ grade }) => {
            if (grade <= 5) {
              faixaContagem['0-5'] += 1;
              pointColors.push('red');
            } else if (grade <= 9) {
              faixaContagem['6-9'] += 1;
              pointColors.push('orange');
            } else if (grade <= 14) {
              faixaContagem['10-14'] += 1;
              pointColors.push('gold');
            } else {
              faixaContagem['15-20'] += 1;
              pointColors.push('green');
            }
          });

          // Normalização para o radar chart
          const rawStats = [
            parseFloat(mean.toFixed(1)),
            parseFloat(stdDev.toFixed(1)),
            Math.min(...grades),
            Math.max(...grades)
          ];

          const minStat = Math.min(...rawStats);
          const maxStat = Math.max(...rawStats);
          const normalize = (val) => (maxStat - minStat === 0 ? 0 : (val - minStat) / (maxStat - minStat));

          const normalizedStats = {
            mean: normalize(rawStats[0]),
            stdDev: normalize(rawStats[1]),
            min: normalize(rawStats[2]),
            max: normalize(rawStats[3])
          };

          setGroupData({
            group: selectedGroup.value,
            grades,
            studentLabels: students.map(s => s.id),
            pointColors,
            faixaContagem,
            mean: mean.toFixed(1),
            stdDev: stdDev.toFixed(1),
            min: Math.min(...grades),
            max: Math.max(...grades),
            count: grades.length,
            radarValues: normalizedStats
          });
        }
      } catch (error) {
        console.error(`Error fetching predictions for group:`, error);
      }
      setLoading(false);
    };

    fetchData();
  }, [selectedGroup]);

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
        <strong>Analyze</strong> Predictions in <span className="highlight">One Group</span>
      </h1>

      <p className="description">
        View grade prediction distribution and statistics within a selected group, including individual student identification.
      </p>

      <div className="group-select">
        <Select
          options={groups}
          onChange={(option) => setSelectedGroup(option)}
          className="react-select"
          placeholder="Select a group..."
        />
      </div>

      {!selectedGroup && (
        <div className="warning-message">
          Please select a group to analyze.
        </div>
      )}

      {loading ? (
        <div style={{ marginTop: '30px', fontStyle: 'italic' }}>Loading group data...</div>
      ) : (
        groupData && (
          <>
            <div className="history-header">
              <h3 className="info">
                → Group Statistics
                <span onClick={() => toggleInfo('table')}>ⓘ</span>
              </h3>
            </div>

            {showInfo.table && (
              <div className="info-box">
                <p>This table shows the average grade, standard deviation, minimum, maximum, and total number of predictions within the selected group.</p>
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
                  <tr>
                    <td>{groupData.group}</td>
                    <td>{groupData.mean}</td>
                    <td>{groupData.stdDev}</td>
                    <td>{groupData.min}</td>
                    <td>{groupData.max}</td>
                    <td>{groupData.count}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {groupData?.faixaContagem && (
              <div className="interval-table">
                <h4>Grade Ranges</h4>
                <table>
                  <thead>
                    <tr>
                      <th>Range</th>
                      <th>Color</th>
                      <th>Number of Students</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td>0 - 5</td><td style={{ color: 'red' }}>Red</td><td>{groupData.faixaContagem['0-5']}</td></tr>
                    <tr><td>6 - 9</td><td style={{ color: 'orange' }}>Orange</td><td>{groupData.faixaContagem['6-9']}</td></tr>
                    <tr><td>10 - 14</td><td style={{ color: 'goldenrod' }}>Yellow</td><td>{groupData.faixaContagem['10-14']}</td></tr>
                    <tr><td>15 - 20</td><td style={{ color: 'green' }}>Green</td><td>{groupData.faixaContagem['15-20']}</td></tr>
                  </tbody>
                </table>
              </div>
            )}

            <div className="charts-container">
              <div className="chart-row">

                {/* Distribution Chart */}
                <div className="chart">
                  <h4>Grade Distribution <span className="info-icon" onClick={() => toggleInfo('distribution')}>ⓘ</span></h4>
                  {showInfo.distribution && <div className="info-box">Displays grade distribution among students in the selected group with individual student IDs and color-coded by grade range.</div>}
                  <Plot
                    data={[{
                      type: 'violin',
                      name: groupData.group,
                      y: groupData.grades,
                      text: groupData.studentLabels,
                      hoverinfo: 'y+text',
                      points: 'all',
                      marker: { color: groupData.pointColors },
                      box: { visible: true },
                      line: { color: '#444' },
                      meanline: { visible: true },
                    }]}
                    layout={{ ...commonLayout, title: 'Grade Distribution (per Student)', yaxis: { title: 'Grade (%)' } }}
                    useResizeHandler
                    style={{ width: '100%', height: '100%' }}
                    config={{ responsive: true }}
                  />
                </div>

                {/* Radar Chart Normalizado */}
                <div className="chart">
                  <h4>Normalized Group Performance Radar <span className="info-icon" onClick={() => toggleInfo('radar')}>ⓘ</span></h4>
                  {showInfo.radar && <div className="info-box">Radar chart with statistics normalized between 0 and 1 for easy comparison.</div>}
                  <Plot
                    data={[{
                      type: 'scatterpolar',
                      r: [
                        groupData?.radarValues?.mean ?? 0,
                        groupData?.radarValues?.min ?? 0,
                        groupData?.radarValues?.max ?? 0,
                        groupData?.radarValues?.stdDev ?? 0
                      ],                      
                      theta: ['Average', 'Min', 'Max', 'Std Dev'],
                      fill: 'toself',
                      name: groupData.group,
                      marker: { color: '#1e90ff' },
                    }]}
                    layout={{
                      ...commonLayout,
                      title: 'Normalized Group Performance Radar',
                      polar: {
                        radialaxis: { visible: true, range: [0, 1], tickformat: '.1f' }
                      }
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
