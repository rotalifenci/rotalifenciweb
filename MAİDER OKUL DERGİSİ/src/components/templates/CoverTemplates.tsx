import React from 'react';
import { MagazinePage, MagazineIssue } from '../../types/magazine';
import { Sparkles, Bookmark } from 'lucide-react';

interface Props {
  page: MagazinePage;
  issue: MagazineIssue;
}

export const CoverTemplates: React.FC<Props> = ({ page, issue }) => {
  const variant = page.layoutVariant || 'A';
  const coverImg = (page.photos && page.photos[0]?.url) || issue.coverImageUrl || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80';

  if (variant === 'B') {
    // Variant B: Framed Editorial with Clean Margins
    return (
      <div className="relative w-full h-full bg-[#0F172A] text-white p-8 flex flex-col justify-between overflow-hidden">
        {/* Subtle decorative grid background */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]"></div>

        {/* Top Masthead */}
        <div className="relative z-10 text-center border-b border-slate-700/80 pb-4">
          <div className="flex items-center justify-between text-xs tracking-widest text-sky-400 font-bold uppercase mb-2">
            <span>{issue.schoolName}</span>
            <span className="bg-sky-500/20 text-sky-300 px-2.5 py-0.5 rounded border border-sky-500/30">SAYI {issue.issueNumber}</span>
            <span>{issue.month} {issue.year}</span>
          </div>
          <h1 className="font-editorial text-6xl md:text-7xl font-extrabold tracking-wider text-white">MAİDER</h1>
          <p className="text-slate-400 text-xs tracking-[0.25em] uppercase font-semibold mt-1">
            AKILLI DİJİTAL OKUL DERGİSİ
          </p>
        </div>

        {/* Center Framed Hero Photo */}
        <div className="relative z-10 my-4 flex-1 rounded-xl overflow-hidden shadow-2xl border border-slate-700/60 group">
          <img
            src={coverImg}
            alt="Kapak Görseli"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80"></div>
          
          <div className="absolute bottom-6 left-6 right-6">
            <span className="inline-block bg-amber-500 text-slate-950 text-xs font-black uppercase px-3 py-1 rounded-sm mb-2 shadow">
              DOSYA KONUSU
            </span>
            <h2 className="font-editorial text-2xl md:text-3xl font-bold text-white leading-tight">
              {page.title || issue.coverTitle}
            </h2>
            <p className="text-slate-300 text-xs md:text-sm mt-2 line-clamp-2">
              {page.subtitle || issue.coverSubtitle}
            </p>
          </div>
        </div>

        {/* Bottom Teasers */}
        <div className="relative z-10 grid grid-cols-3 gap-3 border-t border-slate-800 pt-3 text-xs">
          <div className="border-l-2 border-sky-400 pl-2">
            <p className="text-sky-400 font-bold text-[10px]">STEM & ROBOTİK</p>
            <p className="text-slate-300 line-clamp-1 font-medium">Akıllı Sera Projeleri</p>
          </div>
          <div className="border-l-2 border-purple-400 pl-2">
            <p className="text-purple-400 font-bold text-[10px]">BİLİM & UZAY</p>
            <p className="text-slate-300 line-clamp-1 font-medium">James Webb Keşifleri</p>
          </div>
          <div className="border-l-2 border-amber-400 pl-2">
            <p className="text-amber-400 font-bold text-[10px]">BAŞARI</p>
            <p className="text-slate-300 line-clamp-1 font-medium">İl Şampiyonluğu</p>
          </div>
        </div>
      </div>
    );
  }

  // Variant A: Full-Bleed High Impact Editorial Cover (Default)
  return (
    <div className="relative w-full h-full bg-[#0F172A] text-white flex flex-col justify-between overflow-hidden">
      {/* Background Full Photo */}
      <img
        src={coverImg}
        alt="Kapak Görseli"
        className="absolute inset-0 w-full h-full object-cover brightness-[0.7] contrast-[1.05]"
      />

      {/* Dark Vignette Gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-transparent to-slate-950/95 pointer-events-none"></div>

      {/* Top Section */}
      <div className="relative z-10 p-8 pt-10 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-700/80 text-[11px] text-sky-400 font-semibold uppercase tracking-widest mb-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>{issue.schoolName}</span>
        </div>

        <h1 className="font-editorial text-7xl md:text-8xl font-black tracking-tight text-white drop-shadow-lg">
          MAİDER
        </h1>
        <p className="text-xs md:text-sm font-semibold tracking-[0.3em] uppercase text-sky-300 drop-shadow">
          {issue.subtitle || 'Mehmet Akif İnan Ortaokulu E-Dergisi'}
        </p>

        {/* Issue Pill */}
        <div className="mt-4 inline-flex items-center gap-4 px-4 py-1.5 rounded-md bg-slate-900/90 border border-slate-700 text-xs font-semibold text-slate-200">
          <span>SAYI: {issue.issueNumber}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
          <span>{issue.month.toUpperCase()} {issue.year}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
          <span className="text-emerald-400">DİJİTAL YAYIN</span>
        </div>
      </div>

      {/* Bottom Main Headline */}
      <div className="relative z-10 p-8 pb-10">
        <div className="max-w-xl bg-slate-950/80 backdrop-blur-md p-6 rounded-lg border-l-4 border-amber-500 border-t border-r border-b border-slate-800 shadow-2xl">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Bookmark className="w-4 h-4" />
            <span>BU SAYININ DOSYASI</span>
          </div>
          <h2 className="font-editorial text-2xl md:text-4xl font-black text-white leading-tight">
            {page.title || issue.coverTitle}
          </h2>
          <p className="text-slate-300 text-sm md:text-base mt-2 leading-relaxed">
            {page.subtitle || issue.coverSubtitle}
          </p>
        </div>

        {/* Footer Slogan Bar */}
        <div className="mt-4 flex items-center justify-between text-xs text-slate-400 font-medium">
          <span>{issue.slogan}</span>
          <span className="text-sky-400 font-bold">maider.meb.k12.tr</span>
        </div>
      </div>
    </div>
  );
};
