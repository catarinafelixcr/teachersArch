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

  const xAxisMetric = 'total_commits';
  const yAxisMetric = 'active_days';

  useEffect(() => {
    api.get('/api/groups/')
      .then(res => setGroups(res.data.groups))
      .catch(err => {
        console.error('Error fetching groups:', err);
        showToast('Error fetching group list.', 'error');
      });
  }, []);

  const [showReportModal, setShowReportModal] = useState(false);
  const [includeCharts, setIncludeCharts] = useState(true);

  // --- Toast Notification Function ---
  const showToast = (msg, type = 'info') => {
    const toast = document.createElement('div');
    toast.className = `toast-message ${type}`; 
    toast.innerHTML = `<span>${msg}</span><button class="close-toast">×</button>`;
    toast.querySelector('button').onclick = () => toast.remove();
    document.body.appendChild(toast);
    setTimeout(() => {
      if (toast.parentNode) {
        toast.remove();
      }
    }, 4000);
  };

  const handleGenerateReport = () => {
    if (!selectedGroup) {
      showToast('Please select a group first.', 'error');
      return;
    }
    setShowReportModal(true);
  };

  const confirmGeneratePDF = async () => {
    setShowReportModal(false);
    setLoading(true);

    try {
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
      doc.text(`Category Filter: ${categoryFilter}`, margin, y);
      y += 6;
      doc.text(`Generated on: ${displayDate}`, margin, y);

      if (includeCharts && filteredPredictions.length > 0) { 
        const charts = document.querySelectorAll('.chart-for-pdf'); 
        for (let chartElement of charts) {
          y += 10;
          // Give some time for chart to render if it was just updated
          await new Promise(resolve => setTimeout(resolve, 100));
          const canvas = await html2canvas(chartElement, { scale: 2, logging: false, useCORS: true });
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
      } else if (includeCharts && filteredPredictions.length === 0) {
        y += 10;
        doc.text('No chart data available to include in the report.', margin, y);
      }

      doc.save(`PerformanceForecast_${selectedGroup}_${today.toISOString().slice(0, 10)}.pdf`);
      showToast('PDF generated successfully!', 'success');
    } catch (error) {
      console.error('Error generating PDF report:', error);
      showToast('Error generating report. Please try again.', 'error');
    } finally {
      setLoading(false); 
    }
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

        const latestDate = all.reduce((max, p) => {
          const date = new Date(p.registered_at);
          return date > max ? date : max;
        }, new Date(0));

        const latest = all.filter(p =>
          new Date(p.registered_at).toDateString() === latestDate.toDateString()
        );

        setPredictions(latest);
        if (latest.length === 0 && all.length > 0) {
            showToast('No predictions found for the most recent date.', 'info');
        } else if (latest.length === 0 && all.length === 0) {
            showToast('No predictions found for this group.', 'info');
        }

      })
      .catch(err => {
        console.error('Error fetching predictions:', err);
        // ADDED: Toast for error fetching visualization data
        showToast('Error fetching visualization data. Please try again.', 'error');
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
    'Very High': '#4caf50',
    'Unknown': '#9e9e9e' 
  };

  const enrichedPredictions = predictions.map(p => {
    const grade = p.predicted_grade;
    const category = classifyCategory(grade);
    const percentage = category === 'Unknown' ? 0 : (grade / 20) * 100;
    return {
      name: p.handle ?? 'N/A',
      group: selectedGroup,
      grade: grade ?? 0,
      percentage: percentage,
      category: category,
      metrics: p.metrics || {}
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
    if (pred.category !== 'Unknown') {
      acc[pred.category] = (acc[pred.category] || 0) + 1;
    }
    return acc;
  }, {});

  const categories = Object.keys(countCategories);
  const values = Object.values(countCategories);

  const correlationData = [{
    x: filteredPredictions.map(p => p.metrics?.[xAxisMetric] ?? 0),
    y: filteredPredictions.map(p => p.metrics?.[yAxisMetric] ?? 0),
    mode: 'markers',
    type: 'scatter',
    text: filteredPredictions.map(p => `${p.name}<br>${xAxisMetric}: ${p.metrics?.[xAxisMetric] ?? 'N/A'}<br>${yAxisMetric}: ${p.metrics?.[yAxisMetric] ?? 'N/A'}<br>Category: ${p.category}`),
    marker: {
      color: filteredPredictions.map(p => categoryColors[p.category]),
      size: 10
    },
    hoverinfo: 'text'
  }];

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
                      onMouseDown={() => handleGroupSelect(group)} // Added onMouseDown for better UX
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

        {loading && <div className="loading-spinner-container"><div className="loading-spinner"></div><p>Loading...</p></div>} {/* MODIFIED: Improved loading indicator */}


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
              <div className="sort-filter-container"> {/* MODIFIED: Changed class name */}
                <div className="sort-controls"> {/* MODIFIED: Added wrapper div */}
                    <label htmlFor="sort" className="sort-label">Sort by:</label>
                    <select id="sort" value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
                    <option value="name-asc">Name (A-Z)</option>
                    <option value="name-desc">Name (Z-A)</option>
                    <option value="grade-asc">Grade (Lowest First)</option>
                    <option value="grade-desc">Grade (Highest First)</option>
                    </select>
                </div>
                <div className="filter-controls"> {/* MODIFIED: Added wrapper div */}
                    <label htmlFor="categoryFilter" className="sort-label">Category:</label> {/* MODIFIED: Removed margin-left */}
                    <select id="categoryFilter" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                    <option value="all">All</option>
                    <option value="Very High">Very High</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                    <option value="Very Low">Very Low</option>
                    </select>
                </div>
              </div>
            )}

            <div className="grade-table">
              {filteredPredictions.length === 0 ? (
                <p style={{ textAlign: 'center', fontStyle: 'italic', padding: '20px' }}>No predictions available for the selected group or filters.</p>
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
                        <td style={{ color: categoryColors[pred.category] ?? '#000', fontWeight: 'bold' }}>{pred.category}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {filteredPredictions.length > 0 && (
              <div className="charts-container">
                <div className="chart-row">
                  <div className="chart chart-for-pdf"> {/* ADDED: chart-for-pdf class */}
                    <h4>
                      Category Overview
                      <span className="info-icon" onClick={() => setShowPieInfo(!showPieInfo)}> ⓘ</span>
                    </h4>
                    {showPieInfo && (
                      <div className="info-box">
                        <p>This pie chart shows the percentage distribution of students across the different performance categories  based on their predicted grades. This helps identify the overall performance shape of the group and whether interventions are needed in lower-performing categories.</p>
                      </div>
                    )}
                    {/* console.log("Pie chart categories:", categories, "values:", values); */}
                    {categories.length > 0 && values.length > 0 ? ( // MODIFIED: Check values length too
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
                      <p style={{ textAlign: 'center', marginTop: '20px', fontStyle: 'italic' }}>Not enough data for pie chart.</p>
                    )}
                  </div>

                  <div className="chart chart-for-pdf"> {/* ADDED: chart-for-pdf class */}
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
                          tickfont: { size: 10 } // MODIFIED: Slightly smaller font for x-axis ticks
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

                <div className="chart-row">
                  <div className="chart full-width-chart chart-for-pdf"> {/* ADDED: chart-for-pdf class */}
                    <h4>
                      Metric Correlation ({formatMetricName(xAxisMetric)} vs {formatMetricName(yAxisMetric)})
                      <span className="info-icon" onClick={() => setShowCorrelationInfo(!showCorrelationInfo)}> ⓘ</span>
                    </h4>
                    {showCorrelationInfo && (
                      <div className="info-box">
                        <p>This scatter plot shows the relationship between '{formatMetricName(xAxisMetric)}' (horizontal axis) and '{formatMetricName(yAxisMetric)}' (vertical axis). Each point represents a student, colored by their predicted performance category. It helps visualize if students with higher metrics tend to fall into higher performance categories.</p>
                      </div>
                    )}
                    <Plot
                      data={correlationData}
                      layout={{
                        ...commonLayout,
                        title: `Metric Correlation by Category`,
                        xaxis: { title: formatMetricName(xAxisMetric) },
                        yaxis: { title: formatMetricName(yAxisMetric) },
                        margin: { t: 50, l: 70, r: 30, b: 60 }
                      }}
                      useResizeHandler
                      style={{ width: '100%', height: '100%' }}
                      config={{ responsive: true }}
                    />
                  </div>
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
              <p><strong>Category Filter:</strong> {categoryFilter}</p>
              <label style={{ display: 'block', margin: '10px 0' }}>
                <input
                  type="checkbox"
                  checked={includeCharts}
                  onChange={() => setIncludeCharts(!includeCharts)}
                />{' '}
                Include Charts in Report
              </label>
              <div className="modal-buttons">
                <button className="confirm-button" onClick={confirmGeneratePDF} disabled={loading}> {/* MODIFIED: Disable button while loading */}
                  {loading ? 'Generating...' : 'Generate PDF'}
                </button>
                <button className="cancel-button" onClick={() => setShowReportModal(false)} disabled={loading}>Cancel</button> {/* MODIFIED: Disable button while loading */}
              </div>
            </div>
          </div>
        )}

        <div className="button-group">
          <button onClick={handleGenerateReport} disabled={!selectedGroup || loading}>Generate Report</button> {/* MODIFIED: Disable button */}
          <button className="back-btn" onClick={() => navigate('/initialpage')} disabled={loading}>Back to Dashboard</button> {/* MODIFIED: Disable button */}
        </div>
      </div>
    </div>
  );
}

export default PerformanceForecastPage;