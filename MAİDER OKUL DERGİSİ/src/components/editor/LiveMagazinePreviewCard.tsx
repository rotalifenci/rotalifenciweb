import React, { useState, useRef, useEffect } from 'react';
import { MagazineCategory, MagazinePhoto } from '../../types/magazine';
import { A4PageRenderer, LayoutStyle, ImagePosition, ImageFit, ComponentSize } from '../magazine/A4PageRenderer';
import { calculatePageDensity, PullQuoteStyle } from '../../services/smartPageEngine';
import { exportIssueToPdf, exportPageToPng, runPdfPreflightCheck } from '../../services/pdfExporter';
import {
  Maximize2,
  Download,
  Sliders,
  Sparkles,
  Grid,
  CheckCircle2,
  AlertTriangle,
  FileDown,
  RefreshCw,
  Eye,
  ShieldCheck,
  X,
  ZoomIn,
  ZoomOut,
  Expand,
  Shrink
} from 'lucide-react';

export type { LayoutStyle, ImagePosition, ImageFit, ComponentSize, PullQuoteStyle };

interface Props {
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
  zoomScale?: number;
  layoutStyle?: LayoutStyle;
  imagePosition?: ImagePosition;
  imageFit?: ImageFit;
  imageScale?: number;
  imageHeight?: ComponentSize;
  imageOrientation?: 'landscape' | 'portrait';
  pullQuoteSize?: ComponentSize;
  fontFamily?: string;
  fontSize?: number;
  lineHeight?: number;
  letterSpacing?: number;
  titleColor?: string;
  textAlign?: 'justify' | 'left' | 'center';
  fullPageCanvasImage?: string | null;
  isFullPageCanvas?: boolean;
  fullPageMode?: 'canvas-fit' | 'overlay' | 'full-bleed';
  isExpandedView?: boolean;
  onToggleExpandView?: () => void;
  onOpenFullscreen?: () => void;
  onAutoFit?: () => void;
  onCycleLayout?: () => void;
}

