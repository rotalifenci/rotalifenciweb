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
