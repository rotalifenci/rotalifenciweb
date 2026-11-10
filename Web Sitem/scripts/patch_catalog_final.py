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

    # Only replace at the curriculum catalog occurrence around 360000
    idx_curric = code.find('"7": {\n            "1": [\n                {\n                    id: "mat-7-1-sim-yildiz-laboratuvari",')
    if idx_curric != -1:
        code = code[:idx_curric] + code[idx_curric:].replace(target1, replacement1, 1)
        print(f"Added to Grade 7 Unit 1 catalog in {fpath}")
    else:
        print(f"Could not find exact curric pattern in {fpath}")

    # 2. builtinCurriculumGames["7"]
    idx_games = code.find('const builtinCurriculumGames')
    if idx_games != -1:
        idx_g7 = code.find('"7": [', idx_games)
        if idx_g7 != -1 and 'builtin-oyun-7-uzay-ekspresi' not in code[idx_g7:idx_g7+600]:
            target_g7 = '"7": ['
            replacement_g7 = '''"7": [
            {
                id: "builtin-oyun-7-uzay-ekspresi",
                title: "Rotalı Fenci - Uzay Ekspresi: Güneş Sistemi ve Ötesi",
                badge: "3D Uzay Treni",
                type: "3D Koşu Oyunu",
                desc: "3D uzay treninde derin uzayı keşfet, uzay teknolojilerini incele, 140 soruluk Maarif Modeli bilgi kapılarından geçerek rekor kır!",
                icon: "fa-solid fa-train-subway",
                iconColor: "from-amber-400 via-orange-500 to-yellow-300",
                fileUrl: "builtin-oyun-7-uzay-ekspresi"
            },'''
            code = code[:idx_g7] + code[idx_g7:].replace(target_g7, replacement_g7, 1)
            print(f"Added to builtinCurriculumGames in {fpath}")

    with open(fpath, 'w', encoding='utf-8') as f:
        f.write(code)
    print(f"Finished {fpath}")
