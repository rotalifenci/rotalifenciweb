import React from 'react';
import { MagazinePage } from '../../types/magazine';
import { Palette } from 'lucide-react';

interface Props {
  page: MagazinePage;
}

export const ArtTemplate: React.FC<Props> = ({ page }) => {
  const photo = page.photos && page.photos[0];

  return (
    <div className="w-full h-full bg-[#FAF9F6] text-slate-900 flex flex-col justify-start overflow-visible">
      {/* Top Gallery Header */}
      <div className="text-center pb-3 border-b border-orange-200/80">
        <div className="inline-flex items-center gap-1.5 text-orange-700 text-xs font-bold uppercase tracking-widest mb-1">
          <Palette className="w-4 h-4" />
          <span>GÖRSEL SANATLAR VE TASARIM VİTRİNİ</span>
        </div>
        <h1 className="font-editorial text-2xl md:text-3xl font-extrabold text-slate-950">
          {page.title}
        </h1>
      </div>

      {/* Center Museum Artwork Display - Clean, Framed, Uncluttered */}
      <div className="my-auto py-3 flex flex-col items-center">
        <div className="p-3 bg-white rounded-lg shadow-xl border border-slate-300/80 max-w-lg w-full">
          <div className="relative rounded overflow-hidden aspect-[4/3] bg-slate-100 flex items-center justify-center">
            {photo ? (
              <img
                src={photo.url}
                alt={page.title}
                className="w-full h-full object-contain"
              />
            ) : (
              <p className="text-slate-400 text-xs">Sanat Eseri Yüklenmedi</p>
            )}
          </div>
        </div>

        {/* Museum Plaque Label Below Artwork */}
        <div className="mt-4 bg-white px-6 py-3 rounded-md border border-slate-200 shadow-sm text-center max-w-sm">
          <h3 className="font-editorial text-sm font-bold text-slate-900">{page.title}</h3>
          <p className="text-xs text-orange-800 font-medium mt-0.5">
            Sanatçı: {page.author || 'Öğrenci Sanatçımız'} {page.authorRole ? `(${page.authorRole})` : ''}
          </p>
          <p className="text-[11px] text-slate-500 italic mt-1">
            {page.content || 'Tuval Üzerine Akrilik Boya ve Karışık Teknik'}
          </p>
        </div>
      </div>
    </div>
  );
};
