import React, { useState } from 'react';
import { Volume2, VolumeX, Monitor, RotateCcw, X, CheckCircle2, Gauge, Maximize, Minimize, Compass } from 'lucide-react';
import { audioSystem } from '../utils/audioSynthesizer';
import {
  GraphicsQuality,
  getGraphicsQuality,
  setGraphicsQuality,
  GRAPHICS_PROFILES
} from '../utils/graphicsSettings';

interface SettingsModalProps {
  onResetProgress: () => void;
  onClose: () => void;
  isSmartboardMode?: boolean;
  onToggleSmartboardMode?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  onResetProgress,
  onClose,
  isSmartboardMode = false,
  onToggleSmartboardMode
}) => {
  const [musicVol, setMusicVol] = useState<number>(audioSystem.musicVolume);
  const [voiceVol, setVoiceVol] = useState<number>(audioSystem.voiceVolume);
  const [sfxVol, setSfxVol] = useState<number>(audioSystem.sfxVolume);
  const [isMuted, setIsMuted] = useState<boolean>(audioSystem.isMuted);
  const [graphicsQuality, setLocalGraphicsQuality] = useState<GraphicsQuality>(getGraphicsQuality());
  const [confirmReset, setConfirmReset] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(Boolean(document.fullscreenElement));

  const handleQualityChange = (q: GraphicsQuality) => {
    setGraphicsQuality(q);
    setLocalGraphicsQuality(q);
    audioSystem.playButtonClick();
  };

  const handleMusicChange = (val: number) => {
    setMusicVol(val);
    audioSystem.setVolumes(val, sfxVol, voiceVol);
  };

  const handleVoiceChange = (val: number) => {
    setVoiceVol(val);
    audioSystem.setVolumes(musicVol, sfxVol, val);
  };

  const handleSfxChange = (val: number) => {
    setSfxVol(val);
    audioSystem.setVolumes(musicVol, val, voiceVol);
  };

  const handleToggleMute = () => {
    const muted = audioSystem.toggleMute();
    setIsMuted(muted);
  };

  const handleToggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (e) {
      console.warn('Fullscreen request failed:', e);
    }
  };

  const handleDoReset = () => {
    onResetProgress();
    setConfirmReset(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/85 backdrop-blur-lg animate-fadeIn">
      <div className="relative w-full max-w-md bg-stone-900 border-2 border-stone-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-stone-950 via-stone-900 to-stone-950 border-b border-stone-800 shrink-0">
          <h3 className="text-base font-bold text-stone-100">
            Oyun, Kontrol ve Ses Ayarları
          </h3>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          
          {/* Akıllı Tahta & Ekran Modu */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Monitor className="w-4 h-4" />
              <span>Cihaz ve Ekran Modu</span>
            </span>

            <div className="grid grid-cols-2 gap-2.5">
              {/* Fullscreen Button */}
              <button
                type="button"
                onClick={handleToggleFullscreen}
                className="py-2.5 px-3 rounded-2xl bg-stone-950/80 hover:bg-stone-800 border border-stone-700 text-stone-200 text-xs font-bold transition flex items-center justify-center gap-2"
              >
                {isFullscreen ? <Minimize className="w-4 h-4 text-amber-400" /> : <Maximize className="w-4 h-4 text-amber-400" />}
                <span>{isFullscreen ? 'Tam Ekrandan Çık' : 'Tam Ekran Yap'}</span>
              </button>

              {/* Smartboard D-Pad Toggle */}
              {onToggleSmartboardMode && (
                <button
                  type="button"
                  onClick={onToggleSmartboardMode}
                  className={`py-2.5 px-3 rounded-2xl border text-xs font-bold transition flex items-center justify-center gap-2 ${
                    isSmartboardMode
                      ? 'bg-amber-500/20 border-amber-400 text-amber-200 shadow-md shadow-amber-500/20'
                      : 'bg-stone-950/80 border-stone-700 text-stone-300 hover:text-stone-100'
                  }`}
                >
                  <Compass className="w-4 h-4 text-amber-400" />
                  <span>{isSmartboardMode ? 'Tahta D-Pad (Aktif)' : 'Akıllı Tahta D-Pad'}</span>
                </button>
              )}
            </div>
            <p className="text-[11px] text-stone-400">
              {isSmartboardMode
                ? 'Akıllı Tahta modu devrede: Dokunmatik ekranlar için büyük yön butonları (Yukarı, Aşağı, Sol, Sağ) kullanılır.'
                : 'Standart analog joystick modu devrede.'}
            </p>
          </div>

          {/* Audio Volume Controls */}
          <div className="pt-4 border-t border-stone-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Ses Ayarları
              </span>
              <button
                type="button"
                onClick={handleToggleMute}
                className="text-xs font-bold text-stone-300 hover:text-white flex items-center gap-1.5"
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                <span>{isMuted ? 'Sesi Aç' : 'Tümünü Sustur'}</span>
              </button>
            </div>

            {/* Music Slider */}
            <div>
              <div className="flex justify-between text-xs text-stone-300 mb-1">
                <span>Arka Plan Müziği (Çağrı Ezgisi / Tasavvufi Melodi)</span>
                <span>{Math.round(musicVol * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={musicVol}
                onChange={(e) => handleMusicChange(parseFloat(e.target.value))}
                className="w-full accent-amber-500 bg-stone-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Voiceover Slider */}
            <div>
              <div className="flex justify-between text-xs text-stone-300 mb-1">
                <span>Dış Ses / Anlatım Ses Seviyesi</span>
                <span>{Math.round(voiceVol * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={voiceVol}
                onChange={(e) => handleVoiceChange(parseFloat(e.target.value))}
                className="w-full accent-amber-500 bg-stone-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* SFX Slider */}
            <div>
              <div className="flex justify-between text-xs text-stone-300 mb-1">
                <span>Efekt Sesleri (Adım, Başarı, Kapı)</span>
                <span>{Math.round(sfxVol * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={sfxVol}
                onChange={(e) => handleSfxChange(parseFloat(e.target.value))}
                className="w-full accent-amber-500 bg-stone-800 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* 3D Graphics Quality Settings (Düşük / Orta / Yüksek) */}
          <div className="pt-4 border-t border-stone-800 space-y-3">
            <div className="flex items-center gap-2">
              <Gauge className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                3D Grafik ve Performans Kalitesi
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {(['low', 'medium', 'high'] as GraphicsQuality[]).map((q) => {
                const prof = GRAPHICS_PROFILES[q];
                const isActive = graphicsQuality === q;
                return (
                  <button
                    key={q}
                    type="button"
                    onClick={() => handleQualityChange(q)}
                    className={`py-2 px-2.5 rounded-2xl border text-xs font-bold transition flex flex-col items-center justify-center gap-1 ${
                      isActive
                        ? 'bg-amber-500/20 border-amber-400 text-amber-200 shadow-lg shadow-amber-500/20'
                        : 'bg-stone-950/70 border-stone-800 text-stone-400 hover:text-stone-200 hover:border-stone-700'
                    }`}
                  >
                    <div className="flex items-center gap-1">
                      {isActive && <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />}
                      <span>{prof.name}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            <p className="text-[11px] text-stone-400 bg-stone-950/60 p-2.5 rounded-xl border border-stone-800/80">
              {GRAPHICS_PROFILES[graphicsQuality].description}
            </p>
          </div>

          {/* Reset Progress Section */}
          <div className="pt-4 border-t border-stone-800">
            {!confirmReset ? (
              <button
                type="button"
                onClick={() => setConfirmReset(true)}
                className="w-full py-2.5 rounded-xl bg-stone-950 hover:bg-rose-950/80 text-rose-400 hover:text-rose-300 text-xs font-bold transition border border-rose-900/50 flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Oyuncu İlerlemesini Sıfırla</span>
              </button>
            ) : (
              <div className="bg-rose-950/60 border border-rose-600/50 rounded-2xl p-4 text-center space-y-3">
                <p className="text-xs text-rose-200 font-semibold">
                  Tüm tamamlanan yıllar ve defter kayıtları silinecek. Emin misiniz?
                </p>
                <div className="flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => setConfirmReset(false)}
                    className="px-4 py-1.5 rounded-xl bg-stone-800 text-stone-300 text-xs font-bold"
                  >
                    Vazgeç
                  </button>
                  <button
                    type="button"
                    onClick={handleDoReset}
                    className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
                  >
                    Evet, Sıfırla
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
