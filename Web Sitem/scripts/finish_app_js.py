import os

for fpath in ['js/app.js', '../js/app.js']:
    if not os.path.exists(fpath):
        continue
    with open(fpath, 'r', encoding='utf-8') as f:
        code = f.read()

    # 1. builtinUnitGamesMap["5"]["2"]
    if '"builtin-oyun-5-dinamometre"' not in code:
        target1 = '''            "1": ['''
        # We need to find the one inside "5": { "1": [
        pos5 = code.find('"5": {')
        if pos5 != -1:
            pos_close = code.find('            ]\n        },', pos5)
            if pos_close != -1:
                replacement_unit2 = '''            ],
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
            ]'''
                code = code[:pos_close] + replacement_unit2 + code[pos_close + len('            ]'):]
                print(f"Added unit 2 to builtinUnitGamesMap in {fpath}")

    # 2. unit 2 matching in renderGradeUnitBasedHub
    if 'm.id === "mat-5-2-sim-dinamometre-laboratuvari"' not in code:
        target2 = 'if (m.id === "mat-6-2-sim-kuvvet-laboratuvari" || (m.title && m.title.toLowerCase().includes("kuvvet laboratuvarı")))'
        replacement2 = '''if (m.id === "mat-5-2-sim-dinamometre-laboratuvari" || (m.title && m.title.toLowerCase().includes("dinamometre"))) {
                            return String(unitNum) === "2";
                        }
                        ''' + target2
        code = code.replace(target2, replacement2)
        print(f"Added unit 2 matching in {fpath}")

    # 3. openOrDownloadMaterial intercept
    if 'id === "mat-5-2-sim-dinamometre-laboratuvari"' not in code:
        target3 = '// ⚡ 6. SINIF KUVVET LABORATUVARI'
        replacement3 = '''// ⚖️ 5. SINIF DİNAMOMETRE SANAL LABORATUVARI
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

    ''' + target3
        code = code.replace(target3, replacement3)
        print(f"Added openOrDownloadMaterial intercept in {fpath}")

    with open(fpath, 'w', encoding='utf-8') as f:
        f.write(code)
    print(f"Finished {fpath}")
