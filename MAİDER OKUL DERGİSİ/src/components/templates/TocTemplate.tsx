import React from 'react';
import { MagazinePage, MagazineIssue } from '../../types/magazine';
import { CATEGORY_THEMES } from '../../config/brand';
import { ListOrdered } from 'lucide-react';

interface Props {
  page: MagazinePage;
  issue: MagazineIssue;
  onNavigatePage?: (pageNum: number) => void;
}

export const TocTemplate: React.FC<Props> = ({ page, issue, onNavigatePage }) => {
  // Exclude Cover and TOC itself from TOC listing
  const items = issue.pages.filter(p => p.templateId !== 'M01' && p.templateId !== 'M02');

  return (
    <div className="w-full h-full bg-[#FDFBF7] text-slate-900 flex flex-col justify-start overflow-visible">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between border-b-2 border-slate-900 pb-2 mb-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 mb-0.5">
              <ListOrdered className="w-4 h-4 text-sky-600" />
              <span>İÇERİK DİZİNİ</span>
            </div>
            <h1 className="font-editorial text-3xl md:text-4xl font-extrabold text-slate-950">
              {page.title || 'İçindekiler'}
            </h1>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400 block">SAYI {issue.issueNumber}</span>
            <span className="font-editorial text-xl font-bold text-slate-800">{issue.month} {issue.year}</span>
          </div>
        </div>

        <p className="text-xs text-slate-600 mb-3 italic">
          {page.subtitle || 'Mehmet Akif İnan Ortaokulu öğrencilerinin ve öğretmenlerinin bilim, sanat ve edebiyat yolculuğu.'}
        </p>

        {/* 2-Column TOC Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2.5">
          {items.map((item, idx) => {
            const theme = CATEGORY_THEMES[item.category] || CATEGORY_THEMES['Okulumuzdan'];
            const pageNum = item.pageNumber || (idx + 3);

            return (
              <div
                key={item.id}
                onClick={() => onNavigatePage && onNavigatePage(pageNum)}
                className="group flex items-start gap-3 p-2 rounded-lg hover:bg-slate-100/80 transition-colors cursor-pointer border-b border-dashed border-slate-200"
              >
                {/* Number Badge */}
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-sm"
                  style={{ backgroundColor: theme.color }}
                >
                  {pageNum}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span
                      className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
                      style={{ color: theme.color, backgroundColor: theme.bgLight }}
                    >
                      {item.category}
                    </span>
                  </div>
                  <h3 className="font-editorial text-sm font-bold text-slate-900 group-hover:text-sky-700 transition-colors truncate mt-0.5">
                    {item.title || 'Başlıksız Yazı'}
                  </h3>
                  {item.author && (
                    <p className="text-[11px] text-slate-500 truncate">
                      {item.author} {item.authorRole ? `• ${item.authorRole}` : ''}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Info Box */}
      <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
        <span>MAİDER Dijital Okul Dergisi</span>
        <span>mehmetakifinan.meb.k12.tr</span>
      </div>
    </div>
  );
};
