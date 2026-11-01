/**
 * Rotalı Fenci - Mevcut Test ve Sınav Kartlarını & Kapaklarını Eşleştirme ve Düzeltme Aracı
 * Bu script data/materials.json içerisindeki tüm soru/sınav dokümanlarını inceler:
 * 1. Soru türü çelişkilerini giderir (Açık uçlu etiketi altında kısa cevaplı veya yaprak test kapağı olanlar).
 * 2. Çalışma sıra numaralarını soru türü bazında sıralar ve tutarlı kılar.
 * 3. Her doküman için dinamik 16:9 kapak SVG dosyasını oluşturur ve kaydeder.
 * 4. materials.json'ı günceller.
 */

const fs = require('fs');
const path = require('path');
const { generateTestCoverSvg } = require('../api/cover-generator.js');

const rootDir = path.resolve(__dirname, '..');
const webMaterialsPath = path.join(rootDir, 'data', 'materials.json');
const rootMaterialsPath = path.join(rootDir, '..', 'data', 'materials.json');

if (!fs.existsSync(webMaterialsPath)) {
  console.error("materials.json bulunamadı:", webMaterialsPath);
  process.exit(1);
}

const materials = JSON.parse(fs.readFileSync(webMaterialsPath, 'utf8'));

// Her (grade, section, type) için sıra numarası takibi
const counters = {};

