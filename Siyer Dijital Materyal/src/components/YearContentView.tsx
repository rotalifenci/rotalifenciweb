import React, { useState, useEffect, useMemo } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  BookOpen,
  Heart,
  Volume2,
  VolumeX,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  ShieldCheck,
  Compass,
  Settings,
  LogOut,
  AlertCircle,
  Award,
  Lock,
  Footprints,
  GraduationCap,
  Box,
  FileText
} from 'lucide-react';
import { CharacterType, EventStationData, RootValueId, YearData } from '../types';
import { audioSystem } from '../utils/audioSynthesizer';
import { GameCanvas, NearbyStationPrompt } from '../game/GameCanvas';
import { VirtualControls } from './VirtualControls';
import { StorytellerAudioModal, stopActiveStorytellerAudio } from './StorytellerAudioModal';
import { StationLearningModal } from './StationLearningModal';

interface YearContentViewProps {
  yearData: YearData;
  allYears: YearData[];
  selectedCharacter: CharacterType;
  completedYears: number[];
  completedMissionIds: string[];
  unlockedValues: RootValueId[];
  wrongStrikesInYear: number;
  isMuted: boolean;
  onReturnToDoors: () => void;
  onNavigateYear: (targetYear: number) => void;
  onAnswerEvaluated: (isCorrect: boolean, isThirdStrikeAssisted: boolean) => void;
  onCompleteValueDiscovery: (userReflection: string, choiceId: string, isAppropriate: boolean) => void;
  onOpenCinematicModal: () => void;
  onOpenQuestionModal: () => void;
  onOpenValueModal: () => void;
  onOpenHistoryJournal: () => void;
  onOpenValuesJournal: () => void;
  onOpenSettings: () => void;
  onOpenTeacherPanel?: () => void;
  onToggleMute: () => void;
  onExitToMenu: () => void;
}

