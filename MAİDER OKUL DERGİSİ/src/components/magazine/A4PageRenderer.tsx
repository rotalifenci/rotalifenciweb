import React from 'react';
import { MagazineCategory, MagazinePhoto } from '../../types/magazine';
import { CATEGORY_THEMES } from '../../config/brand';
import { Quote } from 'lucide-react';
import { renderFormattedContent, splitContentAtWordCount } from '../../utils/richTextFormatter';
import { SmartLayoutType, PullQuoteStyle, A4_CONSTANTS } from '../../services/smartPageEngine';

export type LayoutStyle = SmartLayoutType;
export type ImagePosition = 'inline-left' | 'inline-right' | 'full-width' | 'bottom' | 'top' | 'left' | 'right';
export type ImageFit = 'contain' | 'cover';
export type ComponentSize = 'small' | 'medium' | 'large';

export const sanitizeCaption = (rawCaption?: string): string => {
  if (!rawCaption) return '';
  let cleaned = rawCaption.trim();
  if (/^images?$/i.test(cleaned) || /^photos?$/i.test(cleaned) || /^img(_\d+)?$/i.test(cleaned) || /^resim\d*$/i.test(cleaned) || /^foto\d*$/i.test(cleaned)) {
    return '';
  }
  cleaned = cleaned.replace(/\.(jpg|jpeg|png|webp|svg)$/i, '').trim();
  if (/^images?$/i.test(cleaned) || /^photos?$/i.test(cleaned) || /^resim\d*$/i.test(cleaned)) {
    return '';
  }
  return cleaned;
};

export interface A4PageRendererProps {
  id?: string;
  title: string;
  subtitle: string;
  content: string;
  pullQuote?: string;
  pullQuoteStyle?: PullQuoteStyle;
  sourceReference?: string;
  category: MagazineCategory;
  author?: string;
  authorRole?: string;
  photos: MagazinePhoto[];
  year?: number;
  month?: string;
  issueNumber?: number;
  pageNumber?: number;
  layoutStyle?: LayoutStyle;
  imagePosition?: ImagePosition;
  imageFit?: ImageFit;
  imageScale?: number;
  pullQuoteSize?: ComponentSize;
  showGuides?: boolean;
  fontFamily?: string;
  fontSize?: number;
  lineHeight?: number;
  letterSpacing?: number;
  titleColor?: string;
  textAlign?: 'justify' | 'left' | 'center';
  fullPageCanvasImage?: string | null;
  isFullPageCanvas?: boolean;
  fullPageMode?: 'canvas-fit' | 'overlay' | 'full-bleed';
}

