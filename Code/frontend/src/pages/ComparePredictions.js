// ComparePredictions.js com novo layout atualizado
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/SideBar';
import api from '../services/api';
import '../styles/ComparePredictions.css';

function ComparePredictions() {
  const [groups, setGroups] = useState([]);
  const [dates, setDates] = useState([]);
  const [group, setGroup] = useState('');
  const [date1, setDate1] = useState('');
  const [date2, setDate2] = useState('');
  const [predictions1, setPredictions1] = useState([]);
  const [predictions2, setPredictions2] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/api/groups/').then(res => setGroups(res.data.groups || []));
    api.get('/api/prediction_dates/').then(res => setDates(res.data.dates || []));
  }, []);

  const handleCompare = async () => {
    if (!group || !date1 || !date2) {
      alert('Please select a group and two dates.');
      return;
    }
    if (date1 === date2) {
      alert('Please select two different dates.');
      return;
    }
    try {
      const res1 = await api.get(`/api/predictions_by_date/${date1}/?group=${group}`);
      const res2 = await api.get(`/api/predictions_by_date/${date2}/?group=${group}`);
      setPredictions1(res1.data.predictions || []);
      setPredictions2(res2.data.predictions || []);
    } catch (err) {
      console.error('Error fetching predictions:', err);
    }
  };

  const getDiff = (handle) => {
    const p1 = predictions1.find(p => p.handle === handle);
    const p2 = predictions2.find(p => p.handle === handle);
    if (!p1) return 'Novo aluno';
    if (!p2) return 'Sem dados';
    const diff = (p2.predicted_grade - p1.predicted_grade).toFixed(1);
    return diff > 0 ? `+${diff}` : diff;
  };

  const allHandles = Array.from(new Set([
    ...predictions1.map(p => p.handle),
    ...predictions2.map(p => p.handle)
  ])).sort();

  return (
    <div className="insert-repo-page">
      <Sidebar />
      <h1>Compare <span className="highlight">Predictions Over Time</span></h1>

      <div className="top-controls">
        <select value={group} onChange={(e) => setGroup(e.target.value)}>
          <option value="">Select group</option>
          {groups.map((g, idx) => (
            <option key={idx} value={g}>{g}</option>
          ))}
        </select>

        <select value={date1} onChange={(e) => setDate1(e.target.value)}>
          <option value="">Select first date</option>
          {dates.map(d => <option key={d} value={d}>{d}</option>)}
        </select>

        <select value={date2} onChange={(e) => setDate2(e.target.value)}>
          <option value="">Select second date</option>
          {dates.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      <div className="compare-button-container">
        <button className="primary-button" onClick={handleCompare}>Compare</button>
      </div>

      <div className="grade-table">
        <table className="compare-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Grade ({date1})</th>
              <th>Grade ({date2})</th>
              <th>Difference</th>
            </tr>
          </thead>
          <tbody>
            {allHandles.map((handle) => {
              const p1 = predictions1.find(p => p.handle === handle);
              const p2 = predictions2.find(p => p.handle === handle);
              const diff = parseFloat(getDiff(handle));
              const rowClass = !isNaN(diff) && Math.abs(diff) >= 2 ? 'highlight-row' : '';

              return (
                <tr key={handle} className={rowClass}>
                  <td>{handle}</td>
                  <td>{p1?.predicted_grade ?? 'N/A'}</td>
                  <td>{p2?.predicted_grade ?? 'N/A'}</td>
                  <td>{getDiff(handle)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="bottom-back">
        <button className="back-btn" onClick={() => navigate('/gradepredictions')}>⬅ Back</button>
      </div>
    </div>
  );
}

export default ComparePredictions;
