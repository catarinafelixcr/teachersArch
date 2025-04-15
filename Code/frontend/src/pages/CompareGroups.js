import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import Plot from 'react-plotly.js';
import '../styles/CompareGroups.css';

const groupOptions = [
  { value: 'A', label: 'Group A' },
  { value: 'B', label: 'Group B' },
  { value: 'C', label: 'Group C' },
];

const allGroupData = [
  { group: 'A', grades: [94, 87], confidence: [96, 92] },
  { group: 'B', grades: [65, 42], confidence: [89, 75] },
  { group: 'C', grades: [28, 73], confidence: [68, 82] },
];

const CompareGroups = () => {
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [warning, setWarning] = useState('');
  const navigate = useNavigate();

  const handleCompare = () => {
    const selected = selectedGroups.map(g => g.value);

    if (selected.length < 2) {
      setFilteredData([]);
      setWarning("Please select at least two groups to compare grade predictions.");
      return;
    }

    const result = allGroupData.filter(d => selected.includes(d.group));
    setFilteredData(result);
    setWarning('');
  };

  if (groupOptions.length === 0 || allGroupData.length === 0) {
    return (
      <div className="compare-groups-page">
        <h1><strong>Compare</strong> Predictions by <span className="highlight">Group</span></h1>
        <p className="description" style={{ color: '#b00', fontStyle: 'italic', marginTop: '20px' }}>
          Nenhum grupo disponível para comparação. Verifique se há alunos corretamente associados a grupos.
        </p>
        <button className="back-btn" onClick={() => navigate('/gradepredictions')}>
          Back to Grade Predictions
        </button>
      </div>
    );
  }

  return (
    <div className="compare-groups-page">
      <h1>
        <strong>Compare</strong> Predictions by <span className="highlight">Group</span>
      </h1>

      <p className="description">
        This page allows you to compare grade predictions between different groups of students.
        Use this tool to identify performance trends between groups and adjust your teaching strategies in a targeted way.
      </p>

      <label className="instruction">Please, select groups.</label>
      <div className="group-select">
        <Select
          isMulti
          options={groupOptions}
          onChange={setSelectedGroups}
          className="react-select"
          placeholder="Group A, B, C..."
        />
        <button onClick={handleCompare}>Compare</button>
      </div>

      {warning && (
        <div style={{ color: 'red', marginTop: '10px', fontStyle: 'italic' }}>
          {warning}
        </div>
      )}

      <div className="table-container">
        <h3 className="info">-&gt; Comparative Table</h3>
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
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '20px', fontStyle: 'italic', color: '#888' }}>
                  Please select at least two groups to compare.
                </td>
              </tr>
            ) : (
              filteredData.map((groupData, idx) => {
                const grades = groupData.grades;
                const mean = Math.round(grades.reduce((a, b) => a + b, 0) / grades.length);
                const stdDev = Math.round(Math.sqrt(grades.map(g => Math.pow(g - mean, 2)).reduce((a, b) => a + b, 0) / grades.length));
                const min = Math.min(...grades);
                const max = Math.max(...grades);
                return (
                  <tr key={idx}>
                    <td>{groupData.group}</td>
                    <td>{mean}</td>
                    <td>{stdDev}</td>
                    <td>{min}</td>
                    <td>{max}</td>
                    <td>{grades.length}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {filteredData.length > 0 && (
        <div className="charts-container">
          <div className="chart-row">
            <div className="chart">
              <h4>Predicted Grades by Group</h4>
              <Plot
                data={[{
                  x: filteredData.map(d => d.group),
                  y: filteredData.map(d => {
                    const sum = d.grades.reduce((a, b) => a + b, 0);
                    return Math.round(sum / d.grades.length);
                  }),
                  type: 'bar',
                  marker: { color: '#3c66f4' },
                }]}
                layout={{ title: '', margin: { t: 30, l: 40, r: 30, b: 40 }, height: 250 }}
                useResizeHandler
                style={{ width: '100%', height: '100%' }}
                config={{ responsive: true }}
              />
            </div>

            <div className="chart">
              <h4>Confidence by Group</h4>
              <Plot
                data={[{
                  x: filteredData.map(d => d.group),
                  y: filteredData.map(d => {
                    const sum = d.confidence.reduce((a, b) => a + b, 0);
                    return Math.round(sum / d.confidence.length);
                  }),
                  type: 'scatter',
                  mode: 'lines+markers',
                  marker: { color: '#8884d8' },
                }]}
                layout={{ title: '', margin: { t: 30, l: 40, r: 30, b: 40 }, height: 250 }}
                useResizeHandler
                style={{ width: '100%', height: '100%' }}
                config={{ responsive: true }}
              />
            </div>
          </div>
        </div>
      )}

      <button className="back-btn" onClick={() => navigate('/gradepredictions')}>
        Back to Grade Predictions
      </button>
    </div>
  );
};

export default CompareGroups;
