const PRICES_KEY = "tinkers_filament_prices";

export const DEFAULT_PRICES = { PLA: 3.0, ABS: 4.0 };

// PLA slabs — base rates
export const PLA_SLABS = [
  { id: 1, upTo: 20, rate: 3.0, label: "0 – 20g" },
  { id: 2, upTo: 50, rate: 2.5, label: "21 – 50g" },
  { id: 3, upTo: 100, rate: 2.0, label: "51 – 100g" },
  { id: 4, upTo: 250, rate: 1.75, label: "101 – 250g" },
  { id: 5, upTo: 500, rate: 1.5, label: "251 – 500g" },
  { id: 6, upTo: 750, rate: 1.35, label: "501 – 750g" },
  { id: 7, upTo: 1000, rate: 1.25, label: "751 – 1000g" },
  { id: 8, upTo: null, rate: 1.2, label: "1000g+" },
];

// ABS slabs — ~25-30% higher than PLA across all slabs
export const ABS_SLABS = [
  { id: 1, upTo: 20, rate: 4.0, label: "0 – 20g" },
  { id: 2, upTo: 50, rate: 3.25, label: "21 – 50g" },
  { id: 3, upTo: 100, rate: 2.75, label: "51 – 100g" },
  { id: 4, upTo: 250, rate: 2.25, label: "101 – 250g" },
  { id: 5, upTo: 500, rate: 2.0, label: "251 – 500g" },
  { id: 6, upTo: 750, rate: 1.75, label: "501 – 750g" },
  { id: 7, upTo: 1000, rate: 1.6, label: "751 – 1000g" },
  { id: 8, upTo: null, rate: 1.5, label: "1000g+" },
];

export function getSlabsForMaterial(material) {
  return material === "ABS" ? ABS_SLABS : PLA_SLABS;
}

// Core tiered calculation
export function calcTieredCost(grams, slabs) {
  let remaining = grams;
  let cost = 0;
  const breakdown = [];
  let prevUpTo = 0;

  for (const slab of slabs) {
    if (remaining <= 0) break;
    const capacity = slab.upTo !== null ? slab.upTo - prevUpTo : Infinity;
    const used = Math.min(remaining, capacity);
    const slabCost = used * slab.rate;
    cost += slabCost;
    breakdown.push({
      label: slab.label,
      grams: used,
      rate: slab.rate,
      cost: slabCost,
    });
    remaining -= used;
    prevUpTo = slab.upTo ?? prevUpTo;
  }

  return { total: cost, breakdown };
}

export function getPrices() {
  try {
    const raw = localStorage.getItem(PRICES_KEY);
    return raw ? JSON.parse(raw) : { ...DEFAULT_PRICES };
  } catch {
    return { ...DEFAULT_PRICES };
  }
}

export function savePrices(prices) {
  localStorage.setItem(PRICES_KEY, JSON.stringify(prices));
}
