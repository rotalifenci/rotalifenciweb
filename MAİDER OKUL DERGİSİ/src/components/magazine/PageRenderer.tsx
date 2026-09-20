import React from 'react';
import { MagazinePage, MagazineIssue } from '../../types/magazine';
import { CATEGORY_THEMES } from '../../config/brand';
import { CoverTemplates } from '../templates/CoverTemplates';
import { TocTemplate } from '../templates/TocTemplate';
import { EditorialTemplate } from '../templates/EditorialTemplate';
import { ArticleSinglePhotoTemplate, ArticleTwoPhotosTemplate, ArticleContinuationTemplate } from '../templates/ArticleTemplates';
import { ScienceTemplates } from '../templates/ScienceTemplates';
import { StemTemplate } from '../templates/StemTemplate';
import { ProjectTemplate } from '../templates/ProjectTemplate';
import { EventTemplates } from '../templates/EventTemplates';
import { InterviewTemplate } from '../templates/InterviewTemplate';
import { PoetryTemplate } from '../templates/PoetryTemplate';
import { StoryTemplate } from '../templates/StoryTemplate';
import { ArtTemplate } from '../templates/ArtTemplate';
import { GalleryTemplate } from '../templates/GalleryTemplate';
import { BookReviewTemplate } from '../templates/BookReviewTemplate';
import { AchievementTemplate } from '../templates/AchievementTemplate';
import { InfoCardsTemplate } from '../templates/InfoCardsTemplate';
import { PuzzleTemplate } from '../templates/PuzzleTemplate';
import { DigitalCitizenTemplate } from '../templates/DigitalCitizenTemplate';
import { TeamTemplate } from '../templates/TeamTemplate';
import { ArchiveTemplate } from '../templates/ArchiveTemplate';
import { MastheadTemplate } from '../templates/MastheadTemplate';
import { InteractiveTemplate } from '../templates/InteractiveTemplate';
import { BackCoverTemplate } from '../templates/BackCoverTemplate';

interface Props {
  page: MagazinePage;
  issue: MagazineIssue;
  scale?: number;
  onNavigatePage?: (pageNum: number) => void;
  className?: string;
  id?: string;
}

