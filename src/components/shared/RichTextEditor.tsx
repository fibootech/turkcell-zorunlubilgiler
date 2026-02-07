import { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

// ─── Script Renk Presetleri ──────────────────────────────────
const SCRIPT_COLOR_PRESETS = [
  { id: 'amber',  label: 'Amber',    border: '#FFC900', bg: '#FFFBEB', labelColor: '#92400E' },
  { id: 'blue',   label: 'Mavi',     border: '#3B82F6', bg: '#EFF6FF', labelColor: '#1E40AF' },
  { id: 'red',    label: 'Kırmızı',  border: '#EF4444', bg: '#FEF2F2', labelColor: '#991B1B' },
  { id: 'green',  label: 'Yeşil',    border: '#22C55E', bg: '#F0FDF4', labelColor: '#166534' },
  { id: 'purple', label: 'Mor',      border: '#A855F7', bg: '#FAF5FF', labelColor: '#6B21A8' },
  { id: 'orange', label: 'Turuncu',  border: '#F97316', bg: '#FFF7ED', labelColor: '#9A3412' },
  { id: 'teal',   label: 'Turkuaz',  border: '#14B8A6', bg: '#F0FDFA', labelColor: '#115E59' },
  { id: 'slate',  label: 'Gri',      border: '#64748B', bg: '#F8FAFC', labelColor: '#334155' },
];

const DEFAULT_COLOR = SCRIPT_COLOR_PRESETS[0]; // amber

function getColorPreset(colorId?: string) {
  return SCRIPT_COLOR_PRESETS.find(c => c.id === colorId) || DEFAULT_COLOR;
}

// ─── Custom Script Block Blot (Quill Extension) ──────────────
const Quill = ReactQuill.Quill;
const BlockEmbed = Quill.import('blots/block/embed') as any;

class ScriptBlockBlot extends BlockEmbed {
  static blotName = 'scriptBlock';
  static tagName = 'div';
  static className = 'script-block';

  static create(value: { label: string; content: string; colorId?: string }) {
    const node = super.create() as HTMLDivElement;
    node.setAttribute('data-script', 'true');
    node.setAttribute('contenteditable', 'false');

    const label = value?.label || '';
    const content = value?.content || '';
    const colorId = value?.colorId || 'amber';
    const preset = getColorPreset(colorId);

    node.setAttribute('data-color', colorId);
    node.style.background = preset.bg;
    node.style.borderLeftColor = preset.border;

    node.innerHTML = `<span class="script-label" style="color:${preset.labelColor}">${label}</span><div class="script-content">${content}</div>`;
    return node;
  }

  static value(node: HTMLElement): { label: string; content: string; colorId: string } {
    return {
      label: node.querySelector('.script-label')?.textContent || '',
      content: node.querySelector('.script-content')?.innerHTML || '',
      colorId: node.getAttribute('data-color') || 'amber'
    };
  }
}

Quill.register(ScriptBlockBlot, true);

// ─── Component ────────────────────────────────────────────────
interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const RichTextEditor = ({ value, onChange, placeholder }: RichTextEditorProps) => {
  const quillRef = useRef<ReactQuill>(null);

  // Script modal state
  const [showScriptModal, setShowScriptModal] = useState(false);
  const [scriptLabel, setScriptLabel] = useState('');
  const [scriptContent, setScriptContent] = useState('');
  const [scriptColorId, setScriptColorId] = useState('amber');
  const [editingScriptIndex, setEditingScriptIndex] = useState<number | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const selectedPreset = getColorPreset(scriptColorId);

  // Click handler for editing existing script blocks
  useEffect(() => {
    const quill = quillRef.current?.getEditor();
    if (!quill) return;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const scriptBlock = target.closest('.script-block');
      if (!scriptBlock) return;

      e.preventDefault();
      e.stopPropagation();

      // DOM'dan değerleri oku
      const val = ScriptBlockBlot.value(scriptBlock as HTMLElement);

      // Tıklanan script bloğunun DOM sırasını bul
      const allScriptBlocks = quill.root.querySelectorAll('.script-block');
      let clickedBlockOrder = -1;
      allScriptBlocks.forEach((block, idx) => {
        if (block === scriptBlock) clickedBlockOrder = idx;
      });

      if (clickedBlockOrder === -1) return;

      // Delta üzerinden N. scriptBlock'un index'ini bul
      const delta = quill.getContents();
      let pos = 0;
      let scriptCount = 0;
      let foundIndex = -1;

      for (const op of delta.ops) {
        if (op.insert && typeof op.insert === 'object' && (op.insert as any).scriptBlock) {
          if (scriptCount === clickedBlockOrder) {
            foundIndex = pos;
            break;
          }
          scriptCount++;
        }
        pos += typeof op.insert === 'string' ? op.insert.length : 1;
      }

      if (foundIndex === -1) return;

      setEditingScriptIndex(foundIndex);
      setScriptLabel(val.label);
      setScriptContent(val.content);
      setScriptColorId(val.colorId);
      setShowPreview(false);
      setShowScriptModal(true);
    };

    quill.root.addEventListener('click', handleClick);
    return () => {
      quill.root.removeEventListener('click', handleClick);
    };
  }, []);

  const handleInsertScript = useCallback(() => {
    setEditingScriptIndex(null);
    setScriptLabel('');
    setScriptContent('');
    setScriptColorId('amber');
    setShowPreview(false);
    setShowScriptModal(true);
  }, []);

  const handleSaveScript = useCallback(() => {
    const quill = quillRef.current?.getEditor();
    if (!quill) return;

    if (!scriptContent.trim()) return;

    const payload = {
      label: scriptLabel,
      content: scriptContent,
      colorId: scriptColorId
    };

    if (editingScriptIndex !== null) {
      quill.deleteText(editingScriptIndex, 1);
      quill.insertEmbed(editingScriptIndex, 'scriptBlock', payload, 'user');
    } else {
      const range = quill.getSelection(true);
      const position = range ? range.index : quill.getLength() - 1;
      quill.insertText(position, '\n', 'user');
      quill.insertEmbed(position + 1, 'scriptBlock', payload, 'user');
      quill.insertText(position + 2, '\n', 'user');
      quill.setSelection(position + 3, 0);
    }

    setShowScriptModal(false);
    setEditingScriptIndex(null);
  }, [editingScriptIndex, scriptLabel, scriptContent, scriptColorId]);

  const handleDeleteScript = useCallback(() => {
    if (editingScriptIndex === null) return;
    if (!confirm('Bu script bloğunu silmek istediğinizden emin misiniz?')) return;

    const quill = quillRef.current?.getEditor();
    if (!quill) return;

    quill.deleteText(editingScriptIndex, 1);
    setShowScriptModal(false);
    setEditingScriptIndex(null);
  }, [editingScriptIndex]);

  // Mini Quill modülleri (script content editörü için)
  const miniModules = useMemo(() => ({
    toolbar: {
      container: [
        ['bold', 'italic', 'underline'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['link'],
        [{ 'color': [] }],
        ['clean']
      ]
    },
    clipboard: {
      matchVisual: false
    }
  }), []);

  const miniFormats = useMemo(() => [
    'bold', 'italic', 'underline',
    'list', 'bullet',
    'link',
    'color'
  ], []);

  // Ana editör modülleri
  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['link'],
        [{ 'color': [] }, { 'background': [] }],
        ['blockquote'],
        ['clean']
      ]
    },
    clipboard: {
      matchVisual: false
    }
  }), []);

  const formats = useMemo(() => [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'link',
    'color', 'background',
    'blockquote',
    'scriptBlock'
  ], []);

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      {/* Script ekleme toolbar */}
      <div className="bg-gray-50 border-b border-gray-300 px-3 py-2 flex items-center justify-between">
        <button
          type="button"
          onClick={handleInsertScript}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#E65100] text-white text-[12px] font-semibold rounded-md hover:bg-[#BF360C] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Script Bloğu Ekle
        </button>
        <span className="text-[11px] text-gray-400">
          Script bloklarına tıklayarak düzenleyebilirsiniz
        </span>
      </div>

      {/* Ana Quill Editör */}
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder || "Zorunlu bilgi içeriğini yazın..."}
        className="quill-editor"
      />

      {/* Bilgi satırı */}
      <div className="bg-gray-50 border-t border-gray-300 px-3 py-2">
        <p className="text-[11px] text-gray-500">
          <strong>İpucu:</strong> Script blokları düzenlemek için üzerine tıklayın.
        </p>
      </div>

      {/* ─── Script Düzenleme Modal ─── */}
      {showScriptModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-[#003366] text-white px-5 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-[#E65100] rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-[15px]">
                    {editingScriptIndex !== null ? 'Script Bloğu Düzenle' : 'Yeni Script Bloğu'}
                  </h3>
                  <p className="text-white/60 text-[11px]">Müşteriye okunması gereken script içeriği</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowScriptModal(false)}
                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                title="Kapat"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto max-h-[calc(85vh-140px)]">
              <div className="p-5 space-y-4">
                {/* Renk Seçimi + Başlık aynı satırda */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Script Başlığı */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Script Başlığı
                    </label>
                    <input
                      type="text"
                      value={scriptLabel}
                      onChange={(e) => setScriptLabel(e.target.value)}
                      placeholder="Örn: Okunması Gereken Script"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#005F9E] focus:border-transparent"
                    />
                  </div>

                  {/* Renk Seçimi */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Blok Rengi
                    </label>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {SCRIPT_COLOR_PRESETS.map(preset => (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => setScriptColorId(preset.id)}
                          title={preset.label}
                          className={`w-7 h-7 rounded-full border-2 transition-all flex items-center justify-center ${
                            scriptColorId === preset.id
                              ? 'scale-110 shadow-md'
                              : 'hover:scale-105 border-transparent'
                          }`}
                          style={{
                            backgroundColor: preset.bg,
                            borderColor: scriptColorId === preset.id ? preset.border : 'transparent',
                          }}
                        >
                          <div
                            className="w-3.5 h-3.5 rounded-full"
                            style={{ backgroundColor: preset.border }}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Script İçeriği - Mini Quill Editör */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-sm font-medium text-gray-700">
                      Script İçeriği <span className="text-red-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPreview(!showPreview)}
                      className="text-[11px] text-[#005F9E] hover:underline font-medium"
                    >
                      {showPreview ? 'Editöre Dön' : 'Önizle'}
                    </button>
                  </div>

                  {showPreview ? (
                    <div className="border border-gray-300 rounded-lg p-4 min-h-[180px] bg-gray-50">
                      <div
                        className="script-block"
                        style={{
                          margin: 0,
                          background: selectedPreset.bg,
                          borderLeftColor: selectedPreset.border
                        }}
                      >
                        <span className="script-label" style={{ color: selectedPreset.labelColor }}>
                          {scriptLabel || 'Script Başlığı'}
                        </span>
                        <div
                          className="script-content"
                          dangerouslySetInnerHTML={{ __html: scriptContent }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div
                      className="rounded-lg overflow-hidden border-l-4"
                      style={{ borderLeftColor: selectedPreset.border }}
                    >
                      <ReactQuill
                        theme="snow"
                        value={scriptContent}
                        onChange={setScriptContent}
                        modules={miniModules}
                        formats={miniFormats}
                        placeholder="Script içeriğini yazın..."
                        className="script-mini-editor"
                      />
                    </div>
                  )}

                  <p className="mt-1 text-[11px] text-gray-400">
                    Müşteriye okunacak metin. Kalın, italik, renkli yazı, listeler ve linkler kullanabilirsiniz.
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-5 py-3 flex items-center justify-between border-t border-gray-200">
              <div>
                {editingScriptIndex !== null && (
                  <button
                    type="button"
                    onClick={handleDeleteScript}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-red-600 text-sm font-medium hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Sil
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowScriptModal(false)}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                >
                  İptal
                </button>
                <button
                  type="button"
                  onClick={handleSaveScript}
                  disabled={!scriptContent.trim()}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#005F9E] text-white text-sm font-medium rounded-lg hover:bg-[#004D80] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {editingScriptIndex !== null ? 'Güncelle' : 'Ekle'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
