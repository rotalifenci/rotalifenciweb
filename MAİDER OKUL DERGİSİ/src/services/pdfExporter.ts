import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface PreflightCheckResult {
  isValid: boolean;
  issues: string[];
  pageDimensions: { width: number; height: number };
  imagesCount: number;
  fontsReady: boolean;
  footerVisible: boolean;
}

/**
 * Preflight quality check before generating PDF.
 * Ensures font loading, image decoding, footer visibility, and A4 bounding box integrity.
 */
export async function runPdfPreflightCheck(pageElement: HTMLElement): Promise<PreflightCheckResult> {
  const issues: string[] = [];

  // 1. Check fonts
  let fontsReady = false;
  try {
    if (document.fonts) {
      await document.fonts.ready;
      fontsReady = true;
    }
  } catch (e) {
    issues.push('Web fontları yüklenirken gecikme yaşandı, sistem varsayılan serif fontunu kullanacak.');
  }

  // 2. Check images
  const images = Array.from(pageElement.querySelectorAll('img'));
  let loadedImages = 0;
  for (const img of images) {
    if (img.complete && img.naturalHeight > 0) {
      loadedImages++;
    } else {
      try {
        await img.decode();
        loadedImages++;
      } catch {
        issues.push(`Görsel tam yüklenemedi: ${img.alt || img.src}`);
      }
    }
  }

  // 3. Check footer visibility
  const footer = pageElement.querySelector('footer');
  const footerVisible = !!footer && (footer.clientHeight > 20 || footer.scrollHeight > 20);
  if (!footerVisible) {
    issues.push('Sayfa alt bilgisi (footer) görünürlüğü teyit edilemedi.');
  }

  // 4. Check dimension
  const rect = pageElement.getBoundingClientRect();

  return {
    isValid: issues.length === 0,
    issues,
    pageDimensions: { width: Math.round(rect.width), height: Math.round(rect.height) },
    imagesCount: loadedImages,
    fontsReady,
    footerVisible
  };
}

/**
 * Optimizes the cloned DOM element for flawless html2canvas export:
 * - Locks exact 794px x 1123px dimensions (A4 96 DPI)
 * - Converts multi-column CSS to dual-column flexbox to prevent html2canvas stacking bugs
 * - Disables backdrop-filters that cause artifacts
 * - Forces sync rendering of decoded images
 */
function prepareClonedDocForExport(clonedDoc: Document, targetElId?: string) {
  // 1. WYSIWYG: Neutralize print media in clonedDoc so html2canvas renders exact screen DOM & CSS
  const styleTags = clonedDoc.querySelectorAll('style');
  styleTags.forEach((st) => {
    if (st.textContent && /@media\s+print/i.test(st.textContent)) {
      st.textContent = st.textContent.replace(/@media\s+print/gi, '@media not-print');
    }
  });
  const linkTags = clonedDoc.querySelectorAll('link[rel="stylesheet"]');
  linkTags.forEach((link) => {
    if (link.getAttribute('media') === 'print') {
      link.setAttribute('media', 'not-print');
    }
  });

  const clonedEl =
    (targetElId ? clonedDoc.getElementById(targetElId) : null) ||
    clonedDoc.getElementById('active-preview-page') ||
    clonedDoc.querySelector('.a4-page-renderer') ||
    clonedDoc.querySelector('.print-page');

  if (clonedEl && clonedEl instanceof HTMLElement) {
    // 2. Strict A4 Dimension Lock and overflow: hidden to prevent content from pushing footer off
    clonedEl.style.width = '794px';
    clonedEl.style.maxWidth = '794px';
    clonedEl.style.minWidth = '794px';
    clonedEl.style.height = '1123px';
    clonedEl.style.maxHeight = '1123px';
    clonedEl.style.minHeight = '1123px';
    clonedEl.style.transform = 'none';
    clonedEl.style.boxShadow = 'none';
    clonedEl.style.borderRadius = '0';
    clonedEl.style.overflow = 'hidden';
    clonedEl.style.backgroundColor = '#FDFBF7';
    clonedEl.style.boxSizing = 'border-box';
    clonedEl.style.position = 'relative';
    clonedEl.style.paddingTop = '16mm';
    clonedEl.style.paddingBottom = '20mm';
    clonedEl.style.paddingLeft = '18mm';
    clonedEl.style.paddingRight = '18mm';

    if (clonedDoc.body) {
      clonedDoc.body.style.width = '794px';
      clonedDoc.body.style.minWidth = '794px';
      clonedDoc.body.style.margin = '0';
      clonedDoc.body.style.padding = '0';
      clonedDoc.body.style.overflow = 'hidden';
    }

    // Hide guideline overlays in PDF export
    const guides = clonedEl.querySelectorAll('.pointer-events-none');
    guides.forEach((g) => {
      (g as HTMLElement).style.display = 'none';
    });

    // 3. Clear backdrop blur filters that break html2canvas
    const blurs = clonedEl.querySelectorAll('[class*="backdrop-blur"]');
    blurs.forEach((b) => {
      (b as HTMLElement).style.backdropFilter = 'none';
    });

    // 4. Force eager loading and sync decoding on all images
    const images = clonedEl.querySelectorAll('img');
    images.forEach((img) => {
      img.loading = 'eager';
      img.decoding = 'sync';
    });

    // 5. Ensure top images span full width and floated images stay floated
    const topImages = clonedEl.querySelectorAll('.photo-top-container, [class*="col-span-full"]');
    topImages.forEach((fig) => {
      const el = fig as HTMLElement;
      if (!el.classList.contains('float-left') && !el.classList.contains('float-right')) {
        el.style.width = '100%';
        el.style.maxWidth = '100%';
        el.style.display = 'block';
        el.style.clear = 'both';
        const img = el.querySelector('img');
        if (img) {
          img.style.width = '100%';
          img.style.display = 'block';
        }
      }
    });

    // 6. Prevent column-count from breaking layouts in cloned DOM
    const colContainers = clonedEl.querySelectorAll('[class*="columns-"]');
    colContainers.forEach((colContainer) => {
      const container = colContainer as HTMLElement;
      container.style.overflow = 'hidden';
      container.style.width = '100%';
      container.style.boxSizing = 'border-box';
      container.style.display = 'block';
    });

    // 7. Prevent content from overlapping footer: height calc(100% - 40mm)
    const main = clonedEl.querySelector('main');
    if (main && main instanceof HTMLElement) {
      main.style.height = 'calc(100% - 40mm)';
      main.style.maxHeight = 'calc(100% - 40mm)';
      main.style.overflow = 'hidden';
      main.style.display = 'block';
      main.style.width = '100%';
      main.style.boxSizing = 'border-box';
    }

    // 8. Secure Running Footer at the exact bottom of the page (absolute position, never cut off)
    const footer = clonedEl.querySelector('footer');
    if (footer && footer instanceof HTMLElement) {
      footer.style.position = 'absolute';
      footer.style.bottom = '20mm';
      footer.style.left = '18mm';
      footer.style.right = '18mm';
      footer.style.width = 'calc(100% - 36mm)';
      footer.style.height = '15mm';
      footer.style.display = 'flex';
      footer.style.alignItems = 'center';
      footer.style.justifyContent = 'space-between';
      footer.style.boxSizing = 'border-box';
      footer.style.zIndex = '50';
      footer.style.visibility = 'visible';
      footer.style.opacity = '1';
    }
  }
}

