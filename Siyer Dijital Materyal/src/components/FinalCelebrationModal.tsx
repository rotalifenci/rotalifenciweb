import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Award, CheckCircle2, Download, Printer, X, Sparkles, BookOpen } from 'lucide-react';
import { StudentProgress } from '../types';

interface FinalCelebrationModalProps {
  progress: StudentProgress;
  onClose: () => void;
}

export const FinalCelebrationModal: React.FC<FinalCelebrationModalProps> = ({
  progress,
  onClose
}) => {
  useEffect(() => {
    // Fireworks confetti blast
    const count = 200;
    const defaults = {
      origin: { y: 0.7 }
    };

    function fire(particleRatio: number, opts: any) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio)
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    });
    fire(0.2, {
      spread: 60,
    });
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/90 backdrop-blur-xl animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#ede0c8] text-[#2c1a0e] border-8 border-[#9e6f3d] rounded-3xl shadow-2xl p-6 sm:p-10 parchment-border my-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-2xl bg-[#dfcaa5] hover:bg-[#caa97c] text-[#422915] transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Certificate Content (Printable) */}
        <div className="text-center space-y-6 font-serif">
          
          {/* Certificate Crest */}
          <div className="flex justify-center items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-[#3d2412] text-amber-300 flex items-center justify-center shadow-lg border-2 border-amber-400">
              <Award className="w-9 h-9" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-xs uppercase font-black tracking-widest text-[#8a5223]">
              TÜBİTAK 2204-B ORTAOKUL ÖĞRENCİLERİ ARAŞTIRMA PROJELERİ
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-[#381a07] font-title tracking-wide">
              KATILIM VE BAŞARI BELGESİ
            </h1>
            <p className="text-sm font-semibold text-[#6e4321]">
              DİJİTAL SİYER YOLCULUĞU: 571–632 | PEYGAMBERİMİZİN HAYATINA YOLCULUK
            </p>
          </div>

          <div className="w-24 h-1 bg-amber-700 mx-auto rounded-full" />

          {/* Congratulations Statement */}
          <div className="space-y-3">
            <h2 className="text-2xl font-black text-[#2e1505] font-title">
              TEBRİKLER!
            </h2>
            <p className="text-base sm:text-lg text-[#3b200e] leading-relaxed max-w-xl mx-auto">
              <strong>{progress.studentName || 'Değerli Öğrenci'}</strong> ({progress.character === 'eren' ? 'Eren' : 'Aybüke'} rehberliğinde), 
              571 yılından 632 yılına uzanan <strong>62 yıllık</strong> kutlu Siyer yolculuğunu, bütün tarihsel durakları ve 
              <strong> 10 kök değer keşfini</strong> başarıyla tamamlamıştır.
            </p>
          </div>

          {/* Achievement Summary Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-2 max-w-lg mx-auto text-xs">
            <div className="bg-[#dfd0b2] p-3 rounded-2xl border border-[#c4b08a]">
              <span className="block text-[#69401f] font-bold">Tamamlanan Yıllar</span>
              <span className="text-lg font-black text-[#381a07]">62 / 62 Yıl</span>
            </div>
            <div className="bg-[#dfd0b2] p-3 rounded-2xl border border-[#c4b08a]">
              <span className="block text-[#69401f] font-bold">Kök Değerler</span>
              <span className="text-lg font-black text-[#381a07]">{progress.unlockedValues.length} / 10 Değer</span>
            </div>
            <div className="bg-[#dfd0b2] p-3 rounded-2xl border border-[#c4b08a]">
              <span className="block text-[#69401f] font-bold">Doğru Cevaplar</span>
              <span className="text-lg font-black text-emerald-800">{progress.totalCorrect} Adet</span>
            </div>
            <div className="bg-[#dfd0b2] p-3 rounded-2xl border border-[#c4b08a]">
              <span className="block text-[#69401f] font-bold">Öğrenci Kodu</span>
              <span className="text-lg font-black text-blue-900 font-mono">{progress.studentId}</span>
            </div>
          </div>

          {/* Date & Seal */}
          <div className="pt-4 flex items-center justify-between border-t-2 border-[#b58f62] text-xs text-[#5c371a]">
            <div>
              <span className="font-bold block">Tarih:</span>
              <span>{new Date().toLocaleDateString('tr-TR')}</span>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 rounded-full border-2 border-dashed border-[#8c5222] flex items-center justify-center mx-auto text-[10px] font-black uppercase text-[#8c5222]">
                TÜBİTAK 2204-B
              </div>
              <span className="text-[10px] font-bold mt-1 block">Proje Değerlendirme Mührü</span>
            </div>

            <div className="text-right">
              <span className="font-bold block">Proje Yürütücüsü & Danışman:</span>
              <span>Siyer ve Değerler Eğitimi Kurulu</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-3 pt-4 no-print">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-[#3d2412] hover:bg-[#523018] text-amber-200 font-bold text-xs sm:text-sm transition shadow-lg"
            >
              <Printer className="w-4 h-4" />
              <span>Belgeyi Yazdır / PDF Kaydet</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