export const YearContentView: React.FC<YearContentViewProps> = ({
  yearData,
  allYears,
  selectedCharacter,
  completedYears,
  unlockedValues,
  isMuted,
  onReturnToDoors,
  onNavigateYear,
  onAnswerEvaluated,
  onCompleteValueDiscovery,
  onOpenHistoryJournal,
  onOpenValuesJournal,
  onOpenSettings,
  onOpenTeacherPanel,
  onToggleMute,
  onExitToMenu
}) => {
  // Filter to published stations for student view
  const publishedStations: EventStationData[] = useMemo(
    () => (yearData.eventStations || []).filter(s => s.status !== 'draft'),
    [yearData]
  );

  const hasContent = Boolean(
    (yearData.hasVerifiedContent || publishedStations.length > 0) &&
      yearData.status !== 'draft'
  );

  // Completed station IDs within this year
  const [completedStationIds, setCompletedStationIds] = useState<number[]>(() =>
    completedYears.includes(yearData.year) ? publishedStations.map(s => s.id) : []
  );

  // Active modals: Storyteller Audio Modal or 6-Stage Learning Modal
  const [activeStorytellerStationId, setActiveStorytellerStationId] = useState<number | null>(null);
  const [activeLearningStationId, setActiveLearningStationId] = useState<number | null>(null);

  // 3D vs Historical Summary Card Drawer
  const [showHistoricalInfoSheet, setShowHistoricalInfoSheet] = useState<boolean>(false);

  // 3D Navigation & Virtual Touch Controls state
  const [virtualJoystick, setVirtualJoystick] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isVirtualSprint, setIsVirtualSprint] = useState<boolean>(false);
  const [isVirtualInteract, setIsVirtualInteract] = useState<boolean>(false);
  const [nearBeacon, setNearBeacon] = useState<boolean>(false);
  const [nearPortal, setNearPortal] = useState<boolean>(false);
  const [nearbyPrompt, setNearbyPrompt] = useState<NearbyStationPrompt | null>(null);
  const [teleportTarget, setTeleportTarget] = useState<{ stationId: number; tick: number } | null>(null);
  const [lockedNotice, setLockedNotice] = useState<string | null>(null);

  // Verified years list for empty-state quick jump
  const verifiedYearsList = useMemo(
    () =>
      allYears
        .filter(
          y =>
            y.status !== 'draft' &&
            (y.hasVerifiedContent || (y.eventStations && y.eventStations.some(s => s.status !== 'draft')))
        )
        .map(y => y.year),
    [allYears]
  );

  // Reset state when switching years & clean up any playing storyteller audio
  useEffect(() => {
    stopActiveStorytellerAudio();
    setActiveStorytellerStationId(null);
    setActiveLearningStationId(null);
    setShowHistoricalInfoSheet(false);
    setNearbyPrompt(null);
    setLockedNotice(null);
    setCompletedStationIds(
      completedYears.includes(yearData.year)
        ? (yearData.eventStations || []).filter(s => s.status !== 'draft').map(s => s.id)
        : []
    );

    return () => {
      stopActiveStorytellerAudio();
    };
  }, [yearData.year, completedYears, yearData.eventStations]);

  const activeStorytellerStation = useMemo(
    () => publishedStations.find(s => s.id === activeStorytellerStationId) || null,
    [publishedStations, activeStorytellerStationId]
  );

  const activeLearningStation = useMemo(
    () => publishedStations.find(s => s.id === activeLearningStationId) || null,
    [publishedStations, activeLearningStationId]
  );

  const allStationsCompleted = useMemo(
    () =>
      publishedStations.length > 0 &&
      publishedStations.every(s => completedStationIds.includes(s.id)),
    [publishedStations, completedStationIds]
  );

  const isStationUnlocked = (stationId: number) => {
    const idx = publishedStations.findIndex(s => s.id === stationId);
    if (idx <= 0) return true;
    return completedStationIds.includes(publishedStations[idx - 1].id);
  };

  // Triggered when student clicks or presses [E] near Ak Sakallı Yaşlı Tarih Anlatıcısı
  const handleOpenStoryteller = (stationId: number) => {
    stopActiveStorytellerAudio();
    audioSystem.playButtonClick();
    setActiveLearningStationId(null);
    setActiveStorytellerStationId(stationId);
  };

  // Triggered when student clicks or presses [E] near Soru Rehber Karakteri
  const handleOpenGuideLearning = (stationId: number) => {
    if (!isStationUnlocked(stationId)) {
      const idx = publishedStations.findIndex(s => s.id === stationId);
      setLockedNotice(`Önce ${idx}. Olay Durağındaki etkinliği tamamlamalısın!`);
      audioSystem.playErrorBuzz();
      setTimeout(() => setLockedNotice(null), 3200);
      return;
    }
    stopActiveStorytellerAudio();
    audioSystem.playButtonClick();
    setActiveStorytellerStationId(null);
    setActiveLearningStationId(stationId);
  };

  // Teleport 3D character right in front of the chosen station
  const handleTeleportToStation = (stationId: number) => {
    audioSystem.playButtonClick();
    setTeleportTarget({ stationId, tick: Date.now() });
  };

  // When a station finishes all 6 stages
  const handleStationCompleted = (
    stationId: number,
    _unlockedValueIds: RootValueId[],
    userReflection: string,
    choiceId: string
  ) => {
    const nextCompleted = completedStationIds.includes(stationId)
      ? completedStationIds
      : [...completedStationIds, stationId];

    setCompletedStationIds(nextCompleted);
    setActiveLearningStationId(null);

    // If all stations in this year are now completed, mark year & value discovery completed
    const everyDone = publishedStations.every(s => nextCompleted.includes(s.id));
    if (everyDone) {
      onCompleteValueDiscovery(userReflection, choiceId, true);
    }

    // Automatically guide/teleport toward the next unlocked station if one exists
    const currentIdx = publishedStations.findIndex(s => s.id === stationId);
    if (currentIdx !== -1 && currentIdx + 1 < publishedStations.length) {
      const nextStation = publishedStations[currentIdx + 1];
      setTeleportTarget({ stationId: nextStation.id, tick: Date.now() });
    }
  };

  const isAnyModalOpen =
    Boolean(activeStorytellerStation) ||
    Boolean(activeLearningStation) ||
    showHistoricalInfoSheet;

  return (
    <div
      id="year-content-3d-stage"
      className="relative w-screen h-dvh overflow-hidden bg-stone-950 select-none flex flex-col justify-between"
    >
      {/* =================================================================== */}
      {/* 1. 3D HISTORICAL ENVIRONMENT CANVAS (Or Honest Empty State if unverified) */}
      {/* =================================================================== */}
      {hasContent ? (
        <div className="absolute inset-0 z-0">
          <GameCanvas
            characterType={selectedCharacter}
            currentYear={yearData.year}
            sceneEnvironment={yearData.sceneEnvironment}
            activeMission={yearData.missions[0] || null}
            eventStations={publishedStations}
            completedStationIds={completedStationIds}
            isPortalActive={allStationsCompleted}
            isPaused={isAnyModalOpen}
            teleportTarget={teleportTarget}
            onInteractMission={() => {
              const firstTarget =
                publishedStations.find(s => !completedStationIds.includes(s.id)) ||
                publishedStations[0];
              if (firstTarget) {
                handleOpenGuideLearning(firstTarget.id);
              }
            }}
            onInteractStoryteller={handleOpenStoryteller}
            onInteractGuide={handleOpenGuideLearning}
            onEnterPortal={onReturnToDoors}
            onProximityChange={(b, p) => {
              setNearBeacon(b);
              setNearPortal(p);
            }}
            onStationProximityChange={setNearbyPrompt}
            virtualJoystick={virtualJoystick}
            isVirtualSprint={isVirtualSprint}
            isVirtualInteract={isVirtualInteract}
          />
        </div>
      ) : (
        /* HONEST EMPTY STATE FOR UNVERIFIED YEARS (Never fabricates historical events) */
        <div className="relative z-10 flex-1 flex items-center justify-center p-4 overflow-y-auto bg-gradient-to-b from-stone-950 via-[#1d130a] to-stone-950">
          <div className="w-full max-w-2xl rounded-3xl bg-stone-900/95 border-2 border-amber-500/40 p-6 sm:p-8 text-center space-y-5 shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-400/40 flex items-center justify-center mx-auto">
              <AlertCircle className="w-8 h-8 text-amber-400" />
            </div>

            <div className="space-y-2">
              <span className="inline-block px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-black">
                {yearData.year} Yılı • {yearData.subTitle}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Bu yıla ait doğrulanmış içerik henüz eklenmedi.
              </h2>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-lg mx-auto">
                Tarihsel doğruluk ilkesi gereği bu yıl için uydurma olay üretilmemiştir. Öğretmen Yönetim Panelinden bu yıla yeni tarihsel olay, sesli anlatım, animasyon ve sorular ekleyebilir veya doğrulanmış yıllardan birini seçebilirsiniz.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={onReturnToDoors}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg transition"
              >
                <Compass className="w-4 h-4" />
                <span>571–632 Kapılar Ekranına Dön</span>
              </button>

              {onOpenTeacherPanel && (
                <button
                  type="button"
                  onClick={onOpenTeacherPanel}
                  className="px-4 py-2.5 rounded-xl bg-purple-950/90 hover:bg-purple-900 text-purple-200 border border-purple-400/50 font-bold text-xs sm:text-sm flex items-center gap-2 transition"
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>Öğretmen Panelinden Bu Yıla Olay Ekle</span>
                </button>
              )}
            </div>

            {/* Quick Jump to Verified Years */}
            <div className="pt-4 border-t border-stone-800 space-y-2">
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
                Doğrulanmış 3B Tarihsel Mekân Yıllarına Hızlı Geçiş:
              </span>
              <div className="flex flex-wrap justify-center gap-1.5 max-h-32 overflow-y-auto p-1">
                {verifiedYearsList.map(vy => (
                  <button
                    key={vy}
                    type="button"
                    onClick={() => onNavigateYear(vy)}
                    className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-amber-500 hover:text-stone-950 text-amber-200 text-xs font-black border border-amber-500/30 transition"
                  >
                    {vy}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* 2. TOP HUD BAR (Navigation, Year Info, Historical Summary Sheet, Teacher Panel) */}
      {/* =================================================================== */}
      <header className="relative z-20 w-full px-3 sm:px-5 py-2.5 bg-gradient-to-b from-stone-950/90 via-stone-950/70 to-transparent flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-2">
          <button
            type="button"
            id="btn-back-to-doors"
            onClick={onReturnToDoors}
            className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-lg transition active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kapılar Ekranı (571–632)</span>
          </button>

          <div className="hidden md:flex items-center gap-1">
            {yearData.previousYear && (
              <button
                type="button"
                onClick={() => onNavigateYear(yearData.previousYear!)}
                className="px-2.5 py-1.5 rounded-xl bg-stone-900/90 hover:bg-stone-800 text-amber-200 border border-amber-500/30 text-xs font-bold"
                title={`Önceki Yıl: ${yearData.previousYear}`}
              >
                ‹ {yearData.previousYear}
              </button>
            )}
            {yearData.nextYear && (
              <button
                type="button"
                onClick={() => onNavigateYear(yearData.nextYear!)}
                className="px-2.5 py-1.5 rounded-xl bg-stone-900/90 hover:bg-stone-800 text-amber-200 border border-amber-500/30 text-xs font-bold"
                title={`Sonraki Yıl: ${yearData.nextYear}`}
              >
                {yearData.nextYear} ›
              </button>
            )}
          </div>
        </div>

        {/* Center Year & Location Badge */}
        <div className="pointer-events-auto flex items-center gap-2.5 bg-stone-950/85 backdrop-blur-md px-4 py-1.5 rounded-2xl border border-amber-500/50 shadow-xl">
          <span className="px-2.5 py-0.5 rounded-lg bg-amber-500 text-stone-950 font-black text-xs sm:text-sm">
            {yearData.year}
          </span>
          <div className="text-left">
            <h1 className="text-xs sm:text-sm font-black text-amber-100 leading-tight">
              {yearData.title}
            </h1>
            <p className="text-[10px] sm:text-xs text-amber-300/80 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
              <span>3B Tarihsel Mekân: {yearData.location}</span>
            </p>
          </div>
        </div>

        {/* Right Utility Actions */}
        <div className="pointer-events-auto flex items-center gap-1.5">
          {hasContent && (
            <button
              type="button"
              onClick={() => setShowHistoricalInfoSheet(prev => !prev)}
              className="px-3 py-1.5 rounded-xl bg-stone-900/90 hover:bg-stone-800 text-amber-200 border border-amber-500/40 text-xs font-bold flex items-center gap-1.5 shadow"
            >
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Tarihsel Bilgi & Kaynak</span>
            </button>
          )}

          <button
            type="button"
            onClick={onOpenHistoryJournal}
            className="p-2 rounded-xl bg-stone-900/90 hover:bg-stone-800 text-amber-300 border border-amber-500/30"
            title="Siyer Günlüğüm"
          >
            <BookOpen className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onOpenValuesJournal}
            className="p-2 rounded-xl bg-stone-900/90 hover:bg-stone-800 text-emerald-300 border border-emerald-500/30"
            title={`Kazanılan Değerler (${unlockedValues.length})`}
          >
            <Heart className="w-4 h-4" />
          </button>

          {onOpenTeacherPanel && (
            <button
              type="button"
              onClick={onOpenTeacherPanel}
              className="p-2 rounded-xl bg-purple-950/90 hover:bg-purple-900 text-purple-200 border border-purple-400/50"
              title="Öğretmen Yönetim Paneli"
            >
              <GraduationCap className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={onToggleMute}
            className="p-2 rounded-xl bg-stone-900/90 hover:bg-stone-800 text-amber-200 border border-stone-700"
            title={isMuted ? 'Sesi Aç' : 'Sesi Kapat'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={onOpenSettings}
            className="p-2 rounded-xl bg-stone-900/90 hover:bg-stone-800 text-stone-300 border border-stone-700"
            title="Ayarlar"
          >
            <Settings className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onExitToMenu}
            className="p-2 rounded-xl bg-rose-950/80 hover:bg-rose-900 text-rose-200 border border-rose-500/40"
            title="Ana Sayfaya Dön"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* =================================================================== */}
      {/* 3. STATION COMPASS & DIRECT INTERACTION BAR (Prevents student from ever getting lost in 3D!) */}
      {/* =================================================================== */}
      {hasContent && publishedStations.length > 0 && (
        <div className="relative z-20 w-full max-w-5xl mx-auto px-3 mt-1 pointer-events-none">
          <div className="pointer-events-auto rounded-2xl bg-stone-950/85 backdrop-blur-md border border-amber-500/40 p-2.5 sm:p-3 shadow-2xl">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-200">
                <Box className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  3B Tarihsel Mekân Durakları ({completedStationIds.length}/{publishedStations.length} Tamamlandı)
                </span>
                <span className="hidden lg:inline text-stone-400 font-normal">
                  • Sahnede WASD / Yön tuşlarıyla yürü veya doğrudan durak butonlarına tıkla!
                </span>
              </div>

              {allStationsCompleted && (
                <span
                  id="year-all-stations-completed-badge"
                  className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-300 text-xs font-black"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Bu Yılın Tüm Durakları Tamamlandı!
                </span>
              )}
            </div>

            {/* Station Cards Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {publishedStations.map((st, idx) => {
                const isDone = completedStationIds.includes(st.id);
                const unlocked = isStationUnlocked(st.id);

                return (
                  <div
                    key={st.id}
                    id={`station-hud-card-${st.id}`}
                    className={`rounded-xl p-2.5 border flex flex-col justify-between gap-2 transition ${
                      isDone
                        ? 'bg-emerald-950/60 border-emerald-500/50'
                        : unlocked
                        ? 'bg-stone-900/95 border-amber-500/60 shadow-md'
                        : 'bg-stone-900/50 border-stone-800 opacity-75'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 block">
                          {idx + 1}. Olay Durağı • {st.npc}
                        </span>
                        <h4 className="text-xs sm:text-sm font-black text-white truncate">
                          {st.animationScene.title}
                        </h4>
                      </div>

                      {isDone ? (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-black flex items-center gap-1 shrink-0">
                          <CheckCircle2 className="w-3 h-3" />
                          Tamam
                        </span>
                      ) : !unlocked ? (
                        <span className="px-2 py-0.5 rounded-md bg-stone-800 text-stone-400 text-[10px] font-bold flex items-center gap-1 shrink-0">
                          <Lock className="w-3 h-3" />
                          Kilitli
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[10px] font-black shrink-0">
                          Aktif Durak
                        </span>
                      )}
                    </div>

                    {/* Two Distinct Role Buttons: Storyteller vs Question Guide + 3D Walk */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      <button
                        type="button"
                        id={`btn-teleport-station-${st.id}`}
                        onClick={() => handleTeleportToStation(st.id)}
                        className="px-2.5 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-[11px] font-bold border border-stone-600 flex items-center gap-1 transition"
                        title="3B Karakteri Bu Durağın Önüne Götür"
                      >
                        <Footprints className="w-3.5 h-3.5 text-amber-400" />
                        <span>Durağa Git</span>
                      </button>

                      {/* 1. Ak Sakallı Yaşlı Tarih Anlatıcısı Button */}
                      <button
                        type="button"
                        id={`btn-station-${st.id}-storyteller`}
                        onClick={() => handleOpenStoryteller(st.id)}
                        className="px-2.5 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/35 text-amber-200 border border-amber-400/50 text-[11px] font-black flex items-center gap-1 transition"
                      >
                        <Volume2 className="w-3.5 h-3.5 text-amber-300" />
                        <span>Olayı Dinle (Tarih Anlatıcısı)</span>
                      </button>

                      {/* 2. Soru Rehber Karakteri Button */}
                      <button
                        type="button"
                        id={`btn-station-${st.id}-guide`}
                        onClick={() => handleOpenGuideLearning(st.id)}
                        className={`ml-auto px-3 py-1.5 rounded-lg text-[11px] font-black flex items-center gap-1 transition ${
                          unlocked
                            ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-stone-950 shadow'
                            : 'bg-stone-800 text-stone-400 border border-stone-700 cursor-not-allowed'
                        }`}
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>{isDone ? 'Etkinliği Tekrarla' : 'Soru Rehberi (Etkinlik)'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* 4. FLOATING 3D PROXIMITY INTERACTION BANNER & TOUCH VIRTUAL CONTROLS */}
      {/* =================================================================== */}
      {hasContent && (
        <div className="relative z-20 mt-auto w-full px-4 pb-14 sm:pb-5 flex flex-col items-center gap-2 pointer-events-none">
          {lockedNotice && (
            <div className="pointer-events-auto px-4 py-2 rounded-2xl bg-rose-950/95 border-2 border-rose-500 text-rose-100 text-xs sm:text-sm font-black shadow-2xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{lockedNotice}</span>
            </div>
          )}

          {nearbyPrompt && (
            <div className="pointer-events-auto">
              {nearbyPrompt.targetType === 'storyteller' ? (
                <button
                  type="button"
                  onClick={() => handleOpenStoryteller(nearbyPrompt.stationId)}
                  className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-stone-950 font-black text-xs sm:text-sm border-2 border-amber-100 shadow-[0_0_35px_rgba(245,158,11,0.6)] flex items-center gap-2.5 animate-bounce"
                >
                  <Volume2 className="w-5 h-5" />
                  <span>
                    [E] veya Tıkla: {nearbyPrompt.stationId}. Durak Ak Sakallı Tarih Anlatıcısından Olayı Dinle
                  </span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleOpenGuideLearning(nearbyPrompt.stationId)}
                  className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-600 text-stone-950 font-black text-xs sm:text-sm border-2 border-emerald-100 shadow-[0_0_35px_rgba(16,185,129,0.6)] flex items-center gap-2.5 animate-bounce"
                >
                  <HelpCircle className="w-5 h-5" />
                  <span>
                    [E] veya Tıkla: {nearbyPrompt.stationId}. Durak Soru Rehber Karakteri ile Etkinliğe Başla
                  </span>
                </button>
              )}
            </div>
          )}

          {/* Virtual Joystick & Touch/Smartboard Controls */}
          <VirtualControls
            onJoystickMove={vec => setVirtualJoystick(vec)}
            isSprinting={isVirtualSprint}
            onSprintToggle={setIsVirtualSprint}
            onInteract={() => {
              setIsVirtualInteract(true);
              setTimeout(() => setIsVirtualInteract(false), 150);
            }}
            showInteractPrompt={nearBeacon || nearPortal || Boolean(nearbyPrompt)}
          />
        </div>
      )}

      {/* =================================================================== */}
      {/* 5. HISTORICAL SUMMARY & AUTHENTIC SOURCES DRAWER */}
      {/* =================================================================== */}
      {showHistoricalInfoSheet && (
        <div className="fixed inset-0 z-40 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl rounded-3xl bg-stone-900 border-2 border-amber-500/50 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div>
                <span className="text-xs font-black text-amber-400">
                  {yearData.year} Yılı • {yearData.location}
                </span>
                <h3 className="text-lg font-black text-white">{yearData.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowHistoricalInfoSheet(false)}
                className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold"
              >
                Kapat
              </button>
            </div>

            <p className="text-sm text-stone-200 leading-relaxed">{yearData.historicalSummary}</p>

            <div className="rounded-2xl bg-stone-950 p-4 border border-amber-500/30 text-xs space-y-1">
              <div className="font-black text-amber-300 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Tarihsel Kaynak: {yearData.historicalSource.sourceName}</span>
              </div>
              <div className="text-stone-400">
                Referans: {yearData.historicalSource.authorOrRef} ({yearData.historicalSource.certaintyLevel})
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* 6. AK SAKALLI YAŞLI TARİH ANLATICISI MODAL (AUDIO NARRATION) */}
      {/* =================================================================== */}
      {activeStorytellerStation && (
        <StorytellerAudioModal
          yearData={yearData}
          station={activeStorytellerStation}
          onClose={() => setActiveStorytellerStationId(null)}
          onProceedToGuideActivity={() => {
            const targetId = activeStorytellerStation.id;
            setActiveStorytellerStationId(null);
            handleOpenGuideLearning(targetId);
          }}
          onOpenTeacherPanelForAudio={onOpenTeacherPanel}
        />
      )}

      {/* =================================================================== */}
      {/* 7. SORU REHBER KARAKTERİ 6-STAGE LEARNING FLOW MODAL */}
      {/* =================================================================== */}
      {activeLearningStation && (
        <StationLearningModal
          yearData={yearData}
          station={activeLearningStation}
          isLastStationInYear={
            publishedStations[publishedStations.length - 1]?.id === activeLearningStation.id
          }
          onClose={() => setActiveLearningStationId(null)}
          onOpenStorytellerAudio={() => {
            const targetId = activeLearningStation.id;
            setActiveLearningStationId(null);
            setActiveStorytellerStationId(targetId);
          }}
          onStationCompleted={handleStationCompleted}
          onAnswerAttempt={isCorrect => onAnswerEvaluated(isCorrect, false)}
        />
      )}
    </div>
  );
};
