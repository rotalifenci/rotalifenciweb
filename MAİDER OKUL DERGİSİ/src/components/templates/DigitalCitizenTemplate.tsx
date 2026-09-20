import React from 'react';
import { MagazinePage } from '../../types/magazine';
import { ShieldCheck, Lock, Eye, AlertCircle } from 'lucide-react';

interface Props {
  page: MagazinePage;
}

export const DigitalCitizenTemplate: React.FC<Props> = ({ page }) => {
  const photo = page.photos && page.photos[0];

  return (
    <div className="w-full h-full bg-[#FDFBF7] text-slate-900 flex flex-col justify-start overflow-visible">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-indigo-700 text-xs font-bold uppercase tracking-widest mb-1">
          <ShieldCheck className="w-4 h-4" />
          <span>DİJİTAL VATANDAŞLIK VE SİBER GÜVENLİK</span>
        </div>
        <h1 className="font-editorial text-2xl md:text-3xl font-extrabold text-slate-950 leading-tight">
          {page.title}
        </h1>
        {page.subtitle && (
          <p className="text-slate-600 text-xs md:text-sm italic font-serif mt-1 pb-1.5 border-b border-indigo-200">
            {page.subtitle}
          </p>
        )}
      </div>

      {/* Main Grid: 3 Security Rules + Visual */}
      <div className="my-2 grid grid-cols-12 gap-4 flex-1 items-start">
        {/* Rules Left (7 cols) */}
        <div className="col-span-7 space-y-2">
          <div className="bg-indigo-50/80 p-3.5 rounded-xl border border-indigo-200 flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-indigo-950 uppercase">1. Güçlü Parolalar Oluşturun</h4>
              <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                Doğum tarihi veya adınız yerine büyük-küçük harf, rakam ve sembol içeren en az 12 karakterli şifreler belirleyin.
              </p>
            </div>
          </div>

          <div className="bg-sky-50/80 p-3.5 rounded-xl border border-sky-200 flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-sky-600 text-white flex items-center justify-center shrink-0 mt-0.5">
              <Eye className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-sky-950 uppercase">2. Dijital Ayak İzinizi Kontrol Edin</h4>
              <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                İnternette paylaştığınız fotoğraflar ve kişisel bilgiler asla tamamen silinmez. Paylaşmadan önce iki kez düşünün.
              </p>
            </div>
          </div>

          <div className="bg-rose-50/80 p-3.5 rounded-xl border border-rose-200 flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-rose-600 text-white flex items-center justify-center shrink-0 mt-0.5">
              <AlertCircle className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-rose-950 uppercase">3. Siber Zorbalığa Karşı Sessiz Kalmayın</h4>
              <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                Kırıcı mesajlar veya izinsiz paylaşımlarla karşılaştığınızda mutlaka öğretmenleriniz ve ailenizle paylaşın.
              </p>
            </div>
          </div>
        </div>

        {/* Visual & QR Right (5 cols) */}
        <div className="col-span-5 flex flex-col gap-3">
          {photo && (
            <div className="rounded-xl overflow-hidden border border-indigo-200 shadow-sm h-48">
              <img src={photo.url} alt="Siber Güvenlik" className="w-full h-full object-cover" />
            </div>
          )}

          {page.qrCodeDataUrl && (
            <div className="bg-white p-3 rounded-xl border border-indigo-200 shadow-sm flex items-center gap-3">
              <img src={page.qrCodeDataUrl} alt="QR" className="w-16 h-16 object-contain" />
              <div>
                <span className="text-[10px] font-bold text-indigo-900 uppercase block">MEB GÜVENLİ İNTERNET</span>
                <span className="text-[11px] text-slate-600 block mt-0.5">Bilinçli kullanım kılavuzuna ulaşmak için tara.</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
