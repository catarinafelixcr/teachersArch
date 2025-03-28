import React from "react";
import "../styles/HomePage.css";
import background from "../assets/background-dei.jpg"; // importa imagem via React

function HomePage() {
  return (
    <div
      className="page"
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
      }}
    >
      <nav className="navbar">
        <div className="logo">TEACHERS ARCH</div>
        <div className="links">
          <a href="#">Help</a>
          <a href="#">About</a>
          <a href="#">Login</a>
          <a href="#" className="signup">Sign Up</a>
        </div>
      </nav>

      <div className="hero">
        <div className="card">
        <h1>
            <span className="hello">Hello</span>{" "}
            <span className="teacher">teacher</span>!
        </h1>
        <p className="subtext">Using GitLab Data to Support Your Students</p>

        </div>
      </div>
    </div>
  );
}

export default HomePage;
