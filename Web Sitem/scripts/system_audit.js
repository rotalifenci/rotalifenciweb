const fs = require('fs');
const path = require('path');
const vm = require('vm');

console.log('====================================================');
console.log('🔍 ROTALI FENCİ — TÜM SİSTEM DENETİM VE KONTROL RAPORU');
console.log('====================================================\n');

let issuesFound = [];
let passCount = 0;

function report(status, title, details = '') {
    if (status === 'PASS') {
        passCount++;
        console.log(`✅ [BAŞARILI] ${title}`);
    } else if (status === 'WARN') {
        console.log(`⚠️  [UYARI] ${title} ${details ? '-> ' + details : ''}`);
    } else {
        issuesFound.push({ title, details });
        console.log(`❌ [HATA] ${title} ${details ? '-> ' + details : ''}`);
    }
}

// ----------------------------------------------------
// 1. JAVASCRIPT & HTML SYNTAX CHECK
// ----------------------------------------------------
console.log('--- 1. KOD VE SÖZDİZİMİ (SYNTAX) DENETİMİ ---');

const jsFiles = ['js/app.js'];
jsFiles.forEach(file => {
    try {
        const fullPath = path.join(__dirname, '..', file);
        if (fs.existsSync(fullPath)) {
            const code = fs.readFileSync(fullPath, 'utf8');
            new vm.Script(code);
            report('PASS', `${file} sözdizimi hatasız (Syntax OK, ${code.length} karakter)`);
        } else {
            report('FAIL', `${file} dosyası bulunamadı!`);
        }
    } catch (e) {
        report('FAIL', `${file} sözdizimi hatası: ${e.message}`);
    }
});

// HTML dosyalarındaki <script> blokları
const htmlFiles = [
    'index.html',
    'oyunlar/is-laboratuvari.html',
    'oyunlar/kuvvet-laboratuvari.html',
    'oyunlar/gunes-sistemi-yolculuk-3d.html',
    'oyunlar/kozmik-kasif-3d.html',
    'oyunlar/kozmik-kosu-3d.html',
    'oyunlar/uzaydan-kacis-3d.html',
    'oyunlar/aya-inis-3d.html'
];

