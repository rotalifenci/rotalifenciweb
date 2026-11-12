const assert = require('assert');
const tubitakAuthHandler = require('../api/tubitak-auth.js');
const tubitakRecordsHandler = require('../api/tubitak-records.js');

function mockReqRes(method, body = {}, query = {}, headers = {}) {
    const req = {
        method,
        body,
        query,
        headers: {
            ...headers
        }
    };
    let statusCode = 200;
    let responseData = null;
    let headersSent = {};

    const res = {
        setHeader(name, val) {
            headersSent[name] = val;
        },
        status(code) {
            statusCode = code;
            return this;
        },
        json(data) {
            responseData = data;
            return this;
        },
        end() {
            return this;
        }
    };

    return { req, res, getStatus: () => statusCode, getData: () => responseData };
}

async function runTests() {
    console.log("🧪 TÜBİTAK ARAŞTIRMA VE OTOMATİK KAYIT SİSTEMİ KABUL TESTLERİ BAŞLIYOR...\n");

    // -------------------------------------------------------------
    // TEST 1: Öğrenci kendi proje şifresiyle giriş yapabiliyor mu?
    // -------------------------------------------------------------
    console.log("1. Öğrenci Şifreli Giriş Testi (Tarihî Eserler: sivas2026):");
    const loginTest1 = mockReqRes("POST", {
        password: "sivas2026",
        studentName: "Ali Veli",
        studentPin: "101"
    });
    await tubitakAuthHandler(loginTest1.req, loginTest1.res);
    assert.strictEqual(loginTest1.getStatus(), 200);
    const authData1 = loginTest1.getData();
    assert.strictEqual(authData1.ok, true);
    assert.strictEqual(authData1.projectId, "proje-tarih");
    assert.strictEqual(authData1.role, "student");
    assert.ok(authData1.token, "Oturum belirteci (token) üretilmeli.");
    console.log("   ✅ Başarılı! Öğrenci yetkilendirildi. Token üretildi.\n");

    const studentToken = authData1.token;

    // -------------------------------------------------------------
    // TEST 2: Başka proje kayıtlarına erişmesi engelleniyor mu?
    // -------------------------------------------------------------
    console.log("2. Yetkisiz Projeye Erişim Engeli Testi (Tarih öğrencisi -> Siyer projesine erişim denemesi):");
    const accessForbidden = mockReqRes("GET", {}, { projectId: "proje-siyer" }, {
        authorization: `Bearer ${studentToken}`
    });
    await tubitakRecordsHandler(accessForbidden.req, accessForbidden.res);
    assert.strictEqual(accessForbidden.getStatus(), 403, "Yetkisiz proje erişimi 403 ile engellenmelidir.");
    console.log("   ✅ Başarılı! Başka projeye erişim 403 Forbidden ile engellendi.\n");

    // -------------------------------------------------------------
    // TEST 3: Öğretmen tüm projelere erişebiliyor mu?
    // -------------------------------------------------------------
    console.log("3. Öğretmen Ana Şifresi ile Giriş Testi (tubitak2204):");
    const teacherLogin = mockReqRes("POST", {
        password: "tubitak2204",
        studentName: "Fenci Öğretmen"
    });
    await tubitakAuthHandler(teacherLogin.req, teacherLogin.res);
    assert.strictEqual(teacherLogin.getStatus(), 200);
    const teacherData = teacherLogin.getData();
    assert.strictEqual(teacherData.role, "teacher");
    assert.strictEqual(teacherData.projectId, "all");
    const teacherToken = teacherData.token;
    console.log("   ✅ Başarılı! Öğretmen 'all' yetkisiyle doğrulandı.\n");

    // -------------------------------------------------------------
    // TEST 4: Öğrencinin yazdığı veri otomatik kaydediliyor mu?
    // -------------------------------------------------------------
    console.log("4. Otomatik Kayıt Motoru Testi (Autosave Record):");
    const saveReq = mockReqRes("POST", {
        projectId: "proje-tarih",
        itemId: "cifte-minareli-medrese",
        criterionKey: "c1_location",
        content: "Sivas Tarihî Kent Meydanı, Şifaiye Medresesi karşısı. Merkez / SİVAS (TÜBİTAK 2026 Saha İncelemesi).",
        clientVersion: 1
    }, {}, {
        authorization: `Bearer ${studentToken}`
    });
    await tubitakRecordsHandler(saveReq.req, saveReq.res);
    assert.strictEqual(saveReq.getStatus(), 200);
    const saveResData = saveReq.getData();
    assert.strictEqual(saveResData.ok, true);
    assert.strictEqual(saveResData.status, "saved");
    assert.ok(saveResData.version >= 1, "Sürüm numarası artmalı.");
    console.log(`   ✅ Başarılı! Kayıt v${saveResData.version} olarak veritabanına işlendi ve teyit edildi.\n`);

    // -------------------------------------------------------------
    // TEST 5: Sayfa yenilendiğinde kayıt korunuyor mu? (GET test)
    // -------------------------------------------------------------
    console.log("5. Sayfa Yenilendiğinde Veri Korunumu Testi (Persistence GET):");
    const fetchReq = mockReqRes("GET", {}, { projectId: "proje-tarih" }, {
        authorization: `Bearer ${studentToken}`
    });
    await tubitakRecordsHandler(fetchReq.req, fetchReq.res);
    assert.strictEqual(fetchReq.getStatus(), 200);
    const fetchResData = fetchReq.getData();
    const fetchedRecord = fetchResData.records["cifte-minareli-medrese__c1_location"];
    assert.ok(fetchedRecord, "Kayıt veritabanından başarıyla okunabilmeli.");
    assert.strictEqual(fetchedRecord.content.includes("TÜBİTAK 2026 Saha İncelemesi"), true);
    console.log("   ✅ Başarılı! Kaydedilen veri eksiksiz geri okundu.\n");

    // -------------------------------------------------------------
    // TEST 6 & 7: Değişiklik geçmişi (Revizyon) tutuluyor mu?
    // -------------------------------------------------------------
    console.log("6 & 7. Değişiklik Geçmişi ve Revizyon Denetimi:");
    assert.ok(fetchResData.revisions.length > 0, "Revizyon kaydı mevcut olmalı.");
    const lastRev = fetchResData.revisions[fetchResData.revisions.length - 1];
    assert.strictEqual(lastRev.itemId, "cifte-minareli-medrese");
    assert.strictEqual(lastRev.criterionKey, "c1_location");
    console.log(`   ✅ Başarılı! Revizyon geçmişi kayıt altında: Öğrenci: ${lastRev.studentName}, Sürüm: v${lastRev.version}.\n`);

    // -------------------------------------------------------------
    // TEST 8: Öğrenci İncelemeye Gönderiyor mu?
    // -------------------------------------------------------------
    console.log("8. İncelemeye Gönderme Testi (Submit Review):");
    const reviewReq = mockReqRes("PUT", {
        action: "submit_review",
        itemId: "cifte-minareli-medrese",
        projectId: "proje-tarih"
    }, {}, {
        authorization: `Bearer ${studentToken}`
    });
    await tubitakRecordsHandler(reviewReq.req, reviewReq.res);
    assert.strictEqual(reviewReq.getStatus(), 200);
    console.log("   ✅ Başarılı! Çalışma inceleme için öğretmene sevk edildi.\n");

    // -------------------------------------------------------------
    // TEST 9 & 10: Öğretmen verileri anlık görüp onaylıyor mu?
    // -------------------------------------------------------------
    console.log("9 & 10. Öğretmen Anlık İnceleme ve Onay Testi:");
    const teacherReviewReq = mockReqRes("PUT", {
        action: "teacher_review",
        itemId: "cifte-minareli-medrese",
        projectId: "proje-tarih",
        status: "approved",
        feedbackMessage: "Tebrikler ekip! Konum ve tescil bilgileri akademik standartlara uygun doldurulmuş."
    }, {}, {
        authorization: `Bearer ${teacherToken}`
    });
    await tubitakRecordsHandler(teacherReviewReq.req, teacherReviewReq.res);
    assert.strictEqual(teacherReviewReq.getStatus(), 200);
    const teacherRes = teacherReviewReq.getData();
    assert.strictEqual(teacherRes.status, "approved");
    console.log("   ✅ Başarılı! Öğretmen kaydı onayladı ve geri bildirim ekledi.\n");

    // -------------------------------------------------------------
    // TEST 11: Eski Sürümü Geri Yükleme (Restore Revision)
    // -------------------------------------------------------------
    console.log("11. Sürüm Geri Yükleme Testi (Restore Revision as New Version):");
    const restoreReq = mockReqRes("PUT", {
        action: "restore_revision",
        revisionId: lastRev.id
    }, {}, {
        authorization: `Bearer ${studentToken}`
    });
    await tubitakRecordsHandler(restoreReq.req, restoreReq.res);
    assert.strictEqual(restoreReq.getStatus(), 200);
    const restoreData = restoreReq.getData();
    assert.strictEqual(restoreData.ok, true);
    assert.ok(restoreData.record.version > lastRev.version, "Geri yükleme eski veriyi silmeden yeni bir sürüm oluşturmalı.");
    console.log(`   ✅ Başarılı! Eski sürüm v${lastRev.version}, yeni sürüm v${restoreData.record.version} olarak güvenle geri yüklendi.\n`);

    // -------------------------------------------------------------
    // TEST 12: Öğrenci Yetki Sınırı & Öğretmen Görev Ataması (Reassign)
    // -------------------------------------------------------------
    console.log("12. Öğrenci Yetki Sınırı & Öğretmen Görev Atama Testi:");
    const hazelLogin = mockReqRes("POST", {
        password: process.env.TUBITAK_TARIH_PASS || "sivas2026",
        studentName: "Hazel Mina ŞİMŞEK",
        studentPin: "202"
    });
    await tubitakAuthHandler(hazelLogin.req, hazelLogin.res);
    assert.strictEqual(hazelLogin.getStatus(), 200);
    const hazelToken = hazelLogin.getData().token;

    // Hazel, Busenur'un #1 eserini düzenleyememeli (403)
    const forbiddenEdit = mockReqRes("POST", {
        projectId: "proje-tarih",
        itemId: "divrigi-ulu-camii",
        criterionKey: "c1_yapi_adi",
        content: "Yetkisiz düzenleme denemesi"
    }, {}, { authorization: `Bearer ${hazelToken}` });
    await tubitakRecordsHandler(forbiddenEdit.req, forbiddenEdit.res);
    assert.strictEqual(forbiddenEdit.getStatus(), 403, "Başka öğrenciye atanmış eserde 403 dönmeli");

    // Hazel kendi #15 eserini (Susamışlar Konağı) düzenleyebilmeli (200)
    const ownEdit = mockReqRes("POST", {
        projectId: "proje-tarih",
        itemId: "susamislar-konagi",
        criterionKey: "c1_yapi_adi",
        content: "Susamışlar Konağı"
    }, {}, { authorization: `Bearer ${hazelToken}` });
    await tubitakRecordsHandler(ownEdit.req, ownEdit.res);
    assert.strictEqual(ownEdit.getStatus(), 200);

    // Öğretmen #15 eseri Zeynep'e yeniden atayabilmeli (200) ve mevcut kayıt korunmalı
    const reassignReq = mockReqRes("PUT", {
        action: "reassign_item",
        projectId: "proje-tarih",
        itemId: "susamislar-konagi",
        assignedStudentId: "stu-zeynep"
    }, {}, { authorization: `Bearer ${teacherToken}` });
    await tubitakRecordsHandler(reassignReq.req, reassignReq.res);
    assert.strictEqual(reassignReq.getStatus(), 200);
    assert.strictEqual(reassignReq.getData().assignments["susamislar-konagi"].assignedStudentId, "stu-zeynep");

    // Eski haline geri al (Hazel)
    const restoreAssignReq = mockReqRes("PUT", {
        action: "reassign_item",
        projectId: "proje-tarih",
        itemId: "susamislar-konagi",
        assignedStudentId: "stu-hazel"
    }, {}, { authorization: `Bearer ${teacherToken}` });
    await tubitakRecordsHandler(restoreAssignReq.req, restoreAssignReq.res);
    assert.strictEqual(restoreAssignReq.getStatus(), 200);
    console.log("   ✅ Başarılı! Öğrenci yetki izolasyonu ve öğretmen görev atama akışı doğrulandı.\n");

    console.log("🎉 TÜM KABUL TESTLERİ BAŞARIYLA GEÇTİ (12/12 TEST PASSED)!");
}

runTests().catch(err => {
    console.error("❌ TEST BAŞARISIZ:", err);
    process.exit(1);
});
