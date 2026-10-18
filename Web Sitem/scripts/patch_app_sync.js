const fs = require('fs');
const path = require('path');

function patchAppForSync(filePath) {
    if (!fs.existsSync(filePath)) return;
    let code = fs.readFileSync(filePath, 'utf8');

    // 1. Add PROTECTED_MATERIAL_IDS if not present
    if (!code.includes("const PROTECTED_MATERIAL_IDS = new Set([")) {
        const insertAnchor = "const PERMANENT_DELETED_MATERIAL_IDS = [";
        const idx = code.indexOf(insertAnchor);
        if (idx !== -1) {
            const protectedDef = `// 🛡️ KESİNLİKLE SİLİNEMEZ KORUMALI MATERYALLER (Öğretmen İçerikleri & Oyunlar)
const PROTECTED_MATERIAL_IDS = new Set([
    "mat-game-gezegen-kosusu", "oyun-6-uzay-ekspresi", "mat-6-oyun-uzay-ekspresi", 
    "oyun-uzay-ekspresi", "mat-6-1-oyun-gunes-sistemi-3d", "mat-6-1-oyun-gunes-sistemi-yolculuk-3d", 
    "builtin-oyun-6-gunes-sistemi", "builtin-oyun-6-gunes-sistemi-yolculuk", 
    "builtin-oyun-6-gezegen-kosusu", "builtin-oyun-6-uzay-ekspresi",
    "mat-5-islenecek-konular", "mat-5-ilk-ders-notu", "mat-6-islenecek-konular", "mat-e14e0858-c3cc-4048-a701-4ecc168c05ce"
]);\n\n`;
            code = code.slice(0, idx) + protectedDef + code.slice(idx);
        }
    }

    // 2. Protect addDeletedMaterialId
    const oldAddDel = `function addDeletedMaterialId(id) {
    if (!id || typeof id !== "string" || !id.trim()) return;`;
    const newAddDel = `function addDeletedMaterialId(id) {
    if (!id || typeof id !== "string" || !id.trim() || (typeof PROTECTED_MATERIAL_IDS !== "undefined" && PROTECTED_MATERIAL_IDS.has(id))) return;`;
    if (code.includes(oldAddDel)) {
        code = code.replace(oldAddDel, newAddDel);
    }

    // 3. Protect loadCentralizedMaterials cloudResp.deletedIds loop
    const oldCloudDelLoop = `    // Buluttan gelen silinmiş ID'leri anında işle
    if (cloudResp && Array.isArray(cloudResp.deletedIds)) {
        cloudResp.deletedIds.forEach(dId => {
            if (typeof dId === "string" && dId.trim()) addDeletedMaterialId(dId);
        });
    }`;
    const newCloudDelLoop = `    // Buluttan gelen silinmiş ID'leri anında işle (Korumalı içerikleri ASLA silme!)
    if (cloudResp && Array.isArray(cloudResp.deletedIds)) {
        cloudResp.deletedIds.forEach(dId => {
            if (typeof dId === "string" && dId.trim() && !(typeof PROTECTED_MATERIAL_IDS !== "undefined" && PROTECTED_MATERIAL_IDS.has(dId))) {
                addDeletedMaterialId(dId);
            }
        });
    }`;
    if (code.includes(oldCloudDelLoop)) {
        code = code.replace(oldCloudDelLoop, newCloudDelLoop);
    }

    // 4. Protect verifySmartboardSync serverDeletedSet
    const oldServerDeletedSet = `        const serverDeletedSet = new Set([
            ...(typeof getDeletedMaterialIds === "function" ? getDeletedMaterialIds() : []),
            ...apiDeletedIds,
            "mat-5-unite-bilgi",
            "mat-5-lab-guvenlik-gorsel"
        ]);`;
    const newServerDeletedSet = `        const serverDeletedSet = new Set([
            ...(typeof getDeletedMaterialIds === "function" ? getDeletedMaterialIds() : []),
            ...apiDeletedIds,
            "mat-5-unite-bilgi",
            "mat-5-lab-guvenlik-gorsel"
        ].filter(id => !(typeof PROTECTED_MATERIAL_IDS !== "undefined" && PROTECTED_MATERIAL_IDS.has(id))));`;
    if (code.includes(oldServerDeletedSet)) {
        code = code.replace(oldServerDeletedSet, newServerDeletedSet);
    }

    // 5. Add fullscreen to iframe allow attributes in modal handlers
    code = code.replace(
        '<iframe src="oyunlar/laboratuvar-kacis-odasi.html" class="w-full h-full border-0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope" allowfullscreen></iframe>',
        '<iframe src="oyunlar/laboratuvar-kacis-odasi.html" class="w-full h-full border-0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; fullscreen" allowfullscreen></iframe>'
    );
    code = code.replace(
        '<iframe src="oyunlar/gezegen-kosusu.html" class="w-full h-full border-0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope" allowfullscreen></iframe>',
        '<iframe src="oyunlar/gezegen-kosusu.html" class="w-full h-full border-0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; fullscreen" allowfullscreen></iframe>'
    );

    fs.writeFileSync(filePath, code, 'utf8');
    console.log(`Updated sync protections in ${filePath}`);
}

patchAppForSync(path.join(__dirname, '..', 'js', 'app.js'));
patchAppForSync(path.join(__dirname, '..', '..', 'js', 'app.js'));
