import React from 'react';
import { MagazinePage } from '../../types/magazine';
import { CATEGORY_THEMES } from '../../config/brand';
import { SmartPhotoLayout } from '../magazine/SmartPhotoLayout';
import { renderFormattedContent } from '../../utils/richTextFormatter';
import { calculateWordCount } from '../../services/smartLayout';

interface Props {
  page: MagazinePage;
}

export const ArticleSinglePhotoTemplate: React.FC<Props> = ({ page }) => {
  const theme = CATEGORY_THEMES[page.category] || CATEGORY_THEMES['Okulumuzdan'];
  const photo = page.photos && page.photos.length > 0 ? page.photos[0] : null;
  const wordCount = calculateWordCount(page.content || '');

  // Dinamik tipografi ve görsel boyutu: Amacımız tam dolu sayfa olması
  const fontClass = wordCount > 320
    ? 'text-[9.5pt] leading-[1.4] tracking-[0.01em]'
    : wordCount > 240
    ? 'text-[10.5pt] leading-[1.5] tracking-[0.012em]'
    : wordCount > 150
    ? 'text-[11.5pt] leading-[1.62] tracking-[0.015em]'
    : wordCount > 90
    ? 'text-[12pt] leading-[1.72] tracking-[0.018em]'
    : 'text-[12.5pt] leading-[1.8] tracking-[0.02em]';

  const photoMaxHeightClass = wordCount > 300
    ? 'max-h-32 sm:max-h-36'
    : wordCount > 230
    ? 'max-h-44 sm:max-h-48'
    : wordCount > 140
    ? 'max-h-56 sm:max-h-60'
    : wordCount > 80
    ? 'max-h-64 sm:max-h-72'
    : 'max-h-72 sm:max-h-80';

  return (
    <div className="w-full h-full bg-[#FDFBF7] text-slate-900 flex flex-col justify-start overflow-visible">
      {/* Header Area: Başlık ve Alt Başlık (Kategori sadece en üst künyede yer alır) */}
      <div className="shrink-0 mb-2">
        <h1 className="font-editorial text-2xl md:text-3xl font-extrabold text-slate-950 leading-tight">
          {page.title}
        </h1>

        {page.subtitle && (
          <p className="text-slate-600 text-xs md:text-sm italic font-serif mt-1 pb-2 border-b border-slate-200">
            {page.subtitle}
          </p>
        )}
      </div>

      {/* CONTINUOUS MULTI-COLUMN FLOW (Görsel ve metin doğal float wrap ile sarılır) */}
      <div className="flex-1 my-1 overflow-visible">
        <div className={`${fontClass} text-slate-700 text-justify h-full font-serif`} style={{ display: 'block' }}>
          {(() => {
            const inlineFloatPhoto = photo ? (
              <span
                className="block float-right ml-4 mb-2.5 select-none"
                style={{ width: '45%', maxWidth: '270px', clear: 'right' }}
              >
                <img
                  src={photo.url}
                  alt={photo.caption || page.title}
                  className={`w-full ${photoMaxHeightClass} object-cover rounded-lg shadow-xs`}
                  loading="eager"
                />
                {photo.caption && (
                  <span className="block text-xs text-gray-500 italic text-center mt-1">
                    {photo.caption}
                  </span>
                )}
              </span>
            ) : null;

            return renderFormattedContent(page.content || '', theme.color, true, inlineFloatPhoto);
          })()}

          {page.pullQuote && (
            <div
              className="break-inside-avoid my-3 p-3.5 rounded-md border-l-4 shadow-sm"
              style={{ borderColor: theme.color, backgroundColor: theme.bgLight }}
            >
              <p className="font-editorial italic font-bold text-xs md:text-sm text-slate-800 leading-snug">
                “{page.pullQuote}”
              </p>
            </div>
          )}

          {page.qrCodeDataUrl && (
            <div className="break-inside-avoid my-3 p-2 rounded-lg bg-white border border-slate-200 shadow-sm flex flex-col items-center justify-center max-w-[130px]">
              <img src={page.qrCodeDataUrl} alt="QR Kod" className="w-24 h-24 object-contain" />
              <span className="text-[9px] font-bold text-center text-slate-600 mt-1 uppercase leading-tight">
                {page.qrLabel || 'Detaylar İçin Tara'}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const ArticleTwoPhotosTemplate: React.FC<Props> = ({ page }) => {
  const theme = CATEGORY_THEMES[page.category] || CATEGORY_THEMES['Okulumuzdan'];
  const hasPhotos = page.photos && page.photos.length > 0;

  return (
    <div className="w-full h-full bg-[#FDFBF7] text-slate-900 flex flex-col justify-start overflow-visible">
      <div>
        <h1 className="font-editorial text-2xl md:text-3xl font-extrabold text-slate-950 leading-tight">
          {page.title}
        </h1>
        {page.subtitle && (
          <p className="text-slate-600 text-xs md:text-sm italic font-serif mt-1 pb-1.5 border-b border-slate-200">
            {page.subtitle}
          </p>
        )}
      </div>

      {/* Smart Multi-Photo Container with auto frame, spacing, and captions */}
      {hasPhotos && (
        <SmartPhotoLayout photos={page.photos} themeColor={theme.color} />
      )}

      {page.pullQuote && (
        <div className="my-1 px-3.5 py-1.5 bg-white rounded border-l-4 shadow-sm" style={{ borderColor: theme.color }}>
          <p className="font-editorial italic font-semibold text-xs text-slate-800">
            “{page.pullQuote}”
          </p>
        </div>
      )}

      <div className="flex-1 my-1 text-[12pt] text-slate-700 leading-[1.45] tracking-[0.015em] text-justify font-serif" style={{ display: 'block' }}>
        {renderFormattedContent(page.content || '', theme.color, true)}
      </div>
    </div>
  );
};

export const ArticleContinuationTemplate: React.FC<Props> = ({ page }) => {
  const photo = page.photos && page.photos[0];

  return (
    <div className="w-full h-full bg-[#FDFBF7] text-slate-900 flex flex-col justify-start overflow-visible">
      <div className="border-b border-slate-300 pb-1.5 mb-2.5 flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
          DEVAM SAYFASI
        </span>
        <h2 className="font-editorial text-sm font-bold text-slate-800 truncate max-w-md">
          {page.title}
        </h2>
      </div>

      <div className="flex-1 flex flex-col justify-start">
        {photo && (
          <div className="float-right ml-4 mb-3 w-56 rounded-lg overflow-hidden shadow-sm border border-slate-200">
            <img src={photo.url} alt="Devam görseli" className="w-full h-36 object-cover" />
            {photo.caption && <p className="text-[10px] text-slate-500 italic p-1.5 bg-slate-50">{photo.caption}</p>}
          </div>
        )}

        <div className="text-[12pt] text-slate-700 leading-[1.45] tracking-[0.015em] text-justify whitespace-pre-line flex-1 font-serif" style={{ display: 'block' }}>
          {page.content}
        </div>
      </div>
    </div>
  );
};
