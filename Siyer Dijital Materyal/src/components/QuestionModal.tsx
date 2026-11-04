import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  HelpCircle,
  RotateCcw,
  Send,
  ArrowRight,
  ShieldAlert,
  BookOpen,
  X
} from 'lucide-react';
import { MissionData, YearData } from '../types';
import { evaluateStudentAnswer } from '../utils/nlpEvaluator';
import { audioSystem } from '../utils/audioSynthesizer';

interface QuestionModalProps {
  mission: MissionData;
  yearData: YearData;
  currentStrikes: number; // 0, 1, 2, 3
  onAnswerEvaluated: (isCorrect: boolean, isThirdStrikeAssisted: boolean) => void;
  onReplayCinematic: () => void;
  onClose?: () => void;
}

export const QuestionModal: React.FC<QuestionModalProps> = ({
  mission,
  yearData,
  currentStrikes,
  onAnswerEvaluated,
  onReplayCinematic,
  onClose
}) => {
  const [studentInput, setStudentInput] = useState<string>('');
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');
  const [status, setStatus] = useState<'idle' | 'success' | 'strike_1' | 'strike_2' | 'strike_3'>('idle');
  const [selectedReinforcementIndex, setSelectedReinforcementIndex] = useState<number | null>(null);
  const [reinforcementPassed, setReinforcementPassed] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentInput.trim()) return;

    const evalResult = evaluateStudentAnswer(
      studentInput,
      mission.correctAnswer,
      mission.alternativeAnswers
    );

    if (evalResult.isCorrect) {
      audioSystem.playSuccessChime();
      setStatus('success');
      setFeedbackMessage(evalResult.feedback);
    } else {
      audioSystem.playWrongChime();
      const newStrikeCount = currentStrikes + 1;

      if (newStrikeCount === 1) {
        setStatus('strike_1');
        setFeedbackMessage(evalResult.feedback);
      } else if (newStrikeCount === 2) {
        setStatus('strike_2');
        setFeedbackMessage('İkinci denemede de doğru cevaba ulaşılamadı. Bir hakkınız kaldı!');
      } else {
        // 3rd strike!
        setStatus('strike_3');
        setFeedbackMessage('3 yanlış hakkı kullanıldı. Doğru bilgi ve pekiştirme etkinliği aşağıda sunulmuştur.');
      }
    }
  };

  const handleReinforcementSelect = (index: number) => {
    setSelectedReinforcementIndex(index);
    if (index === mission.reinforcement.correctIndex) {
      audioSystem.playSuccessChime();
      setReinforcementPassed(true);
    } else {
      audioSystem.playWrongChime();
    }
  };

  const handleContinue = () => {
    if (status === 'success') {
      onAnswerEvaluated(true, false);
    } else if (status === 'strike_3' && reinforcementPassed) {
      onAnswerEvaluated(false, true); // marked as completed with 3rd-strike instructional assistance
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/85 backdrop-blur-lg animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-stone-900 border-2 border-amber-600/70 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-stone-950 via-stone-900 to-stone-950 border-b border-amber-600/30">
          <div className="flex items-center gap-3">
            <span className="bg-amber-500 text-stone-950 font-black text-sm px-2.5 py-0.5 rounded-lg font-title">
              {yearData.year}
            </span>
            <div>
              <h3 className="text-base font-bold text-amber-200">
                Tarihsel Bilgi Değerlendirmesi
              </h3>
              <p className="text-xs text-stone-400">
                Açık Uçlu Soru & Akıllı Değerlendirme
              </p>
            </div>
          </div>

          {/* Remaining Strikes & Close Button */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-stone-800/80 px-3 py-1.5 rounded-xl border border-stone-700">
              <span className="text-xs text-stone-300 font-semibold">Kalan Hak:</span>
              {[1, 2, 3].map(s => (
                <div
                  key={s}
                  className={`w-3 h-3 rounded-full ${
                    s <= 3 - (status === 'strike_1' ? 1 : status === 'strike_2' ? 2 : status === 'strike_3' ? 3 : currentStrikes)
                      ? 'bg-emerald-500 ring-1 ring-emerald-300'
                      : 'bg-rose-500/80 ring-1 ring-rose-400'
                  }`}
                />
              ))}
            </div>

            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 transition"
                title="Kapat / Keşfe Dön"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[75vh]">
          
          {/* Question Prompt Card */}
          <div className="bg-stone-950/80 border border-amber-600/40 rounded-2xl p-5 shadow-inner">
            <div className="flex items-start gap-3">
              <HelpCircle className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-1">
                  Soru:
                </span>
                <p className="text-base sm:text-lg font-bold text-stone-100 leading-snug">
                  {mission.question}
                </p>
              </div>
            </div>
          </div>

          {/* SUCCESS VIEW */}
          {status === 'success' && (
            <div className="bg-emerald-950/60 border border-emerald-500/50 rounded-2xl p-5 text-center space-y-3 animate-fadeIn">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center mx-auto text-emerald-400">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h4 className="text-lg font-bold text-emerald-300">Harika! Doğru Cevap</h4>
              <p className="text-sm text-stone-200">{feedbackMessage}</p>
              <div className="pt-2">
                <button
                  onClick={handleContinue}
                  className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-stone-950 font-black text-sm transition shadow-lg shadow-emerald-600/30 inline-flex items-center gap-2"
                >
                  <span>Değer Keşfine İlerle</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* FIRST WRONG ATTEMPT (STRIKE 1) */}
          {status === 'strike_1' && (
            <div className="bg-amber-950/50 border border-amber-600/40 rounded-2xl p-4 space-y-3 animate-fadeIn">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <AlertTriangle className="w-5 h-5" />
                <span>Birinci Yanlış Cevap — Birinci İpucu</span>
              </div>
              <p className="text-xs text-stone-300">{feedbackMessage}</p>
              <div className="bg-stone-900/90 border border-amber-500/30 rounded-xl p-3 flex items-start gap-2.5">
                <Lightbulb className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
                <p className="text-sm text-amber-100 font-medium">{mission.hint1}</p>
              </div>
              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={onReplayCinematic}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-300 text-xs font-semibold transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Animasyonu Tekrar İzle</span>
                </button>
              </div>
            </div>
          )}

          {/* SECOND WRONG ATTEMPT (STRIKE 2) */}
          {status === 'strike_2' && (
            <div className="bg-rose-950/50 border border-rose-600/40 rounded-2xl p-4 space-y-3 animate-fadeIn">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                <ShieldAlert className="w-5 h-5" />
                <span>İkinci Yanlış Cevap — Son 1 Yanlış Hakkınız Kaldı!</span>
              </div>
              <p className="text-xs text-stone-300">{feedbackMessage}</p>
              <div className="bg-stone-900/90 border border-rose-500/30 rounded-xl p-3 flex items-start gap-2.5">
                <Lightbulb className="w-5 h-5 text-rose-300 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[11px] font-bold text-rose-400 uppercase block">Daha Açıklayıcı 2. İpucu:</span>
                  <p className="text-sm text-stone-100 font-medium">{mission.hint2}</p>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={onReplayCinematic}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-rose-300 text-xs font-semibold transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Animasyonu Tekrar İzle</span>
                </button>
              </div>
            </div>
          )}

          {/* THIRD WRONG ATTEMPT (STRIKE 3 - INSTRUCTIONAL SUPPORT) */}
          {status === 'strike_3' && (
            <div className="bg-blue-950/60 border border-blue-500/50 rounded-2xl p-5 space-y-4 animate-fadeIn">
              <div className="flex items-center gap-2 text-blue-300 font-bold text-sm">
                <BookOpen className="w-5 h-5 text-blue-400" />
                <span>3. Yanlış Hakkı: Öğretici Açıklama ve Doğru Bilgi</span>
              </div>

              {/* Rationale and Correct Answer */}
              <div className="bg-stone-900/90 border border-blue-400/30 rounded-xl p-4 space-y-2">
                <div className="text-xs text-stone-400">Doğru Cevap:</div>
                <div className="text-lg font-black text-amber-300">{mission.correctAnswer}</div>
                <p className="text-xs sm:text-sm text-stone-200 leading-relaxed font-serif pt-1">
                  {mission.thirdLevelExplanation}
                </p>
              </div>

              {/* Supportive Reinforcement Mini-Activity */}
              <div className="bg-stone-950/80 border border-stone-700 rounded-xl p-4 space-y-3">
                <div className="text-xs font-bold text-blue-300 uppercase tracking-wider">
                  Destekleyici Pekiştirme Sorusu:
                </div>
                <p className="text-sm font-semibold text-stone-100">
                  {mission.reinforcement.question}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {mission.reinforcement.options.map((opt, idx) => {
                    const isSelected = selectedReinforcementIndex === idx;
                    const isCorrect = idx === mission.reinforcement.correctIndex;
                    let btnClass = 'bg-stone-800 hover:bg-stone-700 border-stone-700 text-stone-200';
                    if (isSelected) {
                      btnClass = isCorrect
                        ? 'bg-emerald-900/80 border-emerald-500 text-emerald-200 font-bold'
                        : 'bg-rose-900/80 border-rose-500 text-rose-200 font-bold';
                    }

                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleReinforcementSelect(idx)}
                        className={`text-left text-xs sm:text-sm p-3 rounded-xl border transition ${btnClass}`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {reinforcementPassed && (
                  <div className="pt-2 text-center animate-fadeIn">
                    <p className="text-xs text-emerald-400 font-semibold mb-3">
                      ✓ Pekiştirme etkinliği başarıyla tamamlandı. Kontrollü olarak ilerleyebilirsiniz.
                    </p>
                    <button
                      type="button"
                      onClick={handleContinue}
                      className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-stone-950 font-black text-sm transition shadow-lg shadow-blue-600/30 inline-flex items-center gap-2"
                    >
                      <span>Sonraki Aşamaya İlerle</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Open-Ended Input Form (Only available while not success and not strike 3) */}
          {status !== 'success' && status !== 'strike_3' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-300 mb-2">
                  Cevabınızı buraya yazınız (Büyük/küçük harf veya ufak yazım farkları kabul edilir):
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={studentInput}
                    onChange={(e) => setStudentInput(e.target.value)}
                    placeholder="Örn: Hira Mağarası, Ebrehe..."
                    className="w-full bg-stone-950 border-2 border-amber-600/50 focus:border-amber-400 rounded-2xl px-4 py-3 text-stone-100 placeholder-stone-600 outline-none text-base font-medium shadow-inner transition"
                    autoFocus
                  />
                  <button
                    type="submit"
                    disabled={!studentInput.trim()}
                    className="absolute right-2 top-2 bottom-2 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-40 disabled:pointer-events-none text-stone-950 font-black text-xs transition flex items-center gap-1.5 shadow"
                  >
                    <span>Gönder</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
