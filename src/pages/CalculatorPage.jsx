import { useState, useEffect } from "react";
import { getPrices, getSlabsForMaterial } from "../utils/storage";
import CumulativeSection from "../components/CumulativeSection";
import WeightDiffSection from "../components/WeightDiffSection";

export default function CalculatorPage() {
  const [material, setMaterial] = useState("PLA");
  const [prices, setPrices] = useState({ PLA: 3.0, ABS: 4.0 });

  useEffect(() => {
    setPrices(getPrices());
  }, []);

  const slabs = getSlabsForMaterial(material);
  const pricePerGram = prices[material];

  return (
    <div>
      <div className="calc-header">
        <div>
          <h1 className="calc-title">
            Filament <span>Cost Calculator</span>
          </h1>
          <p
            style={{
              color: "var(--muted)",
              fontSize: "13px",
              marginTop: "4px",
            }}
          >
            Select material, enter usage
          </p>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: "10px",
          }}
        >
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
        </div>
      </div>

      <div className="sections-grid">
        <CumulativeSection slabs={slabs} />
        <WeightDiffSection slabs={slabs} />
      </div>
    </div>
  );
}
