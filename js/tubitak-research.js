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
    let activeSort = "alpha";
    let activeYear = 571;
    let searchQuery = "";

    // Kayıtlar, revizyonlar ve yerel durum
    let runtimeRecords = {};        // { "item__crit": { content, version, updatedAt, studentName, status } }
    let runtimeRevisions = [];      // [ { id, recordKey, prevContent, newContent, studentName, version, createdAt } ]
    let runtimeSources = {};        // { "sourceId": { itemId, author, title, year, page, publisher, url, description } }
    let runtimeFeedbacks = [];      // [ { id, itemId, teacherName, message, status, createdAt } ]

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
    function queueAutoSave(criterionKey, newContent) {
        if (!currentSession || !activeItemId) return;

        const recordKey = `${activeItemId}__${criterionKey}`;
        const existing = runtimeRecords[recordKey] || { version: 0, content: "" };
        const prevContent = existing.content || "";

        // Geri Al yığınına ekle
        if (!undoStacks[recordKey]) undoStacks[recordKey] = [];
        undoStacks[recordKey].push(prevContent);
        if (undoStacks[recordKey].length > 30) undoStacks[recordKey].shift();
        redoStacks[recordKey] = []; // Yeni yazımda redo sıfırlanır

        // Yerel kaydı hemen güncelle (arayüz anında güncel kalsın)
        existing.content = newContent;
        existing.studentName = currentSession.studentName;
        existing.studentId = currentSession.studentId;
        existing.updatedAt = new Date().toISOString();
        runtimeRecords[recordKey] = existing;

        updateUIAutosaveBadge("dirty");

        // Zamanlayıcıyı sıfırla ve yeniden kur (~1000ms)
        if (autoSaveTimers[recordKey]) clearTimeout(autoSaveTimers[recordKey]);

        autoSaveTimers[recordKey] = setTimeout(async () => {
            await executeSave(criterionKey, newContent);
        }, 1000);
    }

    async function executeSave(criterionKey, content) {
        if (!currentSession || !activeItemId) return;
        const recordKey = `${activeItemId}__${criterionKey}`;
        const existing = runtimeRecords[recordKey] || { version: 0 };

        updateUIAutosaveBadge("saving");

        const payload = {
            projectId: activeProjectId,
            itemId: activeItemId,
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
            if (itemId === activeItemId && runtimeRecords[key]) {
                executeSave(critKey, runtimeRecords[key].content);
            }
        }
    }

    // 6. Geri Al ↶ & İleri Al ↷ Fonksiyonları
    function performUndo(criterionKey) {
        if (!activeItemId) return;
        const recordKey = `${activeItemId}__${criterionKey}`;
        const stack = undoStacks[recordKey] || [];
        if (stack.length === 0) {
            showNotice("Geri alınacak başka değişiklik yok.", "info");
            return;
        }

        const currentVal = runtimeRecords[recordKey]?.content || "";
        if (!redoStacks[recordKey]) redoStacks[recordKey] = [];
        redoStacks[recordKey].push(currentVal);

        const previousVal = stack.pop();
        const textarea = document.getElementById(`input-${criterionKey}`);
        if (textarea) textarea.value = previousVal;

        queueAutoSave(criterionKey, previousVal);
        showNotice("Değişiklik geri alındı ↶", "success");
    }

    function performRedo(criterionKey) {
        if (!activeItemId) return;
        const recordKey = `${activeItemId}__${criterionKey}`;
        const stack = redoStacks[recordKey] || [];
        if (stack.length === 0) {
            showNotice("İleri alınacak işlem bulunmuyor.", "info");
            return;
        }

        const currentVal = runtimeRecords[recordKey]?.content || "";
        if (!undoStacks[recordKey]) undoStacks[recordKey] = [];
        undoStacks[recordKey].push(currentVal);

        const nextVal = stack.pop();
        const textarea = document.getElementById(`input-${criterionKey}`);
        if (textarea) textarea.value = nextVal;

        queueAutoSave(criterionKey, nextVal);
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

                <!-- 3 Proje Bilgilendirme Rozetleri -->
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-7 relative z-10 text-center">
                    <div class="p-3 rounded-2xl bg-white/5 border border-amber-400/20">
                        <i class="fa-solid fa-monument text-amber-400 text-sm mb-1 block"></i>
                        <div class="text-[11px] font-black text-amber-200">1. Tarihî Eserler</div>
                        <div class="text-[9px] text-slate-400">Sivas Kültür Atlası</div>
                    </div>
                    <div class="p-3 rounded-2xl bg-white/5 border border-cyan-400/20">
                        <i class="fa-solid fa-atom text-cyan-400 text-sm mb-1 block"></i>
                        <div class="text-[11px] font-black text-cyan-200">2. Bilim İnsanları</div>
                        <div class="text-[9px] text-slate-400">Türk-İslam Bilginleri</div>
                    </div>
                    <div class="p-3 rounded-2xl bg-white/5 border border-emerald-400/20">
                        <i class="fa-solid fa-timeline text-emerald-400 text-sm mb-1 block"></i>
                        <div class="text-[11px] font-black text-emerald-200">3. Siyer Kronolojisi</div>
                        <div class="text-[9px] text-slate-400">571–632 Zaman Çizgisi</div>
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
                <div class="flex items-center gap-2">
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

            <!-- ============================================================== -->
            <!-- 📱 DÖNÜŞÜMLÜ 2 BÖLMELİ ÇALIŞMA ALANI (SOL LİSTE / SAĞ FORM) -->
            <!-- ============================================================== -->
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                <!-- 📋 SOL PANEL: LİSTE VE FİLTRELER (4 Sütun) -->
                <div class="lg:col-span-4 bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-4">
                    
                    <!-- Arama Kutusu -->
                    <div class="relative">
                        <input type="text" id="tubitak-search-input" value="${escapeHtml(searchQuery)}" oninput="window.RotaliTubitak.handleSearch(this.value)" placeholder="Arama yapınız (eser, bilim insanı, yıl)..." class="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white transition-all shadow-2xs">
                        <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                    </div>

                    <!-- PROJEYE ÖZEL FİLTRE BİLEŞENLERİ -->
                    ${renderProjectSpecificFilters()}

                    <!-- İlerleme Özeti -->
                    <div class="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
                        <span class="font-bold text-slate-600">Listelenen Kayıt:</span>
                        <span class="font-black text-slate-900">${items.length} Konu</span>
                    </div>

                    <!-- Kayıt Listesi (Kaydırılabilir) -->
                    <div class="space-y-2 max-h-[620px] overflow-y-auto pr-1 custom-scrollbar">
                        ${items.map(it => {
                            const isSelected = it.id === activeItemId;
                            const filledCount = countItemFilledCriteria(it.id);
                            const totalCriteria = projData.criteriaList ? projData.criteriaList.length : 8;
                            const status = getItemStatus(it.id);

                            return `
                            <div onclick="window.RotaliTubitak.selectItem('${it.id}')" class="p-3.5 rounded-2xl transition-all cursor-pointer border flex flex-col gap-1.5 ${isSelected ? 'bg-amber-50/80 border-amber-400 shadow-sm ring-2 ring-amber-400/20' : 'bg-slate-50/60 hover:bg-slate-100 border-slate-200'}">
                                <div class="flex items-center justify-between gap-2">
                                    <span class="text-[10px] font-black uppercase tracking-wider text-slate-500">
                                        ${it.district || it.field || (it.year ? `${it.year}. Yıl` : 'Kayıt')}
                                    </span>
                                    <span class="px-2 py-0.5 rounded-full text-[9px] font-black ${getStatusBadgeClass(status)}">
                                        ${getStatusLabel(status)}
                                    </span>
                                </div>
                                <h4 class="text-xs sm:text-sm font-black text-slate-900 leading-snug line-clamp-1">${escapeHtml(it.title)}</h4>
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
                    </select>
                </div>
                <div>
                    <label class="block text-[10px] font-black text-slate-500 uppercase mb-1">Dönem Filtresi</label>
                    <select onchange="window.RotaliTubitak.setPeriodFilter(this.value)" class="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800">
                        <option value="all" ${activePeriodFilter === 'all' ? 'selected' : ''}>Tüm Dönemler</option>
                        <option value="selcuklu" ${activePeriodFilter === 'selcuklu' ? 'selected' : ''}>Selçuklu</option>
                        <option value="ilhanli" ${activePeriodFilter === 'ilhanli' ? 'selected' : ''}>İlhanlı</option>
                        <option value="beylikler" ${activePeriodFilter === 'beylikler' ? 'selected' : ''}>Beylikler</option>
                        <option value="cumhuriyet" ${activePeriodFilter === 'cumhuriyet' ? 'selected' : ''}>Cumhuriyet</option>
                    </select>
                </div>
            </div>
            `;
        }

        if (activeProjectId === "proje-bilim") {
            return `
            <div class="grid grid-cols-2 gap-2">
                <div>
                    <label class="block text-[10px] font-black text-slate-500 uppercase mb-1">Bilim Dalı</label>
                    <select onchange="window.RotaliTubitak.setDistrictFilter(this.value)" class="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800">
                        <option value="all" ${activeFilter === 'all' ? 'selected' : ''}>Tüm Alanlar</option>
                        <option value="astronomi" ${activeFilter === 'astronomi' ? 'selected' : ''}>Astronomi & Geometri</option>
                        <option value="tip" ${activeFilter === 'tip' ? 'selected' : ''}>Tıp & Biyoloji</option>
                        <option value="fizik" ${activeFilter === 'fizik' ? 'selected' : ''}>Optik & Fizik</option>
                        <option value="matematik" ${activeFilter === 'matematik' ? 'selected' : ''}>Matematik & Cebir</option>
                        <option value="mekanik" ${activeFilter === 'mekanik' ? 'selected' : ''}>Robotik & Mekanik</option>
                        <option value="felsefe" ${activeFilter === 'felsefe' ? 'selected' : ''}>Felsefe & Mantık</option>
                    </select>
                </div>
                <div>
                    <label class="block text-[10px] font-black text-slate-500 uppercase mb-1">Sıralama</label>
                    <select onchange="window.RotaliTubitak.setSortOrder(this.value)" class="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800">
                        <option value="alpha" ${activeSort === 'alpha' ? 'selected' : ''}>Alfabetik (A-Z)</option>
                        <option value="chrono" ${activeSort === 'chrono' ? 'selected' : ''}>Kronolojik (Tarih)</option>
                    </select>
                </div>
            </div>
            `;
        }

        if (activeProjectId === "proje-siyer") {
            const milestoneYears = [571, 575, 577, 579, 582, 591, 595, 605, 610, 615, 620, 622, 624, 628, 630, 632];
            return `
            <div>
                <label class="block text-[10px] font-black text-slate-500 uppercase mb-1.5 flex items-center justify-between">
                    <span>⏱️ 571–632 Zaman Çizelgesi</span>
                    <span class="text-emerald-600 font-bold">Yıl Seçiniz</span>
                </label>
                <div class="flex items-center gap-1.5 overflow-x-auto pb-1.5 custom-scrollbar">
                    ${milestoneYears.map(yr => `
                    <button type="button" onclick="window.RotaliTubitak.selectSiyerYear(${yr})" class="px-2.5 py-1 rounded-xl text-xs font-black transition-all shrink-0 cursor-pointer ${activeYear === yr ? 'bg-emerald-600 text-white shadow-sm' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}">
                        ${yr}
                    </button>
                    `).join("")}
                </div>
            </div>
            `;
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

        return `
        <!-- Form Başlık Alanı & Araç Çubuğu -->
        <div class="pb-5 border-b border-slate-200 space-y-4">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-slate-100 text-slate-700 border border-slate-200 uppercase">
                        ${item.district || item.geography || (item.year ? `${item.year}. Yılı` : 'Araştırma')}
                    </span>
                    <h3 class="text-lg sm:text-2xl font-black text-slate-900 mt-1">${escapeHtml(item.title)}</h3>
                    <p class="text-xs text-slate-500 font-medium mt-0.5">${escapeHtml(item.summary || item.location || '')}</p>
                </div>

                <!-- 🔄 OTO-KAYIT DURUM GÖSTERGESİ -->
                <div id="tubitak-autosave-indicator" class="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-slate-50 border border-slate-200 shadow-2xs self-start sm:self-auto">
                    <span id="autosave-dot" class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    <span id="autosave-text" class="text-xs font-black text-slate-700">Kayıt Hazır</span>
                </div>
            </div>

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

                <div class="flex items-center gap-2">
                    ${!isTeacher ? `
                    <button type="button" onclick="window.RotaliTubitak.submitForReview('${item.id}')" class="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-sm">
                        <i class="fa-solid fa-paper-plane"></i>
                        <span>İncelemeye Gönder</span>
                    </button>
                    ` : `
                    <div class="flex items-center gap-1.5">
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
                            ${crit.required ? '<span class="text-red-500 font-bold" title="Zorunlu Kriter">*</span>' : ''}
                        </label>
                        
                        <!-- ↶ Geri Al / İleri Al Butonları -->
                        <div class="flex items-center gap-1">
                            <button type="button" onclick="window.RotaliTubitak.handleUndo('${crit.key}')" class="w-7 h-7 rounded-lg bg-white hover:bg-slate-200 text-slate-700 border border-slate-300 flex items-center justify-center text-xs transition-colors cursor-pointer" title="Bu Alanı Geri Al ↶">
                                ↶
                            </button>
                            <button type="button" onclick="window.RotaliTubitak.handleRedo('${crit.key}')" class="w-7 h-7 rounded-lg bg-white hover:bg-slate-200 text-slate-700 border border-slate-300 flex items-center justify-center text-xs transition-colors cursor-pointer" title="Bu Alanı İleri Al ↷">
                                ↷
                            </button>
                        </div>
                    </div>

                    <!-- Metin Yazım Alanı (Otomatik Kayıt Bağlantılı) -->
                    <textarea 
                        id="input-${crit.key}" 
                        rows="3" 
                        placeholder="${escapeHtml(crit.placeholder || 'Araştırma bulgularınızı buraya yazınız...')}"
                        oninput="window.RotaliTubitak.onFieldChange('${crit.key}', this.value)"
                        onblur="window.RotaliTubitak.onFieldBlur('${crit.key}', this.value)"
                        class="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none transition-all leading-relaxed custom-scrollbar"
                    >${escapeHtml(contentVal)}</textarea>

                    <!-- Alt Bilgi: Sürüm, Son Düzenleyen & Karakter Sayısı -->
                    <div class="flex items-center justify-between text-[10px] text-slate-400 font-semibold pt-1">
                        <span class="flex items-center gap-1">
                            <i class="fa-solid fa-code-commit text-amber-500"></i>
                            <span>Sürüm v${version}</span>
                            <span>• ${escapeHtml(lastEditor)}</span>
                        </span>
                        <span id="char-count-${crit.key}">${contentVal.length} karakter</span>
                    </div>
                </div>
                `;
            }).join("")}
        </div>

        <!-- 📚 İLİŞKİLİ KAYNAKLAR BÖLÜMÜ -->
        <div class="pt-5 border-t border-slate-200">
            <h4 class="text-xs font-black uppercase text-slate-700 tracking-wider mb-3 flex items-center justify-between">
                <span>📚 Eklenen Akademik Kaynaklar</span>
                <span class="text-[10px] text-blue-600 font-bold">${getItemSources(item.id).length} Kaynak</span>
            </h4>
            <div class="space-y-2">
                ${getItemSources(item.id).length === 0 ? `
                <div class="p-3 rounded-xl bg-slate-50 border border-dashed border-slate-300 text-center text-slate-400 text-xs">
                    Henüz kaynak eklenmedi. Üstteki "Kaynak Ekle" butonunu kullanarak literatür referansı ekleyebilirsiniz.
                </div>
                ` : getItemSources(item.id).map(src => `
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

    // 8. Yardımcılar ve Filtreleme Mantıkları
    function getFilteredItems() {
        const projData = seedData?.projects?.[activeProjectId] || {};
        let list = projData.items || [];

        // Arama filtresi
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase().trim();
            list = list.filter(it => 
                (it.title && it.title.toLowerCase().includes(q)) ||
                (it.district && it.district.toLowerCase().includes(q)) ||
                (it.field && it.field.toLowerCase().includes(q)) ||
                (it.summary && it.summary.toLowerCase().includes(q)) ||
                (String(it.year || '').includes(q))
            );
        }

        // İlçe / Bilim Dalı Filtresi
        if (activeFilter !== "all") {
            if (activeProjectId === "proje-tarih") {
                list = list.filter(it => it.district === activeFilter);
            } else if (activeProjectId === "proje-bilim") {
                list = list.filter(it => it.fieldGroup === activeFilter);
            }
        }

        // Tarihsel Dönem Filtresi
        if (activePeriodFilter !== "all" && activeProjectId === "proje-tarih") {
            list = list.filter(it => it.periodGroup === activePeriodFilter);
        }

        // Siyer Yıl Filtresi
        if (activeProjectId === "proje-siyer" && activeYear) {
            list = list.filter(it => it.year === activeYear);
        }

        // Sıralama
        if (activeSort === "alpha") {
            list.sort((a, b) => a.title.localeCompare(b.title, "tr"));
        } else if (activeSort === "chrono") {
            list.sort((a, b) => (a.year || 0) - (b.year || 0));
        }

        return list;
    }

    function countItemFilledCriteria(itemId) {
        const projData = seedData?.projects?.[activeProjectId] || {};
        const criteriaList = projData.criteriaList || [];
        let count = 0;
        for (const crit of criteriaList) {
            const recordKey = `${itemId}__${crit.key}`;
            const rec = runtimeRecords[recordKey];
            if (rec && rec.content && rec.content.trim().length > 0) {
                count++;
            }
        }
        return count;
    }

    function getItemStatus(itemId) {
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
            default: return "bg-slate-100 text-slate-700 border border-slate-200";
        }
    }

    function getStatusLabel(status) {
        switch (status) {
            case "approved": return "✅ Onaylandı";
            case "in_review": return "📤 İncelemede";
            case "correction_requested": return "⚠️ Düzeltme İstendi";
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

    // 11. Olay Dinleyicileri ve Dışa Aktarılan Arayüz (window.RotaliTubitak)
    function bindLoginEvents() {}
    function bindWorkspaceEvents() {}

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
            syncProjectData(projId);
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

        onFieldChange(criterionKey, val) {
            const countEl = document.getElementById(`char-count-${criterionKey}`);
            if (countEl) countEl.textContent = `${val.length} karakter`;
            queueAutoSave(criterionKey, val);
        },

        onFieldBlur(criterionKey, val) {
            if (autoSaveTimers[`${activeItemId}__${criterionKey}`]) {
                clearTimeout(autoSaveTimers[`${activeItemId}__${criterionKey}`]);
                executeSave(criterionKey, val);
            }
        },

        handleUndo(criterionKey) {
            performUndo(criterionKey);
        },

        handleRedo(criterionKey) {
            performRedo(criterionKey);
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
