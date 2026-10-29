const fs = require('fs');
const path = require('path');

function patchFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(/\r/g, '');

    // 2. Patch CloudSyncManager.syncAll merge logic
    const syncStartMarker = 'const mergedMap = new Map();\n            let hasNewLocalToUpload = false;';
    const syncEndMarker = 'const finalMergedList = Array.from(mergedMap.values());';

    const syncStartIdx = content.indexOf(syncStartMarker);
    const syncEndIdx = content.indexOf(syncEndMarker, syncStartIdx);

    if (syncStartIdx !== -1 && syncEndIdx !== -1) {
        const newSyncCode = `const mergedMap = new Map();
            let hasNewLocalToUpload = false;
            const overridesMap = (typeof getStoredMetadataOverrides === "function") ? getStoredMetadataOverrides() : {};

            // Adım A: Önce yereldeki kullanıcı sıralamasını ve güncellemelerini koru (Kullanıcı tercihleri esastır!)
            localMaterials.forEach(localItem => {
                if (localItem && localItem.id && localItem.id !== "sys-deleted-registry" && !activeDeletedSet.has(localItem.id)) {
                    let merged = { ...localItem };
                    if (cloudMap.has(localItem.id)) {
                        const inCloud = cloudMap.get(localItem.id);
                        // inCloud üzerine localItem yazılır (kullanıcı yerel tercihi esastır!)
                        merged = { ...inCloud, ...localItem };
                        if (inCloud.fileUrl && !inCloud.fileUrl.includes("dlzlpstheykhrfeijiri.supabase.co") && (!localItem.fileUrl || localItem.fileUrl === "#" || localItem.fileUrl.includes("dlzlpstheykhrfeijiri.supabase.co"))) {
                            merged.fileUrl = inCloud.fileUrl;
                        } else if (localItem.fileUrl && localItem.fileUrl.startsWith("data:") && (!inCloud.fileUrl || inCloud.fileUrl === "" || inCloud.fileUrl === "#")) {
                            merged.fileUrl = localItem.fileUrl;
                        }
                        if (inCloud.imageUrl && !inCloud.imageUrl.includes("dlzlpstheykhrfeijiri.supabase.co") && !inCloud.imageUrl.startsWith("data:image/svg+xml")) {
                            merged.imageUrl = inCloud.imageUrl;
                            merged.kapakResmi = inCloud.kapakResmi || inCloud.imageUrl;
                            merged.cover = inCloud.cover || inCloud.imageUrl;
                        } else if (localItem.imageUrl && !localItem.imageUrl.startsWith("data:image/svg+xml") && (!inCloud.imageUrl || inCloud.imageUrl === "" || inCloud.imageUrl === "#" || inCloud.imageUrl.startsWith("data:image/svg+xml"))) {
                            merged.imageUrl = localItem.imageUrl;
                            merged.kapakResmi = localItem.kapakResmi || localItem.imageUrl;
                            merged.cover = localItem.cover || localItem.imageUrl;
                        } else if (inCloud.imageUrl) {
                            merged.imageUrl = inCloud.imageUrl;
                            merged.kapakResmi = inCloud.kapakResmi || inCloud.imageUrl;
                            merged.cover = inCloud.cover || inCloud.imageUrl;
                        }
                        if (!localItem.format && inCloud.format) merged.format = inCloud.format;
                    } else {
                        hasNewLocalToUpload = true;
                    }

                    // Kalıcı metadata override'larını zorunlu uygula
                    if (overridesMap[localItem.id]) {
                        Object.assign(merged, overridesMap[localItem.id]);
                    }
                    mergedMap.set(localItem.id, merged);
                }
            });

            // Adım B: Yerelde henüz olmayan yeni bulut materyallerini ekle
            for (const [id, cloudItem] of cloudMap.entries()) {
                if (!mergedMap.has(id) && !activeDeletedSet.has(id)) {
                    let item = { ...cloudItem };
                    if (overridesMap[id]) {
                        Object.assign(item, overridesMap[id]);
                    }
                    mergedMap.set(id, item);
                }
            }

            let finalMergedList = Array.from(mergedMap.values());

            // Adım C: Kalıcı kullanıcı sıralamasını uygula
            const savedOrder = (typeof getStoredMaterialsOrder === "function") ? getStoredMaterialsOrder() : [];
            if (savedOrder.length > 0) {
                const orderMap = new Map();
                savedOrder.forEach((id, idx) => orderMap.set(id, idx));
                finalMergedList.sort((a, b) => {
                    const ordA = orderMap.has(a.id) ? orderMap.get(a.id) : 999999;
                    const ordB = orderMap.has(b.id) ? orderMap.get(b.id) : 999999;
                    return ordA - ordB;
                });
            }`;

        content = content.substring(0, syncStartIdx) + newSyncCode + content.substring(syncEndIdx + syncEndMarker.length);
        console.log("Successfully replaced CloudSyncManager.syncAll merge logic in:", filePath);
    } else {
        console.log("Warning: syncAll markers not found in:", filePath, { syncStartIdx, syncEndIdx });
    }

    fs.writeFileSync(filePath, content, 'utf8');
}

patchFile(path.join(__dirname, '..', 'js', 'app.js'));
patchFile(path.join(__dirname, '..', '..', 'js', 'app.js'));
