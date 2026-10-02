import { useState } from "react";
import { calcTieredCost } from "../utils/storage";

export default function CumulativeSection({ slabs }) {
  const [entries, setEntries] = useState([]);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  const totalGrams = entries.reduce((sum, e) => sum + e.grams, 0);
  const result = totalGrams > 0 ? calcTieredCost(totalGrams, slabs) : null;

  function handleAdd() {
    const val = parseFloat(input);
    if (!input || isNaN(val) || val <= 0) {
      setError("Enter a valid usage amount greater than 0g");
      return;
    }
    setError("");
    setEntries((prev) => [...prev, { id: Date.now(), grams: val }]);
    setInput("");
  }

  function handleRemove(id) {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }

  function handleClear() {
    setEntries([]);
    setInput("");
    setError("");
  }

  function handleKey(e) {
    if (e.key === "Enter") handleAdd();
  }

  // Running total grams up to each entry row
  function runningGrams(index) {
    return entries.slice(0, index + 1).reduce((sum, e) => sum + e.grams, 0);
  }

  return (
    <div className="card">
      <p className="card-title">Cumulative Usage</p>

      <div className="row" style={{ marginBottom: "6px" }}>
        <div className="field" style={{ flex: 1 }}>
          <label>Usage (grams)</label>
          <input
            className={`input ${error ? "error" : ""}`}
            type="number"
            min="0"
            step="0.1"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setError("");
            }}
            onKeyDown={handleKey}
            placeholder="e.g. 20"
          />
        </div>
        <button className="btn btn-primary" onClick={handleAdd}>
          + Add
        </button>
      </div>
      {error && <div className="warning">⚠ {error}</div>}

      <div style={{ marginTop: "20px" }}>
        {entries.length === 0 ? (
          <div className="empty-state">
            No entries yet — add filament usage above
          </div>
        ) : (
          <>
            {/* Entry rows with running grams */}
            <div className="bill-list">
              {entries.map((e, i) => {
                const cumGrams = runningGrams(i);
                const cumCost = calcTieredCost(cumGrams, slabs).total;
                return (
                  <div className="bill-row" key={e.id}>
                    <div className="bill-row-left">
                      <span className="bill-index">{i + 1}</span>
                      <div>
                        <span className="bill-grams">{e.grams}g</span>
                        <span className="bill-formula">
                          {" "}
                          · total {cumGrams.toFixed(1)}g
                        </span>
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <span className="bill-cost">₹{cumCost.toFixed(2)}</span>
                      <button
                        className="bill-remove"
                        onClick={() => handleRemove(e.id)}
                        title="Remove"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Slab breakdown */}
            {result && (
              <div style={{ marginTop: "12px" }}>
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
                          <span className="bill-grams">
                            {b.grams.toFixed(2)}g
                          </span>
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
              </div>
            )}

            {/* Grand total */}
            <div className="bill-total">
              <div>
                <div className="bill-total-label">Grand Total</div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "var(--muted)",
                    marginTop: "2px",
                  }}
                >
                  {totalGrams.toFixed(1)}g · {entries.length}{" "}
                  {entries.length === 1 ? "entry" : "entries"}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div className="bill-total-amount">
                  ₹{result ? result.total.toFixed(2) : "0.00"}
                </div>
                <button
                  className="btn btn-danger btn-sm"
                  style={{ marginTop: "8px" }}
                  onClick={handleClear}
                >
                  Clear all
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
