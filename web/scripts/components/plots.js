export function makeChartCanvas(id) {
  const card = document.createElement('div');
  card.className = 'card';
  const h = document.createElement('h3'); h.className = 'section-title'; h.textContent = id;
  const can = document.createElement('canvas');
  can.width = 400; can.height = 220;
  card.append(h, can);
  return { card, canvas: can };
}

export function plotHistogram(canvas, data, label='qc') {
  const bins = 10;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const width = (max - min) / (bins || 1) || 1;
  const counts = new Array(bins).fill(0);
  data.forEach(x => {
    const idx = Math.min(bins - 1, Math.max(0, Math.floor((x - min) / width)));
    counts[idx]++;
  });
  const labels = counts.map((_, i) => (min + i * width).toExponential(1));
  return new Chart(canvas, {
    type: 'bar',
    data: { labels, datasets: [{ label, data: counts, backgroundColor: '#38bdf8' }] },
    options: { scales: { y: { beginAtZero: true } } }
  });
}

export function plotScatter(canvas, xs, ys, label='r-v') {
  const data = xs.map((x, i) => ({ x, y: ys[i] }));
  return new Chart(canvas, {
    type: 'scatter',
    data: { datasets: [{ label, data, pointBackgroundColor: '#0ea5e9' }] },
    options: { scales: { x: { type: 'linear' }, y: { type: 'linear' } } }
  });
}
