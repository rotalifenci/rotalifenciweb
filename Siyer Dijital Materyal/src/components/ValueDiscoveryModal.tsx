import React, { useState } from 'react';
import {
  Heart,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  Sparkles,
  BookMarked
} from 'lucide-react';
import { ValueDiscoveryData, RootValueId } from '../types';
import { ROOT_VALUES } from '../data/rootValues';
import { audioSystem } from '../utils/audioSynthesizer';

interface ValueDiscoveryModalProps {
  valueData: ValueDiscoveryData;
  year: number;
  onCompleteValueDiscovery: (userReflection: string, choiceId: string, isAppropriate: boolean) => void;
}

export const ValueDiscoveryModal: React.FC<ValueDiscoveryModalProps> = ({
  valueData,
  year,
  onCompleteValueDiscovery
}) => {
  const [stage, setStage] = useState<1 | 2 | 3 | 4>(1);
  const [selectedRecognitionIdx, setSelectedRecognitionIdx] = useState<number | null>(null);
  const [recognitionError, setRecognitionError] = useState<boolean>(false);
  const [userExplanation, setUserExplanation] = useState<string>('');
  const [selectedScenarioChoice, setSelectedScenarioChoice] = useState<string | null>(null);
  const [scenarioFeedback, setScenarioFeedback] = useState<{ isAppropriate: boolean; text: string } | null>(null);

  const rootValue = ROOT_VALUES[valueData.valueId];

  // Stage 1: Recognition
  const handleSelectRecognition = (idx: number) => {
    setSelectedRecognitionIdx(idx);
    if (idx === valueData.correctRecognitionIndex) {
      audioSystem.playSuccessChime();
      setRecognitionError(false);
      setTimeout(() => setStage(2), 600);
    } else {
      audioSystem.playWrongChime();
      setRecognitionError(true);
    }
  };

  // Stage 2: Understanding & Reflection
  const handleCompleteReflection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userExplanation.trim()) return;
    audioSystem.playSuccessChime();
    setStage(3);
  };

  // Stage 3: Real Life Dilemma
  const handleSelectScenario = (choiceId: string) => {
    setSelectedScenarioChoice(choiceId);
    const choice = valueData.scenarioOptions.find(o => o.id === choiceId);
    if (choice) {
      if (choice.isAppropriate) {
        audioSystem.playSuccessChime();
      } else {
        audioSystem.playWrongChime();
      }
      setScenarioFeedback({
        isAppropriate: choice.isAppropriate,
        text: choice.feedback
      });
    }
  };

  const handleFinish = () => {
    const choice = valueData.scenarioOptions.find(o => o.id === selectedScenarioChoice);
    onCompleteValueDiscovery(
      userExplanation,
      selectedScenarioChoice || '',
      choice ? choice.isAppropriate : true
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/85 backdrop-blur-lg animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-stone-900 border-2 border-emerald-600/70 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-stone-950 via-stone-900 to-stone-950 border-b border-emerald-600/30">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-emerald-200">
                Kök Değer Keşif Durağı
              </h3>
              <p className="text-xs text-stone-400">
                10 Kök Değer Eğitimi ({stage}/3. Aşama)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`w-7 h-1.5 rounded-full transition-all duration-300 ${
                  s === stage
                    ? 'bg-emerald-400'
                    : s < stage
                    ? 'bg-emerald-600'
                    : 'bg-stone-700'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto max-h-[75vh] space-y-5">
          
          {/* AŞAMA 1: DEĞERİ TANIMA */}
          {stage === 1 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-4">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                  1. Aşama — Değeri Tanıma
                </span>
                <p className="text-base sm:text-lg font-bold text-stone-100">
                  {valueData.recognitionQuestion}
                </p>
              </div>

              {recognitionError && (
                <div className="flex items-center gap-2 text-rose-400 text-xs font-semibold bg-rose-950/40 border border-rose-600/40 p-2.5 rounded-xl">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>Tekrar düşününüz; olaydaki temel ahlaki davranışı göz önünde bulundurunuz.</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {valueData.recognitionOptions.map((opt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectRecognition(idx)}
                    className="p-4 rounded-2xl bg-stone-800/80 hover:bg-emerald-950/60 border-2 border-stone-700 hover:border-emerald-500 text-stone-100 font-bold text-sm sm:text-base transition text-left shadow flex items-center justify-between"
                  >
                    <span>{opt}</span>
                    <ArrowRight className="w-4 h-4 text-emerald-400 opacity-60" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* AŞAMA 2: DEĞERİ ANLAMA & KENDİ CÜMLELERİYLE AÇIKLAMA */}
          {stage === 2 && (
            <form onSubmit={handleCompleteReflection} className="space-y-4 animate-fadeIn">
              <div className="bg-stone-950/70 border border-emerald-500/40 rounded-2xl p-4">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">
                  <BookMarked className="w-4 h-4" />
                  <span>2. Aşama — Değeri Anlama: {rootValue?.name}</span>
                </div>
                <p className="text-sm sm:text-base font-semibold text-stone-100 mb-2">
                  {valueData.explanationPrompt}
                </p>
                <p className="text-xs text-stone-400 italic">
                  💡 Rehber: {valueData.explanationGuide}
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-300 mb-2">
                  Düşüncenizi kendi cümlelerinizle yazınız:
                </label>
                <textarea
                  value={userExplanation}
                  onChange={(e) => setUserExplanation(e.target.value)}
                  placeholder="Bence bu değer çok önemlidir çünkü..."
                  rows={4}
                  className="w-full bg-stone-950 border-2 border-emerald-600/40 focus:border-emerald-400 rounded-2xl p-3.5 text-stone-100 placeholder-stone-600 outline-none text-sm font-medium shadow-inner transition"
                  autoFocus
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={!userExplanation.trim()}
                  className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 disabled:opacity-40 disabled:pointer-events-none text-stone-950 font-black text-sm transition shadow-lg shadow-emerald-600/30 flex items-center gap-2"
                >
                  <span>Günlük Yaşam Örneğine Geç</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* AŞAMA 3: GÜNLÜK YAŞAMLA İLİŞKİLENDİRME */}
          {stage === 3 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="bg-stone-950/70 border border-emerald-500/40 rounded-2xl p-4">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                  3. Aşama — Günlük Yaşamla İlişkilendirme: {valueData.scenarioTitle}
                </span>
                <p className="text-sm sm:text-base font-bold text-stone-100 leading-snug">
                  {valueData.scenarioQuestion}
                </p>
              </div>

              <div className="space-y-2.5 pt-1">
                {valueData.scenarioOptions.map((opt) => {
                  const isSelected = selectedScenarioChoice === opt.id;
                  let btnClass = 'bg-stone-800/80 border-stone-700 hover:bg-stone-700/80 text-stone-200';
                  if (isSelected) {
                    btnClass = opt.isAppropriate
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-100'
                      : 'bg-rose-950/80 border-rose-500 text-rose-100';
                  }

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleSelectScenario(opt.id)}
                      className={`w-full text-left p-3.5 rounded-2xl border-2 transition text-xs sm:text-sm leading-relaxed ${btnClass}`}
                    >
                      {opt.text}
                    </button>
                  );
                })}
              </div>

              {scenarioFeedback && (
                <div
                  className={`p-4 rounded-2xl border-2 animate-fadeIn ${
                    scenarioFeedback.isAppropriate
                      ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                      : 'bg-amber-950/60 border-amber-500 text-amber-200'
                  }`}
                >
                  <div className="text-xs font-bold uppercase mb-1">
                    {scenarioFeedback.isAppropriate ? '✓ Doğru Yaklaşım:' : 'ℹ Öğretici Açıklama:'}
                  </div>
                  <p className="text-xs sm:text-sm font-medium">
                    {scenarioFeedback.text}
                  </p>
                  <div className="pt-3 text-right">
                    <button
                      type="button"
                      onClick={handleFinish}
                      className="px-6 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-stone-950 font-black text-xs sm:text-sm transition shadow-lg"
                    >
                      Keşfi Tamamla ve Deftere Kaydet
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
