import React, { useState, useEffect } from 'react';
import { MagazineIssue } from '../../types/magazine';
import { PageRenderer } from './PageRenderer';
import { ChevronLeft, ChevronRight, X, Sparkles } from 'lucide-react';

interface Props {
  issue: MagazineIssue;
  initialPageIndex?: number;
  isOpen: boolean;
  onClose: () => void;
}

export const FullscreenReader: React.FC<Props> = ({
  issue,
  initialPageIndex = 0,
  isOpen,
  onClose,
}) => {
  const [currentPageIndex, setCurrentPageIndex] = useState(initialPageIndex);

  useEffect(() => {
    setCurrentPageIndex(initialPageIndex);
  }, [initialPageIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentPageIndex]);

  if (!isOpen) return null;

  const totalPages = issue.pages.length;
  const currentPage = issue.pages[currentPageIndex] || issue.pages[0];

  const handlePrev = () => {
    if (currentPageIndex > 0) setCurrentPageIndex(currentPageIndex - 1);
  };

  const handleNext = () => {
    if (currentPageIndex < totalPages - 1) setCurrentPageIndex(currentPageIndex + 1);
  };

  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 45;

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) {
      handleNext();
    } else if (distance < -minSwipeDistance) {
      handlePrev();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-200 flex flex-col justify-between p-2 sm:p-4 select-none touch-pan-y"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="flex items-center justify-between text-slate-800 px-2 py-1 sm:p-2">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
          <span className="font-editorial text-base sm:text-lg font-bold text-slate-900">MAİDER</span>
          <span className="text-[11px] sm:text-xs text-slate-500 font-mono">
            Sayı {issue.issueNumber}
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <span className="text-xs font-mono font-bold text-slate-700 bg-white/80 px-2 py-0.5 rounded-full border border-slate-300">
            {currentPageIndex + 1} / {totalPages}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-full bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 shadow-sm transition-colors"
            title="Kapat (Esc)"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      <div className="relative flex-1 flex items-center justify-center my-auto overflow-hidden px-1 sm:px-2">
        {currentPageIndex > 0 && (
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-2 sm:left-4 z-30 p-2 sm:p-3 rounded-full bg-white/90 hover:bg-white text-slate-800 border border-slate-300 shadow-xl backdrop-blur-sm transition-all"
            title="Önceki Sayfa"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        )}

        <div className="max-h-[82vh] sm:max-h-[88vh] w-full flex items-center justify-center shadow-2xl">
          <PageRenderer
            page={currentPage}
            issue={issue}
            className="h-full w-auto max-h-[82vh] sm:max-h-[88vh]"
            onNavigatePage={(pNum) => {
              const targetIdx = issue.pages.findIndex(p => p.pageNumber === pNum);
              if (targetIdx !== -1) setCurrentPageIndex(targetIdx);
            }}
          />
        </div>

        {currentPageIndex < totalPages - 1 && (
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-2 sm:right-4 z-30 p-2 sm:p-3 rounded-full bg-white/90 hover:bg-white text-slate-800 border border-slate-300 shadow-xl backdrop-blur-sm transition-all"
            title="Sonraki Sayfa"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        )}
      </div>

      <div className="text-center text-[10px] sm:text-xs text-slate-500 pb-1 font-mono">
        <span className="sm:hidden">Sayfayı çevirmek için sağa/sola kaydırın.</span>
        <span className="hidden sm:inline">Klavye yön tuşlarını (← / →) kullanarak gezinebilir, ESC ile çıkabilirsiniz.</span>
      </div>
    </div>
  );
};
