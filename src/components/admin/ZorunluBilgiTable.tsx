import { useState } from 'react';
import type { ZorunluBilgi, Kategori } from '../../types/index.ts';
import { Badge } from '../shared/Badge';

interface ZorunluBilgiTableProps {
  data: ZorunluBilgi[];
  kategoriler: Kategori[];
  onEdit: (item: ZorunluBilgi) => void;
  onDelete: (id: number) => void;
  onToggleActive: (id: number) => void;
  onPreview: (item: ZorunluBilgi) => void;
  onReorder: (data: ZorunluBilgi[]) => void;
}

export const ZorunluBilgiTable = ({ 
  data, 
  kategoriler,
  onEdit, 
  onDelete, 
  onToggleActive, 
  onPreview,
  onReorder
}: ZorunluBilgiTableProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState<'all' | 'active' | 'inactive'>('all');
  const [filterKategori, setFilterKategori] = useState<string | null>(null);

  const filteredData = data.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterActive === 'all' || 
      (filterActive === 'active' && item.isActive) ||
      (filterActive === 'inactive' && !item.isActive);
    const matchesKategori = !filterKategori || item.kategoriId === filterKategori;
    return matchesSearch && matchesFilter && matchesKategori;
  }).sort((a, b) => {
    // Önce kategoriye göre, sonra displayOrder'a göre sırala
    const katA = kategoriler.findIndex(k => k.id === a.kategoriId);
    const katB = kategoriler.findIndex(k => k.id === b.kategoriId);
    if (katA !== katB) return katA - katB;
    return a.displayOrder - b.displayOrder;
  });

  const getKategoriName = (kategoriId: string) => {
    return kategoriler.find(k => k.id === kategoriId)?.name || kategoriId;
  };

  const hasScriptBlock = (content: string) => content.includes('script-block');
  const truncateText = (html: string, maxLength: number = 100) => {
    // HTML entity'lerini de decode etmek için geçici bir DOM element kullan
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    const text = (tmp.textContent || tmp.innerText || '').trim();
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const handleMoveUp = (item: ZorunluBilgi) => {
    const katItems = data
      .filter(d => d.kategoriId === item.kategoriId)
      .sort((a, b) => a.displayOrder - b.displayOrder);
    const idx = katItems.findIndex(i => i.id === item.id);
    if (idx <= 0) return;

    const prev = katItems[idx - 1];
    const updated = data.map(d => {
      if (d.id === item.id) return { ...d, displayOrder: prev.displayOrder };
      if (d.id === prev.id) return { ...d, displayOrder: item.displayOrder };
      return d;
    });
    onReorder(updated);
  };

  const handleMoveDown = (item: ZorunluBilgi) => {
    const katItems = data
      .filter(d => d.kategoriId === item.kategoriId)
      .sort((a, b) => a.displayOrder - b.displayOrder);
    const idx = katItems.findIndex(i => i.id === item.id);
    if (idx >= katItems.length - 1) return;

    const next = katItems[idx + 1];
    const updated = data.map(d => {
      if (d.id === item.id) return { ...d, displayOrder: next.displayOrder };
      if (d.id === next.id) return { ...d, displayOrder: item.displayOrder };
      return d;
    });
    onReorder(updated);
  };

  const isFirstInKategori = (item: ZorunluBilgi) => {
    const katItems = data.filter(d => d.kategoriId === item.kategoriId).sort((a, b) => a.displayOrder - b.displayOrder);
    return katItems[0]?.id === item.id;
  };

  const isLastInKategori = (item: ZorunluBilgi) => {
    const katItems = data.filter(d => d.kategoriId === item.kategoriId).sort((a, b) => a.displayOrder - b.displayOrder);
    return katItems[katItems.length - 1]?.id === item.id;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Search and Filter Bar */}
      <div className="p-4 border-b border-gray-200 space-y-3">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Zorunlu bilgi ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005F9E] focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilterActive('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterActive === 'all' 
                  ? 'bg-[#005F9E] text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Tümü ({data.length})
            </button>
            <button
              onClick={() => setFilterActive('active')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterActive === 'active' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Aktif ({data.filter(d => d.isActive).length})
            </button>
            <button
              onClick={() => setFilterActive('inactive')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterActive === 'inactive' 
                  ? 'bg-red-600 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Pasif ({data.filter(d => !d.isActive).length})
            </button>
          </div>
        </div>

        {/* Kategori Filter */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-medium text-gray-500">Kategori:</span>
          <button
            onClick={() => setFilterKategori(null)}
            className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-colors ${
              !filterKategori 
                ? 'bg-[#005F9E] text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Tümü
          </button>
          {kategoriler.map(kat => (
            <button
              key={kat.id}
              onClick={() => setFilterKategori(kat.id)}
              className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-colors ${
                filterKategori === kat.id 
                  ? 'bg-[#005F9E] text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {kat.name} ({data.filter(d => d.kategoriId === kat.id).length})
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider w-16">
                Sıra
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Başlık
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Kategori
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                İçerik Özeti
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Script
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Durum
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredData.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                {/* Sıra */}
                <td className="px-3 py-4">
                  <div className="flex flex-col items-center gap-0.5">
                    <button
                      onClick={() => handleMoveUp(item)}
                      disabled={isFirstInKategori(item)}
                      className="p-0.5 text-gray-400 hover:text-[#005F9E] disabled:opacity-20 disabled:cursor-not-allowed"
                      title="Yukarı taşı"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    </button>
                    <span className="w-6 h-6 rounded-full bg-[#005F9E] text-white text-[10px] font-bold flex items-center justify-center">
                      {item.displayOrder}
                    </span>
                    <button
                      onClick={() => handleMoveDown(item)}
                      disabled={isLastInKategori(item)}
                      className="p-0.5 text-gray-400 hover:text-[#005F9E] disabled:opacity-20 disabled:cursor-not-allowed"
                      title="Aşağı taşı"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="font-medium text-gray-900">{item.title}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    Güncelleme: {item.updatedAt}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className="px-2.5 py-1 bg-[#005F9E]/10 text-[#005F9E] text-[11px] font-semibold rounded-full">
                    {getKategoriName(item.kategoriId)}
                  </span>
                </td>
                <td className="px-4 py-4 max-w-[200px]">
                  <p className="text-sm text-gray-600 truncate">
                    {truncateText(item.contentHtml, 60)}
                  </p>
                </td>
                <td className="px-4 py-4 text-center">
                  {hasScriptBlock(item.contentHtml) ? (
                    <Badge variant="warning">Script Var</Badge>
                  ) : (
                    <Badge variant="default">Yok</Badge>
                  )}
                </td>
                <td className="px-4 py-4 text-center">
                  <button
                    onClick={() => onToggleActive(item.id)}
                    className="inline-flex items-center"
                    title={item.isActive ? 'Pasif yap' : 'Aktif yap'}
                  >
                    {item.isActive ? (
                      <svg className="w-8 h-8 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17 7H7a5 5 0 000 10h10a5 5 0 000-10zm0 8a3 3 0 110-6 3 3 0 010 6z" />
                      </svg>
                    ) : (
                      <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17 7H7a5 5 0 000 10h10a5 5 0 000-10zM7 15a3 3 0 110-6 3 3 0 010 6z" />
                      </svg>
                    )}
                  </button>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => onPreview(item)}
                      className="p-2 text-gray-500 hover:text-[#005F9E] hover:bg-blue-50 rounded-lg transition-colors"
                      title="Önizle"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => onEdit(item)}
                      className="p-2 text-gray-500 hover:text-[#E65100] hover:bg-orange-50 rounded-lg transition-colors"
                      title="Düzenle"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => onDelete(item.id)}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Sil"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredData.length === 0 && (
        <div className="p-8 text-center">
          <p className="text-gray-500">Sonuç bulunamadı.</p>
        </div>
      )}
    </div>
  );
};
