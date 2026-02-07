import { useState, useMemo } from 'react';
import { ZorunluBilgiTabs } from './ZorunluBilgiTabs';
import { ZorunluBilgiKategorili } from './ZorunluBilgiKategorili';
import { KategoriSelector } from './KategoriSelector';
import {
  getStoredSayfalar, getStoredKategoriler, getZorunluBilgilerByKategori
} from '../../data/storage';
import type { Kategori } from '../../types/index.ts';

type ViewMode = 'tabs' | 'kategorili';

export const KampanyaSayfasiDemo = () => {
  const sayfalar = getStoredSayfalar();
  const allKategoriler = getStoredKategoriler();

  const [selectedSayfaId, setSelectedSayfaId] = useState(2);
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    const saved = localStorage.getItem('zb-view-mode');
    return (saved === 'tabs' || saved === 'kategorili') ? saved : 'tabs';
  });
  const [selectedKategoriIds, setSelectedKategoriIds] = useState<string[]>(
    sayfalar.find(s => s.id === 2)?.kategoriIds || []
  );

  const currentSayfa = sayfalar.find(s => s.id === selectedSayfaId);

  const zorunluBilgilerByKategori = useMemo(() => {
    const result: Record<string, ReturnType<typeof getZorunluBilgilerByKategori>> = {};
    selectedKategoriIds.forEach(katId => {
      result[katId] = getZorunluBilgilerByKategori(katId);
    });
    return result;
  }, [selectedKategoriIds]);

  const selectedKategoriler = useMemo(() => {
    return selectedKategoriIds
      .map(id => allKategoriler.find(k => k.id === id))
      .filter((k): k is Kategori => k !== undefined);
  }, [selectedKategoriIds, allKategoriler]);

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    localStorage.setItem('zb-view-mode', mode);
  };

  const handleSayfaChange = (sayfaId: number) => {
    setSelectedSayfaId(sayfaId);
    setSelectedKategoriIds(sayfalar.find(s => s.id === sayfaId)?.kategoriIds || []);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* EkstraJet Header */}
      <header className="bg-[#003366]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#FFD100] rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-[#003366]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                  </svg>
                </div>
                <span className="font-bold text-white text-lg">Ekstra Jet</span>
              </div>
              <nav className="hidden md:flex items-center gap-1 text-[13px]">
                <span className="text-[#FFD100] font-semibold px-3 py-1">Turkcell</span>
                <span className="text-[#6B7280]">|</span>
                <span className="text-white/80 px-3 py-1 hover:text-white cursor-pointer">Paycell</span>
                <span className="text-[#6B7280]">|</span>
                <span className="text-white/80 px-3 py-1 hover:text-white cursor-pointer">Superonline</span>
              </nav>
            </div>
            <div className="hidden lg:flex items-center">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Konuşarak ya da yazarak ara..."
                  className="w-64 px-4 py-2 pr-10 rounded-full border-2 border-[#FFD100] bg-transparent text-white text-[13px] placeholder-white/50 focus:outline-none"
                />
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#FFD100]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-[#005F9E]">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center gap-1 text-[13px] font-medium">
              <a href="#" className="px-4 py-2.5 text-white hover:bg-white/10 transition-colors">EV İNTERNETİ</a>
              <a href="#" className="px-4 py-2.5 text-white hover:bg-white/10 transition-colors">TV+</a>
              <a href="#" className="px-4 py-2.5 text-white hover:bg-white/10 transition-colors">EK ÜRÜNLER</a>
              <a href="#" className="px-4 py-2.5 text-white hover:bg-white/10 transition-colors">SÜREÇLER</a>
              <a href="#" className="px-4 py-2.5 text-white hover:bg-white/10 transition-colors">TV+ Ev Teknik Destek</a>
              <a href="#" className="px-4 py-2.5 text-white hover:bg-white/10 transition-colors">Hizmet Felsefesi</a>
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="bg-white border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 py-2.5">
          <div className="flex items-center gap-2 text-[12px]">
            <svg className="w-4 h-4 text-[#005F9E]" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            <span className="text-[#6B7280]">KAMPANYALAR</span>
            <svg className="w-3 h-3 text-[#9CA3AF]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
            <span className="text-[#6B7280]">{currentSayfa?.campaignType?.toUpperCase()}</span>
            <svg className="w-3 h-3 text-[#9CA3AF]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
            <span className="text-[#005F9E] font-medium">{currentSayfa?.title?.toUpperCase()}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-5">
            {/* Campaign Header */}
            <div className="bg-white rounded-lg shadow-sm border border-[#E5E7EB] overflow-hidden">
              <div className="p-5">
                <div className="flex gap-5">
                  <div className="flex-shrink-0">
                    <img
                      src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200&h=200&fit=crop"
                      alt="Campaign"
                      className="w-36 h-36 rounded-lg object-cover border border-[#E5E7EB]"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <h1 className="text-xl font-bold text-[#1F2937] leading-tight">{currentSayfa?.title}</h1>
                      <button className="flex-shrink-0 p-1 hover:bg-[#FFF8E1] rounded transition-colors" title="Favorile">
                        <svg className="w-5 h-5 text-[#D1D5DB] hover:text-[#FFD100]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                      </button>
                    </div>
                    <p className="text-[13px] text-[#6B7280] mt-2 leading-relaxed">
                      {currentSayfa?.title} sadece {currentSayfa?.title} kampanyasındaki müşteriler içindir.
                    </p>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-[12px] text-[#6B7280]">
                      <span className="flex items-center gap-1">
                        <span className="font-medium text-[#374151]">Kategoriler:</span>
                        {currentSayfa?.campaignType}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mt-1 text-[12px] text-[#6B7280]">
                      <span className="font-medium text-[#374151]">Kampanya Müşteri Tipi:</span>
                      <span>Mevcut Müşteri</span>
                    </div>
                    <div className="mt-4">
                      <span className="text-2xl font-bold text-[#005F9E]">209.9</span>
                      <span className="text-lg font-semibold text-[#005F9E] ml-1">TL</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-[12px] text-[#6B7280]">
                      <span><span className="font-medium text-[#374151]">Başlangıç Tarihi:</span> 02.07.2020</span>
                      <span><span className="font-medium text-[#374151]">Bitiş Tarihi:</span> 01.03.2026</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="border-t border-[#E5E7EB]">
                <div className="flex">
                  <button className="px-5 py-3 text-[13px] font-medium text-white bg-[#005F9E] rounded-tl-lg">Genel Bilgiler</button>
                  <button className="px-5 py-3 text-[13px] font-medium text-[#6B7280] hover:text-[#005F9E] hover:bg-[#F9FAFB] transition-colors">Fiyatlar</button>
                  <button className="px-5 py-3 text-[13px] font-medium text-[#6B7280] hover:text-[#005F9E] hover:bg-[#F9FAFB] transition-colors">SSS</button>
                  <button className="px-5 py-3 text-[13px] font-medium text-[#6B7280] hover:text-[#005F9E] hover:bg-[#F9FAFB] transition-colors">Ekli Dokümanlar</button>
                  <button className="px-5 py-3 text-[13px] font-medium text-[#6B7280] hover:text-[#005F9E] hover:bg-[#F9FAFB] transition-colors">Videolar</button>
                  <button className="px-5 py-3 text-[13px] font-medium text-[#6B7280] hover:text-[#005F9E] hover:bg-[#F9FAFB] transition-colors">Eski Versiyonlar</button>
                </div>
              </div>
            </div>

            {/* Demo Controls */}
            <div className="bg-[#EFF6FF] rounded-lg border border-[#BFDBFE] p-4">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-5 h-5 text-[#3B82F6]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span className="font-semibold text-[#1E40AF] text-[13px]">Demo Kontrolleri</span>
              </div>
              <div>
                <label className="block text-[12px] font-medium text-[#374151] mb-1.5">Kampanya Sayfası Seçin</label>
                <select
                  value={selectedSayfaId}
                  onChange={(e) => handleSayfaChange(Number(e.target.value))}
                  title="Kampanya sayfası seçimi"
                  className="w-full px-3 py-2 border border-[#D1D5DB] rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent bg-white"
                >
                  {sayfalar.map(sayfa => (
                    <option key={sayfa.id} value={sayfa.id}>{sayfa.title}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Kategori Selector */}
            <KategoriSelector
              availableKategoriler={allKategoriler}
              selectedKategoriIds={selectedKategoriIds}
              zorunluBilgilerByKategori={zorunluBilgilerByKategori}
              onChange={setSelectedKategoriIds}
            />
          </div>

          {/* Right Column - Zorunlu Bilgiler (toggle artık içeride) */}
          <div>
            {viewMode === 'tabs' ? (
              <ZorunluBilgiTabs 
                kategoriler={selectedKategoriler}
                zorunluBilgilerByKategori={zorunluBilgilerByKategori}
                viewMode={viewMode}
                onViewModeChange={handleViewModeChange}
              />
            ) : (
              <ZorunluBilgiKategorili 
                kategoriler={selectedKategoriler}
                zorunluBilgilerByKategori={zorunluBilgilerByKategori}
                viewMode={viewMode}
                onViewModeChange={handleViewModeChange}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
