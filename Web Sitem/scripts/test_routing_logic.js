const fs = require('fs');

const item1 = {
  id: "mat-6-oyun-uzay-ekspresi",
  title: "Rotalı Fenci - Uzay Ekspresi: Güneş Sistemi Keşfi",
  fileUrl: "oyunlar/uzay-ekspresi.html",
  fileName: "uzay-ekspresi.html"
};

const item2 = {
  id: "mat-6-2-sim-kuvvet-laboratuvari",
  title: "Kuvvet Laboratuvarı – Kuvvetleri Dengele, Hareketi Keşfet!",
  fileUrl: "oyunlar/kuvvet-laboratuvari.html",
  fileName: "kuvvet-laboratuvari.html"
};

const item3 = {
  id: "mat-6-1-oyun-gunes-sistemi-3d",
  title: "Güneş Sistemi – 3D Keşif Laboratuvarı (Dijital Planetaryum)",
  fileUrl: "oyunlar/gunes-sistemi-3d.html",
  fileName: "gunes-sistemi-3d.html"
};

const item4 = {
  id: "mat-6-1-oyun-gunes-sistemi-yolculuk-3d",
  title: "Güneş Sisteminde Yolculuk – 3D Sinematik Animasyon",
  fileUrl: "oyunlar/gunes-sistemi-yolculuk-3d.html",
  fileName: "gunes-sistemi-yolculuk-3d.html"
};

function testRouting(item) {
  const isUzayEkspresiItem = (item.fileUrl && (item.fileUrl.includes("uzay-ekspresi") || item.fileUrl.includes("uzay_ekspresi"))) ||
      (item.title && (item.title.toLowerCase().includes("uzay ekspresi") || item.title.toLowerCase().includes("uzay-ekspresi"))) ||
      (item.id && (String(item.id).includes("uzay-ekspresi") || String(item.id).includes("uzay_ekspresi")));

  const isKuvvetLaboratuvariItem = (item.fileUrl && item.fileUrl.includes("kuvvet-laboratuvari")) ||
      (item.title && (item.title.toLowerCase().includes("kuvvet laboratuvarı") || item.title.toLowerCase().includes("kuvvet laboratuvari"))) ||
      (item.id && String(item.id).includes("kuvvet-laboratuvari"));

  const isGunesSistemiYolculukItem = !isUzayEkspresiItem && ((item.fileUrl && item.fileUrl.includes("gunes-sistemi-yolculuk")) ||
      (item.title && (item.title.toLowerCase().includes("yolculuk") && item.title.toLowerCase().includes("güneş"))) ||
      (item.id && String(item.id).includes("gunes-sistemi-yolculuk")));

  const isAyaInisItem = (item.fileUrl && (item.fileUrl.includes("aya-inis") || item.fileUrl.includes("aya_inis"))) ||
      (item.title && (item.title.toLowerCase().includes("ay'a iniş") || item.title.toLowerCase().includes("aya inis") || item.title.toLowerCase().includes("apollo 11"))) ||
      (item.id && (String(item.id).includes("aya-inis") || String(item.id).includes("apollo11")));

  const isGunesSistemiItem = !isAyaInisItem && !isUzayEkspresiItem && !isKuvvetLaboratuvariItem && !isGunesSistemiYolculukItem && (
      (item.fileUrl && (item.fileUrl.includes("gunes-sistemi-3d") || item.fileUrl.includes("gunes_sistemi_3d"))) ||
      (item.id && (item.id === "mat-6-1-oyun-gunes-sistemi-3d" || item.id === "builtin-oyun-6-gunes-sistemi" || item.id === "gunes-sistemi-3d")) ||
      (item.title && (item.title.toLowerCase().includes("keşif laboratuvarı") || item.title.toLowerCase().includes("dijital planetaryum") || (item.title.toLowerCase().includes("güneş sistemi") && !item.title.toLowerCase().includes("tren") && !item.title.toLowerCase().includes("ekspres"))))
  );

  let target = "DEFAULT";
  if (isUzayEkspresiItem) target = "UZAY_EKSPRESI";
  else if (isKuvvetLaboratuvariItem) target = "KUVVET_LAB";
  else if (isGunesSistemiYolculukItem) target = "GUNES_SISTEMI_YOLCULUK";
  else if (isAyaInisItem) target = "AYA_INIS";
  else if (isGunesSistemiItem) target = "GUNES_SISTEMI_3D";

  console.log(item.title + ' -> ' + target);
}

[item1, item2, item3, item4].forEach(testRouting);
