import { session } from '../state.js';
import { toCSV } from '../data/dataset.js';

export function pageLaporan() {
  const wrap = document.createElement('div');
  wrap.className = 'grid';

  const meta = document.createElement('div');
  meta.className = 'card';
  meta.innerHTML = `
    <h3 class="section-title">Metadata</h3>
    <div class="grid cols-2">
      <div class="field"><label>Nama</label><input id="meta_name"/></div>
      <div class="field"><label>NIM</label><input id="meta_nim"/></div>
      <div class="field"><label>Kelas</label><input id="meta_kelas"/></div>
      <div class="field"><label>Dosen</label><input id="meta_dosen"/></div>
      <div class="field"><label>Tanggal</label><input id="meta_tanggal" type="date"/></div>
    </div>
  `;

  const actions = document.createElement('div');
  actions.className = 'card';

  const btnCSV = document.createElement('button'); btnCSV.className = 'button'; btnCSV.textContent = 'Unduh CSV';
  const btnPDF = document.createElement('button'); btnPDF.className = 'button ghost'; btnPDF.textContent = 'Unduh PDF (ringkas)';

  const msg = document.createElement('div'); msg.style.marginTop = '10px'; msg.textContent = 'PDF ringkas: gunakan dialog cetak browser sebagai PDF.';

  btnCSV.addEventListener('click', () => {
    const csv = toCSV();
    download('milikanlab_results.csv', csv, 'text/csv');
  });

  btnPDF.addEventListener('click', () => {
    window.print();
  });

  meta.querySelectorAll('input').forEach(inp => {
    inp.addEventListener('input', () => {
      const key = inp.id.replace('meta_', '');
      session.meta[key] = inp.value;
    });
  });

  actions.append(btnCSV, btnPDF, msg);
  wrap.append(meta, actions);
  return wrap;
}

function download(filename, content, mime) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}
