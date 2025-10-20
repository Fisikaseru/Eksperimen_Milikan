const defaultParams = {
  rho_o: 886, // kg/m^3, oil
  rho_a: 1.2, // kg/m^3, air
  eta: 1.85e-5, // Pa·s
  g: 9.80665,
  p: 101325, // Pa
  d: 0.005, // m plate separation
  U: 200, // V
  L: 0.005 // m travel distance for timing to velocity conversion (optional)
};

const defaultData = Array.from({ length: 10 }, () => ({ v1: '', v2: '' }));

export const session = {
  params: { ...defaultParams },
  data: defaultData.map(x => ({ ...x })),
  results: [],
  meta: { name: '', nim: '', kelas: '', dosen: '', tanggal: '' }
};

export function initState() {
  const stored = localStorage.getItem('milikanlabState');
  if (stored) {
    try { Object.assign(session, JSON.parse(stored)); } catch {}
  }
  persist();
}

export function persist() {
  localStorage.setItem('milikanlabState', JSON.stringify(session));
}

export function resetState() {
  session.params = { ...defaultParams };
  session.data = defaultData.map(x => ({ ...x }));
  session.results = [];
  session.meta = { name: '', nim: '', kelas: '', dosen: '', tanggal: '' };
  persist();
}
