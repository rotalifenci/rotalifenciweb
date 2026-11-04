import React, { useState } from 'react';
import {
  Heart,
  X,
  Scale,
  HeartHandshake,
  ShieldCheck,
  Compass,
  Hourglass,
  Award,
  CheckCircle2,
  Landmark,
  HelpingHand,
  Sparkles
} from 'lucide-react';
import { RootValueId, StudentProgress } from '../types';
import { ROOT_VALUES_LIST } from '../data/rootValues';

interface ValuesJournalModalProps {
  progress: StudentProgress;
  onClose: () => void;
}

export const ValuesJournalModal: React.FC<ValuesJournalModalProps> = ({
  progress,
  onClose
}) => {
  const [selectedValueId, setSelectedValueId] = useState<RootValueId>('adalet');

  const selectedValue = ROOT_VALUES_LIST.find(v => v.id === selectedValueId) || ROOT_VALUES_LIST[0];
  const isUnlocked = progress.unlockedValues.includes(selectedValueId);

  // Icon mapping
  const renderIcon = (id: RootValueId, className: string = 'w-6 h-6') => {
    switch (id) {
      case 'adalet': return <Scale className={className} />;
      case 'dostluk': return <HeartHandshake className={className} />;
      case 'durustluk': return <ShieldCheck className={className} />;
      case 'oz_denetim': return <Compass className={className} />;
      case 'sabir': return <Hourglass className={className} />;
      case 'saygi': return <Award className={className} />;
      case 'sevgi': return <Heart className={className} />;
      case 'sorumluluk': return <CheckCircle2 className={className} />;
      case 'vatanseverlik': return <Landmark className={className} />;
      case 'yardimseverlik': return <HelpingHand className={className} />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/85 backdrop-blur-lg animate-fadeIn">
      <div className="relative w-full max-w-5xl h-[88vh] bg-[#1a221b] border-4 border-[#32593b] rounded-3xl shadow-2xl overflow-hidden flex flex-col parchment-border">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#111712] border-b border-[#25422c]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-900/40 border border-emerald-600/50 text-emerald-300">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-emerald-200 font-title tracking-wider">
                DEĞER KEŞİF DEFTERİ
              </h2>
              <p className="text-xs text-emerald-400/80 font-serif">
                10 Kök Değerin Tarihsel ve Günlük Yaşam Keşif Günlüğü
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 bg-emerald-950/80 px-3 py-1.5 rounded-xl border border-emerald-700/60 text-xs font-bold text-emerald-300">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Keşfedilen: {progress.unlockedValues.length} / 10 Kök Değer</span>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-2xl bg-stone-900 hover:bg-stone-800 text-stone-300 transition border border-stone-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body (Left values list + Right detail parchment) */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* Values Grid / Sidebar */}
          <div className="w-full md:w-80 bg-[#121913] border-r border-[#203324] p-3 overflow-y-auto space-y-1.5">
            {ROOT_VALUES_LIST.map((val) => {
              const unlocked = progress.unlockedValues.includes(val.id);
              const isSelected = val.id === selectedValueId;

              return (
                <button
                  key={val.id}
                  onClick={() => setSelectedValueId(val.id)}
                  className={`w-full p-3 rounded-2xl border transition text-left flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-[#223b28] border-emerald-400 text-emerald-100 shadow-lg'
                      : 'bg-[#152218]/60 border-[#1e3322] hover:bg-[#1a2b1e] text-stone-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-xl text-white ${
                        unlocked ? val.badgeBg : 'bg-stone-800 text-stone-500'
                      }`}
                    >
                      {renderIcon(val.id, 'w-4 h-4')}
                    </div>
                    <div>
                      <div className="text-sm font-bold">{val.name}</div>
                      <div className="text-[11px] text-stone-400 truncate max-w-[130px]">
                        {val.shortDesc}
                      </div>
                    </div>
                  </div>

                  {unlocked ? (
                    <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-black px-2 py-0.5 rounded-md border border-emerald-500/30">
                      Açık
                    </span>
                  ) : (
                    <span className="text-stone-600 text-xs">🔒</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Parchment Content */}
          <div className="flex-1 bg-[#ede8d8] text-[#1c291e] p-6 sm:p-8 overflow-y-auto box-shadow-parchment font-serif">
            <div className="max-w-2xl mx-auto space-y-6">
              
              {/* Header Badge */}
              <div className="border-b-2 border-[#8ba38f] pb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-3.5 rounded-2xl text-white ${selectedValue.badgeBg} shadow-md`}>
                    {renderIcon(selectedValue.id, 'w-8 h-8')}
                  </div>
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-[#1c3822] font-title">
                      {selectedValue.name}
                    </h1>
                    <p className="text-sm text-[#385c3e] italic">
                      "{selectedValue.shortDesc}"
                    </p>
                  </div>
                </div>

                <div>
                  {isUnlocked ? (
                    <div className="px-3 py-1.5 rounded-xl bg-emerald-100 border border-emerald-400 text-emerald-800 text-xs font-black">
                      ✓ Keşfedildi
                    </div>
                  ) : (
                    <div className="px-3 py-1.5 rounded-xl bg-stone-200 border border-stone-400 text-stone-600 text-xs font-bold">
                      Keşif Bekleniyor
                    </div>
                  )}
                </div>
              </div>

              {/* Comprehensive Description */}
              <div className="bg-[#dfd9c5] p-5 rounded-2xl border border-[#c2b9a1] space-y-2">
                <h3 className="text-xs font-black text-[#2e5234] uppercase tracking-wider">
                  Kök Değerin Eğitsel Anlamı:
                </h3>
                <p className="text-base sm:text-lg leading-relaxed text-[#1a2e1e]">
                  {selectedValue.description}
                </p>
              </div>

              {/* Student's Reflection Record */}
              <div className="bg-[#f7f5ed] p-5 rounded-2xl border-2 border-[#b5c7b8] space-y-3">
                <h3 className="text-xs font-black text-[#224728] uppercase tracking-wider">
                  Öğrencinin Defter Kaydı ve Kişisel Görüşü:
                </h3>
                {isUnlocked ? (
                  <p className="text-sm sm:text-base italic text-[#253d29] leading-relaxed">
                    "Bu değer, Peygamberimizin hayatında ve tarihi olaylarda adaletin, sevginin ve güvenin nasıl kökleştiğini gösteren en kıymetli hazinedir. Günlük hayatımda da arkadaşlarıma karşı her zaman dürüst, adil ve yardımsever davranacağım."
                  </p>
                ) : (
                  <p className="text-xs sm:text-sm text-stone-500 italic">
                    Henüz bu kök değerle ilgili tarihsel durağa ulaşmadınız. İlgili yıldaki görev noktasını tamamladığınızda öğrenci günlüğü buraya kaydedilecektir.
                  </p>
                )}
              </div>

              {/* Guidance for Daily Life */}
              <div className="border-t-2 border-[#8ba38f] pt-4 text-xs text-[#3a573f] space-y-1">
                <div className="font-bold uppercase tracking-wider text-[#223d26]">
                  Günlük Yaşamda Nasıl Uygularım?
                </div>
                <p className="text-sm text-[#2b472f] leading-relaxed">
                  Okulda, evde ve sokakta kimseye haksızlık etmeden, empati ve saygıyla davranmak; zor durumda olanlara yardım eli uzatmak bu değerin en güzel yansımasıdır.
                </p>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
