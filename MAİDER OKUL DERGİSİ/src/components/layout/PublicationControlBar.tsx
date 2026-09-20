import React, { useState } from 'react';
import { MagazineIssue } from '../../types/magazine';
import { MONTHS_DATA } from '../../config/months';
import {
  Calendar,
  BookOpen,
  Archive,
  ChevronRight,
  ExternalLink,
  Layers,
  Sparkles,
  X,
  Search,
  Check,
  Settings
} from 'lucide-react';

interface Props {
  issues: MagazineIssue[];
  currentIssue: MagazineIssue;
  activeMonthIndex: number;
  onSelectMonth: (monthIndex: number) => void;
  onUpdateIssueInfo: (data: Partial<MagazineIssue>) => void;
  onOpenIssueModal?: () => void;
}

const MONTH_NAMES = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
];

export const PublicationControlBar: React.FC<Props> = ({
  issues,
  currentIssue,
  activeMonthIndex,
  onSelectMonth,
  onUpdateIssueInfo,
  onOpenIssueModal
}) => {
  // Archive Modal State
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
  const [archiveSearch, setArchiveSearch] = useState('');
  const [archiveYearFilter, setArchiveYearFilter] = useState<number | 'all'>('all');

  // Month change: switch issue if exists in issues array, otherwise update current issue
  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMonthName = e.target.value;
    const targetMonthIdx = MONTH_NAMES.indexOf(newMonthName);
    if (targetMonthIdx !== -1) {
      onSelectMonth(targetMonthIdx);
      onUpdateIssueInfo({
        month: newMonthName,
        monthIndex: targetMonthIdx
      });
    }
  };

  // Year change: update current issue
  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    onUpdateIssueInfo({ year: val });
  };

  // Issue Number change: update current issue
  const handleIssueNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    onUpdateIssueInfo({ issueNumber: val });
  };

  // Filtered issues for the Archive Modal
  const filteredIssues = issues.filter(iss => {
    const matchesSearch =
      iss.title.toLowerCase().includes(archiveSearch.toLowerCase()) ||
      iss.month.toLowerCase().includes(archiveSearch.toLowerCase()) ||
      iss.coverTitle.toLowerCase().includes(archiveSearch.toLowerCase()) ||
      iss.coverSubtitle.toLowerCase().includes(archiveSearch.toLowerCase());

    const matchesYear = archiveYearFilter === 'all' || iss.year === archiveYearFilter;
    return matchesSearch && matchesYear;
  });

  return (
    <>
      <div className="bg-white border-b border-slate-200/90 py-2.5 px-4 sm:px-6 shadow-xs select-none">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Left: Ay, Yıl ve Sayı Seçim Form Alanları */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Active Pill & Icon */}
            <div className="flex items-center gap-2 pr-2 border-r border-slate-200 shrink-0">
              <span className="p-2 rounded-xl bg-sky-50 text-sky-600 border border-sky-200 shadow-2xs">
                <Calendar className="w-4 h-4" />
              </span>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block leading-tight">
                  YAYIN SEÇENEKLERİ
                </span>
                <span className="text-xs font-black text-slate-900 font-editorial">
                  {currentIssue.month} {currentIssue.year} (Sayı {currentIssue.issueNumber})
                </span>
              </div>
            </div>

            {/* Ay Seçimi (<select>) */}
            <div className="flex items-center gap-1.5">
              <label className="text-[11px] font-bold text-slate-600 uppercase">
                Ay:
              </label>
              <select
                value={currentIssue.month || MONTH_NAMES[activeMonthIndex] || 'Ekim'}
                onChange={handleMonthChange}
                className="bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white shadow-2xs cursor-pointer transition-colors"
              >
                {MONTH_NAMES.map((monthName) => (
                  <option key={monthName} value={monthName}>
                    {monthName}
                  </option>
                ))}
              </select>
            </div>

            {/* Yıl Seçimi (<input type="number">) */}
            <div className="flex items-center gap-1.5">
              <label className="text-[11px] font-bold text-slate-600 uppercase">
                Yıl:
              </label>
              <input
                type="number"
                value={currentIssue.year || 2026}
                onChange={handleYearChange}
                className="w-20 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl px-2 py-1.5 text-xs font-mono font-bold text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white shadow-2xs transition-colors"
              />
            </div>

            {/* Sayı Seçimi (<input type="number">) */}
            <div className="flex items-center gap-1.5">
              <label className="text-[11px] font-bold text-slate-600 uppercase">
                Sayı:
              </label>
              <input
                type="number"
                min={1}
                value={currentIssue.issueNumber || 1}
                onChange={handleIssueNumberChange}
                className="w-16 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl px-2 py-1.5 text-xs font-mono font-bold text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white shadow-2xs transition-colors"
              />
            </div>

            {onOpenIssueModal && (
              <button
                type="button"
                onClick={onOpenIssueModal}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-colors"
                title="Kapak ve Sayı Detaylarını Düzenle"
              >
                <Settings className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Right: Geçmiş Sayılar (Arşiv) Butonu */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setIsArchiveModalOpen(true)}
              className="bg-gradient-to-r from-sky-50 to-indigo-50 hover:from-sky-100 hover:to-indigo-100 text-sky-800 border border-sky-200/80 font-bold text-xs px-3.5 py-1.5 rounded-xl shadow-2xs flex items-center gap-2 transition-all transform active:scale-95"
            >
              <Archive className="w-3.5 h-3.5 text-sky-600" />
              <span>📚 Geçmiş Sayılar (Arşiv)</span>
              <span className="text-[10px] font-mono bg-sky-200/70 text-sky-900 px-1.5 py-0.2 rounded font-black">
                {issues.length}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* GEÇMİŞ SAYILAR (ARŞİV) MODAL / GALERİ BÖLÜMÜ                */}
      {/* ============================================================ */}
      {isArchiveModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 select-none animate-in fade-in duration-150">
          <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[88vh] flex flex-col overflow-hidden text-slate-800">
            {/* Modal Header */}
            <div className="p-4 sm:p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50/70 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white shadow-xs">
                  <Archive className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-editorial text-lg sm:text-xl font-bold text-slate-900">
                    MAİDER Dergi Arşivi (Geçmiş Sayılar)
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Mehmet Akif İnan Ortaokulu dergisinin tüm aylık sayılarını inceleyin ve düzenleyin.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsArchiveModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/70 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter & Search Bar */}
            <div className="p-3 sm:px-6 border-b border-slate-200 bg-white flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={archiveSearch}
                  onChange={(e) => setArchiveSearch(e.target.value)}
                  placeholder="Sayı adı, ay veya dosya konusu ara..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:bg-white"
                />
              </div>

              {/* Year filter */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="font-bold text-slate-500 uppercase text-[10px]">Filtrele:</span>
                <button
                  type="button"
                  onClick={() => setArchiveYearFilter('all')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                    archiveYearFilter === 'all'
                      ? 'bg-sky-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Tümü ({issues.length})
                </button>
                <button
                  type="button"
                  onClick={() => setArchiveYearFilter(2026)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                    archiveYearFilter === 2026
                      ? 'bg-sky-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  2026
                </button>
              </div>
            </div>

            {/* Grid of Issues */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-slate-100/50">
              {filteredIssues.length === 0 ? (
                <div className="p-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
                  <Archive className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                  <p className="text-xs font-semibold">Arama kriterlerine uygun sayı bulunamadı.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {filteredIssues.map((iss) => {
                    const isCurrent = iss.monthIndex === currentIssue.monthIndex;
                    return (
                      <div
                        key={iss.id}
                        className={`bg-white rounded-2xl overflow-hidden border shadow-xs hover:shadow-md transition-all flex flex-col justify-between group ${
                          isCurrent ? 'border-sky-500 ring-2 ring-sky-500/30' : 'border-slate-200 hover:border-sky-300'
                        }`}
                      >
                        {/* Issue Cover Header */}
                        <div className="relative h-36 bg-slate-900 overflow-hidden">
                          {iss.coverImageUrl ? (
                            <img
                              src={iss.coverImageUrl}
                              alt={iss.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-600">
                              <BookOpen className="w-8 h-8" />
                            </div>
                          )}

                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30" />

                          {/* Top Badges */}
                          <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between">
                            <span className="bg-sky-600 text-white font-mono font-black text-[10px] px-2 py-0.5 rounded-md shadow-xs">
                              SAYI {iss.issueNumber}
                            </span>

                            {isCurrent && (
                              <span className="bg-emerald-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                                <Check className="w-3 h-3" />
                                <span>Aktif Sayı</span>
                              </span>
                            )}
                          </div>

                          {/* Bottom Title snippet */}
                          <div className="absolute bottom-2 inset-x-2.5 text-white">
                            <span className="text-[10px] text-sky-300 font-mono font-bold block">
                              {iss.month} {iss.year}
                            </span>
                            <h4 className="font-editorial text-xs font-bold line-clamp-1">
                              {iss.coverTitle || iss.title}
                            </h4>
                          </div>
                        </div>

                        {/* Issue Details & Actions */}
                        <div className="p-3.5 space-y-3 flex-1 flex flex-col justify-between">
                          <div>
                            <p className="text-[11px] text-slate-500 line-clamp-2 leading-snug">
                              {iss.coverSubtitle || iss.slogan}
                            </p>

                            <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                              <span className="flex items-center gap-1">
                                <Layers className="w-3 h-3 text-slate-400" />
                                {iss.pages.length} Sayfa
                              </span>
                              <span>{iss.articles.length} İçerik</span>
                            </div>
                          </div>

                          {/* Switch To Issue Button */}
                          <button
                            type="button"
                            onClick={() => {
                              onSelectMonth(iss.monthIndex);
                              setIsArchiveModalOpen(false);
                            }}
                            className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
                              isCurrent
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-slate-100 hover:bg-sky-600 hover:text-white text-slate-700 border border-slate-200'
                            }`}
                          >
                            <span>{isCurrent ? 'Şu An Açık Sayı' : 'Bu Sayıyı Aç ve Düzenle'}</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500 shrink-0">
              <span>Toplam {issues.length} dergi sayısı kayıtlı.</span>
              <button
                type="button"
                onClick={() => setIsArchiveModalOpen(false)}
                className="px-4 py-1.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold transition-colors"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
