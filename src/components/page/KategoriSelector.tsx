import { useState } from 'react';
import type { Kategori, ZorunluBilgi } from '../../types/index.ts';

interface KategoriSelectorProps {
  availableKategoriler: Kategori[];
  selectedKategoriIds: string[];
  zorunluBilgilerByKategori: Record<string, ZorunluBilgi[]>;
  onChange: (ids: string[]) => void;
}

export const KategoriSelector = ({
  availableKategoriler,
  selectedKategoriIds,
  zorunluBilgilerByKategori,
  onChange
}: KategoriSelectorProps) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const selectedKategoriler = selectedKategoriIds
    .map(id => availableKategoriler.find(k => k.id === id))
    .filter((k): k is Kategori => k !== undefined);

  const handleAdd = (id: string) => {
    if (!selectedKategoriIds.includes(id)) {
      onChange([...selectedKategoriIds, id]);
    }
    setShowDropdown(false);
  };

  const handleRemove = (id: string) => {
    onChange(selectedKategoriIds.filter(kid => kid !== id));
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newIds = [...selectedKategoriIds];
    [newIds[index - 1], newIds[index]] = [newIds[index], newIds[index - 1]];
    onChange(newIds);
  };

  const handleMoveDown = (index: number) => {
    if (index === selectedKategoriIds.length - 1) return;
    const newIds = [...selectedKategoriIds];
    [newIds[index], newIds[index + 1]] = [newIds[index + 1], newIds[index]];
    onChange(newIds);
  };

  const totalZB = selectedKategoriIds.reduce((sum, katId) => {
    return sum + (zorunluBilgilerByKategori[katId]?.length || 0);
  }, 0);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-[#E5E7EB] overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#E5E7EB] bg-[#F9FAFB]">
        <h3 className="font-semibold text-[#1F2937] text-[14px]">Zorunlu Bilgi Kategorileri</h3>
        <p className="text-[12px] text-[#6B7280] mt-0.5">
          Bu sayfada gösterilecek kategorileri seçin. Kategorilere bağlı zorunlu bilgiler otomatik görüntülenecektir.
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
            Kategori Ekle
          </button>

          {showDropdown && (
            <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-[#E5E7EB] z-10">
              <div className="max-h-64 overflow-y-auto">
                {availableKategoriler.map(kat => {
                  const isSelected = selectedKategoriIds.includes(kat.id);
                  const zbCount = zorunluBilgilerByKategori[kat.id]?.length || 0;
                  return (
                    <button
                      key={kat.id}
                      onClick={() => !isSelected && handleAdd(kat.id)}
                      disabled={isSelected}
                      className={`w-full px-4 py-3 text-left flex items-center justify-between hover:bg-[#F9FAFB] transition-colors border-b border-[#F3F4F6] last:border-b-0 ${
                        isSelected ? 'bg-[#F0FDF4]' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: kat.color }} />
                        <div>
                          <p className={`font-semibold text-[13px] ${isSelected ? 'text-[#166534]' : 'text-[#1F2937]'}`}>
                            {kat.name}
                          </p>
                          <p className="text-[11px] text-[#6B7280]">
                            {zbCount} zorunlu bilgi
                          </p>
                        </div>
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
                })}
              </div>
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

      {/* Selected Kategoriler */}
      <div className="p-4">
        {selectedKategoriler.length === 0 ? (
          <div className="text-center py-8">
            <svg className="w-12 h-12 text-[#D1D5DB] mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <p className="text-[#6B7280] text-[13px]">Henüz kategori seçilmedi.</p>
            <p className="text-[#9CA3AF] text-[12px] mt-1">Yukarıdaki butona tıklayarak kategori ekleyin.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {selectedKategoriler.map((kat, index) => {
              const zbCount = zorunluBilgilerByKategori[kat.id]?.length || 0;
              return (
                <div
                  key={kat.id}
                  className="flex items-center gap-3 p-3 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB] group hover:border-[#D1D5DB] transition-colors"
                >
                  {/* Order */}
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#9CA3AF] cursor-move" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z"/>
                    </svg>
                    <span className="w-6 h-6 rounded-full bg-[#005F9E] text-white text-[11px] font-bold flex items-center justify-center">
                      {index + 1}
                    </span>
                  </div>

                  {/* Kategori Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: kat.color }} />
                      <p className="font-semibold text-[#1F2937] text-[13px]">{kat.name}</p>
                    </div>
                    <p className="text-[11px] text-[#9CA3AF] mt-0.5 pl-[18px]">
                      {zbCount} zorunlu bilgi
                    </p>
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
                      disabled={index === selectedKategoriler.length - 1}
                      className="p-1.5 text-[#6B7280] hover:text-[#1F2937] hover:bg-[#E5E7EB] rounded disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Aşağı taşı"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleRemove(kat.id)}
                      className="p-1.5 text-[#6B7280] hover:text-[#DC2626] hover:bg-[#FEF2F2] rounded"
                      title="Kaldır"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      {selectedKategoriler.length > 0 && (
        <div className="px-4 pb-4">
          <p className="text-[11px] text-[#9CA3AF] text-center">
            {selectedKategoriler.length} kategori seçildi - toplam {totalZB} zorunlu bilgi
          </p>
        </div>
      )}
    </div>
  );
};
