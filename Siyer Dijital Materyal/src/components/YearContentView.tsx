import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  BookOpen,
  Heart,
  Volume2,
  VolumeX,
  Play,
  Square,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  ShieldCheck,
  Compass,
  Settings,
  LogOut,
  AlertCircle,
  Lightbulb,
  Award,
  Film
} from 'lucide-react';
import { CharacterType, MissionData, RootValueId, YearData } from '../types';
import { ROOT_VALUES } from '../data/rootValues';
import { evaluateStudentAnswer } from '../utils/nlpEvaluator';
import { audioSystem } from '../utils/audioSynthesizer';

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
  onToggleMute: () => void;
  onExitToMenu: () => void;
}

const SCENE_VISUALS: Record<string, { img: string; caption: string }> = {
  mecca: {
    img: '/assets/images/menu_hero.webp',
    caption: 'Mekke-i Mükerreme ve Kâbe-i Muazzama Çevresi'
  },
  madinah: {
    img: '/assets/images/doors_backdrop.webp',
    caption: 'Medine-i Münevvere ve Mescid-i Nebevî İklimi'
  },
  hira: {
    img: '/assets/environment/mecca_mountain_panorama.jpg',
    caption: 'Cebel-i Nûr (Nur Dağı) ve Hira Mağarası Tefekkür İklimi'
  },
  sevr: {
    img: '/assets/environment/pure_mountains.jpg',
    caption: 'Sevr Dağı ve Hicret Yolculuğu'
  },
  badr: {
    img: '/assets/environment/desert_sand_detail.jpg',
    caption: 'Bedir Vadisi ve Tarihsel Karşılaşma Meydanı'
  },
  uhud: {
    img: '/assets/environment/mountain_rock_detail.jpg',
    caption: 'Uhud Dağı Etekleri ve Ayneyn (Okçular) Tepesi'
  },
  hudaybiyyah: {
    img: '/assets/environment/courtyard_marble_detail.jpg',
    caption: 'Hudeybiye Barış Meydanı ve Rıdvân Ağacı'
  }
};

