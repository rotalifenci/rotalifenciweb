import { MagazineCategory, MagazinePhoto } from '../types/magazine';
import { calculateWordCount } from './smartLayout';

export type SmartLayoutType = 'classic' | 'headline_first' | 'sidebar' | 'compact' | 'editorial' | 'academic' | 'focus_card' | 'grid';
export type PullQuoteStyle = 'box' | 'editorial' | 'ribbon' | 'minimal';
export type MagazineFontFamily = 'sans' | 'serif' | 'display' | 'editorial' | 'modern' | 'classic';

export interface PageDensityAnalysis {
  densityPercentage: number;
  status: 'low' | 'good' | 'ideal' | 'overflow';
  statusText: string;
  statusColor: string;
  estimatedContentHeight: number;
  maxContentHeight: number;
  wordCount: number;
  recommendedWordCount: number;
  overflowWords: number;
  recommendation: string;
}

export interface LayoutAlternative {
  id: SmartLayoutType;
  title: string;
  description: string;
  iconName: string;
  recommendedImagePosition: 'inline-left' | 'inline-right' | 'full-width' | 'top';
  recommendedQuoteStyle: PullQuoteStyle;
}

/**
 * Standard A4 Millimetric Publishing Standards:
 * Page Size: 210mm x 297mm
 * Bleed: 4mm (Taşma / Kesim Payı)
 * Top Margin: 20mm
 * Bottom Margin: 25mm (Görsel denge için en geniş alt pay)
 * Outer Margin (Dış Kenar): 18mm
 * Gutter / Inner Margin (Cilt Payı): 22mm (Sırt payına girmemesi için)
 */
export const A4_CONSTANTS = {
  PAGE_WIDTH_MM: 210,
  PAGE_HEIGHT_MM: 297,
  BLEED_MM: 4,
  TOP_MARGIN_MM: 20,
  BOTTOM_MARGIN_MM: 25,
  OUTER_MARGIN_MM: 18,
  GUTTER_MARGIN_MM: 22,

  // 96 DPI Pixel Equivalents for Web / Canvas (1 mm ≈ 3.7795 px)
  PAGE_WIDTH_PX: 794,
  PAGE_HEIGHT_PX: 1123,
  BLEED_PX: 15,
  TOP_MARGIN_PX: 76,
  BOTTOM_MARGIN_PX: 95,
  OUTER_MARGIN_PX: 68,
  GUTTER_MARGIN_PX: 83,
  AVAILABLE_CONTENT_HEIGHT_PX: 952,
  AVAILABLE_CONTENT_WIDTH_PX: 643,
};

/**
 * Calculates accurate page density based on elements placed in A4 page.
 */
