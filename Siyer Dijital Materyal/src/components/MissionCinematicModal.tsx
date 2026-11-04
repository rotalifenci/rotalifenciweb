import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  X,
  FileQuestion,
  Info,
  Sparkles
} from 'lucide-react';
import { MissionData, YearData } from '../types';
import { audioSystem } from '../utils/audioSynthesizer';

interface MissionCinematicModalProps {
  mission: MissionData;
  yearData: YearData;
  onCompleteToQuestion: () => void;
  onClose: () => void;
}

export const MissionCinematicModal: React.FC<MissionCinematicModalProps> = ({
  mission,
  yearData,
  onCompleteToQuestion,
  onClose
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [activeSubtitle, setActiveSubtitle] = useState<string>('');
  const [isEnded, setIsEnded] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Play narration speech when opened
  useEffect(() => {
    if (!mission.animationVideoUrl) {
      audioSystem.speakTurkishText(mission.narrativeText, () => {
        setIsEnded(true);
      });
    }

    return () => {
      audioSystem.stopSpeaking();
    };
  }, [mission]);

  // Animated Fallback Canvas Diorama (Parallax desert, stars, sun, dunes, palms)
  useEffect(() => {
    if (mission.animationVideoUrl) return; // If real video exists, don't run canvas loop

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let time = 0;
    const duration = 16.0; // 16 second cinematic cycle

    const render = () => {
      time += 0.016;
      const progress = Math.min((time / duration) * 100, 100);
      setProgressPercent(progress);

      // Subtitle timing calculation
      const currentSub = mission.subtitles.find((s, idx) => {
        const nextSub = mission.subtitles[idx + 1];
        if (nextSub) {
          return time >= s.time && time < nextSub.time;
        }
        return time >= s.time;
      });
      if (currentSub) {
        setActiveSubtitle(currentSub.text);
      }

      if (progress >= 100 && !isEnded) {
        setIsEnded(true);
      }

      const w = canvas.width;
      const h = canvas.height;

      // Sky gradient (Dawn/Dusk Mecca golden atmospheric light)
      const skyGrad = ctx.createLinearGradient(0, 0, 0, h * 0.75);
      skyGrad.addColorStop(0, '#1c1510');
      skyGrad.addColorStop(0.35, '#5c3a21');
      skyGrad.addColorStop(0.7, '#ba7b42');
      skyGrad.addColorStop(1, '#e3b878');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, h);

      // Distant shining sun / celestial light glow
      const sunY = h * 0.35 + Math.sin(time * 0.5) * 5;
      const sunGrad = ctx.createRadialGradient(w * 0.7, sunY, 10, w * 0.7, sunY, 140);
      sunGrad.addColorStop(0, 'rgba(255, 240, 200, 0.9)');
      sunGrad.addColorStop(0.3, 'rgba(235, 175, 90, 0.4)');
      sunGrad.addColorStop(1, 'rgba(235, 175, 90, 0)');
      ctx.fillStyle = sunGrad;
      ctx.beginPath();
      ctx.arc(w * 0.7, sunY, 140, 0, Math.PI * 2);
      ctx.fill();

      // Distant Mountains layer (Mecca peaks)
      ctx.fillStyle = '#4a2e1d';
      ctx.beginPath();
      ctx.moveTo(0, h * 0.65);
      ctx.lineTo(w * 0.15, h * 0.42);
      ctx.lineTo(w * 0.3, h * 0.58);
      ctx.lineTo(w * 0.45, h * 0.38); // Jabal an-Nur profile
      ctx.lineTo(w * 0.65, h * 0.62);
      ctx.lineTo(w * 0.85, h * 0.45);
      ctx.lineTo(w, h * 0.65);
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.fill();

      // Midground Sand Dunes
      ctx.fillStyle = '#8f5c34';
      ctx.beginPath();
      ctx.moveTo(0, h * 0.7);
      ctx.bezierCurveTo(w * 0.25, h * 0.62, w * 0.45, h * 0.78, w * 0.75, h * 0.66);
      ctx.bezierCurveTo(w * 0.88, h * 0.62, w * 0.95, h * 0.7, w, h * 0.72);
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.fill();

      // Foreground Dunes with soft lighting
      ctx.fillStyle = '#ba8551';
      ctx.beginPath();
      ctx.moveTo(0, h * 0.82);
      ctx.bezierCurveTo(w * 0.3, h * 0.76, w * 0.6, h * 0.86, w, h * 0.79);
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.fill();

      // Parallax moving desert caravan silhouettes (camels & travellers)
      const caravanX = (w * 0.1 + (time * 25)) % (w + 120) - 60;
      ctx.fillStyle = '#2b1a10';
      for (let c = 0; c < 3; c++) {
        const cx = caravanX - c * 55;
        if (cx > -30 && cx < w + 30) {
          // Camel body
          ctx.beginPath();
          ctx.ellipse(cx, h * 0.77, 16, 10, 0, 0, Math.PI * 2);
          ctx.fill();
          // Hump
          ctx.beginPath();
          ctx.arc(cx, h * 0.77 - 9, 8, Math.PI, 0);
          ctx.fill();
          // Neck & Head
          ctx.beginPath();
          ctx.moveTo(cx + 12, h * 0.77 - 3);
          ctx.lineTo(cx + 20, h * 0.77 - 16);
          ctx.lineTo(cx + 26, h * 0.77 - 17);
          ctx.lineTo(cx + 22, h * 0.77 - 8);
          ctx.fill();
          // Legs
          ctx.fillRect(cx - 10, h * 0.77, 3, 20);
          ctx.fillRect(cx + 8, h * 0.77, 3, 20);
        }
      }

      // Atmospheric dust motes / light particles
      ctx.fillStyle = 'rgba(255, 235, 180, 0.6)';
      for (let p = 0; p < 18; p++) {
        const px = ((p * 73 + time * 18) % w);
        const py = ((p * 47 + Math.sin(time + p) * 20) % (h * 0.8));
        ctx.beginPath();
        ctx.arc(px, py, (p % 3) + 1, 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => cancelAnimationFrame(animId);
  }, [mission, isEnded]);

  const handleReplay = () => {
    setIsEnded(false);
    setProgressPercent(0);
    audioSystem.speakTurkishText(mission.narrativeText, () => {
      setIsEnded(true);
    });
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    }
  };

  const handleToggleMute = () => {
    setIsMuted(!isMuted);
    audioSystem.toggleMute();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/85 backdrop-blur-lg animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-stone-900 border-2 border-amber-600/70 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-stone-950 via-stone-900 to-stone-950 border-b border-amber-600/40">
          <div className="flex items-center gap-3">
            <span className="bg-amber-500 text-stone-950 font-black text-sm px-2.5 py-0.5 rounded-lg font-title">
              {yearData.year}
            </span>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-amber-200 truncate">
                {mission.title}
              </h3>
              <p className="text-xs text-stone-400">
                Tarihsel Canlandırma ve Sesli Anlatım
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video / Animated Diorama Viewport */}
        <div className="relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden">
          {mission.animationVideoUrl ? (
            <video
              ref={videoRef}
              src={mission.animationVideoUrl}
              className="w-full h-full object-cover"
              autoPlay
              muted={isMuted}
              onEnded={() => setIsEnded(true)}
              onTimeUpdate={() => {
                if (videoRef.current) {
                  setProgressPercent(
                    (videoRef.current.currentTime / videoRef.current.duration) * 100
                  );
                }
              }}
            />
          ) : (
            <canvas
              ref={canvasRef}
              width={854}
              height={480}
              className="w-full h-full object-cover"
            />
          )}

          {/* Subtitles Overlay */}
          <div className="absolute bottom-6 left-6 right-6 flex justify-center pointer-events-none">
            <div className="bg-black/75 backdrop-blur-md border border-amber-500/30 text-amber-100 text-sm sm:text-base font-semibold px-4 py-2 rounded-2xl max-w-2xl text-center shadow-lg">
              {activeSubtitle || mission.subtitles[0]?.text || mission.narrativeText.slice(0, 80) + '...'}
            </div>
          </div>

          {/* Historical Sensitivity Plaque */}
          <div className="absolute top-3 left-3 bg-stone-950/75 border border-stone-700 text-stone-300 text-[11px] px-2.5 py-1 rounded-xl backdrop-blur-sm flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-amber-400" />
            <span>Tarihsel Temsili Canlandırma (Dış Ses Anlatımı)</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-stone-800">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-200"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Narrative Text Card */}
        <div className="p-4 sm:p-5 bg-stone-950/90 border-t border-stone-800 flex-1 overflow-y-auto max-h-40">
          <p className="text-sm sm:text-base text-stone-200 leading-relaxed font-serif">
            {mission.narrativeText}
          </p>
        </div>

        {/* Bottom Actions Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-stone-900 border-t border-amber-600/30">
          <div className="flex items-center gap-2">
            <button
              onClick={handleReplay}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold transition border border-stone-700"
              title="Tekrar Oynat"
            >
              <RotateCcw className="w-4 h-4 text-amber-400" />
              <span>Tekrar Dinle</span>
            </button>

            <button
              onClick={handleToggleMute}
              className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 transition border border-stone-700"
              title={isMuted ? 'Sesi Aç' : 'Sesi Kapat'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
            </button>
          </div>

          <button
            onClick={onCompleteToQuestion}
            className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black text-sm transition shadow-lg shadow-amber-600/30 transform active:scale-95"
          >
            <FileQuestion className="w-4 h-4 text-stone-950" />
            <span>Soruyu Cevapla</span>
          </button>
        </div>

      </div>
    </div>
  );
};
