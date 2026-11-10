import json
import os

new_mat = {
    "id": "mat-7-oyun-uzay-ekspresi",
    "grade": "7",
    "category": "egitsel-oyunlar",
    "targetSection": "1",
    "title": "Rotalı Fenci - Uzay Ekspresi: Güneş Sistemi ve Ötesi",
    "unit": "1. Ünite: Güneş Sistemi ve Ötesi",
    "desc": "Türkiye Yüzyılı Maarif Modeli uyumlu 3D uzay treni macerası! Kuantum raylar üzerinde koş, uzay teknolojilerini ve derin uzayı keşfet, 140 soruluk Maarif bilgi kapılarından doğru geç!",
    "fileName": "uzay-ekspresi-7.html",
    "fileUrl": "oyunlar/uzay-ekspresi-7.html",
    "imageUrl": "assets/rotali-uzay-ekspresi.jpg",
    "kapakResmi": "assets/rotali-uzay-ekspresi.jpg",
    "cover": "assets/rotali-uzay-ekspresi.jpg",
    "format": "3D UZAY TRENİ",
    "hasBlob": False,
    "tags": [
        "7. Sınıf",
        "1. Ünite",
        "Güneş Sistemi ve Ötesi",
        "Uzay Araştırmaları",
        "Gök Cisimleri",
        "Uzay Ekspresi",
        "3D Oyun"
    ],
    "visibility": "public",
    "downloadCount": "🌟 1. Ünite Başyapıtı",
    "createdAt": "2026-11-11T00:00:00.000Z",
    "updatedAt": "2026-11-11T00:00:00.000Z"
}

files = ['data/materials.json', '../data/materials.json']
for fpath in files:
    if os.path.exists(fpath):
        with open(fpath, 'r', encoding='utf-8') as f:
            materials = json.load(f)
        
        # Check if already exists
        exists = any(m.get('id') == new_mat['id'] for m in materials)
        if not exists:
            materials.append(new_mat)
            with open(fpath, 'w', encoding='utf-8') as f:
                json.dump(materials, f, ensure_ascii=False, indent=2)
            print(f"Added to {fpath}. Total materials: {len(materials)}")
        else:
            print(f"Already exists in {fpath}.")