export function calculatePageDensity(params: {
  title: string;
  subtitle: string;
  content: string;
  photos: MagazinePhoto[];
  pullQuote?: string;
  imageScale?: number;
  layoutStyle?: SmartLayoutType;
  fontSize?: number; // default 13.5
}): PageDensityAnalysis {
  const {
    title,
    subtitle,
    content,
    photos,
    pullQuote,
    imageScale = 100,
    layoutStyle = 'classic',
    fontSize = 13.5
  } = params;

  const wordCount = calculateWordCount(content);
  const hasPhoto = photos && photos.length > 0;
  const photoCount = photos?.length || 0;
  const hasQuote = !!pullQuote?.trim();

  // 1. Calculate Title & Subtitle height
  let titleHeight = 0;
  if (title.trim()) {
    const titleLines = Math.ceil(title.trim().length / 32);
    titleHeight += titleLines * 38 + 12;
  }
  if (subtitle.trim()) {
    const subLines = Math.ceil(subtitle.trim().length / 55);
    titleHeight += subLines * 24 + 16;
  }
  if (!title.trim() && !subtitle.trim()) {
    titleHeight = 20;
  }

  // 2. Calculate Image height contribution
  let imageHeight = 0;
  const scaleRatio = (imageScale || 100) / 100;
  if (hasPhoto) {
    if (layoutStyle === 'headline_first') {
      // Full width banner
      imageHeight = Math.round(280 * scaleRatio);
    } else if (layoutStyle === 'grid' || photoCount > 1) {
      // Multi-image layout
      imageHeight = Math.round(300 * scaleRatio);
    } else {
      // Standard inline image (takes space in 1 of the columns)
      const baseHeight = wordCount < 120 ? 360 : wordCount < 220 ? 280 : 200;
      imageHeight = Math.round(baseHeight * scaleRatio * 0.6); // 0.6 column distribution factor
    }
  }

  // 3. Calculate Pull Quote height
  let quoteHeight = 0;
  if (hasQuote) {
    const quoteWords = calculateWordCount(pullQuote || '');
    quoteHeight = Math.max(65, Math.ceil(quoteWords / 6) * 22 + 30);
  }

  // 4. Calculate Body Text height across 2 columns
  // Standard text: ~13.5px font, 1.65 line-height = ~22px per line.
  // One line in a column fits ~8 words.
  // 2 columns double the line capacity.
  const wordsPerLineInTwoColumns = 16;
  const lineHeight = fontSize * 1.65;
  const textLines = Math.ceil(wordCount / wordsPerLineInTwoColumns);
  const textHeight = textLines * lineHeight;

  // 5. Author & Source & Spacings
  const metaHeight = 45;
  const spacingBuffer = 30;

  // Total estimated height
  const totalOccupiedHeight = titleHeight + imageHeight + quoteHeight + textHeight + metaHeight + spacingBuffer;
  const maxAvailable = A4_CONSTANTS.AVAILABLE_CONTENT_HEIGHT_PX;

  const densityPercentage = Math.round((totalOccupiedHeight / maxAvailable) * 100);

  // Determine ideal word capacity based on current visuals and headers
  const availableForTextHeight = Math.max(100, maxAvailable - (titleHeight + imageHeight + quoteHeight + metaHeight + spacingBuffer));
  const availableLines = availableForTextHeight / lineHeight;
  const recommendedWordCount = Math.round(availableLines * wordsPerLineInTwoColumns);
  const overflowWords = Math.max(0, wordCount - recommendedWordCount);

  let status: 'low' | 'good' | 'ideal' | 'overflow' = 'ideal';
  let statusText = 'İdeal Doluluk (%90-99)';
  let statusColor = '#10b981'; // emerald-500
  let recommendation = 'Sayfa dengesi mükemmel. Yazı ve görseller A4 alanına tam oturuyor.';

  if (densityPercentage > 100) {
    status = 'overflow';
    statusText = `Sayfa Taşıyor (%${densityPercentage})`;
    statusColor = '#ef4444'; // red-500
    recommendation = `İçerik A4 sınırlarını aşıyor (${overflowWords} kelime fazla). "Sayfaya Otomatik Sığdır" butonuna tıklayarak veya görseli küçülterek sığdırabilirsiniz.`;
  } else if (densityPercentage >= 90) {
    status = 'ideal';
    statusText = `İdeal Doluluk (%${densityPercentage})`;
    statusColor = '#10b981'; // emerald-500
    recommendation = 'Sayfa alanı %90-98 oranında verimli şekilde kullanılıyor. Baskıya hazır!';
  } else if (densityPercentage >= 75) {
    status = 'good';
    statusText = `İyileştirilebilir (%${densityPercentage})`;
    statusColor = '#0ea5e9'; // sky-500
    recommendation = 'Sayfada biraz boş alan var. Görsel boyutunu büyüterek veya metin ekleyerek tam doluluk sağlayabilirsiniz.';
  } else {
    status = 'low';
    statusText = `İçerik Az (%${densityPercentage})`;
    statusColor = '#f59e0b'; // amber-500
    recommendation = 'Sayfa boşluğu fazla. Görselleri büyütebilir veya yapay zekâdan daha detaylı metin oluşturmasını isteyebilirsiniz.';
  }

  return {
    densityPercentage,
    status,
    statusText,
    statusColor,
    estimatedContentHeight: totalOccupiedHeight,
    maxContentHeight: maxAvailable,
    wordCount,
    recommendedWordCount,
    overflowWords,
    recommendation
  };
}

/**
 * Provides 3 distinct smart layout alternatives based on content parameters.
 */
