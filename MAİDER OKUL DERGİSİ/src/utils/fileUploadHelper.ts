import { MagazinePhoto } from '../types/magazine';

// Helper to dynamically load PDF.js from CDN if user uploads a PDF file
const loadPdfJs = async (): Promise<any> => {
  if (typeof window === 'undefined') return null;
  if ((window as any).pdfjsLib) return (window as any).pdfjsLib;

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
    script.async = true;
    script.onload = () => {
      const pdfjs = (window as any).pdfjsLib;
      if (pdfjs) {
        pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        resolve(pdfjs);
      } else {
        reject(new Error('PDF.js yüklenemedi.'));
      }
    };
    script.onerror = () => reject(new Error('PDF kütüphanesi CDN üzerinden yüklenemedi.'));
    document.head.appendChild(script);
  });
};

export interface ProcessedUploadResult {
  photo: MagazinePhoto;
  recommendedPosition: 'full-width' | 'inline-left' | 'inline-right' | 'bottom';
  recommendedFit: 'contain' | 'cover';
  recommendedScale: number;
}

/**
 * Yüksek kaliteli görsel (.png, .jpg, .webp) veya PDF dosyasını işler.
 * Retina / yüksek DPI çözünürlüğünü korur ve sayfa mizanpajına uygun
 * yerleşim önerileriyle birlikte MagazinePhoto döner.
 */
export async function processFileForMagazine(
  file: File,
  isFirstPhoto: boolean = false
): Promise<ProcessedUploadResult> {
  const fileNameClean = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
  const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');

  if (isPdf) {
    try {
      const pdfjs = await loadPdfJs();
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      const firstPage = await pdf.getPage(1);

      // 3.2x ultra-retina/DPI ölçekleme - Baskı (300+ DPI) ve yüksek çözünürlüklü ekranlar için kristal netlik
      const scale = 3.2;
      const viewport = firstPage.getViewport({ scale });

      const canvas = document.createElement('canvas');
      canvas.width = Math.round(viewport.width);
      canvas.height = Math.round(viewport.height);
      const ctx = canvas.getContext('2d', { alpha: false });

      if (ctx) {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        await firstPage.render({ canvasContext: ctx, viewport }).promise;
        const dataUrl = canvas.toDataURL('image/png', 1.0);

        const naturalWidth = canvas.width;
        const naturalHeight = canvas.height;
        const aspectRatio = naturalWidth / naturalHeight;

        const photo: MagazinePhoto = {
          id: `photo-pdf-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
          url: dataUrl,
          caption: fileNameClean,
          isMain: isFirstPhoto,
          width: naturalWidth,
          height: naturalHeight,
          isLowRes: false,
          focalPoint: { x: 50, y: 50 }
        };

        const isLandscape = aspectRatio >= 1.15;
        const isFullA4Portrait = aspectRatio >= 0.65 && aspectRatio <= 0.78;

        return {
          photo,
          recommendedPosition: (isLandscape || isFullA4Portrait) ? 'full-width' : 'inline-left',
          recommendedFit: 'contain',
          recommendedScale: 100
        };
      }
    } catch (err) {
      console.warn('PDF.js işleme hatası, yedek Blob URL kullanılıyor:', err);
    }
  }

  // Standart Görsel Dosyaları (.png, .jpg, .jpeg, .webp, .svg)
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        const naturalWidth = img.naturalWidth || 1200;
        const naturalHeight = img.naturalHeight || 800;
        const isLowRes = naturalWidth < 800;
        const aspectRatio = naturalWidth / naturalHeight;

        const photo: MagazinePhoto = {
          id: `photo-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
          url,
          caption: fileNameClean,
          isMain: isFirstPhoto,
          width: naturalWidth,
          height: naturalHeight,
          isLowRes,
          focalPoint: { x: 50, y: 50 }
        };

        const isLandscape = aspectRatio >= 1.2;
        const isPortrait = aspectRatio <= 0.85;

        let recommendedPosition: 'full-width' | 'inline-left' | 'inline-right' | 'bottom' = 'full-width';
        let recommendedScale = 100;

        if (isPortrait) {
          recommendedPosition = 'inline-left';
          recommendedScale = 75;
        } else if (isLandscape) {
          recommendedPosition = 'full-width';
          recommendedScale = 100;
        } else {
          recommendedPosition = 'inline-left';
          recommendedScale = 85;
        }

        resolve({
          photo,
          recommendedPosition,
          recommendedFit: 'contain',
          recommendedScale
        });
      };

      img.onerror = () => reject(new Error('Görsel dosyası okunamadı.'));
      img.src = url;
    };

    reader.onerror = () => reject(new Error('Dosya yüklenirken bir hata oluştu.'));
    reader.readAsDataURL(file);
  });
}
