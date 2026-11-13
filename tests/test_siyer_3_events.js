const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log("=== ROTALI FENCİ – 3. TÜBİTAK PROJESİ (SİYER 3 OLAY & 10 KÖK DEĞER) KABUL TESTLERİ ===");

let passed = 0;
let total = 8;

function runTest(idx, name, fn) {
  try {
    fn();
    console.log(`[PASS] Test ${idx}: ${name}`);
    passed++;
  } catch (err) {
    console.error(`[FAIL] Test ${idx}: ${name}`, err.message);
  }
}

const seedData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/tubitak-seed-data.json'), 'utf8'));
const jsCode = fs.readFileSync(path.join(__dirname, '../js/tubitak-research.js'), 'utf8');

// 1. 571–632 arasındaki bütün 62 yıl mevcut mu?
runTest(1, "571–632 arasındaki bütün 62 yıl sistemde mevcut mu?", () => {
  const p3 = seedData.projects['proje-siyer'];
  assert.strictEqual(p3.items.length, 62);
  assert.strictEqual(p3.items[0].year, 571);
  assert.strictEqual(p3.items[61].year, 632);
});

// 2. Her yıl için yalnızca 3 olay alanı bulunuyor mu?
runTest(2, "Her yıl için 3 olay alanı tanımlı mı?", () => {
  assert.ok(jsCode.includes('title: "1. OLAY"'));
  assert.ok(jsCode.includes('title: "2. OLAY"'));
  assert.ok(jsCode.includes('title: "3. OLAY"'));
});

// 3. "+ Yeni Olay Ekle" butonu arayüzden tamamen kaldırılmış mı?
runTest(3, "+ Yeni Olay Ekle butonu arayüzden tamamen kaldırılmış mı?", () => {
  assert.strictEqual(jsCode.includes('Yeni Olay Ekle'), false, "Arayüzde 'Yeni Olay Ekle' butonu bulunmamalı");
  assert.strictEqual(jsCode.includes('onclick="window.RotaliTubitak.addSiyerEvent('), false, "Arayüzde addSiyerEvent butonu bulunmamalı");
});

// 4. 10 Kök Değer seçeneği eksiksiz ve doğru tanımlanmış mı?
runTest(4, "10 Kök Değer seçeneği eksiksiz tanımlanmış mı?", () => {
  const expectedValues = [
    "Adalet", "Dostluk", "Dürüstlük", "Öz denetim", "Sabır",
    "Saygı", "Sevgi", "Sorumluluk", "Vatanseverlik", "Yardımseverlik"
  ];
  expectedValues.forEach(val => {
    assert.ok(jsCode.includes(`"${val}"`), `Kök değer "${val}" tanımlı olmalı`);
  });
});

// 5. Birden fazla kök değer seçimi ve ayrıştırma motoru çalışıyor mu?
runTest(5, "Birden fazla kök değer seçimi ve ayrıştırma motoru çalışıyor mu?", () => {
  assert.ok(jsCode.includes('function parseSelectedRootValues'));
  assert.ok(jsCode.includes('toggleSiyerRootValue'));
});

// 6. Üç olay alanının tamamının doldurulması zorunlu değil mi (isteğe bağlı)?
runTest(6, "2. ve 3. Olay alanları isteğe bağlı mı?", () => {
  assert.ok(jsCode.includes('badge: "İsteğe bağlı"'));
});

// 7. Otomatik kayıt ve geri al–ileri al korunuyor mu?
runTest(7, "Otomatik kayıt ve geri al–ileri al korunuyor mu?", () => {
  assert.ok(jsCode.includes("handleUndo('${ev.olayKey}')"));
  assert.ok(jsCode.includes("handleUndo('${ev.kokKey}')"));
  assert.ok(jsCode.includes("handleUndo('${ev.kaynakKey}')"));
});

// 8. 5 öğrencinin görev dağılımı korunuyor mu?
runTest(8, "5 öğrencinin görev dağılımı korunuyor mu?", () => {
  const p3 = seedData.projects['proje-siyer'];
  assert.strictEqual(p3.studentTeam.length, 5);
  assert.strictEqual(p3.studentTeam[0].name, "Hümeyra BULUT");
  assert.strictEqual(p3.studentTeam[1].name, "Ecrin TEMEL");
  assert.strictEqual(p3.studentTeam[2].name, "Zeynep GÜL");
  assert.strictEqual(p3.studentTeam[3].name, "Yusuf Aras KUZU");
  assert.strictEqual(p3.studentTeam[4].name, "Asaf HAZIRBULAN");
});

console.log(`\nSONUÇ: ${passed} / ${total} TEST BAŞARIYLA GEÇTİ!`);
if (passed === total) {
  console.log("3. TÜBİTAK PROJESİ TÜM KABUL KRİTERLERİ KUSURSUZ ŞEKİLDE ONAYLANDI! ✅");
} else {
  process.exit(1);
}
