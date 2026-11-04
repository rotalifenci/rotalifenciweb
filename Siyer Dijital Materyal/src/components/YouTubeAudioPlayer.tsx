import React, { useEffect, useRef, useState } from 'react';
import { Music, Volume2, VolumeX, Play, Pause, ChevronUp, ChevronDown } from 'lucide-react';

interface YouTubeAudioPlayerProps {
  videoId?: string;
  isMuted: boolean;
  onToggleMute: () => void;
  screen?: string;
}

export const YouTubeAudioPlayer: React.FC<YouTubeAudioPlayerProps> = ({
  videoId = 'c9pS7Lby3PA',
  isMuted,
  onToggleMute,
  screen = 'menu'
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [hasUserInteracted, setHasUserInteracted] = useState<boolean>(false);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);

  // Send postMessage to YouTube IFrame API
  const sendCommand = (func: string, args: any[] = []) => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: 'command', func, args }),
        '*'
      );
    }
  };

  // Sync mute state & gentle background ambient volume (lowered to 14 for soft background)
  useEffect(() => {
    if (isMuted) {
      sendCommand('mute');
    } else {
      sendCommand('unMute');
      sendCommand('setVolume', [14]); // Quiet, soft, gentle ambient volume for Çağrı ezgisi
    }
  }, [isMuted]);

  // Autoplay unlocking on first user interaction anywhere on the window
  useEffect(() => {
    const handleFirstGesture = () => {
      if (!hasUserInteracted) {
        setHasUserInteracted(true);
        sendCommand('playVideo');
        if (!isMuted) {
          sendCommand('unMute');
          sendCommand('setVolume', [14]); // Quiet, soft ambient volume
        }
      }
    };

    window.addEventListener('pointerdown', handleFirstGesture, { once: true });
    window.addEventListener('keydown', handleFirstGesture, { once: true });
    window.addEventListener('click', handleFirstGesture, { once: true });

    return () => {
      window.removeEventListener('pointerdown', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
      window.removeEventListener('click', handleFirstGesture);
    };
  }, [hasUserInteracted, isMuted]);

  const togglePlayback = () => {
    if (isPlaying) {
      sendCommand('pauseVideo');
      setIsPlaying(false);
    } else {
      sendCommand('playVideo');
      sendCommand('unMute');
      setIsPlaying(true);
    }
  };

  const originUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const embedUrl = `https://www.youtube.com/embed/${videoId}?enablejsapi=1&autoplay=1&loop=1&playlist=${videoId}&controls=0&playsinline=1&rel=0&origin=${encodeURIComponent(originUrl)}`;

  const isGameMode = screen !== 'menu';

  return (
    <>
      {/* Hidden YouTube Iframe Player running in background */}
      <iframe
        ref={iframeRef}
        src={embedUrl}
        title="Çağrı (The Message) Siyer Ezgisi"
        className="w-1 h-1 opacity-0 pointer-events-none absolute"
        allow="autoplay; encrypted-media"
      />

      <div
        className={`fixed z-40 items-center gap-2 pointer-events-auto transition-all duration-300 ${
          isGameMode
            ? 'hidden sm:flex bottom-4 right-5'
            : 'flex bottom-2.5 sm:bottom-4 left-1/2 -translate-x-1/2'
        }`}
      >
        {isGameMode ? (
          /* Sleek, Non-Intrusive In-Game Music Widget (Never blocks touch controls or action buttons) */
          <div className="bg-stone-900/90 border border-amber-600/50 backdrop-blur-md rounded-2xl px-2.5 py-1.5 shadow-2xl flex items-center gap-2 text-xs text-amber-200">
            <button
              type="button"
              onClick={togglePlayback}
              className="p-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 transition"
              title={isPlaying ? 'Müziği Duraklat' : 'Müziği Oynat'}
            >
              {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            </button>

            <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-semibold">
              <Music className="w-3 h-3 text-amber-400 animate-pulse" />
              <span className="truncate max-w-[120px]">Çağrı Ezgisi</span>
            </div>

            <button
              type="button"
              onClick={onToggleMute}
              className="p-1 rounded-lg hover:bg-stone-800 text-stone-300 transition"
              title={isMuted ? 'Sesi Aç' : 'Sesi Kapat'}
            >
              {isMuted ? (
                <VolumeX className="w-3 h-3 text-rose-400" />
              ) : (
                <Volume2 className="w-3 h-3 text-emerald-400" />
              )}
            </button>
          </div>
        ) : (
          /* Main Menu Music Indicator Pill */
          <div className="bg-stone-900/90 border border-amber-600/50 backdrop-blur-md rounded-2xl px-3 py-1.5 shadow-xl flex items-center gap-2.5 text-xs text-amber-200">
            <button
              type="button"
              onClick={togglePlayback}
              className="p-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 transition"
              title={isPlaying ? 'Müziği Duraklat' : 'Müziği Oynat'}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>

            <div className="flex items-center gap-1.5 font-semibold text-[11px] sm:text-xs">
              <Music className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>Çağrı (The Message) Ezgisi</span>
            </div>

            <button
              type="button"
              onClick={onToggleMute}
              className="p-1 rounded-lg hover:bg-stone-800 text-stone-300 transition"
              title={isMuted ? 'Sesi Aç' : 'Sesi Kapat'}
            >
              {isMuted ? (
                <VolumeX className="w-3.5 h-3.5 text-rose-400" />
              ) : (
                <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
              )}
            </button>
          </div>
        )}
      </div>
    </>
  );
};
