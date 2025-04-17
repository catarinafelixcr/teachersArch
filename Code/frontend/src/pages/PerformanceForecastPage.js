import React from 'react';
import '../styles/PerformanceForecastPage.css';
import background from '../assets/background-dei.jpg';
import logo from '../assets/logo.png';
import Sidebar from '../components/SideBar';
import { useNavigate } from 'react-router-dom';
import Plot from 'react-plotly.js';

function PerformanceForecastPage() {
  const navigate = useNavigate();

  const alunos = [
    { nome: 'Ana Beatriz Silva', curso: 'Matemática', nota: 92, categoria: 'Muito bom' },
    { nome: 'Bruno Costa', curso: 'Física', nota: 66, categoria: 'Médio' },
    { nome: 'Carla Menezes', curso: 'Química', nota: 75, categoria: 'Bom' },
    { nome: 'Diego Fernandes', curso: 'Biologia', nota: 44, categoria: 'Baixo' },
    { nome: 'Eduardo Martins', curso: 'Matemática', nota: 28, categoria: 'Muito baixo' },
    { nome: 'Fernanda Rocha', curso: 'Física', nota: 83, categoria: 'Bom' },
    { nome: 'Gustavo Almeida', curso: 'Química', nota: 95, categoria: 'Muito bom' },
    { nome: 'Helena Vasconcelos', curso: 'Biologia', nota: 59, categoria: 'Médio' },
    { nome: 'Igor Pires', curso: 'Matemática', nota: 22, categoria: 'Muito baixo' },
    { nome: 'Juliana Castro', curso: 'Física', nota: 38, categoria: 'Baixo' },
  ];

  const contagemCategorias = alunos.reduce((acc, aluno) => {
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
    'Muito baixo': '#f44336',
  };

  const coresPie = categorias.map(cat => corCategoria[cat]);

  return (
    <div className="forecast-page">
      {/* Fundo e overlay */}
      <div className="forecast-background" style={{ backgroundImage: `url(${background})` }} />
      <div className="forecast-overlay" />

      {/* Sidebar */}
      <Sidebar />

      {/* Conteúdo principal */}
      <div className="forecast-main-content">
        <header className="forecast-top-bar">
          <div className="forecast-nav-links">
            <a href="#">Help</a>
            <a href="#">About</a>
          </div>
        </header>

        <div className="forecast-header">
          <h1><span className="forecast-highlight">Forecast</span> by Category</h1>
          <p>Select a group to view performance predictions by category.</p>
        </div>

        <div className="forecast-controls">
          <select className="forecast-select">
            <option>Group A</option>
            <option>Group B</option>
            <option>Group C</option>
          </select>
        </div>

        {/* TABELA */}
        <div className="forecast-table-wrapper">
          <h2 className="forecast-table-title">Previsão de Desempenho com Cores por Categoria</h2>
          <table className="forecast-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Curso</th>
                <th>Nota (%)</th>
                <th>Categoria</th>
              </tr>
            </thead>
            <tbody>
              {alunos.map((aluno, idx) => (
                <tr key={idx} className={`categoria-${aluno.categoria.replace(/\s/g, '').toLowerCase()}`}>
                  <td>{aluno.nome}</td>
                  <td>{aluno.curso}</td>
                  <td>{aluno.nota}</td>
                  <td>{aluno.categoria}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PIE CHART */}
        <div className="forecast-piechart-wrapper">
          <h2 className="forecast-table-title">Distribuição por Categoria</h2>
          <Plot
            data={[
              {
                values: valores,
                labels: categorias,
                type: 'pie',
                marker: { colors: coresPie },
                textinfo: 'label+percent',
                insidetextorientation: 'radial',
              },
            ]}
            layout={{
              height: 400,
              width: 500,
              paper_bgcolor: 'rgba(0,0,0,0)',
              font: { color: 'white' },
            }}
          />
        </div>

        {/* BARPLOTS */}
        <div className="forecast-barcharts-wrapper">
          <h2 className="forecast-table-title">Notas de Todos os Alunos</h2>
          <Plot
            data={[
              {
                x: alunos.map(a => a.nome),
                y: alunos.map(a => a.nota),
                type: 'bar',
                marker: {
                  color: alunos.map(a => corCategoria[a.categoria]),
                },
              },
            ]}
            layout={{
              height: 400,
              width: 900,
              paper_bgcolor: 'rgba(0,0,0,0)',
              plot_bgcolor: 'rgba(0,0,0,0)',
              font: { color: 'white' },
              margin: { t: 40, b: 100 },
            }}
          />

          <h2 className="forecast-table-title">Notas do Grupo Selecionado</h2>
          <Plot
            data={[
              {
                x: alunos.slice(0, 5).map(a => a.nome),
                y: alunos.slice(0, 5).map(a => a.nota),
                type: 'bar',
                marker: {
                  color: alunos.slice(0, 5).map(a => corCategoria[a.categoria]),
                },
              },
            ]}
            layout={{
              height: 400,
              width: 900,
              paper_bgcolor: 'rgba(0,0,0,0)',
              plot_bgcolor: 'rgba(0,0,0,0)',
              font: { color: 'white' },
              margin: { t: 40, b: 100 },
            }}
          />
        </div>

        {/* CARDS */}
        <div className="forecast-category-cards">
          <div className="forecast-category-card high">High Performance</div>
          <div className="forecast-category-card medium">Medium Performance</div>
          <div className="forecast-category-card low">Low Performance</div>
        </div>

        {/* Placeholder Charts */}
        <div className="forecast-charts-section">
          <div className="forecast-chart-placeholder">[ Chart Placeholder 1 ]</div>
          <div className="forecast-chart-placeholder">[ Chart Placeholder 2 ]</div>
        </div>

        {/* Botões */}
        <div className="forecast-action-buttons">
          <button className="forecast-button">Generate Report</button>
          <button className="forecast-back-button" onClick={() => navigate('/initialpage')}>
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default PerformanceForecastPage;
