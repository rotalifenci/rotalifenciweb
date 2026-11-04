import React, { useState } from 'react';
import {
  X,
  Compass,
  Search,
  CheckCircle2,
  MapPin,
  Sparkles,
  ArrowRight,
  BookOpen,
  Calendar,
  Zap
} from 'lucide-react';
import { YearData, RootValueId } from '../types';
import { ROOT_VALUES } from '../data/rootValues';

interface YearSelectorModalProps {
  years: YearData[];
  visitedYears: number[];
  completedYears: number[];
  currentYear: number;
  onSelectYearDirect: (year: number) => void;
  onTeleportPortal: (year: number) => void;
  onClose: () => void;
}

export const YearSelectorModal: React.FC<YearSelectorModalProps> = ({
  years,
  visitedYears,
  completedYears,
  currentYear,
  onSelectYearDirect,
  onTeleportPortal,
  onClose
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState<'all' | 'mecca' | 'madinah'>('all');
  const [customYearInput, setCustomYearInput] = useState('');

  // Major historical milestones for instant 1-click jump
  const MILESTONES = [
    { year: 571, label: 'Doğum (Fil Yılı)', era: 'mecca' },
    { year: 576, label: 'Ebvâ', era: 'mecca' },
    { year: 595, label: 'Evlilik', era: 'mecca' },
    { year: 605, label: 'Kâbe Hakemliği', era: 'mecca' },
    { year: 610, label: 'İlk Vahiy (Hira)', era: 'mecca' },
    { year: 615, label: 'Habeşistan Hicreti', era: 'mecca' },
    { year: 620, label: 'İsrâ ve Mirac', era: 'mecca' },
    { year: 622, label: 'Büyük Hicret', era: 'madinah' },
    { year: 624, label: 'Bedir Gazvesi', era: 'madinah' },
    { year: 625, label: 'Uhud', era: 'madinah' },
    { year: 627, label: 'Hendek', era: 'madinah' },
    { year: 628, label: 'Hudeybiye Barışı', era: 'madinah' },
    { year: 630, label: 'Mekke\'nin Fethi', era: 'mecca' },
    { year: 632, label: 'Veda Haccı & Vefat', era: 'madinah' }
  ];

  const filteredYears = years.filter(y => {
    if (selectedPeriod === 'mecca' && y.year >= 622) return false;
    if (selectedPeriod === 'madinah' && y.year < 622) return false;
    if (!searchQuery.trim()) return true;

    const q = searchQuery.toLowerCase();
    return (
      y.year.toString().includes(q) ||
      y.title.toLowerCase().includes(q) ||
      y.location.toLowerCase().includes(q) ||
      (y.subTitle && y.subTitle.toLowerCase().includes(q))
    );
  });

  const handleCustomJump = (e: React.FormEvent) => {
    e.preventDefault();
    const yNum = parseInt(customYearInput.trim(), 10);
    if (!isNaN(yNum) && yNum >= 571 && yNum <= 632) {
      onSelectYearDirect(yNum);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/85 backdrop-blur-md p-3 sm:p-6 animate-fadeIn select-none">
      <div className="bg-[#1f1610] border-2 border-amber-600/70 rounded-3xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-amber-700/40 bg-stone-900/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400 shadow">
              <Compass className="w-6 h-6 animate-spin-slow" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-amber-100 font-title flex items-center gap-2">
                <span>3D Zaman Şeridi & Yıl Keşfi</span>
                <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2.5 py-0.5 rounded-full font-bold">
                  571 – 632 (62 Yıl)
                </span>
              </h2>
              <p className="text-xs text-stone-300">
                Kronolojik kilit olmadan istediğiniz yılı ve tarihsel mekânı özgürce keşfedin.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-2xl bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white transition border border-stone-600"
            title="Kapat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Filter & Search Bar */}
        <div className="p-3 sm:p-4 bg-stone-900/50 border-b border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Era Filter Buttons */}
          <div className="flex items-center gap-1.5 bg-stone-950/70 p-1 rounded-2xl border border-stone-700 w-full sm:w-auto">
            <button
              onClick={() => setSelectedPeriod('all')}
              className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                selectedPeriod === 'all'
                  ? 'bg-amber-500 text-stone-950 shadow font-black'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              Tüm Yıllar (62)
            </button>
            <button
              onClick={() => setSelectedPeriod('mecca')}
              className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                selectedPeriod === 'mecca'
                  ? 'bg-amber-600 text-white shadow font-black'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              Mekke (571–622)
            </button>
            <button
              onClick={() => setSelectedPeriod('madinah')}
              className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                selectedPeriod === 'madinah'
                  ? 'bg-emerald-600 text-white shadow font-black'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              Medine (622–632)
            </button>
          </div>

          {/* Search Box */}
          <div className="relative flex-1 max-w-sm w-full">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Yıl numarası veya olay ara (örn: 610, Hira)..."
              className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-stone-950 border border-stone-700 text-xs text-amber-100 placeholder-stone-500 focus:outline-none focus:border-amber-500 transition"
            />
          </div>

          {/* Quick "Yıla Git" Input Form */}
          <form onSubmit={handleCustomJump} className="flex items-center gap-1.5 w-full sm:w-auto">
            <input
              type="number"
              min="571"
              max="632"
              value={customYearInput}
              onChange={e => setCustomYearInput(e.target.value)}
              placeholder="Yıl (571-632)"
              className="w-28 px-3 py-1.5 rounded-xl bg-stone-950 border border-stone-700 text-xs text-center font-bold text-amber-200 focus:outline-none focus:border-amber-500"
            />
            <button
              type="submit"
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-black text-xs transition shadow flex items-center gap-1"
            >
              <span>Git</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

        </div>

        {/* Milestone Quick Jump Strip */}
        <div className="px-4 py-2 bg-[#170f0a] border-b border-amber-900/30 overflow-x-auto flex items-center gap-2 text-xs scrollbar-thin">
          <span className="text-[11px] font-bold text-amber-400 shrink-0 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5" />
            Önemli Hadiseler:
          </span>
          {MILESTONES.map(m => (
            <button
              key={m.year}
              onClick={() => {
                onSelectYearDirect(m.year);
                onClose();
              }}
              className="shrink-0 px-2.5 py-1 rounded-xl bg-stone-900/80 hover:bg-amber-900/50 border border-amber-700/40 text-amber-200 text-[11px] font-bold transition flex items-center gap-1.5 shadow"
            >
              <strong className="text-amber-400 font-title">{m.year}</strong>
              <span className="text-stone-300">{m.label}</span>
            </button>
          ))}
        </div>

        {/* 62 Years Grid / Explorer */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
          {filteredYears.map(yearData => {
            const y = yearData.year;
            const isVisited = visitedYears.includes(y);
            const isCompleted = completedYears.includes(y);
            const isCurrent = currentYear === y;
            const era = y < 622 ? 'Mekke' : 'Medine';

            return (
              <div
                key={y}
                className={`relative rounded-2xl p-4 border transition-all duration-200 flex flex-col justify-between ${
                  isCurrent
                    ? 'bg-amber-950/70 border-amber-400 ring-2 ring-amber-400/50 shadow-xl'
                    : isCompleted
                    ? 'bg-emerald-950/40 border-emerald-600/50 hover:border-emerald-400'
                    : isVisited
                    ? 'bg-stone-900/80 border-amber-600/40 hover:border-amber-400'
                    : 'bg-stone-900/50 border-stone-800 hover:border-stone-600'
                }`}
              >
                <div>
                  {/* Top Row: Year Numeral and Era */}
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-2xl font-black font-title text-amber-200">
                      {y}
                    </span>

                    <div className="flex items-center gap-1">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        era === 'Mekke'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      }`}>
                        {era}
                      </span>

                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : isVisited ? (
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                      ) : null}
                    </div>
                  </div>

                  {/* Title & Subtitle */}
                  <h4 className="text-xs font-black text-stone-100 leading-snug line-clamp-1">
                    {yearData.title}
                  </h4>
                  <p className="text-[11px] text-stone-400 line-clamp-1 mt-0.5">
                    {yearData.subTitle || yearData.historicalSummary}
                  </p>

                  {/* Location Pin */}
                  <div className="flex items-center gap-1 text-[10px] text-amber-300/80 mt-2">
                    <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                    <span className="truncate">{yearData.location}</span>
                  </div>
                </div>

                {/* Bottom Action Buttons */}
                <div className="mt-3.5 pt-2.5 border-t border-stone-800/80 flex items-center gap-2">
                  <button
                    onClick={() => {
                      onSelectYearDirect(y);
                      onClose();
                    }}
                    className="flex-1 py-1.5 px-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-black text-[11px] transition shadow flex items-center justify-center gap-1"
                  >
                    <span>Keşfet</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>

                  <button
                    onClick={() => {
                      onTeleportPortal(y);
                      onClose();
                    }}
                    className="py-1.5 px-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold text-[10px] transition border border-stone-700"
                    title="3D Zaman Şeridindeki Kapıya Işınlan"
                  >
                    Kapıya Git
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
