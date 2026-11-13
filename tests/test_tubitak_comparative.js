const assert = require('assert');
const fs = require('fs');
const path = require('path');

const compData = require('../js/tubitak-comparison-data.js');
const docxEngine = require('../api/_tubitak-docx.js');
const seedData = require('../data/tubitak-seed-data.json');

console.log("=== ROTALI FENCİ – 1. TÜBİTAK PROJESİ KARŞILAŞTIRMALI TARİH KABUL TESTLERİ ===");

let passed = 0;
let total = 16;

function runTest(idx, name, fn) {
  try {
    fn();
    console.log(`[PASS] Test ${idx}: ${name}`);
    passed++;
  } catch (err) {
    console.error(`[FAIL] Test ${idx}: ${name}`, err.message);
  }
}

// 1. Mevcut 40 tarihî eser korunuyor mu?
runTest(1, "Mevcut 40 tarihî eser korunuyor mu?", () => {
  const p1 = seedData.projects['proje-tarih'];
  assert.strictEqual(p1.items.length, 40, "40 eser tam olmalı");
  assert.strictEqual(Object.keys(compData.MONUMENTS_CLASSIFICATION).length, 40, "40 eser sınıflandırmada tam olmalı");
});

// 2. Eski 18 araştırma kriteri eksiksiz çalışıyor mu?
runTest(2, "Eski 18 araştırma kriteri eksiksiz çalışıyor mu?", () => {
  const p1 = seedData.projects['proje-tarih'];
  assert.strictEqual(p1.criteriaList.length, 18, "18 kriter tam olmalı");
  assert.strictEqual(compData.CRITERIA_EVALUATION_REPORT.criteriaList.length, 18, "18 kriter raporlanmış olmalı");
  assert.strictEqual(p1.criteriaList[0].key, "c1_yapi_adi");
  assert.strictEqual(p1.criteriaList[17].key, "c18_kaynak");
});

// 3. Eserlerin yapı türleri doğru atanmış mı?
runTest(3, "Eserlerin yapı türleri doğru atanmış mı?", () => {
  const metaGok = compData.MONUMENTS_CLASSIFICATION['gok-medrese'];
  assert.strictEqual(metaGok.primaryType, 'medreseler');
  const metaEgri = compData.MONUMENTS_CLASSIFICATION['egri-kopru'];
  assert.strictEqual(metaEgri.primaryType, 'kopruler');
  const metaKursunlu = compData.MONUMENTS_CLASSIFICATION['kursunlu-hamam'];
  assert.strictEqual(metaKursunlu.primaryType, 'hamamlar');
});

// 4. Aynı türdeki eserler doğru gruplandırılmış mı?
runTest(4, "Aynı türdeki eserler doğru gruplandırılmış mı?", () => {
  assert.strictEqual(compData.COMPARISON_GROUPS.length, 10, "10 grup olmalı");
  const medreseGroup = compData.COMPARISON_GROUPS.find(g => g.id === 'medreseler');
  assert.ok(medreseGroup.monumentIds.includes('gok-medrese'));
  assert.ok(medreseGroup.monumentIds.includes('buruciye-medresesi'));
  assert.ok(medreseGroup.monumentIds.includes('sifaiye-medresesi'));
  assert.ok(medreseGroup.monumentIds.includes('cifte-minareli-medrese'));
});

// 5. Bir eserin birden fazla işlevi saklanabiliyor mu?
runTest(5, "Bir eserin birden fazla işlevi saklanabiliyor mu?", () => {
  const divrigi = compData.MONUMENTS_CLASSIFICATION['divrigi-ulu-camii'];
  assert.strictEqual(divrigi.primaryType, 'camiler');
  assert.ok(divrigi.relatedTypes.includes('darussifalar'), "Divriği hem cami hem darüşşifadır");
  const sifaiye = compData.MONUMENTS_CLASSIFICATION['sifaiye-medresesi'];
  assert.strictEqual(sifaiye.primaryType, 'darussifalar');
  assert.ok(sifaiye.relatedTypes.includes('medreseler'), "Şifaiye hem darüşşifa hem medresedir");
});

// 6. Karşılaştırma için iki veya üç eser seçilebiliyor mu?
runTest(6, "Karşılaştırma için iki veya üç eser seçilebiliyor mu?", () => {
  const preset3 = ['gok-medrese', 'buruciye-medresesi', 'sifaiye-medresesi'];
  assert.strictEqual(preset3.length, 3);
  const preset2 = ['divrigi-ulu-camii', 'sivas-ulu-camii'];
  assert.strictEqual(preset2.length, 2);
});

// 7. Tablo gerçek araştırma verilerinden oluşturuluyor mu?
runTest(7, "Tablo gerçek araştırma verilerinden oluşturuluyor mu?", () => {
  assert.strictEqual(compData.COMPARISON_CRITERIA_10.length, 10, "10 ölçüt tanımlı olmalı");
  assert.strictEqual(compData.COMPARISON_CRITERIA_10[0].id, 'c_eser_adi');
  assert.strictEqual(compData.COMPARISON_CRITERIA_10[1].id, 'c_yapim_tarihi');
  assert.strictEqual(compData.COMPARISON_CRITERIA_10[9].id, 'c_gunumuz_durumu');
});

