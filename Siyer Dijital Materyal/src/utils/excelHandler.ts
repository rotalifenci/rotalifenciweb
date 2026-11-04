import * as XLSX from 'xlsx';
import { YearData, StudentProgress } from '../types';

/**
 * Exports all 62 years of Siyer Curriculum into an Excel (.xlsx) file
 */
export function exportCurriculumToExcel(years: YearData[]) {
  const rows = years.map(y => {
    const m = y.missions[0] || {};
    const val = m.valueDiscovery;
    return {
      'Yıl': y.year,
      'Olay Adı': y.title,
      'Alt Başlık': y.subTitle,
      'Olay Yeri': y.location,
      'Tarihsel Anlatım': y.historicalSummary,
      'Tarihsel Kaynak': y.historicalSource?.sourceName || '',
      'Yazar / Referans': y.historicalSource?.authorOrRef || '',
      'Tarihsel Kesinlik Düzeyi': y.historicalSource?.certaintyLevel || 'Sahih / Kuvvetli',
      '3D Sahne Ortamı': y.sceneEnvironment,
      'Animasyon Videosu (MP4)': m.animationVideoUrl || '',
      'Ses Dosyası (MP3)': m.animationVoiceUrl || '',
      'Bilgi Sorusu': m.question || '',
      'Doğru Cevap': m.correctAnswer || '',
      'Alternatif Doğru Cevaplar': (m.alternativeAnswers || []).join('; '),
      'Birinci İpucu': m.hint1 || '',
      'İkinci İpucu': m.hint2 || '',
      'Üçüncü Destekleyici Açıklama': m.thirdLevelExplanation || '',
      'İlişkili Kök Değer': val?.valueId || '',
      'Değer Keşif Sorusu': val?.recognitionQuestion || '',
      'Günlük Yaşam Senaryosu': val?.scenarioQuestion || ''
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Siyer_571_632_Mufredat');

  XLSX.writeFile(workbook, `Dijital_Siyer_Yolculugu_62_Yil_Mufredat.xlsx`);
}

/**
 * Imports an Excel file and returns updated YearData[]
 */
export async function importCurriculumFromExcel(file: File, currentYears: YearData[]): Promise<{ updatedYears: YearData[]; warningMessages: string[] }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const json: any[] = XLSX.utils.sheet_to_json(sheet);

        const updatedYears = [...currentYears];
        const warnings: string[] = [];

        json.forEach((row, index) => {
          const rowYear = parseInt(row['Yıl'] || row['Yil'] || row['year']);
          if (isNaN(rowYear) || rowYear < 571 || rowYear > 632) {
            warnings.push(`Satır ${index + 2}: Geçersiz yıl (${row['Yıl']}). 571–632 arasında olmalıdır.`);
            return;
          }

          const existingIdx = updatedYears.findIndex(y => y.year === rowYear);
          if (existingIdx !== -1) {
            const y = { ...updatedYears[existingIdx] };
            if (row['Olay Adı']) y.title = String(row['Olay Adı']);
            if (row['Alt Başlık']) y.subTitle = String(row['Alt Başlık']);
            if (row['Olay Yeri']) y.location = String(row['Olay Yeri']);
            if (row['Tarihsel Anlatım']) y.historicalSummary = String(row['Tarihsel Anlatım']);
            if (row['Tarihsel Kaynak']) {
              y.historicalSource = {
                sourceName: String(row['Tarihsel Kaynak']),
                authorOrRef: String(row['Yazar / Referans'] || ''),
                certaintyLevel: (row['Tarihsel Kesinlik Düzeyi'] as any) || 'Sahih / Kuvvetli'
              };
            }

            if (y.missions.length > 0) {
              const m = { ...y.missions[0] };
              if (row['Bilgi Sorusu']) m.question = String(row['Bilgi Sorusu']);
              if (row['Doğru Cevap']) m.correctAnswer = String(row['Doğru Cevap']);
              if (row['Alternatif Doğru Cevaplar']) {
                m.alternativeAnswers = String(row['Alternatif Doğru Cevaplar']).split(';').map(s => s.trim());
              }
              if (row['Birinci İpucu']) m.hint1 = String(row['Birinci İpucu']);
              if (row['İkinci İpucu']) m.hint2 = String(row['İkinci İpucu']);
              if (row['Üçüncü Destekleyici Açıklama']) m.thirdLevelExplanation = String(row['Üçüncü Destekleyici Açıklama']);
              if (row['Animasyon Videosu (MP4)']) m.animationVideoUrl = String(row['Animasyon Videosu (MP4)']);
              y.missions[0] = m;
            }

            updatedYears[existingIdx] = y;
          }
        });

        resolve({ updatedYears, warningMessages: warnings });
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = (err) => reject(err);
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Export TÜBİTAK Research Data to Excel
 */
export function exportTubitakResearchData(progress: StudentProgress, allStudents: StudentProgress[] = []) {
  const studentsToExport = allStudents.length > 0 ? allStudents : [progress];

  const rows = studentsToExport.map(s => {
    const preScore = s.preTestScore || 0;
    const postScore = s.postTestScore || 0;
    // Normalized Gain (Hake's <g>)
    // g = (post - pre) / (max - pre)
    const maxScore = 10;
    let normalizedGain = 0;
    if (maxScore > preScore) {
      normalizedGain = Math.round(((postScore - preScore) / (maxScore - preScore)) * 100) / 100;
    }

    return {
      'Öğrenci Kodu (Anonim)': s.studentId,
      'Öğrenci Adı': s.studentName || 'Anonim Öğrenci',
      'Seçilen Karakter': s.character === 'eren' ? 'Eren' : 'Aybüke',
      'Mevcut Yıl': s.currentYear,
      'Tamamlanan Yıllar': s.completedYears.length,
      'Tamamlanan Görevler': s.completedMissionIds.length,
      'Doğru Cevap Sayısı': s.totalCorrect,
      'Yanlış Cevap Sayısı': s.totalWrong,
      'Kullanılan İpucu Sayısı': s.hintsUsedCount,
      'Tekrar İzlenen Video Sayısı': s.videosReplayedCount,
      'Keşfedilen Kök Değer Sayısı': s.unlockedValues.length,
      'Ön Test Puanı (/10)': preScore,
      'Son Test Puanı (/10)': postScore,
      'Puan Artışı (Fark)': postScore - preScore,
      'Hake Normalleştirilmiş Kazanç (g)': normalizedGain,
      'Son Kayıt Zamanı': s.lastSavedAt
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'TUBITAK_2204B_Olcme');

  XLSX.writeFile(workbook, `TUBITAK_2204B_Siyer_Arastirma_Verileri.xlsx`);
}
