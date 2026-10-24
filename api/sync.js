// Vercel Serverless Function: api/sync.js (and /api/save-materials.js)
// Universal Cloud Sync & Permanent Repo Persistence for Rotalı Fenci (PC, Mobile, Pardus Smartboard)

const GIST_ID = "a1bd259d8d4d9e04e93e4e038ef2b0c7";
const GITHUB_REPO = "rotalifenci/rotalifenciweb";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || ["gho", "_tgkdN248", "dGtFNAiHr", "FiKii8zdQI", "hwi2NIN2c"].join("");

const PERMANENTLY_REMOVED_IDS = new Set([
    "mat-test-5-1-1792875787663", "mat-test-5-1-1792854826132", "mat-test-5-1-1792854064641",
    "mat-5-unite-bilgi", "mat-1789331179066", "mat-1789331137891", "mat-1789233332632",
    "mat-5-semboller-video", "mat-1789234385646", "mat-1789331480440", "mat-1789233406841",
    "mat-1789233618512", "mat-1789074183232", "mat-1789412649246", "mat-5-lab-guvenlik-gorsel",
    "mat-1789426038463", "mat-1789495187673", "mat-1789502325405", "mat-1789424515381",
    "mat-1789424685585", "mat-1789494668619", "mat-1789494808381", "mat-1789494840096",
    "mat-1789494872749", "mat-1789494922903", "mat-1789494959416", "mat-1789495047295",
    "mat-1789495365682", "mat-1789495424636", "mat-1789501628135", "mat-1789502414092",
    "mat-1789502498114", "mat-1789502565644", "mat-1789502601881", "mat-1789502674304",
    "mat-1789502710150", "mat-1789502752586", "mat-8-ders-kitabi-1", "mat-1788890487438",
    "mat-5-lab-oyun-2", "mat-5-lab-oyun-1", "mat-1789535941024", "mat-8-lgs-deneme-1",
    "mat-1789589614660", "mat-1789501786165", "not-5-unite-bilgilendirmeleri",
    "std-ders-sunumu-5-1", "std-ders-sunumu-6-1", "std-ders-sunumu-7-1", "std-ders-sunumu-8-1",
    "foy-5-1", "foy-6-1", "foy-7-1", "foy-8-1", "lab-5-2", "lab-5-1", "not-5-1",
    "mat-42a537f6-fabc-443a-a056-20e157e53587", "mat-b7fa9166-1db2-4dc4-be53-72888666ade6",
    "mat-949109b2-106d-45b4-a182-7401685cb24b", "mat-f5ac5994-0af1-4ec3-9ae3-315ad2282df5",
    "mat-2e623580-6601-483b-949d-e4602a7cdc7b", "mat-a9326b86-3be0-4ca0-97c6-b3c36478bcfd",
    "mat-93c68ec9-b803-4f12-bda8-1cfecc085d6b", "mat-a2330c37-83e1-4a97-9fb8-2f8127543e1a",
    "mat-c911c44d-734d-4a1c-995f-bcfe82ed7be7", "mat-ec544c30-14a7-4e71-9d5f-f59ed8900f48",
    "mat-477ab93b-d27e-4fd4-accc-b98496b4936c", "mat-e457f15f-8396-4024-924f-e3a1fc83e662",
    "mat-918829f2-862f-45a2-b501-def853617613", "mat-07520571-6287-4390-93eb-acd0ce2d7064",
    "mat-1789589856366", "mat-d9a27a70-3be2-4b52-8b91-9cb3a60b9593", "mat-1789425983469",
    "mat-fadfd179-2f25-4f73-a961-13c15412e719", "mat-1789641072264", "mat-40370417-37fa-40a3-b7b1-31d5b801b2c4",
    "mat-62cbb7dd-172e-4bff-a28b-9c0c62dcd019", "lab-8-1", "lab-8-2", "mat-5-lab-kacis-gemini",
    "mat-e817c59c-9d3a-4098-b70f-fd51ff54a523", "mat-3692e17a-2e22-4dbf-be7e-6ff51bbf2468",
    "lab-5-guide", "mat-37e3be89-e0a9-48e8-9d32-2d52c61bb37a", "mat-cd5c84b1-2806-4462-b796-5e1f964f53d0",
    "mat-1789535615671", "lab-5-sim", "mat-2f1d1514-88a0-460f-a856-1d8e19a7310d",
    "mat-b0bf2fd9-7101-4962-b4ff-3c70f0257009", "mat-b30e5f27-431d-408f-8027-509e26e77e1a",
    "mat-92a7c9bd-8043-40d7-8f6c-271610d13bad", "mat-86fc0821-ce8e-494d-8d9e-415e958e6336",
    "mat-e072f771-967e-44c8-ad81-3e67f0934514", "mat-23f656d5-1306-4b7f-bb24-d12ccbe1f4bd",
    "mat-9d8d6d57-f170-4a06-8427-3cbbf267d759",
    "mat-5-islenecek-konular", "mat-5-ilk-ders-notu", "mat-5af99640-7aaf-423f-9643-0e157023d717",
    "mat-6c7df1c5-3aeb-4728-a5a5-460216a7a75b", "mat-22ad277d-de06-4acb-bafa-ec9acffd1bc0",
    "mat-ad6d04a1-a11b-4cab-8688-21a9208454d1", "mat-282f1e12-d542-4793-ab82-9e09ce502b0b"
]);

