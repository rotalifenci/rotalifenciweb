import React, { useMemo, useState, useRef } from 'react';
import {
  BookOpen,
  Heart,
  Settings,
  LogOut,
  CheckCircle2,
  Sparkles,
  Volume2,
  VolumeX,
  GraduationCap,
  BarChart3,
  Search,
  Compass,
  Hand
} from 'lucide-react';
import { CharacterType, RootValueId, YearData } from '../types';
import { ALL_SIYER_YEARS } from '../data/yearsData';

interface YearDoorsHubProps {
  years: YearData[];
  selectedCharacter: CharacterType;
  visitedYears: number[];
  completedYears: number[];
  unlockedValues: RootValueId[];
  isMuted: boolean;
  onSelectYear: (year: number) => void;
  onSelectCharacter: (char: CharacterType) => void;
  onToggleMute: () => void;
  onOpenHistoryJournal: () => void;
  onOpenValuesJournal: () => void;
  onOpenSettings: () => void;
  onOpenTeacherPanel: () => void;
  onOpenResearchPanel: () => void;
  onExitToMenu: () => void;
}

interface DoorItemProps {
  year: number;
  title: string;
  hasVerifiedContent: boolean;
  isVisited: boolean;
  isCompleted: boolean;
  isMilestone: boolean;
  isHighlighted: boolean;
  onSelect: (year: number) => void;
}

const MILESTONE_YEARS = new Set([571, 579, 591, 595, 605, 610, 615, 620, 622, 624, 628, 630, 632]);

/**
 * Single Reusable 3D-Styled Architectural Door Component (Zero WebGL, Pure CSS + SVG)
 */
