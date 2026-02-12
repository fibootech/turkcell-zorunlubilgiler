import { useState, useMemo } from 'react';
import type { ZorunluBilgi, Kategori } from '../../types/index.ts';
import { RichTextRenderer } from '../shared/RichTextRenderer';

type ViewMode = 'tabs' | 'kategorili';

interface ZorunluBilgiKategoriliProps {
  kategoriler: Kategori[];
  zorunluBilgilerByKategori: Record<string, ZorunluBilgi[]>;
  title?: string;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export const ZorunluBilgiKategorili = ({ 
  kategoriler,
  zorunluBilgilerByKategori,
  title = "Müşteriyle Paylaşılması Gereken Zorunlu Bilgiler",
  viewMode,
  onViewModeChange
}: ZorunluBilgiKategoriliProps) => {
  const [expandedIds, setExpandedIds] = useState<number[]>([]);
  const [isExpanded, setIsExpanded] = useState(true);
  const [readIds, setReadIds] = useState<Set<number>>(new Set());
  const [expandedKategoriler, setExpandedKategoriler] = useState<Set<string>>(
    new Set(kategoriler.map(k => k.id))
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilterKategoriler, setSelectedFilterKategoriler] = useState<Set<string>>(new Set());
  const [showCompletedModal, setShowCompletedModal] = useState(false);

  // Tüm ZB'lerin düz listesi (sıralama için)
  const allItems = useMemo(() => {
    return kategoriler.flatMap(kat => (zorunluBilgilerByKategori[kat.id] || []).map(zb => ({ ...zb, katId: kat.id })));
  }, [kategoriler, zorunluBilgilerByKategori]);

  // Bir sonraki okunmamış item'ı bul
  const findNextUnreadId = (currentId: number): number | null => {
    const idx = allItems.findIndex(i => i.id === currentId);
    for (let i = idx + 1; i < allItems.length; i++) {
      if (!readIds.has(allItems[i].id)) return allItems[i].id;
    }
    // Baştan da bak
    for (let i = 0; i < idx; i++) {
      if (!readIds.has(allItems[i].id)) return allItems[i].id;
    }
    return null;
  };

  const getStatus = (createdAt: string, updatedAt: string): 'new' | 'updated' | null => {
    const now = new Date();
    const created = new Date(createdAt);
    const updated = new Date(updatedAt);
    
    const diffCreated = Math.ceil(Math.abs(now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
    const diffUpdated = Math.ceil(Math.abs(now.getTime() - updated.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffCreated <= 15) return 'new';
    if (diffUpdated <= 15) return 'updated';
    return null;
  };

  const toggleItem = (id: number) => {
    setExpandedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleRead = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const wasRead = readIds.has(id);
    
    const newReadIds = new Set(readIds);
    if (newReadIds.has(id)) newReadIds.delete(id);
    else newReadIds.add(id);
    setReadIds(newReadIds);

    // Okundu yapıldıysa
    if (!wasRead) {
      // Mevcut item'ın kategorisini bul
      const currentItem = allItems.find(i => i.id === id);
      const currentKatId = currentItem?.katId;

      // Mevcut item'ı kapat, sonraki okunmamışı aç
      const nextId = findNextUnreadId(id);
      setExpandedIds(prev => {
        let updated = prev.filter(i => i !== id);
        if (nextId !== null && !updated.includes(nextId)) {
          updated = [...updated, nextId];
        }
        return updated;
      });

      // Tüm item'lar okundu mu kontrol et
      const allRead = allItems.every(i => newReadIds.has(i.id));
      if (allRead) {
        setShowCompletedModal(true);
      }

      // Kategorideki tüm item'lar okundu mu kontrol et
      if (currentKatId) {
        const katItems = zorunluBilgilerByKategori[currentKatId] || [];
        const allKatRead = katItems.every(zb => newReadIds.has(zb.id));

        if (allKatRead) {
          // Bu kategoriyi kapat
          setExpandedKategoriler(prev => {
            const next = new Set(prev);
            next.delete(currentKatId);
            
            // Sonraki okunmamış kategorinin collapse'ını aç
            if (nextId !== null) {
              const nextItem = allItems.find(i => i.id === nextId);
              if (nextItem) {
                next.add(nextItem.katId);
              }
            }
            return next;
          });
        } else {
          // Kategori hala bitmedi, sadece sonraki item'ın kategorisini aç (farklıysa)
          if (nextId !== null) {
            const nextItem = allItems.find(i => i.id === nextId);
            if (nextItem && nextItem.katId !== currentKatId) {
              setExpandedKategoriler(prev => {
                const next = new Set(prev);
                next.add(nextItem.katId);
                return next;
              });
            }
          }
        }
      }
    }
  };

  const handleResetAll = () => {
    setReadIds(new Set());
    setExpandedIds([]);
    setExpandedKategoriler(new Set(kategoriler.map(k => k.id)));
    setShowCompletedModal(false);
  };

  const toggleKategori = (katId: string) => {
    setExpandedKategoriler(prev => {
      const next = new Set(prev);
      if (next.has(katId)) next.delete(katId);
      else next.add(katId);
      return next;
    });
  };

  const toggleFilterKategori = (katId: string) => {
    setSelectedFilterKategoriler(prev => {
      const next = new Set(prev);
      if (next.has(katId)) next.delete(katId);
      else next.add(katId);
      return next;
    });
  };

  // Filtreleme
  const filteredKategoriler = useMemo(() => {
    if (selectedFilterKategoriler.size === 0) return kategoriler;
    return kategoriler.filter(k => selectedFilterKategoriler.has(k.id));
  }, [kategoriler, selectedFilterKategoriler]);

  const getFilteredItems = (katId: string): ZorunluBilgi[] => {
    const items = zorunluBilgilerByKategori[katId] || [];
    if (!searchTerm) return items;
    return items.filter(item =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.contentHtml.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const totalItems = Object.values(zorunluBilgilerByKategori).flat().length;

  if (totalItems === 0) {
    return (
      <div className="bg-[#FFFBEB] border-[3px] border-[#FFC900] rounded-xl p-4">
        <div className="flex items-center gap-2 text-[#003366]">
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
            <span className="font-semibold text-[#003366] text-sm">{title}</span>
            <svg 
              className={`w-5 h-5 text-[#003366] transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* View Mode Toggle - alt satır */}
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
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Zorunlu bilgi ara..."
                className="w-full pl-8 pr-3 py-1.5 border border-[#DDD] rounded-lg text-[12px] focus:outline-none focus:ring-1 focus:ring-[#005F9E] bg-white"
              />
            </div>

            {/* Category multi-select filter */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={() => setSelectedFilterKategoriler(new Set())}
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

          {/* Content */}
          <div className="p-3 bg-white space-y-2">
            {filteredKategoriler.map(kat => {
              const items = getFilteredItems(kat.id);
              if (items.length === 0) return null;
              
              const allKatItems = zorunluBilgilerByKategori[kat.id] || [];
              const readCount = allKatItems.filter(zb => readIds.has(zb.id)).length;
              const isKatExpanded = expandedKategoriler.has(kat.id);
              const allRead = readCount === allKatItems.length && readCount > 0;

              return (
                <div key={kat.id} className="border border-[#E0E0E0] rounded-lg overflow-hidden">
                  {/* Kategori Header */}
                  <button
                    onClick={() => toggleKategori(kat.id)}
                    className={`w-full px-3 py-2 flex items-center justify-between transition-colors ${
                      isKatExpanded ? 'bg-[#005F9E]/5' : 'bg-[#F9FAFB] hover:bg-[#F3F4F6]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: kat.color }} />
                      <span className="font-semibold text-[12px]" style={{ color: kat.color }}>
                        {kat.name}
                      </span>
                      <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full ${
                        allRead
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        {readCount}/{allKatItems.length} Okundu
                      </span>
                    </div>
                    <svg 
                      className={`w-4 h-4 text-[#999] transition-transform ${isKatExpanded ? 'rotate-180' : ''}`} 
                      fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Items */}
                  {isKatExpanded && (
                    <div className="border-t border-[#E0E0E0]">
                      {items.map(item => {
                        const isOpen = expandedIds.includes(item.id);
                        const isRead = readIds.has(item.id);
                        const hasScript = item.contentHtml.includes('script-block');
                        const status = getStatus(item.createdAt, item.updatedAt);

                        return (
                          <div key={item.id} className="border-b border-[#F3F4F6] last:border-b-0">
                            {/* Item Header */}
                            <div className={`flex items-center gap-1 ${isRead ? 'bg-green-50/50' : ''}`}>
                              {/* Checkbox */}
                              <button
                                onClick={(e) => toggleRead(item.id, e)}
                                className="pl-3 pr-1 py-2.5 flex-shrink-0"
                                title={isRead ? 'Okunmadı işaretle' : 'Okundu işaretle'}
                              >
                                {isRead ? (
                                  <svg className="w-[18px] h-[18px] text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                  </svg>
                                ) : (
                                  <div className="w-[18px] h-[18px] rounded-full border-2 border-[#CBD5E1]" />
                                )}
                              </button>

                              {/* Title */}
                              <button
                                onClick={() => toggleItem(item.id)}
                                className="flex-1 px-1 py-2.5 flex items-center justify-between min-w-0"
                              >
                                <span className={`text-[13px] truncate ${
                                  isRead 
                                    ? 'text-[#9CA3AF]' 
                                    : isOpen ? 'font-semibold text-[#003366]' : 'font-medium text-[#333]'
                                }`}>
                                  {item.title}
                                </span>
                                <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                                  {status === 'new' && (
                                    <span className="px-1.5 py-0.5 bg-green-100 text-green-700 text-[9px] font-bold rounded border border-green-200 animate-pulse">
                                      YENİ
                                    </span>
                                  )}
                                  {status === 'updated' && (
                                    <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-[9px] font-bold rounded border border-blue-200 animate-pulse">
                                      GÜNCELLENDİ
                                    </span>
                                  )}
                                  {hasScript && (
                                    <span className="px-1.5 py-0.5 bg-[#FFF3E0] text-[#E65100] text-[9px] font-bold rounded border border-[#FFE0B2]">
                                      S
                                    </span>
                                  )}
                                  <svg 
                                    className={`w-3.5 h-3.5 text-[#999] transition-transform ${isOpen ? 'rotate-180' : ''}`} 
                                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                                  >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                  </svg>
                                </div>
                              </button>
                            </div>

                            {/* Content */}
                            {isOpen && (
                              <div className="px-3 pb-3 bg-white border-t border-[#F3F4F6]">
                                <div className="pt-2">
                                  <RichTextRenderer content={item.contentHtml} />
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Arama sonucu boşsa */}
            {filteredKategoriler.every(kat => getFilteredItems(kat.id).length === 0) && (
              <div className="text-center py-6 text-[#999] text-[13px]">
                Sonuç bulunamadı.
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 bg-[#F9FAFB] border-t border-[#E5E7EB]">
            <div className="flex items-center gap-2 text-[12px] text-[#6B7280]">
              <svg className="w-4 h-4 text-[#005F9E]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span>Bu sayfa ya da Ekstrajet'te bulunan tüm bilgilerden sorumlusunuz</span>
            </div>
          </div>
        </>
      )}

      {/* Tümü Okundu Modal */}
      {showCompletedModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
            {/* Üst banner - Turkcell kurumsal */}
            <div className="bg-[#003366] px-6 pt-6 pb-8 text-center relative overflow-hidden">
              {/* Dekoratif sarı şerit */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#FFD100]" />
              <div className="w-16 h-16 bg-[#FFD100] rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-9 h-9 text-[#003366]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-[#FFD100] text-lg font-bold">Tebrikler!</h3>
              <p className="text-white/70 text-[12px] mt-1">Zorunlu bilgi okuma tamamlandı</p>
            </div>

            {/* İçerik */}
            <div className="px-6 py-5 text-center">
              <p className="text-[#1F2937] font-semibold text-[15px] mb-2">
                Tüm zorunlu bilgiler okundu
              </p>
              <p className="text-[#6B7280] text-[13px] leading-relaxed">
                Müşteri ile paylaşılması gereken tüm zorunlu bilgileri başarıyla okudunuz. 
                Bilgiler otomatik olarak sıfırlanacak ve tekrar okunabilir duruma gelecektir.
              </p>
            </div>

            {/* Buton */}
            <div className="px-6 pb-6">
              <button
                onClick={handleResetAll}
                className="w-full py-2.5 bg-[#005F9E] text-white text-[14px] font-semibold rounded-xl hover:bg-[#004D80] transition-colors"
              >
                Tamam, Sıfırla
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
