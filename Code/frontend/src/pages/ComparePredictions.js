import React, { useState } from 'react';
import '../styles/ComparePredictions.css';

const data = {
  totalStudents: 42,
  increased: 6,
  decreased: 4,
  unchanged: 12,
  avgChange: '+6,4%',
  avgOverall: '+6,4%',
  students: [
    { name: 'Ana Martins', group: 'A', now: 87, before: 84, diff: 3, status: 'Improved' },
    { name: 'João Costa', group: 'A', now: 94, before: 95, diff: -1, status: 'Slight Drop' },
    { name: 'Beatriz Lopes', group: 'B', now: 65, before: 65, diff: 0, status: 'Unchanged' },
    { name: 'Rui Almeida', group: 'B', now: 42, before: 50, diff: -8, status: 'Declined' }
  ]
};

const ComparePredictions = () => {
  const [selectedDate, setSelectedDate] = useState('2022-06-20');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedTrend, setSelectedTrend] = useState('');

  return (
    <div className="compare-page">
      <h1>
        <strong>Compare</strong> Predictions <span className="highlight-box">Over the Time</span>
      </h1>
      <p className="description">
        Use this page to analyze the evolution of students' grade predictions. Select a previous date to compare
        with the most recent predictions and identify performance trends over time. If you want, you can select a group or the trend.
      </p>

      <div className="controls-box">
        <label>
          Date of previous prediction:
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </label>
        <select value={selectedGroup} onChange={(e) => setSelectedGroup(e.target.value)}>
          <option value="">Select a group</option>
          <option value="A">Group A</option>
          <option value="B">Group B</option>
        </select>
        <select value={selectedTrend} onChange={(e) => setSelectedTrend(e.target.value)}>
          <option value="">Select a tendency</option>
          <option value="Improved">Improved</option>
          <option value="Declined">Declined</option>
        </select>
      </div>

      <div className="summary-box">
        <div><strong>Total Students</strong><p>{data.totalStudents}</p></div>
        <div><strong>Avg. Increase ≥ 10%</strong><p>{data.increased}</p></div>
        <div><strong>Avg. Decrease ≥ 10%</strong><p>{data.decreased}</p></div>
        <div><strong>Unchanged Students</strong><p>{data.unchanged}</p></div>
        <div><strong>Average Overall Change</strong><p>{data.avgChange}</p></div>
        <div><strong>Average Overall</strong><p>{data.avgOverall}</p></div>
      </div>

      <button className="filter-btn">Show only students with &gt;= 10% change</button>

      <table className="students-table">
        <thead>
          <tr>
            <th>Student Name</th>
            <th>Group</th>
            <th>Grade (Now)</th>
            <th>Grade (Before)</th>
            <th>Difference</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {data.students.map((s, i) => (
            <tr key={i}>
              <td>{s.name}</td>
              <td>{s.group}</td>
              <td>{s.now}</td>
              <td>{s.before}</td>
              <td>{s.diff > 0 ? `+${s.diff}` : s.diff}</td>
              <td>{s.status}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="buttons-footer">
        <button className="report-btn">Generate a Report</button>
        <button className="back-btn">Back to Grade Predictions</button>
      </div>
    </div>
  );
};

export default ComparePredictions;
