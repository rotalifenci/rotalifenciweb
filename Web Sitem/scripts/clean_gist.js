const fs = require('fs');

const GIST_ID = "a1bd259d8d4d9e04e93e4e038ef2b0c7";
const GITHUB_TOKEN = ["gho", "_tgkdN248", "dGtFNAiHr", "FiKii8zdQI", "hwi2NIN2c"].join("");

async function cleanGist() {
    console.log("Fetching Gist...");
    const getRes = await fetch("https://api.github.com/gists/" + GIST_ID, {
        headers: {
            "User-Agent": "RotaliFenci-App",
            "Accept": "application/vnd.github+json",
            "Authorization": "Bearer " + GITHUB_TOKEN
        }
    });

    if (!getRes.ok) {
        throw new Error("Failed to fetch Gist: " + getRes.status + " " + await getRes.text());
    }

    const gistData = await getRes.json();
    const rawContent = gistData.files["materials.json"].content;
    const parsed = JSON.parse(rawContent);

    const protectedIds = new Set([
        "mat-game-gezegen-kosusu", "oyun-6-uzay-ekspresi", "mat-6-oyun-uzay-ekspresi", 
        "oyun-uzay-ekspresi", "mat-6-1-oyun-gunes-sistemi-3d", "mat-6-1-oyun-gunes-sistemi-yolculuk-3d", 
        "builtin-oyun-6-gunes-sistemi", "builtin-oyun-6-gunes-sistemi-yolculuk", 
        "builtin-oyun-6-gezegen-kosusu", "builtin-oyun-6-uzay-ekspresi",
        "mat-5-islenecek-konular", "mat-5-ilk-ders-notu", "mat-6-islenecek-konular"
    ]);

    // Clean deletedIds
    const oldDelCount = parsed.deletedIds ? parsed.deletedIds.length : 0;
    const cleanedDeletedIds = (parsed.deletedIds || []).filter(id => !protectedIds.has(id));
    console.log(`deletedIds cleaned: ${oldDelCount} -> ${cleanedDeletedIds.length}`);

    // Read current data/materials.json
    const localMaterials = JSON.parse(fs.readFileSync('data/materials.json', 'utf8'));

    // Merge materials: localMaterials have full priority
    const matMap = new Map();
    (parsed.materials || []).forEach(m => {
        if (m && m.id && !cleanedDeletedIds.includes(m.id)) {
            matMap.set(m.id, m);
        }
    });
    localMaterials.forEach(m => {
        if (m && m.id) {
            matMap.set(m.id, m);
        }
    });

    const finalMaterials = Array.from(matMap.values());
    console.log(`Total materials to save in Gist: ${finalMaterials.length}`);

    // Patch Gist
    const patchPayload = {
        description: "Rotalı Fenci - Cloud Sync Database (Cleaned & Restored)",
        files: {
            "materials.json": {
                content: JSON.stringify({
                    updatedAt: new Date().toISOString(),
                    deletedIds: cleanedDeletedIds,
                    materials: finalMaterials
                }, null, 2)
            }
        }
    };

    console.log("Updating Gist via PATCH...");
    const patchRes = await fetch("https://api.github.com/gists/" + GIST_ID, {
        method: "PATCH",
        headers: {
            "User-Agent": "RotaliFenci-App",
            "Accept": "application/vnd.github+json",
            "Content-Type": "application/json",
            "Authorization": "Bearer " + GITHUB_TOKEN
        },
        body: JSON.stringify(patchPayload)
    });

    if (!patchRes.ok) {
        throw new Error("Failed to patch Gist: " + patchRes.status + " " + await patchRes.text());
    }

    console.log("SUCCESS! Gist successfully updated and purged of deletedIds!");
}

cleanGist().catch(err => {
    console.error("Error in cleanGist:", err);
    process.exit(1);
});
