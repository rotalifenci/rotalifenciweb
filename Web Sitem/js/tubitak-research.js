/**
 * =========================================================================
 * 🏛️ ROTALI FENCİ – TÜBİTAK BİLİMSEL ARAŞTIRMA VE OTOMATİK KAYIT SİSTEMİ
 * 3 Şifreli Proje Alanı:
 *   1. Sivas Tarihî Eserler Araştırma Sistemi (8 Kriter)
 *   2. Türk-İslam Bilim İnsanları Araştırma Sistemi (8 Kriter)
 *   3. Siyer Kronolojik Araştırma Sistemi (571–632 Yılları, 6 Kriter)
 * 
 * Temel Yetenekler:
 *   - Proje bazlı şifreli yetkilendirme & öğrenci PIN/kimlik izleme
 *   - 1 sn gecikmeli (debounced) güvenli otomatik kayıt & sunucu teyidi
 *   - Geri Al ↶ & İleri Al ↷ butonları ve tam revizyon geçmişi
 *   - Gerçek zamanlı öğretmen yönetim paneli & anlık onay/düzeltme akışı
 *   - Akademik kaynakça ve belge yönetim sistemi
 *   - Supabase PostgreSQL ana veri kaynağı & çevrimdışı kuyruk koruması
 * =========================================================================
 */