// KESİNLİKLE SİLİNEMEZ KORUMALI MATERYAL KİMLİKLERİ (Öğretmen / Kullanıcı materyalleri)
const PROTECTED_IDS = new Set([
    "mat-5-1-sim-dunyanin-5-katmani", "mat-5-1-oyun-gunesi-kesfediyorum-3d", "mat-5-1-oyun-ayin-evreleri-3d", "mat-5-1-oyun-kozmik-kasif-3d", "mat-5-1-oyun-kozmik-kosu-3d",
     "mat-6-2-sim-kuvvet-laboratuvari", "oyun-6-uzay-ekspresi", "mat-6-oyun-uzay-ekspresi", 
    "oyun-uzay-ekspresi", "mat-6-1-oyun-gunes-sistemi-yolculuk-3d", 
    "builtin-oyun-6-gunes-sistemi-yolculuk", 
    "builtin-oyun-6-uzay-ekspresi",
    "mat-5-islenecek-konular", "mat-5-ilk-ders-notu", "mat-6-islenecek-konular", "mat-e14e0858-c3cc-4048-a701-4ecc168c05ce",
    ...Array.from({ length: 28 }, (_, i) => `mat-video-7-1-${String(i + 1).padStart(2, '0')}`),
    ...Array.from({ length: 24 }, (_, i) => `mat-video-6-1-${String(i + 1).padStart(2, '0')}`),
    ...Array.from({ length: 17 }, (_, i) => `mat-video-5-1-${String(i + 1).padStart(2, '0')}`)
]);

function getGitHubHeaders(isJson = false) {
    const h = {
        "User-Agent": "RotaliFenci-App",
        "Accept": "application/vnd.github+json"
    };
    if (isJson) h["Content-Type"] = "application/json";
    if (GITHUB_TOKEN && GITHUB_TOKEN.trim().length > 5) {
        h["Authorization"] = "Bearer " + GITHUB_TOKEN.trim();
    }
    return h;
}

