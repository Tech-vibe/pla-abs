import { useState } from "react";

export default function CumulativeSection({ pricePerGram, material }) {
  const [entries, setEntries] = useState([]);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  const totalGrams = entries.reduce((sum, e) => sum + e.grams, 0);
  const totalCost = totalGrams * pricePerGram;

  function handleAdd() {
    const val = parseFloat(input);
    if (!input || isNaN(val) || val <= 0) {
      setError("Enter a valid usage amount greater than 0g");
      return;
    }
    setError("");
    setEntries(prev => [...prev, { id: Date.now(), grams: val }]);
    setInput("");
  }

  function handleRemove(id) {
    setEntries(prev => prev.filter(e => e.id !== id));
  }

  function handleClear() {
    setEntries([]);
    setInput("");
    setError("");
  }

  function handleKey(e) {
    if (e.key === "Enter") handleAdd();
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
            onChange={(e) => { setInput(e.target.value); setError(""); }}
            onKeyDown={handleKey}
            placeholder="e.g. 20"
          />
        </div>
        <button className="btn btn-primary" onClick={handleAdd}>+ Add</button>
      </div>
      {error && <div className="warning">⚠ {error}</div>}

      <div style={{ marginTop: "20px" }}>
        {entries.length === 0 ? (
          <div className="empty-state">No entries yet — add filament usage above</div>
        ) : (
          <>
            <div className="bill-list">
              {entries.map((e, i) => {
                const runningTotal = entries
                  .slice(0, i + 1)
                  .reduce((sum, entry) => sum + entry.grams * pricePerGram, 0);
                return (
                  <div className="bill-row" key={e.id}>
                    <div className="bill-row-left">
                      <span className="bill-index">{i + 1}</span>
                      <div>
                        <span className="bill-grams">{e.grams}g</span>
                        <span className="bill-formula"> × ₹{pricePerGram.toFixed(2)}</span>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <span className="bill-cost">₹{runningTotal.toFixed(2)}</span>
                      <button className="bill-remove" onClick={() => handleRemove(e.id)} title="Remove">×</button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bill-total">
              <div>
                <div className="bill-total-label">Grand Total</div>
                <div style={{ fontSize: "12px", color: "var(--muted)", marginTop: "2px" }}>
                  {totalGrams.toFixed(1)}g · {entries.length} {entries.length === 1 ? "entry" : "entries"}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div className="bill-total-amount">₹{totalCost.toFixed(2)}</div>
                <button className="btn btn-danger btn-sm" style={{ marginTop: "8px" }} onClick={handleClear}>
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
