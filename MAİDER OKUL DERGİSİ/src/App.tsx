import React, { useState, useEffect, useMemo } from 'react';
import { MagazineIssue, ArticleItem, MagazinePage, PreflightReport } from './types/magazine';
import { DEFAULT_MAIDER_ISSUE, createYearlyIssues } from './mock/defaultIssue';
import { generateSmartLayout, cycleDesignVariant } from './services/smartLayout';
import { exportIssueToPptx } from './services/pptxExporter';
import { exportPageToPng, exportIssueToPdf } from './services/pdfExporter';
import { runPreflightAudit } from './services/preflightChecker';
import {
  saveAllIssuesToStorage,
  loadAllIssuesFromStorage,
  saveActiveMonthIndex,
  loadActiveMonthIndex,
  exportProjectToJson,
  importProjectFromJson,
} from './services/storageService';
import confetti from 'canvas-confetti';

import { Navbar } from './components/layout/Navbar';
import { PublicationControlBar } from './components/layout/PublicationControlBar';
import { Dashboard } from './components/dashboard/Dashboard';
import { ContentForm } from './components/editor/ContentForm';
import { ManualAdjustDrawer } from './components/editor/ManualAdjustDrawer';
import { PreflightModal } from './components/editor/PreflightModal';
import { IssueModal } from './components/dashboard/IssueModal';
import { PageThumbnailGrid } from './components/magazine/PageThumbnailGrid';
import { MagazinePreview } from './components/magazine/MagazinePreview';
import { FullscreenReader } from './components/magazine/FullscreenReader';
import { PageRenderer } from './components/magazine/PageRenderer';
import { InlinePageEditor } from './components/editor/InlinePageEditor';
import { AiStudio } from './components/studio/AiStudio';
import { LoginGate } from './components/auth/LoginGate';

