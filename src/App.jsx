import CalculatorPage from "./pages/CalculatorPage";
import "./App.css";
import logo from "./assets/logo.png";

export default function App() {
  return (
    <div className="app">
      <header className="app-header">
        <div className="header-inner">
          <div className="brand">
            <img src={logo} alt="Tinkers Lab" className="brand-logo" />
            <span className="brand-name">Tinkerer's Lab</span>
            <span className="brand-sub">Filament Calculator</span>
          </div>
        </div>
      </header>

      <main className="app-main">
        <CalculatorPage />
      </main>
    </div>
  );
}
