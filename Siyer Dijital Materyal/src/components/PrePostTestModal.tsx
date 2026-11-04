import React, { useState } from 'react';
import { CheckCircle2, ArrowRight, ArrowLeft, X, Award, HelpCircle } from 'lucide-react';
import { PRE_TEST_QUESTIONS, POST_TEST_QUESTIONS, TestQuestion } from '../data/evaluationTests';
import { audioSystem } from '../utils/audioSynthesizer';

interface PrePostTestModalProps {
  testType: 'pre' | 'post';
  onCompleteTest: (score: number, answers: Record<number, number>) => void;
  onClose: () => void;
}

export const PrePostTestModal: React.FC<PrePostTestModalProps> = ({
  testType,
  onCompleteTest,
  onClose
}) => {
  const questions: TestQuestion[] = testType === 'pre' ? PRE_TEST_QUESTIONS : POST_TEST_QUESTIONS;
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [finalScore, setFinalScore] = useState<number>(0);

  const currentQ = questions[currentIndex];

  const handleSelectOption = (optionIndex: number) => {
    setSelectedAnswers(prev => ({ ...prev, [currentQ.id]: optionIndex }));
    audioSystem.playButtonClick();
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Calculate score
      let score = 0;
      questions.forEach(q => {
        if (selectedAnswers[q.id] === q.correctIndex) {
          score += 1;
        }
      });
      setFinalScore(score);
      setIsSubmitted(true);
      audioSystem.playSuccessChime();
    }
  };

  const handleFinish = () => {
    onCompleteTest(finalScore, selectedAnswers);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/85 backdrop-blur-lg animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-stone-900 border-2 border-amber-600/70 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-stone-950 via-stone-900 to-stone-950 border-b border-amber-600/30">
          <div>
            <h3 className="text-base font-bold text-amber-200">
              {testType === 'pre' ? 'TÜBİTAK 2204-B ÖN TEST' : 'TÜBİTAK 2204-B SON TEST'}
            </h3>
            <p className="text-xs text-stone-400">
              Soru {currentIndex + 1} / {questions.length} • {currentQ.dimension === 'siyer' ? 'Siyer Bilgi Düzeyi' : 'Kök Değerler Farkındalığı'}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Test Body */}
        <div className="p-6 space-y-6">
          {!isSubmitted ? (
            <div className="space-y-5 animate-fadeIn">
              
              {/* Question Card */}
              <div className="bg-stone-950 border border-amber-600/30 rounded-2xl p-5 shadow-inner">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-2">
                  {currentQ.dimension === 'siyer' ? '📘 Siyer Bilgi Sorusu' : '💚 Kök Değerler Sorusu'}
                </span>
                <p className="text-base sm:text-lg font-bold text-stone-100 leading-snug">
                  {currentQ.question}
                </p>
              </div>

              {/* Options */}
              <div className="space-y-2.5">
                {currentQ.options.map((opt, idx) => {
                  const isSelected = selectedAnswers[currentQ.id] === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectOption(idx)}
                      className={`w-full text-left p-3.5 rounded-2xl border-2 transition text-xs sm:text-sm font-semibold flex items-center justify-between ${
                        isSelected
                          ? 'bg-amber-950/80 border-amber-500 text-amber-200 shadow'
                          : 'bg-stone-800/80 border-stone-700 hover:bg-stone-700 text-stone-200'
                      }`}
                    >
                      <span>{opt}</span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {/* Pagination controls */}
              <div className="flex items-center justify-between pt-4 border-t border-stone-800">
                <button
                  type="button"
                  disabled={currentIndex === 0}
                  onClick={() => setCurrentIndex(currentIndex - 1)}
                  className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 disabled:opacity-30 disabled:pointer-events-none text-stone-300 text-xs font-bold transition flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Önceki Soru</span>
                </button>

                <button
                  type="button"
                  disabled={selectedAnswers[currentQ.id] === undefined}
                  onClick={handleNext}
                  className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-40 disabled:pointer-events-none text-stone-950 font-black text-xs sm:text-sm transition shadow-lg flex items-center gap-1.5"
                >
                  <span>{currentIndex === questions.length - 1 ? 'Testi Bitir' : 'Sonraki Soru'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          ) : (
            /* Results Screen */
            <div className="text-center py-6 space-y-5 animate-fadeIn">
              <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto text-emerald-400">
                <Award className="w-10 h-10" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-stone-100">
                  {testType === 'pre' ? 'Ön Test Başarıyla Tamamlandı' : 'Son Test Başarıyla Tamamlandı'}
                </h3>
                <p className="text-xs text-stone-400 mt-1">
                  Sonuçlar araştırma profilinize ve TÜBİTAK veri tabanına işlendi.
                </p>
              </div>

              <div className="inline-block bg-stone-950 px-8 py-4 rounded-3xl border border-emerald-500/40">
                <div className="text-xs text-stone-400 mb-1">Toplam Puan:</div>
                <div className="text-4xl font-black text-emerald-400 font-title">
                  {finalScore} / {questions.length}
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleFinish}
                  className="px-8 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-stone-950 font-black text-sm transition shadow-lg shadow-emerald-600/30"
                >
                  Sonuçları Kaydet ve Kapat
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
