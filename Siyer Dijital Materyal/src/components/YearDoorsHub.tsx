import React, { useMemo, useState } from 'react';
import {
  BookOpen,
  Heart,
  Settings,
  LogOut,
  CheckCircle2,
  Volume2,
  VolumeX,
  GraduationCap,
  BarChart3,
  Search,
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

const MILESTONE_YEARS = new Set([
  571, 575, 576, 578, 591, 595, 605, 610, 613, 615, 616, 619, 620, 621, 622, 624, 625, 627, 628, 630, 632
]);

const MAJOR_PORTAL_YEARS = new Set([571, 610, 622, 624, 625, 627, 628, 630, 632]);

/**
 * Reusable, accessible, memoized 3D-styled Islamic Arch Door button component.
 * Renders pure CSS/DOM 3D depth with zero WebGL overhead.
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
  const isMajor = MAJOR_PORTAL_YEARS.has(year);

  return (
    <button
      type="button"
      data-year={year}
      onClick={() => onSelect(year)}
      aria-label={`${year} Yılı Kapısı - ${title}`}
      title={`${year}: ${title}`}
      className={`group relative flex flex-col items-center justify-between w-full aspect-[3/4.2] rounded-t-full rounded-b-lg p-1 sm:p-1.5 transition-transform duration-150 hover:-translate-y-1 active:scale-95 focus:outline-none focus:ring-2 focus:ring-amber-300 select-none cursor-pointer ${
        isHighlighted
          ? 'ring-3 ring-amber-300 shadow-[0_0_22px_rgba(251,191,36,0.95)] z-20 scale-105'
          : isMajor
          ? 'shadow-[0_6px_16px_rgba(0,0,0,0.65),0_0_16px_rgba(245,158,11,0.55)]'
          : 'shadow-[0_4px_10px_rgba(0,0,0,0.6)]'
      }`}
      style={{
        background: isMajor
          ? 'linear-gradient(180deg, #ffe699 0%, #f59e0b 28%, #92400e 72%, #451a03 100%)'
          : isMilestone || hasVerifiedContent
          ? 'linear-gradient(180deg, #fcd34d 0%, #d97706 32%, #78350f 78%, #3b1704 100%)'
          : 'linear-gradient(180deg, #e7c582 0%, #b47b38 35%, #653713 80%, #341806 100%)',
        border: isMajor
          ? '2px solid #fef08a'
          : isCompleted
          ? '2px solid #34d399'
          : '1.5px solid rgba(253, 224, 71, 0.75)'
      }}
    >
      {/* Inner recessed wooden/golden door frame */}
      <div
        className="relative w-full h-full rounded-t-full rounded-b-md flex flex-col items-center justify-between pt-1.5 pb-1 px-0.5 overflow-hidden"
        style={{
          background: isMajor
            ? 'radial-gradient(circle at 50% 82%, rgba(254,240,138,0.85) 0%, rgba(217,119,6,0.75) 42%, rgba(69,26,3,0.96) 90%)'
            : 'radial-gradient(circle at 50% 85%, rgba(251,191,36,0.5) 0%, rgba(120,53,15,0.88) 52%, rgba(38,16,5,0.97) 95%)',
          boxShadow: 'inset 0 3px 8px rgba(0,0,0,0.75), inset 0 -4px 10px rgba(251,191,36,0.35)'
        }}
      >
        {/* Top Arch Filigree Crown */}
        <div className="w-3/5 h-1 rounded-full bg-amber-300/70 group-hover:bg-amber-200 transition-colors shrink-0" />

        {/* Center Double-Door Seam Line */}
        <div className="absolute inset-y-2 left-1/2 -translate-x-1/2 w-[1px] bg-black/45 pointer-events-none" />

        {/* Year Plaque (Parchment & Dark Brown/Gold Numerals matching reference image) */}
        <div
          className={`relative z-10 px-1.5 sm:px-2 py-0.5 rounded-md border shadow-md transition-transform group-hover:scale-105 ${
            isMajor
              ? 'bg-gradient-to-b from-[#fffbeb] to-[#fde68a] border-amber-400 text-[#291103]'
              : 'bg-gradient-to-b from-[#fef3c7] to-[#f5d08b] border-amber-600/70 text-[#2e1304]'
          }`}
        >
          <span
            className={`font-black tracking-tight leading-none block ${
              isMajor
                ? 'text-xs sm:text-sm md:text-base lg:text-[15px] xl:text-[17px]'
                : 'text-xs sm:text-xs md:text-sm lg:text-[13px] xl:text-[15px]'
            }`}
          >
            {year}
          </span>
        </div>

        {/* Golden Door Knockers */}
        <div className="relative z-10 flex items-center justify-center gap-1.5 my-0.5 pointer-events-none">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-300 border border-amber-900 shadow-sm" />
          <span className="w-1.5 h-1.5 rounded-full bg-amber-300 border border-amber-900 shadow-sm" />
        </div>

        {/* Bottom Threshold Light / Status */}
        <div className="relative z-10 w-full flex items-center justify-center">
          {isCompleted ? (
            <span className="inline-flex items-center gap-0.5 bg-emerald-500 text-stone-950 font-black text-[8px] px-1 rounded-full leading-tight shadow">
              <CheckCircle2 className="w-2.5 h-2.5" />
            </span>
          ) : isVisited ? (
            <span className="w-3/4 h-1 rounded-full bg-amber-300 shadow-[0_0_8px_#fde047]" />
          ) : (
            <span className="w-2/3 h-1 rounded-full bg-amber-400/75 group-hover:bg-amber-200 shadow-[0_0_6px_rgba(251,191,36,0.8)]" />
          )}
        </div>
      </div>
    </button>
  );
});

