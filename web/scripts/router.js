let onChange;

function getRouteFromHash() {
  const hash = window.location.hash || '#/simulasi';
  const path = hash.startsWith('#') ? hash.slice(1) : hash;
  return path || '/simulasi';
}

export function initRouter(cb) {
  onChange = cb;
  if (!window.location.hash) {
    window.location.replace('#/simulasi');
  }
  window.addEventListener('hashchange', () => cb(getRouteFromHash()));
  cb(getRouteFromHash());
}

export function navigate(path) {
  if (!path.startsWith('/')) path = '/' + path;
  window.location.hash = path;
  onChange?.(path);
}
