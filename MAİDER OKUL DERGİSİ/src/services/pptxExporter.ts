import pptxgen from 'pptxgenjs';
import { MagazineIssue, MagazinePage } from '../types/magazine';
import { MAIDER_BRAND, CATEGORY_THEMES } from '../config/brand';

export async function exportIssueToPptx(issue: MagazineIssue, onProgress?: (percent: number, status: string) => void): Promise<Blob> {
  const pptx = new pptxgen();

  // 1. Setup Layout Dimensions
  if (issue.format === 'digital') {
    // 9:16 Digital Phone/Tablet ratio
    pptx.defineLayout({ name: 'MAIDER_DIGITAL', width: 7.2, height: 12.8 });
    pptx.layout = 'MAIDER_DIGITAL';
  } else {
    // A4 Portrait: 8.27 x 11.69 inches
    pptx.defineLayout({ name: 'MAIDER_A4', width: 8.27, height: 11.69 });
    pptx.layout = 'MAIDER_A4';
  }

  const slideW = issue.format === 'digital' ? 7.2 : 8.27;
  const slideH = issue.format === 'digital' ? 12.8 : 11.69;
  const marginX = 0.6;
  const contentW = slideW - (marginX * 2);

  const totalPages = issue.pages.length;

  for (let i = 0; i < totalPages; i++) {
    const page = issue.pages[i];
    const pageNum = page.pageNumber || (i + 1);
    const theme = CATEGORY_THEMES[page.category] || CATEGORY_THEMES['Okulumuzdan'];
    const themeColor = theme.pptxColor;

    if (onProgress) {
      onProgress(Math.round(((i + 1) / totalPages) * 90), `Sayfa ${pageNum} (${page.title || page.templateId}) işleniyor...`);
    }

    const slide = pptx.addSlide();

    // Background
    if (page.templateId === 'M01') {
      slide.background = { color: '0F172A' }; // Dark navy cover
    } else if (page.templateId === 'M25') {
      slide.background = { color: '0F172A' }; // Dark back cover
    } else {
      slide.background = { color: 'FDFBF7' }; // Warm cream
    }

    // Header & Footer (Except on Cover M01 and Back Cover M25)
    if (page.templateId !== 'M01' && page.templateId !== 'M25') {
      // Running Header Line
      slide.addShape(pptx.ShapeType.line, {
        x: marginX,
        y: 0.65,
        w: contentW,
        h: 0,
        line: { color: 'CBD5E1', width: 0.75 }
      });

      // Category Pill Tag
      slide.addShape(pptx.ShapeType.roundRect, {
        x: marginX,
        y: 0.35,
        w: 1.8,
        h: 0.24,
        rectRadius: 0.05,
        fill: { color: themeColor },
      });
      slide.addText(theme.label.toUpperCase(), {
        x: marginX,
        y: 0.35,
        w: 1.8,
        h: 0.24,
        fontSize: 8,
        fontFace: 'Montserrat',
        bold: true,
        color: 'FFFFFF',
        align: 'center',
        valign: 'middle',
        margin: 0
      });

      // Magazine Issue Brand in Header Right
      slide.addText(`MAİDER • ${issue.schoolName.toUpperCase()}`, {
        x: slideW - marginX - 3.5,
        y: 0.35,
        w: 3.5,
        h: 0.24,
        fontSize: 8,
        fontFace: 'Montserrat',
        color: '64748B',
        align: 'right',
        valign: 'middle',
        margin: 0
      });

      // Running Footer
      slide.addShape(pptx.ShapeType.line, {
        x: marginX,
        y: slideH - 0.55,
        w: contentW,
        h: 0,
        line: { color: 'E2E8F0', width: 0.75 }
      });

      // Page Number Badge Left
      slide.addText(`SAYFA  ${pageNum}`, {
        x: marginX,
        y: slideH - 0.5,
        w: 1.5,
        h: 0.3,
        fontSize: 9,
        fontFace: 'Montserrat',
        bold: true,
        color: themeColor,
        align: 'left',
        valign: 'middle',
        margin: 0
      });

      // Month Year Issue Right
      slide.addText(`Sayı ${issue.issueNumber} • ${issue.month} ${issue.year}`, {
        x: slideW - marginX - 2.5,
        y: slideH - 0.5,
        w: 2.5,
        h: 0.3,
        fontSize: 8,
        fontFace: 'Inter',
        color: '94A3B8',
        align: 'right',
        valign: 'middle',
        margin: 0
      });
    }

    // Page Specific Content Builder
    await buildPptxSlideContent(slide, page, issue, slideW, slideH, marginX, contentW, themeColor);
  }

  if (onProgress) {
    onProgress(95, 'PPTX dosyası paketleniyor...');
  }

  const result = await pptx.write({ outputType: 'blob' }) as Blob;
  return result;
}

