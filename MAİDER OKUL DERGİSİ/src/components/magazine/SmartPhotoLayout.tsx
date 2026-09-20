import React from 'react';
import { MagazinePhoto } from '../../types/magazine';

interface Props {
  photos?: MagazinePhoto[];
  themeColor?: string;
  className?: string;
  imageFit?: 'cover' | 'contain';
}

export const sanitizePhotoCaption = (rawCaption?: string): string => {
  if (!rawCaption) return '';
  let cleaned = rawCaption.trim();
  if (/^images?$/i.test(cleaned) || /^photos?$/i.test(cleaned) || /^img(_\d+)?$/i.test(cleaned)) {
    return '';
  }
  cleaned = cleaned.replace(/\.(jpg|jpeg|png|webp|svg)$/i, '').trim();
  if (/^images?$/i.test(cleaned) || /^photos?$/i.test(cleaned)) {
    return '';
  }
  return cleaned;
};

export const SmartPhotoLayout: React.FC<Props> = ({
  photos = [],
  className = '',
  imageFit = 'contain',
}) => {
  if (!photos || photos.length === 0) return null;

  const validPhotos = photos.filter(p => !!p.url);
  if (validPhotos.length === 0) return null;

  const count = validPhotos.length;

  // Single Photo Layout (Clean, no grey boxes, no black bands, no MAİDER FOTO)
  if (count === 1) {
    const photo = validPhotos[0];
    const caption = sanitizePhotoCaption(photo.caption);

    return (
      <div className={`my-2 sm:my-3 bg-transparent ${className}`}>
        <img
          src={photo.url}
          alt={caption || 'Dergi Görseli'}
          className={`block mx-auto rounded-lg shadow-xs ${
            imageFit === 'contain' ? 'max-w-full h-auto object-contain' : 'w-full h-48 sm:h-56 object-cover'
          }`}
          loading="lazy"
        />
        {caption && (
          <figcaption className="text-xs text-gray-500 italic text-center mt-1">
            {caption}
          </figcaption>
        )}
      </div>
    );
  }

  // 2 Photos Layout (Side-by-side, clean transparent background)
  if (count === 2) {
    const [p1, p2] = validPhotos;
    const c1 = sanitizePhotoCaption(p1.caption);
    const c2 = sanitizePhotoCaption(p2.caption);

    return (
      <div className={`my-2 sm:my-3 bg-transparent ${className}`}>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col bg-transparent">
            <img
              src={p1.url}
              alt={c1 || 'Foto 1'}
              className="w-full h-36 sm:h-44 object-cover rounded-lg shadow-xs"
              loading="lazy"
            />
            {c1 && (
              <figcaption className="text-xs text-gray-500 italic text-center mt-1">
                {c1}
              </figcaption>
            )}
          </div>

          <div className="flex flex-col bg-transparent">
            <img
              src={p2.url}
              alt={c2 || 'Foto 2'}
              className="w-full h-36 sm:h-44 object-cover rounded-lg shadow-xs"
              loading="lazy"
            />
            {c2 && (
              <figcaption className="text-xs text-gray-500 italic text-center mt-1">
                {c2}
              </figcaption>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 3 Photos Layout (1 lead + 2 supporting)
  if (count === 3) {
    const lead = validPhotos.find(p => p.isMain) || validPhotos[0];
    const rest = validPhotos.filter(p => p !== lead);
    const leadCaption = sanitizePhotoCaption(lead.caption);

    return (
      <div className={`my-2 sm:my-3 bg-transparent ${className}`}>
        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-7 flex flex-col bg-transparent">
            <img
              src={lead.url}
              alt={leadCaption || 'Ana Görsel'}
              className="w-full h-44 sm:h-52 object-cover rounded-lg shadow-xs"
              loading="lazy"
            />
            {leadCaption && (
              <figcaption className="text-xs text-gray-500 italic text-center mt-1">
                {leadCaption}
              </figcaption>
            )}
          </div>

          <div className="col-span-5 flex flex-col gap-2 bg-transparent">
            {rest.map((p, idx) => {
              const c = sanitizePhotoCaption(p.caption);
              return (
                <div key={p.id || idx} className="flex flex-col bg-transparent">
                  <img
                    src={p.url}
                    alt={c || `Foto ${idx + 2}`}
                    className="w-full h-20 sm:h-24 object-cover rounded-lg shadow-xs"
                    loading="lazy"
                  />
                  {c && (
                    <figcaption className="text-[11px] text-gray-500 italic text-center mt-0.5">
                      {c}
                    </figcaption>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // 4 Photos Layout (2x2 grid)
  return (
    <div className={`my-2 sm:my-3 bg-transparent ${className}`}>
      <div className="grid grid-cols-2 gap-2.5">
        {validPhotos.slice(0, 4).map((p, idx) => {
          const c = sanitizePhotoCaption(p.caption);
          return (
            <div key={p.id || idx} className="flex flex-col bg-transparent">
              <img
                src={p.url}
                alt={c || `Foto ${idx + 1}`}
                className="w-full h-28 sm:h-32 object-cover rounded-lg shadow-xs"
                loading="lazy"
              />
              {c && (
                <figcaption className="text-[11px] text-gray-500 italic text-center mt-0.5">
                  {c}
                </figcaption>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
