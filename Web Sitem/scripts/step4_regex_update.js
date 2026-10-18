const fs = require('fs');
const path = require('path');

const appPath = path.resolve(__dirname, '../js/app.js');
let appJs = fs.readFileSync(appPath, 'utf8');

// Normalize line endings for replacement or use regex
// 1. DEFAULT_CUSTOM_MATERIALS
const matRegex = /(tags:\s*\["güneş",\s*"dünya",\s*"ay",\s*"evreler",\s*"3d uzay",\s*"simülatör",\s*"5\. sınıf"\],\s*downloadCount:\s*"🌟 1\. Ünite Başyapıtı"\s*\})/m;
if (matRegex.test(appJs)) {
    const mat6Code = `$1,
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
        format: "3D SİNEMATİK",
        hasBlob: false,
        tags: ["güneş sistemi", "gezegenler", "sinematik", "3d animasyon", "yolculuk", "6. sınıf"],
        downloadCount: "🎬 3D Özel Animasyon"
    }`;
    appJs = appJs.replace(matRegex, mat6Code);
    console.log('1. Replaced in DEFAULT_CUSTOM_MATERIALS');
} else {
    console.log('1. matRegex not matched');
}

// 2. builtinCurriculumGames["6"]["1"]
const currRegex = /(id:\s*"builtin-oyun-6-gunes-sistemi"[\s\S]*?kapakResmi:\s*"assets\/gunes-sistemi-3d-kapak\.svg"\s*\})/m;
if (currRegex.test(appJs)) {
    const curr6Code = `$1,
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
                }`;
    appJs = appJs.replace(currRegex, curr6Code);
    console.log('2. Replaced in builtinCurriculumGames');
} else {
    console.log('2. currRegex not matched');
}

// 3. builtinUnitGamesMap["6"]
const unitMapRegex = /(id:\s*"builtin-oyun-6-gunes-sistemi"[\s\S]*?fileUrl:\s*"gunes-sistemi-3d"\s*\})/m;
if (unitMapRegex.test(appJs)) {
    const unitMap6Code = `$1,
            {
                id: "builtin-oyun-6-gunes-sistemi-yolculuk",
                title: "Güneş Sisteminde Yolculuk – 3D Sinematik Animasyon",
                badge: "3D Sinematik Animasyon",
                type: "3D Uzay Keşfi",
                desc: "8 gezegen, gerçek boyut karşılaştırmaları, Dünya=1cm top ölçeği benzetimi ve sinematik kamera eşliğinde büyüleyici 3D Güneş Sistemi yolculuğu!",
                icon: "fa-solid fa-film",
                iconColor: "from-amber-400 via-sky-500 to-indigo-600",
                fileUrl: "gunes-sistemi-yolculuk-3d"
            }`;
    appJs = appJs.replace(unitMapRegex, unitMap6Code);
    console.log('3. Replaced in builtinUnitGamesMap');
} else {
    console.log('3. unitMapRegex not matched');
}

fs.writeFileSync(appPath, appJs, 'utf8');
console.log('Step 4 regex update finished');
