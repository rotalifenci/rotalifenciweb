import json
import os
import re

def update_materials(filepath):
    if not os.path.exists(filepath):
        print(f"File not found: {filepath}")
        return
    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Check if already exists
    exists = any(m.get('id') == 'mat-5-2-sim-dinamometre-laboratuvari' for m in data)
    if not exists:
        new_mat = {
            'id': 'mat-5-2-sim-dinamometre-laboratuvari',
            'title': 'Dinamometre Sanal Laboratuvarı – Kuvveti Ölç, Deney Yap, Keşfet!',
            'description': "5. Sınıf 2. Ünite 'Kuvveti Tanıyalım' için MEB Türkiye Yüzyılı Maarif Modeline tam uyumlu interaktif Dinamometre Sanal Laboratuvarı. 4 farklı dinamometre (5N, 10N, 20N, 50N), 3 yay türü (ince, orta, kalın), cisim asma ve el ile kuvvet uygulama modları, plastik deformasyon / yay hasarı simülasyonu, yay karşılaştırma, STEM dinamometre tasarım atölyesi, 8 rehberli deney, canlı Hooke yasası kuvvet-uzama grafiği, veri tablosu (CSV/Yazdır), ölçek okuma testi, Dünya & Ay yer çekimi laboratuvarı ve 10 görevli macera modu.",
            'grade': '5',
            'category': 'egitsel-oyunlar',
            'unit': '2. Ünite: Kuvveti Tanıyalım',
            'targetSection': '2',
            'fileUrl': 'oyunlar/dinamometre-laboratuvari.html',
            'kapakResmi': 'assets/dinamometre-laboratuvari-kapak.svg',
            'type': 'game',
            'format': 'SANAL LABORATUVAR',
            'isInteractive': True,
            'date': '2026-11-11',
            'createdAt': '2026-11-11T00:00:00.000Z',
            'tags': ['dinamometre', 'kuvvet', 'hooke-yasasi', 'yay', 'sanal-laboratuvar', '5-sinif', 'kuvveti-taniyalim', 'stem']
        }
        data.insert(0, new_mat)
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print(f"Added material to {filepath}")
    else:
        print(f"Material already exists in {filepath}")

