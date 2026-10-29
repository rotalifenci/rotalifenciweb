const fs = require('fs');
const path = require('path');

function updateMaterialsFile(filePath) {
    if (!fs.existsSync(filePath)) {
        console.log('File does not exist:', filePath);
        return;
    }
    const raw = fs.readFileSync(filePath, 'utf8');
    let materials = JSON.parse(raw);

    const targetItems = [
        {
            id: "mat-game-gezegen-kosusu",
            grade: "6",
            category: "egitsel-oyunlar",
            targetSection: "1",
            title: "Gezegen Koşusu: Antgravity Galaksisi (3D Subway Surfers)",
            unit: "1. Ünite: Güneş Sistemi ve Gezegenler",
            desc: "3 şeritli sonsuz uzay koşusu! Güneş Sistemi gezegenlerinde engelleri aş, soru kapılarından doğru geç, solucan deliklerinden ışınlan ve galaktik kütüphaneyi tamamla!",
            fileName: "gezegen-kosusu.html",
            fileUrl: "oyunlar/gezegen-kosusu.html",
            imageUrl: "assets/gezegen-kosusu-kapak.svg",
            kapakResmi: "assets/gezegen-kosusu-kapak.svg",
            cover: "assets/gezegen-kosusu-kapak.svg",
            format: "3D EĞİTSEL OYUN",
            hasBlob: false,
            tags: [
                "6. Sınıf",
                "1. Ünite",
                "Güneş Sistemi",
                "Gezegenler",
                "3D Runner",
                "Subway Surfers",
                "Eğitsel Oyun"
            ],
            visibility: "public",
            downloadCount: "🌟 3D Uzay Koşusu",
            createdAt: "2026-10-18T00:00:00.000Z",
            updatedAt: "2026-10-19T00:00:00.000Z"
        },
        {
            id: "mat-6-oyun-uzay-ekspresi",
            grade: "6",
            category: "egitsel-oyunlar",
            targetSection: "1",
            title: "Rotalı Fenci - Uzay Ekspresi: Güneş Sistemi Keşfi",
            unit: "1. Ünite: Güneş Sistemi ve Tutulmalar",
            desc: "Türkiye Yüzyılı Maarif Modeli uyumlu 3D uzay treni macerası! Kuantum raylar üzerinde koş, meteor ve uydu enkazlarını aş, gezegen bilgi kapılarından doğru geç!",
            fileName: "uzay-ekspresi.html",
            fileUrl: "oyunlar/uzay-ekspresi.html",
            imageUrl: "assets/rotali-uzay-ekspresi.jpg",
            kapakResmi: "assets/rotali-uzay-ekspresi.jpg",
            cover: "assets/rotali-uzay-ekspresi.jpg",
            format: "3D UZAY TRENİ",
            hasBlob: false,
            tags: [
                "6. Sınıf",
                "1. Ünite",
                "Güneş Sistemi",
                "Gezegenler",
                "Uzay Ekspresi",
                "3D Oyun"
            ],
            visibility: "public",
            downloadCount: "🌟 1. Ünite Başyapıtı",
            createdAt: "2026-10-18T00:00:00.000Z",
            updatedAt: "2026-10-19T00:00:00.000Z"
        },
        {
            id: "mat-6-1-oyun-gunes-sistemi-3d",
            grade: "6",
            category: "egitsel-oyunlar",
            targetSection: "1",
            title: "Güneş Sistemi – 3D Keşif Laboratuvarı (Dijital Planetaryum)",
            unit: "1. Ünite: Güneş Sistemi ve Tutulmalar",
            desc: "Güneş ve 8 gezegenin gerçekçi 3D modelleri, gerçek oranlı yörünge hareketleri, Dünya-Ay özel inceleme modu, gezegen karşılaştırma laboratuvarı ve 5 farklı eğitsel uzay görevi!",
            fileName: "gunes-sistemi-3d.html",
            fileUrl: "oyunlar/gunes-sistemi-3d.html",
            imageUrl: "assets/gunes-sistemi-3d-kapak.svg",
            kapakResmi: "assets/gunes-sistemi-3d-kapak.svg",
            cover: "assets/gunes-sistemi-3d-kapak.svg",
            format: "3D DİJİTAL PLANETARYUM",
            hasBlob: false,
            tags: [
                "6. Sınıf",
                "5. Sınıf",
                "7. Sınıf",
                "1. Ünite",
                "Güneş Sistemi",
                "Gezegenler",
                "Güneş Sistemi ve Tutulmalar",
                "3D Planetaryum"
            ],
            visibility: "public",
            downloadCount: "🌟 3D Keşif Laboratuvarı",
            createdAt: "2026-10-18T00:00:00.000Z",
            updatedAt: "2026-10-19T00:00:00.000Z"
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
            cover: "assets/gunes-sistemi-yolculuk-3d-kapak.svg",
            format: "3D SİNEMATİK ANİMASYON",
            hasBlob: false,
            tags: [
                "6. Sınıf",
                "1. Ünite",
                "Güneş Sistemi",
                "Gezegenler",
                "Sinematik 3D",
                "Animasyon"
            ],
            visibility: "public",
            downloadCount: "🎬 3D Özel Animasyon",
            createdAt: "2026-10-19T00:00:00.000Z",
            updatedAt: "2026-10-19T00:00:00.000Z"
        }
    ];

    for (const item of targetItems) {
        const existingIdx = materials.findIndex(m => m.id === item.id);
        if (existingIdx !== -1) {
            materials[existingIdx] = { ...materials[existingIdx], ...item };
        } else {
            materials.push(item);
        }
    }

    fs.writeFileSync(filePath, JSON.stringify(materials, null, 2), 'utf8');
    console.log(`Updated ${filePath} (Total: ${materials.length} items)`);
}

updateMaterialsFile(path.join(__dirname, '..', 'data', 'materials.json'));
updateMaterialsFile(path.join(__dirname, '..', '..', 'data', 'materials.json'));
