// Physics utilities for Millikan oil-drop experiment
// Units assumed SI: meters, seconds, kilograms, pascals, volts.

export function stokesTerminalVelocity(r, rho_o, rho_a, g, eta) {
  // v2: downward terminal velocity without electric field
  return (2 * r * r * (rho_o - rho_a) * g) / (9 * eta);
}

export function radiusFromV2(v2, rho_o, rho_a, g, eta) {
  if (v2 <= 0) return 0;
  return Math.sqrt((9 * eta * v2) / (2 * (rho_o - rho_a) * g));
}

export function q0FromV1V2(r, eta, d, U, v1, v2) {
  // uncorrected charge
  return (6 * Math.PI * eta * r * d * (v1 + v2)) / (U || 1e-12);
}

export function cunninghamFactor(r, p) {
  // Simplified Cunningham slip correction K_C = 1 + A/(p r)
  // Use empirical A ~ 6.17e-3 Pa·m (approx; adjust with lab constants)
  const A = 6.17e-3;
  return 1 + A / (p * Math.max(r, 1e-12));
}

export function correctedCharge(q0, Kc) {
  // Commonly qc = q0 * Kc^(-3/2)
  return q0 * Math.pow(Kc, -1.5);
}

export function estimateElementaryCharge(qList) {
  // crude estimate by rounding qc to nearest multiple of e via clustering
  // We'll use median of qc / round(qc / e0_guess) with e0_guess ~ 1.6e-19
  const clean = qList.filter(Number.isFinite).filter(q => Math.abs(q) > 0);
  if (clean.length === 0) return { e: 1.602e-19, nList: [] };
  let eGuess = 1.6e-19;
  for (let iter = 0; iter < 5; iter++) {
    const nList = clean.map(q => Math.max(1, Math.round(Math.abs(q) / eGuess)));
    const eList = clean.map((q, i) => Math.abs(q) / nList[i]);
    eGuess = median(eList);
  }
  const nList = clean.map(q => Math.max(1, Math.round(Math.abs(q) / eGuess)));
  return { e: eGuess, nList };
}

export function median(arr) {
  const a = [...arr].sort((x, y) => x - y);
  const n = a.length;
  return n % 2 ? a[(n - 1) / 2] : 0.5 * (a[n / 2 - 1] + a[n / 2]);
}
