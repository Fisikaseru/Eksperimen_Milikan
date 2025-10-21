import { datasetTable } from '../components/tables.js';
import { computeResults } from '../data/dataset.js';

export function pageData() {
  const wrap = document.createElement('div');
  wrap.className = 'grid';

  const table = datasetTable();
  const actions = document.createElement('div');
  actions.className = 'card';

  const btn = document.createElement('button');
  btn.className = 'button';
  btn.textContent = 'Hitung Semua';
  const out = document.createElement('div');
  out.style.marginTop = '10px';

  btn.addEventListener('click', () => {
    const { rows, e } = computeResults();
    out.innerHTML = `<div class="status"><span class="badge ok">OK</span> e ≈ ${e.toExponential(3)} C</div>`;
    const pre = document.createElement('pre');
    pre.textContent = JSON.stringify(rows, null, 2);
    out.appendChild(pre);
  });

  actions.append(btn, out);
  wrap.append(table, actions);
  return wrap;
}
