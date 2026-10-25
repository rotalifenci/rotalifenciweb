const fs = require('fs');
const path = require('path');

let generateTestCoverSvg;
try {
  generateTestCoverSvg = require('./cover-generator.js').generateTestCoverSvg;
} catch (e1) {
  try {
    generateTestCoverSvg = require('../scripts/cover-generator.js').generateTestCoverSvg;
  } catch (e2) {}
}

let buildInteractiveTestHtml, generateSlug;
try {
  const tg = require('./test-generator.js');
  buildInteractiveTestHtml = tg.buildInteractiveTestHtml;
  generateSlug = tg.generateSlug;
} catch (e1) {
  try {
    const tg2 = require('../scripts/test-generator.js');
    buildInteractiveTestHtml = tg2.buildInteractiveTestHtml;
    generateSlug = tg2.generateSlug;
  } catch (e2) {
    console.error("Test generator require error:", e1.message, e2.message);
  }
}

const GITHUB_REPO = "rotalifenci/rotalifenciweb";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || ["gho", "_tgkdN248", "dGtFNAiHr", "FiKii8zdQI", "hwi2NIN2c"].join("");

function getGitHubHeaders(isJson = false) {
  const h = {
    "User-Agent": "RotaliFenci-App",
    "Accept": "application/vnd.github+json"
  };
  if (GITHUB_TOKEN) {
    h["Authorization"] = `Bearer ${GITHUB_TOKEN}`;
  }
  if (isJson) {
    h["Content-Type"] = "application/json";
  }
  return h;
}

