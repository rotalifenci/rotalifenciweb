import React from 'react';
import { MagazinePage } from '../../types/magazine';
import { Lightbulb, Users, Bookmark, QrCode } from 'lucide-react';

interface Props {
  page: MagazinePage;
}

export const ProjectTemplate: React.FC<Props> = ({ page }) => {
  const photo = page.photos && page.photos[0];

  return (
    <div className="w-full h-full bg-[#FDFBF7] text-slate-900 flex flex-col justify-start overflow-visible">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-teal-700 text-xs font-bold uppercase tracking-widest mb-1">
          <Lightbulb className="w-4 h-4" />
          <span>TÜBİTAK 4006 & BİLİM PROJELERİ</span>
        </div>
        <h1 className="font-editorial text-2xl md:text-3xl font-extrabold text-slate-950 leading-tight">
          {page.title}
        </h1>
        {page.subtitle && (
          <p className="text-slate-600 text-xs md:text-sm italic font-serif mt-1 pb-1.5 border-b border-teal-200">
            {page.subtitle}
          </p>
        )}
      </div>

      {/* Main Layout */}
      <div className="my-2.5 grid grid-cols-12 gap-4 flex-1">
        {/* Left Column: Team & Project Metadata Card */}
        <div className="col-span-4 flex flex-col gap-3">
          <div className="bg-teal-50/80 p-3.5 rounded-xl border border-teal-200 shadow-sm">
            <div className="flex items-center gap-2 text-teal-800 font-bold text-xs uppercase mb-2">
              <Users className="w-4 h-4" />
              <span>PROJE KÜNYESİ</span>
            </div>
            
            <div className="space-y-1.5 text-xs">
              <div>
                <span className="text-slate-500 font-medium block">Danışman Öğretmen:</span>
                <span className="font-bold text-slate-800">{page.author || 'Fen Bilimleri Zümresi'}</span>
              </div>
              <div>
                <span className="text-slate-500 font-medium block">Proje Ekibi:</span>
                <span className="font-bold text-slate-800">{page.authorRole || 'TÜBİTAK Araştırma Grubu'}</span>
              </div>
              <div>
                <span className="text-slate-500 font-medium block">Kategori:</span>
                <span className="font-bold text-teal-700">Fen Bilimleri & Biyoloji</span>
              </div>
            </div>
          </div>

          {page.qrCodeDataUrl && (
            <div className="bg-white p-2.5 rounded-xl border border-teal-200 shadow-sm text-center">
              <img src={page.qrCodeDataUrl} alt="QR" className="w-20 h-20 mx-auto object-contain" />
              <p className="text-[10px] font-bold text-teal-800 mt-1.5 uppercase">PROJE RAPORU VE SUNUMU</p>
            </div>
          )}
        </div>

        {/* Right Column: Hero Photo & Hypothesis / Method / Results */}
        <div className="col-span-8 flex flex-col justify-start">
          {photo && (
            <div className="rounded-xl overflow-hidden shadow-sm border border-teal-200 h-44 mb-2.5">
              <img src={photo.url} alt="Proje" className="w-full h-full object-cover" />
            </div>
          )}

          <div className="text-xs md:text-sm text-slate-700 leading-[1.45] text-justify whitespace-pre-line flex-1">
            {page.content}
          </div>
        </div>
      </div>
    </div>
  );
};
