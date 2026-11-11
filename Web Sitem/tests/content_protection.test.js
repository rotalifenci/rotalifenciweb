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
