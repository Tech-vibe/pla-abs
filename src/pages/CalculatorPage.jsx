import { useState, useEffect } from "react";
import { getPrices } from "../utils/storage";
import CumulativeSection from "../components/CumulativeSection";
import WeightDiffSection from "../components/WeightDiffSection";

export default function CalculatorPage() {
  const [material, setMaterial] = useState("PLA");
  const [prices, setPrices]     = useState({ PLA: 2.5, ABS: 3.0 });

  // Re-read prices every time user switches to calculator
  // (in case admin updated them in the same session)
  useEffect(() => {
    setPrices(getPrices());
  }, []);

  const pricePerGram = prices[material];

  return (
    <div>
      <div className="calc-header">
        <div>
          <h1 className="calc-title">Filament <span>Cost Calculator</span></h1>
          <p style={{ color: "var(--muted)", fontSize: "13px", marginTop: "4px" }}>
            Select material, enter usage — we handle the math.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "10px" }}>
          <div className="toggle-group">
            <button
              className={`toggle-btn ${material === "PLA" ? "active" : ""}`}
              onClick={() => setMaterial("PLA")}
            >
              PLA
            </button>
            <button
              className={`toggle-btn ${material === "ABS" ? "active" : ""}`}
              onClick={() => setMaterial("ABS")}
            >
              ABS
            </button>
          </div>

          <div className="rate-badge">
            <span className="rate-label">Current rate</span>
            <span className="rate-value">₹{pricePerGram.toFixed(2)}<span style={{ fontSize: "13px", fontWeight: 400 }}>/g</span></span>
          </div>
        </div>
      </div>

      <div className="sections-grid">
        <CumulativeSection pricePerGram={pricePerGram} material={material} />
        <WeightDiffSection pricePerGram={pricePerGram} />
      </div>
    </div>
  );
}
