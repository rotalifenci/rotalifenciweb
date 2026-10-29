const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, '../js/app.js');
let app = fs.readFileSync(appPath, 'utf8');

// 1. Update builtinUnitGamesMap["6"]
const oldBuiltin6 = `        "6": {
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

const newBuiltin6 = `        "6": {
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

if (!app.includes(oldBuiltin6)) {
  console.error('Could not find oldBuiltin6 in app.js!');
  process.exit(1);
}
app = app.replace(oldBuiltin6, newBuiltin6);

// 2. Update renderGradeSubTabContent items routing
const oldAccordionRouting = `                                            const isCustom = !String(item.id).startsWith("std-") && !String(item.id).startsWith("oyun-");
                                            const isBuiltinGame = String(item.id).startsWith("oyun-");
                                            const isAyaInisItem = (item.fileUrl && (item.fileUrl.includes("aya-inis") || item.fileUrl.includes("aya_inis"))) ||
                                                (item.title && (item.title.toLowerCase().includes("ay'a iniş") || item.title.toLowerCase().includes("aya inis") || item.title.toLowerCase().includes("apollo 11"))) ||
                                                (item.id && (String(item.id).includes("aya-inis") || String(item.id).includes("apollo11")));
                                            const isGunesSistemiItem = !isAyaInisItem && ((item.fileUrl && (item.fileUrl.includes("gunes-sistemi") || item.fileUrl.includes("gunes_sistemi"))) ||
                                                (item.title && (item.title.toLowerCase().includes("güneş sistemi") || item.title.toLowerCase().includes("gunes sistemi"))) ||
                                                (item.id && String(item.id).includes("gunes-sistemi")));
                                            const isKozmikKasifItem = !isAyaInisItem && !isGunesSistemiItem && ((item.fileUrl && item.fileUrl.includes("kozmik-kasif")) ||
                                                (item.title && (item.title.toLowerCase().includes("kozmik kâşif") || item.title.toLowerCase().includes("kozmik kasif"))) ||
                                                (item.id && String(item.id).includes("kozmik-kasif")));
                                            const isKozmikKosuItem = !isAyaInisItem && !isGunesSistemiItem && ((item.fileUrl && item.fileUrl.includes("kozmik-kosu")) ||
                                                (item.title && (item.title.toLowerCase().includes("kozmik koşu") || item.title.toLowerCase().includes("kozmik kosu") || item.title.toLowerCase().includes("ay evresi avı"))) ||
                                                (item.id && String(item.id).includes("kozmik-kosu")));
                                            const isAyinEvreleriItem = !isAyaInisItem && !isGunesSistemiItem && !isKozmikKasifItem && !isKozmikKosuItem && (
                                                (item.fileUrl && item.fileUrl.includes("ayin-evreleri")) ||
                                                (item.title && (item.title.toLowerCase().includes("ay'ın evreleri") || item.title.toLowerCase().includes("ayin evreleri"))) ||
                                                (item.id && String(item.id).includes("ayin-evreleri"))
                                            );
                                            const isGunesItem = !isAyaInisItem && !isGunesSistemiItem && !isKozmikKasifItem && !isKozmikKosuItem && !isAyinEvreleriItem && (
                                                (item.fileUrl && item.fileUrl.includes("gunesi-kesfediyorum")) ||
                                                (item.title && (item.title.toLowerCase().includes("güneş'i keşfediyorum") || item.title.toLowerCase().includes("gunesi kesfediyorum"))) ||
                                                (item.id && String(item.id).includes("gunesi-kesfediyorum"))
                                            );

                                            let actionCall = cfg.btnAction(item);
                                            if (isAyaInisItem) {
                                                actionCall = \`openInteractiveGameModal('oyunlar/aya-inis-3d.html', 'Ay\\\\\\'a İniş – 3D Keşif ve VR Deneyimi')\`;
                                            } else if (isGunesSistemiItem) {
                                                actionCall = \`openInteractiveGameModal('oyunlar/gunes-sistemi-3d.html', 'Güneş Sistemi – 3D Keşif Laboratuvarı')\`;
                                            } else if (isKozmikKasifItem) {
                                                actionCall = \`openInteractiveGameModal('oyunlar/kozmik-kasif-3d.html', 'Kozmik Kâşif 3D: Ay ve Güneş Üssü')\`;
                                            } else if (isKozmikKosuItem) {
                                                actionCall = \`openInteractiveGameModal('oyunlar/kozmik-kosu-3d.html', 'Kozmik Koşu: Ay Evresi Avı (3D)')\`;
                                            } else if (isAyinEvreleriItem) {
                                                actionCall = \`openInteractiveGameModal('oyunlar/ayin-evreleri-3d.html', 'Ay Evreleri 3D Simülatörü')\`;
                                            } else if (isGunesItem) {
                                                actionCall = \`openInteractiveGameModal('oyunlar/gunesi-kesfediyorum-3d.html', 'Güneş 3D Uzay Laboratuvarı')\`;
                                            } else if (isBuiltinGame) {
                                                actionCall = \`openInteractiveGameModal('\${item.fileUrl}', '\${(item.title || '').replace(/'/g, "\\\\'")}')\`;
                                            } else if (isCustom) {
                                                actionCall = \`openOrDownloadMaterial('\${item.id}', '\${item.fileUrl || item.imageUrl || '#'}', '\${(item.fileName || item.title).replace(/'/g, "\\\\'")}', '\${normSubTab}', '\${item.title.replace(/'/g, "\\\\'")}', '\${item.format || ''}')\`;
                                            }

                                            let itemActionUI = getMaterialActionUI(item, normSubTab);
                                            if (isAyaInisItem) {
                                                itemActionUI = { bg: "bg-gradient-to-r from-sky-500 via-blue-600 to-amber-500 hover:from-sky-600 hover:to-blue-700 shadow-sky-500/30", text: "Ay'a İniş Yap (3D VR)", icon: "fa-solid fa-flag" };
                                            } else if (isGunesSistemiItem) {
                                                itemActionUI = { bg: "bg-gradient-to-r from-sky-500 via-indigo-600 to-amber-500 hover:from-sky-600 hover:to-indigo-700 shadow-sky-500/30", text: "Laboratuvara Gir", icon: "fa-solid fa-solar-panel" };
                                            } else if (isAyinEvreleriItem) {
                                                itemActionUI = { bg: "bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-700 hover:from-cyan-700 hover:to-blue-700 shadow-cyan-600/30", text: "Animasyonu Görüntüle", icon: "fa-solid fa-play" };
                                            } else if (isGunesItem) {
                                                itemActionUI = { bg: "bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 hover:from-amber-600 hover:to-orange-600 shadow-amber-500/30", text: "Animasyonu Görüntüle", icon: "fa-solid fa-play" };
                                            } else if (isBuiltinGame) {
                                                itemActionUI = { bg: "bg-slate-900 hover:bg-fuchsia-700", text: "Animasyonu Görüntüle", icon: "fa-solid fa-play" };
                                            }`;

const newAccordionRouting = `                                            const isCustom = !String(item.id).startsWith("std-") && !String(item.id).startsWith("oyun-");
                                            const isBuiltinGame = String(item.id).startsWith("oyun-");
                                            
                                            // 🚂 1. UZAY EKSPRESİ (Güneş Sistemi kelimesi içerse bile öncelikli eşleşir)
                                            const isUzayEkspresiItem = (item.fileUrl && (item.fileUrl.includes("uzay-ekspresi") || item.fileUrl.includes("uzay_ekspresi"))) ||
                                                (item.title && (item.title.toLowerCase().includes("uzay ekspresi") || item.title.toLowerCase().includes("uzay-ekspresi"))) ||
                                                (item.id && (String(item.id).includes("uzay-ekspresi") || String(item.id).includes("uzay_ekspresi")));

                                            // ⚡ 2. KUVVET LABORATUVARI
                                            const isKuvvetLaboratuvariItem = (item.fileUrl && item.fileUrl.includes("kuvvet-laboratuvari")) ||
                                                (item.title && (item.title.toLowerCase().includes("kuvvet laboratuvarı") || item.title.toLowerCase().includes("kuvvet laboratuvari"))) ||
                                                (item.id && String(item.id).includes("kuvvet-laboratuvari"));

                                            // 🎬 3. GÜNEŞ SİSTEMİNDE YOLCULUK SİNEMATİK ANİMASYON
                                            const isGunesSistemiYolculukItem = !isUzayEkspresiItem && ((item.fileUrl && item.fileUrl.includes("gunes-sistemi-yolculuk")) ||
                                                (item.title && (item.title.toLowerCase().includes("yolculuk") && item.title.toLowerCase().includes("güneş"))) ||
                                                (item.id && String(item.id).includes("gunes-sistemi-yolculuk")));

                                            // 🌕 4. APOLLO 11 AY'A İNİŞ
                                            const isAyaInisItem = (item.fileUrl && (item.fileUrl.includes("aya-inis") || item.fileUrl.includes("aya_inis"))) ||
                                                (item.title && (item.title.toLowerCase().includes("ay'a iniş") || item.title.toLowerCase().includes("aya inis") || item.title.toLowerCase().includes("apollo 11"))) ||
                                                (item.id && (String(item.id).includes("aya-inis") || String(item.id).includes("apollo11")));

                                            // 🪐 5. GÜNEŞ SİSTEMİ KEŞİF LABORATUVARI (DİJİTAL PLANETARYUM)
                                            const isGunesSistemiItem = !isAyaInisItem && !isUzayEkspresiItem && !isKuvvetLaboratuvariItem && !isGunesSistemiYolculukItem && (
                                                (item.fileUrl && (item.fileUrl.includes("gunes-sistemi-3d") || item.fileUrl.includes("gunes_sistemi_3d"))) ||
                                                (item.id && (item.id === "mat-6-1-oyun-gunes-sistemi-3d" || item.id === "builtin-oyun-6-gunes-sistemi" || item.id === "gunes-sistemi-3d")) ||
                                                (item.title && (item.title.toLowerCase().includes("keşif laboratuvarı") || item.title.toLowerCase().includes("dijital planetaryum") || (item.title.toLowerCase().includes("güneş sistemi") && !item.title.toLowerCase().includes("tren") && !item.title.toLowerCase().includes("ekspres"))))
                                            );

                                            // 🛰️ 6. 5. SINIF DİĞER OYUNLAR
                                            const isKozmikKasifItem = !isAyaInisItem && !isGunesSistemiItem && ((item.fileUrl && item.fileUrl.includes("kozmik-kasif")) ||
                                                (item.title && (item.title.toLowerCase().includes("kozmik kâşif") || item.title.toLowerCase().includes("kozmik kasif"))) ||
                                                (item.id && String(item.id).includes("kozmik-kasif")));
                                            const isKozmikKosuItem = !isAyaInisItem && !isGunesSistemiItem && ((item.fileUrl && item.fileUrl.includes("kozmik-kosu")) ||
                                                (item.title && (item.title.toLowerCase().includes("kozmik koşu") || item.title.toLowerCase().includes("kozmik kosu") || item.title.toLowerCase().includes("ay evresi avı"))) ||
                                                (item.id && String(item.id).includes("kozmik-kosu")));
                                            const isAyinEvreleriItem = !isAyaInisItem && !isGunesSistemiItem && !isKozmikKasifItem && !isKozmikKosuItem && (
                                                (item.fileUrl && item.fileUrl.includes("ayin-evreleri")) ||
                                                (item.title && (item.title.toLowerCase().includes("ay'ın evreleri") || item.title.toLowerCase().includes("ayin evreleri"))) ||
                                                (item.id && String(item.id).includes("ayin-evreleri"))
                                            );
                                            const isGunesItem = !isAyaInisItem && !isGunesSistemiItem && !isKozmikKasifItem && !isKozmikKosuItem && !isAyinEvreleriItem && (
                                                (item.fileUrl && item.fileUrl.includes("gunesi-kesfediyorum")) ||
                                                (item.title && (item.title.toLowerCase().includes("güneş'i keşfediyorum") || item.title.toLowerCase().includes("gunesi kesfediyorum"))) ||
                                                (item.id && String(item.id).includes("gunesi-kesfediyorum"))
                                            );

                                            let actionCall = cfg.btnAction(item);
                                            if (isUzayEkspresiItem) {
                                                actionCall = \`openInteractiveGameModal('oyun-uzay-ekspresi', 'Rotalı Fenci - Uzay Ekspresi: Güneş Sistemi Keşfi')\`;
                                            } else if (isKuvvetLaboratuvariItem) {
                                                actionCall = \`openInteractiveGameModal('oyunlar/kuvvet-laboratuvari.html', 'Kuvvet Laboratuvarı – Kuvvetleri Dengele, Hareketi Keşfet!')\`;
                                            } else if (isGunesSistemiYolculukItem) {
                                                actionCall = \`openInteractiveGameModal('oyunlar/gunes-sistemi-yolculuk-3d.html', 'Güneş Sisteminde Yolculuk – 3D Sinematik Animasyon')\`;
                                            } else if (isAyaInisItem) {
                                                actionCall = \`openInteractiveGameModal('oyunlar/aya-inis-3d.html', 'Ay\\\\\\'a İniş – 3D Keşif ve VR Deneyimi')\`;
                                            } else if (isGunesSistemiItem) {
                                                actionCall = \`openInteractiveGameModal('oyunlar/gunes-sistemi-3d.html', 'Güneş Sistemi – 3D Keşif Laboratuvarı')\`;
                                            } else if (isKozmikKasifItem) {
                                                actionCall = \`openInteractiveGameModal('oyunlar/kozmik-kasif-3d.html', 'Kozmik Kâşif 3D: Ay ve Güneş Üssü')\`;
                                            } else if (isKozmikKosuItem) {
                                                actionCall = \`openInteractiveGameModal('oyunlar/kozmik-kosu-3d.html', 'Kozmik Koşu: Ay Evresi Avı (3D)')\`;
                                            } else if (isAyinEvreleriItem) {
                                                actionCall = \`openInteractiveGameModal('oyunlar/ayin-evreleri-3d.html', 'Ay Evreleri 3D Simülatörü')\`;
                                            } else if (isGunesItem) {
                                                actionCall = \`openInteractiveGameModal('oyunlar/gunesi-kesfediyorum-3d.html', 'Güneş 3D Uzay Laboratuvarı')\`;
                                            } else if (isBuiltinGame) {
                                                actionCall = \`openInteractiveGameModal('\${item.fileUrl}', '\${(item.title || '').replace(/'/g, "\\\\'")}')\`;
                                            } else if (isCustom) {
                                                actionCall = \`openOrDownloadMaterial('\${item.id}', '\${item.fileUrl || item.imageUrl || '#'}', '\${(item.fileName || item.title).replace(/'/g, "\\\\'")}', '\${normSubTab}', '\${item.title.replace(/'/g, "\\\\'")}', '\${item.format || ''}')\`;
                                            }

                                            let itemActionUI = getMaterialActionUI(item, normSubTab);
                                            if (isUzayEkspresiItem) {
                                                itemActionUI = { bg: "bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 shadow-amber-500/30", text: "Trene Bin (3D)", icon: "fa-solid fa-train-subway" };
                                            } else if (isKuvvetLaboratuvariItem) {
                                                itemActionUI = { bg: "bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-600 hover:to-blue-700 shadow-cyan-500/30", text: "Laboratuvara Gir (3D)", icon: "fa-solid fa-atom" };
                                            } else if (isGunesSistemiYolculukItem) {
                                                itemActionUI = { bg: "bg-gradient-to-r from-amber-400 via-sky-500 to-indigo-600 hover:from-amber-500 hover:to-sky-600 text-slate-950 shadow-sky-500/30", text: "Animasyonu Başlat (3D)", icon: "fa-solid fa-film" };
                                            } else if (isAyaInisItem) {
                                                itemActionUI = { bg: "bg-gradient-to-r from-sky-500 via-blue-600 to-amber-500 hover:from-sky-600 hover:to-blue-700 shadow-sky-500/30", text: "Ay'a İniş Yap (3D VR)", icon: "fa-solid fa-flag" };
                                            } else if (isGunesSistemiItem) {
                                                itemActionUI = { bg: "bg-gradient-to-r from-sky-500 via-indigo-600 to-amber-500 hover:from-sky-600 hover:to-indigo-700 shadow-sky-500/30", text: "Laboratuvara Gir", icon: "fa-solid fa-solar-panel" };
                                            } else if (isAyinEvreleriItem) {
                                                itemActionUI = { bg: "bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-700 hover:from-cyan-700 hover:to-blue-700 shadow-cyan-600/30", text: "Animasyonu Görüntüle", icon: "fa-solid fa-play" };
                                            } else if (isGunesItem) {
                                                itemActionUI = { bg: "bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 hover:from-amber-600 hover:to-orange-600 shadow-amber-500/30", text: "Animasyonu Görüntüle", icon: "fa-solid fa-play" };
                                            } else if (isBuiltinGame) {
                                                itemActionUI = { bg: "bg-slate-900 hover:bg-fuchsia-700", text: "Animasyonu Görüntüle", icon: "fa-solid fa-play" };
                                            }`;

if (!app.includes(oldAccordionRouting)) {
  console.error('Could not find oldAccordionRouting in app.js!');
  process.exit(1);
}
app = app.replace(oldAccordionRouting, newAccordionRouting);

fs.writeFileSync(appPath, app, 'utf8');
console.log('Successfully updated js/app.js with exact routing and unit 2 game entry!');
