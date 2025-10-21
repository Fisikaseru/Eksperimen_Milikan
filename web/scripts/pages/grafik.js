import { plotHistogram, plotScatter, makeChartCanvas } from '../components/plots.js';
import { session } from '../state.js';

export function pageGrafik() {
  const wrap = document.createElement('div');
  wrap.className = 'grid cols-2';

  const qc = session.results.map(r => r.qc).filter(Number.isFinite);
  const rs = session.results.map(r => r.r).filter(Number.isFinite);
  const v2s = session.results.map(r => Math.abs(r.v2)).filter(Number.isFinite);

  const h = makeChartCanvas('Histogram qc');
  const s = makeChartCanvas('Scatter r–v2');

  wrap.append(h.card, s.card);

  setTimeout(() => {
    if (qc.length) plotHistogram(h.canvas, qc, 'qc');
    if (rs.length && v2s.length) plotScatter(s.canvas, rs, v2s, 'r–v2');
  }, 0);

  return wrap;
}
