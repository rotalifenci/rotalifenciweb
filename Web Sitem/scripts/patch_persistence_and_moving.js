const fs = require('fs');
const path = require('path');

const appJsPath = path.join(__dirname, '..', 'js', 'app.js');
let appJs = fs.readFileSync(appJsPath, 'utf8');

console.log("Starting persistence and move patch...");

// ============================================================
// 1. ADD PERSISTENCE HELPER FUNCTIONS
// ============================================================
const persistenceHelpers = `
// =============================================================
// 🌟 ROTALI FENCİ — GELİŞMİŞ KALICI VERİ VE SIRALAMA SİSTEMİ
// (Persistence & State Synchronization Engine)
// =============================================================
function getStoredMetadataOverrides() {
    try {
        const raw = localStorage.getItem("rotali_materials_metadata_overrides");
        if (raw) {
            const parsed = JSON.parse(raw);
            if (parsed && typeof parsed === "object") return parsed;
        }
    } catch(e) {}
    return {};
}

function saveStoredMetadataOverride(id, patch) {
    if (!id || !patch) return;
    try {
        const current = getStoredMetadataOverrides();
        current[id] = {
            ...(current[id] || {}),
            ...patch,
            updatedAt: new Date().toISOString()
        };
        localStorage.setItem("rotali_materials_metadata_overrides", JSON.stringify(current));
    } catch(e) {}
}

function getStoredMaterialsOrder() {
    try {
        const raw = localStorage.getItem("rotali_materials_order");
        if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) return parsed;
        }
    } catch(e) {}
    return [];
}

function saveStoredMaterialsOrder(orderArray) {
    if (!Array.isArray(orderArray)) return;
    try {
        localStorage.setItem("rotali_materials_order", JSON.stringify(orderArray));
    } catch(e) {}
}

window.getStoredMetadataOverrides = getStoredMetadataOverrides;
window.saveStoredMetadataOverride = saveStoredMetadataOverride;
window.getStoredMaterialsOrder = getStoredMaterialsOrder;
window.saveStoredMaterialsOrder = saveStoredMaterialsOrder;
`;

if (!appJs.includes('function getStoredMetadataOverrides()')) {
    // Insert right after generateUUID or at top of storage section
    appJs = persistenceHelpers + '\n' + appJs;
    console.log("Added persistence helpers to app.js");
}

// ============================================================
// 2. FIX loadCentralizedMaterials: Local user data and order MUST prevail
// ============================================================
const oldLoadCentralizedCode = `    const combinedMap = new Map();
    // 1. Önce sunucudaki tüm aktif materyalleri ekle
    for (const [id, srvItem] of serverMap.entries()) {
        combinedMap.set(id, srvItem);
    }

    // 2. Yereldeki silinmemiş materyalleri koru (Eğer sunucuda yoksa silinmemiş demektir -> yereldeki korunsun!)
    localStored.forEach(localItem => {
        if (!localItem || !localItem.id || localItem.id === "sys-deleted-registry" || deletedIds.has(localItem.id)) return;
        if (combinedMap.has(localItem.id)) {
            const srv = combinedMap.get(localItem.id);
            const merged = { ...localItem, ...srv };
            // Kırık 402 Supabase linklerini ve eski kırpık görselleri her zaman sunucudaki sağlam statik linkle değiştir
            if (srv.fileUrl && !srv.fileUrl.includes("dlzlpstheykhrfeijiri.supabase.co")) {
                merged.fileUrl = srv.fileUrl;
            }
            if (srv.imageUrl && !srv.imageUrl.includes("dlzlpstheykhrfeijiri.supabase.co")) {
                merged.imageUrl = srv.imageUrl;
                merged.kapakResmi = srv.kapakResmi || srv.imageUrl;
            }
            if (srv.format) merged.format = srv.format;
            combinedMap.set(localItem.id, merged);
        } else {
            combinedMap.set(localItem.id, localItem);
        }
    });

    const mergedList = Array.from(combinedMap.values()).filter(m => m && m.id && !deletedIds.has(m.id));`;

