import React from 'react';
import {
  BookOpen,
  Heart,
  Volume2,
  VolumeX,
  Compass,
  Sparkles,
  MapPin,
  CheckCircle2,
  Calendar,
  ArrowLeft,
  LogOut,
  Settings,
  Monitor
} from 'lucide-react';
import { YearData, RootValueId } from '../types';

interface HeaderHUDProps {
  currentYearData?: YearData;
  wrongAttemptsLeft?: number;
  completedYearsCount: number;
  visitedYearsCount?: number;
  unlockedValues: RootValueId[];
  isMuted: boolean;
  isTimelineHub?: boolean;
  isSmartboardMode?: boolean;
  onToggleSmartboardMode?: () => void;
  onToggleMute: () => void;
  onOpenHistoryJournal?: () => void;
  onOpenValuesJournal?: () => void;
  onOpenSettings?: () => void;
  onOpenModelInspector?: () => void;
  onOpenTestArena?: () => void;
  onOpenTeacherPanel?: () => void;
  onOpenResearchPanel?: () => void;
  onReturnToTimeline?: () => void;
  onOpenTimelineSelector?: () => void;
  onExitToMenu: () => void;
}

export const HeaderHUD: React.FC<HeaderHUDProps> = ({
  currentYearData,
  wrongAttemptsLeft = 3,
  completedYearsCount,
  visitedYearsCount = 1,
  unlockedValues,
  isMuted,
  isTimelineHub = false,
  isSmartboardMode = false,
  onToggleSmartboardMode,
  onToggleMute,
  onOpenHistoryJournal,
  onOpenValuesJournal,
  onOpenSettings,
  onOpenModelInspector,
  onReturnToTimeline,
  onOpenTimelineSelector,
  onExitToMenu,
}) => {
  return (
    <div className="absolute top-0 left-0 right-0 z-30 p-2.5 sm:p-4 pointer-events-none">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto">
        
        {/* Left: Year & Navigation Controls */}
        <div className="pointer-events-auto flex items-center gap-2 sm:gap-3">
          
          {/* In 3D Historical Scene: Dedicated Prominent "ZAMAN ŞERİDİNE DÖN" Button */}
          {!isTimelineHub && onReturnToTimeline && (
            <button
              onClick={onReturnToTimeline}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-950 font-black text-xs sm:text-sm transition-all shadow-2xl border-2 border-amber-300 transform hover:scale-105 active:scale-95"
              title="3D Zaman Şeridine Geri Dön"
            >
              <ArrowLeft className="w-4 h-4 stroke-[3]" />
              <span>Zaman Şeridine Dön</span>
            </button>
          )}

          {/* Location & Year Badge */}
          {isTimelineHub ? (
            <div className="flex items-center gap-3 bg-stone-900/90 border border-amber-500/60 backdrop-blur-md rounded-2xl px-4 py-2 shadow-xl">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/60 flex items-center justify-center text-amber-400">
                <Compass className="w-5 h-5 animate-spin-slow" />
              </div>
              <div>
                <div className="text-[10px] font-bold text-amber-400 tracking-wider uppercase">
                  Ana Keşif Koridoru
                </div>
                <div className="text-sm sm:text-base font-black text-amber-100 font-title">
                  3D Zaman Şeridi (571 – 632)
                </div>
              </div>
            </div>
          ) : currentYearData ? (
            <div className="flex items-center gap-2.5 sm:gap-3 bg-stone-900/90 border border-amber-600/50 backdrop-blur-md rounded-2xl px-3 sm:px-4 py-2 shadow-xl">
              <div className="bg-gradient-to-br from-amber-500 to-amber-700 text-stone-950 font-black text-lg sm:text-xl px-2.5 py-0.5 rounded-xl shadow-inner font-title">
                {currentYearData.year}
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1 text-[11px] text-amber-300 font-semibold tracking-wider">
                  <MapPin className="w-3 h-3 text-amber-400" />
                  <span className="truncate max-w-[140px] sm:max-w-xs">{currentYearData.location}</span>
                </div>
                <div className="text-xs sm:text-sm font-bold text-stone-100 max-w-[160px] sm:max-w-xs truncate">
                  {currentYearData.title}
                </div>
              </div>
            </div>
          ) : null}

          {/* Quick Year Selector Modal Trigger */}
          {onOpenTimelineSelector && (
            <button
              onClick={onOpenTimelineSelector}
              className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-stone-900/90 hover:bg-stone-800 text-amber-300 text-xs font-bold transition border border-amber-600/50 shadow-lg hover:scale-105 active:scale-95"
              title="62 Yıl Çizelgesi / Hızlı Yıl Seçimi"
            >
              <Calendar className="w-4 h-4 text-amber-400" />
              <span className="hidden md:inline">Yıla Git</span>
            </button>
          )}

        </div>

        {/* Center: Progress & Exploration Counters */}
        <div className="pointer-events-auto flex items-center gap-2 sm:gap-4 bg-stone-900/95 border border-amber-600/60 backdrop-blur-md rounded-2xl px-3.5 sm:px-4 py-1.5 shadow-xl whitespace-nowrap">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-amber-200">Keşif:</span>
            <span className="bg-amber-950/80 text-amber-300 border border-amber-600/40 text-xs font-black px-2 py-0.5 rounded-lg">
              {visitedYearsCount} / 62 Yıl
            </span>
          </div>

          <div className="h-4 w-px bg-stone-700" />

          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-stone-300">Görev:</span>
            <span className="bg-emerald-950/80 text-emerald-300 border border-emerald-600/40 text-xs font-black px-2 py-0.5 rounded-lg flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>{completedYearsCount}</span>
            </span>
          </div>

          {!isTimelineHub && (
            <>
              <div className="h-4 w-px bg-stone-700 hidden sm:block" />
              <div className="hidden sm:flex items-center gap-1.5">
                <span className="text-xs text-stone-300 font-semibold">Hak:</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3].map(strike => (
                    <div
                      key={strike}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        strike <= wrongAttemptsLeft
                          ? 'bg-emerald-500 shadow-md shadow-emerald-500/50 ring-1 ring-emerald-300'
                          : 'bg-stone-700 opacity-40 ring-1 ring-stone-600'
                      }`}
                      title={`Kalan Yanlış Hakkı: ${wrongAttemptsLeft}`}
                    />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Right: Journals & Utilities */}
        <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-2 bg-stone-900/90 border border-amber-600/50 backdrop-blur-md rounded-2xl p-1.5 shadow-xl">
          
          {/* History Journal */}
          {onOpenHistoryJournal && (
            <button
              onClick={onOpenHistoryJournal}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-stone-800/80 hover:bg-amber-950/80 hover:text-amber-300 text-stone-200 text-xs font-bold transition border border-stone-700/60"
              title="Tarihsel Keşif Defteri"
            >
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span className="hidden md:inline">Tarih Defteri</span>
            </button>
          )}

          {/* Values Journal */}
          {onOpenValuesJournal && (
            <button
              onClick={onOpenValuesJournal}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-stone-800/80 hover:bg-emerald-950/80 hover:text-emerald-300 text-stone-200 text-xs font-bold transition border border-stone-700/60"
              title="10 Kök Değer Keşif Defteri"
            >
              <Heart className="w-4 h-4 text-rose-400" />
              <span className="hidden md:inline">Değer Defteri</span>
              <span className="bg-emerald-600 text-white text-[10px] px-1.5 rounded-full font-black">
                {unlockedValues.length}/10
              </span>
            </button>
          )}

          {/* 3D Model Inspector */}
          {onOpenModelInspector && (
            <button
              onClick={onOpenModelInspector}
              className="p-1.5 sm:p-2 rounded-xl bg-purple-950/80 hover:bg-purple-900 text-purple-300 text-xs font-bold transition border border-purple-500/50"
              title="3D Karakter İncele (360°)"
            >
              <Sparkles className="w-4 h-4 text-purple-400" />
            </button>
          )}

          {/* Akıllı Tahta D-Pad Quick Toggle */}
          {onToggleSmartboardMode && (
            <button
              onClick={onToggleSmartboardMode}
              className={`p-1.5 sm:p-2 rounded-xl transition border ${
                isSmartboardMode
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-md shadow-amber-500/30'
                  : 'bg-stone-800/80 hover:bg-stone-700 text-stone-300 border-stone-700/60'
              }`}
              title={isSmartboardMode ? 'Akıllı Tahta D-Pad Aktif (Joystick için tıkla)' : 'Akıllı Tahta D-Pad Moduna Geç'}
            >
              <Monitor className="w-4 h-4 text-amber-400" />
            </button>
          )}

          {/* Settings & Graphics Quality */}
          {onOpenSettings && (
            <button
              onClick={onOpenSettings}
              className="p-1.5 sm:p-2 rounded-xl bg-stone-800/80 hover:bg-stone-700 text-stone-300 transition border border-stone-700/60"
              title="Grafik ve Ses Ayarları"
            >
              <Settings className="w-4 h-4 text-amber-400" />
            </button>
          )}

          {/* Audio Mute/Unmute */}
          <button
            onClick={onToggleMute}
            className="p-1.5 sm:p-2 rounded-xl bg-stone-800/80 hover:bg-stone-700 text-stone-300 transition border border-stone-700/60"
            title={isMuted ? 'Sesi Aç' : 'Sesi Kapat'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
          </button>

          {/* Exit / Menu Button */}
          <button
            onClick={onExitToMenu}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-700 hover:bg-rose-600 text-white text-xs font-black transition border border-rose-400 shadow-md shadow-rose-900/50"
            title="Ana Menüye Dön"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Çıkış</span>
          </button>
        </div>

      </div>
    </div>
  );
};
