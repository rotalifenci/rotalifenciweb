import React from 'react';
import {
  BarChart3,
  X,
  Download,
  Award,
  Users,
  TrendingUp,
  Brain,
  Heart,
  FileSpreadsheet,
  CheckCircle2
} from 'lucide-react';
import { StudentProgress } from '../types';
import { exportTubitakResearchData } from '../utils/excelHandler';
import { loadAllStudents } from '../utils/storage';

interface ResearchPanelModalProps {
  currentStudent: StudentProgress;
  onStartPreTest: () => void;
  onStartPostTest: () => void;
  onClose: () => void;
}

export const ResearchPanelModal: React.FC<ResearchPanelModalProps> = ({
  currentStudent,
  onStartPreTest,
  onStartPostTest,
  onClose
}) => {
  const allStudents = loadAllStudents();
  const cohort = allStudents.length > 0 ? allStudents : [currentStudent];

  // Statistical aggregates
  const preScore = currentStudent.preTestScore || 0;
  const postScore = currentStudent.postTestScore || 0;
  const maxScore = 10;
  const gain = maxScore > preScore ? Math.round(((postScore - preScore) / (maxScore - preScore)) * 100) / 100 : 0;

  const handleExportExcel = () => {
    exportTubitakResearchData(currentStudent, cohort);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/85 backdrop-blur-lg animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-stone-900 border-2 border-blue-500/70 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-stone-950 via-stone-900 to-stone-950 border-b border-blue-500/30">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-blue-900/40 border border-blue-500/50 text-blue-300">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-blue-200 font-title tracking-wider">
                TÜBİTAK 2204-B ÖLÇME VE DEĞERLENDİRME
              </h2>
              <p className="text-xs text-stone-400">
                Siyer Bilgi Düzeyi & Kök Değerler Farkındalığı Araştırma Paneli
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

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Top Info Banner */}
          <div className="bg-stone-950 border border-blue-500/30 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs text-blue-400 font-bold uppercase tracking-wider block">
                Öğrenci Araştırma Kodu (KVKK / Gizlilik Uyumlu Anonim Kod):
              </span>
              <span className="text-xl font-black text-stone-100 font-mono">
                {currentStudent.studentId}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleExportExcel}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs sm:text-sm transition shadow-lg shadow-emerald-700/30"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Araştırma Verilerini İndir (Excel/CSV)</span>
              </button>
            </div>
          </div>

          {/* Test Buttons & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Pre-Test Card */}
            <div className="bg-stone-950/80 border border-stone-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-amber-400 uppercase tracking-wider">
                  Ön Test (Uygulama Öncesi)
                </span>
                {currentStudent.preTestCompleted ? (
                  <span className="text-xs bg-emerald-950 text-emerald-300 border border-emerald-700/50 px-2 py-0.5 rounded-lg font-bold">
                    Tamamlandı: {currentStudent.preTestScore} / 10
                  </span>
                ) : (
                  <span className="text-xs bg-stone-800 text-stone-400 px-2 py-0.5 rounded-lg font-bold">
                    Bekliyor
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-400">
                Öğrencinin oyuna başlamadan önceki Siyer bilgisi ve 10 kök değere ilişkin hazırbulunuşluk düzeyini ölçer.
              </p>
              <button
                onClick={onStartPreTest}
                className="w-full py-2.5 rounded-xl bg-stone-800 hover:bg-amber-950/80 hover:text-amber-300 text-stone-200 text-xs font-bold transition border border-stone-700"
              >
                {currentStudent.preTestCompleted ? 'Ön Testi Yeniden İncele' : 'Ön Testi Başlat'}
              </button>
            </div>

            {/* Post-Test Card */}
            <div className="bg-stone-950/80 border border-stone-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-emerald-400 uppercase tracking-wider">
                  Son Test (Uygulama Sonrası)
                </span>
                {currentStudent.postTestCompleted ? (
                  <span className="text-xs bg-emerald-950 text-emerald-300 border border-emerald-700/50 px-2 py-0.5 rounded-lg font-bold">
                    Tamamlandı: {currentStudent.postTestScore} / 10
                  </span>
                ) : (
                  <span className="text-xs bg-stone-800 text-stone-400 px-2 py-0.5 rounded-lg font-bold">
                    Bekliyor
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-400">
                Oyun deneyimi ve değer keşif durakları sonrasında öğrencinin bilgi ve kök değer farkındalığındaki kalıcı gelişimi ölçer.
              </p>
              <button
                onClick={onStartPostTest}
                className="w-full py-2.5 rounded-xl bg-stone-800 hover:bg-emerald-950/80 hover:text-emerald-300 text-stone-200 text-xs font-bold transition border border-stone-700"
              >
                {currentStudent.postTestCompleted ? 'Son Testi Yeniden İncele' : 'Son Testi Başlat'}
              </button>
            </div>

          </div>

          {/* Statistical Analytics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800 text-center">
              <div className="text-xs text-stone-400 mb-1">Ön Test</div>
              <div className="text-2xl font-black text-amber-400">{preScore} / 10</div>
            </div>

            <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800 text-center">
              <div className="text-xs text-stone-400 mb-1">Son Test</div>
              <div className="text-2xl font-black text-emerald-400">{postScore} / 10</div>
            </div>

            <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800 text-center">
              <div className="text-xs text-stone-400 mb-1">Puan Farkı</div>
              <div className="text-2xl font-black text-blue-400">+{Math.max(0, postScore - preScore)}</div>
            </div>

            <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800 text-center">
              <div className="text-xs text-stone-400 mb-1">Hake Kazancı (g)</div>
              <div className="text-2xl font-black text-purple-400">{gain}</div>
            </div>
          </div>

          {/* Detailed In-Game Metrics */}
          <div className="bg-stone-950 p-5 rounded-2xl border border-stone-800 space-y-4">
            <h4 className="text-xs font-black text-stone-300 uppercase tracking-wider">
              Süreç İçi Oyun Davranış ve Öğrenme İstatistikleri:
            </h4>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-stone-500 block">Tamamlanan Yıllar:</span>
                <span className="text-sm font-bold text-stone-200">{currentStudent.completedYears.length} Yıl</span>
              </div>
              <div>
                <span className="text-stone-500 block">Doğru Cevaplar:</span>
                <span className="text-sm font-bold text-emerald-400">{currentStudent.totalCorrect} adet</span>
              </div>
              <div>
                <span className="text-stone-500 block">Yanlış Cevaplar:</span>
                <span className="text-sm font-bold text-rose-400">{currentStudent.totalWrong} adet</span>
              </div>
              <div>
                <span className="text-stone-500 block">Kullanılan İpuçları:</span>
                <span className="text-sm font-bold text-amber-400">{currentStudent.hintsUsedCount} defa</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