const newLoadCentralizedCode = `    const combinedMap = new Map();
    const overridesMap = (typeof getStoredMetadataOverrides === "function") ? getStoredMetadataOverrides() : {};

    // 1. Önce yereldeki kullanıcı sıralamasını ve verilerini koru (Kullanıcı yerel tercihi esastır!)
    localStored.forEach(localItem => {
        if (!localItem || !localItem.id || localItem.id === "sys-deleted-registry" || deletedIds.has(localItem.id)) return;
        
        let mergedItem = { ...localItem };
        if (serverMap.has(localItem.id)) {
            const srv = serverMap.get(localItem.id);
            // Sunucu üzerine yerel veriyi yaz (srv önce, localItem sonra)
            mergedItem = { ...srv, ...localItem };
            // Sadece yerelde eksik veya bozuk link varsa sunucudaki sağlam linki al
            if (srv.fileUrl && !srv.fileUrl.includes("dlzlpstheykhrfeijiri.supabase.co") && (!localItem.fileUrl || localItem.fileUrl === "#" || localItem.fileUrl.includes("dlzlpstheykhrfeijiri.supabase.co"))) {
                mergedItem.fileUrl = srv.fileUrl;
            }
            if (srv.imageUrl && !srv.imageUrl.includes("dlzlpstheykhrfeijiri.supabase.co") && (!localItem.imageUrl || localItem.imageUrl === "#" || localItem.imageUrl.includes("dlzlpstheykhrfeijiri.supabase.co"))) {
                mergedItem.imageUrl = srv.imageUrl;
                mergedItem.kapakResmi = srv.kapakResmi || srv.imageUrl;
            }
            if (!localItem.format && srv.format) mergedItem.format = srv.format;
        }

        // Kalıcı metadata override'larını uygula (Kategori, ünite ve alt başlık taşımaları kalıcıdır!)
        if (overridesMap[localItem.id]) {
            Object.assign(mergedItem, overridesMap[localItem.id]);
        }
        combinedMap.set(localItem.id, mergedItem);
    });

    // 2. Yerelde henüz bulunmayan yeni sunucu materyallerini ekle
    for (const [id, srvItem] of serverMap.entries()) {
        if (!combinedMap.has(id)) {
            let item = { ...srvItem };
            if (overridesMap[id]) {
                Object.assign(item, overridesMap[id]);
            }
            combinedMap.set(id, item);
        }
    }

    let mergedList = Array.from(combinedMap.values()).filter(m => m && m.id && !deletedIds.has(m.id));

    // 3. Kalıcı kullanıcı sıralamasını uygula
    const savedOrder = (typeof getStoredMaterialsOrder === "function") ? getStoredMaterialsOrder() : [];
    if (savedOrder.length > 0) {
        const orderMap = new Map();
        savedOrder.forEach((id, idx) => orderMap.set(id, idx));
        mergedList.sort((a, b) => {
            const ordA = orderMap.has(a.id) ? orderMap.get(a.id) : 999999;
            const ordB = orderMap.has(b.id) ? orderMap.get(b.id) : 999999;
            return ordA - ordB;
        });
    }`;

if (appJs.includes(oldLoadCentralizedCode)) {
    appJs = appJs.replace(oldLoadCentralizedCode, newLoadCentralizedCode);
    console.log("Updated loadCentralizedMaterials merge logic to prioritize local user changes and ordering");
} else {
    console.log("Warning: oldLoadCentralizedCode exact match not found");
}

// ============================================================
// 3. FIX CloudSyncManager.syncAll: Local user data and order MUST prevail
// ============================================================
const oldCloudSyncCode = `            const mergedMap = new Map();
            let hasNewLocalToUpload = false;

            // Adım A: Bulut ve statik sunucudaki materyalleri temel al
            for (const [id, cloudItem] of cloudMap.entries()) {
                if (!activeDeletedSet.has(id)) {
                    mergedMap.set(id, cloudItem);
                }
            }

            // Adım B: Yereldeki silinmemiş materyalleri koru (Yeni eklenenleri asla ezme!)
            localMaterials.forEach(localItem => {
                if (localItem && localItem.id && localItem.id !== "sys-deleted-registry" && !activeDeletedSet.has(localItem.id)) {
                    if (cloudMap.has(localItem.id)) {
                        const inCloud = cloudMap.get(localItem.id);
                        const merged = { ...localItem, ...inCloud };
                        if (inCloud.fileUrl && !inCloud.fileUrl.includes("dlzlpstheykhrfeijiri.supabase.co")) {
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
                        if (inCloud.format) merged.format = inCloud.format;
                        mergedMap.set(localItem.id, merged);
                    } else {
                        hasNewLocalToUpload = true;
                        mergedMap.set(localItem.id, localItem);
                    }
                }
            });

            const finalMergedList = Array.from(mergedMap.values());`;

