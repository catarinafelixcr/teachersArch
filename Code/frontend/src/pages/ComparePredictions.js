import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Plot from 'react-plotly.js';
import '../styles/ComparePredictions.css';

const fullData = {
  '2025-04-10': [
    { name: 'Ana Martins', group: 'A', now: 91, before: 87, diff: 4, status: 'Improved' },
    { name: 'João Costa', group: 'A', now: 93, before: 94, diff: -1, status: 'Slight Drop' },
    { name: 'Beatriz Lopes', group: 'B', now: 68, before: 65, diff: 3, status: 'Improved' },
    { name: 'Rui Almeida', group: 'B', now: 48, before: 42, diff: 6, status: 'Improved' },
    { name: 'Sofia Pereira', group: 'C', now: 35, before: 28, diff: 7, status: 'Improved' },
    { name: 'Tiago Carvalho', group: 'C', now: 75, before: 73, diff: 2, status: 'Improved' }
  ],
  '2025-03-20': [
    { name: 'Ana Martins', group: 'A', now: 87, before: 84, diff: 3, status: 'Improved' },
    { name: 'João Costa', group: 'A', now: 94, before: 95, diff: -1, status: 'Slight Drop' },
    { name: 'Beatriz Lopes', group: 'B', now: 65, before: 65, diff: 0, status: 'Unchanged' },
    { name: 'Rui Almeida', group: 'B', now: 42, before: 50, diff: -8, status: 'Declined' },
    { name: 'Sofia Pereira', group: 'C', now: 28, before: 30, diff: -2, status: 'Declined' },
    { name: 'Tiago Carvalho', group: 'C', now: 73, before: 70, diff: 3, status: 'Improved' }
  ],
  '2025-02-15': [
    { name: 'Ana Martins', group: 'A', now: 84, before: 81, diff: 3, status: 'Improved' },
    { name: 'João Costa', group: 'A', now: 95, before: 94, diff: 1, status: 'Improved' },
    { name: 'Beatriz Lopes', group: 'B', now: 65, before: 60, diff: 5, status: 'Improved' },
    { name: 'Rui Almeida', group: 'B', now: 50, before: 51, diff: -1, status: 'Slight Drop' },
    { name: 'Sofia Pereira', group: 'C', now: 30, before: 32, diff: -2, status: 'Declined' },
    { name: 'Tiago Carvalho', group: 'C', now: 70, before: 66, diff: 4, status: 'Improved' }
  ],
  '2025-01-10': [
    { name: 'Ana Martins', group: 'A', now: 81, before: 79, diff: 2, status: 'Improved' },
    { name: 'João Costa', group: 'A', now: 94, before: 96, diff: -2, status: 'Slight Drop' },
    { name: 'Beatriz Lopes', group: 'B', now: 60, before: 60, diff: 0, status: 'Unchanged' },
    { name: 'Rui Almeida', group: 'B', now: 51, before: 54, diff: -3, status: 'Declined' },
    { name: 'Sofia Pereira', group: 'C', now: 32, before: 35, diff: -3, status: 'Declined' },
    { name: 'Tiago Carvalho', group: 'C', now: 66, before: 64, diff: 2, status: 'Improved' }
  ]
};

const getStats = (students) => {
  const valid = students.filter(s => typeof s.now === 'number' && typeof s.before === 'number');
  if (valid.length === 0) return { total: 0, avgNow: 0, avgBefore: 0, variation: '0%' };

  const avg = (arr) => arr.reduce((sum, s) => sum + s, 0) / arr.length;
  const avgNow = avg(valid.map(s => s.now));
  const avgBefore = avg(valid.map(s => s.before));
  const variation = ((avgNow - avgBefore) / (avgBefore || 1)) * 100;

  return {
    total: valid.length,
    avgNow: avgNow.toFixed(1),
    avgBefore: avgBefore.toFixed(1),
    variation: `${variation > 0 ? '+' : ''}${variation.toFixed(1)}%`
  };
};

