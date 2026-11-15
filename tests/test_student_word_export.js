const fs = require('fs');
const path = require('path');
const JSZip = require('jszip');

// Import the handlers and docx helpers
const tubitakAuthHandler = require('../api/tubitak-auth.js');
const tubitakRecordsHandler = require('../api/tubitak-records.js');
const {
    generateMonumentDocxBuffer,
    generateSiyerYearDocxBuffer,
    extractSiyerYearTextParagraphs,
    extractMonumentTextParagraphs
} = require('../api/_tubitak-docx.js');

function mockReqRes(options) {
    const req = {
        method: options.method || 'GET',
        query: options.query || {},
        body: options.body || {},
        headers: options.headers || {}
    };

    let statusCode = 200;
    let headers = {};
    let responseBody = null;
    let isEnded = false;

    const res = {
        status(code) {
            statusCode = code;
            return res;
        },
        setHeader(k, v) {
            headers[k.toLowerCase()] = v;
            return res;
        },
        getHeader(k) {
            return headers[k.toLowerCase()];
        },
        json(data) {
            responseBody = data;
            isEnded = true;
            return res;
        },
        send(data) {
            responseBody = data;
            isEnded = true;
            return res;
        },
        end(data) {
            if (data) responseBody = data;
            isEnded = true;
            return res;
        }
    };

    return { req, res, getStatus: () => statusCode, getHeaders: () => headers, getBody: () => responseBody };
}

async function getAuthToken(password, studentName = null, studentPin = null) {
    const { req, res, getStatus, getBody } = mockReqRes({
        method: "POST",
        body: {
            password,
            studentName: studentName || "Öğrenci",
            studentPin: studentPin || "101"
        }
    });

    await tubitakAuthHandler(req, res);
    const result = getBody();
    if (getStatus() !== 200 || !result.ok || !result.token) {
        throw new Error(`Auth failed for ${password}: ` + JSON.stringify(result));
    }
    return result.token;
}