YearDoorButton.displayName = 'YearDoorButton';

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
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [highlightedYear, setHighlightedYear] = useState<number | null>(null);

  // Map year number -> YearData for O(1) lookup
  const yearDataMap = useMemo(() => {
    const map = new Map<number, YearData>();
    for (const y of years) {
      map.set(y.year, y);
    }
    return map;
  }, [years]);

  // Complete 62 doors (571..632) generated programmatically from ALL_SIYER_YEARS
  const allDoorItems = useMemo(() => {
    return ALL_SIYER_YEARS.map(yearNum => {
      const yData = yearDataMap.get(yearNum);
      const hasVerifiedContent = Boolean(
        yData && (yData.hasVerifiedContent || (yData.missions && yData.missions.length > 0))
      );
      return {
        year: yearNum,
        title: yData?.title || `${yearNum} Yılı`,
        hasVerifiedContent,
        isVisited: visitedYears.includes(yearNum),
        isCompleted: completedYears.includes(yearNum),
        isMilestone: MILESTONE_YEARS.has(yearNum)
      };
    });
  }, [yearDataMap, visitedYears, completedYears]);

  // 4 Architectural Tiers matching the reference design (16 + 16 + 15 + 15 = 62 doors total)
  const tiers = useMemo(() => {
    return [
      {
        id: 'tier-1',
        range: '571 – 586',
        doors: allDoorItems.filter(d => d.year >= 571 && d.year <= 586)
      },
      {
        id: 'tier-2',
        range: '587 – 602',
        doors: allDoorItems.filter(d => d.year >= 587 && d.year <= 602)
      },
      {
        id: 'tier-3',
        range: '603 – 617',
        doors: allDoorItems.filter(d => d.year >= 603 && d.year <= 617)
      },
      {
        id: 'tier-4',
        range: '618 – 632',
        doors: allDoorItems.filter(d => d.year >= 618 && d.year <= 632)
      }
    ];
  }, [allDoorItems]);

  const handleQuickJump = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseInt(searchQuery.trim(), 10);
    if (!isNaN(parsed) && parsed >= 571 && parsed <= 632) {
      setHighlightedYear(parsed);
      const el = document.querySelector(`[data-year="${parsed}"]`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      setTimeout(() => setHighlightedYear(null), 2500);
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col justify-between select-none bg-[#2b180a]">
      {/* 1. VIBRANT HISTORICAL ARCHITECTURAL BACKDROP (Kaaba, Green Dome, Stone Archways, Lanterns, Aybüke Left, Eren Right) */}
      <div
        className="absolute inset-0 bg-cover bg-center pointer-events-none"
        style={{
          backgroundImage: `url('/assets/images/doors_backdrop.webp')`
        }}
      />

      {/* 2. TOP HEADER & SINGLE UNIFIED ORNATE CREST (Covers backdrop crest cleanly without double-title overlap) */}
      <header className="relative z-30 w-full px-2 sm:px-5 pt-2 sm:pt-3 shrink-0">
        <div className="max-w-[1840px] mx-auto flex items-start justify-between gap-2">
          {/* Left: Active Guide Pill */}
          <div className="flex items-center gap-1.5 sm:gap-2 bg-[#3d160c]/95 border-2 border-amber-400/80 rounded-2xl px-2.5 py-1.5 shadow-xl">
            <img
              src={
                selectedCharacter === 'aybuke'
                  ? '/assets/images/aybuke_3d_clean.webp'
                  : '/assets/images/eren_3d_clean.webp'
              }
              alt={selectedCharacter === 'aybuke' ? 'Aybüke' : 'Eren'}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg object-contain bg-amber-950/70 border border-amber-400/60"
            />
            <div className="leading-tight">
              <div className="text-[9px] sm:text-[10px] text-amber-300 font-bold uppercase tracking-wider">
                Seçili Karakter
              </div>
              <div className="text-xs sm:text-sm font-black text-amber-100">
                {selectedCharacter === 'aybuke' ? 'Aybüke' : 'Eren'}
              </div>
            </div>
            <button
              type="button"
              onClick={() =>
                onSelectCharacter(selectedCharacter === 'aybuke' ? 'eren' : 'aybuke')
              }
              className="ml-1 px-2 py-0.5 rounded-lg bg-amber-500/25 hover:bg-amber-500/40 border border-amber-300/60 text-[10px] font-bold text-amber-100 transition"
              title="Rehber Karakteri Değiştir"
            >
              Değiştir
            </button>
          </div>

          {/* Center: Accessible Title (Visible as compact banner on small screens; on lg+ lets the grand ornate crest in the reference backdrop shine without double-title overlap) */}
          <div className="lg:opacity-0 lg:pointer-events-none flex flex-col items-center justify-center text-center px-4 sm:px-8 py-1.5 sm:py-2 rounded-2xl bg-gradient-to-b from-[#6b140e] via-[#4c0d09] to-[#330805] border-2 border-amber-400 shadow-xl">
            <h1 className="text-sm sm:text-xl font-black text-amber-100 font-title tracking-wider">
              DİJİTAL SİYER YOLCULUĞU
            </h1>
            <p className="text-[10px] sm:text-xs font-black text-amber-300">
              571–632 Zaman Kapıları
            </p>
          </div>

          {/* Right: Quick Tools, Journals & Main Menu Return */}
          <div className="flex items-center gap-1 sm:gap-1.5 bg-[#3d160c]/95 border-2 border-amber-400/80 rounded-2xl px-2.5 py-1.5 shadow-xl">
            <form onSubmit={handleQuickJump} className="hidden xl:flex items-center gap-1 mr-1">
              <div className="relative">
                <Search className="w-3 h-3 text-amber-300 absolute left-2 top-1/2 -translate-y-1/2" />
                <input
                  type="number"
                  min={571}
                  max={632}
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Yıl (571-632)"
                  className="w-28 pl-6 pr-2 py-1 rounded-lg bg-stone-950/90 border border-amber-500/50 text-[11px] text-amber-100 placeholder-stone-400 focus:outline-none focus:border-amber-300"
                />
              </div>
            </form>

            <button
              type="button"
              onClick={onOpenHistoryJournal}
              className="p-1.5 sm:px-2.5 sm:py-1 rounded-xl bg-amber-900/50 hover:bg-amber-800/70 border border-amber-400/50 text-amber-100 text-xs font-bold flex items-center gap-1 transition"
              title="Tarih Keşif Defteri"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden md:inline">Tarih Defteri</span>
            </button>

            <button
              type="button"
              onClick={onOpenValuesJournal}
              className="p-1.5 sm:px-2.5 sm:py-1 rounded-xl bg-emerald-950/70 hover:bg-emerald-900/80 border border-emerald-400/50 text-emerald-200 text-xs font-bold flex items-center gap-1 transition"
              title="Kök Değerler Çantası"
            >
              <Heart className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden md:inline">Değerler ({unlockedValues.length}/10)</span>
            </button>

            <button
              type="button"
              onClick={onOpenResearchPanel}
              className="hidden sm:flex p-1.5 rounded-xl bg-stone-900/80 hover:bg-stone-800 border border-amber-500/40 text-sky-300 transition"
              title="TÜBİTAK Araştırma Verileri"
            >
              <BarChart3 className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={onOpenTeacherPanel}
              className="hidden sm:flex p-1.5 rounded-xl bg-stone-900/80 hover:bg-stone-800 border border-amber-500/40 text-purple-300 transition"
              title="Öğretmen İçerik Paneli"
            >
              <GraduationCap className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={onOpenSettings}
              className="p-1.5 rounded-xl bg-stone-900/80 hover:bg-stone-800 border border-amber-500/40 text-stone-200 transition"
              title="Ayarlar"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={onToggleMute}
              className="p-1.5 rounded-xl bg-stone-900/80 hover:bg-stone-800 border border-amber-500/40 text-amber-300 transition"
              title={isMuted ? 'Sesi Aç' : 'Sesi Kapat'}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>

            <button
              type="button"
              onClick={onExitToMenu}
              className="px-2.5 py-1 rounded-xl bg-rose-800 hover:bg-rose-700 border border-rose-300/60 text-white text-xs font-bold flex items-center gap-1 transition shadow"
              title="Ana Sayfaya Dön"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ana Sayfa</span>
            </button>
          </div>
        </div>
      </header>

      {/* 3. MAIN STAGE: AYBÜKE (LEFT) + 4 TIERS OF 62 GOLDEN DOORS (CENTER) + EREN (RIGHT) */}
      <main className="relative z-20 flex-1 w-full max-w-[1920px] mx-auto flex items-stretch justify-between px-1.5 sm:px-3 md:px-4 pt-10 lg:pt-16 pb-1 overflow-hidden">
        {/* LEFT CHARACTER CLICK ZONE: AYBÜKE (Uses the full-size Aybüke in the backdrop without drawing a second mini character over her) */}
        <div
          onClick={() => onSelectCharacter('aybuke')}
          className="hidden lg:flex flex-col items-center justify-end w-[165px] xl:w-[215px] 2xl:w-[245px] shrink-0 pb-2 cursor-pointer select-none group"
          title="Aybüke ile Keşfet"
        >
          <div
            className={`px-5 py-1.5 rounded-full font-black text-xs xl:text-sm border-2 shadow-2xl flex items-center gap-1.5 transition-transform group-hover:scale-105 ${
              selectedCharacter === 'aybuke'
                ? 'bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-stone-950 border-white ring-4 ring-amber-400/50'
                : 'bg-[#3d160c]/95 text-amber-100 border-amber-400/80'
            }`}
          >
            {selectedCharacter === 'aybuke' && <CheckCircle2 className="w-4 h-4 text-stone-950" />}
            <span>Aybüke</span>
          </div>
        </div>

        {/* CENTER AMPHITHEATER: 62 PROGRAMMATIC GOLDEN DOORS IN 4 ARCHITECTURAL TIERS */}
        <div className="flex-1 h-full overflow-y-auto px-1 sm:px-2 py-0.5 flex flex-col justify-start lg:justify-center gap-1.5">
          {tiers.map((tier, idx) => (
            <section
              key={tier.id}
              aria-label={`${idx + 1}. Kat (${tier.range})`}
              className="w-full rounded-2xl px-2 sm:px-3 py-1.5 border-2 border-amber-500/60 shadow-[0_8px_22px_rgba(0,0,0,0.65),inset_0_2px_10px_rgba(251,191,36,0.25)]"
              style={{
                background:
                  'linear-gradient(180deg, rgba(120,69,28,0.95) 0%, rgba(78,42,15,0.97) 55%, rgba(48,24,8,0.99) 100%)'
              }}
            >
              {/* Mobile/Tablet Tier Label */}
              <div className="flex lg:hidden items-center justify-between mb-1 px-1">
                <span className="text-[11px] font-black text-amber-200 uppercase tracking-wider">
                  {idx + 1}. Kat • {tier.range} Yılları
                </span>
                <span className="text-[10px] font-bold text-amber-300/80">
                  {tier.doors.length} Kapı
                </span>
              </div>

              {/* Door Row Grid */}
              <div
                className={`grid gap-1 sm:gap-1.5 items-end ${
                  tier.doors.length === 16
                    ? 'grid-cols-4 sm:grid-cols-8 lg:grid-cols-[repeat(16,minmax(0,1fr))]'
                    : 'grid-cols-5 sm:grid-cols-8 lg:grid-cols-[repeat(15,minmax(0,1fr))]'
                }`}
              >
                {tier.doors.map(door => (
                  <YearDoorButton
                    key={door.year}
                    year={door.year}
                    title={door.title}
                    hasVerifiedContent={door.hasVerifiedContent}
                    isVisited={door.isVisited}
                    isCompleted={door.isCompleted}
                    isMilestone={door.isMilestone}
                    isHighlighted={highlightedYear === door.year}
                    onSelect={onSelectYear}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* RIGHT CHARACTER CLICK ZONE: EREN (Uses the full-size Eren in the backdrop without drawing a second mini character over him) */}
        <div
          onClick={() => onSelectCharacter('eren')}
          className="hidden lg:flex flex-col items-center justify-end w-[165px] xl:w-[215px] 2xl:w-[245px] shrink-0 pb-2 cursor-pointer select-none group"
          title="Eren ile Keşfet"
        >
          <div
            className={`px-5 py-1.5 rounded-full font-black text-xs xl:text-sm border-2 shadow-2xl flex items-center gap-1.5 transition-transform group-hover:scale-105 ${
              selectedCharacter === 'eren'
                ? 'bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-stone-950 border-white ring-4 ring-amber-400/50'
                : 'bg-[#3d160c]/95 text-amber-100 border-amber-400/80'
            }`}
          >
            {selectedCharacter === 'eren' && <CheckCircle2 className="w-4 h-4 text-stone-950" />}
            <span>Eren</span>
          </div>
        </div>
      </main>

      {/* 4. BOTTOM COURTYARD INSTRUCTION BANNER (Visible as compact banner on small screens; on lg+ lets the ornate courtyard plaque in the reference backdrop shine without double-banner overlap) */}
      <footer className="relative z-30 w-full px-3 pb-2 sm:pb-3 pt-1 flex justify-center shrink-0 lg:opacity-0 lg:pointer-events-none lg:h-16">
        <div className="bg-gradient-to-r from-[#5c130e] via-[#7c1d15] to-[#5c130e] border-2 border-amber-400 rounded-2xl px-4 sm:px-8 py-1.5 sm:py-2 shadow-xl flex items-center justify-center gap-2 text-center">
          <Hand className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300 shrink-0" />
          <p className="text-xs sm:text-sm font-black text-amber-100 tracking-wide">
            Keşfetmek istediğin yılın kapısını seç! • İncelemek istediğin yıla tıklayarak zamanın içine gir.
          </p>
        </div>
      </footer>
    </div>
  );
};
