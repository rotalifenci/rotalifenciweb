import React, { useState, useRef } from 'react';
import { MagazineIssue, MagazinePage, MagazinePhoto, MagazineCategory } from '../../types/magazine';
import { CATEGORY_THEMES } from '../../config/brand';
import {
  generateAiArticleContent,
  generateAiImageContent,
  POPULAR_TOPIC_PROMPTS,
  POPULAR_IMAGE_PROMPTS
} from '../../services/aiGeneratorService';
import { exportPageToPng } from '../../services/pdfExporter';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Wand2,
  Image as ImageIcon,
  Type,
  Layout,
  FileDown,
  Share2,
  Upload,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Columns,
  Square,
  CheckCircle2,
  RefreshCw,
  Sliders,
  MoveHorizontal,
  Info,
  Calendar
} from 'lucide-react';

interface Props {
  issue: MagazineIssue;
  activePageIndex: number;
  onChangePage: (index: number) => void;
  onUpdatePage: (updatedPage: MagazinePage) => void;
  onUpdateIssue?: (updatedData: Partial<MagazineIssue>) => void;
  onAddNewPage: () => void;
  onDeletePage: (index: number) => void;
  onExportPptx: () => void;
  onExportPdf?: () => void;
  isExportingPptx?: boolean;
}

const MONTHS_LIST = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
];

