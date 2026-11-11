const fs = require("fs");
const path = require("path");

/** Resolve repo root and Web Sitem directory regardless of which mirror executes this guard. */
function resolveRepoDirs() {
  const base = path.resolve(__dirname, "..");
  const isWebSitem = path.basename(base) === "Web Sitem";
  const rootDir = isWebSitem ? path.resolve(base, "..") : base;
  const webDir = isWebSitem ? base : path.join(base, "Web Sitem");
  return { rootDir, webDir };
}

/** Run structural, mirror-parity, Vercel limit, and content-loss guard checks. */
function runPreDeployGuard(options = {}) {
  const { rootDir, webDir } = resolveRepoDirs();
  const baselinePath = path.join(rootDir, "data", "protected-baseline.json");
  const baseline = JSON.parse(fs.readFileSync(baselinePath, "utf8"));
  const rootMats = JSON.parse(fs.readFileSync(path.join(rootDir, "data", "materials.json"), "utf8"));
  const wsMats = JSON.parse(fs.readFileSync(path.join(webDir, "data", "materials.json"), "utf8"));
  const syncApi = require(path.join(rootDir, "api", "sync.js"));

  const errors = [];
  const allowDelete = process.env.ROTALI_ALLOW_DELETE === "1" || options.allowDelete === true;

  if (!Array.isArray(rootMats) || !Array.isArray(wsMats)) {
    errors.push("materials.json bir dizi (Array) olmalı.");
  }

  // 1. Content count & duplicate ID checks
  const rootIds = new Set();
  for (const item of rootMats) {
    if (!item || !item.id) {
      errors.push("id alanı olmayan materyal kaydı tespit edildi.");
      continue;
    }
    if (rootIds.has(item.id)) {
      errors.push(`Çift (duplicate) materyal kimliği: ${item.id}`);
    }
    rootIds.add(item.id);
  }

  if (!allowDelete && rootMats.length < baseline.minimumMaterialsCount) {
    errors.push(
      `İçerik sayısı düşüşü tespit edildi (${rootMats.length} < ${baseline.minimumMaterialsCount}). Kasıtlı silme yoksa devam edilemez.`
    );
  }

  // 2. Protected required IDs check
  for (const reqId of baseline.requiredIds) {
    if (!allowDelete && !rootIds.has(reqId)) {
      errors.push(`Korumalı içerik eksik: ${reqId}`);
    }
  }

  // 3. Ensure PERMANENTLY_REMOVED_IDS & Group B/C are NOT accidentally resurrected
  for (const deadId of baseline.groupBUserDeletedIds) {
    if (rootIds.has(deadId)) {
      errors.push(`Kullanıcının sildiği (Grup B) kayıt geri sızdı: ${deadId}`);
    }
  }
  for (const ambId of baseline.groupCAmbiguousIds) {
    if (rootIds.has(ambId)) {
      errors.push(`Belirsiz (Grup C) kayıt kullanıcı onayı olmadan otomatik geri yüklendi: ${ambId}`);
    }
  }

  // 4. Root vs Web Sitem mirror parity check
  for (const rel of baseline.requiredMirroredFiles) {
    const rPath = path.join(rootDir, rel);
    const wPath = path.join(webDir, rel);
    if (!fs.existsSync(rPath)) {
      errors.push(`Kök dizinde eksik zorunlu dosya: ${rel}`);
      continue;
    }
    if (!fs.existsSync(wPath)) {
      errors.push(`Web Sitem aynasında eksik zorunlu dosya: ${rel}`);
      continue;
    }
    if (!fs.readFileSync(rPath).equals(fs.readFileSync(wPath))) {
      errors.push(`Kök ve Web Sitem arasında dosya uyuşmazlığı (drift): ${rel}`);
    }
  }

  // 5. Vercel Hobby Serverless Function budget (<= 12 non-underscore .js files in api/)
  const apiDir = path.join(rootDir, "api");
  const activeApiFunctions = fs
    .readdirSync(apiDir)
    .filter((f) => f.endsWith(".js") && !f.startsWith("_"));
  if (activeApiFunctions.length > 12) {
    errors.push(
      `Vercel Hobby 12 Serverless Function limiti aşıldı (${activeApiFunctions.length}/12): ${activeApiFunctions.join(", ")}`
    );
  }

  // 6. Verify sync.js protection exports & non-destructive behavior
  if (typeof syncApi.mergeMaterialsSafely !== "function") {
    errors.push("api/sync.js mergeMaterialsSafely koruma fonksiyonunu dışa aktarmıyor.");
  }

  // 7. Create real local rolling snapshot backup if writeBackup is enabled (default true in CLI)
  let backupDir = null;
  if (options.writeBackup !== false) {
    backupDir = path.join(rootDir, "backups", "pre-deploy-latest");
    fs.mkdirSync(backupDir, { recursive: true });
    fs.copyFileSync(path.join(rootDir, "data", "materials.json"), path.join(backupDir, "materials.json"));
    fs.copyFileSync(path.join(rootDir, "api", "sync.js"), path.join(backupDir, "sync.js"));
    fs.copyFileSync(path.join(rootDir, "index.html"), path.join(backupDir, "index.html"));
    fs.writeFileSync(
      path.join(backupDir, "manifest.json"),
      JSON.stringify(
        {
          createdAt: new Date().toISOString(),
          materialsCount: rootMats.length,
          activeApiFunctionsCount: activeApiFunctions.length,
          mirroredFilesChecked: baseline.requiredMirroredFiles.length
        },
        null,
        2
      ) + "\n",
      "utf8"
    );
  }

  return {
    ok: errors.length === 0,
    errors,
    materialsCount: rootMats.length,
    activeApiFunctionsCount: activeApiFunctions.length,
    mirroredFilesChecked: baseline.requiredMirroredFiles.length,
    backupDir
  };
}

if (require.main === module) {
  const noBackup = process.argv.includes("--no-backup");
  const result = runPreDeployGuard({ writeBackup: !noBackup });
  if (!result.ok) {
    console.error("❌ PRE-DEPLOY CONTENT GUARD FAILED:");
    for (const err of result.errors) console.error("  -", err);
    process.exit(1);
  }
  console.log(
    `✅ PRE-DEPLOY CONTENT GUARD PASSED: ${result.materialsCount} materials, ${result.mirroredFilesChecked} mirrored files synced, ${result.activeApiFunctionsCount}/12 Vercel functions.`
  );
  if (result.backupDir) {
    console.log(`💾 Backup snapshot updated: ${result.backupDir}`);
  }
}

module.exports = { runPreDeployGuard, resolveRepoDirs };
