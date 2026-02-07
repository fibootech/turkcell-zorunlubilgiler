import type { ZorunluBilgi, Kategori, Sayfa } from '../types/index.ts';
import { mockZorunluBilgiler, mockKategoriler, mockSayfalar } from './mockData';

const KEYS = {
  zorunluBilgiler: 'zb-data',
  kategoriler: 'zb-kategoriler',
  sayfalar: 'zb-sayfalar',
} as const;

// ─── Generic helpers ──────────────────────────────────────────
function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw) as T;
  } catch {
    // parse hatası olursa fallback'e düş
  }
  return fallback;
}

function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // quota aşılırsa sessizce devam et
  }
}

// ─── Zorunlu Bilgiler ─────────────────────────────────────────
export function getStoredZorunluBilgiler(): ZorunluBilgi[] {
  return loadFromStorage<ZorunluBilgi[]>(KEYS.zorunluBilgiler, mockZorunluBilgiler);
}

export function saveZorunluBilgiler(data: ZorunluBilgi[]): void {
  saveToStorage(KEYS.zorunluBilgiler, data);
}

// ─── Kategoriler ──────────────────────────────────────────────
export function getStoredKategoriler(): Kategori[] {
  return loadFromStorage<Kategori[]>(KEYS.kategoriler, mockKategoriler);
}

export function saveKategoriler(data: Kategori[]): void {
  saveToStorage(KEYS.kategoriler, data);
}

// ─── Sayfalar ─────────────────────────────────────────────────
export function getStoredSayfalar(): Sayfa[] {
  return loadFromStorage<Sayfa[]>(KEYS.sayfalar, mockSayfalar);
}

export function saveSayfalar(data: Sayfa[]): void {
  saveToStorage(KEYS.sayfalar, data);
}

// ─── Derived helpers (kampanya sayfası için) ──────────────────
export function getZorunluBilgilerByKategori(kategoriId: string): ZorunluBilgi[] {
  return getStoredZorunluBilgiler()
    .filter(zb => zb.kategoriId === kategoriId && zb.isActive)
    .sort((a, b) => a.displayOrder - b.displayOrder);
}

export function getKategorilerForSayfa(sayfaId: number): Kategori[] {
  const sayfa = getStoredSayfalar().find(s => s.id === sayfaId);
  if (!sayfa) return [];
  const kategoriler = getStoredKategoriler();
  return sayfa.kategoriIds
    .map(katId => kategoriler.find(k => k.id === katId))
    .filter((k): k is Kategori => k !== undefined);
}

// ─── Veriyi sıfırla (mock'a döndür) ──────────────────────────
export function resetAllData(): void {
  localStorage.removeItem(KEYS.zorunluBilgiler);
  localStorage.removeItem(KEYS.kategoriler);
  localStorage.removeItem(KEYS.sayfalar);
}
