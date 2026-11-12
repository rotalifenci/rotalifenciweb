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
        send(data) {
            responseData = data;
            return this;
        },
        end() {
            return this;
        }
    };

    return { req, res, getStatus: () => statusCode, getData: () => responseData, getHeaders: () => headersSent };
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
    const cifteRevs = fetchResData.revisions.filter(r => r.itemId === "cifte-minareli-medrese" && r.criterionKey === "c1_location");
    assert.ok(cifteRevs.length > 0, "Çifte Minareli Medrese için revizyon kaydı mevcut olmalı.");
    const lastRev = cifteRevs[cifteRevs.length - 1];
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

    // -------------------------------------------------------------
    // TEST 13: Öğretmen Paneli Gerçek Word (.docx) & Toplu ZIP İndirme Testi
    // -------------------------------------------------------------
    console.log("13. Gerçek Word (.docx) & Toplu 40 Eser ZIP İndirme Testi:");
    const JSZip = require('jszip');
    const fs = require('fs');
    const path = require('path');
    const { generateAllMonumentsZipBuffer } = require('../api/_tubitak-docx.js');

    // Öğrenci Word indirmeye çalışırsa 403 almalı
    const stuDocxAttempt = mockReqRes("GET", {}, {
        projectId: "proje-tarih",
        exportDocx: "single",
        itemId: "cifte-minareli-medrese"
    }, { authorization: `Bearer ${studentToken}` });
    await tubitakRecordsHandler(stuDocxAttempt.req, stuDocxAttempt.res);
    assert.strictEqual(stuDocxAttempt.getStatus(), 403, "Öğrenci Word indirme isteği 403 ile engellenmeli");

    // Kayıtlı metin yoksa boş .docx üretmemeli (404 açıklayıcı uyarı)
    const emptyDocxReq = mockReqRes("GET", {}, {
        projectId: "proje-tarih",
        exportDocx: "single",
        itemId: "altinyayla-merkez-camii"
    }, { authorization: `Bearer ${teacherToken}` });
    await tubitakRecordsHandler(emptyDocxReq.req, emptyDocxReq.res);
    assert.strictEqual(emptyDocxReq.getStatus(), 404);
    assert.ok(emptyDocxReq.getData().error.includes("bulunamadı"));

    // Çifte Minareli Medrese için gerçek Proje 1 kriterlerini (c1_yapi_adi & c2_yapim_yili) kaydet
    const saveC1 = mockReqRes("POST", {
        projectId: "proje-tarih",
        itemId: "cifte-minareli-medrese",
        criterionKey: "c1_yapi_adi",
        content: "Çifte Minareli Medrese, Sivas merkezde yer alan Anadolu Selçuklu dönemi eseridir."
    }, {}, { authorization: `Bearer ${teacherToken}` });
    await tubitakRecordsHandler(saveC1.req, saveC1.res);
    assert.strictEqual(saveC1.getStatus(), 200);

    const saveC2 = mockReqRes("POST", {
        projectId: "proje-tarih",
        itemId: "cifte-minareli-medrese",
        criterionKey: "c2_yapim_yili",
        content: "1271 yılında İlhanlı Veziri Şemseddin Cüveynî tarafından yaptırılmıştır."
    }, {}, { authorization: `Bearer ${teacherToken}` });
    await tubitakRecordsHandler(saveC2.req, saveC2.res);
    assert.strictEqual(saveC2.getStatus(), 200);

    // Öğretmen Çifte Minareli Medrese için .docx indirdiğinde gerçek A4 Times New Roman 12pt .docx üretilmeli
    const teacherDocxReq = mockReqRes("GET", {}, {
        projectId: "proje-tarih",
        exportDocx: "single",
        itemId: "cifte-minareli-medrese"
    }, { authorization: `Bearer ${teacherToken}` });
    await tubitakRecordsHandler(teacherDocxReq.req, teacherDocxReq.res);
    assert.strictEqual(teacherDocxReq.getStatus(), 200);
    const docxHeaders = teacherDocxReq.getHeaders();
    assert.strictEqual(docxHeaders["Content-Type"], "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
    assert.ok(docxHeaders["Content-Disposition"].includes("Cifte_Minareli_Medrese.docx"));
    assert.ok(docxHeaders["Content-Disposition"].includes(encodeURIComponent("Çifte Minareli Medrese.docx")));

    const docxBuffer = teacherDocxReq.getData();
    assert.ok(Buffer.isBuffer(docxBuffer), "Çıktı gerçek binary Buffer olmalı");
    const docxZip = await JSZip.loadAsync(docxBuffer);
    assert.ok(docxZip.file("word/document.xml"), "Geçerli OpenXML word/document.xml içermeli");
    const docXml = await docxZip.file("word/document.xml").async("string");
    assert.ok(docXml.includes("Times New Roman"), "Times New Roman yazı tipi tanımlı olmalı");
    assert.ok(docXml.includes('w:val="24"'), "12 punto (24 half-pt) tanımlı olmalı");
    assert.ok(docXml.includes('w:val="both"'), "İki yana yaslı hizalama olmalı");
    assert.ok(docXml.includes('w:line="360"'), "1.5 satır aralığı tanımlı olmalı");
    assert.ok(docXml.includes('w:after="120"'), "6 pt paragraf sonrası boşluk tanımlı olmalı");
    assert.ok(/w:w="1190[56]"/.test(docXml) && /w:h="1683[78]"/.test(docXml), "A4 sayfa boyutu tanımlı olmalı");
    assert.ok(docXml.includes('w:top="1417"') && docXml.includes('w:left="1417"'), "2.5 cm sayfa kenar boşlukları tanımlı olmalı");
    assert.ok(docXml.includes("1271 yılında İlhanlı Veziri"), "Öğrencinin yazdığı metin birebir korunmalı");
    assert.strictEqual(/Tarihi Yapının Adı|Yapım Yılı|Taslak|Kaydedildi|Ali Veli/.test(docXml), false, "Kriter başlıkları, durum etiketleri ve öğrenci adları Word belgesinde olmamalı");

    // 40 eserin tamamı için toplu ayrı .docx -> ZIP testi
    const seedParsed = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/tubitak-seed-data.json'), 'utf8'));
    const p1All = seedParsed.projects["proje-tarih"];
    const syntheticRecords = {};
    p1All.items.forEach((it, idx) => {
        syntheticRecords[`${it.id}__c1_yapi_adi`] = { content: `Özgün araştırma metni ${idx + 1}: ${it.title} (çğıöşüÇĞİÖŞÜ).` };
    });
    const fullZipRes = await generateAllMonumentsZipBuffer(p1All.items, p1All.criteriaList, syntheticRecords);
    assert.strictEqual(fullZipRes.included.length, 40, "40 eserin tamamı ayrı .docx dosyası olarak üretilmeli");
    const loadedZip = await JSZip.loadAsync(fullZipRes.buffer);
    const zipEntries = Object.keys(loadedZip.files).filter(n => n.endsWith(".docx"));
    assert.strictEqual(zipEntries.length, 40, "ZIP içerisinde tam 40 adet ayrı .docx dosyası olmalı");
    assert.ok(zipEntries.includes("Divriği Ulu Camii ve Darüşşifası.docx"));
    assert.ok(zipEntries.includes("Halil Rıfat Paşa Köprüsü.docx"));
    console.log("   ✅ Başarılı! Gerçek .docx formatı, başlık/numara temizliği ve 40 eserin ayrı ZIP çıktısı doğrulandı.\n");

    console.log("🎉 TÜM KABUL TESTLERİ BAŞARIYLA GEÇTİ (13/13 TEST PASSED)!");
}

runTests().catch(err => {
    console.error("❌ TEST BAŞARISIZ:", err);
    process.exit(1);
});
