import React, { useState } from 'react';
import '../styles/ComparePredictions.css';

const fullData = {
  '2022-06-20': [
    { name: 'Ana Martins', group: 'A', now: 87, before: 84, diff: 3, status: 'Improved' },
    { name: 'João Costa', group: 'A', now: 94, before: 95, diff: -1, status: 'Slight Drop' },
    { name: 'Beatriz Lopes', group: 'B', now: 65, before: 65, diff: 0, status: 'Unchanged' },
    { name: 'Rui Almeida', group: 'B', now: 42, before: 50, diff: -8, status: 'Declined' }
  ],
  '2022-05-10': [
    { name: 'Ana Martins', group: 'A', now: 84, before: 81, diff: 3, status: 'Improved' },
    { name: 'João Costa', group: 'A', now: 95, before: 94, diff: 1, status: 'Improved' },
    { name: 'Beatriz Lopes', group: 'B', now: 65, before: 60, diff: 5, status: 'Improved' },
    { name: 'Rui Almeida', group: 'B', now: 50, before: 51, diff: -1, status: 'Slight Drop' }
  ]
};

const getStats = (students) => {
  if (students.length === 0) return { total: 0, avgNow: 0, avgBefore: 0, variation: '0%' };

  const avg = (arr) => arr.reduce((sum, s) => sum + s, 0) / arr.length;
  const avgNow = avg(students.map(s => s.now));
  const avgBefore = avg(students.map(s => s.before));
  const variation = ((avgNow - avgBefore) / (avgBefore || 1)) * 100;

  return {
    total: students.length,
    avgNow: avgNow.toFixed(1),
    avgBefore: avgBefore.toFixed(1),
    variation: `${variation > 0 ? '+' : ''}${variation.toFixed(1)}%`
  };
};

const ComparePredictions = () => {
  const [selectedDate, setSelectedDate] = useState('2022-06-20');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedTrend, setSelectedTrend] = useState('');

  const filteredStudentsCurrent = fullData['2022-06-20'].filter(student => {
    return (
      (!selectedGroup || student.group === selectedGroup) &&
      (!selectedTrend || student.status === selectedTrend)
    );
  });

  const filteredStudentsPrevious = fullData[selectedDate]?.filter(student => {
    return (
      (!selectedGroup || student.group === selectedGroup) &&
      (!selectedTrend || student.status === selectedTrend)
    );
  }) || [];

  const statsCurrent = getStats(filteredStudentsCurrent);
  const statsPrevious = getStats(filteredStudentsPrevious);

  return (
    <div className="compare-page">
      <h1>
        <strong>Compare</strong> Predictions <span className="highlight-box">Over the Time</span>
      </h1>
      <p className="description">
        Use this page to analyze the evolution of students' grade predictions. Select a previous date to compare
        with the most recent predictions and identify performance trends over time. You can also filter by group or trend.
      </p>

      <div className="controls-box">
        <label>
          Date of previous prediction:
          <select value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}>
            {Object.keys(fullData).map((date) => (
              <option key={date} value={date}>{date}</option>
            ))}
          </select>
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
          <option value="Slight Drop">Slight Drop</option>
          <option value="Unchanged">Unchanged</option>
        </select>
      </div>

      <h3 className="info">Current Prediction (2022-06-20)</h3>
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
          {filteredStudentsCurrent.map((s, i) => (
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

      <div className="summary-box" style={{ marginTop: '16px', marginBottom: '40px' }}>
        <div><strong>Total Students</strong><p>{statsCurrent.total}</p></div>
        <div><strong>Avg Now</strong><p>{statsCurrent.avgNow}</p></div>
        <div><strong>Avg Before</strong><p>{statsCurrent.avgBefore}</p></div>
        <div><strong>Change</strong><p>{statsCurrent.variation}</p></div>
      </div>

      <h3 className="info">Previous Prediction ({selectedDate})</h3>
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
          {filteredStudentsPrevious.map((s, i) => (
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

      <div className="summary-box" style={{ marginTop: '16px' }}>
        <div><strong>Total Students</strong><p>{statsPrevious.total}</p></div>
        <div><strong>Avg Now</strong><p>{statsPrevious.avgNow}</p></div>
        <div><strong>Avg Before</strong><p>{statsPrevious.avgBefore}</p></div>
        <div><strong>Change</strong><p>{statsPrevious.variation}</p></div>
      </div>

      <div className="buttons-footer">
        <button className="report-btn">Generate a Report</button>
        <button className="back-btn">Back to Grade Predictions</button>
      </div>
    </div>
  );
};

export default ComparePredictions;  