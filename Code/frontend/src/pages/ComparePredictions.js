import React, { useState, useEffect } from 'react';
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
    api.get('/api/prediction_dates/')
      .then((res) => setDates(res.data.dates || []))
      .catch((err) => console.error('Error loading dates:', err));

    api.get('/api/groups/')
      .then((res) => setGroups(res.data.groups || []))
      .catch((err) => console.error('Error loading groups:', err));
  }, []);

  const fetchPredictions = async () => {
    try {
      const res1 = await api.get(`/api/predictions_by_date/${date1}/?group=${group}`);
      const res2 = await api.get(`/api/predictions_by_date/${date2}/?group=${group}`);
      setPredictions1(res1.data.predictions || []);
      setPredictions2(res2.data.predictions || []);
    } catch (error) {
      console.error('Error fetching predictions:', error);
    }
  };

  const handleCompare = async () => {
    if (!date1 || !date2 || !group) {
      alert("Please select both dates and a group.");
      return;
    }
  
    try {
      const res1 = await api.get(`/api/predictions_by_date/${date1}/?group=${group}`);
      const res2 = await api.get(`/api/predictions_by_date/${date2}/?group=${group}`);
  
      setPredictions1(res1.data.predictions || []);
      setPredictions2(res2.data.predictions || []);
  
      if ((res1.data.predictions || []).length === 0 || (res2.data.predictions || []).length === 0) {
        alert("One of the selected dates has no data to compare.");
      }
    } catch (error) {
      console.error('Error fetching predictions:', error);
    }
  };
  

  const getDiff = (handle) => {
    const p1 = predictions1.find(p => p.handle === handle);
    const p2 = predictions2.find(p => p.handle === handle);
    if (!p1 || !p2) return 'N/A';
    const diff = (p2.predicted_grade - p1.predicted_grade).toFixed(1);
    return diff > 0 ? `+${diff}` : diff;
  };

  const allHandles = Array.from(new Set([...predictions1, ...predictions2].map(p => p.handle)));

  return (
    <div className="compare-page">
      <Sidebar />
      <h1>Compare Predictions Over Time</h1>

      <div className="compare-controls">
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

        <button onClick={handleCompare}>Compare</button>
        <button onClick={() => navigate('/gradepredictions')}>Back</button>
      </div>

      {predictions1.length > 0 && predictions2.length > 0 && (
        <table className="compare-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>{date1}</th>
              <th>{date2}</th>
              <th>Difference</th>
            </tr>
          </thead>
          <tbody>
            {allHandles.map((handle) => {
              const p1 = predictions1.find(p => p.handle === handle);
              const p2 = predictions2.find(p => p.handle === handle);
              return (
                <tr key={handle}>
                  <td>{handle}</td>
                  <td>{p1?.predicted_grade ?? 'N/A'}</td>
                  <td>{p2?.predicted_grade ?? 'N/A'}</td>
                  <td>{getDiff(handle)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ComparePredictions;
