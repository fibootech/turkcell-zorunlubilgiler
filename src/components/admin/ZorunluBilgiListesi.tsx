import { useState, useCallback } from 'react';
import type { ZorunluBilgi, ZorunluBilgiFormData, Kategori, KategoriFormData } from '../../types/index.ts';
import {
  getStoredZorunluBilgiler, saveZorunluBilgiler,
  getStoredKategoriler, saveKategoriler,
  resetAllData
} from '../../data/storage';
import { ZorunluBilgiTable } from './ZorunluBilgiTable';
import { ZorunluBilgiForm } from './ZorunluBilgiForm';
import { ZorunluBilgiPreview } from './ZorunluBilgiPreview';

type AdminTab = 'zorunlu-bilgiler' | 'kategoriler';

export const ZorunluBilgiListesi = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('zorunlu-bilgiler');
  const [data, setData] = useState<ZorunluBilgi[]>(getStoredZorunluBilgiler);
  const [kategoriler, setKategoriler] = useState<Kategori[]>(getStoredKategoriler);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<ZorunluBilgi | null>(null);
  const [previewItem, setPreviewItem] = useState<ZorunluBilgi | null>(null);

  // Kategori form state
  const [showKategoriForm, setShowKategoriForm] = useState(false);
  const [editingKategori, setEditingKategori] = useState<Kategori | null>(null);
  const [kategoriFormData, setKategoriFormData] = useState<KategoriFormData>({ name: '', color: '#005F9E' });

  // State'i güncelle + localStorage'a yaz
  const updateData = useCallback((newData: ZorunluBilgi[]) => {
    setData(newData);
    saveZorunluBilgiler(newData);
  }, []);

  const updateKategoriler = useCallback((newKats: Kategori[]) => {
    setKategoriler(newKats);
    saveKategoriler(newKats);
  }, []);

  // ZB Handlers
  const handleAdd = () => {
    setEditingItem(null);
    setShowForm(true);
  };

  const handleEdit = (item: ZorunluBilgi) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleSave = (formData: ZorunluBilgiFormData) => {
    if (editingItem) {
      const updated = data.map(item => 
        item.id === editingItem.id 
          ? { ...item, ...formData, updatedAt: new Date().toISOString().split('T')[0] }
          : item
      );
      updateData(updated);
    } else {
      const newItem: ZorunluBilgi = {
        id: Math.max(...data.map(d => d.id), 0) + 1,
        ...formData,
        displayOrder: data.filter(d => d.kategoriId === formData.kategoriId).length + 1,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
        usageCount: 0
      };
      updateData([...data, newItem]);
    }
    setShowForm(false);
    setEditingItem(null);
  };

  const handleDelete = (id: number) => {
    if (confirm('Bu zorunlu bilgiyi silmek istediğinizden emin misiniz?')) {
      updateData(data.filter(item => item.id !== id));
    }
  };

  const handleToggleActive = (id: number) => {
    updateData(data.map(item => 
      item.id === id ? { ...item, isActive: !item.isActive } : item
    ));
  };

  const handlePreview = (item: ZorunluBilgi) => {
    setPreviewItem(item);
  };

  // Kategori Handlers
  const handleAddKategori = () => {
    setEditingKategori(null);
    setKategoriFormData({ name: '', color: '#005F9E' });
    setShowKategoriForm(true);
  };

  const handleEditKategori = (kat: Kategori) => {
    setEditingKategori(kat);
    setKategoriFormData({ name: kat.name, color: kat.color });
    setShowKategoriForm(true);
  };

  const handleSaveKategori = () => {
    if (!kategoriFormData.name.trim()) return;
    
    if (editingKategori) {
      updateKategoriler(kategoriler.map(k => 
        k.id === editingKategori.id ? { ...k, name: kategoriFormData.name, color: kategoriFormData.color } : k
      ));
    } else {
      const newKat: Kategori = {
        id: kategoriFormData.name.toLowerCase().replace(/[^a-z0-9ğüşıöç]/g, '-').replace(/-+/g, '-'),
        name: kategoriFormData.name.toUpperCase(),
        color: kategoriFormData.color,
        displayOrder: kategoriler.length + 1
      };
      updateKategoriler([...kategoriler, newKat]);
    }
    setShowKategoriForm(false);
    setEditingKategori(null);
  };

  const handleDeleteKategori = (id: string) => {
    const zbCount = data.filter(d => d.kategoriId === id).length;
    if (zbCount > 0) {
      alert(`Bu kategoride ${zbCount} zorunlu bilgi bulunmaktadır. Önce zorunlu bilgileri farklı bir kategoriye taşıyın.`);
      return;
    }
    if (confirm('Bu kategoriyi silmek istediğinizden emin misiniz?')) {
      updateKategoriler(kategoriler.filter(k => k.id !== id));
    }
  };

  const handleResetToDefault = () => {
    if (confirm('Tüm veriler varsayılana sıfırlanacak. Emin misiniz?')) {
      resetAllData();
      setData(getStoredZorunluBilgiler());
      setKategoriler(getStoredKategoriler());
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-[#003366] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <div>
                <h1 className="text-2xl font-bold">Zorunlu Bilgiler Yönetimi</h1>
                <p className="text-blue-200 text-sm">
                  Müşteriyle paylaşılması gereken zorunlu bilgileri ve kategorileri yönetin
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleResetToDefault}
                className="inline-flex items-center gap-1.5 px-3 py-2 border border-white/20 text-white/70 text-xs font-medium rounded-lg hover:bg-white/10 hover:text-white transition-colors"
                title="Verileri varsayılana sıfırla"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Sıfırla
              </button>
              <button
                onClick={activeTab === 'zorunlu-bilgiler' ? handleAdd : handleAddKategori}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#FFD100] text-[#003366] font-semibold rounded-lg hover:bg-yellow-400 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                {activeTab === 'zorunlu-bilgiler' ? 'Yeni ZB Ekle' : 'Yeni Kategori'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="bg-[#003366] border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab('zorunlu-bilgiler')}
              className={`px-5 py-2.5 text-sm font-medium rounded-t-lg transition-colors ${
                activeTab === 'zorunlu-bilgiler'
                  ? 'bg-gray-100 text-[#003366]'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              Zorunlu Bilgiler
            </button>
            <button
              onClick={() => setActiveTab('kategoriler')}
              className={`px-5 py-2.5 text-sm font-medium rounded-t-lg transition-colors ${
                activeTab === 'kategoriler'
                  ? 'bg-gray-100 text-[#003366]'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              Kategoriler
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'zorunlu-bilgiler' ? (
          <ZorunluBilgiTable
            data={data}
            kategoriler={kategoriler}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleActive={handleToggleActive}
            onPreview={handlePreview}
            onReorder={(updatedData) => updateData(updatedData)}
          />
        ) : (
          /* Kategori Yönetimi */
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Sıra</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Kategori Adı</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Renk</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">ZB Sayısı</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {kategoriler.sort((a, b) => a.displayOrder - b.displayOrder).map((kat) => {
                    const zbCount = data.filter(d => d.kategoriId === kat.id).length;
                    return (
                      <tr key={kat.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4">
                          <span className="w-7 h-7 rounded-full bg-[#005F9E] text-white text-xs font-bold flex items-center justify-center">
                            {kat.displayOrder}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <span className="font-semibold text-gray-900">{kat.name}</span>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-6 h-6 rounded-full border border-gray-200" style={{ backgroundColor: kat.color }} />
                            <span className="text-xs text-gray-500">{kat.color}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span className="px-2.5 py-1 bg-blue-50 text-[#005F9E] text-xs font-semibold rounded-full">
                            {zbCount} ZB
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleEditKategori(kat)}
                              className="p-2 text-gray-500 hover:text-[#E65100] hover:bg-orange-50 rounded-lg transition-colors"
                              title="Düzenle"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDeleteKategori(kat.id)}
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
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ZB Form Modal */}
      {showForm && (
        <ZorunluBilgiForm
          editingItem={editingItem}
          kategoriler={kategoriler}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditingItem(null);
          }}
        />
      )}

      {/* Kategori Form Modal */}
      {showKategoriForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="bg-[#003366] text-white px-6 py-4 rounded-t-xl flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                {editingKategori ? 'Kategori Düzenle' : 'Yeni Kategori Ekle'}
              </h2>
              <button onClick={() => setShowKategoriForm(false)} className="p-1 hover:bg-white/10 rounded-lg">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kategori Adı</label>
                <input
                  type="text"
                  value={kategoriFormData.name}
                  onChange={(e) => setKategoriFormData({ ...kategoriFormData, name: e.target.value })}
                  placeholder="Örn: SIFIR SATIŞ"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005F9E]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Renk</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={kategoriFormData.color}
                    onChange={(e) => setKategoriFormData({ ...kategoriFormData, color: e.target.value })}
                    className="w-10 h-10 rounded border border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={kategoriFormData.color}
                    onChange={(e) => setKategoriFormData({ ...kategoriFormData, color: e.target.value })}
                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-4 rounded-b-xl flex justify-end gap-3 border-t">
              <button onClick={() => setShowKategoriForm(false)} className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                İptal
              </button>
              <button onClick={handleSaveKategori} className="px-4 py-2 bg-[#005F9E] text-white rounded-lg hover:bg-[#004D80]">
                {editingKategori ? 'Güncelle' : 'Kaydet'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewItem && (
        <ZorunluBilgiPreview
          item={previewItem}
          kategoriName={kategoriler.find(k => k.id === previewItem.kategoriId)?.name || ''}
          onClose={() => setPreviewItem(null)}
        />
      )}
    </div>
  );
};
