import React, { useState, useRef, useEffect } from 'react';
import {
  ArticleItem,
  MagazinePhoto,
  ContentStatus,
  MagazineIssue
} from '../../types/magazine';
import { getCategoryTheme } from '../../config/brand';
import {
  calculateWordCount,
  extractSuggestedPullQuote
} from '../../services/smartLayout';
import {
  generateAiArticleContent,
  generateAiImageContent,
  shortenArticleContentToFitPage,
  suggestSourceReference,
  searchAndExtractAuthenticSource
} from '../../services/aiGeneratorService';
import { splitContentAtWordCount } from '../../utils/richTextFormatter';
import { processFileForMagazine } from '../../utils/fileUploadHelper';
import {
  TeacherProfile,
  getStoredTeachers,
  saveStoredTeachers
} from '../../config/teachers';
import {
  optimizeTextWithTdk,
  TdkRuleFix
} from '../../services/turkishTdkService';
import {
  getStoredSections
} from '../../services/magazineSectionsService';
import { SectionManagerModal } from './SectionManagerModal';
import {
  LiveMagazinePreviewCard,
  LayoutStyle,
  ImagePosition,
  ImageFit,
  ComponentSize,
  PullQuoteStyle
} from './LiveMagazinePreviewCard';
import { A4PageRenderer } from '../magazine/A4PageRenderer';
import { exportIssueToPdf, runPdfPreflightCheck } from '../../services/pdfExporter';
import {
  calculatePageDensity,
  getSmartLayoutAlternatives,
  calculateAutoFitParameters,
  A4_CONSTANTS
} from '../../services/smartPageEngine';
import {
  Sparkles,
  Wand2,
  Image as ImageIcon,
  CheckCircle2,
  AlertTriangle,
  Eye,
  X,
  Upload,
  Trash2,
  Star,
  RefreshCw,
  Sliders,
  Settings2,
  Plus,
  Scissors,
  Search,
  Bold,
  Italic,
  Palette,
  RotateCcw,
  ShieldCheck,
  FileDown,
  Maximize2
} from 'lucide-react';

interface Props {
  initialArticle?: ArticleItem | null;
  onSaveAndGeneratePages: (article: ArticleItem) => Promise<void>;
  onCancel?: () => void;
  currentIssue?: MagazineIssue;
}

