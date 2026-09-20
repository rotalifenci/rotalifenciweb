import React, { useState } from 'react';
import { MagazineIssue, PageFormat } from '../../types/magazine';
import { BookOpen, X, Sparkles } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (issueData: Partial<MagazineIssue>) => void;
  initialIssue?: MagazineIssue | null;
}

export const IssueModal: React.FC<Props> = ({ isOpen, onClose, onSave, initialIssue }) => {
  const [title, setTitle] = useState(initialIssue?.title || 'MAİDER');
  const [subtitle, setSubtitle] = useState(initialIssue?.subtitle || 'Mehmet Akif İnan Ortaokulu E-Dergisi');
  const [issueNumber, setIssueNumber] = useState(initialIssue?.issueNumber || 11);
  const [month, setMonth] = useState(initialIssue?.month || 'Ekim');
  const [year, setYear] = useState(initialIssue?.year || 2026);
  const [coverTitle, setCoverTitle] = useState(initialIssue?.coverTitle || 'Geleceğe İlham Veren Projeler');
  const [coverSubtitle, setCoverSubtitle] = useState(initialIssue?.coverSubtitle || 'Öğrencilerimiz Bilim, Sanat ve Edebiyatta Zirveyi Hedefliyor');
  const [slogan, setSlogan] = useState(initialIssue?.slogan || 'Geleceğe Kanat Açan Bilim ve Kültür Dergisi');
  const [editorName, setEditorName] = useState(initialIssue?.editorName || 'Ayşe Kaya (Yayın Yönetmeni)');
  const [format, setFormat] = useState<PageFormat>(initialIssue?.format || 'a4');
  const [coverImageUrl, setCoverImageUrl] = useState(
    initialIssue?.coverImageUrl || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80'
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title,
      subtitle,
      issueNumber: Number(issueNumber),
      month,
      year: Number(year),
      coverTitle,
      coverSubtitle,
      slogan,
      editorName,
      publishDate: `${month} ${year}`,
      format,
      coverImageUrl
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-xl w-full max-h-[92vh] flex flex-col text-slate-800 overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 sm:gap-2.5">
            <BookOpen className="w-5 h-5 text-sky-600" />
            <h3 className="font-editorial text-lg sm:text-xl font-bold text-slate-900">
              {initialIssue ? 'Sayı Bilgilerini Düzenle' : 'Yeni MAİDER Sayısı Başlat'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 text-xs overflow-y-auto">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-600 uppercase mb-1">Dergi Adı</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-bold focus:bg-white focus:outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-600 uppercase mb-1">Sayı No</label>
              <input
                type="number"
                value={issueNumber}
                onChange={(e) => setIssueNumber(Number(e.target.value))}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-bold focus:bg-white focus:outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-600 uppercase mb-1">Ay / Yıl</label>
              <div className="grid grid-cols-2 gap-1">
                <input
                  type="text"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  placeholder="Ay"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-2 text-slate-900 focus:bg-white focus:outline-none focus:border-sky-500"
                />
                <input
                  type="number"
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  placeholder="Yıl"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-2 text-slate-900 focus:bg-white focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-600 uppercase mb-1">Kapak Dosya Konusu *</label>
            <input
              type="text"
              value={coverTitle}
              onChange={(e) => setCoverTitle(e.target.value)}
              placeholder="Örn: Geleceğin Akıllı Şehirleri"
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-semibold focus:bg-white focus:outline-none focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-600 uppercase mb-1">Kapak Açıklaması / Spot</label>
            <textarea
              rows={2}
              value={coverSubtitle}
              onChange={(e) => setCoverSubtitle(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:bg-white focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-600 uppercase mb-1">Ana Slogan / Motto</label>
              <input
                type="text"
                value={slogan}
                onChange={(e) => setSlogan(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:bg-white focus:outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-600 uppercase mb-1">Yayın Yönetmeni / Editör</label>
              <input
                type="text"
                value={editorName}
                onChange={(e) => setEditorName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:bg-white focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          {/* Page Format: A4 Classic vs Digital Phone */}
          <div className="pt-2 border-t border-slate-200">
            <label className="block font-bold text-slate-600 uppercase mb-2">Sayfa Formatı</label>
            <div className="grid grid-cols-2 gap-3">
              <label
                className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-colors ${
                  format === 'a4'
                    ? 'bg-sky-50 border-sky-500 text-sky-900'
                    : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                <input
                  type="radio"
                  name="format"
                  value="a4"
                  checked={format === 'a4'}
                  onChange={() => setFormat('a4')}
                  className="hidden"
                />
                <div>
                  <span className="font-bold text-xs block">MAİDER Klasik (A4)</span>
                  <span className="text-[10px] text-slate-500">Standart dikey dergi oranı</span>
                </div>
              </label>

              <label
                className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-colors ${
                  format === 'digital'
                    ? 'bg-sky-50 border-sky-500 text-sky-900'
                    : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                <input
                  type="radio"
                  name="format"
                  value="digital"
                  checked={format === 'digital'}
                  onChange={() => setFormat('digital')}
                  className="hidden"
                />
                <div>
                  <span className="font-bold text-xs block">MAİDER Dijital (9:16)</span>
                  <span className="text-[10px] text-slate-500">Telefon ve ekrana uygun oran</span>
                </div>
              </label>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg border border-slate-300 hover:bg-slate-100"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              className="bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs px-5 py-2 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{initialIssue ? 'Değişiklikleri Kaydet' : 'Çalışma Alanını Başlat'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
