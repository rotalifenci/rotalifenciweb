const fs = require('fs');
const path = require('path');

const appPath = path.resolve(__dirname, '../js/app.js');
let appJs = fs.readFileSync(appPath, 'utf8');

// 1. Add to DEFAULT_CUSTOM_MATERIALS
const targetMat5 = 'tags: ["güneş", "dünya", "ay", "evreler", "3d uzay", "simülatör", "5. sınıf"],\n        downloadCount: "🌟 1. Ünite Başyapıtı"\n    }';
const newMat6 = `tags: ["güneş", "dünya", "ay", "evreler", "3d uzay", "simülatör", "5. sınıf"],
        downloadCount: "🌟 1. Ünite Başyapıtı"
    },
    {
        id: "mat-6-1-oyun-gunes-sistemi-yolculuk-3d",
        grade: "6",
        category: "egitsel-oyunlar",
        targetSection: "1",
        title: "Güneş Sisteminde Yolculuk – 3D Sinematik Animasyon",
        unit: "1. Ünite: Güneş Sistemi ve Tutulmalar",
        desc: "8 gezegen, gerçek boyut karşılaştırmaları, Dünya=1cm top ölçeği benzetimi ve sinematik kamera eşliğinde büyüleyici 3D Güneş Sistemi yolculuğu!",
        fileName: "gunes-sistemi-yolculuk-3d.html",
        fileUrl: "oyunlar/gunes-sistemi-yolculuk-3d.html",
        imageUrl: "assets/gunes-sistemi-yolculuk-3d-kapak.svg",
        kapakResmi: "assets/gunes-sistemi-yolculuk-3d-kapak.svg",
        format: "3D SİNEMATİK",
        hasBlob: false,
        tags: ["güneş sistemi", "gezegenler", "sinematik", "3d animasyon", "yolculuk", "6. sınıf"],
        downloadCount: "🎬 3D Özel Animasyon"
    }`;

if (appJs.includes(targetMat5)) {
    appJs = appJs.replace(targetMat5, newMat6);
    console.log('Added to DEFAULT_CUSTOM_MATERIALS');
} else {
    console.warn('targetMat5 not found');
}

// 2. Add to builtinCurriculumGames["6"]["1"]
const targetCurriculum6 = 'fileUrl: "oyunlar/gunes-sistemi-3d.html",\n                    kapakResmi: "assets/gunes-sistemi-3d-kapak.svg"\n                }';
const newCurriculum6 = `fileUrl: "oyunlar/gunes-sistemi-3d.html",
                    kapakResmi: "assets/gunes-sistemi-3d-kapak.svg"
                },
                {
                    id: "builtin-oyun-6-gunes-sistemi-yolculuk",
                    title: "Güneş Sisteminde Yolculuk – 3D Sinematik Animasyon",
                    icon: "fa-solid fa-film",
                    desc: "8 gezegen, gerçek boyut karşılaştırmaları, Dünya=1cm top ölçeği benzetimi ve sinematik kamera eşliğinde büyüleyici 3D Güneş Sistemi yolculuğu!",
                    type: "3D Sinematik Animasyon",
                    format: "3D SİNEMATİK",
                    badge: "🎬 3D Özel Animasyon",
                    fileUrl: "oyunlar/gunes-sistemi-yolculuk-3d.html",
                    kapakResmi: "assets/gunes-sistemi-yolculuk-3d-kapak.svg"
                }`;

if (appJs.includes(targetCurriculum6)) {
    appJs = appJs.replace(targetCurriculum6, newCurriculum6);
    console.log('Added to builtinCurriculumGames["6"]["1"]');
} else {
    console.warn('targetCurriculum6 not found');
}

// 3. Add to builtinUnitGamesMap["6"]
const targetUnitGamesMap6 = 'iconColor: "from-sky-400 via-indigo-600 to-amber-400",\n                fileUrl: "gunes-sistemi-3d"\n            }';
const newUnitGamesMap6 = `iconColor: "from-sky-400 via-indigo-600 to-amber-400",
                fileUrl: "gunes-sistemi-3d"
            },
            {
                id: "builtin-oyun-6-gunes-sistemi-yolculuk",
                title: "Güneş Sisteminde Yolculuk – 3D Sinematik Animasyon",
                badge: "3D Sinematik Animasyon",
                type: "3D Uzay Keşfi",
                desc: "8 gezegen, gerçek boyut karşılaştırmaları, Dünya=1cm top ölçeği benzetimi ve sinematik kamera eşliğinde büyüleyici 3D Güneş Sistemi yolculuğu!",
                icon: "fa-solid fa-film",
                iconColor: "from-amber-400 via-sky-500 to-indigo-600",
                fileUrl: "gunes-sistemi-yolculuk-3d"
            }`;

if (appJs.includes(targetUnitGamesMap6)) {
    appJs = appJs.replace(targetUnitGamesMap6, newUnitGamesMap6);
    console.log('Added to builtinUnitGamesMap["6"]');
} else {
    console.warn('targetUnitGamesMap6 not found');
}

