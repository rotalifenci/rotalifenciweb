import React, { useState, useCallback, useRef, useEffect } from 'react';
import { MagazinePage, MagazinePhoto, MagazineCategory } from '../../types/magazine';
import { CATEGORY_THEMES, ALL_CATEGORIES } from '../../config/brand';
import { renderFormattedContent } from '../../utils/richTextFormatter';
import { sanitizePhotoCaption } from '../magazine/SmartPhotoLayout';
import { processFileForMagazine } from '../../utils/fileUploadHelper';
import {
  Edit3, Save, X, RotateCcw, RotateCw, Plus, Trash2,
  Image as ImageIcon, ChevronUp, ChevronDown, ChevronLeft, ChevronRight,
  AlignLeft, Type, Quote, Info, Check, Wand2, Upload, Maximize, Minimize,
  LayoutGrid
} from 'lucide-react';

// ─────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────
interface Props {
  page: MagazinePage;
  issueYear: number;
  issueMonth: string;
  issueNumber: number;
  onUpdatePage: (page: MagazinePage) => void;
  onCycleVariant?: () => void;
  className?: string;
}

type ImagePosition = 'top' | 'bottom' | 'left' | 'right';

// ─────────────────────────────────────────────────────────
// AutoResizing textarea helper
// ─────────────────────────────────────────────────────────
const AutoTextarea: React.FC<{
  value: string;
  onChange: (v: string) => void;
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
  placeholder?: string;
  minRows?: number;
}> = ({ value, onChange, onClick, className = '', placeholder, minRows = 3 }) => {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.style.height = 'auto';
      ref.current.style.height = `${ref.current.scrollHeight}px`;
    }
  }, [value]);

  return (
    <textarea
      ref={ref}
      value={value}
      onChange={e => onChange(e.target.value)}
      onClick={onClick}
      className={className}
      placeholder={placeholder}
      rows={minRows}
      style={{ resize: 'none', overflow: 'hidden' }}
    />
  );
};

