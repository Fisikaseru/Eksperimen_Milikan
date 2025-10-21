import { initRouter, navigate } from './router.js';
import { initState, resetState } from './state.js';
import { renderSidebar } from './components/sidebar.js';
import { routes } from './pages/routes.js';

function mountNav() {
  const navBtns = document.querySelectorAll('.nav-btn');
  navBtns.forEach(btn => {
    btn.addEventListener('click', () => navigate(btn.dataset.route));
  });
}

function setActive(route) {
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.route === route);
  });
}

function render(route) {
  const root = document.getElementById('app');
  root.innerHTML = '';
  renderSidebar();
  const page = routes[route] ?? routes['/simulasi'];
  const el = page();
  root.appendChild(el);
  setActive(route);
}

window.addEventListener('DOMContentLoaded', () => {
  initState();
  mountNav();
  initRouter(render);
  document.getElementById('resetApp').addEventListener('click', () => {
    resetState();
    navigate('/simulasi');
  });
});
