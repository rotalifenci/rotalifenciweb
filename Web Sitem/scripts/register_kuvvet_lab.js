const fs = require('fs');
const path = require('path');

// 1. Add to data/materials.json
const matPath = path.join(__dirname, '../data/materials.json');
let materials = JSON.parse(fs.readFileSync(matPath, 'utf8'));

const kuvvetMat = {
  id: "mat-6-2-sim-kuvvet-laboratuvari",
  grade: "6",
  category: "egitsel-oyunlar",
  targetSection: "1",
  title: "Kuvvet Laboratuvarı – Kuvvetleri Dengele, Hareketi Keşfet!",
  unit: "Kuvvet ve Hareket",
  desc: "Türkiye Yüzyılı Maarif Modeli uyumlu gerçek zamanlı 3D fizik simülasyonu! 5 etkileşimli deney, bileşke kuvvet hesaplama, halat çekme yarışması, dengeleyici kuvvet bulma oyunu ve 10 soruluk değerlendirme.",
  fileName: "kuvvet-laboratuvari.html",
  fileUrl: "oyunlar/kuvvet-laboratuvari.html",
  imageUrl: "assets/kuvvet-laboratuvari-kapak.svg",
  kapakResmi: "assets/kuvvet-laboratuvari-kapak.svg",
  cover: "assets/kuvvet-laboratuvari-kapak.svg",
  format: "3D SİMÜLASYON",
  hasBlob: false,
  tags: [
    "6. sınıf",
    "kuvvet",
    "hareket",
    "bileşke kuvvet",
    "dengelenmiş kuvvetler",
    "halat çekme",
    "dengeleyici kuvvet",
    "3d laboratuvar",
    "maarif modeli"
  ],
  visibility: "public",
  downloadCount: "🌟 Yeni Maarif Başyapıtı",
  createdAt: "2026-10-21T00:00:00.000Z",
  updatedAt: "2026-10-21T00:00:00.000Z"
};

// Check if already in materials.json
const existingIdx = materials.findIndex(m => m.id === kuvvetMat.id);
if (existingIdx !== -1) {
  materials[existingIdx] = kuvvetMat;
} else {
  // Insert right after uzay ekspresi
  const expIdx = materials.findIndex(m => m.id === 'mat-6-oyun-uzay-ekspresi');
  if (expIdx !== -1) {
    materials.splice(expIdx + 1, 0, kuvvetMat);
  } else {
    materials.unshift(kuvvetMat);
  }
}

fs.writeFileSync(matPath, JSON.stringify(materials, null, 2), 'utf8');
console.log('✔ Registered mat-6-2-sim-kuvvet-laboratuvari in data/materials.json');

// 2. Add routing in js/app.js
const appPath = path.join(__dirname, '../js/app.js');
let app = fs.readFileSync(appPath, 'utf8');

// Route in openOrDownloadMaterial
const routeSnippet = `    // ⚡ 6. SINIF KUVVET LABORATUVARI – KUVVETLERİ DENGELE, HAREKETİ KEŞFET!
    if (
        id === "mat-6-2-sim-kuvvet-laboratuvari" ||
        id === "kuvvet-laboratuvari" ||
        targetUrl.includes("kuvvet-laboratuvari") ||
        checkTitle.includes("kuvvet laboratuvarı") ||
        checkTitle.includes("kuvvet laboratuvari")
    ) {
        openInteractiveGameModal("oyunlar/kuvvet-laboratuvari.html", "Kuvvet Laboratuvarı – Kuvvetleri Dengele, Hareketi Keşfet!");
        return;
    }

`;

const markerSearch = '// 🚂 6. SINIF UZAY EKSPRESİ: GÜNEŞ SİSTEMİ KEŞFİ';
if (app.includes(markerSearch) && !app.includes('// ⚡ 6. SINIF KUVVET LABORATUVARI')) {
  app = app.replace(markerSearch, routeSnippet + '    ' + markerSearch);
  console.log('✔ Added Kuvvet Laboratuvarı route to openOrDownloadMaterial');
}

// Modal handler in openInteractiveGameModal
const modalHandler = `    // ⚡ 6. Sınıf Kuvvet Laboratuvarı – Kuvvetleri Dengele, Hareketi Keşfet!
    if (str.includes("kuvvet-laboratuvari") || str.includes("kuvvet laboratuvarı") || str.includes("kuvvet laboratuvari") || titleStr.includes("kuvvet laboratuvarı") || titleStr.includes("kuvvet laboratuvari") || resolvedKey === "mat-6-2-sim-kuvvet-laboratuvari" || resolvedKey === "kuvvet-laboratuvari") {
        modal.innerHTML = \`
            <div class="bg-slate-950 w-screen h-screen max-w-none max-h-none border-0 shadow-2xl overflow-hidden flex flex-col" style="height: 100dvh; height: 100svh;" onclick="event.stopPropagation()">
                <div class="px-3 py-1.5 bg-slate-900 border-b border-cyan-500/40 flex items-center justify-between text-white shrink-0 min-h-[42px]" style="padding-top: max(6px, env(safe-area-inset-top)); padding-left: max(8px, env(safe-area-inset-left)); padding-right: max(8px, env(safe-area-inset-right));">
                    <div class="flex items-center gap-2">
                        <span class="w-6 h-6 rounded-lg bg-gradient-to-tr from-cyan-400 via-blue-600 to-indigo-600 text-white flex items-center justify-center text-xs font-black shadow-sm">
                            <i class="fa-solid fa-atom"></i>
                        </span>
                        <div class="flex items-center gap-2">
                            <h3 class="text-xs sm:text-sm font-black text-cyan-300">⚡ Kuvvet Laboratuvarı – Kuvvetleri Dengele, Hareketi Keşfet!</h3>
                            <span class="text-[10px] text-slate-400 font-medium hidden md:inline">• 6. Sınıf Fen Bilimleri • Maarif Modeli</span>
                        </div>
                    </div>
                    <div class="flex items-center gap-1.5">
                        <a href="oyunlar/kuvvet-laboratuvari.html" target="_blank" rel="noopener noreferrer" class="px-2.5 py-1 bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1 shadow-sm" title="Tam Ekran Yeni Sekmede Aç">
                            <i class="fa-solid fa-up-right-from-square text-[10px]"></i> <span class="hidden sm:inline">Yeni Sekme</span>
                        </a>
                        <button type="button" onclick="closeInteractiveGameModal()" class="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-black text-xs transition-all cursor-pointer shadow-sm flex items-center gap-1 active:scale-95" title="Kapat ve Çık">
                            <i class="fa-solid fa-xmark"></i>
                            <span>Kapat</span>
                        </button>
                    </div>
                </div>
                <div class="flex-1 w-full h-full bg-slate-950 relative overflow-hidden">
                    <iframe src="oyunlar/kuvvet-laboratuvari.html" class="w-full h-full border-0 block" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; fullscreen" allowfullscreen></iframe>
                </div>
            </div>
        \`;
        modal.style.display = "flex";
        modal.classList.remove("hidden");
        return;
    }

`;

const topMarker = 'const titleStr = String(gameTitle || "").toLowerCase();';
if (app.includes(topMarker) && !app.includes('// ⚡ 6. Sınıf Kuvvet Laboratuvarı')) {
  app = app.replace(topMarker, topMarker + '\n\n' + modalHandler);
  console.log('✔ Added Kuvvet Laboratuvarı modal handler to openInteractiveGameModal');
}

fs.writeFileSync(appPath, app, 'utf8');
console.log('✔ Updated js/app.js');
