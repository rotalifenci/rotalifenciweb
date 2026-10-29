const fs = require('fs');
const path = require('path');

function updateBuiltinG6(filePath) {
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');

    // Replace the "6": { "1": [ ... ] } block
    const targetPattern = /"6":\s*\{\s*"1":\s*\[\s*\{[\s\S]*?id:\s*"builtin-oyun-6-gunes-sistemi"[\s\S]*?\}\s*\]\s*\}/;

    const newG6Block = `"6": {
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
        }`;

    if (targetPattern.test(content)) {
        content = content.replace(targetPattern, newG6Block);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated builtinUnitGamesMap in ${filePath}`);
    } else {
        console.log(`targetPattern not found in ${filePath}`);
    }
}

updateBuiltinG6(path.join(__dirname, '..', 'js', 'app.js'));
updateBuiltinG6(path.join(__dirname, '..', '..', 'js', 'app.js'));
