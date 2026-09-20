import React from 'react';
import { MagazinePage } from '../../types/magazine';
import { Cpu, AlertTriangle, Target, Settings, CheckCircle2, Play } from 'lucide-react';

interface Props {
  page: MagazinePage;
}

export const StemTemplate: React.FC<Props> = ({ page }) => {
  const stem = page.extraData?.stemData || {
    problem: 'Geleneksel yöntemlerle tarım ve şehir alanlarında aşırı enerji ve su israfı yaşanmaktadır.',
    purpose: 'IoT sensörleri ve mikrodenetleyiciler ile kendi kendini yöneten otonom ekolojik döngü kurmak.',
    process: 'Devre şemalarının çizimi, 3B yazıcıda parça basımı, kodlama ve laboratuvar testleri.',
    result: '%45 su ve %30 enerji tasarrufu sağlandı; öğrencilerimiz algoritmik problem çözme becerisi kazandı.'
  };

  const photos = page.photos || [];

  return (
    <div className="w-full h-full bg-[#FDFBF7] text-slate-900 flex flex-col justify-start overflow-visible">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2 text-purple-700 text-xs font-bold uppercase tracking-widest">
            <Cpu className="w-4 h-4" />
            <span>STEM & ROBOTİK ATÖLYESİ</span>
          </div>
          {page.author && (
            <span className="text-xs text-purple-900 bg-purple-100 px-2.5 py-0.5 rounded font-medium">
              {page.author} {page.authorRole ? `• ${page.authorRole}` : ''}
            </span>
          )}
        </div>

        <h1 className="font-editorial text-2xl md:text-3xl font-extrabold text-slate-950 leading-tight">
          {page.title}
        </h1>
        {page.subtitle && (
          <p className="text-slate-600 text-xs italic mt-0.5 pb-2 border-b border-purple-200">
            {page.subtitle}
          </p>
        )}
      </div>

      {/* Main Grid: STEM 4-Box Matrix + Photos */}
      <div className="my-3 grid grid-cols-12 gap-4 flex-1">
        {/* Left (7 cols): The 4 STEM Engineering Phases */}
        <div className="col-span-7 grid grid-cols-2 gap-2.5">
          {/* 1. Problem */}
          <div className="bg-rose-50/70 border-l-4 border-rose-500 p-3 rounded-r-lg shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-rose-700 text-[11px] font-bold uppercase tracking-wider mb-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>1. PROBLEM</span>
              </div>
              <p className="text-xs text-slate-700 leading-snug">{stem.problem}</p>
            </div>
          </div>

          {/* 2. Amaç */}
          <div className="bg-sky-50/70 border-l-4 border-sky-500 p-3 rounded-r-lg shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-sky-700 text-[11px] font-bold uppercase tracking-wider mb-1">
                <Target className="w-3.5 h-3.5" />
                <span>2. AMAÇ</span>
              </div>
              <p className="text-xs text-slate-700 leading-snug">{stem.purpose}</p>
            </div>
          </div>

          {/* 3. Süreç */}
          <div className="bg-amber-50/70 border-l-4 border-amber-500 p-3 rounded-r-lg shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-amber-700 text-[11px] font-bold uppercase tracking-wider mb-1">
                <Settings className="w-3.5 h-3.5" />
                <span>3. SÜREÇ</span>
              </div>
              <p className="text-xs text-slate-700 leading-snug">{stem.process}</p>
            </div>
          </div>

          {/* 4. Sonuç */}
          <div className="bg-emerald-50/70 border-l-4 border-emerald-500 p-3 rounded-r-lg shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-emerald-700 text-[11px] font-bold uppercase tracking-wider mb-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>4. SONUÇ</span>
              </div>
              <p className="text-xs text-slate-700 leading-snug">{stem.result}</p>
            </div>
          </div>

          {/* Project Summary paragraph below the 4 cards */}
          <div className="col-span-2 text-xs text-slate-700 leading-relaxed text-justify mt-1">
            {page.content}
          </div>
        </div>

        {/* Right (5 cols): Photos & Video Callout */}
        <div className="col-span-5 flex flex-col gap-2">
          {photos[0] && (
            <div className="rounded-lg overflow-hidden shadow-sm border border-purple-200 h-44">
              <img src={photos[0].url} alt={photos[0].caption || 'Proje'} className="w-full h-full object-cover" />
            </div>
          )}

          {photos.length > 1 && (
            <div className="grid grid-cols-2 gap-2 h-24">
              {photos.slice(1, 3).map((p, idx) => (
                <div key={idx} className="rounded-lg overflow-hidden border border-purple-200">
                  <img src={p.url} alt={p.caption || 'Ek fotoğraf'} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}

          {/* Interactive QR and Button Box */}
          {(page.qrCodeDataUrl || page.qrUrl) && (
            <div className="mt-auto bg-purple-50 p-2.5 rounded-lg border border-purple-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {page.qrCodeDataUrl && (
                  <img src={page.qrCodeDataUrl} alt="QR" className="w-12 h-12 rounded bg-white p-0.5 border shrink-0" />
                )}
                <div>
                  <span className="text-[10px] font-bold text-purple-900 uppercase block">PROJE VİDEOSU</span>
                  <span className="text-[9px] text-slate-600 block">Kameranla tara veya butona tıkla</span>
                </div>
              </div>

              <a
                href={page.qrUrl || '#'}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 bg-purple-700 hover:bg-purple-800 text-white text-[10px] font-bold px-2.5 py-1.5 rounded shadow transition-colors"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>İZLE</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