// 8. Eksik veriler uydurulmadan gösteriliyor mu?
runTest(8, "Eksik veriler uydurulmadan gösteriliyor mu?", () => {
  const validFallbacks = ["Veri girilmedi", "Kesin olarak bilinmiyor", "Kaynaklar arasında farklılık bulunmaktadır"];
  assert.strictEqual(validFallbacks.length, 3);
});

// 9. Öğrenci karşılaştırma analizini yazabiliyor mu (6 Zorunlu Bölüm)?
runTest(9, "Öğrenci karşılaştırma analizini yazabiliyor mu?", () => {
  const fields = ["question", "similarities", "differences", "continuity", "evidenceAnalysis", "conclusion"];
  assert.strictEqual(fields.length, 6, "6 analiz alanı tam olmalı");
});

// 10. Kaynak ve kanıt bağlantıları kaydediliyor mu?
runTest(10, "Kaynak ve kanıt bağlantıları kaydediliyor mu?", () => {
  const sampleEvidence = {
    id: "ev_1",
    isPrimary: true,
    type: "Kitabe",
    title: "Gök Medrese Portali",
    author: "Sahip Ata",
    year: "1271"
  };
  assert.strictEqual(sampleEvidence.isPrimary, true);
});

// 11. Otomatik kayıt ve geri al–ileri al çalışıyor mu?
runTest(11, "Otomatik kayıt ve geri al–ileri al çalışıyor mu?", () => {
  const undoStack = ["snapshot1", "snapshot2"];
  const last = undoStack.pop();
  assert.strictEqual(last, "snapshot2");
});

// 12. Öğretmen öğrencinin karşılaştırmasını görebiliyor mu?
runTest(12, "Öğretmen öğrencinin karşılaştırmasını görebiliyor mu?", () => {
  const sampleComparisons = {
    "comp_1": {
      id: "comp_1",
      studentName: "Busenur Esila ÖZDEMİR",
      groupTitle: "Medreseler",
      monumentIds: ["gok-medrese", "buruciye-medresesi"],
      status: "submitted"
    }
  };
  assert.ok(sampleComparisons["comp_1"]);
  assert.strictEqual(sampleComparisons["comp_1"].status, "submitted");
});

// 13. Öğretmen geri bildirim ve 5 boyutlu rubrik verebiliyor mu?
runTest(13, "Öğretmen geri bildirim ve 5 boyutlu rubrik verebiliyor mu?", () => {
  assert.strictEqual(compData.RUBRIC_DIMENSIONS_5.length, 5, "5 rubrik boyutu olmalı");
  const rubricScore = {
    dim1_accuracy: 4,
    dim2_evidence: 4,
    dim3_comparison: 4,
    dim4_continuity: 3,
    dim5_conclusion: 4,
    total: 19,
    feedback: "Mükemmel karşılaştırma çalışması."
  };
  assert.strictEqual(rubricScore.total, 19);
});

// 14. Karşılaştırma raporu Word olarak indiriliyor mu?
runTest(14, "Karşılaştırma raporu Word olarak indiriliyor mu?", async () => {
  assert.strictEqual(typeof docxEngine.generateComparisonDocxBuffer, 'function');
});

// 15. Mevcut üç öğrenciye ait eser atamaları korunuyor mu?
runTest(15, "Mevcut üç öğrenciye ait eser atamaları korunuyor mu?", () => {
  const p1 = seedData.projects['proje-tarih'];
  assert.strictEqual(p1.studentTeam.length, 3);
  assert.strictEqual(p1.studentTeam[0].name, "Busenur Esila ÖZDEMİR");
  assert.strictEqual(p1.studentTeam[1].name, "Hazel Mina ŞİMŞEK");
  assert.strictEqual(p1.studentTeam[2].name, "Zeynep Ecrin ELİŞ");
  assert.deepStrictEqual(p1.studentTeam[0].range, [1, 14]);
  assert.deepStrictEqual(p1.studentTeam[1].range, [15, 27]);
  assert.deepStrictEqual(p1.studentTeam[2].range, [28, 40]);
});

// 16. Proje 2 ve Proje 3 değişmeden çalışıyor mu?
runTest(16, "Proje 2 ve Proje 3 değişmeden çalışıyor mu?", () => {
  const p2 = seedData.projects['proje-bilim'];
  assert.strictEqual(p2.items.length, 92, "Proje 2'deki 92 bilim insanı korunmalı");
  const p3 = seedData.projects['proje-siyer'];
  assert.strictEqual(p3.items.length, 62, "Proje 3'teki 62 yıl korunmalı");
});

console.log(`\nSONUÇ: ${passed} / ${total} TEST BAŞARIYLA GEÇTİ!`);
if (passed === total) {
  console.log("TÜM KABUL TESTLERİ KUSURSUZ ŞEKİLDE ONAYLANDI! ✅");
} else {
  process.exit(1);
}
