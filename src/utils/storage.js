const KEY = "tinkers_filament_prices";

export const DEFAULT_PRICES = { PLA: 2.5, ABS: 3.0 };

export function getPrices() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : { ...DEFAULT_PRICES };
  } catch {
    return { ...DEFAULT_PRICES };
  }
}

export function savePrices(prices) {
  localStorage.setItem(KEY, JSON.stringify(prices));
}
