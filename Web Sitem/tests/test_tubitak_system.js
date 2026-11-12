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

    // -------------------------------------------------------------
    // TEST 14: Proje 2 (98 Bilim İnsanı, 5 Öğrenci, Yetki, Word & Toplu ZIP)
    // -------------------------------------------------------------
    console.log("14. Proje 2 (Matematik Tarihi Bilim İnsanları) Uçtan Uca Testi:");
    const bilimLogin = mockReqRes("POST", {
        password: process.env.TUBITAK_BILIM_PASS || "bilim2026",
        studentName: "Zümra DURAN",
        studentPin: "301"
    });
    await tubitakAuthHandler(bilimLogin.req, bilimLogin.res);
    assert.strictEqual(bilimLogin.getStatus(), 200);
    const zumraToken = bilimLogin.getData().token;

    const p2All = seedParsed.projects["proje-bilim"];
    const hiraFirstItem = p2All.items[20]; // #21 MUSTAFA SIDKI (Hira)
    const zumraFirstItem = p2All.items[0]; // #1 BİRCENDÎ (Zümra)

    // Zümra, Hira'nın bilim insanını düzenleyememeli (403)
    const p2Forbidden = mockReqRes("POST", {
        projectId: "proje-bilim",
        itemId: hiraFirstItem.id,
        criterionKey: "c1_dogum_tarihi_yeri",
        content: "Yetkisiz düzenleme"
    }, {}, { authorization: `Bearer ${zumraToken}` });
    await tubitakRecordsHandler(p2Forbidden.req, p2Forbidden.res);
    assert.strictEqual(p2Forbidden.getStatus(), 403);

    // Zümra kendi #1 bilim insanını (BİRCENDÎ) kaydedebilmeli (200)
    const p2OwnSave = mockReqRes("POST", {
        projectId: "proje-bilim",
        itemId: zumraFirstItem.id,
        criterionKey: "c9_yontemler_problemler",
        content: "Astronomik hesaplamalarda trigonometrik oranlar: $\\sin^2(\\alpha) + \\cos^2(\\alpha) = 1$."
    }, {}, { authorization: `Bearer ${zumraToken}` });
    await tubitakRecordsHandler(p2OwnSave.req, p2OwnSave.res);
    assert.strictEqual(p2OwnSave.getStatus(), 200);

    // Öğretmen BİRCENDÎ için .docx indirebilmeli ve başlık/kriter adı içermemeli
    const p2DocxReq = mockReqRes("GET", {}, {
        projectId: "proje-bilim",
        exportDocx: "single",
        itemId: zumraFirstItem.id
    }, { authorization: `Bearer ${teacherToken}` });
    await tubitakRecordsHandler(p2DocxReq.req, p2DocxReq.res);
    assert.strictEqual(p2DocxReq.getStatus(), 200);
    const p2DocxZip = await JSZip.loadAsync(p2DocxReq.getData());
    const p2Xml = await p2DocxZip.file("word/document.xml").async("string");
    assert.ok(p2Xml.includes("trigonometrik oranlar"), "Proje 2 öğrenci metni Word belgesinde yer almalı");
    assert.strictEqual(/Geliştirdiği Matematiksel Yöntemler|Doğum Tarihi ve Yeri|Zümra DURAN/.test(p2Xml), false);

    // 98 bilim insanının tamamı için ayrı .docx -> ZIP üretimi
    const p2Synth = {};
    p2All.items.forEach((it, idx) => {
        p2Synth[`${it.id}__c1_dogum_tarihi_yeri`] = { content: `Bilim insanı ${idx + 1} kaynak bilgisi: ${it.title}.` };
    });
    const p2ZipRes = await generateAllMonumentsZipBuffer(
        p2All.items,
        p2All.criteriaList,
        p2Synth,
        "Matematik_Tarihinde_Bilim_Insanlari_Arastirma_Metinleri.zip"
    );
    assert.strictEqual(p2ZipRes.included.length, 98, "98 bilim insanının tamamı ayrı .docx dosyası olarak üretilmeli");
    const p2LoadedZip = await JSZip.loadAsync(p2ZipRes.buffer);
    assert.strictEqual(Object.keys(p2LoadedZip.files).filter(n => n.endsWith(".docx")).length, 98);
    console.log("   ✅ Başarılı! Proje 2 (98 bilim insanı, 5 öğrenci, yetki, .docx ve 98'li ZIP) doğrulandı.\n");

    // 15. TEST: Proje 3 (Siyer 571–632) Öğrenci Dağılımı, Çoklu Olay, Yetki & Word/ZIP Dışa Aktarma
    console.log("📌 Test 15: Proje 3 (62 yıl 571–632, 5 öğrenci, çoklu olay, taşıma, yetki & Word/ZIP) doğrulanıyor...");
    const { generateAllSiyerYearsZipBuffer } = require('../api/_tubitak-docx.js');
    const p3All = seedParsed.projects["proje-siyer"];
    assert.strictEqual(p3All.items.length, 62);
    assert.strictEqual(p3All.criteriaList.length, 5);
    assert.strictEqual(p3All.criteriaList[0].title, "1. OLAY");
    assert.strictEqual(p3All.criteriaList[1].title, "2. OLAY");
    assert.strictEqual(p3All.criteriaList[2].title, "3. OLAY");
    assert.strictEqual(p3All.criteriaList[3].title, "4. KÖK DEĞER");
    assert.strictEqual(p3All.criteriaList[4].title, "5. KAYNAKÇA");
    assert.strictEqual(p3All.items.filter(it => it.assignedStudentId === "stu3-humeyra").length, 13);
    assert.strictEqual(p3All.items.filter(it => it.assignedStudentId === "stu3-ecrin").length, 13);
    assert.strictEqual(p3All.items.filter(it => it.assignedStudentId === "stu3-zeynep").length, 12);
    assert.strictEqual(p3All.items.filter(it => it.assignedStudentId === "stu3-yusuf").length, 12);
    assert.strictEqual(p3All.items.filter(it => it.assignedStudentId === "stu3-asaf").length, 12);

    // Hümeyra BULUT giriş yapar -> 571'e yazabilir, 584'e yazamaz (403)
    const p3Login = mockReqRes('POST', { password: process.env.TUBITAK_SIYER_PASS || "siyer2026", studentName: "Hümeyra BULUT" });
    await tubitakAuthHandler(p3Login.req, p3Login.res);
    assert.strictEqual(p3Login.getStatus(), 200);
    const p3Token = p3Login.getData().token;

    const p3WriteOwn = mockReqRes('POST', {
        projectId: "proje-siyer",
        itemId: "siyer-571",
        criterionKey: "c1_olay",
        content: "571 yılında Fil Vakası gerçekleşti ve Peygamber Efendimiz dünyaya geldi.",
        clientVersion: 0
    }, {}, { authorization: `Bearer ${p3Token}` });
    await tubitakRecordsHandler(p3WriteOwn.req, p3WriteOwn.res);
    assert.strictEqual(p3WriteOwn.getStatus(), 200);

    // 2. ve 3. Olay alanlarına da veri girişi yapılabilmeli
    const p3WriteOlay2 = mockReqRes('POST', {
        projectId: "proje-siyer",
        itemId: "siyer-571",
        criterionKey: "c1_olay_2",
        content: "571 yılında ikinci önemli olay açıklaması.",
        clientVersion: 0
    }, {}, { authorization: `Bearer ${p3Token}` });
    await tubitakRecordsHandler(p3WriteOlay2.req, p3WriteOlay2.res);
    assert.strictEqual(p3WriteOlay2.getStatus(), 200);

    const p3WriteOlay3 = mockReqRes('POST', {
        projectId: "proje-siyer",
        itemId: "siyer-571",
        criterionKey: "c1_olay_3",
        content: "571 yılında üçüncü önemli olay açıklaması.",
        clientVersion: 0
    }, {}, { authorization: `Bearer ${p3Token}` });
    await tubitakRecordsHandler(p3WriteOlay3.req, p3WriteOlay3.res);
    assert.strictEqual(p3WriteOlay3.getStatus(), 200);

    const p3WriteOther = mockReqRes('POST', {
        projectId: "proje-siyer",
        itemId: "siyer-584",
        criterionKey: "c1_olay",
        content: "Yetkisiz yıl düzenleme denemesi",
        clientVersion: 0
    }, {}, { authorization: `Bearer ${p3Token}` });
    await tubitakRecordsHandler(p3WriteOther.req, p3WriteOther.res);
    assert.strictEqual(p3WriteOther.getStatus(), 403, "Öğrenci başka öğrenciye atanan yılı düzenleyememeli");

    // Aynı yıla 2. olay ekleme & kaynak + içerik kaydetme
    const p3AddEv = mockReqRes('PUT', {
        action: "add_siyer_event",
        projectId: "proje-siyer",
        yearId: "siyer-571"
    }, {}, { authorization: `Bearer ${p3Token}` });
    await tubitakRecordsHandler(p3AddEv.req, p3AddEv.res);
    assert.strictEqual(p3AddEv.getStatus(), 200);
    const ev2Id = p3AddEv.getData().eventId;
    assert.ok(ev2Id.startsWith("siyer-571__ev_"));

    const p3WriteEv2 = mockReqRes('POST', {
        projectId: "proje-siyer",
        itemId: ev2Id,
        criterionKey: "c1_olay",
        content: "571 yılı ikinci olay kaydı test metni.",
        clientVersion: 0
    }, {}, { authorization: `Bearer ${p3Token}` });
    await tubitakRecordsHandler(p3WriteEv2.req, p3WriteEv2.res);
    assert.strictEqual(p3WriteEv2.getStatus(), 200);

    // 2. olayı 572 yılına taşıma
    const p3MoveEv = mockReqRes('PUT', {
        action: "move_siyer_event",
        projectId: "proje-siyer",
        eventId: ev2Id,
        fromYearId: "siyer-571",
        toYearId: "siyer-572"
    }, {}, { authorization: `Bearer ${p3Token}` });
    await tubitakRecordsHandler(p3MoveEv.req, p3MoveEv.res);
    assert.strictEqual(p3MoveEv.getStatus(), 200);
    assert.strictEqual(p3MoveEv.getData().toYearId, "siyer-572");

    // Öğretmen 571.docx tekil dışa aktarma (başlıksız, yalnızca içerik)
    const p3DocxReq = mockReqRes('GET', {}, { projectId: "proje-siyer", exportDocx: "single", itemId: "siyer-571" }, { authorization: `Bearer ${teacherToken}` });
    await tubitakRecordsHandler(p3DocxReq.req, p3DocxReq.res);
    assert.strictEqual(p3DocxReq.getStatus(), 200);
    assert.ok((p3DocxReq.getHeaders()["Content-Disposition"] || "").includes("571.docx"));
    const p3DocxZip = await JSZip.loadAsync(p3DocxReq.getData());
    const p3Xml = await p3DocxZip.file("word/document.xml").async("string");
    assert.ok(p3Xml.includes("Fil Vakası"), "Proje 3 öğrenci metni 571.docx belgesinde yer almalı");
    assert.ok(p3Xml.includes("ikinci önemli olay"), "Proje 3 ikinci olay metni de 571.docx içinde yer almalı");
    assert.strictEqual(/1\. OLAY|2\. OLAY|3\. OLAY|4\. KÖK DEĞER|5\. KAYNAKÇA|Hümeyra BULUT/.test(p3Xml), false);

    // Öğretmen "Araştırıldı – Olay tespit edilemedi" yıl işareti
    const p3FlagReq = mockReqRes('PUT', {
        action: "mark_siyer_year_flag",
        projectId: "proje-siyer",
        itemId: "siyer-573",
        flag: "no_event_found"
    }, {}, { authorization: `Bearer ${teacherToken}` });
    await tubitakRecordsHandler(p3FlagReq.req, p3FlagReq.res);
    assert.strictEqual(p3FlagReq.getStatus(), 200);
    assert.strictEqual(p3FlagReq.getData().siyerYearFlags["siyer-573"].status, "no_event_found");

    // 62 yılın tamamı için ayrı .docx -> ZIP üretimi
    const p3Synth = {};
    p3All.items.forEach(it => {
        p3Synth[`${it.id}__c1_olay`] = { content: `${it.year} yılı siyer araştırma metni.` };
    });
    const p3ZipRes = await generateAllSiyerYearsZipBuffer(
        p3All.items,
        {},
        p3All.criteriaList,
        p3Synth,
        "Siyer_571_632_Arastirma_Metinleri.zip"
    );
    assert.strictEqual(p3ZipRes.included.length, 62, "62 yılın tamamı ayrı .docx dosyası olarak üretilmeli");
    const p3LoadedZip = await JSZip.loadAsync(p3ZipRes.buffer);
    assert.strictEqual(Object.keys(p3LoadedZip.files).filter(n => n.endsWith(".docx")).length, 62);
    console.log("   ✅ Başarılı! Proje 3 (62 yıl, 5 öğrenci, çoklu olay, taşıma, yetki & Word/ZIP) doğrulandı.\n");

    console.log("🎉 TÜM KABUL TESTLERİ BAŞARIYLA GEÇTİ (15/15 TEST PASSED)!");
}

runTests().catch(err => {
    console.error("❌ TEST BAŞARISIZ:", err);
    process.exit(1);
});
