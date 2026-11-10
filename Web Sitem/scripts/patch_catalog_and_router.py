import os

target_files = ['js/app.js', '../js/app.js']

for fpath in target_files:
    if not os.path.exists(fpath):
        continue

    with open(fpath, 'r', encoding='utf-8') as f:
        code = f.read()

    # 1. Grade 7 Unit 1 Catalog
    target1 = 'id: "mat-7-1-sim-yildiz-laboratuvari",'
    replacement1 = '''id: "builtin-oyun-7-uzay-ekspresi",
                    title: "Rotalı Fenci - Uzay Ekspresi: Güneş Sistemi ve Ötesi",
                    icon: "fa-solid fa-train-subway",
                    desc: "3D uzay treninde derin uzayı keşfet, meteorlardan kaç, 140 soruluk Maarif Modeli bilgi kapılarından geç!",
                    type: "3D Uzay Treni",
                    format: "3D OYUN",
                    badge: "🌟 1. Ünite Başyapıtı",
                    fileUrl: "oyunlar/uzay-ekspresi-7.html",
                    kapakResmi: "assets/rotali-uzay-ekspresi.jpg"
                },
                {
                    id: "mat-7-1-sim-yildiz-laboratuvari",'''

    if target1 in code and 'builtin-oyun-7-uzay-ekspresi' not in code:
        code = code.replace(target1, replacement1, 1)
        print(f"Added to Grade 7 Unit 1 catalog in {fpath}")

    # 2. builtinCurriculumGames["7"]
    target2 = 'id: "builtin-oyun-7-uzaydan-kacis",'
    replacement2 = '''id: "builtin-oyun-7-uzay-ekspresi",
                title: "Rotalı Fenci - Uzay Ekspresi: Güneş Sistemi ve Ötesi",
                badge: "3D Uzay Treni",
                type: "3D Koşu Oyunu",
                desc: "3D uzay treninde derin uzayı keşfet, uzay teknolojilerini incele, 140 soruluk Maarif Modeli bilgi kapılarından geçerek rekor kır!",
                icon: "fa-solid fa-train-subway",
                iconColor: "from-amber-400 via-orange-500 to-yellow-300",
                fileUrl: "builtin-oyun-7-uzay-ekspresi"
            },
            {
                id: "builtin-oyun-7-uzaydan-kacis",'''

    if target2 in code and 'builtin-oyun-7-uzay-ekspresi' not in code[code.find('builtinCurriculumGames'):]:
        code = code.replace(target2, replacement2, 1)
        print(f"Added to builtinCurriculumGames in {fpath}")

    # 3. Router logic
    target3 = '// 🚂 6. SINIF UZAY EKSPRESİ: GÜNEŞ SİSTEMİ KEŞFİ'
    replacement3 = '''// 🚂 7. SINIF UZAY EKSPRESİ: GÜNEŞ SİSTEMİ VE ÖTESİ
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

    if target3 in code and 'builtin-oyun-7-uzay-ekspresi' not in code[code.find(target3)-300:code.find(target3)]:
        code = code.replace(target3, replacement3, 1)
        print(f"Added to game router in {fpath}")

    with open(fpath, 'w', encoding='utf-8') as f:
        f.write(code)
    print(f"Completed patching {fpath}")