def update_app_js(filepath):
    if not os.path.exists(filepath):
        print(f"File not found: {filepath}")
        return
    with open(filepath, 'r', encoding='utf-8') as f:
        code = f.read()

    # 1. PROTECTED_MATERIAL_IDS
    if '"mat-5-2-sim-dinamometre-laboratuvari"' not in code:
        code = code.replace(
            'const PROTECTED_MATERIAL_IDS = new Set([',
            'const PROTECTED_MATERIAL_IDS = new Set([\n    "mat-5-2-sim-dinamometre-laboratuvari", "builtin-oyun-5-dinamometre", "dinamometre-laboratuvari",'
        )
        print(f"Updated PROTECTED_MATERIAL_IDS in {filepath}")

    # 2. getMaterialActionUI isDinamometreLab
    if 'isDinamometreLab' not in code:
        target = '    const isKuvvetLab = title.includes("kuvvet laboratuvarı")'
        replacement = '''    const isDinamometreLab = title.includes("dinamometre") || file.includes("dinamometre") || url.includes("dinamometre") || (item && (item.id === "mat-5-2-sim-dinamometre-laboratuvari" || item.id === "builtin-oyun-5-dinamometre"));
    if (isDinamometreLab) {
        return { text: "Laboratuvara Gir (3D)", icon: "fa-solid fa-weight-hanging", bg: "bg-gradient-to-r from-cyan-500 via-blue-600 to-amber-500 hover:from-cyan-600 hover:to-blue-700 shadow-cyan-500/30" };
    }
''' + target
        code = code.replace(target, replacement)
        print(f"Updated getMaterialActionUI in {filepath}")

    # 3. builtinUnitGamesMap["5"]: add "2": [...]
    if '"builtin-oyun-5-dinamometre"' not in code:
        target = '    const builtinUnitGamesMap = {\n        "5": {'
        replacement = '''    const builtinUnitGamesMap = {
        "5": {
            "2": [
                {
                    id: "builtin-oyun-5-dinamometre",
                    title: "Dinamometre Sanal Laboratuvarı – Kuvveti Ölç, Deney Yap, Keşfet!",
                    icon: "fa-solid fa-weight-hanging",
                    desc: "Kuvveti ölç, yayları test et, STEM atölyesinde kendi dinamometreni tasarla! 4 dinamometre, 3 yay türü, plastik deformasyon, canlı Hooke yasası grafiği, Dünya & Ay yer çekimi ve 10 görevli macera modu.",
                    type: "Sanal Laboratuvar & Simülasyon",
                    format: "SANAL LABORATUVAR",
                    badge: "🌟 2. Ünite Başyapıtı",
                    fileUrl: "oyunlar/dinamometre-laboratuvari.html",
                    kapakResmi: "assets/dinamometre-laboratuvari-kapak.svg"
                }
            ],'''
        code = code.replace(target, replacement)
        print(f"Updated builtinUnitGamesMap in {filepath}")

    # 4. builtinCurriculumGames["5"]: add builtin-oyun-5-dinamometre
    if 'id: "builtin-oyun-5-dinamometre"' not in code:
        target = '    const builtinCurriculumGames = {\n        "5": ['
        replacement = '''    const builtinCurriculumGames = {
        "5": [
            {
                id: "builtin-oyun-5-dinamometre",
                title: "Dinamometre Sanal Laboratuvarı – Kuvveti Ölç, Deney Yap, Keşfet!",
                badge: "2. Ünite Başyapıtı",
                type: "Sanal Laboratuvar & Simülasyon",
                desc: "Kuvveti ölç, yayları test et, STEM atölyesinde kendi dinamometreni tasarla! 4 dinamometre, 3 yay türü, plastik deformasyon, canlı Hooke yasası grafiği, Dünya & Ay yer çekimi ve 10 görevli macera modu.",
                icon: "fa-solid fa-weight-hanging",
                iconColor: "from-cyan-400 via-blue-600 to-amber-400",
                fileUrl: "dinamometre-laboratuvari"
            },'''
        code = code.replace(target, replacement)
        print(f"Updated builtinCurriculumGames in {filepath}")

    # 5. renderGradeUnitBasedHub unit 2 matching
    if 'm.id === "mat-5-2-sim-dinamometre-laboratuvari"' not in code:
        target = '                        if (m.id === "mat-6-2-sim-kuvvet-laboratuvari"'
        replacement = '''                        if (m.id === "mat-5-2-sim-dinamometre-laboratuvari" || (m.title && m.title.toLowerCase().includes("dinamometre"))) {
                            return String(unitNum) === "2";
                        }
''' + target
        code = code.replace(target, replacement)
        print(f"Updated unit 2 matching in {filepath}")

    # 6. Card loop recognition in renderGradeUnitBasedHub
    if 'const isDinamometreLaboratuvariItem' not in code:
        target = '                                            // ⚡ 2. KUVVET LABORATUVARI & İŞ LABORATUVARI'
        replacement = '''                                            // ⚖️ 0. DİNAMOMETRE SANAL LABORATUVARI
                                            const isDinamometreLaboratuvariItem = (item.fileUrl && item.fileUrl.includes("dinamometre")) ||
                                                (item.title && item.title.toLowerCase().includes("dinamometre")) ||
                                                (item.id && String(item.id).includes("dinamometre"));

''' + target
        code = code.replace(target, replacement)

        target_act = '                                            if (isUzayEkspresiItem) {'
        replacement_act = '''                                            if (isDinamometreLaboratuvariItem) {
                                                actionCall = `openInteractiveGameModal('oyunlar/dinamometre-laboratuvari.html', 'Dinamometre Sanal Laboratuvarı – Kuvveti Ölç, Deney Yap, Keşfet!')`;
                                            } else if (isUzayEkspresiItem) {'''
        code = code.replace(target_act, replacement_act)

        target_ui = '                                            if (isUzayEkspresiItem) {'
        replacement_ui = '''                                            if (isDinamometreLaboratuvariItem) {
                                                itemActionUI = { bg: "bg-gradient-to-r from-cyan-500 via-blue-600 to-amber-500 hover:from-cyan-600 hover:to-blue-700 text-white shadow-cyan-500/30", text: "Laboratuvara Gir (3D)", icon: "fa-solid fa-weight-hanging" };
                                            } else if (isUzayEkspresiItem) {'''
        code = code.replace(target_ui, replacement_ui)
        print(f"Updated card loop in {filepath}")

    # 7. openOrDownloadMaterial intercept
    if 'id === "mat-5-2-sim-dinamometre-laboratuvari"' not in code:
        target = '            // ⚡ 6. SINIF KUVVET LABORATUVARI'
        replacement = '''            // ⚖️ 5. SINIF DİNAMOMETRE SANAL LABORATUVARI
    if (
        id === "mat-5-2-sim-dinamometre-laboratuvari" ||
        id === "dinamometre-laboratuvari" ||
        id === "builtin-oyun-5-dinamometre" ||
        targetUrl.includes("dinamometre") ||
        checkTitle.includes("dinamometre")
    ) {
        openInteractiveGameModal("oyunlar/dinamometre-laboratuvari.html", "Dinamometre Sanal Laboratuvarı – Kuvveti Ölç, Deney Yap, Keşfet!");
        return;
    }

''' + target
        code = code.replace(target, replacement)
        print(f"Updated openOrDownloadMaterial in {filepath}")

    # 8. openInteractiveGameModal handler
    if 'str.includes("dinamometre")' not in code:
        target = '    // ⚡ 6. Sınıf Kuvvet Laboratuvarı'
        replacement = '''    // ⚖️ 5. Sınıf Dinamometre Sanal Laboratuvarı – Kuvveti Ölç, Deney Yap, Keşfet!
    if (str.includes("dinamometre") || titleStr.includes("dinamometre") || resolvedKey === "mat-5-2-sim-dinamometre-laboratuvari" || resolvedKey === "builtin-oyun-5-dinamometre" || resolvedKey === "dinamometre-laboratuvari") {
        modal.innerHTML = `
            <div class="bg-slate-950 w-screen h-screen max-w-none max-h-none border-0 shadow-2xl overflow-hidden flex flex-col" style="height: 100dvh; height: 100svh;" onclick="event.stopPropagation()">
                <div class="px-3 py-1.5 bg-slate-900 border-b border-cyan-500/40 flex items-center justify-between text-white shrink-0 min-h-[42px]" style="padding-top: max(6px, env(safe-area-inset-top)); padding-left: max(8px, env(safe-area-inset-left)); padding-right: max(8px, env(safe-area-inset-right));">
                    <div class="flex items-center gap-2">
                        <span class="w-6 h-6 rounded-lg bg-gradient-to-tr from-cyan-400 via-blue-600 to-amber-500 text-white flex items-center justify-center text-xs font-black shadow-sm">
                            <i class="fa-solid fa-weight-hanging"></i>
                        </span>
                        <div class="flex items-center gap-2">
                            <h3 class="text-xs sm:text-sm font-black text-cyan-300">⚖️ Dinamometre Sanal Laboratuvarı – Kuvveti Ölç, Deney Yap, Keşfet!</h3>
                            <span class="text-[10px] text-slate-400 font-medium hidden md:inline">• 5. Sınıf Fen Bilimleri • 2. Ünite • Maarif Modeli</span>
                        </div>
                    </div>
                    <div class="flex items-center gap-1.5">
                        <a href="oyunlar/dinamometre-laboratuvari.html" target="_blank" rel="noopener noreferrer" class="px-2.5 py-1 bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1 shadow-sm" title="Tam Ekran Yeni Sekmede Aç">
                            <i class="fa-solid fa-up-right-from-square text-[10px]"></i> <span class="hidden sm:inline">Yeni Sekme</span>
                        </a>
                        <button type="button" onclick="closeInteractiveGameModal()" class="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-black text-xs transition-all cursor-pointer shadow-sm flex items-center gap-1 active:scale-95" title="Kapat ve Çık">
                            <i class="fa-solid fa-xmark"></i>
                            <span>Kapat</span>
                        </button>
                    </div>
                </div>
                <div class="flex-1 w-full h-full bg-slate-950 relative overflow-hidden">
                    <iframe src="oyunlar/dinamometre-laboratuvari.html" class="w-full h-full border-0 block" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; fullscreen" allowfullscreen></iframe>
                </div>
            </div>
        `;
        modal.style.display = "flex";
        modal.classList.remove("hidden");
        return;
    }

''' + target
        code = code.replace(target, replacement)
        print(f"Updated openInteractiveGameModal in {filepath}")

    # 9. Generic opener
    if 'targetUrl.includes("dinamometre-laboratuvari")' not in code:
        target = '    if (targetUrl && (targetUrl.includes("kuvvet-laboratuvari")'
        replacement = '''    if (targetUrl && (targetUrl.includes("dinamometre-laboratuvari") || title.includes("Dinamometre"))) {
        openInteractiveGameModal("oyunlar/dinamometre-laboratuvari.html", "Dinamometre Sanal Laboratuvarı – Kuvveti Ölç, Deney Yap, Keşfet!");
        return;
    }
''' + target
        code = code.replace(target, replacement)
        print(f"Updated generic opener in {filepath}")

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(code)
    print(f"Saved updates to {filepath}")

update_materials('data/materials.json')
update_materials('../data/materials.json')
update_app_js('js/app.js')
update_app_js('../js/app.js')
