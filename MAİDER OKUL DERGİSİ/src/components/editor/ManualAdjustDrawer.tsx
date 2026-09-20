import { MagazinePage, MagazineSection } from '../../types/magazine';
import { TEMPLATES_LIBRARY } from '../../config/templates';
import { CATEGORY_THEMES } from '../../config/brand';
import { cycleDesignVariant } from '../../services/smartLayout';
import { Sliders, Wand2, Palette, Type, Layout, X, Lock, Unlock, Image as ImageIcon, FolderOpen } from 'lucide-react';

interface Props {
  page: MagazinePage;
  isOpen: boolean;
  onClose: () => void;
  onUpdatePage: (updated: MagazinePage) => void;
  sections?: MagazineSection[];
}

export const ManualAdjustDrawer: React.FC<Props> = ({ page, isOpen, onClose, onUpdatePage, sections = [] }) => {
  if (!isOpen) return null;

  const currentTemplate = TEMPLATES_LIBRARY.find(t => t.id === page.templateId);
  const theme = CATEGORY_THEMES[page.category] || CATEGORY_THEMES['Okulumuzdan'];

  const handleCycleVariant = () => {
    const updated = cycleDesignVariant(page);
    onUpdatePage(updated);
  };

  const handleChangeTemplate = (templateId: string) => {
    onUpdatePage({
      ...page,
      templateId,
      layoutVariant: 'A'
    });
  };

  const handleToggleLock = () => {
    onUpdatePage({
      ...page,
      isLocked: !page.isLocked
    });
  };

  return (
    <>
      {/* Backdrop for click outside */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 w-full max-w-sm sm:w-96 bg-white border-l border-slate-200 shadow-2xl z-50 p-4 sm:p-6 flex flex-col justify-between text-slate-800 overflow-y-auto">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-5">
            <div className="flex items-center gap-2 text-sky-600">
              <Sliders className="w-5 h-5" />
              <h3 className="font-bold text-base text-slate-900">Hızlı Sayfa Ayarları</h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

        {/* Action: Suggest Alternate Design */}
        <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-sky-50 to-indigo-50 border border-sky-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-800">
              Varyasyon: {page.layoutVariant}
            </span>
            <span className="text-[10px] bg-sky-100 text-sky-800 px-2 py-0.5 rounded font-mono">
              {currentTemplate?.name || page.templateId}
            </span>
          </div>
          <button
            type="button"
            onClick={handleCycleVariant}
            className="w-full bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs py-2.5 px-4 rounded-lg shadow-xs flex items-center justify-center gap-2 transition-all transform active:scale-95"
          >
            <Wand2 className="w-4 h-4 text-amber-300" />
            <span>Farklı Tasarım Öner ✨</span>
          </button>
          <p className="text-[10px] text-slate-500 text-center mt-2">
            Metin ve görsellerinizi koruyarak alternatif mizanpajları dener.
          </p>
        </div>

        {/* Template Selector */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1.5">
              <Layout className="w-3.5 h-3.5 text-sky-600" />
              <span>Sayfa Şablonunu Değiştir</span>
            </label>
            <select
              value={page.templateId}
              onChange={(e) => handleChangeTemplate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white"
            >
              {TEMPLATES_LIBRARY.map(tpl => (
                <option key={tpl.id} value={tpl.id}>
                  {tpl.id} - {tpl.name} ({tpl.category})
                </option>
              ))}
            </select>
          </div>

          {/* Title Editor */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5 text-sky-600" />
              <span>Başlık Metni</span>
            </label>
            <input
              type="text"
              value={page.title || ''}
              onChange={(e) => onUpdatePage({ ...page, title: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-sky-500 font-semibold"
            />
          </div>

          {/* Subtitle Editor */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Alt Başlık / Spot
            </label>
            <input
              type="text"
              value={page.subtitle || ''}
              onChange={(e) => onUpdatePage({ ...page, subtitle: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-sky-500"
            />
          </div>

          {/* Section Selector */}
          {sections && sections.length > 0 && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1.5">
                <FolderOpen className="w-3.5 h-3.5 text-sky-600" />
                <span>Ait Olduğu Bölüm</span>
              </label>
              <select
                value={page.sectionId || ''}
                onChange={(e) => onUpdatePage({ ...page, sectionId: e.target.value || undefined })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-sky-500 font-medium"
              >
                <option value="">Bölüm Seçilmedi (Varsayılan)</option>
                {sections.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
          )}

          {/* Pull Quote Editor */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Vurgu Cümlesi (Pull-Quote)
            </label>
            <textarea
              rows={2}
              value={page.pullQuote || ''}
              onChange={(e) => onUpdatePage({ ...page, pullQuote: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-sky-500 italic"
            />
          </div>

          {/* Brand Lock */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-900 block">Tasarım Kilidi</span>
              <span className="text-[10px] text-slate-500 block">Kurumsal logo ve sayfa numarasını korur</span>
            </div>
            <button
              type="button"
              onClick={handleToggleLock}
              className={`p-2 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition-colors ${
                page.isLocked
                  ? 'bg-amber-50 border-amber-300 text-amber-800'
                  : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {page.isLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
              <span>{page.isLocked ? 'Kilitli' : 'Serbest'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Done button */}
      <div className="pt-4 border-t border-slate-200">
        <button
          type="button"
          onClick={onClose}
          className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 text-xs font-bold py-2.5 rounded-xl transition-colors"
        >
          Tamamla ve Kapat
        </button>
      </div>
    </div>
  </>
);
};
