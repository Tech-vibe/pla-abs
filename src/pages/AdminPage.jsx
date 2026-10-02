import { useState, useEffect } from "react";
import {
  getPrices,
  savePrices,
  DEFAULT_PRICES,
  getSlabs,
  saveSlabs,
  DEFAULT_SLABS,
} from "../utils/storage";

export default function AdminPage() {
  const [pla, setPla] = useState("");
  const [abs, setAbs] = useState("");
  const [flatSaved, setFlatSaved] = useState(false);
  const [flatErrors, setFlatErrors] = useState({});

  const [slabs, setSlabs] = useState([]);
  const [slabSaved, setSlabSaved] = useState(false);
  const [slabErrors, setSlabErrors] = useState({});

  useEffect(() => {
    const p = getPrices();
    setPla(String(p.PLA));
    setAbs(String(p.ABS));
    setSlabs(getSlabs());
  }, []);

  function validateFlat() {
    const errs = {};
    if (!pla || isNaN(pla) || Number(pla) <= 0)
      errs.pla = "Enter a valid price > 0";
    if (!abs || isNaN(abs) || Number(abs) <= 0)
      errs.abs = "Enter a valid price > 0";
    return errs;
  }

  function handleFlatSave() {
    const errs = validateFlat();
    if (Object.keys(errs).length) {
      setFlatErrors(errs);
      return;
    }
    setFlatErrors({});
    savePrices({ PLA: Number(pla), ABS: Number(abs) });
    setFlatSaved(true);
    setTimeout(() => setFlatSaved(false), 3000);
  }

  function handleFlatReset() {
    setPla(String(DEFAULT_PRICES.PLA));
    setAbs(String(DEFAULT_PRICES.ABS));
    setFlatErrors({});
    setFlatSaved(false);
  }

  function handleSlabChange(id, value) {
    setSlabs((prev) =>
      prev.map((s) => (s.id === id ? { ...s, rate: value } : s)),
    );
    setSlabErrors((prev) => ({ ...prev, [id]: "" }));
    setSlabSaved(false);
  }

  function validateSlabs() {
    const errs = {};
    slabs.forEach((s) => {
      if (!s.rate || isNaN(s.rate) || Number(s.rate) <= 0)
        errs[s.id] = "Rate must be > 0";
    });
    return errs;
  }

  function handleSlabSave() {
    const errs = validateSlabs();
    if (Object.keys(errs).length) {
      setSlabErrors(errs);
      return;
    }
    setSlabErrors({});
    saveSlabs(slabs.map((s) => ({ ...s, rate: Number(s.rate) })));
    setSlabSaved(true);
    setTimeout(() => setSlabSaved(false), 3000);
  }

  function handleSlabReset() {
    setSlabs(DEFAULT_SLABS.map((s) => ({ ...s })));
    setSlabErrors({});
    setSlabSaved(false);
  }

  return (
    <div className="admin-wrap">
      <div className="admin-header">
        <h1>
          Pricing <span style={{ color: "var(--accent)" }}>Settings</span>
        </h1>
        <p>
          Manage flat rates and tiered slab pricing for the filament calculator.
        </p>
      </div>

      {/* Flat rates */}
      <div className="card" style={{ marginBottom: "16px" }}>
        <p className="card-title">Flat Rate — Per Gram</p>
        <div className="admin-prices">
          <div className="field">
            <label>PLA — ₹ per gram</label>
            <input
              className={`input ${flatErrors.pla ? "error" : ""}`}
              type="number"
              min="0"
              step="0.01"
              value={pla}
              onChange={(e) => {
                setPla(e.target.value);
                setFlatErrors((p) => ({ ...p, pla: "" }));
                setFlatSaved(false);
              }}
              placeholder="e.g. 2.50"
            />
            {flatErrors.pla && (
              <span style={{ color: "var(--danger)", fontSize: "12px" }}>
                {flatErrors.pla}
              </span>
            )}
          </div>
          <div className="field">
            <label>ABS — ₹ per gram</label>
            <input
              className={`input ${flatErrors.abs ? "error" : ""}`}
              type="number"
              min="0"
              step="0.01"
              value={abs}
              onChange={(e) => {
                setAbs(e.target.value);
                setFlatErrors((p) => ({ ...p, abs: "" }));
                setFlatSaved(false);
              }}
              placeholder="e.g. 3.00"
            />
            {flatErrors.abs && (
              <span style={{ color: "var(--danger)", fontSize: "12px" }}>
                {flatErrors.abs}
              </span>
            )}
          </div>
        </div>
        <div className="admin-footer">
          <button className="btn btn-ghost btn-sm" onClick={handleFlatReset}>
            Reset to defaults
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            {flatSaved && <span className="save-toast">✓ Saved</span>}
            <button className="btn btn-primary" onClick={handleFlatSave}>
              Save rates
            </button>
          </div>
        </div>
      </div>

      {/* Tiered slabs */}
      <div className="card">
        <p className="card-title">Tiered Slab Pricing</p>
        <p
          style={{
            fontSize: "12px",
            color: "var(--muted)",
            marginBottom: "16px",
            marginTop: "-8px",
          }}
        >
          Rate per gram decreases as usage increases.
        </p>
        <div className="slab-list">
          {slabs.map((slab) => (
            <div className="slab-row" key={slab.id}>
              <div className="slab-label">{slab.label}</div>
              <div className="slab-input-wrap">
                <span className="slab-prefix">₹</span>
                <input
                  className={`input slab-input ${slabErrors[slab.id] ? "error" : ""}`}
                  type="number"
                  min="0"
                  step="0.01"
                  value={slab.rate}
                  onChange={(e) => handleSlabChange(slab.id, e.target.value)}
                  placeholder="rate"
                />
                <span className="slab-suffix">/g</span>
              </div>
              {slabErrors[slab.id] && (
                <span
                  style={{
                    color: "var(--danger)",
                    fontSize: "11px",
                    gridColumn: "1/-1",
                  }}
                >
                  {slabErrors[slab.id]}
                </span>
              )}
            </div>
          ))}
        </div>
        <div className="admin-footer" style={{ marginTop: "20px" }}>
          <button className="btn btn-ghost btn-sm" onClick={handleSlabReset}>
            Reset to defaults
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            {slabSaved && <span className="save-toast">✓ Saved</span>}
            <button className="btn btn-primary" onClick={handleSlabSave}>
              Save slabs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
