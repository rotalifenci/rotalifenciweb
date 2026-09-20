import React from 'react';
import { MagazinePage } from '../../types/magazine';
import { Quote, Feather } from 'lucide-react';

interface Props {
  page: MagazinePage;
}

export const EditorialTemplate: React.FC<Props> = ({ page }) => {
  const photo = page.photos && page.photos[0];

  return (
    <div className="w-full h-full bg-[#FDFBF7] text-slate-900 flex flex-col justify-start overflow-visible">
      {/* Top Section */}
      <div>
        <div className="flex items-center gap-2 text-amber-700 font-bold text-xs uppercase tracking-widest mb-1">
          <Feather className="w-4 h-4" />
          <span>BAŞYAZI / EDİTÖRDEN</span>
        </div>
        <h1 className="font-editorial text-3xl md:text-4xl font-extrabold text-slate-950 leading-tight">
          {page.title || 'Öğrenmenin ve Üretmenin Sınırsız Coşkusu'}
        </h1>
        {page.subtitle && (
          <p className="text-slate-600 text-sm italic mt-1.5 font-serif border-b border-slate-200 pb-2">
            {page.subtitle}
          </p>
        )}
      </div>

      {/* Main Content Layout */}
      <div className="my-3 grid grid-cols-1 md:grid-cols-12 gap-5 flex-1 items-start">
        {/* Author Photo & Card Left (4 cols) */}
        <div className="md:col-span-4 flex flex-col items-center text-center bg-amber-50/60 p-3.5 rounded-xl border border-amber-200/60">
          <div className="w-36 h-44 rounded-lg overflow-hidden shadow-md border-2 border-white mb-2.5">
            <img
              src={photo?.url || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80'}
              alt={page.author || 'Editör'}
              className="w-full h-full object-cover"
            />
          </div>
          <h3 className="font-editorial text-base font-bold text-slate-900">{page.author || 'Mustafa Yılmaz'}</h3>
          <p className="text-xs text-amber-800 font-semibold mt-0.5">{page.authorRole || 'Okul Müdürü'}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Mehmet Akif İnan Ortaokulu</p>

          {/* Decorative Signature */}
          <div className="mt-3 pt-2 border-t border-amber-200/80 w-full text-center">
            <span className="font-serif italic text-sm text-slate-600 tracking-wider">Mustafa Yılmaz</span>
          </div>
        </div>

        {/* Editorial Body Text Right (8 cols) */}
        <div className="md:col-span-8 flex flex-col justify-start">
          {page.pullQuote && (
            <div className="relative bg-white p-3 rounded-lg border-l-4 border-amber-500 shadow-sm mb-3">
              <Quote className="absolute top-2 right-2 w-7 h-7 text-amber-100 -z-0" />
              <p className="relative z-10 font-editorial italic text-slate-800 text-sm md:text-base leading-snug">
                “{page.pullQuote}”
              </p>
            </div>
          )}

          <div className="text-xs md:text-sm text-slate-700 leading-[1.45] space-y-1.5 text-justify whitespace-pre-line flex-1">
            {page.content}
          </div>
        </div>
      </div>
    </div>
  );
};
