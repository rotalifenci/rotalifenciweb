const assert = require('assert');
const fs = require('fs');
const path = require('path');

// Test ortamı için sunucu işleyicilerini yükle
const authHandler = require('../api/tubitak-auth.js');
const recordsHandler = require('../api/tubitak-records.js');

console.log("=== ROTALI FENCİ – ÜÇ AŞAMALI KAYIT SİSTEMİ KABUL TESTLERİ (8 SENARYO) ===");

let passed = 0;
let total = 8;

async function runTest(idx, name, fn) {
    try {
        await fn();
        console.log(`[PASS] Test ${idx}: ${name}`);
        passed++;
    } catch (err) {
        console.error(`[FAIL] Test ${idx}: ${name}`, err);
    }
}

// Mock HTTP Yardımcısı (Node.js standartlarına uygun lowercase header desteği)
function mockReqRes(options = {}) {
    const rawHeaders = options.headers || {};
    const headers = {};
    for (const [k, v] of Object.entries(rawHeaders)) {
        headers[k.toLowerCase()] = v;
    }

    const req = {
        method: options.method || 'GET',
        headers,
        query: options.query || {},
        body: options.body || {}
    };
    const res = {
        statusCode: 200,
        headers: {},
        data: null,
        status(code) {
            this.statusCode = code;
            return this;
        },
        setHeader(k, v) {
            this.headers[k] = v;
        },
        json(payload) {
            this.data = payload;
            return this;
        },
        send(payload) {
            this.data = payload;
            return this;
        },
        end() {
            return this;
        }
    };
    return { req, res };
}

async function login(password, studentName, studentId) {
    const { req, res } = mockReqRes({
        method: 'POST',
        body: { password, studentName, studentId }
    });
    await authHandler(req, res);
    assert.strictEqual(res.statusCode, 200, "Giriş başarısız oldu: " + JSON.stringify(res.data));
    return res.data;
}

