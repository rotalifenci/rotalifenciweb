const assert = require('assert');
const fs = require('fs');
const path = require('path');

// Test ortamı için sunucu işleyicilerini yükle
const authHandler = require('../api/tubitak-auth.js');
const recordsHandler = require('../api/tubitak-records.js');

console.log("=== ROTALI FENCİ – TÜM TÜBİTAK PROJELERİNDE KESİNLEŞTİRME VE DÜZENLEME AKIŞ TESTİ ===");

let passed = 0;
let total = 6;

async function runTest(idx, name, fn) {
    try {
        await fn();
        console.log(`[PASS] Test ${idx}: ${name}`);
        passed++;
    } catch (err) {
        console.error(`[FAIL] Test ${idx}: ${name}`, err);
        throw err;
    }
}

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
            this.headers[k.toLowerCase()] = v;
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

async function getRecordVersion(token, projectId, recordKey) {
    const { req, res } = mockReqRes({
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` },
        query: { projectId }
    });
    await recordsHandler(req, res);
    return res.data?.records?.[recordKey]?.version || 0;
}

(async () => {
    // 3 Proje İçin Öğrenci Oturumları
    const p1Student = await login('tarih1071', 'Busenur Esila ÖZDEMİR', 'stu-busenur');
    const p2Student = await login('bilim1453', 'Zümra DURAN', 'stu2-zumra');
    const p3Student = await login('siyer571', 'Hümeyra BULUT', 'stu3-humeyra');

    // TEST 1: PROJE 1 (TARİH) - Kesinleştir → Düzenle → Değiştir → Kaydet → Tekrar Kesinleştir → Word İndir
    await runTest(1, "Proje 1 (Tarih): Kesinleştir -> Düzenle -> Kaydet -> Tekrar Kesinleştir döngüsü kalıcı çalışmalı", async () => {
        const itemId = 'cifte-minareli-medrese';
        const initialText = "P1 Başlangıç Metni: " + Date.now();

        // 1. Kesinleştir
        const { req: fReq1, res: fRes1 } = mockReqRes({
            method: 'POST',
            headers: { 'Authorization': `Bearer ${p1Student.token}` },
            body: {
                action: 'finalize_item',
                projectId: 'proje-tarih',
                itemId,
                records: [{ criterionKey: 'c1_mimari', content: initialText }]
            }
        });
        await recordsHandler(fReq1, fRes1);
        assert.strictEqual(fRes1.statusCode, 200);
        assert.strictEqual(fRes1.data.status, 'in_review');

        // 2. DÜZENLE butonuna basar (reopen_item_edit)
        const { req: roReq, res: roRes } = mockReqRes({
            method: 'POST',
            headers: { 'Authorization': `Bearer ${p1Student.token}` },
            body: {
                action: 'reopen_item_edit',
                projectId: 'proje-tarih',
                itemId
            }
        });
        await recordsHandler(roReq, roRes);
        assert.strictEqual(roRes.statusCode, 200);
        assert.strictEqual(roRes.data.status, 'editing');

        // 3. Bilgileri değiştirir ve KAYDET butonuna basar
        const updatedText = initialText + " [Düzenlendi: Taç kapı bezeme detayları zenginleştirildi]";
        const curVer = await getRecordVersion(p1Student.token, 'proje-tarih', `${itemId}__c1_mimari`);
        const { req: sReq, res: sRes } = mockReqRes({
            method: 'POST',
            headers: { 'Authorization': `Bearer ${p1Student.token}` },
            body: {
                projectId: 'proje-tarih',
                itemId,
                criterionKey: 'c1_mimari',
                content: updatedText,
                clientVersion: curVer
            }
        });
        await recordsHandler(sReq, sRes);
        assert.strictEqual(sRes.statusCode, 200);

        // 4. Tekrar KESİNLEŞTİR butonuna basar
        const { req: fReq2, res: fRes2 } = mockReqRes({
            method: 'POST',
            headers: { 'Authorization': `Bearer ${p1Student.token}` },
            body: {
                action: 'finalize_item',
                projectId: 'proje-tarih',
                itemId,
                records: [{ criterionKey: 'c1_mimari', content: updatedText }]
            }
        });
        await recordsHandler(fReq2, fRes2);
        assert.strictEqual(fRes2.statusCode, 200);
        assert.strictEqual(fRes2.data.status, 'in_review');

        // 5. WORD İNDİR
        const { req: wReq, res: wRes } = mockReqRes({
            method: 'GET',
            headers: { 'Authorization': `Bearer ${p1Student.token}` },
            query: { exportDocx: 'single', projectId: 'proje-tarih', itemId }
        });
        await recordsHandler(wReq, wRes);
        assert.strictEqual(wRes.statusCode, 200);
        const cType = wRes.headers['content-type'] || wRes.headers['Content-Type'];
        assert.strictEqual(cType, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    });

    // TEST 2: PROJE 2 (BİLİM İNSANLARI) - Kesinleştir → Düzenle → Kaydet → Tekrar Kesinleştir
    await runTest(2, "Proje 2 (Bilim İnsanları): Kesinleştir -> Düzenle -> Kaydet -> Tekrar Kesinleştir döngüsü çalışmalı", async () => {
        const itemId = 'bilim-1';
        const initialText = "P2 Harezmi Cebir Metni: " + Date.now();

        // 1. Kesinleştir
        const { req: fReq1, res: fRes1 } = mockReqRes({
            method: 'POST',
            headers: { 'Authorization': `Bearer ${p2Student.token}` },
            body: {
                action: 'finalize_item',
                projectId: 'proje-bilim',
                itemId,
                records: [{ criterionKey: 'c1_temel_bilgiler', content: initialText }]
            }
        });
        await recordsHandler(fReq1, fRes1);
        assert.strictEqual(fRes1.statusCode, 200);

        // 2. DÜZENLE butonuna basar
        const { req: roReq, res: roRes } = mockReqRes({
            method: 'POST',
            headers: { 'Authorization': `Bearer ${p2Student.token}` },
            body: {
                action: 'reopen_item_edit',
                projectId: 'proje-bilim',
                itemId
            }
        });
        await recordsHandler(roReq, roRes);
        assert.strictEqual(roRes.statusCode, 200);
        assert.strictEqual(roRes.data.status, 'editing');

        // 3. Değiştirir ve Kaydeder
        const updatedText = initialText + " [Düzenlendi: Sıfırın matematiğe kazandırılması]";
        const curVer = await getRecordVersion(p2Student.token, 'proje-bilim', `${itemId}__c1_temel_bilgiler`);
        const { req: sReq, res: sRes } = mockReqRes({
            method: 'POST',
            headers: { 'Authorization': `Bearer ${p2Student.token}` },
            body: {
                projectId: 'proje-bilim',
                itemId,
                criterionKey: 'c1_temel_bilgiler',
                content: updatedText,
                clientVersion: curVer
            }
        });
        await recordsHandler(sReq, sRes);
        assert.strictEqual(sRes.statusCode, 200);

        // 4. Tekrar Kesinleştirir
        const { req: fReq2, res: fRes2 } = mockReqRes({
            method: 'POST',
            headers: { 'Authorization': `Bearer ${p2Student.token}` },
            body: {
                action: 'finalize_item',
                projectId: 'proje-bilim',
                itemId,
                records: [{ criterionKey: 'c1_temel_bilgiler', content: updatedText }]
            }
        });
        await recordsHandler(fReq2, fRes2);
        assert.strictEqual(fRes2.statusCode, 200);
    });

    // TEST 3: PROJE 3 (SİYER) - Kesinleştir → Düzenle → Kaydet → Tekrar Kesinleştir
    await runTest(3, "Proje 3 (Siyer): Kesinleştir -> Düzenle -> Kaydet -> Tekrar Kesinleştir döngüsü çalışmalı", async () => {
        const itemId = 'siyer-571';
        const initialText = "P3 571 Yılı Olayı: " + Date.now();

        // 1. Kesinleştir
        const { req: fReq1, res: fRes1 } = mockReqRes({
            method: 'POST',
            headers: { 'Authorization': `Bearer ${p3Student.token}` },
            body: {
                action: 'finalize_item',
                projectId: 'proje-siyer',
                itemId,
                records: [{ criterionKey: 'c1_olay', content: initialText }]
            }
        });
        await recordsHandler(fReq1, fRes1);
        assert.strictEqual(fRes1.statusCode, 200);

        // 2. DÜZENLE butonuna basar
        const { req: roReq, res: roRes } = mockReqRes({
            method: 'POST',
            headers: { 'Authorization': `Bearer ${p3Student.token}` },
            body: {
                action: 'reopen_item_edit',
                projectId: 'proje-siyer',
                itemId
            }
        });
        await recordsHandler(roReq, roRes);
        assert.strictEqual(roRes.statusCode, 200);
        assert.strictEqual(roRes.data.status, 'editing');

        // 3. Değiştirir ve Kaydeder
        const updatedText = initialText + " [Düzenlendi: Fil Hadisesi detayları]";
        const curVer = await getRecordVersion(p3Student.token, 'proje-siyer', `${itemId}__c1_olay`);
        const { req: sReq, res: sRes } = mockReqRes({
            method: 'POST',
            headers: { 'Authorization': `Bearer ${p3Student.token}` },
            body: {
                projectId: 'proje-siyer',
                itemId,
                criterionKey: 'c1_olay',
                content: updatedText,
                clientVersion: curVer
            }
        });
        await recordsHandler(sReq, sRes);
        assert.strictEqual(sRes.statusCode, 200);

        // 4. Tekrar Kesinleştirir
        const { req: fReq2, res: fRes2 } = mockReqRes({
            method: 'POST',
            headers: { 'Authorization': `Bearer ${p3Student.token}` },
            body: {
                action: 'finalize_item',
                projectId: 'proje-siyer',
                itemId,
                records: [{ criterionKey: 'c1_olay', content: updatedText }]
            }
        });
        await recordsHandler(fReq2, fRes2);
        assert.strictEqual(fRes2.statusCode, 200);
    });

    // TEST 4: Sayfa Yenilendiğinde veya Çıkış Yapılıp Yeniden Giriş Yapıldığında Son Verilerin Korunumu
    await runTest(4, "Çıkış yapılıp yeniden giriş yapıldığında son kaydedilen veriler eksiksiz gelmeli", async () => {
        // Yeni öğrenci oturumu (tekrar login)
        const reLoginStudent = await login('tarih1071', 'Busenur Esila ÖZDEMİR', 'stu-busenur');
        const { req: getReq, res: getRes } = mockReqRes({
            method: 'GET',
            headers: { 'Authorization': `Bearer ${reLoginStudent.token}` },
            query: { projectId: 'proje-tarih', fresh: 'true' }
        });
        await recordsHandler(getReq, getRes);
        assert.strictEqual(getRes.statusCode, 200);
        const savedRec = getRes.data.records['cifte-minareli-medrese__c1_mimari'];
        assert.ok(savedRec, "Kayıt veritabanında bulunamadı");
        assert.ok(savedRec.content.includes("Taç kapı bezeme detayları"), "Son kaydedilen düzenlenmiş veri korunmamış");
    });

    // TEST 5: Sınırsız Tekrarlanabilirlik Testi (Kesinleştir -> Düzenle -> Kesinleştir -> Düzenle ...)
    await runTest(5, "Kesinleştirme ve Düzenleme döngüsü sınırsız sayıda peş peşe tekrarlanabilmeli", async () => {
        const itemId = 'cifte-minareli-medrese';
        for (let cycle = 1; cycle <= 3; cycle++) {
            // Düzenle
            const { req: rReq, res: rRes } = mockReqRes({
                method: 'POST',
                headers: { 'Authorization': `Bearer ${p1Student.token}` },
                body: { action: 'reopen_item_edit', projectId: 'proje-tarih', itemId }
            });
            await recordsHandler(rReq, rRes);
            assert.strictEqual(rRes.statusCode, 200);
            assert.strictEqual(rRes.data.status, 'editing');

            // Kesinleştir
            const { req: fReq, res: fRes } = mockReqRes({
                method: 'POST',
                headers: { 'Authorization': `Bearer ${p1Student.token}` },
                body: { action: 'finalize_item', projectId: 'proje-tarih', itemId, records: [] }
            });
            await recordsHandler(fReq, fRes);
            assert.strictEqual(fRes.statusCode, 200);
            assert.strictEqual(fRes.data.status, 'in_review');
        }
    });

    // TEST 6: Yetkisiz Öğrencinin Başka Öğrencinin Kaydını Düzenlemeye Açmasının Engellenmesi (403)
    await runTest(6, "Başka bir öğrenciye ait kayıt üzerinde DÜZENLE işlemi 403 ile engellenmeli", async () => {
        // stu-busenur (Busenur) -> Zümra DURAN'a ait bilim kaydını düzenlemeye açamaz
        const { req: unauthorizedReq, res: unauthorizedRes } = mockReqRes({
            method: 'POST',
            headers: { 'Authorization': `Bearer ${p1Student.token}` },
            body: {
                action: 'reopen_item_edit',
                projectId: 'proje-bilim',
                itemId: 'bilim-1'
            }
        });
        await recordsHandler(unauthorizedReq, unauthorizedRes);
        assert.strictEqual(unauthorizedRes.statusCode, 403, "Yetkisiz öğrenci erişimi engellenmedi!");
    });

    console.log(`\n🎉 TÜM TESTLER BAŞARIYLA TAMAMLANDI (${passed}/${total} TEST PASSED)!\n`);
})();