export const YearContentView: React.FC<YearContentViewProps> = ({
  yearData,
  allYears,
  selectedCharacter,
  completedYears,
  completedMissionIds,
  unlockedValues,
  wrongStrikesInYear,
  isMuted,
  onReturnToDoors,
  onNavigateYear,
  onAnswerEvaluated,
  onCompleteValueDiscovery,
  onOpenCinematicModal,
  onOpenQuestionModal,
  onOpenValueModal,
  onOpenHistoryJournal,
  onOpenValuesJournal,
  onOpenSettings,
  onToggleMute,
  onExitToMenu
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [speakingMissionId, setSpeakingMissionId] = useState<string | null>(null);

  // Per-mission interactive state (reset cleanly when year changes)
  const [answerInput, setAnswerInput] = useState<string>('');
  const [answerFeedback, setAnswerFeedback] = useState<{ type: 'idle' | 'success' | 'error'; text: string }>({
    type: 'idle',
    text: ''
  });
  const [showHintLevel, setShowHintLevel] = useState<number>(0);
  const [selectedReinforcement, setSelectedReinforcement] = useState<number | null>(null);
  const [selectedRecognitionIdx, setSelectedRecognitionIdx] = useState<number | null>(null);
  const [selectedScenarioId, setSelectedScenarioId] = useState<string | null>(null);
  const [userReflection, setUserReflection] = useState<string>('');
  const [valueSavedMessage, setValueSavedMessage] = useState<boolean>(false);

  const hasVerifiedContent = Boolean(
    yearData.hasVerifiedContent !== false && yearData.missions && yearData.missions.length > 0
  );

  // Clean up speech synthesis & reset local state whenever year changes
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setSpeakingMissionId(null);
    setAnswerInput('');
    setAnswerFeedback({ type: 'idle', text: '' });
    setShowHintLevel(0);
    setSelectedReinforcement(null);
    setSelectedRecognitionIdx(null);
    setSelectedScenarioId(null);
    setUserReflection('');
    setValueSavedMessage(false);

    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }

    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [yearData.year]);

  const handleToggleSpeech = (mission: MissionData) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (speakingMissionId === mission.id) {
      window.speechSynthesis.cancel();
      setSpeakingMissionId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(
      `${yearData.year} Yılı. ${mission.title}. ${ yearData.historicalSummary } ${mission.narrativeText}`
    );
    utterance.lang = 'tr-TR';
    utterance.rate = 0.95;
    utterance.onend = () => setSpeakingMissionId(null);
    utterance.onerror = () => setSpeakingMissionId(null);

    setSpeakingMissionId(mission.id);
    window.speechSynthesis.speak(utterance);
  };

  const handleCheckAnswer = (mission: MissionData, e: React.FormEvent) => {
    e.preventDefault();
    if (!answerInput.trim()) return;

    const result = evaluateStudentAnswer(
      answerInput,
      mission.correctAnswer,
      mission.alternativeAnswers
    );

    if (result.isCorrect) {
      audioSystem.playSuccessChime();
      setAnswerFeedback({ type: 'success', text: result.feedback });
      onAnswerEvaluated(true, false);
    } else {
      audioSystem.playWrongChime();
      const nextHint = Math.min(2, showHintLevel + 1);
      setShowHintLevel(nextHint);
      setAnswerFeedback({
        type: 'error',
        text: `${result.feedback} İpucu aşağıda açıldı.`
      });
      onAnswerEvaluated(false, false);
    }
  };

  const handleSelectScenarioOption = (
    mission: MissionData,
    opt: { id: string; text: string; isAppropriate: boolean; feedback: string }
  ) => {
    setSelectedScenarioId(opt.id);
    if (opt.isAppropriate) {
      audioSystem.playSuccessChime();
      onCompleteValueDiscovery(
        userReflection.trim() || 'Değer etkinliği başarıyla tamamlandı.',
        opt.id,
        true
      );
      setValueSavedMessage(true);
    } else {
      audioSystem.playWrongChime();
    }
  };

  const prevYear = yearData.year > 571 ? yearData.year - 1 : null;
  const nextYear = yearData.year < 632 ? yearData.year + 1 : null;
  const isYearDone = completedYears.includes(yearData.year);
  const sceneVisual = SCENE_VISUALS[yearData.sceneEnvironment] || SCENE_VISUALS.mecca;

  const verifiedYearNumbers = allYears
    .filter((y) => y.hasVerifiedContent !== false && y.missions && y.missions.length > 0)
    .map((y) => y.year);

  return (
    <div className="relative w-full h-screen overflow-hidden flex flex-col bg-[#160d06] text-stone-100 select-none">
      
      {/* 1. TOP NAVIGATION BAR (D. Navigasyon: Kapılar Ekranına Dön / Önceki Yıl / Sonraki Yıl) */}
      <header className="relative z-20 w-full bg-stone-950/95 border-b border-amber-600/40 px-3 sm:px-6 py-2.5 shrink-0">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          
          {/* Left: Return to Doors Screen & Prev/Next Year */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              id="btn-return-to-doors"
              onClick={onReturnToDoors}
              className="flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black text-xs sm:text-sm shadow-lg border border-amber-200 transition active:scale-95"
            >
              <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
              <span>Kapılar Ekranına Dön</span>
            </button>

            <div className="flex items-center gap-1 bg-stone-900 border border-amber-600/40 rounded-2xl p-1">
              <button
                type="button"
                id="btn-prev-year"
                disabled={!prevYear}
                onClick={() => prevYear && onNavigateYear(prevYear)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold transition ${
                  prevYear
                    ? 'hover:bg-amber-500/20 text-amber-200 cursor-pointer'
                    : 'opacity-35 text-stone-500 cursor-not-allowed'
                }`}
                title={prevYear ? `${prevYear} Yılına Git` : 'İlk yıldasınız (571)'}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Önceki Yıl</span>
                {prevYear && <span className="font-black">({prevYear})</span>}
              </button>

              <div className="h-4 w-px bg-stone-700" />

              <button
                type="button"
                id="btn-next-year"
                disabled={!nextYear}
                onClick={() => nextYear && onNavigateYear(nextYear)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold transition ${
                  nextYear
                    ? 'hover:bg-amber-500/20 text-amber-200 cursor-pointer'
                    : 'opacity-35 text-stone-500 cursor-not-allowed'
                }`}
                title={nextYear ? `${nextYear} Yılına Git` : 'Son yıldasınız (632)'}
              >
                <span className="hidden sm:inline">Sonraki Yıl</span>
                {nextYear && <span className="font-black">({nextYear})</span>}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right: Active Character Badge + Journals + Settings */}
          <div className="flex items-center gap-2">
            {/* Active Guide Character */}
            <div className="hidden sm:flex items-center gap-2 bg-stone-900 border border-amber-500/40 rounded-2xl px-2.5 py-1">
              <img
                src={
                  selectedCharacter === 'aybuke'
                    ? '/assets/images/aybuke_3d_clean.webp'
                    : '/assets/images/eren_3d_clean.webp'
                }
                alt={selectedCharacter === 'aybuke' ? 'Aybüke' : 'Eren'}
                className="w-6 h-6 object-contain"
              />
              <span className="text-xs font-bold text-amber-200">
                Rehber: {selectedCharacter === 'aybuke' ? 'Aybüke' : 'Eren'}
              </span>
            </div>

            <button
              type="button"
              onClick={onOpenHistoryJournal}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-700 text-xs font-bold text-amber-200 transition"
              title="Tarih Keşif Defteri"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">Tarih Defteri</span>
            </button>

            <button
              type="button"
              onClick={onOpenValuesJournal}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-700 text-xs font-bold text-emerald-200 transition"
              title="Değer Keşif Defteri"
            >
              <Heart className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden md:inline">Değerler</span>
              <span className="bg-emerald-600 text-white text-[10px] px-1.5 rounded-full font-black">
                {unlockedValues.length}/10
              </span>
            </button>

            <button
              type="button"
              onClick={onOpenSettings}
              className="p-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-700 text-amber-300 transition"
              title="Ayarlar"
            >
              <Settings className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onToggleMute}
              className="p-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-700 text-amber-300 transition"
              title={isMuted ? 'Sesi Aç' : 'Sesi Kapat'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
            </button>

            <button
              type="button"
              onClick={onExitToMenu}
              className="p-1.5 rounded-xl bg-rose-800 hover:bg-rose-700 border border-rose-500 text-white transition"
              title="Ana Sayfaya Çık"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. SCROLLABLE MAIN CONTENT BODY */}
      <main
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto overflow-x-hidden px-3 sm:px-6 py-5 space-y-6 max-w-6xl mx-auto w-full"
      >
        
        {/* SECTION A: YILIN TANITIMI (YEAR INTRODUCTION HERO) */}
        <section
          aria-label="Yılın Tanıtımı"
          className="relative rounded-3xl border-2 border-amber-500/60 overflow-hidden shadow-2xl p-5 sm:p-7"
          style={{
            background: 'linear-gradient(135deg, #2d180a 0%, #1c0f06 65%, #3a1f0d 100%)'
          }}
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
            <div className="space-y-2.5 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  id="year-content-heading-badge"
                  className="px-4 py-1 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-600 text-stone-950 font-black text-xl sm:text-2xl shadow font-title"
                >
                  {yearData.year} Yılı
                </span>

                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-stone-900/90 border border-amber-500/40 text-xs font-bold text-amber-300">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>{yearData.location}</span>
                </span>

                {isYearDone && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-emerald-950 border border-emerald-500/60 text-xs font-black text-emerald-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Bu Yılın Etkinliği Tamamlandı</span>
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-amber-100 font-title leading-tight">
                {yearData.title}
              </h1>

              <p className="text-xs sm:text-sm font-bold text-amber-400/90 uppercase tracking-wider">
                {yearData.subTitle}
              </p>

              <p className="text-sm sm:text-base text-stone-200 leading-relaxed pt-1">
                {yearData.historicalSummary}
              </p>
            </div>

            {/* Active Character Companion Card */}
            <div className="flex items-center gap-3 bg-stone-950/80 border border-amber-500/40 rounded-2xl p-3 shrink-0 self-stretch md:self-center">
              <img
                src={
                  selectedCharacter === 'aybuke'
                    ? '/assets/images/aybuke_3d_clean.webp'
                    : '/assets/images/eren_3d_clean.webp'
                }
                alt={selectedCharacter === 'aybuke' ? 'Aybüke' : 'Eren'}
                className="w-16 h-20 sm:w-20 sm:h-24 object-contain drop-shadow"
              />
              <div className="max-w-[200px] space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 block">
                  {selectedCharacter === 'aybuke' ? 'Aybüke Diyor ki:' : 'Eren Diyor ki:'}
                </span>
                <p className="text-xs text-stone-300 leading-snug">
                  {hasVerifiedContent
                    ? `"${yearData.year} yılındaki tarihsel olayları, kaynakları ve kök değerlerimizi birlikte inceleyelim!"`
                    : `"${yearData.year} yılı kapısındayız. Doğrulanmış olay kayıtları olan yıllara da hemen geçiş yapabilirsin."`}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CASE 1: UNVERIFIED YEAR — SHOW HONEST MESSAGE WITHOUT FABRICATING EVENTS */}
        {!hasVerifiedContent ? (
          <section
            aria-label="Doğrulanmış İçerik Bilgilendirmesi"
            className="rounded-3xl bg-stone-900/90 border-2 border-amber-600/40 p-6 sm:p-8 text-center space-y-5 shadow-xl"
          >
            <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center mx-auto text-amber-400">
              <AlertCircle className="w-8 h-8" />
            </div>

            <div className="space-y-2 max-w-xl mx-auto">
              <h2
                id="unverified-year-message"
                className="text-lg sm:text-xl font-black text-amber-200"
              >
                Bu yıla ait doğrulanmış içerik henüz eklenmedi.
              </h2>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                Dijital Siyer Yolculuğu projesinde tarihsel doğruluk ilkesi gereği yalnızca muteber Siyer kaynaklarında ({' '}
                <em>İbn Hişâm, Buhârî, Müslim, İbn Sa&apos;d, Taberî, TDV İslam Ansiklopedisi</em>) yılı kesin olarak
                kaydedilmiş doğrulanmış olaylar yer almaktadır.
              </p>
            </div>

            {/* Quick Jump to Verified Historical Years */}
            <div className="pt-2 space-y-2.5">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                Doğrulanmış Tarihsel Olay Kaydı Bulunan Yıllar:
              </span>
              <div className="flex flex-wrap items-center justify-center gap-1.5 max-w-3xl mx-auto">
                {verifiedYearNumbers.map((vYear) => (
                  <button
                    key={vYear}
                    type="button"
                    onClick={() => onNavigateYear(vYear)}
                    className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500 hover:text-stone-950 text-amber-200 border border-amber-500/50 text-xs font-black transition"
                  >
                    {vYear} Yılı
                  </button>
                ))}
              </div>
            </div>
          </section>
        ) : (
          /* CASE 2: VERIFIED YEAR — RENDER HISTORICAL EVENT STOPS & VALUE DISCOVERY STOPS */
          <>
            {yearData.missions.map((mission, index) => {
              const isMissionDone = completedMissionIds.includes(mission.id);
              const valDef = mission.valueDiscovery
                ? ROOT_VALUES[mission.valueDiscovery.valueId]
                : null;
              const isSpeaking = speakingMissionId === mission.id;

              return (
                <div key={mission.id} className="space-y-6">
                  
                  {/* SECTION B: TARİHSEL OLAY DURAĞI */}
                  <section
                    aria-label="Tarihsel Olay Durağı"
                    className="rounded-3xl bg-stone-900/95 border-2 border-amber-600/50 overflow-hidden shadow-2xl"
                  >
                    {/* Stop Header */}
                    <div className="px-5 sm:px-6 py-4 bg-gradient-to-r from-stone-950 via-amber-950/40 to-stone-950 border-b border-amber-600/30 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 rounded-xl bg-amber-500 text-stone-950 font-black text-xs uppercase tracking-wider">
                          Tarihsel Olay Durağı {yearData.missions.length > 1 ? `#${index + 1}` : ''}
                        </span>
                        <h2 className="text-lg sm:text-xl font-black text-amber-100">
                          {mission.title}
                        </h2>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Voiceover Narration Button */}
                        <button
                          type="button"
                          onClick={() => handleToggleSpeech(mission)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                            isSpeaking
                              ? 'bg-rose-600 text-white border-rose-300'
                              : 'bg-amber-500/20 hover:bg-amber-500/35 text-amber-200 border-amber-400/50'
                          }`}
                        >
                          {isSpeaking ? (
                            <>
                              <Square className="w-3.5 h-3.5 fill-current" />
                              <span>Sesli Anlatımı Durdur</span>
                            </>
                          ) : (
                            <>
                              <Play className="w-3.5 h-3.5 fill-current" />
                              <span>Sesli Anlatımı Dinle</span>
                            </>
                          )}
                        </button>

                        {/* Cinematic Animation Modal Trigger */}
                        <button
                          type="button"
                          onClick={onOpenCinematicModal}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-950/90 hover:bg-purple-900 text-purple-200 border border-purple-400/50 text-xs font-bold transition"
                        >
                          <Film className="w-3.5 h-3.5 text-purple-300" />
                          <span>Canlandırma Sahnesi</span>
                        </button>
                      </div>
                    </div>

                    {/* Event Body: Visual Illustration + Narrative + Subtitles + Historical Source */}
                    <div className="p-5 sm:p-6 space-y-5">
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                        
                        {/* Event Visual Card */}
                        <div className="lg:col-span-5 relative rounded-2xl overflow-hidden border border-amber-500/40 min-h-[210px] flex flex-col justify-end bg-stone-950">
                          <img
                            src={sceneVisual.img}
                            alt={mission.title}
                            loading="lazy"
                            className="absolute inset-0 w-full h-full object-cover opacity-80"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/35 to-transparent" />
                          <div className="relative z-10 p-4 space-y-1">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-amber-500/90 text-stone-950 text-[10px] font-black uppercase">
                              <MapPin className="w-3 h-3" />
                              {mission.targetLabel}
                            </span>
                            <p className="text-xs font-semibold text-amber-100 drop-shadow">
                              {sceneVisual.caption}
                            </p>
                          </div>
                        </div>

                        {/* Historical Narrative & Chronological Steps */}
                        <div className="lg:col-span-7 flex flex-col justify-between space-y-4 bg-stone-950/70 border border-stone-800 rounded-2xl p-4 sm:p-5">
                          <div className="space-y-2.5">
                            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                              Tarihsel Olay Anlatımı
                            </span>
                            <p className="text-sm sm:text-base text-stone-200 leading-relaxed">
                              {mission.narrativeText}
                            </p>
                          </div>

                          {mission.subtitles && mission.subtitles.length > 0 && (
                            <div className="space-y-1.5 pt-2 border-t border-stone-800/80">
                              <span className="text-[11px] font-bold text-amber-300/90 uppercase tracking-wider block">
                                Önemli Noktalar:
                              </span>
                              <ul className="space-y-1">
                                {mission.subtitles.map((sub, idx) => (
                                  <li
                                    key={idx}
                                    className="flex items-start gap-2 text-xs text-stone-300"
                                  >
                                    <span className="text-amber-400 font-black">•</span>
                                    <span>{sub.text}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Verified Historical Source Box */}
                      <div className="rounded-2xl bg-amber-950/25 border border-amber-600/40 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                          <div className="space-y-0.5">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-xs font-black text-amber-300 uppercase tracking-wider">
                                Tarihsel Kaynak:
                              </span>
                              <span className="text-xs sm:text-sm font-bold text-stone-100">
                                {yearData.historicalSource.sourceName}
                              </span>
                            </div>
                            <p className="text-xs text-stone-300">
                              Referans: <strong>{yearData.historicalSource.authorOrRef}</strong>
                              {yearData.historicalSource.notes ? ` — ${yearData.historicalSource.notes}` : ''}
                            </p>
                          </div>
                        </div>

                        <span className="px-3 py-1 rounded-xl bg-amber-500/20 border border-amber-400/50 text-[11px] font-black text-amber-200 shrink-0">
                          {yearData.historicalSource.certaintyLevel}
                        </span>
                      </div>

                      {/* Historical Knowledge Question & Reinforcement */}
                      <div className="rounded-2xl bg-stone-950/90 border border-stone-700/80 p-4 sm:p-5 space-y-4">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <HelpCircle className="w-5 h-5 text-amber-400" />
                            <h3 className="text-sm sm:text-base font-black text-amber-200">
                              Tarihsel Bilgi Sorusu &amp; Etkinliği
                            </h3>
                          </div>
                          <button
                            type="button"
                            onClick={onOpenQuestionModal}
                            className="text-xs font-bold text-amber-300 hover:text-amber-200 underline"
                          >
                            Tam Ekran Soru Penceresinde Aç
                          </button>
                        </div>

                        <p className="text-sm sm:text-base font-bold text-stone-100">
                          {mission.question}
                        </p>

                        <form onSubmit={(e) => handleCheckAnswer(mission, e)} className="flex flex-col sm:flex-row gap-2">
                          <input
                            type="text"
                            value={answerInput}
                            onChange={(e) => setAnswerInput(e.target.value)}
                            placeholder="Cevabınızı buraya yazın..."
                            className="flex-1 px-4 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-400"
                          />
                          <button
                            type="submit"
                            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black text-xs sm:text-sm transition shrink-0"
                          >
                            Cevabı Kontrol Et
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowHintLevel((prev) => Math.min(2, prev + 1))}
                            className="px-3.5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-300 font-bold text-xs border border-stone-600 transition shrink-0 flex items-center gap-1"
                          >
                            <Lightbulb className="w-3.5 h-3.5" />
                            <span>İpucu Al</span>
                          </button>
                        </form>

                        {showHintLevel >= 1 && (
                          <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 text-xs text-amber-200 space-y-1">
                            <p>
                              <strong>1. İpucu:</strong> {mission.hint1}
                            </p>
                            {showHintLevel >= 2 && (
                              <p>
                                <strong>2. İpucu:</strong> {mission.hint2}
                              </p>
                            )}
                          </div>
                        )}

                        {answerFeedback.type !== 'idle' && (
                          <div
                            className={`p-3 rounded-xl text-xs sm:text-sm font-bold border ${
                              answerFeedback.type === 'success'
                                ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-200'
                                : 'bg-rose-950/60 border-rose-500/60 text-rose-200'
                            }`}
                          >
                            <p>{answerFeedback.text}</p>
                            <p className="mt-1 text-xs font-normal text-stone-300">
                              {mission.thirdLevelExplanation}
                            </p>
                          </div>
                        )}

                        {/* Multiple-Choice Reinforcement Activity */}
                        {mission.reinforcement && (
                          <div className="pt-3 border-t border-stone-800 space-y-2.5">
                            <span className="text-xs font-bold text-amber-300 block">
                              Pekiştirme Sorusu: {mission.reinforcement.question}
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {mission.reinforcement.options.map((opt, oIdx) => {
                                const isChosen = selectedReinforcement === oIdx;
                                const isRight = oIdx === mission.reinforcement.correctIndex;
                                return (
                                  <button
                                    key={oIdx}
                                    type="button"
                                    onClick={() => {
                                      setSelectedReinforcement(oIdx);
                                      if (isRight) {
                                        audioSystem.playSuccessChime();
                                        onAnswerEvaluated(true, true);
                                      } else {
                                        audioSystem.playWrongChime();
                                      }
                                    }}
                                    className={`text-left px-3.5 py-2.5 rounded-xl text-xs font-bold border transition ${
                                      isChosen
                                        ? isRight
                                          ? 'bg-emerald-900/70 border-emerald-400 text-emerald-100'
                                          : 'bg-rose-900/70 border-rose-400 text-rose-100'
                                        : 'bg-stone-900 hover:bg-stone-800 border-stone-700 text-stone-200'
                                    }`}
                                  >
                                    {opt}
                                  </button>
                                );
                              })}
                            </div>
                            {selectedReinforcement !== null && (
                              <p className="text-xs text-amber-200/90 bg-stone-900 p-2.5 rounded-xl border border-stone-700">
                                <strong>Not:</strong> {mission.reinforcement.reinforcementNote}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </section>

                  {/* SECTION C: DEĞER KEŞİF DURAĞI (VALUE DISCOVERY STOP) */}
                  {mission.valueDiscovery && valDef && (
                    <section
                      aria-label="Değer Keşif Durağı"
                      className="rounded-3xl bg-gradient-to-br from-[#13261c] via-[#111c17] to-[#1a140b] border-2 border-emerald-500/50 overflow-hidden shadow-2xl"
                    >
                      <div className="px-5 sm:px-6 py-4 bg-emerald-950/60 border-b border-emerald-500/30 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <span className="px-3 py-1 rounded-xl bg-emerald-500 text-stone-950 font-black text-xs uppercase tracking-wider flex items-center gap-1">
                            <Award className="w-3.5 h-3.5" />
                            <span>Değer Keşif Durağı</span>
                          </span>
                          <h2 className="text-lg sm:text-xl font-black text-emerald-200">
                            Kök Değerimiz: {valDef.name}
                          </h2>
                        </div>

                        <button
                          type="button"
                          onClick={onOpenValueModal}
                          className="text-xs font-bold text-emerald-300 hover:text-emerald-200 underline"
                        >
                          Tam Ekran Değer Etkinliğinde Aç
                        </button>
                      </div>

                      <div className="p-5 sm:p-6 space-y-5">
                        {/* Root Value Description */}
                        <div className="rounded-2xl bg-stone-950/70 border border-emerald-500/30 p-4 space-y-1">
                          <span className="text-xs font-black text-emerald-400 uppercase tracking-wider">
                            {valDef.name} Nedir?
                          </span>
                          <p className="text-sm text-stone-200 leading-relaxed">
                            {valDef.description}
                          </p>
                        </div>

                        {/* 1. Recognition Question */}
                        <div className="space-y-2.5">
                          <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
                            1. Düşündüren Değer Sorusu:
                          </span>
                          <p className="text-sm sm:text-base font-bold text-stone-100">
                            {mission.valueDiscovery.recognitionQuestion}
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {mission.valueDiscovery.recognitionOptions.map((rOpt, rIdx) => {
                              const chosen = selectedRecognitionIdx === rIdx;
                              const isCorrect = rIdx === mission.valueDiscovery!.correctRecognitionIndex;
                              return (
                                <button
                                  key={rIdx}
                                  type="button"
                                  onClick={() => {
                                    setSelectedRecognitionIdx(rIdx);
                                    if (isCorrect) audioSystem.playSuccessChime();
                                  }}
                                  className={`text-left px-3.5 py-2 rounded-xl text-xs font-bold border transition ${
                                    chosen
                                      ? isCorrect
                                        ? 'bg-emerald-900/80 border-emerald-400 text-emerald-100'
                                        : 'bg-rose-900/80 border-rose-400 text-rose-100'
                                      : 'bg-stone-900/90 hover:bg-stone-800 border-stone-700 text-stone-200'
                                  }`}
                                >
                                  {rOpt}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* 2. Reflection Prompt */}
                        <div className="space-y-2">
                          <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider block">
                            2. Tefekkür ve Yorumlama:
                          </span>
                          <p className="text-sm font-semibold text-stone-100">
                            {mission.valueDiscovery.explanationPrompt}
                          </p>
                          <p className="text-xs text-stone-400 italic">
                            Rehber Notu: {mission.valueDiscovery.explanationGuide}
                          </p>
                          <textarea
                            rows={2}
                            value={userReflection}
                            onChange={(e) => setUserReflection(e.target.value)}
                            placeholder="Düşünceni kısaca buraya yazabilirsin..."
                            className="w-full px-3.5 py-2 rounded-xl bg-stone-950 border border-stone-700 text-xs sm:text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-emerald-400"
                          />
                        </div>

                        {/* 3. Daily Life Scenario Activity */}
                        <div className="space-y-2.5 pt-2 border-t border-emerald-800/40">
                          <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
                            3. Günlük Yaşam Senaryosu: {mission.valueDiscovery.scenarioTitle}
                          </span>
                          <p className="text-sm sm:text-base font-bold text-stone-100">
                            {mission.valueDiscovery.scenarioQuestion}
                          </p>
                          <div className="space-y-2">
                            {mission.valueDiscovery.scenarioOptions.map((sOpt) => {
                              const isSelected = selectedScenarioId === sOpt.id;
                              return (
                                <button
                                  key={sOpt.id}
                                  type="button"
                                  onClick={() => handleSelectScenarioOption(mission, sOpt)}
                                  className={`w-full text-left p-3.5 rounded-2xl border text-xs sm:text-sm font-semibold transition ${
                                    isSelected
                                      ? sOpt.isAppropriate
                                        ? 'bg-emerald-950/90 border-emerald-400 text-emerald-100'
                                        : 'bg-rose-950/90 border-rose-400 text-rose-100'
                                      : 'bg-stone-950/80 hover:bg-stone-900 border-stone-700 text-stone-200'
                                  }`}
                                >
                                  <div className="flex items-center justify-between gap-2">
                                    <span>{sOpt.text}</span>
                                    {isSelected && (
                                      <span className="text-[11px] font-black px-2 py-0.5 rounded-full bg-black/40">
                                        {sOpt.isAppropriate ? '✓ Doğru Yaklaşım' : '✕ Uygun Değil'}
                                      </span>
                                    )}
                                  </div>
                                  {isSelected && (
                                    <p className="mt-1.5 text-xs font-normal opacity-90">
                                      {sOpt.feedback}
                                    </p>
                                  )}
                                </button>
                              );
                            })}
                          </div>

                          {valueSavedMessage && (
                            <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-400 text-xs font-bold text-emerald-200 flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                              <span>
                                Tebrikler! &ldquo;{valDef.name}&rdquo; kök değeri Değer Keşif Defterine kaydedildi!
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </section>
                  )}
                </div>
              );
            })}
          </>
        )}

        {/* SECTION D: BOTTOM NAVIGATION FOOTER */}
        <footer className="pt-2 pb-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            disabled={!prevYear}
            onClick={() => prevYear && onNavigateYear(prevYear)}
            className={`w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-2xl border font-bold text-xs sm:text-sm transition ${
              prevYear
                ? 'bg-stone-900 hover:bg-stone-800 border-amber-500/50 text-amber-200 cursor-pointer'
                : 'bg-stone-950 border-stone-800 text-stone-600 cursor-not-allowed'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{prevYear ? `Önceki Yıla Git (${prevYear})` : '571 (Başlangıç Yılı)'}</span>
          </button>

          <button
            type="button"
            onClick={onReturnToDoors}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black text-xs sm:text-sm shadow-xl border border-amber-200 transition"
          >
            <Compass className="w-4 h-4 stroke-[2.5]" />
            <span>571–632 Kapılar Ekranına Dön</span>
          </button>

          <button
            type="button"
            disabled={!nextYear}
            onClick={() => nextYear && onNavigateYear(nextYear)}
            className={`w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-2xl border font-bold text-xs sm:text-sm transition ${
              nextYear
                ? 'bg-stone-900 hover:bg-stone-800 border-amber-500/50 text-amber-200 cursor-pointer'
                : 'bg-stone-950 border-stone-800 text-stone-600 cursor-not-allowed'
            }`}
          >
            <span>{nextYear ? `Sonraki Yıla Git (${nextYear})` : '632 (Son Yıl)'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </footer>

      </main>
    </div>
  );
};
