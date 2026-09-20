import { MagazineIssue, PreflightReport, PreflightItem } from '../types/magazine';
import { calculateWordCount } from './smartLayout';

export function runPreflightAudit(issue: MagazineIssue): PreflightReport {
  const items: PreflightItem[] = [];

  // Issue-level checks
  if (!issue.title || !issue.title.trim()) {
    items.push({
      id: 'issue-title',
      type: 'error',
      message: 'Dergi Adı Eksik',
      detail: 'Derginin ana adı (örn. MAİDER) girilmelidir.',
      field: 'title'
    });
  }

  if (!issue.issueNumber || issue.issueNumber <= 0) {
    items.push({
      id: 'issue-number',
      type: 'warning',
      message: 'Sayı Numarası Belirtilmemiş',
      detail: 'Kapak ve künyede görünecek sayı numarası (örn. 10) boş bırakılmış.',
      field: 'issueNumber'
    });
  }

  if (!issue.coverTitle || !issue.coverTitle.trim()) {
    items.push({
      id: 'cover-title',
      type: 'error',
      message: 'Kapak Dosya Konusu Eksik',
      detail: 'Kapakta yer alacak ana manşet başlığı boş bırakılmış.',
      field: 'coverTitle'
    });
  }

  // Page-level checks
  if (!issue.pages || issue.pages.length === 0) {
    items.push({
      id: 'no-pages',
      type: 'error',
      message: 'Dergide Hiç Sayfa Yok',
      detail: 'Lütfen en azından Kapak, İçindekiler ve bir içerik sayfası ekleyin.'
    });
  } else {
    // Check required foundational pages
    const hasCover = issue.pages.some(p => p.templateId === 'M01');
    const hasToc = issue.pages.some(p => p.templateId === 'M02');
    const hasMasthead = issue.pages.some(p => p.templateId === 'M23');

    if (!hasCover) {
      items.push({
        id: 'missing-cover',
        type: 'warning',
        message: 'Kapak Sayfası (M01) Bulunamadı',
        detail: 'Derginin ilk sayfası genellikle M01 kapak olmalıdır.'
      });
    }

    if (!hasToc) {
      items.push({
        id: 'missing-toc',
        type: 'info',
        message: 'İçindekiler Sayfası (M02) Bulunmuyor',
        detail: 'Okuyucu deneyimi için 2. veya 3. sayfaya İçindekiler eklenmesi önerilir.'
      });
    }

    if (!hasMasthead) {
      items.push({
        id: 'missing-masthead',
        type: 'info',
        message: 'Künye Sayfası (M23) Bulunmuyor',
        detail: 'Resmi okul dergisi yayını için künye sayfası eklenmesi tavsiye edilir.'
      });
    }

    // Iterate through individual pages
    issue.pages.forEach((page, idx) => {
      const pageNum = page.pageNumber || idx + 1;

      // Title check
      if (!page.title && page.templateId !== 'M02' && page.templateId !== 'M23' && page.templateId !== 'M25') {
        items.push({
          id: `p-${page.id}-title`,
          type: 'error',
          pageNumber: pageNum,
          pageTitle: page.title || 'Başlıksız Sayfa',
          message: `Sayfa ${pageNum}: Başlık Eksik`,
          detail: 'Bu sayfada ana başlık bulunmuyor.'
        });
      }

      // Author check for articles
      const articleTemplates = ['M04', 'M05', 'M07', 'M08', 'M09', 'M11', 'M12', 'M13', 'M16'];
      if (articleTemplates.includes(page.templateId) && (!page.author || !page.author.trim())) {
        items.push({
          id: `p-${page.id}-author`,
          type: 'warning',
          pageNumber: pageNum,
          pageTitle: page.title,
          message: `Sayfa ${pageNum}: Yazar / Hazırlayan Bilgisi Boş`,
          detail: 'Öğretmen veya öğrenci yazar adı eklenmesi kurumsal kimlik için önemlidir.'
        });
      }

      // Photos check
      if (page.photos && page.photos.length > 0) {
        page.photos.forEach((photo, pIdx) => {
          if (photo.isLowRes) {
            items.push({
              id: `p-${page.id}-photo-${pIdx}`,
              type: 'warning',
              pageNumber: pageNum,
              pageTitle: page.title,
              message: `Sayfa ${pageNum}: Fotoğraf #${pIdx + 1} Düşük Çözünürlüklü`,
              detail: 'Baskı veya büyük ekran Canva sunumlarında görsel bulanık görünebilir.'
            });
          }
        });
      }

      // Text length check (avoid overflow on single page)
      if (page.content) {
        const words = calculateWordCount(page.content);
        if (words > 450 && page.templateId !== 'M06' && page.templateId !== 'M13') {
          items.push({
            id: `p-${page.id}-overflow`,
            type: 'warning',
            pageNumber: pageNum,
            pageTitle: page.title,
            message: `Sayfa ${pageNum}: Metin Çok Uzun (${words} kelime)`,
            detail: 'Tek sayfaya sığdırmak fontu küçültebilir. Metni "M06 Uzun Makale" ile devam sayfasına bölmeniz önerilir.'
          });
        }
      }

      // QR Link check
      if (page.qrUrl && (!page.qrCodeDataUrl || page.qrCodeDataUrl.length < 100)) {
        items.push({
          id: `p-${page.id}-qr`,
          type: 'error',
          pageNumber: pageNum,
          pageTitle: page.title,
          message: `Sayfa ${pageNum}: QR Kod Üretilemedi`,
          detail: 'Verilen bağlantı formatı geçersiz olabilir.'
        });
      }
    });
  }

  const errorCount = items.filter(i => i.type === 'error').length;
  const warningCount = items.filter(i => i.type === 'warning').length;

  return {
    isValid: errorCount === 0,
    totalChecks: items.length,
    errorCount,
    warningCount,
    items
  };
}