export function getSmartLayoutAlternatives(params: {
  wordCount: number;
  photoCount: number;
  hasPullQuote: boolean;
}): LayoutAlternative[] {
  const { wordCount, photoCount, hasPullQuote } = params;

  if (photoCount >= 2) {
    return [
      {
        id: 'grid',
        title: 'Tasarım A: Çoklu Görsel Galerisi',
        description: 'Ana görsel odaklı, yardımcı görsellerle zenginleştirilmiş dengeli galeri mizanpajı.',
        iconName: 'LayoutGrid',
        recommendedImagePosition: 'inline-left',
        recommendedQuoteStyle: 'box'
      },
      {
        id: 'headline_first',
        title: 'Tasarım B: Manşet & İki Sütun',
        description: 'Üstte geniş panoramik ana görsel, altta iki sütunlu akıcı editoryal metin.',
        iconName: 'Maximize2',
        recommendedImagePosition: 'top',
        recommendedQuoteStyle: 'ribbon'
      },
      {
        id: 'sidebar',
        title: 'Tasarım C: Asimetrik Dergi Tasarımı',
        description: 'Sol sütunda görsel ve alıntı vitrini, sağda editoryal metin akışı.',
        iconName: 'Columns',
        recommendedImagePosition: 'inline-left',
        recommendedQuoteStyle: 'editorial'
      }
    ];
  }

  if (wordCount > 260) {
    return [
      {
        id: 'classic',
        title: 'Tasarım A: Klasik İki Sütun',
        description: 'Görsel sol sütunda dengeli, iki sütunlu profesyonel akademik mizanpaj.',
        iconName: 'Columns',
        recommendedImagePosition: 'inline-left',
        recommendedQuoteStyle: 'box'
      },
      {
        id: 'editorial',
        title: 'Tasarım B: Editoryal Dergi',
        description: 'Büyük başlık, sağ odaklı görsel ve vurgulu alıntı kutusu.',
        iconName: 'BookOpen',
        recommendedImagePosition: 'inline-right',
        recommendedQuoteStyle: 'editorial'
      },
      {
        id: 'headline_first',
        title: 'Tasarım C: Üst Görsel & Sütunlar',
        description: 'Görsel sayfanın üstünde tam genişlikte, metin iki sütun olarak akar.',
        iconName: 'Maximize2',
        recommendedImagePosition: 'top',
        recommendedQuoteStyle: 'minimal'
      }
    ];
  }

  // Shorter content or balanced
  return [
    {
      id: 'focus_card',
      title: 'Tasarım A: Büyük Görsel & Odak',
      description: 'Görselin ön planda olduğu, ferah ve modern dergi mizanpajı.',
      iconName: 'Image',
      recommendedImagePosition: 'top',
      recommendedQuoteStyle: 'editorial'
    },
    {
      id: 'classic',
      title: 'Tasarım B: Dengeli Mizanpaj',
      description: 'İki sütun metin ve sol yerleşimli görsel ile dengeli dergi sayfası.',
      iconName: 'Columns',
      recommendedImagePosition: 'inline-left',
      recommendedQuoteStyle: 'box'
    },
    {
      id: 'sidebar',
      title: 'Tasarım C: Vitrin & Alıntı',
      description: 'Görsel ve büyük vurgu cümlesinin vitrin olarak sunulduğu dergi düzeni.',
      iconName: 'Sidebar',
      recommendedImagePosition: 'inline-left',
      recommendedQuoteStyle: 'ribbon'
    }
  ];
}

/**
 * Calculates optimal parameters to automatically fit the page to 92-96% density.
 */
export function calculateAutoFitParameters(params: {
  currentDensity: number;
  currentImageScale: number;
  wordCount: number;
  recommendedWordCount: number;
  photoCount: number;
}): {
  recommendedImageScale: number;
  recommendedFontSize: number;
  shouldShortenText: boolean;
  targetWordCount: number;
  actionMessage: string;
} {
  const { currentDensity, currentImageScale, wordCount, recommendedWordCount, photoCount } = params;

  if (currentDensity > 100) {
    // Overflow: need to downscale image or slightly reduce font/words
    const scaleReduction = Math.max(65, Math.round(currentImageScale * 0.82));
    const shouldShorten = wordCount > recommendedWordCount + 20;

    return {
      recommendedImageScale: photoCount > 0 ? scaleReduction : currentImageScale,
      recommendedFontSize: 12.5,
      shouldShortenText: shouldShorten,
      targetWordCount: recommendedWordCount,
      actionMessage: shouldShorten
        ? `Görsel boyutu %${scaleReduction} değerine optimize edildi ve metin A4 kapasitesine (${recommendedWordCount} kelime) uyarlandı.`
        : `Görsel boyutu %${scaleReduction} olarak ayarlandı, sayfa A4 sınırlarına sığdırıldı.`
    };
  } else if (currentDensity < 85) {
    // Underfilled: upscale image or enlarge font/spacings
    const scaleIncrease = Math.min(135, Math.round(currentImageScale * 1.25));

    return {
      recommendedImageScale: photoCount > 0 ? scaleIncrease : currentImageScale,
      recommendedFontSize: 14,
      shouldShortenText: false,
      targetWordCount: recommendedWordCount,
      actionMessage: `Görsel boyutu %${scaleIncrease} değerine büyütüldü ve sayfa doluluk oranı %95 seviyesine dengelendi.`
    };
  }

  // Already ideal
  return {
    recommendedImageScale: currentImageScale,
    recommendedFontSize: 13.5,
    shouldShortenText: false,
    targetWordCount: wordCount,
    actionMessage: 'Sayfa mizanpajı ve doluluğu zaten ideal seviyede (%92-98).'
  };
}
