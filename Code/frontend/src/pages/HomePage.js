import React from "react";
import "../styles/HomePage.css";
import background from "../assets/background-dei.jpg"; // importa imagem via React
import logo from '../assets/logo.png';
import { Link } from 'react-router-dom';


function HomePage() {
  return (
    <div
      className="home-page"
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        /*height: "100vh",*/
      }}
    >
      <nav className="navbar">
      <div className="logo-area">
        <img src={logo} alt="Logo" />
      </div>
        <div className="links">
        <a href="#">Help</a>
        <a href="#">About</a>
        <Link to="/login" className="nav-button login-link">LOGIN</Link>
        <Link to="/signup" className="nav-button signup-link">SIGN UP</Link>
        </div>
      </nav>

      <div className="hero">
        <div className="card">
        <h1>
            <span className="hello">Hello</span>{" "}
            <span className="teacher">teacher</span>  !
        </h1>
        <p className="subtext">Using GitLab Data to Support Your Students</p>

        </div>
      </div>
    </div>
  );
}

export default HomePage;
