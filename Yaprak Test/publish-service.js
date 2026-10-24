const fs = require('fs');
const path = require('path');
const { buildInteractiveTestHtml, generateSlug } = require('./test-generator');

const WEB_SITEM_DIR = path.resolve(__dirname, '..', 'Web Sitem');
const ROOT_DIR = path.resolve(__dirname, '..');

async function publishTestToWebsite({
  questions = [],
  grade = "5",
  unit = "1. Ünite",
  targetSection = "1",
  category = "soru-bankasi",
  title = "",
  desc = "",
  subject = "Fen Bilimleri",
  autoDeploy = false
}) {
  if (!questions || questions.length === 0) {
    throw new Error("Yayınlanacak soru bulunamadı.");
  }

  // 1. Temiz Başlık ve Açıklama Oluştur
  const cleanGrade = String(grade).replace(/^grade-/, '').trim() || "5";
  const cleanSection = String(targetSection).replace(/^unit/i, '').replace(/[^0-9]/g, '') || "1";
  const finalTitle = title.trim() || `${cleanGrade}. Sınıf ${cleanSection}. Ünite Yaprak Testi (${questions.length} Soru)`;
  const finalDesc = desc.trim() || `${cleanGrade}. Sınıf ${subject} ${unit} için MEB Maarif Modeli uyumlu şekilli yaprak test. Cevap anahtarlı ve çözümlü.`;
  const finalCategory = category === "denemeler" ? "denemeler" : "soru-bankasi";

  // 2. Dosya Adı (Slug) Belirle (Tekrarları temizle)
  const cleanTitleForSlug = finalTitle
    .replace(new RegExp(`^${cleanGrade}\\.?\\s*Sınıf\\s*`, 'i'), '')
    .replace(new RegExp(`^${cleanSection}\\.?\\s*Ünite[:\\s]*`, 'i'), '')
    .trim();
  const slug = generateSlug(cleanTitleForSlug || finalTitle);
  const fileName = `${cleanGrade}-sinif-${cleanSection}-unite-${slug}.html`;

  // 3. İnteraktif Test HTML İçeriğini Üret
  const htmlContent = buildInteractiveTestHtml({
    title: finalTitle,
    grade: cleanGrade,
    unit: unit,
    targetSection: cleanSection,
    subject: subject,
    questions: questions
  });

  // 4. Test Dosyasını Hem 'Web Sitem/testler' Hem Kök 'testler' Klasörüne Kaydet
  const webTestDir = path.join(WEB_SITEM_DIR, 'testler');
  const rootTestDir = path.join(ROOT_DIR, 'testler');
  if (!fs.existsSync(webTestDir)) fs.mkdirSync(webTestDir, { recursive: true });
  if (!fs.existsSync(rootTestDir)) fs.mkdirSync(rootTestDir, { recursive: true });

  const webFilePath = path.join(webTestDir, fileName);
  const rootFilePath = path.join(rootTestDir, fileName);

  fs.writeFileSync(webFilePath, htmlContent, 'utf8');
  fs.writeFileSync(rootFilePath, htmlContent, 'utf8');
  console.log(`[Publish] Test HTML kaydedildi: ${fileName}`);

  // 5. Materyal Kaydını Oluştur
  const materialId = `mat-test-${cleanGrade}-${cleanSection}-${Date.now()}`;
  const coverUrl = `assets/test-kapak-${cleanGrade}.svg`;

  const newMaterial = {
    id: materialId,
    grade: cleanGrade,
    category: finalCategory,
    targetSection: cleanSection,
    title: finalTitle,
    unit: unit,
    desc: finalDesc,
    fileName: fileName,
    fileUrl: `testler/${fileName}`,
    imageUrl: coverUrl,
    kapakResmi: coverUrl,
    cover: coverUrl,
    format: "YAPRAK TEST",
    hasBlob: false,
    tags: [
      `${cleanGrade}. sınıf`,
      `${cleanSection}. ünite`,
      "yaprak test",
      "soru bankası",
      "kazanım testi",
      "deneme",
      "rotalı fenci",
      "meb maarif modeli"
    ],
    visibility: "public",
    downloadCount: `📝 ${questions.length} Soru`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  // 6. data/materials.json Dosyalarına Ekle (Hem Web Sitem hem Kök)
  const webMaterialsPath = path.join(WEB_SITEM_DIR, 'data', 'materials.json');
  const rootMaterialsPath = path.join(ROOT_DIR, 'data', 'materials.json');

  let currentMaterials = [];
  if (fs.existsSync(webMaterialsPath)) {
    try {
      currentMaterials = JSON.parse(fs.readFileSync(webMaterialsPath, 'utf8'));
    } catch (e) {
      currentMaterials = [];
    }
  }

  // Varsa güncelle, yoksa başa ekle
  const existingIdx = currentMaterials.findIndex(m => m.id === materialId || (m.fileName === fileName));
  if (existingIdx > -1) {
    currentMaterials[existingIdx] = newMaterial;
  } else {
    currentMaterials.unshift(newMaterial);
  }

  const jsonStr = JSON.stringify(currentMaterials, null, 2);
  fs.writeFileSync(webMaterialsPath, jsonStr, 'utf8');
  if (fs.existsSync(path.dirname(rootMaterialsPath))) {
    fs.writeFileSync(rootMaterialsPath, jsonStr, 'utf8');
  }
  console.log(`[Publish] materials.json güncellendi (Toplam: ${currentMaterials.length})`);

  // 7. Bulut Senkronizasyonu (Gist + GitHub Repo)
  let cloudSyncSuccess = false;
  try {
    const syncHandler = require('../api/sync.js');
    if (typeof syncHandler === 'function') {
      const mockReq = {
        method: "POST",
        body: {
          materials: [newMaterial],
          replace: false
        }
      };
      const mockRes = {
        headers: {},
        statusCode: 200,
        setHeader(k, v) { this.headers[k] = v; },
        status(code) { this.statusCode = code; return this; },
        json(data) { return data; },
        end() { return this; }
      };
      await syncHandler(mockReq, mockRes);
      cloudSyncSuccess = true;
      console.log(`[Publish] Cloud Sync (Gist & GitHub) başarıyla tamamlandı!`);
    }
  } catch (syncErr) {
    console.warn(`[Publish] Cloud sync uyarısı: ${syncErr.message}`);
  }

  // 8. İsteğe bağlı Git Deploy (yayinla.js)
  if (autoDeploy) {
    try {
      const { execFileSync } = require('child_process');
      const yayinlaScript = path.join(WEB_SITEM_DIR, 'scripts', 'yayinla.js');
      if (fs.existsSync(yayinlaScript)) {
        execFileSync("node", [yayinlaScript, `feat: publish test ${fileName}`], {
          cwd: WEB_SITEM_DIR,
          stdio: "ignore"
        });
        console.log(`[Publish] yayinla.js çalıştırıldı ve GitHub'a gönderildi.`);
      }
    } catch (deployErr) {
      console.warn(`[Publish] Deploy uyarısı: ${deployErr.message}`);
    }
  }

  return {
    success: true,
    materialId: materialId,
    title: finalTitle,
    grade: cleanGrade,
    unit: unit,
    targetSection: cleanSection,
    category: finalCategory,
    fileName: fileName,
    fileUrl: `testler/${fileName}`,
    webSectionUrl: `https://rotalifenci.vercel.app/#grade/grade-${cleanGrade}/${finalCategory}`,
    cloudSync: cloudSyncSuccess
  };
}

module.exports = {
  publishTestToWebsite
};
