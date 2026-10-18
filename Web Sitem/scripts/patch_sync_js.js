const fs = require('fs');
const path = require('path');

function patchSyncJs(filePath) {
    if (!fs.existsSync(filePath)) return;
    let code = fs.readFileSync(filePath, 'utf8');

    // Remove restored IDs from PERMANENTLY_REMOVED_IDS
    code = code.replace('"oyun-6-uzay-ekspresi", "mat-game-gezegen-kosusu", "mat-9d8d6d57-f170-4a06-8427-3cbbf267d759",', '"mat-9d8d6d57-f170-4a06-8427-3cbbf267d759",');
    code = code.replace('"mat-6-oyun-uzay-ekspresi", "oyun-uzay-ekspresi", "mat-4e34f261-c437-4ec5-98d2-776e49ffac4c",', '"mat-4e34f261-c437-4ec5-98d2-776e49ffac4c",');

    // Add PROTECTED_IDS set right after PERMANENTLY_REMOVED_IDS
    if (!code.includes("const PROTECTED_IDS = new Set([")) {
        const insertAfter = "]);\n";
        const idx = code.indexOf(insertAfter);
        if (idx !== -1) {
            const protectedBlock = `\n// KESİNLİKLE SİLİNEMEZ KORUMALI MATERYAL KİMLİKLERİ (Öğretmen / Kullanıcı materyalleri)
const PROTECTED_IDS = new Set([
    "mat-game-gezegen-kosusu", "oyun-6-uzay-ekspresi", "mat-6-oyun-uzay-ekspresi", 
    "oyun-uzay-ekspresi", "mat-6-1-oyun-gunes-sistemi-3d", "mat-6-1-oyun-gunes-sistemi-yolculuk-3d", 
    "builtin-oyun-6-gunes-sistemi", "builtin-oyun-6-gunes-sistemi-yolculuk", 
    "builtin-oyun-6-gezegen-kosusu", "builtin-oyun-6-uzay-ekspresi",
    "mat-5-islenecek-konular", "mat-5-ilk-ders-notu", "mat-6-islenecek-konular", "mat-e14e0858-c3cc-4048-a701-4ecc168c05ce"
]);\n`;
            code = code.slice(0, idx + insertAfter.length) + protectedBlock + code.slice(idx + insertAfter.length);
        }
    }

    // Ensure GET response filters out PROTECTED_IDS from deletedIds
    code = code.replace(
        'deletedIds: deletedIds,',
        'deletedIds: deletedIds.filter(id => !PROTECTED_IDS.has(id)),'
    );

    // In POST, when merging deletedIds:
    code = code.replace(
        'const allDelSet = new Set([...currentDels, ...toDelete].filter(id => typeof id === "string" && id.trim().length > 0));',
        'const allDelSet = new Set([...currentDels, ...toDelete].filter(id => typeof id === "string" && id.trim().length > 0 && !PROTECTED_IDS.has(id)));'
    );
    code = code.replace(
        'const allDeletedSet = new Set([...existingDeletedIds, ...incomingDeletedIds].filter(id => typeof id === "string" && id.trim().length > 0));',
        'const allDeletedSet = new Set([...existingDeletedIds, ...incomingDeletedIds].filter(id => typeof id === "string" && id.trim().length > 0 && !PROTECTED_IDS.has(id)));'
    );

    fs.writeFileSync(filePath, code, 'utf8');
    console.log(`Successfully patched ${filePath}`);
}

patchSyncJs(path.join(__dirname, '..', 'api', 'sync.js'));
patchSyncJs(path.join(__dirname, '..', '..', 'api', 'sync.js'));