export const PageRenderer: React.FC<Props> = ({
  page,
  issue,
  scale = 1,
  onNavigatePage,
  className = '',
  id,
}) => {
  const theme = CATEGORY_THEMES[page.category] || CATEGORY_THEMES['Okulumuzdan'];
  const isA4 = issue.format === 'a4';
  const pageNum = page.pageNumber;
  const isCoverOrBack = page.templateId === 'M01' || page.templateId === 'M25';

  const renderTemplateContent = () => {
    switch (page.templateId) {
      case 'M01':
        return <CoverTemplates page={page} issue={issue} />;
      case 'M02':
        return <TocTemplate page={page} issue={issue} onNavigatePage={onNavigatePage} />;
      case 'M03':
        return <EditorialTemplate page={page} />;
      case 'M04':
        return <ArticleSinglePhotoTemplate page={page} />;
      case 'M05':
        return <ArticleTwoPhotosTemplate page={page} />;
      case 'M06':
        return <ArticleContinuationTemplate page={page} />;
      case 'M07':
        return <ScienceTemplates page={page} />;
      case 'M08':
        return <StemTemplate page={page} />;
      case 'M09':
        return <ProjectTemplate page={page} />;
      case 'M10':
        return <EventTemplates page={page} />;
      case 'M11':
        return <InterviewTemplate page={page} />;
      case 'M12':
        return <PoetryTemplate page={page} />;
      case 'M13':
        return <StoryTemplate page={page} />;
      case 'M14':
        return <ArtTemplate page={page} />;
      case 'M15':
        return <GalleryTemplate page={page} />;
      case 'M16':
        return <BookReviewTemplate page={page} />;
      case 'M17':
        return <AchievementTemplate page={page} />;
      case 'M18':
        return <InfoCardsTemplate page={page} />;
      case 'M19':
        return <PuzzleTemplate page={page} />;
      case 'M20':
        return <DigitalCitizenTemplate page={page} />;
      case 'M21':
        return <TeamTemplate page={page} issue={issue} />;
      case 'M22':
        return <ArchiveTemplate page={page} issue={issue} />;
      case 'M23':
        return <MastheadTemplate page={page} issue={issue} />;
      case 'M24':
        return <InteractiveTemplate page={page} />;
      case 'M25':
        return <BackCoverTemplate page={page} issue={issue} />;
      default:
        return <ArticleSinglePhotoTemplate page={page} />;
    }
  };

  const section = issue.sections?.find(s => s.id === page.sectionId);

  return (
    <div
      id={id}
      className={`print-page a4-page-renderer relative bg-[#FDFBF7] text-slate-900 overflow-hidden shadow-2xl transition-all select-none flex flex-col ${
        isA4 ? 'aspect-[210/297]' : 'aspect-[9/16]'
      } ${className}`}
      style={{
        width: '100%',
        maxWidth: isA4 ? '100%' : '480px',
        boxSizing: 'border-box',
        position: 'relative',
        overflow: 'hidden',
        paddingTop: isCoverOrBack ? '0' : '14mm',
        paddingBottom: isCoverOrBack ? '0' : '15mm',
        paddingLeft: isCoverOrBack ? '0' : '14mm',
        paddingRight: isCoverOrBack ? '0' : '12mm'
      }}
    >
      {/* Running Editorial Header (Except Cover M01 & Back M25) */}
      {!isCoverOrBack && (
        <header className="min-h-[36px] shrink-0 flex items-center justify-between border-b border-slate-200/90 pb-1.5 mb-2 bg-transparent whitespace-nowrap overflow-visible leading-normal">
          {/* Sol: Dergi Bölüm Başlığı (Üst sol baş tarafta, kusursuz dikey ortalanmış) */}
          <div className="w-1/3 flex items-center justify-start min-w-0">
            <span
              className="inline-flex items-center justify-center text-[8.5px] sm:text-[9.5px] font-black uppercase tracking-wider px-2 py-0.5 rounded text-white shadow-2xs shrink-0 truncate max-w-full leading-normal"
              style={{ backgroundColor: section?.color || theme.color }}
            >
              {section?.name || page.category || theme.label}
            </span>
          </div>

          {/* Orta: Okul Logosu (photo_2026-09-06_21-01-05) */}
          <div className="w-1/3 flex items-center justify-center min-w-0">
            <img
              src="/photo_2026-09-06_21-01-05.jpg"
              onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/maider-logo.png'; }}
              alt="Mehmet Akif İnan Ortaokulu Logo"
              className="h-8 w-8 sm:h-9 sm:w-9 object-contain rounded-full shadow-2xs border border-slate-200 shrink-0"
            />
          </div>

          {/* Sağ: Yıl, Ay, Sayı (Aynı yatay sırada sağda hizalı) */}
          <div className="w-1/3 flex items-center justify-end text-[9px] sm:text-[10px] font-medium tracking-wide text-slate-600 shrink-0 ml-auto">
            <span>Yıl: {issue.year}</span>
            <span className="text-slate-300 mx-1">•</span>
            <span>Ay: {issue.month}</span>
            <span className="text-slate-300 mx-1">•</span>
            <span className="font-bold text-slate-900">Sayı: {issue.issueNumber}</span>
          </div>
        </header>
      )}

      {/* Main Template Core (Güvenli baskı alanında doğal akış) */}
      <main className="flex-1 flex flex-col min-h-0 relative overflow-hidden pb-[44px]">
        {renderTemplateContent()}
      </main>

      {/* Kaynakça Alanı (En alt bölümün hemen üstünde, tam okunacak netlikte ama küçük yazı boyutunda) */}
      {!isCoverOrBack && page.sourceReference && (
        <div className="shrink-0 mb-2 py-1 px-3 bg-slate-50/90 rounded-lg border border-slate-200/70 flex items-center gap-1.5 text-[9.5px] text-slate-600 italic whitespace-nowrap overflow-visible">
          <span className="font-bold not-italic text-slate-800 shrink-0">Kaynak:</span>
          <span className="truncate text-slate-600" title={page.sourceReference}>
            {page.sourceReference}
          </span>
        </div>
      )}

      {/* Running Editorial Footer (En altta: Sol yazar, Orta sayfa numarası, Sağ Mehmet Akif İnan Ortaokulu) */}
      {!isCoverOrBack && (
        <footer
          className="shrink-0 flex items-center justify-between border-t border-slate-200/90 bg-transparent text-[9.5px] sm:text-[10px] text-slate-500 font-medium z-30 overflow-hidden"
          style={{
            position: 'absolute',
            bottom: '12mm',
            left: '14mm',
            right: '12mm',
            height: '34px',
            boxSizing: 'border-box'
          }}
        >
          {/* Sol: Yazar / Hazırlayan Kişi */}
          <div className="w-1/3 flex items-center gap-1.5 truncate min-w-0">
            <span className="font-semibold text-slate-800 shrink-0 truncate">
              {page.author ? page.author : 'MAİDER Ekibi'}
            </span>
            {page.authorRole && (
              <span className="text-slate-400 shrink-0 truncate">• {page.authorRole}</span>
            )}
          </div>

          {/* TAM ORTA: Sayfa Numarası (En altta tam ortalanmış) */}
          <div className="w-1/3 flex items-center justify-center shrink-0 my-auto">
            <span className="inline-flex items-center justify-center min-w-[28px] h-6 px-2 rounded-md bg-slate-100 text-slate-700 font-mono font-black text-xs border border-slate-200 shadow-2xs leading-none">
              {pageNum}
            </span>
          </div>

          {/* Sağ: Mehmet Akif İnan Ortaokulu */}
          <div className="w-1/3 flex items-center justify-end text-slate-600 font-semibold truncate text-right shrink-0 ml-auto">
            <span>Mehmet Akif İnan Ortaokulu</span>
          </div>
        </footer>
      )}
    </div>
  );
};
