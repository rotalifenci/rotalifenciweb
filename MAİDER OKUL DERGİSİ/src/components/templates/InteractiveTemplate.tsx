import React from 'react';
import { MagazinePage } from '../../types/magazine';
import { Gamepad2, Play, ExternalLink, QrCode } from 'lucide-react';

interface Props {
  page: MagazinePage;
}

export const InteractiveTemplate: React.FC<Props> = ({ page }) => {
  const photo = page.photos && page.photos[0];
  const btn = page.interactiveButton || { text: 'OYUNU BAŞLAT ??', url: 'https://wordwall.net' };

  return (
    <div className="w-full h-full bg-[#FDFBF7] text-slate-900 flex flex-col justify-start overflow-visible">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-purple-700 text-xs font-bold uppercase tracking-widest mb-1">
          <Gamepad2 className="w-4 h-4" />
          <span>ETKİLEŞİMLİ DİJİTAL OYUN VE ETKİNLİK</span>
        </div>
        <h1 className="font-editorial text-2xl md:text-3xl font-extrabold text-slate-950 leading-tight">
          {page.title}
        </h1>
        {page.subtitle && (
          <p className="text-slate-600 text-xs md:text-sm italic font-serif mt-1 pb-1.5 border-b border-purple-200">
            {page.subtitle}
          </p>
        )}
      </div>

      {/* Main Grid: Game Preview + Interactive Box */}
      <div className="my-2.5 grid grid-cols-12 gap-4 flex-1 items-center">
        {/* Game Visual Preview Left (7 cols) */}
        <div className="col-span-7 flex flex-col justify-start">
          {photo && (
            <div className="rounded-xl overflow-hidden shadow-md border-2 border-purple-200 relative group h-56 bg-slate-900">
              <img src={photo.url} alt="Oyun Önizleme" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90" />
              
              {/* Overlay Play Icon */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-16 h-16 rounded-full bg-purple-600/90 text-white flex items-center justify-center shadow-lg border-2 border-white">
                  <Play className="w-8 h-8 fill-current ml-1" />
                </div>
              </div>

              {photo.caption && (
                <div className="absolute bottom-0 inset-x-0 bg-slate-950/80 text-purple-200 text-[10px] p-2">
                  {photo.caption}
                </div>
              )}
            </div>
          )}

          <div className="mt-3 text-xs md:text-sm text-slate-700 leading-relaxed text-justify whitespace-pre-line flex-1">
            {page.content}
          </div>
        </div>

        {/* Right Interaction Panel (5 cols): QR Code + Large Button */}
        <div className="col-span-5 bg-gradient-to-br from-purple-500 to-indigo-700 text-white p-6 rounded-2xl shadow-xl flex flex-col items-center text-center justify-between h-full">
          <div>
            <span className="inline-block bg-amber-400 text-slate-950 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full mb-2">
              CANLI ETKİLEŞİM
            </span>
            <h3 className="font-editorial text-lg font-bold text-white">Telefonunla Oyna</h3>
            <p className="text-xs text-purple-100 mt-1">Kameranızı açıp aşağıdaki QR kodu taratın</p>
          </div>

          {/* QR Code Container */}
          <div className="my-3 p-3 bg-white rounded-xl shadow-md border-2 border-purple-300">
            {page.qrCodeDataUrl ? (
              <img src={page.qrCodeDataUrl} alt="QR" className="w-32 h-32 object-contain" />
            ) : (
              <div className="w-32 h-32 bg-slate-100 rounded flex flex-col items-center justify-center text-slate-500 text-xs">
                <QrCode className="w-8 h-8 mb-1" />
                <span>QR Kod</span>
              </div>
            )}
          </div>

          {/* Direct Play Button for Canva Presentation */}
          <a
            href={btn.url}
            target="_blank"
            rel="noreferrer"
            className="w-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs py-3 px-4 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-transform transform active:scale-95"
          >
            <span>{btn.text}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