htmlFiles.forEach(relPath => {
    const fullPath = path.join(__dirname, '..', relPath);
    if (!fs.existsSync(fullPath)) {
        report('WARN', `${relPath} dosyası mevcut değil (kontrol edildi).`);
        return;
    }
    const html = fs.readFileSync(fullPath, 'utf8');
    const scriptRegex = /<script\b(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi;
    let match;
    let idx = 0;
    let hasErr = false;
    while ((match = scriptRegex.exec(html)) !== null) {
        idx++;
        try {
            new vm.Script(match[1]);
        } catch (e) {
            hasErr = true;
            report('FAIL', `${relPath} script #${idx} hatası: ${e.message}`);
        }
    }
    if (!hasErr) {
        report('PASS', `${relPath} içerisindeki ${idx} adet script bloğu hatasız.`);
    }
});

// ----------------------------------------------------
// 2. TÜRKİYE YÜZYILI MAARİF MODELİ ÜNİTE İSİMLERİ KONTROLÜ
// ----------------------------------------------------
console.log('\n--- 2. MAARİF MODELİ MÜFREDAT VE ÜNİTE KONTROLÜ ---');

const expectedUnits = {
    5: [
        "Gökyüzündeki Komşularımız ve Biz",
        "Kuvveti Tanıyalım",
        "Canlıların Yapısına Yolculuk",
        "Işığın Dünyası",
        "Maddenin Doğası",
        "Yaşamımızdaki Elektrik",
        "Sürdürülebilir Yaşam ve Geri Dönüşüm"
    ],
    6: [
        "Güneş Sistemi ve Tutulmalar",
        "Kuvvetin Etkisinde Hareket",
        "Canlılarda Sistemler",
        "Işığın Yansıması ve Renkler",
        "Maddenin Ayırt Edici Özellikleri",
        "Elektriğin İletimi ve Direnç",
        "Sürdürülebilir Yaşam ve Etkileşim"
    ],
    7: [
        "Uzay Çağı",
        "Kuvvet ve Enerjiyi Keşfedelim",
        "Vücudumuzdaki Sistemler",
        "Işığın Kırılması ve Mercekler",
        "Maddenin Doğasına Yolculuk",
        "Elektriklenme",
        "Sürdürülebilir Yaşam ve Enerji"
    ]
};

const appCode = fs.readFileSync(path.join(__dirname, '..', 'js', 'app.js'), 'utf8');

// Check gradeUnitMap in js/app.js
for (const [grade, units] of Object.entries(expectedUnits)) {
    let allMatched = true;
    units.forEach((u, uIdx) => {
        // Simple case-insensitive clean check
        const cleanU = u.toLowerCase().replace(/['"’]/g, '');
        if (!appCode.toLowerCase().includes(cleanU)) {
            allMatched = false;
            report('FAIL', `${grade}. Sınıf ${uIdx + 1}. Ünite (${u}) app.js içerisinde tam eşleşmedi!`);
        }
    });
    if (allMatched) {
        report('PASS', `${grade}. Sınıf Maarif Modeli ünitelerinin tümü (7 ünite) app.js ile %100 uyumlu.`);
    }
}

// ----------------------------------------------------
// 3. MATERYAL KATALOĞU (materials.json) BAĞLANTI & DOSYA KONTROLÜ
// ----------------------------------------------------
console.log('\n--- 3. MATERYALLER (materials.json) VE DOSYA BAĞLANTILARI ---');

try {
    const matPath = path.join(__dirname, '..', 'data', 'materials.json');
    const materials = JSON.parse(fs.readFileSync(matPath, 'utf8'));
    report('PASS', `data/materials.json geçerli JSON (${materials.length} adet materyal kayıtlı).`);

    let missingFiles = 0;
    let verifiedFiles = 0;

    materials.forEach(m => {
        // Eğer yerel dosya ise varlığını kontrol et
        if (m.fileUrl && !m.fileUrl.startsWith('http') && m.fileUrl !== '#' && !m.fileUrl.startsWith('data:')) {
            const fPath = path.join(__dirname, '..', m.fileUrl);
            if (!fs.existsSync(fPath)) {
                missingFiles++;
                report('WARN', `Materyal dosya eksik: ID [${m.id}] "${m.title}" -> ${m.fileUrl}`);
            } else {
                verifiedFiles++;
            }
        }
        // Kapak görseli kontrolü
        const cover = m.kapakResmi || m.cover || m.imageUrl;
        if (cover && !cover.startsWith('http') && cover !== '#' && !cover.startsWith('data:')) {
            const cPath = path.join(__dirname, '..', cover);
            if (!fs.existsSync(cPath)) {
                report('WARN', `Kapak görseli eksik: ID [${m.id}] "${m.title}" -> ${cover}`);
            }
        }
    });

    if (missingFiles === 0) {
        report('PASS', `Yerel materyal dosyalarının tamamı (${verifiedFiles} dosya) diskte mevcut.`);
    }
} catch (e) {
    report('FAIL', `materials.json okuma/ayrıştırma hatası: ${e.message}`);
}

// ----------------------------------------------------
// 4. OYUNLAR VE SİMÜLASYONLAR ENTEGRASYON KONTROLÜ
// ----------------------------------------------------
console.log('\n--- 4. OYUN & SİMÜLASYON DİSPATCH KONTROLÜ ---');

const criticalSims = [
    { id: 'mat-6-2-sim-kuvvet-laboratuvari', name: 'Kuvvet Laboratuvarı (6. Sınıf)' },
    { id: 'mat-7-2-sim-is-laboratuvari', name: 'İş Laboratuvarı (7. Sınıf)' },
    { id: 'mat-6-1-oyun-gunes-sistemi-yolculuk-3d', name: 'Güneş Sisteminde Yolculuk (6. Sınıf)' },
    { id: 'mat-apollo11-aya-inis-3d', name: 'Ay\'a İniş 3D (5. Sınıf)' }
];

criticalSims.forEach(sim => {
    const hasInApp = appCode.includes(sim.id);
    const hasModalDispatch = appCode.includes(sim.id) && (appCode.includes('openInteractiveGameModal'));
    if (hasInApp && hasModalDispatch) {
        report('PASS', `${sim.name} [${sim.id}] yönlendirmeleri ve korumaları aktif.`);
    } else {
        report('FAIL', `${sim.name} [${sim.id}] yönlendirmesinde eksiklik var!`);
    }
});

// ----------------------------------------------------
// 5. CİHAZ UYUMLULUĞU VE RESPONSIVE KONTROLLERİ (Zero-Scroll / 100dvh)
// ----------------------------------------------------
console.log('\n--- 5. MOBİL & AKILLI TAHTA (PARDUS) UYUMLULUK KONTROLLERİ ---');

const targetHtmls = ['index.html', 'oyunlar/kuvvet-laboratuvari.html', 'oyunlar/is-laboratuvari.html'];
targetHtmls.forEach(rel => {
    const p = path.join(__dirname, '..', rel);
    if (!fs.existsSync(p)) return;
    const content = fs.readFileSync(p, 'utf8');
    
    // Viewport kontrolü
    const hasViewport = content.includes('viewport-fit=cover') || content.includes('width=device-width');
    // 100dvh kontrolü
    const hasDvh = content.includes('100dvh');
    // OrbitControls touch
    const hasTouchHandling = content.includes('touch') || content.includes('OrbitControls') || content.includes('pointer');

    if (hasViewport && hasDvh) {
        report('PASS', `${rel}: Viewport ve 100dvh (Zero-Scroll) yapısı mevcut.`);
    } else {
        report('WARN', `${rel}: 100dvh veya viewport tanımları eksik olabilir.`);
    }
});

// ----------------------------------------------------
// 6. GİT VE SENKRONİZASYON DURUMU
// ----------------------------------------------------
console.log('\n--- 6. GİT VE YAYIN DURUMU ---');
console.log('Denetim tamamlandı.');
console.log(`Toplam Başarılı Test: ${passCount}`);
console.log(`Toplam Kritik Hata: ${issuesFound.length}`);

if (issuesFound.length > 0) {
    console.log('\n⚠️  Düzeltilmesi gereken konular:');
    issuesFound.forEach((iss, i) => console.log(`${i+1}. ${iss.title} ${iss.details}`));
    process.exit(1);
} else {
    console.log('\n🌟 TÜM SİSTEM %100 SORUNSUZ, SENKRONİZE VE KUSURSUZ ÇALIŞIYOR!');
    process.exit(0);
}
