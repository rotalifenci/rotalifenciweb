import React from 'react';
import { MagazinePage } from '../../types/magazine';
import { Bookmark, Star } from 'lucide-react';

interface Props {
  page: MagazinePage;
}

export const BookReviewTemplate: React.FC<Props> = ({ page }) => {
  const photo = page.photos && page.photos[0];
  const book = page.extraData?.bookData || {
    bookAuthor: 'Antoine de Saint-Exupéry',
    publisher: 'Can Çocuk Yayınları',
    rating: 5,
    recommendedFor: '5, 6, 7 ve 8. Sınıf Öğrencileri'
  };

  return (
    <div className="w-full h-full bg-[#FDFBF7] text-slate-900 flex flex-col justify-start overflow-visible">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-amber-800 text-xs font-bold uppercase tracking-widest mb-1">
          <Bookmark className="w-4 h-4" />
          <span>KİTAP & FİLM İNCELEMESİ</span>
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
      <div className="my-2.5 grid grid-cols-12 gap-4 flex-1 items-start">
        {/* Book Cover & Meta Left (4 cols) */}
        <div className="col-span-4 bg-amber-50/70 p-3.5 rounded-xl border border-amber-200 flex flex-col items-center text-center">
          <div className="w-32 h-44 rounded-lg overflow-hidden shadow-lg border-2 border-white mb-2.5">
            <img
              src={photo?.url || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80'}
              alt="Kitap Kapağı"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Star Rating */}
          <div className="flex items-center gap-1 mb-1.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
            ))}
          </div>

          <p className="text-xs font-bold text-slate-800">{book.bookAuthor}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">{book.publisher}</p>

          <div className="mt-2.5 p-2 bg-white rounded border border-amber-200 w-full text-left text-[10px]">
            <span className="font-bold text-amber-900 block">Önerilen Seviye:</span>
            <span className="text-slate-600">{book.recommendedFor}</span>
          </div>
        </div>

        {/* Review Content Right (8 cols) */}
        <div className="col-span-8 flex flex-col justify-start">
          {page.pullQuote && (
            <div className="p-2.5 bg-white rounded-lg border-l-4 border-amber-600 shadow-sm mb-2.5">
              <p className="font-editorial italic text-xs md:text-sm text-slate-800 font-bold">
                “{page.pullQuote}”
              </p>
            </div>
          )}

          <div className="text-xs md:text-sm text-slate-700 leading-[1.45] text-justify whitespace-pre-line flex-1">
            {page.content}
          </div>

          {page.author && (
            <div className="mt-3 pt-2 border-t border-slate-200 text-right text-xs text-slate-500">
              İnceleyen: <strong className="text-slate-800">{page.author}</strong> {page.authorRole ? `(${page.authorRole})` : ''}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