const newCloudSyncCode = `            const mergedMap = new Map();
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
                        if (inCloud.imageUrl && !inCloud.imageUrl.includes("dlzlpstheykhrfeijiri.supabase.co") && !inCloud.imageUrl.startsWith("data:image/svg+xml") && (!localItem.imageUrl || localItem.imageUrl === "#" || localItem.imageUrl.includes("dlzlpstheykhrfeijiri.supabase.co"))) {
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

if (appJs.includes(oldCloudSyncCode)) {
    appJs = appJs.replace(oldCloudSyncCode, newCloudSyncCode);
    console.log("Updated CloudSyncManager.syncAll merge logic to prioritize local user changes and ordering");
} else {
    console.log("Warning: oldCloudSyncCode exact match not found");
}

// ============================================================
// 4. FIX migrateAndSanitizeMaterials: Do not reset user's category/unit
// ============================================================
const oldMigrationReset = `            if (needsMigration) {
                existing.fileUrl = defItem.fileUrl;
                existing.format = defItem.format;
                existing.hasBlob = defItem.hasBlob;
                existing.category = defItem.category;
                existing.title = defItem.title;
                existing.unit = defItem.unit;
                existing.grade = defItem.grade;
                if (defItem.targetSection) existing.targetSection = defItem.targetSection;
                if (defItem.desc && (!existing.desc || existing.desc.length < 5)) existing.desc = defItem.desc;
                if (defItem.imageUrl && (!existing.imageUrl || existing.imageUrl === "#")) existing.imageUrl = defItem.imageUrl;
                existing.updatedAt = "17.09.2026";
            }`;

const newMigrationReset = `            if (needsMigration) {
                if (!existing.fileUrl || existing.fileUrl === "#") existing.fileUrl = defItem.fileUrl;
                if (!existing.format) existing.format = defItem.format;
                if (!existing.category) existing.category = defItem.category;
                if (!existing.title) existing.title = defItem.title;
                if (!existing.unit) existing.unit = defItem.unit;
                if (!existing.grade) existing.grade = defItem.grade;
                if (!existing.targetSection && defItem.targetSection) existing.targetSection = defItem.targetSection;
                existing.hasBlob = defItem.hasBlob || existing.hasBlob;
                if (defItem.desc && (!existing.desc || existing.desc.length < 5)) existing.desc = defItem.desc;
                if (defItem.imageUrl && (!existing.imageUrl || existing.imageUrl === "#")) existing.imageUrl = defItem.imageUrl;
            }`;

if (appJs.includes(oldMigrationReset)) {
    appJs = appJs.replace(oldMigrationReset, newMigrationReset);
    console.log("Fixed migrateAndSanitizeMaterials so it doesn't wipe out user category/section customizations");
}

// ============================================================
// 5. UPDATE saveCustomMaterialsSafe: Save order to localStorage
// ============================================================
const oldSaveCustomMaterialsSafeStart = `function saveCustomMaterialsSafe(list) {
    if (!Array.isArray(list)) return;
    const deletedSet = new Set(getDeletedMaterialIds());
    const cleanList = list.filter(item => item && item.id && !deletedSet.has(item.id));
    ROTALI_MATERIALS_CACHE = [...cleanList];
    APP_MATERIALS_CACHE = [...cleanList];
    window.APP_MATERIALS_CACHE = APP_MATERIALS_CACHE;`;

const newSaveCustomMaterialsSafeStart = `function saveCustomMaterialsSafe(list) {
    if (!Array.isArray(list)) return;
    const deletedSet = new Set(getDeletedMaterialIds());
    const cleanList = list.filter(item => item && item.id && !deletedSet.has(item.id));
    ROTALI_MATERIALS_CACHE = [...cleanList];
    APP_MATERIALS_CACHE = [...cleanList];
    window.APP_MATERIALS_CACHE = APP_MATERIALS_CACHE;

    // Sıralamayı ve aktif sıralama indekslerini kalıcı olarak hafızaya yaz
    if (typeof saveStoredMaterialsOrder === "function") {
        saveStoredMaterialsOrder(cleanList.map(m => m.id));
    }`;

if (appJs.includes(oldSaveCustomMaterialsSafeStart)) {
    appJs = appJs.replace(oldSaveCustomMaterialsSafeStart, newSaveCustomMaterialsSafeStart);
    console.log("Updated saveCustomMaterialsSafe to persist materials order");
}

// ============================================================
// 6. UPDATE moveCustomMaterial: Save explicit order and overrides
// ============================================================
const moveCustomEndOld = `    saveCustomMaterialsSafe(customList);
    showToast("↕️ Materyalin konumu ve sırası güncellendi.", "success");

    if (typeof CloudSyncManager !== "undefined" && CloudSyncManager.uploadToCloud) {
        await CloudSyncManager.uploadToCloud(customList, true);
    }
    handleRouteChange({ preserveScroll: true });
}`;

const moveCustomEndNew = `    // Sıralamayı ve güncellenen öğenin konum bilgilerini kalıcı olarak kaydet
    if (typeof saveStoredMaterialsOrder === "function") {
        saveStoredMaterialsOrder(customList.map(m => m.id));
    }
    const movedMat = customList.find(m => String(m.id) === String(id));
    if (movedMat && typeof saveStoredMetadataOverride === "function") {
        saveStoredMetadataOverride(String(id), {
            category: movedMat.category,
            targetSection: getMaterialTargetSection(movedMat),
            unit: movedMat.unit,
            grade: movedMat.grade,
            subtopicNum: movedMat.subtopicNum,
            updatedAt: new Date().toISOString()
        });
    }

    saveCustomMaterialsSafe(customList);
    showToast("↕️ Materyalin konumu ve sırası kalıcı olarak güncellendi.", "success");

    if (typeof CloudSyncManager !== "undefined" && CloudSyncManager.uploadToCloud) {
        await CloudSyncManager.uploadToCloud(customList, true);
    }
    handleRouteChange({ preserveScroll: true });
}`;

if (appJs.includes(moveCustomEndOld)) {
    appJs = appJs.replace(moveCustomEndOld, moveCustomEndNew);
    console.log("Updated moveCustomMaterial to store metadata override and order");
}

// ============================================================
// 7. ADD QUICK MOVE MODAL & DRAG AND DROP HANDLERS
// ============================================================
const quickMoveAndDragDropCode = `
// =============================================================
// 🚀 HIZLI TAŞIMA MODALI VE SÜRÜKLE-BIRAK (DRAG & DROP) MOTORU
// =============================================================
function openQuickMoveModal(materialId) {
    checkAdminAccess(() => {
        let customList = (typeof getCustomMaterialsList === "function") ? getCustomMaterialsList() : [];
        let item = customList.find(m => m && String(m.id) === String(materialId));
        if (!item && typeof findMaterialByIdOrTitle === "function") {
            item = findMaterialByIdOrTitle(materialId);
        }
        if (!item) {
            showToast("Taşınacak materyal bulunamadı.", "error");
            return;
        }

        const oldModal = document.getElementById("quick-move-modal");
        if (oldModal) oldModal.remove();

        const currentGrade = String(item.grade || "5").replace(/^grade-/, "");
        const currentCat = String(item.category || "videolar");
        const currentSec = (typeof getMaterialTargetSection === "function") ? getMaterialTargetSection(item) : "1";
        const currentSubtopicNum = item.subtopicNum || "";

        const modal = document.createElement("div");
        modal.id = "quick-move-modal";
        modal.className = "fixed inset-0 z-[9999] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200";

        const categories = [
            { id: "videolar", label: "🎥 Videolar" },
            { id: "etkinlikler", label: "🧩 Etkinlikler" },
            { id: "soru-bankasi", label: "📝 Test / Deneme" },
            { id: "denemeler", label: "🎯 Yazılıya Hazırlık" },
            { id: "egitsel-oyunlar", label: "🎮 Eğitsel Oyun" },
            { id: "ders-notu", label: "📚 Ders Kitabı & Notlar" }
        ];

        const getUnitsForGrade = (g) => {
            if (typeof MEB_CURRICULUM !== "undefined" && MEB_CURRICULUM[String(g)]) {
                return MEB_CURRICULUM[String(g)].units;
            }
            return [1,2,3,4,5,6,7].map(n => ({ num: n, name: \`\${n}. Ünite\` }));
        };

        const renderSubtopicsOptions = (g, uNum) => {
            const subtopics = (typeof getUnitSubtopics === "function") ? getUnitSubtopics(g, uNum) : [];
            if (!subtopics || subtopics.length === 0) return '<option value="">-- Tüm Ünite (Alt Başlık Belirtilmedi) --</option>';
            return '<option value="">-- Tüm Ünite (Alt Başlık Belirtilmedi) --</option>' +
                subtopics.map(s => \`<option value="\${s.num}" \${String(currentSubtopicNum) === String(s.num) ? 'selected' : ''}>\${s.num}. \${s.title}</option>\`).join('');
        };

        modal.innerHTML = \`
            <div class="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 relative my-auto">
                <button type="button" onclick="document.getElementById('quick-move-modal').remove()" class="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center text-sm transition-all cursor-pointer">
                    <i class="fa-solid fa-xmark"></i>
                </button>

                <div class="flex items-center gap-3 mb-5">
                    <div class="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-xl shadow-md shadow-blue-600/30">
                        <i class="fa-solid fa-arrows-up-down-left-right"></i>
                    </div>
                    <div>
                        <span class="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-black uppercase tracking-wider border border-blue-100">
                            KALICI KONUM DEĞİŞTİRME & TAŞIMA
                        </span>
                        <h3 class="text-lg sm:text-xl font-black text-slate-900 leading-tight">Materyali Farklı Bölüme Taşı</h3>
                    </div>
                </div>

                <div class="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/90 mb-5">
                    <div class="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-0.5">Seçilen İçerik:</div>
                    <div class="text-sm font-black text-slate-900 line-clamp-2">\${item.title}</div>
                    <div class="text-xs text-blue-700 font-bold mt-1.5 flex items-center gap-1.5">
                        <i class="fa-solid fa-location-dot text-blue-600"></i>
                        <span>Şu Anki Konumu: <strong>\${currentGrade}. Sınıf • \${currentCat} • \${currentSec}. Bölüm</strong></span>
                    </div>
                </div>

                <form id="quick-move-form" onsubmit="executeQuickMove(event, '\${item.id}')" class="space-y-4">
                    <!-- 1. Hedef Sınıf -->
                    <div>
                        <label class="block text-xs font-black uppercase text-slate-700 tracking-wider mb-1.5">Hedef Sınıf</label>
                        <div class="grid grid-cols-4 gap-2">
                            \${[5, 6, 7, 8].map(g => \`
                                <label class="cursor-pointer">
                                    <input type="radio" name="targetGrade" value="\${g}" \${String(currentGrade) === String(g) ? 'checked' : ''} onchange="updateQuickMoveUnits('\${g}')" class="peer sr-only">
                                    <div class="py-2.5 text-center rounded-xl border border-slate-200 peer-checked:bg-slate-900 peer-checked:text-white peer-checked:border-slate-900 peer-checked:shadow-md text-xs font-black transition-all">
                                        \${g}. Sınıf
                                    </div>
                                </label>
                            \`).join('')}
                        </div>
                    </div>

                    <!-- 2. Hedef Kategori (5 Ana Kategori + Ders Kitabı) -->
                    <div>
                        <label class="block text-xs font-black uppercase text-slate-700 tracking-wider mb-1.5">Hedef Kategori</label>
                        <select name="targetCategory" id="move-modal-category" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-bold text-xs text-slate-800 focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer">
                            \${categories.map(c => \`
                                <option value="\${c.id}" \${currentCat === c.id || (typeof matchesSubTabCategory === "function" && matchesSubTabCategory(item, c.id)) ? 'selected' : ''}>\${c.label}</option>
                            \`).join('')}
                        </select>
                    </div>

                    <!-- 3. Hedef Ünite / Bölüm -->
                    <div>
                        <label class="block text-xs font-black uppercase text-slate-700 tracking-wider mb-1.5">Hedef Ünite / Bölüm</label>
                        <select name="targetSection" id="move-modal-section" onchange="updateQuickMoveSubtopics()" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-bold text-xs text-slate-800 focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer">
                            \${getUnitsForGrade(currentGrade).map(u => \`
                                <option value="\${u.num}" \${String(currentSec) === String(u.num) ? 'selected' : ''}>\${u.name || (u.num + '. Ünite')}</option>
                            \`).join('')}
                            <option value="lab" \${currentSec === 'lab' ? 'selected' : ''}>🧪 Laboratuvar & Deneyler</option>
                            <option value="kitap" \${currentSec === 'kitap' ? 'selected' : ''}>📚 Ders Kitabı</option>
                        </select>
                    </div>

                    <!-- 4. Hedef Alt Başlık -->
                    <div>
                        <label class="block text-xs font-black uppercase text-slate-700 tracking-wider mb-1.5">Hedef Alt Başlık (İsteğe Bağlı)</label>
                        <select name="targetSubtopic" id="move-modal-subtopic" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-bold text-xs text-slate-800 focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer">
                            \${renderSubtopicsOptions(currentGrade, currentSec)}
                        </select>
                    </div>

                    <!-- Aksiyon Butonları -->
                    <div class="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                        <button type="button" onclick="document.getElementById('quick-move-modal').remove()" class="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer">
                            İptal
                        </button>
                        <button type="submit" class="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md shadow-blue-600/30 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95">
                            <i class="fa-solid fa-check"></i> Buraya Taşı & Kalıcı Kaydet
                        </button>
                    </div>
                </form>
            </div>
        \`;

        document.body.appendChild(modal);
    });
}

function updateQuickMoveUnits(grade) {
    const sectionSelect = document.getElementById("move-modal-section");
    if (!sectionSelect) return;
    let units = [];
    if (typeof MEB_CURRICULUM !== "undefined" && MEB_CURRICULUM[String(grade)]) {
        units = MEB_CURRICULUM[String(grade)].units;
    } else {
        units = [1,2,3,4,5,6,7].map(n => ({ num: n, name: \`\${n}. Ünite\` }));
    }
    sectionSelect.innerHTML = units.map(u => \`<option value="\${u.num}">\${u.name || (u.num + '. Ünite')}</option>\`).join('') +
        \`<option value="lab">🧪 Laboratuvar & Deneyler</option><option value="kitap">📚 Ders Kitabı</option>\`;
    updateQuickMoveSubtopics();
}

function updateQuickMoveSubtopics() {
    const form = document.getElementById("quick-move-form");
    const subtopicSelect = document.getElementById("move-modal-subtopic");
    const sectionSelect = document.getElementById("move-modal-section");
    if (!form || !subtopicSelect || !sectionSelect) return;

    const grade = (form.querySelector('input[name="targetGrade"]:checked') || {}).value || "5";
    const sec = sectionSelect.value;
    const subtopics = (typeof getUnitSubtopics === "function") ? getUnitSubtopics(grade, sec) : [];

    if (!subtopics || subtopics.length === 0) {
        subtopicSelect.innerHTML = '<option value="">-- Tüm Ünite (Alt Başlık Yok) --</option>';
    } else {
        subtopicSelect.innerHTML = '<option value="">-- Tüm Ünite (Alt Başlık Belirtilmedi) --</option>' +
            subtopics.map(s => \`<option value="\${s.num}">\${s.num}. \${s.title}</option>\`).join('');
    }
}

async function executeQuickMove(e, materialId) {
    e.preventDefault();
    const form = e.target;
    const grade = (form.querySelector('input[name="targetGrade"]:checked') || {}).value || "5";
    const category = form.targetCategory.value;
    const targetSection = form.targetSection.value;
    const subtopicVal = form.targetSubtopic.value;
    const subtopicNum = subtopicVal ? parseInt(subtopicVal, 10) : null;

    let customList = (typeof getCustomMaterialsList === "function") ? getCustomMaterialsList() : [];
    let item = customList.find(m => m && String(m.id) === String(materialId));
    if (!item && typeof findMaterialByIdOrTitle === "function") {
        item = findMaterialByIdOrTitle(materialId);
        if (item) customList.unshift(item);
    }
    if (!item) {
        showToast("Taşınacak materyal bulunamadı.", "error");
        return;
    }

    let unitName = \`\${targetSection}. Ünite\`;
    if (typeof MEB_CURRICULUM !== "undefined" && MEB_CURRICULUM[String(grade)]) {
        const uObj = MEB_CURRICULUM[String(grade)].units.find(u => String(u.num) === String(targetSection));
        if (uObj) unitName = uObj.name;
    }
    if (targetSection === "lab") unitName = "Laboratuvar & Deneyler";
    if (targetSection === "kitap") unitName = "Ders Kitabı";

    // Öğeyi güncelle
    item.grade = String(grade);
    item.category = category;
    item.targetSection = String(targetSection);
    item.target_section = String(targetSection);
    item.unit = unitName;
    item.subtopicNum = subtopicNum;
    item.updatedAt = new Date().toISOString();

    // Listede en başa al (kullanıcı hemen görsün)
    const idx = customList.findIndex(m => String(m.id) === String(materialId));
    if (idx !== -1) {
        customList.splice(idx, 1);
        customList.unshift(item);
    }

    // 1. Kalıcı metadata override'ı kaydet
    if (typeof saveStoredMetadataOverride === "function") {
        saveStoredMetadataOverride(String(materialId), {
            grade: String(grade),
            category: category,
            targetSection: String(targetSection),
            target_section: String(targetSection),
            unit: unitName,
            subtopicNum: subtopicNum,
            updatedAt: item.updatedAt
        });
    }

    // 2. Kalıcı sıralamayı kaydet
    if (typeof saveStoredMaterialsOrder === "function") {
        saveStoredMaterialsOrder(customList.map(m => m.id));
    }

    // 3. Hafızaya ve localStorage'a kaydet
    if (typeof saveCustomMaterialsSafe === "function") {
        saveCustomMaterialsSafe(customList);
    }

    const modal = document.getElementById("quick-move-modal");
    if (modal) modal.remove();

    showToast(\`✅ Materyal \${grade}. Sınıf • \${category} (\${unitName}) bölümüne kalıcı olarak taşındı!\`, "success");

    // 4. Buluta kalıcı senkronize et
    if (typeof CloudSyncManager !== "undefined" && CloudSyncManager.uploadToCloud) {
        await CloudSyncManager.uploadToCloud(customList, true);
    }

    if (typeof handleRouteChange === "function") {
        handleRouteChange({ preserveScroll: true });
    }
}

// 🌟 SÜRÜKLE-BIRAK (DRAG AND DROP) İLE YER DEĞİŞTİRME VE KALICI SIRALAMA
let draggedMaterialId = null;

function handleCardDragStart(e, id) {
    draggedMaterialId = id;
    if (e.dataTransfer) {
        e.dataTransfer.setData("text/plain", id);
        e.dataTransfer.effectAllowed = "move";
    }
    const el = e.target.closest('.unit-material-card');
    if (el) el.classList.add("opacity-50", "scale-95", "ring-2", "ring-blue-500");
}

function handleCardDragOver(e) {
    e.preventDefault();
    if (e.dataTransfer) {
        e.dataTransfer.dropEffect = "move";
    }
    const el = e.target.closest('.unit-material-card');
    if (el) el.classList.add("ring-2", "ring-blue-400");
}

function handleCardDragLeave(e) {
    const el = e.target.closest('.unit-material-card');
    if (el) el.classList.remove("ring-2", "ring-blue-400");
}

async function handleCardDrop(e, targetId) {
    e.preventDefault();
    const el = e.target.closest('.unit-material-card');
    if (el) el.classList.remove("ring-2", "ring-blue-400");
    document.querySelectorAll('.unit-material-card').forEach(c => c.classList.remove("opacity-50", "scale-95", "ring-2", "ring-blue-500"));

    const sourceId = draggedMaterialId || (e.dataTransfer ? e.dataTransfer.getData("text/plain") : null);
    draggedMaterialId = null;
    if (!sourceId || String(sourceId) === String(targetId)) return;

    let customList = (typeof getCustomMaterialsList === "function") ? getCustomMaterialsList() : [];
    const sourceIdx = customList.findIndex(m => m && String(m.id) === String(sourceId));
    const targetIdx = customList.findIndex(m => m && String(m.id) === String(targetId));
    if (sourceIdx === -1 || targetIdx === -1) return;

    const targetItem = customList[targetIdx];
    const sourceItem = customList[sourceIdx];

    // Hedef kartın bölüm veya kategorisini miras al (aynı grupta konumlanması için)
    if (targetItem.targetSection && sourceItem.targetSection !== targetItem.targetSection) {
        sourceItem.targetSection = targetItem.targetSection;
        sourceItem.target_section = targetItem.targetSection;
        sourceItem.unit = targetItem.unit;
    }
    if (targetItem.category && sourceItem.category !== targetItem.category) {
        sourceItem.category = targetItem.category;
    }
    sourceItem.updatedAt = new Date().toISOString();

    // Dizi sıralamasını değiştir
    const [moved] = customList.splice(sourceIdx, 1);
    customList.splice(targetIdx, 0, moved);

    // Kalıcı sıralama ve metadata kaydet
    if (typeof saveStoredMaterialsOrder === "function") {
        saveStoredMaterialsOrder(customList.map(m => m.id));
    }
    if (typeof saveStoredMetadataOverride === "function") {
        saveStoredMetadataOverride(String(sourceId), {
            category: sourceItem.category,
            targetSection: sourceItem.targetSection,
            target_section: sourceItem.targetSection,
            unit: sourceItem.unit,
            updatedAt: sourceItem.updatedAt
        });
    }
    if (typeof saveCustomMaterialsSafe === "function") {
        saveCustomMaterialsSafe(customList);
    }

    showToast("↕️ Materyalin sırası kalıcı olarak kaydedildi.", "success");

    if (typeof CloudSyncManager !== "undefined" && CloudSyncManager.uploadToCloud) {
        await CloudSyncManager.uploadToCloud(customList, true);
    }
    if (typeof handleRouteChange === "function") {
        handleRouteChange({ preserveScroll: true });
    }
}

window.openQuickMoveModal = openQuickMoveModal;
window.updateQuickMoveUnits = updateQuickMoveUnits;
window.updateQuickMoveSubtopics = updateQuickMoveSubtopics;
window.executeQuickMove = executeQuickMove;
window.handleCardDragStart = handleCardDragStart;
window.handleCardDragOver = handleCardDragOver;
window.handleCardDragLeave = handleCardDragLeave;
window.handleCardDrop = handleCardDrop;
`;

if (!appJs.includes('function openQuickMoveModal(')) {
    appJs += '\n' + quickMoveAndDragDropCode;
    console.log("Added quick move modal and drag-drop handlers to app.js");
}

// ============================================================
// 8. INJECT "TAŞI" BUTTON & DRAG ATTRIBUTES ON CARDS IN renderGradeUnitBasedHub
// ============================================================
// Find the admin buttons bar in renderGradeUnitBasedHub
const oldAdminBtnsBar = `<button type="button" onclick="event.stopPropagation(); triggerEditMaterial('\${item.id}')" class="flex-1 py-1.5 px-2 bg-amber-50 hover:bg-amber-100 text-amber-900 text-[11px] font-bold rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer shadow-xs active:scale-95" title="Düzenle">
                                                                <i class="fa-solid fa-pen-to-square"></i> Düzenle
                                                            </button>`;

const newAdminBtnsBar = `<button type="button" onclick="event.stopPropagation(); openQuickMoveModal('\${item.id}')" class="py-1.5 px-2 bg-blue-50 hover:bg-blue-100 text-blue-800 text-[11px] font-bold rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer shadow-xs active:scale-95" title="Farklı Kategori veya Üniteye Taşı">
                                                                <i class="fa-solid fa-arrows-up-down-left-right text-[10px]"></i> Taşı
                                                            </button>
                                                            <button type="button" onclick="event.stopPropagation(); triggerEditMaterial('\${item.id}')" class="flex-1 py-1.5 px-2 bg-amber-50 hover:bg-amber-100 text-amber-900 text-[11px] font-bold rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer shadow-xs active:scale-95" title="Düzenle">
                                                                <i class="fa-solid fa-pen-to-square"></i> Düzenle
                                                            </button>`;

if (appJs.includes(oldAdminBtnsBar)) {
    appJs = appJs.replace(oldAdminBtnsBar, newAdminBtnsBar);
    console.log("Injected 'Taşı' button in renderGradeUnitBasedHub admin bar");
}

// Add draggable attributes to unit-material-card in renderGradeUnitBasedHub
const oldCardOuter = 'class="unit-material-card bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-slate-400 hover:shadow-md transition-all flex flex-col justify-between group">';
const newCardOuter = 'draggable="${isAdmin ? \'true\' : \'false\'}" ondragstart="handleCardDragStart(event, \'${item.id}\')" ondragover="handleCardDragOver(event)" ondragleave="handleCardDragLeave(event)" ondrop="handleCardDrop(event, \'${item.id}\')" class="unit-material-card bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-slate-400 hover:shadow-md transition-all flex flex-col justify-between group cursor-grab active:cursor-grabbing">';

if (appJs.includes(oldCardOuter)) {
    appJs = appJs.replace(oldCardOuter, newCardOuter);
    console.log("Added draggable and drop listeners to unit-material-card");
}

// Save to Web Sitem and parent
fs.writeFileSync(appJsPath, appJs, 'utf8');
const parentAppJsPath = path.join(__dirname, '..', '..', 'js', 'app.js');
fs.writeFileSync(parentAppJsPath, appJs, 'utf8');
console.log("Saved updated app.js to both locations!");