const updatedMaterials = materials.map(item => {
  const isTestOrExam = item.category === 'soru-bankasi' || 
                       item.category === 'denemeler' || 
                       (item.fileUrl && item.fileUrl.includes('testler/')) ||
                       (item.format && (item.format.includes('TEST') || item.format.includes('SINAV') || item.format.includes('ETKİNLİK')));

  if (!isTestOrExam) return item;

  const titleLower = String(item.title || "").toLowerCase();
  const formatLower = String(item.format || "").toLowerCase();
  const rawType = String(item.question_type || item.type || "").toLowerCase();

  // 1. Gerçek Soru Türünü Belirle
  let realType = "multiple_choice";
  let realFormat = "ÇOKTAN SEÇMELİ TEST";

  if (rawType.includes("activity") || formatLower.includes("etkinlik") || titleLower.includes("etkinlik")) {
    realType = "activity";
    realFormat = "ETKİNLİK ÇALIŞMASI";
  } else if (rawType.includes("short") || formatLower.includes("kısa") || titleLower.includes("kısa") || formatLower.includes("bosluk") || titleLower.includes("bosluk") || formatLower.includes("boşluk") || titleLower.includes("boşluk")) {
    realType = "short_answer";
    realFormat = "KISA CEVAPLI / BOŞLUK DOLDURMA";
  } else if (rawType.includes("open") || formatLower.includes("açık") || titleLower.includes("açık") || formatLower.includes("acik") || titleLower.includes("acik") || titleLower.includes("klasik") || formatLower.includes("klasik")) {
    realType = "open_ended";
    realFormat = "AÇIK UÇLU SINAV";
  } else if (formatLower.includes("deneme") || titleLower.includes("deneme") || item.category === "denemeler") {
    realType = "multiple_choice";
    realFormat = "DENEME SINAVI";
  }

  const gradeStr = String(item.grade || "5").replace(/[^0-9]/g, '') || "5";
  const sectionStr = String(item.targetSection || "1").replace(/[^0-9]/g, '') || "1";

  // Sıra numarası
  const key = `${gradeStr}_${sectionStr}_${realType}`;
  counters[key] = (counters[key] || 0) + 1;
  const currentNum = item.testNumber && typeof item.testNumber === 'number' && item.testNumber < 20 ? item.testNumber : counters[key];

  // Soru sayısı
  let qCount = item.questionCount || 10;
  const qMatch = (item.title || "").match(/(\d+)\s*(?:soru|etkinlik|içerik)/i) || (item.desc && item.desc.match(/(\d+)\s*(?:soru|etkinlik|içerik)/i));
  if (qMatch && qMatch[1]) {
    qCount = parseInt(qMatch[1], 10);
  }

  // Dinamik Kapak SVG Üret
  const unitName = item.unit || `${sectionStr}. Ünite`;
  const isAllOutcomes = Boolean(item.isAllOutcomes || item.subtopic === "Tüm Kazanımlar");
  const learningOutcome = item.learning_outcome || item.subtopic || "";

  const coverSvg = generateTestCoverSvg({
    grade: gradeStr,
    section: sectionStr,
    unitName: unitName,
    topic: item.topic || unitName,
    subtopic: item.subtopic || "",
    testType: realFormat,
    questionType: realType,
    testNumber: currentNum,
    questionCount: qCount,
    learningOutcome: learningOutcome,
    outcomeCode: item.learning_outcome_code || "",
    isAllOutcomes: isAllOutcomes
  });

  // Slug ve kapak dosya adı
  const baseSlug = (item.fileName || `test-${currentNum}`).replace(/\.html$/i, '');
  const coverFileName = `${baseSlug}-kapak.svg`;
  const coverRelPath = `assets/covers/${coverFileName}`;

  const webCoversDir = path.join(rootDir, 'assets', 'covers');
  const rootCoversDir = path.join(rootDir, '..', 'assets', 'covers');

  if (!fs.existsSync(webCoversDir)) fs.mkdirSync(webCoversDir, { recursive: true });
  fs.writeFileSync(path.join(webCoversDir, coverFileName), coverSvg, 'utf8');

  if (fs.existsSync(path.dirname(rootCoversDir))) {
    if (!fs.existsSync(rootCoversDir)) fs.mkdirSync(rootCoversDir, { recursive: true });
    fs.writeFileSync(path.join(rootCoversDir, coverFileName), coverSvg, 'utf8');
  }

  // Kart başlığını standartlaştır
  const typeDisplayTitle = realType === 'activity'
    ? `ETKİNLİK ÇALIŞMASI – ${currentNum}`
    : (realType === 'short_answer'
      ? `KISA CEVAPLI ÇALIŞMA – ${currentNum}`
      : (realType === 'open_ended'
        ? `AÇIK UÇLU SINAV – ${currentNum}`
        : (realFormat.includes('DENEME') ? `DENEME SINAVI – ${currentNum}` : `ÇOKTAN SEÇMELİ TEST – ${currentNum}`)));

  const fullCleanTitle = `${gradeStr}. Sınıf ${sectionStr}. Ünite: ${typeDisplayTitle} (${qCount} ${realType === 'activity' ? 'Etkinlik' : 'Soru'})`;

  return {
    ...item,
    type: realType,
    question_type: realType,
    format: realFormat,
    title: fullCleanTitle,
    testNumber: currentNum,
    questionCount: qCount,
    downloadCount: `📝 ${qCount} ${realType === 'activity' ? 'Etkinlik' : 'Soru'} • ${realType === 'activity' ? 'Etkinlik' : 'Test'}-${currentNum}`,
    imageUrl: coverRelPath,
    kapakResmi: coverRelPath,
    cover: coverRelPath,
    isAllOutcomes: isAllOutcomes,
    subtopic: isAllOutcomes ? "Tüm Kazanımlar" : (item.subtopic || "Genel")
  };
});

const jsonStr = JSON.stringify(updatedMaterials, null, 2);
fs.writeFileSync(webMaterialsPath, jsonStr, 'utf8');
if (fs.existsSync(path.dirname(rootMaterialsPath))) {
  fs.writeFileSync(rootMaterialsPath, jsonStr, 'utf8');
}

console.log("Reconciliation complete! Updated", updatedMaterials.filter(m => m.category === 'soru-bankasi' || m.category === 'denemeler').length, "test/exam materials with dynamic 16:9 covers.");
