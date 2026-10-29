const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, '../js/app.js');
const app = fs.readFileSync(appPath, 'utf8');
const lines = app.split('\n');

const lineIdx = lines.findIndex(l => l.includes('const isGunesSistemiItem = !isAyaInisItem && ((item.fileUrl'));
if (lineIdx === -1) {
  console.error('Line not found!');
  process.exit(1);
}

const start = lineIdx - 3; // where isAyaInisItem begins
const end = lineIdx + 52;  // after itemActionUI if-else block

const replacementLines = `                                            // 🚂 1. UZAY EKSPRESİ (Güneş Sistemi kelimesi içerse bile öncelikli eşleşir)
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

lines.splice(start, end - start, replacementLines);
fs.writeFileSync(appPath, lines.join('\n'), 'utf8');
console.log('Successfully replaced accordion routing in app.js!');