const ComparePredictions = () => {
  const navigate = useNavigate();
  const datesAvailable = Object.keys(fullData);
  const hasPreviousData = datesAvailable.length > 1;

  const [selectedDate, setSelectedDate] = useState(datesAvailable[1] || '');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedTrend, setSelectedTrend] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);

  if (!hasPreviousData) {
    return (
      <div className="compare-page">
        <h1><strong>Compare</strong> Predictions <span className="highlight-box">Over the Time</span></h1>
        <p className="description" style={{ color: '#b00', fontStyle: 'italic', marginTop: '20px' }}>
          Não existem previsões registadas anteriormente. É necessário mais do que uma previsão para realizar comparações ao longo do tempo.
        </p>
        <button className="back-btn" onClick={() => navigate('/gradepredictions')}>Back to Grade Predictions</button>
      </div>
    );
  }

  const filteredStudentsCurrent = fullData[datesAvailable[0]].filter(student =>
    (!selectedGroup || student.group === selectedGroup) &&
    (!selectedTrend || student.status === selectedTrend)
  );

  const filteredStudentsPrevious = fullData[selectedDate]?.filter(student =>
    (!selectedGroup || student.group === selectedGroup) &&
    (!selectedTrend || student.status === selectedTrend)
  ) || [];

  const statsCurrent = getStats(filteredStudentsCurrent);
  const statsPrevious = getStats(filteredStudentsPrevious);

  return (
    <div className="compare-page">
      <h1><strong>Compare</strong> Predictions <span className="highlight-box">Over the Time</span></h1>
      <p className="description">
        Use this page to analyze the evolution of students' grade predictions. Select a previous date to compare
        with the most recent predictions and identify performance trends over time. You can also filter by group or trend.
      </p>

      <div className="controls-box">
        <label>
          Date of previous prediction:
          <select value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}>
            {datesAvailable.slice(1).map(date => (
              <option key={date} value={date}>{date}</option>
            ))}
          </select>
        </label>
        <select value={selectedGroup} onChange={(e) => setSelectedGroup(e.target.value)}>
          <option value="">Select a group</option>
          <option value="A">Group A</option>
          <option value="B">Group B</option>
          <option value="C">Group C</option>
        </select>
        <select value={selectedTrend} onChange={(e) => setSelectedTrend(e.target.value)}>
          <option value="">Select a tendency</option>
          <option value="Improved">Improved</option>
          <option value="Declined">Declined</option>
          <option value="Slight Drop">Slight Drop</option>
          <option value="Unchanged">Unchanged</option>
        </select>
      </div>

      <h3 className="info">Current Prediction ({datesAvailable[0]})</h3>
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
            <tr key={i} onClick={() => setSelectedStudent(s)} style={{ cursor: 'pointer' }}>
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
      {filteredStudentsPrevious.length === 0 ? (
        <p style={{ fontStyle: 'italic', color: '#b00', marginTop: '10px' }}>
          Não existem previsões registadas anteriormente.
        </p>
      ) : (
        <>
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
        </>
      )}

      <h3 className="info">Now Grade Comparison</h3>
      <table className="students-table">
        <thead>
          <tr>
            <th>Student Name</th>
            <th>Now ({datesAvailable[0]})</th>
            <th>Now ({selectedDate})</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudentsCurrent.map((studentCurrent, i) => {
            const studentPrevious = filteredStudentsPrevious.find(s => s.name === studentCurrent.name);
            return (
              <tr key={i}>
                <td>{studentCurrent.name}</td>
                <td>{studentCurrent.now}</td>
                <td>{studentPrevious ? studentPrevious.now : '-'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="buttons-footer">
        <div className="report-btn-wrapper">
          <button className="report-btn">Generate a Report</button>
        </div>
        <button className="back-btn" onClick={() => navigate('/gradepredictions')}>
          Back to Grade Predictions
        </button>
      </div>

      {selectedStudent && (
        <div className="modal-overlay" onClick={() => setSelectedStudent(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Prediction History: {selectedStudent.name}</h2>
            <p><strong>Group:</strong> {selectedStudent.group}</p>
            <Plot
              data={[
                {
                  x: datesAvailable,
                  y: datesAvailable.map(date => {
                    const entry = fullData[date].find(s => s.name === selectedStudent.name);
                    return entry ? entry.now : null;
                  }),
                  type: 'scatter',
                  mode: 'lines+markers',
                  marker: { color: '#3c66f4' },
                }
              ]}
              layout={{ title: 'Grade Over Time', height: 300 }}
              config={{ responsive: true }}
              useResizeHandler
              style={{ width: '100%', height: '100%' }}
            />
            <button onClick={() => setSelectedStudent(null)} style={{ marginTop: '16px' }}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComparePredictions;
