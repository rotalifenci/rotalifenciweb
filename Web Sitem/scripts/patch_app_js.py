import os

target_files = ['js/app.js', '../js/app.js']

for fpath in target_files:
    if not os.path.exists(fpath):
        print(f"Skipping {fpath}: file does not exist")
        continue

    with open(fpath, 'r', encoding='utf-8') as f:
        code = f.read()

    # 1. Add to PROTECTED_MATERIALS
    prot_target = '"builtin-oyun-6-uzay-ekspresi",'
    prot_replacement = '"builtin-oyun-6-uzay-ekspresi",\n    "mat-7-oyun-uzay-ekspresi", "builtin-oyun-7-uzay-ekspresi", "oyun-7-uzay-ekspresi",'
    if prot_target in code and '"builtin-oyun-7-uzay-ekspresi"' not in code:
        code = code.replace(prot_target, prot_replacement, 1)
        print(f"Updated PROTECTED_MATERIALS in {fpath}")

    # 2. Add to curriculum games by grade/unit in "7": { "1": [ ... ] }
    curric_target = '''        "7": {
            "1": ['''
    curric_replacement = '''        "7": {
            "1": [
                {
                    id: "builtin-oyun-7-uzay-ekspresi",
                    title: "Rotalı Fenci - Uzay Ekspresi: Güneş Sistemi ve Ötesi",
                    icon: "fa-solid fa-train-subway",
                    desc: "3D uzay treninde derin uzayı keşfet, meteorlardan kaç, 140 soruluk Maarif Modeli bilgi kapılarından geç!",
                    type: "3D Uzay Treni",
                    format: "3D OYUN",
                    badge: "🌟 1. Ünite Başyapıtı",
                    fileUrl: "oyunlar/uzay-ekspresi-7.html",
                    kapakResmi: "assets/rotali-uzay-ekspresi.jpg"
                },'''
    if curric_target in code and '"builtin-oyun-7-uzay-ekspresi"' not in code:
        code = code.replace(curric_target, curric_replacement, 1)
        print(f"Updated curriculum games catalog in {fpath}")

    # 3. Add to builtinCurriculumGames["7"]
    built_target = '''        "7": [
            {
                id: "builtin-oyun-7-uzaydan-kacis",'''
    built_replacement = '''        "7": [
            {
                id: "builtin-oyun-7-uzay-ekspresi",
                title: "Rotalı Fenci - Uzay Ekspresi: Güneş Sistemi ve Ötesi",
                badge: "3D Uzay Treni",
                type: "3D Koşu Oyunu",
                desc: "3D uzay treninde derin uzayı keşfet, uzay teknolojilerini incele, 140 soruluk Maarif Modeli bilgi kapılarından geçerek rekor kır!",
                icon: "fa-solid fa-train-subway",
                iconColor: "from-amber-400 via-orange-500 to-yellow-300",
                fileUrl: "oyun-7-uzay-ekspresi"
            },
            {
                id: "builtin-oyun-7-uzaydan-kacis",'''
    if built_target in code and '"builtin-oyun-7-uzay-ekspresi"' not in code:
        code = code.replace(built_target, built_replacement, 1)
        print(f"Updated builtinCurriculumGames in {fpath}")

    # 4. Add Hero Card for Grade 7 in renderGradeCategoryMaterials
    hero_target = '''            <!-- 2. 🌟 ÖNE ÇIKAN BAŞYAPIT -->
            ${gNum === "6" ? `'''

    hero_replacement = '''            <!-- 2. 🌟 ÖNE ÇIKAN BAŞYAPIT -->
            ${gNum === "7" ? `
            <div class="relative bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950/40 border-2 border-amber-400/90 rounded-3xl p-6 sm:p-8 lg:p-10 mb-8 shadow-2xl overflow-hidden text-white group hover:border-amber-400 transition-all">
                <!-- Arka Plan Dekoratif Parıltılar -->
                <div class="absolute -right-16 -bottom-16 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none"></div>
                <div class="absolute -left-16 -top-16 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
                
                <div class="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-10">
                    <!-- Sol: Karakter Logosu & Başlık Bilgisi -->
                    <div class="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-5">
                        <div class="relative shrink-0">
                            <div class="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl p-1 bg-gradient-to-tr from-amber-400 via-orange-500 to-yellow-300 shadow-[0_0_35px_rgba(245,158,11,0.5)] flex items-center justify-center transform group-hover:scale-105 transition-transform overflow-hidden">
                                <img src="assets/rotali-uzay-ekspresi.jpg" alt="Rotalı Fenci - Uzay Ekspresi" class="w-full h-full object-cover rounded-[22px] bg-slate-900" onerror="this.src='rotali-fenci-logo.png'">
                            </div>
                            <span class="absolute -bottom-2 -right-2 px-2 py-0.5 bg-amber-400 text-slate-950 text-[10px] font-black uppercase rounded-lg shadow font-mono">
                                🚂 3D TREN
                            </span>
                        </div>

                        <div class="max-w-xl">
                            <div class="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2">
                                <span class="px-3 py-1 rounded-full bg-amber-400/20 border border-amber-300/40 text-amber-300 text-[11px] font-black tracking-wider uppercase flex items-center gap-1.5">
                                    <i class="fa-solid fa-trophy text-amber-400"></i> 1. ÜNİTE BAŞYAPIT OYUNU
                                </span>
                                <span class="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black border border-emerald-400/30">
                                    ✓ Maarif Modeli & Akıllı Tahta Uyumlu
                                </span>
                            </div>
                            <h4 class="text-2xl sm:text-3xl lg:text-4xl font-black font-orbitron tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-orange-400 mb-2">
                                Rotalı Fenci - Uzay Ekspresi: Güneş Sistemi ve Ötesi
                            </h4>
                            <p class="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium mb-4">
                                Uzay boşluğunda kuantum raylarında koş! Uzay araştırmalarını, gök adaları, bulutsuları, yıldızları ve kara delikleri keşfet, 140 soruluk Türkiye Yüzyılı Maarif Modeli bilgi kapılarından doğru geçerek rekor kır!
                            </p>
                            <!-- Özellik Rozetleri -->
                            <div class="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-[11px] font-bold text-slate-300">
                                <span class="px-2.5 py-1 rounded-xl bg-white/10 border border-white/10 flex items-center gap-1">
                                    🌌 Güneş Sistemi & Ötesi
                                </span>
                                <span class="px-2.5 py-1 rounded-xl bg-white/10 border border-white/10 flex items-center gap-1">
                                    🛰️ Uzay Teknolojileri & ISS
                                </span>
                                <span class="px-2.5 py-1 rounded-xl bg-white/10 border border-white/10 flex items-center gap-1">
                                    🚪 140 Maarif Bilgi Kapısı
                                </span>
                                <span class="px-2.5 py-1 rounded-xl bg-white/10 border border-white/10 flex items-center gap-1">
                                    ❤️ 3 Can & Asistan Robot
                                </span>
                                <span class="px-2.5 py-1 rounded-xl bg-white/10 border border-white/10 flex items-center gap-1">
                                    ✨ Işık Yılı & Yıldız Skoru
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- Sağ: Hızlı Başlatma Butonları -->
                    <div class="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0 w-full sm:w-auto">
                        <button type="button" onclick="openInteractiveGameModal('builtin-oyun-7-uzay-ekspresi', 'Rotalı Fenci - Uzay Ekspresi: Güneş Sistemi ve Ötesi')" class="px-8 py-4 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black rounded-2xl text-sm uppercase tracking-wider shadow-[0_0_25px_rgba(245,158,11,0.5)] transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 cursor-pointer border-2 border-amber-300">
                            <i class="fa-solid fa-play text-base"></i> OYUNU AÇ (TAM EKRAN)
                        </button>
                        <a href="oyunlar/uzay-ekspresi-7.html" target="_blank" rel="noopener noreferrer" class="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl text-xs uppercase tracking-wider transition-all border border-white/20 flex items-center justify-center gap-2 text-center">
                            <i class="fa-solid fa-up-right-from-square"></i> Tam Ekran Yeni Sekmede Aç
                        </a>
                        ${isAdmin ? `
                            <button type="button" onclick="event.stopPropagation(); triggerEditMaterial('mat-7-oyun-uzay-ekspresi')" class="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-2xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow cursor-pointer">
                                <i class="fa-solid fa-pen-to-square"></i> Oyunu Düzenle
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
            ` : gNum === "6" ? `'''

    if hero_target in code:
        code = code.replace(hero_target, hero_replacement, 1)
        print(f"Updated Hero Card for Grade 7 in {fpath}")

    # 5. Route in openInteractiveGameModal or launcher
    route_target = '''    // 🚂 6. SINIF UZAY EKSPRESİ: GÜNEŞ SİSTEMİ KEŞFİ'''
    route_replacement = '''    // 🚂 7. SINIF UZAY EKSPRESİ: GÜNEŞ SİSTEMİ VE ÖTESİ
    if (
        id === "mat-7-oyun-uzay-ekspresi" ||
        id === "builtin-oyun-7-uzay-ekspresi" ||
        id === "oyun-7-uzay-ekspresi" ||
        targetUrl.includes("uzay-ekspresi-7") ||
        (checkTitle.includes("uzay ekspresi") && (checkTitle.includes("ötesi") || checkTitle.includes("7. sınıf") || checkTitle.includes("7-sinif")))
    ) {
        openInteractiveGameModal("builtin-oyun-7-uzay-ekspresi", "Rotalı Fenci - Uzay Ekspresi: Güneş Sistemi ve Ötesi");
        return;
    }

    // 🚂 6. SINIF UZAY EKSPRESİ: GÜNEŞ SİSTEMİ KEŞFİ'''
    if route_target in code and '"builtin-oyun-7-uzay-ekspresi"' not in code:
        code = code.replace(route_target, route_replacement, 1)
        print(f"Updated router in {fpath}")

    # 6. Modal iframe renderer inside openInteractiveGameModal
    modal_render_target = '''    // 🚂 Rotalı Fenci - Uzay Ekspresi (3D Güneş Sistemi Bilim Treni Oyunu)
    if (str.includes("uzay-ekspresi") || str.includes("uzay ekspresi") || str.includes("uzay_ekspresi") || titleStr.includes("uzay ekspresi") || resolvedKey === "oyun-uzay-ekspresi" || resolvedKey === "oyun-6-uzay-ekspresi" || resolvedKey === "mat-6-oyun-uzay-ekspresi") {'''

    modal_render_replacement = '''    // 🚂 7. SINIF Rotalı Fenci - Uzay Ekspresi (3D Güneş Sistemi ve Ötesi)
    if (str.includes("uzay-ekspresi-7") || str.includes("oyun-7-uzay-ekspresi") || resolvedKey === "builtin-oyun-7-uzay-ekspresi" || resolvedKey === "mat-7-oyun-uzay-ekspresi" || (titleStr.includes("uzay ekspresi") && (titleStr.includes("ötesi") || titleStr.includes("7.")))) {
        modal.innerHTML = `
            <div class="bg-slate-950 rounded-2xl w-full max-w-[99vw] h-[98vh] h-[98dvh] border border-amber-400/80 shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200" onclick="event.stopPropagation()">
                <div class="p-2 sm:px-4 sm:py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-white shrink-0">
                    <div class="flex items-center gap-2 sm:gap-3">
                        <span class="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-amber-400 via-orange-500 to-yellow-300 text-slate-950 flex items-center justify-center text-sm sm:text-lg font-black shadow-md">
                            <i class="fa-solid fa-train-subway"></i>
                        </span>
                        <div>
                            <h3 class="text-xs sm:text-base font-black text-amber-400">🚂 Rotalı Fenci - Uzay Ekspresi</h3>
                            <p class="text-[10px] sm:text-xs text-slate-400 hidden sm:block">7. Sınıf Fen Bilimleri • 1. Ünite: Güneş Sistemi ve Ötesi (140 Soru)</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-2">
                        <a href="oyunlar/uzay-ekspresi-7.html" target="_blank" rel="noopener noreferrer" class="px-2.5 py-1 sm:px-3 sm:py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-white rounded-xl text-xs font-bold transition-all border border-slate-700 flex items-center gap-1.5">
                            <i class="fa-solid fa-up-right-from-square"></i> <span class="hidden sm:inline">Yeni Sekmede Aç</span>
                        </a>
                        <button type="button" onclick="closeInteractiveGameModal()" class="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-rose-600/20 hover:bg-rose-600 text-rose-400 hover:text-white flex items-center justify-center transition-all cursor-pointer">
                            <i class="fa-solid fa-xmark text-sm sm:text-base"></i>
                        </button>
                    </div>
                </div>
                <div class="relative w-full flex-1 bg-slate-950 min-h-0">
                    <iframe src="oyunlar/uzay-ekspresi-7.html" class="w-full h-full border-0 absolute inset-0" allow="fullscreen; autoplay; gamepad" loading="lazy"></iframe>
                </div>
            </div>
        `;
        return;
    }

    // 🚂 Rotalı Fenci - Uzay Ekspresi (3D Güneş Sistemi Bilim Treni Oyunu)
    if (str.includes("uzay-ekspresi") || str.includes("uzay ekspresi") || str.includes("uzay_ekspresi") || titleStr.includes("uzay ekspresi") || resolvedKey === "oyun-uzay-ekspresi" || resolvedKey === "oyun-6-uzay-ekspresi" || resolvedKey === "mat-6-oyun-uzay-ekspresi") {'''

    if modal_render_target in code:
        code = code.replace(modal_render_target, modal_render_replacement, 1)
        print(f"Updated modal renderer in {fpath}")

    with open(fpath, 'w', encoding='utf-8') as f:
        f.write(code)
    print(f"Successfully updated and saved {fpath}")
