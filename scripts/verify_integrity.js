const fs = require('fs');
const appJs = fs.readFileSync('js/app.js', 'utf8');

console.log('--- Checking restored IDs in PERMANENT_DELETED_MATERIAL_IDS ---');
console.log('gezegen-kosusu in PERMANENT:', appJs.includes('mat-game-gezegen-kosusu'));
console.log('oyun-6-uzay-ekspresi in PERMANENT:', appJs.includes('oyun-6-uzay-ekspresi'));
console.log('mat-6-oyun-uzay-ekspresi in PERMANENT:', appJs.includes('mat-6-oyun-uzay-ekspresi'));
console.log('oyun-uzay-ekspresi in PERMANENT:', appJs.includes('oyun-uzay-ekspresi'));

console.log('\n--- Checking builtinUnitGamesMap 6th grade ---');
const bMatch = appJs.match(/"6":\s*\{\s*"1":\s*\[([\s\S]*?)\]\s*\}/);
if (bMatch) {
    console.log(bMatch[0]);
} else {
    console.log('builtinUnitGamesMap["6"]["1"] not found!');
}

console.log('\n--- Checking deduplication logic ---');
console.log('Old over-broad gunes-sistemi check removed:', !appJs.includes('(c.fileUrl.includes("gunes-sistemi") && g.fileUrl.includes("gunes-sistemi"))'));

console.log('\n--- Checking JS Syntax ---');
try {
    new Function(appJs);
    console.log('JS SYNTAX VALID!');
} catch (err) {
    console.error('JS SYNTAX ERROR:', err);
}
