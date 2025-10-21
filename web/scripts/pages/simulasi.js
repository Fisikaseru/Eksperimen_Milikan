import { CanvasSim } from '../sim/canvasSim.js';
import { session } from '../state.js';
import { statCard } from '../components/cards.js';

export function pageSimulasi() {
  const wrap = document.createElement('div');
  wrap.className = 'grid';

  const sim = new CanvasSim();

  const info = document.createElement('div');
  info.className = 'grid cols-3';
  info.append(
    statCard('U (V)', session.params.U.toFixed(0)),
    statCard('d (m)', session.params.d),
    statCard('η (Pa·s)', session.params.eta)
  );

  wrap.append(sim.container, info);
  return wrap;
}