export const AiStudio: React.FC<Props> = ({
  issue,
  activePageIndex,
  onChangePage,
  onUpdatePage,
  onUpdateIssue,
  onAddNewPage,
  onDeletePage,
  onExportPptx,
  onExportPdf,
  isExportingPptx = false
}) => {
  const currentPage = issue.pages[activePageIndex] || issue.pages[0];
  const totalPages = issue.pages.length;
  const pageRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1. Publication Info State (Dergi Yayın Bilgileri: Ay, Yıl, Sayı No)
  const [selectedMonth, setSelectedMonth] = useState<string>(issue.month || 'Ekim');
  const [selectedYear, setSelectedYear] = useState<number>(issue.year || 2026);
  const [selectedIssueNumber, setSelectedIssueNumber] = useState<number>(issue.issueNumber || 1);

  // Sync if issue prop updates externally
  React.useEffect(() => {
    if (issue.month) setSelectedMonth(issue.month);
    if (issue.year) setSelectedYear(issue.year);
    if (issue.issueNumber) setSelectedIssueNumber(issue.issueNumber);
  }, [issue.month, issue.year, issue.issueNumber]);

  const handleMonthChange = (newMonth: string) => {
    setSelectedMonth(newMonth);
    const mIdx = MONTHS_LIST.indexOf(newMonth);
    onUpdateIssue?.({
      month: newMonth,
      monthIndex: mIdx !== -1 ? mIdx : issue.monthIndex
    });
  };

  const handleYearChange = (newYear: number) => {
    setSelectedYear(newYear);
    onUpdateIssue?.({ year: newYear });
  };

  const handleIssueNumberChange = (newNum: number) => {
    setSelectedIssueNumber(newNum);
    onUpdateIssue?.({ issueNumber: newNum });
  };

  // Mobile active panel toggle ('controls' or 'canvas')
  const [mobileTab, setMobileTab] = useState<'controls' | 'canvas'>('canvas');

  // AI Generation States
  const [topicInput, setTopicInput] = useState('');
  const [isGeneratingArticle, setIsGeneratingArticle] = useState(false);
  const [aiArticleStep, setAiArticleStep] = useState('');

  const [imagePromptInput, setImagePromptInput] = useState('');
  const [imageStyle, setImageStyle] = useState('Gerçekçi Okul Çekimi');
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [aiImageStep, setAiImageStep] = useState('');

  // Manual Editor State
  const [manualTextTab, setManualTextTab] = useState<'ai' | 'manual'>('ai');

  // Zoom & Layout Controls
  const [zoomScale, setZoomScale] = useState(1);
  const [columnCount, setColumnCount] = useState<1 | 2>(2);
  const [imagePosition, setImagePosition] = useState<'right' | 'left' | 'top'>('right');

  // Export state
  const [isDownloadingPng, setIsDownloadingPng] = useState(false);

  const currentTheme = CATEGORY_THEMES[currentPage.category] || CATEGORY_THEMES['Okulumuzdan'];

  // Handle Magic Write (AI Article Generation)
  const handleGenerateArticle = async (selectedTopic?: string) => {
    const topicToUse = selectedTopic || topicInput.trim();
    if (!topicToUse) {
      alert('Lütfen içerik üretmek istediğiniz konuyu yazın veya aşağıdaki hazır konulardan birini seçin.');
      return;
    }

    try {
      setIsGeneratingArticle(true);
      setAiArticleStep('🧠 Konu analiz ediliyor...');

      const timer1 = setTimeout(() => setAiArticleStep('✍️ Başlık ve spot cümle kurgulanıyor...'), 400);
      const timer2 = setTimeout(() => setAiArticleStep('📐 A4 dergi mizanpajına dökülüyor...'), 900);

      const result = await generateAiArticleContent(topicToUse);

      clearTimeout(timer1);
      clearTimeout(timer2);

      // Create new photo if suggested
      const newPhotos: MagazinePhoto[] = currentPage.photos.length > 0
        ? currentPage.photos
        : [{
            id: `photo-${Date.now()}`,
            url: result.suggestedPhotoUrl,
            caption: result.title,
            isMain: true,
            width: 1200,
            height: 800,
            focalPoint: { x: 50, y: 50 }
          }];

      const updated: MagazinePage = {
        ...currentPage,
        title: result.title,
        subtitle: result.subtitle,
        pullQuote: result.pullQuote,
        content: result.content,
        category: result.category,
        author: result.author,
        authorRole: result.authorRole,
        photos: newPhotos,
        layoutVariant: 'A'
      };

      onUpdatePage(updated);
      setMobileTab('canvas');

      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (err) {
      console.error(err);
      alert('Yapay zeka içeriği üretilirken bir hata oluştu.');
    } finally {
      setIsGeneratingArticle(false);
      setAiArticleStep('');
    }
  };

  // Handle Magic Image (AI Photo Generation)
  const handleGenerateImage = async (selectedPrompt?: string) => {
    const promptToUse = selectedPrompt || imagePromptInput.trim();
    if (!promptToUse) {
      alert('Lütfen üretmek istediğiniz görsel için bir tanım yazın veya aşağıdaki hazır önerilerden birini seçin.');
      return;
    }

    try {
      setIsGeneratingImage(true);
      setAiImageStep('🎨 Görsel kompozisyonu hesaplanıyor...');

      const timer1 = setTimeout(() => setAiImageStep('✨ Renk paleti ve aydınlatma sentezleniyor...'), 500);
      const timer2 = setTimeout(() => setAiImageStep('📐 A4 sayfasına yerleştiriliyor...'), 1100);

      const result = await generateAiImageContent(promptToUse, imageStyle);

      clearTimeout(timer1);
      clearTimeout(timer2);

      const updatedPhotos = [result.photo, ...currentPage.photos.filter(p => !p.isMain)];
      onUpdatePage({
        ...currentPage,
        photos: updatedPhotos
      });

      setMobileTab('canvas');

      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.7 }
      });
    } catch (err) {
      console.error(err);
      alert('Görsel üretilirken bir hata oluştu.');
    } finally {
      setIsGeneratingImage(false);
      setAiImageStep('');
    }
  };

  // Manual Photo Upload
  const handleManualPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const url = event.target?.result as string;
      const newPhoto: MagazinePhoto = {
        id: `upload-${Date.now()}`,
        url,
        caption: file.name.replace(/\.[^/.]+$/, ''),
        isMain: currentPage.photos.length === 0,
        focalPoint: { x: 50, y: 50 }
      };

      onUpdatePage({
        ...currentPage,
        photos: [...currentPage.photos, newPhoto]
      });
    };
    reader.readAsDataURL(file);
  };

  // Magic Layout Cycle
  const handleCycleLayout = () => {
    // Cycle between positions & column variants
    if (imagePosition === 'right' && columnCount === 2) {
      setImagePosition('left');
      setColumnCount(2);
    } else if (imagePosition === 'left') {
      setImagePosition('top');
      setColumnCount(1);
    } else {
      setImagePosition('right');
      setColumnCount(2);
    }

    // Toggle variant code
    const nextVariant: 'A' | 'B' | 'C' = currentPage.layoutVariant === 'A' ? 'B' : currentPage.layoutVariant === 'B' ? 'C' : 'A';
    onUpdatePage({
      ...currentPage,
      layoutVariant: nextVariant
    });
  };

  // Live Inline Edit Updates
  const handleUpdateField = (field: keyof MagazinePage, value: string) => {
    onUpdatePage({
      ...currentPage,
      [field]: value
    });
  };

  const handleUpdateCaption = (photoId: string, caption: string) => {
    const updated = currentPage.photos.map(p => (p.id === photoId ? { ...p, caption } : p));
    onUpdatePage({
      ...currentPage,
      photos: updated
    });
  };

  const handleRemovePhoto = (photoId: string) => {
    const filtered = currentPage.photos.filter(p => p.id !== photoId);
    onUpdatePage({
      ...currentPage,
      photos: filtered
    });
  };

  // Export single page PNG
  const handleDownloadPng = async () => {
    if (!pageRef.current) return;
    try {
      setIsDownloadingPng(true);
      await exportPageToPng(pageRef.current, `maider-sayfa-${currentPage.pageNumber || activePageIndex + 1}.png`);
    } catch (err) {
      console.error(err);
      alert('PNG dışa aktarılırken bir hata oluştu.');
    } finally {
      setIsDownloadingPng(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] overflow-hidden select-none bg-slate-900 text-slate-800">
      {/* Mobile Top Toggle (Visible only on < lg screens) */}
      <div className="lg:hidden flex items-center justify-between bg-slate-800 border-b border-slate-700 p-2 text-white">
        <button
          type="button"
          onClick={() => setMobileTab('controls')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
            mobileTab === 'controls' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Yapay Zekâ Paneli</span>
        </button>
        <button
          type="button"
          onClick={() => setMobileTab('canvas')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
            mobileTab === 'canvas' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Layout className="w-3.5 h-3.5" />
          <span>A4 Dergi Önizleme</span>
        </button>
      </div>

      {/* Main Split Screen Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* ============================================================ */}
        {/* SOL PANEL: Yapay Zekâ Üretim ve Kontrol Paneli (%30 Genişlik) */}
        {/* ============================================================ */}
        <aside
          className={`w-full lg:w-[32%] xl:w-[30%] min-w-[320px] max-w-[440px] bg-white border-r border-slate-200 flex flex-col justify-between overflow-y-auto z-20 shadow-xl ${
            mobileTab === 'canvas' ? 'hidden lg:flex' : 'flex'
          }`}
        >
          <div className="p-4 sm:p-5 space-y-5">
            {/* Header Badge */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-sky-500 flex items-center justify-center text-white shadow-xs">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                </div>
                <div>
                  <h2 className="text-sm font-black text-slate-900 leading-tight">Yapay Zekâ Stüdyosu</h2>
                  <p className="text-[10px] text-slate-500 font-medium">MAİDER Otomatik Dergi Üretici</p>
                </div>
              </div>
              <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                Sayfa {activePageIndex + 1} / {totalPages}
              </span>
            </div>

            {/* DERGİ YAYIN BİLGİLERİ AYARLAMA FORMU (KONTROL PANELİNİN EN ÜSTÜ) */}
            <div className="bg-slate-50/90 p-3.5 rounded-2xl border border-slate-200 shadow-2xs space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-sky-600" />
                  <span>Dergi Yayın Bilgileri</span>
                </span>
                <span className="text-[9px] bg-sky-50 text-sky-700 font-bold px-2 py-0.5 rounded-full border border-sky-200 font-mono">
                  Canlı Yansıma
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {/* 1. Ay Seçimi (<select>) */}
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                    Ay Seçimi
                  </label>
                  <select
                    value={selectedMonth}
                    onChange={(e) => handleMonthChange(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-2 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 shadow-2xs cursor-pointer"
                  >
                    {MONTHS_LIST.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2. Yıl Seçimi (<input type="number">) */}
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                    Yıl Seçimi
                  </label>
                  <input
                    type="number"
                    value={selectedYear}
                    onChange={(e) => handleYearChange(Number(e.target.value))}
                    className="w-full bg-white border border-slate-200 rounded-xl px-2 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 shadow-2xs font-mono"
                  />
                </div>

                {/* 3. Sayı Seçimi (<input type="number">) */}
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                    Sayı No
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={selectedIssueNumber}
                    onChange={(e) => handleIssueNumberChange(Number(e.target.value))}
                    className="w-full bg-white border border-slate-200 rounded-xl px-2 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 shadow-2xs font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Mode Switcher: Yapay Zekâ vs Manuel */}
            <div className="grid grid-cols-2 gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
              <button
                type="button"
                onClick={() => setManualTextTab('ai')}
                className={`py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  manualTextTab === 'ai' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Yapay Zekâ (AI)</span>
              </button>
              <button
                type="button"
                onClick={() => setManualTextTab('manual')}
                className={`py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  manualTextTab === 'manual' ? 'bg-white text-sky-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Type className="w-3.5 h-3.5" />
                <span>Manuel Ekle</span>
              </button>
            </div>

            {manualTextTab === 'ai' ? (
              <div className="space-y-5">
                {/* 1. MAGIC WRITE: Yapay Zeka ile İçerik Üretimi */}
                <div className="bg-gradient-to-br from-indigo-50/70 via-sky-50/40 to-white p-4 rounded-2xl border border-indigo-100 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-extrabold uppercase tracking-wider text-indigo-900 flex items-center gap-1.5">
                      <Wand2 className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Yapay Zekâ ile Yazı Üret (Magic Write)</span>
                    </label>
                  </div>

                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Sadece konuyu yazın; başlık, spot cümle ve 2-3 paragraflık dergi makalesi A4 sayfasına otomatik yerleşsin.
                  </p>

                  <div className="space-y-2">
                    <input
                      type="text"
                      value={topicInput}
                      onChange={(e) => setTopicInput(e.target.value)}
                      placeholder="Örn: Okulumuzun TÜBİTAK Bilim Fuarı..."
                      className="w-full bg-white border border-indigo-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleGenerateArticle();
                      }}
                    />

                    {/* Popular Topic Chips */}
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight block mb-1.5">
                        Hızlı Konu Önerileri:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {POPULAR_TOPIC_PROMPTS.slice(0, 5).map((item, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              setTopicInput(item.topic);
                              handleGenerateArticle(item.topic);
                            }}
                            className="text-[10px] bg-white hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 hover:border-indigo-300 px-2 py-1 rounded-lg transition-colors text-left"
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Generate Button */}
                    <button
                      type="button"
                      onClick={() => handleGenerateArticle()}
                      disabled={isGeneratingArticle}
                      className="w-full bg-gradient-to-r from-indigo-600 via-sky-600 to-indigo-700 hover:from-indigo-500 hover:to-sky-500 text-white font-extrabold text-xs py-2.5 px-4 rounded-xl shadow-md flex items-center justify-center gap-2 transition-all transform active:scale-95 disabled:opacity-50"
                    >
                      {isGeneratingArticle ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin text-amber-300" />
                          <span>{aiArticleStep || 'Yazı Üretiliyor...'}</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 text-amber-300" />
                          <span>Yapay Zekâ ile Yazı Üret ✨</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* 2. MAGIC IMAGE: Yapay Zeka ile Görsel Üretimi */}
                <div className="bg-gradient-to-br from-amber-50/50 via-orange-50/30 to-white p-4 rounded-2xl border border-amber-200 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-extrabold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-amber-600" />
                      <span>Yapay Zekâ ile Görsel Üret (Magic Image)</span>
                    </label>
                  </div>

                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    İstediğiniz sahneyi tarif edin; sistem yüksek kaliteli bir görseli sayfaya otomatik çerçeveyle eklesin.
                  </p>

                  <div className="space-y-2">
                    <input
                      type="text"
                      value={imagePromptInput}
                      onChange={(e) => setImagePromptInput(e.target.value)}
                      placeholder="Örn: Uzay kampında deney yapan öğrenciler..."
                      className="w-full bg-white border border-amber-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-2xs"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleGenerateImage();
                      }}
                    />

                    {/* Style selector */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Stil:</span>
                      <select
                        value={imageStyle}
                        onChange={(e) => setImageStyle(e.target.value)}
                        className="bg-white border border-slate-200 rounded-lg text-[11px] px-2 py-1 text-slate-700 focus:outline-none"
                      >
                        <option value="Gerçekçi Okul Çekimi">Gerçekçi Okul Çekimi</option>
                        <option value="3D STEM İllüstrasyon">3D STEM İllüstrasyon</option>
                        <option value="Sanatsal Pastel">Sanatsal Pastel</option>
                        <option value="Dijital Bilim Çizimi">Dijital Bilim Çizimi</option>
                      </select>
                    </div>

                    {/* Popular Image Chips */}
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight block mb-1.5">
                        Hazır Görsel Fikirleri:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {POPULAR_IMAGE_PROMPTS.slice(0, 4).map((item, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              setImagePromptInput(item.prompt);
                              handleGenerateImage(item.prompt);
                            }}
                            className="text-[10px] bg-white hover:bg-amber-50 text-slate-700 hover:text-amber-800 border border-slate-200 hover:border-amber-300 px-2 py-1 rounded-lg transition-colors text-left"
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Generate Button */}
                    <button
                      type="button"
                      onClick={() => handleGenerateImage()}
                      disabled={isGeneratingImage}
                      className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold text-xs py-2.5 px-4 rounded-xl shadow-md flex items-center justify-center gap-2 transition-all transform active:scale-95 disabled:opacity-50"
                    >
                      {isGeneratingImage ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin text-white" />
                          <span>{aiImageStep || 'Görsel Hazırlanıyor...'}</span>
                        </>
                      ) : (
                        <>
                          <ImageIcon className="w-4 h-4 text-white" />
                          <span>Yapay Zekâ ile Görsel Üret 🎨</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Manuel Metin & Fotoğraf Yükleme */
              <div className="space-y-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Sayfa Başlığı
                  </label>
                  <input
                    type="text"
                    value={currentPage.title || ''}
                    onChange={(e) => handleUpdateField('title', e.target.value)}
                    placeholder="Başlık girin..."
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Spot Cümle (Özet)
                  </label>
                  <textarea
                    rows={2}
                    value={currentPage.pullQuote || ''}
                    onChange={(e) => handleUpdateField('pullQuote', e.target.value)}
                    placeholder="Vurgulu spot alıntı veya özet..."
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Makale Metni
                  </label>
                  <textarea
                    rows={6}
                    value={currentPage.content || ''}
                    onChange={(e) => handleUpdateField('content', e.target.value)}
                    placeholder="Paragraflarınızı buraya yazın..."
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-sky-500 leading-relaxed font-serif"
                  />
                </div>

                {/* Fotoğraf Yükleme */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Bilgisayardan Görsel Yükle
                  </label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-300 hover:border-sky-500 rounded-xl p-4 text-center bg-white cursor-pointer transition-colors"
                  >
                    <Upload className="w-5 h-5 mx-auto text-slate-400 mb-1" />
                    <span className="text-xs font-semibold text-slate-700 block">Dosya Seçin veya Sürükleyin</span>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleManualPhotoUpload}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 3. MAGIC LAYOUT: Tasarımı Yenile */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Layout className="w-3.5 h-3.5 text-sky-600" />
                  <span>Akıllı Mizanpaj (Magic Layout)</span>
                </span>
                <span className="text-[10px] font-mono bg-sky-100 text-sky-700 px-2 py-0.5 rounded-full font-bold">
                  {currentPage.layoutVariant} Modu
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleCycleLayout}
                  className="bg-white hover:bg-sky-50 text-sky-700 border border-slate-200 hover:border-sky-300 font-bold text-xs py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                  title="Mizanpajı Otomatik Olarak Değiştir"
                >
                  <Wand2 className="w-3.5 h-3.5 text-sky-600" />
                  <span>Tasarımı Yenile 🪄</span>
                </button>

                <button
                  type="button"
                  onClick={() => setColumnCount(columnCount === 1 ? 2 : 1)}
                  className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold text-xs py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                >
                  {columnCount === 1 ? <Square className="w-3.5 h-3.5" /> : <Columns className="w-3.5 h-3.5" />}
                  <span>{columnCount === 1 ? 'Tek Sütun' : 'Çift Sütun'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Dışa Aktarma Butonları (Panelin En Altında Sabit) */}
          <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-2 shrink-0">
            <button
              type="button"
              onClick={handleDownloadPng}
              disabled={isDownloadingPng}
              className="w-full bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold text-xs py-2.5 px-4 rounded-xl shadow-2xs flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              <FileDown className="w-4 h-4 text-rose-500" />
              <span>{isDownloadingPng ? 'Sayfa İndiriliyor...' : 'A4 Sayfayı PNG Olarak İndir'}</span>
            </button>

            {onExportPdf && (
              <button
                type="button"
                onClick={onExportPdf}
                className="w-full bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                <FileDown className="w-4 h-4 text-rose-600" />
                <span>Tüm Dergiyi A4 PDF İndir</span>
              </button>
            )}

            <button
              type="button"
              onClick={onExportPptx}
              disabled={isExportingPptx}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold text-xs py-2.5 px-4 rounded-xl shadow-md flex items-center justify-center gap-2 transition-all transform active:scale-95 disabled:opacity-50"
            >
              <Share2 className="w-4 h-4 fill-current" />
              <span>{isExportingPptx ? 'Canva Hazırlanıyor...' : "Canva için PPTX İndir 🚀"}</span>
            </button>
          </div>
        </aside>

        {/* ============================================================ */}
        {/* SAĞ PANEL: A4 Dergi Çalışma Alanı (%70 Genişlik, Koyu Tuval) */}
        {/* ============================================================ */}
        <section
          className={`flex-1 bg-[#18191c] flex flex-col justify-between overflow-hidden relative ${
            mobileTab === 'controls' ? 'hidden lg:flex' : 'flex'
          }`}
        >
          {/* Top Canvas Bar */}
          <div className="w-full bg-[#202226] border-b border-slate-800 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-white z-10">
            {/* Page Navigation */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onChangePage(Math.max(0, activePageIndex - 1))}
                disabled={activePageIndex === 0}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 transition-colors"
                title="Önceki Sayfa"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="text-xs font-mono font-bold px-2">
                Sayfa <span className="text-sky-400">{activePageIndex + 1}</span> / {totalPages}
              </span>

              <button
                type="button"
                onClick={() => onChangePage(Math.min(totalPages - 1, activePageIndex + 1))}
                disabled={activePageIndex === totalPages - 1}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 transition-colors"
                title="Sonraki Sayfa"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onAddNewPage}
                className="ml-2 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-400 hover:text-sky-300 text-xs font-semibold flex items-center gap-1 border border-slate-700"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Yeni Sayfa</span>
              </button>
            </div>

            {/* Live Edit Notice Badge */}
            <div className="hidden md:flex items-center gap-1.5 bg-indigo-950/70 text-indigo-200 border border-indigo-700/50 px-3 py-1 rounded-full text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span>Canlı Düzenleme Aktif: Metinlerin üzerine tıklayarak doğrudan yazabilirsiniz.</span>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-lg border border-slate-700">
              <button
                type="button"
                onClick={() => setZoomScale(Math.max(0.6, zoomScale - 0.1))}
                className="p-1 hover:bg-slate-700 rounded text-slate-300"
                title="Küçült"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] font-mono px-1.5 text-slate-300">
                {Math.round(zoomScale * 100)}%
              </span>
              <button
                type="button"
                onClick={() => setZoomScale(Math.min(1.4, zoomScale + 0.1))}
                className="p-1 hover:bg-slate-700 rounded text-slate-300"
                title="Büyüt"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setZoomScale(1)}
                className="px-1.5 py-0.5 hover:bg-slate-700 rounded text-[10px] text-slate-400"
                title="Sıfırla (%100)"
              >
                100%
              </button>
            </div>
          </div>

          {/* Center Stage: The Pure A4 Canvas */}
          <div className="flex-1 overflow-y-auto flex items-center justify-center p-4 sm:p-8 bg-[#141517]">
            <div
              style={{
                transform: `scale(${zoomScale})`,
                transformOrigin: 'top center',
                transition: 'transform 0.15s ease-out'
              }}
              className="w-full max-w-[660px] my-auto"
            >
              {/* THE REAL A4 PAGE (210 x 297 mm, 1:1.414 aspect ratio) */}
              <div
                ref={pageRef}
                className="print-page a4-page-renderer bg-[#FDFBF7] text-slate-900 shadow-[0_25px_60px_rgba(0,0,0,0.6)] rounded-sm border border-slate-300 select-text"
                style={{
                  width: '210mm',
                  height: '297mm',
                  boxSizing: 'border-box',
                  paddingTop: '16mm',
                  paddingBottom: '20mm',
                  paddingLeft: '18mm',
                  paddingRight: '18mm',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* 1. Running Header with Dynamic Künye Şeridi */}
                <div className="pb-2.5 border-b border-gray-300/80 mb-3 shrink-0 flex items-center justify-between text-xs text-gray-500 font-medium tracking-wide">
                  <span className="font-semibold text-gray-700">
                    MAİDER Dijital Dergisi | Yıl: {selectedYear} • Ay: {selectedMonth} • Sayı: {selectedIssueNumber}
                  </span>
                  <div className="flex items-center gap-2">
                    <span
                      className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded text-white shadow-2xs"
                      style={{ backgroundColor: currentTheme.color }}
                    >
                      {currentPage.category}
                    </span>
                    <span className="text-[10px] font-bold text-gray-400 font-mono">
                      #{currentPage.pageNumber || activePageIndex + 1}
                    </span>
                  </div>
                </div>

                {/* 2. Page Content Core */}
                <div style={{ height: 'calc(100% - 40mm)', overflow: 'hidden', display: 'block' }}>
                  {/* Category Accent Line */}
                  <div
                    className="h-1 w-16 rounded-full"
                    style={{ backgroundColor: currentTheme.color }}
                  />

                  {/* Headline (Live Contenteditable) */}
                  <h1
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => handleUpdateField('title', e.currentTarget.innerText)}
                    className="font-editorial text-2xl sm:text-3xl font-black text-slate-900 leading-tight outline-none hover:bg-sky-50/50 focus:bg-white focus:ring-2 focus:ring-sky-500 rounded p-1 transition-all cursor-text"
                    title="Başlığı değiştirmek için tıklayın"
                  >
                    {currentPage.title || 'Etkileyici Bir Başlık Yazın'}
                  </h1>

                  {/* Subtitle / Spot (Live Contenteditable) */}
                  {currentPage.subtitle && (
                    <p
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => handleUpdateField('subtitle', e.currentTarget.innerText)}
                      className="font-sans text-xs sm:text-sm text-slate-600 font-medium leading-snug outline-none hover:bg-sky-50/50 focus:bg-white focus:ring-1 focus:ring-sky-500 rounded p-1 transition-all cursor-text"
                      title="Alt başlığı düzenlemek için tıklayın"
                    >
                      {currentPage.subtitle}
                    </p>
                  )}

                  {/* Pull Quote / Spot Vurgusu (Live Contenteditable) */}
                  {currentPage.pullQuote && (
                    <div
                      className="p-3 my-1 rounded-xl bg-slate-50 border-l-4 italic text-xs sm:text-sm font-editorial text-slate-800 leading-relaxed shadow-2xs"
                      style={{ borderColor: currentTheme.color }}
                    >
                      <span
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => handleUpdateField('pullQuote', e.currentTarget.innerText)}
                        className="outline-none block cursor-text"
                        title="Spot cümleyi düzenlemek için tıklayın"
                      >
                        {currentPage.pullQuote}
                      </span>
                    </div>
                  )}

                  {/* Main Content: Single-column float-based layout */}
                  <div style={{ display: 'block' }}>
                    {/* Float Photos */}
                    {currentPage.photos && currentPage.photos.length > 0 && (
                      currentPage.photos.slice(0, 2).map((photo, pIdx) => (
                        <figure
                          key={photo.id || pIdx}
                          style={{
                            float: imagePosition === 'left' ? 'left' : 'right',
                            width: '45%',
                            maxWidth: '200px',
                            margin: imagePosition === 'left' ? '0 12px 8px 0' : '0 0 8px 12px',
                            clear: imagePosition === 'left' ? 'left' : 'right'
                          }}
                          className="rounded-xl overflow-hidden border border-slate-200 bg-white shadow-sm group relative"
                        >
                          <img
                            src={photo.url}
                            alt={photo.caption || ''}
                            className="w-full h-32 sm:h-36 object-cover"
                          />
                          <figcaption
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) => handleUpdateCaption(photo.id, e.currentTarget.innerText)}
                            className="p-1.5 text-[9px] text-slate-600 font-sans italic bg-slate-50 border-t border-slate-200 outline-none leading-tight"
                            title="Görsel alt yazısını düzenleyin"
                          >
                            {photo.caption || 'Fotoğraf açıklaması'}
                          </figcaption>
                          <button
                            type="button"
                            onClick={() => handleRemovePhoto(photo.id)}
                            className="absolute top-1.5 right-1.5 p-1 rounded-md bg-slate-900/70 hover:bg-rose-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Bu fotoğrafı kaldır"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </figure>
                      ))
                    )}

                    {/* Paragraph Content (Live Contenteditable) */}
                    <div
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => handleUpdateField('content', e.currentTarget.innerText)}
                      className="text-slate-700 text-[11px] sm:text-xs leading-relaxed font-serif outline-none hover:bg-sky-50/40 focus:bg-white focus:ring-1 focus:ring-sky-500 rounded p-1 whitespace-pre-line cursor-text text-justify"
                      title="Metni doğrudan düzenlemek için tıklayın"
                    >
                      {currentPage.content ||
                        'Yapay zeka asistanı ile konu başlığı girerek içeriğinizi otomatik oluşturabilir veya bu alana tıklayarak kendi makalenizi yazabilirsiniz.'}
                    </div>

                    {/* Author Tag */}
                    <div className="mt-4 pt-2 border-t border-slate-200 text-[10px] font-sans font-bold text-slate-500 flex items-center justify-between not-italic" style={{ clear: 'both' }}>
                      <span>Yazar: {currentPage.author || 'MAİDER Editörü'}</span>
                      <span className="font-normal text-slate-400">{currentPage.authorRole || 'Danışman Öğretmen'}</span>
                    </div>
                  </div>
                </div>

                {/* 3. Running Editorial Footer with Künye Şeridi */}
                <div className="border-t border-gray-300/80 flex items-center justify-between text-xs text-gray-500 font-medium tracking-wide" style={{ position: 'absolute', bottom: '20mm', left: '18mm', right: '18mm', height: '15mm', paddingTop: '4px' }}>
                  <div className="flex items-center gap-2">
                    <span
                      className="w-5 h-5 rounded flex items-center justify-center text-white font-mono font-bold text-[10px]"
                      style={{ backgroundColor: currentTheme.color }}
                    >
                      {currentPage.pageNumber || activePageIndex + 1}
                    </span>
                    <span className="font-semibold text-gray-600">
                      MAİDER Dijital Dergisi | Yıl: {selectedYear} • Ay: {selectedMonth} • Sayı: {selectedIssueNumber}
                    </span>
                  </div>
                  <div className="font-mono text-[10px] text-gray-400">
                    210 × 297 mm
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Action Hint */}
          <div className="bg-[#202226] border-t border-slate-800 px-4 py-2 text-center text-slate-400 text-xs font-mono">
            A4 Sayfa Oranı: 210 × 297 mm • Yapay Zekâ Smart Layout Otomasyonu
          </div>
        </section>
      </div>
    </div>
  );
};
