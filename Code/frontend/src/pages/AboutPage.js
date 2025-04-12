import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import background from '../assets/background-dei.jpg';
import logo from '../assets/logo.png';
import arrowIcon from '../assets/arrow-white.png';
import '../styles/AboutPage.css'; // CSS dedicado

const nerdFacts = [
    "There are 10 types of people in the world: those who understand binary and those who don’t.",
    "GitLab knows when you commit at 3am... so does your professor.",
    "Coffee is just a compiler for student motivation.",
    "In case of fire: git commit, git push, leave building.",
    "Why do programmers prefer dark mode? Because light attracts bugs.",
    "To understand recursion, you must first understand recursion.",
    "A SQL query walks into a bar, walks up to two tables and asks... ‘Can I join you?’",
    "I would tell you a joke about UDP... but you might not get it.",
    "404 joke not found.",
    "Real devs don’t test – they push to production and let the users test.",
    "Why did the programmer quit his job? Because he didn’t get arrays.",
    "I use Git every day. Sometimes even on purpose."
  ];
  

function AboutPage() {
  const navigate = useNavigate();
  const [fact, setFact] = useState(null);

  const showRandomFact = () => {
    const random = nerdFacts[Math.floor(Math.random() * nerdFacts.length)];
    setFact(random);
  };

  return (
    <div
      className="about-page"
      style={{
        backgroundImage: `url(${background})`,
      }}
    >
      <header className="top-bar">
        <div className="logo-area">
          <img src={logo} alt="Logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }} />
        </div>
        <div className="nav-links">
          <a onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>Home</a>
          <a onClick={() => navigate('/about')} style={{ cursor: 'pointer' }}>About</a>
        </div>
      </header>

      <div className="about-box">
        <button className="back-button" onClick={() => navigate('/')}>
          <img src={arrowIcon} alt="Back" className="arrow-icon" />
        </button>

        <h2>About the Project</h2>

        <p>
          This site was created by a team of students from the <strong>Bachelor in Engineering and Data Science</strong> at the University of Coimbra 🇵🇹.
        </p>
        <p>
          It's part of the PECD course project, aiming to help teachers understand and predict student performance based on GitLab activity.
        </p>
        <p>
          Built with React, Django, DRF, PostgreSQL, and too much caffeine.
        </p>

        <button className="surprise-button" onClick={showRandomFact}>
          Surprise me
        </button>

        {fact && <p className="fun-fact">{fact}</p>}
      </div>
    </div>
  );
}

export default AboutPage;
