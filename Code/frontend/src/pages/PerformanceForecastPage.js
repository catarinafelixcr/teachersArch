import React, { useState, useEffect } from 'react';
import '../styles/PerformanceForecastPage.css';
import background from '../assets/background-dei.jpg';
import Sidebar from '../components/SideBar';
import { useNavigate } from 'react-router-dom';
import Plot from 'react-plotly.js';
import api from '../services/api';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import logo from '../assets/logo-white.png'; 

function PerformanceForecastPage() {
  const navigate = useNavigate();

  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showTableInfo, setShowTableInfo] = useState(false);
  const [showPieInfo, setShowPieInfo] = useState(false);
  const [showBarInfo, setShowBarInfo] = useState(false);
  const [showCorrelationInfo, setShowCorrelationInfo] = useState(false);
  const [sortOption, setSortOption] = useState('name-asc');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // --- Optional: State for dynamic metric selection ---
  // If you want users to select metrics later, uncomment these and add dropdowns
  // const [xAxisMetric, setXAxisMetric] = useState('total_commits');
  // const [yAxisMetric, setYAxisMetric] = useState('active_days');
  // For now, we'll hardcode them for simplicity
  const xAxisMetric = 'total_commits';
  const yAxisMetric = 'active_days';
  
  useEffect(() => {
    api.get('/api/groups/')
      .then(res => setGroups(res.data.groups))
      .catch(err => console.error('Error fetching groups:', err));
  }, []);
  const [showReportModal, setShowReportModal] = useState(false);
  const [includeCharts, setIncludeCharts] = useState(true);

  const handleGenerateReport = () => {
    if (!selectedGroup) {
      showToast('Please select a group first.', 'error');
      return;
    }
    setShowReportModal(true);
  };

  const confirmGeneratePDF = async () => {
    setShowReportModal(false);

    const doc = new jsPDF('p', 'mm', 'a4');
    const margin = 15;
    const pageWidth = doc.internal.pageSize.getWidth();
    const today = new Date();
    const displayDate = today.toLocaleDateString('en-GB');

    doc.setFillColor(30, 58, 138);
    doc.rect(0, 0, pageWidth, 30, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(15);
    doc.setFont('helvetica', 'bold');
    doc.text('Performance Forecast Report', margin, 20);
    if (logo) doc.addImage(logo, 'PNG', pageWidth - 50, 5, 35, 20);

    let y = 40;
    doc.setFontSize(11);
    doc.setTextColor(30, 30, 30);
    doc.text(`Group: ${selectedGroup}`, margin, y);
    y += 6;
    doc.text(`Category: ${categoryFilter}`, margin, y);
    y += 6;
    doc.text(`Generated on: ${displayDate}`, margin, y);

    if (includeCharts) {
      const charts = document.querySelectorAll('.chart');
      for (let chart of charts) {
        y += 10;
        const canvas = await html2canvas(chart, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');
        const imgProps = doc.getImageProperties(imgData);
        const imgWidth = pageWidth - margin * 2;
        const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

        if (y + imgHeight > doc.internal.pageSize.height - 20) {
          doc.addPage();
          y = 20;
        }

        doc.addImage(imgData, 'PNG', margin, y, imgWidth, imgHeight);
        y += imgHeight;
      }
    }

    doc.save(`PerformanceForecast_${selectedGroup}_${today.toISOString().slice(0,10)}.pdf`);
    showToast('PDF generated successfully!', 'success');
  };

  const showToast = (msg, type = 'info') => {
    const toast = document.createElement('div');
    toast.className = `toast-message ${type}`;
    toast.innerHTML = `<span>${msg}</span><button class="close-toast">×</button>`;
    toast.querySelector('button').onclick = () => toast.remove();
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
  };

  useEffect(() => {
    if (!selectedGroup) {
      setPredictions([]);
      return;
    }
  
    setLoading(true);
    api.get(`/api/group_predictions/${selectedGroup}/`)
      .then(res => {
        const all = res.data.predictions || [];
  
        // Obter data mais recente
        const latestDate = all.reduce((max, p) => {
          const date = new Date(p.registered_at);
          return date > max ? date : max;
        }, new Date(0));
  
        // Filtrar apenas os dados dessa data
        const latest = all.filter(p =>
          new Date(p.registered_at).toDateString() === latestDate.toDateString()
        );
  
        setPredictions(latest);
      })
      .catch(err => {
        console.error('Error fetching predictions:', err);
        setPredictions([]);
      })
      .finally(() => setLoading(false));
  }, [selectedGroup]);
    

  const classifyCategory = (grade) => {
    if (grade === null || grade === undefined) return 'Unknown';
    const percentage = (grade / 20) * 100;
    if (percentage >= 85) return 'Very High';
    if (percentage >= 70) return 'High';
    if (percentage >= 50) return 'Medium';
    if (percentage >= 30) return 'Low';
    return 'Very Low';
  };

  const categoryColors = {
    'Very Low': '#ff4d4d',
    'Low': '#ff9933',
    'Medium': '#ffeb3b',
    'High': '#8bc34a',
    'Very High': '#4caf50'
  };

  const enrichedPredictions = predictions.map(p => {
    const grade = p.predicted_grade;
    const category = classifyCategory(grade);
    const percentage = category === 'Unknown' ? 0 : (grade / 20) * 100; // Handle unknown for percentage calc
    return {
      name: p.handle ?? 'N/A', // Use handle, provide fallback
      group: selectedGroup,
      grade: grade ?? 0, // Provide fallback for grade
      percentage: percentage,
      category: category,
      metrics: p.metrics || {} // Ensure metrics object exists
    };
  });

  const sortedPredictions = [...enrichedPredictions].sort((a, b) => {
    switch (sortOption) {
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      case 'grade-asc':
        return a.grade - b.grade;
      case 'grade-desc':
        return b.grade - a.grade;
      default:
        return 0;
    }
  });

  const filteredPredictions = sortedPredictions.filter(p => {
    if (categoryFilter === 'all') return true;
    return p.category === categoryFilter;
  });

  const filteredGroups = groups.filter(group =>
    group.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleGroupSelect = (group) => {
    setSelectedGroup(group);
    setSearchTerm(group);
    setShowDropdown(false);
  };

  const handleClearSelection = (e) => {
    e.stopPropagation();
    setSelectedGroup('');
    setSearchTerm('');
    setPredictions([]);
  };

  const countCategories = filteredPredictions.reduce((acc, pred) => {
    if (pred.category !== 'Unknown') { // Don't include Unknown in pie chart counts
        acc[pred.category] = (acc[pred.category] || 0) + 1;
    }
    return acc;
  }, {});

  const categories = Object.keys(countCategories);
  const values = Object.values(countCategories);

  const correlationData = [{
    x: filteredPredictions.map(p => p.metrics?.[xAxisMetric] ?? 0), // Access metrics safely
    y: filteredPredictions.map(p => p.metrics?.[yAxisMetric] ?? 0), // Access metrics safely
    mode: 'markers',
    type: 'scatter',
    text: filteredPredictions.map(p => `${p.name}<br>${xAxisMetric}: ${p.metrics?.[xAxisMetric] ?? 'N/A'}<br>${yAxisMetric}: ${p.metrics?.[yAxisMetric] ?? 'N/A'}<br>Category: ${p.category}`), // Tooltip text
    marker: {
      color: filteredPredictions.map(p => categoryColors[p.category]),
      size: 10 // Adjust marker size if needed
    },
    hoverinfo: 'text' // Show only the custom text on hover
  }];

  // Function to generate readable labels from metric names
  const formatMetricName = (metric) => {
      return metric.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  const commonLayout = {
    title: '',
    margin: { t: 50, l: 60, r: 30, b: 60 },
    height: 400,
    legend: { orientation: 'h', y: -0.3 },
    hovermode: 'closest',
    plot_bgcolor: '#f9f9f9',
    paper_bgcolor: '#f9f9f9',
    font: { family: 'Segoe UI', size: 12, color: '#1e3a8a' }
  };

  return (
    <div className="insert-repo-page">
      <div className="forecast-background" style={{ backgroundImage: `url(${background})` }} />
      <div className="forecast-overlay" />

      <Sidebar />

      <div className="forecast-main-content">
        <h1><span className="highlight">Performance Overview</span> by Category</h1>

        <div className="group-select-container">
          <div className="searchable-dropdown">
            <input
              type="text"
              placeholder="Search or select group..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setShowDropdown(true); }}
              onFocus={() => setShowDropdown(true)}
              onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
            />
            {selectedGroup && (
              <button className="clear-selection" onClick={handleClearSelection}>×</button>
            )}
            {showDropdown && (
              <ul className="group-dropdown">
                {filteredGroups.length > 0 ? (
                  filteredGroups.map((group, idx) => (
                    <li
                      key={idx}
                      onClick={() => handleGroupSelect(group)}
                      onMouseDown={() => handleGroupSelect(group)}
                      className={selectedGroup === group ? 'selected' : ''}
                    >
                      {group}
                    </li>
                  ))
                ) : (
                  <li className="no-results">No groups found</li>
                )}
              </ul>
            )}
          </div>
        </div>

        {loading && <p>Loading predictions...</p>}

        {selectedGroup && !loading && (
          <>
            <div className="history-header">
              <h3 className="info">→ Performance Table <span onClick={() => setShowTableInfo(!showTableInfo)} className="info-icon">ⓘ</span></h3>
            </div>

            {showTableInfo && (
              <div className="info-box">
                <p>This table shows both the predicted score (0-20) and its percentage, categorized by performance level.</p>
              </div>
            )}

            {selectedGroup && (
              <div className="sort-container">
                <label htmlFor="sort" className="sort-label">Sort by:</label>
                <select id="sort" value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
                  <option value="name-asc">Name (A-Z)</option>
                  <option value="name-desc">Name (Z-A)</option>
                  <option value="grade-asc">Grade (Lowest First)</option>
                  <option value="grade-desc">Grade (Highest First)</option>
                </select>

                <label htmlFor="categoryFilter" className="sort-label" style={{ marginLeft: '20px' }}>Category:</label>
                <select id="categoryFilter" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                  <option value="all">All</option>
                  <option value="Very High">Very High</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                  <option value="Very Low">Very Low</option>
                </select>
              </div>
            )}

            <div className="grade-table">
              {filteredPredictions.length === 0 ? (
                <p style={{ textAlign: 'center', fontStyle: 'italic' }}>No predictions available for this group.</p>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Group</th>
                      <th>Grade (0-20)</th>
                      <th>Grade (%)</th>
                      <th>Category</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPredictions.map((pred, idx) => (
                      <tr key={idx}>
                        <td>{pred.name}</td>
                        <td>{pred.group}</td>
                        <td>{pred.grade.toFixed(1)}</td>
                        <td>{pred.percentage.toFixed(1)}%</td>
                        <td style={{ color: categoryColors[pred.category], fontWeight: 'bold' }}>{pred.category}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Only show charts if there are predictions to display */}
            {filteredPredictions.length > 0 && (
                <div className="charts-container">
                <div className="chart-row">
                    {/* Pie Chart */}
                    <div className="chart">
                    <h4>
                        Category Overview
                        <span className="info-icon" onClick={() => setShowPieInfo(!showPieInfo)}> ⓘ</span>
                    </h4>
                    {showPieInfo && (
                        <div className="info-box">
                        <p>This pie chart shows the percentage distribution of students across the different performance categories  based on their predicted grades. This helps identify the overall performance shape of the group and whether interventions are needed in lower-performing categories.</p>
                        </div>
                    )}
                    console.log("Pie chart categories:", categories, "values:", values);
                    {categories.length > 0 ? (
                      <Plot
                        data={[{
                          values: values,
                          labels: categories,
                          type: 'pie',
                          marker: { colors: categories.map(c => categoryColors[c]) },
                          textinfo: 'label+percent',
                          insidetextorientation: 'radial'
                        }]}
                        layout={{
                          ...commonLayout,
                          title: 'Category Distribution',
                          margin: { t: 40, l: 30, r: 30, b: 40 },
                          height: 400,
                          showlegend: true
                        }}
                        useResizeHandler
                        style={{ width: '100%', height: '100%' }}
                        config={{ responsive: true }}
                      />
                    ) : (
                      <p style={{ textAlign: 'center', marginTop: '20px' }}>No data available for pie chart.</p>
                    )}
                    </div>

                    {/* Bar Chart */}
                    <div className="chart">
                    <h4>
                        Individual Scores (%)
                        <span className="info-icon" onClick={() => setShowBarInfo(!showBarInfo)}> ⓘ</span>
                    </h4>
                    {showBarInfo && (
                        <div className="info-box">
                        <p>This bar chart presents each student's predicted performance as a percentage (0–100%), grouped by their name and color-coded by performance category.</p>
                        </div>
                    )}
                    <Plot
                      data={[{
                        x: filteredPredictions.map(p => p.name),
                        y: filteredPredictions.map(p => p.percentage),
                        type: 'bar',
                        marker: { color: filteredPredictions.map(p => categoryColors[p.category]) }
                      }]}
                      layout={{
                        ...commonLayout,
                        title: 'Individual Scores (%)',
                        autosize: true,
                        yaxis: {
                          title: 'Grade (%)',
                          range: [0, 100]
                        },
                        xaxis: {
                          tickangle: -20,
                          automargin: true,
                          tickfont: { size: 11 }
                        },
                        bargap: 0.3,
                        margin: { t: 60, l: 60, r: 30, b: 100 }
                      }}
                      config={{ responsive: true }}
                      useResizeHandler
                      style={{ width: '100%', height: '100%' }}
                    />
                    </div>
                </div>

                {/* --- New Chart Row for Correlation Plot --- */}
                <div className="chart-row">
                    <div className="chart full-width-chart"> {/* Use full-width if desired */}
                        <h4>
                            Metric Correlation ({formatMetricName(xAxisMetric)} vs {formatMetricName(yAxisMetric)})
                            <span className="info-icon" onClick={() => setShowCorrelationInfo(!showCorrelationInfo)}> ⓘ</span>
                        </h4>
                        {showCorrelationInfo && (
                            <div className="info-box">
                            <p>This scatter plot shows the relationship between '{formatMetricName(xAxisMetric)}' (horizontal axis) and '{formatMetricName(yAxisMetric)}' (vertical axis). Each point represents a student, colored by their predicted performance category. It helps visualize if students with higher metrics tend to fall into higher performance categories.</p>
                            {/* Add dropdowns here later if you implement dynamic metric selection */}
                            </div>
                        )}
                        <Plot
                            data={correlationData}
                            layout={{
                            ...commonLayout,
                            title: `Metric Correlation by Category`,
                            xaxis: { title: formatMetricName(xAxisMetric) },
                            yaxis: { title: formatMetricName(yAxisMetric) },
                            margin: { t: 50, l: 70, r: 30, b: 60 } // Adjusted left margin for y-axis title
                            }}
                            useResizeHandler
                            style={{ width: '100%', height: '100%' }}
                            config={{ responsive: true }}
                            
                        />
                    </div>
                    {/* Add another chart here in the same row if needed, or remove full-width-chart class */}
                </div>
                </div>
            )}
          </>
        )}

        {showReportModal && (
          <div className="modal-overlay" onClick={() => setShowReportModal(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <h2>Confirm Report Generation</h2>
              <p><strong>Group:</strong> {selectedGroup}</p>
              <p><strong>Category:</strong> {categoryFilter}</p>
              <label style={{ display: 'block', margin: '10px 0' }}>
                <input
                  type="checkbox"
                  checked={includeCharts}
                  onChange={() => setIncludeCharts(!includeCharts)}
                />{' '}
                Include Charts in Report
              </label>
              <div className="modal-buttons">
                <button className="confirm-button" onClick={confirmGeneratePDF}>Generate PDF</button>
                <button className="cancel-button" onClick={() => setShowReportModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        <div className="button-group">
          <button onClick={handleGenerateReport}>Generate Report</button>
          <button className="back-btn" onClick={() => navigate('/initialpage')}>Back to Dashboard</button>
        </div>
      </div>
    </div>
  );
}

export default PerformanceForecastPage;