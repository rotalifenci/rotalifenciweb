const fs = require('fs');
const path = require('path');

function patchRegex(filePath) {
    if (!fs.existsSync(filePath)) return;
    let code = fs.readFileSync(filePath, 'utf8');

    // 1. addDeletedMaterialId regex
    code = code.replace(
        /function addDeletedMaterialId\(id\)\s*\{\s*if \(!id \|\| typeof id !== "string" \|\| !id\.trim\(\)\) return;/,
        'function addDeletedMaterialId(id) {\n    if (!id || typeof id !== "string" || !id.trim() || (typeof PROTECTED_MATERIAL_IDS !== "undefined" && PROTECTED_MATERIAL_IDS.has(id))) return;'
    );

    // 2. serverDeletedSet in verifySmartboardSync regex
    code = code.replace(
        /const serverDeletedSet = new Set\(\[\s*\.\.\.\(typeof getDeletedMaterialIds === "function" \? getDeletedMaterialIds\(\) : \[\]\),\s*\.\.\.apiDeletedIds,\s*"mat-5-unite-bilgi",\s*"mat-5-lab-guvenlik-gorsel"\s*\]\);/,
        `const serverDeletedSet = new Set([\n            ...(typeof getDeletedMaterialIds === "function" ? getDeletedMaterialIds() : []),\n            ...apiDeletedIds,\n            "mat-5-unite-bilgi",\n            "mat-5-lab-guvenlik-gorsel"\n        ].filter(id => !(typeof PROTECTED_MATERIAL_IDS !== "undefined" && PROTECTED_MATERIAL_IDS.has(id))));`
    );

    fs.writeFileSync(filePath, code, 'utf8');
    console.log(`Updated regex protections in ${filePath}`);
}

patchRegex(path.join(__dirname, '..', 'js', 'app.js'));
patchRegex(path.join(__dirname, '..', '..', 'js', 'app.js'));
