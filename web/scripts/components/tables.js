import { session, persist } from '../state.js';

export function datasetTable() {
  const wrap = document.createElement('div');
  wrap.className = 'card';

  const title = document.createElement('h3');
  title.className = 'section-title';
  title.textContent = 'Input Data (10×)';

  const table = document.createElement('table');
  table.className = 'table';

  const thead = document.createElement('thead');
  thead.innerHTML = '<tr><th>No</th><th>v1 (m/s)</th><th>v2 (m/s)</th></tr>';
  const tbody = document.createElement('tbody');

  for (let i = 0; i < session.data.length; i++) {
    const tr = document.createElement('tr');
    const c0 = document.createElement('td'); c0.textContent = String(i + 1);
    const c1 = document.createElement('td');
    const c2 = document.createElement('td');

    const inp1 = document.createElement('input'); inp1.type = 'number'; inp1.step = '1e-6'; inp1.value = session.data[i].v1;
    const inp2 = document.createElement('input'); inp2.type = 'number'; inp2.step = '1e-6'; inp2.value = session.data[i].v2;

    inp1.addEventListener('input', () => { session.data[i].v1 = inp1.value; persist(); });
    inp2.addEventListener('input', () => { session.data[i].v2 = inp2.value; persist(); });

    c1.appendChild(inp1); c2.appendChild(inp2);
    tr.append(c0, c1, c2);
    tbody.appendChild(tr);
  }

  table.append(thead, tbody);
  wrap.append(title, table);
  return wrap;
}
