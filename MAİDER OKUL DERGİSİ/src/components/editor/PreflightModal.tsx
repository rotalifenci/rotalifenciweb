import React from 'react';
import { PreflightReport } from '../../types/magazine';
import { ShieldCheck, AlertTriangle, XCircle, CheckCircle2, X, ArrowRight } from 'lucide-react';

interface Props {
  report: PreflightReport;
  isOpen: boolean;
  onClose: () => void;
  onProceedToCanvaExport: () => void;
  onNavigatePage?: (pageNum: number) => void;
}

export const PreflightModal: React.FC<Props> = ({
  report,
  isOpen,
  onClose,
  onProceedToCanvaExport,
  onNavigatePage
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col justify-between text-slate-800 overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 ${
              report.isValid ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-amber-50 text-amber-600 border border-amber-200'
            }`}>
              {report.isValid ? <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" /> : <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6" />}
            </div>
            <div>
              <h3 className="font-editorial text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                Dergiyi Kontrol Et & Canva Denetimi
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
                8 kritik kalite, tipografi ve Canva uyumluluk kontrolü
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 sm:space-y-5 flex-1">
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">TOPLAM DENETİM</span>
              <span className="text-xl font-mono font-black text-slate-900 mt-1 block">{report.totalChecks}</span>
            </div>

            <div className="bg-rose-50 p-3 rounded-xl border border-rose-200 text-center">
              <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider block">KRİTİK HATA</span>
              <span className="text-xl font-mono font-black text-rose-600 mt-1 block">{report.errorCount}</span>
            </div>

            <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-center">
              <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">UYARILAR</span>
              <span className="text-xl font-mono font-black text-amber-600 mt-1 block">{report.warningCount}</span>
            </div>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2 text-xs">
            <span className="font-bold text-slate-700 block uppercase text-[10px] tracking-wider">CANVA AKTARIM PARAMETRELERİ</span>
            <div className="grid grid-cols-2 gap-2 text-slate-600">
              <div className="flex items-center gap-1.5 text-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
                <span>Font Uyumluluğu: Merriweather & Inter</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
                <span>Katman Ayrımı: Metinler düzenlenebilir</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
                <span>Görseller: Yerel PPTX resim nesnesi</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
                <span>Linkler & QR: Canva üzerinde tıklanabilir köprü</span>
              </div>
            </div>
          </div>

          <div className="space-y-2.5">
            <span className="font-bold text-slate-700 block uppercase text-[10px] tracking-wider">BULGULAR</span>
            {report.items.length === 0 ? (
              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                <p className="font-bold text-emerald-800 text-sm">Harika! Hiçbir eksik veya sorun bulunamadı.</p>
                <p className="text-xs text-slate-500 mt-1">Dergiyi doğrudan Canva'ya aktarabilirsiniz.</p>
              </div>
            ) : (
              report.items.map((item) => (
                <div
                  key={item.id}
                  className={`p-3 rounded-xl border flex items-start gap-3 ${
                    item.type === 'error'
                      ? 'bg-rose-50 border-rose-200 text-rose-900'
                      : item.type === 'warning'
                      ? 'bg-amber-50 border-amber-200 text-amber-900'
                      : 'bg-sky-50 border-sky-200 text-sky-900'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {item.type === 'error' ? (
                      <XCircle className="w-4 h-4 text-rose-600" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{item.message}</span>
                      {item.pageNumber && (
                        <span className="text-[10px] px-2 py-0.5 bg-white border border-slate-200 rounded font-mono text-slate-700">
                          Sayfa {item.pageNumber}
                        </span>
                      )}
                    </div>
                    {item.detail && <p className="text-slate-500 mt-0.5">{item.detail}</p>}
                  </div>

                  {item.pageNumber && onNavigatePage && (
                    <button
                      type="button"
                      onClick={() => {
                        onNavigatePage(item.pageNumber!);
                        onClose();
                      }}
                      className="p-1.5 hover:bg-white rounded text-slate-500 hover:text-slate-900 shrink-0"
                      title="Sayfaya Git"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="p-4 sm:p-6 border-t border-slate-200 flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-2.5 bg-slate-50 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg border border-slate-300 hover:bg-white text-center"
          >
            Kapat ve Düzenlemeye Dön
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onProceedToCanvaExport();
            }}
            className="w-full sm:w-auto bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md flex items-center justify-center gap-2 transition-all transform active:scale-95"
          >
            <span>Canva'ya Aktar (PPTX Üret)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
