import { useState, useRef, useEffect, useMemo } from 'react';
import type { ZorunluBilgi, Kategori } from '../../types/index.ts';
import { RichTextRenderer } from '../shared/RichTextRenderer';

type ViewMode = 'tabs' | 'kategorili';

interface ZorunluBilgiTabsProps {
  kategoriler: Kategori[];
  zorunluBilgilerByKategori: Record<string, ZorunluBilgi[]>;
  title?: string;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export const ZorunluBilgiTabs = ({ 
  kategoriler,
  zorunluBilgilerByKategori,
  title = "Müşteriyle Paylaşılması Gereken Zorunlu Bilgiler",
  viewMode,
  onViewModeChange
}: ZorunluBilgiTabsProps) => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilterKategoriler, setSelectedFilterKategoriler] = useState<Set<string>>(new Set());
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Filtrelenmiş itemler
  const filteredItems = useMemo(() => {
    let items: ZorunluBilgi[] = [];
    
    const katsToShow = selectedFilterKategoriler.size === 0 
      ? kategoriler 
      : kategoriler.filter(k => selectedFilterKategoriler.has(k.id));

    katsToShow.forEach(kat => {
      const katItems = zorunluBilgilerByKategori[kat.id] || [];
      items = [...items, ...katItems];
    });

    if (searchTerm) {
      items = items.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.contentHtml.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return items;
  }, [kategoriler, zorunluBilgilerByKategori, selectedFilterKategoriler, searchTerm]);

  // activeTabIndex sınır kontrolü
  useEffect(() => {
    if (activeTabIndex >= filteredItems.length && filteredItems.length > 0) {
      setActiveTabIndex(0);
    }
  }, [filteredItems.length, activeTabIndex]);

  const activeItem = filteredItems[activeTabIndex];
  const hasPrev = activeTabIndex > 0;
  const hasNext = activeTabIndex < filteredItems.length - 1;

  useEffect(() => {
    const activeTab = tabRefs.current[activeTabIndex];
    if (activeTab && tabsContainerRef.current) {
      activeTab.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  }, [activeTabIndex]);

  const goToPrev = () => {
    if (hasPrev) setActiveTabIndex(activeTabIndex - 1);
  };

  const goToNext = () => {
    if (hasNext) setActiveTabIndex(activeTabIndex + 1);
  };

  const toggleFilterKategori = (katId: string) => {
    setSelectedFilterKategoriler(prev => {
      const next = new Set(prev);
      if (next.has(katId)) next.delete(katId);
      else next.add(katId);
      return next;
    });
    setActiveTabIndex(0);
  };

  const totalItems = Object.values(zorunluBilgilerByKategori).flat().length;

  if (totalItems === 0) {
    return (
      <div className="bg-[#FFFBEB] border-[3px] border-[#FFC900] rounded-xl p-4">
        <div className="flex items-center gap-2 text-[#92400E]">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-medium text-sm">Zorunlu bilgi bulunmuyor.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FFFBEB] border-[3px] border-[#FFC900] rounded-xl overflow-hidden">
      {/* Header with Toggle */}
      <div className="bg-[#FFC900] px-4 py-2.5">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <span className="font-semibold text-[#1F2937] text-[14px]">{title}</span>
            <svg 
              className={`w-5 h-5 text-[#1F2937] transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
        
        {/* View Mode Toggle - sağa dayalı */}
        <div className="flex items-center justify-end mt-2">
          <div className="flex items-center bg-[#003366]/10 rounded-lg p-0.5">
            <button
              onClick={() => onViewModeChange('tabs')}
              className={`px-3 py-1 text-[11px] font-semibold rounded-md transition-colors ${
                viewMode === 'tabs'
                  ? 'bg-white text-[#003366] shadow-sm'
                  : 'text-[#003366]/60 hover:text-[#003366]'
              }`}
              title="Tab görünümü"
            >
              Tab
            </button>
            <button
              onClick={() => onViewModeChange('kategorili')}
              className={`px-3 py-1 text-[11px] font-semibold rounded-md transition-colors ${
                viewMode === 'kategorili'
                  ? 'bg-white text-[#003366] shadow-sm'
                  : 'text-[#003366]/60 hover:text-[#003366]'
              }`}
              title="Kategorili görünüm"
            >
              Kategorili
            </button>
          </div>
        </div>
      </div>

      {isExpanded && (
        <>
          {/* Search & Category Filter */}
          <div className="px-3 py-2.5 bg-[#FFF7D6] space-y-2">
            {/* Search */}
            <div className="relative">
              <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#999]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setActiveTabIndex(0); }}
                placeholder="Zorunlu bilgi ara..."
                className="w-full pl-8 pr-3 py-1.5 border border-[#DDD] rounded-lg text-[12px] focus:outline-none focus:ring-1 focus:ring-[#005F9E] bg-white"
              />
            </div>

            {/* Category multi-select filter */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={() => { setSelectedFilterKategoriler(new Set()); setActiveTabIndex(0); }}
                className={`px-2.5 py-1 rounded-full text-[10px] font-semibold transition-colors ${
                  selectedFilterKategoriler.size === 0
                    ? 'bg-[#005F9E] text-white'
                    : 'bg-white text-[#666] hover:bg-[#F5F5F5] border border-[#DDD]'
                }`}
              >
                Tümü
              </button>
              {kategoriler.map(kat => {
                const isSelected = selectedFilterKategoriler.has(kat.id);
                return (
                  <button
                    key={kat.id}
                    onClick={() => toggleFilterKategori(kat.id)}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-semibold transition-colors border ${
                      isSelected
                        ? 'text-white border-transparent'
                        : 'bg-white text-[#666] hover:bg-[#F5F5F5] border-[#DDD]'
                    }`}
                    style={isSelected ? { backgroundColor: kat.color } : {}}
                  >
                    {kat.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tabs */}
          {filteredItems.length > 0 ? (
            <>
              <div className="bg-[#FFFEF5]">
                <div 
                  ref={tabsContainerRef}
                  className="flex overflow-x-auto scrollbar-hide"
                >
                  {filteredItems.map((item, index) => (
                    <button
                      key={item.id}
                      ref={el => tabRefs.current[index] = el}
                      onClick={() => setActiveTabIndex(index)}
                      className={`px-4 py-2.5 text-[13px] font-medium whitespace-nowrap transition-all ${
                        activeTabIndex === index
                          ? 'bg-white text-[#005F9E] border-b-2 border-[#005F9E]'
                          : 'text-[#6B7280] hover:text-[#005F9E] hover:bg-[#FFFEF5]'
                      }`}
                    >
                      {item.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="bg-white">
                <div className="p-4 min-h-[200px]">
                  {activeItem ? (
                    <RichTextRenderer content={activeItem.contentHtml} />
                  ) : (
                    <p className="text-[#6B7280] text-sm">İçerik bulunamadı.</p>
                  )}
                </div>

                {/* Navigation */}
                {filteredItems.length > 1 && (
                  <div className="px-4 py-3 border-t border-[#E5E7EB] flex items-center justify-between bg-[#FAFAFA]">
                    <button
                      onClick={goToPrev}
                      disabled={!hasPrev}
                      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors ${
                        hasPrev 
                          ? 'text-[#005F9E] hover:bg-[#EFF6FF]' 
                          : 'text-[#D1D5DB] cursor-not-allowed'
                      }`}
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      Önceki
                    </button>
                    
                    <span className="text-[11px] text-[#9CA3AF] font-medium">
                      {activeTabIndex + 1} / {filteredItems.length}
                    </span>
                    
                    <button
                      onClick={goToNext}
                      disabled={!hasNext}
                      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors ${
                        hasNext 
                          ? 'text-[#005F9E] hover:bg-[#EFF6FF]' 
                          : 'text-[#D1D5DB] cursor-not-allowed'
                      }`}
                    >
                      Sonraki
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="bg-white text-center py-8 text-[#999] text-[13px]">
              Sonuç bulunamadı.
            </div>
          )}

          {/* Footer */}
          <div className="px-4 py-2.5 bg-[#F9FAFB] border-t border-[#E5E7EB]">
            <div className="flex items-center gap-2 text-[12px] text-[#6B7280]">
              <svg className="w-4 h-4 text-[#005F9E]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span>Bu sayfa ya da Ekstrajet'te bulunan tüm bilgilerden sorumlusunuz</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
