import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import Plot from 'react-plotly.js';
import '../styles/CompareGroups.css';

const groupOptions = [
  { value: 'A', label: 'Group A' },
  { value: 'B', label: 'Group B' },
  { value: 'C', label: 'Group C' },
  { value: 'D', label: 'Group D' },
  { value: 'E', label: 'Group E' },
];

const chartData = [
  { group: 'A', grade: 82, confidence: 90 },
  { group: 'B', grade: 69, confidence: 80 },
  { group: 'C', grade: 58, confidence: 72 },
];

const CompareGroups = () => {
  const [selectedGroups, setSelectedGroups] = useState([]);
  const navigate = useNavigate();

  const handleCompare = () => {
    console.log('Comparing groups:', selectedGroups.map(g => g.value));
    // Aqui vais carregar dados reais, gráficos, etc.
  };

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
            <tr><td>A</td><td>82</td><td>9.4</td><td>65</td><td>94</td><td>14</td></tr>
            <tr><td>B</td><td>69</td><td>12.3</td><td>42</td><td>89</td><td>12</td></tr>
            <tr><td>C</td><td>58</td><td>15.8</td><td>28</td><td>73</td><td>11</td></tr>
          </tbody>
        </table>
        <p className="note">* Note: Group C includes predictions with confidence below 70%.</p>
      </div>

      <div className="charts-container">
        <div className="chart-row">
          <div className="chart">
            <h4>Predicted Grades by Group</h4>
            <Plot
              data={[{
                x: chartData.map(d => d.group),
                y: chartData.map(d => d.grade),
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
                x: chartData.map(d => d.group),
                y: chartData.map(d => d.confidence),
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


      <button className="back-btn" onClick={() => navigate('/gradepredictions')}>
        Back to Grade Predictions
      </button>
    </div>
  );
};

export default CompareGroups;
