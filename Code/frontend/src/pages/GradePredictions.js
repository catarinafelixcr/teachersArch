import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import '../styles/GradePredictions.css';
import Sidebar from '../components/SideBar';
import logo from '../assets/logo-white.png';

function GradePredictions() {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [predictions, setPredictions] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [sortOption, setSortOption] = useState('name-asc');
  const [showGeneralInfo, setShowGeneralInfo] = useState(false);
  const [showStatsInfo, setShowStatsInfo] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:8000/api/groups/', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setGroups(data.groups || []));
  }, []);

  useEffect(() => {
    if (!selectedGroup) return;
    fetch(`http://localhost:8000/api/group_predictions/${selectedGroup}/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setPredictions(data.predictions || []));
  }, [selectedGroup]);

  const handleViewDetails = (student) => setSelectedStudent(student);
  const handleCloseModal = () => setSelectedStudent(null);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setShowDropdown(true);
  };

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

  const handleGenerateReport = () => {
    if (!selectedGroup) {
      showToast('Please select a group before generating a report.', 'error');
      return;
    }
    setShowReportModal(true);
  };

  const confirmGeneratePDF = () => {
    setShowReportModal(false);
  
    try {
      if (sortedPredictions.length === 0) {
        showToast('No predictions available to generate report.', 'error');
        return;
      }
  
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });
  
      const pageHeight = doc.internal.pageSize.height;
      const pageWidth = doc.internal.pageSize.width;
      const margin = 20;
  
      const primaryColor = [41, 128, 185];
      const secondaryColor = [52, 73, 94];
      const accentColor = [39, 174, 96];
      const grayColor = [149, 165, 166];
      const lightBackground = [245, 247, 250];
  
      const today = new Date();
      const displayDate = today.toLocaleDateString('en-GB');
      const fileDate = today.toLocaleDateString('en-GB').replace(/\//g, '-');
  
      // ===== HEADER =====
      doc.setFillColor(30, 58, 138);
      doc.rect(0, 0, pageWidth, 30, 'F');
  
      doc.setFontSize(15);
      doc.setFont('arial', 'bold');
      doc.setTextColor(255, 255, 255);
      doc.text('Grade Predictions Report', margin, 20);
  
      // Logo no header
      if (logo) {
        doc.addImage(logo, 'PNG', pageWidth - margin - 25, 5, 40, 20);
      }
  
      let yPos = 40;
      doc.setFontSize(11);
      doc.setFont('arial', 'normal');
      doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      doc.text(`Group: ${selectedGroup}`, margin, yPos);
  
      yPos += 5;
      doc.setDrawColor(30, 58, 138);
      doc.setLineWidth(0.5);
      doc.line(margin, yPos, pageWidth - margin, yPos);
  
      yPos += 10;
      doc.setFontSize(10);
      doc.setFont('arial', 'normal');
      doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
      doc.text(`Generated on: ${displayDate}`, margin, yPos);
      doc.text(`Sort order: ${sortOption.replace('-', ' ').replace(/(^\w|\s\w)/g, m => m.toUpperCase())}`, pageWidth - margin, yPos, { align: 'right' });
  
      // ===== STATISTICS SECTION =====
      yPos += 15;
      const statsStartY = yPos;
      const statsHeight = 50; // reduzido
      doc.setFillColor(lightBackground[0], lightBackground[1], lightBackground[2]);
      doc.rect(margin, statsStartY, pageWidth - (margin * 2), statsHeight, 'F');
  
      yPos += 10;
      doc.setFontSize(13);
      doc.setFont('arial', 'bold');
      doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      doc.text('Summary Statistics', margin + 5, yPos);
  
      yPos += 10;
      const statsColumnWidth = (pageWidth - (margin * 2) - 10) / 3;
  
      doc.setFontSize(9);
      doc.setFont('arial', 'bold');
      doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
      doc.text('TOTAL PREDICTIONS', margin + 5, yPos);
      doc.text('AVERAGE GRADE', margin + 5 + statsColumnWidth, yPos);
      doc.text('STANDARD DEVIATION', margin + 5 + (statsColumnWidth * 2), yPos);
  
      yPos += 6;
      doc.setFontSize(12);
      doc.setFont('arial', 'bold');
      doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      doc.text(`${total}`, margin + 5, yPos);
      doc.text(`${average ?? 'N/A'}`, margin + 5 + statsColumnWidth, yPos);
      doc.text(`${stdDev ?? 'N/A'}`, margin + 5 + (statsColumnWidth * 2), yPos);
  
      yPos += 12;
      doc.setFontSize(9);
      doc.setFont('arial', 'bold');
      doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
      doc.text('HIGHEST PREDICTED GRADE', margin + 5, yPos);
      doc.text('LOWEST PREDICTED GRADE', margin + 5 + statsColumnWidth * 1.5, yPos);
  
      yPos += 6;
      doc.setFontSize(12);
      doc.setFont('arial', 'bold');
      doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      doc.text(`${highest ?? 'N/A'}`, margin + 5, yPos);
      doc.text(`${lowest ?? 'N/A'}`, margin + 5 + statsColumnWidth * 1.5, yPos);
  
      // ===== STUDENT DATA TABLE =====
      yPos += 20;
      doc.setFontSize(13);
      doc.setFont('arial', 'bold');
      doc.setTextColor(30, 58, 138);
      doc.text('Student Predictions', margin, yPos);
  
      yPos += 5;
      autoTable(doc, {
        startY: yPos,
        head: [['Student Handle', 'Predicted Grade', 'Registration Date']],
        body: sortedPredictions.map(p => [
          p.handle,
          p.predicted_grade.toFixed(1),
          new Date(p.registered_at).toLocaleDateString()
        ]),
        margin: { top: yPos, left: margin, right: margin, bottom: 40 },
        styles: {
          fontSize: 10,
          cellPadding: 3,
          font: 'arial',
          lineColor: [220, 220, 220],
          lineWidth: 0.1,
        },
        headStyles: {
          fillColor: primaryColor,
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          halign: 'left',
          fontSize: 11,
        },
        bodyStyles: {
          textColor: [70, 70, 70],
        },
        columnStyles: {
          0: { cellWidth: 'auto' },
          1: { cellWidth: 30, halign: 'center' },
          2: { cellWidth: 40, halign: 'center' },
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252],
        },
        didParseCell: (data) => {
          if (data.section === 'body' && data.column.index === 1) {
            const grade = parseFloat(data.cell.text);
            if (grade >= 10) {
              data.cell.styles.textColor = [39, 174, 96];
              data.cell.styles.textColor = [231, 76, 60];
            }
          }
        },
        didDrawPage: (data) => {
          const footerY = pageHeight - 15;
  
          doc.setFontSize(9);
          doc.setFont('arial', 'normal');
          doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
          doc.text(`Page ${data.pageNumber}`, pageWidth - margin, footerY, { align: 'right' });
  
          doc.setFontSize(9);
          doc.setFont('arial', 'italic');
          doc.text('Generated automatically by the Grade Prediction System', margin, footerY);
  
          doc.setDrawColor(220, 220, 220);
          doc.setLineWidth(0.1);
          doc.line(margin, footerY - 5, pageWidth - margin, footerY - 5);
        },
      });
  
      const filename = `GradePredictions_${selectedGroup}_${fileDate}.pdf`;
      doc.save(filename);
      showToast('PDF report generated successfully!', 'success');
  
    } catch (error) {
      console.error('Error generating PDF:', error);
      showToast('Error generating PDF report. Check console for details.', 'error');
    }
  };
  
  const showToast = (message, type = 'info') => {
    const toast = document.createElement('div');
    toast.className = `toast-message ${type}`;
    toast.innerHTML = `
      <span>${message}</span>
      <button class="close-toast">&arial;</button>
    `;
  
    toast.querySelector('.close-toast').addEventListener('click', () => {
      toast.remove();
    });
  
    document.body.appendChild(toast);
  
    setTimeout(() => {
      toast.remove();
    }, 4000);
  };  

  const filteredGroups = groups.filter(group => 
    group.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const total = predictions.length;
  const average = total > 0
    ? (predictions.reduce((sum, s) => sum + s.predicted_grade, 0) / total).toFixed(1)
    : null;
  const stdDev = total > 1
    ? Math.sqrt(
        predictions.map(s => s.predicted_grade).reduce((acc, val, _, arr) => {
          const mean = arr.reduce((a, b) => a + b) / arr.length;
          return acc + Math.pow(val - mean, 2);
        }, 0) / total
      ).toFixed(1)
    : null;
  const highest = total > 0
    ? Math.max(...predictions.map(s => s.predicted_grade))
    : null;
  const lowest = total > 0
    ? Math.min(...predictions.map(s => s.predicted_grade))
    : null;

  const sortedPredictions = [...predictions].sort((a, b) => {
    switch (sortOption) {
      case 'name-asc':
        return a.handle.localeCompare(b.handle);
      case 'name-desc':
        return b.handle.localeCompare(a.handle);
      case 'grade-asc':
        return a.predicted_grade - b.predicted_grade;
      case 'grade-desc':
        return b.predicted_grade - a.predicted_grade;
      default:
        return 0;
    }
  });

  return (
    <div className="insert-repo-page">
      <Sidebar />
      <h1>Students' Grade <span className="highlight">Predictions</span></h1>

      <div className="group-select-container">
        <div className="searchable-dropdown">
          <input
            type="text"
            placeholder="Search or select group..."
            value={searchTerm}
            onChange={handleSearchChange}
            onFocus={() => setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
          />
          {selectedGroup && (
            <button className="clear-selection" onClick={handleClearSelection}>
              ×
            </button>
          )}
          {showDropdown && (
            <ul className="group-dropdown">
              {filteredGroups.length > 0 ? (
                filteredGroups.map((group, idx) => (
                  <li 
                    key={idx} 
                    onClick={() => handleGroupSelect(group)}
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

      <div className="history-header">
        <h3 className="info">
          → History of grades
          <span onClick={() => setShowGeneralInfo(!showGeneralInfo)} className="info-icon">ⓘ</span>
        </h3>

        {selectedGroup && (
          <div className="sort-container">
            <label htmlFor="sort" className="sort-label">Sort by:</label>
            <select id="sort" value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="grade-asc">Grade (Lowest First)</option>
              <option value="grade-desc">Grade (Highest First)</option>
            </select>
          </div>
        )}
      </div>

      {showGeneralInfo && (
        <div className="info-box">
          <p>This section displays the predicted grades for each student in the selected group. 
             You can sort the data by student name or grade value using the dropdown menu.</p>
        </div>
      )}

      <div className="grade-table">
        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>Group</th>
              <th>Predicted Grade</th>
              <th>Date</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {sortedPredictions.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', fontStyle: 'italic' }}>
                  No grade predictions available.
                </td>
              </tr>
            ) : (
              sortedPredictions.map((p, idx) => (
                <tr key={idx} onClick={() => handleViewDetails(p)} className="clickable-row">
                  <td>{p.handle}</td>
                  <td>{selectedGroup}</td>
                  <td>{p.predicted_grade}</td>
                  <td>{new Date(p.registered_at).toLocaleDateString()}</td>
                  <td><button onClick={(e) => {e.stopPropagation(); handleViewDetails(p);}}>View</button></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <h3 className="info statistic-overview">
        → Statistic Overview
        <span onClick={() => setShowStatsInfo(!showStatsInfo)} className="info-icon">ⓘ</span>
      </h3>
      
      {showStatsInfo && (
        <div className="info-box">
          <p>This section provides statistical information about the predicted grades for the selected group, 
             including average grade, standard deviation, and highest/lowest predictions.</p>
        </div>
      )}
      
      <div className="stats-box">
        <p><strong>Total Predictions:</strong> {total}</p>
        <p><strong>Average Grade:</strong> {average ?? 'N/A'}</p>
        <p><strong>Standard Deviation:</strong> {stdDev ?? 'N/A'}</p>
        <p><strong>Highest Predicted Grade:</strong> {highest ?? 'N/A'}</p>
        <p><strong>Lowest Predicted Grade:</strong> {lowest ?? 'N/A'}</p>
      </div>

      <div className="button-group">
        <button onClick={() => navigate('/comparegroups')}>Compare Groups</button>
        <button onClick={handleGenerateReport} disabled={!selectedGroup || sortedPredictions.length === 0}>Generate Report</button> {/* Disable if no data */}
        <button onClick={() => navigate('/comparepredictions')}>Compare Over Time</button>
        <button className="back-btn" onClick={() => navigate('/initialpage')}>Back to Dashboard</button>
      </div>

      {/* Report Confirmation Modal */}
      {showReportModal && (
        <div className="modal-overlay" onClick={() => setShowReportModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>Confirm Report Generation</h2>
            <p><strong>Group:</strong> {selectedGroup}</p>
            {/* Display calculated stats in the modal for confirmation */}
            <p><strong>Total Predictions:</strong> {total}</p>
            <p><strong>Order:</strong> {sortOption.replace('-', ' ').toUpperCase()}</p>
            <p><strong>Preview (First 5):</strong></p>
            <ul>
              {sortedPredictions.slice(0, 5).map((p, idx) => (
                // Format grade here as well for consistency
                <li key={idx}>{p.handle} - {p.predicted_grade.toFixed(1)}</li>
              ))}
               {sortedPredictions.length > 5 && <li>... and {sortedPredictions.length - 5} more</li>}
               {sortedPredictions.length === 0 && <li>No predictions to preview.</li>}
            </ul>
            <div className="modal-buttons">
                <button className="confirm-button" onClick={confirmGeneratePDF} disabled={sortedPredictions.length === 0}>Confirm and Generate PDF</button>
                <button className="cancel-button" onClick={() => setShowReportModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {selectedStudent && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>Details for {selectedStudent.handle}</h2>
            <p><strong>Commits:</strong> {selectedStudent.metrics.total_commits}</p>
            <p><strong>Lines Added:</strong> {selectedStudent.metrics.sum_lines_added}</p>
            <p><strong>Lines Deleted:</strong> {selectedStudent.metrics.sum_lines_deleted}</p>
            <p><strong>Lines/Commit:</strong> {selectedStudent.metrics.sum_lines_per_commit}</p>
            <p><strong>Active Days:</strong> {selectedStudent.metrics.active_days}</p>
            <p><strong>Merge Requests:</strong> {selectedStudent.metrics.total_merge_requests}</p>
            <p><strong>Comments Given:</strong> {selectedStudent.metrics.review_comments_given}</p>
            <p><strong>Comments Received:</strong> {selectedStudent.metrics.review_comments_received}</p>
            <button onClick={handleCloseModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default GradePredictions;
