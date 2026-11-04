import React, { useState } from 'react';
import {
  GraduationCap,
  X,
  Lock,
  Save,
  Download,
  Upload,
  AlertTriangle,
  CheckCircle2,
  Edit3,
  FileSpreadsheet,
  Plus
} from 'lucide-react';
import { YearData, RootValueId } from '../types';
import { exportCurriculumToExcel, importCurriculumFromExcel } from '../utils/excelHandler';
import { ROOT_VALUES_LIST } from '../data/rootValues';

interface TeacherPanelModalProps {
  years: YearData[];
  onUpdateCurriculum: (updatedYears: YearData[]) => void;
  onClose: () => void;
}

export const TeacherPanelModal: React.FC<TeacherPanelModalProps> = ({
  years,
  onUpdateCurriculum,
  onClose
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');
  const [selectedYearNum, setSelectedYearNum] = useState<number>(571);
  const [curriculumData, setCurriculumData] = useState<YearData[]>(years);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'warn'; text: string } | null>(null);

  const selectedYear = curriculumData.find(y => y.year === selectedYearNum) || curriculumData[0];
  const activeMission = selectedYear.missions[0] || {};

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === 'siyer2026' || passwordInput === 'admin') {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Hatalı öğretmen şifresi! (Örnek: siyer2026)');
    }
  };

  const handleFieldChange = (field: string, value: any) => {
    setCurriculumData(prev => {
      return prev.map(y => {
        if (y.year !== selectedYearNum) return y;
        const updated = { ...y };

        if (field in updated) {
          (updated as any)[field] = value;
        } else if (updated.missions.length > 0) {
          const m = { ...updated.missions[0] };
          if (field in m) {
            (m as any)[field] = value;
          } else if (field === 'alternativeAnswers') {
            m.alternativeAnswers = typeof value === 'string' ? value.split(';').map(s => s.trim()) : value;
          } else if (field === 'valueId' && m.valueDiscovery) {
            m.valueDiscovery = { ...m.valueDiscovery, valueId: value };
          }
          updated.missions[0] = m;
        }
        return updated;
      });
    });
  };

  const handleSaveCurriculum = () => {
    onUpdateCurriculum(curriculumData);
    setStatusMessage({ type: 'success', text: 'Tüm müfredat değişiklikleri başarıyla kaydedildi!' });
    setTimeout(() => setStatusMessage(null), 3500);
  };

  const handleExcelExport = () => {
    exportCurriculumToExcel(curriculumData);
    setStatusMessage({ type: 'success', text: '62 yıllık müfredat Excel dosyası (.xlsx) olarak indirildi.' });
    setTimeout(() => setStatusMessage(null), 3500);
  };

  const handleExcelImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const result = await importCurriculumFromExcel(file, curriculumData);
      setCurriculumData(result.updatedYears);
      onUpdateCurriculum(result.updatedYears);

      if (result.warningMessages.length > 0) {
        setStatusMessage({
          type: 'warn',
          text: `Excel aktarıldı. Uyarılar: ${result.warningMessages.slice(0, 2).join(', ')}`
        });
      } else {
        setStatusMessage({ type: 'success', text: 'Excel müfredat dosyası başarıyla sisteme aktarıldı!' });
      }
    } catch (err: any) {
      setStatusMessage({ type: 'warn', text: 'Excel dosyası okunurken hata oluştu: ' + err.message });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/85 backdrop-blur-lg animate-fadeIn">
      <div className="relative w-full max-w-5xl h-[88vh] bg-stone-900 border-2 border-purple-500/70 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-stone-950 via-stone-900 to-stone-950 border-b border-purple-500/30">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-purple-900/40 border border-purple-500/50 text-purple-300">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-purple-200 font-title tracking-wider">
                ÖĞRETMEN YÖNETİM PANELİ
              </h2>
              <p className="text-xs text-stone-400">
                571–632 Yılları İçerik, Soru-Cevap & Excel Veri Yönetimi
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-2xl bg-stone-800 hover:bg-stone-700 text-stone-300 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* LOGIN GATE */}
        {!isAuthenticated ? (
          <div className="flex-1 flex items-center justify-center p-6">
            <form onSubmit={handleLogin} className="w-full max-w-md bg-stone-950 border border-purple-500/40 rounded-3xl p-8 space-y-5 shadow-2xl text-center">
              <div className="w-16 h-16 rounded-full bg-purple-500/20 border border-purple-500/40 flex items-center justify-center mx-auto text-purple-400">
                <Lock className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-stone-100">Öğretmen Girişi</h3>
                <p className="text-xs text-stone-400 mt-1">
                  Müfredat ve soru içeriklerini düzenlemek için şifrenizi giriniz.
                </p>
              </div>

              {authError && (
                <div className="text-rose-400 text-xs font-semibold bg-rose-950/40 border border-rose-600/40 p-2.5 rounded-xl">
                  {authError}
                </div>
              )}

              <input
                type="password"
                placeholder="Şifre (siyer2026)"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full bg-stone-900 border border-stone-700 focus:border-purple-500 rounded-2xl px-4 py-3 text-stone-100 placeholder-stone-600 outline-none text-center text-sm font-semibold"
                autoFocus
              />

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-400 hover:to-purple-500 text-white font-black text-sm transition shadow-lg shadow-purple-600/30"
              >
                Giriş Yap
              </button>
            </form>
          </div>
        ) : (
          /* AUTHENTICATED CMS BODY */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            
            {/* Year Selector Sidebar */}
            <div className="w-full md:w-64 bg-stone-950 border-r border-stone-800 p-3 flex flex-col overflow-hidden">
              <div className="text-xs font-bold text-stone-400 mb-2 px-1">
                YIL SEÇİNİZ (571–632):
              </div>
              <div className="flex-1 overflow-y-auto space-y-1 pr-1">
                {curriculumData.map(y => (
                  <button
                    key={y.year}
                    onClick={() => setSelectedYearNum(y.year)}
                    className={`w-full p-2 rounded-xl text-left text-xs font-bold transition flex items-center justify-between ${
                      y.year === selectedYearNum
                        ? 'bg-purple-900/60 border border-purple-500 text-purple-200'
                        : 'bg-stone-900/60 hover:bg-stone-800 text-stone-400'
                    }`}
                  >
                    <span>Yıl {y.year}</span>
                    <span className="truncate max-w-[110px] text-[11px] text-stone-500 font-normal">
                      {y.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Main Edit Form */}
            <div className="flex-1 bg-stone-900 p-6 overflow-y-auto space-y-6">
              
              {statusMessage && (
                <div
                  className={`p-3.5 rounded-2xl border text-xs sm:text-sm font-semibold flex items-center gap-2 ${
                    statusMessage.type === 'success'
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                      : 'bg-amber-950/80 border-amber-500 text-amber-200'
                  }`}
                >
                  {statusMessage.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertTriangle className="w-5 h-5 shrink-0" />}
                  <span>{statusMessage.text}</span>
                </div>
              )}

              {/* Action Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-stone-950 p-3 rounded-2xl border border-stone-800">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black text-purple-400 bg-purple-950/80 px-3 py-1 rounded-xl border border-purple-600/40">
                    Düzenlenen: Yıl {selectedYear.year}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Excel Export */}
                  <button
                    onClick={handleExcelExport}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-emerald-950/80 hover:text-emerald-300 text-stone-300 text-xs font-bold transition border border-stone-700"
                    title="Müfredatı Excel İndir"
                  >
                    <Download className="w-4 h-4 text-emerald-400" />
                    <span>Excel (.xlsx) İndir</span>
                  </button>

                  {/* Excel Import */}
                  <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-blue-950/80 hover:text-blue-300 text-stone-300 text-xs font-bold transition border border-stone-700 cursor-pointer">
                    <Upload className="w-4 h-4 text-blue-400" />
                    <span>Excel Yükle</span>
                    <input
                      type="file"
                      accept=".xlsx,.xls,.csv"
                      onChange={handleExcelImport}
                      className="hidden"
                    />
                  </label>

                  {/* Save Button */}
                  <button
                    onClick={handleSaveCurriculum}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-black transition shadow"
                  >
                    <Save className="w-4 h-4" />
                    <span>Değişiklikleri Kaydet</span>
                  </button>
                </div>
              </div>

              {/* Form Fields Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Olay Başlığı */}
                <div>
                  <label className="block text-xs font-bold text-stone-300 mb-1">
                    Olay Adı / Başlık:
                  </label>
                  <input
                    type="text"
                    value={selectedYear.title}
                    onChange={(e) => handleFieldChange('title', e.target.value)}
                    className="w-full bg-stone-950 border border-stone-700 focus:border-purple-500 rounded-xl px-3 py-2 text-stone-100 text-xs"
                  />
                </div>

                {/* Alt Başlık */}
                <div>
                  <label className="block text-xs font-bold text-stone-300 mb-1">
                    Alt Başlık / Vurgu:
                  </label>
                  <input
                    type="text"
                    value={selectedYear.subTitle}
                    onChange={(e) => handleFieldChange('subTitle', e.target.value)}
                    className="w-full bg-stone-950 border border-stone-700 focus:border-purple-500 rounded-xl px-3 py-2 text-stone-100 text-xs"
                  />
                </div>

                {/* Mekân */}
                <div>
                  <label className="block text-xs font-bold text-stone-300 mb-1">
                    Olay Yeri / Mekân:
                  </label>
                  <input
                    type="text"
                    value={selectedYear.location}
                    onChange={(e) => handleFieldChange('location', e.target.value)}
                    className="w-full bg-stone-950 border border-stone-700 focus:border-purple-500 rounded-xl px-3 py-2 text-stone-100 text-xs"
                  />
                </div>

                {/* İlişkili Kök Değer */}
                <div>
                  <label className="block text-xs font-bold text-stone-300 mb-1">
                    İlişkili Kök Değer:
                  </label>
                  <select
                    value={activeMission.valueDiscovery?.valueId || 'adalet'}
                    onChange={(e) => handleFieldChange('valueId', e.target.value)}
                    className="w-full bg-stone-950 border border-stone-700 focus:border-purple-500 rounded-xl px-3 py-2 text-stone-100 text-xs"
                  >
                    {ROOT_VALUES_LIST.map(v => (
                      <option key={v.id} value={v.id}>{v.name}</option>
                    ))}
                  </select>
                </div>

                {/* Tarihsel Anlatım */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-stone-300 mb-1">
                    Tarihsel Anlatım / Özet:
                  </label>
                  <textarea
                    rows={3}
                    value={selectedYear.historicalSummary}
                    onChange={(e) => handleFieldChange('historicalSummary', e.target.value)}
                    className="w-full bg-stone-950 border border-stone-700 focus:border-purple-500 rounded-xl px-3 py-2 text-stone-100 text-xs"
                  />
                </div>

                {/* Bilgi Sorusu */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-amber-400 mb-1">
                    Açık Uçlu Bilgi Sorusu:
                  </label>
                  <input
                    type="text"
                    value={activeMission.question || ''}
                    onChange={(e) => handleFieldChange('question', e.target.value)}
                    className="w-full bg-stone-950 border border-amber-600/40 focus:border-amber-400 rounded-xl px-3 py-2 text-stone-100 text-xs font-medium"
                  />
                </div>

                {/* Doğru Cevap */}
                <div>
                  <label className="block text-xs font-bold text-emerald-400 mb-1">
                    Doğru Cevap:
                  </label>
                  <input
                    type="text"
                    value={activeMission.correctAnswer || ''}
                    onChange={(e) => handleFieldChange('correctAnswer', e.target.value)}
                    className="w-full bg-stone-950 border border-emerald-600/40 focus:border-emerald-400 rounded-xl px-3 py-2 text-stone-100 text-xs font-medium"
                  />
                </div>

                {/* Alternatif Doğru Cevaplar */}
                <div>
                  <label className="block text-xs font-bold text-emerald-400 mb-1">
                    Alternatif Doğru Cevaplar (Noktalı virgülle ayırınız):
                  </label>
                  <input
                    type="text"
                    value={(activeMission.alternativeAnswers || []).join('; ')}
                    onChange={(e) => handleFieldChange('alternativeAnswers', e.target.value)}
                    className="w-full bg-stone-950 border border-emerald-600/40 focus:border-emerald-400 rounded-xl px-3 py-2 text-stone-100 text-xs font-medium"
                  />
                </div>

                {/* İpucu 1 */}
                <div>
                  <label className="block text-xs font-bold text-stone-300 mb-1">
                    1. Yanlışta Verilecek İpucu:
                  </label>
                  <input
                    type="text"
                    value={activeMission.hint1 || ''}
                    onChange={(e) => handleFieldChange('hint1', e.target.value)}
                    className="w-full bg-stone-950 border border-stone-700 focus:border-purple-500 rounded-xl px-3 py-2 text-stone-100 text-xs"
                  />
                </div>

                {/* İpucu 2 */}
                <div>
                  <label className="block text-xs font-bold text-stone-300 mb-1">
                    2. Yanlışta Verilecek İpucu:
                  </label>
                  <input
                    type="text"
                    value={activeMission.hint2 || ''}
                    onChange={(e) => handleFieldChange('hint2', e.target.value)}
                    className="w-full bg-stone-950 border border-stone-700 focus:border-purple-500 rounded-xl px-3 py-2 text-stone-100 text-xs"
                  />
                </div>

                {/* 3. Yanlışta Öğretici Açıklama */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-stone-300 mb-1">
                    3. Yanlışta Gösterilecek Ayrıntılı Açıklama:
                  </label>
                  <textarea
                    rows={2}
                    value={activeMission.thirdLevelExplanation || ''}
                    onChange={(e) => handleFieldChange('thirdLevelExplanation', e.target.value)}
                    className="w-full bg-stone-950 border border-stone-700 focus:border-purple-500 rounded-xl px-3 py-2 text-stone-100 text-xs"
                  />
                </div>

                {/* Video URL (MP4) */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-stone-300 mb-1">
                    Özel Animasyon Videosu URL'si (MP4 - İsteğe bağlı):
                  </label>
                  <input
                    type="text"
                    placeholder="Örn: /assets/videos/571_mecca.mp4 veya https://..."
                    value={activeMission.animationVideoUrl || ''}
                    onChange={(e) => handleFieldChange('animationVideoUrl', e.target.value)}
                    className="w-full bg-stone-950 border border-stone-700 focus:border-purple-500 rounded-xl px-3 py-2 text-stone-100 text-xs"
                  />
                </div>

              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};