(async () => {
    // Öğretmen ve Öğrenci Oturumları
    const teacherSession = await login('tubitak2204', 'Danışman Öğretmen', 'teacher-admin');
    const student1Session = await login('tarih1071', 'Busenur Esila ÖZDEMİR', 'stu-busenur');
    const student2Session = await login('bilim1453', 'Zümra DURAN', 'stu2-zumra');
    const student3Session = await login('siyer571', 'Hümeyra BULUT', 'stu3-humeyra');

    // TEST 1: Otomatik Kayıt, sayfa yenileme ve kalıcı yükleme
    await runTest(1, "Öğrenci araştırma alanına yazdığında otomatik kayıt gerçekleşmeli ve veri tabanında kalıcı olmalı", async () => {
        const testContent = "Test 1 Otomatik Kayıt Metni: Çifte Minareli Medrese taç kapı bezemeleri (Özgün Analiz " + Date.now() + ")";
        const { req: saveReq, res: saveRes } = mockReqRes({
            method: 'POST',
            headers: { 'Authorization': `Bearer ${student1Session.token}` },
            body: {
                projectId: 'proje-tarih',
                itemId: 'cifte-minareli-medrese',
                criterionKey: 'c1_mimari',
                content: testContent,
                clientVersion: 0,
                clientTimestamp: new Date().toISOString()
            }
        });
        await recordsHandler(saveReq, saveRes);
        assert.strictEqual(saveRes.statusCode, 200, "Oto-kayıt başarısız: " + JSON.stringify(saveRes.data));
        assert.strictEqual(saveRes.data.ok, true);
        assert.strictEqual(saveRes.data.status, "saved");

        // Sayfa yenileme simülasyonu (GET)
        const { req: getReq, res: getRes } = mockReqRes({
            method: 'GET',
            headers: { 'Authorization': `Bearer ${student1Session.token}` },
            query: { projectId: 'proje-tarih', fresh: 'true' }
        });
        await recordsHandler(getReq, getRes);
        assert.strictEqual(getRes.statusCode, 200);
        const record = getRes.data.records['cifte-minareli-medrese__c1_mimari'];
        assert.ok(record, "Kayıt veritabanından çekilemedi");
        assert.strictEqual(record.content, testContent, "Kaydedilen metin ile yüklenen metin birebir eşleşmedi");
    });

    // TEST 2: KAYDET Butonu (Taslak Kaydet), çıkış yapma ve tekrar girişte son metnin yüklenmesi
    await runTest(2, "KAYDET butonuna basıldığında taslak olarak kaydedilmeli; çıkış ve tekrar girişte veriler korunmalı", async () => {
        const draftContent = "Test 2 Taslak Kaydet Metni: Bircendî astronomi risalesi değerlendirmesi (" + Date.now() + ")";
        const { req: draftReq, res: draftRes } = mockReqRes({
            method: 'POST',
            headers: { 'Authorization': `Bearer ${student2Session.token}` },
            body: {
                action: 'save_item_batch',
                projectId: 'proje-bilim',
                itemId: 'bircendi',
                records: [
                    { criterionKey: 'c1_eserler', content: draftContent, clientVersion: 1 }
                ],
                clientTimestamp: new Date().toISOString()
            }
        });
        await recordsHandler(draftReq, draftRes);
        assert.strictEqual(draftRes.statusCode, 200, "KAYDET butonu başarısız: " + JSON.stringify(draftRes.data));
        assert.strictEqual(draftRes.data.status, "saved");

        // Çıkış yap (token discard) ve ertesi gün / yeni oturum ile tekrar giriş yap
        const newLogin = await login('bilim1453', 'Zümra DURAN', 'stu2-zumra');
        const { req: reloadReq, res: reloadRes } = mockReqRes({
            method: 'GET',
            headers: { 'Authorization': `Bearer ${newLogin.token}` },
            query: { projectId: 'proje-bilim', fresh: 'true' }
        });
        await recordsHandler(reloadReq, reloadRes);
        assert.strictEqual(reloadRes.statusCode, 200);
        const rec = reloadRes.data.records['bircendi__c1_eserler'];
        assert.ok(rec, "Tekrar girişte kayıt bulunamadı");
        assert.strictEqual(rec.content, draftContent);
    });

    // TEST 3: Farklı cihazdan giriş yapıldığında son kaydedilen verilerin ve konunun yüklenmesi
    await runTest(3, "Farklı cihazdan giriş yapıldığında kaydedilmiş veriler ve son aktif konu otomatik yüklenmeli", async () => {
        // Cihaz A: Son çalışılan konuyu kaydet
        const { req: activeReq, res: activeRes } = mockReqRes({
            method: 'POST',
            headers: { 'Authorization': `Bearer ${student1Session.token}` },
            body: {
                action: 'save_last_active',
                projectId: 'proje-tarih',
                itemId: 'buruciye-medresesi'
            }
        });
        await recordsHandler(activeReq, activeRes);
        assert.strictEqual(activeRes.statusCode, 200);

        // Cihaz B: Farklı cihazdan öğrenci girişi
        const deviceBLogin = await login('tarih1071', 'Busenur Esila ÖZDEMİR', 'stu-busenur');
        const { req: getBReq, res: getBRes } = mockReqRes({
            method: 'GET',
            headers: { 'Authorization': `Bearer ${deviceBLogin.token}` },
            query: { projectId: 'proje-tarih' }
        });
        await recordsHandler(getBReq, getBRes);
        assert.strictEqual(getBRes.statusCode, 200);
        assert.strictEqual(getBRes.data.studentState['stu-busenur']?.itemId, 'buruciye-medresesi', "Farklı cihazda son çalışılan konu hatırlanamadı");
    });

    // TEST 4: KESİNLEŞTİR Butonu, son verilerin kaydedilmesi ve öğretmen panelinde 'İncelemede' görünmesi
    await runTest(4, "KESİNLEŞTİR butonuna basıldığında kayıt durumu 'in_review' (İncelemede) olmalı ve öğretmen panelinde görünmeli", async () => {
        const finalContent = "Test 4 Kesinleştirilen Metin: Divriği Ulu Camii kapı bezemeleri (" + Date.now() + ")";
        const { req: finalReq, res: finalRes } = mockReqRes({
            method: 'POST',
            headers: { 'Authorization': `Bearer ${student1Session.token}` },
            body: {
                action: 'finalize_item',
                projectId: 'proje-tarih',
                itemId: 'divrigi-darussifasi',
                records: [
                    { criterionKey: 'c1_tarihce', content: finalContent }
                ]
            }
        });
        await recordsHandler(finalReq, finalRes);
        assert.strictEqual(finalRes.statusCode, 200, "Kesinleştirme başarısız: " + JSON.stringify(finalRes.data));
        assert.strictEqual(finalRes.data.status, "in_review");

        // Öğretmen panelinden kontrol et
        const { req: teachReq, res: teachRes } = mockReqRes({
            method: 'GET',
            headers: { 'Authorization': `Bearer ${teacherSession.token}` },
            query: { projectId: 'proje-tarih', fresh: 'true' }
        });
        await recordsHandler(teachReq, teachRes);
        assert.strictEqual(teachRes.statusCode, 200);
        const targetRec = teachRes.data.records['divrigi-darussifasi__c1_tarihce'];
        assert.ok(targetRec);
        assert.strictEqual(targetRec.status, "in_review", "Öğretmen panelinde durum 'in_review' olarak doğrulanmadı");
    });

    // TEST 5: Öğretmen 'Düzeltme İstendi' verdiğinde öğrenci ekranının açılması, düzenlenmesi ve tekrar kesinleştirilmesi
    await runTest(5, "Öğretmen 'Düzeltme İstendi' durumunu seçtiğinde öğrenci düzenleyebilmeli, kaydedebilmeli ve tekrar kesinleştirebilmeli", async () => {
        // Öğretmen düzeltme talep eder
        const { req: revReq, res: revRes } = mockReqRes({
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${teacherSession.token}` },
            body: {
                action: 'teacher_review',
                projectId: 'proje-tarih',
                itemId: 'divrigi-darussifasi',
                status: 'correction_requested',
                feedbackMessage: 'Lütfen kaynakça sayfa numarasını ekleyiniz.'
            }
        });
        await recordsHandler(revReq, revRes);
        assert.strictEqual(revRes.statusCode, 200);
        assert.strictEqual(revRes.data.status, 'correction_requested');

        // Öğrenci güncel durumu çeker ve durumu 'correction_requested' olarak görür (düzenleme açılır)
        const { req: stuGetReq, res: stuGetRes } = mockReqRes({
            method: 'GET',
            headers: { 'Authorization': `Bearer ${student1Session.token}` },
            query: { projectId: 'proje-tarih', fresh: 'true' }
        });
        await recordsHandler(stuGetReq, stuGetRes);
        const stuRec = stuGetRes.data.records['divrigi-darussifasi__c1_tarihce'];
        assert.strictEqual(stuRec.status, 'correction_requested');

        // Öğrenci düzeltmesini yapar ve tekrar kesinleştirir
        const correctedContent = stuRec.content + " [Düzenleme: Kaynakça eklendi]";
        const { req: reFinalReq, res: reFinalRes } = mockReqRes({
            method: 'POST',
            headers: { 'Authorization': `Bearer ${student1Session.token}` },
            body: {
                action: 'finalize_item',
                projectId: 'proje-tarih',
                itemId: 'divrigi-darussifasi',
                records: [
                    { criterionKey: 'c1_tarihce', content: correctedContent }
                ]
            }
        });
        await recordsHandler(reFinalReq, reFinalRes);
        assert.strictEqual(reFinalRes.statusCode, 200);
        assert.strictEqual(reFinalRes.data.status, 'in_review');
    });

    // TEST 6: İnternet kesintisi simülasyonu - Başarısız istekte 'Kaydedildi' yazılmaması ve verinin korunması
    await runTest(6, "İnternet kesintisinde veya sunucu hatasında 'Kaydedildi' yazılmamalı, hata doğru yönetilmeli", async () => {
        // Eksik/hatalı istek simülasyonu (ağ veya parametre hatası)
        const { req: errReq, res: errRes } = mockReqRes({
            method: 'POST',
            headers: { 'Authorization': `Bearer ${student1Session.token}` },
            body: {
                projectId: 'proje-tarih',
                itemId: '', // Hatalı itemId
                criterionKey: 'c1_mimari',
                content: 'Geçersiz test'
            }
        });
        await recordsHandler(errReq, errRes);
        assert.strictEqual(errRes.statusCode, 400);
        assert.strictEqual(errRes.data.ok, false);
        assert.notStrictEqual(errRes.data.status, "saved", "Hatalı istekte 'saved' dönülmemeli");
    });

    // TEST 7: İki kayıt isteğinin yanlış sırayla gelmesi (Stale Request Overwrite Koruması)
    await runTest(7, "Eski bir kayıt isteği daha yeni bir değişikliğin üzerine yazamamalı (Sıra & Concurrency Koruması)", async () => {
        const freshTimestamp = new Date(Date.now() + 5000).toISOString();
        const staleTimestamp = new Date(Date.now() - 5000).toISOString();

        // 1. Yeni sürüm (v5) yazılır
        const { req: freshReq, res: freshRes } = mockReqRes({
            method: 'POST',
            headers: { 'Authorization': `Bearer ${student1Session.token}` },
            body: {
                projectId: 'proje-tarih',
                itemId: 'gok-medrese',
                criterionKey: 'c1_mimari',
                content: 'Taze ve Güncel Metin (v5)',
                clientVersion: 5,
                clientTimestamp: freshTimestamp
            }
        });
        await recordsHandler(freshReq, freshRes);
        assert.strictEqual(freshRes.statusCode, 200);

        // 2. Gecikmiş eski sürüm (v2) daha sonra sunucuya ulaşır
        const { req: staleReq, res: staleRes } = mockReqRes({
            method: 'POST',
            headers: { 'Authorization': `Bearer ${student1Session.token}` },
            body: {
                projectId: 'proje-tarih',
                itemId: 'gok-medrese',
                criterionKey: 'c1_mimari',
                content: 'Eski Bayat Metin (v2)',
                clientVersion: 2,
                clientTimestamp: staleTimestamp
            }
        });
        await recordsHandler(staleReq, staleRes);
        assert.strictEqual(staleRes.statusCode, 409, "Eski isteğe 409 Conflict dönülmeli");
        assert.strictEqual(staleRes.data.status, "conflict");
    });

    // TEST 8: Üç projeden (Tarih, Bilim, Siyer) ayrı kayıtlar oluşturulması ve öğretmen panelinde eksiksiz görülmesi
    await runTest(8, "Üç TÜBİTAK projesinin tamamında (Tarih, Bilim, Siyer 3 Olay) kayıtlar öğretmen panelinde eksiksiz listelenmeli", async () => {
        // Proje 1 (Tarih)
        const { req: p1Req, res: p1Res } = mockReqRes({
            method: 'POST',
            headers: { 'Authorization': `Bearer ${student1Session.token}` },
            body: {
                action: 'save_item_batch',
                projectId: 'proje-tarih',
                itemId: 'cifte-minareli-medrese',
                records: [{ criterionKey: 'c2_kitabe', content: 'Proje 1 Kitabe Analizi' }]
            }
        });
        await recordsHandler(p1Req, p1Res);
        assert.strictEqual(p1Res.statusCode, 200);

        // Proje 2 (Bilim İnsanları)
        const { req: p2Req, res: p2Res } = mockReqRes({
            method: 'POST',
            headers: { 'Authorization': `Bearer ${student2Session.token}` },
            body: {
                action: 'save_item_batch',
                projectId: 'proje-bilim',
                itemId: 'bircendi',
                records: [{ criterionKey: 'c2_matematik', content: 'Proje 2 Bircendi Astronomi ve Matematik' }]
            }
        });
        await recordsHandler(p2Req, p2Res);
        assert.strictEqual(p2Res.statusCode, 200);

        // Proje 3 (Siyer 3 Olay)
        const { req: p3Req, res: p3Res } = mockReqRes({
            method: 'POST',
            headers: { 'Authorization': `Bearer ${student3Session.token}` },
            body: {
                action: 'save_item_batch',
                projectId: 'proje-siyer',
                itemId: 'siyer-571',
                records: [
                    { criterionKey: 'c1_olay', content: '1. Olay: Hz. Muhammed dünyaya geldi' },
                    { criterionKey: 'c2_kok_deger', content: 'Adalet, Sevgi' },
                    { criterionKey: 'c3_kaynakca', content: 'İbn İshak, Siret' }
                ]
            }
        });
        await recordsHandler(p3Req, p3Res);
        assert.strictEqual(p3Res.statusCode, 200);

        // Öğretmen tüm projeleri çeker (projectId: "all")
        const { req: allReq, res: allRes } = mockReqRes({
            method: 'GET',
            headers: { 'Authorization': `Bearer ${teacherSession.token}` },
            query: { projectId: 'all', fresh: 'true' }
        });
        await recordsHandler(allReq, allRes);
        assert.strictEqual(allRes.statusCode, 200);

        const recs = allRes.data.records;
        assert.ok(recs['cifte-minareli-medrese__c2_kitabe'], "Proje 1 kaydı öğretmen panelinde bulunamadı");
        assert.ok(recs['bircendi__c2_matematik'], "Proje 2 kaydı öğretmen panelinde bulunamadı");
        assert.ok(recs['siyer-571__c1_olay'], "Proje 3 kaydı öğretmen panelinde bulunamadı");
    });

    console.log(`\nSONUÇ: ${passed} / ${total} TEST BAŞARIYLA GEÇTİ!`);
    if (passed === total) {
        console.log("TÜM KABUL TESTLERİ KUSURSUZ ŞEKİLDE ONAYLANDI! ✅");
        process.exit(0);
    } else {
        process.exit(1);
    }
})();
