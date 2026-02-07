import { useState } from 'react';
import type { ZorunluBilgi } from '../../types/index.ts';

interface ZorunluBilgiSelectorProps {
  availableItems: ZorunluBilgi[];
  selectedIds: number[];
  onChange: (ids: number[]) => void;
  onPreview?: (item: ZorunluBilgi) => void;
}

export const ZorunluBilgiSelector = ({
  availableItems,
  selectedIds,
  onChange,
  onPreview
}: ZorunluBilgiSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const activeItems = availableItems.filter(item => item.isActive);
  const filteredItems = activeItems.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedItems = selectedIds
    .map(id => availableItems.find(item => item.id === id))
    .filter((item): item is ZorunluBilgi => item !== undefined);

  const handleAdd = (id: number) => {
    if (!selectedIds.includes(id)) {
      onChange([...selectedIds, id]);
    }
    setShowDropdown(false);
    setSearchTerm('');
  };

  const handleRemove = (id: number) => {
    onChange(selectedIds.filter(selectedId => selectedId !== id));
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newIds = [...selectedIds];
    [newIds[index - 1], newIds[index]] = [newIds[index], newIds[index - 1]];
    onChange(newIds);
  };

  const handleMoveDown = (index: number) => {
    if (index === selectedIds.length - 1) return;
    const newIds = [...selectedIds];
    [newIds[index], newIds[index + 1]] = [newIds[index + 1], newIds[index]];
    onChange(newIds);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-[#E5E7EB] overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#E5E7EB] bg-[#F9FAFB]">
        <h3 className="font-semibold text-[#1F2937] text-[14px]">Zorunlu Bilgiler (Lookup)</h3>
        <p className="text-[12px] text-[#6B7280] mt-0.5">
          Bu sayfada gösterilecek zorunlu bilgileri seçin ve sıralayın.
        </p>
      </div>

      {/* Add Button & Dropdown */}
      <div className="p-4 border-b border-[#E5E7EB]">
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#005F9E] text-white rounded-lg text-[13px] font-medium hover:bg-[#004D80] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Zorunlu Bilgi Ekle
          </button>

          {showDropdown && (
            <div className="absolute top-full left-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-[#E5E7EB] z-10">
              {/* Search */}
              <div className="p-3 border-b border-[#E5E7EB]">
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Ara..."
                    className="w-full pl-9 pr-4 py-2 border border-[#D1D5DB] rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-[#005F9E] focus:border-transparent"
                    autoFocus
                  />
                </div>
              </div>

              {/* List */}
              <div className="max-h-64 overflow-y-auto">
                {filteredItems.length === 0 ? (
                  <div className="p-4 text-center text-[#6B7280] text-[13px]">
                    Sonuç bulunamadı
                  </div>
                ) : (
                  filteredItems.map(item => {
                    const isSelected = selectedIds.includes(item.id);
                    return (
                      <button
                        key={item.id}
                        onClick={() => !isSelected && handleAdd(item.id)}
                        disabled={isSelected}
                        className={`w-full px-4 py-3 text-left flex items-center justify-between hover:bg-[#F9FAFB] transition-colors border-b border-[#F3F4F6] last:border-b-0 ${
                          isSelected ? 'bg-[#F0FDF4]' : ''
                        }`}
                      >
                        <div>
                          <p className={`font-medium text-[13px] ${isSelected ? 'text-[#166534]' : 'text-[#1F2937]'}`}>
                            {item.title}
                          </p>
                          <p className="text-[11px] text-[#6B7280] mt-0.5">
                            {item.usageCount} sayfada kullanılıyor
                          </p>
                        </div>
                        {isSelected ? (
                          <svg className="w-5 h-5 text-[#22C55E]" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5 text-[#D1D5DB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        )}
                      </button>
                    );
                  })
                )}
              </div>

              {/* Footer */}
              <div className="p-2 border-t border-[#E5E7EB] bg-[#F9FAFB]">
                <button
                  onClick={() => setShowDropdown(false)}
                  className="w-full px-3 py-1.5 text-[12px] text-[#6B7280] hover:text-[#1F2937] font-medium"
                >
                  Kapat
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Selected Items */}
      <div className="p-4">
        {selectedItems.length === 0 ? (
          <div className="text-center py-8">
            <svg className="w-12 h-12 text-[#D1D5DB] mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-[#6B7280] text-[13px]">Henüz zorunlu bilgi seçilmedi.</p>
            <p className="text-[#9CA3AF] text-[12px] mt-1">Yukarıdaki butona tıklayarak ekleyin.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {selectedItems.map((item, index) => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-3 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB] group hover:border-[#D1D5DB] transition-colors"
              >
                {/* Drag Handle & Order */}
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#9CA3AF] cursor-move" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z"/>
                  </svg>
                  <span className="w-6 h-6 rounded-full bg-[#005F9E] text-white text-[11px] font-bold flex items-center justify-center">
                    {index + 1}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[#1F2937] text-[13px] truncate">{item.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    {item.contentHtml.includes('script-block') && (
                      <span className="px-1.5 py-0.5 bg-[#FFF3E0] text-[#E65100] text-[9px] font-semibold rounded border border-[#FFE0B2]">
                        SCRIPT
                      </span>
                    )}
                    <span className="text-[11px] text-[#9CA3AF]">
                      ID: {item.id}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleMoveUp(index)}
                    disabled={index === 0}
                    className="p-1.5 text-[#6B7280] hover:text-[#1F2937] hover:bg-[#E5E7EB] rounded disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Yukarı taşı"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleMoveDown(index)}
                    disabled={index === selectedItems.length - 1}
                    className="p-1.5 text-[#6B7280] hover:text-[#1F2937] hover:bg-[#E5E7EB] rounded disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Aşağı taşı"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {onPreview && (
                    <button
                      onClick={() => onPreview(item)}
                      className="p-1.5 text-[#6B7280] hover:text-[#005F9E] hover:bg-[#EFF6FF] rounded"
                      title="Önizle"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                  )}
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="p-1.5 text-[#6B7280] hover:text-[#DC2626] hover:bg-[#FEF2F2] rounded"
                    title="Kaldır"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Info */}
      {selectedItems.length > 0 && (
        <div className="px-4 pb-4">
          <p className="text-[11px] text-[#9CA3AF] text-center">
            {selectedItems.length} zorunlu bilgi seçildi
          </p>
        </div>
      )}
    </div>
  );
};
