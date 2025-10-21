export function statCard(title, value, unit = '') {
  const card = document.createElement('div');
  card.className = 'card';
  const h = document.createElement('div');
  h.className = 'section-title';
  h.textContent = title;
  const p = document.createElement('div');
  p.style.fontSize = '20px';
  p.style.fontWeight = '700';
  p.textContent = `${value} ${unit}`.trim();
  card.append(h, p);
  return card;
}
