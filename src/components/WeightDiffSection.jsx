import { useState } from "react";

export default function WeightDiffSection({ pricePerGram }) {
  const [initial, setInitial] = useState("");
  const [final, setFinal]     = useState("");

  const iVal = parseFloat(initial);
  const fVal = parseFloat(final);

  const bothFilled = initial !== "" && final !== "" && !isNaN(iVal) && !isNaN(fVal);
  const finalGtInitial = bothFilled && fVal >= iVal;
  const eitherNegative = bothFilled && (iVal < 0 || fVal < 0);

  const gramsUsed = bothFilled && !finalGtInitial && !eitherNegative ? iVal - fVal : null;
  const totalCost = gramsUsed !== null ? gramsUsed * pricePerGram : null;

  function getWarning() {
    if (!bothFilled) return null;
    if (eitherNegative) return "Weight values cannot be negative.";
    if (fVal === iVal) return "Final weight equals initial weight — no filament was used.";
    if (finalGtInitial) return "Final weight is greater than initial weight. Please check your values.";
    return null;
  }

  const warning = getWarning();

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

        {warning && (
          <div className="warning">⚠ {warning}</div>
        )}

        {totalCost !== null && !warning && (
          <div className="result-box">
            <div>
              <div className="result-label">Total cost</div>
              <div className="result-grams">{gramsUsed.toFixed(2)}g used · ₹{pricePerGram.toFixed(2)}/g</div>
            </div>
            <div className="result-price">₹{totalCost.toFixed(2)}</div>
          </div>
        )}

        {!bothFilled && (
          <div className="empty-state">Enter both weights to calculate usage</div>
        )}
      </div>
    </div>
  );
}