export function App() {
  // All 12 monthly issues initialized and persisted cleanly
  const [issues, setIssues] = useState<MagazineIssue[]>(() => {
    const saved = loadAllIssuesFromStorage();
    if (saved && saved.length > 0) {
      return saved;
    }
    return createYearlyIssues();
  });

  const [activeMonthIndex, setActiveMonthIndex] = useState<number>(() => {
    return loadActiveMonthIndex();
  });

  // Current active issue computed safely
  const currentIssue = useMemo(() => {
    const found = issues.find(i => i.monthIndex === activeMonthIndex);
    return found || issues[0] || DEFAULT_MAIDER_ISSUE;
  }, [issues, activeMonthIndex]);

  const [activeTab, setActiveTab] = useState<'dashboard' | 'studio' | 'editor' | 'pages' | 'preview'>('dashboard');
  const [activePageIndex, setActivePageIndex] = useState<number>(0);
  const [editingArticle, setEditingArticle] = useState<ArticleItem | null>(null);

  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [isPreflightModalOpen, setIsPreflightModalOpen] = useState(false);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
  const [isAdjustDrawerOpen, setIsAdjustDrawerOpen] = useState(false);

  const [isExportingPptx, setIsExportingPptx] = useState(false);
  const [exportStatusText, setExportStatusText] = useState('');
  const [preflightReport, setPreflightReport] = useState<PreflightReport>(() => runPreflightAudit(currentIssue));

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return (
      localStorage.getItem('maider_auth') === 'authenticated' ||
      sessionStorage.getItem('maider_auth') === 'authenticated'
    );
  });

  const handleLogout = () => {
    localStorage.removeItem('maider_auth');
    sessionStorage.removeItem('maider_auth');
    setIsAuthenticated(false);
  };

  // State update helper that guarantees immediate synchronization without stale cache bugs
  const updateCurrentIssue = (updater: (prev: MagazineIssue) => MagazineIssue) => {
    setIssues(prevIssues => {
      const idx = prevIssues.findIndex(i => i.monthIndex === activeMonthIndex);
      if (idx === -1) return prevIssues;

      const updated = updater(prevIssues[idx]);
      const next = [...prevIssues];
      next[idx] = {
        ...updated,
        updatedAt: new Date().toISOString()
      };
      saveAllIssuesToStorage(next);
      return next;
    });
  };

  // Switch active monthly issue
  const handleSelectMonth = (monthIndex: number) => {
    setActiveMonthIndex(monthIndex);
    saveActiveMonthIndex(monthIndex);
    setActivePageIndex(0);
  };

  const handleOpenPreflight = () => {
    const report = runPreflightAudit(currentIssue);
    setPreflightReport(report);
    setIsPreflightModalOpen(true);
  };

  // Save new article and generate smart pages
  const handleSaveAndGeneratePages = async (article: ArticleItem) => {
    const startNum = currentIssue.pages.length + 1;
    const result = await generateSmartLayout(article, startNum);

    updateCurrentIssue(issue => {
      const existingIndex = issue.articles.findIndex(a => a.id === article.id);
      let updatedArticles = [...issue.articles];
      if (existingIndex !== -1) {
        updatedArticles[existingIndex] = article;
      } else {
        updatedArticles.push(article);
      }

      const updatedPages = [...issue.pages, ...result.pages].map((p, idx) => ({
        ...p,
        pageNumber: idx + 1
      }));

      return {
        ...issue,
        articles: updatedArticles,
        pages: updatedPages,
      };
    });

    setEditingArticle(null);
    setActivePageIndex(Math.max(0, currentIssue.pages.length));
    setActiveTab('preview');

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  // Move page with renumbering and persistent save
  const handleMovePage = (fromIndex: number, toIndex: number) => {
    updateCurrentIssue(issue => {
      const copy = [...issue.pages];
      const [moved] = copy.splice(fromIndex, 1);
      copy.splice(toIndex, 0, moved);

      const renumbered = copy.map((p, idx) => ({
        ...p,
        pageNumber: idx + 1
      }));

      return {
        ...issue,
        pages: renumbered,
      };
    });
    setActivePageIndex(toIndex);
  };

  // Duplicate page
  const handleDuplicatePage = (index: number) => {
    updateCurrentIssue(issue => {
      const target = issue.pages[index];
      const clone: MagazinePage = {
        ...target,
        id: `page-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        title: `${target.title || 'Sayfa'} (Kopya)`
      };

      const copy = [...issue.pages];
      copy.splice(index + 1, 0, clone);

      const renumbered = copy.map((p, idx) => ({
        ...p,
        pageNumber: idx + 1
      }));

      return {
        ...issue,
        pages: renumbered,
      };
    });
    setActivePageIndex(index + 1);
  };

  // Delete page permanently (no cache resurrection)
  const handleDeletePage = (index: number) => {
    if (currentIssue.pages.length <= 1) {
      alert('Dergi en az 1 sayfadan oluşmalıdır.');
      return;
    }
    if (!window.confirm('Bu sayfayı kalıcı olarak silmek istediğinizden emin misiniz?')) return;

    updateCurrentIssue(issue => {
      const copy = issue.pages.filter((_, i) => i !== index);
      const renumbered = copy.map((p, idx) => ({
        ...p,
        pageNumber: idx + 1
      }));

      return {
        ...issue,
        pages: renumbered,
      };
    });
    setActivePageIndex(Math.max(0, index - 1));
  };

  // Delete article
  const handleDeleteArticle = (articleId: string) => {
    updateCurrentIssue(issue => ({
      ...issue,
      articles: issue.articles.filter(a => a.id !== articleId),
    }));
  };

  // Add blank page
  const handleAddNewPage = () => {
    updateCurrentIssue(issue => {
      const newPage: MagazinePage = {
        id: `page-${Date.now()}`,
        pageNumber: issue.pages.length + 1,
        issueId: issue.id,
        sectionId: 'sec-etkinlik',
        templateId: 'M04',
        layoutVariant: 'A',
        category: 'Okulumuzdan',
        title: 'Yeni Sayfa Başlığı',
        subtitle: 'Alt başlık veya spot metin',
        content: 'Bu sayfaya yeni bir makale veya etkinlik metni yazabilirsiniz.',
        photos: []
      };

      return {
        ...issue,
        pages: [...issue.pages, newPage],
      };
    });
    setActivePageIndex(currentIssue.pages.length);
  };

  // Cycle design variant
  const handleCycleVariant = () => {
    const currentPage = currentIssue.pages[activePageIndex];
    if (!currentPage) return;

    const updated = cycleDesignVariant(currentPage);
    updateCurrentIssue(issue => {
      const copy = [...issue.pages];
      copy[activePageIndex] = updated;
      return {
        ...issue,
        pages: copy,
      };
    });
  };

  // Update page properties
  const handleUpdatePage = (updatedPage: MagazinePage) => {
    updateCurrentIssue(issue => {
      const copy = [...issue.pages];
      copy[activePageIndex] = updatedPage;
      return {
        ...issue,
        pages: copy,
      };
    });
  };

  // Export PPTX for Canva
  const handleExportPptx = async () => {
    setIsExportingPptx(true);
    setExportStatusText('Canva uyumlu PPTX üretiliyor...');

    try {
      const blob = await exportIssueToPptx(currentIssue, (percent, status) => {
        setExportStatusText(status);
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `MAIDER-Sayi-${currentIssue.issueNumber}-${currentIssue.month}-${currentIssue.year}-Canva-Uyumlu.pptx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      confetti({
        particleCount: 120,
        spread: 100,
        origin: { y: 0.5 }
      });
    } catch (err) {
      console.error('PPTX Export error:', err);
      alert('PPTX oluşturulurken bir hata meydana geldi.');
    } finally {
      setIsExportingPptx(false);
      setExportStatusText('');
    }
  };

  // Export A4 PDF
  const handleExportPdf = async () => {
    const pageEl = (document.getElementById('active-preview-page') || document.querySelector('.print-page')) as HTMLElement | null;
    if (pageEl) {
      alert(`MAİDER ${currentIssue.month} Sayısı (A4 PDF) derleniyor. Lütfen bekleyin...`);
      await exportIssueToPdf([pageEl], `MAIDER-${currentIssue.month}-Sayi-${currentIssue.issueNumber}`);
    } else {
      alert('Lütfen önce Önizleme sekmesine geçin.');
    }
  };

  // Export single PNG
  const handleExportSinglePng = async (pageIdx: number) => {
    const pageEl = (document.getElementById('active-preview-page') || document.querySelector('.print-page')) as HTMLElement | null;
    if (pageEl) {
      await exportPageToPng(pageEl, `MAIDER-${currentIssue.month}-Sayfa-${pageIdx + 1}.png`);
    }
  };

  // Backup & Import
  const handleExportBackup = () => {
    exportProjectToJson(currentIssue);
  };

  const handleImportBackup = async (file: File) => {
    try {
      const imported = await importProjectFromJson(file);
      updateCurrentIssue(() => imported);
      setActivePageIndex(0);
      alert('Proje başarıyla yüklendi!');
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const handleEditArticle = (art: ArticleItem) => {
    setEditingArticle(art);
    setActiveTab('editor');
  };

  if (!isAuthenticated) {
    return <LoginGate onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col font-sans">
      {/* Top Main Navbar */}
      <Navbar
        issue={currentIssue}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenIssueModal={() => setIsIssueModalOpen(true)}
        onOpenPreflightModal={handleOpenPreflight}
        onExportPptx={handleExportPptx}
        onExportPdf={handleExportPdf}
        onExportBackup={handleExportBackup}
        onImportBackup={handleImportBackup}
        isExporting={isExportingPptx}
        onLogout={handleLogout}
      />

      {/* Yayın Bilgileri Seçim ve Geçmiş Sayılar (Arşiv) Çubuğu */}
      <PublicationControlBar
        issues={issues}
        currentIssue={currentIssue}
        activeMonthIndex={activeMonthIndex}
        onSelectMonth={handleSelectMonth}
        onUpdateIssueInfo={(data) => {
          updateCurrentIssue(issue => ({
            ...issue,
            ...data,
            updatedAt: new Date().toISOString()
          }));
        }}
        onOpenIssueModal={() => setIsIssueModalOpen(true)}
      />

      {/* Main Workspace Area */}
      <main className="flex-1 flex flex-col overflow-hidden pb-16 sm:pb-0">
        {activeTab === 'dashboard' && (
          <Dashboard
            issue={currentIssue}
            onNavigateTab={setActiveTab}
            onOpenNewIssueModal={() => setIsIssueModalOpen(true)}
            onOpenNewContentForm={() => {
              setEditingArticle(null);
              setActiveTab('editor');
            }}
            onEditArticle={handleEditArticle}
            onDeleteArticle={handleDeleteArticle}
            onStartCanvaExport={handleExportPptx}
            onSelectPage={(idx) => setActivePageIndex(idx)}
          />
        )}

        {(activeTab === 'editor' || activeTab === 'studio') && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-100">
            <ContentForm
              initialArticle={editingArticle}
              currentIssue={currentIssue}
              onSaveAndGeneratePages={handleSaveAndGeneratePages}
              onCancel={() => {
                setEditingArticle(null);
                setActiveTab('dashboard');
              }}
            />
          </div>
        )}

        {activeTab === 'pages' && (
          <div className="flex-1 flex flex-col justify-start overflow-visible">
            <div className="flex-1 flex items-start justify-center p-4 sm:p-6 overflow-y-auto bg-slate-200/70">
              {(() => {
                const activePage = currentIssue.pages[activePageIndex] || currentIssue.pages[0];
                const supportsInlineEdit = !['M01', 'M02', 'M25'].includes(activePage?.templateId || '');
                return supportsInlineEdit ? (
                  <div className="w-full max-w-5xl flex justify-center">
                    <InlinePageEditor
                      page={activePage}
                      issueYear={currentIssue.year}
                      issueMonth={currentIssue.month}
                      issueNumber={currentIssue.issueNumber}
                      onUpdatePage={handleUpdatePage}
                      onCycleVariant={handleCycleVariant}
                    />
                  </div>
                ) : (
                  <div className="w-full max-w-5xl shadow-2xl rounded-xl overflow-visible border border-slate-300">
                    <PageRenderer
                      page={activePage}
                      issue={currentIssue}
                      onNavigatePage={(pNum) => {
                        const targetIdx = currentIssue.pages.findIndex(p => p.pageNumber === pNum);
                        if (targetIdx !== -1) setActivePageIndex(targetIdx);
                      }}
                    />
                  </div>
                );
              })()}
            </div>

            <PageThumbnailGrid
              issue={currentIssue}
              activePageIndex={activePageIndex}
              onSelectPage={setActivePageIndex}
              onMovePage={handleMovePage}
              onDuplicatePage={handleDuplicatePage}
              onDeletePage={handleDeletePage}
              onAddNewPage={handleAddNewPage}
              onOpenAdjustDrawer={(idx) => {
                setActivePageIndex(idx);
                setIsAdjustDrawerOpen(true);
              }}
            />
          </div>
        )}

        {activeTab === 'preview' && (
          <MagazinePreview
            issue={currentIssue}
            activePageIndex={activePageIndex}
            onChangePage={setActivePageIndex}
            onOpenFullscreen={() => setIsFullscreenOpen(true)}
            onOpenAdjustDrawer={() => setIsAdjustDrawerOpen(true)}
            onCycleVariant={handleCycleVariant}
            onExportSinglePng={handleExportSinglePng}
            onExportPdf={handleExportPdf}
            onUpdatePage={handleUpdatePage}
          />
        )}
      </main>

      {/* Manual Page Settings Drawer */}
      <ManualAdjustDrawer
        page={currentIssue.pages[activePageIndex] || currentIssue.pages[0]}
        isOpen={isAdjustDrawerOpen}
        onClose={() => setIsAdjustDrawerOpen(false)}
        onUpdatePage={handleUpdatePage}
        sections={currentIssue.sections}
      />

      {/* Preflight Modal */}
      <PreflightModal
        report={preflightReport}
        isOpen={isPreflightModalOpen}
        onClose={() => setIsPreflightModalOpen(false)}
        onProceedToCanvaExport={handleExportPptx}
        onNavigatePage={(pNum) => {
          const targetIdx = currentIssue.pages.findIndex(p => p.pageNumber === pNum);
          if (targetIdx !== -1) {
            setActivePageIndex(targetIdx);
            setActiveTab('preview');
          }
        }}
      />

      {/* Monthly Issue Settings Modal */}
      <IssueModal
        isOpen={isIssueModalOpen}
        onClose={() => setIsIssueModalOpen(false)}
        initialIssue={currentIssue}
        onSave={(data) => {
          updateCurrentIssue(issue => ({
            ...issue,
            ...data,
            updatedAt: new Date().toISOString()
          }));
        }}
      />

      {/* Fullscreen Flipbook / Reader Mode */}
      <FullscreenReader
        issue={currentIssue}
        initialPageIndex={activePageIndex}
        isOpen={isFullscreenOpen}
        onClose={() => setIsFullscreenOpen(false)}
      />
    </div>
  );
}

export default App;