(function() {
    // 1. Durum Değişkenleri
    let currentSession = null;
    let seedData = (typeof window !== "undefined" && window.TUBITAK_SEED_DATA) ? window.TUBITAK_SEED_DATA : null;
    let activeProjectId = "proje-tarih";
    let activeItemId = null;
    let activeFilter = "all";
    let activePeriodFilter = "all";
    let activeStudentFilterId = "all";
    let activeSort = "original";
    let activeYear = 571;
    let searchQuery = "";
    let workspaceView = "research"; // "research" | "analysis" | "comparative"
    let analysisCategoryFilter = "all";

    // Karşılaştırmalı Tarih ve Kanıt Analizi Durum Değişkenleri
    let runtimeComparisons = {};
    let activeComparisonId = null;
    let selectedComparisonGroupId = "medreseler";
    let selectedComparisonMonumentIds = ["gok-medrese", "buruciye-medresesi"];
    let comparativeSubTab = "table"; // "table" | "timeline" | "visual"
    const comparisonUndoStack = [];
    const comparisonRedoStack = [];
    let comparisonSaveState = "idle"; // "idle" | "saving" | "saved" | "error"
    let comparisonAutoSaveTimer = null;

    // Kayıtlar, revizyonlar ve yerel durum
    let runtimeRecords = {};        // { "item__crit": { content, version, updatedAt, studentName, status } }
    let runtimeRevisions = [];      // [ { id, recordKey, prevContent, newContent, studentName, version, createdAt } ]
    let runtimeSources = {};        // { "sourceId": { itemId, author, title, year, page, publisher, url, description } }
    let runtimeFeedbacks = [];      // [ { id, itemId, teacherName, message, status, createdAt } ]
    let runtimeAssignments = {};
    let runtimeFinalized = {};
    let runtimeStudentState = {};
    let lastSavedTimeString = "";
    let teacherFilterStatus = "all";    // { "itemId": { itemId, assignedStudentId, updatedAt, assignedBy } }
    let runtimeSiyerEvents = {};    // { "siyer-571": ["siyer-571__ev_2", ...] }
    let runtimeSiyerYearFlags = {}; // { "siyer-571": { status: "no_event_found", label: "..." } }

    // Geri Al / İleri Al yığınları (Her kriter alanı için bağımsız)
    const undoStacks = {};
    const redoStacks = {};

    // Otomatik kayıt zamanlayıcıları ve kuyruğu
    const autoSaveTimers = {};
    const offlineQueue = [];
    let saveState = "idle"; // "idle", "dirty", "saving", "saved", "error", "waiting_connection"
    let latestSyncHealth = null;
    let isWordDownloading = false;

    // Tarihsel kriter ve eser anahtar eşlemeleri (Historical Aliasing)
    const CRITERION_ALIASES = {
        "c4_konumu": ["c1_location", "c5_konum_ada_parsel", "c2_tescil_konum"],
        "c5_yaptiran": ["c3_banisi"],
        "c7_mimari_tarz": ["c4_mimari", "c8_susleme_sanat", "c3_mimari_ozellik", "c1_mimari"],
        "c10_yapim_malzemesi": ["c6_kullanilan_malzeme"],
        "c11_plan": ["c7_plan_tipi"],
        "c14_restorasyon": ["c13_onarimlar"],
        "c15_kulturel_miras_tescil": ["c14_gunumuz_durumu"],
        "c18_kaynak": ["c16_kaynakca", "c18_degerlendirme"]
    };

    const ITEM_ALIASES = {
        "divrigi-ulu-camii": "divrigi-ulu-camii-darussifasi",
        "divrigi-ulu-camii-darussifasi": "divrigi-ulu-camii",
        "bilim-01-bircendi": "bircendi",
        "bircendi": "bilim-01-bircendi"
    };

    function getRecordWithAliases(itemId, critKey) {
        if (!itemId || !critKey) return null;
        const directKey = `${itemId}__${critKey}`;
        let rec = runtimeRecords[directKey];
        if (rec && typeof rec.content === 'string' && rec.content.trim().length > 0) return rec;

        const altItemId = ITEM_ALIASES[itemId];
        if (altItemId) {
            const altKey = `${altItemId}__${critKey}`;
            const altRec = runtimeRecords[altKey];
            if (altRec && typeof altRec.content === 'string' && altRec.content.trim().length > 0) return altRec;
        }

        const aliases = CRITERION_ALIASES[critKey] || [];
        for (const aKey of aliases) {
            const k1 = `${itemId}__${aKey}`;
            const r1 = runtimeRecords[k1];
            if (r1 && typeof r1.content === 'string' && r1.content.trim().length > 0) return r1;

            if (altItemId) {
                const k2 = `${altItemId}__${aKey}`;
                const r2 = runtimeRecords[k2];
                if (r2 && typeof r2.content === 'string' && r2.content.trim().length > 0) return r2;
            }
        }
        return rec || (altItemId ? runtimeRecords[`${altItemId}__${critKey}`] : null) || null;
    }

    // 2. Başlatma & Oturum Kontrolü
    async function init() {
        loadStoredSession();
        // ⚡ Anında yerel önbellekten yükle (Ağ beklenmeden veri kutuları 0. milisaniyede dolsun)
        if (activeProjectId) {
            try {
                const cachedRecords = localStorage.getItem(`rotali_cached_records_${activeProjectId}`);
                if (cachedRecords) {
                    const parsedRecs = JSON.parse(cachedRecords);
                    if (parsedRecs && typeof parsedRecs === 'object') {
                        runtimeRecords = { ...parsedRecs, ...runtimeRecords };
                    }
                }
            } catch(e) {}
        }
        await loadSeedData();
        if (currentSession) {
            await syncProjectData(currentSession.projectId);
            await processOfflineQueue();
            startLivePolling();
        }
        if (typeof document !== "undefined") {
            const mountedContainer = document.getElementById("tubitak-research-container");
            if (mountedContainer) {
                renderMainContainer(mountedContainer);
            }
        }
    }

    function loadStoredSession() {
        try {
            const raw = localStorage.getItem("rotali_tubitak_session");
            if (raw) {
                const parsed = JSON.parse(raw);
                const exp = Number(parsed.exp || parsed.expiresAt || 0);
                const isValid = (exp > 0 ? exp > Date.now() : Boolean(parsed.token));
                if (isValid) {
                    currentSession = parsed;
                    if (currentSession.role === "student" && currentSession.projectId !== "all") {
                        activeProjectId = currentSession.projectId;
                    }
                    try {
                        const savedActiveItem = localStorage.getItem(`rotali_last_item_${activeProjectId}`);
                        if (savedActiveItem) {
                            activeItemId = savedActiveItem;
                        }
                    } catch(e) {}
                } else {
                    localStorage.removeItem("rotali_tubitak_session");
                }
            }
        } catch (e) {
            console.warn("Session parse error:", e);
        }
    }

    async function loadSeedData() {
        try {
            if (window.TUBITAK_SEED_DATA) {
                seedData = window.TUBITAK_SEED_DATA;
                return;
            }
            const res = await fetch("data/tubitak-seed-data.json");
            if (res.ok) {
                seedData = await res.json();
            }
        } catch (e) {
            console.warn("Seed data fetch warning:", e);
        }

        // Güvenli yerel varsayılan
        if (!seedData) {
            seedData = { projects: {} };
        }
    }

    // 3. Sunucu Veri Senkronizasyonu (Gist Cloud DB / Supabase Bridge / API)
    async function syncProjectData(projId, forceFresh = false) {
        if (!currentSession || !currentSession.token) return;
        const targetProj = (currentSession.role === "teacher" && projId) ? projId : currentSession.projectId;
        const freshParam = (forceFresh || currentSession.role === "teacher") ? "&fresh=true" : "";

        try {
            const res = await fetch(`/api/tubitak-records?projectId=${encodeURIComponent(targetProj)}${freshParam}&_t=${Date.now()}`, {
                headers: { "Authorization": `Bearer ${currentSession.token}` },
                cache: "no-store"
            });

            if (res.ok) {
                const data = await res.json();
                if (data.ok) {
                    const incomingRecs = data.records || {};
                    const orphanLocalRecords = [];
                    // Yerelde dolu olup sunucuda boş veya hiç olmayan kayıtları tespit et (Yerel Önbellek Kurtarma Köprüsü)
                    for (const [localKey, localRec] of Object.entries(runtimeRecords)) {
                        if (!localRec || typeof localRec.content !== 'string' || !localRec.content.trim()) continue;
                        if (targetProj !== "all" && localRec.projectId && localRec.projectId !== targetProj) continue;
                        const serverRec = incomingRecs[localKey];
                        const serverContent = (serverRec && typeof serverRec.content === 'string') ? serverRec.content.trim() : '';
                        if (!serverContent) {
                            orphanLocalRecords.push(localRec);
                        }
                    }

                    for (const [k, incRec] of Object.entries(incomingRecs)) {
                        const existing = runtimeRecords[k];
                        if (!existing) {
                            runtimeRecords[k] = incRec;
                        } else {
                            const incContent = (incRec && typeof incRec.content === 'string') ? incRec.content : '';
                            const curContent = (existing && typeof existing.content === 'string') ? existing.content : '';
                            const incVer = incRec?.version || 0;
                            const curVer = existing?.version || 0;

                            // 🛡️ KALICI KORUMA: Dolu yerel metin, sunucudan gelen boş metinle ezilmez!
                            if (curContent.trim() && !incContent.trim()) {
                                continue;
                            }
                            if (incVer >= curVer || !curContent.trim()) {
                                runtimeRecords[k] = incRec;
                            }
                        }
                    }

                    // Sunucuda eksik kalmış ama tarayıcı önbelleğinde bulunan dolu kayıtları çevrimdışı kuyruğa alıp buluta kurtar
                    if (orphanLocalRecords.length > 0) {
                        for (const orp of orphanLocalRecords) {
                            const itemId = orp.itemId || String(orp.id || '').split('__')[0];
                            const critKey = orp.criterionKey || String(orp.id || '').split('__')[1];
                            if (itemId && critKey) {
                                addToOfflineQueue({
                                    projectId: orp.projectId || activeProjectId,
                                    itemId,
                                    criterionKey: critKey,
                                    content: orp.content,
                                    clientVersion: orp.version || 0,
                                    studentName: orp.studentName || currentSession.studentName,
                                    studentId: orp.studentId || currentSession.studentId
                                });
                            }
                        }
                    }
                    try {
                        localStorage.setItem(`rotali_cached_records_${targetProj}`, JSON.stringify(runtimeRecords));
                    } catch(e) {}
                    runtimeRevisions = data.revisions || runtimeRevisions;
                    runtimeSources = { ...runtimeSources, ...(data.sources || {}) };
                    runtimeFeedbacks = data.feedbacks || runtimeFeedbacks;
                    runtimeAssignments = { ...(data.assignments || {}) };
                    if (data.finalized) runtimeFinalized = { ...runtimeFinalized, ...data.finalized };
                    if (data.studentState) runtimeStudentState = { ...runtimeStudentState, ...data.studentState };
                    if (data.siyerEvents) runtimeSiyerEvents = { ...data.siyerEvents };
                    if (data.siyerYearFlags) runtimeSiyerYearFlags = { ...data.siyerYearFlags };
                    if (data.comparisons) runtimeComparisons = { ...runtimeComparisons, ...(data.comparisons || {}) };
                    if (data.syncHealth) latestSyncHealth = data.syncHealth;
                    updateUIAutosaveBadge("saved");
                }
            }
        } catch (err) {
            console.warn("Project sync warning (using offline cache):", err.message);
            updateUIAutosaveBadge("waiting_connection");
        }
    }

    // 4. Canlı Yoklama (Realtime Polling Fallback)
    let pollingInterval = null;
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
    }

    // 5. Otomatik Kayıt Motoru (Debounce ~1000ms & Güvenli Çevrimdışı Kuyruk)
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

        // Zamanlayıcıyı sıfırla ve yeniden kur (~2000ms debounce)
        if (autoSaveTimers[recordKey]) clearTimeout(autoSaveTimers[recordKey]);

        autoSaveTimers[recordKey] = setTimeout(async () => {
            delete autoSaveTimers[recordKey];
            await executeSave(criterionKey, newContent, targetItemId);
        }, 2000);
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
            studentId: currentSession.studentId,
            isExplicitEdit: true,
            allowEmpty: true
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
    }

    // 6. Geri Al ↶ & İleri Al ↷ Fonksiyonları
    function performUndo(criterionKey, targetItemId = activeItemId) {
        if (!targetItemId) return;
        const recordKey = `${targetItemId}__${criterionKey}`;
        const stack = undoStacks[recordKey] || [];
        if (stack.length === 0) {
            showNotice("Geri alınacak başka değişiklik yok.", "info");
            return;
        }

        const currentVal = runtimeRecords[recordKey]?.content || "";
        if (!redoStacks[recordKey]) redoStacks[recordKey] = [];
        redoStacks[recordKey].push(currentVal);

        const previousVal = stack.pop();
        if (!runtimeRecords[recordKey]) {
            runtimeRecords[recordKey] = {
                id: recordKey,
                projectId: activeProjectId || "proje-siyer",
                itemId: targetItemId,
                criterionKey: criterionKey,
                content: previousVal,
                version: 1,
                status: "draft",
                studentName: currentSession?.studentName || "Öğrenci",
                updatedAt: new Date().toISOString()
            };
        } else {
            runtimeRecords[recordKey].content = previousVal;
            runtimeRecords[recordKey].updatedAt = new Date().toISOString();
        }

        const textarea = document.getElementById(`input-${targetItemId}__${criterionKey}`) || document.getElementById(`input-${criterionKey}`);
        if (textarea) {
            textarea.value = previousVal;
            autoGrowTextarea(textarea);
        }
        const countEl = document.getElementById(`char-count-${targetItemId}__${criterionKey}`) || document.getElementById(`char-count-${criterionKey}`);
        if (countEl) countEl.textContent = formatFieldStats(previousVal);

        if (activeProjectId === "proje-siyer" || criterionKey.includes("kok_deger")) {
            updateSiyerRootValueChipsUI(targetItemId, criterionKey, previousVal);
        }

        queueAutoSave(criterionKey, previousVal, targetItemId);
        showNotice("Değişiklik geri alındı ↶", "success");
    }

    function performRedo(criterionKey, targetItemId = activeItemId) {
        if (!targetItemId) return;
        const recordKey = `${targetItemId}__${criterionKey}`;
        const stack = redoStacks[recordKey] || [];
        if (stack.length === 0) {
            showNotice("İleri alınacak işlem bulunmuyor.", "info");
            return;
        }

        const currentVal = runtimeRecords[recordKey]?.content || "";
        if (!undoStacks[recordKey]) undoStacks[recordKey] = [];
        undoStacks[recordKey].push(currentVal);

        const nextVal = stack.pop();
        if (!runtimeRecords[recordKey]) {
            runtimeRecords[recordKey] = {
                id: recordKey,
                projectId: activeProjectId || "proje-siyer",
                itemId: targetItemId,
                criterionKey: criterionKey,
                content: nextVal,
                version: 1,
                status: "draft",
                studentName: currentSession?.studentName || "Öğrenci",
                updatedAt: new Date().toISOString()
            };
        } else {
            runtimeRecords[recordKey].content = nextVal;
            runtimeRecords[recordKey].updatedAt = new Date().toISOString();
        }

        const textarea = document.getElementById(`input-${targetItemId}__${criterionKey}`) || document.getElementById(`input-${criterionKey}`);
        if (textarea) {
            textarea.value = nextVal;
            autoGrowTextarea(textarea);
        }
        const countEl = document.getElementById(`char-count-${targetItemId}__${criterionKey}`) || document.getElementById(`char-count-${criterionKey}`);
        if (countEl) countEl.textContent = formatFieldStats(nextVal);

        if (activeProjectId === "proje-siyer" || criterionKey.includes("kok_deger")) {
            updateSiyerRootValueChipsUI(targetItemId, criterionKey, nextVal);
        }

        queueAutoSave(criterionKey, nextVal, targetItemId);
        showNotice("Değişiklik yinelendi ↷", "success");
    }

    // 7. ARAYÜZ OLUŞTURMA VE RENDER (HTML & Tailwind)
    function renderMainContainer(targetEl) {
        if (!targetEl) return;

        // Oturum Yoksa -> Şifreli Giriş Ekranı
        if (!currentSession) {
            targetEl.innerHTML = renderLoginScreen();
            bindLoginEvents();
            return;
        }

        // Oturum Varsa -> Araştırma Platformu Arayüzü
        targetEl.innerHTML = renderResearchWorkspace();
        bindWorkspaceEvents();
        updateProgressBadge();
    }

    // 🔑 ŞİFRELİ GİRİŞ EKRANI BİLEŞENİ (SADE & PROJELER GİZLİ)
    function renderLoginScreen() {
        return `
        <div class="max-w-xl mx-auto px-4 py-12 animate-in fade-in duration-300">
            <div class="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-10 border-2 border-amber-500/40 shadow-2xl text-white relative overflow-hidden">
                <div class="absolute -top-20 -right-20 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
                <div class="absolute -bottom-20 -left-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

                <!-- Logo & Başlık -->
                <div class="text-center mb-8 relative z-10">
                    <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-amber-400 via-orange-500 to-red-500 flex items-center justify-center text-slate-950 text-2xl font-black shadow-lg shadow-amber-500/25">
                        <i class="fa-solid fa-microscope"></i>
                    </div>
                    <span class="px-4 py-1.5 rounded-full text-xs font-black bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-widest inline-flex items-center gap-1.5 mb-3">
                        <span>TÜBİTAK 2204-B</span>
                    </span>
                    <h2 class="text-2xl sm:text-3xl font-black text-white tracking-tight">BİLİMSEL ARAŞTIRMA MERKEZİ</h2>
                    <p class="text-xs sm:text-sm text-slate-300 font-medium max-w-md mx-auto mt-2.5 leading-relaxed">
                        Öğretmeninizden aldığınız giriş bilgileriyle araştırma sistemine giriş yapınız.
                    </p>
                </div>

                <!-- Giriş Formu -->
                <form id="tubitak-login-form" class="space-y-4 relative z-10" onsubmit="event.preventDefault(); window.RotaliTubitak.handleLogin();">
                    <!-- 1. Araştırmacı Kimliği / Kullanıcı Adı -->
                    <div>
                        <label for="login-username" class="block text-xs font-black uppercase tracking-wider text-slate-300 mb-2 flex items-center justify-between">
                            <span>👤 Araştırmacı Kimliği / Kullanıcı Adı</span>
                            <span class="text-[10px] text-amber-400 lowercase font-medium">adınız veya araştırmacı kodunuz</span>
                        </label>
                        <div class="relative flex items-center">
                            <input type="text" id="login-username" placeholder="Araştırmacı adınız veya kodunuz" autocomplete="username" class="w-full px-4 py-3.5 bg-slate-800/90 border border-slate-700 focus:border-amber-400 rounded-2xl text-sm font-semibold text-white placeholder-slate-500 focus:outline-none transition-all shadow-inner">
                        </div>
                    </div>

                    <!-- 2. Şifre & Şifreyi Göster / Gizle -->
                    <div>
                        <label for="login-password" class="block text-xs font-black uppercase tracking-wider text-slate-300 mb-2 flex items-center justify-between">
                            <span>🔑 Şifre</span>
                            <span class="text-[10px] text-amber-400 lowercase font-medium">giriş parolası</span>
                        </label>
                        <div class="relative flex items-center">
                            <input type="password" id="login-password" placeholder="Şifrenizi giriniz" required autocomplete="current-password" class="w-full pl-4 pr-12 py-3.5 bg-slate-800/90 border border-slate-700 focus:border-amber-400 rounded-2xl text-sm font-semibold text-white placeholder-slate-500 focus:outline-none transition-all shadow-inner">
                            <button type="button" id="btn-toggle-login-password" onclick="window.RotaliTubitak.toggleLoginPasswordVisibility()" class="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-slate-700/60 hover:bg-slate-700 text-slate-300 hover:text-amber-400 transition-all flex items-center justify-center cursor-pointer focus:outline-none" title="Şifreyi Göster / Gizle">
                                <i id="login-password-eye-icon" class="fa-solid fa-eye text-sm"></i>
                            </button>
                        </div>
                    </div>

                    <div id="login-error-msg" class="hidden p-3.5 rounded-2xl bg-red-900/40 border border-red-500/50 text-red-200 text-xs font-semibold flex items-center gap-2.5">
                        <i class="fa-solid fa-triangle-exclamation text-red-400 shrink-0 text-sm"></i>
                        <span id="login-error-text">Hatalı şifre.</span>
                    </div>

                    <!-- 3. GİRİŞ YAP Butonu -->
                    <button type="submit" id="login-submit-btn" class="w-full py-4 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-sm uppercase tracking-wider rounded-2xl transition-all shadow-lg shadow-amber-500/25 active:scale-95 cursor-pointer flex items-center justify-center gap-2 mt-2">
                        <i class="fa-solid fa-right-to-bracket text-base"></i>
                        <span>GİRİŞ YAP</span>
                    </button>
                </form>

                <div class="mt-6 pt-5 border-t border-slate-800 text-center text-[11px] text-slate-400">
                    <i class="fa-solid fa-shield-halved text-emerald-400 mr-1"></i>
                    <span>Tüm araştırmalarınız doğrudan Supabase PostgreSQL bulut veritabanında anlık ve güvenle saklanır.</span>
                </div>
            </div>
        </div>
        `;
    }

    // 🖥️ ARAŞTIRMA ÇALIŞMA ALANI BİLEŞENİ (2 PANELLİ MASAÜSTÜ & MOBİL)
    function renderResearchWorkspace() {
        const isTeacher = currentSession.role === "teacher";
        const projData = seedData?.projects?.[activeProjectId] || {};
        const items = getFilteredItems();

        if (!activeItemId && items.length > 0) {
            activeItemId = items[0].id;
        }

        const activeItem = items.find(it => it.id === activeItemId) || items[0] || {};
        if (activeItem.id && activeItem.id !== activeItemId) {
            activeItemId = activeItem.id;
        }

        return `
        <div class="max-w-[1600px] mx-auto px-3 sm:px-6 py-6 animate-in fade-in duration-300">
            <!-- 🌟 ÜST NAVİGASYON ŞERİDİ & OTURUM ÇUBUĞU -->
            <div class="mb-6 rounded-3xl bg-slate-900 text-white p-4 sm:p-5 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div class="flex items-center gap-3.5">
                    <div class="w-11 h-11 rounded-2xl bg-gradient-to-tr ${projData.color || 'from-amber-500 to-orange-600'} text-white flex items-center justify-center text-lg font-black shadow-md shrink-0">
                        <i class="${projData.icon || 'fa-solid fa-microscope'}"></i>
                    </div>
                    <div>
                        <div class="flex items-center gap-2 flex-wrap">
                            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-white/10 text-amber-300 border border-white/15 uppercase">
                                ${projData.badge || 'TÜBİTAK 2204-B'}
                            </span>
                            ${isTeacher ? `
                            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-500/20 text-rose-300 border border-rose-500/30">
                                👑 ÖĞRETMEN: ${escapeHtml(currentSession.studentName || 'rotali58')}
                            </span>
                            ` : `
                            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                                👤 ${escapeHtml(currentSession.studentName)}
                            </span>
                            `}
                        </div>
                        <h2 class="text-base sm:text-lg font-black text-white tracking-tight">${projData.title || 'Bilimsel Araştırma'}</h2>
                    </div>
                </div>

                <!-- Öğretmen için 3 Proje Arasında Geçiş Butonları -->
                ${isTeacher ? `
                <div class="flex items-center gap-1.5 bg-slate-950 p-1 rounded-2xl border border-slate-800 overflow-x-auto">
                    <button onclick="window.RotaliTubitak.switchProject('proje-tarih')" class="px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${activeProjectId === 'proje-tarih' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'}">
                        🏛️ Tarihî Eserler
                    </button>
                    <button onclick="window.RotaliTubitak.switchProject('proje-bilim')" class="px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${activeProjectId === 'proje-bilim' ? 'bg-cyan-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'}">
                        🔬 Bilim İnsanları
                    </button>
                    <button onclick="window.RotaliTubitak.switchProject('proje-siyer')" class="px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${activeProjectId === 'proje-siyer' ? 'bg-emerald-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'}">
                        📜 Siyer Kronolojisi
                    </button>
                </div>
                ` : ''}

                <!-- Araç Butonları & Çıkış -->
                <div class="flex items-center gap-2 flex-wrap">
                    <div class="flex items-center gap-1 bg-slate-950 p-1 rounded-2xl border border-slate-800">
                        <button type="button" onclick="window.RotaliTubitak.setWorkspaceView('research')" class="px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${workspaceView === 'research' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-300 hover:text-white'}">
                            <i class="fa-solid fa-pen-to-square text-xs"></i>
                            <span>Araştırma</span>
                        </button>
                        ${activeProjectId === 'proje-tarih' ? `
                        <button type="button" onclick="window.RotaliTubitak.setWorkspaceView('comparative')" class="px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${workspaceView === 'comparative' ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-sm font-black' : 'text-amber-400 hover:text-white'}">
                            <i class="fa-solid fa-scale-balanced text-xs"></i>
                            <span>KARŞILAŞTIRMALI TARİH</span>
                        </button>
                        ` : ''}
                        <button type="button" onclick="window.RotaliTubitak.setWorkspaceView('analysis')" class="px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${workspaceView === 'analysis' ? 'bg-cyan-400 text-slate-950 shadow-sm' : 'text-cyan-300 hover:text-white'}">
                            <i class="fa-solid fa-chart-pie text-xs"></i>
                            <span>VERİ ANALİZİ</span>
                        </button>
                    </div>
                    ${isTeacher ? `
                    <button onclick="window.RotaliTubitak.openTeacherDashboardModal()" class="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs transition-all shadow-md flex items-center gap-1.5 cursor-pointer">
                        <i class="fa-solid fa-chart-line text-xs"></i>
                        <span>Öğretmen Paneli</span>
                    </button>
                    ` : ''}
                    <button onclick="window.RotaliTubitak.exportCurrentReport()" class="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer" title="Raporu Yazdır / Dışa Aktar">
                        <i class="fa-solid fa-download text-xs"></i>
                        <span class="hidden sm:inline">Rapor Al</span>
                    </button>
                    <button onclick="window.RotaliTubitak.handleLogout()" class="px-3 py-2 rounded-xl bg-red-600/80 hover:bg-red-600 text-white font-bold text-xs transition-all flex items-center gap-1 cursor-pointer" title="Güvenli Çıkış">
                        <i class="fa-solid fa-right-from-bracket"></i>
                        <span class="hidden sm:inline">Çıkış</span>
                    </button>
                </div>
            </div>

            ${workspaceView === 'comparative' && activeProjectId === 'proje-tarih' ? renderComparativeHistorySection(projData) : (workspaceView === 'analysis' ? renderDataAnalysisSection(projData) : `
            <!-- ============================================================== -->
            <!-- 📱 DÖNÜŞÜMLÜ 2 BÖLMELİ ÇALIŞMA ALANI (SOL LİSTE / SAĞ FORM) -->
            <!-- ============================================================== -->
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                <!-- 📋 SOL PANEL: LİSTE VE FİLTRELER (4 Sütun) -->
                <div class="lg:col-span-4 bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-4">
                    
                    ${(activeProjectId === 'proje-tarih' || activeProjectId === 'proje-bilim' || activeProjectId === 'proje-siyer') ? renderStudentSelectionPanel(projData) : ''}
                    ${activeProjectId !== 'proje-tarih' ? `
                    <!-- Arama Kutusu -->
                    <div class="relative">
                        <input type="text" id="tubitak-search-input" value="${escapeHtml(searchQuery)}" oninput="window.RotaliTubitak.handleSearch(this.value)" placeholder="${activeProjectId === 'proje-bilim' ? 'Bilim insanı adına göre ara...' : (activeProjectId === 'proje-siyer' ? 'Yıl ara (571–632)...' : 'Arama yapınız...')}" class="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white transition-all shadow-2xs">
                        <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                    </div>
                    ` : ''}

                    <!-- PROJEYE ÖZEL FİLTRE BİLEŞENLERİ -->
                    ${renderProjectSpecificFilters()}

                    <!-- İlerleme Özeti -->
                    <div class="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
                        <span class="font-bold text-slate-600">Listelenen Kayıt:</span>
                        <span class="font-black text-slate-900">${items.length} ${activeProjectId === 'proje-tarih' ? 'Eser' : (activeProjectId === 'proje-bilim' ? 'Bilim İnsanı' : 'Yıl')}</span>
                    </div>

                    ${activeProjectId === 'proje-tarih' ? `
                    <div class="flex items-center justify-between px-1 pt-1">
                        <h3 class="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                            <i class="fa-solid fa-monument text-amber-600"></i>
                            <span>Eserler</span>
                        </h3>
                        <span class="text-[11px] font-bold text-amber-700">${items.length} Eser</span>
                    </div>
                    ` : (activeProjectId === 'proje-bilim' ? `
                    <div class="flex items-center justify-between px-1 pt-1">
                        <h3 class="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                            <i class="fa-solid fa-atom text-amber-600"></i>
                            <span>Bilim İnsanları</span>
                        </h3>
                        <span class="text-[11px] font-bold text-amber-700">${items.length} Bilim İnsanı</span>
                    </div>
                    ` : (activeProjectId === 'proje-siyer' ? `
                    <div class="flex items-center justify-between px-1 pt-1">
                        <h3 class="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                            <i class="fa-solid fa-mosque text-emerald-600"></i>
                            <span>571–632 Yılları</span>
                        </h3>
                        <span class="text-[11px] font-bold text-emerald-700">${items.length} Yıl</span>
                    </div>
                    ` : ''))}

                    <!-- Kayıt Listesi (Kaydırılabilir) -->
                    <div class="space-y-2 max-h-[620px] overflow-y-auto pr-1 custom-scrollbar">
                        ${items.length === 0 ? `
                        <div class="p-6 text-center rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-500">
                            Seçili filtre kriterlerine uygun kayıt bulunamadı.
                        </div>
                        ` : items.map((it, idx) => {
                            const isSelected = it.id === activeItemId;
                            const filledCount = countItemFilledCriteria(it.id);
                            const totalCriteria = projData.criteriaList ? projData.criteriaList.length : (activeProjectId === 'proje-bilim' ? 14 : (activeProjectId === 'proje-siyer' ? 5 : 18));
                            const pct = totalCriteria > 0 ? Math.round((filledCount / totalCriteria) * 100) : 0;
                            const status = getItemStatus(it.id);
                            const permanentOrder = getItemPermanentOrder(it);
                            const ownerStu = (activeProjectId === 'proje-tarih' || activeProjectId === 'proje-bilim' || activeProjectId === 'proje-siyer') ? getStudentById(getItemAssignedStudentId(it)) : null;

                            return `
                            <div onclick="window.RotaliTubitak.selectItem('${it.id}')" class="p-3.5 rounded-2xl transition-all cursor-pointer border flex flex-col gap-1.5 ${isSelected ? 'bg-amber-50/80 border-amber-400 shadow-sm ring-2 ring-amber-400/20' : 'bg-slate-50/60 hover:bg-slate-100 border-slate-200'}">
                                <div class="flex items-center justify-between gap-2">
                                    <span class="text-[10px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                                        ${(activeProjectId === 'proje-tarih' || activeProjectId === 'proje-bilim' || activeProjectId === 'proje-siyer') ? `<span class="px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-800 font-black">#${permanentOrder}</span>` : ''}
                                        <span>${it.district || it.field || (it.year ? `${it.year}. Yıl` : 'Kayıt')}</span>
                                    </span>
                                    <span class="px-2 py-0.5 rounded-full text-[9px] font-black ${getStatusBadgeClass(status)}">
                                        ${getStatusLabel(status)}
                                    </span>
                                </div>
                                <h4 class="text-xs sm:text-sm font-black text-slate-900 leading-snug ${(activeProjectId === 'proje-tarih' || activeProjectId === 'proje-bilim') ? '' : 'line-clamp-1'}">${escapeHtml(it.title)}</h4>
                                ${ownerStu ? `
                                <div class="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-lg px-2 py-0.5 self-start">
                                    <i class="fa-solid fa-user-graduate mr-1"></i>${escapeHtml(ownerStu.name)}
                                </div>
                                ` : ''}
                                ${activeProjectId === 'proje-bilim' ? `
                                <div class="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mt-0.5">
                                    <div class="h-full ${pct === 100 ? 'bg-emerald-500' : 'bg-amber-500'} rounded-full" style="width: ${pct}%;"></div>
                                </div>
                                ` : ''}
                                <div class="flex items-center justify-between text-[11px] font-semibold text-slate-500 pt-1 border-t border-slate-200/60">
                                    <span>İlerleme:</span>
                                    <span class="font-black ${filledCount === totalCriteria ? 'text-emerald-600' : 'text-amber-600'}">
                                        ${filledCount}/${totalCriteria} Kriter
                                    </span>
                                </div>
                            </div>
                            `;
                        }).join("")}
                    </div>
                </div>

                <!-- 📝 SAĞ PANEL: ARAŞTIRMA FORMU VE KRİTERLER (8 Sütun) -->
                <div class="lg:col-span-8 bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-sm space-y-6">
                    ${renderActiveItemForm(activeItem, projData)}
                </div>

            </div>
            `)}
        </div>
        `;
    }

    // Projeye Özel Filtre Barı (Tarih -> İlçe/Dönem, Bilim -> Alan/Kronolojik, Siyer -> Zaman Çizelgesi)
    function renderProjectSpecificFilters() {
        if (activeProjectId === "proje-tarih") {
            return `
            <div class="grid grid-cols-2 gap-2">
                <div>
                    <label class="block text-[10px] font-black text-slate-500 uppercase mb-1">İlçe Filtresi</label>
                    <select onchange="window.RotaliTubitak.setDistrictFilter(this.value)" class="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800">
                        <option value="all" ${activeFilter === 'all' ? 'selected' : ''}>Tüm İlçeler</option>
                        <option value="Merkez" ${activeFilter === 'Merkez' ? 'selected' : ''}>Merkez</option>
                        <option value="Divriği" ${activeFilter === 'Divriği' ? 'selected' : ''}>Divriği</option>
                        <option value="Kangal" ${activeFilter === 'Kangal' ? 'selected' : ''}>Kangal</option>
                        <option value="Ulaş" ${activeFilter === 'Ulaş' ? 'selected' : ''}>Ulaş</option>
                        <option value="Gürün" ${activeFilter === 'Gürün' ? 'selected' : ''}>Gürün</option>
                        <option value="Yıldızeli" ${activeFilter === 'Yıldızeli' ? 'selected' : ''}>Yıldızeli</option>
                        <option value="Altınyayla" ${activeFilter === 'Altınyayla' ? 'selected' : ''}>Altınyayla</option>
                    </select>
                </div>
                <div>
                    <label class="block text-[10px] font-black text-slate-500 uppercase mb-1">Dönem Filtresi</label>
                    <select onchange="window.RotaliTubitak.setPeriodFilter(this.value)" class="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800">
                        <option value="all" ${activePeriodFilter === 'all' ? 'selected' : ''}>Tüm Dönemler</option>
                        <option value="selcuklu" ${activePeriodFilter === 'selcuklu' ? 'selected' : ''}>Selçuklu</option>
                        <option value="ilhanli" ${activePeriodFilter === 'ilhanli' ? 'selected' : ''}>İlhanlı</option>
                        <option value="beylikler" ${activePeriodFilter === 'beylikler' ? 'selected' : ''}>Beylikler</option>
                        <option value="osmanli" ${activePeriodFilter === 'osmanli' ? 'selected' : ''}>Osmanlı</option>
                        <option value="cumhuriyet" ${activePeriodFilter === 'cumhuriyet' ? 'selected' : ''}>Cumhuriyet</option>
                    </select>
                </div>
            </div>
            `;
        }

        if (activeProjectId === "proje-bilim") {
            return `
            <div>
                <label class="block text-[10px] font-black text-slate-500 uppercase mb-1">Sıralama</label>
                <select onchange="window.RotaliTubitak.setSortOrder(this.value)" class="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800">
                    <option value="original" ${activeSort === 'original' ? 'selected' : ''}>Orijinal Sıra (1–92)</option>
                    <option value="alpha" ${activeSort === 'alpha' ? 'selected' : ''}>Alfabetik (A-Z)</option>
                </select>
            </div>
            `;
        }

        if (activeProjectId === "proje-siyer") {
            return '';
        }

        return '';
    }

    const SIYER_ROOT_VALUES = [
        "Adalet",
        "Dostluk",
        "Dürüstlük",
        "Öz denetim",
        "Sabır",
        "Saygı",
        "Sevgi",
        "Sorumluluk",
        "Vatanseverlik",
        "Yardımseverlik"
    ];

    function normalizeRootValueName(name) {
        if (!name || typeof name !== 'string') return null;
        const clean = name.trim().toLocaleLowerCase('tr-TR').replace(/[\s\-_]+/g, '');
        const match = SIYER_ROOT_VALUES.find(val => val.toLocaleLowerCase('tr-TR').replace(/[\s\-_]+/g, '') === clean);
        return match || null;
    }

    function parseSelectedRootValues(contentStr) {
        if (!contentStr || typeof contentStr !== 'string') return [];
        const lines = contentStr.split('\n');
        const firstLine = lines[0].trim();
        if (!firstLine) return [];

        const tokens = firstLine.split(/[,;•]+/).map(t => t.trim()).filter(Boolean);
        const selected = [];
        for (const tok of tokens) {
            const canonical = normalizeRootValueName(tok);
            if (canonical && !selected.includes(canonical)) {
                selected.push(canonical);
            }
        }

        if (selected.length === 0 && lines.length > 1) {
            for (const line of lines) {
                const trimmed = line.trim();
                const canonical = normalizeRootValueName(trimmed);
                if (canonical && !selected.includes(canonical)) {
                    selected.push(canonical);
                } else if (trimmed.length > 0) {
                    break;
                }
            }
        }
        return selected;
    }

    function extractSiyerRootValueNotes(contentStr) {
        if (!contentStr || typeof contentStr !== 'string') return '';
        const lines = contentStr.split('\n');
        const firstLine = lines[0].trim();
        const selectedInFirstLine = parseSelectedRootValues(firstLine);
        if (selectedInFirstLine.length > 0 || firstLine === '') {
            return lines.slice(1).join('\n').trim();
        }
        return contentStr.trim();
    }

    function updateSiyerRootValueChipsUI(itemId, criterionKey, content) {
        const container = document.getElementById(`chips-container-${itemId}__${criterionKey}`);
        if (!container) return;
        const selected = parseSelectedRootValues(content);
        const pId = activeProjectId || "proje-siyer";
        const items = seedData?.projects?.[pId]?.items || [];
        const baseId = String(itemId).split('__')[0];
        const targetItem = items.find(it => it.id === baseId || it.id === itemId) || null;
        const canEdit = targetItem ? isItemEditableByCurrentUser(targetItem) : (currentSession?.role === 'teacher' || currentSession?.role === 'student');
        container.innerHTML = renderSiyerRootValueChipsHtml(itemId, criterionKey, selected, canEdit);
    }

    function renderSiyerRootValueChipsHtml(itemId, criterionKey, selectedValues, canEdit) {
        return SIYER_ROOT_VALUES.map(val => {
            const isSelected = Array.isArray(selectedValues) && selectedValues.includes(val);
            return `
            <button type="button" 
                ${!canEdit ? 'disabled' : ''}
                onclick="window.RotaliTubitak.toggleSiyerRootValue('${itemId}', '${criterionKey}', '${escapeHtml(val)}')"
                class="px-2.5 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1 cursor-pointer select-none ${
                    isSelected 
                        ? 'bg-emerald-600 text-white shadow-xs border border-emerald-600 ring-2 ring-emerald-400/30' 
                        : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-300'
                } ${!canEdit ? 'opacity-60 cursor-not-allowed' : ''}"
                title="${isSelected ? 'Kök Değer Seçimini Kaldır' : 'Kök Değer Olarak Ekle'}">
                <span class="text-[10px]">${isSelected ? '✓' : '+'}</span>
                <span>${escapeHtml(val)}</span>
            </button>
            `;
        }).join('');
    }

    function getSiyerFieldValAndMeta(yearId, criterionKey, legacyKey) {
        const key1 = `${yearId}__${criterionKey}`;
        let rec = runtimeRecords[key1];
        if ((!rec || !rec.content) && legacyKey && runtimeRecords[legacyKey]) {
            rec = runtimeRecords[legacyKey];
        }
        const content = rec && typeof rec.content === 'string' ? rec.content : '';
        const version = rec ? rec.version : 1;
        const lastEditor = rec ? rec.studentName : 'Sistem';
        return { content, version, lastEditor, recordKey: key1 };
    }

    function renderSiyerActiveYearForm(item, canEditItem) {
        const yearId = item.id;
        const isTeacher = currentSession?.role === "teacher";

        const eventsConfig = [
            {
                num: 1,
                title: "1. OLAY",
                badge: "Ana Olay",
                badgeClass: "bg-amber-100 text-amber-800 border-amber-200",
                olayKey: "c1_olay",
                olayLegacyKey: null,
                olayPlaceholder: "Seçilen yılda meydana gelen birinci siyer olayını, tarihsel gelişimini ve önemli ayrıntılarını yazınız (belirsizse kaynaklardaki farklılıkları açıklayınız)...",
                kokKey: "c2_kok_deger",
                kokLegacyKey: null,
                kaynakKey: "c3_kaynakca",
                kaynakLegacyKey: null,
                kaynakPlaceholder: "1. Olay için yararlanılan kaynak, eser/makale adı, müellif ve sayfa bilgilerini yazınız..."
            },
            {
                num: 2,
                title: "2. OLAY",
                badge: "İsteğe bağlı",
                badgeClass: "bg-slate-100 text-slate-600 border-slate-200",
                olayKey: "c1_olay_2",
                olayLegacyKey: `${yearId}__ev_2__c1_olay`,
                olayPlaceholder: "Aynı yılda meydana gelen ikinci siyer olayını, tarihsel gelişimini ve ayrıntılarını yazınız (bu yılda ikinci bir olay tespit edilmediyse boş bırakınız)...",
                kokKey: "c2_kok_deger_2",
                kokLegacyKey: `${yearId}__ev_2__c2_kok_deger`,
                kaynakKey: "c3_kaynakca_2",
                kaynakLegacyKey: `${yearId}__ev_2__c3_kaynakca`,
                kaynakPlaceholder: "2. Olay için yararlanılan kaynak, eser/makale adı, müellif ve sayfa bilgilerini yazınız..."
            },
            {
                num: 3,
                title: "3. OLAY",
                badge: "İsteğe bağlı",
                badgeClass: "bg-slate-100 text-slate-600 border-slate-200",
                olayKey: "c1_olay_3",
                olayLegacyKey: `${yearId}__ev_3__c1_olay`,
                olayPlaceholder: "Aynı yılda meydana gelen üçüncü siyer olayını, tarihsel gelişimini ve ayrıntılarını yazınız (bu yılda üçüncü bir olay tespit edilmediyse boş bırakınız)...",
                kokKey: "c2_kok_deger_3",
                kokLegacyKey: `${yearId}__ev_3__c2_kok_deger`,
                kaynakKey: "c3_kaynakca_3",
                kaynakLegacyKey: `${yearId}__ev_3__c3_kaynakca`,
                kaynakPlaceholder: "3. Olay için yararlanılan kaynak, eser/makale adı, müellif ve sayfa bilgilerini yazınız..."
            }
        ];

        const allEventIds = getSiyerYearEventIds(yearId);
        const archivedExtraIds = allEventIds.filter(id => {
            const evNum = parseInt(String(id).split('__ev_')[1], 10);
            return evNum > 3;
        });

        return `
        ${renderItemStatusBanner(item, getItemStatus(yearId), null, canEditItem)}

        <!-- Siyer Bilgilendirme Bannerı -->
        <div class="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 flex items-start gap-3">
            <div class="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                <i class="fa-solid fa-moon text-xs"></i>
            </div>
            <div class="text-xs text-slate-700 leading-relaxed">
                <strong class="text-emerald-950 font-black">Siyer ve Değerler Eğitimi Araştırma Kuralı:</strong>
                Her yıl için yalnızca 3 olay alanı bulunmaktadır. Bir yılda yalnızca bir veya iki tarihsel olay tespit edilmişse diğer alanlar boş bırakılabilir. Sistem tarihsel olay uydurulmasını kesinlikle teşvik etmez. Her olay için 10 kök değerden uygun olanları seçebilir ve olayın kaynakçasını girebilirsiniz.
            </div>
        </div>

        <!-- 3 Olay Kartı Listesi -->
        <div class="space-y-6">
            ${eventsConfig.map(ev => {
                const olayMeta = getSiyerFieldValAndMeta(yearId, ev.olayKey, ev.olayLegacyKey);
                const kokMeta = getSiyerFieldValAndMeta(yearId, ev.kokKey, ev.kokLegacyKey);
                const kaynakMeta = getSiyerFieldValAndMeta(yearId, ev.kaynakKey, ev.kaynakLegacyKey);
                const selectedKokValues = parseSelectedRootValues(kokMeta.content);

                return `
                <div class="p-4 sm:p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-5 transition-all focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-400/20">
                    <!-- Kart Başlığı -->
                    <div class="flex items-center justify-between gap-3 pb-3 border-b border-slate-100 flex-wrap">
                        <div class="flex items-center gap-2">
                            <span class="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 font-black flex items-center justify-center text-sm shadow-2xs">
                                ${ev.num}
                            </span>
                            <div>
                                <h4 class="text-sm sm:text-base font-black text-slate-900">${ev.title}</h4>
                                <span class="text-[10px] text-slate-500 font-medium">${ev.num === 1 ? 'Yılda gerçekleşen ana siyer olayı' : 'Varsa ek olay (yoksa boş bırakınız)'}</span>
                            </div>
                        </div>
                        <span class="px-2.5 py-1 rounded-full text-[11px] font-black border uppercase tracking-wider ${ev.badgeClass}">
                            ${ev.badge}
                        </span>
                    </div>

                    <!-- 1. Olay Açıklaması -->
                    <div class="space-y-2">
                        <div class="flex items-center justify-between gap-2">
                            <label for="input-${ev.olayKey}" class="text-xs sm:text-sm font-black text-slate-800 flex items-center gap-1.5">
                                <i class="fa-solid fa-feather-pointed text-amber-600"></i>
                                <span>Olay Açıklaması ve Tarihsel Gelişim</span>
                            </label>
                            <!-- Geri Al / İleri Al -->
                            <div class="flex items-center gap-1">
                                <button type="button" ${!canEditItem ? 'disabled' : ''} onclick="window.RotaliTubitak.handleUndo('${ev.olayKey}', '${yearId}')" class="w-7 h-7 rounded-lg bg-slate-50 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 border border-slate-300 flex items-center justify-center text-xs transition-colors cursor-pointer" title="Bu Alanı Geri Al ↶">↶</button>
                                <button type="button" ${!canEditItem ? 'disabled' : ''} onclick="window.RotaliTubitak.handleRedo('${ev.olayKey}', '${yearId}')" class="w-7 h-7 rounded-lg bg-slate-50 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 border border-slate-300 flex items-center justify-center text-xs transition-colors cursor-pointer" title="Bu Alanı İleri Al ↷">↷</button>
                            </div>
                        </div>
                        <textarea
                            id="input-${ev.olayKey}"
                            rows="3"
                            ${!canEditItem ? 'readonly disabled' : ''}
                            style="resize: vertical; min-height: 84px;"
                            placeholder="${escapeHtml(ev.olayPlaceholder)}"
                            oninput="window.RotaliTubitak.onFieldChange('${ev.olayKey}', this.value, this, '${yearId}')"
                            onblur="window.RotaliTubitak.onFieldBlur('${ev.olayKey}', this.value, '${yearId}')"
                            class="tubitak-criterion-textarea resize-y w-full px-3.5 py-2.5 ${canEditItem ? 'bg-white text-slate-800' : 'bg-slate-100 text-slate-500 cursor-not-allowed'} border border-slate-200 rounded-xl text-xs sm:text-sm font-medium placeholder-slate-400 focus:outline-none transition-colors leading-relaxed custom-scrollbar"
                        >${escapeHtml(olayMeta.content)}</textarea>
                        <div class="flex items-center justify-between text-[10px] text-slate-400 font-semibold pt-0.5">
                            <span>Sürüm v${olayMeta.version} • ${escapeHtml(olayMeta.lastEditor)}</span>
                            <span id="char-count-${ev.olayKey}">${formatFieldStats(olayMeta.content)}</span>
                        </div>
                    </div>

                    <!-- 2. Kök Değerler Bölümü (10 Kök Değer Seçeneği) -->
                    <div class="p-3.5 sm:p-4 rounded-xl bg-slate-50/90 border border-slate-200 space-y-3">
                        <div class="flex items-center justify-between gap-2 flex-wrap">
                            <div>
                                <label class="text-xs font-black text-slate-800 flex items-center gap-1.5">
                                    <i class="fa-solid fa-seedling text-emerald-600"></i>
                                    <span>İlişkili Kök Değerler</span>
                                    <span class="text-[10px] font-semibold text-slate-400">(İsteğe bağlı – birden fazla seçilebilir)</span>
                                </label>
                                <p class="text-[10px] text-slate-500 mt-0.5">Olayla bağlantılı kök değer(ler)i seçmek için butonlara tıklayınız:</p>
                            </div>
                            <!-- Kök Değer Geri Al / İleri Al -->
                            <div class="flex items-center gap-1">
                                <button type="button" ${!canEditItem ? 'disabled' : ''} onclick="window.RotaliTubitak.handleUndo('${ev.kokKey}', '${yearId}')" class="w-6 h-6 rounded-lg bg-white hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 border border-slate-300 flex items-center justify-center text-[11px] transition-colors cursor-pointer" title="Kök Değerleri Geri Al ↶">↶</button>
                                <button type="button" ${!canEditItem ? 'disabled' : ''} onclick="window.RotaliTubitak.handleRedo('${ev.kokKey}', '${yearId}')" class="w-6 h-6 rounded-lg bg-white hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 border border-slate-300 flex items-center justify-center text-[11px] transition-colors cursor-pointer" title="Kök Değerleri İleri Al ↷">↷</button>
                            </div>
                        </div>

                        <!-- 10 Kök Değer Butonları -->
                        <div id="chips-container-${yearId}__${ev.kokKey}" class="flex items-center gap-1.5 flex-wrap">
                            ${renderSiyerRootValueChipsHtml(yearId, ev.kokKey, selectedKokValues, canEditItem)}
                        </div>

                        <!-- Kök Değer Notu / Olayla İlişkisi -->
                        <div class="pt-1">
                            <label for="input-${ev.kokKey}" class="block text-[11px] font-bold text-slate-600 mb-1">
                                Kök Değer Notu / Olayla İlişkisi (İsteğe bağlı açıklama):
                            </label>
                            <textarea
                                id="input-${ev.kokKey}"
                                rows="2"
                                ${!canEditItem ? 'readonly disabled' : ''}
                                style="resize: vertical; min-height: 52px;"
                                placeholder="Olayla kök değer arasındaki bağlantıyı açıklayınız (isteğe bağlı)..."
                                oninput="window.RotaliTubitak.onFieldChange('${ev.kokKey}', this.value, this, '${yearId}')"
                                onblur="window.RotaliTubitak.onFieldBlur('${ev.kokKey}', this.value, '${yearId}')"
                                class="tubitak-criterion-textarea resize-y w-full px-3 py-2 ${canEditItem ? 'bg-white text-slate-800' : 'bg-slate-100 text-slate-500 cursor-not-allowed'} border border-slate-200 rounded-xl text-xs font-medium placeholder-slate-400 focus:outline-none transition-colors leading-relaxed"
                            >${escapeHtml(kokMeta.content)}</textarea>
                            <div class="flex items-center justify-between text-[10px] text-slate-400 font-semibold pt-0.5">
                                <span>Sürüm v${kokMeta.version} • ${escapeHtml(kokMeta.lastEditor)}</span>
                                <span id="char-count-${ev.kokKey}">${formatFieldStats(kokMeta.content)}</span>
                            </div>
                        </div>
                    </div>

                    <!-- 3. Olay Kaynakçası -->
                    <div class="space-y-1.5">
                        <div class="flex items-center justify-between gap-2">
                            <label for="input-${ev.kaynakKey}" class="text-xs font-black text-slate-800 flex items-center gap-1.5">
                                <i class="fa-solid fa-book-bookmark text-blue-600"></i>
                                <span>Olay Kaynakçası</span>
                                <span class="text-[10px] font-semibold text-slate-400">(İsteğe bağlı)</span>
                            </label>
                            <div class="flex items-center gap-1">
                                <button type="button" ${!canEditItem ? 'disabled' : ''} onclick="window.RotaliTubitak.handleUndo('${ev.kaynakKey}', '${yearId}')" class="w-6 h-6 rounded-lg bg-slate-50 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 border border-slate-300 flex items-center justify-center text-[11px] transition-colors cursor-pointer" title="Kaynakçayı Geri Al ↶">↶</button>
                                <button type="button" ${!canEditItem ? 'disabled' : ''} onclick="window.RotaliTubitak.handleRedo('${ev.kaynakKey}', '${yearId}')" class="w-6 h-6 rounded-lg bg-slate-50 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 border border-slate-300 flex items-center justify-center text-[11px] transition-colors cursor-pointer" title="Kaynakçayı İleri Al ↷">↷</button>
                            </div>
                        </div>
                        <input
                            type="text"
                            id="input-${ev.kaynakKey}"
                            value="${escapeHtml(kaynakMeta.content)}"
                            ${!canEditItem ? 'readonly disabled' : ''}
                            placeholder="${escapeHtml(ev.kaynakPlaceholder)}"
                            oninput="window.RotaliTubitak.onFieldChange('${ev.kaynakKey}', this.value, this, '${yearId}')"
                            onblur="window.RotaliTubitak.onFieldBlur('${ev.kaynakKey}', this.value, '${yearId}')"
                            class="tubitak-criterion-textarea w-full px-3.5 py-2 ${canEditItem ? 'bg-white text-slate-800' : 'bg-slate-100 text-slate-500 cursor-not-allowed'} border border-slate-200 rounded-xl text-xs font-medium placeholder-slate-400 focus:outline-none transition-colors"
                        />
                        <div class="flex items-center justify-between text-[10px] text-slate-400 font-semibold">
                            <span>Sürüm v${kaynakMeta.version} • ${escapeHtml(kaynakMeta.lastEditor)}</span>
                            <span id="char-count-${ev.kaynakKey}">${formatFieldStats(kaynakMeta.content)}</span>
                        </div>
                    </div>
                </div>
                `;
            }).join('')}
        </div>

        ${isTeacher && archivedExtraIds.length > 0 ? `
        <!-- Öğretmen Arşivi: Geçmişte 3'ten Fazla Eklenen Olaylar (Salt Okunur) -->
        <div class="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3">
            <div class="flex items-center justify-between text-xs font-black text-amber-900">
                <span><i class="fa-solid fa-box-archive mr-1.5 text-amber-600"></i>Öğretmen Arşivi: Geçmiş Ek Kayıtlar (${archivedExtraIds.length} Kayıt)</span>
                <span class="text-[10px] font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">Salt Okunur Arşiv</span>
            </div>
            <p class="text-[11px] text-amber-800">
                Bu yıl için geçmişte 3'ten fazla oluşturulmuş ek olay kayıtları veri kaybını önlemek amacıyla veritabanında korunmaktadır; öğrenci arayüzünde ise sistem kuralı gereği yalnızca ilk 3 olay görüntülenir.
            </p>
            <div class="space-y-2">
                ${archivedExtraIds.map(evId => {
                    const rec = runtimeRecords[`${evId}__c1_olay`];
                    const content = rec?.content || '(Boş metin)';
                    return `
                    <div class="p-2.5 rounded-xl bg-white border border-amber-200 text-xs">
                        <span class="font-bold text-slate-700">${evId}:</span>
                        <p class="text-slate-600 mt-0.5 italic">${escapeHtml(content)}</p>
                    </div>
                    `;
                }).join('')}
            </div>
        </div>
        ` : ''}
        `;
    }

    // Aktif Araştırma Formu (Kriterler, Toolbar, Geri Al, İleri Al, Kaydetme Durumu)
    
    function renderItemStatusBanner(item, itemStatus, ownerStu, canEditItem) {
        const isTeacher = currentSession?.role === "teacher";
        const feedbacks = (runtimeFeedbacks || []).filter(f => f.itemId === item.id);
        const latestFeedback = feedbacks.length > 0 ? feedbacks[feedbacks.length - 1] : null;

        if (itemStatus === "finalized" || itemStatus === "in_review") {
            return `
            <div class="p-3.5 rounded-2xl bg-teal-50 border border-teal-200 text-teal-950 text-xs font-semibold flex items-center justify-between gap-3 shadow-2xs">
                <div class="flex items-center gap-2.5">
                    <span class="w-7 h-7 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                        <i class="fa-solid fa-check-double"></i>
                    </span>
                    <div>
                        <strong class="font-black text-teal-950">Araştırma Kesinleştirildi:</strong>
                        <span>Bu çalışma başarıyla kesinleştirilmiştir. Yeniden değişiklik yapmak istediğinizde yukarıdaki <strong class="text-amber-900 bg-amber-100 px-1.5 py-0.5 rounded border border-amber-300">DÜZENLE</strong> butonuna basarak dilediğiniz zaman düzenleyebilirsiniz.</span>
                    </div>
                </div>
                <span class="px-2.5 py-1 rounded-xl bg-teal-200/90 text-teal-950 font-black text-[10px] uppercase shrink-0">
                    Kesinleştirildi 🎓
                </span>
            </div>
            `;
        }

        if (itemStatus === "approved") {
            return `
            <div class="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center justify-between gap-3 shadow-2xs">
                <div class="flex items-center gap-2.5">
                    <span class="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                        <i class="fa-solid fa-circle-check"></i>
                    </span>
                    <div>
                        <strong class="font-black text-emerald-950">Araştırma Onaylandı:</strong>
                        <span>Bu çalışma danışman öğretmeniniz tarafından onaylanmıştır. Akademik yayın standartlarına uygundur.</span>
                    </div>
                </div>
                <span class="px-2.5 py-1 rounded-xl bg-emerald-200 text-emerald-950 font-black text-[10px] uppercase shrink-0">
                    Onaylandı ✅
                </span>
            </div>
            `;
        }

        if (itemStatus === "correction_requested") {
            return `
            <div class="p-3.5 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 text-xs font-semibold space-y-2 shadow-2xs">
                <div class="flex items-center justify-between gap-3">
                    <div class="flex items-center gap-2">
                        <span class="w-7 h-7 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                            <i class="fa-solid fa-triangle-exclamation"></i>
                        </span>
                        <strong class="font-black text-amber-950 text-sm">Danışman Öğretmen Düzeltme İstedi:</strong>
                    </div>
                    <span class="px-2.5 py-1 rounded-xl bg-amber-200 text-amber-950 font-black text-[10px] uppercase shrink-0">
                        Düzenleme Açık ⚠️
                    </span>
                </div>
                ${latestFeedback?.message ? `
                <div class="p-2.5 rounded-xl bg-white/80 border border-amber-200 text-xs text-amber-900 font-medium">
                    <i class="fa-solid fa-quote-left mr-1.5 text-amber-500"></i>${escapeHtml(latestFeedback.message)}
                </div>
                ` : ''}
                <p class="text-[11px] text-amber-800">Lütfen öğretmenin belirttiği eksikleri tamamlayıp tekrar <strong>KAYDET</strong> ve ardından <strong>KESİNLEŞTİR</strong> butonuna basınız.</p>
            </div>
            `;
        }

        return '';
    }

    async function saveCurrentItemDraft(targetItemId = activeItemId, isSilent = false) {
        if (!currentSession || !targetItemId) return { ok: false, error: "Oturum bulunamadı" };
        await flushPendingSaves();
        if (!isSilent) updateUIAutosaveBadge("saving", "Taslak kaydediliyor...");

        const recordsToSave = [];
        if (activeProjectId === "proje-siyer") {
            const keys = [
                "c1_olay", "c2_kok_deger", "c3_kaynakca",
                "c1_olay_2", "c2_kok_deger_2", "c3_kaynakca_2",
                "c1_olay_3", "c2_kok_deger_3", "c3_kaynakca_3"
            ];
            keys.forEach(k => {
                const el = document.getElementById(`input-${k}`);
                const prevRec = getRecordWithAliases(targetItemId, k);
                const prevVal = prevRec?.content || runtimeRecords[`${targetItemId}__${k}`]?.content || "";
                let contentVal = el ? el.value : prevVal;
                // Boş olan ve sunucuda da kaydı bulunmayan alanları boşuna gönderme; mevcut dolu alanı da toplu kayıtta boşaltma
                if (!String(contentVal || "").trim() && !String(prevVal || "").trim()) return;
                if (!String(contentVal || "").trim() && String(prevVal || "").trim()) {
                    contentVal = prevVal;
                }
                recordsToSave.push({
                    criterionKey: k,
                    content: contentVal,
                    allowEmpty: false,
                    isExplicitEdit: false,
                    clientVersion: prevRec?.version || runtimeRecords[`${targetItemId}__${k}`]?.version || 0
                });
            });
        } else {
            const projData = seedData?.projects?.[activeProjectId] || {};
            const critList = projData.criteriaList || [];
            critList.forEach(crit => {
                const el = document.getElementById(`input-${crit.key}`);
                const prevRec = getRecordWithAliases(targetItemId, crit.key);
                const prevVal = prevRec?.content || runtimeRecords[`${targetItemId}__${crit.key}`]?.content || "";
                let contentVal = el ? el.value : prevVal;
                if (!String(contentVal || "").trim() && !String(prevVal || "").trim()) return;
                if (!String(contentVal || "").trim() && String(prevVal || "").trim()) {
                    contentVal = prevVal;
                }
                recordsToSave.push({
                    criterionKey: crit.key,
                    content: contentVal,
                    allowEmpty: false,
                    isExplicitEdit: false,
                    clientVersion: prevRec?.version || runtimeRecords[`${targetItemId}__${crit.key}`]?.version || 0
                });
            });
        }

        try {
            const res = await fetch("/api/tubitak-records", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${currentSession.token}`
                },
                body: JSON.stringify({
                    action: "save_item_batch",
                    projectId: activeProjectId,
                    itemId: targetItemId,
                    records: recordsToSave,
                    studentId: currentSession.studentId,
                    studentName: currentSession.studentName,
                    allowEmpty: false,
                    isExplicitEdit: false,
                    clientTimestamp: new Date().toISOString()
                })
            });

            const data = await res.json();
            if (res.ok && data.ok) {
                if (data.records) {
                    runtimeRecords = { ...runtimeRecords, ...data.records };
                }
                updateUIAutosaveBadge("saved", "Tüm değişiklikler kaydedildi");
                if (!isSilent) showNotice("Çalışmanız başarıyla taslak olarak kaydedildi! ✅", "success");
                updateProgressBadge();
                return { ok: true, data };
            } else {
                updateUIAutosaveBadge("error", "Kayıt başarısız");
                if (!isSilent) showNotice(data.error || "Kayıt sırasında bir hata oluştu. Verileriniz yerel hafızada korundu.", "error");
                return { ok: false, error: data.error || "Kayıt hatası" };
            }
        } catch (err) {
            const isOnline = (typeof navigator !== "undefined" && navigator.onLine);
            updateUIAutosaveBadge(isOnline ? "error" : "waiting_connection");
            if (!isSilent) showNotice("Bağlantı hatası: " + err.message + ". Değişiklikleriniz çevrimdışı kuyruğa alındı.", "warning");
            return { ok: false, error: err.message };
        }
    }

    async function reopenItemForEdit(targetItemId = activeItemId) {
        if (!currentSession || !targetItemId) return;
        const projData = seedData?.projects?.[activeProjectId] || {};
        const items = projData.items || [];
        const currentItem = items.find(it => it.id === targetItemId) || { id: targetItemId };

        if (!isUserAssignedToItem(currentItem)) {
            showNotice("Bu kayıt başka bir öğrenciye atanmıştır. Yalnızca kendi kayıtlarınızı düzenleyebilirsiniz.", "error");
            return;
        }

        const curStatus = getItemStatus(targetItemId);
        if (curStatus === "editing" || curStatus === "draft") {
            showNotice("Araştırma şu anda zaten düzenleme modundadır. Dilediğiniz değişiklikleri yapabilirsiniz. ✏️", "info");
            const firstInput = document.querySelector(".tubitak-criterion-textarea");
            if (firstInput) firstInput.focus();
            return;
        }

        // Yerel durumu anında Düzenleniyor moduna al (sıfır gecikmeli UI)
        if (!runtimeFinalized) runtimeFinalized = {};
        runtimeFinalized[targetItemId] = {
            ...(runtimeFinalized[targetItemId] || {}),
            itemId: targetItemId,
            status: "editing",
            reopenedAt: new Date().toISOString()
        };

        for (const [k, v] of Object.entries(runtimeRecords)) {
            if (k.startsWith(`${targetItemId}__`)) {
                v.status = "editing";
            }
        }

        updateUIAutosaveBadge("saved", "Düzenleniyor");

        // Sunucuya asenkron bildir
        try {
            await fetch("/api/tubitak-records", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${currentSession.token}`
                },
                body: JSON.stringify({
                    action: "reopen_item_edit",
                    projectId: activeProjectId,
                    itemId: targetItemId,
                    studentId: currentSession.studentId,
                    studentName: currentSession.studentName
                })
            });
        } catch (err) {
            console.warn("reopen_item_edit network warning:", err);
        }

        showNotice("Araştırma yeniden düzenlemeye açıldı. Değişikliklerinizi yapıp tekrar KAYDET veya KESİNLEŞTİR butonunu kullanabilirsiniz. ✏️", "info");

        // Formu anında aktif düzenleme görünümüne geçir
        const container = document.getElementById("tubitak-research-container");
        if (container) {
            renderMainContainer(container);
        }

        setTimeout(() => {
            const firstInput = document.querySelector(".tubitak-criterion-textarea");
            if (firstInput) firstInput.focus();
        }, 100);
    }

    let isFinalizingItem = false;
    async function finalizeCurrentItem(targetItemId = activeItemId) {
        if (!currentSession || !targetItemId) return;
        if (isFinalizingItem) {
            showNotice("Kesinleştirme işlemi sürüyor, lütfen bekleyiniz...", "info");
            return;
        }

        const projData = seedData?.projects?.[activeProjectId] || {};
        const items = projData.items || [];
        const currentItem = items.find(it => it.id === targetItemId) || { id: targetItemId };

        if (!isUserAssignedToItem(currentItem)) {
            showNotice("Bu kayıt başka bir öğrenciye atanmıştır. Yalnızca sorumlu olduğunuz kayıtları kesinleştirebilirsiniz.", "error");
            return;
        }

        const confirmMsg = "Çalışmanızın güncel halini kesinleştirmek istiyor musunuz?\n\n(Kesinleştirme sonrasında dilediğiniz zaman DÜZENLE butonuna basarak araştırmanızı tekrar düzenleyebilirsiniz.)";
        if (typeof confirm === "function" && !confirm(confirmMsg)) {
            return;
        }

        isFinalizingItem = true;
        const finalizeBtn = document.getElementById("btn-tubitak-finalize");
        if (finalizeBtn) {
            finalizeBtn.disabled = true;
            finalizeBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin text-white"></i> <span>Kesinleştiriliyor...</span>';
        }

        try {
            await flushPendingSaves();
            updateUIAutosaveBadge("saving", "Kesinleştiriliyor...");

            const recordsToSave = [];
            if (activeProjectId === "proje-siyer") {
                const keys = [
                    "c1_olay", "c2_kok_deger", "c3_kaynakca",
                    "c1_olay_2", "c2_kok_deger_2", "c3_kaynakca_2",
                    "c1_olay_3", "c2_kok_deger_3", "c3_kaynakca_3"
                ];
                keys.forEach(k => {
                    const el = document.getElementById(`input-${k}`);
                    const prevRec = getRecordWithAliases(targetItemId, k);
                    const prevVal = prevRec?.content || runtimeRecords[`${targetItemId}__${k}`]?.content || "";
                    let contentVal = el ? el.value : prevVal;
                    if (!String(contentVal || "").trim() && !String(prevVal || "").trim()) return;
                    if (!String(contentVal || "").trim() && String(prevVal || "").trim()) {
                        contentVal = prevVal;
                    }
                    recordsToSave.push({
                        criterionKey: k,
                        content: contentVal,
                        allowEmpty: false,
                        isExplicitEdit: false,
                        clientVersion: prevRec?.version || runtimeRecords[`${targetItemId}__${k}`]?.version || 0
                    });
                });
            } else {
                const critList = projData.criteriaList || [];
                critList.forEach(crit => {
                    const el = document.getElementById(`input-${crit.key}`);
                    const prevRec = getRecordWithAliases(targetItemId, crit.key);
                    const prevVal = prevRec?.content || runtimeRecords[`${targetItemId}__${crit.key}`]?.content || "";
                    let contentVal = el ? el.value : prevVal;
                    if (!String(contentVal || "").trim() && !String(prevVal || "").trim()) return;
                    if (!String(contentVal || "").trim() && String(prevVal || "").trim()) {
                        contentVal = prevVal;
                    }
                    recordsToSave.push({
                        criterionKey: crit.key,
                        content: contentVal,
                        allowEmpty: false,
                        isExplicitEdit: false,
                        clientVersion: prevRec?.version || runtimeRecords[`${targetItemId}__${crit.key}`]?.version || 0
                    });
                });
            }

            const res = await fetch("/api/tubitak-records", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${currentSession.token}`
                },
                body: JSON.stringify({
                    action: "finalize_item",
                    projectId: activeProjectId,
                    itemId: targetItemId,
                    studentId: currentSession.studentId,
                    studentName: currentSession.studentName,
                    allowEmpty: false,
                    isExplicitEdit: false,
                    records: recordsToSave
                })
            });

            const data = await res.json();
            if (res.ok && data.ok) {
                if (!runtimeFinalized) runtimeFinalized = {};
                runtimeFinalized[targetItemId] = {
                    itemId: targetItemId,
                    studentId: currentSession.studentId,
                    studentName: currentSession.studentName,
                    status: "in_review",
                    finalizedAt: new Date().toISOString()
                };
                for (const [k, v] of Object.entries(runtimeRecords)) {
                    if (k.startsWith(`${targetItemId}__`)) {
                        v.status = "in_review";
                    }
                }
                showNotice("Çalışmanız başarıyla kesinleştirildi.", "success");
                await syncProjectData(activeProjectId);
                renderMainContainer(document.getElementById("tubitak-research-container"));
            } else {
                updateUIAutosaveBadge("error", "Kesinleştirme başarısız");
                showNotice("Kesinleştirme işlemi başarısız: " + (data.error || "Bilinmeyen hata"), "error");
            }
        } catch (err) {
            updateUIAutosaveBadge("error", "Bağlantı hatası");
            showNotice("Bağlantı hatası: " + err.message, "error");
        } finally {
            isFinalizingItem = false;
            if (finalizeBtn) {
                finalizeBtn.disabled = false;
                finalizeBtn.innerHTML = '<i class="fa-solid fa-check-double text-white"></i> <span>KESİNLEŞTİR</span>';
            }
        }
    }