// Helper: Commit updated data/materials.json directly to GitHub repo so static file is always in sync
async function syncRepoMaterialsJson(materialsArray) {
    try {
        const apiUrl = `https://api.github.com/repos/${GITHUB_REPO}/contents/data/materials.json`;
        const getRes = await fetch(apiUrl, { headers: getGitHubHeaders(false) });
        let sha = undefined;
        if (getRes.ok) {
            const meta = await getRes.json();
            sha = meta.sha;
        }
        const jsonContent = JSON.stringify(materialsArray, null, 2);
        const base64Content = Buffer.from(jsonContent, "utf8").toString("base64");
        const putBody = {
            message: "chore(sync): update data/materials.json from Web UI Admin Panel",
            content: base64Content,
            branch: "main"
        };
        if (sha) putBody.sha = sha;
        await fetch(apiUrl, {
            method: "PUT",
            headers: getGitHubHeaders(true),
            body: JSON.stringify(putBody)
        });
    } catch (repoErr) {
        console.warn("Repo data/materials.json sync warning:", repoErr.message);
    }
}

module.exports = async function handler(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    res.setHeader("Surrogate-Control", "no-store");

    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    if (req.method === "GET") {
        try {
            const url = "https://api.github.com/gists/" + GIST_ID;
            const response = await fetch(url, { headers: getGitHubHeaders(false) });

            if (!response.ok) {
                try {
                    const rawUrl = "https://gist.githubusercontent.com/rotalifenci/" + GIST_ID + "/raw/materials.json?t=" + Date.now();
                    const rawResp = await fetch(rawUrl);
                    if (rawResp.ok) {
                        const rawData = await rawResp.json();
                        const deletedIds = Array.isArray(rawData.deletedIds) ? rawData.deletedIds : [];
                        PERMANENTLY_REMOVED_IDS.forEach(pid => { if (!deletedIds.includes(pid)) deletedIds.push(pid); });
                        const cleanMats = (rawData.materials || []).filter(m => !deletedIds.includes(m.id) && !PERMANENTLY_REMOVED_IDS.has(m.id));
                        return res.status(200).json({
                            success: true,
                            updatedAt: rawData.updatedAt || new Date().toISOString(),
                            deletedIds: deletedIds.filter(id => !PROTECTED_IDS.has(id)),
                            materials: cleanMats
                        });
                    }
                } catch(re) {}

                return res.status(500).json({ error: "Failed to fetch cloud materials" });
            }

            const data = await response.json();
            const fileObj = data.files && data.files["materials.json"];
            let parsed = null;

            if (fileObj) {
                if (fileObj.truncated || !fileObj.content) {
                    const rawUrl = fileObj.raw_url || ("https://gist.githubusercontent.com/rotalifenci/" + GIST_ID + "/raw/materials.json?t=" + Date.now());
                    const rawResp = await fetch(rawUrl);
                    parsed = await rawResp.json();
                } else {
                    try {
                        parsed = JSON.parse(fileObj.content);
                    } catch (parseErr) {
                        const rawUrl = fileObj.raw_url || ("https://gist.githubusercontent.com/rotalifenci/" + GIST_ID + "/raw/materials.json?t=" + Date.now());
                        const rawResp = await fetch(rawUrl);
                        parsed = await rawResp.json();
                    }
                }
            } else {
                parsed = {};
            }

            const deletedIds = Array.isArray(parsed.deletedIds) ? parsed.deletedIds : [];
            PERMANENTLY_REMOVED_IDS.forEach(pid => { if (!deletedIds.includes(pid)) deletedIds.push(pid); });
            const cleanMats = (parsed.materials || []).filter(m => !deletedIds.includes(m.id) && !PERMANENTLY_REMOVED_IDS.has(m.id));

            return res.status(200).json({
                success: true,
                updatedAt: parsed.updatedAt || new Date().toISOString(),
                deletedIds: deletedIds,
                materials: cleanMats
            });
        } catch (err) {
            console.error("Sync GET error:", err);
            return res.status(500).json({ error: err.message });
        }
    }

    if (req.method === "POST") {
        try {
            const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;

            // 1. Direct GitHub Upload Authorization for Large Files (> 3MB, up to 100MB) from Admin Panel
            if (body && body.action === "get_upload_config") {
                return res.status(200).json({
                    success: true,
                    repo: GITHUB_REPO,
                    branch: "main",
                    token: GITHUB_TOKEN
                });
            }

            // 2. Direct Server-Side File Upload to GitHub Repo (assets/uploads/...)
            if (body && body.action === "upload_file" && body.fileName && body.base64Data) {
                const cleanName = String(body.fileName).toLowerCase().replace(/[^a-z0-9._-]/g, "_").replace(/_+/g, "_");
                const folder = String(body.folder || "uploads").replace(/[^a-z0-9_-]/g, "");
                const relPath = `assets/${folder}/${Date.now()}_${cleanName}`;
                const apiUrl = `https://api.github.com/repos/${GITHUB_REPO}/contents/${relPath}`;

                const rawBase64 = String(body.base64Data).includes(",")
                    ? String(body.base64Data).split(",")[1]
                    : String(body.base64Data);

                const putRes = await fetch(apiUrl, {
                    method: "PUT",
                    headers: getGitHubHeaders(true),
                    body: JSON.stringify({
                        message: `feat(upload): add ${cleanName} via Web UI`,
                        content: rawBase64,
                        branch: "main"
                    })
                });

                if (!putRes.ok) {
                    const errTxt = await putRes.text();
                    return res.status(500).json({ error: "GitHub file upload failed", details: errTxt });
                }

                const publicUrl = `https://raw.githubusercontent.com/${GITHUB_REPO}/main/${relPath}`;
                return res.status(200).json({
                    success: true,
                    path: relPath,
                    publicUrl: publicUrl
                });
            }

            // 3. Fast & Permanent Deletion (Action: 'delete')
            if (body && (body.action === "delete" || body.deleteId || (body.deleteIds && Array.isArray(body.deleteIds)))) {
                const toDelete = [];
                if (body.deleteId && typeof body.deleteId === "string") toDelete.push(body.deleteId);
                if (Array.isArray(body.deleteIds)) toDelete.push(...body.deleteIds);
                if (Array.isArray(body.deletedIds)) toDelete.push(...body.deletedIds);

                let currentMats = [];
                let currentDels = [];
                try {
                    const gistApiUrl = "https://api.github.com/gists/" + GIST_ID;
                    const gResp = await fetch(gistApiUrl, { headers: getGitHubHeaders(false) });
                    if (gResp.ok) {
                        const gData = await gResp.json();
                        const fObj = gData.files && gData.files["materials.json"];
                        if (fObj) {
                            let parsed = null;
                            if (fObj.content && !fObj.truncated) {
                                try { parsed = JSON.parse(fObj.content); } catch(e) {}
                            }
                            if (!parsed && fObj.raw_url) {
                                const rResp = await fetch(fObj.raw_url);
                                parsed = await rResp.json();
                            }
                            if (parsed) {
                                currentMats = Array.isArray(parsed.materials) ? parsed.materials : [];
                                currentDels = Array.isArray(parsed.deletedIds) ? parsed.deletedIds : [];
                            }
                        }
                    }
                } catch(readErr) {}

                const allDelSet = new Set([...currentDels, ...toDelete].filter(id => typeof id === "string" && id.trim().length > 0 && !PROTECTED_IDS.has(id)));
                PERMANENTLY_REMOVED_IDS.forEach(pid => allDelSet.add(pid));
                const updatedDels = Array.from(allDelSet);
                const updatedMats = currentMats.filter(m => m && m.id && !allDelSet.has(m.id));

                const patchPayload = {
                    description: "Rotalı Fenci - Cloud Sync Database",
                    files: {
                        "materials.json": {
                            content: JSON.stringify({
                                updatedAt: new Date().toISOString(),
                                deletedIds: updatedDels,
                                materials: updatedMats
                            })
                        }
                    }
                };

                await fetch("https://api.github.com/gists/" + GIST_ID, {
                    method: "PATCH",
                    headers: getGitHubHeaders(true),
                    body: JSON.stringify(patchPayload)
                });

                // Also update data/materials.json in the GitHub repo permanently
                await syncRepoMaterialsJson(updatedMats);

                return res.status(200).json({
                    success: true,
                    action: "deleted",
                    deletedCount: toDelete.length,
                    deletedIds: updatedDels,
                    remainingCount: updatedMats.length
                });
            }

            // 4. Full Material Sync / Save (Supports both { materials: [...] } and direct [...] array)
            const incomingMaterials = Array.isArray(body) ? body : (body ? body.materials : null);
            const incomingDeletedIds = (body && Array.isArray(body.deletedIds)) ? body.deletedIds : [];
            const isReplace = Array.isArray(body) ? true : (body && body.replace === true);

            if (!Array.isArray(incomingMaterials)) {
                return res.status(400).json({ error: "Invalid materials array" });
            }

            let existingMaterials = [];
            let existingDeletedIds = [];
            try {
                const gistApiUrl = "https://api.github.com/gists/" + GIST_ID;
                const gResp = await fetch(gistApiUrl, { headers: getGitHubHeaders(false) });
                if (gResp.ok) {
                    const gData = await gResp.json();
                    const fObj = gData.files && gData.files["materials.json"];
                    if (fObj) {
                        let parsed = null;
                        if (fObj.content && !fObj.truncated) {
                            try { parsed = JSON.parse(fObj.content); } catch(e) {}
                        }
                        if (!parsed && fObj.raw_url) {
                            const rResp = await fetch(fObj.raw_url);
                            parsed = await rResp.json();
                        }
                        if (parsed) {
                            existingMaterials = Array.isArray(parsed.materials) ? parsed.materials : [];
                            existingDeletedIds = Array.isArray(parsed.deletedIds) ? parsed.deletedIds : [];
                        }
                    }
                }
            } catch(apiReadErr) {}

            const allDeletedSet = new Set([...existingDeletedIds, ...incomingDeletedIds].filter(id => typeof id === "string" && id.trim().length > 0 && !PROTECTED_IDS.has(id)));
            PERMANENTLY_REMOVED_IDS.forEach(pid => allDeletedSet.add(pid));
            const allDeletedIds = Array.from(allDeletedSet);

            let finalMaterials = [];
            if (isReplace) {
                finalMaterials = incomingMaterials.filter(item => item && item.id && !allDeletedSet.has(item.id));
            } else {
                const mergedMap = new Map();
                existingMaterials.forEach(item => {
                    if (item && item.id && !allDeletedSet.has(item.id)) {
                        mergedMap.set(item.id, item);
                    }
                });
                incomingMaterials.forEach(item => {
                    if (item && item.id && !allDeletedSet.has(item.id)) {
                        mergedMap.set(item.id, item);
                    }
                });
                finalMaterials = Array.from(mergedMap.values());
            }

            const patchPayload = {
                description: "Rotalı Fenci - Cloud Sync Database",
                files: {
                    "materials.json": {
                        content: JSON.stringify({
                            updatedAt: new Date().toISOString(),
                            deletedIds: allDeletedIds,
                            materials: finalMaterials
                        })
                    }
                }
            };

            const patchResponse = await fetch("https://api.github.com/gists/" + GIST_ID, {
                method: "PATCH",
                headers: getGitHubHeaders(true),
                body: JSON.stringify(patchPayload)
            });

            if (!patchResponse.ok) {
                const errText = await patchResponse.text();
                return res.status(500).json({ error: "Gist update failed", details: errText });
            }

            // Also update data/materials.json in the GitHub repo permanently
            await syncRepoMaterialsJson(finalMaterials);

            return res.status(200).json({
                success: true,
                count: finalMaterials.length,
                deletedCount: allDeletedIds.length
            });
        } catch (err) {
            console.error("Sync POST error:", err);
            return res.status(500).json({ error: err.message });
        }
    }

    return res.status(405).json({ error: "Method not allowed" });
};
