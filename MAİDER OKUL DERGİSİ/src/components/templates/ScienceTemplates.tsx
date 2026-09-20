import React from 'react';
import { MagazinePage } from '../../types/magazine';
import { Atom, Sparkles, HelpCircle } from 'lucide-react';

interface Props {
  page: MagazinePage;
}

export const ScienceTemplates: React.FC<Props> = ({ page }) => {
  const photo1 = page.photos && page.photos[0];
  const photo2 = page.photos && page.photos[1];

  return (
    <div className="w-full h-full bg-[#FDFBF7] text-slate-900 flex flex-col justify-start overflow-visible">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-sky-600 text-xs font-bold uppercase tracking-widest mb-1">
          <Atom className="w-4 h-4 animate-spin-slow" />
          <span>BİLİM & KEŞİF KÖŞESİ</span>
        </div>
        <h1 className="font-editorial text-3xl md:text-4xl font-extrabold text-slate-950 leading-tight">
          {page.title}
        </h1>
        {page.subtitle && (
          <p className="text-slate-600 text-xs md:text-sm italic font-serif mt-1 pb-1.5 border-b border-sky-200">
            {page.subtitle}
          </p>
        )}
      </div>

      {/* Main Grid Layout */}
      <div className="my-2.5 grid grid-cols-12 gap-4 flex-1">
        {/* Left Column (7 cols): Main Photo & Body */}
        <div className="col-span-7 flex flex-col">
          {photo1 && (
            <div className="relative rounded-xl overflow-hidden shadow-md border-2 border-sky-100 max-h-52 mb-2.5 group">
              <img src={photo1.url} alt={photo1.caption || 'Bilim'} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              {photo1.caption && (
                <div className="absolute bottom-0 inset-x-0 bg-slate-900/80 backdrop-blur-sm text-sky-200 text-[10px] px-3 py-1">
                  {photo1.caption}
                </div>
              )}
            </div>
          )}

          <div className="text-xs md:text-sm text-slate-700 leading-[1.45] text-justify whitespace-pre-line flex-1">
            {page.content}
          </div>
        </div>

        {/* Right Column (5 cols): "Biliyor Muydunuz?" Card + Supporting Visual + QR */}
        <div className="col-span-5 flex flex-col gap-3">
          {/* Did you know callout card */}
          <div className="bg-gradient-to-br from-sky-500 to-cyan-600 text-white p-4 rounded-xl shadow-md">
            <div className="flex items-center gap-2 text-sky-100 text-xs font-bold uppercase tracking-wider mb-2">
              <HelpCircle className="w-4 h-4 text-amber-300" />
              <span>BİLİYOR MUYDUNUZ?</span>
            </div>
            <p className="font-editorial italic text-xs md:text-sm leading-relaxed text-sky-50">
              {page.pullQuote || 'James Webb Teleskobu’nun aynaları altın kaplamadır ve -233 santigrat derecede çalışarak evrenin en eski ışıklarını yakalar.'}
            </p>
          </div>

          {/* Second photo if available */}
          {photo2 && (
            <div className="rounded-xl overflow-hidden border border-sky-200 shadow-sm flex-1 max-h-40">
              <img src={photo2.url} alt={photo2.caption || 'Bilim 2'} className="w-full h-full object-cover" />
            </div>
          )}

          {/* Interactive QR box */}
          {page.qrCodeDataUrl && (
            <div className="bg-sky-50 p-3 rounded-xl border border-sky-200 flex items-center gap-3">
              <img src={page.qrCodeDataUrl} alt="QR Kod" className="w-16 h-16 rounded-md bg-white p-1 shadow-sm shrink-0" />
              <div>
                <span className="text-[10px] font-bold text-sky-800 uppercase tracking-wide block">
                  {page.qrLabel || 'CANLI BİLİM AKIŞI'}
                </span>
                <span className="text-[11px] text-slate-600 leading-tight block mt-0.5">
                  Telefonunuzla okutarak interaktif bilim deneyine katılın.
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
