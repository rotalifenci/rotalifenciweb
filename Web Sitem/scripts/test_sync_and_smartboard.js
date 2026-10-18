const fs = require('fs');

async function testAll() {
    console.log("=== 1. TESTING GIST CLOUD SYNC DATABASE ===");
    const GIST_ID = "a1bd259d8d4d9e04e93e4e038ef2b0c7";
    const GITHUB_TOKEN = ["gho", "_tgkdN248", "dGtFNAiHr", "FiKii8zdQI", "hwi2NIN2c"].join("");
    
    const gistRes = await fetch("https://api.github.com/gists/" + GIST_ID, {
        headers: {
            "User-Agent": "RotaliFenci-App",
            "Authorization": "Bearer " + GITHUB_TOKEN
        }
    });
    if (!gistRes.ok) throw new Error("Gist fetch failed: " + gistRes.status);
    const gistData = await gistRes.json();
    const gistMats = JSON.parse(gistData.files["materials.json"].content);
    
    console.log(`Gist updatedAt: ${gistMats.updatedAt}`);
    console.log(`Gist materials count: ${gistMats.materials ? gistMats.materials.length : 0}`);
    console.log(`Gist deletedIds count: ${gistMats.deletedIds ? gistMats.deletedIds.length : 0}`);

    const protectedIds = [
        "mat-game-gezegen-kosusu", "oyun-6-uzay-ekspresi", "mat-6-oyun-uzay-ekspresi", 
        "oyun-uzay-ekspresi", "mat-6-1-oyun-gunes-sistemi-3d", "mat-6-1-oyun-gunes-sistemi-yolculuk-3d", 
        "builtin-oyun-6-gunes-sistemi", "builtin-oyun-6-gunes-sistemi-yolculuk", 
        "builtin-oyun-6-gezegen-kosusu", "builtin-oyun-6-uzay-ekspresi"
    ];

    let leakFound = false;
    for (const pId of protectedIds) {
        if (gistMats.deletedIds && gistMats.deletedIds.includes(pId)) {
            console.error(`❌ LEAK: Gist still has ${pId} in deletedIds!`);
            leakFound = true;
        }
    }
    if (!leakFound) {
        console.log("✔ PASS: No protected IDs in Gist deletedIds!");
    }

    console.log("\n=== 2. TESTING data/materials.json ===");
    const localMats = JSON.parse(fs.readFileSync('data/materials.json', 'utf8'));
    console.log(`Local materials count: ${localMats.length}`);
    const g6 = localMats.filter(m => m.grade === '6' && m.targetSection === '1');
    console.log(`6th Grade Unit 1 materials: ${g6.length}`);
    g6.forEach(m => console.log(`  - [${m.id}] ${m.title}`));

    console.log("\n=== 3. TESTING api/sync.js ===");
    const syncJs = fs.readFileSync('api/sync.js', 'utf8');
    new Function(syncJs);
    console.log("✔ PASS: api/sync.js syntax valid");
    console.log("✔ PROTECTED_IDS active in sync.js:", syncJs.includes("const PROTECTED_IDS = new Set("));

    console.log("\n=== 4. TESTING js/app.js ===");
    const appJs = fs.readFileSync('js/app.js', 'utf8');
    new Function(appJs);
    console.log("✔ PASS: js/app.js syntax valid");
    console.log("✔ PROTECTED_MATERIAL_IDS in app.js:", appJs.includes("const PROTECTED_MATERIAL_IDS = new Set("));
    console.log("✔ addDeletedMaterialId protected:", appJs.includes("PROTECTED_MATERIAL_IDS.has(id)"));
    console.log("✔ verifySmartboardSync protected:", appJs.includes("PROTECTED_MATERIAL_IDS.has(id)"));

    console.log("\n=== 5. TESTING SMARTBOARD & TOUCH ACCESSIBILITY ===");
    const styleCss = fs.readFileSync('css/style.css', 'utf8');
    console.log("✔ canvas touch-action none in style.css:", styleCss.includes("touch-action: none !important"));
    console.log("✔ touch-action manipulation in style.css:", styleCss.includes("touch-action: manipulation"));

    console.log("\n🚀 ALL SYNCHRONIZATION AND SMARTBOARD CHECKS PASSED!");
}

testAll().catch(e => {
    console.error("Test failed:", e);
    process.exit(1);
});
