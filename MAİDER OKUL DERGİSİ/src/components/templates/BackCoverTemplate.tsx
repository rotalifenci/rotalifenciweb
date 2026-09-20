import React from 'react';
import { MagazinePage, MagazineIssue } from '../../types/magazine';
import { Sparkles, Globe, Mail, Phone, MapPin, Heart } from 'lucide-react';

interface Props {
  page: MagazinePage;
  issue: MagazineIssue;
}

export const BackCoverTemplate: React.FC<Props> = ({ page, issue }) => {
  const photo = page.photos && page.photos[0];

  return (
    <div className="relative w-full h-full bg-[#0F172A] text-white p-10 flex flex-col justify-between overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:20px_20px]"></div>

      {/* Top Header */}
      <div className="relative z-10 text-center border-b border-slate-800 pb-6">
        <div className="inline-flex items-center gap-2 text-sky-400 text-xs font-bold uppercase tracking-widest mb-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>MEHMET AKİF İNAN ORTAOKULU</span>
        </div>
        <h1 className="font-editorial text-5xl md:text-6xl font-black tracking-wide text-white">
          MAİDER
        </h1>
        <p className="text-slate-400 text-xs tracking-[0.2em] uppercase font-semibold mt-1">
          {issue.slogan || 'Geleceğe İlham Veren Akıllı Okul Dergisi'}
        </p>
      </div>

      {/* Center Visual / Thank You Message */}
      <div className="relative z-10 my-auto py-6 flex flex-col items-center text-center max-w-md mx-auto">
        {photo && (
          <div className="w-56 h-40 rounded-xl overflow-hidden shadow-2xl border-2 border-slate-700/80 mb-6">
            <img src={photo.url} alt="Kapanış" className="w-full h-full object-cover" />
          </div>
        )}

        <h3 className="font-editorial text-2xl font-bold text-slate-100">
          {page.title || '11. Sayımızda Görüşmek Üzere!'}
        </h3>
        <p className="text-slate-300 text-xs md:text-sm mt-3 leading-relaxed">
          {page.content || 'Okulumuzun bilim, sanat, spor ve teknoloji yolculuğunda bir sonraki sayımızda yeni başarılar ve projelerle tekrar bir arada olacağız. Emeği geçen tüm öğretmen ve öğrencilerimize teşekkür ederiz.'}
        </p>
      </div>

      {/* Bottom Contact and Social Info */}
      <div className="relative z-10 pt-6 border-t border-slate-800 grid grid-cols-3 gap-4 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-sky-400 shrink-0" />
          <span className="truncate">mehmetakifinan.meb.k12.tr</span>
        </div>
        <div className="flex items-center gap-2 justify-center">
          <Mail className="w-4 h-4 text-sky-400 shrink-0" />
          <span className="truncate">{issue.masthead.contactEmail}</span>
        </div>
        <div className="flex items-center gap-2 justify-end text-slate-300 font-semibold">
          <span>SAYI {issue.issueNumber} • {issue.year}</span>
        </div>
      </div>
    </div>
  );
};
