// Kategori
export interface Kategori {
  id: string;
  name: string;
  color: string;
  displayOrder: number;
}

// Zorunlu Bilgi - Master Liste
export interface ZorunluBilgi {
  id: number;
  title: string;
  contentHtml: string;
  kategoriId: string;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
  usageCount: number;
}

// Sayfa - Kampanya Sayfasi
export interface Sayfa {
  id: number;
  title: string;
  campaignType: string;
  kategoriIds: string[];
}

// Sayfa-Kategori Iliskisi
export interface SayfaKategori {
  sayfaId: number;
  kategoriId: string;
  displayOrder: number;
}

// Form State
export interface ZorunluBilgiFormData {
  title: string;
  contentHtml: string;
  kategoriId: string;
  isActive: boolean;
}

// Kategori Form State
export interface KategoriFormData {
  name: string;
  color: string;
}

// Tab State
export interface TabState {
  activeTabId: number | null;
}

// Dinamik Degiskenler
export interface DinamikDegiskenler {
  kampanya_adi?: string;
  taahhut_suresi?: string;
  download_hiz?: string;
  upload_hiz?: string;
  indirimsiz_fiyat?: string;
  kampanya_fiyat?: string;
  modem_kiralama_ucreti?: string;
}
