import { useState } from "react";
import { calcTieredCost } from "../utils/storage";

export default function WeightDiffSection({ slabs }) {
  const [initial, setInitial] = useState("");
  const [final, setFinal] = useState("");

  const iVal = parseFloat(initial);
  const fVal = parseFloat(final);

  const bothFilled =
    initial !== "" && final !== "" && !isNaN(iVal) && !isNaN(fVal);
  const finalGtInitial = bothFilled && fVal >= iVal;
  const eitherNegative = bothFilled && (iVal < 0 || fVal < 0);

  function getWarning() {
    if (!bothFilled) return null;
    if (eitherNegative) return "Weight values cannot be negative.";
    if (fVal === iVal)
      return "Final weight equals initial weight — no filament was used.";
    if (finalGtInitial)
      return "Final weight is greater than initial weight. Please check your values.";
    return null;
  }

  const warning = getWarning();
  const gramsUsed = bothFilled && !warning ? iVal - fVal : null;
  const result = gramsUsed !== null ? calcTieredCost(gramsUsed, slabs) : null;

  function handleClear() {
    setInitial("");
    setFinal("");
  }

  return (
    <div className="card">
      <p className="card-title">Before / After Weight</p>

      <div className="flex flex-col gap-16">
        <div className="grid-2">
          <div className="field">
            <label>Initial weight (g)</label>
            <input
              className={`input ${warning && initial ? "error" : ""}`}
              type="number"
              min="0"
              step="0.1"
              value={initial}
              onChange={(e) => setInitial(e.target.value)}
              placeholder="e.g. 250"
            />
          </div>
          <div className="field">
            <label>Final weight (g)</label>
            <input
              className={`input ${warning && final ? "error" : ""}`}
              type="number"
              min="0"
              step="0.1"
              value={final}
              onChange={(e) => setFinal(e.target.value)}
              placeholder="e.g. 200"
            />
          </div>
        </div>

        {warning && <div className="warning">⚠ {warning}</div>}

        {!bothFilled && !warning && (
          <div className="empty-state">
            Enter both weights to calculate usage
          </div>
        )}

        {result && !warning && (
          <div style={{ marginTop: "4px" }}>
            {/* Slab breakdown */}
            <div
              style={{
                fontSize: "11px",
                color: "var(--muted)",
                marginBottom: "6px",
                paddingLeft: "4px",
              }}
            >
              SLAB BREAKDOWN
            </div>
            <div className="bill-list">
              {result.breakdown.map((b, i) => (
                <div
                  className="bill-row"
                  key={i}
                  style={{ background: "var(--bg)" }}
                >
                  <div className="bill-row-left">
                    <span
                      className="bill-index"
                      style={{
                        background: "none",
                        color: "var(--muted)",
                        border: "1px solid var(--border)",
                      }}
                    >
                      {i + 1}
                    </span>
                    <div>
                      <span className="bill-grams">{b.grams.toFixed(2)}g</span>
                      <span className="bill-formula">
                        {" "}
                        @ ₹{b.rate.toFixed(2)}/g ({b.label})
                      </span>
                    </div>
                  </div>
                  <span className="bill-cost">₹{b.cost.toFixed(2)}</span>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="result-box" style={{ marginTop: "12px" }}>
              <div>
                <div className="result-label">Total cost</div>
                <div className="result-grams">{gramsUsed.toFixed(2)}g used</div>
              </div>

              <div className="result-price">₹{result.total.toFixed(2)}</div>
            </div>

            {/* Right-aligned Clear All button with responsive min-width */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "12px",
              }}
            >
              <button
                className="btn btn-danger btn-sm"
                style={{ width: "17%", minWidth: "90px" }}
                onClick={handleClear}
              >
                Clear all
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
