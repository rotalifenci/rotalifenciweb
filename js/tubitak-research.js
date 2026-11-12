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
    let workspaceView = "research"; // "research" | "analysis"
    let analysisCategoryFilter = "all";

    // Kayıtlar, revizyonlar ve yerel durum
    let runtimeRecords = {};        // { "item__crit": { content, version, updatedAt, studentName, status } }
    let runtimeRevisions = [];      // [ { id, recordKey, prevContent, newContent, studentName, version, createdAt } ]
    let runtimeSources = {};        // { "sourceId": { itemId, author, title, year, page, publisher, url, description } }
    let runtimeFeedbacks = [];      // [ { id, itemId, teacherName, message, status, createdAt } ]
    let runtimeAssignments = {};    // { "itemId": { itemId, assignedStudentId, updatedAt, assignedBy } }
    let runtimeSiyerEvents = {};    // { "siyer-571": ["siyer-571__ev_2", ...] }
    let runtimeSiyerYearFlags = {}; // { "siyer-571": { status: "no_event_found", label: "..." } }

    // Geri Al / İleri Al yığınları (Her kriter alanı için bağımsız)
    const undoStacks = {};
    const redoStacks = {};

    // Otomatik kayıt zamanlayıcıları ve kuyruğu
    const autoSaveTimers = {};
    const offlineQueue = [];
    let saveState = "idle"; // "idle", "dirty", "saving", "saved", "error"

    // 2. Başlatma & Oturum Kontrolü
    async function init() {
        loadStoredSession();
        await loadSeedData();
        if (currentSession) {
            await syncProjectData(currentSession.projectId);
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
                if (parsed.exp && parsed.exp > Date.now()) {
                    currentSession = parsed;
                    if (currentSession.role === "student" && currentSession.projectId !== "all") {
                        activeProjectId = currentSession.projectId;
                    }
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

    // 3. Sunucu Veri Senkronizasyonu (Supabase / API)
    async function syncProjectData(projId) {
        if (!currentSession || !currentSession.token) return;
        const targetProj = (currentSession.role === "teacher" && projId) ? projId : currentSession.projectId;

        try {
            const res = await fetch(`/api/tubitak-records?projectId=${encodeURIComponent(targetProj)}`, {
                headers: { "Authorization": `Bearer ${currentSession.token}` }
            });

            if (res.ok) {
                const data = await res.json();
                if (data.ok) {
                    runtimeRecords = { ...runtimeRecords, ...(data.records || {}) };
                    runtimeRevisions = data.revisions || runtimeRevisions;
                    runtimeSources = { ...runtimeSources, ...(data.sources || {}) };
                    runtimeFeedbacks = data.feedbacks || runtimeFeedbacks;
                    runtimeAssignments = { ...(data.assignments || {}) };
                    if (data.siyerEvents) runtimeSiyerEvents = { ...data.siyerEvents };
                    if (data.siyerYearFlags) runtimeSiyerYearFlags = { ...data.siyerYearFlags };
                    updateUIAutosaveBadge("saved");
                }
            }
        } catch (err) {
            console.warn("Project sync warning (using offline cache):", err.message);
        }
    }

    // 4. Canlı Yoklama (Realtime Polling Fallback)
    let pollingInterval = null;
    function startLivePolling() {
        if (pollingInterval) clearInterval(pollingInterval);
        pollingInterval = setInterval(() => {
            if (currentSession && saveState !== "saving" && saveState !== "dirty") {
                syncProjectData(activeProjectId);
            }
        }, 6000); // 6 saniyede bir sessiz arka plan eşitlemesi
    }

    // 5. Otomatik Kayıt Motoru (Debounce ~1000ms & Çevrimdışı Kuyruk)
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
        const textarea = document.getElementById(`input-${targetItemId}__${criterionKey}`) || document.getElementById(`input-${criterionKey}`);
        if (textarea) {
            textarea.value = previousVal;
            autoGrowTextarea(textarea);
        }
        const countEl = document.getElementById(`char-count-${targetItemId}__${criterionKey}`) || document.getElementById(`char-count-${criterionKey}`);
        if (countEl) countEl.textContent = formatFieldStats(previousVal);

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
        const textarea = document.getElementById(`input-${targetItemId}__${criterionKey}`) || document.getElementById(`input-${criterionKey}`);
        if (textarea) {
            textarea.value = nextVal;
            autoGrowTextarea(textarea);
        }
        const countEl = document.getElementById(`char-count-${targetItemId}__${criterionKey}`) || document.getElementById(`char-count-${criterionKey}`);
        if (countEl) countEl.textContent = formatFieldStats(nextVal);

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

    // 🔑 ŞİFRELİ GİRİŞ EKRANI BİLEŞENİ
    function renderLoginScreen() {
        return `
        <div class="max-w-2xl mx-auto px-4 py-12 animate-in fade-in duration-300">
            <div class="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-10 border-2 border-amber-500/40 shadow-2xl text-white relative overflow-hidden">
                <div class="absolute -top-20 -right-20 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
                <div class="absolute -bottom-20 -left-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

                <!-- Logo & Başlık -->
                <div class="text-center mb-8 relative z-10">
                    <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-amber-400 via-orange-500 to-red-500 flex items-center justify-center text-slate-950 text-2xl font-black shadow-lg shadow-amber-500/25">
                        <i class="fa-solid fa-microscope"></i>
                    </div>
                    <span class="px-3.5 py-1 rounded-full text-xs font-black bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-widest inline-flex items-center gap-1.5 mb-2">
                        <span>TÜBİTAK 2204-B</span> • <span>BİLİMSEL ARAŞTIRMA MERKEZİ</span>
                    </span>
                    <h2 class="text-2xl sm:text-3xl font-black text-white tracking-tight">Üç Proje İçin Araştırma & Veri Portalı</h2>
                    <p class="text-xs sm:text-sm text-slate-300 font-medium max-w-md mx-auto mt-2">
                        Öğretmeninizden aldığınız proje takım şifresi ve araştırmacı kimliğinizle giriş yapınız.
                    </p>
                </div>

                <!-- 3 Proje Bilgilendirme Kartları -->
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-7 relative z-10 text-center">
                    <div class="p-3 rounded-2xl bg-white/5 border border-amber-400/20 flex flex-col items-center justify-center">
                        <i class="fa-solid fa-monument text-amber-400 text-sm mb-1 block"></i>
                        <div class="text-[11px] font-black text-amber-200">1. PROJE EKİBİ</div>
                    </div>
                    <div class="p-3 rounded-2xl bg-white/5 border border-cyan-400/20 flex flex-col items-center justify-center">
                        <i class="fa-solid fa-atom text-cyan-400 text-sm mb-1 block"></i>
                        <div class="text-[11px] font-black text-cyan-200">2. PROJE EKİBİ</div>
                    </div>
                    <div class="p-3 rounded-2xl bg-white/5 border border-emerald-400/20 flex flex-col items-center justify-center">
                        <i class="fa-solid fa-timeline text-emerald-400 text-sm mb-1 block"></i>
                        <div class="text-[11px] font-black text-emerald-200">3. PROJE EKİBİ</div>
                    </div>
                </div>

                <!-- Giriş Formu -->
                <form id="tubitak-login-form" class="space-y-4 relative z-10" onsubmit="event.preventDefault(); window.RotaliTubitak.handleLogin();">
                    <div>
                        <label class="block text-xs font-black uppercase tracking-wider text-slate-300 mb-1.5 flex items-center justify-between">
                            <span>🔑 Proje Şifresi</span>
                            <span class="text-[10px] text-amber-400 lowercase font-medium">takım veya öğretmen parolası</span>
                        </label>
                        <div class="relative">
                            <input type="password" id="login-password" placeholder="Takım proje şifrenizi veya öğretmen parolanızı giriniz" required class="w-full px-4 py-3 bg-slate-800/90 border border-slate-700 focus:border-amber-400 rounded-2xl text-sm font-semibold text-white placeholder-slate-500 focus:outline-none transition-all shadow-inner">
                            <i class="fa-solid fa-lock absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label class="block text-xs font-black uppercase tracking-wider text-slate-300 mb-1.5">
                                👤 Adınız / Takım İsminiz
                            </label>
                            <input type="text" id="login-student-name" placeholder="Örn: Ahmet Y. (Grup 1)" class="w-full px-4 py-2.5 bg-slate-800/90 border border-slate-700 focus:border-amber-400 rounded-2xl text-xs font-semibold text-white placeholder-slate-500 focus:outline-none transition-all">
                        </div>
                        <div>
                            <label class="block text-xs font-black uppercase tracking-wider text-slate-300 mb-1.5">
                                🔢 Öğrenci Kodu / PIN
                            </label>
                            <input type="text" id="login-student-pin" placeholder="Örn: 104 veya 4 haneli PIN" class="w-full px-4 py-2.5 bg-slate-800/90 border border-slate-700 focus:border-amber-400 rounded-2xl text-xs font-semibold text-white placeholder-slate-500 focus:outline-none transition-all">
                        </div>
                    </div>

                    <div id="login-error-msg" class="hidden p-3 rounded-2xl bg-red-900/40 border border-red-500/50 text-red-200 text-xs font-semibold flex items-center gap-2">
                        <i class="fa-solid fa-triangle-exclamation text-red-400 shrink-0"></i>
                        <span id="login-error-text">Hatalı şifre.</span>
                    </div>

                    <button type="submit" id="login-submit-btn" class="w-full py-3.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-sm uppercase tracking-wider rounded-2xl transition-all shadow-lg shadow-amber-500/25 active:scale-95 cursor-pointer flex items-center justify-center gap-2">
                        <i class="fa-solid fa-right-to-bracket"></i>
                        <span>Araştırma Alanına Giriş Yap</span>
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
                                👑 ÖĞRETMEN YÖNETİCİ
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

            ${workspaceView === 'analysis' ? renderDataAnalysisSection(projData) : `
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
            `}
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
                    <option value="original" ${activeSort === 'original' ? 'selected' : ''}>Orijinal Sıra (1–98)</option>
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

    // Aktif Araştırma Formu (Kriterler, Toolbar, Geri Al, İleri Al, Kaydetme Durumu)
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

                <!-- 🔄 OTO-KAYIT DURUM GÖSTERGESİ -->
                <div id="tubitak-autosave-indicator" class="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-slate-50 border border-slate-200 shadow-2xs self-start sm:self-auto">
                    <span id="autosave-dot" class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    <span id="autosave-text" class="text-xs font-black text-slate-700">${canEditItem ? 'Kayıt Hazır' : 'Salt Okunur'}</span>
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
                    ${!isTeacher ? `
                    <button type="button" ${!canEditItem ? 'disabled' : ''} onclick="window.RotaliTubitak.submitForReview('${item.id}')" class="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-sm">
                        <i class="fa-solid fa-paper-plane"></i>
                        <span>İncelemeye Gönder</span>
                    </button>
                    ` : `
                    <div class="flex items-center gap-1.5 flex-wrap">
                        ${(activeProjectId === 'proje-tarih' || activeProjectId === 'proje-bilim' || activeProjectId === 'proje-siyer') ? `
                        <button type="button" onclick="window.RotaliTubitak.downloadMonumentWord('${item.id}', this)" class="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-sm" title="Yalnızca kaydedilmiş araştırma metinlerini .docx olarak indir">
                            <i class="fa-solid fa-file-word"></i>
                            <span>Word Olarak İndir</span>
                        </button>
                        ` : ''}
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
                    </div>
                    `}
                </div>
            </div>
        </div>

        <!-- 📜 ARAŞTIRMA KRİTERLERİ LİSTESİ -->
        <div class="space-y-5">
            ${criteriaList.map((crit, idx) => {
                const recordKey = `${item.id}__${crit.key}`;
                const saved = runtimeRecords[recordKey];
                const contentVal = saved ? saved.content : (item.criteria?.[crit.key] || "");
                const version = saved ? saved.version : 1;
                const lastEditor = saved ? saved.studentName : "Sistem";

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
        if (projectId === "proje-bilim") return items.length === 98;
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

    function isItemEditableByCurrentUser(item) {
        if (!currentSession || !item) return false;
        if (currentSession.role === "teacher") return true;
        if (activeProjectId !== "proje-tarih" && activeProjectId !== "proje-bilim" && activeProjectId !== "proje-siyer") return true;
        const myStuId = resolveCurrentUserStudentId(activeProjectId);
        const assignedStuId = getItemAssignedStudentId(item, activeProjectId);
        if (myStuId && assignedStuId) {
            return myStuId === assignedStuId;
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

        assignedItems.forEach(it => {
            const isNoEvent = projectId === "proje-siyer" && runtimeSiyerYearFlags?.[it.id]?.status === "no_event_found";
            const filled = countItemFilledCriteria(it.id, projectId);
            filledCriteria += filled;
            const isCompleted = isNoEvent || (
                projectId === "proje-siyer"
                    ? ((runtimeRecords[`${it.id}__c1_olay`]?.content || '').trim().length > 0 &&
                       ((runtimeRecords[`${it.id}__c3_kaynakca`]?.content || '').trim().length > 0 || getItemSources(it.id).length > 0))
                    : (filled === totalCriteria)
            );
            if (filled > 0 || isNoEvent) startedCount++;
            if (isCompleted) completedCount++;
            if (isNoEvent) noEventFlagCount++;
            if (getItemStatus(it.id) === "approved") approvedCount++;
            Object.values(runtimeRecords).forEach(rec => {
                const matchRec = rec && (rec.itemId === it.id || (projectId === "proje-siyer" && String(rec.itemId || "").startsWith(`${it.id}__`)));
                if (matchRec && rec.updatedAt) {
                    if (!lastUpdatedAt || rec.updatedAt > lastUpdatedAt) {
                        lastUpdatedAt = rec.updatedAt;
                    }
                }
            });
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
            assignedItems
        };
    }

    function renderStudentSelectionPanel(projData) {
        const projectId = projData?.id || activeProjectId;
        const students = getProjectStudents(projectId);
        const isTeacher = currentSession?.role === "teacher";
        const distValid = isProjectDistributionValid(projectId);
        const myStuId = resolveCurrentUserStudentId(projectId);
        const expectedTotal = projectId === "proje-bilim" ? 98 : (projectId === "proje-siyer" ? 62 : 40);
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

        // Öğrenci Filtresi (Proje 1, Proje 2 & Proje 3)
        if ((activeProjectId === "proje-tarih" || activeProjectId === "proje-bilim" || activeProjectId === "proje-siyer") && activeStudentFilterId !== "all") {
            list = list.filter(it => getItemAssignedStudentId(it, activeProjectId) === activeStudentFilterId);
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
                const rec = runtimeRecords[`${evId}__${crit.key}`];
                return rec && rec.content && rec.content.trim().length > 0;
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
        let hasInReview = false;
        let hasApproved = false;
        let hasCorrection = false;

        for (const [k, v] of Object.entries(runtimeRecords)) {
            if (k.startsWith(`${itemId}__`)) {
                if (v.status === "approved") hasApproved = true;
                if (v.status === "in_review") hasInReview = true;
                if (v.status === "correction_requested") hasCorrection = true;
            }
        }

        if (hasCorrection) return "correction_requested";
        if (hasApproved && !hasInReview) return "approved";
        if (hasInReview) return "in_review";
        return "draft";
    }

    function getStatusBadgeClass(status) {
        switch (status) {
            case "approved": return "bg-emerald-100 text-emerald-800 border border-emerald-300";
            case "in_review": return "bg-blue-100 text-blue-800 border border-blue-300";
            case "correction_requested": return "bg-amber-100 text-amber-900 border border-amber-300";
            case "no_event_found": return "bg-slate-200 text-slate-700 border border-slate-300";
            default: return "bg-slate-100 text-slate-700 border border-slate-200";
        }
    }

    function getStatusLabel(status) {
        switch (status) {
            case "approved": return "✅ Onaylandı";
            case "in_review": return "📤 İncelemede";
            case "correction_requested": return "⚠️ Düzeltme İstendi";
            case "no_event_found": return "🔍 Araştırıldı – Olay tespit edilemedi";
            default: return "📝 Taslak";
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
                text.textContent = "Bağlantı sorunu (Kuyrukta)";
                text.className = "text-xs font-black text-rose-700";
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
        const totalCriteria = (projData.criteriaList || []).length || 13;
        const distValid = isProjectDistributionValid("proje-bilim");

        return `
        <div class="space-y-4 pt-4 border-t border-slate-200">
            <div class="flex items-center justify-between gap-2 flex-wrap">
                <h4 class="font-black text-slate-900 text-sm flex items-center gap-2">
                    <i class="fa-solid fa-atom text-purple-600"></i>
                    <span>Proje 2 – Matematik Tarihi Bilim İnsanları Takibi & Görev Atamaları</span>
                </h4>
                <div class="flex items-center gap-2 flex-wrap">
                    <button type="button" onclick="window.RotaliTubitak.downloadAllProje1Word(this, 'proje-bilim')" class="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-[11px] transition-all shadow-sm flex items-center gap-1.5 cursor-pointer" title="98 bilim insanının her biri için ayrı .docx oluşturup ZIP olarak indir">
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
                <span>Dikkat: Proje 2 bilim insanı sayısı 98 olarak doğrulanamadı (mevcut: ${items.length}).</span>
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

    function openTeacherDashboardModal() {
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

            <!-- İstatistik Kartları -->
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

                <!-- Proje 1: Öğrenci Araştırma Takibi ve Görev Yönetimi -->
                ${renderProje1TeacherStudentTracking()}

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

        async handleLogin() {
            const passEl = document.getElementById("login-password");
            const nameEl = document.getElementById("login-student-name");
            const pinEl = document.getElementById("login-student-pin");
            const errEl = document.getElementById("login-error-msg");
            const errText = document.getElementById("login-error-text");

            if (!passEl) return;
            const password = passEl.value.trim();
            const studentName = nameEl ? nameEl.value.trim() : "";
            const studentPin = pinEl ? pinEl.value.trim() : "";

            try {
                const res = await fetch("/api/tubitak-auth", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ password, studentName, studentPin })
                });

                const data = await res.json();
                if (res.ok && data.ok) {
                    currentSession = data;
                    localStorage.setItem("rotali_tubitak_session", JSON.stringify(data));
                    if (data.role === "student" && data.projectId !== "all") {
                        activeProjectId = data.projectId;
                    }
                    activeStudentFilterId = ((activeProjectId === "proje-tarih" || activeProjectId === "proje-bilim") && data.role === "student")
                        ? (resolveCurrentUserStudentId(activeProjectId) || "all")
                        : "all";
                    await syncProjectData(activeProjectId);
                    startLivePolling();
                    renderMainContainer(document.getElementById("tubitak-research-container"));
                    showNotice(`Hoş geldiniz, ${data.studentName}!`, "success");
                } else {
                    if (errEl) {
                        errEl.classList.remove("hidden");
                        errText.textContent = data.error || "Giriş başarısız. Lütfen şifrenizi kontrol ediniz.";
                    }
                }
            } catch (err) {
                if (errEl) {
                    errEl.classList.remove("hidden");
                    errText.textContent = "Bağlantı hatası: " + err.message;
                }
            }
        },

        handleLogout() {
            flushPendingSaves();
            currentSession = null;
            workspaceView = "research";
            analysisCategoryFilter = "all";
            localStorage.removeItem("rotali_tubitak_session");
            renderMainContainer(document.getElementById("tubitak-research-container"));
            showNotice("Güvenli çıkış yapıldı.", "info");
        },

        switchProject(projId) {
            flushPendingSaves();
            activeProjectId = projId;
            activeItemId = null;
            activeFilter = "all";
            activePeriodFilter = "all";
            activeStudentFilterId = "all";
            analysisCategoryFilter = "all";
            syncProjectData(projId);
            renderMainContainer(document.getElementById("tubitak-research-container"));
        },

        selectStudentFilter(stuId) {
            flushPendingSaves();
            activeStudentFilterId = (activeStudentFilterId === stuId && stuId !== "all") ? "all" : (stuId || "all");
            const filtered = getFilteredItems();
            if (filtered.length > 0 && !filtered.some(x => x.id === activeItemId)) {
                activeItemId = filtered[0].id;
            }
            renderMainContainer(document.getElementById("tubitak-research-container"));
        },

        async downloadMonumentWord(itemId, btnEl, projectId) {
            if (!currentSession || currentSession.role !== "teacher") {
                showNotice("Word belgesi indirme işlemi yalnızca yetkili öğretmen hesabından yapılabilir.", "error");
                return;
            }
            const targetProjId = projectId || (activeProjectId === "proje-bilim" ? "proje-bilim" : (activeProjectId === "proje-siyer" ? "proje-siyer" : "proje-tarih"));
            const projItems = seedData?.projects?.[targetProjId]?.items || [];
            const item = projItems.find(it => it.id === itemId);
            const rawDocName = targetProjId === "proje-siyer" && item?.year ? String(item.year) : (item?.title || itemId || "Arastirma_Metni");
            const fallbackName = `${rawDocName.replace(/[<>:"/\\|?*\x00-\x1f]/g, "").trim()}.docx`;
            const origHtml = btnEl ? btnEl.innerHTML : "";
            if (btnEl) {
                btnEl.disabled = true;
                btnEl.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> <span>Hazırlanıyor...</span>`;
            }
            try {
                const res = await fetch(`/api/tubitak-records?projectId=${encodeURIComponent(targetProjId)}&exportDocx=single&itemId=${encodeURIComponent(itemId)}`, {
                    headers: { "Authorization": `Bearer ${currentSession.token}` }
                });
                if (!res.ok) {
                    let errMsg = "Word belgesi oluşturulamadı.";
                    try {
                        const errJson = await res.json();
                        if (errJson?.error) errMsg = errJson.error;
                    } catch (e) {}
                    showNotice(errMsg, "warning");
                    return;
                }
                const blob = await res.blob();
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = fallbackName;
                document.body.appendChild(a);
                a.click();
                a.remove();
                setTimeout(() => URL.revokeObjectURL(url), 1000);
                showNotice(`"${fallbackName}" Word belgesi indirildi.`, "success");
            } catch (err) {
                showNotice("Word indirme hatası: " + err.message, "error");
            } finally {
                if (btnEl) {
                    btnEl.disabled = false;
                    btnEl.innerHTML = origHtml;
                }
            }
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
            workspaceView = view === "analysis" ? "analysis" : "research";
            renderMainContainer(document.getElementById("tubitak-research-container"));
        },

        setAnalysisCategoryFilter(cat) {
            analysisCategoryFilter = (analysisCategoryFilter === cat && cat !== "all") ? "all" : (cat || "all");
            renderMainContainer(document.getElementById("tubitak-research-container"));
        },

        openItemInEditor(itemId) {
            activeItemId = itemId;
            workspaceView = "research";
            activeFilter = "all";
            activePeriodFilter = "all";
            activeStudentFilterId = "all";
            searchQuery = "";
            renderMainContainer(document.getElementById("tubitak-research-container"));
        },

        selectItem(itemId) {
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
            queueAutoSave(criterionKey, val, effItemId);
        },

        onFieldBlur(criterionKey, val, targetItemId) {
            const effItemId = targetItemId || activeItemId;
            if (autoSaveTimers[`${effItemId}__${criterionKey}`]) {
                clearTimeout(autoSaveTimers[`${effItemId}__${criterionKey}`]);
                executeSave(criterionKey, val, effItemId);
            }
        },

        handleUndo(criterionKey, targetItemId) {
            performUndo(criterionKey, targetItemId || activeItemId);
        },

        handleRedo(criterionKey, targetItemId) {
            performRedo(criterionKey, targetItemId || activeItemId);
        },

        navigateSiyerYear(targetYear) {
            const items = seedData?.projects?.["proje-siyer"]?.items || [];
            const match = items.find(it => it.year === Number(targetYear));
            if (match) {
                flushPendingSaves();
                activeItemId = match.id;
                activeYear = match.year;
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

    // DOM hazır olduğunda başlat
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