async function runTests() {
    console.log("=== ROTALI FENCİ – TÜM TÜBİTAK PROJELERİNDE ÖĞRENCİ WORD İNDİRME KABUL TESTLERİ ===");
    let passed = 0;
    let total = 0;

    function assert(condition, testName) {
        total++;
        if (condition) {
            console.log(`[PASS] Test ${total}: ${testName}`);
            passed++;
        } else {
            console.error(`[FAIL] Test ${total}: ${testName}`);
            throw new Error(`Assertion failed: ${testName}`);
        }
    }

    // 1. Proje 1 (Tarih): Öğrenci Token Alımı & Word İndirme
    const tokenTarih = await getAuthToken("tarih1071", "Busenur YILDIZ", "101");
    assert(!!tokenTarih, "Proje 1 (Tarih) öğrencisi (Busenur YILDIZ) şifresiyle başarıyla yetkilendirildi");

    // Proje 1 için test verisi ekle (divrigi-ulu-camii Busenur'a atanmıştır)
    const sampleRecordTarih = {
        action: "save_item_batch",
        projectId: "proje-tarih",
        itemId: "divrigi-ulu-camii",
        records: [
            { criterionKey: "c1_yapi_adi", content: "Divriği Ulu Cami ve Darüşşifası Mengücekliler döneminde inşa edilmiştir." },
            { criterionKey: "c2_yapim_yili", content: "1228-1229 yıllarında inşa edilmiştir." },
            { criterionKey: "c3_medeniyet", content: "Mengücekli Beyliği dönemine ait olup UNESCO Dünya Mirası listesindedir." }
        ]
    };
    const { req: saveReq1, res: saveRes1, getStatus: getSaveStatus1 } = mockReqRes({
        method: "POST",
        headers: { "authorization": `Bearer ${tokenTarih}` },
        body: sampleRecordTarih
    });
    await tubitakRecordsHandler(saveReq1, saveRes1);
    assert(getSaveStatus1() === 200, "Proje 1 için araştırma verileri başarıyla kaydedildi");

    // Öğrenci Word İndir isteği gönderir
    const { req: dlReq1, res: dlRes1, getStatus: getDlStatus1, getHeaders: getDlHeaders1, getBody: getDlBody1 } = mockReqRes({
        method: "GET",
        query: { projectId: "proje-tarih", exportDocx: "single", itemId: "divrigi-ulu-camii" },
        headers: { "authorization": `Bearer ${tokenTarih}` }
    });
    await tubitakRecordsHandler(dlReq1, dlRes1);
    assert(getDlStatus1() === 200, "Öğrenci Proje 1'de açtığı eseri Word olarak başarıyla indirebildi (HTTP 200)");

    const dlBuf1 = getDlBody1();
    assert(Buffer.isBuffer(dlBuf1) && dlBuf1.length > 500, "İndirilen dosya gerçek ikili (.docx) buffer içeriyor");

    // Zip olarak aç ve document.xml incele
    const zip1 = await JSZip.loadAsync(dlBuf1);
    const docXml1 = await zip1.file("word/document.xml").async("text");
    assert(docXml1.includes("Divriği Ulu Cami") && docXml1.includes("Mengücekliler") && docXml1.includes("UNESCO"), "Word belgesinde öğrencinin girdiği kriter metinleri eksiksiz yer alıyor");
    assert(!docXml1.includes("c1_yapi_adi") && !docXml1.includes("1. Kriter:"), "Kriter başlıkları veya ham anahtarlar dosyaya gereksiz eklenmemiş (başlıksız metin kuralı)");

    // 2. Proje 2 (Bilim İnsanları): Öğrenci Token & Word İndirme
    const tokenBilim = await getAuthToken("bilim1453", "Zümra DURAN", "101");
    assert(!!tokenBilim, "Proje 2 (Bilim) öğrencisi (Zümra DURAN) başarıyla yetkilendirildi");

    // Proje 2 Fatma Zehra'ya ait bilim insanını bulalım
    const seed = JSON.parse(fs.readFileSync(path.join(__dirname, "../data/tubitak-seed-data.json"), "utf8"));
    const zumraItem = seed.projects["proje-bilim"].items.find(it => it.assignedStudentId === "stu2-zumra") || seed.projects["proje-bilim"].items[0];

    const sampleRecordBilim = {
        action: "save_item_batch",
        projectId: "proje-bilim",
        itemId: zumraItem.id,
        records: [
            { criterionKey: "c1_dogum_tarihi_yeri", content: "1256 yılında Merakeş'te doğmuştur." },
            { criterionKey: "c4_hayat_hikayesi", content: `${zumraItem.title} İslam medeniyetinin büyük matematik ve astronomi bilginidir.` }
        ]
    };
    const { req: saveReq2, res: saveRes2, getStatus: getSaveStatus2 } = mockReqRes({
        method: "POST",
        headers: { "authorization": `Bearer ${tokenBilim}` },
        body: sampleRecordBilim
    });
    await tubitakRecordsHandler(saveReq2, saveRes2);
    assert(getSaveStatus2() === 200, "Proje 2 bilim insanı için araştırma verileri başarıyla kaydedildi");

    // Bilim insanı Word indir
    const { req: dlReq2, res: dlRes2, getStatus: getDlStatus2, getHeaders: getDlHeaders2, getBody: getDlBody2 } = mockReqRes({
        method: "GET",
        query: { projectId: "proje-bilim", exportDocx: "single", itemId: zumraItem.id },
        headers: { "authorization": `Bearer ${tokenBilim}` }
    });
    await tubitakRecordsHandler(dlReq2, dlRes2);
    assert(getDlStatus2() === 200, "Öğrenci Proje 2'de açık olan bilim insanının araştırmasını Word olarak indirebildi");

    const dlBuf2 = getDlBody2();
    const zip2 = await JSZip.loadAsync(dlBuf2);
    const docXml2 = await zip2.file("word/document.xml").async("text");
    assert(docXml2.includes(zumraItem.title) || docXml2.includes("İslam medeniyetinin"), "Proje 2 Word belgesinde bilim insanı metinleri eksiksiz yer alıyor");

    // 3. Proje 3 (Siyer): 3 Olay, Kök Değer ve Kaynakça Word İndirme
    const tokenSiyer = await getAuthToken("siyer571", "Hümeyra BULUT", "101");
    assert(!!tokenSiyer, "Proje 3 (Siyer) öğrencisi başarıyla yetkilendirildi");

    // 571 yılı Rümeysa'ya atanmıştır
    const sampleRecordSiyer = {
        action: "save_item_batch",
        projectId: "proje-siyer",
        itemId: "siyer-571",
        records: [
            { criterionKey: "c1_olay", content: "Peygamber Efendimiz (s.a.v.) 571 yılında Mekke'de dünyaya teşrif etmiştir." },
            { criterionKey: "c2_kok_deger", content: "Sevgi, Saygı, Dürüstlük\nDoğumuyla birlikte insanlığa merhamet ve sevgi gelmiştir." },
            { criterionKey: "c3_kaynakca", content: "İbn İshak, es-Siretü'n-Nebeviyye, s. 45; İbn Hişam, Cilt 1." },
            { criterionKey: "c1_olay_2", content: "Fil Vakası meydana gelmiş, Ebrehe'nin ordusu helak edilmiştir." },
            { criterionKey: "c2_kok_deger_2", content: "Adalet, Sabır" },
            { criterionKey: "c3_kaynakca_2", content: "Kur'an-ı Kerim, Fil Suresi 1-5. ayetler." }
        ]
    };
    const { req: saveReq3, res: saveRes3, getStatus: getSaveStatus3 } = mockReqRes({
        method: "POST",
        headers: { "authorization": `Bearer ${tokenSiyer}` },
        body: sampleRecordSiyer
    });
    await tubitakRecordsHandler(saveReq3, saveRes3);
    assert(getSaveStatus3() === 200, "Proje 3 Siyer 571 yılı için 1. ve 2. olay verileri başarıyla kaydedildi");

    // 571 yılı Word indir
    const { req: dlReq3, res: dlRes3, getStatus: getDlStatus3, getHeaders: getDlHeaders3, getBody: getDlBody3 } = mockReqRes({
        method: "GET",
        query: { projectId: "proje-siyer", exportDocx: "single", itemId: "siyer-571" },
        headers: { "authorization": `Bearer ${tokenSiyer}` }
    });
    await tubitakRecordsHandler(dlReq3, dlRes3);
    assert(getDlStatus3() === 200, "Öğrenci 571 yılı Siyer araştırmasını Word olarak indirebildi");

    const dlBuf3 = getDlBody3();
    const zip3 = await JSZip.loadAsync(dlBuf3);
    const docXml3 = await zip3.file("word/document.xml").async("text");
    assert(docXml3.includes("dünyaya teşrif etmiştir") && docXml3.includes("Fil Vakası"), "Siyer Word dosyasında her iki olayın araştırma metni yer alıyor");
    assert(docXml3.includes("Sevgi, Saygı, Dürüstlük") && docXml3.includes("Fil Suresi"), "Siyer Word dosyasında kök değerler ve kaynakçalar kendi olayının altında yer alıyor");

    // 4. Yetki & İzolasyon Güvenlik Testleri
    // Tarih öğrencisi Siyer projesini indiremez
    const { req: secReq1, res: secRes1, getStatus: getSecStatus1 } = mockReqRes({
        method: "GET",
        query: { projectId: "proje-siyer", exportDocx: "single", itemId: "siyer-571" },
        headers: { "authorization": `Bearer ${tokenTarih}` }
    });
    await tubitakRecordsHandler(secReq1, secRes1);
    assert(getSecStatus1() === 403, "Tarih öğrencisinin Siyer projesi Word çıktısına erişimi 403 Forbidden ile engellendi");

    // Öğrenci toplu indirme (exportDocx=all) yapamaz
    const { req: secReq2, res: secRes2, getStatus: getSecStatus2 } = mockReqRes({
        method: "GET",
        query: { projectId: "proje-tarih", exportDocx: "all" },
        headers: { "authorization": `Bearer ${tokenTarih}` }
    });
    await tubitakRecordsHandler(secReq2, secRes2);
    assert(getSecStatus2() === 403, "Öğrencinin toplu Word (all ZIP) indirme yetkisi 403 Forbidden ile engellendi");

    // Öğrenci başka öğrenciye ait eseri indiremez (Hazel, Busenur'un divrigi-ulu-camii'ni indiremez)
    const tokenHazel = await getAuthToken("tarih1071", "Hazel Mina ŞİMŞEK", "202");
    const { req: secReq3, res: secRes3, getStatus: getSecStatus3 } = mockReqRes({
        method: "GET",
        query: { projectId: "proje-tarih", exportDocx: "single", itemId: "divrigi-ulu-camii" },
        headers: { "authorization": `Bearer ${tokenHazel}` }
    });
    await tubitakRecordsHandler(secReq3, secRes3);
    assert(getSecStatus3() === 403, "Başka öğrenciye atanmış eseri indirme denemesi 403 Forbidden ile engellendi");

    // Öğretmen tekli ve toplu indirme yetkisine sahiptir
    const teacherToken = await getAuthToken("tubitak2204", "Fenci Öğretmen");
    const { req: tReq1, res: tRes1, getStatus: getTStatus1 } = mockReqRes({
        method: "GET",
        query: { projectId: "proje-tarih", exportDocx: "single", itemId: "divrigi-ulu-camii" },
        headers: { "authorization": `Bearer ${teacherToken}` }
    });
    await tubitakRecordsHandler(tReq1, tRes1);
    assert(getTStatus1() === 200, "Öğretmen hesabı tekli Word çıktısını başarıyla indirebiliyor");

    // 5. Henüz Veri Girilmemiş Konu İçin 404 Uyarısı
    const { req: emptyReq, res: emptyRes, getStatus: getEmptyStatus, getBody: getEmptyBody } = mockReqRes({
        method: "GET",
        query: { projectId: "proje-siyer", exportDocx: "single", itemId: "siyer-632" },
        headers: { "authorization": `Bearer ${teacherToken}` }
    });
    await tubitakRecordsHandler(emptyReq, emptyRes);
    assert(getEmptyStatus() === 404 && getEmptyBody()?.error?.includes("henüz"), "Kayıtlı verisi bulunmayan konu için 'Bu araştırma için henüz indirilebilecek veri bulunmuyor' mesajı döndürüldü");

    // 6. UI Buton Konumu ve Yapı Doğrulaması (tubitak-research.js)
    const researchJs = fs.readFileSync(path.join(__dirname, "../js/tubitak-research.js"), "utf8");
    assert(researchJs.includes("btn-student-word-download"), "Araştırma formunun üst çubuğunda 'btn-student-word-download' butonu mevcut");
    assert(researchJs.includes("WORD İNDİR"), "Buton üzerinde büyük harflerle 'WORD İNDİR' metni mevcut");
    assert(researchJs.includes("fa-file-word"), "Buton üzerinde fa-file-word simgesi mevcut");

    // Buton sıralaması kontrolü: tubitak-autosave-indicator < btn-student-word-download < KAYDET < KESİNLEŞTİR
    const idxIndicator = researchJs.indexOf('id="tubitak-autosave-indicator"');
    const idxWordBtn = researchJs.indexOf('id="btn-student-word-download"');
    const idxSaveBtn = researchJs.indexOf('saveCurrentItemDraft(\'${item.id}\')');
    const idxFinalBtn = researchJs.indexOf('finalizeCurrentItem(\'${item.id}\')');

    assert(idxIndicator < idxWordBtn && idxWordBtn < idxSaveBtn && idxSaveBtn < idxFinalBtn, "Buton sıralaması tam olarak 'KAYDEDİLDİ | WORD İNDİR | KAYDET | KESİNLEŞTİR' düzeninde");

    console.log(`\nSONUÇ: ${passed} / ${total} TEST BAŞARIYLA GEÇTİ!`);
    console.log("ÖĞRENCİ WORD İNDİRME ÖZELLİĞİ TÜM PROJELERDE VE GÜVENLİK KURALLARINDA KUSURSUZ DOĞRULANDI! ✅\n");
}

runTests().catch(err => {
    console.error("Test Hatası:", err);
    process.exit(1);
});
