import { useState, useEffect } from "react";
import { getPrices, savePrices, DEFAULT_PRICES } from "../utils/storage";

export default function AdminPage() {
  const [pla, setPla] = useState("");
  const [abs, setAbs] = useState("");
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const prices = getPrices();
    setPla(String(prices.PLA));
    setAbs(String(prices.ABS));
  }, []);

  function validate() {
    const errs = {};
    if (!pla || isNaN(pla) || Number(pla) <= 0) errs.pla = "Enter a valid price greater than 0";
    if (!abs || isNaN(abs) || Number(abs) <= 0) errs.abs = "Enter a valid price greater than 0";
    return errs;
  }

  function handleSave() {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    savePrices({ PLA: Number(pla), ABS: Number(abs) });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  function handleReset() {
    setPla(String(DEFAULT_PRICES.PLA));
    setAbs(String(DEFAULT_PRICES.ABS));
    setErrors({});
    setSaved(false);
  }

  return (
    <div className="admin-wrap">
      <div className="admin-header">
        <h1>Pricing <span style={{ color: "var(--accent)" }}>Settings</span></h1>
        <p>Set the default price per gram for each filament material. These rates are used across the calculator.</p>
      </div>

      <div className="card">
        <p className="card-title">Material Rates</p>

        <div className="admin-prices">
          <div className="field">
            <label>PLA — Price per gram (₹)</label>
            <input
              className={`input ${errors.pla ? "error" : ""}`}
              type="number"
              min="0"
              step="0.01"
              value={pla}
              onChange={(e) => { setPla(e.target.value); setErrors(p => ({ ...p, pla: "" })); setSaved(false); }}
              placeholder="e.g. 2.50"
            />
            {errors.pla && <span style={{ color: "var(--danger)", fontSize: "12px" }}>{errors.pla}</span>}
          </div>

          <div className="field">
            <label>ABS — Price per gram (₹)</label>
            <input
              className={`input ${errors.abs ? "error" : ""}`}
              type="number"
              min="0"
              step="0.01"
              value={abs}
              onChange={(e) => { setAbs(e.target.value); setErrors(p => ({ ...p, abs: "" })); setSaved(false); }}
              placeholder="e.g. 3.00"
            />
            {errors.abs && <span style={{ color: "var(--danger)", fontSize: "12px" }}>{errors.abs}</span>}
          </div>
        </div>

        <div className="admin-footer">
          <button className="btn btn-ghost btn-sm" onClick={handleReset}>Reset to defaults</button>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            {saved && (
              <span className="save-toast">
                ✓ Prices saved
              </span>
            )}
            <button className="btn btn-primary" onClick={handleSave}>Save prices</button>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: "16px" }}>
        <p className="card-title">Current Active Rates</p>
        <div className="grid-2">
          <div style={{ textAlign: "center", padding: "12px 0" }}>
            <div style={{ fontSize: "12px", color: "var(--muted)", marginBottom: "6px" }}>PLA</div>
            <div style={{ fontSize: "28px", fontWeight: 700, color: "var(--accent)" }}>
              ₹{Number(pla) > 0 ? Number(pla).toFixed(2) : "—"}
            </div>
            <div style={{ fontSize: "11px", color: "var(--muted)" }}>per gram</div>
          </div>
          <div style={{ textAlign: "center", padding: "12px 0", borderLeft: "1px solid var(--border)" }}>
            <div style={{ fontSize: "12px", color: "var(--muted)", marginBottom: "6px" }}>ABS</div>
            <div style={{ fontSize: "28px", fontWeight: 700, color: "var(--accent)" }}>
              ₹{Number(abs) > 0 ? Number(abs).toFixed(2) : "—"}
            </div>
            <div style={{ fontSize: "11px", color: "var(--muted)" }}>per gram</div>
          </div>
        </div>
      </div>
    </div>
  );
}
