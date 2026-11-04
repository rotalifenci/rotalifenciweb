import React, { useState, useEffect, Suspense } from 'react';
import {
  CharacterType,
  GameScreen,
  ActiveOverlay,
  YearData,
  StudentProgress,
  MissionData
} from './types';
import {
  loadProgress,
  saveProgress,
  loadCurriculum,
  saveCurriculum,
  resetProgress
} from './utils/storage';
import { audioSystem } from './utils/audioSynthesizer';
import { MainMenu } from './components/MainMenu';
import { YearDoorsHub } from './components/YearDoorsHub';
import { YearContentView } from './components/YearContentView';
import { MissionCinematicModal } from './components/MissionCinematicModal';
import { QuestionModal } from './components/QuestionModal';
import { ValueDiscoveryModal } from './components/ValueDiscoveryModal';
import { HistoryJournalModal } from './components/HistoryJournalModal';
import { ValuesJournalModal } from './components/ValuesJournalModal';
import { SettingsModal } from './components/SettingsModal';
import { FinalCelebrationModal } from './components/FinalCelebrationModal';
import { YouTubeAudioPlayer } from './components/YouTubeAudioPlayer';
import { YearSelectorModal } from './components/YearSelectorModal';
import { LogOut, Compass } from 'lucide-react';

// Lazy-loaded optional heavy panels & 3D character inspection modals
const TeacherPanelModal = React.lazy(() =>
  import('./components/TeacherPanelModal').then(m => ({ default: m.TeacherPanelModal }))
);
const ResearchPanelModal = React.lazy(() =>
  import('./components/ResearchPanelModal').then(m => ({ default: m.ResearchPanelModal }))
);
const ModelInspectorModal = React.lazy(() =>
  import('./components/ModelInspectorModal').then(m => ({ default: m.ModelInspectorModal }))
);
const CharacterTestArenaModal = React.lazy(() =>
  import('./components/CharacterTestArenaModal').then(m => ({ default: m.CharacterTestArenaModal }))
);

