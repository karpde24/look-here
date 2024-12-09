import React from "react";
import { HashRouter as Router, Routes, Route, Link } from "react-router-dom";
import GraphPage from "./pages/GraphPage";
import DataStructurePage from "./pages/DataStructurePage";
import "./styles/App.css";

// Компонент для головної сторінки
function HomePage() {
  return (
    <main className="HomePage">
      <div className="HomePage-container">
        <Link to="/graph" className="HomePage-card">
          <h2>Your Graph Algorithm</h2>
          <button>Start</button>
        </Link>
        <Link to="/data-structure" className="HomePage-card">
          <h2>Your Data Structure</h2>
          <button>Start</button>
        </Link>
      </div>
    </main>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Internet of Things</h1>
          <p>2024</p>
        </header>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/graph" element={<GraphPage />} />
          <Route path="/data-structure" element={<DataStructurePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
