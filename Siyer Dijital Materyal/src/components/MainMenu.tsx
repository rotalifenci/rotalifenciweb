import React, { useState } from 'react';
import { Sparkles, GraduationCap, BarChart3, ShieldCheck, CheckCircle2, AlertCircle, Play } from 'lucide-react';
import { CharacterType } from '../types';
import { audioSystem } from '../utils/audioSynthesizer';

interface MainMenuProps {
  selectedCharacter?: CharacterType | null;
  onSelectCharacter: (char: CharacterType) => void;
  onStartGame: () => void;
  onOpenPreTest: () => void;
  onOpenTeacherPanel: () => void;
  onOpenResearchPanel: () => void;
  onOpenModelInspector?: () => void;
  onOpenTestArena?: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  selectedCharacter = null,
  onSelectCharacter,
  onStartGame,
  onOpenPreTest,
  onOpenTeacherPanel,
  onOpenResearchPanel
}) => {
  const [isAudioStarted, setIsAudioStarted] = useState<boolean>(false);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const [selectionNotice, setSelectionNotice] = useState<string | null>(
    selectedCharacter ? `${selectedCharacter === 'eren' ? 'Eren' : 'Aybüke'} seçildi` : null
  );

  const handleCharacterPick = (char: CharacterType) => {
    onSelectCharacter(char);
    setWarningMessage(null);
    setSelectionNotice(`${char === 'eren' ? 'Eren' : 'Aybüke'} seçildi`);
    audioSystem.playButtonClick();
    if (!isAudioStarted) {
      audioSystem.startAmbientMusic();
      setIsAudioStarted(true);
    }
  };

  const handleStart = () => {
    if (!selectedCharacter) {
      setWarningMessage('Önce karakterini seçmelisin.');
      audioSystem.playWrongChime();
      setTimeout(() => setWarningMessage(null), 3000);
      return;
    }

    audioSystem.playButtonClick();
    if (!isAudioStarted) {
      audioSystem.startAmbientMusic();
      setIsAudioStarted(true);
    }
    onStartGame();
  };

  return (
    <div
      className="relative w-full h-full min-h-screen flex flex-col justify-between items-center overflow-hidden select-none"
      style={{
        background: 'radial-gradient(circle at 50% 35%, #3d2310 0%, #1d1007 60%, #0e0703 100%)'
      }}
    >
      {/* 1. TOP UTILITIES BAR */}
      <header className="relative z-30 w-full max-w-7xl mx-auto px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2 bg-stone-900/90 px-3 py-1.5 rounded-2xl border border-amber-600/40 text-xs font-bold text-amber-200 shadow-lg">
          <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="hidden sm:inline">TÜBİTAK 2204-B Ortaokul Siyer ve Değerler Eğitimi Projesi</span>
          <span className="sm:hidden">TÜBİTAK 2204-B</span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Pre-Test quick link */}
          <button
            type="button"
            onClick={onOpenPreTest}
            className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-amber-950/90 hover:bg-amber-900 border border-amber-600/50 text-amber-200 text-xs font-bold transition flex items-center gap-1.5 shadow active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Ön Teste Katıl</span>
          </button>

          {/* Research analytics */}
          <button
            type="button"
            onClick={onOpenResearchPanel}
            className="p-1.5 sm:p-2 rounded-xl bg-stone-900/90 hover:bg-stone-800 border border-blue-500/50 text-blue-300 transition"
            title="TÜBİTAK Araştırma Paneli"
          >
            <BarChart3 className="w-4 h-4" />
          </button>

          {/* Teacher panel */}
          <button
            type="button"
            onClick={onOpenTeacherPanel}
            className="p-1.5 sm:p-2 rounded-xl bg-stone-900/90 hover:bg-stone-800 border border-purple-500/50 text-purple-300 transition"
            title="Öğretmen Paneli"
          >
            <GraduationCap className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* 2. CENTER HERO ARTBOARD (Preserves natural 1024/683 aspect ratio, WebP optimized, zero heavy blur) */}
      <main className="relative z-10 flex-1 w-full flex flex-col items-center justify-center p-1 sm:p-3 overflow-hidden gap-2">
        <div
          className="relative max-w-full max-h-full flex items-center justify-center rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-amber-500/30"
          style={{
            aspectRatio: '1024 / 683',
            width: 'min(100vw, calc((100vh - 95px) * 1024 / 683))',
            height: 'min(calc(100vh - 95px), calc(100vw * 683 / 1024))'
          }}
        >
          {/* Authentic sharp hero artwork (WebP optimized) */}
          <img
            src="/assets/images/menu_hero.webp"
            alt="Dijital Siyer Yolculuğu 571 - 632"
            className="w-full h-full object-contain pointer-events-none"
          />

          {/* HOTZONE 1: EREN (Left Side - Proportional coordinates: left: 3.5%, top: 21.0%, width: 33.0%, height: 68.0%) */}
          <button
            type="button"
            id="select-character-eren"
            onClick={() => handleCharacterPick('eren')}
            aria-label="Eren Karakterini Seç"
            className={`absolute cursor-pointer rounded-3xl transition-transform duration-150 focus:outline-none ${
              selectedCharacter === 'eren'
                ? 'ring-4 ring-amber-400 bg-amber-500/20'
                : 'hover:ring-2 hover:ring-amber-300/60 hover:bg-amber-400/10'
            }`}
            style={{
              left: '3.5%',
              top: '21.0%',
              width: '33.0%',
              height: '68.0%'
            }}
          >
            {selectedCharacter === 'eren' && (
              <div className="absolute bottom-2 sm:bottom-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-stone-950 font-black text-[11px] sm:text-xs px-3 sm:px-4 py-1 rounded-xl shadow-lg flex items-center gap-1.5 border border-amber-200 pointer-events-none whitespace-nowrap">
                <CheckCircle2 className="w-3.5 h-3.5 text-stone-950 shrink-0" />
                <span>Eren Seçildi</span>
              </div>
            )}
          </button>

          {/* HOTZONE 2: AYBÜKE (Right Side - Proportional coordinates: left: 59.0%, top: 21.0%, width: 37.5%, height: 68.0%) */}
          <button
            type="button"
            id="select-character-aybuke"
            onClick={() => handleCharacterPick('aybuke')}
            aria-label="Aybüke Karakterini Seç"
            className={`absolute cursor-pointer rounded-3xl transition-transform duration-150 focus:outline-none ${
              selectedCharacter === 'aybuke'
                ? 'ring-4 ring-amber-400 bg-amber-500/20'
                : 'hover:ring-2 hover:ring-amber-300/60 hover:bg-amber-400/10'
            }`}
            style={{
              left: '59.0%',
              top: '21.0%',
              width: '37.5%',
              height: '68.0%'
            }}
          >
            {selectedCharacter === 'aybuke' && (
              <div className="absolute bottom-2 sm:bottom-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-stone-950 font-black text-[11px] sm:text-xs px-3 sm:px-4 py-1 rounded-xl shadow-lg flex items-center gap-1.5 border border-amber-200 pointer-events-none whitespace-nowrap">
                <CheckCircle2 className="w-3.5 h-3.5 text-stone-950 shrink-0" />
                <span>Aybüke Seçildi</span>
              </div>
            )}
          </button>

          {/* HOTZONE 3: BAŞLA (Center bottom - Proportional coordinates: left: 37.6%, top: 77.3%, width: 21.9%, height: 7.9%) */}
          <button
            type="button"
            id="btn-start-journey"
            onClick={handleStart}
            aria-label="Oyuna Başla"
            className="absolute rounded-full cursor-pointer transition-transform duration-150 active:scale-95 focus:outline-none hover:ring-2 hover:ring-emerald-300 hover:bg-emerald-400/15"
            style={{
              left: '37.6%',
              top: '77.3%',
              width: '21.9%',
              height: '7.9%'
            }}
            title={
              selectedCharacter
                ? `${selectedCharacter === 'eren' ? 'Eren' : 'Aybüke'} ile 571–632 Kapı Seçim Ekranını Aç`
                : 'Önce karakterini seçmelisin'
            }
          />

          {/* Active Selection Floating Notification */}
          {selectionNotice && !warningMessage && (
            <div className="absolute top-[60.5%] left-1/2 -translate-x-1/2 pointer-events-none z-20">
              <span className="inline-block text-[9px] sm:text-xs text-amber-950 font-black bg-amber-300/95 px-2.5 sm:px-3 py-0.5 rounded-full shadow-md border border-amber-500/50 whitespace-nowrap max-w-[85vw] truncate">
                {selectionNotice} • Başla butonuna basabilirsin
              </span>
            </div>
          )}

          {/* Warning Message Toast */}
          {warningMessage && (
            <div className="absolute top-[60.5%] left-1/2 -translate-x-1/2 z-30 pointer-events-none">
              <div className="bg-rose-950/95 border-2 border-rose-500 text-rose-100 font-black text-xs sm:text-sm px-4 sm:px-6 py-2 rounded-2xl shadow-2xl flex items-center gap-2 whitespace-nowrap">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{warningMessage}</span>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Quick Selection Assist Bar (Visible on small portrait phones for effortless touch access) */}
        <div className="sm:hidden flex items-center justify-center gap-2 w-full px-3">
          <button
            type="button"
            onClick={() => handleCharacterPick('eren')}
            className={`flex-1 py-2 px-3 rounded-xl font-black text-xs border flex items-center justify-center gap-1.5 ${
              selectedCharacter === 'eren'
                ? 'bg-amber-500 text-stone-950 border-amber-200'
                : 'bg-stone-900 text-amber-200 border-amber-600/40'
            }`}
          >
            <img src="/assets/images/eren_3d_clean.webp" alt="Eren" className="w-5 h-5 object-contain" />
            <span>Eren</span>
          </button>

          <button
            type="button"
            onClick={() => handleCharacterPick('aybuke')}
            className={`flex-1 py-2 px-3 rounded-xl font-black text-xs border flex items-center justify-center gap-1.5 ${
              selectedCharacter === 'aybuke'
                ? 'bg-amber-500 text-stone-950 border-amber-200'
                : 'bg-stone-900 text-amber-200 border-amber-600/40'
            }`}
          >
            <img src="/assets/images/aybuke_3d_clean.webp" alt="Aybüke" className="w-5 h-5 object-contain" />
            <span>Aybüke</span>
          </button>

          <button
            type="button"
            onClick={handleStart}
            className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs border border-emerald-300 flex items-center justify-center gap-1"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Başla</span>
          </button>
        </div>
      </main>

      {/* 3. FOOTER CREDITS */}
      <footer className="relative z-30 w-full text-center py-1 sm:py-2 pb-12 sm:pb-2 bg-stone-950/80 border-t border-amber-900/40 text-[10px] sm:text-[11px] text-stone-300 shrink-0 pointer-events-none">
        <span className="hidden sm:inline">
          TÜBİTAK 2204-B Ortaokul Öğrencileri Araştırma Projeleri • Dijital Siyer ve Değerler Eğitimi Yolculuğu (571–632)
        </span>
        <span className="sm:hidden block">TÜBİTAK 2204-B • Siyer ve Değerler Eğitimi (571–632)</span>
      </footer>
    </div>
  );
};
