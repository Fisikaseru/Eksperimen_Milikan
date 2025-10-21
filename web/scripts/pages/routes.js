import { pageSimulasi } from './simulasi.js';
import { pageData } from './data.js';
import { pageGrafik } from './grafik.js';
import { pageLaporan } from './laporan.js';
import { pagePanduan } from './panduan.js';

export const routes = {
  '/simulasi': pageSimulasi,
  '/data': pageData,
  '/grafik': pageGrafik,
  '/laporan': pageLaporan,
  '/panduan': pagePanduan,
};
