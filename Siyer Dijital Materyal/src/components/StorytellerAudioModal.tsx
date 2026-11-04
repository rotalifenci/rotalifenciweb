import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  X,
  Sparkles,
  AlertCircle,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { EventStationData, YearData } from '../types';
import { getMediaObjectUrl, getMediaMetadata } from '../utils/mediaStore';

interface StorytellerAudioModalProps {
  yearData: YearData;
  station: EventStationData;
  onClose: () => void;
  onProceedToGuideActivity: () => void;
  onOpenTeacherPanelForAudio?: () => void;
}

// Global reference to stop any previously playing storyteller audio if a new one starts
let activeGlobalStorytellerAudio: HTMLAudioElement | null = null;

export function stopActiveStorytellerAudio() {
  if (activeGlobalStorytellerAudio) {
    try {
      activeGlobalStorytellerAudio.pause();
      activeGlobalStorytellerAudio.currentTime = 0;
    } catch {
      // ignore
    }
    activeGlobalStorytellerAudio = null;
  }
}

export const StorytellerAudioModal: React.FC<StorytellerAudioModalProps> = ({
  yearData,
  station,
  onClose,
  onProceedToGuideActivity,
  onOpenTeacherPanelForAudio
}) => {
  const [resolvedAudioUrl, setResolvedAudioUrl] = useState<string | null>(null);
  const [audioFileName, setAudioFileName] = useState<string | null>(null);
  const [isLoadingMedia, setIsLoadingMedia] = useState<boolean>(true);
  const [hasStartedListening, setHasStartedListening] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(0.85);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [audioError, setAudioError] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Resolve audio file from IndexedDB or direct URL
  useEffect(() => {
    let mounted = true;
    setIsLoadingMedia(true);
    setAudioError(null);
    setHasStartedListening(false);
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentTime(0);
    setDuration(0);

    async function loadAudioSource() {
      // 1. Check IndexedDB media store first
      if (station.storytellerAudioId) {
        const blobUrl = await getMediaObjectUrl(station.storytellerAudioId);
        const meta = await getMediaMetadata(station.storytellerAudioId);
        if (mounted && blobUrl) {
          setResolvedAudioUrl(blobUrl);
          setAudioFileName(meta?.fileName || station.storytellerAudioTitle || 'Sesli Anlatım');
          setIsLoadingMedia(false);
          return;
        }
      }
      // 2. Fallback to direct URL if configured by teacher
      if (station.storytellerAudioUrl && station.storytellerAudioUrl.trim() !== '') {
        if (mounted) {
          setResolvedAudioUrl(station.storytellerAudioUrl.trim());
          setAudioFileName(station.storytellerAudioTitle || 'Sesli Anlatım');
          setIsLoadingMedia(false);
          return;
        }
      }
      if (mounted) {
        setResolvedAudioUrl(null);
        setAudioFileName(null);
        setIsLoadingMedia(false);
      }
    }

    loadAudioSource();

    return () => {
      mounted = false;
      stopActiveStorytellerAudio();
    };
  }, [station.id, station.storytellerAudioId, station.storytellerAudioUrl, station.storytellerAudioTitle]);

  const handlePlayFromStartOrResume = () => {
    const audio = audioRef.current;
    if (!audio || !resolvedAudioUrl) return;

    if (activeGlobalStorytellerAudio && activeGlobalStorytellerAudio !== audio) {
      stopActiveStorytellerAudio();
    }
    activeGlobalStorytellerAudio = audio;

    audio.volume = isMuted ? 0 : volume;
    audio
      .play()
      .then(() => {
        setHasStartedListening(true);
        setIsPlaying(true);
        setIsPaused(false);
        setAudioError(null);
      })
      .catch(() => {
        setAudioError('Ses dosyası oynatılamadı. Lütfen dosya formatını (MP3, WAV, M4A) kontrol edin.');
      });
  };

  const handlePause = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    setIsPlaying(false);
    setIsPaused(true);
  };

  const handleResume = () => {
    handlePlayFromStartOrResume();
  };

  const handleRestart = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = 0;
    setCurrentTime(0);
    handlePlayFromStartOrResume();
  };

  const handleVolumeChange = (newVol: number) => {
    const clamped = Math.max(0, Math.min(1, newVol));
    setVolume(clamped);
    if (clamped > 0 && isMuted) {
      setIsMuted(false);
    }
    if (audioRef.current) {
      audioRef.current.volume = clamped;
    }
  };

  const handleToggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    if (audioRef.current) {
      audioRef.current.volume = nextMute ? 0 : volume;
    }
  };

  const formatTime = (sec: number) => {
    if (!Number.isFinite(sec) || sec < 0) return '00:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div
      id="storyteller-audio-modal"
      className="fixed inset-0 z-50 bg-stone-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
    >
      <div className="relative w-full max-w-2xl rounded-3xl bg-gradient-to-b from-stone-900 via-[#1f160d] to-stone-950 border-2 border-amber-500/60 shadow-[0_0_70px_rgba(245,158,11,0.3)] overflow-hidden my-auto">
        {/* Top Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-amber-950/90 via-stone-900 to-amber-950/90 border-b border-amber-500/30 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* Wise White-Bearded Storyteller Avatar */}
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-b from-amber-400 to-amber-700 p-0.5 shadow-lg shrink-0">
              <div className="w-full h-full rounded-[14px] bg-stone-900 flex items-center justify-center">
                <svg viewBox="0 0 64 64" className="w-10 h-10">
                  {/* Traditional Scholar Turban */}
                  <ellipse cx="32" cy="18" rx="18" ry="9" fill="#fef3c7" stroke="#d97706" strokeWidth="2" />
                  <path d="M16 18 Q32 24 48 18" stroke="#f59e0b" strokeWidth="2" fill="none" />
                  {/* Kindly Elder Face */}
                  <circle cx="32" cy="30" r="11" fill="#fde68a" />
                  {/* White Eyebrows & Wise Eyes */}
                  <path d="M25 26 Q28 24 30 26" stroke="#ffffff" strokeWidth="2" fill="none" strokeLinecap="round" />
                  <path d="M34 26 Q36 24 39 26" stroke="#ffffff" strokeWidth="2" fill="none" strokeLinecap="round" />
                  <circle cx="28" cy="29" r="1.6" fill="#292524" />
                  <circle cx="36" cy="29" r="1.6" fill="#292524" />
                  {/* Long Flowing White Beard (Ak Sakal) */}
                  <path
                    d="M20 31 Q20 52 32 56 Q44 52 44 31 Q38 36 32 36 Q26 36 20 31 Z"
                    fill="#f8fafc"
                    stroke="#cbd5e1"
                    strokeWidth="1.5"
                  />
                  {/* Warm Smile */}
                  <path d="M28 35 Q32 38 36 35" stroke="#92400e" strokeWidth="1.6" fill="none" strokeLinecap="round" />
                </svg>
              </div>
            </div>
            <div>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-amber-300 bg-amber-500/20 px-2.5 py-0.5 rounded-full border border-amber-400/40">
                <Volume2 className="w-3.5 h-3.5 text-amber-300" />
                {station.storytellerName || 'Ak Sakallı Yaşlı Tarih Anlatıcısı'} • {station.id}. Olay Durağı
              </span>
              <h3 className="text-base sm:text-lg font-black text-amber-100 mt-0.5">
                {station.animationScene.title}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              stopActiveStorytellerAudio();
              onClose();
            }}
            className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-600 transition"
            aria-label="Kapat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 sm:p-6 space-y-5">
          {/* Prompt Box */}
          <div className="rounded-2xl bg-amber-950/35 border border-amber-500/40 p-4 flex items-start gap-3.5">
            <Sparkles className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-base sm:text-lg font-black text-amber-200">
                "Bu olayın tamamını dinlemek ister misin?"
              </p>
              <p className="text-xs sm:text-sm text-stone-300 mt-1 leading-relaxed">
                {yearData.year} yılı ({yearData.location}) — {station.animationScene.title} hadisesini Ak Sakallı Tarih Anlatıcısından dinleyebilirsin.
              </p>
            </div>
          </div>

          {/* Audio Player or Honest Empty State */}
          {isLoadingMedia ? (
            <div className="rounded-2xl bg-stone-900/90 border border-stone-700 p-6 text-center text-stone-300 text-sm font-bold">
              Ses dosyası kontrol ediliyor...
            </div>
          ) : resolvedAudioUrl ? (
            <div className="rounded-2xl bg-stone-900/95 border-2 border-amber-500/40 p-4 sm:p-5 space-y-4 shadow-inner">
              <audio
                ref={audioRef}
                src={resolvedAudioUrl}
                preload="metadata"
                onTimeUpdate={() => {
                  if (audioRef.current) {
                    setCurrentTime(audioRef.current.currentTime);
                  }
                }}
                onLoadedMetadata={() => {
                  if (audioRef.current) {
                    setDuration(audioRef.current.duration || 0);
                  }
                }}
                onEnded={() => {
                  setIsPlaying(false);
                  setIsPaused(false);
                }}
                onError={() => {
                  setAudioError('Ses dosyası yüklenirken bir hata oluştu.');
                  setIsPlaying(false);
                }}
              />

              <div className="flex items-center justify-between gap-2 border-b border-stone-800 pb-3">
                <div>
                  <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
                    Yüklü Ses Kaydı
                  </span>
                  <span className="text-sm font-black text-white">
                    {station.storytellerAudioTitle || audioFileName || `${yearData.year} Yılı Olay Anlatımı`}
                  </span>
                </div>
                <span className="text-xs font-mono font-bold text-amber-300 bg-stone-950 px-3 py-1 rounded-lg border border-amber-500/30">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <input
                  type="range"
                  min={0}
                  max={duration > 0 ? duration : 100}
                  step={0.1}
                  value={currentTime}
                  onChange={e => {
                    const t = parseFloat(e.target.value);
                    setCurrentTime(t);
                    if (audioRef.current) {
                      audioRef.current.currentTime = t;
                    }
                  }}
                  className="w-full accent-amber-400 cursor-pointer h-2 rounded-lg bg-stone-800"
                  aria-label="Ses İlerleme Çubuğu"
                />
              </div>

              {/* Primary Audio Control Buttons */}
              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                {!hasStartedListening && !isPlaying && (
                  <button
                    type="button"
                    id="btn-storyteller-play"
                    onClick={handlePlayFromStartOrResume}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg transition active:scale-95"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>Olayı Dinle (Oynat)</span>
                  </button>
                )}

                {isPlaying && (
                  <button
                    type="button"
                    id="btn-storyteller-pause"
                    onClick={handlePause}
                    className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg transition active:scale-95"
                  >
                    <Pause className="w-4 h-4 fill-current" />
                    <span>Duraklat</span>
                  </button>
                )}

                {isPaused && !isPlaying && (
                  <button
                    type="button"
                    id="btn-storyteller-resume"
                    onClick={handleResume}
                    className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg transition active:scale-95"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>Kaldığı Yerden Devam Et</span>
                  </button>
                )}

                <button
                  type="button"
                  id="btn-storyteller-restart"
                  onClick={handleRestart}
                  className="px-3.5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-200 font-bold text-xs sm:text-sm border border-amber-500/40 flex items-center gap-1.5 transition active:scale-95"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Baştan Dinle</span>
                </button>

                {/* Volume Control */}
                <div className="ml-auto flex items-center gap-2 bg-stone-950/90 px-3 py-1.5 rounded-xl border border-stone-700">
                  <button
                    type="button"
                    onClick={handleToggleMute}
                    className="text-amber-300 hover:text-amber-200 transition"
                    title={isMuted ? 'Sesi Aç' : 'Sesi Kıs'}
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX className="w-4 h-4 text-rose-400" />
                    ) : (
                      <Volume2 className="w-4 h-4 text-amber-400" />
                    )}
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={isMuted ? 0 : volume}
                    onChange={e => handleVolumeChange(parseFloat(e.target.value))}
                    className="w-20 sm:w-24 accent-amber-400 cursor-pointer"
                    aria-label="Ses Seviyesi Ayarı"
                  />
                  <span className="text-[11px] font-bold text-stone-300 w-8 text-right">
                    {Math.round((isMuted ? 0 : volume) * 100)}%
                  </span>
                </div>
              </div>

              {audioError && (
                <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{audioError}</span>
                </div>
              )}
            </div>
          ) : (
            /* Honest Empty State when teacher has not uploaded an audio file yet */
            <div
              id="storyteller-empty-audio-notice"
              className="rounded-2xl bg-stone-900/95 border-2 border-amber-500/35 p-5 space-y-3"
            >
              <div className="flex items-center gap-3 text-amber-300">
                <AlertCircle className="w-6 h-6 text-amber-400 shrink-0" />
                <div>
                  <h4 className="text-sm sm:text-base font-black text-amber-200">
                    Sesli anlatım henüz eklenmedi.
                  </h4>
                  <p className="text-xs text-stone-300 mt-0.5">
                    Bu olay durağı için öğretmen yönetim panelinden MP3, WAV veya M4A formatında sesli anlatım dosyası yüklenebilir.
                  </p>
                </div>
              </div>

              {onOpenTeacherPanelForAudio && (
                <button
                  type="button"
                  onClick={() => {
                    stopActiveStorytellerAudio();
                    onOpenTeacherPanelForAudio();
                  }}
                  className="px-3.5 py-2 rounded-xl bg-purple-950/90 hover:bg-purple-900 text-purple-200 border border-purple-400/50 text-xs font-bold transition inline-flex items-center gap-1.5"
                >
                  <span>Öğretmen Panelinden Ses Dosyası Ekle</span>
                </button>
              )}
            </div>
          )}

          {/* Written Historical Narration Card (Always readable alongside audio) */}
          <div className="rounded-2xl bg-stone-900/70 border border-stone-700/80 p-4 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-black text-amber-300 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-amber-400" />
                Tarihsel Olay Özeti
              </span>
              <span className="text-[11px] text-stone-400 font-semibold">
                Kaynak: {station.animationScene.historicalSource}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-stone-200 leading-relaxed">
              {station.animationScene.narration}
            </p>
          </div>

          {/* Bottom Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-stone-800">
            <button
              type="button"
              onClick={() => {
                stopActiveStorytellerAudio();
                onClose();
              }}
              className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs sm:text-sm font-bold border border-stone-600 transition"
            >
              3B Mekâna Dön
            </button>

            <button
              type="button"
              id="btn-storyteller-to-guide"
              onClick={() => {
                stopActiveStorytellerAudio();
                onProceedToGuideActivity();
              }}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white text-xs sm:text-sm font-black border border-emerald-300 shadow-lg flex items-center gap-2 transition active:scale-95"
            >
              <span>Soru Rehber Karakteri ile Etkinliğe Başla</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
