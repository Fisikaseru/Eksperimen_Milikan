import { session, persist } from '../state.js';

export function renderSidebar() {
  const sidebar = document.getElementById('sidebar');
  const el = document.createElement('div');
  el.className = 'card';
  el.innerHTML = `
    <h3 class="section-title">Parameter Global</h3>
    <div class="field"><label>ρ_o (kg/m³)</label><input id="rho_o" type="number" step="0.1" value="${session.params.rho_o}"></div>
    <div class="field"><label>ρ_a (kg/m³)</label><input id="rho_a" type="number" step="0.1" value="${session.params.rho_a}"></div>
    <div class="field"><label>η (Pa·s)</label><input id="eta" type="number" step="1e-6" value="${session.params.eta}"></div>
    <div class="field"><label>g (m/s²)</label><input id="g" type="number" step="0.0001" value="${session.params.g}"></div>
    <div class="field"><label>p (Pa)</label><input id="p" type="number" step="1" value="${session.params.p}"></div>
    <div class="field"><label>d (m)</label><input id="d" type="number" step="0.0001" value="${session.params.d}"></div>
    <div class="field"><label>U (V)</label><input id="U" type="number" step="1" value="${session.params.U}"></div>
    <div class="field"><label>L (m)</label><input id="L" type="number" step="0.0001" value="${session.params.L}"></div>
  `;
  sidebar.innerHTML = '';
  sidebar.appendChild(el);
  el.querySelectorAll('input').forEach(inp => {
    inp.addEventListener('input', () => {
      const key = inp.id;
      session.params[key] = Number(inp.value);
      persist();
    });
  });
}
