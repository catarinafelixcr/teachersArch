import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/GradePredictions.css';

const students = [
  {
    name: 'Ana Martins',
    group: 'A',
    grade: 87,
    confidence: 92,
    date: '2025-03-25',
    commits: 42,
    filesChanged: 18,
    linesAdded: 530,
    linesRemoved: 120,
    lastCommit: '2025-03-22',
    codeQuality: 'B+',
    projectStatus: 'Finalized'
  },
  {
    name: 'João Costa',
    group: 'A',
    grade: 94,
    confidence: 96,
    date: '2025-03-25',
    commits: 55,
    filesChanged: 23,
    linesAdded: 680,
    linesRemoved: 140,
    lastCommit: '2025-03-24',
    codeQuality: 'A',
    projectStatus: 'Finalized'
  },
  {
    name: 'Beatriz Lopes',
    group: 'B',
    grade: 65,
    confidence: 89,
    date: '2025-03-24',
    commits: 28,
    filesChanged: 15,
    linesAdded: 320,
    linesRemoved: 60,
    lastCommit: '2025-03-21',
    codeQuality: 'B',
    projectStatus: 'In Progress'
  },
  {
    name: 'Rui Almeida',
    group: 'B',
    grade: 42,
    confidence: 75,
    date: '2025-03-24',
    commits: 19,
    filesChanged: 10,
    linesAdded: 190,
    linesRemoved: 40,
    lastCommit: '2025-03-19',
    codeQuality: 'C',
    projectStatus: 'In Progress'
  },
  {
    name: 'Sofia Pereira',
    group: 'C',
    grade: 28,
    confidence: 68,
    date: '2025-03-23',
    commits: 11,
    filesChanged: 6,
    linesAdded: 110,
    linesRemoved: 30,
    lastCommit: '2025-03-18',
    codeQuality: 'C-',
    projectStatus: 'Incomplete'
  },
  {
    name: 'Tiago Carvalho',
    group: 'C',
    grade: 73,
    confidence: 82,
    date: '2025-03-23',
    commits: 36,
    filesChanged: 16,
    linesAdded: 450,
    linesRemoved: 100,
    lastCommit: '2025-03-21',
    codeQuality: 'B',
    projectStatus: 'Finalized'
  }
];

const GradePredictions = () => {
  const [selectedGroup, setSelectedGroup] = useState('All');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const navigate = useNavigate();

  const filteredStudents =
    selectedGroup === 'All'
      ? students
      : students.filter((s) => s.group === selectedGroup);

  const handleViewDetails = (student) => {
    setSelectedStudent(student);
  };

  const handleCloseModal = () => {
    setSelectedStudent(null);
  };

  const total = filteredStudents.length;
  const lowConfidenceCount = filteredStudents.filter(s => s.confidence < 70).length;

  const average = total > 0
    ? Math.round(filteredStudents.reduce((sum, s) => sum + s.grade, 0) / total)
    : null;

  const stdDev = total > 1
    ? Math.round(
        Math.sqrt(
          filteredStudents
            .map(s => s.grade)
            .reduce((acc, val, _, arr) => {
              const mean = arr.reduce((a, b) => a + b) / arr.length;
              return acc + Math.pow(val - mean, 2);
            }, 0) / total
        )
      )
    : null;

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
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '20px', fontStyle: 'italic', color: '#888' }}>
                  No grade predictions available.
                </td>
              </tr>
            ) : (
              filteredStudents.map((s, idx) => (
                <tr key={idx}>
                  <td>{s.name}</td>
                  <td>{s.group}</td>
                  <td>{s.grade}</td>
                  <td>{s.confidence}</td>
                  <td>{s.date}</td>
                  <td>
                    <button onClick={() => handleViewDetails(s)}>
                      View details
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <h3 className="info">-&gt; Statistic Prediction Overview <span title="Resumo estatístico">&#9432;</span></h3>

      <div className="stats-box">
        <div>
          <p><strong>Total Predictions:</strong> {total}</p>
          <p><strong>Low Confidence (&lt;70%):</strong> {lowConfidenceCount}</p>
        </div>
        <div>
          <p><strong>Average Predicted Grade:</strong> {average !== null ? `${average}%` : 'N/A'}</p>
          <p><strong>Standard Deviation:</strong> {stdDev !== null ? `${stdDev}%` : 'N/A'}</p>
        </div>
      </div>

      <div className="button-group">
        <button onClick={() => navigate('/comparegroups')}>Compare Groups</button>
        <button onClick={() => navigate('/generate-report')}>Generate Report</button>
        <button onClick={() => navigate('/comparepredictions')}>Compare Predictions in Time</button>
        <button className="back-btn" onClick={() => navigate('/initialpage')}>
          Back to Main Dashboard
        </button>
      </div>

      {/* Modal */}
      {selectedStudent && (
      <div className="modal-overlay" onClick={handleCloseModal}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <h2>Prediction Details</h2>
          <p><strong>Name:</strong> {selectedStudent.name}</p>
          <p><strong>Group:</strong> {selectedStudent.group}</p>
          <p><strong>Predicted Grade:</strong> {selectedStudent.grade}%</p>
          <p><strong>Confidence:</strong> {selectedStudent.confidence}%</p>
          <p><strong>Date:</strong> {selectedStudent.date}</p>
          <hr style={{ margin: '16px 0' }} />

          {(selectedStudent.commits === undefined ||
            selectedStudent.filesChanged === undefined ||
            selectedStudent.linesAdded === undefined ||
            selectedStudent.linesRemoved === undefined ||
            selectedStudent.lastCommit === undefined) ? (
            <p style={{ fontStyle: 'italic', color: '#777' }}>
              At the moment, there is no additional data available for this student.
            </p>
          ) : (
            <>
              <p><strong>Repository Activity:</strong> {selectedStudent.commits} commits</p>
              <p><strong>Files Changed:</strong> {selectedStudent.filesChanged}</p>
              <p><strong>Lines Added:</strong> +{selectedStudent.linesAdded}</p>
              <p><strong>Lines Removed:</strong> -{selectedStudent.linesRemoved}</p>
              <p><strong>Last Commit:</strong> {selectedStudent.lastCommit}</p>
            </>
          )}

          <button onClick={handleCloseModal}>Close</button>
        </div>
      </div>
    )}

    </div>
  );
};

export default GradePredictions;
