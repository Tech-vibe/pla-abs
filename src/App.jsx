import { useState } from "react";
import AdminPage from "./pages/AdminPage";
import CalculatorPage from "./pages/CalculatorPage";
import "./App.css";
import logo from "./assets/logo.png";

export default function App() {
  const [page, setPage] = useState("calculator");
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-inner">
          <div className="brand">
            <img src={logo} alt="Tinkers Lab" className="brand-logo" />
            <span className="brand-name">Tinkerer's Lab</span>
          </div>

          {/* Desktop nav — hidden on mobile */}
          <nav className="nav">
            <button
              className={`nav-btn ${page === "calculator" ? "active" : ""}`}
              onClick={() => setPage("calculator")}
            >
              Calculator
            </button>
            <button
              className={`nav-btn ${page === "admin" ? "active" : ""}`}
              onClick={() => setPage("admin")}
            >
              Admin
            </button>
          </nav>

          {/* Hamburger — hidden on desktop */}
          <button className="hamburger" onClick={() => setMenuOpen(p => !p)}>
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>

        {menuOpen && (
          <>
            <div className="menu-overlay" onClick={() => setMenuOpen(false)} />
            <div className="slide-menu">
              <div className="slide-menu-heading">Filament Calculator</div>
              <button
                className={`slide-menu-item ${page === "calculator" ? "active" : ""}`}
                onClick={() => { setPage("calculator"); setMenuOpen(false); }}
              >
                Calculator
              </button>
              <button
                className={`slide-menu-item ${page === "admin" ? "active" : ""}`}
                onClick={() => { setPage("admin"); setMenuOpen(false); }}
              >
                Admin
              </button>
            </div>
          </>
        )}
      </header>

      <main className="app-main">
        {page === "calculator" ? <CalculatorPage /> : <AdminPage />}
      </main>
    </div>
  );
}