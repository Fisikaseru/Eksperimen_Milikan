export function pagePanduan() {
  const wrap = document.createElement('div');
  wrap.className = 'grid';

  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = `
    <h3 class="section-title">Panduan Singkat</h3>
    <ol>
      <li>Atur parameter global di sidebar (ρ, η, p, g, d, U).</li>
      <li>Buka tab Simulasi untuk melihat gerak tetes dan menggeser tegangan U.</li>
      <li>Masukkan 10× data v1 (naik) dan v2 (turun) di tab Data, lalu klik Hitung Semua.</li>
      <li>Lihat grafik qc dan relasi r–v2 di tab Grafik.</li>
      <li>Isi metadata dan unduh CSV/PDF di tab Laporan.</li>
    </ol>
    <p>Catatan: model ini menyederhanakan dinamika untuk visual yang lancar. Perhitungan qc menggunakan koreksi slip Cunningham bentuk umum; sesuaikan konstanta untuk lingkungan laboratorium Anda.</p>
  `;

  wrap.append(card);
  return wrap;
}