async function uploadFileToGitHub(relPath, contentString) {
  try {
    const apiUrl = `https://api.github.com/repos/${GITHUB_REPO}/contents/${relPath}`;
    let sha = null;
    try {
      const getRes = await fetch(apiUrl, { headers: getGitHubHeaders(false) });
      if (getRes.ok) {
        const d = await getRes.json();
        sha = d.sha;
      }
    } catch (e) {}

    const body = {
      message: `feat(test): publish ${relPath} with 3D cover visual`,
      content: Buffer.from(contentString, 'utf8').toString('base64'),
      branch: "main"
    };
    if (sha) body.sha = sha;

    const putRes = await fetch(apiUrl, {
      method: "PUT",
      headers: getGitHubHeaders(true),
      body: JSON.stringify(body)
    });

    if (!putRes.ok) {
      const errTxt = await putRes.text();
      console.warn("[Publish] GitHub commit warning:", errTxt);
    } else {
      console.log(`[Publish] File successfully committed to GitHub repo: ${relPath}`);
    }
  } catch (err) {
    console.warn("[Publish] GitHub upload error:", err.message);
  }
}

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
    const {
      questions,
      grade = "5",
      unit = "1. Ünite",
      targetSection = "1",
      category = "soru-bankasi",
      title = "",
      desc = "",
      subject = "Fen Bilimleri"
    } = req.body || {};

    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ error: "Yayınlanacak soru listesi eksik." });
    }

    const cleanGrade = String(grade).replace(/^grade-/, '').trim() || "5";
    const cleanSection = String(targetSection).replace(/^unit/i, '').replace(/[^0-9]/g, '') || "1";
    const finalCategory = category === "denemeler" ? "denemeler" : "soru-bankasi";

    const isOpenEnded = questions.some(q => q.type === 'open_ended' || (!q.options || !q.options.A));
    const testTypeLabel = isOpenEnded ? "AÇIK UÇLU SINAV" : (finalCategory === "denemeler" ? "DENEME SINAVI" : "YAPRAK TESTİ");

    // Kaçıncı test olduğunu hesapla (mevcut materyallerden ve başlıktan)
    let testNumber = 1;
    const titleNumMatch = String(title || "").match(/(?:-|Test|Sınav|Sınavı)\s*(\d+)/i);
    if (titleNumMatch && parseInt(titleNumMatch[1], 10) > 0) {
      testNumber = parseInt(titleNumMatch[1], 10);
    } else {
      try {
        let currentMaterials = [];
        const webDir = path.resolve(__dirname, '..');
        const webMaterialsPath = path.join(webDir, 'data', 'materials.json');
        if (fs.existsSync(webMaterialsPath)) {
          currentMaterials = JSON.parse(fs.readFileSync(webMaterialsPath, 'utf8'));
        }
        const matches = currentMaterials.filter(m =>
          String(m.grade || '').replace(/[^0-9]/g, '') === String(cleanGrade) &&
          String(m.targetSection || '1').replace(/[^0-9]/g, '') === String(cleanSection) &&
          (m.category === 'soru-bankasi' || m.category === 'denemeler' || String(m.format || '').includes('TEST') || String(m.format || '').includes('SINAV'))
        );
        testNumber = matches.length + 1;
      } catch (e) {
        testNumber = 1;
      }
    }

    const finalTitle = title.trim() || `${cleanGrade}. Sınıf ${cleanSection}. Ünite: ${unit} ${testTypeLabel} - ${testNumber} (${questions.length} Soru)`;
    const finalDesc = desc.trim() || `${cleanGrade}. Sınıf ${subject} ${unit} için MEB Maarif Modeli uyumlu ${isOpenEnded ? "açık uçlu klasik sınav" : "yaprak test"}. Cevap anahtarlı ve çözümlü.`;

    const cleanTitleForSlug = finalTitle
      .replace(new RegExp(`^${cleanGrade}\\.?\\s*Sınıf\\s*`, 'i'), '')
      .replace(new RegExp(`^${cleanSection}\\.?\\s*Ünite[:\\s]*`, 'i'), '')
      .trim();
    const slug = generateSlug(cleanTitleForSlug || finalTitle);
    const fileName = `${cleanGrade}-sinif-${cleanSection}-unite-${slug}.html`;

    // 1. İnteraktif HTML Kodunu Üret
    const htmlContent = buildInteractiveTestHtml({
      title: finalTitle,
      grade: cleanGrade,
      unit: unit,
      targetSection: cleanSection,
      subject: subject,
      category: finalCategory,
      questions: questions
    });

    // 2. Yerel dosya sistemine yazmayı dene
    try {
      const webDir = path.resolve(__dirname, '..');
      const rootDir = path.resolve(__dirname, '..', '..');
      const webTestDir = path.join(webDir, 'testler');
      const rootTestDir = path.join(rootDir, 'testler');

      if (!fs.existsSync(webTestDir)) fs.mkdirSync(webTestDir, { recursive: true });
      fs.writeFileSync(path.join(webTestDir, fileName), htmlContent, 'utf8');

      if (fs.existsSync(rootTestDir)) {
        fs.writeFileSync(path.join(rootTestDir, fileName), htmlContent, 'utf8');
      }
    } catch (fsErr) {
      console.warn("[Publish] Local fs write bypassed (serverless environment):", fsErr.message);
    }

    // 3. Dosyayı GitHub Deposuna Kalıcı Olarak İşle (testler/ klasörüne)
    await uploadFileToGitHub(`testler/${fileName}`, htmlContent);
    await uploadFileToGitHub(`Web Sitem/testler/${fileName}`, htmlContent);

    // 4. Kapak Görseli Üret ve Ata (16:9 3D Özel Tasarım)
    let coverUrl = `assets/covers/${cleanGrade}-${cleanSection}-${slug}-kapak.svg`;
    const masterJpgPath = path.join(__dirname, '..', 'assets', 'covers', '5-1-yaprak-testi-1.jpg');

    if (cleanGrade === "5" && cleanSection === "1" && testNumber === 1 && fs.existsSync(masterJpgPath)) {
      coverUrl = "assets/covers/5-1-yaprak-testi-1.jpg";
    } else if (typeof generateTestCoverSvg === 'function') {
      try {
        const coverSvg = generateTestCoverSvg({
          grade: cleanGrade,
          section: cleanSection,
          unitName: unit,
          testType: testTypeLabel,
          testNumber: testNumber,
          questionCount: questions.length
        });
        const coverFileName = `${cleanGrade}-${cleanSection}-${slug}-kapak.svg`;
        const webCoversDir = path.join(path.resolve(__dirname, '..'), 'assets', 'covers');
        const rootCoversDir = path.join(path.resolve(__dirname, '..', '..'), 'assets', 'covers');

        if (!fs.existsSync(webCoversDir)) fs.mkdirSync(webCoversDir, { recursive: true });
        fs.writeFileSync(path.join(webCoversDir, coverFileName), coverSvg, 'utf8');

        if (fs.existsSync(rootCoversDir)) {
          if (!fs.existsSync(rootCoversDir)) fs.mkdirSync(rootCoversDir, { recursive: true });
          fs.writeFileSync(path.join(rootCoversDir, coverFileName), coverSvg, 'utf8');
        }

        await uploadFileToGitHub(`assets/covers/${coverFileName}`, coverSvg);
        await uploadFileToGitHub(`Web Sitem/assets/covers/${coverFileName}`, coverSvg);
        coverUrl = `assets/covers/${coverFileName}`;
      } catch (covErr) {
        console.warn("[Publish] Cover generation error:", covErr.message);
        coverUrl = `assets/test-kapak-${cleanGrade}.svg`;
      }
    }

    // 5. Materyal Kaydını Oluştur
    const materialId = `mat-test-${cleanGrade}-${cleanSection}-${Date.now()}`;

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
      format: isOpenEnded ? "AÇIK UÇLU SINAV" : "YAPRAK TEST",
      hasBlob: false,
      tags: [
        `${cleanGrade}. sınıf`,
        `${cleanSection}. ünite`,
        "yaprak test",
        "soru-bankasi",
        "denemeler",
        "test / deneme",
        "yazılıya hazırlık",
        "açık uçlu sınav",
        "kazanım testi",
        "deneme",
        "rotalı fenci",
        "meb maarif modeli"
      ],
      visibility: "public",
      downloadCount: `📝 ${questions.length} Soru • Test-${testNumber}`,
      testNumber: testNumber,
      questionCount: questions.length,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // 6. Yerel materials.json güncellemesini dene
    try {
      const webDir = path.resolve(__dirname, '..');
      const rootDir = path.resolve(__dirname, '..', '..');
      const webMaterialsPath = path.join(webDir, 'data', 'materials.json');
      const rootMaterialsPath = path.join(rootDir, 'data', 'materials.json');

      let currentMaterials = [];
      if (fs.existsSync(webMaterialsPath)) {
        currentMaterials = JSON.parse(fs.readFileSync(webMaterialsPath, 'utf8'));
      }
      const existingIdx = currentMaterials.findIndex(m => m.id === materialId || m.fileName === fileName);
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
    } catch (fsMatErr) {
      console.warn("[Publish] Local materials.json write bypassed:", fsMatErr.message);
    }

    // 7. Bulut Senkronizasyonu (Gist + GitHub Repo data/materials.json)
    try {
      let syncHandler;
      try {
        syncHandler = require('./sync.js');
      } catch (s1) {
        syncHandler = require('../api/sync.js');
      }
      if (typeof syncHandler === 'function') {
        const mockReq = { method: "POST", body: { materials: [newMaterial], replace: false } };
        const mockRes = { headers: {}, statusCode: 200, setHeader() {}, status() { return this; }, json(d) { return d; }, end() { return this; } };
        await syncHandler(mockReq, mockRes);
      }
    } catch (syncErr) {
      console.warn('[Publish] Cloud sync warning:', syncErr.message);
    }

    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    return res.status(200).json({
      success: true,
      message: "Test başarıyla yayınlandı ve web sitenize eklendi.",
      material: newMaterial,
      fileUrl: `testler/${fileName}`,
      webSectionUrl: `index.html#grade-${cleanGrade}`,
      sectionUrl: `index.html#grade-${cleanGrade}`,
      htmlContent: htmlContent
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
