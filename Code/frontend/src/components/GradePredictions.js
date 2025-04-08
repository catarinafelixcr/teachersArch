import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/GradePredictions.css';

const students = [
  { name: 'Ana Martins', group: 'A', grade: 87, confidence: 92, date: '2025-03-25' },
  { name: 'João Costa', group: 'A', grade: 94, confidence: 96, date: '2025-03-25' },
  { name: 'Beatriz Lopes', group: 'B', grade: 65, confidence: 89, date: '2025-03-24' },
  { name: 'Rui Almeida', group: 'B', grade: 42, confidence: 75, date: '2025-03-24' },
  { name: 'Sofia Pereira', group: 'C', grade: 28, confidence: 68, date: '2025-03-23' },
  { name: 'Tiago Carvalho', group: 'C', grade: 73, confidence: 82, date: '2025-03-23' }
];

const GradePredictions = () => {
  const [selectedGroup, setSelectedGroup] = useState('All');
  const navigate = useNavigate();

  const filteredStudents =
    selectedGroup === 'All'
      ? students
      : students.filter((s) => s.group === selectedGroup);

  return (
    <div className="insert-repo-page">
      <h1>Students' Grade <span className="highlight">Predictions</span></h1>

      <select onChange={(e) => setSelectedGroup(e.target.value)}>
        <option value="All">Select Group</option>
        <option value="A">Group A</option>
        <option value="B">Group B</option>
        <option value="C">Group C</option>
      </select>

      <h3 className="info">-&gt; History of grades <span title="Histórico de previsões">&#9432;</span></h3>

      <div className="grade-table">
        <table>
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Group</th>
              <th>Predicted Grade (%)</th>
              <th>Confidence (%)</th>
              <th>Inserted On</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((s, idx) => (
              <tr key={idx}>
                <td>{s.name}</td>
                <td>{s.group}</td>
                <td>{s.grade}</td>
                <td>{s.confidence}</td>
                <td>{s.date}</td>
                <td>
                  <button onClick={() => alert(`Viewing details for ${s.name}`)}>
                    View details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 className="info">-&gt; Statistic Prediction Overview <span title="Resumo estatístico">&#9432;</span></h3>

      <div className="stats-box">
        <div>
          <p><strong>Total Predictions:</strong> {students.length}</p>
          <p><strong>Low Confidence (&lt;70%):</strong> {students.filter(s => s.confidence < 70).length}</p>
        </div>
        <div>
          <p><strong>Average Predicted Grade:</strong> 65%</p>
          <p><strong>Standard Deviation:</strong> 18.3%</p>
        </div>
      </div>

      <div className="button-group">
        <button onClick={() => navigate('/compare-groups')}>Compare Groups</button>
        <button onClick={() => navigate('/generate-report')}>Generate Report</button>
        <button onClick={() => navigate('/compare-predictions')}>Compare Predictions in Time</button>
        <button className="back-btn" onClick={() => navigate('/initialpage')}>Back to Main Dashboard</button>
      </div>
    </div>
  );
};

export default GradePredictions;