export const App: React.FC = () => {
  const [progress, setProgress] = useState<StudentProgress>(() => {
    const p = loadProgress();
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const c = params.get('char');
      if (c === 'eren' || c === 'aybuke') {
        p.character = c;
      }
    }
    return p;
  });

  const [curriculum, setCurriculum] = useState<YearData[]>(loadCurriculum);

  const [screen, setScreen] = useState<GameScreen>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const s = params.get('screen');
      if (s === 'doors_hub' || s === 'timeline_3d') return 'doors_hub';
      if (s === 'year_content' || s === 'game_3d') return 'year_content';
    }
    return 'menu';
  });

  const [selectedCharacter, setSelectedCharacter] = useState<CharacterType | null>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const c = params.get('char');
      if (c === 'eren' || c === 'aybuke') return c;
    }
    return null;
  });

  const [activeOverlay, setActiveOverlay] = useState<ActiveOverlay>(null);
  const [showExitConfirm, setShowExitConfirm] = useState<boolean>(false);

  // Akıllı Tahta (Smartboard) Mode
  const [isSmartboardMode, setIsSmartboardMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('dijital_siyer_smartboard_mode') === 'true';
    }
    return false;
  });

  const handleToggleSmartboardMode = () => {
    setIsSmartboardMode(prev => {
      const next = !prev;
      localStorage.setItem('dijital_siyer_smartboard_mode', String(next));
      audioSystem.playButtonClick();
      return next;
    });
  };

  // Global helper for testing & direct navigation
  useEffect(() => {
    (window as any).__launchDoors = () => setScreen('doors_hub');
    (window as any).__launchYear = (y: number) => handleEnterYear(y);
  }, []);

  // Current Year and Mission
  const currentYearData =
    curriculum.find(y => y.year === progress.currentYear) || curriculum[0];
  const activeMission: MissionData | null = currentYearData.missions[0] || null;

  // Strikes used in current year
  const wrongStrikesInCurrentYear =
    progress.wrongAnswerCountByYear[progress.currentYear] || 0;

  // Save progress on state change
  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  // Escape key handler to toggle exit confirm or close overlays
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showExitConfirm) {
          setShowExitConfirm(false);
        } else if (activeOverlay) {
          setActiveOverlay(null);
        } else if (screen === 'year_content') {
          handleReturnToDoors();
        } else if (screen === 'doors_hub') {
          setShowExitConfirm(true);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showExitConfirm, activeOverlay, screen]);

  //ANA SAYFA -> KARAKTER SEÇİMİ -> 571–632 KAPI SEÇİM EKRANI
  const handleStartGame = () => {
    setScreen('doors_hub');
    audioSystem.startAmbientMusic();
  };

  const handleReturnToDoors = () => {
    setScreen('doors_hub');
    audioSystem.playButtonClick();
  };

  // KAPI SEÇİM EKRANI -> SEÇİLEN YILIN İÇERİĞİ (Instant, non-blocking transition)
  const handleEnterYear = (targetYear: number) => {
    const clampedYear = Math.max(571, Math.min(632, targetYear));
    setProgress(prev => {
      const prevVisited = prev.visitedYears || [571];
      const newVisited = prevVisited.includes(clampedYear)
        ? prevVisited
        : [...prevVisited, clampedYear];
      const newPath = [...(prev.explorationPath || [571]), clampedYear];
      return {
        ...prev,
        currentYear: clampedYear,
        visitedYears: newVisited,
        explorationPath: newPath
      };
    });

    audioSystem.playPortalWarp();
    setScreen('year_content');
  };

  const handleSelectCharacter = (char: CharacterType) => {
    setSelectedCharacter(char);
    setProgress(prev => ({ ...prev, character: char }));
  };

  // Progression from Mission Cinematic to Question
  const handleCinematicToQuestion = () => {
    setActiveOverlay('question_modal');
  };

  // Question Answer Evaluation Callback
  const handleAnswerEvaluated = (isCorrect: boolean, isThirdStrikeAssisted: boolean) => {
    if (!activeMission) return;

    setProgress(prev => {
      const yearStrikes = prev.wrongAnswerCountByYear[prev.currentYear] || 0;
      const updatedStrikes = isCorrect ? yearStrikes : Math.min(3, yearStrikes + 1);

      return {
        ...prev,
        totalCorrect: isCorrect ? prev.totalCorrect + 1 : prev.totalCorrect,
        totalWrong: isCorrect ? prev.totalWrong : prev.totalWrong + 1,
        wrongAnswerCountByYear: {
          ...prev.wrongAnswerCountByYear,
          [prev.currentYear]: updatedStrikes
        }
      };
    });

    if (isCorrect || isThirdStrikeAssisted) {
      if (!activeMission.valueDiscovery) {
        completeCurrentMission();
      }
      if (activeOverlay === 'question_modal') {
        if (activeMission.valueDiscovery) {
          setActiveOverlay('value_discovery_modal');
        } else {
          setActiveOverlay(null);
        }
      }
    }
  };

  // Value Discovery Completion Callback
  const handleCompleteValueDiscovery = (
    userReflection: string,
    choiceId: string,
    isAppropriate: boolean
  ) => {
    if (!activeMission || !activeMission.valueDiscovery) return;

    const valueId = activeMission.valueDiscovery.valueId;

    setProgress(prev => {
      const newUnlockedValues = prev.unlockedValues.includes(valueId)
        ? prev.unlockedValues
        : [...prev.unlockedValues, valueId];

      return {
        ...prev,
        unlockedValues: newUnlockedValues,
        valueAnswers: {
          ...prev.valueAnswers,
          [`val_${prev.currentYear}_${valueId}`]: {
            valueId,
            userExplanation: userReflection,
            scenarioChoiceId: choiceId,
            isAppropriate,
            timestamp: new Date().toISOString()
          }
        }
      };
    });

    completeCurrentMission();
    if (activeOverlay === 'value_discovery_modal') {
      setActiveOverlay(null);
    }
  };

  const completeCurrentMission = () => {
    if (!activeMission) return;

    setProgress(prev => {
      const completedMissions = prev.completedMissionIds.includes(activeMission.id)
        ? prev.completedMissionIds
        : [...prev.completedMissionIds, activeMission.id];

      const completedYears = prev.completedYears.includes(prev.currentYear)
        ? prev.completedYears
        : [...prev.completedYears, prev.currentYear];

      return {
        ...prev,
        completedMissionIds: completedMissions,
        completedYears
      };
    });

    audioSystem.playSuccessChime();
  };

  // Teacher updates curriculum
  const handleUpdateCurriculum = (updatedYears: YearData[]) => {
    setCurriculum(updatedYears);
    saveCurriculum(updatedYears);
  };

  // Reset Progress
  const handleResetProgress = () => {
    const fresh = resetProgress();
    setProgress(fresh);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-stone-950 font-sans">
      {/* 1. ANA SAYFA VE KARAKTER SEÇİMİ */}
      {screen === 'menu' && (
        <MainMenu
          selectedCharacter={selectedCharacter}
          onSelectCharacter={handleSelectCharacter}
          onStartGame={handleStartGame}
          onOpenPreTest={() => setActiveOverlay('question_modal')}
          onOpenTeacherPanel={() => setActiveOverlay('teacher_panel')}
          onOpenResearchPanel={() => setActiveOverlay('research_panel')}
          onOpenModelInspector={() => setActiveOverlay('model_inspector')}
          onOpenTestArena={() => setActiveOverlay('test_arena')}
        />
      )}

      {/* 2. 571–632 KAPI SEÇİM EKRANI (YENİ HIZLI VE ETKİLEŞİMLİ SİSTEM) */}
      {screen === 'doors_hub' && (
        <YearDoorsHub
          years={curriculum}
          selectedCharacter={progress.character}
          visitedYears={progress.visitedYears || [571]}
          completedYears={progress.completedYears}
          unlockedValues={progress.unlockedValues}
          isMuted={audioSystem.isMuted}
          onSelectYear={handleEnterYear}
          onSelectCharacter={handleSelectCharacter}
          onToggleMute={() => audioSystem.toggleMute()}
          onOpenHistoryJournal={() => setActiveOverlay('history_journal')}
          onOpenValuesJournal={() => setActiveOverlay('values_journal')}
          onOpenSettings={() => setActiveOverlay('settings_modal')}
          onOpenTeacherPanel={() => setActiveOverlay('teacher_panel')}
          onOpenResearchPanel={() => setActiveOverlay('research_panel')}
          onExitToMenu={() => setScreen('menu')}
        />
      )}

      {/* 3. SEÇİLEN YILIN İÇERİĞİ EKRANI */}
      {(screen === 'year_content' || screen === 'game_3d') && (
        <YearContentView
          yearData={currentYearData}
          allYears={curriculum}
          selectedCharacter={progress.character}
          completedYears={progress.completedYears}
          completedMissionIds={progress.completedMissionIds}
          unlockedValues={progress.unlockedValues}
          wrongStrikesInYear={wrongStrikesInCurrentYear}
          isMuted={audioSystem.isMuted}
          onReturnToDoors={handleReturnToDoors}
          onNavigateYear={handleEnterYear}
          onAnswerEvaluated={handleAnswerEvaluated}
          onCompleteValueDiscovery={handleCompleteValueDiscovery}
          onOpenCinematicModal={() => setActiveOverlay('mission_cinematic')}
          onOpenQuestionModal={() => setActiveOverlay('question_modal')}
          onOpenValueModal={() => setActiveOverlay('value_discovery_modal')}
          onOpenHistoryJournal={() => setActiveOverlay('history_journal')}
          onOpenValuesJournal={() => setActiveOverlay('values_journal')}
          onOpenSettings={() => setActiveOverlay('settings_modal')}
          onToggleMute={() => audioSystem.toggleMute()}
          onExitToMenu={() => setScreen('menu')}
        />
      )}

      {/* 4. MODALS & OVERLAYS */}

      {/* Mission Cinematic / Animation Modal */}
      {activeOverlay === 'mission_cinematic' && activeMission && (
        <MissionCinematicModal
          mission={activeMission}
          yearData={currentYearData}
          onCompleteToQuestion={handleCinematicToQuestion}
          onClose={() => setActiveOverlay(null)}
        />
      )}

      {/* Question Modal with 3 Strikes & Reinforcement */}
      {activeOverlay === 'question_modal' && activeMission && (
        <QuestionModal
          mission={activeMission}
          yearData={currentYearData}
          currentStrikes={wrongStrikesInCurrentYear}
          onAnswerEvaluated={handleAnswerEvaluated}
          onReplayCinematic={() => setActiveOverlay('mission_cinematic')}
          onClose={() => setActiveOverlay(null)}
        />
      )}

      {/* Value Discovery Stop Modal */}
      {activeOverlay === 'value_discovery_modal' && activeMission?.valueDiscovery && (
        <ValueDiscoveryModal
          valueData={activeMission.valueDiscovery}
          year={progress.currentYear}
          onCompleteValueDiscovery={handleCompleteValueDiscovery}
        />
      )}

      {/* History Discovery Journal */}
      {activeOverlay === 'history_journal' && (
        <HistoryJournalModal
          years={curriculum}
          progress={progress}
          onClose={() => setActiveOverlay(null)}
        />
      )}

      {/* Values Journal */}
      {activeOverlay === 'values_journal' && (
        <ValuesJournalModal
          progress={progress}
          onClose={() => setActiveOverlay(null)}
        />
      )}

      {/* Lazy-Loaded Heavy Modals */}
      <Suspense fallback={null}>
        {activeOverlay === 'teacher_panel' && (
          <TeacherPanelModal
            years={curriculum}
            onUpdateCurriculum={handleUpdateCurriculum}
            onClose={() => setActiveOverlay(null)}
          />
        )}

        {activeOverlay === 'research_panel' && (
          <ResearchPanelModal
            currentStudent={progress}
            onStartPreTest={() => setActiveOverlay('question_modal')}
            onStartPostTest={() => setActiveOverlay('question_modal')}
            onClose={() => setActiveOverlay(null)}
          />
        )}

        {activeOverlay === 'model_inspector' && (
          <ModelInspectorModal
            initialCharacter={progress.character}
            onClose={() => setActiveOverlay(null)}
          />
        )}

        {activeOverlay === 'test_arena' && (
          <CharacterTestArenaModal
            initialCharacter={progress.character}
            onSelectCharacter={handleSelectCharacter}
            onStartGame={() => {
              setActiveOverlay(null);
              handleStartGame();
            }}
            onClose={() => setActiveOverlay(null)}
          />
        )}
      </Suspense>

      {/* Settings Modal */}
      {activeOverlay === 'settings_modal' && (
        <SettingsModal
          onResetProgress={handleResetProgress}
          isSmartboardMode={isSmartboardMode}
          onToggleSmartboardMode={handleToggleSmartboardMode}
          onClose={() => setActiveOverlay(null)}
        />
      )}

      {/* Fast 62-Year Timeline Drawer / Jump Selector */}
      {activeOverlay === 'timeline_selector' && (
        <YearSelectorModal
          years={curriculum}
          visitedYears={progress.visitedYears || [571]}
          completedYears={progress.completedYears}
          currentYear={progress.currentYear}
          onSelectYearDirect={y => {
            setActiveOverlay(null);
            handleEnterYear(y);
          }}
          onTeleportPortal={y => {
            setActiveOverlay(null);
            handleEnterYear(y);
          }}
          onClose={() => setActiveOverlay(null)}
        />
      )}

      {/* Final 632 Celebration and Certificate */}
      {(screen === 'final_celebration' || activeOverlay === 'year_transition') && (
        <FinalCelebrationModal
          progress={progress}
          onClose={() => setScreen('menu')}
        />
      )}

      {/* Exit & Navigation Confirmation Dialog */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/80 backdrop-blur-md p-4 animate-fadeIn">
          <div className="bg-[#241710] border-2 border-amber-600/70 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl text-center space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-amber-950/80 border-2 border-amber-500/60 flex items-center justify-center mx-auto text-amber-400 shadow-lg">
              <Compass className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black text-amber-100 font-title">
                Zaman Kapılarından Çıkış
              </h3>
              <p className="text-sm text-stone-300">
                571–632 Zaman Kapıları ekranından ana sayfaya dönmek istediğinize emin misiniz? İlerlemeniz otomatik kaydedildi.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="w-full sm:flex-1 py-3 px-4 rounded-2xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-sm transition border border-stone-600"
              >
                Keşfe Devam Et
              </button>

              <button
                onClick={() => {
                  setShowExitConfirm(false);
                  setScreen('menu');
                  audioSystem.playButtonClick();
                }}
                className="w-full sm:flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-rose-700 to-rose-800 hover:from-rose-600 hover:to-rose-700 text-white font-black text-sm transition shadow-lg shadow-rose-950 border border-rose-400 flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Ana Sayfa</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* YouTube Background Music Player (c9pS7Lby3PA) */}
      <YouTubeAudioPlayer
        videoId="c9pS7Lby3PA"
        isMuted={audioSystem.isMuted}
        screen={screen}
        onToggleMute={() => audioSystem.toggleMute()}
      />
    </div>
  );
};
