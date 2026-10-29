const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, '../js/app.js');
let content = fs.readFileSync(appPath, 'utf8');

const markerStart = '// 🪐 5. SINIF GÜNEŞ, DÜNYA VE AY: 3D HAREKET LABORATUVARI';
const markerEnd = '// 0.1 📑 DİĞER OFİS BELGELERİ';

const startPos = content.indexOf(markerStart);
const endPos = content.indexOf(markerEnd);

if (startPos === -1 || endPos === -1) {
  console.error('Markers not found!');
  process.exit(1);
}

const newBlock = `    // 🌐 GOOGLE DRIVE VE DOCS BAĞLANTILARI
    if (targetUrl && (targetUrl.includes("drive.google.com") || targetUrl.includes("docs.google.com"))) {
        let drivePreview = targetUrl;
        const fileIdMatch = targetUrl.match(/\\/file\\/d\\/([a-zA-Z0-9_-]+)/) || targetUrl.match(/id=([a-zA-Z0-9_-]+)/);
        if (fileIdMatch && fileIdMatch[1]) {
            drivePreview = \`https://drive.google.com/file/d/\${fileIdMatch[1]}/preview\`;
        }
        openInPageDocumentModal(drivePreview, title || (found && found.title) || "Google Drive Dokümanı", fileName, false, targetUrl);
        return;
    }

    // 🎨 CANVA TASARIM VE SUNUM BAĞLANTILARI
    if (targetUrl && targetUrl.includes("canva.com")) {
        let canvaEmbed = targetUrl;
        if (!canvaEmbed.includes("view?embed")) {
            canvaEmbed = canvaEmbed.replace(/\\/view(\\?.*)?$/, "/view?embed");
        }
        openInPageDocumentModal(canvaEmbed, title || (found && found.title) || "Canva Tasarımı", fileName, false, targetUrl);
        return;
    }

    // 📚 1. ÖNCELİK: PDF DERS NOTLARI VE SUNUM PDF'LERİ
    // Başlığında "Sunum" veya "Slayt" geçse bile, formatı PDF veya dosya uzantısı .pdf olan TÜM dokümanlar doğrudan dijital okuyucuda açılır!
    const isPdfFile = checkFormat.includes("PDF") ||
                      checkFile.endsWith(".pdf") ||
                      (targetUrl && (targetUrl.toLowerCase().includes(".pdf") || targetUrl.startsWith("data:application/pdf"))) ||
                      (found && String(found.format || "").toUpperCase().includes("PDF")) ||
                      (found && String(found.fileName || "").toLowerCase().endsWith(".pdf")) ||
                      (found && String(found.fileUrl || "").toLowerCase().includes(".pdf"));

    if (isPdfFile) {
        openDigitalBookModal({
            id: (found && found.id) || id,
            title: (found && found.title) || title || "Fen Bilimleri Ders Dokümanı",
            grade: gradeStr,
            fileUrl: targetUrl,
            fileName: (found && found.fileName) || fileName || "dokuman.pdf",
            cover: coverUrl,
            category: checkCat
        });
        return;
    }

    // 🚀 1.8 🌟 İNTERAKTİF HTML5 AKILLI TAHTA SUNUMLARI (3D Sinematik Sunum)
    const isHtmlPresentation = (
        targetUrl.includes("sunumlar/") ||
        id === "mat-5-1-sunum-gunes-dunya-ay" ||
        ((checkFormat.includes("İNTERAKTİF SUNUM") || checkFormat.includes("HTML SUNUM") || checkCat === "ders-sunumu") && !targetUrl.includes("oyunlar/") && (checkFile.endsWith(".html") || targetUrl.endsWith(".html")))
    );

    if (isHtmlPresentation && targetUrl && targetUrl !== "#") {
        const fullUrl = targetUrl;
        await openFullScreenPresentationModal({
            id: (found && found.id) || id,
            title: (found && found.title) || title || "5. Sınıf 1. Ünite: Güneş, Dünya ve Ay (3D Sinematik Akıllı Tahta Sunumu)",
            fileName: (found && found.fileName) || fileName || "5-sinif-1-unite-gunes-dunya-ay.html",
            fileUrl: fullUrl,
            format: "İNTERAKTİF SUNUM",
            unit: (found && found.unit) || "1. Ünite: Güneş, Dünya ve Ay",
            grade: gradeStr,
            cover: coverUrl,
            isHtmlEmbed: true
        });
        return;
    }

    // 🖥️ 2. GERÇEK OFİS SUNUMLARI (PowerPoint PPTX/PPT veya Dahili Akıllı Tahta Sunum Şablonu)
    const isPresentation = !isPdfFile && !isHtmlPresentation && (
        checkFile.endsWith(".pptx") || checkFile.endsWith(".ppt") ||
        targetUrl.endsWith(".pptx") || targetUrl.endsWith(".ppt") ||
        checkFormat.includes("PPT") || checkFormat.includes("SLAYT") ||
        checkFormat === "SUNUM" ||
        (id && String(id).startsWith("sunum-")) ||
        (checkCat === "ders-sunumu" && !checkFile.endsWith(".pdf") && !checkFormat.includes("PDF"))
    );

    if (isPresentation) {
        await openFullScreenPresentationModal({
            id: (found && found.id) || id,
            title: (found && found.title) || title || "Akıllı Tahta Ders Sunumu",
            fileName: (found && found.fileName) || fileName || "sunum.pptx",
            fileUrl: targetUrl,
            format: checkFormat || "PPTX",
            unit: (found && found.unit) || "",
            grade: gradeStr,
            cover: coverUrl
        });
        return;
    }

    // 🪐 5. SINIF GÜNEŞ, DÜNYA VE AY: 3D HAREKET LABORATUVARI
    if (
        id === "mat-5-1-oyun-gunes-dunya-ay-3d" ||
        id === "builtin-oyun-5-gunes-dunya-ay" ||
        id === "gunes-dunya-ay-3d" ||
        targetUrl.includes("oyunlar/gunes-dunya-ay-3d.html") ||
        ((checkTitle.includes("hareket laboratuvarı") || checkTitle.includes("hareket laboratuvari")) && !checkTitle.includes("sunum") && !targetUrl.includes("sunumlar/"))
    ) {
        openInteractiveGameModal("oyunlar/gunes-dunya-ay-3d.html", "Güneş, Dünya ve Ay – 3D Hareket Laboratuvarı");
        return;
    }

    // 🌕 APOLLO 11 AY'A İNİŞ VE DÜNYA GÖZLEMİ 3D VR SİMÜLASYONU
    if (
        id === "mat-apollo11-aya-inis-3d" ||
        id === "builtin-oyun-apollo11-aya-inis" ||
        id === "builtin-oyun-6-aya-inis" ||
        id === "aya-inis-3d" ||
        targetUrl.includes("oyunlar/aya-inis-3d.html") ||
        ((checkTitle.includes("ay'a iniş") || checkTitle.includes("aya inis") || checkTitle.includes("apollo 11")) && !checkTitle.includes("sunum") && !targetUrl.includes("sunumlar/"))
    ) {
        openInteractiveGameModal("oyunlar/aya-inis-3d.html", "Ay'a İniş – 3D Keşif ve VR Deneyimi");
        return;
    }

    // 🎬 6. SINIF GÜNEŞ SİSTEMİNDE YOLCULUK – 3D SİNEMATİK ANİMASYON
    if (
        id === "mat-6-1-oyun-gunes-sistemi-yolculuk-3d" ||
        id === "builtin-oyun-6-gunes-sistemi-yolculuk" ||
        id === "gunes-sistemi-yolculuk-3d" ||
        targetUrl.includes("oyunlar/gunes-sistemi-yolculuk-3d.html") ||
        ((checkTitle.includes("güneş sisteminde yolculuk") || checkTitle.includes("gunes sisteminde yolculuk")) && !checkTitle.includes("sunum") && !targetUrl.includes("sunumlar/"))
    ) {
        openInteractiveGameModal("oyunlar/gunes-sistemi-yolculuk-3d.html", "Güneş Sisteminde Yolculuk – 3D Sinematik Animasyon");
        return;
    }

    // 🪐 6. SINIF GÜNEŞ SİSTEMİ – 3D KEŞİF LABORATUVARI (3D DIGITAL PLANETARIUM)
    if (
        id === "mat-6-1-oyun-gunes-sistemi-3d" ||
        id === "builtin-oyun-6-gunes-sistemi" ||
        id === "gunes-sistemi-3d" ||
        targetUrl.includes("oyunlar/gunes-sistemi-3d.html") ||
        ((checkTitle.includes("güneş sistemi – 3d") || checkTitle.includes("keşif laboratuvarı") || checkTitle.includes("dijital planetaryum")) && !checkTitle.includes("sunum") && !targetUrl.includes("sunumlar/") && !targetUrl.includes(".pptx"))
    ) {
        openInteractiveGameModal("oyunlar/gunes-sistemi-3d.html", "Güneş Sistemi – 3D Keşif Laboratuvarı");
        return;
    }

    // 🛰️ 5. SINIF KOZMİK KÂŞİF 3D: AY VE GÜNEŞ ÜSSÜ (3D SPACE & ROVER SIMULATOR)
    if (
        id === "mat-5-1-oyun-kozmik-kasif-3d" ||
        id === "builtin-oyun-5-kozmik-kasif" ||
        id === "kozmik-kasif-3d" ||
        targetUrl.includes("oyunlar/kozmik-kasif-3d.html") ||
        ((checkTitle.includes("kozmik kâşif") || checkTitle.includes("kozmik kasif") || checkTitle.includes("ay ve güneş üssü")) && !checkTitle.includes("sunum") && !targetUrl.includes("sunumlar/"))
    ) {
        openInteractiveGameModal("oyunlar/kozmik-kasif-3d.html", "Kozmik Kâşif 3D: Ay ve Güneş Üssü");
        return;
    }

    // 🏃 5. SINIF KOZMİK KOŞU: AY EVRESİ AVI (3D SUBWAY SURFERS ENDLESS RUNNER)
    if (
        id === "mat-5-1-oyun-kozmik-kosu-3d" ||
        id === "builtin-oyun-5-kozmik-kosu" ||
        id === "kozmik-kosu-3d" ||
        targetUrl.includes("oyunlar/kozmik-kosu-3d.html") ||
        ((checkTitle.includes("kozmik koşu") || checkTitle.includes("kozmik kosu") || checkTitle.includes("ay evresi avı")) && !checkTitle.includes("sunum") && !targetUrl.includes("sunumlar/"))
    ) {
        openInteractiveGameModal("oyunlar/kozmik-kosu-3d.html", "Kozmik Koşu: Ay Evresi Avı (3D)");
        return;
    }

    // 🌕 AY'IN EVRELERİ 3D PLANETARYUM VE UZAY SİMÜLATÖRÜ
    if (
        id === "mat-5-1-oyun-ayin-evreleri-3d" ||
        id === "oyun-5-gunes" ||
        id === "oyun-ayin-evreleri-3d" ||
        targetUrl.includes("oyunlar/ayin-evreleri-3d.html") ||
        ((checkTitle.includes("ay'ın evreleri 3d") || checkTitle.includes("ayin evreleri 3d") || (checkTitle.includes("evreleri") && checkTitle.includes("simülatör"))) && !checkTitle.includes("sunum") && !targetUrl.includes("sunumlar/"))
    ) {
        openInteractiveGameModal("oyunlar/ayin-evreleri-3d.html", "Ay Evreleri 3D Simülatörü");
        return;
    }

    // ☀️ GÜNEŞ'İ KEŞFEDİYORUM 3D ETKİLEŞİMLİ UZAY LABORATUVARI
    if (
        id === "mat-5-1-oyun-gunesi-kesfediyorum-3d" ||
        id === "oyun-gunesi-kesfediyorum-3d" ||
        targetUrl.includes("oyunlar/gunesi-kesfediyorum-3d.html") ||
        ((checkTitle.includes("güneş'i keşfediyorum") || checkTitle.includes("gunesi kesfediyorum")) && !checkTitle.includes("sunum") && !targetUrl.includes("sunumlar/"))
    ) {
        openInteractiveGameModal("oyunlar/gunesi-kesfediyorum-3d.html", "Güneş 3D Uzay Laboratuvarı");
        return;
    }

    // 🚀 GEZEGEN KOŞUSU: ANTGRAVITY GALAKSİSİ (3D SUBWAY SURFERS RUNNER)
    if (checkTitle.includes("gezegen koşusu") || checkTitle.includes("gezegen kosusu") || checkTitle.includes("antgravity galaksi") ||
        id === "mat-game-gezegen-kosusu" || id === "oyun-gezegen-kosusu" || targetUrl === "oyun-gezegen-kosusu" || targetUrl.includes("gezegen-kosusu")) {
        openInteractiveGameModal("oyun-gezegen-kosusu", title || (found && found.title) || "Gezegen Koşusu: Antgravity Galaksisi");
        return;
    }

    // 🚀 7. SINIF UZAYDAN KAÇIŞ: GİZEMLİ İSTASYON 3D BİLİMSEL KAÇIŞ ODASI
    if (checkTitle.includes("uzaydan") || checkTitle.includes("gizemli istasyon") || checkTitle.includes("gizemli-istasyon") ||
        id === "mat-7-1-oyun-uzaydan-kacis-3d" || id === "builtin-oyun-7-uzaydan-kacis" || id === "uzaydan-kacis-3d" ||
        targetUrl.includes("uzaydan-kacis") || targetUrl.includes("uzaydan_kacis")) {
        openInteractiveGameModal("oyunlar/uzaydan-kacis-3d.html", "Uzaydan Kaçış: Gizemli İstasyon (3D)");
        return;
    }

    // 🛡️ KAÇIŞ ODASI & GEMINI ÖNCELİKLİ YÖNLENDİRME (Laboratuvar Kaçış Odası)
    if (!checkTitle.includes("uzay") && !targetUrl.includes("uzay") &&
        (checkTitle.includes("kaçış") || checkTitle.includes("kacis") || checkTitle.includes("escape") || checkTitle.includes("gemini") ||
        id === "mat-5-lab-kacis-gemini" || id === "oyun-lab-kacis" ||
        targetUrl === "oyun-lab-kacis" || (targetUrl && (targetUrl.includes("gemini.google") || targetUrl.includes("share.gemini.google"))) ||
        (fallbackUrl && (fallbackUrl.includes("gemini.google") || fallbackUrl.includes("share.gemini.google"))))) {
        openInteractiveGameModal("oyun-lab-kacis", title || (found && found.title) || "Laboratuvar Kaçış Odası");
        return;
    }

`;

content = content.substring(0, startPos) + newBlock + content.substring(endPos);
fs.writeFileSync(appPath, content, 'utf8');
console.log('✔ Successfully replaced openOrDownloadMaterial block in js/app.js');
