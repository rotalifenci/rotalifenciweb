import React from 'react';
import { MagazinePage, MagazineIssue } from '../../types/magazine';
import { Archive, ExternalLink } from 'lucide-react';

interface Props {
  page: MagazinePage;
  issue: MagazineIssue;
}

export const ArchiveTemplate: React.FC<Props> = ({ page, issue }) => {
  const archives = issue.archives || [];

  return (
    <div className="w-full h-full bg-[#FDFBF7] text-slate-900 flex flex-col justify-start overflow-visible">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-slate-700 text-xs font-bold uppercase tracking-widest mb-1">
          <Archive className="w-4 h-4" />
          <span>DİJİTAL KÜTÜPHANE VE ARŞİV</span>
        </div>
        <h1 className="font-editorial text-2xl md:text-3xl font-extrabold text-slate-950 leading-tight">
          {page.title || 'Geçmiş Sayılarımız'}
        </h1>
        <p className="text-slate-600 text-xs italic font-serif mt-1 pb-2 border-b border-slate-200">
          MAİDER E-Dergisi’nin önceki sayılarına Canva ve dijital kütüphanemizden ulaşabilirsiniz.
        </p>
      </div>

      {/* Archives Grid */}
      <div className="my-3 grid grid-cols-3 gap-4 flex-1">
        {archives.map((arc) => (
          <div key={arc.id} className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm flex flex-col justify-between group">
            <div className="relative h-44 overflow-hidden bg-slate-100">
              <img src={arc.coverUrl} alt={`Sayı ${arc.issueNumber}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute top-2 left-2 bg-slate-900/90 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                SAYI {arc.issueNumber}
              </div>
            </div>

            <div className="p-3">
              <span className="text-[10px] font-semibold text-slate-400 block">{arc.month} {arc.year}</span>
              <h4 className="font-editorial font-bold text-xs text-slate-900 line-clamp-1 mt-0.5">{arc.title}</h4>

              <a
                href={arc.canvaUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-bold text-sky-700 hover:text-sky-800"
              >
                <span>Canva ile Oku</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
