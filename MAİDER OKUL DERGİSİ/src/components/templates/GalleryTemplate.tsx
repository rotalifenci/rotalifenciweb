import React from 'react';
import { MagazinePage } from '../../types/magazine';
import { Camera, Image as ImageIcon } from 'lucide-react';

interface Props {
  page: MagazinePage;
}

export const GalleryTemplate: React.FC<Props> = ({ page }) => {
  const photos = page.photos || [];

  return (
    <div className="w-full h-full bg-[#FDFBF7] text-slate-900 flex flex-col justify-start overflow-visible">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-sky-700 text-xs font-bold uppercase tracking-widest mb-1">
          <Camera className="w-4 h-4" />
          <span>FOTOĞRAF SEÇKİSİ / GALERİ</span>
        </div>
        <h1 className="font-editorial text-2xl md:text-3xl font-extrabold text-slate-950 leading-tight">
          {page.title}
        </h1>
        {page.subtitle && (
          <p className="text-slate-600 text-xs italic font-serif mt-0.5 pb-2 border-b border-sky-200">
            {page.subtitle}
          </p>
        )}
      </div>

      {/* Modern Collage Layout */}
      <div className="my-3 grid grid-cols-3 gap-3 flex-1">
        {photos.slice(0, 6).map((photo, idx) => (
          <div
            key={idx}
            className={`rounded-xl overflow-hidden border border-slate-200 shadow-sm relative group bg-slate-100 ${
              idx === 0 ? 'col-span-2 row-span-2' : ''
            }`}
          >
            <img
              src={photo.url}
              alt={photo.caption || `Galeri ${idx + 1}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {photo.caption && (
              <div className="absolute bottom-0 inset-x-0 bg-slate-900/80 text-white text-[10px] p-2 leading-tight">
                {photo.caption}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
