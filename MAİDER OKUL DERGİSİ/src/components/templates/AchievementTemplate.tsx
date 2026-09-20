import React from 'react';
import { MagazinePage } from '../../types/magazine';
import { Trophy, Award, Medal } from 'lucide-react';

interface Props {
  page: MagazinePage;
}

export const AchievementTemplate: React.FC<Props> = ({ page }) => {
  const photos = page.photos || [];

  return (
    <div className="w-full h-full bg-[#FDFBF7] text-slate-900 flex flex-col justify-start overflow-visible">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-amber-600 text-xs font-bold uppercase tracking-widest mb-1">
          <Trophy className="w-4 h-4 text-amber-500" />
          <span>GURUR TABLOMUZ / BAŞARILARIMIZ</span>
        </div>
        <h1 className="font-editorial text-2xl md:text-3xl font-extrabold text-slate-950 leading-tight">
          {page.title}
        </h1>
        {page.subtitle && (
          <p className="text-slate-600 text-xs md:text-sm italic font-serif mt-1 pb-1.5 border-b border-amber-200">
            {page.subtitle}
          </p>
        )}
      </div>

      {/* Main Grid */}
      <div className="my-2 grid grid-cols-12 gap-4 flex-1 items-stretch">
        {/* Left Column: Trophy Photos (5 cols) */}
        <div className="col-span-5 flex flex-col gap-3">
          {photos[0] && (
            <div className="rounded-xl overflow-hidden shadow-md border-2 border-amber-300 h-52 group relative">
              <img src={photos[0].url} alt="Kupa" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              {photos[0].caption && (
                <div className="absolute bottom-0 inset-x-0 bg-amber-950/80 text-amber-200 text-[10px] p-2">
                  {photos[0].caption}
                </div>
              )}
            </div>
          )}

          {photos[1] && (
            <div className="rounded-lg overflow-hidden border border-amber-200 shadow-sm h-28">
              <img src={photos[1].url} alt="Ödül Töreni" className="w-full h-full object-cover" />
            </div>
          )}
        </div>

        {/* Right Column: Trophy Details & Story (7 cols) */}
        <div className="col-span-7 flex flex-col justify-start">
          <div className="bg-amber-50/80 p-3 rounded-xl border border-amber-200 mb-2 flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0 shadow">
              <Medal className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-amber-900 uppercase block">DERECE: İL BİRİNCİLİĞİ</span>
              <span className="text-[11px] text-slate-600 block mt-0.5">Ortaokullar Arası Otonom Robotik Turnuvası Şampiyonu</span>
            </div>
          </div>

          <div className="text-xs md:text-sm text-slate-700 leading-[1.45] text-justify whitespace-pre-line flex-1">
            {page.content}
          </div>

          {page.pullQuote && (
            <div className="mt-3 p-3 bg-white rounded-lg border-l-4 border-amber-500 shadow-xs">
              <p className="font-editorial italic text-xs md:text-sm text-slate-800 font-bold">
                “{page.pullQuote}”
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
