import { useState, useEffect } from 'react';
import type { ZorunluBilgi, ZorunluBilgiFormData, Kategori } from '../../types/index.ts';
import { RichTextEditor } from '../shared/RichTextEditor';

interface ZorunluBilgiFormProps {
  editingItem: ZorunluBilgi | null;
  kategoriler: Kategori[];
  onSave: (data: ZorunluBilgiFormData) => void;
  onCancel: () => void;
}

export const ZorunluBilgiForm = ({ editingItem, kategoriler, onSave, onCancel }: ZorunluBilgiFormProps) => {
  const [formData, setFormData] = useState<ZorunluBilgiFormData>({
    title: '',
    contentHtml: '',
    kategoriId: kategoriler[0]?.id || '',
    isActive: true
  });

  useEffect(() => {
    if (editingItem) {
      setFormData({
        title: editingItem.title,
        contentHtml: editingItem.contentHtml,
        kategoriId: editingItem.kategoriId,
        isActive: editingItem.isActive
      });
    } else {
      setFormData({
        title: '',
        contentHtml: '',
        kategoriId: kategoriler[0]?.id || '',
        isActive: true
      });
    }
  }, [editingItem, kategoriler]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-[#003366] text-white px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {editingItem ? 'Zorunlu Bilgi Düzenle' : 'Yeni Zorunlu Bilgi Ekle'}
          </h2>
          <button
            onClick={onCancel}
            className="p-1 hover:bg-white/10 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-130px)]">
          <div className="p-6 space-y-6">
            {/* Kategori */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kategori <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.kategoriId}
                onChange={(e) => setFormData({ ...formData, kategoriId: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005F9E] focus:border-transparent"
                required
              >
                {kategoriler.map(kat => (
                  <option key={kat.id} value={kat.id}>{kat.name}</option>
                ))}
              </select>
              <p className="mt-1 text-xs text-gray-500">
                Bu zorunlu bilginin ait olduğu kategoriyi seçin.
              </p>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Başlık <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Örn: Cayma Bedeli Bilgisi"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005F9E] focus:border-transparent"
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                Tab başlığında görünecek kısa ve açıklayıcı bir isim girin.
              </p>
            </div>

            {/* Content with RichText Editor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                İçerik <span className="text-red-500">*</span>
              </label>
              <RichTextEditor
                value={formData.contentHtml}
                onChange={(value) => setFormData({ ...formData, contentHtml: value })}
                placeholder="Zorunlu bilgi içeriğini yazın. Script blokları eklemek için üstteki butonu kullanın."
              />
            </div>

            {/* Active Status */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">Aktif Durum</h3>
                <p className="text-sm text-gray-500">
                  Pasif olan zorunlu bilgiler sayfalarda seçilemez.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                className="flex items-center gap-2"
              >
                {formData.isActive ? (
                  <>
                    <svg className="w-10 h-10 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17 7H7a5 5 0 000 10h10a5 5 0 000-10zm0 8a3 3 0 110-6 3 3 0 010 6z" />
                    </svg>
                    <span className="text-green-600 font-medium">Aktif</span>
                  </>
                ) : (
                  <>
                    <svg className="w-10 h-10 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17 7H7a5 5 0 000 10h10a5 5 0 000-10zM7 15a3 3 0 110-6 3 3 0 010 6z" />
                    </svg>
                    <span className="text-gray-500 font-medium">Pasif</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 flex items-center justify-end gap-3 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              İptal
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#005F9E] text-white rounded-lg hover:bg-[#004D80] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {editingItem ? 'Güncelle' : 'Kaydet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
