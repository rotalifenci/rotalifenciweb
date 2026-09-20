import React from 'react';
import { MONTHS_DATA } from '../../config/months';
import { MagazineIssue } from '../../types/magazine';
import { Calendar, Layers, Sparkles, ChevronRight, Settings } from 'lucide-react';

interface Props {
  issues: MagazineIssue[];
  activeMonthIndex: number;
  onSelectMonth: (monthIndex: number) => void;
  onOpenIssueModal: () => void;
}

export const MonthSelectorBar: React.FC<Props> = ({
  issues,
  activeMonthIndex,
  onSelectMonth,
  onOpenIssueModal,
}) => {
  const currentIssue = issues.find(i => i.monthIndex === activeMonthIndex) || issues[0];
  const currentMonthData = MONTHS_DATA.find(m => m.index === activeMonthIndex) || MONTHS_DATA[0];

  return (
    <div className="bg-white border-b border-slate-200/90 py-2.5 px-4 sm:px-6 shadow-xs select-none">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left: Active Issue Summary & Quick Edit */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-sky-50 text-sky-600 border border-sky-200">
              <Calendar className="w-4 h-4" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-slate-800">
                  {currentIssue.month} Sayısı
                </span>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-sky-100 text-sky-700">
                  Sayı {currentIssue.issueNumber}
                </span>
                <span className="text-[10px] text-slate-400">•</span>
                <span className="text-[10px] text-slate-500 font-medium hidden sm:inline">
                  {currentMonthData.season}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 truncate max-w-xs sm:max-w-md font-serif italic">
                {currentIssue.coverTitle || 'MAİDER Dijital Okul Dergisi'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenIssueModal}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-colors"
            title="Bu Sayının Başlık & Kapak Ayarları"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right: 12 Months Horizontal Selector Strip */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 md:pb-0 scrollbar-none w-full md:w-auto -mx-1 px-1 touch-pan-x">
          {MONTHS_DATA.map((month) => {
            const isActive = month.index === activeMonthIndex;
            const targetIssue = issues.find(i => i.monthIndex === month.index);
            const pageCount = targetIssue ? targetIssue.pages.length : 0;

            return (
              <button
                key={month.index}
                type="button"
                onClick={() => onSelectMonth(month.index)}
                className={`group px-2.5 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all flex items-center gap-1.5 active:scale-95 ${
                  isActive
                    ? 'bg-sky-600 text-white shadow-sm ring-2 ring-sky-600/30'
                    : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700 border border-slate-200/60'
                }`}
              >
                <span className="font-bold tracking-tight">{month.name}</span>
                
                <span
                  className={`text-[9px] font-mono px-1 py-0.2 rounded font-bold ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-200 text-slate-600 group-hover:bg-slate-300'
                  }`}
                  title={`${month.name} sayısında ${pageCount} sayfa var`}
                >
                  {pageCount}s
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
