import React, { useState } from 'react';
import { MagazinePage, MagazineIssue } from '../../types/magazine';
import { CATEGORY_THEMES } from '../../config/brand';
import { Copy, Trash2, ArrowLeft, ArrowRight, Plus, Sliders, Filter, Eye } from 'lucide-react';

interface Props {
  issue: MagazineIssue;
  activePageIndex: number;
  onSelectPage: (index: number) => void;
  onMovePage: (fromIndex: number, toIndex: number) => void;
  onDuplicatePage: (index: number) => void;
  onDeletePage: (index: number) => void;
  onAddNewPage: () => void;
  onOpenAdjustDrawer: (index: number) => void;
}

export const PageThumbnailGrid: React.FC<Props> = ({
  issue,
  activePageIndex,
  onSelectPage,
  onMovePage,
  onDuplicatePage,
  onDeletePage,
  onAddNewPage,
  onOpenAdjustDrawer,
}) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [selectedSectionFilter, setSelectedSectionFilter] = useState<string>('all');

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== targetIndex) {
      onMovePage(draggedIndex, targetIndex);
    }
    setDraggedIndex(null);
  };

  const filteredPages = issue.pages.map((p, originalIdx) => ({ page: p, originalIdx })).filter(({ page }) => {
    if (selectedSectionFilter === 'all') return true;
    return page.sectionId === selectedSectionFilter;
  });

  return (
    <div className="bg-white border-t border-slate-200 p-3 sm:p-4 select-none shadow-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 mb-3">
        {/* Title & Section Filter */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
            <span>SAYFA SIRALAMASI</span>
          </span>
          <span className="bg-sky-50 text-sky-700 text-xs px-2 py-0.5 rounded-full font-mono font-bold border border-sky-200">
            {issue.pages.length} Sayfa
          </span>

          {/* Section Filter */}
          {issue.sections && issue.sections.length > 0 && (
            <div className="flex items-center gap-1 ml-1 sm:ml-2">
              <Filter className="w-3 h-3 text-slate-400" />
              <select
                value={selectedSectionFilter}
                onChange={(e) => setSelectedSectionFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-[11px] text-slate-700 focus:outline-none"
              >
                <option value="all">Tüm Bölümler ({issue.pages.length})</option>
                {issue.sections.map(sec => {
                  const count = issue.pages.filter(p => p.sectionId === sec.id).length;
                  return (
                    <option key={sec.id} value={sec.id}>
                      {sec.name} ({count})
                    </option>
                  );
                })}
              </select>
            </div>
          )}
        </div>

        {/* Action Buttons: Move Active Page & Add Page */}
        <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
            <button
              type="button"
              onClick={() => {
                if (activePageIndex > 0) onMovePage(activePageIndex, activePageIndex - 1);
              }}
              disabled={activePageIndex === 0}
              className="p-1 rounded hover:bg-white text-slate-700 disabled:opacity-30 flex items-center gap-1 text-[11px] font-semibold"
              title="Aktif Sayfayı Sola Taşı"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Sola</span>
            </button>
            <span className="text-slate-300">|</span>
            <button
              type="button"
              onClick={() => {
                if (activePageIndex < issue.pages.length - 1) onMovePage(activePageIndex, activePageIndex + 1);
              }}
              disabled={activePageIndex === issue.pages.length - 1}
              className="p-1 rounded hover:bg-white text-slate-700 disabled:opacity-30 flex items-center gap-1 text-[11px] font-semibold"
              title="Aktif Sayfayı Sağa Taşı"
            >
              <span>Sağa</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={onAddNewPage}
            className="bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Yeni Sayfa</span>
          </button>
        </div>
      </div>

      {/* Horizontal Canva-like Carousel Strip */}
      <div className="flex items-center gap-2.5 sm:gap-3 overflow-x-auto pb-3 pt-1 touch-pan-x">
        {filteredPages.map(({ page, originalIdx }) => {
          const isActive = originalIdx === activePageIndex;
          const theme = CATEGORY_THEMES[page.category] || CATEGORY_THEMES['Okulumuzdan'];
          const section = issue.sections?.find(s => s.id === page.sectionId);
          const pageNum = page.pageNumber || originalIdx + 1;
          const isCover = page.templateId === 'M01';

          return (
            <div
              key={page.id}
              draggable
              onDragStart={(e) => handleDragStart(e, originalIdx)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, originalIdx)}
              onClick={() => onSelectPage(originalIdx)}
              className={`group relative shrink-0 w-24 sm:w-32 cursor-pointer transition-all ${
                isActive ? 'scale-105' : 'opacity-85 hover:opacity-100'
              }`}
            >
              {/* Mini Slide Card Preview */}
              <div
                className={`aspect-[210/297] rounded-lg overflow-hidden border-2 shadow-sm flex flex-col justify-between p-2 relative ${
                  isActive ? 'border-sky-500 ring-2 ring-sky-500/40' : 'border-slate-300 hover:border-sky-400'
                } ${isCover ? 'bg-slate-900 text-white' : 'bg-[#FDFBF7] text-slate-900'}`}
              >
                {/* Header tag */}
                <div className="flex items-center justify-between text-[8px] font-bold">
                  <span
                    className="px-1 rounded truncate max-w-[60px]"
                    style={{ backgroundColor: section?.color || theme.color, color: '#fff' }}
                  >
                    {section ? section.name : page.templateId}
                  </span>
                  <span className="font-mono text-slate-400">#{pageNum}</span>
                </div>

                {/* Title Snippet */}
                <div className="my-auto py-1">
                  <p className="font-editorial text-[9px] font-bold leading-tight line-clamp-2">
                    {page.title || 'Başlıksız'}
                  </p>
                  {page.photos && page.photos.length > 0 && (
                    <div className="w-full h-8 mt-1 rounded overflow-hidden bg-slate-200">
                      <img src={page.photos[0].url} alt="" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                {/* Footer snippet */}
                <div className="text-[7px] text-slate-400 truncate">
                  {page.category}
                </div>

                {/* Hover Action Overlay */}
                <div className="absolute inset-0 bg-slate-950/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-1">
                  <div className="flex items-center gap-1">
                    {originalIdx > 0 && (
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); onMovePage(originalIdx, originalIdx - 1); }}
                        className="p-1 bg-slate-800 hover:bg-slate-700 text-white rounded text-[10px]"
                        title="Sola Taşı"
                      >
                        <ArrowLeft className="w-3 h-3" />
                      </button>
                    )}
                    {originalIdx < issue.pages.length - 1 && (
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); onMovePage(originalIdx, originalIdx + 1); }}
                        className="p-1 bg-slate-800 hover:bg-slate-700 text-white rounded text-[10px]"
                        title="Sağa Taşı"
                      >
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); onOpenAdjustDrawer(originalIdx); }}
                      className="p-1 bg-sky-600 hover:bg-sky-500 text-white rounded text-[10px]"
                      title="Sayfa Ayarları"
                    >
                      <Sliders className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); onDuplicatePage(originalIdx); }}
                      className="p-1 bg-slate-700 hover:bg-slate-600 text-white rounded text-[10px]"
                      title="Sayfayı Çoğalt"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                    {issue.pages.length > 1 && (
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); onDeletePage(originalIdx); }}
                        className="p-1 bg-rose-700 hover:bg-rose-600 text-white rounded text-[10px]"
                        title="Sayfayı Sil"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Page Number Label */}
              <div className="text-center mt-1">
                <span className={`text-[10px] font-mono font-bold ${isActive ? 'text-sky-600' : 'text-slate-500'}`}>
                  Sayfa {pageNum}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