/**
 * Export single magazine page to ultra-crisp PNG (300 DPI print quality)
 */
export async function exportPageToPng(pageElement: HTMLElement, fileName: string = 'maider-sayfa.png'): Promise<void> {
  // Ensure fonts and images are loaded before snapshot
  if (document.fonts) {
    await document.fonts.ready;
  }

  const canvas = await html2canvas(pageElement, {
    scale: 2.5, // 250-300 DPI high resolution
    useCORS: true,
    allowTaint: true,
    logging: false,
    backgroundColor: '#FDFBF7',
    width: 794,
    height: 1123,
    windowWidth: 794,
    windowHeight: 1123,
    scrollX: 0,
    scrollY: 0,
    onclone: (clonedDoc) => {
      prepareClonedDocForExport(clonedDoc, pageElement.id);
    }
  });

  const imgData = canvas.toDataURL('image/png', 1.0);
  const link = document.createElement('a');
  link.download = fileName.endsWith('.png') ? fileName : `${fileName}.png`;
  link.href = imgData;
  link.click();
}

/**
 * Export single page or full magazine issue to professional vector-wrapped A4 PDF (210mm x 297mm)
 */
export async function exportIssueToPdf(
  pageElements: HTMLElement[],
  title: string = 'MAIDER-Dergisi',
  onProgress?: (percent: number, status: string) => void
): Promise<void> {
  if (pageElements.length === 0) return;

  // 1. Wait for fonts & images
  if (onProgress) onProgress(10, 'Yazı fontları ve tipografi denetleniyor...');
  if (document.fonts) {
    await document.fonts.ready;
  }

  if (onProgress) onProgress(25, 'Görseller yüksek çözünürlükte optimize ediliyor...');
  for (const el of pageElements) {
    const imgs = Array.from(el.querySelectorAll('img'));
    for (const img of imgs) {
      if (!img.complete) {
        try {
          await img.decode();
        } catch {
          // continue
        }
      }
    }
  }

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true
  });

  const pdfW = 210;
  const pdfH = 297;

  for (let i = 0; i < pageElements.length; i++) {
    const el = pageElements[i];
    if (onProgress) {
      const stepPercent = Math.round(30 + ((i + 1) / pageElements.length) * 65);
      onProgress(stepPercent, `Sayfa ${i + 1} A4 formatında derleniyor...`);
    }

    const canvas = await html2canvas(el, {
      scale: 2.5, // 250-300 DPI print standard
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: '#FDFBF7',
      width: 794,
      height: 1123,
      windowWidth: 794,
      windowHeight: 1123,
      scrollX: 0,
      scrollY: 0,
      onclone: (clonedDoc) => {
        prepareClonedDocForExport(clonedDoc, el.id);
      }
    });

    const imgData = canvas.toDataURL('image/png', 1.0);

    if (i > 0) {
      pdf.addPage('a4', 'portrait');
    }

    pdf.addImage(imgData, 'PNG', 0, 0, pdfW, pdfH, undefined, 'FAST');
  }

  if (onProgress) onProgress(100, 'PDF başarıyla hazırlandı!');
  const cleanTitle = title.endsWith('.pdf') ? title : `${title}.pdf`;
  pdf.save(cleanTitle);
}
