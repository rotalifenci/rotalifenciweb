import React from 'react';
import { MagazinePage } from '../../types/magazine';
import { Compass, CheckCircle, Brain, Lightbulb, Clock } from 'lucide-react';

interface Props {
  page: MagazinePage;
}

export const InfoCardsTemplate: React.FC<Props> = ({ page }) => {
  return (
    <div className="w-full h-full bg-[#FDFBF7] text-slate-900 flex flex-col justify-start overflow-visible">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase tracking-widest mb-1">
          <Compass className="w-4 h-4" />
          <span>REHBERLİK & GELİŞİM KÖŞESİ</span>
        </div>
        <h1 className="font-editorial text-2xl md:text-3xl font-extrabold text-slate-950 leading-tight">
          {page.title}
        </h1>
        {page.subtitle && (
          <p className="text-slate-600 text-xs md:text-sm italic font-serif mt-1 pb-2 border-b border-emerald-200">
            {page.subtitle}
          </p>
        )}
      </div>

      {/* 4 Info Cards Grid */}
      <div className="my-3 grid grid-cols-2 gap-4 flex-1">
        <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-200 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase mb-2">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span>1. Pomodoro Tekniği</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              25 dakika odaklanarak ders çalışın, ardından 5 dakika zihninizi dinlendirin. Dört seansın sonunda 20 dakikalık uzun mola verin.
            </p>
          </div>
        </div>

        <div className="bg-sky-50/70 p-4 rounded-xl border border-sky-200 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center gap-2 text-sky-800 font-bold text-xs uppercase mb-2">
              <Brain className="w-4 h-4 text-sky-600" />
              <span>2. Zihin Haritaları</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              Uzun paragrafları ezberlemek yerine renkli kalemlerle kavramlar arası bağlar kurun. Görsel hafıza bilgiyi kalıcı kılar.
            </p>
          </div>
        </div>

        <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-200 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center gap-2 text-amber-800 font-bold text-xs uppercase mb-2">
              <Lightbulb className="w-4 h-4 text-amber-600" />
              <span>3. Feynman Yöntemi</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              Öğrendiğiniz zor bir fen veya matematik konusunu sanki 10 yaşındaki bir çocuğa anlatıyormuş gibi basitleştirerek anlatın.
            </p>
          </div>
        </div>

        <div className="bg-purple-50/70 p-4 rounded-xl border border-purple-200 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center gap-2 text-purple-800 font-bold text-xs uppercase mb-2">
              <CheckCircle className="w-4 h-4 text-purple-600" />
              <span>4. Düzenli Uyku & Su</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              Beynimizin bilgileri uzun süreli belleğe aktarması kaliteli gece uykusunda gerçekleşir. Günde en az 8 saat uyku zindelik verir.
            </p>
          </div>
        </div>
      </div>

      {/* Summary note */}
      <div className="bg-white p-3 rounded-lg border border-slate-200 text-xs text-slate-700 italic">
        {page.content || 'Mehmet Akif İnan Ortaokulu Rehberlik Servisi olarak her öğrencimizin başarı yolculuğunda yanındayız.'}
      </div>
    </div>
  );
};
