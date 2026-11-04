import React, { useState } from 'react';
import {
  Sparkles,
  GraduationCap,
  BarChart3,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Play,
  Compass
} from 'lucide-react';
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
  const [activeChar, setActiveChar] = useState<CharacterType>(selectedCharacter || 'eren');

  const handleCharacterSelectOnly = (char: CharacterType) => {
    setActiveChar(char);
    onSelectCharacter(char);
    setWarningMessage(null);
    audioSystem.playButtonClick();
  };

  const handleCharacterPickAndStart = (char: CharacterType) => {
    setActiveChar(char);
    onSelectCharacter(char);
    setWarningMessage(null);
    audioSystem.playButtonClick();
    if (!isAudioStarted) {
      audioSystem.startAmbientMusic();
      setIsAudioStarted(true);
    }
    onStartGame();
  };

  const handleStart = () => {
    const chosen = selectedCharacter || activeChar || 'eren';
    onSelectCharacter(chosen);
    audioSystem.playButtonClick();
    if (!isAudioStarted) {
      audioSystem.startAmbientMusic();
      setIsAudioStarted(true);
    }
    onStartGame();
  };

  return (
    <div className="relative w-screen h-dvh min-h-screen overflow-hidden select-none bg-[#23150b]">
      {/* 1. FULL-BLEED ATMOSPHERIC BACKGROUND (Eliminates black bars on all widescreen, 4K, and portrait displays) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src="/assets/images/menu_hero.webp"
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover scale-110 blur-xl opacity-85 brightness-90 saturate-125"
        />
        {/* Warm Hijazi stone & golden sunlight vignette that seamlessly blends the center artwork with screen edges */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 50% 48%, rgba(251,191,36,0.06) 0%, rgba(45,24,10,0.45) 68%, rgba(28,15,6,0.78) 100%)'
          }}
        />
        {/* Decorative Islamic geometric arch side borders on wide screens */}
        <div className="hidden xl:flex absolute inset-y-0 left-0 w-36 flex-col justify-between p-4 border-r border-amber-500/20 bg-gradient-to-r from-amber-950/60 to-transparent">
          <div className="w-full h-full rounded-2xl border border-amber-400/20 flex flex-col items-center justify-center gap-6 text-amber-300/40">
            <Compass className="w-10 h-10" />
            <div className="h-32 w-px bg-gradient-to-b from-transparent via-amber-400/40 to-transparent" />
            <span className="text-[11px] font-black tracking-[0.25em] uppercase [writing-mode:vertical-rl] rotate-180">
              571 • FİL YILI VE DOĞUM
            </span>
            <div className="h-32 w-px bg-gradient-to-b from-transparent via-amber-400/40 to-transparent" />
          </div>
        </div>
        <div className="hidden xl:flex absolute inset-y-0 right-0 w-36 flex-col justify-between p-4 border-l border-amber-500/20 bg-gradient-to-l from-amber-950/60 to-transparent">
          <div className="w-full h-full rounded-2xl border border-amber-400/20 flex flex-col items-center justify-center gap-6 text-amber-300/40">
            <Compass className="w-10 h-10" />
            <div className="h-32 w-px bg-gradient-to-b from-transparent via-amber-400/40 to-transparent" />
            <span className="text-[11px] font-black tracking-[0.25em] uppercase [writing-mode:vertical-rl]">
              632 • VEDA HUTBESİ
            </span>
            <div className="h-32 w-px bg-gradient-to-b from-transparent via-amber-400/40 to-transparent" />
          </div>
        </div>
      </div>

      {/* 2. FLOATING TOP NAVIGATION BAR (Overlays cleanly without shrinking the full-screen stage) */}
      <header className="absolute top-0 inset-x-0 z-30 px-3 sm:px-6 py-2.5 flex items-center justify-between gap-2 pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-2 bg-stone-950/80 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-amber-500/40 text-xs font-bold text-amber-200 shadow-xl">
          <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="hidden md:inline">
            TÜBİTAK 2204-B Ortaokul Siyer ve Değerler Eğitimi Projesi (571–632)
          </span>
          <span className="md:hidden">TÜBİTAK 2204-B Siyer Projesi</span>
        </div>

        <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={onOpenPreTest}
            className="px-3 py-1.5 rounded-xl bg-amber-950/90 hover:bg-amber-900 border border-amber-500/50 text-amber-200 text-xs font-bold transition flex items-center gap-1.5 shadow-lg active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Ön Teste Katıl</span>
          </button>

          <button
            type="button"
            onClick={onOpenResearchPanel}
            className="px-2.5 py-1.5 rounded-xl bg-stone-950/85 hover:bg-stone-800 border border-sky-500/50 text-sky-300 text-xs font-bold transition flex items-center gap-1.5 shadow-lg"
            title="TÜBİTAK Araştırma Bulguları Paneli"
          >
            <BarChart3 className="w-4 h-4" />
            <span className="hidden lg:inline">Araştırma</span>
          </button>

          <button
            type="button"
            onClick={onOpenTeacherPanel}
            id="btn-open-teacher-panel"
            className="px-3 py-1.5 rounded-xl bg-purple-950/90 hover:bg-purple-900 border border-purple-400/60 text-purple-200 text-xs font-bold transition flex items-center gap-1.5 shadow-lg active:scale-95"
            title="Öğretmen Yönetim Paneli"
          >
            <GraduationCap className="w-4 h-4 text-purple-300" />
            <span className="hidden sm:inline">Öğretmen Paneli</span>
          </button>
        </div>
      </header>

      {/* 3. FULL-SCREEN HERO STAGE (100vw x 100dvh, natural aspect ratio preserved without stretching or clipping) */}
      <main className="relative z-10 w-screen h-dvh flex flex-col items-center justify-center overflow-hidden">
        <div
          className="relative flex items-center justify-center overflow-hidden shadow-[0_0_90px_rgba(0,0,0,0.85)]"
          style={{
            aspectRatio: '1024 / 683',
            width: 'min(100vw, calc(100dvh * 1024 / 683))',
            height: 'min(100dvh, calc(100vw * 683 / 1024))'
          }}
        >
          {/* Reference Hero Artwork (Never stretched, never cropped) */}
          <img
            src="/assets/images/menu_hero.webp"
            alt="Dijital Siyer Yolculuğu 571 - 632 Karakter Seçimi"
            className="w-full h-full object-contain pointer-events-none select-none"
          />

          {/* HOTZONE 1: EREN (Left Side) */}
          <button
            type="button"
            id="select-character-eren"
            onClick={() => handleCharacterPickAndStart('eren')}
            onMouseEnter={() => setActiveChar('eren')}
            aria-label="Eren Karakterini Seç"
            className={`absolute cursor-pointer rounded-3xl transition-all duration-200 focus:outline-none ${
              activeChar === 'eren'
                ? 'ring-4 ring-amber-400/90 bg-amber-400/10 shadow-[0_0_30px_rgba(251,191,36,0.35)]'
                : 'hover:ring-2 hover:ring-amber-300/70 hover:bg-amber-400/10'
            }`}
            style={{
              left: '3.5%',
              top: '21.0%',
              width: '33.0%',
              height: '68.0%'
            }}
          >
            {activeChar === 'eren' && (
              <div className="absolute bottom-2 sm:bottom-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-stone-950 font-black text-[11px] sm:text-xs md:text-sm px-3.5 py-1 rounded-xl shadow-xl flex items-center gap-1.5 border border-amber-100 pointer-events-none whitespace-nowrap">
                <CheckCircle2 className="w-4 h-4 text-stone-950 shrink-0" />
                <span>Eren Seçildi</span>
              </div>
            )}
          </button>

          {/* HOTZONE 2: AYBÜKE (Right Side) */}
          <button
            type="button"
            id="select-character-aybuke"
            onClick={() => handleCharacterPickAndStart('aybuke')}
            onMouseEnter={() => setActiveChar('aybuke')}
            aria-label="Aybüke Karakterini Seç"
            className={`absolute cursor-pointer rounded-3xl transition-all duration-200 focus:outline-none ${
              activeChar === 'aybuke'
                ? 'ring-4 ring-amber-400/90 bg-amber-400/10 shadow-[0_0_30px_rgba(251,191,36,0.35)]'
                : 'hover:ring-2 hover:ring-amber-300/70 hover:bg-amber-400/10'
            }`}
            style={{
              left: '59.0%',
              top: '21.0%',
              width: '37.5%',
              height: '68.0%'
            }}
          >
            {activeChar === 'aybuke' && (
              <div className="absolute bottom-2 sm:bottom-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-stone-950 font-black text-[11px] sm:text-xs md:text-sm px-3.5 py-1 rounded-xl shadow-xl flex items-center gap-1.5 border border-amber-100 pointer-events-none whitespace-nowrap">
                <CheckCircle2 className="w-4 h-4 text-stone-950 shrink-0" />
                <span>Aybüke Seçildi</span>
              </div>
            )}
          </button>

          {/* HOTZONE 3: PROMINENT HIGH-RESOLUTION BAŞLA BUTTON */}
          <button
            type="button"
            id="btn-start-journey"
            onClick={handleStart}
            aria-label="Oyuna Başla"
            className="absolute rounded-full cursor-pointer transition-all duration-200 active:scale-95 focus:outline-none ring-2 ring-emerald-300/70 hover:ring-4 hover:ring-emerald-200 hover:scale-105 shadow-[0_0_35px_rgba(16,185,129,0.55)] flex items-center justify-center group"
            style={{
              left: '36.8%',
              top: '76.5%',
              width: '23.5%',
              height: '9.2%'
            }}
            title={`${activeChar === 'eren' ? 'Eren' : 'Aybüke'} ile 571–632 Kapılar Ekranını Aç`}
          >
            <span className="sr-only">Başla</span>
          </button>

          {/* Active Character Status Badge */}
          <div className="absolute top-[60.5%] left-1/2 -translate-x-1/2 pointer-events-none z-20">
            <span className="inline-block text-[10px] sm:text-xs md:text-sm text-amber-950 font-black bg-amber-300/95 px-3 sm:px-4 py-0.5 sm:py-1 rounded-full shadow-lg border border-amber-500/60 whitespace-nowrap">
              {activeChar === 'eren' ? 'Eren' : 'Aybüke'} seçildi • Başla butonuna veya karaktere tıkla!
            </span>
          </div>

          {warningMessage && (
            <div className="absolute top-[60.5%] left-1/2 -translate-x-1/2 z-30 pointer-events-none">
              <div className="bg-rose-950/95 border-2 border-rose-500 text-rose-100 font-black text-xs sm:text-sm px-4 sm:px-6 py-2 rounded-2xl shadow-2xl flex items-center gap-2 whitespace-nowrap">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{warningMessage}</span>
              </div>
            </div>
          )}
        </div>

        {/* RESPONSIVE BOTTOM DOCK FOR SMALL SCREENS & SMARTBOARDS (Never clips, always accessible) */}
        <div className="sm:hidden w-full px-3 pt-2 pb-14 flex items-center justify-center gap-2 z-30">
          <button
            type="button"
            onClick={() => handleCharacterSelectOnly('eren')}
            className={`flex-1 py-2.5 px-3 rounded-xl font-black text-xs border flex items-center justify-center gap-1.5 shadow-lg ${
              activeChar === 'eren'
                ? 'bg-amber-400 text-stone-950 border-amber-100'
                : 'bg-stone-900/90 text-amber-200 border-amber-500/40'
            }`}
          >
            <img src="/assets/images/eren_3d_clean.webp" alt="Eren" className="w-5 h-5 object-contain" />
            <span>Eren</span>
          </button>

          <button
            type="button"
            onClick={() => handleCharacterSelectOnly('aybuke')}
            className={`flex-1 py-2.5 px-3 rounded-xl font-black text-xs border flex items-center justify-center gap-1.5 shadow-lg ${
              activeChar === 'aybuke'
                ? 'bg-amber-400 text-stone-950 border-amber-100'
                : 'bg-stone-900/90 text-amber-200 border-amber-500/40'
            }`}
          >
            <img src="/assets/images/aybuke_3d_clean.webp" alt="Aybüke" className="w-5 h-5 object-contain" />
            <span>Aybüke</span>
          </button>

          <button
            type="button"
            onClick={handleStart}
            className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-black text-xs border border-emerald-300 flex items-center justify-center gap-1.5 shadow-xl"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Başla</span>
          </button>
        </div>
      </main>
    </div>
  );
};
