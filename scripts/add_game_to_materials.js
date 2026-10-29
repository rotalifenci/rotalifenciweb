const fs = require('fs');

const mat = JSON.parse(fs.readFileSync('data/materials.json', 'utf8'));

if (!mat.some(m => m.id === 'mat-5-1-oyun-gunes-dunya-ay-3d')) {
  const item = {
    id: "mat-5-1-oyun-gunes-dunya-ay-3d",
    grade: "5",
    category: "egitsel-oyunlar",
    targetSection: "1",
    title: "Güneş, Dünya ve Ay – 3D Hareket Laboratuvarı",
    unit: "1. Ünite: Güneş, Dünya ve Ay",
    desc: "Güneş, Dünya ve Ay'ın dönme ve dolanma hareketlerini 7 farklı modda, bağımsız kontrollerle, çalışan analog saat yön göstergesi ve Ay evreleriyle 3D olarak keşfedin!",
    fileName: "gunes-dunya-ay-3d.html",
    fileUrl: "oyunlar/gunes-dunya-ay-3d.html",
    imageUrl: "assets/gunes-dunya-ay-3d-kapak.svg",
    kapakResmi: "assets/gunes-dunya-ay-3d-kapak.svg",
    cover: "assets/gunes-dunya-ay-3d-kapak.svg",
    format: "3D SİMÜLATÖR",
    hasBlob: false,
    tags: ["güneş", "dünya", "ay", "hareketler", "dönme", "dolanma", "3d uzay", "simülatör", "5. sınıf"],
    visibility: "public",
    downloadCount: "🌟 1. Ünite Başyapıtı",
    createdAt: "2026-10-18T00:00:00.000Z",
    updatedAt: "2026-10-18T00:00:00.000Z"
  };
  
  // Insert right after mat-apollo11-aya-inis-3d
  const apolloIdx = mat.findIndex(m => m.id === 'mat-apollo11-aya-inis-3d');
  if (apolloIdx !== -1) {
    mat.splice(apolloIdx + 1, 0, item);
  } else {
    mat.unshift(item);
  }
  
  fs.writeFileSync('data/materials.json', JSON.stringify(mat, null, 2), 'utf8');
  console.log('✔ Added mat-5-1-oyun-gunes-dunya-ay-3d to data/materials.json');
} else {
  console.log('Already in data/materials.json');
}