export const LiveMagazinePreviewCard: React.FC<Props> = ({
  title,
  subtitle,
  content,
  pullQuote,
  pullQuoteStyle = 'box',
  sourceReference,
  category,
  author = '',
  authorRole = '',
  photos,
  year = 2026,
  month = 'Eylül',
  issueNumber = 9,
  zoomScale = 1,
  layoutStyle = 'classic',
  imagePosition = 'inline-left',
  imageFit = 'contain',
  imageScale = 100,
  pullQuoteSize = 'medium',
  fontFamily = 'Merriweather',
  fontSize = 13,
  lineHeight = 1.65,
  letterSpacing = 0,
  titleColor,
  textAlign = 'justify',
  fullPageCanvasImage = null,
  isFullPageCanvas = false,
  fullPageMode = 'canvas-fit',
  isExpandedView = false,
  onToggleExpandView,
  onOpenFullscreen,
  onAutoFit,
  onCycleLayout,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.75);
  const [zoomMode, setZoomMode] = useState<'fit' | '100%' | 'custom'>('fit');
  const [customZoom, setCustomZoom] = useState<number>(1.0);
  const [showGuides, setShowGuides] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [exportProgressText, setExportProgressText] = useState('');
  const [internalFullscreen, setInternalFullscreen] = useState(false);
  const [fsZoomMode, setFsZoomMode] = useState<'fit' | '100%'>('fit');
  const [fsScale, setFsScale] = useState(0.85);

  // Auto-calculate exact zero-scroll fit scale for internal fullscreen
  useEffect(() => {
    if (!internalFullscreen) return;
    const updateFsScale = () => {
      const availW = window.innerWidth - 32;
      const availH = window.innerHeight - 100;
      const calculatedScale = Math.min(availW / 794, availH / 1123);
      setFsScale(Math.max(0.25, Math.min(1.2, calculatedScale)));
    };
    updateFsScale();
    window.addEventListener('resize', updateFsScale);
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setInternalFullscreen(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => {
      window.removeEventListener('resize', updateFsScale);
      window.removeEventListener('keydown', handleKey);
    };
  }, [internalFullscreen]);

  // Calculate live page density
  const densityAnalysis = calculatePageDensity({
    title,
    subtitle,
    content,
    photos,
    pullQuote,
    imageScale,
    layoutStyle,
    fontSize
  });

  // Calculate responsive scale based on parent container width (Expanded & Uncapped)
  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const parentWidth = containerRef.current.parentElement?.clientWidth || window.innerWidth;
        // Available width accounting for container padding (No artificial 600px cap!)
        const availableWidth = Math.max(320, parentWidth - 28);
        // Fixed A4 width is 794px
        const fitScale = (availableWidth / 794) * zoomScale;

        if (zoomMode === 'fit') {
          setScale(Math.max(0.35, Math.min(1.25, fitScale)));
        } else if (zoomMode === '100%') {
          setScale(1.0);
        } else {
          setScale(customZoom);
        }
      }
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [zoomScale, zoomMode, customZoom, isExpandedView]);

  const handleZoomIn = () => {
    setZoomMode('custom');
    setCustomZoom(prev => Math.min(1.5, Math.round((prev + 0.1) * 10) / 10));
  };

  const handleZoomOut = () => {
    setZoomMode('custom');
    setCustomZoom(prev => Math.max(0.4, Math.round((prev - 0.1) * 10) / 10));
  };

  const handleZoomFit = () => {
    setZoomMode('fit');
  };

  const handleZoom100 = () => {
    setZoomMode('100%');
    setCustomZoom(1.0);
  };

  // Direct PDF Download Handler with Quality Check
  const handleDownloadPdf = async () => {
    const pageEl = document.getElementById('active-preview-page');
    if (!pageEl) {
      alert('Dergi sayfası yüklenemedi. Lütfen tekrar deneyin.');
      return;
    }

    setIsExportingPdf(true);
    setExportProgressText('Kalite kontrolü yapılıyor...');

    try {
      // 1. Run Preflight Audit
      const preflight = await runPdfPreflightCheck(pageEl);
      if (!preflight.isValid && preflight.issues.length > 0) {
        console.warn('PDF Preflight Uyarıları:', preflight.issues);
      }

      // 2. Export High-Res A4 PDF
      const fileName = `MAIDER-${category || 'Dergi'}-${(title || 'Sayfa').slice(0, 20).replace(/\s+/g, '_')}`;
      await exportIssueToPdf([pageEl], fileName, (percent, status) => {
        setExportProgressText(`${status} (%${percent})`);
      });
    } catch (err) {
      console.error('PDF Export Error:', err);
      alert('PDF oluşturulurken bir hata oluştu.');
    } finally {
      setIsExportingPdf(false);
      setExportProgressText('');
    }
  };

  return (
    <div className="w-full flex flex-col items-center select-none">
      {/* ── Top Floating Action Bar & Density Meter & Zoom Controls ── */}
      <div className="w-full mb-2 px-1 flex flex-wrap items-center justify-between gap-2">
        {/* Page Density Indicator Badge & Safe Area Toggle */}
        <div className="flex items-center gap-2 flex-wrap">
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10.5px] font-bold shadow-2xs border"
            style={{
              backgroundColor: `${densityAnalysis.statusColor}15`,
              color: densityAnalysis.statusColor,
              borderColor: `${densityAnalysis.statusColor}40`
            }}
          >
            {densityAnalysis.status === 'overflow' ? (
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            ) : (
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            )}
            <span>Doluluk: %{densityAnalysis.densityPercentage}</span>
            <span className="opacity-75 font-medium">({densityAnalysis.statusText.split(' ')[0]})</span>
          </div>

          <button
            type="button"
            onClick={() => setShowGuides(prev => !prev)}
            title="A4 Baskı Güvenli Alanını Göster/Gizle"
            className={`px-2 py-1 rounded-lg text-[10px] font-semibold border transition-colors cursor-pointer flex items-center gap-1 ${
              showGuides
                ? 'bg-sky-50 text-sky-700 border-sky-300'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <ShieldCheck className="w-3 h-3" />
            <span>Kılavuz</span>
          </button>
        </div>

        {/* Quick Action Buttons & Interactive Zoom Controls */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Zoom Controls Segment */}
          <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 shadow-2xs text-slate-700">
            <button
              type="button"
              onClick={handleZoomOut}
              title="Uzaklaştır (%10)"
              className="p-1 rounded hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span
              className="px-1.5 text-[10px] font-mono font-bold text-slate-700 min-w-[34px] text-center"
              title="Mevcut Önizleme Ölçeği"
            >
              %{Math.round(scale * 100)}
            </span>
            <button
              type="button"
              onClick={handleZoomIn}
              title="Yakınlaştır (%10)"
              className="p-1 rounded hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>

            <div className="h-3 w-[1px] bg-slate-200 mx-0.5" />

            <button
              type="button"
              onClick={handleZoomFit}
              title="Pencereye Tam Sığdır"
              className={`px-1.5 py-0.5 rounded text-[9.5px] font-bold transition-all cursor-pointer ${
                zoomMode === 'fit' ? 'bg-indigo-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sığdır
            </button>
            <button
              type="button"
              onClick={handleZoom100}
              title="1:1 Gerçek Baskı Boyutu"
              className={`px-1.5 py-0.5 rounded text-[9.5px] font-bold transition-all cursor-pointer ${
                zoomMode === '100%' ? 'bg-indigo-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              1:1
            </button>
          </div>

          {/* Expand/Collapse View Mode Toggle */}
          {onToggleExpandView && (
            <button
              type="button"
              onClick={onToggleExpandView}
              title={isExpandedView ? "Standart Dengeli Bölünmeye Dön (50/50)" : "Önizleme Alanını Genişlet (Büyük A4 Stüdyo)"}
              className={`px-2 py-1 rounded-lg text-[10.5px] font-bold border transition-all cursor-pointer flex items-center gap-1 ${
                isExpandedView
                  ? 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {isExpandedView ? <Shrink className="w-3 h-3 text-indigo-600" /> : <Expand className="w-3 h-3 text-indigo-600" />}
              <span>{isExpandedView ? 'Dengeli' : 'Genişlet'}</span>
            </button>
          )}

          {onAutoFit && (
            <button
              type="button"
              onClick={onAutoFit}
              title="A4 Sayfasına Otomatik Sığdır (Görsel ve metin dengelenir)"
              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[10.5px] font-bold shadow-xs flex items-center gap-1 transition-all cursor-pointer"
            >
              <Sparkles className="w-3 h-3" />
              <span>Otomatik Sığdır</span>
            </button>
          )}

          {onCycleLayout && (
            <button
              type="button"
              onClick={onCycleLayout}
              title="Tasarım Şablonunu Değiştir"
              className="px-2 py-1 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-[10.5px] font-medium shadow-2xs flex items-center gap-1 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Düzen</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={isExportingPdf}
            title="Birebir Aynı A4 PDF İndir (300 DPI)"
            className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[10.5px] font-bold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>{isExportingPdf ? 'İndiriliyor...' : 'PDF İndir'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (onOpenFullscreen) {
                onOpenFullscreen();
              } else {
                setInternalFullscreen(true);
              }
            }}
            title="Tam Ekran İncele"
            className="p-1 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 shadow-2xs transition-colors cursor-pointer"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Exporting Progress Toast */}
      {isExportingPdf && (
        <div className="w-full mb-2 p-2 bg-indigo-50 border border-indigo-200 rounded-xl flex items-center gap-2 text-xs font-semibold text-indigo-800 animate-pulse">
          <div className="w-3 h-3 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <span>{exportProgressText || 'A4 PDF Derleniyor, lütfen bekleyin...'}</span>
        </div>
      )}

      {/* ── Fixed A4 Viewport Container with CSS Scale ── */}
      <div
        ref={containerRef}
        className="w-full flex justify-center items-start overflow-auto rounded-2xl bg-slate-200/70 p-3 sm:p-4 shadow-inner border border-slate-300/60"
        style={{
          minHeight: `${Math.ceil(1123 * scale + 36)}px`,
          maxHeight: zoomMode === 'custom' && scale > 1 ? 'calc(100vh - 120px)' : undefined
        }}
      >
        <div
          className="transform-gpu origin-top transition-transform duration-150 ease-out shadow-xl rounded-sm shrink-0"
          style={{
            transform: `scale(${scale})`,
            width: '794px',
            height: '1123px',
            marginBottom: scale > 1 ? `${Math.round(1123 * (scale - 1))}px` : undefined,
            marginRight: scale > 1 ? `${Math.round(794 * (scale - 1) / 2)}px` : undefined,
            marginLeft: scale > 1 ? `${Math.round(794 * (scale - 1) / 2)}px` : undefined
          }}
        >
          <A4PageRenderer
            id="active-preview-page"
            title={title}
            subtitle={subtitle}
            content={content}
            pullQuote={pullQuote}
            pullQuoteStyle={pullQuoteStyle}
            sourceReference={sourceReference}
            category={category}
            author={author}
            authorRole={authorRole}
            photos={photos}
            year={year}
            month={month}
            issueNumber={issueNumber}
            layoutStyle={layoutStyle}
            imagePosition={imagePosition}
            imageFit={imageFit}
            imageScale={imageScale}
            pullQuoteSize={pullQuoteSize}
            showGuides={showGuides}
            fontFamily={fontFamily}
            fontSize={fontSize}
            lineHeight={lineHeight}
            letterSpacing={letterSpacing}
            titleColor={titleColor}
            textAlign={textAlign}
            fullPageCanvasImage={fullPageCanvasImage}
            isFullPageCanvas={isFullPageCanvas}
            fullPageMode={fullPageMode}
          />
        </div>
      </div>

      {/* Bottom Dimension Indicator */}
      <div className="w-full mt-1.5 px-2 flex items-center justify-between text-[10px] text-slate-500 font-medium">
        <span>A4 Baskı Standardı: 210mm × 297mm (794 × 1123 px • Retina 300 DPI)</span>
        <span className="font-mono bg-slate-200/80 px-2 py-0.5 rounded text-slate-700 font-bold">
          Ölçek: %{Math.round(scale * 100)} {zoomMode === 'fit' ? '(Pencereye Uyumlu)' : zoomMode === '100%' ? '(1:1 Gerçek)' : '(Özel)'}
        </span>
      </div>

      {/* ── Standalone Fullscreen Modal Overlay ── */}
      {internalFullscreen && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex flex-col select-none overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className="h-14 shrink-0 px-4 sm:px-6 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between gap-3 text-white">
            <div className="flex items-center gap-2 min-w-0">
              <span className="font-editorial text-base font-bold text-white tracking-wide">MAİDER</span>
              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded bg-indigo-600 text-white truncate">
                {category}
              </span>
              <span className="hidden md:inline text-xs text-slate-400 truncate max-w-[200px]">
                {title || 'Yeni Sayfa'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="bg-slate-800/90 rounded-xl p-0.5 border border-slate-700/80 flex items-center">
                <button
                  type="button"
                  onClick={() => setFsZoomMode('fit')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    fsZoomMode === 'fit' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Ekrana Sığdır (%{Math.round(fsScale * 100)})
                </button>
                <button
                  type="button"
                  onClick={() => setFsZoomMode('100%')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    fsZoomMode === '100%' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  1:1 Gerçek Boyut
                </button>
              </div>

              <button
                type="button"
                onClick={() => setShowGuides(prev => !prev)}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
                  showGuides ? 'bg-sky-500/20 text-sky-300 border-sky-400/50' : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Kılavuzlar</span>
              </button>

              {onAutoFit && (
                <button
                  type="button"
                  onClick={onAutoFit}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Otomatik Sığdır</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleDownloadPdf}
                disabled={isExportingPdf}
                className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
              >
                <FileDown className="w-4 h-4" />
                <span>{isExportingPdf ? 'İndiriliyor...' : 'PDF İndir'}</span>
              </button>

              <button
                type="button"
                onClick={() => setInternalFullscreen(false)}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition-colors cursor-pointer"
                title="Kapat (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Canvas */}
          <div
            className={`flex-1 w-full flex justify-center items-center ${
              fsZoomMode === '100%' ? 'overflow-auto p-8' : 'overflow-hidden p-2 sm:p-4'
            }`}
          >
            <div
              className="transition-transform duration-150 origin-center shadow-2xl rounded-sm shrink-0"
              style={{
                transform: fsZoomMode === 'fit' ? `scale(${fsScale})` : 'scale(1)',
                width: '794px',
                height: '1123px'
              }}
            >
              <A4PageRenderer
                id="internal-fullscreen-page"
                title={title}
                subtitle={subtitle}
                content={content}
                pullQuote={pullQuote}
                pullQuoteStyle={pullQuoteStyle}
                sourceReference={sourceReference}
                category={category}
                author={author}
                authorRole={authorRole}
                photos={photos}
                year={year}
                month={month}
                issueNumber={issueNumber}
                layoutStyle={layoutStyle}
                imagePosition={imagePosition}
                imageFit={imageFit}
                imageScale={imageScale}
                pullQuoteSize={pullQuoteSize}
                showGuides={showGuides}
                fontFamily={fontFamily}
                fontSize={fontSize}
                lineHeight={lineHeight}
                letterSpacing={letterSpacing}
                titleColor={titleColor}
                textAlign={textAlign}
                fullPageCanvasImage={fullPageCanvasImage}
                isFullPageCanvas={isFullPageCanvas}
                fullPageMode={fullPageMode}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
