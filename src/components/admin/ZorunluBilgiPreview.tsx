import type { ZorunluBilgi } from '../../types/index.ts';
import { RichTextRenderer } from '../shared/RichTextRenderer';
import { Badge } from '../shared/Badge';

interface ZorunluBilgiPreviewProps {
  item: ZorunluBilgi;
  kategoriName?: string;
  onClose: () => void;
}

export const ZorunluBilgiPreview = ({ item, kategoriName, onClose }: ZorunluBilgiPreviewProps) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-[#FFD100] px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#003366]">{item.title}</h2>
            <div className="flex items-center gap-4 mt-1 text-sm text-gray-700">
              <span className="inline-flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                </svg>
                ID: {item.id}
              </span>
              <span className="inline-flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {item.updatedAt}
              </span>
              {kategoriName && (
                <span className="px-2 py-0.5 bg-[#005F9E]/20 text-[#005F9E] text-xs font-semibold rounded-full">
                  {kategoriName}
                </span>
              )}
              {item.isActive ? (
                <span className="inline-flex items-center gap-1 text-green-700 text-xs font-medium">Aktif</span>
              ) : (
                <span className="inline-flex items-center gap-1 text-red-700 text-xs font-medium">Pasif</span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-black/10 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          <div className="mb-4 flex items-center gap-2">
            <Badge variant="info">{item.usageCount} sayfada kullanılıyor</Badge>
            {item.contentHtml.includes('script-block') && (
              <Badge variant="warning">Script İçeriyor</Badge>
            )}
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Son Kullanıcı Görünümü
            </p>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <RichTextRenderer content={item.contentHtml} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-[#005F9E] text-white rounded-lg hover:bg-[#004D80] transition-colors"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
