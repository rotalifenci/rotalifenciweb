import { ArticleItem, MagazinePage, MagazineCategory, MagazinePhoto } from '../types/magazine';

import { TEMPLATES_LIBRARY } from '../config/templates';

import { generateQrCode } from './qrService';

import { CATEGORY_THEMES } from '../config/brand';



export interface SmartLayoutResult {

  pages: MagazinePage[];

  recommendedPullQuote?: string;

  wordCount: number;

  readingTimeMinutes: number;

  warnings: string[];

}



export function splitIntoParagraphs(text: string): string[] {

  return text

    .split(/\n\s*\n/)

    .map(p => p.trim())

    .filter(p => p.length > 0);

}



export function calculateWordCount(text: string): number {

  if (!text) return 0;

  return text.trim().split(/\s+/).filter(w => w.length > 0).length;

}



export function extractSuggestedPullQuote(text: string, currentQuote?: string): string {
  if (!text || !text.trim()) return '';

  // Clean markdown headings, callout symbols, bold/italic markers
  const cleanText = text
    .replace(/^#{1,4}\s+.*$/gm, '')
    .replace(/^>\s+.*$/gm, '')
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/\[color=[^\]]+\]/g, '')
    .replace(/\[\/color\]/g, '')
    .trim();

  if (!cleanText) return '';

  const candidates: string[] = [];

  // 1. Explicit quotes ("...", “...”, «...»)
  const quoteRegex = /[“"«]([^”"»]{12,180})[”"»]/g;
  let qMatch: RegExpExecArray | null;
  while ((qMatch = quoteRegex.exec(cleanText)) !== null) {
    const q = qMatch[1].trim().replace(/[.!?]+$/, '');
    if (q.length > 15 && !candidates.includes(q)) {
      candidates.push(q);
    }
  }

  // 2. Split into sentences
  const rawSentences = cleanText.split(/(?<=[.!?])\s+|\n+/);
  const cleanedSentences = rawSentences
    .map(s => s.replace(/^[–—\s\d.)]+/, '').trim().replace(/[.!?]+$/, ''))
    .filter(s => s.length > 20 && s.split(/\s+/).length >= 4);

  const inspirationalKeywords = [
    'gelecek', 'bilim', 'öğrenci', 'başarı', 'hedef', 'hayal', 'keşfet',
    'üretim', 'teknoloji', 'inovasyon', 'merak', 'fikir', 'emek', 'birlikte',
    'okul', 'eğitim', 'ilham', 'yolculuk', 'değer', 'kültür', 'tarih', 'sivas',
    'medrese', 'eser', 'mimari', 'önemli', 'ışık', 'güç', 'yarın', 'umut', 'vizyon', 'adım'
  ];

  // Candidates with inspirational keywords
  for (const sentence of cleanedSentences) {
    const words = sentence.split(/\s+/).filter(w => w.length > 0);
    if (words.length >= 5 && words.length <= 32) {
      const lower = sentence.toLowerCase();
      if (inspirationalKeywords.some(k => lower.includes(k))) {
        if (!candidates.includes(sentence)) {
          candidates.push(sentence);
        }
      }
    }
  }

  // General well-sized sentences
  for (const sentence of cleanedSentences) {
    const words = sentence.split(/\s+/).filter(w => w.length > 0);
    if (words.length >= 6 && words.length <= 26) {
      if (!candidates.includes(sentence)) {
        candidates.push(sentence);
      }
    }
  }

  // Fallback sentences
  if (candidates.length === 0 && cleanedSentences.length > 0) {
    const firstWords = cleanedSentences[0].split(/\s+/).slice(0, 22).join(' ');
    candidates.push(firstWords);
  }

  if (candidates.length === 0) {
    return cleanText.split(/\s+/).slice(0, 18).join(' ');
  }

  // If currentQuote is given and is among candidates, cycle to the next candidate!
  if (currentQuote && currentQuote.trim()) {
    const normCurrent = currentQuote.trim().toLowerCase().replace(/[“"»«”]/g, '').replace(/[.!?]+$/, '');
    const foundIdx = candidates.findIndex(c => c.toLowerCase().replace(/[.!?]+$/, '') === normCurrent);
    if (foundIdx !== -1 && foundIdx + 1 < candidates.length) {
      return candidates[foundIdx + 1];
    } else if (foundIdx === candidates.length - 1 && candidates.length > 1) {
      return candidates[0];
    }
  }

  return candidates[0];
}



export function splitTextForContinuation(paragraphs: string[], firstPageMaxWords: number = 240, continuationMaxWords: number = 380): { page1Text: string; page2Text: string; page3Text?: string } {

  let currentWords = 0;

  const p1: string[] = [];

  const p2: string[] = [];

  const p3: string[] = [];



  for (const p of paragraphs) {

    const count = calculateWordCount(p);

    if (currentWords + count <= firstPageMaxWords || p1.length === 0) {

      p1.push(p);

      currentWords += count;

    } else if (p2.reduce((acc, cur) => acc + calculateWordCount(cur), 0) + count <= continuationMaxWords || p2.length === 0) {

      p2.push(p);

    } else {

      p3.push(p);

    }

  }



  return {

    page1Text: p1.join('\n\n'),

    page2Text: p2.join('\n\n'),

    page3Text: p3.length > 0 ? p3.join('\n\n') : undefined

  };

}



export async function generateSmartLayout(article: ArticleItem, startPageNum: number): Promise<SmartLayoutResult> {

  const warnings: string[] = [];

  const wordCount = calculateWordCount(article.content);

  const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 180));

  const photoCount = article.photos ? article.photos.length : 0;

  const suggestedQuote = article.pullQuote || extractSuggestedPullQuote(article.content);



  if (article.photos) {

    article.photos.forEach((p, idx) => {

      if (p.isLowRes) {

        warnings.push(`Fotoğraf #${idx + 1} ("${p.caption || 'Görsel'}") düşük çözünürlüklü olabilir.`);

      }

    });

  }



  const generatedPages: MagazinePage[] = [];

  const theme = CATEGORY_THEMES[article.category] || CATEGORY_THEMES['Okulumuzdan'];



  let qrCodeDataUrl = '';

  const qrTargetUrl = article.interactiveUrl || article.videoUrl;

  if (qrTargetUrl) {

    qrCodeDataUrl = await generateQrCode(qrTargetUrl, theme.color);

  }



  const paragraphs = splitIntoParagraphs(article.content);



  switch (article.category) {

    case 'Kapak': {

      generatedPages.push({

        id: `page-${article.id}-1`,

        pageNumber: startPageNum,

        issueId: article.issueId,

        articleId: article.id,

        templateId: 'M01',

        layoutVariant: 'A',

        category: 'Kapak',

        title: article.title,

        subtitle: article.subtitle,

        photos: article.photos.slice(0, 1),

        extraData: { slogan: article.editorNote || 'Geleceğe Kanat Açan Bilim ve Kültür Dergisi' }

      });

      break;

    }



    case 'İçindekiler': {

      generatedPages.push({

        id: `page-${article.id}-1`,

        pageNumber: startPageNum,

        issueId: article.issueId,

        articleId: article.id,

        templateId: 'M02',

        layoutVariant: 'A',

        category: 'İçindekiler',

        title: article.title || 'İçindekiler',

        subtitle: article.subtitle || 'Bu Sayıda Neler Var?',

        photos: article.photos.slice(0, 2),

      });

      break;

    }



    case 'Editörden': {

      generatedPages.push({

        id: `page-${article.id}-1`,

        pageNumber: startPageNum,

        issueId: article.issueId,

        articleId: article.id,

        templateId: 'M03',

        layoutVariant: 'A',

        category: 'Editörden',

        title: article.title || 'Editörden',

        subtitle: article.subtitle,

        author: article.author,

        authorRole: article.authorRole || 'Okul Müdürü / Yayın Yönetmeni',

        content: article.content,

        pullQuote: suggestedQuote,

        photos: article.photos.slice(0, 1),

      });

      break;

    }



    case 'STEM': {

      generatedPages.push({

        id: `page-${article.id}-1`,

        pageNumber: startPageNum,

        issueId: article.issueId,

        articleId: article.id,

        templateId: 'M08',

        layoutVariant: 'A',

        category: 'STEM',

        title: article.title,

        subtitle: article.subtitle,

        author: article.author,

        authorRole: article.authorRole,

        content: article.content,

        pullQuote: suggestedQuote,

        photos: article.photos.slice(0, 4),

        qrCodeDataUrl,

        qrUrl: qrTargetUrl,

        qrLabel: qrTargetUrl ? 'Proje Videosu & Detaylar' : undefined,

        extraData: { stemData: article.stemData }

      });

      break;

    }



    case 'Bilim': {

      generatedPages.push({

        id: `page-${article.id}-1`,

        pageNumber: startPageNum,

        issueId: article.issueId,

        articleId: article.id,

        templateId: 'M07',

        layoutVariant: photoCount > 1 ? 'B' : 'A',

        category: 'Bilim',

        title: article.title,

        subtitle: article.subtitle,

        author: article.author,

        authorRole: article.authorRole,

        content: article.content,

        pullQuote: suggestedQuote,

        photos: article.photos.slice(0, 3),

        qrCodeDataUrl,

        qrUrl: qrTargetUrl,

        qrLabel: 'İnceleme & Deney Linki'

      });

      break;

    }



    case 'Proje':

    case 'eTwinning': {

      generatedPages.push({

        id: `page-${article.id}-1`,

        pageNumber: startPageNum,

        issueId: article.issueId,

        articleId: article.id,

        templateId: 'M09',

        layoutVariant: 'A',

        category: article.category,

        title: article.title,

        subtitle: article.subtitle,

        author: article.author,

        authorRole: article.authorRole,

        content: article.content,

        pullQuote: suggestedQuote,

        photos: article.photos.slice(0, 3),

        qrCodeDataUrl,

        qrUrl: qrTargetUrl,

        qrLabel: 'Proje Sayfası'

      });

      break;

    }



    case 'Okul Etkinliği': {

      generatedPages.push({

        id: `page-${article.id}-1`,

        pageNumber: startPageNum,

        issueId: article.issueId,

        articleId: article.id,

        templateId: 'M10',

        layoutVariant: photoCount >= 4 ? 'A' : 'B',

        category: 'Okul Etkinliği',

        title: article.title,

        subtitle: article.subtitle,

        author: article.author,

        authorRole: article.authorRole,

        content: article.content,

        pullQuote: suggestedQuote,

        photos: article.photos.slice(0, 6),

      });



      if (photoCount > 6) {

        generatedPages.push({

          id: `page-${article.id}-2`,

          pageNumber: startPageNum + 1,

          issueId: article.issueId,

          articleId: article.id,

          templateId: 'M15',

          layoutVariant: 'A',

          category: 'Fotoğraf Galerisi',

          title: `${article.title} - Fotoğraf Galerisi`,

          subtitle: 'Etkinlikten Unutulmaz Kareler',

          content: 'Kutlama ve etkinlik anlarından derlenen fotoğraf seçkisi.',

          photos: article.photos.slice(6),

        });

      }

      break;

    }



    case 'Röportaj': {

      generatedPages.push({

        id: `page-${article.id}-1`,

        pageNumber: startPageNum,

        issueId: article.issueId,

        articleId: article.id,

        templateId: 'M11',

        layoutVariant: 'A',

        category: 'Röportaj',

        title: article.title,

        subtitle: article.subtitle,

        author: article.author,

        authorRole: article.authorRole,

        content: article.content,

        pullQuote: suggestedQuote,

        photos: article.photos.slice(0, 2),

        extraData: { interviewData: article.interviewData }

      });

      break;

    }



    case 'Şiir': {

      generatedPages.push({

        id: `page-${article.id}-1`,

        pageNumber: startPageNum,

        issueId: article.issueId,

        articleId: article.id,

        templateId: 'M12',

        layoutVariant: 'A',

        category: 'Şiir',

        title: article.title,

        subtitle: article.subtitle,

        author: article.author,

        authorRole: article.authorRole || 'Öğrenci',

        content: article.content,

        photos: article.photos.slice(0, 1),

      });

      break;

    }



    case 'Hikâye':

    case 'Deneme': {

      if (wordCount > 350) {

        const split = splitTextForContinuation(paragraphs, 230, 380);

        generatedPages.push({

          id: `page-${article.id}-1`,

          pageNumber: startPageNum,

          issueId: article.issueId,

          articleId: article.id,

          templateId: 'M13',

          layoutVariant: 'A',

          category: article.category,

          title: article.title,

          subtitle: article.subtitle,

          author: article.author,

          authorRole: article.authorRole,

          content: split.page1Text,

          pullQuote: suggestedQuote,

          photos: article.photos.slice(0, 1),

        });



        generatedPages.push({

          id: `page-${article.id}-2`,

          pageNumber: startPageNum + 1,

          issueId: article.issueId,

          articleId: article.id,

          templateId: 'M06',

          layoutVariant: 'B',

          category: article.category,

          title: `${article.title} (Devam)`,

          author: article.author,

          content: split.page2Text,

          photos: article.photos.slice(1, 2),

        });

      } else {

        generatedPages.push({

          id: `page-${article.id}-1`,

          pageNumber: startPageNum,

          issueId: article.issueId,

          articleId: article.id,

          templateId: 'M13',

          layoutVariant: 'A',

          category: article.category,

          title: article.title,

          subtitle: article.subtitle,

          author: article.author,

          authorRole: article.authorRole,

          content: article.content,

          pullQuote: suggestedQuote,

          photos: article.photos.slice(0, 1),

        });

      }

      break;

    }



    case 'Kültür & Sanat': {

      if (photoCount === 1 && wordCount < 100) {

        generatedPages.push({

          id: `page-${article.id}-1`,

          pageNumber: startPageNum,

          issueId: article.issueId,

          articleId: article.id,

          templateId: 'M14',

          layoutVariant: 'A',

          category: 'Kültür & Sanat',

          title: article.title,

          subtitle: article.subtitle,

          author: article.author,

          authorRole: article.authorRole,

          content: article.content,

          photos: article.photos.slice(0, 1),

        });

      } else {

        generatedPages.push({

          id: `page-${article.id}-1`,

          pageNumber: startPageNum,

          issueId: article.issueId,

          articleId: article.id,

          templateId: photoCount >= 2 ? 'M05' : 'M04',

          layoutVariant: 'A',

          category: 'Kültür & Sanat',

          title: article.title,

          subtitle: article.subtitle,

          author: article.author,

          authorRole: article.authorRole,

          content: article.content,

          pullQuote: suggestedQuote,

          photos: article.photos.slice(0, 2),

        });

      }

      break;

    }



    case 'Fotoğraf Galerisi': {

      generatedPages.push({

        id: `page-${article.id}-1`,

        pageNumber: startPageNum,

        issueId: article.issueId,

        articleId: article.id,

        templateId: 'M15',

        layoutVariant: 'A',

        category: 'Fotoğraf Galerisi',

        title: article.title,

        subtitle: article.subtitle,

        content: article.content,

        photos: article.photos,

      });

      break;

    }



    case 'Kitap Tanıtımı': {

      generatedPages.push({

        id: `page-${article.id}-1`,

        pageNumber: startPageNum,

        issueId: article.issueId,

        articleId: article.id,

        templateId: 'M16',

        layoutVariant: 'A',

        category: 'Kitap Tanıtımı',

        title: article.title,

        subtitle: article.subtitle,

        author: article.author,

        authorRole: article.authorRole,

        content: article.content,

        pullQuote: suggestedQuote,

        photos: article.photos.slice(0, 2),

        extraData: { bookData: article.bookData }

      });

      break;

    }



    case 'Başarı': {

      generatedPages.push({

        id: `page-${article.id}-1`,

        pageNumber: startPageNum,

        issueId: article.issueId,

        articleId: article.id,

        templateId: 'M17',

        layoutVariant: 'A',

        category: 'Başarı',

        title: article.title,

        subtitle: article.subtitle,

        author: article.author,

        content: article.content,

        pullQuote: suggestedQuote,

        photos: article.photos.slice(0, 4),

      });

      break;

    }



    case 'Rehberlik': {

      generatedPages.push({

        id: `page-${article.id}-1`,

        pageNumber: startPageNum,

        issueId: article.issueId,

        articleId: article.id,

        templateId: 'M18',

        layoutVariant: 'A',

        category: 'Rehberlik',

        title: article.title,

        subtitle: article.subtitle,

        author: article.author,

        authorRole: article.authorRole,

        content: article.content,

        pullQuote: suggestedQuote,

        photos: article.photos.slice(0, 2),

      });

      break;

    }



    case 'Dijital Vatandaşlık': {

      generatedPages.push({

        id: `page-${article.id}-1`,

        pageNumber: startPageNum,

        issueId: article.issueId,

        articleId: article.id,

        templateId: 'M20',

        layoutVariant: 'A',

        category: 'Dijital Vatandaşlık',

        title: article.title,

        subtitle: article.subtitle,

        author: article.author,

        content: article.content,

        pullQuote: suggestedQuote,

        photos: article.photos.slice(0, 2),

        qrCodeDataUrl,

        qrUrl: qrTargetUrl,

        qrLabel: 'Güvenli İnternet Rehberi'

      });

      break;

    }



    case 'Oyun':

    case 'Bulmaca': {

      if (article.interactiveUrl || article.interactiveData) {

        generatedPages.push({

          id: `page-${article.id}-1`,

          pageNumber: startPageNum,

          issueId: article.issueId,

          articleId: article.id,

          templateId: 'M24',

          layoutVariant: 'A',

          category: 'Oyun',

          title: article.title,

          subtitle: article.subtitle,

          content: article.content,

          photos: article.photos.slice(0, 2),

          qrCodeDataUrl,

          qrUrl: qrTargetUrl,

          qrLabel: 'Oyunu Başlatmak İçin Tara',

          interactiveButton: {

            text: 'OYUNU BAŞLAT 🎮',

            url: qrTargetUrl || '#'

          }

        });

      } else {

        generatedPages.push({

          id: `page-${article.id}-1`,

          pageNumber: startPageNum,

          issueId: article.issueId,

          articleId: article.id,

          templateId: 'M19',

          layoutVariant: 'A',

          category: 'Bulmaca',

          title: article.title,

          subtitle: article.subtitle,

          content: article.content,

          photos: article.photos.slice(0, 2),

        });
      }
      break;
    }

    case 'Kültür & Sanat': {
      if (photoCount === 1 && wordCount < 100) {
        generatedPages.push({
          id: `page-${article.id}-1`,
          pageNumber: startPageNum,
          issueId: article.issueId,
          articleId: article.id,
          templateId: 'M14',
          layoutVariant: 'A',
          category: 'Kültür & Sanat',
          title: article.title,
          subtitle: article.subtitle,
          author: article.author,
          authorRole: article.authorRole,
          content: article.content,
          photos: article.photos.slice(0, 1),
        });
      } else {
        generatedPages.push({
          id: `page-${article.id}-1`,
          pageNumber: startPageNum,
          issueId: article.issueId,
          articleId: article.id,
          templateId: photoCount >= 2 ? 'M05' : 'M04',
          layoutVariant: 'A',
          category: 'Kültür & Sanat',
          title: article.title,
          subtitle: article.subtitle,
          author: article.author,
          authorRole: article.authorRole,
          content: article.content,
          pullQuote: suggestedQuote,
          photos: article.photos.slice(0, 2),
        });
      }
      break;
    }

    case 'Fotoğraf Galerisi': {
      generatedPages.push({
        id: `page-${article.id}-1`,
        pageNumber: startPageNum,
        issueId: article.issueId,
        articleId: article.id,
        templateId: 'M15',
        layoutVariant: 'A',
        category: 'Fotoğraf Galerisi',
        title: article.title,
        subtitle: article.subtitle,
        content: article.content,
        photos: article.photos,
      });
      break;
    }

    case 'Kitap Tanıtımı': {
      generatedPages.push({
        id: `page-${article.id}-1`,
        pageNumber: startPageNum,
        issueId: article.issueId,
        articleId: article.id,
        templateId: 'M16',
        layoutVariant: 'A',
        category: 'Kitap Tanıtımı',
        title: article.title,
        subtitle: article.subtitle,
        author: article.author,
        authorRole: article.authorRole,
        content: article.content,
        pullQuote: suggestedQuote,
        photos: article.photos.slice(0, 2),
        extraData: { bookData: article.bookData }
      });
      break;
    }

    case 'Başarı': {
      generatedPages.push({
        id: `page-${article.id}-1`,
        pageNumber: startPageNum,
        issueId: article.issueId,
        articleId: article.id,
        templateId: 'M17',
        layoutVariant: 'A',
        category: 'Başarı',
        title: article.title,
        subtitle: article.subtitle,
        author: article.author,
        content: article.content,
        pullQuote: suggestedQuote,
        photos: article.photos.slice(0, 4),
      });
      break;
    }

    case 'Rehberlik': {
      generatedPages.push({
        id: `page-${article.id}-1`,
        pageNumber: startPageNum,
        issueId: article.issueId,
        articleId: article.id,
        templateId: 'M18',
        layoutVariant: 'A',
        category: 'Rehberlik',
        title: article.title,
        subtitle: article.subtitle,
        author: article.author,
        authorRole: article.authorRole,
        content: article.content,
        pullQuote: suggestedQuote,
        photos: article.photos.slice(0, 2),
      });
      break;
    }

    case 'Dijital Vatandaşlık': {
      generatedPages.push({
        id: `page-${article.id}-1`,
        pageNumber: startPageNum,
        issueId: article.issueId,
        articleId: article.id,
        templateId: 'M20',
        layoutVariant: 'A',
        category: 'Dijital Vatandaşlık',
        title: article.title,
        subtitle: article.subtitle,
        author: article.author,
        content: article.content,
        pullQuote: suggestedQuote,
        photos: article.photos.slice(0, 2),
        qrCodeDataUrl,
        qrUrl: qrTargetUrl,
        qrLabel: 'Güvenli İnternet Rehberi'
      });
      break;
    }

    case 'Oyun':
    case 'Bulmaca': {
      if (article.interactiveUrl || article.interactiveData) {
        generatedPages.push({
          id: `page-${article.id}-1`,
          pageNumber: startPageNum,
          issueId: article.issueId,
          articleId: article.id,
          templateId: 'M24',
          layoutVariant: 'A',
          category: 'Oyun',
          title: article.title,
          subtitle: article.subtitle,
          content: article.content,
          photos: article.photos.slice(0, 2),
          qrCodeDataUrl,
          qrUrl: qrTargetUrl,
          qrLabel: 'Oyunu Başlatmak İçin Tara',
          interactiveButton: {
            text: 'OYUNU BAŞLAT 🎮',
            url: qrTargetUrl || '#'
          }
        });
      } else {
        generatedPages.push({
          id: `page-${article.id}-1`,
          pageNumber: startPageNum,
          issueId: article.issueId,
          articleId: article.id,
          templateId: 'M19',
          layoutVariant: 'A',
          category: 'Bulmaca',
          title: article.title,
          subtitle: article.subtitle,
          content: article.content,
          photos: article.photos.slice(0, 2),
        });
      }
      break;
    }

    default: {
      if (wordCount > 350) {
        const split = splitTextForContinuation(paragraphs, 220, 360);
        
        generatedPages.push({
          id: `page-${article.id}-1`,
          pageNumber: startPageNum,
          issueId: article.issueId,
          articleId: article.id,
          templateId: photoCount >= 2 ? 'M05' : 'M04',
          layoutVariant: 'A',
          category: article.category,
          title: article.title,
          subtitle: article.subtitle,
          author: article.author,
          authorRole: article.authorRole,
          content: split.page1Text,
          pullQuote: suggestedQuote,
          sourceReference: article.sourceReference,
          photos: article.photos.slice(0, 2),
          qrCodeDataUrl,
          qrUrl: qrTargetUrl,
        });

        generatedPages.push({
          id: `page-${article.id}-2`,
          pageNumber: startPageNum + 1,
          issueId: article.issueId,
          articleId: article.id,
          templateId: 'M06',
          layoutVariant: 'A',
          category: article.category,
          title: `${article.title} (Devam)`,
          author: article.author,
          authorRole: article.authorRole,
          content: split.page2Text,
          sourceReference: article.sourceReference,
          photos: article.photos.slice(2, 4),
          qrCodeDataUrl: split.page3Text ? undefined : qrCodeDataUrl,
        });

        if (split.page3Text) {
          generatedPages.push({
            id: `page-${article.id}-3`,
            pageNumber: startPageNum + 2,
            issueId: article.issueId,
            articleId: article.id,
            templateId: 'M06',
            layoutVariant: 'B',
            category: article.category,
            title: `${article.title} (Sonuç)`,
            author: article.author,
            authorRole: article.authorRole,
            content: split.page3Text,
            sourceReference: article.sourceReference,
            photos: article.photos.slice(4, 6),
            qrCodeDataUrl,
          });
        }
      } else {
        const chosenTemplate = photoCount >= 2 ? 'M05' : 'M04';
        generatedPages.push({
          id: `page-${article.id}-1`,
          pageNumber: startPageNum,
          issueId: article.issueId,
          articleId: article.id,
          templateId: chosenTemplate,
          layoutVariant: 'A',
          category: article.category,
          title: article.title,
          subtitle: article.subtitle,
          author: article.author,
          authorRole: article.authorRole,
          content: article.content,
          pullQuote: suggestedQuote,
          sourceReference: article.sourceReference,
          photos: article.photos.slice(0, photoCount >= 2 ? 2 : 1),
          qrCodeDataUrl,
          qrUrl: qrTargetUrl,
          qrLabel: qrTargetUrl ? 'Detaylar ve İçerik' : undefined
        });
      }
      break;
    }
  }

  return {
    pages: generatedPages.map(p => ({
      ...p,
      sourceReference: article.sourceReference || p.sourceReference
    })),
    recommendedPullQuote: suggestedQuote,
    wordCount,
    readingTimeMinutes,
    warnings
  };
}

export function cycleDesignVariant(page: MagazinePage): MagazinePage {
  const currentTemplate = TEMPLATES_LIBRARY.find(t => t.id === page.templateId);
  const variants = currentTemplate?.variants || ['A', 'B'];
  const currentIndex = variants.indexOf(page.layoutVariant);
  const nextIndex = (currentIndex + 1) % variants.length;
  const nextVariant = variants[nextIndex];

  return {
    ...page,
    layoutVariant: nextVariant
  };
}
