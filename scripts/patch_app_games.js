const fs = require('fs');
const path = require('path');

function patchAppJs(filePath) {
    if (!fs.existsSync(filePath)) {
        console.log('File does not exist:', filePath);
        return;
    }
    let code = fs.readFileSync(filePath, 'utf8');

    // 1. PERMANENT_DELETED_MATERIAL_IDS: Remove 6th grade games
    code = code.replace(
        '"oyun-6-uzay-ekspresi", "mat-game-gezegen-kosusu", "mat-9d8d6d57-f170-4a06-8427-3cbbf267d759",',
        '"mat-9d8d6d57-f170-4a06-8427-3cbbf267d759",'
    );
    code = code.replace(
        '"mat-6-oyun-uzay-ekspresi", "oyun-uzay-ekspresi", "mat-4e34f261-c437-4ec5-98d2-776e49ffac4c",',
        '"mat-4e34f261-c437-4ec5-98d2-776e49ffac4c",'
    );

    // 2. getDeletedMaterialIds: purge restored IDs from localStorage rotali_deleted_materials
    const oldGetDeletedFn = `function getDeletedMaterialIds() {
    try {
        const stored = localStorage.getItem("rotali_deleted_materials");
        let list = stored ? JSON.parse(stored) : [];
        if (!Array.isArray(list)) list = [];
        const set = new Set(list.filter(id => typeof id === "string" && id.trim().length > 0));
        PERMANENT_DELETED_MATERIAL_IDS.forEach(hd => set.add(hd));
        return Array.from(set);
    } catch (e) {
        return PERMANENT_DELETED_MATERIAL_IDS;
    }
}`;

    const newGetDeletedFn = `function getDeletedMaterialIds() {
    try {
        const stored = localStorage.getItem("rotali_deleted_materials");
        let list = stored ? JSON.parse(stored) : [];
        if (!Array.isArray(list)) list = [];
        const restoredIds = new Set([
            "mat-game-gezegen-kosusu", "oyun-6-uzay-ekspresi", "mat-6-oyun-uzay-ekspresi", 
            "oyun-uzay-ekspresi", "mat-6-1-oyun-gunes-sistemi-3d", "mat-6-1-oyun-gunes-sistemi-yolculuk-3d", 
            "builtin-oyun-6-gunes-sistemi", "builtin-oyun-6-gunes-sistemi-yolculuk", 
            "builtin-oyun-6-gezegen-kosusu", "builtin-oyun-6-uzay-ekspresi"
        ]);
        let changed = false;
        list = list.filter(id => {
            if (restoredIds.has(id)) {
                changed = true;
                return false;
            }
            return true;
        });
        if (changed) {
            try { localStorage.setItem("rotali_deleted_materials", JSON.stringify(list)); } catch(e){}
        }
        const set = new Set(list.filter(id => typeof id === "string" && id.trim().length > 0));
        PERMANENT_DELETED_MATERIAL_IDS.forEach(hd => {
            if (!restoredIds.has(hd)) set.add(hd);
        });
        return Array.from(set);
    } catch (e) {
        return PERMANENT_DELETED_MATERIAL_IDS;
    }
}`;

    if (code.includes(oldGetDeletedFn)) {
        code = code.replace(oldGetDeletedFn, newGetDeletedFn);
    }

    // 3. Top Banner for Grade 6 in renderGradePage
    const oldGrade6Banner = `                    grade.number === 6 ? \`
                    <div class="mb-3 p-2.5 bg-slate-950/90 border border-sky-400/80 rounded-xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-2.5 text-white backdrop-blur-md">
                        <div class="flex items-center gap-2.5">
                            <span class="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-400 via-indigo-600 to-amber-400 text-white flex items-center justify-center text-base shadow-md shrink-0">
                                <i class="fa-solid fa-solar-panel"></i>
                            </span>
                            <div>
                                <div class="flex items-center gap-2 flex-wrap">
                                    <span class="text-xs sm:text-sm font-black text-sky-300 font-orbitron">🪐 6. SINIF 3D DİJİTAL PLANETARYUM</span>
                                    <span class="px-2 py-0.5 rounded-full bg-sky-950 text-sky-400 border border-sky-500/40 text-[10px] font-bold">1. ÜNİTE</span>
                                </div>
                                <p class="text-[11px] text-slate-300">Güneş Sistemi – 3D Keşif Laboratuvarı, Gezegenler, Dünya-Ay Modu ve 5 Uzay Görevi.</p>
                            </div>
                        </div>
                        <div class="flex items-center gap-1.5 shrink-0 w-full sm:w-auto flex-wrap sm:flex-nowrap">
                            <button type="button" onclick="openInteractiveGameModal('gunes-sistemi-3d', 'Güneş Sistemi – 3D Keşif Laboratuvarı')" class="flex-1 sm:flex-none px-3.5 py-1.5 bg-gradient-to-r from-sky-400 via-blue-500 to-amber-400 hover:brightness-110 text-slate-950 font-black text-xs uppercase rounded-xl transition-all shadow active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer">
                                <i class="fa-solid fa-solar-panel"></i> Güneş Sistemi (3D)
                            </button>
                            <button type="button" onclick="openInteractiveGameModal('gunes-sistemi-3d', 'Güneş Sistemi – 3D Keşif Laboratuvarı')" class="flex-1 sm:flex-none px-2.5 py-1.5 bg-sky-500/30 hover:bg-sky-500 text-sky-200 hover:text-slate-950 border border-sky-400/50 font-black text-xs uppercase rounded-xl transition-all shadow active:scale-95 flex items-center justify-center gap-1 cursor-pointer">
                                <i class="fa-solid fa-gamepad"></i> Uzay Görevleri
                            </button>
                        </div>
                    </div>
                    \` : ''}`;

    const newGrade6Banner = `                    grade.number === 6 ? \`
                    <div class="mb-3 p-2.5 bg-slate-950/90 border border-sky-400/80 rounded-xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-2.5 text-white backdrop-blur-md">
                        <div class="flex items-center gap-2.5">
                            <span class="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-400 via-indigo-600 to-amber-400 text-white flex items-center justify-center text-base shadow-md shrink-0">
                                <i class="fa-solid fa-solar-panel"></i>
                            </span>
                            <div>
                                <div class="flex items-center gap-2 flex-wrap">
                                    <span class="text-xs sm:text-sm font-black text-sky-300 font-orbitron">🪐 6. SINIF 3D EĞİTSEL UZAY OYUNLARI</span>
                                    <span class="px-2 py-0.5 rounded-full bg-sky-950 text-sky-400 border border-sky-500/40 text-[10px] font-bold">1. ÜNİTE</span>
                                </div>
                                <p class="text-[11px] text-slate-300">Gezegen Koşusu 3D, Uzay Ekspresi, Güneş Sistemi 3D Planetaryumu ve Sinematik Yolculuk.</p>
                            </div>
                        </div>
                        <div class="flex items-center gap-1.5 shrink-0 w-full sm:w-auto flex-wrap sm:flex-nowrap">
                            <button type="button" onclick="openInteractiveGameModal('oyun-gezegen-kosusu', 'Gezegen Koşusu: Antgravity Galaksisi (3D)')" class="flex-1 sm:flex-none px-3 py-1.5 bg-gradient-to-r from-cyan-400 to-blue-500 hover:brightness-110 text-slate-950 font-black text-xs uppercase rounded-xl transition-all shadow active:scale-95 flex items-center justify-center gap-1 cursor-pointer">
                                <i class="fa-solid fa-person-running"></i> Gezegen Koşusu
                            </button>
                            <button type="button" onclick="openInteractiveGameModal('oyun-uzay-ekspresi', 'Rotalı Fenci - Uzay Ekspresi')" class="flex-1 sm:flex-none px-2.5 py-1.5 bg-gradient-to-r from-amber-400 to-orange-500 hover:brightness-110 text-slate-950 font-black text-xs uppercase rounded-xl transition-all shadow active:scale-95 flex items-center justify-center gap-1 cursor-pointer">
                                <i class="fa-solid fa-train-subway"></i> Uzay Ekspresi
                            </button>
                            <button type="button" onclick="openInteractiveGameModal('gunes-sistemi-3d', 'Güneş Sistemi – 3D Keşif Laboratuvarı')" class="flex-1 sm:flex-none px-2.5 py-1.5 bg-sky-400 hover:bg-sky-300 text-slate-950 font-black text-xs uppercase rounded-xl transition-all shadow active:scale-95 flex items-center justify-center gap-1 cursor-pointer">
                                <i class="fa-solid fa-solar-panel"></i> 3D Planetaryum
                            </button>
                            <button type="button" onclick="openInteractiveGameModal('gunes-sistemi-yolculuk-3d', 'Güneş Sisteminde Yolculuk – 3D Sinematik')" class="flex-1 sm:flex-none px-2.5 py-1.5 bg-indigo-500 hover:bg-indigo-400 text-white font-black text-xs uppercase rounded-xl transition-all shadow active:scale-95 flex items-center justify-center gap-1 cursor-pointer">
                                <i class="fa-solid fa-film"></i> Sinematik 3D
                            </button>
                        </div>
                    </div>
                    \` : ''}`;

    if (code.includes(oldGrade6Banner)) {
        code = code.replace(oldGrade6Banner, newGrade6Banner);
    }

    // 4. builtinUnitGamesMap["6"]["1"]
    const oldBuiltinG6 = `        "6": {
            "1": [
                {
                    id: "builtin-oyun-6-gunes-sistemi",
                    title: "Güneş Sistemi – 3D Keşif Laboratuvarı",
                    icon: "fa-solid fa-solar-panel",
                    desc: "8 gezegenin gerçek oranlı yörüngeleri, Dünya-Ay özel inceleme modu, gezegen karşılaştırma laboratuvarı ve 5 farklı interaktif uzay görevi!",
                    type: "3D Dijital Planetaryum",
                    format: "3D SİMÜLATÖR",
                    badge: "🌟 1. Ünite Başyapıtı",
                    fileUrl: "oyunlar/gunes-sistemi-3d.html",
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
                }
            ]
        },`;

    const newBuiltinG6 = `        "6": {
            "1": [
                {
                    id: "builtin-oyun-6-uzay-ekspresi",
                    title: "Rotalı Fenci - Uzay Ekspresi: Güneş Sistemi Keşfi",
                    icon: "fa-solid fa-train-subway",
                    desc: "3D uzay treninde gezegenleri keşfet, meteorlardan kaç, Maarif Modeli bilgi kapılarından geç!",
                    type: "3D Uzay Treni",
                    format: "3D OYUN",
                    badge: "🌟 1. Ünite Başyapıtı",
                    fileUrl: "oyunlar/uzay-ekspresi.html",
                    kapakResmi: "assets/rotali-uzay-ekspresi.jpg"
                },
                {
                    id: "builtin-oyun-6-gezegen-kosusu",
                    title: "Gezegen Koşusu: Antgravity Galaksisi (3D Subway Surfers)",
                    icon: "fa-solid fa-person-running",
                    desc: "3 şeritli sonsuz uzay koşusu! Güneş Sistemi gezegenlerinde engelleri aş, soru kapılarından doğru geç, solucan deliklerinden ışınlan!",
                    type: "3D Uzay Koşusu",
                    format: "3D OYUN",
                    badge: "🌟 1. Ünite Başyapıt Oyunu",
                    fileUrl: "oyunlar/gezegen-kosusu.html",
                    kapakResmi: "assets/gezegen-kosusu-kapak.svg"
                },
                {
                    id: "builtin-oyun-6-gunes-sistemi",
                    title: "Güneş Sistemi – 3D Keşif Laboratuvarı",
                    icon: "fa-solid fa-solar-panel",
                    desc: "8 gezegenin gerçek oranlı yörüngeleri, Dünya-Ay özel inceleme modu, gezegen karşılaştırma laboratuvarı ve 5 farklı interaktif uzay görevi!",
                    type: "3D Dijital Planetaryum",
                    format: "3D SİMÜLATÖR",
                    badge: "🌟 1. Ünite Başyapıtı",
                    fileUrl: "oyunlar/gunes-sistemi-3d.html",
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
                }
            ]
        },`;

    if (code.includes(oldBuiltinG6)) {
        code = code.replace(oldBuiltinG6, newBuiltinG6);
    }

    // 5. Showcase in renderGradeUnitBasedHub for Grade 6
    const oldHubShowcaseG6 = `            \` : (normSubTab === "egitsel-oyunlar" && gNum === "6") ? \`
            <!-- 🌟 6. SINIF ÖNE ÇIKAN BAŞYAPIT OYUNU (UZAY EKSPRESİ) -->
            <div class="relative bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950/40 border-2 border-amber-400/90 rounded-3xl p-6 sm:p-8 lg:p-10 mb-6 shadow-2xl overflow-hidden text-white group hover:border-amber-400 transition-all">
                <div class="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-10">
                    <div class="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-5">
                        <div class="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl p-1 bg-gradient-to-tr from-amber-400 via-orange-500 to-yellow-300 shadow-[0_0_35px_rgba(245,158,11,0.5)] flex items-center justify-center shrink-0 overflow-hidden">
                            <img src="assets/rotali-uzay-ekspresi.jpg" alt="Rotalı Fenci - Uzay Ekspresi" class="w-full h-full object-cover rounded-[22px]" onerror="this.src='rotali-fenci-logo.png'">
                        </div>
                        <div class="max-w-xl">
                            <span class="px-3 py-1 rounded-full bg-amber-400/20 border border-amber-300/40 text-amber-300 text-[11px] font-black tracking-wider uppercase inline-block mb-2">
                                <i class="fa-solid fa-trophy text-amber-400"></i> 1. ÜNİTE BAŞYAPIT OYUNU
                            </span>
                            <h4 class="text-2xl sm:text-3xl font-black font-orbitron tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-400 mb-2">
                                Rotalı Fenci - Uzay Ekspresi: Güneş Sistemi Keşfi
                            </h4>
                            <p class="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium mb-3">
                                3D uzay treninde gezegenleri keşfet, meteorlardan kaç, Maarif Modeli bilgi kapılarından geç!
                            </p>
                        </div>
                    </div>
                    <div class="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0 w-full sm:w-auto">
                        <button type="button" onclick="openInteractiveGameModal('oyun-uzay-ekspresi', 'Rotalı Fenci - Uzay Ekspresi')" class="px-8 py-3.5 bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-black rounded-2xl text-xs uppercase tracking-wider shadow-lg transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2">
                            <i class="fa-solid fa-play"></i> OYUNU AÇ (TAM EKRAN)
                        </button>
                    </div>
                </div>
            </div>
            \` : ''}`;

    const newHubShowcaseG6 = `            \` : (normSubTab === "egitsel-oyunlar" && gNum === "6") ? \`
            <!-- 🌟 6. SINIF ÖNE ÇIKAN BAŞYAPIT OYUNLARI (UZAY EKSPRESİ & GEZEGEN KOŞUSU) -->
            <div class="grid grid-cols-1 xl:grid-cols-2 gap-5 mb-8">
                <!-- 1. UZAY EKSPRESİ -->
                <div class="relative bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950/70 border-2 border-amber-400/90 rounded-3xl p-5 sm:p-7 shadow-2xl overflow-hidden text-white group hover:border-amber-300 transition-all flex flex-col justify-between">
                    <div class="absolute -right-12 -bottom-12 w-64 h-64 bg-amber-500/15 rounded-full blur-3xl pointer-events-none"></div>
                    <div class="relative z-10">
                        <div class="flex items-start gap-4 mb-3">
                            <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl p-1 bg-gradient-to-tr from-amber-400 via-orange-500 to-yellow-300 shadow-[0_0_25px_rgba(245,158,11,0.5)] flex items-center justify-center shrink-0 overflow-hidden">
                                <img src="assets/rotali-uzay-ekspresi.jpg" alt="Rotalı Fenci - Uzay Ekspresi" class="w-full h-full object-cover rounded-xl" onerror="this.src='rotali-fenci-logo.png'">
                            </div>
                            <div class="flex-1 min-w-0">
                                <div class="flex flex-wrap items-center gap-1.5 mb-1">
                                    <span class="px-2.5 py-0.5 rounded-full bg-amber-400/20 border border-amber-300/40 text-amber-300 text-[10px] font-black tracking-wider uppercase">
                                        <i class="fa-solid fa-trophy text-amber-400"></i> 1. Ünite Başyapıtı
                                    </span>
                                    <span class="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] font-bold border border-emerald-400/30">
                                        ✓ Maarif Modeli Uyumlu
                                    </span>
                                </div>
                                <h4 class="text-lg sm:text-xl font-black font-orbitron tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-200 to-amber-400 leading-snug">
                                    Rotalı Fenci - Uzay Ekspresi
                                </h4>
                            </div>
                        </div>
                        <p class="text-xs text-slate-200 leading-relaxed font-medium mb-3 line-clamp-3">
                            3D uzay treninde gezegenleri keşfet, meteorlardan kaç, Maarif Modeli bilgi kapılarından geç!
                        </p>
                        <div class="flex flex-wrap items-center gap-1.5 text-[10px] font-bold text-slate-300 mb-4">
                            <span class="px-2 py-0.5 rounded-lg bg-white/10 border border-white/10">🚂 3D Uzay Treni</span>
                            <span class="px-2 py-0.5 rounded-lg bg-white/10 border border-white/10">🪐 Güneş Sistemi</span>
                            <span class="px-2 py-0.5 rounded-lg bg-white/10 border border-white/10">⚡ Bilgi Kapıları</span>
                        </div>
                    </div>
                    <div class="relative z-10 flex flex-col sm:flex-row gap-2 pt-2 border-t border-white/10">
                        <button type="button" onclick="openInteractiveGameModal('oyun-uzay-ekspresi', 'Rotalı Fenci - Uzay Ekspresi')" class="flex-1 py-3 px-4 bg-gradient-to-r from-amber-400 via-orange-500 to-yellow-400 hover:from-amber-300 hover:to-orange-500 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(245,158,11,0.5)] transition-all flex items-center justify-center gap-2 cursor-pointer border border-amber-300">
                            <i class="fa-solid fa-play"></i> OYUNU AÇ (TAM EKRAN)
                        </button>
                        <a href="oyunlar/uzay-ekspresi.html" target="_blank" rel="noopener noreferrer" class="py-3 px-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all border border-white/20 flex items-center justify-center gap-1.5 text-center">
                            <i class="fa-solid fa-up-right-from-square"></i> Yeni Sekme
                        </a>
                    </div>
                </div>

                <!-- 2. GEZEGEN KOŞUSU (SUBWAY SURFERS) -->
                <div class="relative bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950/70 border-2 border-cyan-400/90 rounded-3xl p-5 sm:p-7 shadow-2xl overflow-hidden text-white group hover:border-cyan-300 transition-all flex flex-col justify-between">
                    <div class="absolute -right-12 -bottom-12 w-64 h-64 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none"></div>
                    <div class="relative z-10">
                        <div class="flex items-start gap-4 mb-3">
                            <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl p-1 bg-gradient-to-tr from-cyan-400 via-blue-600 to-indigo-600 shadow-[0_0_25px_rgba(6,182,212,0.5)] flex items-center justify-center shrink-0 overflow-hidden">
                                <img src="assets/gezegen-kosusu-kapak.svg" alt="Gezegen Koşusu" class="w-full h-full object-cover rounded-xl" onerror="this.src='rotali-fenci-logo.png'">
                            </div>
                            <div class="flex-1 min-w-0">
                                <div class="flex flex-wrap items-center gap-1.5 mb-1">
                                    <span class="px-2.5 py-0.5 rounded-full bg-cyan-400/20 border border-cyan-300/40 text-cyan-300 text-[10px] font-black tracking-wider uppercase">
                                        <i class="fa-solid fa-trophy text-amber-400"></i> 1. Ünite Başyapıtı
                                    </span>
                                    <span class="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] font-bold border border-emerald-400/30">
                                        ✓ 3D Subway Surfers Tarzı
                                    </span>
                                </div>
                                <h4 class="text-lg sm:text-xl font-black font-orbitron tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-blue-400 leading-snug">
                                    Gezegen Koşusu: Antgravity Galaksisi
                                </h4>
                            </div>
                        </div>
                        <p class="text-xs text-slate-200 leading-relaxed font-medium mb-3 line-clamp-3">
                            3 şeritli sonsuz uzay koşusu! Güneş Sistemi gezegenlerinde engelleri aş, soru kapılarından doğru geç, solucan deliklerinden ışınlan!
                        </p>
                        <div class="flex flex-wrap items-center gap-1.5 text-[10px] font-bold text-slate-300 mb-4">
                            <span class="px-2 py-0.5 rounded-lg bg-white/10 border border-white/10">🏃 3D Runner</span>
                            <span class="px-2 py-0.5 rounded-lg bg-white/10 border border-white/10">🌌 8 Gezegen Parkuru</span>
                            <span class="px-2 py-0.5 rounded-lg bg-white/10 border border-white/10">🎯 Astronomi Soruları</span>
                        </div>
                    </div>
                    <div class="relative z-10 flex flex-col sm:flex-row gap-2 pt-2 border-t border-white/10">
                        <button type="button" onclick="openInteractiveGameModal('oyun-gezegen-kosusu', 'Gezegen Koşusu: Antgravity Galaksisi')" class="flex-1 py-3 px-4 bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(6,182,212,0.5)] transition-all flex items-center justify-center gap-2 cursor-pointer border border-cyan-300">
                            <i class="fa-solid fa-play"></i> OYUNU AÇ (TAM EKRAN)
                        </button>
                        <a href="oyunlar/gezegen-kosusu.html" target="_blank" rel="noopener noreferrer" class="py-3 px-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all border border-white/20 flex items-center justify-center gap-1.5 text-center">
                            <i class="fa-solid fa-up-right-from-square"></i> Yeni Sekme
                        </a>
                    </div>
                </div>
            </div>
            \` : ''}`;

    if (code.includes(oldHubShowcaseG6)) {
        code = code.replace(oldHubShowcaseG6, newHubShowcaseG6);
    }

    // 6. Fix Deduplication Logic (around line 5296)
    const oldDeduplicationRegex = /unitBuiltinGames = allBuiltinsForGrade\.filter\(g => \{[\s\S]*?return !alreadyExists;\s*\}\);/;
    const newDeduplication = `unitBuiltinGames = allBuiltinsForGrade.filter(g => {
                            if (deletedIds.has(g.id)) return false;
                            // unitCustoms içinde aynı ID, tam dosya yolu veya tam başlık varsa tekilleştir
                            const alreadyExists = unitCustoms.some(c => 
                                (c.id && c.id === g.id) ||
                                (c.fileUrl && g.fileUrl && c.fileUrl.trim().toLowerCase() === g.fileUrl.trim().toLowerCase()) ||
                                (c.title && g.title && c.title.toLowerCase().trim() === g.title.toLowerCase().trim())
                            );
                            return !alreadyExists;
                        });`;

    if (oldDeduplicationRegex.test(code)) {
        code = code.replace(oldDeduplicationRegex, newDeduplication);
    }

    fs.writeFileSync(filePath, code, 'utf8');
    console.log(`Successfully patched ${filePath}`);
}

patchAppJs(path.join(__dirname, '..', 'js', 'app.js'));
patchAppJs(path.join(__dirname, '..', '..', 'js', 'app.js'));
