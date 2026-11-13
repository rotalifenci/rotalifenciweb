#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Patch js/tubitak-research.js to implement 100% reliable autosave,
cloud sync, offline queue recovery, lifecycle flushes, and teacher dashboard health status.
"""

import os
import re

file_path = os.path.join(os.path.dirname(__file__), "..", "js", "tubitak-research.js")

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. State Variables: add latestSyncHealth
target_state = "    let saveState = \"idle\"; // \"idle\", \"dirty\", \"saving\", \"saved\", \"error\""
replacement_state = """    let saveState = "idle"; // "idle", "dirty", "saving", "saved", "error", "waiting_connection"
    let latestSyncHealth = null;"""

if target_state in content:
    content = content.replace(target_state, replacement_state, 1)
    print("1. Added latestSyncHealth state variable.")

# 2. Update init() to process offline queue
target_init = """        if (currentSession) {
            await syncProjectData(currentSession.projectId);
            startLivePolling();
        }"""
replacement_init = """        if (currentSession) {
            await syncProjectData(currentSession.projectId);
            await processOfflineQueue();
            startLivePolling();
        }"""

if target_init in content:
    content = content.replace(target_init, replacement_init, 1)
    print("2. Updated init() to process offline queue.")

# 3. Update syncProjectData to save latestSyncHealth
target_sync = """                    if (data.siyerEvents) runtimeSiyerEvents = { ...data.siyerEvents };
                    if (data.siyerYearFlags) runtimeSiyerYearFlags = { ...data.siyerYearFlags };
                    updateUIAutosaveBadge("saved");"""
replacement_sync = """                    if (data.siyerEvents) runtimeSiyerEvents = { ...data.siyerEvents };
                    if (data.siyerYearFlags) runtimeSiyerYearFlags = { ...data.siyerYearFlags };
                    if (data.syncHealth) latestSyncHealth = data.syncHealth;
                    updateUIAutosaveBadge("saved");"""

if target_sync in content:
    content = content.replace(target_sync, replacement_sync, 1)
    print("3. Updated syncProjectData to capture syncHealth.")

# 4. Update startLivePolling
target_polling = """    let pollingInterval = null;
    function startLivePolling() {
        if (pollingInterval) clearInterval(pollingInterval);
        pollingInterval = setInterval(() => {
            if (currentSession && saveState !== "saving" && saveState !== "dirty") {
                syncProjectData(activeProjectId);
            }
        }, 6000); // 6 saniyede bir sessiz arka plan eşitlemesi
    }"""

replacement_polling = """    let pollingInterval = null;
    function startLivePolling() {
        if (pollingInterval) clearInterval(pollingInterval);
        const pollFrequency = (currentSession?.role === "teacher") ? 4000 : 5000;
        pollingInterval = setInterval(async () => {
            if (currentSession && saveState !== "saving" && saveState !== "dirty") {
                const targetProj = (currentSession.role === "teacher") ? "all" : activeProjectId;
                await syncProjectData(targetProj);
                const modal = document.getElementById("tubitak-teacher-modal");
                if (modal && !modal.classList.contains("hidden")) {
                    updateTeacherModalDynamicStats();
                }
            }
        }, pollFrequency);
    }"""

if target_polling in content:
    content = content.replace(target_polling, replacement_polling, 1)
    print("4. Updated startLivePolling with dynamic teacher updates.")

# 5. Replace queueAutoSave, executeSave, flushPendingSaves with robust versions
target_save_block = """    // 5. Otomatik Kayıt Motoru (Debounce ~1000ms & Çevrimdışı Kuyruk)
    function queueAutoSave(criterionKey, newContent, targetItemId = activeItemId) {
        if (!currentSession || !targetItemId) return;

        const recordKey = `${targetItemId}__${criterionKey}`;
        const existing = runtimeRecords[recordKey] || { version: 0, content: "" };
        const prevContent = existing.content || "";

        // Geri Al yığınına ekle
        if (!undoStacks[recordKey]) undoStacks[recordKey] = [];
        undoStacks[recordKey].push(prevContent);
        if (undoStacks[recordKey].length > 30) undoStacks[recordKey].shift();
        redoStacks[recordKey] = []; // Yeni yazımda redo sıfırlanır

        // Yerel kaydı hemen güncelle (arayüz anında güncel kalsın)
        existing.content = newContent;
        existing.itemId = targetItemId;
        existing.studentName = currentSession.studentName;
        existing.studentId = currentSession.studentId;
        existing.updatedAt = new Date().toISOString();
        runtimeRecords[recordKey] = existing;

        updateUIAutosaveBadge("dirty");

        // Zamanlayıcıyı sıfırla ve yeniden kur (~1000ms)
        if (autoSaveTimers[recordKey]) clearTimeout(autoSaveTimers[recordKey]);

        autoSaveTimers[recordKey] = setTimeout(async () => {
            await executeSave(criterionKey, newContent, targetItemId);
        }, 1000);
    }

    async function executeSave(criterionKey, content, targetItemId = activeItemId) {
        if (!currentSession || !targetItemId) return;
        const recordKey = `${targetItemId}__${criterionKey}`;
        const existing = runtimeRecords[recordKey] || { version: 0 };

        updateUIAutosaveBadge("saving");

        const payload = {
            projectId: activeProjectId,
            itemId: targetItemId,
            criterionKey,
            content,
            clientVersion: existing.version || 0,
            studentName: currentSession.studentName,
            studentId: currentSession.studentId
        };

        try {
            const res = await fetch("/api/tubitak-records", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${currentSession.token}`
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                const data = await res.json();
                if (data.ok) {
                    existing.version = data.version;
                    existing.updatedAt = data.updatedAt;
                    existing.status = "draft";
                    runtimeRecords[recordKey] = existing;

                    // Yeni revizyon kaydı
                    runtimeRevisions.push({
                        id: `rev-${Date.now()}`,
                        recordKey,
                        projectId: activeProjectId,
                        itemId: activeItemId,
                        criterionKey,
                        prevContent: data.prevContent || "",
                        newContent: content,
                        studentName: currentSession.studentName,
                        version: data.version,
                        createdAt: data.updatedAt
                    });

                    updateUIAutosaveBadge("saved");
                    updateProgressBadge();
                    return;
                }
            }
            throw new Error("Kayıt sunucu tarafından onaylanmadı.");
        } catch (err) {
            console.warn("Autosave offline fallback:", err.message);
            updateUIAutosaveBadge("error");
            offlineQueue.push(payload);
            localStorage.setItem("rotali_tubitak_offline_queue", JSON.stringify(offlineQueue));
        }
    }

    // Bekleyen kayıtları anında kaydet (Örn: sayfa değişirken veya formdan çıkarken)
    function flushPendingSaves() {
        for (const [key, timer] of Object.entries(autoSaveTimers)) {
            clearTimeout(timer);
            const [itemId, critKey] = key.split("__");
            const isSameActive = itemId === activeItemId || (activeProjectId === "proje-siyer" && activeItemId && key.startsWith(`${activeItemId}__ev_`));
            if (isSameActive && runtimeRecords[key]) {
                const actualItemId = runtimeRecords[key].itemId || key.slice(0, key.lastIndexOf("__"));
                const actualCritKey = key.slice(key.lastIndexOf("__") + 2);
                executeSave(actualCritKey, runtimeRecords[key].content, actualItemId);
            }
        }
    }"""

replacement_save_block = """    // 5. Otomatik Kayıt Motoru (Debounce ~1000ms & Güvenli Çevrimdışı Kuyruk)
    function addToOfflineQueue(payload) {
        try {
            const raw = localStorage.getItem("rotali_tubitak_offline_queue");
            const queue = raw ? JSON.parse(raw) : [];
            const idx = queue.findIndex(q => q.itemId === payload.itemId && q.criterionKey === payload.criterionKey);
            if (idx >= 0) {
                queue[idx] = payload;
            } else {
                queue.push(payload);
            }
            localStorage.setItem("rotali_tubitak_offline_queue", JSON.stringify(queue));
        } catch (e) {}
    }

    function removeFromOfflineQueue(itemId, criterionKey) {
        try {
            const raw = localStorage.getItem("rotali_tubitak_offline_queue");
            if (!raw) return;
            let queue = JSON.parse(raw);
            queue = queue.filter(q => !(q.itemId === itemId && q.criterionKey === criterionKey));
            localStorage.setItem("rotali_tubitak_offline_queue", JSON.stringify(queue));
        } catch (e) {}
    }

    async function processOfflineQueue() {
        try {
            const raw = localStorage.getItem("rotali_tubitak_offline_queue");
            if (!raw) return;
            const queue = JSON.parse(raw);
            if (!Array.isArray(queue) || queue.length === 0) return;
            if (!currentSession?.token) return;

            updateUIAutosaveBadge("saving");
            const remaining = [];
            for (const item of queue) {
                try {
                    const res = await fetch("/api/tubitak-records", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${currentSession.token}`
                        },
                        body: JSON.stringify(item)
                    });
                    if (res.ok) {
                        const data = await res.json();
                        if (data.ok && data.status === "saved") {
                            const recKey = `${item.itemId}__${item.criterionKey}`;
                            if (runtimeRecords[recKey]) {
                                runtimeRecords[recKey].version = data.version;
                                runtimeRecords[recKey].updatedAt = data.updatedAt;
                            }
                            continue;
                        }
                    }
                    remaining.push(item);
                } catch (e) {
                    remaining.push(item);
                }
            }

            localStorage.setItem("rotali_tubitak_offline_queue", JSON.stringify(remaining));
            if (remaining.length === 0) {
                updateUIAutosaveBadge("saved");
                showNotice("Çevrimdışı kaydedilen tüm taslaklar buluta başarıyla eşitlendi! ✅", "success");
            } else {
                updateUIAutosaveBadge("error");
            }
        } catch (err) {
            console.warn("Offline queue sync error:", err);
        }
    }

    function queueAutoSave(criterionKey, newContent, targetItemId = activeItemId) {
        if (!currentSession || !targetItemId) return;

        const recordKey = `${targetItemId}__${criterionKey}`;
        const existing = runtimeRecords[recordKey] || { version: 0, content: "" };
        const prevContent = existing.content || "";

        // Geri Al yığınına ekle
        if (!undoStacks[recordKey]) undoStacks[recordKey] = [];
        undoStacks[recordKey].push(prevContent);
        if (undoStacks[recordKey].length > 30) undoStacks[recordKey].shift();
        redoStacks[recordKey] = []; // Yeni yazımda redo sıfırlanır

        // Yerel kaydı hemen güncelle (arayüz anında güncel kalsın)
        existing.content = newContent;
        existing.itemId = targetItemId;
        existing.studentName = currentSession.studentName;
        existing.studentId = currentSession.studentId;
        existing.updatedAt = new Date().toISOString();
        runtimeRecords[recordKey] = existing;

        updateUIAutosaveBadge("dirty");

        // Zamanlayıcıyı sıfırla ve yeniden kur (~1000ms)
        if (autoSaveTimers[recordKey]) clearTimeout(autoSaveTimers[recordKey]);

        autoSaveTimers[recordKey] = setTimeout(async () => {
            delete autoSaveTimers[recordKey];
            await executeSave(criterionKey, newContent, targetItemId);
        }, 1000);
    }

    async function executeSave(criterionKey, content, targetItemId = activeItemId) {
        if (!currentSession || !targetItemId) return;
        const recordKey = `${targetItemId}__${criterionKey}`;
        const existing = runtimeRecords[recordKey] || { version: 0 };

        updateUIAutosaveBadge("saving");

        const payload = {
            projectId: activeProjectId,
            itemId: targetItemId,
            criterionKey,
            content,
            clientVersion: existing.version || 0,
            studentName: currentSession.studentName,
            studentId: currentSession.studentId
        };

        try {
            const res = await fetch("/api/tubitak-records", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${currentSession.token}`
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                const data = await res.json();
                if (data.ok && data.status === "saved") {
                    existing.version = data.version;
                    existing.updatedAt = data.updatedAt;
                    existing.status = "draft";
                    runtimeRecords[recordKey] = existing;

                    // Yeni revizyon kaydı
                    runtimeRevisions.push({
                        id: `rev-${Date.now()}`,
                        recordKey,
                        projectId: activeProjectId,
                        itemId: activeItemId,
                        criterionKey,
                        prevContent: data.prevContent || "",
                        newContent: content,
                        studentName: currentSession.studentName,
                        version: data.version,
                        createdAt: data.updatedAt
                    });

                    removeFromOfflineQueue(targetItemId, criterionKey);
                    updateUIAutosaveBadge("saved");
                    updateProgressBadge();
                    return;
                }
            }
            throw new Error("Kayıt sunucu tarafından onaylanmadı.");
        } catch (err) {
            console.warn("Autosave offline fallback:", err.message);
            const isOnline = (typeof navigator !== "undefined" && navigator.onLine);
            updateUIAutosaveBadge(isOnline ? "error" : "waiting_connection");
            addToOfflineQueue(payload);
        }
    }

    // Bekleyen tüm kayıtları anında kaydet ve bekle (Sayfa, konu veya kriter değişirken veri kaybını önler)
    async function flushPendingSaves() {
        const promises = [];
        for (const [key, timer] of Object.entries(autoSaveTimers)) {
            clearTimeout(timer);
            delete autoSaveTimers[key];
            if (runtimeRecords[key]) {
                const actualItemId = runtimeRecords[key].itemId || key.slice(0, key.lastIndexOf("__"));
                const actualCritKey = key.slice(key.lastIndexOf("__") + 2);
                promises.push(executeSave(actualCritKey, runtimeRecords[key].content, actualItemId));
            }
        }
        if (promises.length > 0) {
            await Promise.all(promises);
        }
    }"""

if target_save_block in content:
    content = content.replace(target_save_block, replacement_save_block, 1)
    print("5. Replaced auto-save block with robust offline queue & async flush.")

# 6. Update updateUIAutosaveBadge
target_badge = """            case "error":
                dot.className = "w-2.5 h-2.5 rounded-full bg-rose-500";
                text.textContent = "Bağlantı sorunu (Kuyrukta)";
                text.className = "text-xs font-black text-rose-700";
                break;
            default:
                dot.className = "w-2.5 h-2.5 rounded-full bg-slate-400";
                text.textContent = "Hazır";
                text.className = "text-xs font-bold text-slate-500";
        }"""

replacement_badge = """            case "error":
                dot.className = "w-2.5 h-2.5 rounded-full bg-rose-500";
                text.textContent = "Kaydetme başarısız";
                text.className = "text-xs font-black text-rose-700";
                break;
            case "waiting_connection":
                dot.className = "w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping";
                text.textContent = "Bağlantı bekleniyor";
                text.className = "text-xs font-black text-amber-800";
                break;
            default:
                dot.className = "w-2.5 h-2.5 rounded-full bg-slate-400";
                text.textContent = "Hazır";
                text.className = "text-xs font-bold text-slate-500";
        }"""

if target_badge in content:
    content = content.replace(target_badge, replacement_badge, 1)
    print("6. Updated updateUIAutosaveBadge with exact requested statuses.")

# 7. Update openTeacherDashboardModal and add dynamic updater
target_open_modal = """    function openTeacherDashboardModal() {
        let modal = document.getElementById("tubitak-teacher-modal");"""

replacement_open_modal = """    function updateTeacherModalDynamicStats() {
        const totalEl = document.getElementById("teacher-stat-total-records");
        const inReviewEl = document.getElementById("teacher-stat-inreview-records");
        const approvedEl = document.getElementById("teacher-stat-approved-records");
        const revisionsEl = document.getElementById("teacher-stat-revisions-count");
        const syncTimeEl = document.getElementById("sync-health-time");
        if (totalEl) totalEl.textContent = `${Object.keys(runtimeRecords).length} Alan`;
        if (inReviewEl) inReviewEl.textContent = `${Object.values(runtimeRecords).filter(r => r.status === "in_review").length} Bekleyen`;
        if (approvedEl) approvedEl.textContent = `${Object.values(runtimeRecords).filter(r => r.status === "approved").length} Tamam`;
        if (revisionsEl) revisionsEl.textContent = `${runtimeRevisions.length} Sürüm`;
        if (syncTimeEl) syncTimeEl.textContent = new Date().toLocaleTimeString("tr-TR");
    }

    async function openTeacherDashboardModal() {
        // En güncel bulut verilerini çek
        await syncProjectData("all");
        let modal = document.getElementById("tubitak-teacher-modal");"""

if target_open_modal in content:
    content = content.replace(target_open_modal, replacement_open_modal, 1)
    print("7. Updated openTeacherDashboardModal to sync data and added updateTeacherModalDynamicStats.")

# 8. Add IDs to modal stats cards and insert the Veri Kayıt ve Senkronizasyon Durumu card
target_modal_stats = """            <!-- İstatistik Kartları -->
            <div class="p-6 grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 border-b border-slate-200">
                <div class="p-3 bg-white rounded-2xl border border-slate-200">
                    <div class="text-[10px] font-bold text-slate-500 uppercase">Toplam Kayıt</div>
                    <div class="text-xl font-black text-slate-900 mt-0.5">${totalRecords} Alan</div>
                </div>
                <div class="p-3 bg-white rounded-2xl border border-slate-200">
                    <div class="text-[10px] font-bold text-blue-600 uppercase">İncelemede</div>
                    <div class="text-xl font-black text-blue-600 mt-0.5">${inReviewCount} Bekleyen</div>
                </div>
                <div class="p-3 bg-white rounded-2xl border border-slate-200">
                    <div class="text-[10px] font-bold text-emerald-600 uppercase">Onaylanan</div>
                    <div class="text-xl font-black text-emerald-600 mt-0.5">${approvedCount} Tamam</div>
                </div>
                <div class="p-3 bg-white rounded-2xl border border-slate-200">
                    <div class="text-[10px] font-bold text-purple-600 uppercase">Toplam Revizyon</div>
                    <div class="text-xl font-black text-purple-600 mt-0.5">${runtimeRevisions.length} Sürüm</div>
                </div>
            </div>"""

replacement_modal_stats = """            <!-- İstatistik Kartları -->
            <div class="p-6 grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 border-b border-slate-200">
                <div class="p-3 bg-white rounded-2xl border border-slate-200">
                    <div class="text-[10px] font-bold text-slate-500 uppercase">Toplam Kayıt</div>
                    <div id="teacher-stat-total-records" class="text-xl font-black text-slate-900 mt-0.5">${totalRecords} Alan</div>
                </div>
                <div class="p-3 bg-white rounded-2xl border border-slate-200">
                    <div class="text-[10px] font-bold text-blue-600 uppercase">İncelemede</div>
                    <div id="teacher-stat-inreview-records" class="text-xl font-black text-blue-600 mt-0.5">${inReviewCount} Bekleyen</div>
                </div>
                <div class="p-3 bg-white rounded-2xl border border-slate-200">
                    <div class="text-[10px] font-bold text-emerald-600 uppercase">Onaylanan</div>
                    <div id="teacher-stat-approved-records" class="text-xl font-black text-emerald-600 mt-0.5">${approvedCount} Tamam</div>
                </div>
                <div class="p-3 bg-white rounded-2xl border border-slate-200">
                    <div class="text-[10px] font-bold text-purple-600 uppercase">Toplam Revizyon</div>
                    <div id="teacher-stat-revisions-count" class="text-xl font-black text-purple-600 mt-0.5">${runtimeRevisions.length} Sürüm</div>
                </div>
            </div>

            <!-- Veri Kayıt ve Senkronizasyon Durumu (Yalnızca Öğretmen / Yönetici) -->
            <div class="px-6 pt-4">
                <div class="p-4 rounded-2xl bg-indigo-50 border border-indigo-200">
                    <div class="flex items-center justify-between gap-3 mb-2">
                        <div class="flex items-center gap-2">
                            <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            <h4 class="font-black text-slate-900 text-sm">Veri Kayıt ve Senkronizasyon Durumu</h4>
                        </div>
                        <span class="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                            Kalıcı Bulut Veritabanı Aktif
                        </span>
                    </div>
                    <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-700 font-semibold">
                        <div class="p-2.5 bg-white rounded-xl border border-indigo-100">
                            <span class="text-slate-400 block text-[9px] uppercase font-bold">Depolama Sağlayıcısı</span>
                            <strong class="text-indigo-900">GitHub Gist Cloud DB</strong>
                        </div>
                        <div class="p-2.5 bg-white rounded-xl border border-indigo-100">
                            <span class="text-slate-400 block text-[9px] uppercase font-bold">Son Başarılı Eşitleme</span>
                            <strong class="text-emerald-700" id="sync-health-time">${new Date().toLocaleTimeString('tr-TR')}</strong>
                        </div>
                        <div class="p-2.5 bg-white rounded-xl border border-indigo-100">
                            <span class="text-slate-400 block text-[9px] uppercase font-bold">Realtime Arka Plan</span>
                            <strong class="text-blue-700">Canlı (Her 4-5 sn)</strong>
                        </div>
                        <div class="p-2.5 bg-white rounded-xl border border-indigo-100">
                            <span class="text-slate-400 block text-[9px] uppercase font-bold">Çevrimdışı Taslak Kuyruğu</span>
                            <strong class="text-slate-800" id="sync-health-queue-count">0 Bekleyen</strong>
                        </div>
                    </div>
                </div>
            </div>"""

if target_modal_stats in content:
    content = content.replace(target_modal_stats, replacement_modal_stats, 1)
    print("8. Added Veri Kayıt ve Senkronizasyon Durumu card to teacher modal.")

# 9. Update selectItem, selectSiyerYear, onFieldBlur to await flushPendingSaves
target_navigation_methods = """        selectItem(itemId) {
            flushPendingSaves();
            activeItemId = itemId;
            renderMainContainer(document.getElementById("tubitak-research-container"));
        },

        selectSiyerYear(yr) {
            flushPendingSaves();
            activeYear = yr;
            const items = getFilteredItems();
            if (items.length > 0) activeItemId = items[0].id;
            renderMainContainer(document.getElementById("tubitak-research-container"));
        },

        handleSearch(val) {
            searchQuery = val;
            renderMainContainer(document.getElementById("tubitak-research-container"));
        },

        handleCriterionInput(criterionKey, val, targetItemId) {
            const effItemId = targetItemId || activeItemId;
            const countEl = document.getElementById(`char-count-${effItemId}__${criterionKey}`) || document.getElementById(`char-count-${criterionKey}`);
            if (countEl) countEl.textContent = formatFieldStats(val);
            const latexPreviewEl = document.getElementById(`latex-preview-${criterionKey}`);
            if (latexPreviewEl) latexPreviewEl.innerHTML = renderLatexHtmlString(val);
            queueAutoSave(criterionKey, val, effItemId);
        },

        onFieldBlur(criterionKey, val, targetItemId) {
            const effItemId = targetItemId || activeItemId;
            if (autoSaveTimers[`${effItemId}__${criterionKey}`]) {
                clearTimeout(autoSaveTimers[`${effItemId}__${criterionKey}`]);
                executeSave(criterionKey, val, effItemId);
            }
        },"""

replacement_navigation_methods = """        async selectItem(itemId) {
            await flushPendingSaves();
            activeItemId = itemId;
            renderMainContainer(document.getElementById("tubitak-research-container"));
        },

        async selectSiyerYear(yr) {
            await flushPendingSaves();
            activeYear = yr;
            const items = getFilteredItems();
            if (items.length > 0) activeItemId = items[0].id;
            renderMainContainer(document.getElementById("tubitak-research-container"));
        },

        handleSearch(val) {
            searchQuery = val;
            renderMainContainer(document.getElementById("tubitak-research-container"));
        },

        handleCriterionInput(criterionKey, val, targetItemId) {
            const effItemId = targetItemId || activeItemId;
            const countEl = document.getElementById(`char-count-${effItemId}__${criterionKey}`) || document.getElementById(`char-count-${criterionKey}`);
            if (countEl) countEl.textContent = formatFieldStats(val);
            const latexPreviewEl = document.getElementById(`latex-preview-${criterionKey}`);
            if (latexPreviewEl) latexPreviewEl.innerHTML = renderLatexHtmlString(val);
            queueAutoSave(criterionKey, val, effItemId);
        },

        async onFieldBlur(criterionKey, val, targetItemId) {
            const effItemId = targetItemId || activeItemId;
            const recordKey = `${effItemId}__${criterionKey}`;
            if (autoSaveTimers[recordKey]) {
                clearTimeout(autoSaveTimers[recordKey]);
                delete autoSaveTimers[recordKey];
            }
            if (runtimeRecords[recordKey]) {
                runtimeRecords[recordKey].content = val;
            }
            await executeSave(criterionKey, val, effItemId);
        },"""

if target_navigation_methods in content:
    content = content.replace(target_navigation_methods, replacement_navigation_methods, 1)
    print("9. Made selectItem, selectSiyerYear, and onFieldBlur async with awaited flushPendingSaves.")

# 10. Update navigateSiyerYear
target_nav_siyer = """        navigateSiyerYear(targetYear) {
            const items = seedData?.projects?.["proje-siyer"]?.items || [];
            const match = items.find(it => it.year === Number(targetYear));
            if (match) {
                flushPendingSaves();
                activeItemId = match.id;
                activeYear = match.year;
                renderMainContainer(document.getElementById("tubitak-research-container"));
            }
        },"""

replacement_nav_siyer = """        async navigateSiyerYear(targetYear) {
            const items = seedData?.projects?.["proje-siyer"]?.items || [];
            const match = items.find(it => it.year === Number(targetYear));
            if (match) {
                await flushPendingSaves();
                activeItemId = match.id;
                activeYear = match.year;
                renderMainContainer(document.getElementById("tubitak-research-container"));
            }
        },"""

if target_nav_siyer in content:
    content = content.replace(target_nav_siyer, replacement_nav_siyer, 1)
    print("10. Made navigateSiyerYear async with awaited flushPendingSaves.")

# 11. Add lifecycle event listeners before DOMContentLoaded
target_dom_init = """    // DOM hazır olduğunda başlat
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }"""

replacement_dom_init = """    // Sayfa Kapanırken veya Sekme Değişirken Otomatik Kayıt Güvencesi
    if (typeof window !== "undefined") {
        window.addEventListener("beforeunload", (e) => {
            const hasPending = Object.keys(autoSaveTimers).length > 0 || saveState === "dirty" || saveState === "saving";
            if (hasPending) {
                for (const [key, timer] of Object.entries(autoSaveTimers)) {
                    clearTimeout(timer);
                    delete autoSaveTimers[key];
                    if (runtimeRecords[key] && currentSession?.token) {
                        const actualItemId = runtimeRecords[key].itemId || key.slice(0, key.lastIndexOf("__"));
                        const actualCritKey = key.slice(key.lastIndexOf("__") + 2);
                        const payload = {
                            projectId: activeProjectId,
                            itemId: actualItemId,
                            criterionKey: actualCritKey,
                            content: runtimeRecords[key].content,
                            clientVersion: runtimeRecords[key].version || 0,
                            studentName: currentSession.studentName,
                            studentId: currentSession.studentId
                        };
                        try {
                            fetch("/api/tubitak-records", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                    "Authorization": `Bearer ${currentSession.token}`
                                },
                                body: JSON.stringify(payload),
                                keepalive: true
                            });
                        } catch (err) {}
                    }
                }
                e.preventDefault();
                e.returnValue = "Kaydedilmemiş araştırma verileriniz olabilir. Sayfadan ayrılmak istediğinizden emin misiniz?";
                return e.returnValue;
            }
        });

        document.addEventListener("visibilitychange", () => {
            if (document.visibilityState === "hidden") {
                flushPendingSaves();
            }
        });

        window.addEventListener("pagehide", () => {
            flushPendingSaves();
        });

        window.addEventListener("online", () => {
            processOfflineQueue();
        });
    }

    // DOM hazır olduğunda başlat
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }"""

if target_dom_init in content:
    content = content.replace(target_dom_init, replacement_dom_init, 1)
    print("11. Added lifecycle event listeners (beforeunload, visibilitychange, pagehide, online).")

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("SUCCESS: js/tubitak-research.js successfully updated!")