// Build Native PPTX Slide Elements for Canva
async function buildPptxSlideContent(
  slide: any,
  page: MagazinePage,
  issue: MagazineIssue,
  slideW: number,
  slideH: number,
  marginX: number,
  contentW: number,
  themeColor: string
) {
  const pptx = (slide as any).pptx || {};

  switch (page.templateId) {
    case 'M01': {
      // Cover Page
      // Top Brand Banner
      slide.addText('MAİDER', {
        x: marginX,
        y: 0.8,
        w: contentW,
        h: 1.1,
        fontSize: 54,
        fontFace: 'Playfair Display',
        bold: true,
        color: 'FFFFFF',
        align: 'center',
        margin: 0
      });

      slide.addText('MEHMET AKİF İNAN ORTAOKULU E-DERGİSİ', {
        x: marginX,
        y: 1.85,
        w: contentW,
        h: 0.3,
        fontSize: 10,
        fontFace: 'Montserrat',
        bold: true,
        color: '0EA5E9',
        align: 'center',
        charSpacing: 3,
        margin: 0
      });

      // Issue Badge Bar
      slide.addShape(pptx.ShapeType?.rect || 'rect', {
        x: marginX,
        y: 2.25,
        w: contentW,
        h: 0.35,
        fill: { color: '1E293B' },
      });
      slide.addText(`SAYI: ${issue.issueNumber}  •  ${issue.month.toUpperCase()} ${issue.year}  •  DİJİTAL YAYIN`, {
        x: marginX,
        y: 2.25,
        w: contentW,
        h: 0.35,
        fontSize: 9,
        fontFace: 'Montserrat',
        bold: true,
        color: 'F8FAFC',
        align: 'center',
        valign: 'middle',
        margin: 0
      });

      // Cover Photo (if available)
      const coverPhoto = (page.photos && page.photos[0]?.url) || issue.coverImageUrl;
      if (coverPhoto) {
        try {
          slide.addImage({
            data: coverPhoto,
            x: marginX,
            y: 2.8,
            w: contentW,
            h: 5.2,
            sizing: { type: 'cover', w: contentW, h: 5.2 }
          });
        } catch (e) {
          console.warn('Cover photo embed skipped', e);
        }
      }

      // Cover Headline Box
      slide.addShape(pptx.ShapeType?.rect || 'rect', {
        x: marginX,
        y: 8.3,
        w: contentW,
        h: 2.6,
        fill: { color: '1E293B' },
      });

      slide.addShape(pptx.ShapeType?.rect || 'rect', {
        x: marginX,
        y: 8.3,
        w: 0.15,
        h: 2.6,
        fill: { color: 'D97706' },
      });

      slide.addText('BU SAYININ DOSYASI', {
        x: marginX + 0.3,
        y: 8.45,
        w: contentW - 0.6,
        h: 0.3,
        fontSize: 10,
        fontFace: 'Montserrat',
        bold: true,
        color: 'D97706',
        margin: 0
      });

      slide.addText(issue.coverTitle || page.title || 'GELECEĞİN DÜNYASINI İNŞA EDİYORUZ', {
        x: marginX + 0.3,
        y: 8.8,
        w: contentW - 0.6,
        h: 1.1,
        fontSize: 26,
        fontFace: 'Playfair Display',
        bold: true,
        color: 'FFFFFF',
        margin: 0
      });

      slide.addText(issue.coverSubtitle || page.subtitle || issue.slogan, {
        x: marginX + 0.3,
        y: 9.95,
        w: contentW - 0.6,
        h: 0.7,
        fontSize: 12,
        fontFace: 'Inter',
        color: 'CBD5E1',
        margin: 0
      });
      break;
    }

    case 'M02': {
      // Table of Contents
      slide.addText('İÇİNDEKİLER', {
        x: marginX,
        y: 0.9,
        w: contentW,
        h: 0.7,
        fontSize: 32,
        fontFace: 'Playfair Display',
        bold: true,
        color: '0F172A',
        margin: 0
      });

      slide.addText('Bu Sayıda Sizleri Bekleyen Yazılar, Projeler ve Etkinlikler', {
        x: marginX,
        y: 1.6,
        w: contentW,
        h: 0.35,
        fontSize: 11,
        fontFace: 'Inter',
        color: '64748B',
        margin: 0
      });

      // List magazine pages as TOC items (2 columns)
      const tocPages = issue.pages.filter(p => p.templateId !== 'M01' && p.templateId !== 'M02');
      const colW = (contentW - 0.4) / 2;

      tocPages.slice(0, 16).forEach((p, idx) => {
        const col = idx < 8 ? 0 : 1;
        const row = idx % 8;
        const xPos = marginX + (col * (colW + 0.4));
        const yPos = 2.2 + (row * 1.05);

        // Page number circle
        slide.addShape(pptx.ShapeType?.oval || 'oval', {
          x: xPos,
          y: yPos,
          w: 0.42,
          h: 0.42,
          fill: { color: themeColor },
        });
        slide.addText(String(p.pageNumber || idx + 3), {
          x: xPos,
          y: yPos,
          w: 0.42,
          h: 0.42,
          fontSize: 10,
          fontFace: 'Montserrat',
          bold: true,
          color: 'FFFFFF',
          align: 'center',
          valign: 'middle',
          margin: 0
        });

        // Item Category and Title
        slide.addText(p.category.toUpperCase(), {
          x: xPos + 0.55,
          y: yPos - 0.05,
          w: colW - 0.6,
          h: 0.22,
          fontSize: 8,
          fontFace: 'Montserrat',
          bold: true,
          color: themeColor,
          margin: 0
        });

        slide.addText(p.title || 'Başlıksız Yazı', {
          x: xPos + 0.55,
          y: yPos + 0.18,
          w: colW - 0.6,
          h: 0.4,
          fontSize: 11,
          fontFace: 'Playfair Display',
          bold: true,
          color: '0F172A',
          margin: 0
        });

        if (p.author) {
          slide.addText(p.author, {
            x: xPos + 0.55,
            y: yPos + 0.58,
            w: colW - 0.6,
            h: 0.22,
            fontSize: 8,
            fontFace: 'Inter',
            color: '64748B',
            margin: 0
          });
        }
      });
      break;
    }

    default: {
      // General Article / STEM / Event / Interview slide layout
      let curY = 0.9;

      // Title
      slide.addText(page.title || 'Başlık', {
        x: marginX,
        y: curY,
        w: contentW,
        h: 0.8,
        fontSize: 26,
        fontFace: 'Playfair Display',
        bold: true,
        color: '0F172A',
        margin: 0
      });
      curY += 0.75;

      // Subtitle / Author Line
      if (page.subtitle || page.author) {
        const byline = [page.subtitle, page.author ? `Hazırlayan: ${page.author}${page.authorRole ? ` (${page.authorRole})` : ''}` : '']
          .filter(Boolean)
          .join('  •  ');

        slide.addText(byline, {
          x: marginX,
          y: curY,
          w: contentW,
          h: 0.3,
          fontSize: 10,
          fontFace: 'Inter',
          italic: true,
          color: '64748B',
          margin: 0
        });
        curY += 0.4;
      }

      // Photos & Layout Structure
      const photos = page.photos || [];
      const hasPhoto = photos.length > 0 && photos[0].url;

      if (hasPhoto) {
        const photoH = 3.6;
        try {
          slide.addImage({
            data: photos[0].url,
            x: marginX,
            y: curY,
            w: contentW,
            h: photoH,
            sizing: { type: 'cover', w: contentW, h: photoH }
          });
        } catch (e) {
          console.warn('Image embed error', e);
        }
        curY += photoH + 0.2;

        if (photos[0].caption) {
          slide.addText(photos[0].caption, {
            x: marginX,
            y: curY,
            w: contentW,
            h: 0.25,
            fontSize: 8,
            fontFace: 'Inter',
            italic: true,
            color: '64748B',
            margin: 0
          });
          curY += 0.3;
        }
      }

      // Pull Quote Card (if available)
      if (page.pullQuote) {
        slide.addShape(pptx.ShapeType?.rect || 'rect', {
          x: marginX,
          y: curY,
          w: contentW,
          h: 0.9,
          fill: { color: 'F1F5F9' },
          line: { color: themeColor, width: 2 }
        });
        slide.addText(`“${page.pullQuote}”`, {
          x: marginX + 0.3,
          y: curY + 0.1,
          w: contentW - 0.6,
          h: 0.7,
          fontSize: 12,
          fontFace: 'Playfair Display',
          italic: true,
          bold: true,
          color: '0F172A',
          align: 'center',
          valign: 'middle',
          margin: 0
        });
        curY += 1.05;
      }

      // Body Text
      if (page.content) {
        const remainingH = (slideH - 0.7) - curY;
        slide.addText(page.content, {
          x: marginX,
          y: curY,
          w: page.qrCodeDataUrl ? contentW - 1.8 : contentW,
          h: Math.max(1.5, remainingH),
          fontSize: 10,
          fontFace: 'Inter',
          color: '1E293B',
          lineSpacingMultiple: 1.3,
          align: 'justify',
          margin: 0
        });

        // QR Code Box (if present)
        if (page.qrCodeDataUrl) {
          const qrX = slideW - marginX - 1.5;
          const qrY = curY;
          try {
            slide.addImage({
              data: page.qrCodeDataUrl,
              x: qrX,
              y: qrY,
              w: 1.5,
              h: 1.5,
            });
            if (page.qrLabel) {
              slide.addText(page.qrLabel, {
                x: qrX,
                y: qrY + 1.55,
                w: 1.5,
                h: 0.35,
                fontSize: 8,
                fontFace: 'Montserrat',
                bold: true,
                color: themeColor,
                align: 'center',
                margin: 0
              });
            }
          } catch (e) {
            console.warn('QR code embed error', e);
          }
        }
      }

      // Interactive Action Button (e.g. OYUNU BAŞLAT, VİDEOYU İZLE)
      if (page.interactiveButton) {
        const btnY = slideH - 1.3;
        slide.addShape(pptx.ShapeType?.roundRect || 'roundRect', {
          x: marginX,
          y: btnY,
          w: 2.8,
          h: 0.45,
          rectRadius: 0.08,
          fill: { color: themeColor },
          hyperlink: { url: page.interactiveButton.url }
        });
        slide.addText(page.interactiveButton.text, {
          x: marginX,
          y: btnY,
          w: 2.8,
          h: 0.45,
          fontSize: 10,
          fontFace: 'Montserrat',
          bold: true,
          color: 'FFFFFF',
          align: 'center',
          valign: 'middle',
          margin: 0
        });
      }
      break;
    }
  }
}
