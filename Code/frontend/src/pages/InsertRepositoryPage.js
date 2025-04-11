import React, { useState } from 'react';
import '../styles/InsertRepositoryPage.css';
import Sidebar from '../components/Sidebar';
import background from '../assets/background-dei.jpg';
// import { Search } from 'lucide-react'; // Commented out for now

function InsertRepositoryPage() {
  const [repoLink, setRepoLink] = useState('');
  const [students, setStudents] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  // const [groups, setGroups] = useState(['Group A', 'Group B']);
  // const [groupInput, setGroupInput] = useState('');
  // const [selectedStudents, setSelectedStudents] = useState([]);
  // const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = () => {
    const trimmedLink = repoLink.trim();

    if (!repoLink.trim()) {
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

    // Clear error
    setErrorMessage('');

    // Simulate fetch
    setStudents([
      'Ana Silva',
      'Bruno Costa',
      'Carla Mendes',
      'Daniel Rocha',
      'Eduarda Pinto',
    ]);
  };

  // const handleCreateGroup = () => {
  //   if (!groupInput || selectedStudents.length === 0) {
  //     alert('Please provide a group name and select at least one student.');
  //     return;
  //   }

  //   alert(`Group "${groupInput}" updated with ${selectedStudents.length} student(s).`);

  //   if (!groups.includes(groupInput)) {
  //     setGroups([...groups, groupInput]);
  //   }

  //   setGroupInput('');
  //   setSelectedStudents([]);
  // };

  // const toggleStudent = (name) => {
  //   setSelectedStudents((prev) =>
  //     prev.includes(name)
  //       ? prev.filter((n) => n !== name)
  //       : [...prev, name]
  //   );
  // };

  // const filteredStudents = students.filter((name) =>
  //   name.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  return (
    <div
      className="insert-repo-layout"
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <Sidebar />
      <div className="insert-repo-page">
        <div className="blue-overlay"></div>

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
            />
            <button onClick={handleSubmit}>Submit GitLab Link</button>
            {errorMessage && (
              <div className="repo-error-message">
                ⚠️ {errorMessage}
              </div>
            )}
          </div>
        </div>

        {/* 
        {students.length > 0 && (
          <div className="grouping-table">
            <h1>
              Assign <span className="highlight">Students to a Group</span>
            </h1>

            <div className="group-controls">
              <input
                type="text"
                placeholder="Group name"
                value={groupInput}
                onChange={(e) => setGroupInput(e.target.value)}
                list="group-suggestions"
              />
              <datalist id="group-suggestions">
                {groups.map((g, idx) => (
                  <option key={idx} value={g} />
                ))}
              </datalist>
              <button onClick={handleCreateGroup}>Create / Update Group</button>
            </div>

            <div className="search-bar">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search student..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <table className="student-table">
              <thead>
                <tr>
                  <th>Select</th>
                  <th>Student Name</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student, idx) => (
                  <tr key={idx}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedStudents.includes(student)}
                        onChange={() => toggleStudent(student)}
                      />
                    </td>
                    <td>{student}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        */}
      </div>
    </div>
  );
}

export default InsertRepositoryPage;