// ─────────────────────────────────────────────────────────
// Main InlinePageEditor Component
// ─────────────────────────────────────────────────────────
export const InlinePageEditor: React.FC<Props> = ({
  page,
  issueYear,
  issueMonth,
  issueNumber,
  onUpdatePage,
  onCycleVariant,
  className = '',
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [draft, setDraft] = useState<MagazinePage>({ ...page });
  const [history, setHistory] = useState<MagazinePage[]>([{ ...page }]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [savedStatus, setSavedStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [activePhotoMenu, setActivePhotoMenu] = useState<string | null>(null);
  const [showAddPanel, setShowAddPanel] = useState(false);
  const [editingCaption, setEditingCaption] = useState<string | null>(null);
  const autosaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const addPhotoInputRef = useRef<HTMLInputElement>(null);

  // Sync draft when external page changes (e.g., from another tab)
  useEffect(() => {
    if (!isEditMode) {
      setDraft({ ...page });
    }
  }, [page, isEditMode]);

  // Keyboard shortcuts
  useEffect(() => {
    if (!isEditMode) return;
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        handleRedo();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      } else if (e.key === 'Escape') {
        setActivePhotoMenu(null);
        setShowAddPanel(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isEditMode, historyIndex, history, draft]);

  // ── History management ─────────────────────────────────
  const pushHistory = useCallback((newDraft: MagazinePage) => {
    setHistory(prev => {
      const trimmed = prev.slice(0, historyIndex + 1);
      return [...trimmed, { ...newDraft }];
    });
    setHistoryIndex(prev => prev + 1);
  }, [historyIndex]);

  const updateDraft = useCallback((updates: Partial<MagazinePage>) => {
    setDraft(prev => {
      const newDraft = { ...prev, ...updates };
      pushHistory(newDraft);

      // Autosave with 2s debounce
      if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
      setSavedStatus('saving');
      autosaveTimer.current = setTimeout(() => {
        onUpdatePage(newDraft);
        setSavedStatus('saved');
        setTimeout(() => setSavedStatus('idle'), 2500);
      }, 2000);

      return newDraft;
    });
  }, [pushHistory, onUpdatePage]);

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIdx = historyIndex - 1;
      setHistoryIndex(newIdx);
      setDraft({ ...history[newIdx] });
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIdx = historyIndex + 1;
      setHistoryIndex(newIdx);
      setDraft({ ...history[newIdx] });
    }
  };

  // ── Edit mode controls ─────────────────────────────────
  const handleEnterEdit = () => {
    const fresh = { ...page };
    setDraft(fresh);
    setHistory([fresh]);
    setHistoryIndex(0);
    setSavedStatus('idle');
    setIsEditMode(true);
  };

  const handleSave = () => {
    if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    onUpdatePage(draft);
    setSavedStatus('saved');
    setTimeout(() => setSavedStatus('idle'), 2000);
    setIsEditMode(false);
    setActivePhotoMenu(null);
    setShowAddPanel(false);
  };

  const handleCancel = () => {
    if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    setDraft({ ...page });
    setIsEditMode(false);
    setActivePhotoMenu(null);
    setShowAddPanel(false);
  };

  // ── Photo management ───────────────────────────────────
  const handleReplacePhoto = (photoId: string, file: File) => {
    const url = URL.createObjectURL(file);
    updateDraft({
      photos: draft.photos.map(p =>
        p.id === photoId ? { ...p, url, caption: p.caption } : p
      )
    });
    setActivePhotoMenu(null);
  };

  const handleAddPhoto = async (file: File) => {
    try {
      const isFirst = (draft.photos || []).length === 0;
      const res = await processFileForMagazine(file, isFirst);
      updateDraft({
        photos: [...(draft.photos || []), res.photo],
        layoutSettings: {
          ...(draft.layoutSettings || {}),
          imagePosition: (draft.layoutSettings?.imagePosition as any) || res.recommendedPosition,
          imageScale: draft.layoutSettings?.imageScale ?? res.recommendedScale
        }
      });
    } catch (err) {
      console.error(err);
      const url = URL.createObjectURL(file);
      const newPhoto: MagazinePhoto = {
        id: `photo-${Date.now()}`,
        url,
        caption: file.name.replace(/\.[^/.]+$/, ''),
      };
      updateDraft({ photos: [...(draft.photos || []), newPhoto] });
    }
    setShowAddPanel(false);
  };

  const handleDeletePhoto = (photoId: string) => {
    updateDraft({ photos: draft.photos.filter(p => p.id !== photoId) });
    setActivePhotoMenu(null);
  };

  const handleCaptionChange = (photoId: string, caption: string) => {
    updateDraft({
      photos: draft.photos.map(p => p.id === photoId ? { ...p, caption } : p)
    });
  };

  const handleImageScaleChange = (delta: number) => {
    const currentScale = draft.layoutSettings?.imageScale ?? 100;
    const newScale = Math.max(30, Math.min(100, currentScale + delta));
    updateDraft({ layoutSettings: { ...(draft.layoutSettings || {}), imageScale: newScale } });
  };

  const handleImagePosition = (pos: ImagePosition) => {
    updateDraft({ layoutSettings: { ...(draft.layoutSettings || {}), imagePosition: pos } });
    setActivePhotoMenu(null);
  };

  const handleColumnCount = (cols: 2 | 3) => {
    updateDraft({ layoutSettings: { ...(draft.layoutSettings || {}), columnCount: cols } });
  };

  // ── Add content blocks ─────────────────────────────────
  const addHeading = () => {
    updateDraft({ content: (draft.content || '') + '\n\n### Yeni Ara Başlık' });
    setShowAddPanel(false);
  };

  const addParagraph = () => {
    updateDraft({ content: (draft.content || '') + '\n\nYeni paragraf metni buraya ekleyin.' });
    setShowAddPanel(false);
  };

  const addCallout = () => {
    updateDraft({ content: (draft.content || '') + '\n\n> 💡 Önemli bilgi veya not buraya yazılır.' });
    setShowAddPanel(false);
  };

  const addPullQuote = () => {
    if (!draft.pullQuote) {
      updateDraft({ pullQuote: 'Vurgu cümlesi buraya yazın...' });
    }
    setShowAddPanel(false);
  };

  const addInfoBox = () => {
    updateDraft({ content: (draft.content || '') + '\n\n> 💡 **Bilgi Kutusu:** Buraya önemli bir bilgi veya istatistik ekleyin.' });
    setShowAddPanel(false);
  };

  // ─────────────────────────────────────────────────────
  // Derived
  // ─────────────────────────────────────────────────────
  const theme = CATEGORY_THEMES[draft.category] || CATEGORY_THEMES['Okulumuzdan'] || {
    color: '#0284C7', label: draft.category, bgLight: '#F0F9FF', border: '#BAE6FD', text: '#0C4A6E', pptxColor: '0284C7', iconName: 'default'
  };
  const mainPhoto = draft.photos?.[0];
  const imageScale = draft.layoutSettings?.imageScale ?? 100;
  const imagePosition = (draft.layoutSettings?.imagePosition as ImagePosition) ?? 'top';
  const columnCount = draft.layoutSettings?.columnCount ?? 2;

  // ─────────────────────────────────────────────────────
  // Common editable field class
  // ─────────────────────────────────────────────────────
  const editFieldClass = (base: string) =>
    isEditMode
      ? `${base} ring-2 ring-sky-400/60 ring-offset-1 rounded focus:ring-sky-500 focus:outline-none bg-sky-50/50 cursor-text transition-all`
      : `${base} cursor-default`;

  // ─────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────
  return (
    <div className={`relative flex flex-col ${className}`}>

      {/* ── EDIT TOOLBAR ────────────────────────────────────────── */}
      <div className={`flex items-center gap-1.5 sm:gap-2 mb-3 flex-wrap transition-all ${isEditMode ? 'justify-between' : 'justify-end'}`}>
        {isEditMode ? (
          <>
            {/* Left: Save indicator + Undo/Redo */}
            <div className="flex items-center gap-1.5">
              {/* Autosave status */}
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border transition-all ${
                savedStatus === 'saved'
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                  : savedStatus === 'saving'
                  ? 'bg-amber-50 border-amber-300 text-amber-700 animate-pulse'
                  : 'bg-slate-100 border-slate-200 text-slate-500'
              }`}>
                {savedStatus === 'saved' ? '✓ Kaydedildi' : savedStatus === 'saving' ? '⏳ Kaydediliyor...' : '✏️ Düzenleme Modu'}
              </span>

              {/* Undo */}
              <button
                type="button"
                onClick={handleUndo}
                disabled={historyIndex <= 0}
                title="Geri Al (Ctrl+Z)"
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-30 text-slate-700 border border-slate-200 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              {/* Redo */}
              <button
                type="button"
                onClick={handleRedo}
                disabled={historyIndex >= history.length - 1}
                title="Yinele (Ctrl+Y)"
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-30 text-slate-700 border border-slate-200 transition-colors"
              >
                <RotateCw className="w-3.5 h-3.5" />
              </button>

              {/* Redesign layout */}
              {onCycleVariant && (
                <button
                  type="button"
                  onClick={onCycleVariant}
                  title="Tasarımı Yeniden Düzenle"
                  className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-violet-50 hover:bg-violet-100 text-violet-700 border border-violet-200 text-[11px] font-semibold transition-colors"
                >
                  <Wand2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Tasarımı Değiştir</span>
                </button>
              )}

              {/* Column count toggle */}
              <button
                type="button"
                onClick={() => handleColumnCount(columnCount === 2 ? 3 : 2)}
                title={`${columnCount} Sütun — Değiştir`}
                className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-[11px] font-semibold transition-colors"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>{columnCount} Sütun</span>
              </button>
            </div>

            {/* Right: Add Content + Add File/PDF + Cancel + Save */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {/* Dosya / Görsel / PDF Ekle Butonu */}
              <button
                type="button"
                onClick={() => addPhotoInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold shadow-xs transition-colors cursor-pointer"
                title="Yüksek kaliteli PNG, JPG, WebP veya PDF dosyası ekle"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Dosya / Görsel / PDF Ekle</span>
              </button>

              {/* Add Content */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowAddPanel(v => !v)}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition-colors shadow-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>İçerik Ekle</span>
                </button>

                {showAddPanel && (
                  <div className="absolute right-0 top-full mt-1.5 z-50 bg-white rounded-xl border border-slate-200 shadow-2xl p-2 min-w-[190px] flex flex-col gap-1">
                    <p className="text-[9px] uppercase tracking-widest text-slate-400 font-bold px-2 pt-1 pb-0.5">Blok Ekle</p>
                    <button onClick={addParagraph} className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 text-slate-700 text-xs font-medium text-left transition-colors">
                      <AlignLeft className="w-3.5 h-3.5 text-slate-500" /> Metin Paragrafı
                    </button>
                    <button onClick={addHeading} className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 text-slate-700 text-xs font-medium text-left transition-colors">
                      <Type className="w-3.5 h-3.5 text-sky-600" /> Ara Başlık
                    </button>
                    <button onClick={addPullQuote} className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 text-slate-700 text-xs font-medium text-left transition-colors">
                      <Quote className="w-3.5 h-3.5 text-amber-600" /> Vurgu / Alıntı
                    </button>
                    <button onClick={addCallout} className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 text-slate-700 text-xs font-medium text-left transition-colors">
                      <Info className="w-3.5 h-3.5 text-sky-600" /> Bilgi Notu (Callout)
                    </button>
                    <button onClick={addInfoBox} className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 text-slate-700 text-xs font-medium text-left transition-colors">
                      <Info className="w-3.5 h-3.5 text-emerald-600" /> Bilgi Kutusu
                    </button>
                    <div className="border-t border-slate-100 mt-1 pt-1">
                      <button
                        onClick={() => { setShowAddPanel(false); addPhotoInputRef.current?.click(); }}
                        className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 text-slate-700 text-xs font-medium text-left transition-colors w-full"
                      >
                        <ImageIcon className="w-3.5 h-3.5 text-indigo-600" /> Yeni Görsel / PDF Ekle
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Cancel */}
              <button
                type="button"
                onClick={handleCancel}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 text-[11px] font-bold transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>İptal</span>
              </button>

              {/* Save */}
              <button
                type="button"
                onClick={handleSave}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-[11px] font-bold transition-colors shadow-xs cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Kaydet</span>
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => addPhotoInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors shadow-xs cursor-pointer"
              title="Yüksek kaliteli PNG, JPG, WebP veya PDF dosyası ekle"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>📁 Dosya / Görsel / PDF Ekle</span>
            </button>
            <button
              type="button"
              onClick={handleEnterEdit}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition-colors shadow-xs cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>✏️ Sayfayı Düzenle</span>
            </button>
          </div>
        )}
      </div>

      {/* Hidden file inputs */}
      <input ref={addPhotoInputRef} type="file" accept="image/jpeg,image/png,image/webp,application/pdf" className="hidden" onChange={e => { if (e.target.files?.[0]) handleAddPhoto(e.target.files[0]); e.target.value = ''; }} />
      <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp,application/pdf" className="hidden" onChange={e => { if (e.target.files?.[0] && activePhotoMenu) handleReplacePhoto(activePhotoMenu, e.target.files[0]); e.target.value = ''; }} />

      {/* ── A4 PAGE ──────────────────────────────────────────────── */}
      <div
        id="active-preview-page"
        className="print-page a4-page-renderer relative bg-[#FDFBF7] text-slate-900 shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
        style={{
          width: '210mm',
          height: '297mm',
          maxWidth: '210mm',
          maxHeight: '297mm',
          margin: '0 auto',
          boxSizing: 'border-box',
          position: 'relative',
          overflow: 'hidden',
          paddingTop: '16mm',
          paddingBottom: '20mm',
          paddingLeft: '18mm',
          paddingRight: '18mm'
        }}
        onClick={() => { if (isEditMode) { setActivePhotoMenu(null); setShowAddPanel(false); } }}
      >
        {/* ── RUNNING HEADER (16mm üst boşluğun içinde) ── */}
        <header className="min-h-[36px] shrink-0 flex items-center justify-between border-b border-slate-200/90 pb-1.5 mb-2 bg-transparent whitespace-nowrap overflow-visible leading-normal">
          {/* Sol: Dergi Bölüm Başlığı */}
          <div className="w-1/3 flex items-center justify-start min-w-0">
            {isEditMode ? (
              <select
                value={draft.category}
                onChange={e => updateDraft({ category: e.target.value as MagazineCategory })}
                onClick={e => e.stopPropagation()}
                className="inline-flex items-center justify-center text-[8.5px] sm:text-[9.5px] font-black uppercase tracking-wider px-2 py-0.5 rounded text-white cursor-pointer pointer-events-auto border-none outline-none appearance-none shrink-0 shadow-2xs truncate max-w-full leading-normal"
                style={{ backgroundColor: theme.color }}
              >
                {ALL_CATEGORIES.map(cat => (
                  <option key={cat} value={cat} style={{ backgroundColor: '#fff', color: '#1e293b' }}>{cat}</option>
                ))}
              </select>
            ) : (
              <span className="inline-flex items-center justify-center text-[8.5px] sm:text-[9.5px] font-black uppercase tracking-wider px-2 py-0.5 rounded text-white shadow-2xs shrink-0 truncate max-w-full leading-normal" style={{ backgroundColor: theme.color }}>
                {draft.category}
              </span>
            )}
          </div>

          {/* Orta: Okul Logosu */}
          <div className="w-1/3 flex items-center justify-center min-w-0">
            <img
              src="/photo_2026-09-06_21-01-05.jpg"
              onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/maider-logo.png'; }}
              alt="Mehmet Akif İnan Ortaokulu Logo"
              className="h-8 w-8 sm:h-9 sm:w-9 object-contain rounded-full shadow-2xs border border-slate-200 shrink-0"
            />
          </div>

          {/* Sağ: Yıl, Ay, Sayı */}
          <div className="w-1/3 flex items-center justify-end text-[9px] sm:text-[10px] font-medium tracking-wide text-slate-600 shrink-0 ml-auto">
            <span>Yıl: {issueYear}</span>
            <span className="text-slate-300 mx-1">•</span>
            <span>Ay: {issueMonth}</span>
            <span className="text-slate-300 mx-1">•</span>
            <span className="font-bold text-slate-900">Sayı: {issueNumber}</span>
          </div>
        </header>

        {/* ── MAIN CONTENT AREA (İçerik Taşma Koruması: height calc(100% - 40mm)) ── */}
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

          {/* Title area */}
          <div className="shrink-0 mb-1.5">
            {isEditMode ? (
              <input
                type="text"
                value={draft.title}
                onChange={e => updateDraft({ title: e.target.value })}
                onClick={e => e.stopPropagation()}
                placeholder="Makale Başlığı"
                className="w-full font-editorial font-black leading-tight tracking-tight text-slate-900 text-xl bg-transparent border-b-2 border-sky-400 focus:outline-none focus:border-sky-600 py-0.5 placeholder:text-slate-300"
                style={{ fontFamily: "'Playfair Display', 'DM Serif Display', Georgia, serif" }}
              />
            ) : (
              <h1 className="font-editorial font-black leading-tight tracking-tight text-slate-900 text-xl" style={{ fontFamily: "'Playfair Display', 'DM Serif Display', Georgia, serif" }}>
                {draft.title}
              </h1>
            )}

            {isEditMode ? (
              <input
                type="text"
                value={draft.subtitle || ''}
                onChange={e => updateDraft({ subtitle: e.target.value })}
                onClick={e => e.stopPropagation()}
                placeholder="Alt başlık / kısa spot metin (isteğe bağlı)"
                className="w-full text-xs italic text-slate-600 bg-transparent border-b border-sky-300/60 focus:outline-none focus:border-sky-400 mt-1 py-0.5 placeholder:text-slate-300"
              />
            ) : (
              draft.subtitle && (
                <p className="text-xs italic text-slate-600 mt-1 border-b border-slate-200 pb-1">{draft.subtitle}</p>
              )
            )}
          </div>

          {/* Pull Quote editor (if exists) */}
          {(draft.pullQuote || isEditMode) && (
            <div className="shrink-0 mb-1.5">
              {isEditMode ? (
                <div className="relative group" onClick={e => e.stopPropagation()}>
                  <input
                    type="text"
                    value={draft.pullQuote || ''}
                    onChange={e => updateDraft({ pullQuote: e.target.value })}
                    placeholder="Vurgu cümlesi (isteğe bağlı)"
                    className="w-full text-xs italic font-semibold bg-transparent border-l-4 pl-2.5 py-1 focus:outline-none placeholder:text-slate-300"
                    style={{ borderColor: theme.color, color: theme.color }}
                  />
                  {draft.pullQuote && (
                    <button
                      type="button"
                      onClick={() => updateDraft({ pullQuote: undefined })}
                      className="absolute right-1 top-1 text-rose-400 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ) : draft.pullQuote ? (
                <div className="border-l-4 pl-2.5 py-0.5" style={{ borderColor: theme.color }}>
                  <p className="text-xs italic font-semibold" style={{ color: theme.color }}>{draft.pullQuote}</p>
                </div>
              ) : null}
            </div>
          )}

          {/* Top Full-Width Image Block (Outside multi-column container so it spans full width and never squeezes into 1 column) */}
          {mainPhoto && imagePosition === 'top' && (
            <div
              className="w-full block clear-both col-span-full mb-2.5 shrink-0 overflow-hidden relative group"
              style={{ width: '100%', display: 'block', clear: 'both' }}
              onClick={e => { if (isEditMode) { e.stopPropagation(); setActivePhotoMenu(activePhotoMenu === mainPhoto.id ? null : mainPhoto.id); } }}
            >
              <img
                src={mainPhoto.url}
                alt={sanitizePhotoCaption(mainPhoto.caption) || draft.title}
                className={`w-full rounded-lg shadow-xs object-cover ${isEditMode ? 'cursor-pointer ring-2 ring-transparent group-hover:ring-sky-400 transition-all' : ''}`}
                style={{ maxHeight: `${Math.round(imageScale * 1.8)}px`, width: '100%', display: 'block' }}
                loading="lazy"
              />
              {/* Caption */}
              {isEditMode && editingCaption === mainPhoto.id ? (
                <input
                  type="text"
                  value={mainPhoto.caption || ''}
                  autoFocus
                  onChange={e => handleCaptionChange(mainPhoto.id, e.target.value)}
                  onBlur={() => setEditingCaption(null)}
                  onClick={e => e.stopPropagation()}
                  className="w-full text-[10px] text-gray-600 italic text-center bg-white border border-sky-300 rounded px-1 py-0.5 mt-0.5 focus:outline-none"
                  placeholder="Görsel açıklaması..."
                />
              ) : (
                sanitizePhotoCaption(mainPhoto.caption) && (
                  <figcaption
                    className={`text-[10px] text-gray-500 italic text-center mt-0.5 ${isEditMode ? 'cursor-pointer hover:text-sky-600 hover:underline' : ''}`}
                    onClick={e => { if (isEditMode) { e.stopPropagation(); setEditingCaption(mainPhoto.id); } }}
                  >
                    {sanitizePhotoCaption(mainPhoto.caption)}
                  </figcaption>
                )
              )}

              {/* Image context menu */}
              {isEditMode && activePhotoMenu === mainPhoto.id && (
                <div
                  className="absolute left-0 top-full mt-1 z-50 bg-white rounded-xl border border-slate-200 shadow-2xl p-1.5 min-w-[180px]"
                  onClick={e => e.stopPropagation()}
                >
                  <p className="text-[9px] uppercase tracking-widest text-slate-400 font-bold px-2 pt-1 pb-1">Görsel İşlemleri</p>

                  {/* Replace */}
                  <button onClick={() => fileInputRef.current?.click()} className="w-full flex items-center gap-2 px-2.5 py-1.5 hover:bg-slate-100 rounded-lg text-xs text-slate-700 text-left">
                    <Upload className="w-3.5 h-3.5 text-sky-600" /> Görseli Değiştir
                  </button>
                  {/* Edit caption */}
                  <button onClick={() => { setEditingCaption(mainPhoto.id); setActivePhotoMenu(null); }} className="w-full flex items-center gap-2 px-2.5 py-1.5 hover:bg-slate-100 rounded-lg text-xs text-slate-700 text-left">
                    <Type className="w-3.5 h-3.5 text-slate-500" /> Açıklamayı Düzenle
                  </button>

                  {/* Size controls */}
                  <div className="flex items-center gap-1 px-2 py-1 border-t border-slate-100 mt-1">
                    <span className="text-[10px] text-slate-500 mr-1">Boyut:</span>
                    <button onClick={() => handleImageScaleChange(-10)} className="p-1 rounded hover:bg-slate-100 text-slate-600"><Minimize className="w-3 h-3" /></button>
                    <span className="text-[10px] font-mono text-slate-700 w-8 text-center">{imageScale}%</span>
                    <button onClick={() => handleImageScaleChange(10)} className="p-1 rounded hover:bg-slate-100 text-slate-600"><Maximize className="w-3 h-3" /></button>
                  </div>

                  {/* Position controls */}
                  <div className="px-2 py-1 border-t border-slate-100">
                    <p className="text-[9px] text-slate-400 mb-1">Konum:</p>
                    <div className="grid grid-cols-4 gap-1">
                      {(['top', 'left', 'right', 'bottom'] as const).map(pos => (
                        <button
                          key={pos}
                          onClick={() => handleImagePosition(pos)}
                          className={`p-1 rounded text-[9px] font-medium border transition-colors ${imagePosition === pos ? 'bg-sky-100 border-sky-400 text-sky-700' : 'border-slate-200 hover:bg-slate-100 text-slate-600'}`}
                        >
                          {pos === 'top' ? '⬆' : pos === 'left' ? '⬅' : pos === 'right' ? '➡' : '⬇'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Delete */}
                  <div className="border-t border-slate-100 mt-1 pt-1">
                    <button onClick={() => handleDeletePhoto(mainPhoto.id)} className="w-full flex items-center gap-2 px-2.5 py-1.5 hover:bg-rose-50 rounded-lg text-xs text-rose-600 text-left font-medium">
                      <Trash2 className="w-3.5 h-3.5" /> Görseli Sil
                    </button>
                  </div>
                </div>
              )}

              {/* Edit indicator (hover) */}
              {isEditMode && activePhotoMenu !== mainPhoto.id && (
                <div className="absolute top-1 right-1 bg-sky-600/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  ✏️ Düzenle
                </div>
              )}
            </div>
          )}

          {/* SINGLE-COLUMN BODY FLOW (display: block, floated image, single column text wrap) */}
          <div
            className="w-full block overflow-hidden text-xs leading-relaxed text-justify font-serif text-slate-800"
            style={{
              display: 'block',
              width: '100%',
              overflow: 'hidden'
            }}
          >

            {/* Photo block for float left/right in edit mode */}
            {mainPhoto && isEditMode && (imagePosition === 'left' || imagePosition === 'right') && (
              <div
                className={`break-inside-avoid mb-2.5 block relative group ${imagePosition === 'left' ? 'float-left mr-3.5 mb-2' : 'float-right ml-3.5 mb-2'}`}
                style={{ width: `${Math.round(imageScale * 0.45)}%` }}
                onClick={e => { e.stopPropagation(); setActivePhotoMenu(activePhotoMenu === mainPhoto.id ? null : mainPhoto.id); }}
              >
                <img
                  src={mainPhoto.url}
                  alt={sanitizePhotoCaption(mainPhoto.caption) || draft.title}
                  className="w-full rounded-lg shadow-xs object-cover cursor-pointer ring-2 ring-transparent group-hover:ring-sky-400 transition-all"
                  style={{ maxHeight: `${Math.round(imageScale * 1.8)}px` }}
                  loading="lazy"
                />
                {/* Caption */}
                {editingCaption === mainPhoto.id ? (
                  <input
                    type="text"
                    value={mainPhoto.caption || ''}
                    autoFocus
                    onChange={e => handleCaptionChange(mainPhoto.id, e.target.value)}
                    onBlur={() => setEditingCaption(null)}
                    onClick={e => e.stopPropagation()}
                    className="w-full text-[10px] text-gray-600 italic text-center bg-white border border-sky-300 rounded px-1 py-0.5 mt-0.5 focus:outline-none"
                    placeholder="Görsel açıklaması..."
                  />
                ) : (
                  sanitizePhotoCaption(mainPhoto.caption) && (
                    <figcaption
                      className="text-[10px] text-gray-500 italic text-center mt-0.5 cursor-pointer hover:text-sky-600 hover:underline"
                      onClick={e => { e.stopPropagation(); setEditingCaption(mainPhoto.id); }}
                    >
                      {sanitizePhotoCaption(mainPhoto.caption)}
                    </figcaption>
                  )
                )}

                {/* Image context menu */}
                {activePhotoMenu === mainPhoto.id && (
                  <div
                    className="absolute left-0 top-full mt-1 z-50 bg-white rounded-xl border border-slate-200 shadow-2xl p-1.5 min-w-[180px]"
                    onClick={e => e.stopPropagation()}
                  >
                    <p className="text-[9px] uppercase tracking-widest text-slate-400 font-bold px-2 pt-1 pb-1">Görsel İşlemleri</p>

                    {/* Replace */}
                    <button onClick={() => fileInputRef.current?.click()} className="w-full flex items-center gap-2 px-2.5 py-1.5 hover:bg-slate-100 rounded-lg text-xs text-slate-700 text-left">
                      <Upload className="w-3.5 h-3.5 text-sky-600" /> Görseli Değiştir
                    </button>
                    {/* Edit caption */}
                    <button onClick={() => { setEditingCaption(mainPhoto.id); setActivePhotoMenu(null); }} className="w-full flex items-center gap-2 px-2.5 py-1.5 hover:bg-slate-100 rounded-lg text-xs text-slate-700 text-left">
                      <Type className="w-3.5 h-3.5 text-slate-500" /> Açıklamayı Düzenle
                    </button>

                    {/* Size controls */}
                    <div className="flex items-center gap-1 px-2 py-1 border-t border-slate-100 mt-1">
                      <span className="text-[10px] text-slate-500 mr-1">Boyut:</span>
                      <button onClick={() => handleImageScaleChange(-10)} className="p-1 rounded hover:bg-slate-100 text-slate-600"><Minimize className="w-3 h-3" /></button>
                      <span className="text-[10px] font-mono text-slate-700 w-8 text-center">{imageScale}%</span>
                      <button onClick={() => handleImageScaleChange(10)} className="p-1 rounded hover:bg-slate-100 text-slate-600"><Maximize className="w-3 h-3" /></button>
                    </div>

                    {/* Position controls */}
                    <div className="px-2 py-1 border-t border-slate-100">
                      <p className="text-[9px] text-slate-400 mb-1">Konum:</p>
                      <div className="grid grid-cols-4 gap-1">
                        {(['top', 'left', 'right', 'bottom'] as const).map(pos => (
                          <button
                            key={pos}
                            onClick={() => handleImagePosition(pos)}
                            className={`p-1 rounded text-[9px] font-medium border transition-colors ${imagePosition === pos ? 'bg-sky-100 border-sky-400 text-sky-700' : 'border-slate-200 hover:bg-slate-100 text-slate-600'}`}
                          >
                            {pos === 'top' ? '⬆' : pos === 'left' ? '⬅' : pos === 'right' ? '➡' : '⬇'}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Delete */}
                    <div className="border-t border-slate-100 mt-1 pt-1">
                      <button onClick={() => handleDeletePhoto(mainPhoto.id)} className="w-full flex items-center gap-2 px-2.5 py-1.5 hover:bg-rose-50 rounded-lg text-xs text-rose-600 text-left font-medium">
                        <Trash2 className="w-3.5 h-3.5" /> Görseli Sil
                      </button>
                    </div>
                  </div>
                )}

                {/* Edit indicator (hover) */}
                {activePhotoMenu !== mainPhoto.id && (
                  <div className="absolute top-1 right-1 bg-sky-600/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    ✏️ Düzenle
                  </div>
                )}
              </div>
            )}

            {/* Main content text */}
            {isEditMode ? (
              <AutoTextarea
                value={draft.content || ''}
                onChange={v => updateDraft({ content: v })}
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
                className="w-full bg-transparent text-[12pt] leading-[1.45] tracking-[0.015em] text-slate-800 font-serif focus:outline-none resize-none border-none column-span-all"
                placeholder="Makale içeriğini buraya yazın...

Biçimlendirme ipuçları:
### Ara Başlık
**kalın metin**
*italik metin*
> Bilgi notu"
                minRows={8}
              />
            ) : (
              <>
                {(() => {
                  const inlineFloatNode = (mainPhoto && (imagePosition === 'left' || imagePosition === 'right')) ? (
                    <span
                      className={`block select-none ${imagePosition === 'left' ? 'float-left mr-3.5 mb-2' : 'float-right ml-3.5 mb-2'}`}
                      style={{
                        width: `${Math.round(imageScale * 0.45)}%`,
                        maxWidth: '280px',
                        clear: imagePosition === 'left' ? 'left' : 'right'
                      }}
                    >
                      <img
                        src={mainPhoto.url}
                        alt={sanitizePhotoCaption(mainPhoto.caption) || draft.title}
                        className="w-full rounded-lg shadow-xs object-cover"
                        style={{ maxHeight: `${Math.round(imageScale * 1.8)}px` }}
                        loading="eager"
                      />
                      {sanitizePhotoCaption(mainPhoto.caption) && (
                        <span className="block text-[10px] text-gray-500 italic text-center mt-1">
                          {sanitizePhotoCaption(mainPhoto.caption)}
                        </span>
                      )}
                    </span>
                  ) : null;

                  return renderFormattedContent(draft.content || '', theme.color, true, inlineFloatNode);
                })()}
              </>
            )}

            {/* Bottom photo */}
            {mainPhoto && imagePosition === 'bottom' && (
              <div
                className="break-inside-avoid mt-2.5 block relative group"
                onClick={e => { if (isEditMode) { e.stopPropagation(); setActivePhotoMenu(activePhotoMenu === mainPhoto.id ? null : mainPhoto.id); } }}
              >
                <img
                  src={mainPhoto.url}
                  alt={sanitizePhotoCaption(mainPhoto.caption) || draft.title}
                  className={`w-full rounded-lg shadow-xs object-cover ${isEditMode ? 'cursor-pointer ring-2 ring-transparent group-hover:ring-sky-400 transition-all' : ''}`}
                  style={{ maxHeight: `${Math.round(imageScale * 1.5)}px` }}
                />
              </div>
            )}

            {/* Additional photos */}
            {draft.photos.slice(1).map((ph) => (
              <div
                key={ph.id}
                className="break-inside-avoid mt-2 block relative group"
                onClick={e => { if (isEditMode) { e.stopPropagation(); setActivePhotoMenu(activePhotoMenu === ph.id ? null : ph.id); } }}
              >
                <img
                  src={ph.url}
                  alt={sanitizePhotoCaption(ph.caption) || ''}
                  className={`w-full rounded-lg shadow-xs object-cover ${isEditMode ? 'cursor-pointer ring-2 ring-transparent group-hover:ring-sky-400 transition-all' : ''}`}
                  style={{ maxHeight: '120px' }}
                />
                {sanitizePhotoCaption(ph.caption) && (
                  <figcaption className="text-[10px] text-gray-500 italic text-center mt-0.5">
                    {sanitizePhotoCaption(ph.caption)}
                  </figcaption>
                )}
                {/* Additional photo context menu */}
                {isEditMode && activePhotoMenu === ph.id && (
                  <div className="absolute left-0 top-full mt-1 z-50 bg-white rounded-xl border border-slate-200 shadow-2xl p-1.5 min-w-[160px]" onClick={e => e.stopPropagation()}>
                    <button onClick={() => { setEditingCaption(ph.id); setActivePhotoMenu(null); }} className="w-full flex items-center gap-2 px-2.5 py-1.5 hover:bg-slate-100 rounded-lg text-xs text-slate-700 text-left">
                      <Type className="w-3.5 h-3.5" /> Açıklamayı Düzenle
                    </button>
                    <button onClick={() => handleDeletePhoto(ph.id)} className="w-full flex items-center gap-2 px-2.5 py-1.5 hover:bg-rose-50 rounded-lg text-xs text-rose-600 text-left font-medium">
                      <Trash2 className="w-3.5 h-3.5" /> Görseli Sil
                    </button>
                  </div>
                )}
                {isEditMode && editingCaption === ph.id && (
                  <input
                    type="text"
                    value={ph.caption || ''}
                    autoFocus
                    onChange={e => handleCaptionChange(ph.id, e.target.value)}
                    onBlur={() => setEditingCaption(null)}
                    onClick={e => e.stopPropagation()}
                    className="w-full text-[10px] text-gray-600 italic text-center bg-white border border-sky-300 rounded px-1 py-0.5 mt-0.5 focus:outline-none"
                  />
                )}
              </div>
            ))}
          </div>
        </main>

        {/* ── KAYNAKÇA (En alt bölümün hemen üstünde, tam okunacak netlikte ama küçük yazı boyutunda) ── */}
        {(draft.sourceReference || isEditMode) && (
          <div className="shrink-0 mb-2 py-1 px-3 bg-slate-50/90 rounded-lg border border-slate-200/70 flex items-center gap-1.5 text-[9.5px] text-slate-600 italic whitespace-nowrap overflow-visible z-10" onClick={e => e.stopPropagation()}>
            <span className="font-bold not-italic text-slate-800 shrink-0">Kaynak:</span>
            {isEditMode ? (
              <input
                type="text"
                value={draft.sourceReference || ''}
                onChange={e => updateDraft({ sourceReference: e.target.value })}
                placeholder="Kaynak / Referans URL veya Kitap Adı..."
                className="text-[9px] sm:text-[9.5px] italic bg-sky-50 border border-sky-300 rounded px-1.5 py-0.5 w-full max-w-sm focus:outline-none focus:border-sky-500 text-slate-700"
              />
            ) : (
              <span className="truncate text-slate-600" title={draft.sourceReference}>
                {draft.sourceReference}
              </span>
            )}
          </div>
        )}

        {/* ── RUNNING FOOTER (En altta: 15mm sınırında, tam ortalanmış sayfa numarası) ── */}
        <footer
          className="shrink-0 flex items-center justify-between border-t border-slate-200/90 bg-transparent text-[9.5px] sm:text-[10px] text-slate-500 font-medium z-30 overflow-hidden"
          style={{
            position: 'absolute',
            bottom: '20mm',
            left: '18mm',
            right: '18mm',
            height: '15mm',
            boxSizing: 'border-box'
          }}
        >
          {/* Sol: Yazar adı ve branşı */}
          <div className="w-1/3 flex items-center gap-1.5 truncate min-w-0" onClick={e => e.stopPropagation()}>
            {isEditMode ? (
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  value={draft.author || ''}
                  onChange={e => updateDraft({ author: e.target.value })}
                  placeholder="Yazar adı"
                  className="text-[10px] font-bold bg-sky-50 border border-sky-300 rounded px-1.5 py-0.5 w-24 focus:outline-none focus:border-sky-500"
                />
                <input
                  type="text"
                  value={draft.authorRole || ''}
                  onChange={e => updateDraft({ authorRole: e.target.value })}
                  placeholder="Branş"
                  className="text-[9px] bg-sky-50 border border-sky-300 rounded px-1.5 py-0.5 w-20 focus:outline-none focus:border-sky-500 text-slate-600"
                />
              </div>
            ) : (
              <>
                <span className="font-semibold text-slate-800 shrink-0 truncate">
                  {draft.author ? draft.author : 'MAİDER Ekibi'}
                </span>
                {draft.authorRole && (
                  <span className="text-slate-400 shrink-0 truncate">• {draft.authorRole}</span>
                )}
              </>
            )}
          </div>

          {/* TAM ORTA: Sayfa Numarası (Alttan kırpılmayan, mükemmel ortalanmış) */}
          <div className="w-1/3 flex items-center justify-center shrink-0 my-auto">
            <span className="inline-flex items-center justify-center min-w-[28px] h-6 px-2 rounded-md bg-slate-100 text-slate-700 font-mono font-black text-xs border border-slate-200 shadow-2xs leading-none">
              {page.pageNumber}
            </span>
          </div>

          {/* Sağ: Mehmet Akif İnan Ortaokulu */}
          <div className="w-1/3 flex items-center justify-end text-slate-600 font-semibold truncate text-right shrink-0 ml-auto">
            <span>Mehmet Akif İnan Ortaokulu</span>
          </div>
        </footer>
      </div>

      {/* ── Edit mode hint text ── */}
      {isEditMode && (
        <p className="text-center text-[10px] text-slate-400 mt-2">
          💡 Alanları tıklayarak düzenleyin • 📷 Görsele tıklayarak menü açın • Ctrl+Z Geri Al • Ctrl+S Kaydet
        </p>
      )}
    </div>
  );
};
