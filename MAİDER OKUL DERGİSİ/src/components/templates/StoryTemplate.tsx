import React from 'react';
import { MagazinePage } from '../../types/magazine';
import { BookOpen } from 'lucide-react';

interface Props {
  page: MagazinePage;
}

export const StoryTemplate: React.FC<Props> = ({ page }) => {
  const photo = page.photos && page.photos[0];

  return (
    <div className="w-full h-full bg-[#FDFBF7] text-slate-900 flex flex-col justify-start overflow-visible">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-rose-900 text-xs font-bold uppercase tracking-widest mb-1">
          <BookOpen className="w-4 h-4" />
          <span>GENÇ KALEMLER • ÖYKÜ VE DENEME</span>
        </div>
        <h1 className="font-editorial text-3xl md:text-4xl font-extrabold text-slate-950 leading-tight">
          {page.title}
        </h1>
        {page.subtitle && (
          <p className="text-slate-600 text-xs md:text-sm italic font-serif mt-1 pb-1.5 border-b border-rose-200">
            {page.subtitle}
          </p>
        )}
      </div>

      {/* Main Layout: Book format columns with decorative initial letter */}
      <div className="my-2 flex-1 flex flex-col justify-start">
        {photo && (
          <div className="float-right ml-4 mb-3 w-48 rounded-lg overflow-hidden border border-rose-200 shadow-sm">
            <img src={photo.url} alt="Öykü illüstrasyonu" className="w-full h-36 object-cover" />
            {photo.caption && <p className="text-[9px] text-slate-500 italic p-1 bg-white">{photo.caption}</p>}
          </div>
        )}

        {page.pullQuote && (
          <div className="my-1.5 p-2.5 bg-rose-50/70 border-l-4 border-rose-800 rounded shadow-xs">
            <p className="font-editorial italic text-xs md:text-sm text-slate-800 font-bold">
              “{page.pullQuote}”
            </p>
          </div>
        )}

        <div className="text-xs md:text-sm text-slate-700 leading-[1.45] text-justify whitespace-pre-line editorial-drop-cap flex-1" style={{ display: 'block' }}>
          {page.content}
        </div>

        {page.author && (
          <div className="mt-4 pt-2 border-t border-dashed border-rose-200 text-right">
            <span className="font-editorial font-bold text-xs text-slate-800">{page.author}</span>
            {page.authorRole && <span className="text-[11px] text-slate-500 italic ml-1.5">• {page.authorRole}</span>}
          </div>
        )}
      </div>
    </div>
  );
};
