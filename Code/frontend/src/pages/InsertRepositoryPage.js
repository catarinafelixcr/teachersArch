import React, { useState, useRef } from 'react';
import '../styles/InsertRepositoryPage.css';
import Sidebar from '../components/SideBar';
import background from '../assets/background-dei.jpg';

function InsertRepositoryPage() {
  const [repoLink, setRepoLink] = useState('');
  const [students, setStudents] = useState([]);
  const [studentMetrics, setStudentMetrics] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [groupInput, setGroupInput] = useState('');
  const [selectedGroupStudents, setSelectedGroupStudents] = useState([]);
  const [groups, setGroups] = useState({});

  const groupSectionRef = useRef(null);

  const handleSubmit = () => {
    const trimmedLink = repoLink.trim();

    if (!trimmedLink) {
      setErrorMessage('Please enter a repository link before submitting.');
      setStudents([]);
      return;
    }

    const isValidGitLabLink = /^https:\/\/gitlab\.com\/.+/.test(trimmedLink);

    if (!isValidGitLabLink) {
      setErrorMessage('The repository link must be a valid GitLab URL starting with https://gitlab.com/');
      setStudents([]);
      return;
    }

    setErrorMessage('');
    fetch('http://localhost:8000/api/extract_students/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      },
      body: JSON.stringify({ repo_url: trimmedLink }),
    })
    
      .then((res) => res.json())
      .then((data) => {
        if (data.students) {
          const extractedHandles = Object.keys(data.students);
          setStudents(extractedHandles);
          setStudentMetrics(data.students); // guardar métricas completas
          setTimeout(() => {
            groupSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        } else {
          setErrorMessage('No students found.');
        }
      })
      .catch((err) => {
        console.error(err);
        setErrorMessage('Error fetching students.');
      });
  };

  const addOrRemoveStudent = (student) => {
    setSelectedGroupStudents((prev) =>
      prev.includes(student) ? prev.filter((s) => s !== student) : [...prev, student]
    );
  };

  const handleCreateGroup = () => {
    if (!groupInput.trim() || selectedGroupStudents.length === 0) {
      alert('Please provide a group name and select at least one student.');
      return;
    }

    const confirmSave = window.confirm(
      `Are you sure you want to ${groups[groupInput] ? 'update' : 'create'} the group "${groupInput}" with ${selectedGroupStudents.length} student(s)?`
    );

    if (!confirmSave) return;

    setGroups((prev) => ({
      ...prev,
      [groupInput]: selectedGroupStudents,
    }));

    alert(`Group "${groupInput}" saved.`);

    setGroupInput('');
    setSelectedGroupStudents([]);
  };

  const handleRemoveGroup = (groupName) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete the group "${groupName}"?`);
    if (!confirmDelete) return;

    setGroups((prev) => {
      const updated = { ...prev };
      delete updated[groupName];
      return updated;
    });
  };

  const studentsInGroups = Object.values(groups).flat();
  const ungroupedStudents = students.filter((s) => !studentsInGroups.includes(s));

  const handleSaveGroups = () => {
    if (!repoLink.trim()) {
      alert("Repository link is required to save groups.");
      return;
    }

    fetch('/api/save_groups/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        repo_url: repoLink,
        groups: groups,
        metrics: studentMetrics, // incluir métricas
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'ok') {
          alert('Groups saved successfully!');
        } else {
          alert('Error saving groups.');
        }
      })
      .catch((err) => {
        console.error(err);
        alert('Network error while saving groups.');
      });
  };

  return (
    <div
      className="insert-repo-layout"
      style={{
        backgroundImage: `linear-gradient(rgba(30, 58, 138, 0.4)), url(${background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <Sidebar />
      <div className="blur-overlay"></div>

      <div className="insert-repo-page">
        <div className="insert-repo-header">
          <h1>
            Insert <span className="highlight">Repository Link</span>
          </h1>
          <p className="description">
            Enter the GitLab repository link you want to analyze. The system will fetch the necessary data from the specified repository.
          </p>
        </div>

        <div className="repo-inputs">
          <div className="repo-block">
            <input
              type="text"
              placeholder="https://gitlab.com/dei-uc/pecd2025"
              value={repoLink}
              onChange={(e) => setRepoLink(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSubmit();
              }}
            />
            <button onClick={handleSubmit}>Submit GitLab Link</button>
            {errorMessage && (
              <div className="repo-error-message">{errorMessage}</div>
            )}
          </div>
        </div>

        {students.length > 0 && (
          <div ref={groupSectionRef}>
            <div className="grouping-table">
              <h1><span className="highlight">Associate</span> the students with a group</h1>
            </div>

            <div className="two-column-groups">
              <div className="left-column">
                <h2>Available Students</h2>
                <p><strong>Ungrouped:</strong> {ungroupedStudents.length} student(s)</p>
                <ul className="student-list">
                  {students.map((student, idx) => {
                    const isSelected = selectedGroupStudents.includes(student);
                    return (
                      <li
                        key={idx}
                        className={`student-item ${isSelected ? 'selected' : ''}`}
                        onClick={() => addOrRemoveStudent(student)}
                      >
                        <span>{student}</span>
                        <button
                          className="student-toggle-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            addOrRemoveStudent(student);
                          }}
                        >
                          {isSelected ? '❌' : '➕'}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="right-column">
                <h2>Create / Edit Group</h2>
                <input
                  type="text"
                  placeholder="Group name"
                  value={groupInput}
                  onChange={(e) => setGroupInput(e.target.value)}
                  className="group-name-input"
                />
                <div className="selected-students">
                  <h4>Selected Students ({selectedGroupStudents.length})</h4>
                  <ul>
                    {selectedGroupStudents.map((student, idx) => (
                      <li key={idx}>
                        <span>{student}</span>
                        <button onClick={() => addOrRemoveStudent(student)}>❌</button>
                      </li>
                    ))}
                  </ul>
                </div>
                <button className="save-group-button" onClick={handleCreateGroup}>
                  Create / Update Group
                </button>
              </div>
            </div>

            {Object.keys(groups).length > 0 && (
              <div className="group-list">
                <h3>Created Groups</h3>
                {Object.entries(groups).map(([groupName, members], idx) => (
                  <div className="group-card" key={idx}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h4>{groupName}</h4>
                      <button onClick={() => handleRemoveGroup(groupName)} className="delete-group-button">❌</button>
                    </div>
                    <ul>
                      {members.map((student, i) => (
                        <li key={i}>{student}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            <div style={{ marginTop: '50px', textAlign: 'center' }}>
              <button className="save-group-button" onClick={handleSaveGroups}>
                Save Groups
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default InsertRepositoryPage;