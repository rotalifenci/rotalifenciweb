import React from 'react';
import { MagazinePage } from '../../types/magazine';
import { Calendar, MapPin, Camera } from 'lucide-react';

interface Props {
  page: MagazinePage;
}

export const EventTemplates: React.FC<Props> = ({ page }) => {
  const photos = page.photos || [];

  return (
    <div className="w-full h-full bg-[#FDFBF7] text-slate-900 flex flex-col justify-start overflow-visible">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-2 text-orange-600 text-xs font-bold uppercase tracking-widest">
            <Calendar className="w-4 h-4" />
            <span>OKUL ETKİNLİĞİ & KUTLAMALAR</span>
          </div>
          <span className="text-xs bg-orange-100 text-orange-800 font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            Okul Konferans Salonu & Bahçe
          </span>
        </div>

        <h1 className="font-editorial text-2xl md:text-3xl font-extrabold text-slate-950 leading-tight">
          {page.title}
        </h1>
        {page.subtitle && (
          <p className="text-slate-600 text-xs md:text-sm italic font-serif mt-1 pb-1.5 border-b border-orange-200">
            {page.subtitle}
          </p>
        )}
      </div>

      {/* Dynamic 4 to 6 Photo Grid */}
      <div className="my-2.5 grid grid-cols-12 gap-3 flex-1 items-stretch">
        {/* Main Large Event Photo (7 cols) */}
        <div className="col-span-7 flex flex-col justify-start">
          <div className="rounded-xl overflow-hidden shadow-sm border border-orange-200 h-56 group relative">
            <img
              src={photos[0]?.url || 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80'}
              alt="Ana Etkinlik"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {photos[0]?.caption && (
              <div className="absolute bottom-0 inset-x-0 bg-slate-900/80 text-orange-200 text-[10px] px-3 py-1">
                {photos[0].caption}
              </div>
            )}
          </div>

          <div className="mt-2.5 text-xs md:text-sm text-slate-700 leading-[1.45] text-justify whitespace-pre-line">
            {page.content}
          </div>
        </div>

        {/* Right Photo Collage (5 cols) */}
        <div className="col-span-5 grid grid-cols-2 gap-2 content-start">
          {photos.slice(1, 5).map((p, idx) => (
            <div key={idx} className="rounded-lg overflow-hidden border border-orange-200 shadow-sm h-28 relative group">
              <img src={p.url} alt={`Etkinlik ${idx + 2}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              {p.caption && (
                <div className="absolute bottom-0 inset-x-0 bg-slate-900/70 text-white text-[9px] px-1 py-0.5 truncate">
                  {p.caption}
                </div>
              )}
            </div>
          ))}

          {photos.length > 5 && (
            <div className="col-span-2 bg-orange-50 rounded-lg p-2 text-center text-[10px] text-orange-800 font-medium flex items-center justify-center gap-1 border border-orange-200">
              <Camera className="w-3.5 h-3.5 text-orange-600" />
              <span>Daha fazla fotoğraf için galeri sayfasını inceleyin</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
