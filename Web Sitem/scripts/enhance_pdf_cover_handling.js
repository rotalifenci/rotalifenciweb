const fs = require('fs');
const path = require('path');
const vm = require('vm');

const appJsPath = path.join(__dirname, '..', 'js', 'app.js');
let content = fs.readFileSync(appJsPath, 'utf8').replace(/\r\n/g, '\n');

// 1. In unitCustomNotes img tag, add data-pdf-item-id and data-pdf-url
content = content.replace(
    '<img src="${resolveMaterialCover(item)}" alt="${item.title}" onerror="handleImageCoverError',
    '<img src="${resolveMaterialCover(item)}" data-pdf-item-id="${item.id}" data-pdf-url="${item.fileUrl || \'\'}" alt="${item.title}" onerror="handleImageCoverError'
);

// 2. In allKitapItems img tag, add data-pdf-item-id and data-pdf-url
content = content.replace(
    '<img src="${cover}" alt="${item.title}" onerror="this.src=\'assets/kapak-${grade.number || 5}.jpg\'"',
    '<img src="${cover}" data-pdf-item-id="${item.id}" data-pdf-url="${item.fileUrl || \'\'}" alt="${item.title}" onerror="this.src=\'assets/kapak-${grade.number || 5}.jpg\'"'
);

// 3. In resolveMaterialCover, check _pdfThumbCache and check for matching _cover.jpg
const resolveCoverMarker = 'function resolveMaterialCover(item) {\n    if (!item) return "assets/kapak-5.jpg";';
const resolveCoverEnhanced = `function resolveMaterialCover(item) {
    if (!item) return "assets/kapak-5.jpg";
    if (typeof window !== "undefined" && window._pdfThumbCache && item.id && window._pdfThumbCache[item.id]) {
        return window._pdfThumbCache[item.id];
    }`;

if (content.includes(resolveCoverMarker)) {
    content = content.replace(resolveCoverMarker, resolveCoverEnhanced);
    console.log('✔ resolveMaterialCover cache kontrolü eklendi.');
}

// 4. In loadMissingPdfThumbnails, trigger whenever filterDersNotuUnits or toggleAccordionSection runs
content = content.replace(
    'function filterDersNotuUnits(targetUnit) {',
    'function filterDersNotuUnits(targetUnit) {\n    setTimeout(() => { if (typeof loadMissingPdfThumbnails === "function") loadMissingPdfThumbnails(); }, 120);'
);

// 5. In handleAdvancedMaterialSubmit, prioritize PDF page 1 extraction
const oldCoverExtractBlock = `    // Eğer kapak seçilmediyse veya otomatik çıkarım henüz tamamlanmadıysa şimdi tamamla
    if (!chosenCover && currentUploadedFile) {
        const ext = (currentUploadedFile.name || "").split('.').pop().toLowerCase();
        try {
            chosenCover = await autoExtractCoverFromFile(currentUploadedFile, ext);
        } catch(e) {}
    }`;

const newCoverExtractBlock = `    // Eğer kapak seçilmediyse veya otomatik çıkarım henüz tamamlanmadıysa (veya SVG placeholder ise) PDF 1. sayfayı zorla
    if ((!chosenCover || chosenCover.startsWith("data:image/svg")) && currentUploadedFile) {
        const ext = (currentUploadedFile.name || "").split('.').pop().toLowerCase();
        if (ext === "pdf" || (currentUploadedFile.type && currentUploadedFile.type.includes("pdf"))) {
            try {
                const pdfFirstPage = await extractCoverFromPdfSource(currentUploadedFile);
                if (pdfFirstPage) {
                    chosenCover = pdfFirstPage;
                    currentUploadedCoverDataUrl = pdfFirstPage;
                }
            } catch(pErr) {}
        }
        if (!chosenCover || chosenCover.startsWith("data:image/svg")) {
            try {
                chosenCover = await autoExtractCoverFromFile(currentUploadedFile, ext);
            } catch(e) {}
        }
    }`;

if (content.includes(oldCoverExtractBlock)) {
    content = content.replace(oldCoverExtractBlock, newCoverExtractBlock);
    console.log('✔ handleAdvancedMaterialSubmit PDF 1. sayfa önceliği eklendi.');
}

// Verify syntax
console.log('Verifying syntax with vm.Script...');
new vm.Script(content);
console.log('Syntax OK!');

fs.writeFileSync(appJsPath, content, 'utf8');
console.log('js/app.js başarıyla güncellendi!');
