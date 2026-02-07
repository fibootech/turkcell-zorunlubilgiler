import { useState } from 'react';
import type { ZorunluBilgi, Kategori } from '../../types/index.ts';
import { RichTextRenderer } from '../shared/RichTextRenderer';

interface ZorunluBilgiAccordionProps {
  items: ZorunluBilgi[];
  kategoriler?: Kategori[];
  kategoriMapping?: Record<string, number[]>;
  title?: string;
}

export const ZorunluBilgiAccordion = ({ 
  items, 
  kategoriler,
  kategoriMapping,
  title = "Müşteriyle Paylaşılması Gereken Zorunlu Bilgiler" 
}: ZorunluBilgiAccordionProps) => {
  const [expandedIds, setExpandedIds] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedKategori, setSelectedKategori] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleItem = (id: number) => {
    setExpandedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const expandAll = () => setExpandedIds(items.map(i => i.id));
  const collapseAll = () => setExpandedIds([]);

  // Filter items
  let filteredItems = items;
  
  if (searchTerm) {
    filteredItems = filteredItems.filter(item =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.contentHtml.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  if (selectedKategori && kategoriMapping) {
    const kategoriIds = kategoriMapping[selectedKategori] || [];
    filteredItems = filteredItems.filter(item => kategoriIds.includes(item.id));
  }

  // Group by category if provided
  const groupedItems = kategoriler && kategoriMapping 
    ? kategoriler.map(kat => ({
        kategori: kat,
        items: filteredItems.filter(item => kategoriMapping[kat.id]?.includes(item.id))
      })).filter(g => g.items.length > 0)
    : null;

  if (items.length === 0) {
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

  const renderAccordionItem = (item: ZorunluBilgi) => {
    const isOpen = expandedIds.includes(item.id);
    const hasScript = item.contentHtml.includes('script-block');

    return (
      <div key={item.id} className="border border-[#E0E0E0] rounded-lg overflow-hidden">
        <button
          onClick={() => toggleItem(item.id)}
          className={`w-full px-4 py-3 flex items-center justify-between transition-colors ${
            isOpen ? 'bg-[#FFF8E1]' : 'bg-white hover:bg-[#FAFAFA]'
          }`}
        >
          <div className="flex items-center gap-3">
            <span className={`font-medium text-[13px] ${isOpen ? 'text-[#003366]' : 'text-[#333]'}`}>
              {item.title}
            </span>
            {hasScript && (
              <span className="px-2 py-0.5 bg-[#FFF3E0] text-[#E65100] text-[10px] font-semibold rounded-full border border-[#FFE0B2]">
                SCRIPT
              </span>
            )}
          </div>
          <svg 
            className={`w-5 h-5 text-[#666] transition-transform ${isOpen ? 'rotate-180' : ''}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {isOpen && (
          <div className="px-4 py-4 bg-white border-t border-[#E0E0E0]">
            <RichTextRenderer content={item.contentHtml} />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-[#FFFBEB] border-[3px] border-[#FFC900] rounded-xl overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 bg-[#FFC900] flex items-center justify-between hover:bg-[#FFD633] transition-colors"
      >
        <span className="font-semibold text-[#003366] text-sm">{title}</span>
        <svg 
          className={`w-5 h-5 text-[#003366] transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isExpanded && (
        <>
          {/* Toolbar */}
          <div className="px-4 py-3 bg-[#FFF7D6] space-y-3">
            {/* Search */}
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#999]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Zorunlu bilgi ara..."
                className="w-full pl-9 pr-4 py-2 border border-[#DDD] rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-[#005F9E] focus:border-transparent bg-white"
              />
            </div>

            {/* Category Filter & Expand/Collapse */}
            <div className="flex items-center justify-between gap-3 flex-wrap">
              {kategoriler && (
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => setSelectedKategori(null)}
                    className={`px-3 py-1.5 rounded-full text-[11px] font-semibold transition-colors ${
                      !selectedKategori 
                        ? 'bg-[#005F9E] text-white' 
                        : 'bg-white text-[#666] hover:bg-[#F5F5F5] border border-[#DDD]'
                    }`}
                  >
                    Tümü
                  </button>
                  {kategoriler.map(kat => (
                    <button
                      key={kat.id}
                      onClick={() => setSelectedKategori(kat.id)}
                      className={`px-3 py-1.5 rounded-full text-[11px] font-semibold transition-colors border ${
                        selectedKategori === kat.id 
                          ? 'text-white border-transparent' 
                          : 'bg-white text-[#666] hover:bg-[#F5F5F5] border-[#DDD]'
                      }`}
                      style={selectedKategori === kat.id ? { backgroundColor: kat.color } : {}}
                    >
                      {kat.name}
                    </button>
                  ))}
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <button
                  onClick={expandAll}
                  className="px-3 py-1.5 bg-white text-[#666] rounded-lg text-[11px] font-medium hover:bg-[#F5F5F5] transition-colors border border-[#DDD]"
                >
                  Hepsini Aç
                </button>
                <button
                  onClick={collapseAll}
                  className="px-3 py-1.5 bg-white text-[#666] rounded-lg text-[11px] font-medium hover:bg-[#F5F5F5] transition-colors border border-[#DDD]"
                >
                  Hepsini Kapat
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 bg-white space-y-3">
            {groupedItems ? (
              // Grouped by Category
              groupedItems.map(group => (
                <div key={group.kategori.id} className="space-y-2">
                  <div 
                    className="flex items-center gap-2 px-3 py-2 rounded-lg"
                    style={{ backgroundColor: group.kategori.color + '15' }}
                  >
                    <div 
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: group.kategori.color }}
                    />
                    <span className="font-semibold text-[12px]" style={{ color: group.kategori.color }}>
                      {group.kategori.name}
                    </span>
                    <span className="text-[11px] text-[#999]">
                      ({group.items.length} madde)
                    </span>
                  </div>
                  <div className="space-y-2 pl-2">
                    {group.items.map(renderAccordionItem)}
                  </div>
                </div>
              ))
            ) : (
              // Flat List
              filteredItems.map(renderAccordionItem)
            )}

            {filteredItems.length === 0 && (
              <div className="text-center py-8 text-[#999]">
                <p className="text-sm">Sonuç bulunamadı.</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2.5 bg-[#F8F9FA] border-t border-[#E9ECEF]">
            <div className="flex items-center gap-2 text-[12px] text-[#6C757D]">
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