export const ContentForm: React.FC<Props> = ({
  initialArticle,
  onSaveAndGeneratePages,
  onCancel,
  currentIssue
}) => {
  // Step 1: Magazine Sections (30 official + user customized)
  const [sections, setSections] = useState<string[]>(() => getStoredSections());
  const [isSectionManagerOpen, setIsSectionManagerOpen] = useState(false);

  // Topics & Content
  const [title, setTitle] = useState(initialArticle?.title || '');
  const [subtitle, setSubtitle] = useState(initialArticle?.subtitle || '');
  const [content, setContent] = useState(initialArticle?.content || '');
  const [category, setCategory] = useState<string>(
    initialArticle?.category || (sections.length > 0 ? sections[5] || sections[0] : 'BİLİM VE TEKNOLOJİ')
  );

  // Author and Role are strictly optional (empty by default)
  const [author, setAuthor] = useState(initialArticle?.author || '');
  const [authorRole, setAuthorRole] = useState(initialArticle?.authorRole || '');
  const [pullQuote, setPullQuote] = useState(initialArticle?.pullQuote || '');
  const [sourceReference, setSourceReference] = useState(initialArticle?.sourceReference || '');
  const status: ContentStatus = initialArticle?.status || 'Yayına Hazır';

  // Teacher List state with local persistence & user add feature
  const [teachers, setTeachers] = useState<TeacherProfile[]>(() => getStoredTeachers());
  const [isAddTeacherOpen, setIsAddTeacherOpen] = useState(false);
  const [newTeacherName, setNewTeacherName] = useState('');
  const [newTeacherBranch, setNewTeacherBranch] = useState('');

  const handleAddTeacher = () => {
    if (!newTeacherName.trim()) {
      alert('Lütfen eklenecek kişinin adını ve soyadını giriniz.');
      return;
    }
    const created: TeacherProfile = {
      name: newTeacherName.trim(),
      branch: newTeacherBranch.trim() || 'Yazar'
    };
    const updated = [...teachers, created];
    setTeachers(updated);
    saveStoredTeachers(updated);
    setAuthor(created.name);
    setAuthorRole(created.branch);
    setNewTeacherName('');
    setNewTeacherBranch('');
    setIsAddTeacherOpen(false);
  };

  // Step 2: Visuals & Visual Controls
  const [photos, setPhotos] = useState<MagazinePhoto[]>(initialArticle?.photos || []);
  const [isGeneratingAiImage, setIsGeneratingAiImage] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fullPageFileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Full-Page Canvas / PDF Entegrasyon Modu (100% A4 Tuval Fit)
  const [fullPageCanvasImage, setFullPageCanvasImage] = useState<string | null>(null);
  const [isFullPageCanvasMode, setIsFullPageCanvasMode] = useState<boolean>(false);
  const [fullPageMode, setFullPageMode] = useState<'canvas-fit' | 'overlay' | 'full-bleed'>('canvas-fit');

  // Layout & Styling Options (Interactive buttons for testing variations)
  const [layoutStyle, setLayoutStyle] = useState<LayoutStyle>('classic');
  const [imagePosition, setImagePosition] = useState<ImagePosition>('inline-left');
  const [imageFit, setImageFit] = useState<ImageFit>('contain');
  const [imageScale, setImageScale] = useState<number>(100);
  const [pullQuoteSize, setPullQuoteSize] = useState<ComponentSize>('medium');
  const [pullQuoteStyle, setPullQuoteStyle] = useState<PullQuoteStyle>('box');
  const [aiImageOrientation, setAiImageOrientation] = useState<'landscape' | 'portrait'>('landscape');

  // Professional Typography States (PRD 16-28)
  const [fontFamily, setFontFamily] = useState<string>('Merriweather');
  const [fontSize, setFontSize] = useState<number>(13);
  const [lineHeight, setLineHeight] = useState<number>(1.65);
  const [letterSpacing, setLetterSpacing] = useState<number>(0);
  const [titleColor, setTitleColor] = useState<string>('');
  const [textAlign, setTextAlign] = useState<'justify' | 'left' | 'center'>('justify');
  const [aiLengthMode, setAiLengthMode] = useState<'auto' | 'short' | 'medium' | 'detailed'>('auto');

  // Sayfayı Sıfırla / Yeniden Düzenle (Sağdaki A4 tuvalini tamamen temizler)
  const handleResetPage = () => {
    setTitle('');
    setSubtitle('');
    setContent('');
    setPullQuote('');
    setSourceReference('');
    setPhotos([]);
    setAuthor('');
    setAuthorRole('');
    setAiSearchKeywords('');
    setImageScale(100);
    setImagePosition('full-width');
    setImageFit('contain');
    setLayoutStyle('classic');
    setFullPageCanvasImage(null);
    setIsFullPageCanvasMode(false);
    setFullPageMode('canvas-fit');
  };

  // AI Generation State & Variation Cycle & Keywords Box
  const [aiSearchKeywords, setAiSearchKeywords] = useState('');
  const [isGeneratingAiContent, setIsGeneratingAiContent] = useState(false);
  const [isShortening, setIsShortening] = useState(false);
  const [aiStatusMsg, setAiStatusMsg] = useState('');
  const [aiVariationIndex, setAiVariationIndex] = useState(0);

  // TDK Grammar & Turkish Language Optimization State
  const [tdkFixes, setTdkFixes] = useState<TdkRuleFix[]>([]);
  const [tdkBannerVisible, setTdkBannerVisible] = useState(false);
  const [tdkScore, setTdkScore] = useState(100);

  // Live Preview Mode & Drawer State
  const [showMobilePreviewModal, setShowMobilePreviewModal] = useState(false);
  const [fullscreenZoom, setFullscreenZoom] = useState<'fit' | '100%'>('fit');
  const [modalShowGuides, setModalShowGuides] = useState(false);
  const [viewportScale, setViewportScale] = useState(0.85);
  const [isExportingModalPdf, setIsExportingModalPdf] = useState(false);
  const [modalPdfProgress, setModalPdfProgress] = useState('');
  const [isSplitScreen, setIsSplitScreen] = useState(true);
  const [previewLayoutMode, setPreviewLayoutMode] = useState<'standard' | 'expanded'>('expanded');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-calculate exact zero-scroll fit scale whenever the fullscreen modal opens or window resizes
  useEffect(() => {
    if (!showMobilePreviewModal) return;
    const updateFsScale = () => {
      const availW = window.innerWidth - 32;
      const availH = window.innerHeight - 100; // Account for top toolbar and bottom bar
      const scaleW = availW / 794;
      const scaleH = availH / 1123;
      const calculatedScale = Math.min(scaleW, scaleH);
      setViewportScale(Math.max(0.25, Math.min(1.2, calculatedScale)));
    };

    updateFsScale();
    window.addEventListener('resize', updateFsScale);
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowMobilePreviewModal(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => {
      window.removeEventListener('resize', updateFsScale);
      window.removeEventListener('keydown', handleKey);
    };
  }, [showMobilePreviewModal]);

  const handleModalExportPdf = async () => {
    const el = document.getElementById('fullscreen-preview-page') || document.getElementById('active-preview-page');
    if (!el) {
      alert('Dergi sayfası bulunamadı.');
      return;
    }
    setIsExportingModalPdf(true);
    setModalPdfProgress('Kalite kontrolü yapılıyor...');
    try {
      const preflight = await runPdfPreflightCheck(el);
      if (!preflight.isValid && preflight.issues.length > 0) {
        console.warn('PDF Preflight Uyarıları:', preflight.issues);
      }
      const fileName = `MAIDER-${category || 'Dergi'}-${(title || 'Sayfa').slice(0, 20).replace(/\s+/g, '_')}`;
      await exportIssueToPdf([el], fileName, (percent, status) => {
        setModalPdfProgress(`${status} (%${percent})`);
      });
    } catch (err) {
      console.error('PDF Export Error:', err);
      alert('PDF oluşturulurken bir hata oluştu.');
    } finally {
      setIsExportingModalPdf(false);
      setModalPdfProgress('');
    }
  };

  const wordCount = calculateWordCount(content);
  const readingTime = Math.max(1, Math.ceil(wordCount / 180));
  const currentTheme = getCategoryTheme(category);

  // Dynamic capacity calculation for 1 A4 page
  const hasPhoto = photos.length > 0;
  const hasPullQuote = !!pullQuote.trim();
  const maxPageWords = hasPhoto ? (hasPullQuote ? 175 : 210) : (hasPullQuote ? 310 : 370);
  const isOverflowingPage = wordCount > maxPageWords;

  // Split text for live highlighting of overflow in the content area
  const { fitting: fittingContentText, overflow: overflowContentText } =
    splitContentAtWordCount(content.trim(), maxPageWords);

  const [isSearchingSource, setIsSearchingSource] = useState(false);
  const [pullQuoteFeedback, setPullQuoteFeedback] = useState<string | null>(null);

  const issueYear = currentIssue?.year || 2026;
  const issueMonth = currentIssue?.month || 'Eylül';
  const issueNum = currentIssue?.issueNumber || 9;

  // 1. AI Content Generator Action (Using Keywords Box + Title + Variation Cycling)
  const handleGenerateAiArticle = async (isNextVariation: boolean = false) => {
    const topicToUse = aiSearchKeywords.trim() || title.trim() || 'Ortaokul Öğrencileri İçin Yenilikçi Bilim ve Teknoloji Projeleri';
    const nextIdx = isNextVariation ? aiVariationIndex + 1 : 0;
    setAiVariationIndex(nextIdx);

    setIsGeneratingAiContent(true);
    setAiStatusMsg(
      isNextVariation
        ? `Yapay zekâ farklı bir açıdan içerik üretiyor (Varyasyon ${nextIdx + 1})...`
        : `Yapay zekâ "${topicToUse}" konusunu araştırıyor ve pedagojik dergi metni hazırlıyor...`
    );

    try {
      const result = await generateAiArticleContent(topicToUse, nextIdx);
      if (!title || aiSearchKeywords.trim()) {
        setTitle(result.title);
      }
      setSubtitle(result.subtitle);
      setContent(result.content);
      setPullQuote(result.pullQuote);
      setCategory(result.category);
      if (result.sourceReference) {
        setSourceReference(result.sourceReference);
      }
      if (!author && result.author) {
        setAuthor(result.author);
        setAuthorRole(result.authorRole);
      }

      // If no photo uploaded yet, attach the curated suggested photo
      if (photos.length === 0 && result.suggestedPhotoUrl) {
        setPhotos([
          {
            id: `ai-curated-${Date.now()}`,
            url: result.suggestedPhotoUrl,
            caption: `${result.title} konulu dergi görseli`,
            isMain: true,
            width: 1200,
            height: 800,
            isLowRes: false,
            focalPoint: { x: 50, y: 50 }
          }
        ]);
      }

      // Automatically check & apply TDK rules
      const tdkResult = optimizeTextWithTdk(result.content);
      if (tdkResult.fixes.length > 0) {
        setTdkFixes(tdkResult.fixes);
        setTdkScore(tdkResult.score);
        setTdkBannerVisible(true);
      }
    } catch (err) {
      console.error('AI Article error:', err);
      alert('Yapay zekâ içeriği üretilirken bir hata oluştu.');
    } finally {
      setIsGeneratingAiContent(false);
      setAiStatusMsg('');
    }
  };

  // 2. Comprehensive A4 Auto-Fit Engine (PRD 7, 42, 45)
  const handleAutoFitPage = async () => {
    // 1. Analyze current density
    const currentDensity = calculatePageDensity({
      title,
      subtitle,
      content,
      photos,
      pullQuote,
      imageScale,
      layoutStyle,
      fontSize
    });

    const autoFit = calculateAutoFitParameters({
      currentDensity: currentDensity.densityPercentage,
      currentImageScale: imageScale,
      wordCount: currentDensity.wordCount,
      recommendedWordCount: currentDensity.recommendedWordCount,
      photoCount: photos.length
    });

    // Apply recommended visual scale & font size
    setImageScale(autoFit.recommendedImageScale);
    setFontSize(autoFit.recommendedFontSize);

    // If text genuinely overflows by more than 20 words, smartly summarize to fit
    if (autoFit.shouldShortenText && content.trim()) {
      setIsShortening(true);
      try {
        const res = await shortenArticleContentToFitPage(content, autoFit.targetWordCount);
        setContent(res.shortenedText);
        alert(`⚡ SAYFAYA OTOMATİK SIĞDIRILDI!\n\n${autoFit.actionMessage}\nSayfa doluluk oranı %94 ideal seviyeye getirildi.`);
      } catch (err) {
        console.error('AutoFit error:', err);
      } finally {
        setIsShortening(false);
      }
    } else {
      alert(`⚡ SAYFAYA OTOMATİK SIĞDIRILDI!\n\n${autoFit.actionMessage}`);
    }
  };

  const handleShortenToFitPage = handleAutoFitPage;

  // 3. AI Image Generator Action (Context-Aware to the written article & orientation)
  const handleGenerateAiImage = async (customPrompt?: string) => {
    // Strictly prioritize the main headline/title or keywords first as requested by the user
    const promptToUse = title.trim() || aiSearchKeywords.trim() || customPrompt || 'Sivas Bilim Eğitim';
    setIsGeneratingAiImage(true);

    try {
      // Pass main title, content, and selected orientation
      const result = await generateAiImageContent(promptToUse, content, aiImageOrientation);
      setPhotos([result.photo]);
      if (aiImageOrientation === 'portrait') {
        setImagePosition('inline-left');
        setImageScale(75);
      } else {
        setImagePosition('full-width');
        setImageScale(100);
      }
      setImageFit('contain');
    } catch (err) {
      console.error('AI Image generation error:', err);
      alert('Görsel oluşturulurken bir hata oluştu.');
    } finally {
      setIsGeneratingAiImage(false);
    }
  };

  // 4. AI Suggest Source Reference Action (With Real Search Simulation)
  const handleSuggestSourceReference = async () => {
    const topic = title.trim() || aiSearchKeywords.trim() || 'Okul Eğitimi';
    setIsSearchingSource(true);
    try {
      const suggested = await searchAndExtractAuthenticSource(topic, content, category);
      setSourceReference(suggested);
    } catch (err) {
      console.error(err);
      setSourceReference(suggestSourceReference(topic, category));
    } finally {
      setIsSearchingSource(false);
    }
  };

  // 4b. Extract Pull-Quote Action (Cycles through best quotes on each click, falls back to title if content is empty)
  const handleExtractPullQuote = () => {
    let sourceText = content.trim();
    if (!sourceText) {
      if (title.trim()) {
        sourceText = `${title.trim()}. ${subtitle.trim() || 'Geçmişin köklü mirası ve bilimin aydınlığı geleceğe ilham veriyor.'}`;
      } else {
        setPullQuoteFeedback('⚠️ Lütfen önce bir başlık veya içerik metni giriniz.');
        setTimeout(() => setPullQuoteFeedback(null), 3500);
        return;
      }
    }

    const suggested = extractSuggestedPullQuote(sourceText, pullQuote);
    if (suggested) {
      setPullQuote(suggested);
      setPullQuoteFeedback(`✨ Vurgu spotu hazırlandı: “${suggested.slice(0, 45)}${suggested.length > 45 ? '...' : ''}”`);
      setTimeout(() => setPullQuoteFeedback(null), 4000);
    } else {
      const fallbackQuote = title.trim()
        ? `“${title.trim()}; geçmişten geleceğe uzanan kadim bir bilgi ve kültür köprüsüdür.”`
        : '“Merak, bilgiye ve büyük başarılara açılan en aydınlık kapıdır.”';
      setPullQuote(fallbackQuote);
      setPullQuoteFeedback('✨ Vurgu cümlesi otomatik oluşturuldu! ✓');
      setTimeout(() => setPullQuoteFeedback(null), 4000);
    }
  };

  // 5. Rich Text Formatting Inserter
  const applyFormatting = (prefix: string, suffix: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const textToInsert = selectedText ? `${prefix}${selectedText}${suffix}` : `${prefix}metin${suffix}`;

    const newContent = content.substring(0, start) + textToInsert + content.substring(end);
    setContent(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + textToInsert.length - suffix.length);
    }, 0);
  };

  // 6. TDK Grammar & Spelling Optimizer Action
  const handleApplyTdkOptimization = () => {
    const titleTdk = optimizeTextWithTdk(title);
    const subtitleTdk = optimizeTextWithTdk(subtitle);
    const contentTdk = optimizeTextWithTdk(content);

    const allFixes = [...titleTdk.fixes, ...subtitleTdk.fixes, ...contentTdk.fixes];

    setTitle(titleTdk.cleanedText);
    setSubtitle(subtitleTdk.cleanedText);
    setContent(contentTdk.cleanedText);

    setTdkFixes(allFixes);
    setTdkScore(contentTdk.score);
    setTdkBannerVisible(true);
  };

  // 4. File Upload (Drag & Drop and Input) - Yüksek Çözünürlüklü Görsel & PDF Desteği
  const processUploadedFiles = async (files: File[]) => {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const isFirst = photos.length === 0 && i === 0;
        const res = await processFileForMagazine(file, isFirst);
        setPhotos(prev => [...prev, res.photo]);
        if (isFirst) {
          setImagePosition(res.recommendedPosition);
          setImageScale(res.recommendedScale);
          setImageFit(res.recommendedFit);
        }
      } catch (err) {
        console.error('Dosya işleme hatası:', err);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processUploadedFiles(Array.from(e.target.files));
    }
  };

  const handleFullPageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      try {
        const res = await processFileForMagazine(file, true);
        setFullPageCanvasImage(res.photo.url);
        setIsFullPageCanvasMode(true);
        setFullPageMode('canvas-fit');
        if (!title.trim() && res.photo.caption) {
          setTitle(res.photo.caption);
        }
      } catch (err) {
        console.error('Tam sayfa dosya yükleme hatası:', err);
        alert('Dosya yüklenirken bir hata oluştu.');
      } finally {
        if (e.target) e.target.value = '';
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processUploadedFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleRemovePhoto = (id: string) => {
    const updated = photos.filter(p => p.id !== id);
    if (updated.length > 0 && !updated.some(p => p.isMain)) {
      updated[0].isMain = true;
    }
    setPhotos(updated);
  };

  const handleSetMainPhoto = (id: string) => {
    setPhotos(photos.map(p => ({ ...p, isMain: p.id === id })));
  };

  const handleUpdateCaption = (id: string, caption: string) => {
    setPhotos(photos.map(p => p.id === id ? { ...p, caption } : p));
  };

  const handleMovePhoto = (index: number, direction: 'left' | 'right') => {
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= photos.length) return;
    const copy = [...photos];
    const temp = copy[index];
    copy[index] = copy[targetIndex];
    copy[targetIndex] = temp;
    setPhotos(copy);
  };

  const handleUpdateFocalPoint = (id: string, x: number, y: number) => {
    setPhotos(photos.map(p => p.id === id ? { ...p, focalPoint: { x, y } } : p));
  };

  // 5. Submit Form and Generate Magazine Page
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Lütfen içerik ana başlığını giriniz.');
      return;
    }

    setIsSubmitting(true);
    try {
      const articleToSave: ArticleItem = {
        id: initialArticle?.id || `art-${Date.now()}`,
        issueId: initialArticle?.issueId || currentIssue?.id || 'active-issue',
        category,
        title: title.trim(),
        subtitle: subtitle.trim(),
        author: author.trim() || 'MAİDER Ekibi',
        authorRole: authorRole.trim() || 'Yazar',
        content: content.trim(),
        pullQuote: pullQuote.trim() || extractSuggestedPullQuote(content),
        sourceReference: sourceReference.trim(),
        photos,
        mainPhoto: photos.find(p => p.isMain) || photos[0],
        status,
        createdBy: author || 'Yazar',
        createdRole: 'Yazar',
        createdAt: initialArticle?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await onSaveAndGeneratePages(articleToSave);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderImageAndLayoutManager = () => (
    <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-200 pb-2">
        <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
          <Sliders className="w-3.5 h-3.5 text-indigo-600" />
          <span>Görsel ve Mizanpaj Yöneticisi</span>
        </span>
        <span className="text-[10px] text-slate-500">
          A4 sayfasına tam oturması için 3 adımlı yerleşim ve boyut kontrolü
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-1">
        {/* Adım 1: Sayfa Yerleşimi (4 Buton) */}
        <div className="sm:col-span-5">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
            Adım 1: Sayfa Yerleşimi
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={() => setImagePosition('inline-left')}
              className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer border text-center ${
                imagePosition === 'inline-left'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
              title="Görseli metnin soluna kaydırır, metin sağından akar"
            >
              <span>◀ Sol</span>
            </button>
            <button
              type="button"
              onClick={() => setImagePosition('inline-right')}
              className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer border text-center ${
                imagePosition === 'inline-right'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
              title="Görseli metnin sağına kaydırır, metin solundan akar"
            >
              <span>Sağ ▶</span>
            </button>
            <button
              type="button"
              onClick={() => setImagePosition('full-width')}
              className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer border text-center ${
                imagePosition === 'full-width'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
              title="Görsel tam sayfa genişliğinde manşet olarak yerleşir"
            >
              <span>▬ Tam Manşet</span>
            </button>
            <button
              type="button"
              onClick={() => setImagePosition('bottom')}
              className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer border text-center ${
                imagePosition === 'bottom'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
              title="Görsel sayfanın alt kısmına yerleşir"
            >
              <span>▼ Alt Bölüm</span>
            </button>
          </div>
        </div>

        {/* Adım 2: Görünüm / Kırpma (2 Buton) */}
        <div className="sm:col-span-3">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
            Adım 2: Kırpma
          </label>
          <div className="flex flex-col gap-1.5">
            <button
              type="button"
              onClick={() => setImageFit('contain')}
              className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer border flex items-center justify-center gap-1 ${
                imageFit === 'contain'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
              title="Görselin hiçbir kenarı kesilmez, tam olarak görünür"
            >
              <span>🔍 Kırpmasız</span>
            </button>
            <button
              type="button"
              onClick={() => setImageFit('cover')}
              className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer border flex items-center justify-center gap-1 ${
                imageFit === 'cover'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
              title="Görsel çerçeveyi dolduracak şekilde yerleşir"
            >
              <span>🖼️ Doldur</span>
            </button>
          </div>
        </div>

        {/* Adım 3: Görsel Boyutu (Yatay Kaydırma Çubuğu) */}
        <div className="sm:col-span-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600">
                Adım 3: Görsel Boyutu
              </label>
              <span className="text-xs font-mono font-black text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-md">
                %{imageScale}
              </span>
            </div>
            <input
              type="range"
              min="20"
              max="100"
              step="5"
              value={imageScale}
              onChange={(e) => setImageScale(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 mt-2"
              title={`Görsel Boyutu: %${imageScale}`}
            />
          </div>
          <div className="flex justify-between text-[9px] text-slate-400 font-mono mt-1">
            <span>%20 Min</span>
            <span>%60 Orta</span>
            <span>%100 Tam</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-[1720px] 2xl:max-w-[1900px] mx-auto text-slate-800">
      {/* Top Header & Mode Toggles */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 mb-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Yapay Zekâ & Manuel Tek Stüdyo</span>
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-semibold text-slate-600">
              {issueMonth} {issueYear} (Sayı {issueNum})
            </span>
          </div>
          <h1 className="font-editorial text-xl sm:text-2xl md:text-3xl font-black text-slate-900 flex flex-wrap items-center gap-2">
            <span>{initialArticle ? 'İçeriği Düzenle' : 'İçerik Ekle & AI Stüdyo'}</span>
            <span
              className="text-xs px-2.5 py-0.5 rounded-full font-sans font-bold text-white shadow-2xs"
              style={{ backgroundColor: currentTheme.color }}
            >
              {category}
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Tek bir merkez üzerinden hem yapay zekâ destekli araştırma ve görsel üretimi yapabilir, hem de kendi yazılarınızı manuel olarak girip düzenleyebilirsiniz.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
          {/* Gizli Tam Sayfa Dosya / PDF Input */}
          <input
            ref={fullPageFileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,application/pdf"
            className="hidden"
            onChange={handleFullPageFileChange}
          />

          {/* Dosya / Görsel / PDF Ekle Butonu (Tam Sayfa Tuval & PDF Entegrasyonu) */}
          <button
            type="button"
            onClick={() => fullPageFileInputRef.current?.click()}
            className="flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-xs transition-all cursor-pointer"
            title="A4 tuvaline %100 tam sayfa görsel veya yüksek çözünürlüklü PDF sayfası ekle"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>📁 Dosya / Görsel / PDF Ekle</span>
          </button>

          {/* Sayfayı Sıfırla / Yeniden Düzenle Butonu */}
          <button
            type="button"
            onClick={handleResetPage}
            className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-all cursor-pointer shadow-2xs"
            title="A4 tuvalini ve tüm alanları temizleyip sıfırdan başlar"
          >
            <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
            <span>Sayfayı Sıfırla</span>
          </button>

          {/* Toggle Split-Screen Desktop */}
          <button
            type="button"
            onClick={() => setIsSplitScreen(!isSplitScreen)}
            className="hidden lg:flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors"
            title="Görünüm Modu"
          >
            <Sliders className="w-3.5 h-3.5 text-sky-600" />
            <span>{isSplitScreen ? 'Tek Sütun Form' : 'Yan Yana Canlı Önizleme'}</span>
          </button>

          {/* Toggle Expanded A4 Preview on Desktop */}
          {isSplitScreen && (
            <button
              type="button"
              onClick={() => setPreviewLayoutMode(prev => prev === 'expanded' ? 'standard' : 'expanded')}
              className={`hidden lg:flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl border transition-all cursor-pointer shadow-2xs ${
                previewLayoutMode === 'expanded'
                  ? 'bg-indigo-50 text-indigo-700 border-indigo-300 hover:bg-indigo-100'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
              title="Önizleme boyutunu büyüt (Genişletilmiş Görünüm)"
            >
              <Maximize2 className="w-3.5 h-3.5 text-indigo-600" />
              <span>{previewLayoutMode === 'expanded' ? 'Genişletilmiş Önizleme (Büyük A4)' : 'Dengeli Görünüm (50/50)'}</span>
            </button>
          )}

          {/* Quick Preview Button (Modal / Drawer) */}
          <button
            type="button"
            onClick={() => setShowMobilePreviewModal(true)}
            className="flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition-all cursor-pointer"
          >
            <Eye className="w-4 h-4 text-indigo-600" />
            <span>Önizleme Gör</span>
          </button>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors"
            >
              Vazgeç
            </button>
          )}
        </div>
      </div>

      {/* 🌟 Tam Sayfa Tuval & PDF Aktif Bilgi ve Çakışma Yönetim Çubuğu */}
      {isFullPageCanvasMode && fullPageCanvasImage && (
        <div className="bg-gradient-to-r from-indigo-900/90 via-purple-900/90 to-slate-900/90 text-white rounded-2xl p-4 shadow-md border border-indigo-500/40 flex flex-col sm:flex-row items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-14 rounded-lg overflow-hidden border border-white/30 bg-slate-800 shrink-0 shadow-xs">
              <img src={fullPageCanvasImage} alt="Tam Sayfa Tuval" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                  Tam Sayfa Tuval Modu (%100 A4 Fit / PDF Entegrasyonu)
                </h4>
              </div>
              <p className="text-[11px] text-slate-300">
                Yüklenen içerik A4 tuvaline tam sayfa yerleştirildi. Retina kalitesi korunur, küçük kutuya sıkışmaz.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap justify-end">
            {/* Çakışma Yönetimi Seçici */}
            <div className="bg-slate-800/90 p-0.5 rounded-xl border border-slate-700 flex items-center text-[11px] font-semibold">
              <button
                type="button"
                onClick={() => setFullPageMode('canvas-fit')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  fullPageMode === 'canvas-fit' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
                title="Sadece tam sayfa belge veya afiş görünür, metin şablonu arka plandadır"
              >
                Tam Belge / Afiş
              </button>
              <button
                type="button"
                onClick={() => setFullPageMode('overlay')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  fullPageMode === 'overlay' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
                title="Görselin üzerine yarı şeffaf zarif metin kartı ekler"
              >
                Metin Katmanı
              </button>
              <button
                type="button"
                onClick={() => setFullPageMode('full-bleed')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  fullPageMode === 'full-bleed' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
                title="Kenar boşlukları olmadan sayfayı tamamen kaplar"
              >
                Tam Taşma
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                setIsFullPageCanvasMode(false);
                setFullPageCanvasImage(null);
              }}
              className="text-xs font-bold px-3 py-1.5 rounded-xl bg-rose-600/80 hover:bg-rose-700 text-white transition-colors cursor-pointer"
              title="Tam sayfa tuvali kaldırıp standart metin şablonuna döner"
            >
              Tam Sayfayı Kaldır
            </button>
          </div>
        </div>
      )}

      {/* Main Layout Container (Split-Screen on desktop, stacked on mobile) */}
      <div className={`grid gap-6 ${
        !isSplitScreen
          ? 'grid-cols-1 max-w-4xl mx-auto'
          : previewLayoutMode === 'expanded'
            ? 'grid-cols-1 lg:grid-cols-12 xl:grid-cols-12'
            : 'grid-cols-1 lg:grid-cols-12'
      }`}>
        {/* Left Side: Form Controls */}
        <div className={`${
          !isSplitScreen
            ? 'w-full'
            : previewLayoutMode === 'expanded'
              ? 'lg:col-span-5 xl:col-span-4'
              : 'lg:col-span-6'
        } space-y-6`}>
          <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-7 shadow-sm space-y-6">
            {/* Sayfa Düzeni & Mizanpaj Seçici (Kullanıcı dilediği düzeni deneyerek seçebilir) */}
            <div className="bg-gradient-to-r from-slate-50 via-indigo-50/40 to-sky-50/40 border border-indigo-100 rounded-2xl p-4 shadow-2xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shadow-2xs">
                    📐
                  </span>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                      <span>Sayfa Tasarımı & Mizanpaj Şablonu</span>
                      <span className="text-[10px] font-normal text-indigo-600 font-sans">(Canlı Deneyip Seçin)</span>
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Butonlara tıklayarak sağdaki A4 önizlemede farklı tasarımları anında test edin
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={handleResetPage}
                    className="flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-all cursor-pointer shadow-2xs"
                    title="A4 tuvalini temizle ve yeni bir mizanpaja sıfırdan başla"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
                    <span>Sayfayı Sıfırla / Yeniden Düzenle</span>
                  </button>

                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white border border-indigo-200 text-indigo-700 shadow-2xs">
                    Seçili: {
                      layoutStyle === 'classic' ? 'Klasik Mizanpaj' :
                      layoutStyle === 'sidebar' ? 'Modern Kenar Blok' :
                      layoutStyle === 'headline_first' ? 'Manşet Odaklı' :
                      layoutStyle === 'compact' ? 'Kompakt Metin' :
                      layoutStyle === 'editorial' ? 'Magazin & Tipografi' :
                      layoutStyle === 'academic' ? 'Akademik & Araştırma' : 'Odak Görsel & Kart'
                    }
                  </span>
                </div>
              </div>

              {/* 3 Farklı Akıllı Tasarım Önerisi (PRD 10) */}
              <div className="mb-3.5 p-3.5 bg-white rounded-xl border border-indigo-200 shadow-2xs">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span className="text-[11px] font-black uppercase tracking-wider text-slate-800">
                      3 Farklı Akıllı Tasarım Önerisi (1-Tıkla Değiştir)
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium">İçerik hacmine göre optimize</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {getSmartLayoutAlternatives({
                    wordCount,
                    photoCount: photos.length,
                    hasPullQuote: !!pullQuote.trim()
                  }).map((alt) => (
                    <button
                      key={alt.id}
                      type="button"
                      onClick={() => {
                        setLayoutStyle(alt.id);
                        setImagePosition(alt.recommendedImagePosition);
                        setPullQuoteStyle(alt.recommendedQuoteStyle);
                      }}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        layoutStyle === alt.id
                          ? 'bg-indigo-50/80 border-indigo-600 ring-2 ring-indigo-500/20 shadow-xs'
                          : 'bg-slate-50/70 border-slate-200 hover:bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11.5px] font-bold text-slate-900">{alt.title}</span>
                        {layoutStyle === alt.id && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />}
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1 leading-tight">{alt.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tüm Düzen Şablonları */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setLayoutStyle('classic')}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    layoutStyle === 'classic'
                      ? 'bg-white border-indigo-600 ring-2 ring-indigo-500/20 shadow-xs'
                      : 'bg-white/80 border-slate-200 hover:bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-800">📰 Klasik Mizanpaj</span>
                    {layoutStyle === 'classic' && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />}
                  </div>
                  <p className="text-[10px] text-slate-500 leading-tight">
                    Üst görsel, 2 sütun metin ve doğal akışta vurgu spotu
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setLayoutStyle('sidebar')}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    layoutStyle === 'sidebar'
                      ? 'bg-white border-indigo-600 ring-2 ring-indigo-500/20 shadow-xs'
                      : 'bg-white/80 border-slate-200 hover:bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-800">📌 Modern Kenar</span>
                    {layoutStyle === 'sidebar' && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />}
                  </div>
                  <p className="text-[10px] text-slate-500 leading-tight">
                    Yanda dikey görsel & vurgu sütunu, editoryal metin
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setLayoutStyle('headline_first')}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    layoutStyle === 'headline_first'
                      ? 'bg-white border-indigo-600 ring-2 ring-indigo-500/20 shadow-xs'
                      : 'bg-white/80 border-slate-200 hover:bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-800">⭐ Manşet Odaklı</span>
                    {layoutStyle === 'headline_first' && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />}
                  </div>
                  <p className="text-[10px] text-slate-500 leading-tight">
                    Büyük manşet başlığı ve geniş görsel odaklı düzen
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setLayoutStyle('compact')}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    layoutStyle === 'compact'
                      ? 'bg-white border-indigo-600 ring-2 ring-indigo-500/20 shadow-xs'
                      : 'bg-white/80 border-slate-200 hover:bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-800">📝 Kompakt / Yoğun</span>
                    {layoutStyle === 'compact' && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />}
                  </div>
                  <p className="text-[10px] text-slate-500 leading-tight">
                    3 sütunlu kompakt mizanpaj, uzun yazılar için ideal
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setLayoutStyle('editorial')}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    layoutStyle === 'editorial'
                      ? 'bg-white border-indigo-600 ring-2 ring-indigo-500/20 shadow-xs'
                      : 'bg-white/80 border-slate-200 hover:bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-800">✨ Magazin & Tipografi</span>
                    {layoutStyle === 'editorial' && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />}
                  </div>
                  <p className="text-[10px] text-slate-500 leading-tight">
                    Zarif serif başlık, drop-cap ve 2 sütunlu prestij düzen
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setLayoutStyle('academic')}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    layoutStyle === 'academic'
                      ? 'bg-white border-indigo-600 ring-2 ring-indigo-500/20 shadow-xs'
                      : 'bg-white/80 border-slate-200 hover:bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-800">🔬 Akademik & İnceleme</span>
                    {layoutStyle === 'academic' && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />}
                  </div>
                  <p className="text-[10px] text-slate-500 leading-tight">
                    3 sütunlu resmi araştırma ve inceleme stili
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setLayoutStyle('focus_card')}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    layoutStyle === 'focus_card'
                      ? 'bg-white border-indigo-600 ring-2 ring-indigo-500/20 shadow-xs'
                      : 'bg-white/80 border-slate-200 hover:bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-800">🎴 Odak Görsel & Kart</span>
                    {layoutStyle === 'focus_card' && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />}
                  </div>
                  <p className="text-[10px] text-slate-500 leading-tight">
                    Üstte görsel ve spot kartı dengeli, akıcı 2 sütun
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setLayoutStyle('grid')}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    layoutStyle === 'grid'
                      ? 'bg-white border-indigo-600 ring-2 ring-indigo-500/20 shadow-xs'
                      : 'bg-white/80 border-slate-200 hover:bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-800">🖼️ Çoklu Galeri Gridi</span>
                    {layoutStyle === 'grid' && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />}
                  </div>
                  <p className="text-[10px] text-slate-500 leading-tight">
                    Birden fazla görseli zarif bir mozaikle birleştiren mizanpaj
                  </p>
                </button>
              </div>

              {/* Tipografi & Yazı Karakteri Özelleştirme Çubuğu (PRD 16-28) */}
              <div className="mt-3.5 pt-3 border-t border-indigo-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-bold uppercase text-slate-600">Tipografi:</span>

                  {/* Font Family Selector */}
                  <select
                    value={fontFamily}
                    onChange={(e) => setFontFamily(e.target.value)}
                    className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-800 shadow-2xs focus:outline-none focus:border-indigo-500"
                    title="Yazı Font Ailesi"
                  >
                    <option value="Merriweather">Serif (Merriweather - Klasik Dergi)</option>
                    <option value="Playfair Display">Serif (Playfair Display - Editoryal)</option>
                    <option value="Lora">Serif (Lora - Edebi & Zarif)</option>
                    <option value="Inter">Sans (Inter - Modern Dijital)</option>
                    <option value="Montserrat">Sans (Montserrat - Dinamik)</option>
                    <option value="Cinzel">Display (Cinzel - Prestij Başlık)</option>
                  </select>

                  {/* Font Size Selector */}
                  <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg px-2 py-0.5 shadow-2xs">
                    <span className="text-[10px] text-slate-500">Boyut:</span>
                    {[12, 13, 14, 15].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setFontSize(s)}
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          fontSize === s ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {s}pt
                      </button>
                    ))}
                  </div>

                  {/* Alignment */}
                  <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-0.5 shadow-2xs">
                    {(['justify', 'left', 'center'] as const).map((align) => (
                      <button
                        key={align}
                        type="button"
                        onClick={() => setTextAlign(align)}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          textAlign === align ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {align === 'justify' ? 'Yasla' : align === 'left' ? 'Sol' : 'Orta'}
                      </button>
                    ))}
                  </div>

                  {/* Line Height */}
                  <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg px-2 py-0.5 shadow-2xs">
                    <span className="text-[10px] text-slate-500">Satır:</span>
                    {[1.4, 1.65, 1.8].map((lh) => (
                      <button
                        key={lh}
                        type="button"
                        onClick={() => setLineHeight(lh)}
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          lineHeight === lh ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {lh}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Step a: Konu Ana Başlığı */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-sky-600 text-white text-[10px] flex items-center justify-center font-bold">1</span>
                  <span>Konu Ana Başlığı *</span>
                </label>
                <span className="text-[11px] text-slate-400 font-mono">
                  {title.length}/80 Karakter
                </span>
              </div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Örn: Bilim Fuarı, Robotik Kodlama, Sıfır Atık veya dilediğiniz konu..."
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm sm:text-base text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:bg-white font-bold transition-all shadow-2xs"
              />
            </div>

            {/* Step b: Konu Alt Başlığı */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-sky-600 text-white text-[10px] flex items-center justify-center font-bold">2</span>
                  <span>Konu Alt Başlığı / Spot Açıklama</span>
                </label>
                <span className="text-[11px] text-slate-400">İsteğe Bağlı</span>
              </div>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Örn: Mehmet Akif İnan Ortaokulu öğrencilerimizin bilimin rehberliğinde ürettiği projeler..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:bg-white transition-all shadow-2xs"
              />
            </div>

            {/* Category & Selectable Teacher Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-1">
              <div className="sm:col-span-12">
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700">
                    Dergi Bölüm Başlığı *
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsSectionManagerOpen(true)}
                    className="text-[11px] font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1 hover:underline cursor-pointer"
                    title="Bölümleri Listele, Ekle, Düzenle veya Çıkar"
                  >
                    <Settings2 className="w-3 h-3" />
                    <span>Bölümleri Yönet ({sections.length})</span>
                  </button>
                </div>
                <div className="flex gap-1.5">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white truncate shadow-2xs"
                  >
                    {sections.map(sec => (
                      <option key={sec} value={sec}>{sec}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setIsSectionManagerOpen(true)}
                    className="px-2.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-bold transition-colors cursor-pointer shrink-0"
                    title="Yeni Bölüm Ekle / Düzenle"
                  >
                    + Düzenle
                  </button>
                </div>
              </div>

              {/* Görsel ve Mizanpaj Yöneticisi (Dergi Bölüm Başlığının Doğrudan Altında) */}
              <div className="sm:col-span-12">
                {renderImageAndLayoutManager()}
              </div>
            </div>

            {/* Step c: İçerik Alanı & AI Asistan Butonları */}
            <div className="pt-2">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2.5 mb-2.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5 shrink-0">
                  <span className="w-4 h-4 rounded-full bg-sky-600 text-white text-[10px] flex items-center justify-center font-bold">3</span>
                  <span>İçerik Alanı *</span>
                </label>

                {/* Boş Arama / Konu Kutusu + AI Araştır Butonu + Farklı Getir */}
                <div className="flex items-center gap-1.5 flex-wrap w-full lg:w-auto">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={aiSearchKeywords}
                      onChange={(e) => setAiSearchKeywords(e.target.value)}
                      placeholder="Kelime(ler) yazın (Örn: Mars, Kodlama, Sivas)..."
                      className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 focus:border-indigo-500 rounded-lg pl-8 pr-2 py-1.5 text-xs text-slate-800 placeholder-slate-400 shadow-2xs transition-colors"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => handleGenerateAiArticle(false)}
                    disabled={isGeneratingAiContent}
                    className="bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-700 hover:to-sky-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-xs flex items-center gap-1.5 transition-all transform active:scale-95 disabled:opacity-50 cursor-pointer shrink-0"
                    title="Yazılan kelimeleri araştırıp dergi içeriğini hazırlar"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>{isGeneratingAiContent ? 'Araştırılıyor...' : '🤖 Yapay Zeka ile Araştır & Üret'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleGenerateAiArticle(true)}
                    disabled={isGeneratingAiContent}
                    className="bg-white hover:bg-indigo-50 border border-indigo-200 hover:border-indigo-300 text-indigo-700 text-xs font-bold px-2.5 py-1.5 rounded-lg shadow-2xs flex items-center gap-1 transition-all transform active:scale-95 disabled:opacity-50 cursor-pointer shrink-0"
                    title="Farklı bir bakış açısıyla alternatif makale üret"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 text-indigo-600 ${isGeneratingAiContent ? 'animate-spin' : ''}`} />
                    <span>Farklı Getir 🔄</span>
                  </button>
                </div>
              </div>

              {/* AI Status Banner */}
              {isGeneratingAiContent && (
                <div className="mb-2.5 p-3 bg-indigo-50 border border-indigo-200 rounded-xl flex items-center gap-2 text-xs text-indigo-800 animate-pulse">
                  <RefreshCw className="w-4 h-4 animate-spin text-indigo-600" />
                  <span>{aiStatusMsg}</span>
                </div>
              )}

              {/* Rich Text & Formatting Toolbar (Bold, Italic, Subheading, Colors, Sayfaya Sığdır) */}
              <div className="bg-slate-100/90 border border-slate-300 rounded-t-xl px-3 py-1.5 flex flex-wrap items-center justify-between gap-2 text-xs border-b-0">
                <div className="flex items-center gap-1 flex-wrap">
                  <span className="text-[10px] font-bold uppercase text-slate-400 mr-1">Biçimlendir:</span>

                  {/* Bold */}
                  <button
                    type="button"
                    onClick={() => applyFormatting('**', '**')}
                    className="px-2 py-1 rounded bg-white hover:bg-slate-200 border border-slate-200 font-black text-slate-800 text-xs transition-colors shadow-2xs cursor-pointer flex items-center gap-0.5"
                    title="Seçili metni Kalın/Koyu yapar (**metin**)"
                  >
                    <Bold className="w-3 h-3" />
                  </button>

                  {/* Italic */}
                  <button
                    type="button"
                    onClick={() => applyFormatting('*', '*')}
                    className="px-2 py-1 rounded bg-white hover:bg-slate-200 border border-slate-200 italic font-serif text-slate-800 text-xs transition-colors shadow-2xs cursor-pointer flex items-center gap-0.5"
                    title="Seçili metni İtalik/Eğik yapar (*metin*)"
                  >
                    <Italic className="w-3 h-3" />
                  </button>

                  {/* Subheading */}
                  <button
                    type="button"
                    onClick={() => applyFormatting('\n\n### ', '\n')}
                    className="px-2 py-1 rounded bg-white hover:bg-slate-200 border border-slate-200 font-bold text-slate-800 text-[11px] transition-colors shadow-2xs cursor-pointer"
                    title="Koyu Alt Başlık ekler (### Alt Başlık)"
                  >
                    H3 Başlık
                  </button>

                  <span className="text-slate-300 mx-0.5">|</span>

                  {/* Color Palette Chips */}
                  <div className="flex items-center gap-1">
                    <Palette className="w-3 h-3 text-slate-400" />
                    {[
                      { name: 'Lacivert', hex: '#1e3a8a', bg: 'bg-blue-900' },
                      { name: 'Canlı Mavi', hex: '#0284c7', bg: 'bg-sky-600' },
                      { name: 'Zümrüt Yeşili', hex: '#059669', bg: 'bg-emerald-600' },
                      { name: 'Bordo', hex: '#b91c1c', bg: 'bg-red-700' },
                      { name: 'Mor', hex: '#7c3aed', bg: 'bg-purple-600' },
                      { name: 'Turuncu', hex: '#ea580c', bg: 'bg-amber-600' },
                    ].map((c) => (
                      <button
                        key={c.name}
                        type="button"
                        onClick={() => applyFormatting(`[color=${c.hex}]`, `[/color]`)}
                        className={`w-3.5 h-3.5 rounded-full ${c.bg} border border-white hover:scale-125 transition-transform shadow-2xs cursor-pointer`}
                        title={`${c.name} renkli yazı`}
                      />
                    ))}
                  </div>
                </div>

                {/* SAYFAYA SIĞDIR / AI İLE KISALT BUTONU */}
                <div>
                  <button
                    type="button"
                    onClick={handleShortenToFitPage}
                    disabled={isShortening}
                    className={`text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs ${
                      isOverflowingPage
                        ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse'
                        : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200'
                    }`}
                    title="Metni 1 A4 sayfasına sığacak şekilde pedagojik olarak kısaltır/özetler"
                  >
                    <Scissors className="w-3.5 h-3.5" />
                    <span>{isShortening ? 'Kısaltılıyor...' : '✂️ Sayfaya Sığdır / AI ile Kısalt'}</span>
                  </button>
                </div>
              </div>

              <textarea
                ref={textareaRef}
                rows={8}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Yazınızı buraya yazın. İstediğiniz kısımları yukarıdaki araç çubuğu ile kalınlaştırabilir, alt başlık yapabilir veya renklendirebilirsiniz. Sığmayan kısımlar kırmızıyla gösterilir..."
                required
                className="w-full bg-slate-50 border border-slate-300 rounded-b-xl p-4 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:bg-white leading-relaxed font-sans transition-all shadow-2xs"
              />

              {/* 1 Sayfa Kapasite ve Uyarı Durum Çubuğu (Kırmızı Taşan Metin Göstergesi) */}
              <div className="mt-2 space-y-2">
                {isOverflowingPage ? (
                  <div className="p-3 bg-rose-50 border border-rose-300 rounded-xl text-xs text-rose-900 shadow-2xs space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                        <span>
                          <strong>Sayfa Sınırı Uyarısı:</strong> 1. Sayfaya sığmayan <strong className="text-rose-700 font-bold font-mono">{wordCount - maxPageWords} kelime</strong> aşağıda kırmızıyla işaretlenmiştir:
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleShortenToFitPage}
                        disabled={isShortening}
                        className="text-[11px] font-bold bg-rose-600 hover:bg-rose-700 text-white px-3 py-1 rounded-lg shrink-0 cursor-pointer shadow-2xs flex items-center gap-1 self-start sm:self-auto"
                      >
                        <Scissors className="w-3 h-3" />
                        <span>{isShortening ? 'Kısaltılıyor...' : '✂️ Sayfaya Sığdır / Özetle'}</span>
                      </button>
                    </div>

                    {/* Sığmayan fazla kelimeleri kırmızı renkte gösteren canlı akış alanı */}
                    <div className="bg-white p-3 rounded-lg border border-rose-200 text-[11.5px] leading-relaxed font-serif max-h-36 overflow-y-auto">
                      <span className="text-slate-700">{fittingContentText}</span>
                      {' '}
                      <span
                        className="text-rose-600 font-bold bg-rose-100 border border-rose-300 px-1.5 py-0.5 rounded underline decoration-rose-500 inline"
                        title="Bu bölüm 1. A4 sayfasına sığmıyor!"
                      >
                        {overflowContentText}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-emerald-700 flex items-center justify-between bg-emerald-50/70 border border-emerald-200/80 px-3 py-1.5 rounded-lg">
                    <span className="flex items-center gap-1.5 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>1 Sayfaya Tam Uygun ({wordCount}/{maxPageWords} Kelime • ~{readingTime} Dk Okuma)</span>
                    </span>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                      ✓ %100 Uyumlu
                    </span>
                  </div>
                )}
              </div>

              {/* TDK Optimization & Word Count Toolbar */}
              <div className="mt-2 flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="font-semibold text-slate-700">{wordCount} Kelime</span>
                  <span>•</span>
                  <span>~{readingTime} Dk Okuma</span>
                </div>

                {/* TDK Spelling Checker Button */}
                <button
                  type="button"
                  onClick={handleApplyTdkOptimization}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Türk Dil Kurumu yazım ve imla kurallarına göre metni düzeltir"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>TDK Kurallarına Göre Denetle & Optimize Et</span>
                </button>
              </div>

              {/* TDK Applied Fixes Feedback Banner */}
              {tdkBannerVisible && (
                <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900">
                  <div className="flex items-center justify-between font-bold mb-1">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>TDK İmla ve Yazım Denetimi Tamamlandı (%{tdkScore} Uyumlu)</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setTdkBannerVisible(false)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {tdkFixes.length > 0 ? (
                    <ul className="list-disc list-inside space-y-0.5 text-[11px] text-emerald-800 mt-1 pl-1">
                      {tdkFixes.slice(0, 4).map((f, i) => (
                        <li key={i}>
                          <span className="line-through text-rose-600">{f.original}</span> ➔ <strong className="text-emerald-700">{f.corrected}</strong>: {f.reason}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-[11px] text-emerald-700">Metniniz TDK imla ve yazım kurallarına eksiksiz uygundur.</p>
                  )}
                </div>
              )}
            </div>

            {/* Step d: Görsel Yönetimi (Drag & Drop + AI Görsel Üretimi) */}
            <div className="pt-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-sky-600 text-white text-[10px] flex items-center justify-center font-bold">4</span>
                  <span>Görsel Yönetimi ({photos.length} Yüklendi)</span>
                </label>

                {/* AI Görsel Yönü Seçimi, Dosya/PDF Ekleme ve Üretim Butonu */}
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
                    title="Sayfa için görsel dosyası yükle"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>🖼️ Görsel Ekle</span>
                  </button>

                  <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-500 px-1.5">Görsel Yönü:</span>
                    <button
                      type="button"
                      onClick={() => setAiImageOrientation('landscape')}
                      className={`text-[10px] font-bold px-2 py-1 rounded transition-all cursor-pointer ${
                        aiImageOrientation === 'landscape'
                          ? 'bg-indigo-600 text-white shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                      title="Yatay formatta görsel üretir"
                    >
                      ▬ Yatay
                    </button>
                    <button
                      type="button"
                      onClick={() => setAiImageOrientation('portrait')}
                      className={`text-[10px] font-bold px-2 py-1 rounded transition-all cursor-pointer ${
                        aiImageOrientation === 'portrait'
                          ? 'bg-indigo-600 text-white shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                      title="Dikey formatta görsel üretir"
                    >
                      ▮ Dikey
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleGenerateAiImage()}
                    disabled={isGeneratingAiImage}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-xs flex items-center gap-1.5 transition-all transform active:scale-95 disabled:opacity-50 cursor-pointer"
                  >
                    <ImageIcon className="w-3.5 h-3.5 text-amber-300" />
                    <span>{isGeneratingAiImage ? 'Görsel Üretiliyor...' : '🎨 AI ile Uyumlu Görsel Üret'}</span>
                  </button>
                </div>
              </div>

              {/* Drag & Drop Visual Box */}
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDraggingOver(true); }}
                onDragLeave={() => setIsDraggingOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                  isDraggingOver
                    ? 'border-indigo-500 bg-indigo-50/50 scale-[1.01]'
                    : 'border-slate-300 hover:border-indigo-500 bg-slate-50/80 hover:bg-indigo-50/40'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,application/pdf"
                  multiple
                  className="hidden"
                  onChange={handleFileChange}
                />
                <div className="w-10 h-10 rounded-full bg-white text-indigo-600 shadow-xs flex items-center justify-center mx-auto mb-2">
                  <Upload className="w-5 h-5" />
                </div>
                <div className="flex items-center justify-center mb-1">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-indigo-600 text-white text-xs font-bold shadow-2xs">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Görsel Ekle</span>
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-800">
                  Dosyayı buraya sürükleyip bırakın veya <span className="text-indigo-600 underline">bilgisayardan seçin</span>
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Yüksek çözünürlüklü JPG, PNG, WebP veya PDF (Sayfa gridine ve sütun akışına otomatik uyumlanır, retina kalitesi korunur)
                </p>
              </div>

              {/* Photo Thumbnails & Caption List (Çoklu Görsel Yönetimi - PRD 34-40) */}
              {photos.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                  {photos.map((photo, pIdx) => (
                    <div
                      key={photo.id}
                      className={`relative rounded-xl overflow-hidden border p-2.5 bg-white shadow-2xs flex flex-col gap-2 ${
                        photo.isMain ? 'border-amber-400 ring-2 ring-amber-400/20' : 'border-slate-200'
                      }`}
                    >
                      <div className="flex gap-2.5 items-start">
                        <div className="w-20 h-20 rounded-lg overflow-hidden bg-slate-100 shrink-0 relative">
                          <img
                            src={photo.url}
                            alt="Görsel önizleme"
                            className="w-full h-full object-cover"
                            style={{
                              objectPosition: `${photo.focalPoint?.x ?? 50}% ${photo.focalPoint?.y ?? 50}%`
                            }}
                          />
                          {photo.isMain && (
                            <div className="absolute top-1 left-1 bg-amber-400 text-amber-950 text-[9px] font-black px-1.5 py-0.5 rounded shadow-2xs">
                              ★ ANA GÖRSEL
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0 space-y-1.5">
                          <input
                            type="text"
                            value={photo.caption || ''}
                            onChange={(e) => handleUpdateCaption(photo.id, e.target.value)}
                            placeholder="Görsel alt yazısı (Caption)..."
                            className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-[11px] text-slate-800 focus:outline-none focus:border-indigo-500"
                          />

                          {/* Reordering & Focal point alignment */}
                          <div className="flex items-center gap-1 text-[10px] text-slate-500 flex-wrap">
                            <span className="font-semibold">Odak:</span>
                            <button
                              type="button"
                              onClick={() => handleUpdateFocalPoint(photo.id, 50, 20)}
                              className="px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200"
                              title="Üst Odak"
                            >
                              Üst
                            </button>
                            <button
                              type="button"
                              onClick={() => handleUpdateFocalPoint(photo.id, 50, 50)}
                              className="px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 font-bold"
                              title="Merkez Odak"
                            >
                              Orta
                            </button>
                            <button
                              type="button"
                              onClick={() => handleUpdateFocalPoint(photo.id, 50, 80)}
                              className="px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200"
                              title="Alt Odak"
                            >
                              Alt
                            </button>

                            {/* Move left / right */}
                            <div className="ml-auto flex items-center gap-1">
                              <button
                                type="button"
                                disabled={pIdx === 0}
                                onClick={() => handleMovePhoto(pIdx, 'left')}
                                className="px-1.5 py-0.5 rounded border border-slate-200 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                                title="Görseli sola/öne taşı"
                              >
                                ◀
                              </button>
                              <button
                                type="button"
                                disabled={pIdx === photos.length - 1}
                                onClick={() => handleMovePhoto(pIdx, 'right')}
                                className="px-1.5 py-0.5 rounded border border-slate-200 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                                title="Görseli sağa/arkaya taşı"
                              >
                                ▶
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Bottom action row */}
                      <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-100">
                        {!photo.isMain ? (
                          <button
                            type="button"
                            onClick={() => handleSetMainPhoto(photo.id)}
                            className="text-amber-600 hover:text-amber-700 font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <Star className="w-3.5 h-3.5" />
                            <span>Ana Görsel Yap</span>
                          </button>
                        ) : (
                          <span className="text-amber-600 font-bold flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                            <span>Ana Odak Görseli</span>
                          </span>
                        )}

                        <button
                          type="button"
                          onClick={() => handleRemovePhoto(photo.id)}
                          className="text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1 cursor-pointer ml-auto"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Kaldır</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Pull Quote Spot Field */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-sky-600 text-white text-[10px] flex items-center justify-center font-bold">5</span>
                  <span>Vurgu Cümlesi (Pull-Quote / Spot)</span>
                  <span className="text-[10px] font-normal text-slate-500">(Metnin üzerine binmez)</span>
                </label>

                <div className="flex items-center gap-2 flex-wrap">
                  {/* Vurgu Stili Butonları (PRD 15) */}
                  <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-500 px-1">Stil:</span>
                    {[
                      { id: 'box', label: 'Kutu' },
                      { id: 'editorial', label: 'Editoryal' },
                      { id: 'ribbon', label: 'Şerit' },
                      { id: 'minimal', label: 'Minimal' }
                    ].map((st) => (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => setPullQuoteStyle(st.id as PullQuoteStyle)}
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded transition-all cursor-pointer ${
                          pullQuoteStyle === st.id
                            ? 'bg-indigo-600 text-white shadow-2xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>

                  {/* Vurgu Boyutu Butonları */}
                  <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-500 px-1">Boyut:</span>
                    {(['small', 'medium', 'large'] as ComponentSize[]).map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setPullQuoteSize(size)}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded transition-all cursor-pointer ${
                          pullQuoteSize === size
                            ? 'bg-indigo-600 text-white shadow-2xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {size === 'small' ? 'Küçük' : size === 'medium' ? 'Orta' : 'Büyük'}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleExtractPullQuote();
                    }}
                    className="px-3 py-1.5 bg-gradient-to-r from-sky-50 to-indigo-50 hover:from-sky-100 hover:to-indigo-100 text-indigo-700 border border-indigo-200 hover:border-indigo-300 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs transition-all active:scale-95 shrink-0"
                    title="İçerikten veya başlıktan vurucu spot alıntı cümlesi çıkarır"
                  >
                    <Wand2 className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Metinden Otomatik Çıkar</span>
                  </button>
                </div>
              </div>


              {pullQuoteFeedback && (
                <div className="mb-2 text-[11px] font-medium text-sky-700 bg-sky-50 border border-sky-200 px-3 py-1 rounded-lg">
                  {pullQuoteFeedback}
                </div>
              )}

              <input
                type="text"
                value={pullQuote}
                onChange={(e) => setPullQuote(e.target.value)}
                placeholder="Örn: Geleceğin teknolojisi, bugünün meraklı çocuklarının ellerinde şekillenir."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 italic focus:outline-none focus:border-sky-500 focus:bg-white shadow-2xs"
              />
            </div>

            {/* Kaynakça Alanı (Core User Request) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] flex items-center justify-center font-bold">6</span>
                  <span>Kaynakça (İsteğe Bağlı)</span>
                </label>
                <button
                  type="button"
                  onClick={handleSuggestSourceReference}
                  disabled={isSearchingSource}
                  className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1 hover:underline cursor-pointer disabled:opacity-60"
                  title="Yapay zekadan içerik ve konuya göre internet ve arşiv kaynakça taraması yap"
                >
                  <Sparkles className={`w-3.5 h-3.5 text-amber-500 ${isSearchingSource ? 'animate-spin' : ''}`} />
                  <span>{isSearchingSource ? 'İnternet & Kaynaklar Taranıyor...' : '🔍 Yapay Zekâdan Kaynakça Bul / Öner'}</span>
                </button>
              </div>
              <input
                type="text"
                value={sourceReference}
                onChange={(e) => setSourceReference(e.target.value)}
                placeholder="Örn: Sivas Valiliği İl Kültür ve Turizm Müdürlüğü & Vakıflar Genel Müdürlüğü Arşivi"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white shadow-2xs"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                * İsteğe bağlıdır. Doldurulursa dergi sayfasının altına zarif bir dipnot olarak eklenir.
              </p>
            </div>

            {/* ✍️ Yazar / Hazırlayan Kişi Listesi (Sol En Altta) */}
            <div className="bg-slate-50/90 border border-slate-200 rounded-xl p-3.5 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-indigo-600 text-white text-[10px] flex items-center justify-center font-bold">7</span>
                  <span>✍️ Yazar / Hazırlayan Kişi Listesi</span>
                  <span className="text-[11px] font-normal text-slate-500">(İsteğe bağlı - Sadece sol en altta yer alır)</span>
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddTeacherOpen(!isAddTeacherOpen)}
                    className="text-[11px] bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-lg font-bold flex items-center gap-1 cursor-pointer transition-colors"
                    title="Listeye yeni yazar veya kişi ekle"
                  >
                    <Plus className="w-3 h-3" />
                    <span>+ Yeni Kişi Ekle</span>
                  </button>
                  {(author || authorRole) && (
                    <button
                      type="button"
                      onClick={() => { setAuthor(''); setAuthorRole(''); }}
                      className="text-[11px] text-rose-600 hover:text-rose-700 font-semibold cursor-pointer self-start sm:self-auto"
                    >
                      Seçimi Temizle
                    </button>
                  )}
                </div>
              </div>

              {/* Inline Yeni Kişi Ekleme Alanı */}
              {isAddTeacherOpen && (
                <div className="p-3 bg-indigo-50/80 border border-indigo-200 rounded-xl space-y-2 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-indigo-900 flex items-center gap-1">
                      <Plus className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Listeye Yeni Kişi Ekle (Kalıcı Olarak Eklenir)</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsAddTeacherOpen(false)}
                      className="text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                    <div className="sm:col-span-5">
                      <input
                        type="text"
                        value={newTeacherName}
                        onChange={(e) => setNewTeacherName(e.target.value)}
                        placeholder="Ad Soyad (Örn: Zeynep GÜNEŞ)"
                        className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 shadow-2xs"
                      />
                    </div>
                    <div className="sm:col-span-4">
                      <input
                        type="text"
                        value={newTeacherBranch}
                        onChange={(e) => setNewTeacherBranch(e.target.value)}
                        placeholder="Görevi / Branşı (Örn: Türkçe Öğretmeni, Okul Müdürü...)"
                        className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 shadow-2xs"
                      />
                    </div>
                    <div className="sm:col-span-3 flex gap-1">
                      <button
                        type="button"
                        onClick={handleAddTeacher}
                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-1.5 px-2 rounded-lg shadow-2xs transition-colors cursor-pointer"
                      >
                        Ekle & Seç
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsAddTeacherOpen(false)}
                        className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-600 text-xs px-2 py-1.5 rounded-lg cursor-pointer"
                      >
                        İptal
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                {/* Kişi Seçilebilir Dropdown Menü */}
                <div className="sm:col-span-6">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Kişi Seç (Otomatik Branş Doldurur)
                  </label>
                  <select
                    value={teachers.some(t => t.name === author) ? author : ''}
                    onChange={(e) => {
                      const selectedTeacher = teachers.find(t => t.name === e.target.value);
                      if (selectedTeacher) {
                        setAuthor(selectedTeacher.name);
                        setAuthorRole(selectedTeacher.branch);
                      } else {
                        setAuthor('');
                        setAuthorRole('');
                      }
                    }}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-sky-500 shadow-2xs cursor-pointer"
                  >
                    <option value="">-- Kişi Seçiniz (İsteğe Bağlı) --</option>
                    {teachers.map((t) => (
                      <option key={t.name} value={t.name}>
                        • {t.name} ({t.branch})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Yazar Adı (Manuel düzenlenebilir veya otomatik dolar) */}
                <div className="sm:col-span-3">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Yazar / Hazırlayan
                  </label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Örn: MAİDER Ekibi"
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500 shadow-2xs"
                  />
                </div>

                {/* Görevi / Ünvanı (Otomatik branş dolar veya manuel girilir) */}
                <div className="sm:col-span-3">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Görevi / Branşı
                  </label>
                  <input
                    type="text"
                    value={authorRole}
                    onChange={(e) => setAuthorRole(e.target.value)}
                    placeholder="Örn: Kültür & Sanat Masası"
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500 shadow-2xs"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Form Submit Bar */}
            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-xs text-slate-500 text-center sm:text-left">
                * Sistem girilen verileri analiz ederek A4 formatında otomatik mizanpaj üretir.
              </p>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto bg-gradient-to-r from-sky-500 via-indigo-600 to-indigo-700 hover:from-sky-400 hover:to-indigo-600 text-white font-bold text-sm px-7 py-3.5 rounded-xl shadow-md flex items-center justify-center gap-2 transition-all transform active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-white" />
                <span>{isSubmitting ? 'Sayfalar Oluşturuluyor...' : 'AKILLI SAYFA OLUŞTUR'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Side: Real-Time Split-Screen A4 Preview Card (Desktop - Expanded Workspace) */}
        {isSplitScreen && (
          <div className={`hidden lg:flex ${
            previewLayoutMode === 'expanded'
              ? 'lg:col-span-7 xl:col-span-8'
              : 'lg:col-span-6'
          } sticky top-14 self-start flex-col items-center justify-start space-y-2`}>
            <div className="flex items-center justify-between w-full px-1">
              <div className="flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-indigo-600" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-800">
                  Canlı A4 Dergi Önizlemesi {previewLayoutMode === 'expanded' ? '(Genişletilmiş Stüdyo)' : '(Dengeli)'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPreviewLayoutMode(prev => prev === 'expanded' ? 'standard' : 'expanded')}
                  className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 hover:underline cursor-pointer"
                >
                  {previewLayoutMode === 'expanded' ? 'Dengeliye Dön' : 'Genişlet (Büyük Ekran)'}
                </button>
                <span className="text-[9px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">
                  ● Canlı & Kırpılmasız
                </span>
              </div>
            </div>

            <LiveMagazinePreviewCard
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
              year={issueYear}
              month={issueMonth}
              issueNumber={issueNum}
              layoutStyle={layoutStyle}
              imagePosition={imagePosition}
              imageFit={imageFit}
              imageScale={imageScale}
              pullQuoteSize={pullQuoteSize}
              fontFamily={fontFamily}
              fontSize={fontSize}
              lineHeight={lineHeight}
              letterSpacing={letterSpacing}
              titleColor={titleColor}
              textAlign={textAlign}
              fullPageCanvasImage={fullPageCanvasImage}
              isFullPageCanvas={isFullPageCanvasMode}
              fullPageMode={fullPageMode}
              isExpandedView={previewLayoutMode === 'expanded'}
              onToggleExpandView={() => setPreviewLayoutMode(prev => prev === 'expanded' ? 'standard' : 'expanded')}
              onOpenFullscreen={() => setShowMobilePreviewModal(true)}
              onAutoFit={handleAutoFitPage}
              onCycleLayout={() => {
                const styles: LayoutStyle[] = ['classic', 'headline_first', 'sidebar', 'editorial', 'academic', 'grid'];
                const nextIdx = (styles.indexOf(layoutStyle) + 1) % styles.length;
                setLayoutStyle(styles[nextIdx]);
              }}
            />
          </div>
        )}
      </div>

      {/* ── Tam Ekran A4 Dergi Sayfası Önizleme Stüdyosu (Full-Screen Studio) ── */}
      {showMobilePreviewModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex flex-col select-none overflow-hidden animate-fadeIn">
          {/* Üst Yönetim Araç Çubuğu */}
          <div className="h-14 shrink-0 px-4 sm:px-6 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between gap-3 text-white">
            {/* Sol: Başlık ve Kategori Rozeti */}
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex items-center gap-1.5 shrink-0">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="font-editorial text-base font-bold text-white tracking-wide">MAİDER</span>
              </div>
              <span
                className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded text-white truncate max-w-[120px] sm:max-w-[180px]"
                style={{ backgroundColor: currentTheme.color }}
              >
                {category}
              </span>
              <span className="hidden md:inline text-xs text-slate-400 truncate max-w-[200px]">
                {title || 'Yeni Sayfa'}
              </span>
            </div>

            {/* Orta: Yakınlaştırma & Kılavuz & Otomatik Sığdır */}
            <div className="flex items-center gap-2">
              <div className="bg-slate-800/90 rounded-xl p-0.5 border border-slate-700/80 flex items-center">
                <button
                  type="button"
                  onClick={() => setFullscreenZoom('fit')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    fullscreenZoom === 'fit'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Ekrana Sığdır (%{Math.round(viewportScale * 100)})
                </button>
                <button
                  type="button"
                  onClick={() => setFullscreenZoom('100%')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    fullscreenZoom === '100%'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  1:1 Gerçek Boyut
                </button>
              </div>

              {/* Kılavuz Çizgileri Toggle */}
              <button
                type="button"
                onClick={() => setModalShowGuides(prev => !prev)}
                title="Baskı ve Marj Kılavuzları (20mm Üst, 25mm Alt, 22mm Cilt, 18mm Dış, 4mm Bleed)"
                className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
                  modalShowGuides
                    ? 'bg-sky-500/20 text-sky-300 border-sky-400/50'
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Kılavuzlar</span>
              </button>

              {/* Otomatik Sığdır Butonu */}
              <button
                type="button"
                onClick={handleAutoFitPage}
                title="A4 Sayfasına Otomatik Sığdır"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Otomatik Sığdır</span>
              </button>
            </div>

            {/* Sağ: 300 DPI PDF İndir & Kapat */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleModalExportPdf}
                disabled={isExportingModalPdf}
                title="Birebir Aynı A4 PDF İndir (300 DPI)"
                className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
              >
                <FileDown className="w-4 h-4" />
                <span>{isExportingModalPdf ? 'İndiriliyor...' : 'PDF İndir (300 DPI)'}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowMobilePreviewModal(false)}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition-colors cursor-pointer"
                title="Tam Ekrandan Çık (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* PDF Derleme Bildirimi */}
          {isExportingModalPdf && (
            <div className="px-6 py-2 bg-indigo-900/80 border-b border-indigo-700/50 text-indigo-200 text-xs font-medium flex items-center gap-2">
              <div className="w-3.5 h-3.5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
              <span>{modalPdfProgress || 'A4 PDF Derleniyor, lütfen bekleyin...'}</span>
            </div>
          )}

          {/* Orta A4 Tuvali - Sıfır Dikey Kaydırma ve Kesiksiz Görünüm */}
          <div
            className={`flex-1 w-full flex justify-center items-center ${
              fullscreenZoom === '100%' ? 'overflow-auto p-8' : 'overflow-hidden p-2 sm:p-4'
            }`}
          >
            <div
              className="transition-transform duration-150 origin-center shadow-2xl rounded-sm shrink-0"
              style={{
                transform: fullscreenZoom === 'fit' ? `scale(${viewportScale})` : 'scale(1)',
                width: '794px',
                height: '1123px'
              }}
            >
              <A4PageRenderer
                id="fullscreen-preview-page"
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
                year={issueYear}
                month={issueMonth}
                issueNumber={issueNum}
                layoutStyle={layoutStyle}
                imagePosition={imagePosition}
                imageFit={imageFit}
                imageScale={imageScale}
                pullQuoteSize={pullQuoteSize}
                showGuides={modalShowGuides}
                fontFamily={fontFamily}
                fontSize={fontSize}
                lineHeight={lineHeight}
                letterSpacing={letterSpacing}
                titleColor={titleColor}
                textAlign={textAlign}
                fullPageCanvasImage={fullPageCanvasImage}
                isFullPageCanvas={isFullPageCanvasMode}
                fullPageMode={fullPageMode}
              />
            </div>
          </div>

          {/* Alt Bilgi Çubuğu */}
          <div className="h-8 shrink-0 px-6 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <span>A4 Standart Marjlar: Üst 20mm, Alt 25mm, Dış 18mm, Cilt 22mm, Bleed 4mm</span>
            <span className="font-mono hidden sm:inline">ESC veya Kapat tuşuna basarak düzenlemeye dönebilirsiniz</span>
          </div>
        </div>
      )}

      {/* Bölüm Başlıkları Yönetimi (Ekle, Düzenle, Çıkar, Sıfırla) */}
      <SectionManagerModal
        isOpen={isSectionManagerOpen}
        onClose={() => setIsSectionManagerOpen(false)}
        sections={sections}
        onSectionsChange={(updated) => {
          setSections(updated);
          if (!updated.includes(category) && updated.length > 0) {
            setCategory(updated[0]);
          }
        }}
        onSelectSection={(selected) => setCategory(selected)}
      />
    </div>
  );
};
