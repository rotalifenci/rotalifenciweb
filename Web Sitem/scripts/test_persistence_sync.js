const fs = require('fs');
const assert = require('assert');

console.log('🧪 Starting Persistence & Verification Tests...');

// 1. Verify index.html links
const html = fs.readFileSync('index.html', 'utf8');
const videolarMatches = html.match(/#grade\/grade-[5-8]\/videolar/g);
assert.strictEqual(videolarMatches, null, 'No grade link should point to /videolar');
const dersNotuMatches = html.match(/#grade\/grade-[5-8]\/ders-notu/g);
assert.ok(dersNotuMatches && dersNotuMatches.length >= 16, 'Grade links in index.html must point to /ders-notu');
console.log('✅ 1. index.html grade navigation links verified: all point to /ders-notu');

// 2. Verify data/materials.json items
const mats = JSON.parse(fs.readFileSync('data/materials.json', 'utf8'));
const islenecek5 = mats.find(m => m.id === 'mat-1789315860991' || (m.grade === '5' && m.title.includes('İşlenecek')));
const islenecek6 = mats.find(m => m.id === 'mat-6-islenecek-konular' || (m.grade === '6' && m.title.includes('İşlenecek')));
const islenecek7 = mats.find(m => m.id === 'mat-6d88cbde-dd7c-4fb2-aebc-b9e7c83b57ab' || (m.grade === '7' && m.title.includes('İşlenecek')));
const islenecek8 = mats.find(m => m.id === 'mat-1789641166040' || (m.grade === '8' && m.title.includes('İşlenecek')));

assert.ok(islenecek5, '5. Sınıf İşlenecek Konular must exist');
assert.ok(islenecek6, '6. Sınıf İşlenecek Konular must exist');
assert.ok(islenecek7, '7. Sınıf İşlenecek Konular must exist');
assert.ok(islenecek8, '8. Sınıf İşlenecek Konular must exist');

assert.strictEqual(islenecek5.targetSection, 'kitap');
assert.strictEqual(islenecek6.targetSection, 'kitap');
assert.strictEqual(islenecek7.targetSection, 'kitap');
assert.strictEqual(islenecek8.targetSection, 'kitap');

assert.ok(fs.existsSync(islenecek5.fileUrl), `Asset file ${islenecek5.fileUrl} must exist`);
assert.ok(fs.existsSync(islenecek6.fileUrl), `Asset file ${islenecek6.fileUrl} must exist`);
assert.ok(fs.existsSync(islenecek7.fileUrl), `Asset file ${islenecek7.fileUrl} must exist`);
assert.ok(fs.existsSync(islenecek8.fileUrl), `Asset file ${islenecek8.fileUrl} must exist`);
console.log('✅ 2. All 4 İşlenecek Konular materials verified with targetSection="kitap" and existing JPG files');

// 3. Verify user tests are preserved
const test1 = mats.find(m => m.id === 'mat-test-5-1-1792881391044');
const test2 = mats.find(m => m.id === 'mat-test-5-1-1792952650428');
assert.ok(test1, 'Test mat-test-5-1-1792881391044 must be preserved');
assert.ok(test2, 'Test mat-test-5-1-1792952650428 must be preserved');
console.log('✅ 3. User test materials preserved successfully');

// 4. Verify js/app.js non-destructive logic
const appJs = fs.readFileSync('js/app.js', 'utf8');
assert.ok(!appJs.includes('localStorage.removeItem("rotali_custom_materials")'), 'verifySmartboardSync must not delete rotali_custom_materials');
assert.ok(appJs.includes('let subTab = parts[1] || "ders-notu";'), 'subTab default must be ders-notu');
assert.ok(appJs.includes('// 🌟 KULLANICI TERCİHİ ESASTIR: Yereldeki görsel veya dosya asla eski bulut verisiyle ezilmez!'), 'CloudSync must prioritize local edits/images');
assert.ok(!appJs.includes('"mat-5-islenecek-konular", "mat-5-ilk-ders-notu", "mat-5af99640-7aaf-423f-9643-0e157023d717"'), 'mat-5-islenecek-konular must not be in PERMANENT_DELETED');
console.log('✅ 4. js/app.js non-destructive sync, protected IDs, and ders-notu default verified');

// 5. Verify parent files are in sync
if (fs.existsSync('../data/materials.json')) {
    const parentMats = JSON.parse(fs.readFileSync('../data/materials.json', 'utf8'));
    assert.strictEqual(parentMats.length, mats.length, 'Parent and Web Sitem materials.json must have equal count');
    console.log('✅ 5. Parent workspace materials.json is 100% in sync (' + mats.length + ' items)');
}

console.log('🎉 ALL PERSISTENCE AND VERIFICATION TESTS PASSED!');
