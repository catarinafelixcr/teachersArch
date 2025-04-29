import React, { useState, useEffect } from 'react';
import '../styles/PerformanceForecastPage.css';
import background from '../assets/background-dei.jpg';
import Sidebar from '../components/SideBar';
import { useNavigate } from 'react-router-dom';
import Plot from 'react-plotly.js';
import api from '../services/api';

function PerformanceForecastPage() {
  const navigate = useNavigate();

  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showTableInfo, setShowTableInfo] = useState(false);
  const [showPieInfo, setShowPieInfo] = useState(false);
  const [showBarInfo, setShowBarInfo] = useState(false);

  useEffect(() => {
    api.get('/api/groups/')
      .then(res => setGroups(res.data.groups))
      .catch(err => console.error('Error fetching groups:', err));
  }, []);

  useEffect(() => {
    if (!selectedGroup) return;
    setLoading(true);
    api.get(`/api/group_predictions/${selectedGroup}/`)
      .then(res => setPredictions(res.data.predictions))
      .catch(err => console.error('Error fetching predictions:', err))
      .finally(() => setLoading(false));
  }, [selectedGroup]);

  const classifyCategoria = (nota) => {
    if (nota >= 85) return 'Muito bom';
    if (nota >= 70) return 'Bom';
    if (nota >= 50) return 'Médio';
    if (nota >= 30) return 'Baixo';
    return 'Muito baixo';
  };

  const enrichedPredictions = predictions.map(p => ({
    nome: p.handle,
    curso: selectedGroup,
    nota: (p.predicted_grade / 20) * 100,
    categoria: classifyCategoria((p.predicted_grade / 20) * 100)
  }));

  const contagemCategorias = enrichedPredictions.reduce((acc, aluno) => {
    acc[aluno.categoria] = (acc[aluno.categoria] || 0) + 1;
    return acc;
  }, {});

  const categorias = Object.keys(contagemCategorias);
  const valores = Object.values(contagemCategorias);

  const corCategoria = {
    'Muito bom': '#4CAF50',
    'Bom': '#2196F3',
    'Médio': '#4dd0e1',
    'Baixo': '#ffeb3b',
    'Muito baixo': '#f44336'
  };

  const coresPie = categorias.map(cat => corCategoria[cat]);

  return (
    <div className="insert-repo-page">
      <div className="forecast-background" style={{ backgroundImage: `url(${background})` }} />
      <div className="forecast-overlay" />

      <Sidebar />

      <div className="forecast-main-content">
        <h1><span className="highlight">Forecast</span> by Category</h1>

        <div className="group-select-container">
          <select value={selectedGroup} onChange={(e) => setSelectedGroup(e.target.value)}>
            <option value="">Select a group...</option>
            {groups.map((group, idx) => (
              <option key={idx} value={group}>{group}</option>
            ))}
          </select>
        </div>

        {loading && <p>Loading predictions...</p>}

        {selectedGroup && !loading && (
          <>
            {/* TABELA */}
            <div className="history-header">
              <h3 className="info">
                → Performance Overview
                <span onClick={() => setShowTableInfo(!showTableInfo)} className="info-icon">ⓘ</span>
              </h3>
            </div>
            {showTableInfo && (
              <div className="info-box">
                <p>This table shows the predicted grades (%) and categorized performance for each student.</p>
              </div>
            )}

            <div className="grade-table">
              {enrichedPredictions.length === 0 ? (
                <p style={{ textAlign: 'center', fontStyle: 'italic' }}>No predictions available for this group.</p>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>Grupo</th>
                      <th>Nota (%)</th>
                      <th>Categoria</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enrichedPredictions.map((aluno, idx) => (
                      <tr key={idx} className={`categoria-${aluno.categoria.replace(/\s/g, '').toLowerCase()}`}>
                        <td>{aluno.nome}</td>
                        <td>{aluno.curso}</td>
                        <td>{aluno.nota.toFixed(1)}</td>
                        <td>{aluno.categoria}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* PIE CHART */}
            <div className="history-header">
              <h3 className="info">
                → Categoria Overview
                <span onClick={() => setShowPieInfo(!showPieInfo)} className="info-icon">ⓘ</span>
              </h3>
            </div>
            {showPieInfo && (
              <div className="info-box">
                <p>This pie chart shows the distribution of students across performance categories.</p>
              </div>
            )}

            <div className="forecast-piechart-wrapper">
              <Plot
                data={[{
                  values: valores,
                  labels: categorias,
                  type: 'pie',
                  marker: { colors: coresPie },
                  textinfo: 'label+percent',
                  insidetextorientation: 'radial'
                }]}
                layout={{
                  height: 400,
                  width: 500,
                  paper_bgcolor: 'rgba(0,0,0,0)',
                  font: { color: 'black' }
                }}
              />
            </div>

            {/* BAR CHART */}
            <div className="history-header">
              <h3 className="info">
                → Individual Scores
                <span onClick={() => setShowBarInfo(!showBarInfo)} className="info-icon">ⓘ</span>
              </h3>
            </div>
            {showBarInfo && (
              <div className="info-box">
                <p>This bar chart displays the predicted scores (%) of individual students, color-coded by category.</p>
              </div>
            )}

            <div className="forecast-barcharts-wrapper">
              <Plot
                data={[{
                  x: enrichedPredictions.map(a => a.nome),
                  y: enrichedPredictions.map(a => a.nota),
                  type: 'bar',
                  marker: { color: enrichedPredictions.map(a => corCategoria[a.categoria]) }
                }]}
                layout={{
                  height: 400,
                  width: 900,
                  paper_bgcolor: 'rgba(0,0,0,0)',
                  plot_bgcolor: 'rgba(0,0,0,0)',
                  font: { color: 'black' },
                  margin: { t: 40, b: 100 }
                }}
              />
            </div>
          </>
        )}

        <div className="button-group">
          <button className="back-btn" onClick={() => navigate('/initialpage')}>Back to Dashboard</button>
        </div>
      </div>
    </div>
  );
}

export default PerformanceForecastPage;