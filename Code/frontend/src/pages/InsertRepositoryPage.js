import React, { useState, useRef, useEffect } from 'react';
import '../styles/InsertRepositoryPage.css';
import Sidebar from '../components/SideBar';
import background from '../assets/background-dei.jpg';
import api from '../services/api'; 

function InsertRepositoryPage() {
  const [repoLink, setRepoLink] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [students, setStudents] = useState([]);
  const [studentMetrics, setStudentMetrics] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [groupInput, setGroupInput] = useState('');
  const [selectedGroupStudents, setSelectedGroupStudents] = useState([]);
  const [groups, setGroups] = useState([]);
  const [existingGroups, setExistingGroups] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [countdown, setCountdown] = useState(4);
  const [toast, setToast] = useState({ visible: false, message: '', type: '' });
  const [apiKeyError, setApiKeyError] = useState('');
  const [repoLinkError, setRepoLinkError] = useState('');


  const groupSectionRef = useRef(null);
  const toastTimeout = useRef(null);

  const showToast = (message, type = 'success') => {
    if (toastTimeout.current) clearTimeout(toastTimeout.current);
    setToast({ visible: true, message, type });
    toastTimeout.current = setTimeout(() => {
      setToast({ ...toast, visible: false });
    }, 3000);
  };

  useEffect(() => {
    api.get('/api/groups/')
      .then(res => {
        setExistingGroups(res.data.groups || []);
      })
      .catch(err => console.error('Error fetching existing groups', err));
  }, []);

  useEffect(() => {
    if (groupInput.trim()) {
      const matchingGroups = existingGroups.filter(group => 
        group.toLowerCase().includes(groupInput.toLowerCase())
      );
      setSuggestions(matchingGroups);
    } else {
      setSuggestions([]);
    }
  }, [groupInput, existingGroups]);

  const handleSuggestionClick = (suggestion) => {
    setGroupInput(suggestion);
    setSuggestions([]);
  };

const handleSubmit = () => {
  let hasError = false;
  setApiKeyError('');
  setRepoLinkError('');

  if (!apiKey.trim()) {
    setApiKeyError('API Key is required.');
    hasError = true;
  }

  const trimmedLink = repoLink.trim();
  if (!trimmedLink) {
    setRepoLinkError('Repository link is required.');
    hasError = true;
  } else if (!/^https:\/\/gitlab\.com\/.+/.test(trimmedLink)) {
    setRepoLinkError('Repository link must be a valid GitLab URL.');
    hasError = true;
  }

  if (hasError) {
    setStudents([]);
    return;
  }

  // continua com a chamada à API
  setIsLoading(true);
  setCountdown(3);

  let interval = setInterval(() => {
    setCountdown(prev => {
      if (prev === 1) clearInterval(interval);
      return prev - 1;
    });
  }, 1000);

  api.post('/api/extract_students/', {
    repo_url: trimmedLink,
    api_key: apiKey
  })
    .then(res => {
      const data = res.data;
      setIsLoading(false);
      if (data.students) {
        const extractedHandles = Object.keys(data.students);
        setStudents(extractedHandles);
        setStudentMetrics(data.students);
        setTimeout(() => {
          groupSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        setRepoLinkError('No students found in this repository.');
      }
    })
    .catch(err => {
      console.error(err);
      setIsLoading(false);
      setRepoLinkError('Error fetching students.');
    });
};


  const addOrRemoveStudent = (student) => {
    setSelectedGroupStudents(prev =>
      prev.includes(student) ? prev.filter(s => s !== student) : [...prev, student]
    );
  };

  const handleCreateGroup = () => {
    if (!groupInput.trim()) {
      showToast('Please provide a group name.', 'error');
      return;
    }

    if (selectedGroupStudents.length === 0) {
      showToast('Please select at least one student.', 'error');
      return;
    }

    const confirmSave = window.confirm(
      `Are you sure you want to save a snapshot of the group "${groupInput}" with ${selectedGroupStudents.length} student(s)?`
    );
    if (!confirmSave) return;

    setGroups(prev => [...prev, { name: groupInput, students: selectedGroupStudents }]);
    showToast(`Snapshot for group "${groupInput}" saved successfully.`);
    setGroupInput('');
    setSelectedGroupStudents([]);
    setSuggestions([]);
  };

  const handleRemoveGroup = (index) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete this snapshot?`);
    if (!confirmDelete) return;

    setGroups(prev => {
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });

    showToast(`Group snapshot deleted.`, 'info');
  };

  const studentsInGroups = groups.flatMap(g => g.students);
  const ungroupedStudents = students.filter(s => !studentsInGroups.includes(s));

  const handleSaveGroups = () => {
    if (!repoLink.trim()) {
      showToast('Repository link is required to save groups.', 'error');
      return;
    }

    const grouped = {};
    groups.forEach(({ name, students }) => {
      grouped[name] = students;
    });

    setIsSaving(true);
    api.post('/api/save_groups/', { repo_url: repoLink, groups: grouped, metrics: studentMetrics, data_base: new Date().toISOString() })
      .then(res => {
        setIsSaving(false);
        if (res.data.status === 'ok') {
          showToast('Groups saved successfully!');
        } else {
          showToast('Error saving groups.', 'error');
        }
      })
      .catch(err => {
        setIsSaving(false);
        console.error('Detailed error saving groups:', err);
        showToast(`Error saving groups: ${err.message}`, 'error');
      });
  };

  return (
    <div className="insert-repo-layout" style={{ backgroundImage: `linear-gradient(rgba(30, 58, 138, 0.4)), url(${background})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
      <Sidebar />
      <div className="blur-overlay"></div>

      {toast.visible && (
        <div className={`toast-message ${toast.type}`}>
          {toast.message}
          <button className="close-toast" onClick={() => setToast({ ...toast, visible: false })}>×</button>
        </div>
      )}

      <div className="insert-repo-page">
        <div className="insert-repo-header">
          <h1>Insert <span className="highlight">Repository Link</span></h1>
          <p className="description">Enter the GitLab repository link you want to analyze. The system will fetch the necessary data from the specified repository.</p>
        </div>

        <div className="repo-inputs">
          <div className="repo-block">
            <input
              type="text"
              placeholder="Enter your GitLab API Key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="api-key-input"
            />
            {apiKeyError && <div className="repo-error-message">{apiKeyError}</div>}
          </div>

          <div className="repo-block">
            <input
              type="text"
              placeholder="https://gitlab.com/"
              value={repoLink}
              onChange={(e) => setRepoLink(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(); }}
            />
            {repoLinkError && <div className="repo-error-message">{repoLinkError}</div>}
            <button onClick={handleSubmit}>Submit GitLab Link</button>
            {errorMessage && <div className="repo-error-message">{errorMessage}</div>}
          </div>

          {isLoading && (
            <div className="loading-message">
              <p>Fetching students... Please wait {countdown > 0 ? `${countdown}s` : ''}</p>
              <div className="spinner"></div>
            </div>
          )}
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
                  {students.map((student, idx) => (
                    <li key={idx} className={`student-item ${selectedGroupStudents.includes(student) ? 'selected' : ''}`} onClick={() => addOrRemoveStudent(student)}>
                      <span>{student}</span>
                      <button className="student-toggle-button" onClick={(e) => { e.stopPropagation(); addOrRemoveStudent(student); }}>{selectedGroupStudents.includes(student) ? '❌' : '➕'}</button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="right-column">
                <h2>Create / Edit Group</h2>
                <div className="autocomplete-container">
                  <input type="text" placeholder="Group name" value={groupInput} onChange={(e) => setGroupInput(e.target.value)} className="group-name-input" />
                  {suggestions.length > 0 && (
                    <ul className="autocomplete-suggestions">
                      {suggestions.map((suggestion, idx) => (
                        <li key={idx} onClick={() => handleSuggestionClick(suggestion)}>{suggestion}</li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="selected-students">
                  <h4>Selected Students ({selectedGroupStudents.length})</h4>
                  <ul>
                    {selectedGroupStudents.map((student, idx) => (
                      <li key={idx}><span>{student}</span><button onClick={() => addOrRemoveStudent(student)}>❌</button></li>
                    ))}
                  </ul>
                </div>
                <button className="save-group-button" onClick={handleCreateGroup}>Create / Update Group</button>
              </div>
            </div>

            {groups.length > 0 && (
              <div className="group-list">
                <h3>Created Snapshots</h3>
                {groups.map((groupEntry, idx) => (
                  <div className="group-card" key={idx}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h4>{groupEntry.name}</h4>
                      <button onClick={() => handleRemoveGroup(idx)} className="delete-group-button">❌</button>
                    </div>
                    <ul>
                      {groupEntry.students.map((student, i) => (<li key={i}>{student}</li>))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            <div style={{ marginTop: '50px', textAlign: 'center' }}>
              <button className={`save-group-button ${isSaving ? 'saving' : ''}`} onClick={handleSaveGroups} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Groups'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default InsertRepositoryPage;
