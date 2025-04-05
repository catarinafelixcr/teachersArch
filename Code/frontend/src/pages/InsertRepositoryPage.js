import React, { useState } from 'react';
import '../styles/InsertRepositoryPage.css';
import Sidebar from '../components/Sidebar';
import background from '../assets/background-dei.jpg';

function InsertRepositoryPage() {
  const [studentLink, setStudentLink] = useState('');
  const [classLink, setClassLink] = useState('');
  const [groupLink, setGroupLink] = useState('');

  const handleSubmit = (type) => {
    const selectedLink =
      type === 'student' ? studentLink : type === 'class' ? classLink : groupLink;
    alert(`Submitted ${type} link: ${selectedLink}`);
  };

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

        <h1>
          Insert Repository <span className="highlight">Link</span>
        </h1>

        <p className="description">
          Here you can enter the students' gitlab data. You must select the option you want to analyze,
          according to the type of target you want to obtain results for. You can also update the data by inserting an updated link.
        </p>

        <div className="repo-inputs">
          <div className="repo-block">
            <input
              type="text"
              placeholder="https://gitlab.com/dei-uc/pecd2025"
              value={studentLink}
              onChange={(e) => setStudentLink(e.target.value)}
            />
            <button onClick={() => handleSubmit('student')}>
              Insert student GitLab link
            </button>
          </div>

          <div className="repo-block">
            <input
              type="text"
              placeholder="https://gitlab.com/dei-uc/pecd2025"
              value={classLink}
              onChange={(e) => setClassLink(e.target.value)}
            />
            <button onClick={() => handleSubmit('class')}>
              Insert class GitLab link
            </button>
          </div>

          <div className="repo-block">
            <input
              type="text"
              placeholder="https://gitlab.com/dei-uc/pecd2025"
              value={groupLink}
              onChange={(e) => setGroupLink(e.target.value)}
            />
            <button onClick={() => handleSubmit('group')}>
              Insert group GitLab link
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InsertRepositoryPage;
