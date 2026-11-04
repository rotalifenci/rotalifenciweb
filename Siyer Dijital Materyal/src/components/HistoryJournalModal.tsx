import React, { useState } from 'react';
import { BookOpen, X, MapPin, Calendar, Award, ShieldCheck, Search } from 'lucide-react';
import { YearData, StudentProgress } from '../types';

interface HistoryJournalModalProps {
  years: YearData[];
  progress: StudentProgress;
  onClose: () => void;
}

export const HistoryJournalModal: React.FC<HistoryJournalModalProps> = ({
  years,
  progress,
  onClose
}) => {
  const [selectedYearNum, setSelectedYearNum] = useState<number>(
    progress.completedYears[progress.completedYears.length - 1] || 571
  );
  const [searchTerm, setSearchTerm] = useState<string>('');

  const selectedYear = years.find(y => y.year === selectedYearNum) || years[0];

  const filteredYears = years.filter(y => {
    const isCompleted = progress.completedYears.includes(y.year) || y.year === 571;
    if (!searchTerm) return true;
    return (
      y.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(y.year).includes(searchTerm) ||
      y.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/85 backdrop-blur-lg animate-fadeIn">
      <div className="relative w-full max-w-5xl h-[88vh] bg-[#221a14] border-4 border-[#8c5e38] rounded-3xl shadow-2xl overflow-hidden flex flex-col parchment-border">
        
        {/* Book Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#19120d] border-b border-[#5e3c23]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-900/40 border border-amber-600/50 text-amber-300">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-amber-200 font-title tracking-wider">
                TARİHSEL KEŞİF DEFTERİ
              </h2>
              <p className="text-xs text-amber-400/80 font-serif">
                Eren ve Aybüke'nin 571–632 Kronolojik Siyer Günlüğü
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-2xl bg-stone-900 hover:bg-stone-800 text-stone-300 transition border border-stone-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Book Body: Two Column Layout (Timeline Sidebar + Parchment Page) */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* Left Column: Timeline List */}
          <div className="w-full md:w-80 bg-[#17100b] border-r border-[#422917] p-3 flex flex-col overflow-hidden">
            {/* Search */}
            <div className="relative mb-3">
              <Search className="w-4 h-4 text-amber-600 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Yıl veya olay ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#0f0a07] border border-[#52341e] rounded-xl pl-9 pr-3 py-2 text-xs text-amber-100 placeholder-stone-600 outline-none"
              />
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
              {filteredYears.map((y) => {
                const isCompleted = progress.completedYears.includes(y.year);
                const isCurrent = y.year === progress.currentYear;
                const isSelected = y.year === selectedYearNum;

                let badgeColor = 'bg-stone-800 text-stone-400 border-stone-700';
                if (isCompleted) {
                  badgeColor = 'bg-emerald-950 text-emerald-300 border-emerald-700/60';
                } else if (isCurrent) {
                  badgeColor = 'bg-amber-950 text-amber-300 border-amber-600 animate-pulse';
                }

                return (
                  <button
                    key={y.year}
                    onClick={() => setSelectedYearNum(y.year)}
                    className={`w-full p-2.5 rounded-xl border transition text-left flex items-center justify-between gap-2 ${
                      isSelected
                        ? 'bg-[#3b2414] border-amber-500 shadow-md text-amber-100'
                        : 'bg-[#1e140d]/60 border-[#382213] hover:bg-[#2b1a0e] text-stone-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <span className={`text-xs font-black px-2 py-0.5 rounded-lg border ${badgeColor}`}>
                        {y.year}
                      </span>
                      <span className="text-xs font-bold truncate">
                        {y.title}
                      </span>
                    </div>
                    {isCompleted && (
                      <span className="text-[10px] text-emerald-400 shrink-0 font-bold">✓</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Parchment Journal Page */}
          <div className="flex-1 bg-[#ede0c8] text-[#2c1a0e] p-6 sm:p-8 overflow-y-auto box-shadow-parchment">
            <div className="max-w-2xl mx-auto space-y-6 font-serif">
              
              {/* Page Header */}
              <div className="border-b-2 border-[#b0885a] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-[#8c5028] uppercase tracking-widest">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>MİLADİ {selectedYear.year} YILI</span>
                    <span>•</span>
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{selectedYear.location}</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black text-[#3d1e0d] font-title mt-1">
                    {selectedYear.title}
                  </h1>
                  <p className="text-sm italic text-[#6e4325] mt-0.5">
                    "{selectedYear.subTitle}"
                  </p>
                </div>

                <div className="shrink-0">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#dfcaa5] border border-[#ba9b72] text-xs font-bold text-[#4a2e16]">
                    <ShieldCheck className="w-4 h-4 text-[#8a5122]" />
                    <span>{selectedYear.historicalSource.certaintyLevel}</span>
                  </div>
                </div>
              </div>

              {/* Historical Context Narrative */}
              <div className="space-y-4 text-base sm:text-lg leading-relaxed text-[#2c1a0e]">
                <p>{selectedYear.historicalSummary}</p>
                {selectedYear.missions[0] && (
                  <div className="bg-[#e2d2b4] p-4 rounded-2xl border border-[#c4a97f] text-sm leading-relaxed italic text-[#4a2c14]">
                    📜 <strong>Tarihsel Anlatım Kaydı:</strong> {selectedYear.missions[0].narrativeText}
                  </div>
                )}
              </div>

              {/* Learning Task & Question */}
              {selectedYear.missions[0] && (
                <div className="bg-[#f5ecdc] p-4 rounded-2xl border-2 border-[#caa475] space-y-2">
                  <div className="text-xs font-black text-[#854519] uppercase tracking-wider">
                    Öğrenme Görevi & Değerlendirme Sorusu
                  </div>
                  <p className="text-sm font-bold text-[#2a170b]">
                    {selectedYear.missions[0].question}
                  </p>
                  <p className="text-xs font-bold text-emerald-800">
                    Cevap: {selectedYear.missions[0].correctAnswer}
                  </p>
                </div>
              )}

              {/* Reliable Historical Sources */}
              <div className="border-t-2 border-[#b0885a] pt-4 text-xs text-[#6e4627] space-y-1">
                <div className="font-bold uppercase tracking-wider text-[#4a2b13]">
                  Güvenilir Tarihsel Kaynaklar:
                </div>
                <div>{selectedYear.historicalSource.sourceName}</div>
                <div className="italic">{selectedYear.historicalSource.authorOrRef}</div>
                {selectedYear.historicalSource.notes && (
                  <div className="text-[11px] text-[#85542f]">
                    * {selectedYear.historicalSource.notes}
                  </div>
                )}
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
