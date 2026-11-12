const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const path = require("path");

const { runPreDeployGuard, resolveRepoDirs } = require("../scripts/pre_deploy_guard.js");

const { rootDir, webDir } = resolveRepoDirs();
const baseline = JSON.parse(fs.readFileSync(path.join(rootDir, "data", "protected-baseline.json"), "utf8"));
const rootMaterials = JSON.parse(fs.readFileSync(path.join(rootDir, "data", "materials.json"), "utf8"));
const webMaterials = JSON.parse(fs.readFileSync(path.join(webDir, "data", "materials.json"), "utf8"));
const syncHandler = require(path.join(rootDir, "api", "sync.js"));

test("Root ve Web Sitem materials.json aynaları eşit ve geçerli olmalı", () => {
  assert.ok(Array.isArray(rootMaterials));
  assert.ok(Array.isArray(webMaterials));
  assert.equal(rootMaterials.length, webMaterials.length);
  assert.ok(rootMaterials.length >= baseline.minimumMaterialsCount);
  assert.deepEqual(rootMaterials, webMaterials);

  const ids = rootMaterials.map((m) => m.id);
  assert.equal(new Set(ids).size, ids.length, "Materyal kimlikleri benzersiz olmalı");
});

test("Grup A (kazara silinen) dinamometre ve 7. sınıf uzay oyunu geri getirilmiş ve dosyaları mevcut olmalı", () => {
  const byId = new Map(rootMaterials.map((m) => [m.id, m]));
  for (const id of baseline.groupARestoredIds) {
    assert.ok(byId.has(id), `Grup A içerik eksik: ${id}`);
    assert.ok(syncHandler.PROTECTED_IDS.has(id), `${id} api/sync.js PROTECTED_IDS içinde olmalı`);
  }

  const requiredAssets = [
    "oyunlar/dinamometre-laboratuvari.html",
    "oyunlar/uzay-ekspresi-7.html",
    "Eğitsel Oyun/dinamometre-laboratuvari.html",
    "Eğitsel Oyun/uzay-ekspresi-7.html",
    "assets/dinamometre-laboratuvari-kapak.svg",
    "assets/rotali-uzay-ekspresi.jpg"
  ];
  for (const rel of requiredAssets) {
    assert.ok(fs.existsSync(path.join(rootDir, rel)), `Kök dizinde eksik: ${rel}`);
    assert.ok(fs.existsSync(path.join(webDir, rel)), `Web Sitem aynasında eksik: ${rel}`);
  }
});

test("Grup B (kullanıcı sildiği) ve Grup C (belirsiz) kayıtlar geri yüklenmemiş olmalı", () => {
  const idSet = new Set(rootMaterials.map((m) => m.id));
  for (const bId of baseline.groupBUserDeletedIds) {
    assert.equal(idSet.has(bId), false, `Grup B silinmiş kayıt diriltilmemeli: ${bId}`);
  }
  for (const cId of baseline.groupCAmbiguousIds) {
    assert.equal(idSet.has(cId), false, `Grup C belirsiz kayıt otomatik yüklenmemeli: ${cId}`);
  }
});

test("api/sync mergeMaterialsSafely eski tarayıcı replace:true isteğinde sunucu verisini korur", () => {
  const staleClientSubset = rootMaterials.slice(0, 50);
  const res = syncHandler.mergeMaterialsSafely({
    repoMats: rootMaterials,
    existingMaterials: rootMaterials,
    incomingMaterials: staleClientSubset,
    allDeletedSet: new Set(),
    isReplace: true,
    confirmBulkDelete: false
  });

  assert.equal(res.conflict, false);
  assert.ok(
    res.materials.length >= rootMaterials.length,
    "Stale replace:true mevcut sunucu/repo kayıtlarını düşürmemeli"
  );
  const resultIds = new Set(res.materials.map((m) => m.id));
  for (const reqId of baseline.requiredIds) {
    assert.ok(resultIds.has(reqId), `mergeMaterialsSafely sonrası korumalı ID kayboldu: ${reqId}`);
  }
});

