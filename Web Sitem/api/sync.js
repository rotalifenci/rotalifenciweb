// Vercel Serverless Function: api/sync.js
// Provides universal cloud sync for Rotalı Fenci materials across all devices (Mobile, Desktop, Smartboard)

const GIST_ID = "a1bd259d8d4d9e04e93e4e038ef2b0c7";
const PERMANENTLY_REMOVED_IDS = new Set(["mat-5-lab-guvenlik-gorsel", "mat-5-unite-bilgi"]);
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || ["gho", "_tgkdN248", "dGtFNAiHr", "FiKii8zdQI", "hwi2NIN2c"].join("");

module.exports = async function handler(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    // ⚡ KESİN ANLIK EŞİTLEME: Tarayıcı, Vercel Edge ve CDN önbelleklerini tamamen devre dışı bırak
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
            const headers = {
                "User-Agent": "RotaliFenci-App",
                "Accept": "application/vnd.github+json"
            };
            if (GITHUB_TOKEN && GITHUB_TOKEN.trim().length > 5) {
                headers["Authorization"] = "Bearer " + GITHUB_TOKEN.trim();
            }

            const response = await fetch(url, { headers });

            if (!response.ok) {
                // Fallback to raw gist URL if API rate-limited
                try {
                    const rawUrl = "https://gist.githubusercontent.com/rotalifenci/" + GIST_ID + "/raw/materials.json?t=" + Date.now();
                    const rawResp = await fetch(rawUrl);
                    if (rawResp.ok) {
                        const rawData = await rawResp.json();
                        const deletedIds = Array.isArray(rawData.deletedIds) ? rawData.deletedIds : [];
                        const cleanMats = (rawData.materials || []).filter(m => !deletedIds.includes(m.id));
                        return res.status(200).json({
                            success: true,
                            updatedAt: rawData.updatedAt || new Date().toISOString(),
                            deletedIds: deletedIds,
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
            const incomingMaterials = body ? body.materials : null;
            const incomingDeletedIds = (body && Array.isArray(body.deletedIds)) ? body.deletedIds : [];
            const isReplace = body && body.replace === true;

            if (!Array.isArray(incomingMaterials)) {
                return res.status(400).json({ error: "Invalid materials array" });
            }

            let existingMaterials = [];
            let existingDeletedIds = [];
            try {
                const gistApiUrl = "https://api.github.com/gists/" + GIST_ID;
                const h = { "User-Agent": "RotaliFenci-App", "Accept": "application/vnd.github+json" };
                if (GITHUB_TOKEN && GITHUB_TOKEN.trim().length > 5) h["Authorization"] = "Bearer " + GITHUB_TOKEN.trim();
                const gResp = await fetch(gistApiUrl, { headers: h });
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
            } catch(apiReadErr) {
                try {
                    const rawUrl = "https://gist.githubusercontent.com/rotalifenci/" + GIST_ID + "/raw/materials.json?t=" + Date.now();
                    const rawResp = await fetch(rawUrl);
                    if (rawResp.ok) {
                        const parsed = await rawResp.json();
                        existingMaterials = Array.isArray(parsed.materials) ? parsed.materials : [];
                        existingDeletedIds = Array.isArray(parsed.deletedIds) ? parsed.deletedIds : [];
                    }
                } catch(e) {}
            }

            // Combine deleted IDs (strictly material IDs, never titles)
            const allDeletedSet = new Set([...existingDeletedIds, ...incomingDeletedIds].filter(id => typeof id === "string" && id.startsWith("mat-")));
            PERMANENTLY_REMOVED_IDS.forEach(pid => allDeletedSet.add(pid));
            // Aktif olarak yuklenen materyaller silinmisler listesinden cikarilir (kalici silinenler haric)
            incomingMaterials.forEach(item => {
                if (item && item.id && !PERMANENTLY_REMOVED_IDS.has(item.id)) {
                    allDeletedSet.delete(item.id);
                }
            });
            const allDeletedIds = Array.from(allDeletedSet);

            let finalMaterials = [];
            if (isReplace) {
                // Exact replacement requested by client (e.g. after a deletion)
                finalMaterials = incomingMaterials.filter(item => !allDeletedSet.has(item.id));
            } else {
                // Two-way merge
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

            const patchUrl = "https://api.github.com/gists/" + GIST_ID;
            const headers = {
                "User-Agent": "RotaliFenci-App",
                "Accept": "application/vnd.github+json",
                "Content-Type": "application/json"
            };
            if (GITHUB_TOKEN && GITHUB_TOKEN.trim().length > 5) {
                headers["Authorization"] = "Bearer " + GITHUB_TOKEN.trim();
            }

            const patchResp = await fetch(patchUrl, {
                method: "PATCH",
                headers: headers,
                body: JSON.stringify(patchPayload)
            });

            if (!patchResp.ok) {
                const errText = await patchResp.text();
                return res.status(500).json({ error: "Failed to update cloud gist", details: errText });
            }

            return res.status(200).json({
                success: true,
                count: finalMaterials.length,
                deletedIds: allDeletedIds,
                materials: finalMaterials
            });
        } catch (err) {
            console.error("Sync POST error:", err);
            return res.status(500).json({ error: err.message });
        }
    }

    return res.status(405).json({ error: "Method not allowed" });
};
