import React, { useState, useEffect } from 'react';
import {
  Film,
  HelpCircle,
  Heart,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  ArrowRight,
  RotateCcw,
  Volume2,
  X,
  BookOpen,
  Award,
  MessageSquare
} from 'lucide-react';
import { EventStationData, RootValueId, YearData } from '../types';
import { getMediaObjectUrl, getMediaMetadata } from '../utils/mediaStore';
import { audioSystem } from '../utils/audioSynthesizer';

interface StationLearningModalProps {
  yearData: YearData;
  station: EventStationData;
  isLastStationInYear: boolean;
  onClose: () => void;
  onOpenStorytellerAudio: () => void;
  onStationCompleted: (
    stationId: number,
    unlockedValueIds: RootValueId[],
    userReflection: string,
    choiceId: string
  ) => void;
  onAnswerAttempt?: (isCorrect: boolean) => void;
}

export type LearningStage =
  | 'stage_2_video'
  | 'stage_3_event_question'
  | 'stage_4_value_question'
  | 'stage_5_daily_life'
  | 'stage_6_completed';

export const StationLearningModal: React.FC<StationLearningModalProps> = ({
  yearData,
  station,
  isLastStationInYear,
  onClose,
  onOpenStorytellerAudio,
  onStationCompleted,
  onAnswerAttempt
}) => {
  const [stage, setStage] = useState<LearningStage>('stage_2_video');

  // Stage 2: Video / Animation state
  const [resolvedVideoUrl, setResolvedVideoUrl] = useState<string | null>(null);
  const [videoFileName, setVideoFileName] = useState<string | null>(null);
  const [isLoadingVideo, setIsLoadingVideo] = useState<boolean>(true);
  const [videoWatchedOrReady, setVideoWatchedOrReady] = useState<boolean>(false);

  // Stage 3: Event Question(s) state
  const eventQuestionsList = React.useMemo(() => {
    if (station.eventQuestions && station.eventQuestions.length > 0) {
      return station.eventQuestions;
    }
    return [
      {
        id: `eq_${station.id}_1`,
        questionType: station.eventQuestion.questionType || 'multiple_choice',
        questionText: station.eventQuestion.questionText,
        options: station.eventQuestion.options,
        correctIndex: station.eventQuestion.correctIndex,
        hint: station.hint,
        explanation: station.eventQuestion.explanation,
        imageUrl: station.eventQuestion.imageUrl
      }
    ];
  }, [station]);

  const [currentEventQIndex, setCurrentEventQIndex] = useState<number>(0);
  const [selectedEventOption, setSelectedEventOption] = useState<number | null>(null);
  const [openEndedEventAnswer, setOpenEndedEventAnswer] = useState<string>('');
  const [eventQuestionSolved, setEventQuestionSolved] = useState<boolean>(false);
  const [eventHintText, setEventHintText] = useState<string | null>(null);

  // Stage 4: Value Discovery Question ("Bu olayda hangi değer ön plana çıkmaktadır?")
  const valueRecQuestion = React.useMemo(() => {
    if (station.valueRecognitionQuestion) {
      return station.valueRecognitionQuestion;
    }
    const valName = station.valueQuestion.valueName || 'Adalet ve Merhamet';
    return {
      questionText: 'Bu olayda hangi değer ön plana çıkmaktadır?',
      options: [valName, 'Gösteriş', 'Acelecilik', 'Bencillik'],
      correctIndex: 0,
      correctValueId: station.valueQuestion.valueId,
      hint: station.valueQuestion.historicalConnection,
      explanation: `Bu tarihsel olayda "${valName}" değeri ön plana çıkmaktadır.`
    };
  }, [station]);

  const [selectedValueRecOption, setSelectedValueRecOption] = useState<number | null>(null);
  const [valueRecSolved, setValueRecSolved] = useState<boolean>(false);
  const [valueRecHintText, setValueRecHintText] = useState<string | null>(null);

  // Stage 5: Daily Life Question
  const dailyQuestion = React.useMemo(() => {
    if (station.dailyLifeQuestion) {
      return station.dailyLifeQuestion;
    }
    return {
      questionType: 'multiple_choice' as const,
      questionText: station.valueQuestion.questionText,
      options: station.valueQuestion.options,
      openEndedGuide: `Bu değeri günlük hayatında nasıl uygulayabileceğini kısaca paylaşabilirsin.`,
      openEndedFeedback: `Tebrikler! ${station.valueQuestion.valueName} değerini günlük hayatla çok güzel ilişkilendirdin.`
    };
  }, [station]);

  const [selectedDailyOptionId, setSelectedDailyOptionId] = useState<string | null>(null);
  const [dailyOpenEndedText, setDailyOpenEndedText] = useState<string>('');
  const [dailySolved, setDailySolved] = useState<boolean>(false);
  const [dailyFeedback, setDailyFeedback] = useState<string | null>(null);

  // Resolve video from IndexedDB or URL
  useEffect(() => {
    let mounted = true;
    setIsLoadingVideo(true);
    setStage('stage_2_video');
    setCurrentEventQIndex(0);
    setSelectedEventOption(null);
    setOpenEndedEventAnswer('');
    setEventQuestionSolved(false);
    setEventHintText(null);
    setSelectedValueRecOption(null);
    setValueRecSolved(false);
    setValueRecHintText(null);
    setSelectedDailyOptionId(null);
    setDailyOpenEndedText('');
    setDailySolved(false);
    setDailyFeedback(null);

    async function loadVideo() {
      if (station.videoId) {
        const blobUrl = await getMediaObjectUrl(station.videoId);
        const meta = await getMediaMetadata(station.videoId);
        if (mounted && blobUrl) {
          setResolvedVideoUrl(blobUrl);
          setVideoFileName(meta?.fileName || station.videoTitle || 'Olay Animasyonu');
          setIsLoadingVideo(false);
          setVideoWatchedOrReady(true);
          return;
        }
      }
      if (station.animation && station.animation.trim() !== '') {
        if (mounted) {
          setResolvedVideoUrl(station.animation.trim());
          setVideoFileName(station.videoTitle || 'Olay Animasyonu');
          setIsLoadingVideo(false);
          setVideoWatchedOrReady(true);
          return;
        }
      }
      // No video uploaded yet — do NOT lock the student!
      if (mounted) {
        setResolvedVideoUrl(null);
        setVideoFileName(null);
        setIsLoadingVideo(false);
        setVideoWatchedOrReady(true);
      }
    }

    loadVideo();
    return () => {
      mounted = false;
    };
  }, [station]);

  const currentEventQuestion = eventQuestionsList[currentEventQIndex] || eventQuestionsList[0];

  // Evaluate Stage 3: Event Question
  const handleSelectEventOption = (idx: number) => {
    if (eventQuestionSolved) return;
    setSelectedEventOption(idx);

    const isCorrect = idx === currentEventQuestion.correctIndex;
    onAnswerAttempt?.(isCorrect);

    if (isCorrect) {
      audioSystem.playSuccessChime();
      setEventQuestionSolved(true);
      setEventHintText(null);
    } else {
      audioSystem.playErrorBuzz();
      setEventHintText(
        currentEventQuestion.hint ||
          station.hint ||
          'Tarihsel anlatımdaki anahtar bilgileri tekrar düşünerek doğru seçeneği bulabilirsin.'
      );
    }
  };

  const handleOpenEndedEventSubmit = () => {
    const clean = openEndedEventAnswer.trim();
    if (clean.length < 2) {
      setEventHintText('Lütfen cevabınızı kısaca yazınız.');
      return;
    }
    audioSystem.playSuccessChime();
    onAnswerAttempt?.(true);
    setEventQuestionSolved(true);
    setEventHintText(null);
  };

  const handleAdvanceFromEventQuestion = () => {
    if (currentEventQIndex + 1 < eventQuestionsList.length) {
      setCurrentEventQIndex(prev => prev + 1);
      setSelectedEventOption(null);
      setOpenEndedEventAnswer('');
      setEventQuestionSolved(false);
      setEventHintText(null);
    } else {
      audioSystem.playButtonClick();
      setStage('stage_4_value_question');
    }
  };

  // Evaluate Stage 4: Value Discovery Question
  const handleSelectValueRecOption = (idx: number) => {
    if (valueRecSolved) return;
    setSelectedValueRecOption(idx);

    const isCorrect = idx === valueRecQuestion.correctIndex;
    onAnswerAttempt?.(isCorrect);

    if (isCorrect) {
      audioSystem.playSuccessChime();
      setValueRecSolved(true);
      setValueRecHintText(null);
    } else {
      audioSystem.playErrorBuzz();
      setValueRecHintText(
        valueRecQuestion.hint ||
          `Tekrar düşünelim: Bu tarihsel olayda Peygamber Efendimizin (s.a.v.) ve sahabilerin sergilediği örnek erdemi hatırla.`
      );
    }
  };

  // Evaluate Stage 5: Daily Life Question
  const handleSelectDailyOption = (optId: string) => {
    if (dailySolved) return;
    const opt = dailyQuestion.options.find(o => o.id === optId);
    if (!opt) return;

    setSelectedDailyOptionId(optId);
    setDailyFeedback(opt.feedback);

    if (opt.isAppropriate) {
      audioSystem.playSuccessChime();
      setDailySolved(true);
    } else {
      audioSystem.playErrorBuzz();
    }
  };

  const handleOpenEndedDailySubmit = () => {
    const clean = dailyOpenEndedText.trim();
    if (clean.length < 5) {
      setDailyFeedback('Lütfen bu değeri günlük hayatında nasıl uygulayacağını en az bir cümleyle paylaş.');
      return;
    }
    audioSystem.playSuccessChime();
    setDailySolved(true);
    setDailyFeedback(
      dailyQuestion.openEndedFeedback ||
        `Tebrikler! Düşünceni çok güzel ifade ettin. ${station.valueQuestion.valueName} değerini günlük hayatımızda yaşatmak hepimize güzellik katar.`
    );
  };

  const handleProceedToStage6Completion = () => {
    audioSystem.playSuccessChime();
    setStage('stage_6_completed');
  };

  const handleFinishStation = () => {
    const valueIds: RootValueId[] =
      station.associatedValueIds && station.associatedValueIds.length > 0
        ? station.associatedValueIds
        : [station.valueQuestion.valueId];

    onStationCompleted(
      station.id,
      valueIds,
      dailyOpenEndedText || station.valueQuestion.historicalConnection,
      selectedDailyOptionId || 'open_ended'
    );
  };

  return (
    <div
      id="station-learning-modal"
      className="fixed inset-0 z-50 bg-stone-950/85 backdrop-blur-md flex items-center justify-center p-2.5 sm:p-5 overflow-y-auto"
    >
      <div className="relative w-full max-w-3xl rounded-3xl bg-gradient-to-b from-stone-900 via-[#1d140c] to-stone-950 border-2 border-amber-500/60 shadow-[0_0_80px_rgba(0,0,0,0.9)] overflow-hidden my-auto">
        {/* TOP HEADER & 6-STAGE PROGRESS BAR */}
        <div className="px-4 sm:px-6 py-3.5 bg-gradient-to-r from-amber-950/90 via-stone-900 to-amber-950/90 border-b border-amber-500/35">
          <div className="flex items-center justify-between gap-3">
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-amber-300">
                {yearData.year} Yılı • {station.id}. Olay Durağı • Soru Rehberi: {station.npc}
              </span>
              <h3 className="text-base sm:text-lg font-black text-white">
                {station.animationScene.title}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              {/* Stage 1 Quick Access: Listen to Storyteller Audio */}
              <button
                type="button"
                onClick={onOpenStorytellerAudio}
                className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-400/50 text-xs font-bold flex items-center gap-1.5 transition"
                title="Aşama 1: Ak Sakallı Tarih Anlatıcısından Olayı Dinle"
              >
                <Volume2 className="w-3.5 h-3.5 text-amber-300" />
                <span className="hidden sm:inline">1. Olayı Dinle</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-600 transition"
                aria-label="Kapat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Stepper Indicator */}
          <div className="mt-3 grid grid-cols-5 gap-1.5 text-[10px] sm:text-xs font-bold">
            <div
              className={`px-2 py-1.5 rounded-xl border text-center truncate ${
                stage === 'stage_2_video'
                  ? 'bg-amber-500 text-stone-950 border-amber-200 font-black'
                  : 'bg-emerald-950/70 text-emerald-300 border-emerald-500/40'
              }`}
            >
              2. Animasyon
            </div>
            <div
              className={`px-2 py-1.5 rounded-xl border text-center truncate ${
                stage === 'stage_3_event_question'
                  ? 'bg-amber-500 text-stone-950 border-amber-200 font-black'
                  : stage === 'stage_4_value_question' ||
                    stage === 'stage_5_daily_life' ||
                    stage === 'stage_6_completed'
                  ? 'bg-emerald-950/70 text-emerald-300 border-emerald-500/40'
                  : 'bg-stone-900/70 text-stone-500 border-stone-800'
              }`}
            >
              3. Olay Sorusu
            </div>
            <div
              className={`px-2 py-1.5 rounded-xl border text-center truncate ${
                stage === 'stage_4_value_question'
                  ? 'bg-amber-500 text-stone-950 border-amber-200 font-black'
                  : stage === 'stage_5_daily_life' || stage === 'stage_6_completed'
                  ? 'bg-emerald-950/70 text-emerald-300 border-emerald-500/40'
                  : 'bg-stone-900/70 text-stone-500 border-stone-800'
              }`}
            >
              4. Değer Sorusu
            </div>
            <div
              className={`px-2 py-1.5 rounded-xl border text-center truncate ${
                stage === 'stage_5_daily_life'
                  ? 'bg-amber-500 text-stone-950 border-amber-200 font-black'
                  : stage === 'stage_6_completed'
                  ? 'bg-emerald-950/70 text-emerald-300 border-emerald-500/40'
                  : 'bg-stone-900/70 text-stone-500 border-stone-800'
              }`}
            >
              5. Günlük Hayat
            </div>
            <div
              className={`px-2 py-1.5 rounded-xl border text-center truncate ${
                stage === 'stage_6_completed'
                  ? 'bg-emerald-500 text-stone-950 border-emerald-200 font-black'
                  : 'bg-stone-900/70 text-stone-500 border-stone-800'
              }`}
            >
              6. Tamamlama
            </div>
          </div>
        </div>

        {/* STAGE CONTENT BODY */}
        <div className="p-4 sm:p-6 space-y-5 max-h-[78dvh] overflow-y-auto">
          {/* ============================================================== */}
          {/* AŞAMA 2: ANİMASYON / VİDEO */}
          {/* ============================================================== */}
          {stage === 'stage_2_video' && (
            <div id="learning-stage-2-video" className="space-y-4">
              <div className="rounded-2xl bg-stone-900/95 border border-amber-500/40 overflow-hidden shadow-xl">
                {isLoadingVideo ? (
                  <div className="p-8 text-center text-stone-300 text-sm font-bold">
                    Animasyon / video kontrol ediliyor...
                  </div>
                ) : resolvedVideoUrl ? (
                  <div className="bg-black">
                    <video
                      src={resolvedVideoUrl}
                      controls
                      playsInline
                      onEnded={() => setVideoWatchedOrReady(true)}
                      className="w-full max-h-[340px] object-contain mx-auto"
                    />
                    <div className="px-4 py-2.5 bg-stone-900 border-t border-stone-800 flex items-center justify-between text-xs text-amber-200">
                      <span className="font-bold flex items-center gap-1.5">
                        <Film className="w-4 h-4 text-amber-400" />
                        {station.videoTitle || videoFileName || 'Tarihsel Olay Animasyonu'}
                      </span>
                      <span className="text-emerald-300 font-bold">Video Yüklü</span>
                    </div>
                  </div>
                ) : (
                  /* Animated Visual Scene Card + Missing Video Notice (Does NOT lock the app!) */
                  <div className="p-5 sm:p-6 bg-gradient-to-br from-amber-950/50 via-stone-900 to-stone-950 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-200 text-xs font-black">
                        <Film className="w-3.5 h-3.5 text-amber-400" />
                        {station.animationScene.badge}
                      </span>
                      <span className="text-[11px] font-bold text-amber-300/90 bg-stone-900/90 px-3 py-1 rounded-lg border border-amber-500/30">
                        Video dosyası henüz yüklenmedi • Sahne Anlatımı Aktif
                      </span>
                    </div>

                    <h4 className="text-lg sm:text-xl font-black text-amber-100">
                      {station.animationScene.title}
                    </h4>

                    <p className="text-sm sm:text-base text-stone-200 leading-relaxed bg-stone-950/70 p-4 rounded-2xl border border-amber-500/25">
                      {station.animationScene.narration}
                    </p>

                    {station.animationScene.keyPoints && station.animationScene.keyPoints.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {station.animationScene.keyPoints.map((kp, idx) => (
                          <div
                            key={idx}
                            className="p-3 rounded-xl bg-stone-900/90 border border-amber-500/30 flex items-start gap-2.5 text-xs sm:text-sm text-amber-100"
                          >
                            <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                            <span>{kp}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="text-xs text-stone-400 flex items-center gap-1.5 pt-1">
                      <BookOpen className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>Kaynak: {station.animationScene.historicalSource}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <button
                  type="button"
                  onClick={onOpenStorytellerAudio}
                  className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-200 border border-amber-500/40 text-xs sm:text-sm font-bold flex items-center gap-2 transition"
                >
                  <Volume2 className="w-4 h-4 text-amber-400" />
                  <span>Ak Sakallı Anlatıcıdan Olayı Dinle</span>
                </button>

                <button
                  type="button"
                  id="btn-proceed-to-event-question"
                  disabled={!videoWatchedOrReady}
                  onClick={() => {
                    audioSystem.playButtonClick();
                    setStage('stage_3_event_question');
                  }}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-xl transition active:scale-95"
                >
                  <span>Olay Sorusuna Geç (Aşama 3)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* AŞAMA 3: OLAY SORUSU */}
          {/* ============================================================== */}
          {stage === 'stage_3_event_question' && (
            <div id="learning-stage-3-event-question" className="space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-200 text-xs font-black">
                  <HelpCircle className="w-4 h-4 text-amber-400" />
                  Aşama 3 • Tarihsel Olay Sorusu ({currentEventQIndex + 1}/{eventQuestionsList.length})
                </span>

                <button
                  type="button"
                  onClick={() => setStage('stage_2_video')}
                  className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-200 text-xs font-bold border border-stone-600 flex items-center gap-1.5 transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Animasyonu Tekrar İzle</span>
                </button>
              </div>

              <div className="rounded-2xl bg-stone-900/95 border border-amber-500/40 p-5 space-y-4">
                <h4 className="text-base sm:text-lg font-black text-white leading-snug">
                  {currentEventQuestion.questionText}
                </h4>

                {currentEventQuestion.imageUrl && (
                  <img
                    src={currentEventQuestion.imageUrl}
                    alt="Soru Görseli"
                    className="max-h-48 rounded-xl border border-stone-700 object-contain mx-auto"
                  />
                )}

                {currentEventQuestion.questionType === 'open_ended' ? (
                  <div className="space-y-3">
                    <textarea
                      rows={3}
                      value={openEndedEventAnswer}
                      onChange={e => setOpenEndedEventAnswer(e.target.value)}
                      placeholder="Cevabınızı buraya yazınız..."
                      className="w-full rounded-xl bg-stone-950 border border-stone-700 p-3 text-sm text-white focus:border-amber-400 focus:outline-none"
                    />
                    {!eventQuestionSolved && (
                      <button
                        type="button"
                        onClick={handleOpenEndedEventSubmit}
                        className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs sm:text-sm"
                      >
                        Cevabı Gönder
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-2.5">
                    {currentEventQuestion.options.map((opt, idx) => {
                      const isPicked = selectedEventOption === idx;
                      const isRight = idx === currentEventQuestion.correctIndex;
                      let btnStyle =
                        'bg-stone-950/90 hover:bg-stone-800/90 text-stone-100 border-stone-700';

                      if (eventQuestionSolved && isRight) {
                        btnStyle =
                          'bg-emerald-950/90 border-emerald-400 text-emerald-100 ring-2 ring-emerald-400/50';
                      } else if (isPicked && !isRight) {
                        btnStyle = 'bg-rose-950/90 border-rose-500 text-rose-100';
                      }

                      return (
                        <button
                          key={idx}
                          type="button"
                          id={`event-option-${idx}`}
                          onClick={() => handleSelectEventOption(idx)}
                          className={`w-full text-left p-3.5 sm:p-4 rounded-2xl border-2 font-bold text-xs sm:text-sm flex items-center gap-3 transition ${btnStyle}`}
                        >
                          <span className="w-7 h-7 rounded-xl bg-stone-800 border border-amber-500/40 flex items-center justify-center font-black text-amber-300 shrink-0">
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span className="flex-1">{opt}</span>
                          {eventQuestionSolved && isRight && (
                            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Wrong Answer Hint Box */}
                {eventHintText && !eventQuestionSolved && (
                  <div
                    id="event-question-hint-box"
                    className="rounded-2xl bg-amber-950/80 border-2 border-amber-400 p-4 space-y-2"
                  >
                    <div className="flex items-start gap-2.5 text-amber-200 text-xs sm:text-sm font-bold">
                      <Lightbulb className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-black text-amber-300 block">İpucu (Tekrar Dene):</span>
                        <span>{eventHintText}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Correct Answer Explanation & Advance Button */}
                {eventQuestionSolved && (
                  <div className="rounded-2xl bg-emerald-950/80 border-2 border-emerald-400 p-4 space-y-3">
                    <div className="flex items-start gap-2.5 text-emerald-100 text-xs sm:text-sm">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-black text-emerald-300 block">Doğru Cevap!</span>
                        <span>{currentEventQuestion.explanation}</span>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="button"
                        id="btn-proceed-to-value-question"
                        onClick={handleAdvanceFromEventQuestion}
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-stone-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg transition active:scale-95"
                      >
                        <span>Değer Sorusuna Geç (Aşama 4)</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* AŞAMA 4: DEĞER SORUSU ("Bu olayda hangi değer ön plana çıkmaktadır?") */}
          {/* ============================================================== */}
          {stage === 'stage_4_value_question' && (
            <div id="learning-stage-4-value-question" className="space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-xs font-black">
                  <Heart className="w-4 h-4 text-emerald-400" />
                  Aşama 4 • Değer Keşfi Sorusu
                </span>
              </div>

              <div className="rounded-2xl bg-stone-900/95 border border-emerald-500/40 p-5 space-y-4">
                <p className="text-xs sm:text-sm text-amber-200/90 bg-amber-950/40 p-3.5 rounded-xl border border-amber-500/30">
                  {station.valueQuestion.historicalConnection}
                </p>

                <h4 className="text-base sm:text-lg font-black text-white">
                  {valueRecQuestion.questionText}
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {valueRecQuestion.options.map((opt, idx) => {
                    const isPicked = selectedValueRecOption === idx;
                    const isRight = idx === valueRecQuestion.correctIndex;
                    let btnStyle =
                      'bg-stone-950/90 hover:bg-stone-800/90 text-stone-100 border-stone-700';

                    if (valueRecSolved && isRight) {
                      btnStyle =
                        'bg-emerald-950/90 border-emerald-400 text-emerald-100 ring-2 ring-emerald-400/50';
                    } else if (isPicked && !isRight) {
                      btnStyle = 'bg-rose-950/90 border-rose-500 text-rose-100';
                    }

                    return (
                      <button
                        key={idx}
                        type="button"
                        id={`value-rec-option-${idx}`}
                        onClick={() => handleSelectValueRecOption(idx)}
                        className={`text-left p-3.5 sm:p-4 rounded-2xl border-2 font-bold text-xs sm:text-sm flex items-center gap-3 transition ${btnStyle}`}
                      >
                        <span className="w-7 h-7 rounded-xl bg-stone-800 border border-emerald-500/40 flex items-center justify-center font-black text-emerald-300 shrink-0">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="flex-1">{opt}</span>
                        {valueRecSolved && isRight && (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {valueRecHintText && !valueRecSolved && (
                  <div className="rounded-2xl bg-amber-950/80 border-2 border-amber-400 p-4 flex items-start gap-2.5 text-amber-200 text-xs sm:text-sm font-bold">
                    <Lightbulb className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-black text-amber-300 block">Değer İpucu:</span>
                      <span>{valueRecHintText}</span>
                    </div>
                  </div>
                )}

                {valueRecSolved && (
                  <div className="rounded-2xl bg-emerald-950/80 border-2 border-emerald-400 p-4 space-y-3">
                    <div className="flex items-start gap-2.5 text-emerald-100 text-xs sm:text-sm">
                      <Award className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-black text-emerald-300 block">
                          Harika! Ön Plana Çıkan Değer: {station.valueQuestion.valueName}
                        </span>
                        <span>{valueRecQuestion.explanation}</span>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="button"
                        id="btn-proceed-to-daily-life"
                        onClick={() => {
                          audioSystem.playButtonClick();
                          setStage('stage_5_daily_life');
                        }}
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-stone-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg transition active:scale-95"
                      >
                        <span>Günlük Hayat Sorusuna Geç (Aşama 5)</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* AŞAMA 5: GÜNLÜK HAYAT SORUSU */}
          {/* ============================================================== */}
          {stage === 'stage_5_daily_life' && (
            <div id="learning-stage-5-daily-life" className="space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/20 border border-sky-400/40 text-sky-200 text-xs font-black">
                  <MessageSquare className="w-4 h-4 text-sky-400" />
                  Aşama 5 • Değeri Günlük Hayatla İlişkilendirme ({station.valueQuestion.valueName})
                </span>
              </div>

              <div className="rounded-2xl bg-stone-900/95 border border-sky-500/40 p-5 space-y-4">
                <h4 className="text-base sm:text-lg font-black text-white leading-snug">
                  {dailyQuestion.questionText}
                </h4>

                {dailyQuestion.imageUrl && (
                  <img
                    src={dailyQuestion.imageUrl}
                    alt="Günlük Hayat Durumu"
                    className="max-h-48 rounded-xl border border-stone-700 object-contain mx-auto"
                  />
                )}

                {dailyQuestion.questionType === 'open_ended' ? (
                  <div className="space-y-3">
                    {dailyQuestion.openEndedGuide && (
                      <p className="text-xs text-amber-200/90">{dailyQuestion.openEndedGuide}</p>
                    )}
                    <textarea
                      rows={3}
                      value={dailyOpenEndedText}
                      onChange={e => setDailyOpenEndedText(e.target.value)}
                      placeholder="Sen olsaydın nasıl davranırdın? Düşünceni buraya yaz..."
                      className="w-full rounded-xl bg-stone-950 border border-stone-700 p-3 text-sm text-white focus:border-amber-400 focus:outline-none"
                    />
                    {!dailySolved && (
                      <button
                        type="button"
                        id="btn-submit-open-daily"
                        onClick={handleOpenEndedDailySubmit}
                        className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs sm:text-sm"
                      >
                        Düşüncemi Kaydet ve Tamamla
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {dailyQuestion.options.map((opt, idx) => {
                      const isPicked = selectedDailyOptionId === opt.id;
                      let btnStyle =
                        'bg-stone-950/90 hover:bg-stone-800/90 text-stone-100 border-stone-700';

                      if (isPicked && opt.isAppropriate) {
                        btnStyle =
                          'bg-emerald-950/90 border-emerald-400 text-emerald-100 ring-2 ring-emerald-400/50';
                      } else if (isPicked && !opt.isAppropriate) {
                        btnStyle = 'bg-rose-950/90 border-rose-500 text-rose-100';
                      }

                      return (
                        <button
                          key={opt.id}
                          type="button"
                          id={`daily-life-option-${idx}`}
                          onClick={() => handleSelectDailyOption(opt.id)}
                          className={`w-full text-left p-3.5 sm:p-4 rounded-2xl border-2 font-bold text-xs sm:text-sm flex items-center gap-3 transition ${btnStyle}`}
                        >
                          <span className="w-7 h-7 rounded-xl bg-stone-800 border border-sky-500/40 flex items-center justify-center font-black text-sky-300 shrink-0">
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span className="flex-1">{opt.text}</span>
                          {isPicked && opt.isAppropriate && (
                            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}

                {dailyFeedback && (
                  <div
                    className={`rounded-2xl p-4 border-2 ${
                      dailySolved
                        ? 'bg-emerald-950/85 border-emerald-400 text-emerald-100'
                        : 'bg-amber-950/85 border-amber-400 text-amber-100'
                    }`}
                  >
                    <div className="flex items-start gap-2.5 text-xs sm:text-sm font-bold">
                      {dailySolved ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                      )}
                      <span>{dailyFeedback}</span>
                    </div>

                    {dailySolved && (
                      <div className="mt-3 flex justify-end">
                        <button
                          type="button"
                          id="btn-proceed-to-stage-6"
                          onClick={handleProceedToStage6Completion}
                          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg transition active:scale-95"
                        >
                          <span>Durağı Tamamla (Aşama 6)</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* AŞAMA 6: DURAĞIN TAMAMLANMASI */}
          {/* ============================================================== */}
          {stage === 'stage_6_completed' && (
            <div
              id="learning-stage-6-completed"
              className="rounded-3xl bg-gradient-to-b from-emerald-950/90 via-stone-900 to-stone-950 border-2 border-emerald-400/70 p-6 sm:p-8 text-center space-y-5 shadow-2xl"
            >
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto shadow-lg">
                <Award className="w-9 h-9 text-emerald-300" />
              </div>

              <div className="space-y-2">
                <span className="inline-block px-3.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-xs font-black uppercase tracking-wider">
                  {station.id}. Olay Durağı Tamamlandı!
                </span>
                <h4 className="text-lg sm:text-2xl font-black text-white">
                  "Tebrikler! Bu tarihsel olayı keşfettin ve ilgili değeri günlük hayatla ilişkilendirdin."
                </h4>
                <p className="text-xs sm:text-sm text-stone-300 max-w-xl mx-auto">
                  Kazanılan Değer:{' '}
                  <strong className="text-amber-300">{station.valueQuestion.valueName}</strong>
                </p>
              </div>

              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  id="btn-finish-station-and-continue"
                  onClick={handleFinishStation}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-stone-950 font-black text-sm flex items-center gap-2 shadow-xl transition active:scale-95"
                >
                  <span>
                    {isLastStationInYear
                      ? `${yearData.year} Yılını Tamamla ve 3B Mekâna Dön`
                      : 'Sonraki Olay Durağını Aktif Et ve 3B Mekâna Dön'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