test("api/sync POST bulk silme koruma kilidi onay olmadan 5+ silmeyi HTTP 409 ile engeller", async () => {
  const mockReq = {
    method: "POST",
    body: {
      action: "delete",
      deleteIds: ["id-1", "id-2", "id-3", "id-4", "id-5", "id-6"]
    }
  };
  let statusCode = 0;
  let jsonBody = null;
  const mockRes = {
    setHeader() {},
    status(code) {
      statusCode = code;
      return this;
    },
    json(data) {
      jsonBody = data;
      return data;
    },
    end() {
      return this;
    }
  };

  await syncHandler(mockReq, mockRes);
  assert.equal(statusCode, 409);
  assert.ok(jsonBody && jsonBody.error);
});

test("js/app.js pasif bulut senkronizasyonu uploadToCloud replace:true çağırmaz ve korumalı seti zehirlemez", () => {
  const appJs = fs.readFileSync(path.join(webDir, "js", "app.js"), "utf8");
  const rootAppJs = fs.readFileSync(path.join(rootDir, "js", "app.js"), "utf8");
  assert.equal(appJs, rootAppJs, "Root ve Web Sitem js/app.js birebir eşit olmalı");

  const replaceTrueMatches = appJs.match(/uploadToCloud\([^)]*,\s*true\s*\)/g) || [];
  assert.equal(replaceTrueMatches.length, 0, "İstemcide uploadToCloud(..., true) çağrısı kalmamalı");
  assert.ok(appJs.includes("{ fromCloud: true }"), "Pasif bulut silme senkronu fromCloud: true kullanmalı");
});

test("Tüm çekirdek modüller ve navigasyon rotaları korunmuş olmalı", () => {
  const indexHtml = fs.readFileSync(path.join(rootDir, "index.html"), "utf8");
  const yaprakHtml = fs.readFileSync(path.join(rootDir, "yaprak-test.html"), "utf8");
  const appJs = fs.readFileSync(path.join(rootDir, "js", "app.js"), "utf8");

  for (const anchor of [
    "#grade/grade-5/ders-notu",
    "#grade/grade-6/ders-notu",
    "#grade/grade-7/ders-notu",
    "#grade/grade-8/ders-notu",
    "#tubitak"
  ]) {
    assert.ok(indexHtml.includes(anchor), `index.html rotası eksik: ${anchor}`);
  }

  for (const label of ["Çoktan Seçmeli", "Kısa Cevaplı", "Açık Uçlu", "13 etkinlik türünden"]) {
    assert.ok(yaprakHtml.includes(label), `yaprak-test.html modül bileşeni eksik: ${label}`);
  }

  for (const appFeature of [
    "oyunlar/dinamometre-laboratuvari.html",
    "oyunlar/uzay-ekspresi-7.html",
    "ders-notu",
    "etkinlikler",
    "denemeler",
    "videolar",
    "egitsel-oyunlar"
  ]) {
    assert.ok(appJs.includes(appFeature), `js/app.js çekirdek özelliği eksik: ${appFeature}`);
  }
});

test("Pre-Deploy Guard kontrolü hatasız geçmeli ve Vercel fonksiyon limiti <= 12 olmalı", () => {
  const result = runPreDeployGuard({ writeBackup: false });
  assert.equal(result.ok, true, `Guard hataları: ${result.errors.join("; ")}`);
  assert.ok(result.activeApiFunctionsCount <= 12);
});