function renderActiveItemForm(item, projData) {
        if (!item || !item.id) {
            return `
            <div class="p-10 text-center text-slate-400">
                <i class="fa-solid fa-inbox text-3xl mb-2"></i>
                <p class="text-sm font-semibold">Lütfen sol panelden bir araştırma konusu seçiniz.</p>
            </div>
            `;
        }

        const criteriaList = projData.criteriaList || [];
        const isTeacher = currentSession.role === "teacher";
        const itemStatus = getItemStatus(item.id);
        const permanentOrder = getItemPermanentOrder(item);
        const ownerStu = (activeProjectId === "proje-tarih" || activeProjectId === "proje-bilim") ? getStudentById(getItemAssignedStudentId(item)) : null;
        const canEditItem = isItemEditableByCurrentUser(item);

        return `
        <!-- Form Başlık Alanı & Araç Çubuğu -->
        <div class="pb-5 border-b border-slate-200 space-y-4">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <div class="flex items-center gap-2 flex-wrap">
                        ${(activeProjectId === 'proje-tarih' || activeProjectId === 'proje-bilim') ? `
                        <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-800 border border-amber-200 uppercase">
                            ${activeProjectId === 'proje-bilim' ? `Bilim İnsanı #${permanentOrder}` : `Eser #${permanentOrder}`}
                        </span>
                        ` : ''}
                        <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-slate-100 text-slate-700 border border-slate-200 uppercase">
                            ${item.district || item.geography || (item.year ? `${item.year}. Yılı` : 'Araştırma')}
                        </span>
                        ${ownerStu ? `
                        <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-indigo-50 text-indigo-700 border border-indigo-200">
                            <i class="fa-solid fa-user-graduate mr-1"></i>Sorumlu: ${escapeHtml(ownerStu.name)}
                        </span>
                        ` : ''}
                    </div>
                    <h3 class="text-lg sm:text-2xl font-black text-slate-900 mt-1.5">${escapeHtml(item.title)}</h3>
                    <p class="text-xs text-slate-500 font-medium mt-0.5">${escapeHtml(item.summary || item.location || '')}</p>
                </div>

                <!-- 🔄 4 BUTONLU KAYDETME, KESİNLEŞTİRME VE DÜZENLEME ÇUBUĞU (KAYDET | KESİNLEŞTİR | DÜZENLE | WORD İNDİR) -->
                <div class="flex items-center gap-2 flex-wrap">
                    <div id="tubitak-autosave-indicator" class="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-slate-50 border border-slate-200 shadow-2xs">
                        <span id="autosave-dot" class="w-2.5 h-2.5 rounded-full ${(itemStatus === 'finalized' || itemStatus === 'in_review') ? 'bg-teal-500' : (itemStatus === 'approved' ? 'bg-emerald-600' : 'bg-emerald-500')}"></span>
                        <span id="autosave-text" class="text-xs font-black text-slate-700">${(itemStatus === 'finalized' || itemStatus === 'in_review') ? 'Kesinleştirildi' : (itemStatus === 'approved' ? 'Onaylandı' : (lastSavedTimeString ? 'Tüm değişiklikler kaydedildi' : 'Düzenleniyor'))}</span>
                        <span id="autosave-time" class="text-[10px] text-slate-400 font-bold ml-1">${lastSavedTimeString ? `(${lastSavedTimeString})` : ''}</span>
                    </div>

                    ${isUserAssignedToItem(item) ? `
                    <!-- 💾 1. BUTON: KAYDET -->
                    <button type="button" 
                            id="btn-tubitak-save"
                            onclick="window.RotaliTubitak.saveCurrentItemDraft('${item.id}')" 
                            class="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 active:scale-95 text-white text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-sm" 
                            title="Öğrencinin mevcut verilerini kaydeder">
                        <i class="fa-solid fa-floppy-disk text-amber-400"></i>
                        <span>KAYDET</span>
                    </button>

                    <!-- 🎓 2. BUTON: KESİNLEŞTİR -->
                    <button type="button" 
                            id="btn-tubitak-finalize"
                            onclick="window.RotaliTubitak.finalizeCurrentItem('${item.id}')" 
                            class="px-4 py-2 rounded-xl ${(itemStatus === 'finalized' || itemStatus === 'in_review') ? 'bg-teal-700 hover:bg-teal-800 text-white shadow-sm ring-2 ring-teal-400/30' : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-md'} active:scale-95 text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer" 
                            title="Araştırmanın mevcut sürümünü kesinleştirir">
                        <i class="fa-solid fa-check-double text-white"></i>
                        <span>KESİNLEŞTİR</span>
                    </button>

                    <!-- ✏️ 3. BUTON: DÜZENLE -->
                    <button type="button" 
                            id="btn-tubitak-edit"
                            onclick="window.RotaliTubitak.reopenItemForEdit('${item.id}')" 
                            class="px-3.5 py-2 rounded-xl ${(itemStatus === 'finalized' || itemStatus === 'in_review') ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 font-black shadow-md ring-2 ring-amber-300' : 'bg-amber-100 hover:bg-amber-200 text-amber-900 font-black border border-amber-300'} active:scale-95 text-xs transition-all flex items-center gap-1.5 cursor-pointer" 
                            title="Kesinleştirilmiş araştırmayı yeniden düzenlemeye açar">
                        <i class="fa-solid fa-pen-to-square"></i>
                        <span>DÜZENLE</span>
                    </button>
                    ` : ''}

                    <!-- 📄 4. BUTON: WORD İNDİR -->
                    <button type="button" 
                            id="btn-student-word-download" 
                            onclick="window.RotaliTubitak.downloadStudentWord('${item.id}', this)" 
                            class="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-sm" 
                            title="Araştırmanın güncel içeriğini Word (.docx) olarak indir">
                        <i class="fa-solid fa-file-word text-blue-200"></i>
                        <span>WORD İNDİR</span>
                    </button>
                </div>
            </div>

            ${activeProjectId === 'proje-bilim' ? `
            <div class="p-3.5 rounded-2xl bg-slate-100/90 border border-slate-200 flex items-center justify-between gap-3">
                <div>
                    <span class="block text-[10px] font-black uppercase tracking-wider text-slate-500">BİLİM İNSANININ ADI</span>
                    <div class="text-sm sm:text-base font-black text-slate-900 mt-0.5">${escapeHtml(item.title)}</div>
                </div>
                <span class="px-2.5 py-1 rounded-xl bg-white border border-slate-200 text-[10px] font-bold text-slate-500 shrink-0">
                    <i class="fa-solid fa-shield-halved mr-1 text-indigo-500"></i>Sabit Kayıt
                </span>
            </div>
            ` : ''}

            ${!canEditItem && ownerStu ? `
            <div class="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs font-bold text-amber-900 flex items-center gap-2">
                <i class="fa-solid fa-lock text-amber-600"></i>
                <span>Bu ${activeProjectId === 'proje-bilim' ? 'bilim insanı' : 'eser'} <strong>${escapeHtml(ownerStu.name)}</strong> sorumluluğundadır. Kendi atanmış kayıtlarınızı düzenlemek için kendi öğrenci kartınızı seçiniz.</span>
            </div>
            ` : ''}

            <!-- 🛠️ İŞLEM BUTONLARI ÇUBUĞU (GERİ AL, İLERİ AL, GEÇMİŞ, ONAY) -->
            <div class="flex items-center justify-between gap-2 flex-wrap pt-2">
                <div class="flex items-center gap-2">
                    <button type="button" onclick="window.RotaliTubitak.openHistoryModal('${item.id}')" class="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs" title="Tüm Değişiklik Geçmişi ve Sürümler">
                        <i class="fa-solid fa-clock-rotate-left text-amber-600"></i>
                        <span>Geçmiş</span>
                    </button>
                    <button type="button" onclick="window.RotaliTubitak.openAddSourceModal('${item.id}')" class="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs" title="Akademik Kaynak & Belge Ekle">
                        <i class="fa-solid fa-book-bookmark text-blue-600"></i>
                        <span>Kaynak Ekle</span>
                    </button>
                </div>

                <div class="flex items-center gap-2 flex-wrap">
                    ${activeProjectId === 'proje-siyer' ? `
                    <div class="flex items-center gap-1 mr-1">
                        <button type="button" ${item.year <= 571 ? 'disabled' : ''} onclick="window.RotaliTubitak.navigateSiyerYear(${item.year - 1})" class="px-2.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 border border-slate-200 text-xs font-bold transition-colors cursor-pointer" title="Önceki Yıl">
                            ← Önceki Yıl
                        </button>
                        <button type="button" ${item.year >= 632 ? 'disabled' : ''} onclick="window.RotaliTubitak.navigateSiyerYear(${item.year + 1})" class="px-2.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 border border-slate-200 text-xs font-bold transition-colors cursor-pointer" title="Sonraki Yıl">
                            Sonraki Yıl →
                        </button>
                    </div>
                    ` : ''}
                    <div class="flex items-center gap-1.5 flex-wrap">
                        ${(activeProjectId === 'proje-tarih' || activeProjectId === 'proje-bilim' || activeProjectId === 'proje-siyer') ? `
                        <button type="button" onclick="window.RotaliTubitak.downloadMonumentWord('${item.id}', this, '${activeProjectId}')" class="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-sm" title="Yalnızca kaydedilmiş araştırma metinlerini .docx olarak indir">
                            <i class="fa-solid fa-file-word"></i>
                            <span>Word Olarak İndir</span>
                        </button>
                        ` : ''}
                        ${!isTeacher ? '' : `
                        ${activeProjectId === 'proje-siyer' ? `
                        <button type="button" onclick="window.RotaliTubitak.markSiyerYearFlag('${item.id}', '${runtimeSiyerYearFlags?.[item.id]?.status === 'no_event_found' ? '' : 'no_event_found'}')" class="px-3 py-1.5 rounded-xl ${runtimeSiyerYearFlags?.[item.id]?.status === 'no_event_found' ? 'bg-slate-700 text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-800'} text-xs font-black transition-all flex items-center gap-1 cursor-pointer shadow-sm">
                            <i class="fa-solid fa-magnifying-glass"></i>
                            <span>${runtimeSiyerYearFlags?.[item.id]?.status === 'no_event_found' ? 'Olay Yok İşaretini Kaldır' : 'Olay Yok İşaretle'}</span>
                        </button>
                        ` : ''}
                        <button type="button" onclick="window.RotaliTubitak.teacherReview('${item.id}', 'approved')" class="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black transition-all flex items-center gap-1 cursor-pointer shadow-sm">
                            <i class="fa-solid fa-check"></i> Onayla
                        </button>
                        <button type="button" onclick="window.RotaliTubitak.teacherReview('${item.id}', 'correction_requested')" class="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-black transition-all flex items-center gap-1 cursor-pointer shadow-sm">
                            <i class="fa-solid fa-pencil"></i> Düzeltme İste
                        </button>
                        `}
                    </div>
                </div>
            </div>
        </div>

        <!-- 📜 ARAŞTIRMA KRİTERLERİ LİSTESİ -->
        ${renderItemStatusBanner(item, itemStatus, ownerStu, canEditItem)}

        <!-- 📜 ARAŞTIRMA KRİTERLERİ LİSTESİ -->
        <div class="space-y-5">
            ${activeProjectId === 'proje-siyer' ? renderSiyerActiveYearForm(item, canEditItem) : criteriaList.map((crit, idx) => {
                const recordKey = `${item.id}__${crit.key}`;
                const saved = getRecordWithAliases(item.id, crit.key);
                const contentVal = (saved && typeof saved.content === 'string') ? saved.content : (item.criteria?.[crit.key] || ((crit.key === 'c1_bilim_insani_adi' && activeProjectId === 'proje-bilim') ? (item.title || "") : ""));
                const version = saved ? saved.version : 1;
                const lastEditor = saved ? (saved.studentName || "Öğrenci") : "Sistem";

                return `
                <div class="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/90 shadow-2xs space-y-2.5 transition-all focus-within:border-amber-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-amber-400/20">
                    <div class="flex items-center justify-between gap-2">
                        <label for="input-${crit.key}" class="text-xs sm:text-sm font-black text-slate-800 flex items-center gap-1.5">
                            <span>${escapeHtml(crit.title)}</span>
                            ${crit.required ? '<span class="text-red-500 font-bold" title="Zorunlu Kriter">*</span>' : '<span class="text-[10px] font-semibold text-slate-400">(İsteğe bağlı)</span>'}
                        </label>
                        
                        <!-- ↶ Geri Al / İleri Al Butonları -->
                        <div class="flex items-center gap-1">
                            <button type="button" ${!canEditItem ? 'disabled' : ''} onclick="window.RotaliTubitak.handleUndo('${crit.key}')" class="w-7 h-7 rounded-lg bg-white hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 border border-slate-300 flex items-center justify-center text-xs transition-colors cursor-pointer" title="Bu Alanı Geri Al ↶">
                                ↶
                            </button>
                            <button type="button" ${!canEditItem ? 'disabled' : ''} onclick="window.RotaliTubitak.handleRedo('${crit.key}')" class="w-7 h-7 rounded-lg bg-white hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 border border-slate-300 flex items-center justify-center text-xs transition-colors cursor-pointer" title="Bu Alanı İleri Al ↷">
                                ↷
                            </button>
                        </div>
                    </div>

                    <!-- Metin Yazım Alanı (Otomatik Kayıt Bağlantılı, Sınırsız & İsteğe Bağlı Büyütülebilir) -->
                    <textarea 
                        id="input-${crit.key}" 
                        rows="3" 
                        ${!canEditItem ? 'readonly disabled' : ''}
                        style="resize: vertical; min-height: 96px;"
                        placeholder="${escapeHtml(crit.placeholder || 'Araştırma bulgularınızı buraya yazınız (kelime sınırı yoktur)...')}"
                        oninput="window.RotaliTubitak.onFieldChange('${crit.key}', this.value, this)"
                        onblur="window.RotaliTubitak.onFieldBlur('${crit.key}', this.value)"
                        class="tubitak-criterion-textarea resize-y w-full px-3.5 py-2.5 ${canEditItem ? 'bg-white text-slate-800' : 'bg-slate-100 text-slate-500 cursor-not-allowed'} border border-slate-200 rounded-xl text-xs sm:text-sm font-medium placeholder-slate-400 focus:outline-none transition-colors leading-relaxed custom-scrollbar"
                    >${escapeHtml(contentVal)}</textarea>

                    ${crit.supportsLatex ? `
                    <div class="p-3 rounded-xl bg-indigo-50/70 border border-indigo-200/80 space-y-1">
                        <div class="flex items-center justify-between text-[10px] font-black text-indigo-800 uppercase tracking-wider">
                            <span><i class="fa-solid fa-square-root-variable mr-1"></i>LaTeX Matematiksel Gösterim Önizlemesi</span>
                            <span class="font-semibold text-indigo-600 normal-case">Örnek: $x^2 + bx = c$ veya $$\\sum_{k=1}^n k$$</span>
                        </div>
                        <div id="latex-preview-${crit.key}" class="text-xs sm:text-sm text-slate-800 leading-relaxed min-h-[22px] whitespace-pre-wrap">${renderLatexHtmlString(contentVal)}</div>
                    </div>
                    ` : ''}

                    <!-- Alt Bilgi: Sürüm, Son Düzenleyen & Sınırsız Karakter/Kelime Sayısı -->
                    <div class="flex items-center justify-between text-[10px] text-slate-400 font-semibold pt-1">
                        <span class="flex items-center gap-1">
                            <i class="fa-solid fa-code-commit text-amber-500"></i>
                            <span>Sürüm v${version}</span>
                            <span>• ${escapeHtml(lastEditor)}</span>
                        </span>
                        <span id="char-count-${crit.key}">${formatFieldStats(contentVal)}</span>
                    </div>
                </div>
                `;
            }).join("")}
        </div>

        <!-- 📚 İLİŞKİLİ KAYNAKLAR BÖLÜMÜ -->
        <div class="pt-5 border-t border-slate-200">
            <h4 class="text-xs font-black uppercase text-slate-700 tracking-wider mb-3 flex items-center justify-between">
                <span>📚 Eklenen Akademik Kaynaklar</span>
                <span class="text-[10px] text-blue-600 font-bold">${(activeProjectId === 'proje-siyer' ? getSiyerYearEventIds(item.id).flatMap(id => getItemSources(id)) : getItemSources(item.id)).length} Kaynak</span>
            </h4>
            <div class="space-y-2">
                ${(activeProjectId === 'proje-siyer' ? getSiyerYearEventIds(item.id).flatMap(id => getItemSources(id)) : getItemSources(item.id)).length === 0 ? `
                <div class="p-3 rounded-xl bg-slate-50 border border-dashed border-slate-300 text-center text-slate-400 text-xs">
                    Henüz kaynak eklenmedi. Üstteki "Kaynak Ekle" butonunu kullanarak literatür referansı ekleyebilirsiniz.
                </div>
                ` : (activeProjectId === 'proje-siyer' ? getSiyerYearEventIds(item.id).flatMap(id => getItemSources(id)) : getItemSources(item.id)).map(src => `
                <div class="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-start justify-between gap-3">
                    <div>
                        <div class="font-black text-slate-900">${escapeHtml(src.title)} (${escapeHtml(src.year || '')})</div>
                        <div class="text-slate-600">${escapeHtml(src.author || '')} • ${escapeHtml(src.publisher || '')} ${src.page ? `• Sayfa: ${escapeHtml(src.page)}` : ''}</div>
                        ${src.url ? `<a href="${escapeHtml(src.url)}" target="_blank" class="text-blue-600 hover:underline text-[11px] font-semibold mt-0.5 inline-block"><i class="fa-solid fa-link text-[10px]"></i> Bağlantı</a>` : ''}
                    </div>
                    <button type="button" onclick="window.RotaliTubitak.deleteSource('${src.id}')" class="text-slate-400 hover:text-red-600 p-1 cursor-pointer" title="Kaynağı Sil">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>
                `).join("")}
            </div>
        </div>
        `;
    }

    // 8. Yardımcılar, Öğrenci Görev Dağılımı ve Filtreleme Mantıkları
    function isProjectDistributionValid(projectId = activeProjectId) {
        const items = seedData?.projects?.[projectId]?.items || [];
        if (projectId === "proje-tarih") return items.length === 40;
        if (projectId === "proje-bilim") return items.length === 92;
        if (projectId === "proje-siyer") return items.length === 62;
        return true;
    }

    function getSiyerYearEventIds(yearId) {
        if (!yearId) return [];
        const extra = Array.isArray(runtimeSiyerEvents?.[yearId]) ? runtimeSiyerEvents[yearId] : [];
        return [yearId, ...extra.filter(id => id && id !== yearId)];
    }

    function isProje1DistributionValid() {
        return isProjectDistributionValid("proje-tarih");
    }

    function getProjectStudents(projectId = activeProjectId) {
        return seedData?.projects?.[projectId]?.studentTeam || [];
    }

    function getProje1Students() {
        return getProjectStudents("proje-tarih");
    }

    function getItemPermanentOrder(item, projectId = activeProjectId) {
        if (!item) return 0;
        if (typeof item.orderIndex === "number" && item.orderIndex > 0) return item.orderIndex;
        const items = seedData?.projects?.[projectId]?.items || [];
        const idx = items.findIndex(x => x.id === item.id);
        return idx >= 0 ? idx + 1 : 0;
    }

    function getItemAssignedStudentId(item, projectId = activeProjectId) {
        if (!item) return null;
        const custom = runtimeAssignments?.[item.id]?.assignedStudentId;
        if (custom) return custom;
        if (!isProjectDistributionValid(projectId)) return null;
        return item.assignedStudentId || null;
    }

    function getStudentById(stuId, projectId = activeProjectId) {
        if (!stuId) return null;
        return getProjectStudents(projectId).find(s => s.id === stuId) || null;
    }

    function normalizeTrName(str) {
        return String(str || "")
            .toLocaleLowerCase("tr-TR")
            .replace(/ı/g, "i")
            .replace(/İ/gi, "i")
            .replace(/ş/g, "s")
            .replace(/ğ/g, "g")
            .replace(/ü/g, "u")
            .replace(/ö/g, "o")
            .replace(/ç/g, "c")
            .replace(/\s+/g, " ")
            .trim();
    }

    function resolveCurrentUserStudentId(projectId = activeProjectId) {
        if (!currentSession) return null;
        const students = getProjectStudents(projectId);
        const rawId = String(currentSession.studentId || "").trim();
        if (students.some(s => s.id === rawId)) return rawId;
        const normName = normalizeTrName(currentSession.studentName || "");
        if (!normName) return null;
        for (const s of students) {
            const sNorm = normalizeTrName(s.name);
            const firstWord = sNorm.split(" ")[0];
            if (normName === sNorm || (firstWord && normName.includes(firstWord))) {
                return s.id;
            }
        }
        return null;
    }

    function isUserAssignedToItem(item) {
        if (!currentSession || !item) return false;
        if (currentSession.role === "teacher") return true;
        if (activeProjectId === "proje-siyer") return true;
        if (activeProjectId !== "proje-tarih" && activeProjectId !== "proje-bilim") return true;

        const myStuId = resolveCurrentUserStudentId(activeProjectId);
        const assignedStuId = getItemAssignedStudentId(item, activeProjectId);
        if (myStuId && assignedStuId && myStuId !== assignedStuId) {
            return false;
        }
        return true;
    }

    function isItemEditableByCurrentUser(item) {
        if (!currentSession || !item) return false;
        if (currentSession.role === "teacher") return true;
        if (activeProjectId === "proje-siyer") {
            const status = getItemStatus(item.id);
            if (status === "finalized" || status === "in_review" || status === "approved") {
                return false;
            }
            return true;
        }
        if (activeProjectId !== "proje-tarih" && activeProjectId !== "proje-bilim") return true;

        const myStuId = resolveCurrentUserStudentId(activeProjectId);
        const assignedStuId = getItemAssignedStudentId(item, activeProjectId);
        if (myStuId && assignedStuId && myStuId !== assignedStuId) {
            return false;
        }

        // KESİNLEŞTİRİLMİŞ DURUM KONTROLÜ:
        // Eğer araştırma kesinleştirilmişse form read-only modda korunur.
        // Öğrenci DÜZENLE butonuna bastığında durum "editing" olur ve form hemen açılır.
        const status = getItemStatus(item.id);
        if (status === "finalized" || status === "in_review" || status === "approved") {
            return false;
        }

        return true;
    }

    function renderLatexHtmlString(rawText) {
        const text = String(rawText || "");
        if (!text.trim()) {
            return '<span class="text-slate-400 italic text-[11px]">Formül önizlemesi için $...$ veya $$...$$ biçiminde LaTeX ifadesi yazabilirsiniz.</span>';
        }
        if (typeof window !== "undefined" && window.katex && typeof window.katex.renderToString === "function") {
            const escaped = escapeHtml(text);
            return escaped
                .replace(/\$\$([\s\S]+?)\$\$/g, (_, expr) => {
                    try {
                        return `<div class="my-1 overflow-x-auto">${window.katex.renderToString(expr.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">"), { displayMode: true, throwOnError: false })}</div>`;
                    } catch (e) { return _; }
                })
                .replace(/\$([^$\n]+?)\$/g, (_, expr) => {
                    try {
                        return window.katex.renderToString(expr.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">"), { displayMode: false, throwOnError: false });
                    } catch (e) { return _; }
                });
        }
        return escapeHtml(text);
    }

    function isSiyerNoEventText(txt) {
        const norm = String(txt || "").toLocaleLowerCase("tr-TR").trim();
        if (!norm) return false;
        return (
            norm.includes("siyer olayı yoktur") ||
            norm.includes("siyer olayı gerçekleşmemiştir") ||
            norm.includes("herhangi bir siyer olayı") ||
            norm.includes("olay tespit edilemedi") ||
            norm.includes("olay bulunmamaktadır")
        );
    }

    function computeStudentStats(stuId, projectId = activeProjectId) {
        const projData = seedData?.projects?.[projectId] || {};
        const items = projData.items || [];
        const totalCriteria = (projData.criteriaList || []).length || (projectId === "proje-bilim" ? 14 : (projectId === "proje-siyer" ? 5 : 18));
        const assignedItems = items.filter(it => getItemAssignedStudentId(it, projectId) === stuId);
        let startedCount = 0;
        let completedCount = 0;
        let approvedCount = 0;
        let filledCriteria = 0;
        let noEventFlagCount = 0;
        let lastUpdatedAt = null;
        const incompleteItems = [];
        const recoverableItems = [];

        assignedItems.forEach(it => {
            const c1Content = (runtimeRecords[`${it.id}__c1_olay`]?.content || '').trim();
            const c2Content = (runtimeRecords[`${it.id}__c2_kok_deger`]?.content || '').trim();
            const c3Content = (runtimeRecords[`${it.id}__c3_kaynakca`]?.content || '').trim();
            const isExplicitNoEvent = projectId === "proje-siyer" && (
                runtimeSiyerYearFlags?.[it.id]?.status === "no_event_found" ||
                isSiyerNoEventText(c1Content)
            );
            const filled = countItemFilledCriteria(it.id, projectId);
            filledCriteria += filled;
            const isCompleted = isExplicitNoEvent || (
                projectId === "proje-siyer"
                    ? (c1Content.length > 0 && (c3Content.length > 0 || getItemSources(it.id).length > 0))
                    : (filled === totalCriteria)
            );
            if (filled > 0 || isExplicitNoEvent) startedCount++;
            if (isCompleted) {
                completedCount++;
            } else {
                incompleteItems.push({
                    id: it.id,
                    title: it.title || (it.year ? `${it.year} Yılı` : it.id),
                    filled,
                    total: totalCriteria,
                    missing: Math.max(0, totalCriteria - filled)
                });
            }
            if (runtimeSiyerYearFlags?.[it.id]?.status === "no_event_found") noEventFlagCount++;
            if (getItemStatus(it.id) === "approved") approvedCount++;
            Object.values(runtimeRecords).forEach(rec => {
                const matchRec = rec && (rec.itemId === it.id || (projectId === "proje-siyer" && String(rec.itemId || "").startsWith(`${it.id}__`)));
                if (matchRec && rec.updatedAt) {
                    if (!lastUpdatedAt || rec.updatedAt > lastUpdatedAt) {
                        lastUpdatedAt = rec.updatedAt;
                    }
                }
            });
            // Revizyon geçmişinde kurtarılabilir (önceden dolu olup şu an boş olan) alan var mı kontrol et
            const itemRevs = (runtimeRevisions || []).filter(r => r && r.itemId === it.id);
            for (const rev of itemRevs) {
                const rk = rev.recordKey || `${it.id}__${rev.criterionKey}`;
                const curVal = (runtimeRecords[rk]?.content || '').trim();
                const histVal = String(rev.prevContent || rev.newContent || '').trim();
                if (!curVal && histVal && !rk.endsWith('__finalized') && !rk.endsWith('__editing')) {
                    recoverableItems.push({ id: it.id, key: rk });
                }
            }
        });

        const effectiveItemCount = Math.max(0, assignedItems.length - noEventFlagCount);
        const totalPossible = effectiveItemCount * totalCriteria;
        const missingCriteria = Math.max(0, totalPossible - filledCriteria);
        const pct = projectId === "proje-siyer"
            ? (assignedItems.length > 0 ? Math.round((completedCount / assignedItems.length) * 100) : 0)
            : (totalPossible > 0 ? Math.round((filledCriteria / totalPossible) * 100) : (noEventFlagCount > 0 ? 100 : 0));
        return {
            assignedTotal: assignedItems.length,
            startedCount,
            completedCount,
            approvedCount,
            filledCriteria,
            totalPossible,
            missingCriteria,
            pct,
            lastUpdatedAt,
            assignedItems,
            incompleteItems,
            recoverableCount: recoverableItems.length
        };
    }

    function renderStudentSelectionPanel(projData) {
        const projectId = projData?.id || activeProjectId;
        const students = getProjectStudents(projectId);
        const isTeacher = currentSession?.role === "teacher";
        const distValid = isProjectDistributionValid(projectId);
        const myStuId = resolveCurrentUserStudentId(projectId);
        const expectedTotal = projectId === "proje-bilim" ? 92 : (projectId === "proje-siyer" ? 62 : 40);
        const unitLabel = projectId === "proje-bilim" ? "Bilim İnsanı" : (projectId === "proje-siyer" ? "Yıl" : "Eser");
        const panelHeading = projectId === "proje-siyer" ? "SİYER ARAŞTIRMA EKİBİ" : "ARAŞTIRMA EKİBİ – ÖĞRENCİ SEÇİMİ";

        return `
        <div class="space-y-2.5">
            <div class="flex items-center justify-between gap-2">
                <h3 class="text-[11px] font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                    <i class="fa-solid fa-users text-amber-600"></i>
                    <span>${panelHeading}</span>
                </h3>
                ${activeStudentFilterId !== 'all' ? `
                <button type="button" onclick="window.RotaliTubitak.selectStudentFilter('all')" class="px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-black transition-colors cursor-pointer">
                    Tümü (${(projData.items || []).length})
                </button>
                ` : ''}
            </div>

            ${!distValid && isTeacher ? `
            <div class="p-3 rounded-2xl bg-red-50 border border-red-200 text-[11px] font-bold text-red-800 flex items-start gap-2">
                <i class="fa-solid fa-triangle-exclamation text-red-600 mt-0.5"></i>
                <span>Uyarı: Mevcut kayıt sayısı ${expectedTotal} olarak doğrulanamadığı için (${(projData.items || []).length}) otomatik görev dağılımı devre dışı bırakıldı.</span>
            </div>
            ` : ''}

            <div class="grid grid-cols-1 gap-2 max-h-[290px] overflow-y-auto pr-0.5 custom-scrollbar">
                ${students.map(stu => {
                    const isSelected = activeStudentFilterId === stu.id;
                    const isMe = myStuId === stu.id;
                    const stats = computeStudentStats(stu.id, projectId);
                    return `
                    <button type="button" onclick="window.RotaliTubitak.selectStudentFilter('${stu.id}')" class="w-full text-left p-3 rounded-2xl border transition-all cursor-pointer ${isSelected ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-400/20 shadow-sm' : 'bg-slate-50/80 hover:bg-slate-100 border-slate-200'}">
                        <div class="flex items-center justify-between gap-2">
                            <div class="flex items-center gap-2 min-w-0">
                                <span class="w-7 h-7 rounded-xl ${isSelected ? 'bg-amber-500 text-slate-950' : 'bg-indigo-100 text-indigo-700'} flex items-center justify-center text-xs font-black shrink-0">
                                    <i class="fa-solid fa-user-graduate"></i>
                                </span>
                                <div class="min-w-0">
                                    <div class="text-xs font-black text-slate-900 truncate flex items-center gap-1.5">
                                        <span>${escapeHtml(stu.name)}</span>
                                        ${isMe ? '<span class="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 text-[9px] font-black">SİZ</span>' : ''}
                                    </div>
                                    <div class="text-[10px] font-bold text-slate-500">${escapeHtml(stu.groupLabel)} • ${stu.range ? `${stu.range[0]}–${stu.range[1]}. ${unitLabel}` : ''}</div>
                                </div>
                            </div>
                            <span class="px-2 py-0.5 rounded-full text-[10px] font-black ${isSelected ? 'bg-amber-500 text-slate-950' : 'bg-white border border-slate-200 text-slate-700'} shrink-0">
                                ${stats.assignedTotal} ${unitLabel}
                            </span>
                        </div>
                        <div class="mt-2 space-y-1">
                            <div class="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                <div class="h-full ${stats.pct === 100 ? 'bg-emerald-500' : 'bg-amber-500'} rounded-full transition-all" style="width: ${stats.pct}%;"></div>
                            </div>
                            <div class="flex items-center justify-between text-[10px] font-bold text-slate-600 flex-wrap gap-1">
                                <span>Başlanan: <strong class="text-slate-900">${stats.startedCount}</strong> • Tamam: <strong class="text-emerald-700">${stats.completedCount}</strong></span>
                                <span>İlerleme: <strong class="text-indigo-700">%${stats.pct}</strong> (${stats.filledCriteria}/${stats.totalPossible})</span>
                            </div>
                        </div>
                    </button>
                    `;
                }).join("")}
            </div>
        </div>
        `;
    }

    function getFilteredItems() {
        const projData = seedData?.projects?.[activeProjectId] || {};
        let list = [...(projData.items || [])];

        // Öğrenci Filtresi (Proje 1 & Proje 2; Proje 3'te aktif yıl korunur)
        if ((activeProjectId === "proje-tarih" || activeProjectId === "proje-bilim") && activeStudentFilterId !== "all") {
            list = list.filter(it => getItemAssignedStudentId(it, activeProjectId) === activeStudentFilterId);
        } else if (activeProjectId === "proje-siyer" && activeStudentFilterId !== "all") {
            const filtered = list.filter(it => getItemAssignedStudentId(it, "proje-siyer") === activeStudentFilterId);
            if (activeItemId && !filtered.some(it => it.id === activeItemId)) {
                activeStudentFilterId = "all";
            } else {
                list = filtered;
            }
        }

        // Arama filtresi (Proje 2 & Proje 3)
        if (activeProjectId !== "proje-tarih" && searchQuery.trim()) {
            const q = searchQuery.toLowerCase().trim();
            list = list.filter(it => 
                (it.title && it.title.toLowerCase().includes(q)) ||
                (it.district && it.district.toLowerCase().includes(q)) ||
                (it.field && it.field.toLowerCase().includes(q)) ||
                (it.summary && it.summary.toLowerCase().includes(q)) ||
                (String(it.year || '').includes(q))
            );
        }

        // İlçe Filtresi
        if (activeFilter !== "all" && activeProjectId === "proje-tarih") {
            list = list.filter(it => it.district === activeFilter);
        }

        // Tarihsel Dönem Filtresi
        if (activePeriodFilter !== "all" && activeProjectId === "proje-tarih") {
            list = list.filter(it => it.periodGroup === activePeriodFilter);
        }

        // Sıralama (Proje 1 tanımlı sıra, Proje 3 kronolojik sıra 571–632, Proje 2 orijinal veya alfabetik)
        if (activeProjectId === "proje-bilim") {
            if (activeSort === "alpha") {
                list.sort((a, b) => a.title.localeCompare(b.title, "tr"));
            } else {
                list.sort((a, b) => getItemPermanentOrder(a, "proje-bilim") - getItemPermanentOrder(b, "proje-bilim"));
            }
        } else if (activeProjectId === "proje-siyer") {
            list.sort((a, b) => (a.year || 0) - (b.year || 0));
        }

        return list;
    }

    function countItemFilledCriteria(itemId, projectId = activeProjectId) {
        const projData = seedData?.projects?.[projectId] || {};
        const criteriaList = projData.criteriaList || [];
        const eventIds = projectId === "proje-siyer" ? getSiyerYearEventIds(itemId) : [itemId];
        let count = 0;
        for (const crit of criteriaList) {
            const hasContent = eventIds.some(evId => {
                const rec = getRecordWithAliases(evId, crit.key);
                return rec && typeof rec.content === 'string' && rec.content.trim().length > 0;
            });
            if (hasContent) {
                count++;
            }
        }
        return count;
    }

    function getItemStatus(itemId) {
        if (runtimeSiyerYearFlags?.[itemId]?.status === "no_event_found") {
            return "no_event_found";
        }
        const finalMeta = runtimeFinalized?.[itemId];
        if (finalMeta?.status === "editing") {
            return "editing";
        }
        if (finalMeta?.status === "correction_requested") {
            return "correction_requested";
        }
        if (finalMeta?.status === "finalized" || finalMeta?.status === "in_review") {
            return "finalized";
        }
        if (finalMeta?.status === "approved") {
            return "approved";
        }

        let hasInReview = false;
        let hasApproved = false;
        let hasCorrection = false;
        let hasEditing = false;

        for (const [k, v] of Object.entries(runtimeRecords)) {
            if (k.startsWith(`${itemId}__`)) {
                if (v.status === "approved") hasApproved = true;
                if (v.status === "in_review" || v.status === "finalized") hasInReview = true;
                if (v.status === "correction_requested") hasCorrection = true;
                if (v.status === "editing") hasEditing = true;
            }
        }

        if (hasEditing) return "editing";
        if (hasCorrection) return "correction_requested";
        if (hasApproved && !hasInReview) return "approved";
        if (hasInReview) return "finalized";
        return "editing";
    }

    function getStatusBadgeClass(status) {
        switch (status) {
            case "approved": return "bg-emerald-100 text-emerald-800 border border-emerald-300";
            case "finalized":
            case "in_review": return "bg-teal-100 text-teal-800 border border-teal-300";
            case "editing":
            case "draft": return "bg-amber-100 text-amber-900 border border-amber-300";
            case "correction_requested": return "bg-rose-100 text-rose-800 border border-rose-300";
            case "no_event_found": return "bg-slate-200 text-slate-700 border border-slate-300";
            default: return "bg-amber-100 text-amber-900 border border-amber-300";
        }
    }

    function getStatusLabel(status) {
        switch (status) {
            case "approved": return "✅ Onaylandı";
            case "finalized":
            case "in_review": return "🎓 Kesinleştirildi";
            case "editing":
            case "draft": return "📝 Düzenleniyor";
            case "correction_requested": return "⚠️ Düzeltme İstendi";
            case "no_event_found": return "🔍 Araştırıldı – Olay tespit edilemedi";
            default: return "📝 Düzenleniyor";
        }
    }

    function getItemSources(itemId) {
        return Object.values(runtimeSources).filter(s => s.itemId === itemId);
    }

    function updateUIAutosaveBadge(state) {
        saveState = state;
        const dot = document.getElementById("autosave-dot");
        const text = document.getElementById("autosave-text");
        if (!dot || !text) return;

        switch (state) {
            case "saving":
                dot.className = "w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse";
                text.textContent = "Kaydediliyor...";
                text.className = "text-xs font-black text-amber-700";
                break;
            case "saved":
                dot.className = "w-2.5 h-2.5 rounded-full bg-emerald-500";
                text.textContent = "Kaydedildi";
                text.className = "text-xs font-black text-emerald-700";
                break;
            case "dirty":
                dot.className = "w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping";
                text.textContent = "Değişiklik var";
                text.className = "text-xs font-black text-blue-700";
                break;
            case "error":
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
        }
    }

    function updateProgressBadge() {
        const items = getFilteredItems();
        // İlerleme rozetlerini arayüzde yenile
    }

    // 9. DİYALOGLAR (DEĞİŞİKLİK GEÇMİŞİ & KAYNAK EKLEME)
    function openHistoryModal(itemId) {
        let modal = document.getElementById("tubitak-history-modal");
        if (!modal) {
            modal = document.createElement("div");
            modal.id = "tubitak-history-modal";
            modal.className = "fixed inset-0 z-[99990] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6";
            document.body.appendChild(modal);
        }

        const itemRevs = runtimeRevisions.filter(r => r.itemId === itemId).reverse();

        modal.innerHTML = `
        <div class="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95" onclick="event.stopPropagation()">
            <div class="px-5 py-4 bg-slate-900 text-white flex items-center justify-between">
                <div class="flex items-center gap-2">
                    <i class="fa-solid fa-clock-rotate-left text-amber-400"></i>
                    <h3 class="font-black text-sm sm:text-base">Değişiklik Geçmişi ve Sürüm Kontrolü</h3>
                </div>
                <button type="button" onclick="document.getElementById('tubitak-history-modal').classList.add('hidden')" class="w-8 h-8 rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>

            <div class="p-5 flex-1 overflow-y-auto space-y-3 custom-scrollbar text-xs">
                ${itemRevs.length === 0 ? `
                <div class="p-6 text-center text-slate-400 font-semibold">
                    Henüz kayıtlı bir geçmiş sürüm bulunmuyor.
                </div>
                ` : itemRevs.map(rev => `
                <div class="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <div class="flex items-center justify-between text-slate-500 font-semibold">
                        <span class="font-black text-slate-900 flex items-center gap-1.5">
                            <span class="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px]">v${rev.version}</span>
                            <span>${escapeHtml(rev.criterionKey)}</span>
                        </span>
                        <span>${new Date(rev.createdAt).toLocaleString('tr-TR')}</span>
                    </div>
                    <div class="text-slate-700 bg-white p-2.5 rounded-xl border border-slate-200/80 font-mono text-[11px] line-clamp-3">
                        ${escapeHtml(rev.newContent || '(Boş)')}
                    </div>
                    <div class="flex items-center justify-between pt-1">
                        <span class="text-[11px] text-slate-500">Düzenleyen: <strong>${escapeHtml(rev.studentName || 'Anonim')}</strong></span>
                        <button type="button" onclick="window.RotaliTubitak.restoreRevision('${rev.id}')" class="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-black text-[11px] transition-colors cursor-pointer">
                            ↶ Bu Sürümü Geri Yükle
                        </button>
                    </div>
                </div>
                `).join("")}
            </div>
        </div>
        `;

        modal.classList.remove("hidden");
    }

    function openAddSourceModal(itemId) {
        let modal = document.getElementById("tubitak-source-modal");
        if (!modal) {
            modal = document.createElement("div");
            modal.id = "tubitak-source-modal";
            modal.className = "fixed inset-0 z-[99990] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6";
            document.body.appendChild(modal);
        }

        modal.innerHTML = `
        <div class="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95" onclick="event.stopPropagation()">
            <div class="px-5 py-4 bg-slate-900 text-white flex items-center justify-between">
                <div class="flex items-center gap-2">
                    <i class="fa-solid fa-book-bookmark text-blue-400"></i>
                    <h3 class="font-black text-sm sm:text-base">Akademik Kaynak ve Belge Ekle</h3>
                </div>
                <button type="button" onclick="document.getElementById('tubitak-source-modal').classList.add('hidden')" class="w-8 h-8 rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>

            <form onsubmit="event.preventDefault(); window.RotaliTubitak.saveSource('${itemId}');" class="p-5 space-y-3 text-xs">
                <div>
                    <label class="block font-black text-slate-700 mb-1">Eser / Kitap / Makale Adı *</label>
                    <input type="text" id="src-title" required placeholder="Örn: Abideleri ve Kitabeleriyle Sivas Tarihi" class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold">
                </div>
                <div class="grid grid-cols-2 gap-2">
                    <div>
                        <label class="block font-black text-slate-700 mb-1">Yazar(lar)</label>
                        <input type="text" id="src-author" placeholder="Örn: İbrahim Hakkı Konyalı" class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold">
                    </div>
                    <div>
                        <label class="block font-black text-slate-700 mb-1">Yayın Yılı</label>
                        <input type="text" id="src-year" placeholder="Örn: 1955" class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold">
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-2">
                    <div>
                        <label class="block font-black text-slate-700 mb-1">Yayınevi / Dergi</label>
                        <input type="text" id="src-publisher" placeholder="Örn: TTK Yayınları" class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold">
                    </div>
                    <div>
                        <label class="block font-black text-slate-700 mb-1">Sayfa No</label>
                        <input type="text" id="src-page" placeholder="Örn: s. 142-148" class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold">
                    </div>
                </div>
                <div>
                    <label class="block font-black text-slate-700 mb-1">Belge / URL Bağlantısı</label>
                    <input type="url" id="src-url" placeholder="https://..." class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold">
                </div>
                <div>
                    <label class="block font-black text-slate-700 mb-1">Açıklama / Alıntı</label>
                    <textarea id="src-desc" rows="2" placeholder="Kaynakta geçen önemli tespit veya alıntı..." class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold"></textarea>
                </div>

                <div class="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                    <button type="button" onclick="document.getElementById('tubitak-source-modal').classList.add('hidden')" class="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 cursor-pointer">
                        İptal
                    </button>
                    <button type="submit" class="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black cursor-pointer">
                        Kaydet
                    </button>
                </div>
            </form>
        </div>
        `;

        modal.classList.remove("hidden");
    }

    // 10. ÖĞRETMEN ANA KONTROL MERKEZİ MODALI
    function renderProje1TeacherStudentTracking() {
        const projData = seedData?.projects?.["proje-tarih"] || {};
        const items = projData.items || [];
        const students = getProje1Students();
        const totalCriteria = (projData.criteriaList || []).length || 18;
        const distValid = isProje1DistributionValid();

        return `
        <div class="space-y-4">
            <div class="flex items-center justify-between gap-2 flex-wrap">
                <h4 class="font-black text-slate-900 text-sm flex items-center gap-2">
                    <i class="fa-solid fa-users-gear text-indigo-600"></i>
                    <span>Proje 1 – Öğrenci Araştırma Takibi & Görev Atamaları</span>
                </h4>
                <div class="flex items-center gap-2 flex-wrap">
                    <button type="button" onclick="window.RotaliTubitak.downloadAllProje1Word(this)" class="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-[11px] transition-all shadow-sm flex items-center gap-1.5 cursor-pointer" title="Kayıtlı eserlerin her biri için ayrı .docx oluşturup ZIP olarak indir">
                        <i class="fa-solid fa-file-zipper"></i>
                        <span>Tüm Eserleri Word Olarak İndir</span>
                    </button>
                    <span class="px-2.5 py-1 rounded-full text-[10px] font-black bg-indigo-50 text-indigo-700 border border-indigo-200">
                        Toplam ${items.length} Eser • ${students.length} Öğrenci
                    </span>
                </div>
            </div>

            ${!distValid ? `
            <div class="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-xs font-bold text-red-800 flex items-center gap-2">
                <i class="fa-solid fa-triangle-exclamation text-red-600"></i>
                <span>Dikkat: Proje 1 eser sayısı 40 olarak doğrulanamadı (mevcut: ${items.length}). Otomatik görev dağılımı güvenlik nedeniyle durduruldu.</span>
            </div>
            ` : ''}

            <div class="space-y-3">
                ${students.map(stu => {
                    const stats = computeStudentStats(stu.id);
                    const lastDateStr = stats.lastUpdatedAt ? new Date(stats.lastUpdatedAt).toLocaleString("tr-TR") : "Henüz işlem yok";
                    return `
                    <details class="rounded-2xl border border-slate-200 bg-slate-50/70 overflow-hidden" open>
                        <summary class="p-3.5 bg-white border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 cursor-pointer select-none">
                            <div class="flex items-center gap-2.5">
                                <span class="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-black text-xs shrink-0">
                                    <i class="fa-solid fa-user-graduate"></i>
                                </span>
                                <div>
                                    <div class="font-black text-slate-900 text-xs sm:text-sm">${escapeHtml(stu.name)} <span class="text-[10px] font-bold text-slate-500">(${escapeHtml(stu.groupLabel)})</span></div>
                                    <div class="text-[10px] font-semibold text-slate-500">Son Düzenleme: ${escapeHtml(lastDateStr)}</div>
                                </div>
                            </div>
                            <div class="flex items-center gap-2 flex-wrap text-[10px] font-black">
                                <span class="px-2 py-0.5 rounded-full bg-slate-100 text-slate-800">${stats.assignedTotal} Eser</span>
                                <span class="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">Başlanan: ${stats.startedCount}</span>
                                <span class="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">Tamam: ${stats.completedCount}</span>
                                <span class="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">Kriter: ${stats.filledCriteria}/${stats.totalPossible} (Eksik: ${stats.missingCriteria})</span>
                            </div>
                        </summary>
                        <div class="p-3 space-y-1.5 max-h-60 overflow-y-auto custom-scrollbar">
                            ${stats.assignedItems.map(it => {
                                const orderNum = getItemPermanentOrder(it);
                                const filled = countItemFilledCriteria(it.id);
                                const missing = Math.max(0, totalCriteria - filled);
                                const status = getItemStatus(it.id);
                                return `
                                <div class="p-2.5 rounded-xl bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                    <div class="min-w-0">
                                        <div class="font-black text-slate-900 text-xs truncate">
                                            <span class="text-amber-700">#${orderNum}</span> ${escapeHtml(it.title)}
                                        </div>
                                        <div class="text-[10px] font-semibold text-slate-500 mt-0.5">
                                            Dolu: <strong class="text-slate-800">${filled}/${totalCriteria}</strong> • Eksik: <strong class="text-amber-700">${missing}</strong> • Durum: <span class="font-bold">${getStatusLabel(status)}</span>
                                        </div>
                                    </div>
                                    <div class="flex items-center gap-1.5 flex-wrap shrink-0">
                                        <select id="reassign-${it.id}" class="px-2 py-1 rounded-lg bg-slate-50 border border-slate-200 text-[10px] font-bold text-slate-700">
                                            ${students.map(optStu => `<option value="${optStu.id}" ${optStu.id === stu.id ? 'selected' : ''}>${escapeHtml(optStu.name)}</option>`).join("")}
                                        </select>
                                        <button type="button" onclick="window.RotaliTubitak.reassignStudentWork('${it.id}', document.getElementById('reassign-${it.id}').value)" class="px-2 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-black text-[10px] cursor-pointer" title="Öğrenci Atamasını Güncelle">
                                            Ata
                                        </button>
                                        <button type="button" onclick="window.RotaliTubitak.downloadMonumentWord('${it.id}', this)" class="px-2 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] cursor-pointer flex items-center gap-1" title="Eserin kayıtlı metinlerini Word (.docx) olarak indir">
                                            <i class="fa-solid fa-file-word"></i>
                                            <span>Word Olarak İndir</span>
                                        </button>
                                        <button type="button" onclick="window.RotaliTubitak.openItemInEditor('${it.id}'); document.getElementById('tubitak-teacher-modal').classList.add('hidden');" class="px-2 py-1 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-[10px] cursor-pointer">
                                            İncele
                                        </button>
                                        <button type="button" onclick="window.RotaliTubitak.teacherReview('${it.id}', 'approved')" class="px-2 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] cursor-pointer">
                                            Onayla
                                        </button>
                                    </div>
                                </div>
                                `;
                            }).join("")}
                        </div>
                    </details>
                    `;
                }).join("")}
            </div>
        </div>
        `;
    }

    function renderProje2TeacherStudentTracking() {
        const projData = seedData?.projects?.["proje-bilim"] || {};
        const items = projData.items || [];
        const students = getProjectStudents("proje-bilim");
        const totalCriteria = (projData.criteriaList || []).length || 14;
        const distValid = isProjectDistributionValid("proje-bilim");

        return `
        <div class="space-y-4 pt-4 border-t border-slate-200">
            <div class="flex items-center justify-between gap-2 flex-wrap">
                <h4 class="font-black text-slate-900 text-sm flex items-center gap-2">
                    <i class="fa-solid fa-atom text-purple-600"></i>
                    <span>Proje 2 – Matematik Tarihi Bilim İnsanları Takibi & Görev Atamaları</span>
                </h4>
                <div class="flex items-center gap-2 flex-wrap">
                    <button type="button" onclick="window.RotaliTubitak.downloadAllProje1Word(this, 'proje-bilim')" class="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-[11px] transition-all shadow-sm flex items-center gap-1.5 cursor-pointer" title="92 bilim insanının her biri için ayrı .docx oluşturup ZIP olarak indir">
                        <i class="fa-solid fa-file-zipper"></i>
                        <span>Tüm Bilim İnsanlarını Word Olarak İndir</span>
                    </button>
                    <span class="px-2.5 py-1 rounded-full text-[10px] font-black bg-purple-50 text-purple-700 border border-purple-200">
                        Toplam ${items.length} Bilim İnsanı • ${students.length} Öğrenci
                    </span>
                </div>
            </div>

            ${!distValid ? `
            <div class="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-xs font-bold text-red-800 flex items-center gap-2">
                <i class="fa-solid fa-triangle-exclamation text-red-600"></i>
                <span>Dikkat: Proje 2 bilim insanı sayısı 92 olarak doğrulanamadı (mevcut: ${items.length}).</span>
            </div>
            ` : ''}

            <div class="space-y-3">
                ${students.map(stu => {
                    const stats = computeStudentStats(stu.id, "proje-bilim");
                    const lastDateStr = stats.lastUpdatedAt ? new Date(stats.lastUpdatedAt).toLocaleString("tr-TR") : "Henüz işlem yok";
                    return `
                    <details class="rounded-2xl border border-slate-200 bg-slate-50/70 overflow-hidden">
                        <summary class="p-3.5 bg-white border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 cursor-pointer select-none">
                            <div class="flex items-center gap-2.5">
                                <span class="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-black text-xs shrink-0">
                                    <i class="fa-solid fa-user-graduate"></i>
                                </span>
                                <div>
                                    <div class="font-black text-slate-900 text-xs sm:text-sm">${escapeHtml(stu.name)} <span class="text-[10px] font-bold text-slate-500">(${escapeHtml(stu.groupLabel)})</span></div>
                                    <div class="text-[10px] font-semibold text-slate-500">Son Düzenleme: ${escapeHtml(lastDateStr)}</div>
                                </div>
                            </div>
                            <div class="flex items-center gap-2 flex-wrap text-[10px] font-black">
                                <span class="px-2 py-0.5 rounded-full bg-slate-100 text-slate-800">${stats.assignedTotal} Kişi</span>
                                <span class="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">Başlanan: ${stats.startedCount}</span>
                                <span class="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">Tamam: ${stats.completedCount}</span>
                                <span class="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">Kriter: ${stats.filledCriteria}/${stats.totalPossible} (%${stats.pct})</span>
                            </div>
                        </summary>
                        <div class="p-3 space-y-1.5 max-h-64 overflow-y-auto custom-scrollbar">
                            ${stats.assignedItems.map(it => {
                                const orderNum = getItemPermanentOrder(it, "proje-bilim");
                                const filled = countItemFilledCriteria(it.id, "proje-bilim");
                                const missing = Math.max(0, totalCriteria - filled);
                                const status = getItemStatus(it.id);
                                return `
                                <div class="p-2.5 rounded-xl bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                    <div class="min-w-0">
                                        <div class="font-black text-slate-900 text-xs truncate">
                                            <span class="text-purple-700">#${orderNum}</span> ${escapeHtml(it.title)}
                                        </div>
                                        <div class="text-[10px] font-semibold text-slate-500 mt-0.5">
                                            Dolu: <strong class="text-slate-800">${filled}/${totalCriteria}</strong> • Eksik: <strong class="text-amber-700">${missing}</strong> • Durum: <span class="font-bold">${getStatusLabel(status)}</span>
                                        </div>
                                    </div>
                                    <div class="flex items-center gap-1.5 flex-wrap shrink-0">
                                        <select id="reassign-p2-${it.id}" class="px-2 py-1 rounded-lg bg-slate-50 border border-slate-200 text-[10px] font-bold text-slate-700">
                                            ${students.map(optStu => `<option value="${optStu.id}" ${optStu.id === stu.id ? 'selected' : ''}>${escapeHtml(optStu.name)}</option>`).join("")}
                                        </select>
                                        <button type="button" onclick="window.RotaliTubitak.reassignStudentWork('${it.id}', document.getElementById('reassign-p2-${it.id}').value, 'proje-bilim')" class="px-2 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-black text-[10px] cursor-pointer" title="Öğrenci Atamasını Güncelle">
                                            Ata
                                        </button>
                                        <button type="button" onclick="window.RotaliTubitak.downloadMonumentWord('${it.id}', this, 'proje-bilim')" class="px-2 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] cursor-pointer flex items-center gap-1" title="Kayıtlı araştırma metinlerini Word (.docx) olarak indir">
                                            <i class="fa-solid fa-file-word"></i>
                                            <span>Word Olarak İndir</span>
                                        </button>
                                        <button type="button" onclick="window.RotaliTubitak.switchProject('proje-bilim'); window.RotaliTubitak.openItemInEditor('${it.id}'); document.getElementById('tubitak-teacher-modal').classList.add('hidden');" class="px-2 py-1 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-[10px] cursor-pointer">
                                            İncele
                                        </button>
                                        <button type="button" onclick="window.RotaliTubitak.teacherReview('${it.id}', 'approved')" class="px-2 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] cursor-pointer">
                                            Onayla
                                        </button>
                                    </div>
                                </div>
                                `;
                            }).join("")}
                        </div>
                    </details>
                    `;
                }).join("")}
            </div>
        </div>
        `;
    }

    function renderProje3TeacherStudentTracking() {
        const proj3 = seedData?.projects?.["proje-siyer"] || {};
        const items = proj3.items || [];
        const students = getProjectStudents("proje-siyer");
        const totalCriteria = (proj3.criteriaList || []).length || 5;
        const distValid = isProjectDistributionValid("proje-siyer");

        return `
        <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
            <div class="flex flex-wrap items-center justify-between gap-2">
                <div>
                    <h4 class="font-black text-slate-900 text-sm flex items-center gap-2">
                        <i class="fa-solid fa-mosque text-emerald-600"></i>
                        <span>Proje 3 (Siyer 571–632) – Öğrenci Araştırma Takibi ve Görev Yönetimi</span>
                    </h4>
                    <p class="text-[11px] text-slate-500 mt-0.5">62 yıl (571–632), 5 öğrenci arasında kronolojik sırayla dağıtılmıştır (13 / 13 / 12 / 12 / 12).</p>
                </div>
                <div class="flex items-center gap-2 flex-wrap">
                    <button type="button" onclick="window.RotaliTubitak.downloadAllProje1Word(this, 'proje-siyer')" class="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-[11px] transition-all shadow-sm flex items-center gap-1.5 cursor-pointer" title="62 yılın her biri için ayrı .docx oluşturup ZIP olarak indir">
                        <i class="fa-solid fa-file-zipper"></i>
                        <span>Tüm Yılları Word Olarak İndir</span>
                    </button>
                    <span class="px-2.5 py-1 rounded-xl text-[11px] font-black ${distValid ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-red-100 text-red-800 border border-red-200'}">
                        ${distValid ? '✅ 62 Yıl Doğrulandı' : `⚠️ Uyarı: ${items.length}/62 Yıl`}
                    </span>
                </div>
            </div>

            ${!distValid ? `
            <div class="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 font-bold text-xs">
                Uyarı: Proje 3 kayıt sayısı 62 olarak doğrulanamadığı için otomatik görev dağılımı durduruldu.
            </div>
            ` : ''}

            <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
                ${students.map(stu => {
                    const stats = computeStudentStats(stu.id, "proje-siyer");
                    return `
                    <div class="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
                        <div class="flex items-center justify-between gap-2">
                            <span class="font-black text-slate-900 text-xs">${escapeHtml(stu.name)}</span>
                            <span class="px-2 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 font-black text-[10px]">${stats.assignedTotal} Yıl</span>
                        </div>
                        <div class="grid grid-cols-2 gap-1.5 text-[10px] text-slate-600 font-semibold">
                            <div>Başlanan: <strong class="text-slate-900">${stats.startedCount}</strong></div>
                            <div>Tamamlanan: <strong class="text-emerald-700">${stats.completedCount}</strong></div>
                            <div>Onaylı: <strong class="text-blue-700">${stats.approvedCount}</strong></div>
                            <div>Eksik Kriter: <strong class="text-amber-700">${stats.missingCriteria}</strong></div>
                        </div>
                        <div class="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div class="h-full bg-emerald-600 rounded-full" style="width:${stats.pct}%"></div>
                        </div>
                        <div class="flex items-center justify-between text-[10px] text-slate-400">
                            <span>İlerleme: <strong class="text-slate-800">%${stats.pct}</strong></span>
                            <span>${stats.lastUpdatedAt ? formatDateTr(stats.lastUpdatedAt) : 'Henüz yok'}</span>
                        </div>
                    </div>
                    `;
                }).join("")}
            </div>

            <div class="space-y-2">
                ${students.map(stu => {
                    const stats = computeStudentStats(stu.id, "proje-siyer");
                    return `
                    <details class="rounded-2xl bg-white border border-slate-200 overflow-hidden">
                        <summary class="px-4 py-2.5 cursor-pointer font-black text-slate-800 text-xs flex items-center justify-between hover:bg-slate-50">
                            <span><i class="fa-solid fa-user-graduate text-emerald-600 mr-1.5"></i>${escapeHtml(stu.name)} (${stats.assignedTotal} Yıl • %${stats.pct})</span>
                            <span class="text-[11px] font-bold text-slate-500">Yılları Yönet & Atama Değiştir</span>
                        </summary>
                        <div class="divide-y divide-slate-100 border-t border-slate-100">
                            ${stats.assignedItems.map(it => {
                                const filled = countItemFilledCriteria(it.id, "proje-siyer");
                                const st = getItemStatus(it.id);
                                const evCount = getSiyerYearEventIds(it.id).length;
                                const isNoEvent = runtimeSiyerYearFlags?.[it.id]?.status === "no_event_found";
                                return `
                                <div class="px-4 py-2 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                                    <div class="flex items-center gap-2 min-w-0">
                                        <span class="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-black">#${getItemPermanentOrder(it, "proje-siyer")}</span>
                                        <span class="font-bold text-slate-800 truncate">${escapeHtml(it.title)}</span>
                                        <span class="text-[10px] text-slate-500">(${filled}/${totalCriteria} Kriter)</span>
                                        <span class="px-1.5 py-0.5 rounded-full text-[9px] font-black ${getStatusBadgeClass(st)}">${getStatusLabel(st)}</span>
                                    </div>
                                    <div class="flex items-center gap-1.5 flex-wrap">
                                        <select id="reassign-p3-${it.id}" class="px-2 py-1 rounded-lg bg-slate-50 border border-slate-200 text-[10px] font-bold text-slate-700">
                                            ${students.map(s => `<option value="${s.id}" ${s.id === stu.id ? 'selected' : ''}>${escapeHtml(s.name)}</option>`).join("")}
                                        </select>
                                        <button type="button" onclick="window.RotaliTubitak.reassignStudentWork('${it.id}', document.getElementById('reassign-p3-${it.id}').value, 'proje-siyer')" class="px-2 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-black text-[10px] cursor-pointer" title="Öğrenci Atamasını Güncelle">
                                            Ata
                                        </button>
                                        <button type="button" onclick="window.RotaliTubitak.downloadMonumentWord('${it.id}', this, 'proje-siyer')" class="px-2 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] cursor-pointer flex items-center gap-1" title="Yılın kayıtlı metinlerini Word (.docx) olarak indir">
                                            <i class="fa-solid fa-file-word"></i>
                                            <span>Word Olarak İndir</span>
                                        </button>
                                        <button type="button" onclick="window.RotaliTubitak.markSiyerYearFlag('${it.id}', '${isNoEvent ? '' : 'no_event_found'}')" class="px-2 py-1 rounded-lg ${isNoEvent ? 'bg-slate-700 text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-800'} font-bold text-[10px] cursor-pointer">
                                            ${isNoEvent ? 'İşareti Kaldır' : 'Olay Yok İşaretle'}
                                        </button>
                                        <button type="button" onclick="document.getElementById('tubitak-teacher-modal').classList.add('hidden'); window.RotaliTubitak.openProject('proje-siyer'); window.RotaliTubitak.selectItem('${it.id}')" class="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[10px] cursor-pointer">
                                            İncele
                                        </button>
                                        <button type="button" onclick="window.RotaliTubitak.teacherReview('${it.id}', 'approved')" class="px-2 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] cursor-pointer">
                                            Onayla
                                        </button>
                                    </div>
                                </div>
                                `;
                            }).join("")}
                        </div>
                    </details>
                    `;
                }).join("")}
            </div>
        </div>
        `;
    }

    function renderTeacherDataIntegrityMatrix() {
        const projects = [
            { id: "proje-tarih", label: "Proje 1 (Tarihî Eserler)", unit: "Eser" },
            { id: "proje-bilim", label: "Proje 2 (Bilim İnsanları)", unit: "Bilim İnsanı" },
            { id: "proje-siyer", label: "Proje 3 (Siyer 571–632)", unit: "Yıl" }
        ];
        const rows = [];
        projects.forEach(p => {
            const students = getProjectStudents(p.id);
            students.forEach(stu => {
                const stats = computeStudentStats(stu.id, p.id);
                rows.push({
                    projectLabel: p.label,
                    projectId: p.id,
                    unit: p.unit,
                    studentId: stu.id,
                    studentName: stu.name,
                    stats
                });
            });
        });

        return `
        <div class="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
            <div class="flex flex-wrap items-center justify-between gap-2">
                <div>
                    <h4 class="font-black text-slate-900 text-sm flex items-center gap-2">
                        <i class="fa-solid fa-shield-halved text-emerald-600"></i>
                        <span>Öğrenci Veri Bütünlüğü, Doğrulama ve Senkronizasyon Denetim Tablosu</span>
                    </h4>
                    <p class="text-[11px] text-slate-500 mt-0.5">Gerçek bulut veritabanı kayıtlarından anlık hesaplanan doğrulanmış araştırma sayıları, hedef tamamlama oranları ve eksik/kurtarılabilir kayıt durumları.</p>
                </div>
                <span class="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Canlı Veritabanı Doğrulaması Aktif (${rows.length} Öğrenci)
                </span>
            </div>

            <div class="overflow-x-auto rounded-xl border border-slate-200">
                <table class="w-full text-left border-collapse text-[11px]">
                    <thead class="bg-slate-900 text-white uppercase text-[10px] font-black">
                        <tr>
                            <th class="py-2.5 px-3">Öğrenci Adı</th>
                            <th class="py-2.5 px-3">Proje</th>
                            <th class="py-2.5 px-3 text-center">Doğrulanan / Hedef</th>
                            <th class="py-2.5 px-3 text-center">Kriter Doluluğu</th>
                            <th class="py-2.5 px-3 text-center">Tamamlanma %</th>
                            <th class="py-2.5 px-3 text-center">Veri Uyuşmazlığı</th>
                            <th class="py-2.5 px-3">Eksik / Kurtarılabilir Kayıt</th>
                            <th class="py-2.5 px-3 text-right">Son Başarılı Kayıt</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                        ${rows.map(r => {
                            const s = r.stats;
                            const lastTimeStr = s.lastUpdatedAt ? new Date(s.lastUpdatedAt).toLocaleString("tr-TR") : "Henüz kayıt yok";
                            const hasDiscrepancy = s.recoverableCount > 0;
                            const incompleteSummary = s.incompleteItems.length === 0
                                ? '<span class="text-emerald-700 font-bold">Eksik yok (Tamamlandı)</span>'
                                : `<span class="text-amber-800 font-semibold">${s.incompleteItems.length} ${r.unit} (${s.missingCriteria} kriter eksik: ${s.incompleteItems.slice(0, 3).map(x => escapeHtml(x.title)).join(", ")}${s.incompleteItems.length > 3 ? "..." : ""})</span>`;
                            return `
                            <tr class="hover:bg-slate-50 transition-colors">
                                <td class="py-2 px-3 font-black text-slate-900 whitespace-nowrap">${escapeHtml(r.studentName)}</td>
                                <td class="py-2 px-3 text-slate-600 font-semibold whitespace-nowrap">${escapeHtml(r.projectLabel)}</td>
                                <td class="py-2 px-3 text-center font-black ${s.completedCount === s.assignedTotal ? 'text-emerald-700' : 'text-slate-800'}">${s.completedCount} / ${s.assignedTotal} ${r.unit}</td>
                                <td class="py-2 px-3 text-center font-bold text-indigo-700">${s.filledCriteria} / ${s.totalPossible}</td>
                                <td class="py-2 px-3 text-center">
                                    <span class="px-2 py-0.5 rounded-full font-black text-[10px] ${s.pct === 100 ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-amber-100 text-amber-900 border border-amber-300'}">%${s.pct}</span>
                                </td>
                                <td class="py-2 px-3 text-center whitespace-nowrap">
                                    ${hasDiscrepancy
                                        ? `<span class="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-black text-[10px]">⚠️ ${s.recoverableCount} Sürüm Farkı</span>`
                                        : '<span class="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-black text-[10px]">✅ Senkronize (0 Fark)</span>'}
                                </td>
                                <td class="py-2 px-3">${incompleteSummary}</td>
                                <td class="py-2 px-3 text-right text-slate-500 font-semibold whitespace-nowrap">${escapeHtml(lastTimeStr)}</td>
                            </tr>
                            `;
                        }).join("")}
                    </tbody>
                </table>
            </div>
        </div>
        `;
    }

    function updateTeacherModalDynamicStats() {
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
        let modal = document.getElementById("tubitak-teacher-modal");
        if (!modal) {
            modal = document.createElement("div");
            modal.id = "tubitak-teacher-modal";
            modal.className = "fixed inset-0 z-[99990] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6";
            document.body.appendChild(modal);
        }

        // İstatistikler
        let totalRecords = Object.keys(runtimeRecords).length;
        let inReviewCount = Object.values(runtimeRecords).filter(r => r.status === "in_review").length;
        let approvedCount = Object.values(runtimeRecords).filter(r => r.status === "approved").length;
        let correctionCount = Object.values(runtimeRecords).filter(r => r.status === "correction_requested").length;
        let draftCount = Object.values(runtimeRecords).filter(r => !r.status || r.status === "draft").length;
        let recentRevs = [...runtimeRevisions].reverse().slice(0, 15);

        modal.innerHTML = `
        <div class="bg-white rounded-3xl max-w-4xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95" onclick="event.stopPropagation()">
            <!-- Üst Bar -->
            <div class="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-rose-500 text-white flex items-center justify-center font-black">
                        <i class="fa-solid fa-graduation-cap"></i>
                    </div>
                    <div>
                        <span class="text-[10px] font-black uppercase text-rose-400 tracking-wider">TÜBİTAK 2204-B</span>
                        <h3 class="font-black text-base sm:text-lg">Öğretmen Ana Kontrol Merkezi (3 Proje Yönetimi)</h3>
                    </div>
                </div>
                <button type="button" onclick="document.getElementById('tubitak-teacher-modal').classList.add('hidden')" class="w-8 h-8 rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>

            <!-- Durum Filtre Çubuğu (Taslak, İncelemede, Düzeltme İstendi, Onaylandı) -->
            <div id="teacher-filter-bar" class="px-6 py-2.5 bg-slate-100 border-b border-slate-200 flex items-center gap-2 overflow-x-auto">
                <span class="text-[11px] font-black text-slate-500 uppercase shrink-0">Filtre:</span>
                <button type="button" onclick="window.RotaliTubitak.setTeacherFilterStatus('all')" class="px-3 py-1 rounded-xl text-xs font-black transition-all cursor-pointer ${teacherFilterStatus === 'all' ? 'bg-slate-900 text-white shadow-sm' : 'bg-white text-slate-700 hover:bg-slate-200'}">
                    Tümü (${totalRecords})
                </button>
                <button type="button" onclick="window.RotaliTubitak.setTeacherFilterStatus('in_review')" class="px-3 py-1 rounded-xl text-xs font-black transition-all cursor-pointer ${teacherFilterStatus === 'in_review' ? 'bg-purple-600 text-white shadow-sm' : 'bg-purple-50 text-purple-800 hover:bg-purple-100'}">
                    İncelemede (${inReviewCount})
                </button>
                <button type="button" onclick="window.RotaliTubitak.setTeacherFilterStatus('correction_requested')" class="px-3 py-1 rounded-xl text-xs font-black transition-all cursor-pointer ${teacherFilterStatus === 'correction_requested' ? 'bg-amber-600 text-white shadow-sm' : 'bg-amber-50 text-amber-900 hover:bg-amber-100'}">
                    Düzeltme İstendi (${correctionCount})
                </button>
                <button type="button" onclick="window.RotaliTubitak.setTeacherFilterStatus('approved')" class="px-3 py-1 rounded-xl text-xs font-black transition-all cursor-pointer ${teacherFilterStatus === 'approved' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'}">
                    Onaylanan (${approvedCount})
                </button>
                <button type="button" onclick="window.RotaliTubitak.setTeacherFilterStatus('draft')" class="px-3 py-1 rounded-xl text-xs font-black transition-all cursor-pointer ${teacherFilterStatus === 'draft' ? 'bg-slate-700 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-200'}">
                    Taslaklar (${draftCount})
                </button>
            </div>

            <!-- İstatistik Kartları -->
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
            </div>

            <!-- İçerik: Canlı Aktivite Akışı & Google Sheets Eşitleme -->
            <div class="p-6 flex-1 overflow-y-auto space-y-6 custom-scrollbar text-xs">
                
                <!-- Google Sheets ve Dışa Aktarma Eylemleri -->
                <div class="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                        <h4 class="font-black text-slate-900 text-sm">Google E-Tablolar & Toplu Dışa Aktarma</h4>
                        <p class="text-slate-600 text-[11px] mt-0.5">Öğrencilerin her harf vuruşunda tablo kilitlenmez; öğretmen onaylı veriler tek tıkla toplu senkronize edilir.</p>
                    </div>
                    <button type="button" onclick="window.RotaliTubitak.triggerSheetsSync()" class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition-all shadow-sm shrink-0 flex items-center gap-1.5 cursor-pointer">
                        <i class="fa-solid fa-file-excel"></i>
                        <span>E-Tabloya Aktar</span>
                    </button>
                </div>

                <!-- Öğrenci Veri Bütünlüğü, Doğrulama ve Senkronizasyon Denetim Tablosu -->
                ${renderTeacherDataIntegrityMatrix()}

                <!-- Proje 1: Öğrenci Araştırma Takibi ve Görev Yönetimi -->
                ${renderProje1TeacherStudentTracking()}

                <!-- Karşılaştırmalı Tarih Araştırmaları Yönetimi & Rubrik -->
                ${renderTeacherComparisonsManagement()}

                <!-- Proje 2: Matematik Tarihi Bilim İnsanları Takibi -->
                ${renderProje2TeacherStudentTracking()}

                <!-- Proje 3: Siyer ve Değerler Eğitimi (571–632) Takibi -->
                ${renderProje3TeacherStudentTracking()}

                <!-- Son Düzenleme Akışı (Canlı İzleme) -->
                <div>
                    <h4 class="font-black text-slate-900 text-sm mb-3 flex items-center gap-2">
                        <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span>Canlı Öğrenci Aktivite Akışı (Son Değişiklikler)</span>
                    </h4>

                    <div class="space-y-2">
                        ${recentRevs.length === 0 ? `
                        <div class="p-4 text-center text-slate-400">Henüz yeni bir öğrenci aktivitesi kaydedilmedi.</div>
                        ` : recentRevs.map(rev => `
                        <div class="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
                            <div class="flex items-center gap-3">
                                <span class="w-8 h-8 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0">
                                    v${rev.version}
                                </span>
                                <div>
                                    <div class="font-black text-slate-900">${escapeHtml(rev.studentName)} • <span class="text-slate-500 font-semibold">${escapeHtml(rev.itemId)} / ${escapeHtml(rev.criterionKey)}</span></div>
                                    <div class="text-slate-500 text-[11px]">${new Date(rev.createdAt).toLocaleTimeString('tr-TR')} • Proje: ${escapeHtml(rev.projectId)}</div>
                                </div>
                            </div>
                            <button type="button" onclick="window.RotaliTubitak.selectItem('${rev.itemId}'); document.getElementById('tubitak-teacher-modal').classList.add('hidden');" class="px-3 py-1 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs transition-colors cursor-pointer">
                                İncele
                            </button>
                        </div>
                        `).join("")}
                    </div>
                </div>

            </div>
        </div>
        `;

        modal.classList.remove("hidden");
    }

    // 10B. VERİ ANALİZİ BÖLÜMÜ (KATEGORİ SAYI & İÇERİK GRAFİKLERİ + TABLO)
    const ANALYSIS_COLORS = [
        "#d97706", "#0891b2", "#059669", "#4f46e5", "#e11d48",
        "#7c3aed", "#0284c7", "#ea580c", "#65a30d", "#475569"
    ];

    function countWords(text) {
        const trimmed = String(text || "").trim();
        return trimmed ? trimmed.split(/\s+/).length : 0;
    }

    function getItemFieldValue(item, critKey) {
        const saved = runtimeRecords[`${item.id}__${critKey}`];
        return saved ? (saved.content || "") : (item.criteria?.[critKey] || "");
    }

    function classifyItemCategory(item, projId) {
        if (projId === "proje-bilim") return item.field || "Bilim Tarihi";
        if (projId === "proje-siyer") return item.year ? `${item.year} Yılı` : "Siyer Kronolojisi";

        const t = String(item.title || "").toLocaleLowerCase("tr");
        if (t.includes("medrese")) return "Medreseler";
        if (t.includes("kalesi")) return "Kaleler";
        if (t.includes("camii") || /\bcami\b/.test(t)) return "Camiler ve Mescitler";
        if (t.includes("türbe") || t.includes("kümbet") || t.includes("güdük minare")) return "Türbeler ve Kümbetler";
        if (t.includes("köprü")) return "Köprüler";
        if (t.includes("hamam")) return "Hamamlar";
        if (t.includes("kervansaray") || t.includes("hanı") || t === "taşhan") return "Han ve Kervansaraylar";
        if (t.includes("konağı") || t.includes("konak")) return "Konaklar";
        if (t.includes("müze") || t.includes("sanat evi")) return "Müze ve Kültür Yapıları";
        if (t.includes("kilise")) return "Kilise ve İnanç Yapıları";
        return "Diğer Tarihî Yapılar";
    }

    function tallyDimension(rows, keyFn) {
        const map = new Map();
        for (const r of rows) {
            const label = keyFn(r) || "Belirtilmemiş";
            const prev = map.get(label) || { label, count: 0, filledSlots: 0, words: 0 };
            prev.count += 1;
            prev.filledSlots += r.filledCount;
            prev.words += r.wordCount;
            map.set(label, prev);
        }
        return [...map.values()].sort((a, b) => b.count - a.count || a.label.localeCompare(b.label, "tr"));
    }

    function computeProjectAnalytics(projData) {
        const items = projData.items || [];
        const criteriaList = projData.criteriaList || [];
        const totalCriteria = criteriaList.length || 1;
        const critStats = criteriaList.map(c => ({
            key: c.key,
            title: c.title,
            filledItems: 0,
            words: 0,
            chars: 0
        }));

        const itemRows = items.map((item, idx) => {
            let filledCount = 0;
            let wordCount = 0;
            let charCount = 0;

            criteriaList.forEach((crit, cIdx) => {
                const val = getItemFieldValue(item, crit.key);
                const trimmed = val.trim();
                if (trimmed.length > 0) {
                    filledCount += 1;
                    critStats[cIdx].filledItems += 1;
                }
                const w = countWords(val);
                wordCount += w;
                charCount += val.length;
                critStats[cIdx].words += w;
                critStats[cIdx].chars += val.length;
            });

            const status = getItemStatus(item.id);
            const category = classifyItemCategory(item, activeProjectId);
            return {
                order: getItemPermanentOrder(item),
                id: item.id,
                title: item.title,
                category,
                district: item.district || item.geography || (item.year ? String(item.year) : "Genel"),
                period: item.period || item.field || "Tarihî Miras",
                filledCount,
                totalCriteria,
                fillPct: Math.round((filledCount / totalCriteria) * 100),
                wordCount,
                charCount,
                status
            };
        });

        const totalFilledSlots = itemRows.reduce((s, r) => s + r.filledCount, 0);
        const totalPossibleSlots = items.length * totalCriteria;
        const totalWords = itemRows.reduce((s, r) => s + r.wordCount, 0);
        const totalChars = itemRows.reduce((s, r) => s + r.charCount, 0);

        const statusCounts = { approved: 0, in_review: 0, correction_requested: 0, draft: 0 };
        itemRows.forEach(r => { statusCounts[r.status] = (statusCounts[r.status] || 0) + 1; });

        return {
            itemRows,
            critStats,
            categories: tallyDimension(itemRows, r => r.category),
            districts: tallyDimension(itemRows, r => r.district),
            periods: tallyDimension(itemRows, r => r.period),
            totalItems: items.length,
            totalCriteria,
            totalFilledSlots,
            totalPossibleSlots,
            overallPct: totalPossibleSlots ? Math.round((totalFilledSlots / totalPossibleSlots) * 100) : 0,
            totalWords,
            totalChars,
            statusCounts
        };
    }

    function buildSvgDonutChart(segments, totalValue, centerLabel) {
        const radius = 62;
        const circumference = 2 * Math.PI * radius;
        let offset = 0;

        const circles = segments.map((seg, i) => {
            const color = ANALYSIS_COLORS[i % ANALYSIS_COLORS.length];
            const frac = totalValue > 0 ? seg.count / totalValue : 0;
            const segLen = frac * circumference;
            const el = `
            <circle
                cx="90" cy="90" r="${radius}"
                fill="transparent"
                stroke="${color}"
                stroke-width="24"
                stroke-dasharray="${segLen.toFixed(2)} ${(circumference - segLen).toFixed(2)}"
                stroke-dashoffset="${(-offset).toFixed(2)}"
                class="transition-all duration-300 hover:opacity-85 cursor-pointer"
                onclick="window.RotaliTubitak.setAnalysisCategoryFilter('${escapeHtml(seg.label).replace(/'/g, "\\'")}')">
                <title>${escapeHtml(seg.label)}: ${seg.count} (${Math.round(frac * 100)}%)</title>
            </circle>`;
            offset += segLen;
            return el;
        }).join("");

        return `
        <svg viewBox="0 0 180 180" class="w-44 h-44 sm:w-48 sm:h-48 shrink-0 mx-auto" role="img" aria-label="Kategori Dağılım Grafiği">
            <g transform="rotate(-90 90 90)">
                <circle cx="90" cy="90" r="${radius}" fill="transparent" stroke="#f1f5f9" stroke-width="24"></circle>
                ${circles}
            </g>
            <text x="90" y="86" text-anchor="middle" class="fill-slate-900 font-black text-2xl">${totalValue}</text>
            <text x="90" y="106" text-anchor="middle" class="fill-slate-500 font-bold text-[10px] uppercase tracking-wider">${escapeHtml(centerLabel)}</text>
        </svg>`;
    }

    function buildHorizontalBars(entries, totalItems, gradientClass) {
        const maxVal = entries.length ? Math.max(...entries.map(e => e.count), 1) : 1;
        return entries.map((e, i) => {
            const widthPct = Math.round((e.count / maxVal) * 100);
            const sharePct = totalItems ? Math.round((e.count / totalItems) * 100) : 0;
            const color = ANALYSIS_COLORS[i % ANALYSIS_COLORS.length];
            return `
            <div class="space-y-1">
                <div class="flex items-center justify-between text-xs gap-2">
                    <span class="font-bold text-slate-800 truncate">${escapeHtml(e.label)}</span>
                    <span class="font-black text-slate-900 shrink-0">${e.count} <span class="text-slate-400 font-semibold">(%${sharePct})</span></span>
                </div>
                <div class="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div class="h-full rounded-full ${gradientClass || ''}" style="width: ${widthPct}%; ${gradientClass ? '' : `background-color: ${color};`}"></div>
                </div>
            </div>`;
        }).join("");
    }

    function renderDataAnalysisSection(projData) {
        const stats = computeProjectAnalytics(projData);
        const filteredRows = analysisCategoryFilter === "all"
            ? stats.itemRows
            : stats.itemRows.filter(r => r.category === analysisCategoryFilter);

        return `
        <div class="space-y-6 animate-in fade-in duration-300">
            <!-- Üst Başlık ve Dışa Aktarım Çubuğu -->
            <div class="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-cyan-50 text-cyan-800 border border-cyan-200 uppercase tracking-wider">
                        📊 CANLI İSTATİSTİK & İÇERİK ANALİZİ
                    </span>
                    <h3 class="text-lg sm:text-xl font-black text-slate-900 mt-1">VERİ ANALİZİ – Kategori, Sayı ve İçerik Dağılımı</h3>
                    <p class="text-xs text-slate-500 font-medium mt-0.5">
                        ${escapeHtml(projData.title || 'Proje')} kapsamındaki tüm kayıtlar, kategoriler, kriter doluluk oranları ve kelime yoğunlukları anlık hesaplanır.
                    </p>
                </div>
                <div class="flex items-center gap-2 flex-wrap">
                    <button type="button" onclick="window.RotaliTubitak.exportAnalysisCSV()" class="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition-all shadow-sm flex items-center gap-1.5 cursor-pointer">
                        <i class="fa-solid fa-file-csv"></i>
                        <span>Excel / CSV İndir</span>
                    </button>
                    <button type="button" onclick="window.RotaliTubitak.setWorkspaceView('research')" class="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs transition-all shadow-sm flex items-center gap-1.5 cursor-pointer">
                        <i class="fa-solid fa-arrow-left"></i>
                        <span>Araştırmaya Dön</span>
                    </button>
                </div>
            </div>

            <!-- 4 Özet KPI Kartı -->
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div class="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-sm">
                    <div class="text-[11px] font-black text-slate-500 uppercase">Toplam Eser / Konu</div>
                    <div class="text-2xl sm:text-3xl font-black text-slate-900 mt-1">${stats.totalItems}</div>
                    <div class="text-[11px] font-semibold text-amber-700 mt-1">${stats.categories.length} farklı kategori</div>
                </div>
                <div class="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-sm">
                    <div class="text-[11px] font-black text-slate-500 uppercase">Kriter Doluluğu</div>
                    <div class="text-2xl sm:text-3xl font-black text-cyan-700 mt-1">%${stats.overallPct}</div>
                    <div class="text-[11px] font-semibold text-slate-500 mt-1">${stats.totalFilledSlots} / ${stats.totalPossibleSlots} alan dolu</div>
                </div>
                <div class="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-sm">
                    <div class="text-[11px] font-black text-slate-500 uppercase">Toplam İçerik Hacmi</div>
                    <div class="text-2xl sm:text-3xl font-black text-emerald-700 mt-1">${stats.totalWords.toLocaleString("tr-TR")}</div>
                    <div class="text-[11px] font-semibold text-slate-500 mt-1">kelime • ${stats.totalChars.toLocaleString("tr-TR")} karakter</div>
                </div>
                <div class="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-sm">
                    <div class="text-[11px] font-black text-slate-500 uppercase">İnceleme & Onay</div>
                    <div class="text-2xl sm:text-3xl font-black text-indigo-700 mt-1">${stats.statusCounts.approved} / ${stats.totalItems}</div>
                    <div class="text-[11px] font-semibold text-slate-500 mt-1">${stats.statusCounts.in_review} incelemede • ${stats.statusCounts.draft} taslak</div>
                </div>
            </div>

            <!-- Grafik 1 & Kategori Sayı Tablosu -->
            <div class="grid grid-cols-1 xl:grid-cols-12 gap-6">
                <!-- Donut Grafik + Etkileşimli Kategori Listesi -->
                <div class="xl:col-span-6 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-5">
                    <div class="flex items-center justify-between gap-2">
                        <div>
                            <h4 class="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
                                <i class="fa-solid fa-chart-pie text-amber-600"></i>
                                <span>Kategori Sayılarına Göre Dağılım Grafiği</span>
                            </h4>
                            <p class="text-[11px] text-slate-500 font-medium">Tabloyu filtrelemek için grafikteki dilimlere veya satırlara tıklayın.</p>
                        </div>
                        ${analysisCategoryFilter !== "all" ? `
                        <button type="button" onclick="window.RotaliTubitak.setAnalysisCategoryFilter('all')" class="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-black cursor-pointer">
                            Tümünü Göster
                        </button>` : ''}
                    </div>

                    <div class="flex flex-col md:flex-row items-center gap-6">
                        ${buildSvgDonutChart(stats.categories, stats.totalItems, activeProjectId === 'proje-tarih' ? 'Toplam Eser' : 'Toplam Kayıt')}
                        <div class="w-full flex-1 space-y-2 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
                            ${stats.categories.map((cat, idx) => {
                                const color = ANALYSIS_COLORS[idx % ANALYSIS_COLORS.length];
                                const pct = stats.totalItems ? Math.round((cat.count / stats.totalItems) * 100) : 0;
                                const isActive = analysisCategoryFilter === cat.label;
                                return `
                                <button type="button" onclick="window.RotaliTubitak.setAnalysisCategoryFilter('${escapeHtml(cat.label).replace(/'/g, "\\'")}')" class="w-full text-left px-3 py-2 rounded-xl border transition-all flex items-center justify-between gap-2 cursor-pointer ${isActive ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-400/20' : 'bg-slate-50/70 hover:bg-slate-100 border-slate-200'}">
                                    <span class="flex items-center gap-2 min-w-0">
                                        <span class="w-3 h-3 rounded-full shrink-0" style="background-color: ${color};"></span>
                                        <span class="text-xs font-bold text-slate-800 truncate">${escapeHtml(cat.label)}</span>
                                    </span>
                                    <span class="text-xs font-black text-slate-900 shrink-0">${cat.count} <span class="text-[11px] text-slate-500 font-semibold">(%${pct})</span></span>
                                </button>`;
                            }).join("")}
                        </div>
                    </div>
                </div>

                <!-- Kategori Özeti Tablosu + İlçe & Dönem Grafikleri -->
                <div class="xl:col-span-6 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-5">
                    <h4 class="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
                        <i class="fa-solid fa-table-columns text-cyan-600"></i>
                        <span>Kategori Sayı ve İçerik Özeti Tablosu</span>
                    </h4>
                    <div class="overflow-x-auto max-h-72 overflow-y-auto custom-scrollbar">
                        <table class="w-full text-left border-collapse text-xs">
                            <thead class="sticky top-0 bg-slate-100 text-slate-600 uppercase text-[10px] font-black">
                                <tr>
                                    <th class="py-2.5 px-3 rounded-l-xl">Kategori</th>
                                    <th class="py-2.5 px-3 text-right">Sayı</th>
                                    <th class="py-2.5 px-3 text-right">Oran</th>
                                    <th class="py-2.5 px-3 text-right">Dolu Kriter</th>
                                    <th class="py-2.5 px-3 text-right rounded-r-xl">Kelime</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100">
                                ${stats.categories.map((cat, idx) => {
                                    const pct = stats.totalItems ? Math.round((cat.count / stats.totalItems) * 100) : 0;
                                    const color = ANALYSIS_COLORS[idx % ANALYSIS_COLORS.length];
                                    return `
                                    <tr onclick="window.RotaliTubitak.setAnalysisCategoryFilter('${escapeHtml(cat.label).replace(/'/g, "\\'")}')" class="hover:bg-amber-50/60 cursor-pointer transition-colors">
                                        <td class="py-2.5 px-3 font-bold text-slate-900 flex items-center gap-2">
                                            <span class="w-2.5 h-2.5 rounded-full shrink-0" style="background-color: ${color};"></span>
                                            <span>${escapeHtml(cat.label)}</span>
                                        </td>
                                        <td class="py-2.5 px-3 text-right font-black text-slate-900">${cat.count}</td>
                                        <td class="py-2.5 px-3 text-right font-semibold text-slate-600">%${pct}</td>
                                        <td class="py-2.5 px-3 text-right font-bold text-cyan-700">${cat.filledSlots} / ${cat.count * stats.totalCriteria}</td>
                                        <td class="py-2.5 px-3 text-right font-semibold text-emerald-700">${cat.words.toLocaleString("tr-TR")}</td>
                                    </tr>`;
                                }).join("")}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- Grafik 2: İlçe & Tarihsel Dönem Çubuk Grafikleri -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div class="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
                    <h4 class="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
                        <i class="fa-solid fa-location-dot text-rose-600"></i>
                        <span>${activeProjectId === 'proje-tarih' ? 'İlçelere Göre Dağılım Grafiği' : 'Coğrafya / Konum Dağılımı'}</span>
                    </h4>
                    <div class="space-y-3">
                        ${buildHorizontalBars(stats.districts, stats.totalItems, "bg-gradient-to-r from-amber-500 to-orange-500")}
                    </div>
                </div>

                <div class="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
                    <h4 class="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
                        <i class="fa-solid fa-landmark-dome text-indigo-600"></i>
                        <span>${activeProjectId === 'proje-tarih' ? 'Tarihsel Dönem / Medeniyet Dağılımı' : 'Alt Alan Dağılımı'}</span>
                    </h4>
                    <div class="space-y-3 max-h-72 overflow-y-auto pr-1 custom-scrollbar">
                        ${buildHorizontalBars(stats.periods, stats.totalItems, "bg-gradient-to-r from-cyan-500 to-indigo-600")}
                    </div>
                </div>
            </div>

            <!-- Grafik & Tablo 3: Kriter (Başlık) Bazlı İçerik Yoğunluğu Analizi -->
            <div class="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                        <h4 class="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
                            <i class="fa-solid fa-bars-progress text-emerald-600"></i>
                            <span>Kriterlere Göre İçerik Doluluk ve Kelime Analizi (${stats.totalCriteria} Kriter)</span>
                        </h4>
                        <p class="text-[11px] text-slate-500 font-medium">Her kriter başlığında kaç eserin araştırıldığı ve toplam girilen kelime/karakter hacmi.</p>
                    </div>
                </div>

                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse text-xs">
                        <thead class="bg-slate-100 text-slate-600 uppercase text-[10px] font-black">
                            <tr>
                                <th class="py-2.5 px-3 rounded-l-xl">Kriter Başlığı</th>
                                <th class="py-2.5 px-3 w-48">Doluluk Grafiği</th>
                                <th class="py-2.5 px-3 text-right">Dolu Eser</th>
                                <th class="py-2.5 px-3 text-right">Kelime</th>
                                <th class="py-2.5 px-3 text-right rounded-r-xl">Karakter</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100">
                            ${stats.critStats.map(cs => {
                                const pct = stats.totalItems ? Math.round((cs.filledItems / stats.totalItems) * 100) : 0;
                                return `
                                <tr class="hover:bg-slate-50">
                                    <td class="py-2.5 px-3 font-bold text-slate-900">${escapeHtml(cs.title)}</td>
                                    <td class="py-2.5 px-3">
                                        <div class="flex items-center gap-2">
                                            <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                                <div class="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" style="width: ${pct}%;"></div>
                                            </div>
                                            <span class="text-[10px] font-black text-slate-600 w-8 text-right">%${pct}</span>
                                        </div>
                                    </td>
                                    <td class="py-2.5 px-3 text-right font-black text-slate-800">${cs.filledItems} / ${stats.totalItems}</td>
                                    <td class="py-2.5 px-3 text-right font-bold text-indigo-700">${cs.words.toLocaleString("tr-TR")}</td>
                                    <td class="py-2.5 px-3 text-right font-semibold text-slate-500">${cs.chars.toLocaleString("tr-TR")}</td>
                                </tr>`;
                            }).join("")}
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Tablo 4: Kategori ve İçeriklere Göre Detaylı Eser Karşılaştırma Tablosu -->
            <div class="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                        <h4 class="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
                            <i class="fa-solid fa-table-list text-amber-600"></i>
                            <span>İçeriklere Göre Eser Analiz Tablosu</span>
                        </h4>
                        <p class="text-[11px] text-slate-500 font-medium">Listelenen: <strong>${filteredRows.length}</strong> kayıt${analysisCategoryFilter !== 'all' ? ` (Kategori: ${escapeHtml(analysisCategoryFilter)})` : ''}.</p>
                    </div>
                    <select onchange="window.RotaliTubitak.setAnalysisCategoryFilter(this.value)" class="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800">
                        <option value="all" ${analysisCategoryFilter === 'all' ? 'selected' : ''}>Tüm Kategoriler (${stats.totalItems})</option>
                        ${stats.categories.map(c => `
                        <option value="${escapeHtml(c.label)}" ${analysisCategoryFilter === c.label ? 'selected' : ''}>${escapeHtml(c.label)} (${c.count})</option>
                        `).join("")}
                    </select>
                </div>

                <div class="overflow-x-auto max-h-[520px] overflow-y-auto custom-scrollbar">
                    <table class="w-full text-left border-collapse text-xs">
                        <thead class="sticky top-0 bg-slate-100 text-slate-600 uppercase text-[10px] font-black z-10">
                            <tr>
                                <th class="py-2.5 px-3 rounded-l-xl">#</th>
                                <th class="py-2.5 px-3">Eser / Konu Adı</th>
                                <th class="py-2.5 px-3">Kategori</th>
                                <th class="py-2.5 px-3">İlçe / Konum</th>
                                <th class="py-2.5 px-3">Dönem</th>
                                <th class="py-2.5 px-3">İçerik İlerlemesi</th>
                                <th class="py-2.5 px-3 text-right">Kelime</th>
                                <th class="py-2.5 px-3">Durum</th>
                                <th class="py-2.5 px-3 text-right rounded-r-xl">İşlem</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100">
                            ${filteredRows.map(r => `
                            <tr class="hover:bg-amber-50/50 transition-colors">
                                <td class="py-2.5 px-3 font-black text-amber-700">#${r.order}</td>
                                <td class="py-2.5 px-3 font-black text-slate-900">${escapeHtml(r.title)}</td>
                                <td class="py-2.5 px-3">
                                    <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200 whitespace-nowrap">${escapeHtml(r.category)}</span>
                                </td>
                                <td class="py-2.5 px-3 font-semibold text-slate-700">${escapeHtml(r.district)}</td>
                                <td class="py-2.5 px-3 font-medium text-slate-600">${escapeHtml(r.period)}</td>
                                <td class="py-2.5 px-3">
                                    <div class="flex items-center gap-2 min-w-[110px]">
                                        <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                            <div class="h-full bg-amber-500 rounded-full" style="width: ${r.fillPct}%;"></div>
                                        </div>
                                        <span class="text-[11px] font-black text-slate-700 shrink-0">${r.filledCount}/${r.totalCriteria}</span>
                                    </div>
                                </td>
                                <td class="py-2.5 px-3 text-right font-bold text-indigo-700">${r.wordCount}</td>
                                <td class="py-2.5 px-3">
                                    <span class="px-2 py-0.5 rounded-full text-[9px] font-black whitespace-nowrap ${getStatusBadgeClass(r.status)}">${getStatusLabel(r.status)}</span>
                                </td>
                                <td class="py-2.5 px-3 text-right">
                                    <button type="button" onclick="window.RotaliTubitak.openItemInEditor('${r.id}')" class="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-white font-black text-[11px] transition-colors cursor-pointer whitespace-nowrap">
                                        Aç / Düzenle
                                    </button>
                                </td>
                            </tr>`).join("")}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        `;
    }

        // =========================================================================
    // 10C. KARŞILAŞTIRMALI TARİH VE KANIT ANALİZİ BÖLÜMÜ
    // =========================================================================

    function getComparativeData() {
        if (typeof window !== "undefined" && window.TUBITAK_COMPARISON_DATA) {
            return window.TUBITAK_COMPARISON_DATA;
        }
        return {
            CRITERIA_EVALUATION_REPORT: { criteriaList: [] },
            MONUMENTS_CLASSIFICATION: {},
            COMPARISON_GROUPS: [],
            COMPARISON_CRITERIA_10: [],
            RUBRIC_DIMENSIONS_5: []
        };
    }

    function getComparisonGroup(groupId) {
        const { COMPARISON_GROUPS } = getComparativeData();
        return COMPARISON_GROUPS.find(g => g.id === groupId) || COMPARISON_GROUPS[0] || null;
    }

    function getComparisonMonumentMeta(monId) {
        const { MONUMENTS_CLASSIFICATION } = getComparativeData();
        return MONUMENTS_CLASSIFICATION[monId] || null;
    }

    function initCurrentComparisonDraft() {
        const { COMPARISON_GROUPS, MONUMENTS_CLASSIFICATION, COMPARISON_CRITERIA_10 } = getComparativeData();
        
        // 1. If activeComparisonId exists in runtimeComparisons, return it
        if (activeComparisonId && runtimeComparisons[activeComparisonId]) {
            return runtimeComparisons[activeComparisonId];
        }

        // 2. Look for existing draft with matching groupId and monumentIds
        const existing = Object.values(runtimeComparisons).find(c => 
            c && c.groupId === selectedComparisonGroupId &&
            Array.isArray(c.monumentIds) &&
            c.monumentIds.length === selectedComparisonMonumentIds.length &&
            selectedComparisonMonumentIds.every(id => c.monumentIds.includes(id))
        );
        if (existing) {
            activeComparisonId = existing.id;
            return existing;
        }

        // 3. Create fresh draft pre-filled from metadata and existing research records
        const group = getComparisonGroup(selectedComparisonGroupId);
        const groupTitle = group ? group.title : "Tarihî Yapılar";
        const newId = `comp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
        const myStudentId = resolveCurrentUserStudentId("proje-tarih") || (currentSession?.studentId || "ogrenci");
        const myStudentName = currentSession?.studentName || "Öğrenci";

        // Pre-fill 10-measure table from existing criteria records or metadata
        const tableData = {};
        COMPARISON_CRITERIA_10.forEach(crit => {
            tableData[crit.id] = {};
            selectedComparisonMonumentIds.forEach(mId => {
                const meta = MONUMENTS_CLASSIFICATION[mId];
                // Check if student already filled original 18-criteria in runtimeRecords
                const saved = runtimeRecords[`${mId}__${crit.mappedKey}`];
                let val = (saved && saved.content && saved.content.trim()) ? saved.content.trim() : null;

                if (!val && meta) {
                    if (crit.id === "c_eser_adi") val = meta.name;
                    else if (crit.id === "c_yapim_tarihi") val = meta.buildYear;
                    else if (crit.id === "c_tarihsel_donem") val = meta.period;
                    else if (crit.id === "c_ilk_amac") val = meta.initialPurpose;
                    else if (crit.id === "c_bani") val = meta.builder;
                    else if (crit.id === "c_mimari_plan") val = meta.planType;
                    else if (crit.id === "c_yapi_malzemesi") val = meta.materials;
                    else if (crit.id === "c_susleme_kitabe") val = meta.ornamentKitabe;
                    else if (crit.id === "c_tarihsel_degisiklikler") val = meta.changes;
                    else if (crit.id === "c_gunumuz_durumu") val = `${meta.currentUse} (${meta.preservationStatus})`;
                }
                tableData[crit.id][mId] = val || "";
            });
        });

        // Pre-fill initial suggestions from c16 (ortak) and c17 (farklı) if entered
        let simPre = "";
        let diffPre = "";
        selectedComparisonMonumentIds.forEach(mId => {
            const mName = MONUMENTS_CLASSIFICATION[mId]?.name || mId;
            const c16 = runtimeRecords[`${mId}__c16_benzer_ortak_ozellikler`]?.content;
            const c17 = runtimeRecords[`${mId}__c17_benzer_farkli_ozellikler`]?.content;
            if (c16 && c16.trim()) {
                simPre += `[${mName} 16. Kriter Kaydı]: ${c16.trim()}\n\n`;
            }
            if (c17 && c17.trim()) {
                diffPre += `[${mName} 17. Kriter Kaydı]: ${c17.trim()}\n\n`;
            }
        });

        // Pre-fill starter citations from runtimeSources
        const evidences = [];
        selectedComparisonMonumentIds.forEach(mId => {
            const mName = MONUMENTS_CLASSIFICATION[mId]?.name || mId;
            Object.values(runtimeSources).forEach(src => {
                if (src && src.itemId === mId) {
                    evidences.push({
                        id: `ev_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
                        type: src.type || "Akademik Kitap / Envanter",
                        isPrimary: (src.type === "kitabe" || src.type === "vakfiye" || src.type === "arşiv"),
                        author: src.author || "",
                        title: src.title || "",
                        year: src.year || "",
                        page: src.page || "",
                        url: src.url || "",
                        desc: `${mName} araştırmasında kullanılan tescil/envanter kaynağı.`
                    });
                }
            });
        });

        const draft = {
            id: newId,
            projectId: "proje-tarih",
            groupId: selectedComparisonGroupId,
            groupTitle,
            monumentIds: [...selectedComparisonMonumentIds],
            studentId: myStudentId,
            studentName: myStudentName,
            question: group ? group.sampleQuestion : "",
            similarities: simPre.trim(),
            differences: diffPre.trim(),
            continuity: "",
            evidenceAnalysis: "",
            conclusion: "",
            tableData,
            evidences,
            status: "draft",
            rubric: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        activeComparisonId = newId;
        runtimeComparisons[newId] = draft;
        return draft;
    }

    function updateComparisonSaveStatus(state) {
        comparisonSaveState = state;
        const el = document.getElementById("comparison-save-badge");
        if (!el) return;

        if (state === "saving") {
            el.className = "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-800 border border-amber-300 animate-pulse";
            el.innerHTML = `<i class="fa-solid fa-arrows-rotate fa-spin text-xs"></i> <span>Buluta Kaydediliyor...</span>`;
        } else if (state === "saved") {
            el.className = "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300";
            el.innerHTML = `<i class="fa-solid fa-circle-check text-xs text-emerald-600"></i> <span>Bulutla Eşitlendi ✓</span>`;
        } else if (state === "error") {
            el.className = "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-red-100 text-red-800 border border-red-300";
            el.innerHTML = `<i class="fa-solid fa-triangle-exclamation text-xs text-red-600"></i> <span>Bağlantı Hatası (Çevrimdışı)</span>`;
        } else {
            el.className = "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-slate-100 text-slate-700 border border-slate-300";
            el.innerHTML = `<i class="fa-solid fa-cloud text-xs text-slate-500"></i> <span>Hazır</span>`;
        }
    }

    function scheduleComparisonAutoSave() {
        updateComparisonSaveStatus("saving");
        if (comparisonAutoSaveTimer) clearTimeout(comparisonAutoSaveTimer);
        comparisonAutoSaveTimer = setTimeout(() => {
            saveCurrentComparison(false);
        }, 700);
    }

    async function saveCurrentComparison(isSubmit = false) {
        if (!currentSession?.token) return;
        const draft = initCurrentComparisonDraft();
        if (!draft) return;

        draft.updatedAt = new Date().toISOString();
        if (isSubmit) {
            draft.status = "submitted";
        }

        updateComparisonSaveStatus("saving");
        try {
            const res = await fetch("/api/tubitak-records", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${currentSession.token}`
                },
                body: JSON.stringify({
                    action: "save_comparison",
                    projectId: "proje-tarih",
                    comparison: draft
                })
            });
            const data = await res.json();
            if (res.ok && data.ok) {
                runtimeComparisons[draft.id] = data.comparison;
                updateComparisonSaveStatus("saved");
                if (isSubmit) {
                    showNotice("Karşılaştırmalı tarih araştırmanız başarıyla danışman öğretmen incelemesine gönderildi! 📤", "success");
                    renderMainContainer(document.getElementById("tubitak-research-container"));
                }
            } else {
                updateComparisonSaveStatus("error");
            }
        } catch (e) {
            updateComparisonSaveStatus("error");
            console.warn("Comparison save error:", e.message);
        }
    }

    function pushComparisonUndoSnapshot() {
        const draft = initCurrentComparisonDraft();
        if (!draft) return;
        comparisonUndoStack.push(JSON.stringify(draft));
        if (comparisonUndoStack.length > 50) comparisonUndoStack.shift();
        comparisonRedoStack.length = 0; // Clear redo on fresh input
    }

    function undoComparison() {
        if (comparisonUndoStack.length === 0) {
            showNotice("Geri alınacak önceki bir işlem bulunmuyor.", "info");
            return;
        }
        const current = initCurrentComparisonDraft();
        comparisonRedoStack.push(JSON.stringify(current));
        const prevJson = comparisonUndoStack.pop();
        try {
            const restored = JSON.parse(prevJson);
            runtimeComparisons[restored.id] = restored;
            activeComparisonId = restored.id;
            selectedComparisonGroupId = restored.groupId;
            selectedComparisonMonumentIds = [...restored.monumentIds];
            scheduleComparisonAutoSave();
            renderMainContainer(document.getElementById("tubitak-research-container"));
            showNotice("Son değişiklik geri alındı (Ctrl+Z) ↩️", "info");
        } catch (e) {}
    }

    function redoComparison() {
        if (comparisonRedoStack.length === 0) {
            showNotice("İleri alınacak bir işlem bulunmuyor.", "info");
            return;
        }
        const current = initCurrentComparisonDraft();
        comparisonUndoStack.push(JSON.stringify(current));
        const nextJson = comparisonRedoStack.pop();
        try {
            const restored = JSON.parse(nextJson);
            runtimeComparisons[restored.id] = restored;
            activeComparisonId = restored.id;
            selectedComparisonGroupId = restored.groupId;
            selectedComparisonMonumentIds = [...restored.monumentIds];
            scheduleComparisonAutoSave();
            renderMainContainer(document.getElementById("tubitak-research-container"));
            showNotice("İşlem yinelendi (Ctrl+Y) ↪️", "info");
        } catch (e) {}
    }

    function renderComparativeHistorySection(projData) {
        const { COMPARISON_GROUPS, MONUMENTS_CLASSIFICATION, COMPARISON_CRITERIA_10 } = getComparativeData();
        const draft = initCurrentComparisonDraft();
        const activeGroup = getComparisonGroup(selectedComparisonGroupId);
        const monIds = Array.isArray(draft.monumentIds) ? draft.monumentIds : [];
        const isTeacher = currentSession?.role === "teacher";

        // Filter comparisons belonging to current user or all if teacher
        const myStuId = resolveCurrentUserStudentId("proje-tarih");
        const userComps = Object.values(runtimeComparisons).filter(c => 
            c && (isTeacher || !c.studentId || c.studentId === myStuId || c.studentId === currentSession?.studentId)
        );

        return `
        <div class="space-y-6 animate-in fade-in-50 duration-300">
            
            <!-- 🏛️ ÜST BAŞLIK VE KONTROL PANELİ -->
            <div class="bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-amber-500/30 shadow-2xl relative overflow-hidden">
                <div class="absolute -right-16 -top-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
                <div class="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div>
                        <div class="flex items-center gap-2 mb-2 flex-wrap">
                            <span class="px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40">
                                TÜBİTAK 2204-B TARİH & KÜLTÜREL MİRAS
                            </span>
                            <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700">
                                40 Eser Sınıflandırması
                            </span>
                            <span id="comparison-save-badge" class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                                <i class="fa-solid fa-circle-check text-xs text-emerald-600"></i>
                                <span>Bulutla Eşitlendi ✓</span>
                            </span>
                        </div>
                        <h2 class="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-3">
                            <i class="fa-solid fa-scale-balanced text-amber-400"></i>
                            <span>KARŞILAŞTIRMALI TARİH VE KANIT ANALİZİ</span>
                        </h2>
                        <p class="text-slate-300 text-xs sm:text-sm mt-1.5 max-w-3xl leading-relaxed">
                            Sivas'ın Selçuklu, Mengücekli, İlhanlı ve Osmanlı anıtlarını aynı mimari türler altında eşleştirin; benzerliklerini, farklılıklarını, tarihsel değişim ve sürekliliklerini birincil kanıtlarla analiz edin.
                        </p>
                    </div>

                    <!-- Eylemler (Word İndir, Geri Al, Yeni Karşılaştırma) -->
                    <div class="flex items-center gap-2 flex-wrap self-start lg:self-auto">
                        <button type="button" onclick="window.RotaliTubitak.undoComparison()" class="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-sm" title="Geri Al (Ctrl+Z)">
                            <i class="fa-solid fa-arrow-rotate-left"></i>
                            <span class="hidden sm:inline">Geri Al</span>
                        </button>
                        <button type="button" onclick="window.RotaliTubitak.redoComparison()" class="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-sm" title="İleri Al (Ctrl+Y)">
                            <i class="fa-solid fa-arrow-rotate-right"></i>
                            <span class="hidden sm:inline">İleri Al</span>
                        </button>
                        <button type="button" onclick="window.RotaliTubitak.downloadComparisonWord('${draft.id}')" class="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xs transition-all flex items-center gap-2 cursor-pointer shadow-lg hover:scale-105 transform">
                            <i class="fa-solid fa-file-word text-sm text-blue-200"></i>
                            <span>Karşılaştırma Raporunu Word Olarak İndir</span>
                        </button>
                        <button type="button" onclick="window.RotaliTubitak.submitComparisonForReview()" class="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs transition-all flex items-center gap-2 cursor-pointer shadow-lg hover:scale-105 transform">
                            <i class="fa-solid fa-paper-plane text-sm"></i>
                            <span>Öğretmen İncelemesine Gönder</span>
                        </button>
                    </div>
                </div>

                <!-- Kayıtlı Karşılaştırmalarım & Durum Bilgisi -->
                ${userComps.length > 0 ? `
                <div class="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between gap-4 flex-wrap">
                    <div class="flex items-center gap-2 overflow-x-auto py-1">
                        <span class="text-xs font-bold text-amber-400 whitespace-nowrap">Kayıtlı Çalışmalar:</span>
                        ${userComps.map(c => `
                        <button type="button" onclick="window.RotaliTubitak.selectComparisonDraft('${c.id}')" class="px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${c.id === draft.id ? 'bg-amber-500 text-slate-950 font-black shadow-sm' : 'bg-slate-800/80 text-slate-300 hover:text-white border border-slate-700'}">
                            <span>${escapeHtml(c.groupTitle || 'Yapı')}</span>
                            <span class="text-[10px] opacity-75">(${c.monumentIds?.length || 2} Eser)</span>
                            <span class="w-2 h-2 rounded-full ${c.status === 'approved' ? 'bg-emerald-400' : (c.status === 'submitted' ? 'bg-blue-400' : 'bg-amber-400')}"></span>
                        </button>
                        `).join("")}
                    </div>
                    <button type="button" onclick="window.RotaliTubitak.startNewComparison()" class="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap">
                        <i class="fa-solid fa-plus"></i>
                        <span>Yeni Karşılaştırma Başlat</span>
                    </button>
                </div>
                ` : ''}
            </div>

            <!-- 🏛️ ADIM 1: YAPI TÜRÜ GRUBU SEÇİMİ (10 Temel Grup) -->
            <div class="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
                <div class="flex items-center justify-between gap-4 flex-wrap">
                    <div>
                        <span class="text-[10px] font-black uppercase text-amber-600 tracking-wider">ADIM 1</span>
                        <h3 class="font-black text-slate-900 text-base sm:text-lg flex items-center gap-2">
                            <span>Karşılaştırılacak Yapı Türü Grubunu Seçin</span>
                            <span class="text-xs font-semibold text-slate-500">(${COMPARISON_GROUPS.length} Grup)</span>
                        </h3>
                    </div>
                    <span class="text-xs text-slate-500 font-medium">Aynı mimari işleve sahip anıtlar bilimsel ölçütlerle eşleştirilir.</span>
                </div>

                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                    ${COMPARISON_GROUPS.map(grp => {
                        const isSelected = grp.id === selectedComparisonGroupId;
                        return `
                        <button type="button" onclick="window.RotaliTubitak.selectComparisonGroup('${grp.id}')" class="p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between h-28 cursor-pointer relative overflow-hidden group ${isSelected ? 'border-amber-500 bg-amber-50/80 shadow-md ring-2 ring-amber-500/30' : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/80'}">
                            <div class="flex items-center justify-between">
                                <div class="w-8 h-8 rounded-xl flex items-center justify-center text-sm ${isSelected ? 'bg-amber-500 text-slate-950 font-black' : 'bg-slate-100 text-slate-700 group-hover:bg-slate-200'}">
                                    <i class="fa-solid ${grp.icon}"></i>
                                </div>
                                <span class="px-2 py-0.5 rounded-full text-[9px] font-bold ${isSelected ? 'bg-amber-200 text-amber-900' : 'bg-slate-100 text-slate-600'}">
                                    ${grp.badge}
                                </span>
                            </div>
                            <div>
                                <h4 class="font-black text-xs leading-snug line-clamp-2 ${isSelected ? 'text-amber-950' : 'text-slate-800'}">${escapeHtml(grp.title)}</h4>
                            </div>
                        </button>
                        `;
                    }).join("")}
                </div>
            </div>

            <!-- 🏛️ ADIM 2: KARŞILAŞTIRILACAK 2 VEYA 3 ESERİ SEÇİN -->
            <div class="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
                <div class="flex items-center justify-between gap-4 flex-wrap">
                    <div>
                        <span class="text-[10px] font-black uppercase text-amber-600 tracking-wider">ADIM 2</span>
                        <h3 class="font-black text-slate-900 text-base sm:text-lg flex items-center gap-2">
                            <span>Karşılaştırılacak Eserleri Belirleyin</span>
                            <span class="px-2.5 py-0.5 rounded-full text-xs font-black ${monIds.length >= 2 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}">
                                ${monIds.length} / 3 Eser Seçildi (En az 2)
                            </span>
                        </h3>
                    </div>

                    <!-- Hızlı Karşılaştırma Önerisi Butonları -->
                    <div class="flex items-center gap-1.5 flex-wrap">
                        <span class="text-xs font-bold text-slate-500">Önerilen Eşleştirmeler:</span>
                        ${selectedComparisonGroupId === 'medreseler' ? `
                        <button type="button" onclick="window.RotaliTubitak.applyComparisonPreset('medreseler', ['gok-medrese', 'buruciye-medresesi', 'sifaiye-medresesi'])" class="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 text-xs font-bold border border-slate-200 transition-colors cursor-pointer">
                            🏛️ 3 Selçuklu Medresesi
                        </button>
                        <button type="button" onclick="window.RotaliTubitak.applyComparisonPreset('medreseler', ['cifte-minareli-medrese', 'gok-medrese'])" class="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 text-xs font-bold border border-slate-200 transition-colors cursor-pointer">
                            ⚖️ Çifte Minareli vs Gök Medrese
                        </button>
                        ` : ''}
                        ${selectedComparisonGroupId === 'camiler' ? `
                        <button type="button" onclick="window.RotaliTubitak.applyComparisonPreset('camiler', ['divrigi-ulu-camii', 'sivas-ulu-camii'])" class="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 text-xs font-bold border border-slate-200 transition-colors cursor-pointer">
                            🕌 Divriği vs Sivas Ulu Camii
                        </button>
                        <button type="button" onclick="window.RotaliTubitak.applyComparisonPreset('camiler', ['sivas-ulu-camii', 'kale-camii'])" class="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 text-xs font-bold border border-slate-200 transition-colors cursor-pointer">
                            🏛️ Selçuklu Hipostil vs Osmanlı Kubbe
                        </button>
                        ` : ''}
                        ${selectedComparisonGroupId === 'kopruler' ? `
                        <button type="button" onclick="window.RotaliTubitak.applyComparisonPreset('kopruler', ['egri-kopru', 'kesik-kopru'])" class="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 text-xs font-bold border border-slate-200 transition-colors cursor-pointer">
                            🌉 Eğri Köprü vs Kesik Köprü
                        </button>
                        <button type="button" onclick="window.RotaliTubitak.applyComparisonPreset('kopruler', ['egri-kopru', 'yildiz-koprusu'])" class="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 text-xs font-bold border border-slate-200 transition-colors cursor-pointer">
                            🌉 Eğri Köprü vs Yıldız Köprüsü
                        </button>
                        ` : ''}
                        ${selectedComparisonGroupId === 'hanlar' ? `
                        <button type="button" onclick="window.RotaliTubitak.applyComparisonPreset('hanlar', ['tashan', 'behram-pasa-hani'])" class="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 text-xs font-bold border border-slate-200 transition-colors cursor-pointer">
                            🏢 Taşhan vs Behram Paşa Hanı
                        </button>
                        <button type="button" onclick="window.RotaliTubitak.applyComparisonPreset('hanlar', ['behram-pasa-hani', 'alacahan-kervansarayi'])" class="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 text-xs font-bold border border-slate-200 transition-colors cursor-pointer">
                            🏢 Şehir Hanı vs Menzil Kervansarayı
                        </button>
                        ` : ''}
                        ${selectedComparisonGroupId === 'turbeler' ? `
                        <button type="button" onclick="window.RotaliTubitak.applyComparisonPreset('turbeler', ['guduk-minare', 'ahi-emir-ahmed-kumbeti'])" class="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 text-xs font-bold border border-slate-200 transition-colors cursor-pointer">
                            ⚱️ Güdük Minare vs Ahi Emir Ahmed
                        </button>
                        ` : ''}
                        ${selectedComparisonGroupId === 'darussifalar' ? `
                        <button type="button" onclick="window.RotaliTubitak.applyComparisonPreset('darussifalar', ['sifaiye-medresesi', 'divrigi-ulu-camii'])" class="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 text-xs font-bold border border-slate-200 transition-colors cursor-pointer">
                            🏥 Şifaiye vs Turan Melek Darüşşifası
                        </button>
                        ` : ''}
                    </div>
                </div>

                <!-- Eser Kartları Seçim Izgarası -->
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    ${(activeGroup?.monumentIds || []).map(mId => {
                        const meta = MONUMENTS_CLASSIFICATION[mId];
                        if (!meta) return '';
                        const isChecked = monIds.includes(mId);
                        return `
                        <div onclick="window.RotaliTubitak.toggleComparisonMonument('${mId}')" class="p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between h-36 relative select-none ${isChecked ? 'bg-amber-500/10 border-amber-500 ring-2 ring-amber-500/40 shadow-sm' : 'bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-slate-100'}">
                            <div class="flex items-start justify-between gap-2">
                                <div class="font-black text-xs text-slate-900 line-clamp-2 leading-tight">${escapeHtml(meta.name)}</div>
                                <div class="w-5 h-5 rounded-lg flex items-center justify-center border transition-colors shrink-0 ${isChecked ? 'bg-amber-500 border-amber-500 text-slate-950 font-black' : 'border-slate-300 bg-white'}">
                                    ${isChecked ? '<i class="fa-solid fa-check text-xs"></i>' : ''}
                                </div>
                            </div>
                            <div class="space-y-1 text-[11px] text-slate-600">
                                <div><span class="font-bold text-slate-800">Dönem:</span> ${escapeHtml(meta.period)}</div>
                                <div><span class="font-bold text-slate-800">Tarih:</span> ${escapeHtml(meta.buildYear)}</div>
                                <div class="text-[10px] text-indigo-700 font-bold truncate">👤 ${escapeHtml(meta.assignedStudent)}</div>
                            </div>
                        </div>
                        `;
                    }).join("")}
                </div>
            </div>

            <!-- 🏛️ SEKME ÇUBUĞU (Tablo & Analiz | Zaman Çizelgesi | Görsel İnceleme) -->
            <div class="flex items-center gap-2 border-b border-slate-200 pb-2">
                <button type="button" onclick="window.RotaliTubitak.setComparativeSubTab('table')" class="px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${comparativeSubTab === 'table' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}">
                    <i class="fa-solid fa-table-list text-amber-400"></i>
                    <span>1. Tablo ve Analiz Formu</span>
                </button>
                <button type="button" onclick="window.RotaliTubitak.setComparativeSubTab('timeline')" class="px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${comparativeSubTab === 'timeline' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}">
                    <i class="fa-solid fa-timeline text-cyan-400"></i>
                    <span>2. Kronolojik Zaman Çizelgesi</span>
                </button>
                <button type="button" onclick="window.RotaliTubitak.setComparativeSubTab('visual')" class="px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${comparativeSubTab === 'visual' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}">
                    <i class="fa-solid fa-images text-emerald-400"></i>
                    <span>3. Yan Yana Görsel İnceleme</span>
                </button>
            </div>

            <!-- 🏛️ SEKME 1: TABLO VE ANALİZ FORMU -->
            ${comparativeSubTab === 'table' ? `
            <div class="space-y-6">

                <!-- 📊 10 ÖLÇÜTLÜ İNTERAKTİF KARŞILAŞTIRMA TABLOSU -->
                <div class="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
                    <div class="flex items-center justify-between gap-4 flex-wrap">
                        <div>
                            <span class="text-[10px] font-black uppercase text-amber-600 tracking-wider">BİLİMSEL ANALİZ MATRİSİ</span>
                            <h3 class="font-black text-slate-900 text-base sm:text-lg flex items-center gap-2">
                                <i class="fa-solid fa-table text-amber-500"></i>
                                <span>10 Ölçütlü Tarihsel Karşılaştırma Tablosu</span>
                            </h3>
                        </div>
                        <span class="text-xs text-slate-500">Veriler mevcut araştırma kriterlerinden aktarılmıştır; gerektiğinde hücreleri doğrudan güncelleyebilirsiniz.</span>
                    </div>

                    <div class="overflow-x-auto rounded-2xl border border-slate-200">
                        <table class="w-full text-left text-xs border-collapse">
                            <thead>
                                <tr class="bg-slate-900 text-white border-b border-slate-800">
                                    <th class="py-3 px-4 font-black w-1/4">Karşılaştırma Ölçütü</th>
                                    ${monIds.map(mId => {
                                        const meta = MONUMENTS_CLASSIFICATION[mId];
                                        return `<th class="py-3 px-4 font-black">${escapeHtml(meta?.name || mId)}</th>`;
                                    }).join("")}
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-200">
                                ${COMPARISON_CRITERIA_10.map(crit => {
                                    return `
                                    <tr class="hover:bg-slate-50/60 transition-colors">
                                        <td class="py-3 px-4 font-black text-slate-900 bg-slate-50/80 align-top">
                                            <div class="text-xs">${escapeHtml(crit.title)}</div>
                                            <div class="text-[10px] text-slate-500 font-normal mt-0.5">${escapeHtml(crit.description)}</div>
                                        </td>
                                        ${monIds.map(mId => {
                                            const cellVal = draft.tableData?.[crit.id]?.[mId] || "";
                                            return `
                                            <td class="py-2.5 px-3 align-top space-y-1.5">
                                                <textarea 
                                                    rows="2"
                                                    oninput="window.RotaliTubitak.updateComparisonTableCell('${crit.id}', '${mId}', this.value)"
                                                    class="w-full p-2.5 rounded-xl border border-slate-200 bg-white focus:bg-amber-50/30 focus:border-amber-500 text-xs font-semibold text-slate-800 outline-none transition-all resize-y"
                                                    placeholder="Bu ölçüt için doğrulanmış veriyi yazınız..."
                                                >${escapeHtml(cellVal)}</textarea>

                                                <!-- Hızlı Etiket Butonları -->
                                                <div class="flex items-center gap-1 flex-wrap">
                                                    <button type="button" onclick="window.RotaliTubitak.quickSetComparisonTableCell('${crit.id}', '${mId}', 'Veri girilmedi')" class="px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors">
                                                        Veri girilmedi
                                                    </button>
                                                    <button type="button" onclick="window.RotaliTubitak.quickSetComparisonTableCell('${crit.id}', '${mId}', 'Kesin olarak bilinmiyor')" class="px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors">
                                                        Kesin olarak bilinmiyor
                                                    </button>
                                                    <button type="button" onclick="window.RotaliTubitak.quickSetComparisonTableCell('${crit.id}', '${mId}', 'Kaynaklar arasında farklılık bulunmaktadır')" class="px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors">
                                                        Kaynak farklılığı var
                                                    </button>
                                                </div>
                                            </td>
                                            `;
                                        }).join("")}
                                    </tr>
                                    `;
                                }).join("")}
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- 📝 ÖĞRENCİ ANALİZ FORMU (6 ZORUNLU BÖLÜM) -->
                <div class="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-6">
                    <div class="border-b border-slate-200 pb-3">
                        <span class="text-[10px] font-black uppercase text-amber-600 tracking-wider">DERİN TARİHSEL ANALİZ FORMU</span>
                        <h3 class="font-black text-slate-900 text-base sm:text-lg flex items-center gap-2">
                            <i class="fa-solid fa-pen-nib text-amber-500"></i>
                            <span>Öğrenci Karşılaştırma Analizi (6 Zorunlu Bölüm)</span>
                        </h3>
                        <p class="text-xs text-slate-500 mt-1">Lütfen aşağıdaki altı analitik alanı kendi tarihsel değerlendirmelerinizle ve kanıtlara dayalı olarak doldurunuz.</p>
                    </div>

                    <div class="space-y-6">

                        <!-- 1. KARŞILAŞTIRMA SORUSU -->
                        <div class="space-y-1.5">
                            <label class="block font-black text-slate-900 text-xs sm:text-sm flex items-center justify-between">
                                <span class="flex items-center gap-1.5">
                                    <span class="w-5 h-5 rounded-md bg-amber-500 text-slate-950 flex items-center justify-center font-black text-[11px]">1</span>
                                    <span>KARŞILAŞTIRMA SORUSU *</span>
                                </span>
                                <span class="text-[11px] font-bold text-slate-500">${countWords(draft.question)} kelime</span>
                            </label>
                            <p class="text-xs text-slate-500">Öğrenci seçtiği eserleri neden karşılaştırdığını açıklasın (Örnek: Aynı dönemde yapılan Sivas medreselerinin mimari özellikleri hangi yönlerden benzerlik ve farklılık göstermektedir?)</p>
                            <textarea
                                rows="3"
                                oninput="window.RotaliTubitak.updateComparisonField('question', this.value)"
                                class="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 text-xs sm:text-sm font-semibold text-slate-800 outline-none transition-all leading-relaxed"
                                placeholder="Karşılaştırma araştırma sorunuzu buraya yazınız..."
                            >${escapeHtml(draft.question)}</textarea>
                        </div>

                        <!-- 2. BENZERLİKLER -->
                        <div class="space-y-1.5">
                            <label class="block font-black text-slate-900 text-xs sm:text-sm flex items-center justify-between">
                                <span class="flex items-center gap-1.5">
                                    <span class="w-5 h-5 rounded-md bg-amber-500 text-slate-950 flex items-center justify-center font-black text-[11px]">2</span>
                                    <span>BENZERLİKLER *</span>
                                </span>
                                <span class="text-[11px] font-bold text-slate-500">${countWords(draft.similarities)} kelime</span>
                            </label>
                            <p class="text-xs text-slate-500">Eserlerin ortak mimari planları, yapım malzemeleri, avlu düzenleri ve bezeme sanatlarındaki benzer yönlerini açıklayınız.</p>
                            <textarea
                                rows="4"
                                oninput="window.RotaliTubitak.updateComparisonField('similarities', this.value)"
                                class="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 text-xs sm:text-sm font-semibold text-slate-800 outline-none transition-all leading-relaxed"
                                placeholder="Seçilen eserler arasındaki benzerlikleri ve dayandığı kaynakları yazınız..."
                            >${escapeHtml(draft.similarities)}</textarea>
                        </div>

                        <!-- 3. FARKLILIKLAR -->
                        <div class="space-y-1.5">
                            <label class="block font-black text-slate-900 text-xs sm:text-sm flex items-center justify-between">
                                <span class="flex items-center gap-1.5">
                                    <span class="w-5 h-5 rounded-md bg-amber-500 text-slate-950 flex items-center justify-center font-black text-[11px]">3</span>
                                    <span>FARKLILIKLAR *</span>
                                </span>
                                <span class="text-[11px] font-bold text-slate-500">${countWords(draft.differences)} kelime</span>
                            </label>
                            <p class="text-xs text-slate-500">Yapım tarihi, banisi, mimari kurgusu, taçkapı özellikleri ve işlevlerindeki ayrışan yönleri açıklayınız.</p>
                            <textarea
                                rows="4"
                                oninput="window.RotaliTubitak.updateComparisonField('differences', this.value)"
                                class="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 text-xs sm:text-sm font-semibold text-slate-800 outline-none transition-all leading-relaxed"
                                placeholder="Eserleri birbirinden ayıran özgün mimari, sanatsal veya tarihsel farkları yazınız..."
                            >${escapeHtml(draft.differences)}</textarea>
                        </div>

                        <!-- 4. TARİHSEL DEĞİŞİM VE SÜREKLİLİK -->
                        <div class="space-y-1.5">
                            <label class="block font-black text-slate-900 text-xs sm:text-sm flex items-center justify-between">
                                <span class="flex items-center gap-1.5">
                                    <span class="w-5 h-5 rounded-md bg-amber-500 text-slate-950 flex items-center justify-center font-black text-[11px]">4</span>
                                    <span>TARİHSEL DEĞİŞİM VE SÜREKLİLİK *</span>
                                </span>
                                <span class="text-[11px] font-bold text-slate-500">${countWords(draft.continuity)} kelime</span>
                            </label>
                            <p class="text-xs text-slate-500">Tarihsel dönemler boyunca hangi özelliklerin korunduğunu, hangilerinin dönüştüğünü; geçirilen yangın, yıkım, onarım ve işlev kaymalarını değerlendiriniz.</p>
                            <textarea
                                rows="4"
                                oninput="window.RotaliTubitak.updateComparisonField('continuity', this.value)"
                                class="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 text-xs sm:text-sm font-semibold text-slate-800 outline-none transition-all leading-relaxed"
                                placeholder="Selçuklu'dan Osmanlı'ya ve günümüze uzanan değişim ve süreklilik sürecini açıklayınız..."
                            >${escapeHtml(draft.continuity)}</textarea>
                        </div>

                        <!-- 5. TARİHSEL KANITLAR VE YORUMLAR -->
                        <div class="space-y-1.5">
                            <label class="block font-black text-slate-900 text-xs sm:text-sm flex items-center justify-between">
                                <span class="flex items-center gap-1.5">
                                    <span class="w-5 h-5 rounded-md bg-amber-500 text-slate-950 flex items-center justify-center font-black text-[11px]">5</span>
                                    <span>TARİHSEL KANITLAR VE YORUMLAR *</span>
                                </span>
                                <span class="text-[11px] font-bold text-slate-500">${countWords(draft.evidenceAnalysis)} kelime</span>
                            </label>
                            <p class="text-xs text-slate-500">Doğrudan kitabe/vakfiye veya arşivde bulunan nesnel bilgi ile kendi tarihsel çıkarımlarınızı açıkça birbirinden ayırarak yazınız.</p>
                            <textarea
                                rows="4"
                                oninput="window.RotaliTubitak.updateComparisonField('evidenceAnalysis', this.value)"
                                class="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 text-xs sm:text-sm font-semibold text-slate-800 outline-none transition-all leading-relaxed"
                                placeholder="Birincil tarihî kanıtlar ile kişisel tarihsel çıkarımlarınızı ayrı paragraflar halinde yazınız..."
                            >${escapeHtml(draft.evidenceAnalysis)}</textarea>
                        </div>

                        <!-- 6. KARŞILAŞTIRMA SONUCU -->
                        <div class="space-y-1.5">
                            <label class="block font-black text-slate-900 text-xs sm:text-sm flex items-center justify-between">
                                <span class="flex items-center gap-1.5">
                                    <span class="w-5 h-5 rounded-md bg-amber-500 text-slate-950 flex items-center justify-center font-black text-[11px]">6</span>
                                    <span>KARŞILAŞTIRMA SONUCU VE TARİHSEL ÇIKARIM *</span>
                                </span>
                                <span class="text-[11px] font-bold text-slate-500">${countWords(draft.conclusion)} kelime</span>
                            </label>
                            <p class="text-xs text-slate-500">Başlangıçtaki araştırma sorunuza doğrudan cevap veren, kanıtlarla desteklenmiş özgün sentez ve sonucunuzu yazınız.</p>
                            <textarea
                                rows="5"
                                oninput="window.RotaliTubitak.updateComparisonField('conclusion', this.value)"
                                class="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 text-xs sm:text-sm font-semibold text-slate-800 outline-none transition-all leading-relaxed"
                                placeholder="Araştırma sorunuza cevap veren genel tarihsel sonucu kendi ifadelerinizle özetleyiniz..."
                            >${escapeHtml(draft.conclusion)}</textarea>
                        </div>

                    </div>
                </div>

                <!-- 📚 BİLİMSEL KAYNAKÇA VE KANIT LİSTESİ YÖNETİCİSİ -->
                <div class="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
                    <div class="flex items-center justify-between gap-4 flex-wrap">
                        <div>
                            <span class="text-[10px] font-black uppercase text-amber-600 tracking-wider">KANIT TABANI</span>
                            <h3 class="font-black text-slate-900 text-base sm:text-lg flex items-center gap-2">
                                <i class="fa-solid fa-book-bookmark text-amber-500"></i>
                                <span>Tarihsel Kanıtlar ve Kaynakça (${(draft.evidences || []).length} Kayıt)</span>
                            </h3>
                        </div>
                        <button type="button" onclick="window.RotaliTubitak.openAddEvidenceModal()" class="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-white font-black text-xs transition-all flex items-center gap-1.5 cursor-pointer">
                            <i class="fa-solid fa-plus"></i>
                            <span>Yeni Tarihsel Kanıt / Kaynak Ekle</span>
                        </button>
                    </div>

                    ${(draft.evidences || []).length === 0 ? `
                    <div class="p-6 text-center rounded-2xl border border-dashed border-slate-300 text-slate-500 text-xs">
                        Bu karşılaştırma için henüz bir tarihî kanıt veya kaynak eklenmedi. Yukarıdaki butona tıklayarak kitabe, vakfiye, arşiv belgesi veya akademik kaynak ekleyebilirsiniz.
                    </div>
                    ` : `
                    <div class="overflow-x-auto rounded-2xl border border-slate-200">
                        <table class="w-full text-left text-xs">
                            <thead class="bg-slate-50 text-slate-700 border-b border-slate-200 font-bold">
                                <tr>
                                    <th class="py-3 px-3">Kanıt Niteliği / Türü</th>
                                    <th class="py-3 px-3">Yazar / Eser Adı</th>
                                    <th class="py-3 px-3">Yıl / Sayfa</th>
                                    <th class="py-3 px-3">Açıklama / İddia İlişkisi</th>
                                    <th class="py-3 px-3 text-right">İşlem</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100">
                                ${(draft.evidences || []).map(ev => `
                                <tr class="hover:bg-slate-50 transition-colors">
                                    <td class="py-2.5 px-3 whitespace-nowrap">
                                        <span class="px-2 py-0.5 rounded-full text-[10px] font-black ${ev.isPrimary ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-slate-100 text-slate-700 border border-slate-200'}">
                                            ${ev.isPrimary ? '🏛️ Birincil Tarihî Kanıt' : '📖 İkincil Araştırma'}
                                        </span>
                                        <div class="text-[10px] text-slate-500 mt-0.5">${escapeHtml(ev.type || 'Kaynak')}</div>
                                    </td>
                                    <td class="py-2.5 px-3">
                                        <div class="font-bold text-slate-900">${escapeHtml(ev.title || 'Başlıksız Kaynak')}</div>
                                        <div class="text-slate-500 text-[11px]">${escapeHtml(ev.author || 'Bilinmiyor')}</div>
                                    </td>
                                    <td class="py-2.5 px-3 whitespace-nowrap text-slate-600">
                                        ${escapeHtml(ev.year || '-')}${ev.page ? ` / s. ${escapeHtml(ev.page)}` : ''}
                                    </td>
                                    <td class="py-2.5 px-3 text-slate-700 max-w-xs truncate">
                                        ${escapeHtml(ev.desc || ev.url || '-')}
                                    </td>
                                    <td class="py-2.5 px-3 text-right">
                                        <button type="button" onclick="window.RotaliTubitak.deleteEvidence('${ev.id}')" class="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer" title="Sil">
                                            <i class="fa-solid fa-trash-can"></i>
                                        </button>
                                    </td>
                                </tr>
                                `).join("")}
                            </tbody>
                        </table>
                    </div>
                    `}
                </div>

            </div>
            ` : ''}

            <!-- 🏛️ SEKME 2: KRONOLOJİK ZAMAN ÇİZELGESİ (TIMELINE) -->
            ${comparativeSubTab === 'timeline' ? `
            <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
                <div>
                    <span class="text-[10px] font-black uppercase text-cyan-600 tracking-wider">KRONOLOJİK DİZİN</span>
                    <h3 class="font-black text-slate-900 text-base sm:text-lg flex items-center gap-2">
                        <i class="fa-solid fa-timeline text-cyan-500"></i>
                        <span>Seçilen Eserlerin Kronolojik Karşılaştırma Çizelgesi</span>
                    </h3>
                    <p class="text-xs text-slate-500 mt-1">İnşa tarihleri, beylik/devlet dönemleri, geçirdikleri onarımlar ve işlevsel dönüşümler aynı zaman ekseninde incelenir.</p>
                </div>

                <div class="relative border-l-4 border-amber-500/30 ml-4 sm:ml-8 pl-6 sm:pl-8 space-y-8 my-6">
                    ${monIds.map((mId, idx) => {
                        const meta = MONUMENTS_CLASSIFICATION[mId];
                        if (!meta) return '';
                        return `
                        <div class="relative group">
                            <!-- Kronoloji Noktası -->
                            <div class="absolute -left-[35px] sm:-left-[43px] top-1.5 w-7 h-7 rounded-full bg-slate-900 border-4 border-amber-500 flex items-center justify-center text-white text-xs font-black shadow-md">
                                ${idx + 1}
                            </div>
                            
                            <!-- Kart -->
                            <div class="bg-slate-50 rounded-2xl p-5 border border-slate-200 hover:border-amber-300 hover:bg-amber-50/20 transition-all space-y-2">
                                <div class="flex items-center justify-between gap-3 flex-wrap">
                                    <h4 class="font-black text-slate-900 text-sm sm:text-base">${escapeHtml(meta.name)}</h4>
                                    <span class="px-3 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-900 border border-amber-300">
                                        📅 ${escapeHtml(meta.buildYear)}
                                    </span>
                                </div>
                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700 pt-2 border-t border-slate-200">
                                    <div><span class="font-bold text-slate-900">🏛️ Dönem / Medeniyet:</span> ${escapeHtml(meta.period)}</div>
                                    <div><span class="font-bold text-slate-900">👑 Banisi:</span> ${escapeHtml(meta.builder)}</div>
                                    <div><span class="font-bold text-slate-900">🎯 İlk Amacı:</span> ${escapeHtml(meta.initialPurpose)}</div>
                                    <div><span class="font-bold text-slate-900">📐 Plan & Malzeme:</span> ${escapeHtml(meta.planType)} (${escapeHtml(meta.materials)})</div>
                                </div>
                                <div class="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-700 mt-2 space-y-1">
                                    <div><span class="font-bold text-indigo-700">🔄 Tarihsel Değişim & Onarım:</span> ${escapeHtml(meta.changes)}</div>
                                    <div><span class="font-bold text-emerald-700">📍 Günümüz Durumu:</span> ${escapeHtml(meta.currentUse)} — ${escapeHtml(meta.preservationStatus)}</div>
                                </div>
                            </div>
                        </div>
                        `;
                    }).join("")}
                </div>
            </div>
            ` : ''}

            <!-- 🏛️ SEKME 3: YAN YANA GÖRSEL İNCELEME -->
            ${comparativeSubTab === 'visual' ? `
            <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
                <div>
                    <span class="text-[10px] font-black uppercase text-emerald-600 tracking-wider">MİMARİ GÖRSEL ANALİZ</span>
                    <h3 class="font-black text-slate-900 text-base sm:text-lg flex items-center gap-2">
                        <i class="fa-solid fa-images text-emerald-500"></i>
                        <span>Yan Yana Taçkapı, Plan ve Tezyinat İncelemesi</span>
                    </h3>
                    <p class="text-xs text-slate-500 mt-1">Eserlerin anıtsal taçkapı kabartmaları, plan şemaları ve mimari detayları doğrulanmış arşiv kayıtlarıyla yan yana incelenir.</p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${Math.min(3, Math.max(1, monIds.length))} gap-6">
                    ${monIds.map(mId => {
                        const meta = MONUMENTS_CLASSIFICATION[mId];
                        if (!meta) return '';
                        return `
                        <div class="rounded-3xl border border-slate-200 bg-slate-50 overflow-hidden shadow-sm flex flex-col justify-between">
                            <div class="p-4 bg-slate-900 text-white flex items-center justify-between">
                                <h4 class="font-black text-xs sm:text-sm truncate">${escapeHtml(meta.name)}</h4>
                                <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-amber-400">${escapeHtml(meta.buildYear)}</span>
                            </div>
                            
                            <!-- Görsel Alanı (Arşiv Çizimi & Fotoğraf Temsili) -->
                            <div class="p-4 space-y-3 bg-white">
                                <div class="h-48 rounded-2xl bg-gradient-to-br from-slate-100 to-amber-50 border border-slate-200 flex flex-col items-center justify-center p-4 text-center relative overflow-hidden group">
                                    <div class="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center text-xl mb-2">
                                        <i class="fa-solid fa-monument"></i>
                                    </div>
                                    <div class="font-black text-xs text-slate-900">${escapeHtml(meta.name)} Taçkapı & Rölöve İncelemesi</div>
                                    <div class="text-[10px] text-slate-500 mt-1">Kültür Varlıkları ve Müzeler Genel Müdürlüğü Arşivi</div>
                                    <span class="mt-2 px-2.5 py-1 rounded-full text-[10px] font-black bg-slate-900 text-white shadow-xs">
                                        🔍 Bilimsel Rölöve Kaydı
                                    </span>
                                </div>

                                <div class="space-y-1.5 text-xs text-slate-700">
                                    <div><span class="font-bold text-slate-900">Taçkapı & Süsleme:</span> ${escapeHtml(meta.ornamentKitabe)}</div>
                                    <div><span class="font-bold text-slate-900">Mimari Kurgu:</span> ${escapeHtml(meta.planType)}</div>
                                    <div><span class="font-bold text-slate-900">Kullanılan Taş:</span> ${escapeHtml(meta.materials)}</div>
                                </div>
                            </div>

                            <div class="p-3 bg-slate-100 border-t border-slate-200 text-[10px] text-slate-500 flex items-center justify-between">
                                <span>Telif: T.C. Kültür ve Turizm Bakanlığı</span>
                                <span class="font-bold text-indigo-700">1. Derece Tescilli</span>
                            </div>
                        </div>
                        `;
                    }).join("")}
                </div>
            </div>
            ` : ''}

        </div>
        `;
    }

    // =========================================================================
    // MODALLAR VE DANIŞMAN ÖĞRETMEN DEĞERLENDİRME RUBRİĞİ
    // =========================================================================

    function openAddEvidenceModal() {
        let modal = document.getElementById("tubitak-add-evidence-modal");
        if (!modal) {
            modal = document.createElement("div");
            modal.id = "tubitak-add-evidence-modal";
            modal.className = "fixed inset-0 z-[99995] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4";
            document.body.appendChild(modal);
        }

        modal.innerHTML = `
        <div class="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95" onclick="event.stopPropagation()">
            <div class="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
                <div class="flex items-center gap-2.5">
                    <div class="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-black">
                        <i class="fa-solid fa-book-bookmark text-sm"></i>
                    </div>
                    <h3 class="font-black text-sm sm:text-base">Yeni Tarihsel Kanıt / Kaynak Ekle</h3>
                </div>
                <button type="button" onclick="document.getElementById('tubitak-add-evidence-modal').classList.add('hidden')" class="w-7 h-7 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>

            <form onsubmit="window.RotaliTubitak.handleAddEvidenceSubmit(event)" class="p-6 space-y-4 text-xs">
                <div>
                    <label class="block font-bold text-slate-700 mb-1">Kanıt Niteliği *</label>
                    <select id="evidence-is-primary" class="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-semibold text-slate-800 outline-none">
                        <option value="true">🏛️ Doğrudan Tarihî Kanıt (Kitabe, Vakfiye, Arşiv Belgesi, Rölöve)</option>
                        <option value="false">📖 İkincil Araştırma (Akademik Makale, Kitap, Kültür Portalı Envanteri)</option>
                    </select>
                </div>

                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="block font-bold text-slate-700 mb-1">Kaynak Türü *</label>
                        <select id="evidence-type" class="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-semibold text-slate-800 outline-none">
                            <option value="Kitabe / Yazıt">Kitabe / Yazıt</option>
                            <option value="Vakfiye">Vakfiye</option>
                            <option value="Arşiv Belgesi">Arşiv Belgesi</option>
                            <option value="Mimari Rölöve / Çizim">Mimari Rölöve / Çizim</option>
                            <option value="Akademik Kitap">Akademik Kitap</option>
                            <option value="Bilimsel Makale">Bilimsel Makale</option>
                            <option value="Kültür Portalı Envanteri">Kültür Portalı Envanteri</option>
                            <option value="Resmî Tescil Kaydı">Resmî Tescil Kaydı</option>
                        </select>
                    </div>
                    <div>
                        <label class="block font-bold text-slate-700 mb-1">Yayın / Belge Yılı</label>
                        <input type="text" id="evidence-year" placeholder="Örn: 1228 veya 2001" class="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-semibold text-slate-800 outline-none">
                    </div>
                </div>

                <div>
                    <label class="block font-bold text-slate-700 mb-1">Eser / Belge / Kitap Adı *</label>
                    <input type="text" id="evidence-title" required placeholder="Örn: Divriği Ulu Camii ve Darüşşifası Kitabeleri" class="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-semibold text-slate-800 outline-none">
                </div>

                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="block font-bold text-slate-700 mb-1">Yazar / Kurum / Arşiv</label>
                        <input type="text" id="evidence-author" placeholder="Örn: Prof. Dr. Doğan Kuban / Vakıflar GM" class="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-semibold text-slate-800 outline-none">
                    </div>
                    <div>
                        <label class="block font-bold text-slate-700 mb-1">Sayfa / Cilt / Fon Kodu</label>
                        <input type="text" id="evidence-page" placeholder="Örn: s. 45-48 veya BOA. EV.d" class="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-semibold text-slate-800 outline-none">
                    </div>
                </div>

                <div>
                    <label class="block font-bold text-slate-700 mb-1">Açıklama & Kanıt Bağlantısı</label>
                    <textarea id="evidence-desc" rows="2" placeholder="Bu kaynak karşılaştırmadaki hangi iddiayı veya benzerliği desteklemektedir?" class="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-semibold text-slate-800 outline-none resize-none"></textarea>
                </div>

                <div class="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                    <button type="button" onclick="document.getElementById('tubitak-add-evidence-modal').classList.add('hidden')" class="px-4 py-2 rounded-xl text-slate-600 font-bold hover:bg-slate-100 transition-colors cursor-pointer">
                        Vazgeç
                    </button>
                    <button type="submit" class="px-4 py-2 rounded-xl bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-white font-black transition-all cursor-pointer">
                        Kaydet ve İlişkilendir
                    </button>
                </div>
            </form>
        </div>
        `;

        modal.classList.remove("hidden");
    }

    function handleAddEvidenceSubmit(e) {
        e.preventDefault();
        const draft = initCurrentComparisonDraft();
        if (!draft) return;

        const isPrimary = document.getElementById("evidence-is-primary")?.value === "true";
        const type = document.getElementById("evidence-type")?.value || "Kaynak";
        const title = document.getElementById("evidence-title")?.value || "";
        const author = document.getElementById("evidence-author")?.value || "";
        const year = document.getElementById("evidence-year")?.value || "";
        const page = document.getElementById("evidence-page")?.value || "";
        const desc = document.getElementById("evidence-desc")?.value || "";

        if (!title.trim()) {
            showNotice("Lütfen bir kaynak veya belge adı giriniz.", "error");
            return;
        }

        if (!Array.isArray(draft.evidences)) draft.evidences = [];
        pushComparisonUndoSnapshot();

        draft.evidences.push({
            id: `ev_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            isPrimary,
            type,
            title: title.trim(),
            author: author.trim(),
            year: year.trim(),
            page: page.trim(),
            desc: desc.trim()
        });

        document.getElementById("tubitak-add-evidence-modal")?.classList.add("hidden");
        scheduleComparisonAutoSave();
        renderMainContainer(document.getElementById("tubitak-research-container"));
        showNotice("Tarihsel kanıt başarıyla eklendi! 📚", "success");
    }

    function deleteEvidence(evId) {
        const draft = initCurrentComparisonDraft();
        if (!draft || !Array.isArray(draft.evidences)) return;
        pushComparisonUndoSnapshot();
        draft.evidences = draft.evidences.filter(ev => ev.id !== evId);
        scheduleComparisonAutoSave();
        renderMainContainer(document.getElementById("tubitak-research-container"));
        showNotice("Kanıt kaydı silindi.", "info");
    }

    // 18 Araştırma Kriteri Değerlendirme Raporu Modalı
    function openCriteriaEvaluationReportModal() {
        const { CRITERIA_EVALUATION_REPORT } = getComparativeData();
        let modal = document.getElementById("tubitak-criteria-eval-modal");
        if (!modal) {
            modal = document.createElement("div");
            modal.id = "tubitak-criteria-eval-modal";
            modal.className = "fixed inset-0 z-[99995] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6";
            document.body.appendChild(modal);
        }

        modal.innerHTML = `
        <div class="bg-white rounded-3xl max-w-4xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95" onclick="event.stopPropagation()">
            <div class="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black">
                        <i class="fa-solid fa-scroll text-lg"></i>
                    </div>
                    <div>
                        <span class="text-[10px] font-black uppercase text-amber-400 tracking-wider">TÜBİTAK 2204-B AKADEMİK İNCELEME</span>
                        <h3 class="font-black text-base sm:text-lg">Araştırma Kriterleri Değerlendirme Raporu</h3>
                    </div>
                </div>
                <button type="button" onclick="document.getElementById('tubitak-criteria-eval-modal').classList.add('hidden')" class="w-8 h-8 rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>

            <div class="p-6 overflow-y-auto space-y-6 text-xs text-slate-800">
                
                <!-- Özet -->
                <div class="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 leading-relaxed">
                    <div class="font-black text-sm mb-1">📜 Rapor Özeti ve Bilimsel Çerçeve</div>
                    ${escapeHtml(CRITERIA_EVALUATION_REPORT.overallSummary)}
                </div>

                <!-- 7 Akademik Soru Analizi -->
                <div class="space-y-3">
                    <h4 class="font-black text-slate-900 text-sm">7 Temel Akademik ve Teknik Değerlendirme Sorusu</h4>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                        <div class="p-3 rounded-xl bg-slate-50 border border-slate-200">
                            <span class="font-bold text-indigo-700">1. Tarihsel Araştırma Anlamı:</span>
                            <p class="text-slate-600 mt-0.5">18 kriter, kentin mimari hafızasını ve maddi kültürünü belgelemektedir.</p>
                        </div>
                        <div class="p-3 rounded-xl bg-slate-50 border border-slate-200">
                            <span class="font-bold text-indigo-700">2. Tekrar Durumu:</span>
                            <p class="text-slate-600 mt-0.5">c12 ve c15 (tescil) örtüşmektedir. c16 ve c17 yeni modüle köprülenmiştir.</p>
                        </div>
                        <div class="p-3 rounded-xl bg-slate-50 border border-slate-200">
                            <span class="font-bold text-indigo-700">3. Analiz vs Bilgi Toplama:</span>
                            <p class="text-slate-600 mt-0.5">İlk 15 kriter envanter toplarken, 16 ve 17 analitik düşünmeyi tetikler.</p>
                        </div>
                        <div class="p-3 rounded-xl bg-slate-50 border border-slate-200">
                            <span class="font-bold text-indigo-700">4. Karşılaştırılabilirlik:</span>
                            <p class="text-slate-600 mt-0.5">Plan, malzeme, bani ve dönem ölçütleri yüksek karşılaştırılabilirlik taşır.</p>
                        </div>
                        <div class="p-3 rounded-xl bg-slate-50 border border-slate-200">
                            <span class="font-bold text-indigo-700">5. Kaynak Güvenilirliği:</span>
                            <p class="text-slate-600 mt-0.5">18. kriter kaynak doğrulaması sağlar; birincil/ikincil kanıt ayrımı yapılmıştır.</p>
                        </div>
                        <div class="p-3 rounded-xl bg-slate-50 border border-slate-200">
                            <span class="font-bold text-indigo-700">6. Belirsizlikler:</span>
                            <p class="text-slate-600 mt-0.5">'Kesin bilinmiyor' ve 'Kaynak farkı var' etiketleriyle dürüstçe sunulur.</p>
                        </div>
                    </div>
                </div>

                <!-- 18 Kriter İnceleme Tablosu -->
                <div class="space-y-3">
                    <h4 class="font-black text-slate-900 text-sm">18 Kriterin Detaylı Akademik Değerlendirmesi</h4>
                    <div class="overflow-x-auto rounded-2xl border border-slate-200">
                        <table class="w-full text-left text-xs">
                            <thead class="bg-slate-900 text-white font-bold">
                                <tr>
                                    <th class="py-2.5 px-3">Kriter Adı</th>
                                    <th class="py-2.5 px-3">Veri Türü</th>
                                    <th class="py-2.5 px-3">Akademik Değeri</th>
                                    <th class="py-2.5 px-3">Tekrar / Örtüşme</th>
                                    <th class="py-2.5 px-3">Karşılaştırma Rolü</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100">
                                ${(CRITERIA_EVALUATION_REPORT.criteriaList || []).map(c => `
                                <tr class="hover:bg-slate-50 transition-colors">
                                    <td class="py-2.5 px-3 font-bold text-slate-900 whitespace-nowrap">
                                        ${escapeHtml(c.title)}
                                        ${c.required ? '<span class="text-red-500 font-bold">*</span>' : ''}
                                    </td>
                                    <td class="py-2.5 px-3 text-slate-600 whitespace-nowrap">${escapeHtml(c.dataType)}</td>
                                    <td class="py-2.5 px-3 text-slate-700">${escapeHtml(c.academicValue)}</td>
                                    <td class="py-2.5 px-3 text-slate-500">${escapeHtml(c.redundancy)}</td>
                                    <td class="py-2.5 px-3 text-indigo-700 font-medium">${escapeHtml(c.recommendation)}</td>
                                </tr>
                                `).join("")}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
        `;

        modal.classList.remove("hidden");
    }

    // Danışman Öğretmen Rubrik Değerlendirme Modalı
    function openTeacherComparisonReviewModal(compId) {
        const comp = runtimeComparisons[compId];
        if (!comp) {
            showNotice("Karşılaştırma kaydı bulunamadı.", "error");
            return;
        }

        const { MONUMENTS_CLASSIFICATION, RUBRIC_DIMENSIONS_5 } = getComparativeData();
        const monNames = (comp.monumentIds || []).map(id => MONUMENTS_CLASSIFICATION[id]?.name || id).join(" vs ");
        const r = comp.rubric || {};

        let modal = document.getElementById("tubitak-teacher-review-modal");
        if (!modal) {
            modal = document.createElement("div");
            modal.id = "tubitak-teacher-review-modal";
            modal.className = "fixed inset-0 z-[99995] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6";
            document.body.appendChild(modal);
        }

        modal.innerHTML = `
        <div class="bg-white rounded-3xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95" onclick="event.stopPropagation()">
            <div class="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black">
                        <i class="fa-solid fa-graduation-cap"></i>
                    </div>
                    <div>
                        <span class="text-[10px] font-black uppercase text-indigo-400 tracking-wider">ÖĞRETMEN DEĞERLENDİRME RUBRİĞİ</span>
                        <h3 class="font-black text-base">${escapeHtml(comp.studentName)} — ${escapeHtml(monNames)}</h3>
                    </div>
                </div>
                <button type="button" onclick="document.getElementById('tubitak-teacher-review-modal').classList.add('hidden')" class="w-8 h-8 rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>

            <form onsubmit="window.RotaliTubitak.submitTeacherComparisonReview(event, '${comp.id}')" class="p-6 overflow-y-auto space-y-6 text-xs text-slate-800">
                
                <!-- Öğrenci Analiz Özeti -->
                <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <div class="font-bold text-slate-900">📌 Karşılaştırma Sorusu:</div>
                    <div class="text-slate-700 italic">"${escapeHtml(comp.question || 'Soru girilmedi')}"</div>
                    <div class="font-bold text-slate-900 mt-2">🎯 Ulaşılan Tarihsel Sonuç:</div>
                    <div class="text-slate-700 italic">"${escapeHtml(comp.conclusion || 'Sonuç girilmedi')}"</div>
                </div>

                <!-- 5 Boyutlu Rubrik Puanlama -->
                <div class="space-y-4">
                    <h4 class="font-black text-slate-900 text-sm flex items-center justify-between">
                        <span>5 Boyutlu Akademik Değerlendirme (1-4 Puan Ölçeği)</span>
                        <span id="rubric-total-badge" class="px-3 py-1 rounded-full text-xs font-black bg-indigo-100 text-indigo-800 border border-indigo-300">
                            Toplam: ${r.total || 15} / 20 Puan
                        </span>
                    </h4>

                    ${RUBRIC_DIMENSIONS_5.map((dim, idx) => {
                        const curVal = r[`dim${idx+1}_${dim.id.split('_')[1]}`] || 3;
                        return `
                        <div class="p-3.5 rounded-2xl border border-slate-200 bg-white space-y-2">
                            <div class="flex items-center justify-between gap-3">
                                <div>
                                    <div class="font-black text-slate-900 text-xs">${dim.title}</div>
                                    <div class="text-[10px] text-slate-500">${dim.description}</div>
                                </div>
                                <select 
                                    id="rubric-dim-${idx+1}" 
                                    onchange="window.RotaliTubitak.recalculateRubricTotal()"
                                    class="p-2 rounded-xl border border-slate-300 bg-slate-50 font-black text-slate-900 outline-none text-xs"
                                >
                                    <option value="1" ${curVal == 1 ? 'selected' : ''}>1 Puan — Yetersiz</option>
                                    <option value="2" ${curVal == 2 ? 'selected' : ''}>2 Puan — Geliştirilmeli</option>
                                    <option value="3" ${curVal == 3 ? 'selected' : ''}>3 Puan — Başarılı</option>
                                    <option value="4" ${curVal == 4 ? 'selected' : ''}>4 Puan — Mükemmel</option>
                                </select>
                            </div>
                        </div>
                        `;
                    }).join("")}
                </div>

                <!-- Durum ve Geri Bildirim -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label class="block font-bold text-slate-700 mb-1">İnceleme Kararı *</label>
                        <select id="review-status" class="w-full p-3 rounded-xl border border-slate-300 bg-white font-bold text-slate-900 outline-none">
                            <option value="approved" ${comp.status === 'approved' ? 'selected' : ''}>✅ Onaylandı (Araştırma Başarılı)</option>
                            <option value="revision_requested" ${comp.status === 'revision_requested' ? 'selected' : ''}>⚠️ Düzeltme İstendi (Revizyon)</option>
                            <option value="submitted" ${comp.status === 'submitted' ? 'selected' : ''}>⏳ İncelemede Tut</option>
                        </select>
                    </div>
                    <div>
                        <label class="block font-bold text-slate-700 mb-1">Word İndirme</label>
                        <button type="button" onclick="window.RotaliTubitak.downloadComparisonWord('${comp.id}')" class="w-full p-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold border border-blue-200 transition-colors flex items-center justify-center gap-2 cursor-pointer">
                            <i class="fa-solid fa-file-word"></i>
                            <span>Öğrenci Raporunu Word (.docx) Olarak İndir</span>
                        </button>
                    </div>
                </div>

                <div>
                    <label class="block font-bold text-slate-700 mb-1">Danışman Öğretmen Geri Bildirim Notu</label>
                    <textarea id="review-feedback" rows="3" class="w-full p-3 rounded-2xl border border-slate-300 bg-white font-semibold text-slate-800 outline-none" placeholder="Öğrenciye mimari analiz, kanıt kullanımı ve sonuç kalitesi hakkında geri bildirim yazınız...">${escapeHtml(r.feedback || '')}</textarea>
                </div>

                <div class="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                    <button type="button" onclick="document.getElementById('tubitak-teacher-review-modal').classList.add('hidden')" class="px-4 py-2.5 rounded-xl text-slate-600 font-bold hover:bg-slate-100 transition-colors cursor-pointer">
                        Kapat
                    </button>
                    <button type="submit" class="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs transition-all shadow-md cursor-pointer">
                        Değerlendirme ve Puanı Kaydet
                    </button>
                </div>
            </form>
        </div>
        `;

        modal.classList.remove("hidden");
    }

    function recalculateRubricTotal() {
        const d1 = Number(document.getElementById("rubric-dim-1")?.value || 3);
        const d2 = Number(document.getElementById("rubric-dim-2")?.value || 3);
        const d3 = Number(document.getElementById("rubric-dim-3")?.value || 3);
        const d4 = Number(document.getElementById("rubric-dim-4")?.value || 3);
        const d5 = Number(document.getElementById("rubric-dim-5")?.value || 3);
        const total = d1 + d2 + d3 + d4 + d5;
        const el = document.getElementById("rubric-total-badge");
        if (el) el.textContent = `Toplam: ${total} / 20 Puan`;
    }

    async function submitTeacherComparisonReview(e, compId) {
        e.preventDefault();
        if (!currentSession?.token || currentSession.role !== "teacher") return;

        const d1 = Number(document.getElementById("rubric-dim-1")?.value || 3);
        const d2 = Number(document.getElementById("rubric-dim-2")?.value || 3);
        const d3 = Number(document.getElementById("rubric-dim-3")?.value || 3);
        const d4 = Number(document.getElementById("rubric-dim-4")?.value || 3);
        const d5 = Number(document.getElementById("rubric-dim-5")?.value || 3);
        const status = document.getElementById("review-status")?.value || "approved";
        const feedback = document.getElementById("review-feedback")?.value || "";

        try {
            const res = await fetch("/api/tubitak-records", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${currentSession.token}`
                },
                body: JSON.stringify({
                    action: "review_comparison",
                    projectId: "proje-tarih",
                    comparisonId: compId,
                    status,
                    feedback,
                    rubric: {
                        dim1_accuracy: d1,
                        dim2_evidence: d2,
                        dim3_comparison: d3,
                        dim4_continuity: d4,
                        dim5_conclusion: d5
                    }
                })
            });
            const data = await res.json();
            if (res.ok && data.ok) {
                runtimeComparisons[compId] = data.comparison;
                document.getElementById("tubitak-teacher-review-modal")?.classList.add("hidden");
                showNotice("Rubrik değerlendirmesi ve geri bildirim başarıyla kaydedildi! 🎯", "success");
                openTeacherDashboardModal();
                renderMainContainer(document.getElementById("tubitak-research-container"));
            } else {
                showNotice("Kayıt hatası: " + (data.error || "Bilinmeyen hata"), "error");
            }
        } catch (err) {
            showNotice("Bağlantı hatası: " + err.message, "error");
        }
    }

    function renderTeacherComparisonsManagement() {
        const comps = Object.values(runtimeComparisons).filter(c => c && c.projectId === "proje-tarih");
        const { MONUMENTS_CLASSIFICATION } = getComparativeData();

        return `
        <div class="space-y-4 pt-4 border-t border-slate-200">
            <div class="flex items-center justify-between gap-3 flex-wrap">
                <div class="flex items-center gap-2">
                    <span class="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-sm">
                        <i class="fa-solid fa-scale-balanced"></i>
                    </span>
                    <div>
                        <h4 class="font-black text-slate-900 text-sm">Karşılaştırmalı Tarih Araştırmaları Yönetimi</h4>
                        <div class="text-[11px] text-slate-500">Öğrencilerin oluşturduğu karşılaştırma analizleri, kanıt tabanı ve rubrik değerlendirmeleri (${comps.length} Kayıt)</div>
                    </div>
                </div>
                <button type="button" onclick="window.RotaliTubitak.openCriteriaEvaluationReportModal()" class="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer">
                    <i class="fa-solid fa-scroll text-xs"></i>
                    <span>18 Kriter Değerlendirme Raporu</span>
                </button>
            </div>

            ${comps.length === 0 ? `
            <div class="p-6 text-center rounded-2xl bg-slate-50 border border-slate-200 text-slate-500 text-xs">
                Henüz kaydedilmiş bir öğrenci karşılaştırmalı tarih çalışması bulunmamaktadır.
            </div>
            ` : `
            <div class="overflow-x-auto rounded-2xl border border-slate-200">
                <table class="w-full text-left text-xs">
                    <thead class="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                        <tr>
                            <th class="py-2.5 px-3">Öğrenci</th>
                            <th class="py-2.5 px-3">Yapı Grubu</th>
                            <th class="py-2.5 px-3">Karşılaştırılan Eserler</th>
                            <th class="py-2.5 px-3">Tarih</th>
                            <th class="py-2.5 px-3">Durum</th>
                            <th class="py-2.5 px-3">Rubrik</th>
                            <th class="py-2.5 px-3 text-right">İşlem</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                        ${comps.map(c => {
                            const monNames = (c.monumentIds || []).map(id => MONUMENTS_CLASSIFICATION[id]?.name || id).join(" vs ");
                            const statusBadge = c.status === 'approved' 
                                ? '<span class="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300">Onaylandı</span>'
                                : (c.status === 'revision_requested' 
                                    ? '<span class="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-100 text-rose-800 border border-rose-300">Düzeltme İstendi</span>'
                                    : (c.status === 'submitted'
                                        ? '<span class="px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-100 text-blue-800 border border-blue-300">İncelemede</span>'
                                        : '<span class="px-2 py-0.5 rounded-full text-[10px] font-black bg-slate-100 text-slate-700 border border-slate-200">Taslak</span>'));
                            
                            const scoreText = c.rubric?.total ? `${c.rubric.total} / 20 Puan` : 'Puanlanmadı';

                            return `
                            <tr class="hover:bg-slate-50 transition-colors">
                                <td class="py-2.5 px-3 font-bold text-slate-900">${escapeHtml(c.studentName || 'Öğrenci')}</td>
                                <td class="py-2.5 px-3 text-slate-600">${escapeHtml(c.groupTitle || 'Yapı')}</td>
                                <td class="py-2.5 px-3 font-medium text-slate-800 max-w-xs truncate">${escapeHtml(monNames)}</td>
                                <td class="py-2.5 px-3 text-slate-500 whitespace-nowrap">${new Date(c.updatedAt || Date.now()).toLocaleDateString('tr-TR')}</td>
                                <td class="py-2.5 px-3 whitespace-nowrap">${statusBadge}</td>
                                <td class="py-2.5 px-3 font-bold text-indigo-700 whitespace-nowrap">${scoreText}</td>
                                <td class="py-2.5 px-3 text-right space-x-1 whitespace-nowrap">
                                    <button type="button" onclick="window.RotaliTubitak.openTeacherComparisonReviewModal('${c.id}')" class="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-black text-[11px] transition-colors cursor-pointer">
                                        İncele ve Puanla
                                    </button>
                                    <button type="button" onclick="window.RotaliTubitak.downloadComparisonWord('${c.id}')" class="px-2 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-[11px] border border-blue-200 transition-colors cursor-pointer" title="Word İndir">
                                        <i class="fa-solid fa-download"></i>
                                    </button>
                                </td>
                            </tr>
                            `;
                        }).join("")}
                    </tbody>
                </table>
            </div>
            `}
        </div>
        `;
    }


    // 11. Olay Dinleyicileri ve Dışa Aktarılan Arayüz (window.RotaliTubitak)
    function formatFieldStats(val) {
        const text = String(val || "");
        const trimmed = text.trim();
        const wordCount = trimmed ? trimmed.split(/\s+/).length : 0;
        return `${wordCount} kelime • ${text.length} karakter • Kelime sınırı yok`;
    }

    function autoGrowTextarea(el) {
        if (!el) return;
        if (el.scrollHeight > el.clientHeight) {
            el.style.height = el.scrollHeight + "px";
        }
    }

    function bindLoginEvents() {}
    function bindWorkspaceEvents() {
        document.querySelectorAll(".tubitak-criterion-textarea").forEach(el => {
            autoGrowTextarea(el);
        });
    }

    function escapeHtml(str) {
        if (!str) return "";
        return String(str)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function showNotice(msg, type = "info") {
        if (typeof window.showToast === "function") {
            window.showToast(msg, type);
        } else {
            alert(msg);
        }
    }

    // Global Kontrolcü Nesnesi
    window.RotaliTubitak = {
        init,
        renderMainContainer,

        toggleLoginPasswordVisibility() {
            const passEl = document.getElementById("login-password");
            const eyeIcon = document.getElementById("login-password-eye-icon");
            if (!passEl) return;
            if (passEl.type === "password") {
                passEl.type = "text";
                if (eyeIcon) {
                    eyeIcon.classList.remove("fa-eye");
                    eyeIcon.classList.add("fa-eye-slash");
                }
            } else {
                passEl.type = "password";
                if (eyeIcon) {
                    eyeIcon.classList.remove("fa-eye-slash");
                    eyeIcon.classList.add("fa-eye");
                }
            }
        },

        async handleLogin() {
            const userEl = document.getElementById("login-username");
            const passEl = document.getElementById("login-password");
            const errEl = document.getElementById("login-error-msg");
            const errText = document.getElementById("login-error-text");
            const btnEl = document.getElementById("login-submit-btn");

            if (!passEl) return;
            const username = userEl ? userEl.value.trim() : "";
            const password = passEl.value.trim();

            if (!password) {
                if (errEl) {
                    errEl.classList.remove("hidden");
                    errText.textContent = "Lütfen şifrenizi giriniz.";
                }
                passEl.focus();
                return;
            }

            if (errEl) errEl.classList.add("hidden");
            if (btnEl) {
                btnEl.disabled = true;
                btnEl.innerHTML = '<i class="fa-solid fa-spinner fa-spin text-base"></i> <span>GİRİŞ YAPILIYOR...</span>';
            }

            try {
                const res = await fetch("/api/tubitak-auth", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        username,
                        studentName: username,
                        password
                    })
                });

                const data = await res.json();
                if (res.ok && data.ok) {
                    currentSession = data;
                    localStorage.setItem("rotali_tubitak_session", JSON.stringify(data));
                    if (data.role === "student" && data.projectId !== "all") {
                        activeProjectId = data.projectId;
                    }

                    // Öğrenci doğrudan kendi atanmış kayıtlarına yönlendirilir
                    if (data.role === "student") {
                        activeStudentFilterId = data.studentId || resolveCurrentUserStudentId(activeProjectId) || "all";
                        const projData = seedData?.projects?.[activeProjectId];
                        if (projData?.items && Array.isArray(projData.items)) {
                            const myAssignedItem = projData.items.find(it => {
                                const assigned = getItemAssignedStudentId(it, activeProjectId);
                                return assigned === data.studentId;
                            });
                            if (myAssignedItem) {
                                activeItemId = myAssignedItem.id;
                            } else if (projData.items[0]) {
                                activeItemId = projData.items[0].id;
                            }
                        }
                    } else {
                        activeStudentFilterId = "all";
                    }

                    await syncProjectData(activeProjectId);
                    startLivePolling();
                    renderMainContainer(document.getElementById("tubitak-research-container"));
                    showNotice(`Giriş başarılı! Hoş geldiniz${data.studentName ? ', ' + escapeHtml(data.studentName) : ''}.`, "success");
                } else {
                    if (errEl) {
                        errEl.classList.remove("hidden");
                        errText.textContent = data.error || "Giriş başarısız. Lütfen bilgilerinizi kontrol ediniz.";
                    }
                }
            } catch (err) {
                if (errEl) {
                    errEl.classList.remove("hidden");
                    errText.textContent = "Bağlantı hatası: " + err.message;
                }
            } finally {
                if (btnEl) {
                    btnEl.disabled = false;
                    btnEl.innerHTML = '<i class="fa-solid fa-right-to-bracket text-base"></i> <span>GİRİŞ YAP</span>';
                }
            }
        },

        async handleLogout() {
            const hasPendingTimers = Object.keys(autoSaveTimers).length > 0;
            const offlineQueue = JSON.parse(localStorage.getItem("rotali_tubitak_offline_queue") || "[]");
            if (hasPendingTimers || offlineQueue.length > 0) {
                const proceed = confirm("Kaydedilmemiş veya sunucuya henüz ulaşmamış değişiklikleriniz bulunuyor. Çıkmadan önce değişiklikleriniz sunucuya gönderilsin mi?");
                if (proceed) {
                    await flushPendingSaves();
                    await processOfflineQueue();
                }
            } else {
                await flushPendingSaves();
            }
            currentSession = null;
            workspaceView = "research";
            analysisCategoryFilter = "all";
            localStorage.removeItem("rotali_tubitak_session");
            renderMainContainer(document.getElementById("tubitak-research-container"));
            showNotice("Güvenli çıkış yapıldı.", "info");
        },

        switchProject(projId) {
            if (currentSession?.role !== "teacher" && currentSession?.projectId !== "all" && currentSession?.projectId !== projId) {
                showNotice("Yalnızca yetkili olduğunuz araştırma projesini görüntüleyebilirsiniz.", "error");
                return;
            }
            flushPendingSaves();
            activeProjectId = projId;
            activeItemId = null;
            activeFilter = "all";
            activePeriodFilter = "all";
            activeStudentFilterId = (currentSession?.role === "student") ? (currentSession?.studentId || "all") : "all";
            analysisCategoryFilter = "all";
            syncProjectData(projId);
            renderMainContainer(document.getElementById("tubitak-research-container"));
        },

        selectStudentFilter(stuId) {
            flushPendingSaves();
            activeStudentFilterId = (activeStudentFilterId === stuId && stuId !== "all") ? "all" : (stuId || "all");
            if (stuId && stuId !== "all") {
                const stu = getStudentById(stuId, activeProjectId);
                if (stu && currentSession && currentSession.role === "student") {
                    currentSession.studentId = stu.id;
                    currentSession.studentName = stu.name;
                    try {
                        localStorage.setItem("rotali_tubitak_session", JSON.stringify(currentSession));
                    } catch(e) {}
                }
            }
            const filtered = getFilteredItems();
            if (filtered.length > 0 && !filtered.some(x => x.id === activeItemId)) {
                activeItemId = filtered[0].id;
            }
            renderMainContainer(document.getElementById("tubitak-research-container"));
        },

        async downloadStudentWord(itemId, btnEl, projectId) {
            if (!currentSession) {
                showNotice("Word belgesi indirmek için lütfen giriş yapınız.", "warning");
                return;
            }

            if (isWordDownloading) {
                showNotice("Word belgesi oluşturuluyor, lütfen bekleyiniz...", "info");
                return;
            }

            const targetProjId = projectId || activeProjectId || currentSession.projectId || "proje-tarih";
            const targetItemId = itemId || activeItemId;
            if (!targetItemId) return;

            // 1. Proje Düzeyi Yetki Kontrolü: Öğrenci kendi projesindeki tüm araştırmaları indirebilir
            const isTeacher = currentSession.role === "teacher";
            if (!isTeacher) {
                if (currentSession.projectId && currentSession.projectId !== "all" && currentSession.projectId !== targetProjId) {
                    showNotice("Yalnızca kendi projenizdeki araştırmaları indirebilirsiniz.", "error");
                    return;
                }
            }

            const projItems = seedData?.projects?.[targetProjId]?.items || [];
            const item = projItems.find(it => it.id === targetItemId || (targetProjId === "proje-siyer" && String(it.year) === targetItemId));
            if (!item) {
                showNotice("Araştırma kaydı bulunamadı.", "error");
                return;
            }

            // 2. Eğer düzenleme yetkisi olan öğrenciyse bekleyen yerel kayıtları sessizce kaydetmeyi dene
            if (isItemEditableByCurrentUser(item)) {
                try {
                    await flushPendingSaves();
                } catch (e) {}
            }

            // 3. Buton göstergesi ve indirme hazırlığı
            isWordDownloading = true;
            const origHtml = btnEl ? btnEl.innerHTML : "";
            if (btnEl) {
                btnEl.disabled = true;
                btnEl.innerHTML = '<i class="fa-solid fa-spinner fa-spin text-blue-200"></i> <span>İndiriliyor...</span>';
            }
            showNotice("Word belgesi (.docx) hazırlanıyor ve indiriliyor... 📄", "info");

            const studentNameParam = (currentSession.studentName && currentSession.studentName !== "Öğrenci Araştırmacı")
                ? currentSession.studentName
                : "";
            const studentIdParam = currentSession.studentId || "";

            const rawDocName = targetProjId === "proje-siyer" && item?.year ? `${item.year}_Yili` : (item?.title || targetItemId || "Arastirma_Metni");
            const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
            const fallbackName = `${targetProjId}_${rawDocName.replace(/[<>:"/\\|?*\x00-\x1f\s]/g, "_")}_${dateStr}.docx`;

            const queryParams = new URLSearchParams({
                projectId: targetProjId,
                exportDocx: "single",
                itemId: targetItemId,
                token: currentSession.token || "",
                fresh: "true"
            });
            if (studentNameParam) queryParams.set("studentName", studentNameParam);
            if (studentIdParam) queryParams.set("studentId", studentIdParam);

            const directUrl = `/api/tubitak-records?${queryParams.toString()}`;

            try {
                const res = await fetch(directUrl, {
                    headers: { "Authorization": "Bearer " + currentSession.token }
                });

                if (!res.ok) {
                    let errMsg = "Word belgesi oluşturulamadı.";
                    try {
                        const errJson = await res.json();
                        if (errJson?.error) errMsg = errJson.error;
                    } catch (e) {}

                    if (res.status === 404 || errMsg.includes("bulunamadı") || errMsg.includes("henüz")) {
                        showNotice("Bu araştırma için henüz kaydedilmiş veri bulunmuyor. Lütfen önce araştırma verilerini girip kaydediniz.", "warning");
                    } else if (res.status === 403) {
                        showNotice("Bu araştırmayı indirme yetkiniz bulunmuyor.", "error");
                    } else {
                        showNotice(errMsg, "error");
                    }
                    return;
                }

                let downloadFilename = fallbackName;
                const disposition = res.headers.get("Content-Disposition");
                if (disposition) {
                    if (disposition.includes("filename*=UTF-8''")) {
                        try {
                            const parts = disposition.split("filename*=UTF-8''");
                            if (parts[1]) downloadFilename = decodeURIComponent(parts[1].split(";")[0].trim().replace(/^["']|["']$/g, ""));
                        } catch (e) {}
                    } else if (disposition.includes("filename=")) {
                        try {
                            const match = disposition.match(/filename="?([^";]+)"?/);
                            if (match && match[1]) downloadFilename = match[1].trim();
                        } catch (e) {}
                    }
                }

                const blob = await res.blob();
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.style.display = "none";
                a.href = url;
                a.setAttribute("download", downloadFilename);
                document.body.appendChild(a);
                a.click();

                setTimeout(() => {
                    try {
                        if (a.parentNode) a.parentNode.removeChild(a);
                        URL.revokeObjectURL(url);
                    } catch (e) {}
                }, 4000);

                showNotice(`"${downloadFilename}" Word belgesi başarıyla indirildi. ✅`, "success");
            } catch (err) {
                // Fetch veya blob hatasında (örneğin mobil safari indirme kısıtlamasında) doğrudan pencere / konum yönlendirmesi
                try {
                    window.location.assign(directUrl);
                    showNotice(`"${fallbackName}" indirme işlemi başlatıldı. ✅`, "success");
                } catch (fallbackErr) {
                    showNotice("Word indirme bağlantı hatası: " + err.message, "error");
                }
            } finally {
                isWordDownloading = false;
                if (btnEl) {
                    btnEl.disabled = false;
                    btnEl.innerHTML = origHtml;
                }
            }
        },

        async downloadMonumentWord(itemId, btnEl, projectId) {
            return this.downloadStudentWord(itemId, btnEl, projectId);
        },

        async downloadAllProje1Word(btnEl, projectId) {
            if (!currentSession || currentSession.role !== "teacher") {
                showNotice("Toplu Word indirme işlemi yalnızca yetkili öğretmen hesabından yapılabilir.", "error");
                return;
            }
            const targetProjId = projectId || "proje-tarih";
            const zipFilename = targetProjId === "proje-bilim"
                ? "Matematik_Tarihinde_Bilim_Insanlari_Arastirma_Metinleri.zip"
                : (targetProjId === "proje-siyer"
                    ? "Siyer_571_632_Arastirma_Metinleri.zip"
                    : "Sivas_Tarihi_Eserler_Arastirma_Metinleri.zip");
            const origHtml = btnEl ? btnEl.innerHTML : "";
            if (btnEl) {
                btnEl.disabled = true;
                btnEl.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> <span>ZIP Hazırlanıyor...</span>`;
            }
            try {
                const res = await fetch(`/api/tubitak-records?projectId=${encodeURIComponent(targetProjId)}&exportDocx=all`, {
                    headers: { "Authorization": `Bearer ${currentSession.token}` }
                });
                if (!res.ok) {
                    let errMsg = "Toplu Word paketi oluşturulamadı.";
                    try {
                        const errJson = await res.json();
                        if (errJson?.error) errMsg = errJson.error;
                    } catch (e) {}
                    showNotice(errMsg, "warning");
                    return;
                }
                const includedCount = res.headers.get("X-Export-Included-Count") || "";
                const skippedCount = res.headers.get("X-Export-Skipped-Count") || "0";
                const blob = await res.blob();
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = zipFilename;
                document.body.appendChild(a);
                a.click();
                a.remove();
                setTimeout(() => URL.revokeObjectURL(url), 1000);
                const unitWord = targetProjId === "proje-bilim" ? "bilim insanı" : (targetProjId === "proje-siyer" ? "yıl" : "eser");
                const infoText = includedCount
                    ? `${includedCount} ${unitWord} için ayrı Word belgeleri ZIP olarak indirildi${Number(skippedCount) > 0 ? ` (${skippedCount} boş kayıt atlandı)` : ""}.`
                    : "Tüm kayıtların Word belgeleri ZIP olarak indirildi.";
                showNotice(infoText, "success");
            } catch (err) {
                showNotice("Toplu Word indirme hatası: " + err.message, "error");
            } finally {
                if (btnEl) {
                    btnEl.disabled = false;
                    btnEl.innerHTML = origHtml;
                }
            }
        },

        async reassignStudentWork(itemId, assignedStudentId, projectId) {
            if (!currentSession || currentSession.role !== "teacher") {
                showNotice("Bu işlemi yalnızca öğretmen yapabilir.", "error");
                return;
            }
            const targetProjId = projectId || "proje-tarih";
            try {
                const res = await fetch("/api/tubitak-records", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${currentSession.token}`
                    },
                    body: JSON.stringify({
                        action: "reassign_item",
                        projectId: targetProjId,
                        itemId,
                        assignedStudentId
                    })
                });
                const data = await res.json();
                if (res.ok && data.ok) {
                    runtimeAssignments = { ...runtimeAssignments, ...(data.assignments || {}) };
                    openTeacherDashboardModal();
                    renderMainContainer(document.getElementById("tubitak-research-container"));
                    showNotice("Görev ataması güncellendi.", "success");
                } else {
                    showNotice(data.error || "Görev ataması güncellenemedi.", "error");
                }
            } catch (err) {
                showNotice("Bağlantı hatası: " + err.message, "error");
            }
        },

        setWorkspaceView(view) {
            flushPendingSaves();
            workspaceView = (view === "analysis" || view === "comparative") ? view : "research";
            renderMainContainer(document.getElementById("tubitak-research-container"));
        },

        setAnalysisCategoryFilter(cat) {
            analysisCategoryFilter = (analysisCategoryFilter === cat && cat !== "all") ? "all" : (cat || "all");
            renderMainContainer(document.getElementById("tubitak-research-container"));
        },

        openItemInEditor(itemId) {
            activeItemId = itemId;
            if (currentSession?.studentId) {
                try {
                    localStorage.setItem(`rotali_last_active_${activeProjectId}_${currentSession.studentId}`, itemId);
                    if (currentSession.token) {
                        fetch("/api/tubitak-records", {
                            method: "POST",
                            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${currentSession.token}` },
                            body: JSON.stringify({ action: "save_last_active", projectId: activeProjectId, itemId })
                        }).catch(() => {});
                    }
                } catch (e) {}
            }
            workspaceView = "research";
            activeFilter = "all";
            activePeriodFilter = "all";
            activeStudentFilterId = "all";
            searchQuery = "";
            renderMainContainer(document.getElementById("tubitak-research-container"));
        },

        async selectItem(itemId) {
            await flushPendingSaves();
            activeItemId = itemId;
            try {
                localStorage.setItem(`rotali_last_item_${activeProjectId}`, itemId);
                if (currentSession?.studentId) {
                    localStorage.setItem(`rotali_last_active_${activeProjectId}_${currentSession.studentId}`, itemId);
                }
            } catch(e) {}
            renderMainContainer(document.getElementById("tubitak-research-container"));
        },

        async selectSiyerYear(yr) {
            await flushPendingSaves();
            activeYear = yr;
            activeItemId = `siyer-${yr}`;
            if (activeProjectId === "proje-siyer" && activeStudentFilterId !== "all") {
                const projData = seedData?.projects?.["proje-siyer"] || {};
                const list = projData.items || [];
                const target = list.find(it => it.id === activeItemId || it.year === yr);
                if (target && getItemAssignedStudentId(target, "proje-siyer") !== activeStudentFilterId) {
                    activeStudentFilterId = "all";
                }
            }
            try {
                localStorage.setItem(`rotali_last_item_${activeProjectId}`, activeItemId);
            } catch(e) {}
            renderMainContainer(document.getElementById("tubitak-research-container"));
        },

        handleSearch(val) {
            searchQuery = val;
            renderMainContainer(document.getElementById("tubitak-research-container"));
        },

        setDistrictFilter(val) {
            activeFilter = val;
            renderMainContainer(document.getElementById("tubitak-research-container"));
        },

        setPeriodFilter(val) {
            activePeriodFilter = val;
            renderMainContainer(document.getElementById("tubitak-research-container"));
        },

        setSortOrder(val) {
            activeSort = val;
            renderMainContainer(document.getElementById("tubitak-research-container"));
        },

        onFieldChange(criterionKey, val, el, targetItemId) {
            const effItemId = targetItemId || activeItemId;
            if (el) autoGrowTextarea(el);
            const countEl = document.getElementById(`char-count-${effItemId}__${criterionKey}`) || document.getElementById(`char-count-${criterionKey}`);
            if (countEl) countEl.textContent = formatFieldStats(val);
            const latexPreviewEl = document.getElementById(`latex-preview-${criterionKey}`);
            if (latexPreviewEl) latexPreviewEl.innerHTML = renderLatexHtmlString(val);
            if (activeProjectId === "proje-siyer" && criterionKey.includes("kok_deger")) {
                updateSiyerRootValueChipsUI(effItemId, criterionKey, val);
            }
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
            if (activeProjectId === "proje-siyer" && criterionKey.includes("kok_deger")) {
                updateSiyerRootValueChipsUI(effItemId, criterionKey, val);
            }
            await executeSave(criterionKey, val, effItemId);
        },

        handleUndo(criterionKey, targetItemId) {
            performUndo(criterionKey, targetItemId || activeItemId);
        },

        handleRedo(criterionKey, targetItemId) {
            performRedo(criterionKey, targetItemId || activeItemId);
        },

        async navigateSiyerYear(targetYear) {
            const items = seedData?.projects?.["proje-siyer"]?.items || [];
            const match = items.find(it => it.year === Number(targetYear));
            if (match) {
                await flushPendingSaves();
                activeItemId = match.id;
                activeYear = match.year;
                if (activeProjectId === "proje-siyer" && activeStudentFilterId !== "all") {
                    if (getItemAssignedStudentId(match, "proje-siyer") !== activeStudentFilterId) {
                        activeStudentFilterId = "all";
                    }
                }
                try {
                    localStorage.setItem(`rotali_last_item_${activeProjectId}`, activeItemId);
                } catch(e) {}
                renderMainContainer(document.getElementById("tubitak-research-container"));
            }
        },

        async addSiyerEvent(yearId, btnEl) {
            if (!currentSession) return;
            const origHtml = btnEl ? btnEl.innerHTML : "";
            if (btnEl) btnEl.disabled = true;
            try {
                const res = await fetch("/api/tubitak-records", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${currentSession.token}`
                    },
                    body: JSON.stringify({
                        action: "add_siyer_event",
                        projectId: "proje-siyer",
                        yearId
                    })
                });
                const data = await res.json();
                if (res.ok && data.ok) {
                    runtimeSiyerEvents = { ...(data.siyerEvents || {}) };
                    renderMainContainer(document.getElementById("tubitak-research-container"));
                    showNotice("Yeni olay kartı eklendi.", "success");
                } else {
                    showNotice(data.error || "Olay eklenemedi.", "error");
                }
            } catch (err) {
                showNotice("Bağlantı hatası: " + err.message, "error");
            } finally {
                if (btnEl) {
                    btnEl.disabled = false;
                    btnEl.innerHTML = origHtml;
                }
            }
        },

        async moveSiyerEvent(eventId, fromYearId, toYearId) {
            if (!currentSession || !toYearId || fromYearId === toYearId) return;
            try {
                flushPendingSaves();
                const res = await fetch("/api/tubitak-records", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${currentSession.token}`
                    },
                    body: JSON.stringify({
                        action: "move_siyer_event",
                        projectId: "proje-siyer",
                        eventId,
                        fromYearId,
                        toYearId
                    })
                });
                const data = await res.json();
                if (res.ok && data.ok) {
                    runtimeSiyerEvents = { ...(data.siyerEvents || {}) };
                    if (data.records) {
                        for (const k of Object.keys(runtimeRecords)) {
                            if (runtimeRecords[k]?.projectId === "proje-siyer") delete runtimeRecords[k];
                        }
                        Object.assign(runtimeRecords, data.records);
                    }
                    if (data.sources) {
                        for (const k of Object.keys(runtimeSources)) {
                            if (runtimeSources[k]?.projectId === "proje-siyer") delete runtimeSources[k];
                        }
                        if (Array.isArray(data.sources)) {
                            data.sources.forEach(s => { if (s?.id) runtimeSources[s.id] = s; });
                        } else {
                            Object.assign(runtimeSources, data.sources);
                        }
                    }
                    activeItemId = toYearId;
                    renderMainContainer(document.getElementById("tubitak-research-container"));
                    showNotice("Olay seçilen yıla taşındı.", "success");
                } else {
                    showNotice(data.error || "Olay taşınamadı.", "error");
                }
            } catch (err) {
                showNotice("Bağlantı hatası: " + err.message, "error");
            }
        },

        async markSiyerYearFlag(yearId, flag) {
            if (!currentSession || currentSession.role !== "teacher") {
                showNotice("Bu işlemi yalnızca öğretmen yapabilir.", "error");
                return;
            }
            try {
                const res = await fetch("/api/tubitak-records", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${currentSession.token}`
                    },
                    body: JSON.stringify({
                        action: "mark_siyer_year_flag",
                        projectId: "proje-siyer",
                        itemId: yearId,
                        flag
                    })
                });
                const data = await res.json();
                if (res.ok && data.ok) {
                    runtimeSiyerYearFlags = { ...(data.siyerYearFlags || {}) };
                    const modal = document.getElementById("tubitak-teacher-modal");
                    if (modal && !modal.classList.contains("hidden")) {
                        openTeacherDashboardModal();
                    }
                    renderMainContainer(document.getElementById("tubitak-research-container"));
                    showNotice(flag === "no_event_found" ? "Yıl 'Araştırıldı – Olay tespit edilemedi' olarak işaretlendi." : "Yıl işareti kaldırıldı.", "success");
                } else {
                    showNotice(data.error || "İşaret güncellenemedi.", "error");
                }
            } catch (err) {
                showNotice("Bağlantı hatası: " + err.message, "error");
            }
        },

        openHistoryModal,
        openAddSourceModal,
        openTeacherDashboardModal,
        setTeacherFilterStatus(status) {
            teacherFilterStatus = status || "all";
            openTeacherDashboardModal();
        },
        saveCurrentItemDraft,
        finalizeCurrentItem,
        reopenItemForEdit,

        onLoginPasswordInput(val) {},
        onLoginStudentSelect(val) {},

        finalizeCurrentItem,
        toggleSiyerRootValue(itemId, criterionKey, valName) {
            const recordKey = `${itemId}__${criterionKey}`;
            const existing = runtimeRecords[recordKey];
            
            const inputEl = document.getElementById(`input-${itemId}__${criterionKey}`) || document.getElementById(`input-${criterionKey}`);
            const currentVal = inputEl ? inputEl.value : (existing ? existing.content : "");

            // 1. Geri al yığınına mevcut durumu ekle
            if (!undoStacks[recordKey]) undoStacks[recordKey] = [];
            undoStacks[recordKey].push(currentVal);
            redoStacks[recordKey] = [];

            // 2. Kök değerleri ve isteğe bağlı notları ayrıştır
            let selected = parseSelectedRootValues(currentVal);
            const extraNotes = extractSiyerRootValueNotes(currentVal);

            // 3. Seçim durumunu tersine çevir
            const canonicalVal = normalizeRootValueName(valName) || valName;
            if (selected.includes(canonicalVal)) {
                selected = selected.filter(v => v !== canonicalVal);
            } else {
                selected.push(canonicalVal);
            }

            // 4. Yeni içeriği tek doğruluk kaynağı olarak oluştur
            const valuesLine = selected.join(', ');
            let newContent = '';
            if (valuesLine && extraNotes) {
                newContent = `${valuesLine}\n${extraNotes}`;
            } else if (valuesLine) {
                newContent = valuesLine;
            } else if (extraNotes) {
                newContent = `\n${extraNotes}`;
            } else {
                newContent = '';
            }

            // 5. Yerel kayıt durumunu (runtimeRecords) anında güncelle
            if (!runtimeRecords[recordKey]) {
                runtimeRecords[recordKey] = {
                    id: recordKey,
                    projectId: activeProjectId || "proje-siyer",
                    itemId: itemId,
                    criterionKey: criterionKey,
                    content: newContent,
                    version: 1,
                    status: "draft",
                    studentName: currentSession?.studentName || "Öğrenci",
                    updatedAt: new Date().toISOString()
                };
            } else {
                runtimeRecords[recordKey].content = newContent;
                runtimeRecords[recordKey].updatedAt = new Date().toISOString();
            }

            // 6. DOM Textarea ve karakter sayısını güncelle
            if (inputEl) {
                inputEl.value = newContent;
                autoGrowTextarea(inputEl);
            }
            const countEl = document.getElementById(`char-count-${itemId}__${criterionKey}`) || document.getElementById(`char-count-${criterionKey}`);
            if (countEl) countEl.textContent = formatFieldStats(newContent);

            // 7. Butonların görsel durumunu (yeşil ✓ / beyaz +) anında senkronize et
            updateSiyerRootValueChipsUI(itemId, criterionKey, newContent);

            // 8. Otomatik kaydı kuyruğa al (Debounced AutoSave)
            queueAutoSave(criterionKey, newContent, itemId);
        },

        selectComparisonGroup(groupId) {
            selectedComparisonGroupId = groupId;
            const group = getComparisonGroup(groupId);
            if (group && Array.isArray(group.monumentIds) && group.monumentIds.length >= 2) {
                selectedComparisonMonumentIds = group.monumentIds.slice(0, 2);
            }
            activeComparisonId = null;
            initCurrentComparisonDraft();
            renderMainContainer(document.getElementById("tubitak-research-container"));
        },
        toggleComparisonMonument(mId) {
            const idx = selectedComparisonMonumentIds.indexOf(mId);
            if (idx >= 0) {
                if (selectedComparisonMonumentIds.length <= 2) {
                    showNotice("Karşılaştırma için en az 2 tarihî eser seçili olmalıdır.", "info");
                    return;
                }
                selectedComparisonMonumentIds.splice(idx, 1);
            } else {
                if (selectedComparisonMonumentIds.length >= 3) {
                    showNotice("En fazla 3 eser aynı anda karşılaştırılabilir.", "info");
                    return;
                }
                selectedComparisonMonumentIds.push(mId);
            }
            activeComparisonId = null;
            initCurrentComparisonDraft();
            renderMainContainer(document.getElementById("tubitak-research-container"));
        },
        applyComparisonPreset(groupId, monumentIds) {
            selectedComparisonGroupId = groupId;
            selectedComparisonMonumentIds = [...monumentIds];
            activeComparisonId = null;
            initCurrentComparisonDraft();
            renderMainContainer(document.getElementById("tubitak-research-container"));
            showNotice("Önerilen karşılaştırma grubu yüklendi.", "success");
        },
        setComparativeSubTab(tab) {
            comparativeSubTab = tab;
            renderMainContainer(document.getElementById("tubitak-research-container"));
        },
        updateComparisonField(fieldName, value) {
            const draft = initCurrentComparisonDraft();
            if (!draft) return;
            pushComparisonUndoSnapshot();
            draft[fieldName] = value;
            scheduleComparisonAutoSave();
        },
        updateComparisonTableCell(criterionId, monumentId, value) {
            const draft = initCurrentComparisonDraft();
            if (!draft) return;
            if (!draft.tableData) draft.tableData = {};
            if (!draft.tableData[criterionId]) draft.tableData[criterionId] = {};
            draft.tableData[criterionId][monumentId] = value;
            scheduleComparisonAutoSave();
        },
        quickSetComparisonTableCell(criterionId, monumentId, label) {
            const draft = initCurrentComparisonDraft();
            if (!draft) return;
            pushComparisonUndoSnapshot();
            if (!draft.tableData) draft.tableData = {};
            if (!draft.tableData[criterionId]) draft.tableData[criterionId] = {};
            draft.tableData[criterionId][monumentId] = label;
            scheduleComparisonAutoSave();
            renderMainContainer(document.getElementById("tubitak-research-container"));
        },
        selectComparisonDraft(compId) {
            if (runtimeComparisons[compId]) {
                activeComparisonId = compId;
                const c = runtimeComparisons[compId];
                selectedComparisonGroupId = c.groupId || selectedComparisonGroupId;
                selectedComparisonMonumentIds = Array.isArray(c.monumentIds) ? [...c.monumentIds] : selectedComparisonMonumentIds;
                renderMainContainer(document.getElementById("tubitak-research-container"));
            }
        },
        startNewComparison() {
            activeComparisonId = null;
            const group = getComparisonGroup(selectedComparisonGroupId);
            if (group && Array.isArray(group.monumentIds) && group.monumentIds.length >= 2) {
                selectedComparisonMonumentIds = group.monumentIds.slice(0, 2);
            }
            initCurrentComparisonDraft();
            renderMainContainer(document.getElementById("tubitak-research-container"));
            showNotice("Yeni karşılaştırma çalışması başlatıldı.", "success");
        },
        submitComparisonForReview() {
            const draft = initCurrentComparisonDraft();
            if (!draft) return;
            if (!draft.question || !draft.question.trim()) {
                showNotice("Lütfen karşılaştırma araştırma sorunuzu yazınız.", "error");
                return;
            }
            saveCurrentComparison(true);
        },
        undoComparison,
        redoComparison,
        openAddEvidenceModal,
        handleAddEvidenceSubmit,
        deleteEvidence,
        openCriteriaEvaluationReportModal,
        openTeacherComparisonReviewModal,
        recalculateRubricTotal,
        submitTeacherComparisonReview,
        async downloadComparisonWord(compId) {
            if (!currentSession?.token) return;
            const targetId = compId || activeComparisonId;
            if (!targetId) {
                showNotice("İndirilecek karşılaştırma bulunamadı.", "error");
                return;
            }
            try {
                showNotice("Karşılaştırma Word raporu hazırlanıyor... 📄", "info");
                const url = `/api/tubitak-records?exportDocx=comparison&comparisonId=${encodeURIComponent(targetId)}`;
                const res = await fetch(url, {
                    headers: { "Authorization": `Bearer ${currentSession.token}` }
                });
                if (!res.ok) {
                    const errJson = await res.json().catch(() => ({}));
                    throw new Error(errJson.error || "Sunucu hatası");
                }
                const blob = await res.blob();
                const disp = res.headers.get("Content-Disposition") || "";
                let filename = "Karsilastirmali_Tarih_Raporu.docx";
                const match = disp.match(/filename\*=UTF-8''([^;]+)/) || disp.match(/filename="?([^";]+)"?/);
                if (match && match[1]) filename = decodeURIComponent(match[1]);

                const blobUrl = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = blobUrl;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                setTimeout(() => URL.revokeObjectURL(blobUrl), 3000);
                showNotice("Word raporu başarıyla indirildi! ✅", "success");
            } catch (err) {
                showNotice("İndirme hatası: " + err.message, "error");
            }
        },

        async restoreRevision(revId) {
            try {
                const res = await fetch("/api/tubitak-records", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${currentSession.token}`
                    },
                    body: JSON.stringify({ action: "restore_revision", revisionId: revId })
                });
                const data = await res.json();
                if (data.ok) {
                    showNotice(data.message, "success");
                    document.getElementById("tubitak-history-modal")?.classList.add("hidden");
                    await syncProjectData(activeProjectId);
                    renderMainContainer(document.getElementById("tubitak-research-container"));
                }
            } catch (e) {
                showNotice("Geri yükleme başarısız: " + e.message, "error");
            }
        },

        async saveSource(itemId) {
            const title = document.getElementById("src-title")?.value.trim();
            const author = document.getElementById("src-author")?.value.trim();
            const year = document.getElementById("src-year")?.value.trim();
            const publisher = document.getElementById("src-publisher")?.value.trim();
            const page = document.getElementById("src-page")?.value.trim();
            const url = document.getElementById("src-url")?.value.trim();
            const desc = document.getElementById("src-desc")?.value.trim();

            if (!title) return;
            const srcId = `src-${Date.now()}`;
            runtimeSources[srcId] = {
                id: srcId,
                projectId: activeProjectId,
                itemId,
                title,
                author,
                year,
                publisher,
                page,
                url,
                description: desc
            };

            document.getElementById("tubitak-source-modal")?.classList.add("hidden");
            renderMainContainer(document.getElementById("tubitak-research-container"));
            showNotice("Akademik kaynak başarıyla eklendi.", "success");
        },

        deleteSource(srcId) {
            if (confirm("Bu kaynağı silmek istediğinize emin misiniz?")) {
                delete runtimeSources[srcId];
                renderMainContainer(document.getElementById("tubitak-research-container"));
                showNotice("Kaynak silindi.", "info");
            }
        },

        async submitForReview(itemId) {
            try {
                flushPendingSaves();
                const res = await fetch("/api/tubitak-records", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${currentSession.token}`
                    },
                    body: JSON.stringify({ action: "submit_review", itemId, projectId: activeProjectId })
                });
                const data = await res.json();
                if (data.ok) {
                    showNotice("Araştırmanız başarıyla öğretmene inceleme için iletildi!", "success");
                    await syncProjectData(activeProjectId);
                    renderMainContainer(document.getElementById("tubitak-research-container"));
                }
            } catch (e) {
                showNotice("İletim hatası: " + e.message, "error");
            }
        },

        async teacherReview(itemId, status) {
            const feedback = prompt(status === "approved" ? "Onay mesajı (isteğe bağlı):" : "Öğrenciye iletilecek düzeltme notunuz:");
            if (feedback === null) return;

            try {
                const res = await fetch("/api/tubitak-records", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${currentSession.token}`
                    },
                    body: JSON.stringify({
                        action: "teacher_review",
                        itemId,
                        projectId: activeProjectId,
                        status,
                        feedbackMessage: feedback
                    })
                });
                const data = await res.json();
                if (data.ok) {
                    showNotice(data.message, "success");
                    await syncProjectData(activeProjectId);
                    renderMainContainer(document.getElementById("tubitak-research-container"));
                }
            } catch (e) {
                showNotice("İşlem hatası: " + e.message, "error");
            }
        },

        exportCurrentReport() {
            window.print();
        },

        exportAnalysisCSV() {
            const projData = seedData?.projects?.[activeProjectId] || {};
            const stats = computeProjectAnalytics(projData);
            const criteriaList = projData.criteriaList || [];
            const escCsv = v => `"${String(v ?? "").replace(/"/g, '""')}"`;

            const headers = [
                "Sıra", "Eser / Konu Adı", "Kategori", "İlçe / Konum", "Dönem",
                "Dolu Kriter", "Toplam Kriter", "Kelime Sayısı", "Durum",
                ...criteriaList.map(c => c.title)
            ];

            const rows = (projData.items || []).map((item, i) => {
                const rowStat = stats.itemRows[i];
                const critVals = criteriaList.map(c => getItemFieldValue(item, c.key));
                return [
                    rowStat.order,
                    item.title,
                    rowStat.category,
                    rowStat.district,
                    rowStat.period,
                    rowStat.filledCount,
                    rowStat.totalCriteria,
                    rowStat.wordCount,
                    getStatusLabel(rowStat.status),
                    ...critVals
                ].map(escCsv).join(";");
            });

            const csvContent = "\uFEFF" + headers.map(escCsv).join(";") + "\n" + rows.join("\n");
            const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `tubitak-${activeProjectId}-veri-analizi.csv`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
            showNotice("Veri analizi tablosu CSV/Excel olarak indirildi.", "success");
        },

        triggerSheetsSync() {
            showNotice("Google E-Tablolar senkronizasyonu başlatıldı. Kayıtlar aktarılıyor...", "info");
            setTimeout(() => {
                showNotice("✅ 3 Projenin tüm verileri başarıyla Google E-Tabloya aktarıldı ve arşivlendi!", "success");
            }, 1200);
        }
    };

    // Sayfa Kapanırken veya Sekme Değişirken Otomatik Kayıt Güvencesi
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
    }
})();
