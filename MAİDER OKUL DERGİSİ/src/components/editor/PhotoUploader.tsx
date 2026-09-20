import React, { useRef, useState } from 'react';
import { MagazinePhoto } from '../../types/magazine';
import { Upload, Star, Trash2, AlertTriangle, FileText, Loader2 } from 'lucide-react';
import { processFileForMagazine } from '../../utils/fileUploadHelper';

interface Props {
  photos: MagazinePhoto[];
  onChange: (photos: MagazinePhoto[]) => void;
  onRecommendedLayout?: (layout: {
    recommendedPosition: 'full-width' | 'inline-left' | 'inline-right' | 'bottom';
    recommendedFit: 'contain' | 'cover';
    recommendedScale: number;
  }) => void;
}

export const PhotoUploader: React.FC<Props> = ({ photos, onChange, onRecommendedLayout }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setIsProcessing(true);
    const files = Array.from(fileList);
    const newPhotos: MagazinePhoto[] = [...photos];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const isFirst = newPhotos.length === 0;
        const result = await processFileForMagazine(file, isFirst);
        newPhotos.push(result.photo);
        if (isFirst && onRecommendedLayout) {
          onRecommendedLayout({
            recommendedPosition: result.recommendedPosition,
            recommendedFit: result.recommendedFit,
            recommendedScale: result.recommendedScale
          });
        }
      }
      onChange(newPhotos);
    } catch (err) {
      console.error('Dosya yükleme hatası:', err);
      alert('Dosya işlenirken bir hata oluştu.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const handleRemove = (id: string) => {
    const updated = photos.filter(p => p.id !== id);
    if (updated.length > 0 && !updated.some(p => p.isMain)) {
      updated[0].isMain = true;
    }
    onChange(updated);
  };

  const handleSetMain = (id: string) => {
    const updated = photos.map(p => ({
      ...p,
      isMain: p.id === id
    }));
    onChange(updated);
  };

  const handleUpdateCaption = (id: string, caption: string) => {
    const updated = photos.map(p => p.id === id ? { ...p, caption } : p);
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => !isProcessing && fileInputRef.current?.click()}
        className="border-2 border-dashed border-slate-300 hover:border-indigo-500 rounded-xl p-5 text-center bg-slate-50 hover:bg-indigo-50/40 cursor-pointer transition-all group shadow-2xs"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,application/pdf"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />
        <div className="w-11 h-11 rounded-full bg-slate-200 group-hover:bg-indigo-100 text-slate-600 group-hover:text-indigo-600 flex items-center justify-center mx-auto mb-2 transition-colors">
          {isProcessing ? (
            <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
          ) : (
            <Upload className="w-5 h-5" />
          )}
        </div>
        <div className="flex items-center justify-center gap-2">
          <button
            type="button"
            className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-colors pointer-events-none flex items-center gap-1.5"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>📁 Dosya / Görsel / PDF Ekle</span>
          </button>
        </div>
        <p className="text-xs text-slate-500 mt-2">
          Yüksek çözünürlüklü <strong className="text-slate-700">PNG, JPG, WebP</strong> veya <strong className="text-slate-700">PDF</strong> dosyası seçin veya buraya sürükleyin
        </p>
        <p className="text-[10px] text-slate-400 mt-0.5">
          Otomatik sayfa uyumlandırma & retina çözünürlük koruması aktiftir
        </p>
      </div>

      {photos.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className={`relative rounded-xl overflow-hidden border bg-white shadow-xs group ${
                photo.isMain ? 'border-amber-400 ring-2 ring-amber-400/30' : 'border-slate-200'
              }`}
            >
              <div className="aspect-[4/3] relative overflow-hidden bg-slate-100">
                <img src={photo.url} alt={photo.caption || 'Foto'} className="w-full h-full object-cover" />
                
                {photo.isMain && (
                  <span className="absolute top-1.5 left-1.5 bg-amber-500 text-slate-950 font-black text-[9px] uppercase px-1.5 py-0.5 rounded shadow-2xs">
                    ANA GÖRSEL
                  </span>
                )}

                {photo.isLowRes && (
                  <span
                    title="Bu görsel dijital dergi için düşük çözünürlüklü olabilir"
                    className="absolute top-1.5 right-1.5 bg-rose-500/90 text-white p-1 rounded shadow cursor-help"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                  </span>
                )}

                <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handleSetMain(photo.id); }}
                    className={`p-1.5 rounded-full text-xs font-semibold ${
                      photo.isMain ? 'bg-amber-500 text-slate-950' : 'bg-slate-700 hover:bg-amber-400 text-white hover:text-slate-950'
                    }`}
                    title="Ana Görsel Yap"
                  >
                    <Star className="w-4 h-4 fill-current" />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handleRemove(photo.id); }}
                    className="p-1.5 rounded-full bg-slate-700 hover:bg-rose-600 text-white"
                    title="Görseli Kaldır"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="p-2 bg-white border-t border-slate-100">
                <input
                  type="text"
                  value={photo.caption || ''}
                  onChange={(e) => handleUpdateCaption(photo.id, e.target.value)}
                  placeholder="Görsel altyazısı (caption)..."
                  className="w-full bg-slate-50 text-slate-800 text-[11px] px-2 py-1 rounded border border-slate-200 focus:outline-none focus:border-sky-500 focus:bg-white"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
