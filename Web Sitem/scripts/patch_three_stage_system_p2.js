const fs = require('fs');
const path = require('path');

const filesToPatch = [
    path.join(__dirname, '../js/tubitak-research.js'),
    path.join(__dirname, '../../js/tubitak-research.js')
];

filesToPatch.forEach(filePath => {
    if (!fs.existsSync(filePath)) {
        console.log("File not found, skipping:", filePath);
        return;
    }
    let code = fs.readFileSync(filePath, 'utf8');

    // 1. Add renderItemStatusBanner, saveCurrentItemDraft, finalizeCurrentItem before renderActiveItemForm
    if (!code.includes('function renderItemStatusBanner')) {
        const insertionMarker = 'function renderActiveItemForm(item, projData) {';
        const newHelperFunctions = `
    function renderItemStatusBanner(item, itemStatus, ownerStu, canEditItem) {
        const isTeacher = currentSession?.role === "teacher";
        const feedbacks = (runtimeFeedbacks || []).filter(f => f.itemId === item.id);
        const latestFeedback = feedbacks.length > 0 ? feedbacks[feedbacks.length - 1] : null;

        if (itemStatus === "in_review") {
            return \`
            <div class="p-3.5 rounded-2xl bg-purple-50 border border-purple-200 text-purple-900 text-xs font-semibold flex items-center justify-between gap-3 shadow-2xs">
                <div class="flex items-center gap-2.5">
                    <span class="w-7 h-7 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                        <i class="fa-solid fa-hourglass-half"></i>
                    </span>
                    <div>
                        <strong class="font-black text-purple-950">Çalışma İncelemede:</strong>
                        <span>Bu araştırma kesinleştirilerek danışman öğretmen incelemesine sunulmuştur.\${isTeacher ? ' Öğretmen olarak inceleyip onaylayabilir veya düzeltme isteyebilirsiniz.' : ' İnceleme süresince doğrudan düzenlenemez.'}</span>
                    </div>
                </div>
                <span class="px-2.5 py-1 rounded-xl bg-purple-200 text-purple-950 font-black text-[10px] uppercase shrink-0">
                    İnceleme Bekliyor ⏳
                </span>
            </div>
            \`;
        }

        if (itemStatus === "approved") {
            return \`
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
            \`;
        }

        if (itemStatus === "correction_requested") {
            return \`
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
                \${latestFeedback?.message ? \`
                <div class="p-2.5 rounded-xl bg-white/80 border border-amber-200 text-xs text-amber-900 font-medium">
                    <i class="fa-solid fa-quote-left mr-1.5 text-amber-500"></i>\${escapeHtml(latestFeedback.message)}
                </div>
                \` : ''}
                <p class="text-[11px] text-amber-800">Lütfen öğretmenin belirttiği eksikleri tamamlayıp tekrar <strong>KAYDET</strong> ve ardından <strong>KESİNLEŞTİR</strong> butonuna basınız.</p>
            </div>
            \`;
        }

        return '';
    }

    async function saveCurrentItemDraft(targetItemId = activeItemId) {
        if (!currentSession || !targetItemId) return;
        await flushPendingSaves();
        updateUIAutosaveBadge("saving", "Taslak kaydediliyor...");

        const recordsToSave = [];
        if (activeProjectId === "proje-siyer") {
            const keys = [
                "c1_olay", "c2_kok_deger", "c3_kaynakca",
                "c1_olay_2", "c2_kok_deger_2", "c3_kaynakca_2",
                "c1_olay_3", "c2_kok_deger_3", "c3_kaynakca_3"
            ];
            keys.forEach(k => {
                const el = document.getElementById(\`input-\${k}\`);
                const contentVal = el ? el.value : (runtimeRecords[\`\${targetItemId}__\${k}\`]?.content || "");
                recordsToSave.push({
                    criterionKey: k,
                    content: contentVal,
                    clientVersion: runtimeRecords[\`\${targetItemId}__\${k}\`]?.version || 0
                });
            });
        } else {
            const projData = seedData?.projects?.[activeProjectId] || {};
            const critList = projData.criteriaList || [];
            critList.forEach(crit => {
                const el = document.getElementById(\`input-\${crit.key}\`);
                const contentVal = el ? el.value : (runtimeRecords[\`\${targetItemId}__\${crit.key}\`]?.content || "");
                recordsToSave.push({
                    criterionKey: crit.key,
                    content: contentVal,
                    clientVersion: runtimeRecords[\`\${targetItemId}__\${crit.key}\`]?.version || 0
                });
            });
        }

        try {
            const res = await fetch("/api/tubitak-records", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": \`Bearer \${currentSession.token}\`
                },
                body: JSON.stringify({
                    action: "save_item_batch",
                    projectId: activeProjectId,
                    itemId: targetItemId,
                    records: recordsToSave,
                    clientTimestamp: new Date().toISOString()
                })
            });

            const data = await res.json();
            if (res.ok && data.ok) {
                if (data.records) {
                    runtimeRecords = { ...runtimeRecords, ...data.records };
                }
                updateUIAutosaveBadge("saved", "Tüm değişiklikler kaydedildi");
                showNotice("Çalışmanız başarıyla taslak olarak kaydedildi! ✅", "success");
                updateProgressBadge();
            } else {
                updateUIAutosaveBadge("error", "Kayıt başarısız");
                showNotice(data.error || "Kayıt sırasında bir hata oluştu. Verileriniz yerel hafızada korundu.", "error");
            }
        } catch (err) {
            const isOnline = (typeof navigator !== "undefined" && navigator.onLine);
            updateUIAutosaveBadge(isOnline ? "error" : "waiting_connection");
            showNotice("Bağlantı hatası: " + err.message + ". Değişiklikleriniz çevrimdışı kuyruğa alındı.", "warning");
        }
    }

    async function finalizeCurrentItem(targetItemId = activeItemId) {
        if (!currentSession || !targetItemId) return;
        const projData = seedData?.projects?.[activeProjectId] || {};
        const items = projData.items || [];
        const currentItem = items.find(it => it.id === targetItemId) || { id: targetItemId };

        const canEdit = isItemEditableByCurrentUser(currentItem);
        if (!canEdit) {
            showNotice("Bu kayıt üzerinde kesinleştirme yetkiniz bulunmuyor (İncelemede veya Onaylandı durumunda kilitlidir).", "error");
            return;
        }

        const confirmMsg = "Çalışmanızı kesinleştirip danışman öğretmene göndermek istiyor musunuz?\\n\\nKesinleştirilen çalışma öğretmen onayına sunulacak ve inceleme süresince doğrudan düzenlenemeyecektir.";
        if (typeof confirm === "function" && !confirm(confirmMsg)) {
            return;
        }

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
                const el = document.getElementById(\`input-\${k}\`);
                const contentVal = el ? el.value : (runtimeRecords[\`\${targetItemId}__\${k}\`]?.content || "");
                recordsToSave.push({
                    criterionKey: k,
                    content: contentVal,
                    clientVersion: runtimeRecords[\`\${targetItemId}__\${k}\`]?.version || 0
                });
            });
        } else {
            const critList = projData.criteriaList || [];
            critList.forEach(crit => {
                const el = document.getElementById(\`input-\${crit.key}\`);
                const contentVal = el ? el.value : (runtimeRecords[\`\${targetItemId}__\${crit.key}\`]?.content || "");
                recordsToSave.push({
                    criterionKey: crit.key,
                    content: contentVal,
                    clientVersion: runtimeRecords[\`\${targetItemId}__\${crit.key}\`]?.version || 0
                });
            });
        }

        try {
            const res = await fetch("/api/tubitak-records", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": \`Bearer \${currentSession.token}\`
                },
                body: JSON.stringify({
                    action: "finalize_item",
                    projectId: activeProjectId,
                    itemId: targetItemId,
                    records: recordsToSave
                })
            });

            const data = await res.json();
            if (res.ok && data.ok) {
                showNotice("Çalışmanız başarıyla kesinleştirildi ve öğretmen incelemesine sunuldu! 🎓", "success");
                await syncProjectData(activeProjectId);
                renderMainContainer(document.getElementById("tubitak-research-container"));
            } else {
                updateUIAutosaveBadge("error", "Kesinleştirme başarısız");
                showNotice("Kesinleştirme işlemi başarısız: " + (data.error || "Bilinmeyen hata"), "error");
            }
        } catch (err) {
            updateUIAutosaveBadge("error", "Bağlantı hatası");
            showNotice("Bağlantı hatası: " + err.message, "error");
        }
    }
\n`;
        code = code.replace(insertionMarker, newHelperFunctions + insertionMarker);
    }

    // 2. Replace the autosave badge in renderActiveItemForm with the 3-stage control bar
    const oldIndicatorRegex = /<!-- 🔄 OTO-KAYIT DURUM GÖSTERGESİ -->[\s\S]*?<div id="tubitak-autosave-indicator"[\s\S]*?<\/div>\s*<\/div>/;
    const newControlBar = `<!-- 🔄 3 AŞAMALI KAYIT SİSTEMİ ÇUBUĞU (OTOMATİK + KAYDET + KESİNLEŞTİR) -->
                <div class="flex items-center gap-2 flex-wrap">
                    <div id="tubitak-autosave-indicator" class="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-slate-50 border border-slate-200 shadow-2xs">
                        <span id="autosave-dot" class="w-2.5 h-2.5 rounded-full \${canEditItem ? 'bg-emerald-500' : (itemStatus === 'in_review' ? 'bg-purple-500' : (itemStatus === 'approved' ? 'bg-emerald-600' : 'bg-slate-400'))}"></span>
                        <span id="autosave-text" class="text-xs font-black text-slate-700">\${canEditItem ? (lastSavedTimeString ? 'Tüm değişiklikler kaydedildi' : 'Kayıt Hazır') : (itemStatus === 'in_review' ? 'İncelemede (Kilitli)' : (itemStatus === 'approved' ? 'Onaylandı' : (itemStatus === 'correction_requested' ? 'Düzeltme İstendi' : 'Salt Okunur')))}</span>
                        <span id="autosave-time" class="text-[10px] text-slate-400 font-bold ml-1">\${lastSavedTimeString ? \`(\${lastSavedTimeString})\` : ''}</span>
                    </div>

                    \${canEditItem ? \`
                    <!-- 💾 2. AŞAMA: KAYDET BUTONU (Taslak Kaydet) -->
                    <button type="button" onclick="window.RotaliTubitak.saveCurrentItemDraft('\${item.id}')" class="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 active:scale-95 text-white text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-sm" title="Tüm alanları taslak olarak kaydeder">
                        <i class="fa-solid fa-floppy-disk text-amber-400"></i>
                        <span>KAYDET</span>
                    </button>

                    <!-- 🎓 3. AŞAMA: KESİNLEŞTİR BUTONU (Öğretmene Gönder) -->
                    <button type="button" onclick="window.RotaliTubitak.finalizeCurrentItem('\${item.id}')" class="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:scale-95 text-white text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-md" title="Son halini kesinleştirerek öğretmen incelemesine sunar">
                        <i class="fa-solid fa-check-double text-white"></i>
                        <span>KESİNLEŞTİR</span>
                    </button>
                    \` : (itemStatus === 'in_review' && !isTeacher ? \`
                    <span class="px-3.5 py-2 rounded-xl bg-purple-100 border border-purple-200 text-purple-800 text-xs font-black flex items-center gap-1.5 shadow-2xs">
                        <i class="fa-solid fa-lock text-purple-600"></i>
                        <span>İncelemede</span>
                    </span>
                    \` : (itemStatus === 'approved' && !isTeacher ? \`
                    <span class="px-3.5 py-2 rounded-xl bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-black flex items-center gap-1.5 shadow-2xs">
                        <i class="fa-solid fa-circle-check text-emerald-600"></i>
                        <span>Onaylandı</span>
                    </span>
                    \` : ''))}
                </div>
            </div>`;
    if (code.match(oldIndicatorRegex)) {
        code = code.replace(oldIndicatorRegex, newControlBar);
    }

    // 3. Add status banner in renderActiveItemForm
    if (!code.includes('${renderItemStatusBanner(item, itemStatus, ownerStu, canEditItem)}')) {
        code = code.replace(
            '<div class="space-y-5">',
            `\${renderItemStatusBanner(item, itemStatus, ownerStu, canEditItem)}\n\n        <!-- 📜 ARAŞTIRMA KRİTERLERİ LİSTESİ -->\n        <div class="space-y-5">`
        );
    }

    // 4. Expose saveCurrentItemDraft & finalizeCurrentItem on window.RotaliTubitak
    if (!code.includes('saveCurrentItemDraft,')) {
        code = code.replace(
            'openTeacherDashboardModal,',
            `openTeacherDashboardModal,\n        saveCurrentItemDraft,\n        finalizeCurrentItem,`
        );
    }

    fs.writeFileSync(filePath, code, 'utf8');
    console.log("Successfully patched part 2 in:", filePath);
});