test("5.2, 6.2, 7.1 (ROTALI FENCİ – UZAY ÇAĞI) ve 7.2 simülasyonları eksiksiz, dokunmatik uyumlu ve bağımsız olmalı", () => {
  const byId = new Map(rootMaterials.map((m) => [m.id, m]));
  const g7Mat = byId.get("mat-7-oyun-uzay-ekspresi");
  assert.ok(g7Mat, "mat-7-oyun-uzay-ekspresi kayıtlı olmalı");
  assert.equal(g7Mat.title, "ROTALI FENCİ – UZAY ÇAĞI");
  assert.equal(g7Mat.unit, "1. Ünite: Uzay Çağı");
  assert.equal(g7Mat.grade, "7");

  const dinoMat = byId.get("mat-5-2-sim-dinamometre-laboratuvari");
  assert.ok(dinoMat && dinoMat.imageUrl, "5.2 dinamometre kaydı ve kapak görseli mevcut olmalı");
  assert.equal(dinoMat.targetSection, "2");

  const u7Html = fs.readFileSync(path.join(webDir, "oyunlar", "uzay-ekspresi-7.html"), "utf8");
  assert.ok(u7Html.includes("ROTALI FENCİ – UZAY ÇAĞI"), "7. sınıf oyunu yeni adıyla açılmalı");
  assert.equal(/uzay ekspresi|6\.\s*sınıf|rotali_express_best_score/i.test(u7Html), false, "7. sınıf oyununda 6. sınıf/Uzay Ekspresi kalıntısı olmamalı");
  assert.ok(u7Html.includes("rotali_uzay_cagi_7_best_score"), "7. sınıf oyunu bağımsız localStorage anahtarı kullanmalı");
  const q7Json = JSON.parse(fs.readFileSync(path.join(webDir, "data", "sorular_7_1_uzay.json"), "utf8"));
  assert.equal(q7Json.length, 140);
  assert.ok(u7Html.includes("Evren > Uzay > Dünya"), "7. sınıf oyunu 140 özgün 7. sınıf sorusunu içermeli");

  const dinoHtml = fs.readFileSync(path.join(webDir, "oyunlar", "dinamometre-laboratuvari.html"), "utf8");
  assert.ok(dinoHtml.includes("touchstart") && dinoHtml.includes("requestFullscreen"), "Dinamometre dokunmatik ve tam ekran desteklemeli");

  const kuvvetHtml = fs.readFileSync(path.join(webDir, "oyunlar", "kuvvet-laboratuvari.html"), "utf8");
  assert.ok(kuvvetHtml.includes("touch") && kuvvetHtml.includes("requestFullscreen"), "Kuvvet simülasyonu dokunmatik ve tam ekran desteklemeli");

  const isHtml = fs.readFileSync(path.join(webDir, "oyunlar", "is-laboratuvari.html"), "utf8");
  assert.ok(isHtml.includes("slider-force") && isHtml.includes("slider-distance") && isHtml.includes("touchstart") && isHtml.includes("requestFullscreen"), "İş simülasyonu F, Δx, W=F·Δx, dokunmatik ve tam ekran desteklemeli");

  const appJs = fs.readFileSync(path.join(webDir, "js", "app.js"), "utf8");
  assert.ok(appJs.includes('id: "mat-5-2-sim-dinamometre-laboratuvari"'), "builtinUnitGamesMap 5.2 Dinamometre içermeli");
  assert.ok(appJs.includes("isPhysicsUnit2Sim"), "2. Ünite simülasyonları lab sekmesine sapmamalı");
  assert.ok(appJs.includes('normSubTab === "egitsel-oyunlar" ? "all" : "1"') || appJs.includes('tabName === "egitsel-oyunlar") ? "all" : "1"'), "Eğitsel Oyunlar varsayılan görünümü 2. üniteyi de göstermeli");

  const tubitakJs = fs.readFileSync(path.join(webDir, "js", "tubitak-research.js"), "utf8");
  for (const label of ["1. PROJE EKİBİ", "2. PROJE EKİBİ", "3. PROJE EKİBİ"]) {
    assert.ok(tubitakJs.includes(label), `TÜBİTAK giriş kartı eksik: ${label}`);
  }
  assert.equal(/Sivas Kültür Atlası|Türk-İslam Bilginleri|571–632 Zaman Çizgisi/.test(tubitakJs), false, "TÜBİTAK giriş kartlarında proje adı/alt başlık olmamalı");
  assert.ok(tubitakJs.includes("<span>Eserler</span>"), "TÜBİTAK Proje 1 yan panelinde Eserler başlığı olmalı");

  const seedJson = JSON.parse(fs.readFileSync(path.join(webDir, "data", "tubitak-seed-data.json"), "utf8"));
  const p1Items = seedJson.projects["proje-tarih"].items;
  assert.equal(p1Items.length, 40, "TÜBİTAK Proje 1 listesinde tam 40 eser bulunmalı");
  assert.equal(p1Items[0].title, "Divriği Ulu Camii ve Darüşşifası");
  assert.equal(p1Items[1].title, "Çifte Minareli Medrese");
  assert.equal(p1Items[39].title, "Halil Rıfat Paşa Köprüsü");

  const p1Criteria = seedJson.projects["proje-tarih"].criteriaList;
  assert.equal(p1Criteria.length, 18, "TÜBİTAK Proje 1 kriter listesinde tam 18 kriter bulunmalı");
  assert.equal(p1Criteria[0].title, "1. Tarihi Yapının Adı");
  assert.equal(p1Criteria[17].title, "18. KAYNAK");
  assert.ok(tubitakJs.includes("resize-y") && tubitakJs.includes("autoGrowTextarea") && tubitakJs.includes("Kelime sınırı yok"));

  const tubitakRecJs = fs.readFileSync(path.join(webDir, "api", "tubitak-records.js"), "utf8");
  assert.equal(tubitakRecJs.includes(".substring(0, 5000)"), false, "Kayıt revizyonlarında karakter kesmesi olmamalı");
  assert.ok(tubitakJs.includes("VERİ ANALİZİ") && tubitakJs.includes("buildSvgDonutChart") && tubitakJs.includes("renderDataAnalysisSection"), "TÜBİTAK Veri Analizi bölümü, grafik ve tablolar mevcut olmalı");

  // Proje 1 öğrenci bazlı görev dağılımı (14 + 13 + 13 = 40)
  const team = seedJson.projects["proje-tarih"].studentTeam;
  assert.equal(team.length, 3, "Proje 1 ekibi 3 öğrenciden oluşmalı");
  assert.deepEqual(team.map(s => s.name), ["Busenur Esila ÖZDEMİR", "Hazel Mina ŞİMŞEK", "Zeynep Ecrin ELİŞ"]);
  assert.equal(p1Items.filter(it => it.assignedStudentId === "stu-busenur").length, 14);
  assert.equal(p1Items.filter(it => it.assignedStudentId === "stu-hazel").length, 13);
  assert.equal(p1Items.filter(it => it.assignedStudentId === "stu-zeynep").length, 13);
  assert.equal(p1Items[0].orderIndex, 1);
  assert.equal(p1Items[13].orderIndex, 14);
  assert.equal(p1Items[13].assignedStudentId, "stu-busenur");
  assert.equal(p1Items[14].orderIndex, 15);
  assert.equal(p1Items[14].assignedStudentId, "stu-hazel");
  assert.equal(p1Items[26].orderIndex, 27);
  assert.equal(p1Items[26].assignedStudentId, "stu-hazel");
  assert.equal(p1Items[27].orderIndex, 28);
  assert.equal(p1Items[27].assignedStudentId, "stu-zeynep");
  assert.equal(p1Items[39].orderIndex, 40);
  assert.equal(p1Items[39].assignedStudentId, "stu-zeynep");
  assert.ok(tubitakJs.includes("ARAŞTIRMA EKİBİ – ÖĞRENCİ SEÇİMİ") && tubitakJs.includes("reassignStudentWork"));
  assert.ok(tubitakJs.includes("Word Olarak İndir") && tubitakJs.includes("Tüm Eserleri Word Olarak İndir"));
  assert.ok(tubitakJs.includes("downloadMonumentWord") && tubitakJs.includes("downloadAllProje1Word"));
  assert.ok(tubitakRecJs.includes("reassign_item") && tubitakRecJs.includes("exportDocx"));
  assert.ok(fs.existsSync(path.join(webDir, "api", "_tubitak-docx.js")), "_tubitak-docx.js yardımcı modülü mevcut olmalı");
});