// 4. Add routing in openEducationalGame
const targetOpenGame = '// 🪐 6. SINIF GÜNEŞ SİSTEMİ – 3D KEŞİF LABORATUVARI (3D DIGITAL PLANETARIUM)';
const newOpenGame = `// 🎬 6. SINIF GÜNEŞ SİSTEMİNDE YOLCULUK – 3D SİNEMATİK ANİMASYON
    if (checkTitle.includes("yolculuk") || id === "mat-6-1-oyun-gunes-sistemi-yolculuk-3d" || id === "builtin-oyun-6-gunes-sistemi-yolculuk" || id === "gunes-sistemi-yolculuk-3d" ||
        targetUrl.includes("gunes-sistemi-yolculuk") || targetUrl.includes("gunes_sistemi_yolculuk")) {
        openInteractiveGameModal("oyunlar/gunes-sistemi-yolculuk-3d.html", "Güneş Sisteminde Yolculuk – 3D Sinematik Animasyon");
        return;
    }

    // 🪐 6. SINIF GÜNEŞ SİSTEMİ – 3D KEŞİF LABORATUVARI (3D DIGITAL PLANETARIUM)`;

if (appJs.includes(targetOpenGame)) {
    appJs = appJs.replace(targetOpenGame, newOpenGame);
    console.log('Added routing to openEducationalGame');
} else {
    console.warn('targetOpenGame not found');
}

// 5. Add routing in openOfficeFileModal
const targetOfficeModal = '// 🪐 6. Sınıf Güneş Sistemi – 3D Keşif Laboratuvarı (Dijital Planetaryum)';
const newOfficeModal = `// 🎬 6. Sınıf Güneş Sisteminde Yolculuk – 3D Sinematik Animasyon
    if (str.includes("gunes-sistemi-yolculuk") || str.includes("gunes_sistemi_yolculuk") || titleStr.includes("yolculuk") || resolvedKey === "gunes-sistemi-yolculuk-3d" || resolvedKey === "mat-6-1-oyun-gunes-sistemi-yolculuk-3d" || resolvedKey === "builtin-oyun-6-gunes-sistemi-yolculuk") {
        modal.innerHTML = \`
            <div class="bg-slate-950 w-screen h-screen max-w-none max-h-none border-0 shadow-2xl overflow-hidden flex flex-col" style="height: 100dvh; height: 100svh;" onclick="event.stopPropagation()">
                <div class="px-3 py-1.5 bg-slate-900 border-b border-sky-500/40 flex items-center justify-between text-white shrink-0 min-h-[42px]" style="padding-top: max(6px, env(safe-area-inset-top)); padding-left: max(8px, env(safe-area-inset-left)); padding-right: max(8px, env(safe-area-inset-right));">
                    <div class="flex items-center gap-2">
                        <span class="w-6 h-6 rounded-lg bg-gradient-to-tr from-amber-400 via-sky-500 to-indigo-600 text-white flex items-center justify-center text-xs font-black shadow-sm">
                            <i class="fa-solid fa-film"></i>
                        </span>
                        <div class="flex items-center gap-2">
                            <h3 class="text-xs sm:text-sm font-black text-sky-300 font-orbitron">🎬 Güneş Sisteminde Yolculuk – 3D Sinematik Animasyon</h3>
                            <span class="text-[10px] text-slate-400 font-medium hidden md:inline">• 6. Sınıf Fen Bilimleri 1. Ünite</span>
                        </div>
                    </div>
                    <div class="flex items-center gap-1.5">
                        <a href="oyunlar/gunes-sistemi-yolculuk-3d.html" target="_blank" rel="noopener noreferrer" class="px-2.5 py-1 bg-slate-800 hover:bg-sky-500 hover:text-slate-950 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1 shadow-sm" title="Tam Ekran Yeni Sekmede Aç">
                            <i class="fa-solid fa-up-right-from-square text-[10px]"></i> <span class="hidden sm:inline">Yeni Sekme</span>
                        </a>
                        <button type="button" onclick="closeInteractiveGameModal()" class="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-black text-xs transition-all cursor-pointer shadow-sm flex items-center gap-1 active:scale-95" title="Kapat ve Çık">
                            <i class="fa-solid fa-xmark"></i>
                            <span>Kapat</span>
                        </button>
                    </div>
                </div>
                <div class="flex-1 w-full h-full bg-slate-950 relative overflow-hidden">
                    <iframe src="oyunlar/gunes-sistemi-yolculuk-3d.html" class="w-full h-full border-0 block" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; fullscreen" allowfullscreen></iframe>
                </div>
            </div>
        \`;
        modal.style.display = "flex";
        modal.classList.remove("hidden");
        return;
    }

    // 🪐 6. Sınıf Güneş Sistemi – 3D Keşif Laboratuvarı (Dijital Planetaryum)`;

if (appJs.includes(targetOfficeModal)) {
    appJs = appJs.replace(targetOfficeModal, newOfficeModal);
    console.log('Added routing to openOfficeFileModal');
} else {
    console.warn('targetOfficeModal not found');
}

fs.writeFileSync(appPath, appJs, 'utf8');
console.log('All integrations completed successfully in app.js');
