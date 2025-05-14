import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import Plot from 'react-plotly.js';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Plotly from 'plotly.js-dist-min';
import '../styles/CompareGroups.css';
import api from '../services/api';


const CompareGroups = () => {
  const [groups, setGroups] = useState([]);
  const [dates, setDates] = useState([]);
  const [latestDate, setLatestDate] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [baseDate, setBaseDate] = useState(null);
  const [compareDate, setCompareDate] = useState(null);
  const [groupData, setGroupData] = useState(null);
  const [comparisonData, setComparisonData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showInfo, setShowInfo] = useState({});
  const [selectedChart, setSelectedChart] = useState('bar');
  const [selectedMetric, setSelectedMetric] = useState({ value: 'prev_grade', label: 'Predicted Grade' });

  const barChartRef = useRef();
  const lineChartRef = useRef();
  const boxPlotRef = useRef();


  const classifyCategory = (grade) => {
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


  const generatePDFReport = async () => {
    try {
      const doc = new jsPDF();
      const margin = 15;
      const pageWidth = doc.internal.pageSize.getWidth();

      const today = new Date();
      const dateStr = today.toLocaleDateString('en-GB').replace(/\//g, '-');

      doc.setFontSize(16);
      doc.setTextColor(40, 40, 40);
      doc.text('Group Prediction Report', margin, 20);

      doc.setFontSize(12);
      doc.text(`Group: ${groupData.group}`, margin, 30);
      doc.text(`Generated on: ${today.toLocaleDateString('en-GB')}`, margin, 37);

      let currentY = 45;

      autoTable(doc, {
        startY: currentY,
        head: [['Average Grade', 'Standard Deviation', 'Min', 'Max', 'Total']],
        body: [[
          groupData.mean,
          groupData.stdDev,
          groupData.min,
          groupData.max,
          groupData.count
        ]]
      });

      currentY = doc.lastAutoTable.finalY + 10;

      if (groupData.faixaContagem) {
        autoTable(doc, {
          startY: currentY,
          head: [['Grade Range', 'Number of Students']],
          body: Object.entries(groupData.faixaContagem).map(([range, count]) => [range, count])
        });
        currentY = doc.lastAutoTable.finalY + 10;
      }

      if (groupData.studentNames?.length > 0 && comparisonData?.base && comparisonData?.compare) {
        const baseGrades = comparisonData.base.prev_grade.values;
        const compareGrades = comparisonData.compare.prev_grade.values;

        const studentsTable = groupData.studentNames.map((name, idx) => {
          const base = baseGrades?.[idx] ?? '-';
          const compare = compareGrades?.[idx] ?? '-';
          let trend = '➖';
          if (base != null && compare != null && !isNaN(base) && !isNaN(compare)) {
            if (compare > base) trend = '📉';
            else if (compare < base) trend = '📈';
          }

          return [
            name,
            groupData.group,
            base,
            compare,
            trend
          ];
        });

        autoTable(doc, {
          startY: currentY,
          head: [[
            'Student',
            'Group',
            `Grade (${baseDate?.label})`,
            `Grade (${compareDate?.label})`,
            'Trend'
          ]],
          body: studentsTable
        });

        currentY = doc.lastAutoTable.finalY + 10;
      }


      // Inserir gráficos como imagem (se disponíveis)
      const addPlotImage = async (ref, title) => {
        if (!ref.current) return;
        const plotNode = ref.current.querySelector('.js-plotly-plot');
        if (!plotNode) return;

        const imgData = await Plotly.toImage(plotNode, { format: 'png', width: 700, height: 400 });
        doc.addPage();
        doc.setFontSize(14);
        doc.text(title, margin, 20);
        doc.addImage(imgData, 'PNG', margin, 30, pageWidth - margin * 2, 90);
      };

      await addPlotImage(barChartRef, 'Bar Chart Comparison');
      await addPlotImage(lineChartRef, 'Line Chart Trend');
      await addPlotImage(boxPlotRef, 'Box Plot Distribution');

      doc.save(`GroupReport_${groupData.group}_${dateStr}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Check console for details.');
    }
  };



  const navigate = useNavigate();

  useEffect(() => {
    api.get('/api/groups/')
      .then((res) => {
        if (res.data.groups) {
          setGroups(res.data.groups.map(group => ({ label: group, value: group })));
        }
      })
      .catch((error) => console.error('Error fetching groups:', error));

    api.get('/api/latest_prediction_date/')
      .then(res => {
        if (res.data?.latest_date) {
          const latest = { label: res.data.latest_date, value: res.data.latest_date };
          setLatestDate(latest.value);
          setBaseDate(latest);  
        }
      });
  }, []);

  useEffect(() => {
    if (!selectedGroup) return;

    api.get(`/api/prediction_dates/${selectedGroup.value}/`)
      .then(res => {
        if (res.data?.dates) {
          const uniqueByDay = [...new Set(res.data.dates.map(d => d.split('T')[0]))];

          const formatted = uniqueByDay.map(dateStr => ({
            label: dateStr,
            value: dateStr  
          }));
                    setDates(formatted);
          if (formatted.length > 0) {
            setBaseDate(formatted[0]);
            setCompareDate(null);
          }
        } else {
          setDates([]);
          setBaseDate(null);
          setCompareDate(null);
        }
      });
  }, [selectedGroup]);

  useEffect(() => {
    if (!selectedGroup || !baseDate || !compareDate || baseDate.value === compareDate.value) return;

    setLoading(true);
    api.get(`/api/compare_predictions/${selectedGroup.value}/${baseDate.value}/${compareDate.value}/`)
      .then(res => setComparisonData(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [selectedGroup, baseDate, compareDate]);

  useEffect(() => {
    if (!selectedGroup) {
      setGroupData(null);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/api/group_predictions/${selectedGroup.value}/`);
        const data = res.data;

        if (data.predictions && data.predictions.length > 0) {
          const students = data.predictions.map(p => ({
            id: p.student_id,
            name: p.handle ?? 'N/A',
            grade: p.predicted_grade
          }));

          const grades = students.map(s => s.grade);
          const mean = grades.reduce((a, b) => a + b, 0) / grades.length;
          const stdDev = Math.sqrt(grades.map(g => Math.pow(g - mean, 2)).reduce((a, b) => a + b, 0) / grades.length);

          const faixaContagem = {
            '0-5': 0,
            '5-9': 0,
            '10-13': 0,
            '14-17': 0,
            '18-20': 0
          };

          const studentRows = [];
          const pointColors = [];

          students.forEach(({ id, name, grade }) => {
            let color = '';
            if (grade <= 5) {
              faixaContagem['0-5'] += 1;
              color = 'rgba(255, 77, 77, 0.2)';
            } else if (grade <= 9) {
              faixaContagem['5-9'] += 1;
              color = 'rgba(255, 153, 51, 0.2)';
            } else if (grade <= 13) {
              faixaContagem['10-13'] += 1;
              color = 'rgba(255, 235, 59, 0.2)';
            } else if (grade <= 17) {
              faixaContagem['14-17'] += 1;
              color = 'rgba(139, 195, 74, 0.2)';
            } else {
              faixaContagem['18-20'] += 1;
              color = 'rgba(76, 175, 80, 0.2)';
            }

            pointColors.push(color);
            studentRows.push({ id, name, grade, color }); // agora `name` está disponível
          });


          const rawStats = [
            parseFloat(mean.toFixed(1)),
            parseFloat(stdDev.toFixed(1)),
            Math.min(...grades),
            Math.max(...grades)
          ];

          const minStat = Math.min(...rawStats);
          const maxStat = Math.max(...rawStats);
          const normalize = (val) => (maxStat - minStat === 0 ? 0 : (val - minStat) / (maxStat - minStat));

          const normalizedStats = {
            mean: normalize(rawStats[0]),
            stdDev: normalize(rawStats[1]),
            min: normalize(rawStats[2]),
            max: normalize(rawStats[3])
          };

          setGroupData({
            group: selectedGroup.value,
            grades,
            studentLabels: students.map(s => s.id),
            studentNames: students.map(s => s.name),
            studentRows,
            pointColors,
            faixaContagem,
            mean: mean.toFixed(1),
            stdDev: stdDev.toFixed(1),
            min: Math.min(...grades),
            max: Math.max(...grades),
            count: grades.length,
            radarValues: normalizedStats
          });
        }
      } catch (error) {
        console.error(`Error fetching predictions for group:`, error);
      }
      setLoading(false);
    };

    fetchData();
  }, [selectedGroup]);

  const toggleInfo = (chart) => {
    setShowInfo(prev => ({ ...prev, [chart]: !prev[chart] }));
  };

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

  console.log('comparisonData:', comparisonData);
  return (
    <div className="compare-groups-page">
      <h1>
        <strong>Analyze</strong> Predictions in <span className="highlight">One Group</span>
      </h1>

      <p className="description">
        View grade prediction distribution and statistics within a selected group, including individual student identification.
      </p>

      <div className="group-select" style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <Select
          options={groups}
          onChange={(option) => setSelectedGroup(option)}
          className="react-select"
          placeholder="Select a group..."
        />

        <div className="base-date-label">
          <strong>Base Date:</strong> {baseDate?.label || 'Latest'}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span><strong>Previous Date:</strong></span>
          <Select
            options={dates.filter(d => d.value !== baseDate?.value)}
            value={compareDate}
            onChange={setCompareDate}
            placeholder="Select date"
            isDisabled={!baseDate}
            className="react-select"
          />
        </div>
      </div>

      {!selectedGroup && (
        <div className="warning-message">
          Please select a group to analyze.
        </div>
      )}

      {loading ? (
        <div style={{ marginTop: '30px', fontStyle: 'italic' }}>Loading group data...</div>
      ) : (
        groupData && (
          <>
            <div className="history-header">
              <h3 className="info">
                → Group Statistics
                <span onClick={() => toggleInfo('table')}>ⓘ</span>
              </h3>
            </div>

            {showInfo.table && (
              <div className="info-box">
                <p>This table shows the average grade, standard deviation, minimum, maximum, and total number of predictions within the selected group.</p>
              </div>
            )}

            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Group</th>
                    <th>Average Grade</th>
                    <th>Standard Deviation</th>
                    <th>Min</th>
                    <th>Max</th>
                    <th>Number of Students</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{groupData.group}</td>
                    <td>{groupData.mean}</td>
                    <td>{groupData.stdDev}</td>
                    <td>{groupData.min}</td>
                    <td>{groupData.max}</td>
                    <td>{groupData.count}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {groupData?.faixaContagem && (
              <div className="interval-table">
                <h3 className="info">
                  → Grade Ranges
                  <span onClick={() => toggleInfo('ranges')}>ⓘ</span>
                </h3>
                <table>
                  <thead>
                    <tr>
                      <th>Range</th>
                      <th>Number of Students</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ backgroundColor: 'rgba(255, 77, 77, 0.25)', textAlign: 'center' }}>
                      <td>0 - 5</td>
                      <td>{groupData.faixaContagem['0-5'] || 0}</td>
                    </tr>
                    <tr style={{ backgroundColor: 'rgba(255, 153, 51, 0.25)', textAlign: 'center' }}>
                      <td>5 - 9</td>
                      <td>{groupData.faixaContagem['5-9'] || 0}</td>
                    </tr>
                    <tr style={{ backgroundColor: 'rgba(255, 235, 59, 0.25)', textAlign: 'center' }}>
                      <td>10 - 13</td>
                      <td>{groupData.faixaContagem['10-13'] || 0}</td>
                    </tr>
                    <tr style={{ backgroundColor: 'rgba(139, 195, 74, 0.25)', textAlign: 'center' }}>
                      <td>14 - 17</td>
                      <td>{groupData.faixaContagem['14-17'] || 0}</td>
                    </tr>
                    <tr style={{ backgroundColor: 'rgba(76, 175, 80, 0.25)', textAlign: 'center' }}>
                      <td>18 - 20</td>
                      <td>{groupData.faixaContagem['18-20'] || 0}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {groupData?.studentNames && (
              <div style={{marginTop: '40px'}}>
                <h3 className="info" style={{ marginTop: '30px' }}>
                  → Individual Student Predictions
                  <span onClick={() => toggleInfo('comparison')}>ⓘ</span>
                </h3>

                <div className="student-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Student</th>
                        <th>Group</th>
                        <th>Grade ({baseDate?.label || 'Base'})</th>
                        <th>Grade ({compareDate?.label || 'Compare'})</th>
                        <th>Trend</th>
                      </tr>
                    </thead>
                    <tbody>
                      {groupData.studentNames.map((name, idx) => {
                        const group = groupData.group;
                        const baseGrade = comparisonData?.base?.prev_grade?.values?.[idx];
                        const compareGrade = comparisonData?.compare?.prev_grade?.values?.[idx];

                        let emoji = '➖';
                        if (baseGrade != null && compareGrade != null) {
                          if (compareGrade > baseGrade) emoji = '📉';
                          else if (compareGrade < baseGrade) emoji = '📈';
                        }

                        return (
                          <tr
                            key={name + idx}
                            style={{
                              backgroundColor: groupData.pointColors[idx],
                              textAlign: 'center'
                            }}
                          >
                            <td>{name}</td>
                            <td>{group}</td>
                            <td>{baseGrade ?? '-'}</td>
                            <td>{compareGrade ?? '-'}</td>
                            <td>{emoji}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}


            {comparisonData?.base && comparisonData?.compare && baseDate && compareDate && (
              <div className="charts-container" style={{textAlign: 'left', marginTop: '50px'}}>
                <h3 className="info" style={{ textAlign: 'left' }}>
                  → Comparison Chart <span onClick={() => toggleInfo('comparison')}>ⓘ</span>
                </h3>

                <Select
                  options={[
                    { value: 'prev_grade', label: 'Predicted Grade' },
                    { value: 'total_commits', label: 'Total Commits' },
                    { value: 'total_issues_created', label: 'Issues Created' },
                    { value: 'active_days', label: 'Active Days' }
                  ]}
                  value={selectedMetric}
                  onChange={(option) => setSelectedMetric(option)}
                  placeholder="Select Metric to Compare"
                  className="react-select"
                  styles={{ container: (base) => ({ ...base, width: 250, marginBottom: 20 }) }}
                />

                {showInfo.comparison && (
                  <div className="info-box">
                    Visualize key differences in group performance between the selected dates across all metrics and grades.
                  </div>
                )}

                {(() => {
                  const metric = selectedMetric.value;
                  const baseStats = comparisonData?.base?.[metric];
                  const compareStats = comparisonData?.compare?.[metric];

                  if (!baseStats || !compareStats) {
                    return <div>No data available for selected metric.</div>;
                  }

                  return (
                    <>
                      {/* Grouped Bar Chart */}
                      <div className="chart" ref={barChartRef}>
                        <div style={{ width: '100%', height: '400px' }}>
                          <Plot
                            data={[
                              {
                                x: ['Mean', 'Std Dev', 'Min', 'Max'],
                                y: [baseStats.mean, baseStats.stdDev, baseStats.min, baseStats.max],
                                name: baseDate.label,
                                type: 'bar',
                                marker: { color: '#2563eb' }
                              },
                              {
                                x: ['Mean', 'Std Dev', 'Min', 'Max'],
                                y: [compareStats.mean, compareStats.stdDev, compareStats.min, compareStats.max],
                                name: compareDate.label,
                                type: 'bar',
                                marker: { color: '#22c55e' }
                              }
                            ]}
                            layout={{
                              title: `${selectedMetric.label} Comparison`,
                              font: { family: 'Segoe UI', size: 12, color: '#1e3a8a' },
                              xaxis: { type: 'category' },
                              margin: { t: 40, l: 50, r: 20, b: 50 },
                            }}
                            config={{ responsive: true }}
                            useResizeHandler
                            style={{ width: '100%', height: '100%' }}
                          />
                        </div>
                      </div>

                      {/* Line Chart */}
                      <div className="chart" ref={lineChartRef}>
                        <div style={{ width: '100%', height: '400px' }}>
                          <Plot
                            data={[
                              {
                                x: [baseDate.label, compareDate.label],
                                y: [baseStats.mean, compareStats.mean],
                                name: 'Mean',
                                type: 'scatter',
                                mode: 'lines+markers',
                                line: { color: '#2563eb' }
                              },
                              {
                                x: [baseDate.label, compareDate.label],
                                y: [baseStats.stdDev, compareStats.stdDev],
                                name: 'Std Dev',
                                type: 'scatter',
                                mode: 'lines+markers',
                                line: { color: '#22c55e' }
                              }
                            ]}
                            layout={{
                              title: `${selectedMetric.label} Trend`,
                              font: { family: 'Segoe UI', size: 12, color: '#1e3a8a' },
                              margin: { t: 40, l: 50, r: 20, b: 50 },
                            }}
                            config={{ responsive: true }}
                            useResizeHandler
                            style={{ width: '100%', height: '100%' }}
                          />
                        </div>
                      </div>

                      {/* Box Plot */}
                      <div className="chart" ref={boxPlotRef}>
                        <div style={{ width: '100%', height: '400px' }}>
                          <Plot
                            data={[
                              {
                                y: baseStats.values,
                                name: baseDate.label,
                                type: 'box',
                                boxpoints: 'all',
                                jitter: 0.5,
                                marker: { color: '#2563eb' }
                              },
                              {
                                y: compareStats.values,
                                name: compareDate.label,
                                type: 'box',
                                boxpoints: 'all',
                                jitter: 0.5,
                                marker: { color: '#22c55e' }
                              }
                            ]}
                            layout={{
                              title: `${selectedMetric.label} Distribution`,
                              yaxis: { title: selectedMetric.label },
                              font: { family: 'Segoe UI', size: 12, color: '#1e3a8a' },
                              margin: { t: 40, l: 50, r: 20, b: 50 },
                            }}
                            config={{ responsive: true }}
                            useResizeHandler
                            style={{ width: '100%', height: '100%' }}
                          />
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            )}
          </>
        )
      )}
      {groupData && (
        <button className="generate-report-btn" onClick={generatePDFReport}>
          Generate Report PDF
        </button>
      )}

      <button className="back-btn" onClick={() => navigate('/gradepredictions')}>
        Back to Grade Predictions
      </button>
    </div>
  );
};

export default CompareGroups;
