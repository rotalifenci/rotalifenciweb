const fs = require('fs');
const path = require('path');
const { buildInteractiveTestHtml, generateSlug } = require('../scripts/test-generator.js');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  try {
    const { questions, grade = "5", unit = "1. Ünite", targetSection = "1", category = "soru-bankasi", title = "", desc = "", subject = "Fen Bilimleri" } = req.body || {};

    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ error: "Yayınlanacak soru listesi eksik." });
    }

    const cleanGrade = String(grade).replace(/^grade-/, '').trim() || "5";
    const cleanSection = String(targetSection).replace(/^unit/i, '').replace(/[^0-9]/g, '') || "1";
    const finalTitle = title.trim() || `${cleanGrade}. Sınıf ${cleanSection}. Ünite Yaprak Testi (${questions.length} Soru)`;
    const finalDesc = desc.trim() || `${cleanGrade}. Sınıf ${subject} ${unit} için MEB Maarif Modeli uyumlu şekilli yaprak test. Cevap anahtarlı ve çözümlü.`;
    const finalCategory = category === "denemeler" ? "denemeler" : "soru-bankasi";

    const cleanTitleForSlug = finalTitle
      .replace(new RegExp(`^${cleanGrade}\\.?\\s*Sınıf\\s*`, 'i'), '')
      .replace(new RegExp(`^${cleanSection}\\.?\\s*Ünite[:\\s]*`, 'i'), '')
      .trim();
    const slug = generateSlug(cleanTitleForSlug || finalTitle);
    const fileName = `${cleanGrade}-sinif-${cleanSection}-unite-${slug}.html`;

    const htmlContent = buildInteractiveTestHtml({
      title: finalTitle,
      grade: cleanGrade,
      unit: unit,
      targetSection: cleanSection,
      subject: subject,
      questions: questions
    });

    const webDir = path.resolve(__dirname, '..');
    const rootDir = path.resolve(__dirname, '..', '..');

    const webTestDir = path.join(webDir, 'testler');
    const rootTestDir = path.join(rootDir, 'testler');
    if (!fs.existsSync(webTestDir)) fs.mkdirSync(webTestDir, { recursive: true });
    if (!fs.existsSync(rootTestDir) && fs.existsSync(rootDir)) fs.mkdirSync(rootTestDir, { recursive: true });

    const webFilePath = path.join(webTestDir, fileName);
    fs.writeFileSync(webFilePath, htmlContent, 'utf8');

    if (fs.existsSync(rootTestDir)) {
      const rootFilePath = path.join(rootTestDir, fileName);
      fs.writeFileSync(rootFilePath, htmlContent, 'utf8');
    }

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
        "test / deneme", "yazılıya hazırlık",
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

    const webMaterialsPath = path.join(webDir, 'data', 'materials.json');
    const rootMaterialsPath = path.join(rootDir, 'data', 'materials.json');

    let currentMaterials = [];
    if (fs.existsSync(webMaterialsPath)) {
      try {
        currentMaterials = JSON.parse(fs.readFileSync(webMaterialsPath, 'utf8'));
      } catch (e) {
        currentMaterials = [];
      }
    }

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

    // Gist & Cloud senkronizasyonu
    try {
      const syncHandler = require('./sync.js');
      if (typeof syncHandler === 'function') {
        const mockReq = { method: "POST", body: { materials: [newMaterial], replace: false } };
        const mockRes = { headers: {}, statusCode: 200, setHeader() {}, status() { return this; }, json(d) { return d; }, end() { return this; } };
        await syncHandler(mockReq, mockRes);
      }
    } catch (syncErr) {
      console.warn('[Publish] Cloud sync uyarısı:', syncErr.message);
    }

    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    return res.status(200).json({
      success: true,
      message: "Test başarıyla yayınlandı ve sitenize eklendi.",
      material: newMaterial,
      fileUrl: `testler/${fileName}`,
      sectionUrl: `index.html#grade-${cleanGrade}`
    });
  } catch (error) {
    console.error("Test yayınlama hatası:", error);
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    return res.status(500).json({
      error: "Test web sitesine yayınlanamadı.",
      details: error.message
    });
  }
};
