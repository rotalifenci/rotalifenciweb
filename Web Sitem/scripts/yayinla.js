#!/usr/bin/env node
/**
 * Rotalı Fenci — Yayınla (deploy) betiği
 *
 * NEDEN VAR?
 *   Git deposunun kökü "Antgravity Rotalı Fenci" klasörüdür ve Vercel
 *   (rotali-fenci projesi) siteyi DEPO KÖKÜNDEN yayınlar. Geliştirme ise
 *   "Web Sitem" klasöründe yapılıyor. Bu betik çalıştırılmazsa değişiklikler
 *   GitHub'a gider ama canlı siteye ASLA yansımaz.
 *
 * NE YAPAR?
 *   1. Yeni bir sürüm numarası üretir (YYYYMMDD_HHmm).
 *   2. index.html içindeki yerel css/js ?v= parametrelerini ve
 *      window.ROTALI_BUILD değerini günceller, version.json yazar.
 *      → Tüm tarayıcılar (Pardus/Firefox dahil) yeni dosyaları indirir.
 *   3. Web Sitem içeriğini depo köküne kopyalar.
 *   4. Mesaj verilirse git add + commit + push yapar.
 *
 * KULLANIM (Web Sitem klasöründe):
 *   node scripts/yayinla.js                      → sadece sürüm + kopyalama
 *   node scripts/yayinla.js "fix: açıklama"      → + commit + push
 */
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const SITE = path.resolve(__dirname, "..");
const ROOT = path.resolve(SITE, "..");
const SYNC = ["index.html", "version.json", "vercel.json", "manifest.json", "js", "css", "oyunlar", "assets", "data", "api"];

const pad = (n) => String(n).padStart(2, "0");
const d = new Date();
const VERSION = `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}_${pad(d.getHours())}${pad(d.getMinutes())}`;

// 1-2. Sürüm damgası
const indexPath = path.join(SITE, "index.html");
let html = fs.readFileSync(indexPath, "utf8");
html = html
    .replace(/((?:css|js)\/[\w.-]+\.(?:css|js))\?v=[\w.-]+/g, `$1?v=${VERSION}`)
    .replace(/window\.ROTALI_BUILD\s*=\s*"[^"]*"/, `window.ROTALI_BUILD = "${VERSION}"`);
fs.writeFileSync(indexPath, html, "utf8");
fs.writeFileSync(path.join(SITE, "version.json"), JSON.stringify({ v: VERSION }) + "\n", "utf8");
console.log(`✔ Sürüm: ${VERSION}`);

// 3. Depo köküne kopyala (kökteki fazladan dosyalar silinmez)
for (const item of SYNC) {
    const src = path.join(SITE, item);
    if (!fs.existsSync(src)) continue;
    fs.cpSync(src, path.join(ROOT, item), { recursive: true, force: true });
    console.log(`✔ Kopyalandı: ${item}`);
}

// 4. İsteğe bağlı commit + push
const message = process.argv.slice(2).join(" ").trim();
if (message) {
    const git = (...args) => execFileSync("git", args, { cwd: ROOT, stdio: "inherit" });
    git("add", "-A");
    git("commit", "-m", `${message} [v${VERSION}]`);
    git("push", "origin", "main");
    console.log("🚀 GitHub'a gönderildi. Vercel 1-2 dk içinde yayınlar.");
} else {
    console.log('ℹ Commit için: node scripts/yayinla.js "mesaj"');
}
