// Vercel Serverless Function: api/sync.js
// Provides universal cloud sync for Rotalı Fenci materials across all devices (Mobile, Desktop, Smartboard)

const GIST_ID = "a1bd259d8d4d9e04e93e4e038ef2b0c7";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || "";

module.exports = async function handler(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

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
                        return res.status(200).json({
                            success: true,
                            updatedAt: rawData.updatedAt || new Date().toISOString(),
                            materials: rawData.materials || []
                        });
                    }
                } catch(re) {}

                return res.status(500).json({ error: "Failed to fetch cloud materials" });
            }

            const data = await response.json();
            const fileContent = data.files && data.files["materials.json"] ? data.files["materials.json"].content : "{}";
            const parsed = JSON.parse(fileContent);

            return res.status(200).json({
                success: true,
                updatedAt: parsed.updatedAt || new Date().toISOString(),
                materials: parsed.materials || []
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

            if (!Array.isArray(incomingMaterials)) {
                return res.status(400).json({ error: "Invalid materials array" });
            }

            let existingMaterials = [];
            try {
                const rawUrl = "https://gist.githubusercontent.com/rotalifenci/" + GIST_ID + "/raw/materials.json?t=" + Date.now();
                const rawResp = await fetch(rawUrl);
                if (rawResp.ok) {
                    const parsed = await rawResp.json();
                    existingMaterials = Array.isArray(parsed.materials) ? parsed.materials : [];
                }
            } catch(e) {}

            const mergedMap = new Map();
            existingMaterials.forEach(item => mergedMap.set(item.id || item.title, item));
            incomingMaterials.forEach(item => mergedMap.set(item.id || item.title, item));

            const finalMaterials = Array.from(mergedMap.values());

            const patchPayload = {
                description: "Rotalı Fenci - Cloud Sync Database",
                files: {
                    "materials.json": {
                        content: JSON.stringify({
                            updatedAt: new Date().toISOString(),
                            materials: finalMaterials
                        }, null, 2)
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
                materials: finalMaterials
            });
        } catch (err) {
            console.error("Sync POST error:", err);
            return res.status(500).json({ error: err.message });
        }
    }

    return res.status(405).json({ error: "Method not allowed" });
};
