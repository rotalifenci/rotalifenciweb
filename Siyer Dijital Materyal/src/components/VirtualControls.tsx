import React, { useRef, useState, useEffect } from 'react';
import { Footprints, Hand, Zap, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Monitor, Compass } from 'lucide-react';

interface VirtualControlsProps {
  onJoystickMove: (vec: { x: number; y: number }) => void;
  isSprinting: boolean;
  onSprintToggle: (sprint: boolean) => void;
  onInteract: () => void;
  showInteractPrompt: boolean;
  interactLabel?: string;
  isSmartboardMode?: boolean;
  onToggleSmartboardMode?: () => void;
}

export const VirtualControls: React.FC<VirtualControlsProps> = ({
  onJoystickMove,
  isSprinting,
  onSprintToggle,
  onInteract,
  showInteractPrompt,
  interactLabel,
  isSmartboardMode = false,
  onToggleSmartboardMode
}) => {
  const joystickBaseRef = useRef<HTMLDivElement>(null);
  const [knobPos, setKnobPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [activeDpadDir, setActiveDpadDir] = useState<string | null>(null);

  const maxRadius = 45; // Max joystick radius in px

  const handlePointerDown = (clientX: number, clientY: number) => {
    setIsDragging(true);
    updateKnob(clientX, clientY);
  };

  const handlePointerMove = (clientX: number, clientY: number) => {
    if (!isDragging) return;
    updateKnob(clientX, clientY);
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    setKnobPos({ x: 0, y: 0 });
    onJoystickMove({ x: 0, y: 0 });
  };

  const updateKnob = (clientX: number, clientY: number) => {
    const base = joystickBaseRef.current;
    if (!base) return;

    const rect = base.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = clientX - centerX;
    const dy = clientY - centerY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist <= maxRadius) {
      setKnobPos({ x: dx, y: dy });
      onJoystickMove({ x: dx / maxRadius, y: dy / maxRadius });
    } else {
      const angle = Math.atan2(dy, dx);
      const nx = Math.cos(angle) * maxRadius;
      const ny = Math.sin(angle) * maxRadius;
      setKnobPos({ nx: nx, ny: ny } as any);
      setKnobPos({ x: nx, y: ny });
      onJoystickMove({ x: Math.cos(angle), y: Math.sin(angle) });
    }
  };

  // Global mousemove/mouseup listener while dragging with mouse
  useEffect(() => {
    if (!isDragging) return;

    const onMouseMove = (e: MouseEvent) => {
      handlePointerMove(e.clientX, e.clientY);
    };

    const onMouseUp = () => {
      handlePointerUp();
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [isDragging]);

  // Smartboard D-Pad Handlers
  const handleDpadPress = (dir: 'up' | 'down' | 'left' | 'right') => {
    setActiveDpadDir(dir);
    switch (dir) {
      case 'up':
        onJoystickMove({ x: 0, y: -1 });
        break;
      case 'down':
        onJoystickMove({ x: 0, y: 1 });
        break;
      case 'left':
        onJoystickMove({ x: -1, y: 0 });
        break;
      case 'right':
        onJoystickMove({ x: 1, y: 0 });
        break;
    }
  };

  const handleDpadRelease = () => {
    setActiveDpadDir(null);
    onJoystickMove({ x: 0, y: 0 });
  };

  const handleSprintClick = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onSprintToggle(!isSprinting);
  };

  return (
    <div className="absolute inset-x-0 bottom-0 pointer-events-none p-3 sm:p-6 z-20 flex items-end justify-between select-none">
      
      {/* LEFT CONTROLS: Analog Joystick OR Smartboard D-Pad */}
      <div className="pointer-events-auto flex flex-col items-start gap-2">
        
        {/* Quick Toggle: Joystick <-> Akıllı Tahta D-Pad */}
        {onToggleSmartboardMode && (
          <button
            type="button"
            onClick={onToggleSmartboardMode}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-stone-900/80 hover:bg-stone-800 border border-amber-500/40 text-[10px] sm:text-xs font-bold text-amber-300 backdrop-blur-md shadow-lg transition active:scale-95"
            title="Akıllı Tahta ve Joystick Modunu Değiştir"
          >
            <Monitor className="w-3.5 h-3.5 text-amber-400" />
            <span>{isSmartboardMode ? 'Joystick Modu' : 'Tahta D-Pad'}</span>
          </button>
        )}

        {isSmartboardMode ? (
          /* AKILLI TAHTA (SMARTBOARD) D-PAD DIRECTIONAL CROSS */
          <div className="relative w-36 h-36 sm:w-44 sm:h-44 bg-stone-950/80 border-2 border-amber-500/50 rounded-3xl p-1 backdrop-blur-md shadow-2xl flex items-center justify-center touch-none">
            {/* Up / İleri */}
            <button
              type="button"
              onPointerDown={() => handleDpadPress('up')}
              onPointerUp={handleDpadRelease}
              onPointerLeave={handleDpadRelease}
              className={`absolute top-1.5 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex flex-col items-center justify-center transition border ${
                activeDpadDir === 'up'
                  ? 'bg-amber-500 border-amber-200 text-stone-950 shadow-lg scale-95'
                  : 'bg-stone-900/90 hover:bg-stone-800 border-amber-600/40 text-amber-300'
              }`}
              title="İleri Yürü (W / Yukarı Ok)"
            >
              <ArrowUp className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
              <span className="text-[8px] font-black uppercase">İLERİ</span>
            </button>

            {/* Down / Geri */}
            <button
              type="button"
              onPointerDown={() => handleDpadPress('down')}
              onPointerUp={handleDpadRelease}
              onPointerLeave={handleDpadRelease}
              className={`absolute bottom-1.5 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex flex-col items-center justify-center transition border ${
                activeDpadDir === 'down'
                  ? 'bg-amber-500 border-amber-200 text-stone-950 shadow-lg scale-95'
                  : 'bg-stone-900/90 hover:bg-stone-800 border-amber-600/40 text-amber-300'
              }`}
              title="Geri Yürü (S / Aşağı Ok)"
            >
              <span className="text-[8px] font-black uppercase">GERİ</span>
              <ArrowDown className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
            </button>

            {/* Left / Sola Dön */}
            <button
              type="button"
              onPointerDown={() => handleDpadPress('left')}
              onPointerUp={handleDpadRelease}
              onPointerLeave={handleDpadRelease}
              className={`absolute left-1.5 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex flex-col items-center justify-center transition border ${
                activeDpadDir === 'left'
                  ? 'bg-amber-500 border-amber-200 text-stone-950 shadow-lg scale-95'
                  : 'bg-stone-900/90 hover:bg-stone-800 border-amber-600/40 text-amber-300'
              }`}
              title="Sola Dön (A / Sol Ok)"
            >
              <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
              <span className="text-[8px] font-black uppercase">SOL</span>
            </button>

            {/* Right / Sağa Dön */}
            <button
              type="button"
              onPointerDown={() => handleDpadPress('right')}
              onPointerUp={handleDpadRelease}
              onPointerLeave={handleDpadRelease}
              className={`absolute right-1.5 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex flex-col items-center justify-center transition border ${
                activeDpadDir === 'right'
                  ? 'bg-amber-500 border-amber-200 text-stone-950 shadow-lg scale-95'
                  : 'bg-stone-900/90 hover:bg-stone-800 border-amber-600/40 text-amber-300'
              }`}
              title="Sağa Dön (D / Sağ Ok)"
            >
              <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
              <span className="text-[8px] font-black uppercase">SAĞ</span>
            </button>

            {/* Center Compass Rose Decoration */}
            <div className="w-7 h-7 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 pointer-events-none">
              <Compass className="w-4 h-4" />
            </div>
          </div>
        ) : (
          /* STANDARD VIRTUAL ANALOG JOYSTICK */
          <div
            ref={joystickBaseRef}
            onTouchStart={(e) => handlePointerDown(e.touches[0].clientX, e.touches[0].clientY)}
            onTouchMove={(e) => handlePointerMove(e.touches[0].clientX, e.touches[0].clientY)}
            onTouchEnd={handlePointerUp}
            onTouchCancel={handlePointerUp}
            onMouseDown={(e) => handlePointerDown(e.clientX, e.clientY)}
            className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-stone-950/70 border-2 border-amber-600/50 backdrop-blur-md flex items-center justify-center touch-none shadow-2xl active:border-amber-400 cursor-grab active:cursor-grabbing"
          >
            {/* Direction ring guide */}
            <div className="absolute inset-3 rounded-full border border-amber-500/20 pointer-events-none" />
            <div className="absolute w-2 h-2 rounded-full bg-amber-500/50 pointer-events-none" />

            {/* Dynamic Joystick Knob */}
            <div
              className="absolute w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 border-2 border-amber-300 shadow-xl flex items-center justify-center transform active:scale-95 transition-transform duration-75 pointer-events-none"
              style={{
                transform: `translate(${knobPos.x}px, ${knobPos.y}px)`
              }}
            >
              <div className="w-3.5 h-3.5 rounded-full bg-stone-950/40" />
            </div>
          </div>
        )}
      </div>

      {/* RIGHT ACTION BUTTONS (Sprint & [E] İncele) */}
      <div className="pointer-events-auto flex items-end gap-2.5 sm:gap-4">
        
        {/* Sprint / Run Button with Active State */}
        <button
          type="button"
          onClick={handleSprintClick}
          className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex flex-col items-center justify-center gap-0.5 border-2 transition-all shadow-xl backdrop-blur-md active:scale-90 ${
            isSprinting
              ? 'bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 border-amber-200 text-stone-950 shadow-amber-500/60 ring-4 ring-amber-400/50 scale-105 font-black'
              : 'bg-stone-900/80 hover:bg-stone-800 border-stone-600 hover:border-amber-500/50 text-stone-300'
          }`}
          title={isSprinting ? 'Koşu Aktif (Kapatmak için tıkla / Shift)' : 'Koşuyu Aç (Shift)'}
        >
          {isSprinting ? (
            <Zap className="w-5 h-5 animate-pulse text-stone-950 fill-stone-950" />
          ) : (
            <Footprints className="w-5 h-5 text-amber-400" />
          )}
          <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider">
            {isSprinting ? 'KOŞUYOR' : 'KOŞ'}
          </span>
        </button>

        {/* Interact Button [E] */}
        <button
          type="button"
          onClick={onInteract}
          className={`h-14 sm:h-16 px-4 sm:px-5 rounded-2xl flex items-center justify-center gap-2 border-2 transition-all shadow-2xl backdrop-blur-md active:scale-90 ${
            showInteractPrompt
              ? 'bg-gradient-to-r from-amber-500 to-amber-600 border-amber-300 text-stone-950 shadow-amber-500/50 scale-105 animate-pulse ring-4 ring-amber-400/30'
              : 'bg-stone-900/80 hover:bg-stone-800 border-stone-600 text-stone-300'
          }`}
          title="Etkileşim (E / Boşluk)"
        >
          <Hand className="w-5 h-5 sm:w-6 sm:h-6" />
          <div className="flex flex-col text-left">
            <span className="text-[11px] sm:text-xs font-black tracking-wider uppercase whitespace-nowrap">
              {interactLabel || '[E] İncele'}
            </span>
            <span className="text-[9px] sm:text-[10px] opacity-80">Etkileşim</span>
          </div>
        </button>

      </div>

    </div>
  );
};
