const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, '../js/app.js');
let app = fs.readFileSync(appPath, 'utf8');

const targetStr = `        "6": {
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

const replacementStr = `        "6": {
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
            ],
            "2": [
                {
                    id: "mat-6-2-sim-kuvvet-laboratuvari",
                    title: "Kuvvet Laboratuvarı – Kuvvetleri Dengele, Hareketi Keşfet!",
                    icon: "fa-solid fa-atom",
                    desc: "Türkiye Yüzyılı Maarif Modeli uyumlu gerçek zamanlı 3D fizik simülasyonu! 5 deney modülü, bileşke oklar, halat çekme ve 10 soruluk değerlendirme.",
                    type: "3D Fizik Simülasyonu",
                    format: "3D SİMÜLASYON",
                    badge: "🌟 2. Ünite Başyapıtı",
                    fileUrl: "oyunlar/kuvvet-laboratuvari.html",
                    kapakResmi: "assets/kuvvet-laboratuvari-kapak.svg"
                }
            ]
        },`;

if (!app.includes(targetStr)) {
  console.error('Could not find targetStr in app.js!');
  process.exit(1);
}

app = app.replace(targetStr, replacementStr);
fs.writeFileSync(appPath, app, 'utf8');
console.log('Successfully updated builtinUnitGamesMap["6"] in app.js!');
