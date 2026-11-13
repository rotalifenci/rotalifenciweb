const assert = require('assert');
const tubitakAuthHandler = require('../api/tubitak-auth.js');
const tubitakRecordsHandler = require('../api/tubitak-records.js');
const { getCloudStore, saveCloudStore, mergeStores } = require('../api/_tubitak-cloud.js');

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

async function runE2ETests() {
    console.log("🧪 TÜBİTAK OTOMATİK KAYIT & BULUT SENKRONİZASYONU UÇTAN UCA TESTLERİ (A-F)...\\n");

    // Oturumları al
    const authTarih = mockReqRes("POST", { password: "tarih1071", studentName: "Busenur Esila ÖZDEMİR", studentPin: "101" });
    await tubitakAuthHandler(authTarih.req, authTarih.res);
    const tarihToken = authTarih.getData().token;

    const authBilim = mockReqRes("POST", { password: "bilim1453", studentName: "Zümra DURAN", studentPin: "201" });
    await tubitakAuthHandler(authBilim.req, authBilim.res);
    const bilimToken = authBilim.getData().token;

    const authSiyer = mockReqRes("POST", { password: "siyer571", studentName: "Hümeyra BULUT", studentPin: "301" });
    await tubitakAuthHandler(authSiyer.req, authSiyer.res);
    const siyerToken = authSiyer.getData().token;

    const authTeacher = mockReqRes("POST", { password: "tubitak2204", studentName: "Öğretmen Yönetici" });
    await tubitakAuthHandler(authTeacher.req, authTeacher.res);
    const teacherToken = authTeacher.getData().token;

    // -------------------------------------------------------------
    // TEST A: PROJE 1 (SİVAS TARİHİ) – 18 KRİTER KAYDI & ÖĞRETMEN DOĞRULAMASI
    // -------------------------------------------------------------
    console.log("📌 TEST A: Proje 1 (18 Kriter Otomatik Kayıt, Yenileme ve Öğretmen Görüntüleme)...");
    const p1Item = "divrigi-ulu-camii-darussifasi";
    const p1CriteriaKeys = [
        "c1_yapi_adi", "c2_yapim_yili", "c3_banisi", "c4_mimari", "c5_konum_ada_parsel",
        "c6_kullanilan_malzeme", "c7_plan_tipi", "c8_susleme_sanat", "c9_kitabeler",
        "c10_islev_tarihcesi", "c11_donem_olaylari", "c12_vakfiye_vakiflar", "c13_onarimlar",
        "c14_gunumuz_durumu", "c15_kultur_turizm", "c16_kaynakca", "c17_saha_gozlemleri", "c18_degerlendirme"
    ];

    for (let i = 0; i < p1CriteriaKeys.length; i++) {
        const cKey = p1CriteriaKeys[i];
        const textVal = `Divriği Ulu Camii Kriter #${i + 1} detaylı araştırma metni. UNESCO Dünya Mirası özellikleri ve Mengücekli dönemi mimari analizi (Uzun akademik paragraf).`;
        const saveReq = mockReqRes("POST", {
            projectId: "proje-tarih",
            itemId: p1Item,
            criterionKey: cKey,
            content: textVal,
            clientVersion: 0
        }, {}, { authorization: `Bearer ${tarihToken}` });
        await tubitakRecordsHandler(saveReq.req, saveReq.res);
        assert.strictEqual(saveReq.getStatus(), 200);
        assert.strictEqual(saveReq.getData().ok, true);
        assert.strictEqual(saveReq.getData().status, "saved");
    }

    // Sayfa Yenilendiğinde (GET) & Öğretmen Panelinde 18 Kriterin Tamamı Geliyor mu?
    const teacherGetP1 = mockReqRes("GET", {}, { projectId: "proje-tarih" }, { authorization: `Bearer ${teacherToken}` });
    await tubitakRecordsHandler(teacherGetP1.req, teacherGetP1.res);
    assert.strictEqual(teacherGetP1.getStatus(), 200);
    const p1Records = teacherGetP1.getData().records;
    p1CriteriaKeys.forEach((cKey, idx) => {
        const rKey = `${p1Item}__${cKey}`;
        assert.ok(p1Records[rKey], `Kriter ${cKey} kaydı bulunmalı`);
        assert.ok(p1Records[rKey].content.includes(`Kriter #${idx + 1}`), `Kriter ${cKey} içeriği doğru olmalı`);
    });
    console.log("   ✅ Başarılı! Proje 1'de 18 kriterin tamamı otomatik kaydedildi ve öğretmen panelinde eksiksiz doğrulandı.\n");

    // -------------------------------------------------------------
    // TEST B: PROJE 2 (BİLİM İNSANLARI) – 13 KRİTER KAYDI & ÖĞRETMEN DOĞRULAMASI
    // -------------------------------------------------------------
    console.log("📌 TEST B: Proje 2 (Bilim İnsanları 13 Kriter Kaydı, Yenileme ve Öğretmen Doğrulaması)...");
    const p2Item = "bilim-01-bircendi";
    const p2CriteriaKeys = [
        "c1_bilim_insani_adi", "c2_donem_yuzyil", "c3_yasadigi_cografya", "c4_uzmanlik_alanlari",
        "c5_hocaları_etkilendigi", "c6_ogrencileri_ekol", "c7_matematik_katkilari", "c8_astronomi_katkilari",
        "c9_yontemler_problemler", "c10_onemli_eserleri", "c11_eser_inceleme_ozet", "c12_etkiledigi_sonraki", "c13_kaynakca"
    ];

    for (let i = 0; i < p2CriteriaKeys.length; i++) {
        const cKey = p2CriteriaKeys[i];
        const textVal = `Bircendî Kriter #${i + 1} araştırması: Tahrîrü'l-Mecistî şerhi, trigonometrik hesaplamalar ve 16. yüzyıl Timur/Safevî dönemi astronomi katkıları.`;
        const saveReq = mockReqRes("POST", {
            projectId: "proje-bilim",
            itemId: p2Item,
            criterionKey: cKey,
            content: textVal,
            clientVersion: 0
        }, {}, { authorization: `Bearer ${bilimToken}` });
        await tubitakRecordsHandler(saveReq.req, saveReq.res);
        assert.strictEqual(saveReq.getStatus(), 200);
        assert.strictEqual(saveReq.getData().ok, true);
    }

    const teacherGetP2 = mockReqRes("GET", {}, { projectId: "proje-bilim" }, { authorization: `Bearer ${teacherToken}` });
    await tubitakRecordsHandler(teacherGetP2.req, teacherGetP2.res);
    assert.strictEqual(teacherGetP2.getStatus(), 200);
    const p2Records = teacherGetP2.getData().records;
    p2CriteriaKeys.forEach((cKey, idx) => {
        const rKey = `${p2Item}__${cKey}`;
        assert.ok(p2Records[rKey], `Bilim kriteri ${cKey} kaydı bulunmalı`);
        assert.ok(p2Records[rKey].content.includes(`Kriter #${idx + 1}`), `Bilim kriteri ${cKey} içeriği doğru olmalı`);
    });
    console.log("   ✅ Başarılı! Proje 2'de 13 kriterin tamamı otomatik kaydedildi ve öğretmen panelinde eksiksiz doğrulandı.\n");

    // -------------------------------------------------------------
    // TEST C: PROJE 3 (SİYER 571–632) – BİRDEN FAZLA OLAY VE ALAN İZOLASYONU
    // -------------------------------------------------------------
    console.log("📌 TEST C: Proje 3 (Aynı Yıl İçin Birden Fazla Olay, Olay/Kök Değer/Kaynakça Alan İzolasyonu)...");
    const p3Year = "siyer-571";
    // 1. Olay (Varsayılan Olay)
    const ev1Save = mockReqRes("POST", {
        projectId: "proje-siyer",
        itemId: p3Year,
        criterionKey: "c1_olay",
        content: "571 Yılı: Fil Vakası meydana geldi ve Peygamber Efendimiz (s.a.v.) Rebîülevvel ayında Mekke'de dünyaya teşrif etti."
    }, {}, { authorization: `Bearer ${siyerToken}` });
    await tubitakRecordsHandler(ev1Save.req, ev1Save.res);
    assert.strictEqual(ev1Save.getStatus(), 200);

    const ev1ValSave = mockReqRes("POST", {
        projectId: "proje-siyer",
        itemId: p3Year,
        criterionKey: "c2_kok_deger",
        content: "Merhamet, Adalet ve Tevhid inancının doğuşu."
    }, {}, { authorization: `Bearer ${siyerToken}` });
    await tubitakRecordsHandler(ev1ValSave.req, ev1ValSave.res);
    assert.strictEqual(ev1ValSave.getStatus(), 200);

    // 2. Olay Ekle
    const addEvReq = mockReqRes("PUT", {
        action: "add_siyer_event",
        yearId: p3Year
    }, {}, { authorization: `Bearer ${siyerToken}` });
    await tubitakRecordsHandler(addEvReq.req, addEvReq.res);
    assert.strictEqual(addEvReq.getStatus(), 200);
    const newEvId = addEvReq.getData().eventId;
    assert.ok(newEvId.startsWith("siyer-571__ev_"), "Yeni olay ID siyer-571__ev_ öneki taşımalı");

    // 2. Olayın alanlarını kaydet
    const ev2Save = mockReqRes("POST", {
        projectId: "proje-siyer",
        itemId: newEvId,
        criterionKey: "c1_olay",
        content: "571 Yılı 2. Olay: Hz. Âmine'nin rüyası ve Sütanne Halime'ye teslim edilişi."
    }, {}, { authorization: `Bearer ${siyerToken}` });
    await tubitakRecordsHandler(ev2Save.req, ev2Save.res);
    assert.strictEqual(ev2Save.getStatus(), 200);

    // Kontrol: 1. Olay ile 2. Olay birbirinin verisini ezdi mi?
    const teacherGetP3 = mockReqRes("GET", {}, { projectId: "proje-siyer" }, { authorization: `Bearer ${teacherToken}` });
    await tubitakRecordsHandler(teacherGetP3.req, teacherGetP3.res);
    const p3Records = teacherGetP3.getData().records;

    assert.ok(p3Records[`${p3Year}__c1_olay`].content.includes("Fil Vakası"), "1. Olay korunmalı");
    assert.ok(p3Records[`${p3Year}__c2_kok_deger`].content.includes("Merhamet"), "1. Olay kök değer korunmalı");
    assert.ok(p3Records[`${newEvId}__c1_olay`].content.includes("Sütanne Halime"), "2. Olay bağımsız kaydedilmeli");
    console.log("   ✅ Başarılı! Proje 3'te aynı yıldaki farklı olaylar birbirini ezmeden bağımsız kaydedildi.\n");

    // -------------------------------------------------------------
    // TEST D: İNTERNET KESİNTİSİ & ÇEVRİMDIŞI KUYRUK SENKRONİZASYONU
    // -------------------------------------------------------------
    console.log("📌 TEST D: İnternet Kesintisi Simülasyonu ve Yeniden Bağlantıda Taslak Eşitleme...");
    // Çevrimdışı kuyruk simülasyonu (İstemci localStorage mantığı)
    const mockOfflineQueue = [
        {
            projectId: "proje-tarih",
            itemId: "cifte-minareli-medrese",
            criterionKey: "c18_degerlendirme",
            content: "Çevrimdışı modda girilen saha inceleme değerlendirmesi (İnternet kesintisi testi).",
            clientVersion: 1,
            studentName: "Busenur Esila ÖZDEMİR",
            studentId: "stu-tari-101"
        }
    ];

    // Bağlantı yeniden kurulduğunda kuyruktaki öğeleri sunucuya gönder
    for (const item of mockOfflineQueue) {
        const replayReq = mockReqRes("POST", item, {}, { authorization: `Bearer ${tarihToken}` });
        await tubitakRecordsHandler(replayReq.req, replayReq.res);
        assert.strictEqual(replayReq.getStatus(), 200);
        assert.strictEqual(replayReq.getData().ok, true);
        assert.strictEqual(replayReq.getData().status, "saved");
    }

    // Doğrulama: Öğretmen panelinde çevrimdışı gönderilen veri var mı?
    const verifyOffline = mockReqRes("GET", {}, { projectId: "proje-tarih" }, { authorization: `Bearer ${teacherToken}` });
    await tubitakRecordsHandler(verifyOffline.req, verifyOffline.res);
    const offlineRec = verifyOffline.getData().records["cifte-minareli-medrese__c18_degerlendirme"];
    assert.ok(offlineRec && offlineRec.content.includes("Çevrimdışı modda girilen"), "Çevrimdışı taslak buluta işlenmeli");
    console.log("   ✅ Başarılı! İnternet kesintisi simülasyonunda bekleyen taslaklar yeniden bağlantıda başarıyla eşitlendi.\n");

    // -------------------------------------------------------------
    // TEST E: EŞ ZAMANLI KULLANIM (CONCURRENT WRITES SAFE MERGE)
    // -------------------------------------------------------------
    console.log("📌 TEST E: Eş Zamanlı Farklı Öğrenci Kayıtları (Safe Cloud Merge)...");
    const saveStu1 = mockReqRes("POST", {
        projectId: "proje-tarih",
        itemId: "divrigi-ulu-camii-darussifasi",
        criterionKey: "c7_plan_tipi",
        content: "Öğrenci 1: Eşzamanlı kaydedilen plan tipi analizi."
    }, {}, { authorization: `Bearer ${tarihToken}` });

    const saveStu2 = mockReqRes("POST", {
        projectId: "proje-bilim",
        itemId: "bilim-01-bircendi",
        criterionKey: "c4_uzmanlik_alanlari",
        content: "Öğrenci 2: Eşzamanlı kaydedilen uzmanlık alanları araştırması."
    }, {}, { authorization: `Bearer ${bilimToken}` });

    await Promise.all([
        tubitakRecordsHandler(saveStu1.req, saveStu1.res),
        tubitakRecordsHandler(saveStu2.req, saveStu2.res)
    ]);

    assert.strictEqual(saveStu1.getStatus(), 200);
    assert.strictEqual(saveStu2.getStatus(), 200);

    const checkBoth = mockReqRes("GET", {}, { projectId: "all" }, { authorization: `Bearer ${teacherToken}` });
    await tubitakRecordsHandler(checkBoth.req, checkBoth.res);
    const allRecs = checkBoth.getData().records;
    assert.ok(allRecs["divrigi-ulu-camii-darussifasi__c7_plan_tipi"], "Öğrenci 1 kaydı korunmalı");
    assert.ok(allRecs["bilim-01-bircendi__c4_uzmanlik_alanlari"], "Öğrenci 2 kaydı korunmalı");
    console.log("   ✅ Başarılı! Farklı öğrencilerin eşzamanlı kayıtları çakışmasız ve kayıpsız birleştirildi.\n");

    // -------------------------------------------------------------
    // TEST F: ÖĞRETMEN DOĞRULAMASI (BYTE-FOR-BYTE METİN BİREBİRLİĞİ)
    // -------------------------------------------------------------
    console.log("📌 TEST F: Öğretmen Paneli Birebir Metin ve Sağlık Durumu Doğrulaması...");
    const longAcademicText = `Mengücek Beyliği döneminde Ahmet Şah ve Melike Turan Melek tarafından 1228-1229 yıllarında yaptırılan Divriği Ulu Camii ve Darüşşifası, mimari özellikleri ve taş işçiliği bakımından Anadolu Selçuklu sanatının şaheseridir.

Yapının taç kapılarında yer alan üç boyutlu asimetrik ve eşsiz bezemeler, ışık-gölge oyunlarıyla günün farklı saatlerinde namaz kılan insan silüeti oluşturmaktadır.

Kaynaklar:
1. Necdet Sakaoğlu, Divriği Tarihi, 1999.
2. Doğan Kuban, Divriği Mucizesi, YKY, 2001.`;

    const sendLong = mockReqRes("POST", {
        projectId: "proje-tarih",
        itemId: "divrigi-ulu-camii-darussifasi",
        criterionKey: "c8_susleme_sanat",
        content: longAcademicText
    }, {}, { authorization: `Bearer ${tarihToken}` });
    await tubitakRecordsHandler(sendLong.req, sendLong.res);
    assert.strictEqual(sendLong.getStatus(), 200);

    const teacherInspect = mockReqRes("GET", {}, { projectId: "proje-tarih" }, { authorization: `Bearer ${teacherToken}` });
    await tubitakRecordsHandler(teacherInspect.req, teacherInspect.res);
    const recTeacher = teacherInspect.getData().records["divrigi-ulu-camii-darussifasi__c8_susleme_sanat"];

    assert.strictEqual(recTeacher.content, longAcademicText, "Öğretmen panelindeki metin öğrencinin girdiği metinle karakteri karakterine birebir aynı olmalı");
    assert.ok(teacherInspect.getData().syncHealth, "syncHealth durumu öğretmen paneline iletilmeli");
    assert.strictEqual(teacherInspect.getData().syncHealth.isHealthy, true, "Bulut senkronizasyonu sağlıklı olmalı");

    console.log("   ✅ Başarılı! Öğretmen ekranındaki araştırma verisi öğrencinin yazdığı akademik metinle %100 birebir eşleşti.\n");

    console.log("🎉 TEST A'DAN F'YE TÜM UÇTAN UCA TESTLER EKSİKSİZ GEÇTİ (6/6 SUITE PASSED)!");
}

runE2ETests().catch(err => {
    console.error("❌ E2E TEST BAŞARISIZ:", err);
    process.exit(1);
});
