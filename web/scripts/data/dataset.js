import { session, persist } from '../state.js';
import { radiusFromV2, q0FromV1V2, cunninghamFactor, correctedCharge, estimateElementaryCharge } from '../physics/core.js';

export function computeResults() {
  const { rho_o, rho_a, g, eta, d, U, p } = session.params;
  const rows = session.data.map((row, idx) => {
    const v1 = Number(row.v1) || 0;
    const v2 = Number(row.v2) || 0;
    const r = radiusFromV2(Math.abs(v2), rho_o, rho_a, g, eta);
    const q0 = q0FromV1V2(r, eta, d, U, v1, Math.abs(v2));
    const Kc = cunninghamFactor(r, p);
    const qc = correctedCharge(q0, Kc);
    return { idx, v1, v2, r, q0, qc };
  });
  const qcList = rows.map(r => r.qc).filter(Number.isFinite);
  const { e, nList } = estimateElementaryCharge(qcList);
  rows.forEach((r, i) => r.n = nList[i] ?? null);
  session.results = rows;
  persist();
  return { rows, e };
}

export function toCSV() {
  const headers = ['idx','v1','v2','r','q0','qc','n'];
  const lines = [headers.join(',')];
  for (const r of session.results) {
    lines.push([
      r.idx,
      r.v1,
      r.v2,
      r.r,
      r.q0,
      r.qc,
      r.n
    ].join(','));
  }
  return lines.join('\n');
}
