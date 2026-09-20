import React, { useState } from 'react';
import { MagazineIssue, MagazinePage } from '../../types/magazine';
import { PageRenderer } from './PageRenderer';
import { InlinePageEditor } from '../editor/InlinePageEditor';
import { ChevronLeft, ChevronRight, Maximize2, Sliders, Wand2, Download, Printer, FileDown, Edit3 } from 'lucide-react';

interface Props {
  issue: MagazineIssue;
  activePageIndex: number;
  onChangePage: (index: number) => void;
  onOpenFullscreen: () => void;
  onOpenAdjustDrawer: () => void;
  onCycleVariant: () => void;
  onExportSinglePng: (pageIndex: number) => void;
  onExportPdf?: () => void;
  onUpdatePage?: (updatedPage: MagazinePage) => void;
}

export const MagazinePreview: React.FC<Props> = ({
  issue,
  activePageIndex,
  onChangePage,
  onOpenFullscreen,
  onOpenAdjustDrawer,
  onCycleVariant,
  onExportSinglePng,
  onExportPdf,
  onUpdatePage,
}) => {
  const currentPage = issue.pages[activePageIndex] || issue.pages[0];
  const totalPages = issue.pages.length;
  const [inlineEditMode, setInlineEditMode] = useState(false);

  const handlePrev = () => {
    if (activePageIndex > 0) onChangePage(activePageIndex - 1);
  };

  const handleNext = () => {
    if (activePageIndex < totalPages - 1) onChangePage(activePageIndex + 1);
  };

  const handlePrintPage = () => {
    window.print();
  };

  // Determine if this page supports inline editing (standard article templates)
  const supportsInlineEdit = onUpdatePage &&
    !['M01', 'M02', 'M25'].includes(currentPage?.templateId || '');

  return (
    <div className="flex-1 flex flex-col items-center justify-between p-2 sm:p-4 bg-slate-200/80 overflow-y-auto">
      {/* Control Toolbar */}
      <div className="w-full max-w-5xl flex flex-wrap items-center justify-between gap-2 sm:gap-3 bg-white/95 backdrop-blur-md p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm mb-3 sm:mb-4 text-slate-800">
        {/* Navigation Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={handlePrev}
            disabled={activePageIndex === 0}
            className="p-1.5 sm:p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-40 disabled:hover:bg-slate-100 border border-slate-200 transition-colors"
            title="Önceki Sayfa"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="text-xs font-mono font-bold text-slate-700 px-1.5 sm:px-3">
            Sayfa <span className="text-sky-600">{activePageIndex + 1}</span> / {totalPages}
          </span>

          <button
            type="button"
            onClick={handleNext}
            disabled={activePageIndex === totalPages - 1}
            className="p-1.5 sm:p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-40 disabled:hover:bg-slate-100 border border-slate-200 transition-colors"
            title="Sonraki Sayfa"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <span className="hidden md:inline-flex text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 ml-1">
            A4 Dikey (210 × 297 mm)
          </span>
        </div>

        {/* Quick Editorial & Print Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap sm:flex-nowrap">

          {/* Inline Edit Button */}
          {supportsInlineEdit && (
            <button
              type="button"
              onClick={() => setInlineEditMode(v => !v)}
              className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors border ${
                inlineEditMode
                  ? 'bg-sky-600 text-white border-sky-700 shadow-sm'
                  : 'bg-sky-50 hover:bg-sky-100 text-sky-700 border-sky-200'
              }`}
              title="Sayfayı Doğrudan Düzenle"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{inlineEditMode ? 'Düzenleniyor...' : '✏️ Sayfayı Düzenle'}</span>
              <span className="sm:hidden">Düzenle</span>
            </button>
          )}

          <button
            type="button"
            onClick={onCycleVariant}
            className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
            title="Farklı Tasarım Öner"
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tasarım Öner ({currentPage?.layoutVariant})</span>
            <span className="sm:hidden">Öner</span>
          </button>

          <button
            type="button"
            onClick={onOpenAdjustDrawer}
            className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 border border-slate-200 transition-colors"
            title="Sayfa Ayarları"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Hızlı Ayarlar</span>
          </button>

          {onExportPdf && (
            <button
              type="button"
              onClick={onExportPdf}
              className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
              title="A4 PDF Olarak İndir"
            >
              <FileDown className="w-3.5 h-3.5 text-rose-600" />
              <span className="hidden xs:inline sm:inline">A4 PDF</span>
            </button>
          )}

          <button
            type="button"
            onClick={handlePrintPage}
            className="p-1.5 sm:p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors"
            title="Yazdır (A4 Çıktı Al)"
          >
            <Printer className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => onExportSinglePng(activePageIndex)}
            className="p-1.5 sm:p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors"
            title="Bu Sayfayı PNG Olarak İndir"
          >
            <Download className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onOpenFullscreen}
            className="p-1.5 sm:p-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors"
            title="Tam Ekran Okuma Modu"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Page Render Canvas */}
      <div className="flex-1 flex items-center justify-center w-full my-auto py-2 sm:py-4 overflow-y-auto">
        {inlineEditMode && supportsInlineEdit && onUpdatePage ? (
          /* INLINE EDIT MODE: Show the InlinePageEditor */
          <div className="w-full max-w-[720px] px-2 flex justify-center">
            <InlinePageEditor
              page={currentPage}
              issueYear={issue.year}
              issueMonth={issue.month}
              issueNumber={issue.issueNumber}
              onUpdatePage={(updated) => {
                onUpdatePage(updated);
              }}
              onCycleVariant={onCycleVariant}
            />
          </div>
        ) : (
          /* VIEW MODE: Show static PageRenderer */
          <div className="shadow-2xl rounded-xl overflow-hidden border border-slate-300 w-full max-w-[680px] flex justify-center bg-[#FDFBF7]">
            <PageRenderer
              id="active-preview-page"
              page={currentPage}
              issue={issue}
              onNavigatePage={(pNum) => {
                const targetIdx = issue.pages.findIndex(p => p.pageNumber === pNum);
                if (targetIdx !== -1) onChangePage(targetIdx);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