export const A4PageRenderer: React.FC<A4PageRendererProps> = ({
  id = 'active-preview-page',
  title,
  subtitle,
  content,
  pullQuote,
  pullQuoteStyle = 'box',
  sourceReference,
  category,
  author = '',
  authorRole = '',
  photos = [],
  year = 2026,
  month = 'Eylül',
  issueNumber = 9,
  pageNumber = 1,
  layoutStyle = 'classic',
  imagePosition = 'inline-left',
  imageFit = 'contain',
  imageScale = 100,
  showGuides = false,
  fontFamily = 'Merriweather',
  fontSize = 13,
  lineHeight = 1.45,
  letterSpacing = 0,
  titleColor,
  textAlign = 'justify',
  fullPageCanvasImage = null,
  isFullPageCanvas = false,
  fullPageMode = 'canvas-fit',
}) => {
  const theme = CATEGORY_THEMES[category] || CATEGORY_THEMES['Okulumuzdan'];
  const displayTitle = title.trim();
  const displaySubtitle = subtitle.trim();
  const displayAuthor = author.trim();
  const displayRole = authorRole.trim();
  const themeColor = titleColor || theme.color;

  // Primary image and secondary gallery photos
  const mainPhoto = photos.find(p => p.isMain) || photos[0] || null;
  const secondaryPhotos = photos.filter(p => p !== mainPhoto).slice(0, 3);
  const cleanCaption = sanitizeCaption(mainPhoto?.caption);

  const hasPhoto = !!mainPhoto;
  const hasMultiplePhotos = photos.length > 1;
  const hasPullQuote = !!pullQuote?.trim();
  const isTextSparse = content.trim().split(/\s+/).filter(Boolean).length < 60;

  // Dynamic image sizing: if page is visual-focused or text is short, fill page gracefully
  const getDynamicImageMaxHeight = () => {
    const scaleFactor = (imageScale || 100) / 100;
    if (isTextSparse && hasPhoto) {
      // Full-page visual mode when user uploads a file/poster/PDF with minimal text
      return Math.round(620 * scaleFactor);
    }
    if (layoutStyle === 'headline_first') {
      return Math.round(270 * scaleFactor);
    }
    if (layoutStyle === 'sidebar') {
      return Math.round(320 * scaleFactor);
    }
    if (content.trim().split(/\s+/).length <= 130) return Math.round(360 * scaleFactor);
    if (content.trim().split(/\s+/).length <= 220) return Math.round(280 * scaleFactor);
    return Math.round(230 * scaleFactor);
  };

  const dynamicImageHeight = getDynamicImageMaxHeight();

  // Dynamic word budget calculation for standard A4 based on real physical space
  const calculateDynamicMaxWords = () => {
    const effectiveFontSize = fontSize || 13;
    const effectiveLineHeight = lineHeight || 1.45;
    const lineHeightPx = effectiveFontSize * effectiveLineHeight; // ~18.85px

    // Usable height inside 1123px A4: 1123 - 53(top) - 57(bottom) - 36(header) = 977px
    const totalUsableHeightPx = 960;

    // Deduct title & subtitle height in px
    const titleLines = Math.ceil((title?.length || 0) / 40) || 1;
    const subtitleLines = subtitle?.trim() ? Math.ceil(subtitle.length / 50) : 0;
    const titleAreaHeightPx = (titleLines * 30) + (subtitleLines * 20) + 12;

    // Deduct top or bottom image height in px (spanning full width)
    let stackedImageHeightPx = 0;
    let floatImageHeightInOneCol = 0;

    if (hasPhoto) {
      if (imagePosition === 'top' || imagePosition === 'full-width' || isTextSparse) {
        stackedImageHeightPx = dynamicImageHeight + 14;
      } else if (imagePosition === 'bottom') {
        stackedImageHeightPx = 180 + 14;
      } else {
        // Float inline image only occupies space in column 1
        floatImageHeightInOneCol = Math.min(dynamicImageHeight, 220);
      }
    }

    if (hasMultiplePhotos || layoutStyle === 'grid') {
      stackedImageHeightPx += 110;
    }

    // Usable height for the text columns
    const availableColHeight = Math.max(220, totalUsableHeightPx - titleAreaHeightPx - stackedImageHeightPx);

    // Number of text lines available across the two columns
    const linesCol1 = Math.floor((availableColHeight - floatImageHeightInOneCol) / lineHeightPx);
    const linesCol2 = Math.floor(availableColHeight / lineHeightPx);
    let totalLinesAvailable = linesCol1 + linesCol2;

    if (hasPullQuote) {
      totalLinesAvailable = Math.max(16, totalLinesAvailable - 4);
    }

    // Average 7.5 words per line in a 335px column at 13px font
    const wordsPerLine = 7.5;
    const calculatedBudget = Math.floor(totalLinesAvailable * wordsPerLine);

    if (isTextSparse && hasPhoto) {
      return Math.max(160, calculatedBudget);
    }
    return Math.max(480, calculatedBudget);
  };

  const maxWords = calculateDynamicMaxWords();
  const { fitting: fittingText } = splitContentAtWordCount(content.trim(), maxWords);

  // Render Image Block with crystal clear resolution and optional text-wrap float styling
  const renderPhotoBlock = (
    photo: MagazinePhoto | null,
    isPrimary: boolean = true,
    customStyle?: React.CSSProperties,
    wrapperClass: string = ''
  ) => {
    if (!photo) return null;
    const caption = sanitizeCaption(photo.caption);
    const focalX = photo.focalPoint?.x ?? 50;
    const focalY = photo.focalPoint?.y ?? 50;

    return (
      <figure
        className={`w-full block clear-both col-span-full relative group rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden ${wrapperClass}`}
        style={{ width: '100%', display: 'block', clear: 'both', ...customStyle }}
      >
        <img
          src={photo.url}
          alt={caption || 'MAİDER Dergi Görseli'}
          crossOrigin="anonymous"
          decoding="sync"
          className={`block w-full rounded-xl transition-all duration-300 ${
            imageFit === 'contain' ? 'h-auto object-contain' : 'h-full object-cover'
          }`}
          style={{
            maxHeight: isPrimary ? `${dynamicImageHeight}px` : '180px',
            objectPosition: `${focalX}% ${focalY}%`,
            width: '100%',
            display: 'block'
          }}
        />
        {caption && (
          <figcaption className="text-[10px] leading-tight text-slate-500 italic text-center py-1 px-2 bg-slate-50/95 border-t border-slate-100 rounded-b-xl">
            {caption}
          </figcaption>
        )}
      </figure>
    );
  };

  // Render Floated Image to float left or right with text wrapping in single column
  const renderFloatPhoto = (photo: MagazinePhoto | null, align: 'left' | 'right') => {
    if (!photo) return null;
    const caption = sanitizeCaption(photo.caption);
    const focalX = photo.focalPoint?.x ?? 50;
    const focalY = photo.focalPoint?.y ?? 50;

    return (
      <figure
        className={`relative group rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden ${
          align === 'left' ? 'float-left mr-5 mb-3' : 'float-right ml-5 mb-3'
        }`}
        style={{
          float: align,
          margin: align === 'left' ? '0 20px 12px 0' : '0 0 12px 20px',
          width: `${Math.min(imageScale, 48)}%`,
          maxWidth: '280px',
          minWidth: '150px',
          clear: align,
          shapeOutside: 'margin-box'
        }}
      >
        <img
          src={photo.url}
          alt={caption || 'MAİDER Dergi Görseli'}
          crossOrigin="anonymous"
          decoding="sync"
          className={`block w-full rounded-xl transition-all duration-300 ${
            imageFit === 'contain' ? 'h-auto object-contain' : 'h-full object-cover'
          }`}
          style={{
            maxHeight: `${dynamicImageHeight}px`,
            objectPosition: `${focalX}% ${focalY}%`,
            width: '100%',
            display: 'block'
          }}
        />
        {caption && (
          <figcaption className="text-[10px] leading-tight text-slate-500 italic text-center py-1.5 px-2 bg-slate-50/95 border-t border-slate-100 rounded-b-xl">
            {caption}
          </figcaption>
        )}
      </figure>
    );
  };

  const renderPullQuoteBlock = () => {
    if (!hasPullQuote) return null;
    return (
      <div
        className="my-2 py-2 px-3.5 rounded-xl border-l-4 shadow-2xs break-inside-avoid overflow-visible"
        style={{
          borderColor: themeColor,
          backgroundColor: `${themeColor}0D`
        }}
      >
        <Quote className="w-3.5 h-3.5 mb-0.5 opacity-70" style={{ color: themeColor }} />
        <p
          className="font-editorial italic font-bold text-[13px] leading-snug text-slate-900"
          style={{ color: themeColor }}
        >
          “{pullQuote}”
        </p>
      </div>
    );
  };

  const renderAuthorBlock = () => {
    if (!displayAuthor && !displayRole) return null;
    return (
      <div className="mt-2 pt-1.5 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-600 break-inside-avoid">
        <span className="font-semibold text-slate-800">{displayAuthor}</span>
        {displayRole && <span className="text-slate-500 italic">• {displayRole}</span>}
      </div>
    );
  };

  return (
    <div
      id={id}
      className="a4-page-renderer print-page relative bg-[#FDFBF7] text-slate-900 shadow-2xl overflow-hidden mx-auto select-text"
      style={{
        width: '210mm',
        height: '297mm',
        maxWidth: '210mm',
        maxHeight: '297mm',
        minWidth: '210mm',
        minHeight: '297mm',
        boxSizing: 'border-box',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: `${fontFamily}, Georgia, serif`,
        backgroundColor: '#FDFBF7',
        paddingTop: '16mm',
        paddingBottom: '20mm',
        paddingLeft: '18mm',
        paddingRight: '18mm'
      }}
    >
      {/* ─────────────────────────────────────────────────────────────
          KILAVUZ VE TAŞMA ÇİZGİLERİ (Baskı Kılavuzu: 4mm Bleed, 14mm Cilt, 12mm Dış, 14mm Üst, 15mm Alt)
          Yalnızca showGuides=true olduğunda görünür, PDF exportunda görünmez
         ───────────────────────────────────────────────────────────── */}
      {showGuides && (
        <div className="absolute inset-0 pointer-events-none z-50 overflow-visible font-mono text-[8.5px] text-sky-600">
          {/* 4mm Bleed (Kesim / Taşma Payı Çizgisi) */}
          <div
            className="absolute border-2 border-dashed border-rose-400/50"
            style={{ inset: '4mm' }}
          >
            <span className="absolute top-1 left-1 bg-rose-100 text-rose-700 px-1 rounded">
              ✂ 4mm Kesim Payı (Bleed)
            </span>
          </div>

          {/* 14mm Sol Cilt Payı / Gutter Kılavuzu */}
          <div
            className="absolute top-0 bottom-0 border-r-2 border-dashed border-indigo-400/40"
            style={{ left: '14mm' }}
          >
            <span className="absolute top-12 left-1 bg-indigo-50 text-indigo-700 px-1 rounded -rotate-90 origin-top-left">
              14mm Cilt Payı (Gutter)
            </span>
          </div>

          {/* 12mm Sağ Dış Kenar Kılavuzu */}
          <div
            className="absolute top-0 bottom-0 border-l border-dashed border-sky-400/40"
            style={{ right: '12mm' }}
          >
            <span className="absolute top-12 right-1 bg-sky-50 text-sky-700 px-1 rounded rotate-90 origin-top-right">
              12mm Dış Kenar
            </span>
          </div>

          {/* 14mm Üst Marj Çizgisi */}
          <div
            className="absolute left-0 right-0 border-b border-dashed border-sky-400/40"
            style={{ top: '14mm' }}
          />

          {/* 15mm Alt Marj Çizgisi */}
          <div
            className="absolute left-0 right-0 border-t-2 border-dashed border-emerald-400/40"
            style={{ bottom: '15mm' }}
          >
            <span className="absolute bottom-1 right-24 bg-emerald-50 text-emerald-700 px-1.5 rounded">
              15mm Alt Güvenli Alan
            </span>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          1. HEADER (14mm üst boşluğun içinde, zarif dergi künyesi)
         ───────────────────────────────────────────────────────────── */}
      <header className="min-h-[36px] shrink-0 flex items-center justify-between border-b border-slate-200/90 pb-1.5 mb-2 bg-transparent z-10 leading-normal overflow-visible">
        <div className="w-1/3 flex items-center justify-start min-w-0">
          <span
            className="inline-flex items-center justify-center text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded text-white shadow-2xs truncate leading-normal"
            style={{ backgroundColor: themeColor }}
          >
            {category || theme.label}
          </span>
        </div>

        <div className="w-1/3 flex items-center justify-center min-w-0">
          <img
            src="/photo_2026-09-06_21-01-05.jpg"
            alt="Mehmet Akif İnan Ortaokulu Logo"
            className="h-9 w-9 object-contain rounded-full border border-slate-200 shadow-2xs shrink-0"
          />
        </div>

        <div className="w-1/3 flex items-center justify-end text-[10px] font-medium text-slate-600 shrink-0">
          <span>Yıl: {year}</span>
          <span className="text-slate-300 mx-1.5">•</span>
          <span>Ay: {month}</span>
          <span className="text-slate-300 mx-1.5">•</span>
          <span className="font-bold text-slate-900">Sayı: {issueNumber}</span>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          2. CONTENT MAIN AREA (Kullanılabilir alan: 1123 - 76 - 95 = 952px)
         ───────────────────────────────────────────────────────────── */}
      {/* ─────────────────────────────────────────────────────────────
          2. CONTENT MAIN AREA (İçerik Taşma Koruması: height calc(100% - 40mm))
         ───────────────────────────────────────────────────────────── */}
      <main
        className="w-full relative z-0 overflow-hidden"
        style={{
          height: 'calc(100% - 40mm)',
          maxHeight: 'calc(100% - 40mm)',
          overflow: 'hidden',
          display: 'block',
          width: '100%',
          boxSizing: 'border-box'
        }}
      >
        {/* ── TAM SAYFA YERLEŞİM MODU (FULL-PAGE CANVAS FIT / PDF ENTEGRASYONU) ── */}
        {isFullPageCanvas && fullPageCanvasImage ? (
          <div className="w-full h-full flex flex-col relative overflow-hidden rounded-xl">
            <div className="w-full h-full relative flex items-center justify-center overflow-hidden rounded-xl border border-slate-200/70 shadow-2xs bg-slate-50/50">
              <img
                src={fullPageCanvasImage}
                alt={displayTitle || 'MAİDER Tam Sayfa Tuval Belgesi'}
                crossOrigin="anonymous"
                decoding="sync"
                className={`w-full h-full ${
                  fullPageMode === 'full-bleed'
                    ? 'object-cover'
                    : 'object-contain'
                } mx-auto transition-all`}
                style={{ imageRendering: 'auto' }}
              />

              {/* Çakışma Yönetimi */}
              {fullPageMode === 'overlay' && (displayTitle || content.trim()) && (
                <div className="absolute bottom-4 inset-x-4 p-5 rounded-2xl bg-white/92 backdrop-blur-md border border-white/80 shadow-2xl z-20 max-h-[50%] overflow-y-auto flex flex-col">
                  {displayTitle && (
                    <h2 className="text-lg font-bold text-slate-900 mb-1" style={{ color: themeColor }}>
                      {displayTitle}
                    </h2>
                  )}
                  {content.trim() && (
                    <div className="text-xs text-slate-700 leading-relaxed overflow-visible">
                      {renderFormattedContent(fittingText, themeColor, false, null, { fontSize, lineHeight, letterSpacing, textAlign })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="w-full h-full overflow-hidden block" style={{ display: 'block' }}>
            {/* Title & Subtitle Banner */}
            <div className="mb-2 shrink-0 overflow-visible">
              {displayTitle && (
                <h1
                  className="text-[24px] font-black tracking-tight text-slate-900 mb-0.5 leading-[1.14]"
                  style={{
                    color: themeColor,
                    fontFamily: `${fontFamily}, 'Playfair Display', serif`,
                    letterSpacing: `${letterSpacing}px`
                  }}
                >
                  {displayTitle}
                </h1>
              )}
              {displaySubtitle && (
                <h2 className="text-[13px] font-medium text-slate-600 leading-snug">
                  {displaySubtitle}
                </h2>
              )}
            </div>

            {/* ── TEK SÜTUN VE DOĞAL METİN AKIŞI (DISPLAY: BLOCK + FLOAT) ──
                column-count / flex / grid tamamen kaldırıldı.
                Görsel float: right veya float: left olarak akar, metin etrafını sarar. ── */}
            <div
              className="w-full text-justify font-serif text-slate-800"
              style={{
                display: 'block',
                width: '100%',
                fontSize: `${fontSize}px`,
                lineHeight: lineHeight,
                letterSpacing: `${letterSpacing}px`,
                textAlign: textAlign
              }}
            >
              {/* Tam Manşet veya Üst Konum Görseli */}
              {hasPhoto && (imagePosition === 'top' || imagePosition === 'full-width' || isTextSparse) && (
                <div className="w-full block clear-both mb-3 overflow-hidden">
                  {renderPhotoBlock(mainPhoto, true)}
                </div>
              )}

              {/* Floated Image: Sağ veya Sol Doğal Metin Akışı */}
              {hasPhoto && !isTextSparse && imagePosition !== 'top' && imagePosition !== 'full-width' && imagePosition !== 'bottom' && (
                renderFloatPhoto(mainPhoto, (imagePosition === 'left' || imagePosition === 'inline-left') ? 'left' : 'right')
              )}

              {/* Tek Sütun Halinde Doğal Akan Gövde Metni */}
              {renderFormattedContent(fittingText, themeColor, false, null, {
                fontSize,
                lineHeight,
                letterSpacing,
                textAlign
              })}

              {/* İkincil Görseller (Çoklu Görsel Galerisi) */}
              {secondaryPhotos.length > 0 && (
                <div className="my-2.5 clear-both block w-full">
                  <div className="flex gap-2 w-full">
                    {secondaryPhotos.map((sp, idx) => (
                      <div key={idx} className="flex-1">{renderPhotoBlock(sp, false)}</div>
                    ))}
                  </div>
                </div>
              )}

              {/* Vurgu Spotu */}
              {hasPullQuote && renderPullQuoteBlock()}

              {/* Alt Bölüm Görseli */}
              {hasPhoto && imagePosition === 'bottom' && (
                <div className="my-2.5 clear-both block w-full overflow-hidden">
                  {renderPhotoBlock(mainPhoto, true)}
                </div>
              )}

              {renderAuthorBlock()}

              {/* Kaynakça Alanı */}
              {sourceReference && (
                <div className="mt-2.5 py-1 px-3 bg-slate-50/90 rounded-lg border border-slate-200/70 flex items-center gap-1.5 text-[9.5px] text-slate-500 italic clear-both leading-normal">
                  <span className="font-bold not-italic text-slate-700 shrink-0">Kaynak:</span>
                  <span className="truncate text-slate-600" title={sourceReference}>
                    {sourceReference}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* ─────────────────────────────────────────────────────────────
          3. FOOTER (Sayfa altına kilitlenmiş: bottom 20mm, left/right 18mm, height 15mm)
             İçerik uzasa bile kesinlikle kesilmez veya aşağı itilmez!
         ───────────────────────────────────────────────────────────── */}
      <footer
        className="shrink-0 flex items-center justify-between border-t border-slate-200/90 bg-transparent z-30 text-[10.5px] text-slate-600 overflow-hidden"
        style={{
          position: 'absolute',
          bottom: '20mm',
          left: '18mm',
          right: '18mm',
          height: '15mm',
          boxSizing: 'border-box'
        }}
      >
        {/* Sol: Yazar veya Kategori Bilgisi */}
        <div className="w-1/3 flex items-center gap-2 font-bold tracking-wide min-w-0 truncate">
          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: themeColor }}></span>
          <span className="truncate text-slate-800">
            {displayAuthor ? displayAuthor : (category || 'MAİDER')}
          </span>
          {displayRole && <span className="text-slate-400 font-normal truncate">• {displayRole}</span>}
        </div>

        {/* TAM ORTA: Sayfa Numarası */}
        <div className="w-1/3 flex items-center justify-center shrink-0">
          <span className="inline-flex items-center justify-center min-w-[28px] h-6 px-2 rounded-md bg-slate-100 text-slate-800 font-mono font-black text-xs border border-slate-200 shadow-2xs leading-none">
            {pageNumber}
          </span>
        </div>

        {/* Sağ: Mehmet Akif İnan Ortaokulu */}
        <div className="w-1/3 flex items-center justify-end font-bold text-slate-700 tracking-wide text-right truncate">
          <span className="truncate">MEHMET AKİF İNAN ORTAOKULU</span>
        </div>
      </footer>
    </div>
  );
};