const YearDoorButton: React.FC<DoorItemProps> = React.memo(({
  year,
  title,
  hasVerifiedContent,
  isVisited,
  isCompleted,
  isMilestone,
  isHighlighted,
  onSelect
}) => {
  return (
    <button
      type="button"
      id={`year-door-${year}`}
      data-year={year}
      data-verified={hasVerifiedContent ? 'true' : 'false'}
      onClick={() => onSelect(year)}
      aria-label={`${year} Yılı Kapısı - ${title}`}
      title={hasVerifiedContent ? `${year}: ${title}` : `${year} Yılı (Keşfetmek için tıkla)`}
      className={`group relative flex flex-col items-center justify-between select-none cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-300 rounded-t-[44px] rounded-b-xl transition-transform duration-150 active:scale-95 hover:-translate-y-1 ${
        isHighlighted ? 'ring-4 ring-amber-300 scale-105 z-10' : ''
      }`}
      style={{
        minHeight: '132px',
        padding: '6px 5px 4px 5px',
        background: isMilestone
          ? 'linear-gradient(180deg, #f6d365 0%, #c88a28 38%, #6d4416 100%)'
          : 'linear-gradient(180deg, #d7b377 0%, #9b733b 45%, #5a3c1b 100%)',
        boxShadow: isMilestone
          ? '0 8px 18px rgba(0,0,0,0.65), inset 0 2px 3px rgba(255,250,210,0.75), 0 0 16px rgba(245,158,11,0.35)'
          : '0 6px 14px rgba(0,0,0,0.6), inset 0 1px 2px rgba(255,238,190,0.55)',
        border: isMilestone ? '2px solid #fde68a' : '1.5px solid #b88a44'
      }}
    >
      {/* Stone & Gold Islamic Arch Frame Inner Recess */}
      <div
        className="relative w-full h-full flex flex-col items-center justify-between rounded-t-[38px] rounded-b-lg overflow-hidden pt-2 pb-1.5 px-1.5"
        style={{
          background: 'linear-gradient(180deg, #3c210e 0%, #5c3416 42%, #7d481d 82%, #b46924 100%)',
          boxShadow: 'inset 0 6px 12px rgba(0,0,0,0.85), inset 0 -10px 18px rgba(251,191,36,0.38)'
        }}
      >
        {/* Decorative Top Arch Arabesque SVG */}
        <svg
          viewBox="0 0 100 32"
          className="absolute top-0 left-0 w-full h-7 pointer-events-none opacity-80"
          preserveAspectRatio="none"
        >
          <path
            d="M0,32 Q50,-8 100,32 L100,0 L0,0 Z"
            fill="url(#archGoldGrad)"
          />
          <defs>
            <linearGradient id="archGoldGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fef08a" stopOpacity="0.65" />
              <stop offset="100%" stopColor="#92400e" stopOpacity="0.1" />
            </linearGradient>
          </defs>
        </svg>

        {/* Status Indicator Badge (Top Right / Top Center) */}
        <div className="relative z-10 flex items-center justify-center gap-1 min-h-[14px]">
          {isCompleted ? (
            <span className="inline-flex items-center gap-0.5 bg-emerald-600/95 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full shadow border border-emerald-300">
              <CheckCircle2 className="w-2.5 h-2.5" />
              <span>Tamam</span>
            </span>
          ) : hasVerifiedContent ? (
            <span className="inline-flex items-center gap-0.5 bg-amber-500/25 text-amber-200 text-[9px] font-bold px-1.5 py-0.2 rounded-full border border-amber-400/40">
              <Sparkles className="w-2.5 h-2.5 text-amber-300" />
              <span>Olay</span>
            </span>
          ) : (
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-300/30" />
          )}
        </div>

        {/* Programmatic Year Number Plaque (Crisp Parchment & Gold) */}
        <div
          className="relative z-10 my-0.5 px-2.5 py-1 rounded-lg border transition-colors duration-150 group-hover:scale-105"
          style={{
            background: isMilestone
              ? 'linear-gradient(180deg, #fffbeb 0%, #fde68a 100%)'
              : 'linear-gradient(180deg, #fef3c7 0%, #f5d08b 100%)',
            borderColor: '#92400e',
            boxShadow: '0 3px 6px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.9)'
          }}
        >
          <span
            className="block font-black tracking-tight leading-none text-[#2c1507]"
            style={{
              fontSize: 'clamp(0.95rem, 1.35vw, 1.25rem)',
              fontFamily: 'Georgia, serif'
            }}
          >
            {year}
          </span>
        </div>

        {/* Wooden Double Door Panels & Knockers */}
        <div className="relative z-10 w-full flex-1 flex flex-col justify-end items-center mt-0.5">
          {/* Center Door Seam */}
          <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[1.5px] bg-black/60" />

          {/* Brass Door Knockers (Left & Right Rings) */}
          <div className="flex items-center justify-center gap-3 my-auto">
            <span className="w-2 h-2 rounded-full border border-amber-300 bg-amber-500/80 shadow-sm" />
            <span className="w-2 h-2 rounded-full border border-amber-300 bg-amber-500/80 shadow-sm" />
          </div>

          {/* Short Event Hint on Desktop/Tablet */}
          <span className="relative z-10 block w-full text-center text-[9px] sm:text-[10px] font-semibold text-amber-100/90 truncate px-0.5 leading-tight drop-shadow">
            {hasVerifiedContent ? title.replace(/^\d+\s*Yılı:\s*/i, '') : `${year} Yılı`}
          </span>

          {/* Warm Threshold Lantern Light Glow at Bottom */}
          <div
            className="w-4/5 h-1.5 rounded-full mt-1 transition-opacity duration-150 group-hover:opacity-100"
            style={{
              background: 'radial-gradient(circle, #fef08a 0%, #f59e0b 60%, transparent 100%)',
              opacity: hasVerifiedContent ? 0.95 : 0.55
            }}
          />
        </div>
      </div>

      {/* Stone Pillar Base & Side Lantern Dots */}
      <div className="w-[104%] h-1.5 bg-gradient-to-r from-[#6d4c2d] via-[#b0895a] to-[#6d4c2d] rounded-b-md flex items-center justify-between px-1">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-300 shadow-[0_0_4px_#fbbf24]" />
        {isVisited && (
          <span className="text-[7px] text-amber-200 font-bold tracking-widest uppercase">İncelendi</span>
        )}
        <span className="w-1.5 h-1.5 rounded-full bg-amber-300 shadow-[0_0_4px_#fbbf24]" />
      </div>
    </button>
  );
});

YearDoorButton.displayName = 'YearDoorButton';

interface PeriodGroup {
  id: string;
  label: string;
  shortLabel: string;
  startYear: number;
  endYear: number;
}

const PERIOD_GROUPS: PeriodGroup[] = [
  { id: 'all', label: 'Tüm Yıllar (571–632)', shortLabel: 'Tümü (62)', startYear: 571, endYear: 632 },
  { id: 'childhood', label: '571–586 Doğum ve Çocukluk', shortLabel: '571–586', startYear: 571, endYear: 586 },
  { id: 'youth', label: '587–609 Gençlik ve el-Emîn', shortLabel: '587–609', startYear: 587, endYear: 609 },
  { id: 'mecca_rev', label: '610–621 İlk Vahiy ve Mekke', shortLabel: '610–621', startYear: 610, endYear: 621 },
  { id: 'madinah', label: '622–632 Hicret, Medine ve Veda', shortLabel: '622–632', startYear: 622, endYear: 632 }
];

export const YearDoorsHub: React.FC<YearDoorsHubProps> = ({
  years,
  selectedCharacter,
  visitedYears,
  completedYears,
  unlockedValues,
  isMuted,
  onSelectYear,
  onSelectCharacter,
  onToggleMute,
  onOpenHistoryJournal,
  onOpenValuesJournal,
  onOpenSettings,
  onOpenTeacherPanel,
  onOpenResearchPanel,
  onExitToMenu
}) => {
  const [activePeriod, setActivePeriod] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const gridContainerRef = useRef<HTMLDivElement>(null);

  // Map year data by year number for O(1) lookup
  const yearDataMap = useMemo(() => {
    const map = new Map<number, YearData>();
    years.forEach((y) => map.set(y.year, y));
    return map;
  }, [years]);

  const visitedSet = useMemo(() => new Set(visitedYears), [visitedYears]);
  const completedSet = useMemo(() => new Set(completedYears), [completedYears]);

  // Divide the 62 years (571..632) into 4 architectural colosseum tiers matching the reference artwork:
  // Tier 1: 571 - 586 (16 doors)
  // Tier 2: 587 - 602 (16 doors)
  // Tier 3: 603 - 617 (15 doors)
  // Tier 4: 618 - 632 (15 doors)
  // Total = 16 + 16 + 15 + 15 = 62 doors!
  const architecturalTiers = useMemo(() => {
    return [
      { id: 'tier-1', label: '1. Kat • 571 – 586 (Doğum, Çocukluk ve İlk Gençlik)', years: ALL_SIYER_YEARS.slice(0, 16) },
      { id: 'tier-2', label: '2. Kat • 587 – 602 (Hilfü\'l-Fudûl, el-Emîn ve Aile Hayatı)', years: ALL_SIYER_YEARS.slice(16, 32) },
      { id: 'tier-3', label: '3. Kat • 603 – 617 (Kâbe Hakemliği, İlk Vahiy ve Sabır Yılları)', years: ALL_SIYER_YEARS.slice(32, 47) },
      { id: 'tier-4', label: '4. Kat • 618 – 632 (Hicret, Medine Dönemi, Fetih ve Veda)', years: ALL_SIYER_YEARS.slice(47, 62) }
    ];
  }, []);

  const handlePeriodSelect = (group: PeriodGroup) => {
    setActivePeriod(group.id);
    if (group.id !== 'all') {
      const targetDoor = document.getElementById(`year-door-${group.startYear}`);
      if (targetDoor) {
        targetDoor.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } else if (gridContainerRef.current) {
      gridContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSearchJump = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(searchQuery.trim(), 10);
    if (!isNaN(num) && num >= 571 && num <= 632) {
      onSelectYear(num);
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden flex flex-col justify-between bg-[#1c1008] text-amber-50 select-none">
      
      {/* 1. OPTIMIZED LAYERED HISTORICAL ARCHITECTURAL BACKDROP */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Top Mecca & Madinah Skyline + Stone Archway Backdrop (WebP optimized) */}
        <img
          src="/assets/images/doors_backdrop.webp"
          alt=""
          className="w-full h-full object-cover object-top opacity-35"
          loading="eager"
        />
        {/* Warm Sandstone & Golden Ambient Gradient */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 50% 18%, rgba(251,191,36,0.22) 0%, rgba(44,23,8,0.88) 58%, rgba(18,9,4,0.97) 100%)'
          }}
        />
        {/* Left & Right Hanging Brass Lantern Ornaments */}
        <div className="hidden lg:flex flex-col items-center absolute top-0 left-6 z-10 opacity-90">
          <div className="w-1 h-12 bg-amber-600" />
          <div className="w-10 h-14 rounded-2xl border-2 border-amber-400 bg-gradient-to-b from-amber-300 via-amber-500 to-amber-700 shadow-[0_0_30px_rgba(251,191,36,0.8)] flex items-center justify-center">
            <div className="w-4 h-7 rounded-full bg-yellow-100/90" />
          </div>
        </div>
        <div className="hidden lg:flex flex-col items-center absolute top-0 right-6 z-10 opacity-90">
          <div className="w-1 h-12 bg-amber-600" />
          <div className="w-10 h-14 rounded-2xl border-2 border-amber-400 bg-gradient-to-b from-amber-300 via-amber-500 to-amber-700 shadow-[0_0_30px_rgba(251,191,36,0.8)] flex items-center justify-center">
            <div className="w-4 h-7 rounded-full bg-yellow-100/90" />
          </div>
        </div>
      </div>

      {/* 2. TOP NAVIGATION & ORNAMENTAL TITLE HEADER */}
      <header className="relative z-20 w-full max-w-[1600px] mx-auto px-2.5 sm:px-6 pt-2 pb-1.5 flex flex-col gap-1.5 shrink-0">
        
        {/* Top Utility Row */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          
          {/* Left: Active Guide Character Pill & Quick Switch */}
          <div className="flex items-center gap-2 bg-stone-950/90 border border-amber-500/60 rounded-2xl px-2.5 py-1 shadow-lg">
            <img
              src={
                selectedCharacter === 'aybuke'
                  ? '/assets/images/aybuke_3d_clean.webp'
                  : '/assets/images/eren_3d_clean.webp'
              }
              alt={selectedCharacter === 'aybuke' ? 'Aybüke' : 'Eren'}
              className="w-7 h-7 sm:w-8 sm:h-8 object-contain rounded-lg bg-amber-500/15 border border-amber-400/50"
            />
            <div className="leading-tight">
              <span className="block text-[9px] text-amber-400 font-bold uppercase tracking-wider">
                Aktif Rehber
              </span>
              <span className="block text-xs sm:text-sm font-black text-amber-100">
                {selectedCharacter === 'aybuke' ? 'Aybüke' : 'Eren'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => onSelectCharacter(selectedCharacter === 'eren' ? 'aybuke' : 'eren')}
              className="ml-1 px-2 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/35 border border-amber-400/40 text-[10px] font-bold text-amber-200 transition"
              title="Rehber Karakteri Değiştir"
            >
              Değiştir
            </button>
          </div>

          {/* Center: Ornamental Title Plaque ("DİJİTAL SİYER YOLCULUĞU / 571–632 Zaman Kapıları") */}
          <div
            className="flex flex-col items-center justify-center px-5 sm:px-8 py-1.5 rounded-3xl border-2 border-amber-400/90 shadow-2xl text-center"
            style={{
              background: 'linear-gradient(180deg, #581c0c 0%, #3b1106 65%, #260a03 100%)',
              boxShadow: '0 6px 24px rgba(0,0,0,0.75), inset 0 1px 4px rgba(253,230,138,0.5)'
            }}
          >
            <div className="flex items-center gap-2">
              <span className="text-amber-300 text-xs sm:text-sm">☪</span>
              <h1
                className="font-black tracking-wide text-amber-100 font-title uppercase"
                style={{ fontSize: 'clamp(1rem, 2vw, 1.55rem)' }}
              >
                DİJİTAL SİYER YOLCULUĞU
              </h1>
              <span className="text-amber-300 text-xs sm:text-sm">✦</span>
            </div>
            <p className="text-[11px] sm:text-xs font-extrabold text-amber-300 tracking-widest uppercase">
              571–632 Zaman Kapıları
            </p>
          </div>

          {/* Right: Journals, Teacher, Settings & Main Menu */}
          <div className="flex items-center gap-1.5 bg-stone-950/90 border border-amber-500/50 rounded-2xl p-1.5 shadow-lg">
            <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-950/60 border border-amber-500/30 text-xs font-bold text-amber-200">
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              <span>Keşif: {visitedYears.length}/62</span>
            </div>

            <button
              type="button"
              onClick={onOpenHistoryJournal}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-stone-900 hover:bg-amber-950 text-stone-200 hover:text-amber-200 text-xs font-bold border border-stone-700 transition"
              title="Tarih Keşif Defteri"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">Tarih Defteri</span>
            </button>

            <button
              type="button"
              onClick={onOpenValuesJournal}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-stone-900 hover:bg-emerald-950 text-stone-200 hover:text-emerald-200 text-xs font-bold border border-stone-700 transition"
              title="Kök Değerler Defteri"
            >
              <Heart className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden md:inline">Değerler</span>
              <span className="bg-emerald-600 text-white text-[10px] px-1.5 rounded-full font-black">
                {unlockedValues.length}/10
              </span>
            </button>

            <button
              type="button"
              onClick={onOpenResearchPanel}
              className="p-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-blue-300 border border-stone-700 transition"
              title="TÜBİTAK Araştırma Verileri"
            >
              <BarChart3 className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onOpenTeacherPanel}
              className="p-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-purple-300 border border-stone-700 transition"
              title="Öğretmen Paneli"
            >
              <GraduationCap className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onOpenSettings}
              className="p-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-300 border border-stone-700 transition"
              title="Ayarlar"
            >
              <Settings className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onToggleMute}
              className="p-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-300 border border-stone-700 transition"
              title={isMuted ? 'Sesi Aç' : 'Sesi Kapat'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
            </button>

            <button
              type="button"
              onClick={onExitToMenu}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-rose-700 hover:bg-rose-600 text-white text-xs font-black border border-rose-400 transition"
              title="Ana Sayfaya Dön"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ana Sayfa</span>
            </button>
          </div>
        </div>

        {/* Period Filter Bar & Quick Year Jump (Mobile, Tablet & Smartboard Friendly) */}
        <div className="flex flex-wrap items-center justify-between gap-2 bg-stone-950/80 border border-amber-500/40 rounded-2xl px-2.5 py-1.5">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {PERIOD_GROUPS.map((grp) => {
              const active = activePeriod === grp.id;
              return (
                <button
                  key={grp.id}
                  type="button"
                  onClick={() => handlePeriodSelect(grp)}
                  className={`px-2.5 sm:px-3 py-1 rounded-xl text-[11px] sm:text-xs font-bold whitespace-nowrap transition ${
                    active
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-black shadow border border-amber-200'
                      : 'bg-stone-900/90 hover:bg-stone-800 text-amber-200/90 border border-amber-700/40'
                  }`}
                >
                  <span className="hidden md:inline">{grp.label}</span>
                  <span className="md:hidden">{grp.shortLabel}</span>
                </button>
              );
            })}
          </div>

          <form onSubmit={handleSearchJump} className="flex items-center gap-1.5 ml-auto">
            <div className="relative flex items-center">
              <Search className="w-3.5 h-3.5 text-amber-400 absolute left-2.5 pointer-events-none" />
              <input
                type="number"
                min={571}
                max={632}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Yıl ara (571-632)..."
                aria-label="Yıl numarası ara"
                className="w-32 sm:w-40 pl-7 pr-2 py-1 rounded-xl bg-stone-900 border border-amber-500/50 text-xs text-amber-100 placeholder-stone-400 focus:outline-none focus:border-amber-300"
              />
            </div>
            <button
              type="submit"
              className="px-2.5 py-1 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs transition"
            >
              Git
            </button>
          </form>
        </div>
      </header>

      {/* 3. MAIN STAGE: LEFT CHARACTER (AYBÜKE) + 62 ARCHITECTURAL DOORS + RIGHT CHARACTER (EREN) */}
      <main className="relative z-10 flex-1 w-full max-w-[1680px] mx-auto px-2 sm:px-4 overflow-hidden flex items-stretch justify-between gap-2">
        
        {/* Left Character Standee: AYBÜKE (Original 3D Reference Character) */}
        <aside className="hidden xl:flex flex-col items-center justify-end w-44 shrink-0 pb-2 select-none">
          <div
            onClick={() => onSelectCharacter('aybuke')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onSelectCharacter('aybuke')}
            className={`group cursor-pointer relative flex flex-col items-center p-2 rounded-3xl transition ${
              selectedCharacter === 'aybuke'
                ? 'ring-2 ring-amber-400 bg-amber-500/10'
                : 'opacity-85 hover:opacity-100'
            }`}
            title="Aybüke'yi Aktif Rehber Seç"
          >
            {selectedCharacter === 'aybuke' && (
              <span className="mb-1 px-2.5 py-0.5 rounded-full bg-amber-400 text-stone-950 font-black text-[10px] shadow">
                ✓ Aktif Karakter
              </span>
            )}
            <img
              src="/assets/images/aybuke_3d_clean.webp"
              alt="Aybüke"
              className="w-40 h-auto max-h-[340px] object-contain drop-shadow-[0_12px_20px_rgba(0,0,0,0.85)] transition-transform duration-200 group-hover:scale-105"
            />
            <div className="mt-1 px-4 py-1 rounded-xl bg-[#3b1c0a] border border-amber-400/70 text-amber-200 font-black text-xs shadow-lg">
              Aybüke
            </div>
          </div>
        </aside>

        {/* Center Colosseum Courtyard of 62 Doors (571 - 632) */}
        <div
          ref={gridContainerRef}
          className="flex-1 h-full overflow-y-auto overflow-x-hidden pr-1 pb-4 space-y-3 scroll-smooth"
        >
          {architecturalTiers.map((tier) => {
            const activeGrp = PERIOD_GROUPS.find((g) => g.id === activePeriod);
            return (
              <section
                key={tier.id}
                aria-label={tier.label}
                className="rounded-3xl p-2.5 sm:p-3.5 border-2 border-amber-700/60 shadow-2xl"
                style={{
                  background:
                    'linear-gradient(180deg, rgba(68,42,22,0.92) 0%, rgba(41,24,12,0.96) 100%)',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.6), inset 0 2px 6px rgba(251,191,36,0.2)'
                }}
              >
                {/* Stone Cornice Ledge Header */}
                <div className="flex items-center justify-between mb-2 px-2 py-1 rounded-xl bg-stone-950/60 border border-amber-500/30">
                  <span className="text-[11px] sm:text-xs font-extrabold text-amber-300 tracking-wider uppercase">
                    {tier.label}
                  </span>
                  <span className="text-[10px] text-amber-200/80 font-semibold">
                    {tier.years[0]} – {tier.years[tier.years.length - 1]} ({tier.years.length} Kapı)
                  </span>
                </div>

                {/* Multi-row Responsive Doors Grid:
                    - Mobile portrait: 3 to 4 columns (large touch targets!)
                    - Tablet: 5 to 8 columns
                    - Desktop: 8 columns (2 clean sub-rows of 8 per tier, or 15-16 on ultra-wide) */}
                <div className="grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-5 md:grid-cols-8 2xl:grid-cols-8 gap-2 sm:gap-2.5">
                  {tier.years.map((year) => {
                    const yData = yearDataMap.get(year);
                    const hasVerified = Boolean(
                      yData &&
                        yData.hasVerifiedContent !== false &&
                        yData.missions &&
                        yData.missions.length > 0
                    );
                    const isHighlighted =
                      (searchQuery.trim() !== '' && Number(searchQuery.trim()) === year) ||
                      (activeGrp &&
                        activeGrp.id !== 'all' &&
                        year >= activeGrp.startYear &&
                        year <= activeGrp.endYear);

                    return (
                      <YearDoorButton
                        key={year}
                        year={year}
                        title={yData?.title || `${year} Yılı`}
                        hasVerifiedContent={hasVerified}
                        isVisited={visitedSet.has(year)}
                        isCompleted={completedSet.has(year)}
                        isMilestone={MILESTONE_YEARS.has(year)}
                        isHighlighted={Boolean(isHighlighted)}
                        onSelect={onSelectYear}
                      />
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>

        {/* Right Character Standee: EREN (Original 3D Reference Character) */}
        <aside className="hidden xl:flex flex-col items-center justify-end w-44 shrink-0 pb-2 select-none">
          <div
            onClick={() => onSelectCharacter('eren')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onSelectCharacter('eren')}
            className={`group cursor-pointer relative flex flex-col items-center p-2 rounded-3xl transition ${
              selectedCharacter === 'eren'
                ? 'ring-2 ring-amber-400 bg-amber-500/10'
                : 'opacity-85 hover:opacity-100'
            }`}
            title="Eren'i Aktif Rehber Seç"
          >
            {selectedCharacter === 'eren' && (
              <span className="mb-1 px-2.5 py-0.5 rounded-full bg-amber-400 text-stone-950 font-black text-[10px] shadow">
                ✓ Aktif Karakter
              </span>
            )}
            <img
              src="/assets/images/eren_3d_clean.webp"
              alt="Eren"
              className="w-40 h-auto max-h-[340px] object-contain drop-shadow-[0_12px_20px_rgba(0,0,0,0.85)] transition-transform duration-200 group-hover:scale-105"
            />
            <div className="mt-1 px-4 py-1 rounded-xl bg-[#3b1c0a] border border-amber-400/70 text-amber-200 font-black text-xs shadow-lg">
              Eren
            </div>
          </div>
        </aside>
      </main>

      {/* 4. BOTTOM INSTRUCTION BANNER ("Keşfetmek istediğin yılın kapısını seç!") */}
      <footer className="relative z-20 w-full px-3 py-1.5 sm:py-2 bg-stone-950/90 border-t border-amber-600/40 flex items-center justify-center shrink-0">
        <div
          className="flex items-center gap-2.5 sm:gap-4 px-5 sm:px-8 py-1.5 rounded-2xl border-2 border-amber-400/80 shadow-xl"
          style={{
            background: 'linear-gradient(90deg, #4c1709 0%, #6d210d 50%, #4c1709 100%)'
          }}
        >
          <span className="text-amber-300 text-sm hidden sm:inline">۞</span>
          <Hand className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300 shrink-0" />
          <p className="text-xs sm:text-sm font-extrabold text-amber-100 tracking-wide text-center">
            Keşfetmek istediğin yılın kapısını seç!{' '}
            <span className="hidden md:inline text-amber-300 font-semibold">
              • İncelemek istediğin yıla tıklayarak zamanın içine gir.
            </span>
          </p>
          <span className="text-amber-300 text-sm hidden sm:inline">۞</span>
        </div>
      </footer>

    </div>
  );
};
