import React from 'react';
import { MagazinePage } from '../../types/magazine';
import { Feather, Heart } from 'lucide-react';

interface Props {
  page: MagazinePage;
}

export const PoetryTemplate: React.FC<Props> = ({ page }) => {
  const photo = page.photos && page.photos[0];

  return (
    <div className="w-full h-full bg-[#FCFAF7] text-slate-900 flex flex-col justify-start relative overflow-visible">
      {/* Decorative subtle background ornaments */}
      <div className="absolute top-6 right-8 text-rose-100 -z-0 opacity-70">
        <Feather className="w-48 h-48" />
      </div>

      {/* Header */}
      <div className="relative z-10 text-center pb-4 border-b border-rose-200/80">
        <div className="inline-flex items-center gap-1.5 text-rose-800 text-[11px] font-bold uppercase tracking-widest mb-2">
          <Feather className="w-3.5 h-3.5 text-rose-600" />
          <span>GENÇ KALEMLER • ŞİİR KÖŞESİ</span>
        </div>
        <h1 className="font-editorial text-3xl md:text-4xl font-black text-slate-950 tracking-wide">
          {page.title}
        </h1>
        {page.subtitle && (
          <p className="text-slate-500 text-xs italic font-serif mt-1">
            {page.subtitle}
          </p>
        )}
      </div>

      {/* Center Poetry Stanzas */}
      <div className="relative z-10 my-auto py-6 max-w-lg mx-auto text-center">
        <div className="font-editorial text-base md:text-lg text-slate-800 leading-loose italic whitespace-pre-line tracking-wide">
          {page.content || `Bir yaprak düşer usulca toprağa,\nGökkuşağı boyanır yarının umuduna.\nKalemimizde bilim, yüreğimizde sevgi,\nYıldızlara uzanır Mehmet Akif İnan gençliği.\n\nHer yeni gün bir keşif, her adım bir zafer,\nMerak eden gözlerde parıldar pencereler.`}
        </div>

        {/* Poet Info */}
        <div className="mt-8 pt-4 border-t border-rose-200/60 inline-block">
          <p className="font-editorial font-bold text-sm text-slate-900">{page.author || 'Öğrenci Şairimiz'}</p>
          <p className="text-xs text-rose-700 font-serif italic mt-0.5">{page.authorRole || '7-A Sınıfı'}</p>
        </div>
      </div>
    </div>
  );
};
