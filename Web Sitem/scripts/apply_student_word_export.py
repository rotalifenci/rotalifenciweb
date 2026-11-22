import os
import sys

def patch_all():
    cwd = os.getcwd()
    if os.path.basename(cwd) == "Web Sitem":
        web_dir = cwd
        root_dir = os.path.dirname(cwd)
    else:
        root_dir = cwd
        web_dir = os.path.join(cwd, "Web Sitem")

    # 1. Patch api/tubitak-records.js
    for d in [web_dir, root_dir]:
        records_api_path = os.path.join(d, "api", "tubitak-records.js")
        with open(records_api_path, "r", encoding="utf-8") as f:
            content = f.read()

        old_records_block = """            if (exportDocxMode === "single" || exportDocxMode === "all") {
                if (userRole !== "teacher") {
                    return res.status(403).json({ ok: false, error: "Word belgesi indirme işlemi yalnızca yetkili öğretmen hesabından yapılabilir." });
                }

                const exportProjId = (reqProj === "proje-bilim" || reqProj === "proje-tarih" || reqProj === "proje-siyer") ? reqProj : "proje-tarih";
                const parsedSeed = fs.existsSync(seedDataPath) ? JSON.parse(fs.readFileSync(seedDataPath, 'utf8')) : null;
                const projObj = parsedSeed?.projects?.[exportProjId];
                if (!projObj || !Array.isArray(projObj.items) || !Array.isArray(projObj.criteriaList)) {
                    return res.status(500).json({ ok: false, error: "Proje veri şablonu okunamadı." });
                }

                const mergedRecords = {};
                for (const [k, v] of Object.entries(store.records || {})) {
                    if (v && v.projectId === exportProjId) {
                        mergedRecords[k] = v;
                    }
                }

                if (exportDocxMode === "single") {
                    const targetItemId = String(req.query.itemId || '').trim();
                    const item = projObj.items.find((it) => it.id === targetItemId || (exportProjId === "proje-siyer" && String(it.year) === targetItemId));
                    if (!item) {
                        return res.status(404).json({ ok: false, error: "İstenen araştırma kaydı bulunamadı." });
                    }
                    let docxResult;
                    if (exportProjId === "proje-siyer") {
                        const extraIds = (store.itemsMeta && store.itemsMeta['proje-siyer_events'] && store.itemsMeta['proje-siyer_events'][item.id]) || [];
                        const eventIds = [item.id, ...extraIds.filter((id) => id && id !== item.id)].slice(0, 3);
                        docxResult = await generateSiyerYearDocxBuffer(item, eventIds, projObj.criteriaList, mergedRecords);
                    } else {
                        docxResult = await generateMonumentDocxBuffer(item, projObj.criteriaList, mergedRecords);
                    }
                    if (!docxResult) {
                        return res.status(404).json({ ok: false, error: "Bu kayıt için veritabanında kaydedilmiş araştırma metni bulunamadı." });
                    }
                    const asciiName = buildAsciiFallbackFilename(docxResult.filename);
                    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
                    res.setHeader("Content-Disposition", `attachment; filename="${asciiName}"; filename*=UTF-8''${encodeURIComponent(docxResult.filename)}`);
                    res.setHeader("X-Export-Paragraph-Count", String(docxResult.paragraphCount));
                    return res.status(200).send(docxResult.buffer);
                }"""

        new_records_block = """            if (exportDocxMode === "single" || exportDocxMode === "all") {
                if (exportDocxMode === "all" && userRole !== "teacher") {
                    return res.status(403).json({ ok: false, error: "Toplu Word indirme işlemi yalnızca yetkili öğretmen hesabından yapılabilir." });
                }

                const exportProjId = (reqProj === "proje-bilim" || reqProj === "proje-tarih" || reqProj === "proje-siyer") ? reqProj : "proje-tarih";
                
                // Öğrenci Yetki Kontrolü: Öğrenci yalnızca kendi projesindeki araştırmaları indirebilir
                if (userRole !== "teacher" && userProjectId !== "all" && exportProjId !== userProjectId) {
                    return res.status(403).json({ ok: false, error: "Bu projenin kayıtlarına erişim yetkiniz bulunmuyor." });
                }

                const parsedSeed = fs.existsSync(seedDataPath) ? JSON.parse(fs.readFileSync(seedDataPath, 'utf8')) : null;
                const projObj = parsedSeed?.projects?.[exportProjId];
                if (!projObj || !Array.isArray(projObj.items) || !Array.isArray(projObj.criteriaList)) {
                    return res.status(500).json({ ok: false, error: "Proje veri şablonu okunamadı." });
                }

                const mergedRecords = {};
                for (const [k, v] of Object.entries(store.records || {})) {
                    if (v && v.projectId === exportProjId) {
                        mergedRecords[k] = v;
                    }
                }

                if (exportDocxMode === "single") {
                    const targetItemId = String(req.query.itemId || '').trim();
                    const item = projObj.items.find((it) => it.id === targetItemId || (exportProjId === "proje-siyer" && String(it.year) === targetItemId));
                    if (!item) {
                        return res.status(404).json({ ok: false, error: "İstenen araştırma kaydı bulunamadı." });
                    }

                    // Öğrenci Görev Kontrolü: Öğrenci yalnızca erişim yetkisi olan / atanmış konusunu indirebilir
                    if (userRole !== "teacher") {
                        const sessionStuId = resolveSessionStudentId(session, exportProjId);
                        const assignedStuId = getEffectiveAssignedStudentId(store, exportProjId, item.id);
                        if (sessionStuId && assignedStuId && sessionStuId !== assignedStuId) {
                            return res.status(403).json({ ok: false, error: "Bu kayıt başka bir öğrenciye atanmıştır. Yalnızca kendi araştırmanızı indirebilirsiniz." });
                        }
                    }

                    let docxResult;
                    if (exportProjId === "proje-siyer") {
                        const extraIds = (store.itemsMeta && store.itemsMeta['proje-siyer_events'] && store.itemsMeta['proje-siyer_events'][item.id]) || [];
                        const eventIds = [item.id, ...extraIds.filter((id) => id && id !== item.id)].slice(0, 3);
                        docxResult = await generateSiyerYearDocxBuffer(item, eventIds, projObj.criteriaList, mergedRecords);
                    } else {
                        docxResult = await generateMonumentDocxBuffer(item, projObj.criteriaList, mergedRecords);
                    }
                    if (!docxResult || docxResult.paragraphCount === 0) {
                        return res.status(404).json({ ok: false, error: "Bu araştırma için henüz indirilebilecek veri bulunmuyor." });
                    }
                    const asciiName = buildAsciiFallbackFilename(docxResult.filename);
                    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
                    res.setHeader("Content-Disposition", `attachment; filename="${asciiName}"; filename*=UTF-8''${encodeURIComponent(docxResult.filename)}`);
                    res.setHeader("X-Export-Paragraph-Count", String(docxResult.paragraphCount));
                    return res.status(200).send(docxResult.buffer);
                }"""

        norm_content = content.replace("\r\n", "\n")
        norm_old = old_records_block.replace("\r\n", "\n")
        norm_new = new_records_block.replace("\r\n", "\n")

        if norm_old in norm_content:
            norm_content = norm_content.replace(norm_old, norm_new)
            with open(records_api_path, "w", encoding="utf-8") as f:
                f.write(norm_content)
            print(f"Patched api/tubitak-records.js in {records_api_path}")
        else:
            print(f"Error: could not find old_records_block in {records_api_path}")

    # 2. Patch js/tubitak-research.js
    for d in [web_dir, root_dir]:
        research_js_path = os.path.join(d, "js", "tubitak-research.js")
        with open(research_js_path, "r", encoding="utf-8") as f:
            content = f.read()

        norm_content = content.replace("\r\n", "\n")

        # A) Add WORD INDIR button in 3-stage bar
        old_indicator_end = """                    <div id="tubitak-autosave-indicator" class="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-slate-50 border border-slate-200 shadow-2xs">
                        <span id="autosave-dot" class="w-2.5 h-2.5 rounded-full ${canEditItem ? 'bg-emerald-500' : (itemStatus === 'in_review' ? 'bg-purple-500' : (itemStatus === 'approved' ? 'bg-emerald-600' : 'bg-slate-400'))}"></span>
                        <span id="autosave-text" class="text-xs font-black text-slate-700">${canEditItem ? (lastSavedTimeString ? 'Tüm değişiklikler kaydedildi' : 'Kayıt Hazır') : (itemStatus === 'in_review' ? 'İncelemede (Kilitli)' : (itemStatus === 'approved' ? 'Onaylandı' : (itemStatus === 'correction_requested' ? 'Düzeltme İstendi' : 'Salt Okunur')))}</span>
                        <span id="autosave-time" class="text-[10px] text-slate-400 font-bold ml-1">${lastSavedTimeString ? `(${lastSavedTimeString})` : ''}</span>
                    </div>"""

        new_indicator_and_word_btn = """                    <div id="tubitak-autosave-indicator" class="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-slate-50 border border-slate-200 shadow-2xs">
                        <span id="autosave-dot" class="w-2.5 h-2.5 rounded-full ${canEditItem ? 'bg-emerald-500' : (itemStatus === 'in_review' ? 'bg-purple-500' : (itemStatus === 'approved' ? 'bg-emerald-600' : 'bg-slate-400'))}"></span>
                        <span id="autosave-text" class="text-xs font-black text-slate-700">${canEditItem ? (lastSavedTimeString ? 'Tüm değişiklikler kaydedildi' : 'Kayıt Hazır') : (itemStatus === 'in_review' ? 'İncelemede (Kilitli)' : (itemStatus === 'approved' ? 'Onaylandı' : (itemStatus === 'correction_requested' ? 'Düzeltme İstendi' : 'Salt Okunur')))}</span>
                        <span id="autosave-time" class="text-[10px] text-slate-400 font-bold ml-1">${lastSavedTimeString ? `(${lastSavedTimeString})` : ''}</span>
                    </div>

                    <!-- 📄 WORD İNDİR BUTONU (Öğrenci & Öğretmen) -->
                    <button type="button" id="btn-student-word-download" onclick="window.RotaliTubitak.downloadStudentWord('${item.id}', this)" class="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-sm" title="Bu araştırmanın kaydedilmiş metinlerini Word (.docx) olarak indir">
                        <i class="fa-solid fa-file-word text-blue-200"></i>
                        <span>WORD İNDİR</span>
                    </button>"""

        if old_indicator_end in norm_content:
            norm_content = norm_content.replace(old_indicator_end, new_indicator_and_word_btn)
            print(f"Added WORD INDIR button in {research_js_path}")
        else:
            print(f"Notice: old_indicator_end not found in {research_js_path}")

        # B) Update saveCurrentItemDraft to accept isSilent parameter
        old_save_draft = """    async function saveCurrentItemDraft(targetItemId = activeItemId) {
        if (!currentSession || !targetItemId) return;
        await flushPendingSaves();
        updateUIAutosaveBadge("saving", "Taslak kaydediliyor...");"""

        new_save_draft = """    async function saveCurrentItemDraft(targetItemId = activeItemId, isSilent = false) {
        if (!currentSession || !targetItemId) return { ok: false, error: "Oturum bulunamadı" };
        await flushPendingSaves();
        if (!isSilent) updateUIAutosaveBadge("saving", "Taslak kaydediliyor...");"""

        if old_save_draft in norm_content:
            norm_content = norm_content.replace(old_save_draft, new_save_draft)
            print(f"Updated saveCurrentItemDraft signature in {research_js_path}")

        old_save_draft_res = """            const data = await res.json();
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
        }"""

        new_save_draft_res = """            const data = await res.json();
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
        }"""

        if old_save_draft_res in norm_content:
            norm_content = norm_content.replace(old_save_draft_res, new_save_draft_res)
            print(f"Updated saveCurrentItemDraft return/notice logic in {research_js_path}")

        # C) Update / Add downloadStudentWord function
        # Replace existing downloadMonumentWord with robust downloadStudentWord & alias
        old_download_func = """        async downloadMonumentWord(itemId, btnEl, projectId) {
            if (!currentSession || currentSession.role !== "teacher") {
                showNotice("Word belgesi indirme işlemi yalnızca yetkili öğretmen hesabından yapılabilir.", "error");
                return;
            }
            const targetProjId = projectId || (activeProjectId === "proje-bilim" ? "proje-bilim" : (activeProjectId === "proje-siyer" ? "proje-siyer" : "proje-tarih"));
            const projItems = seedData?.projects?.[targetProjId]?.items || [];
            const item = projItems.find(it => it.id === itemId);
            const rawDocName = targetProjId === "proje-siyer" && item?.year ? String(item.year) : (item?.title || itemId || "Arastirma_Metni");
            const fallbackName = `${rawDocName.replace(/[<>:"/\\\\|?*\\x00-\\x1f]/g, "").trim()}.docx`;
            const origHtml = btnEl ? btnEl.innerHTML : "";
            if (btnEl) {
                btnEl.disabled = true;
                btnEl.innerHTML = `<i class=\"fa-solid fa-spinner fa-spin\"></i> <span>Hazırlanıyor...</span>`;
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
        },"""

        new_download_func = """        async downloadStudentWord(itemId, btnEl, projectId) {
            if (!currentSession) {
                showNotice("Word belgesi indirmek için lütfen giriş yapınız.", "warning");
                return;
            }

            const targetProjId = projectId || activeProjectId || currentSession.projectId || "proje-tarih";
            const targetItemId = itemId || activeItemId;
            if (!targetItemId) return;

            // 1. Yetki Kontrolü: Öğrenci yalnızca erişim yetkisi olan araştırmayı indirebilir
            const isTeacher = currentSession.role === "teacher";
            if (!isTeacher) {
                if (currentSession.projectId && currentSession.projectId !== "all" && currentSession.projectId !== targetProjId) {
                    showNotice("Yalnızca kendi projenizdeki araştırmaları indirebilirsiniz.", "error");
                    return;
                }
                const projItems = seedData?.projects?.[targetProjId]?.items || [];
                const item = projItems.find(it => it.id === targetItemId || (targetProjId === "proje-siyer" && String(it.year) === targetItemId));
                if (!item) {
                    showNotice("Araştırma kaydı bulunamadı.", "error");
                    return;
                }
                const sessionStuId = currentSession.studentId;
                const assignedStu = getEffectiveAssignedStudent(item);
                if (sessionStuId && assignedStu?.id && assignedStu.id !== sessionStuId) {
                    showNotice("Bu kayıt başka bir öğrenciye atanmıştır. Yalnızca kendi araştırmanızı indirebilirsiniz.", "warning");
                    return;
                }
            }

            // 2. Kaydedilmemiş değişiklik kontrolü & bekleyen kayıtları sunucuya gönderme
            let hasUnsavedChanges = false;
            const textareas = document.querySelectorAll(".tubitak-criterion-textarea");
            textareas.forEach(ta => {
                const critKey = ta.id ? ta.id.replace("input-", "") : "";
                if (critKey) {
                    const recKey = `${targetItemId}__${critKey}`;
                    const savedVal = runtimeRecords[recKey]?.content || "";
                    if (ta.value !== savedVal) {
                        hasUnsavedChanges = true;
                    }
                }
            });

            const hasActiveTimers = Object.keys(autoSaveTimers).some(k => k.startsWith(targetItemId));
            if (hasUnsavedChanges || hasActiveTimers) {
                updateUIAutosaveBadge("saving", "Son değişiklikler kaydediliyor...");
                try {
                    await flushPendingSaves();
                    const saveRes = await saveCurrentItemDraft(targetItemId, true);
                    if (saveRes && saveRes.ok === false) {
                        showNotice("Son değişiklikler sunucuya kaydedilemediği için Word indirme durduruldu. Lütfen tekrar deneyiniz.", "error");
                        return;
                    }
                } catch (e) {
                    showNotice("Son değişiklikler sunucuya kaydedilemediği için Word indirme durduruldu. Lütfen tekrar deneyiniz.", "error");
                    return;
                }
            }

            // 3. Buton göstergesi ve indirme hazırlığı
            const origHtml = btnEl ? btnEl.innerHTML : "";
            if (btnEl) {
                btnEl.disabled = true;
                btnEl.innerHTML = `<i class="fa-solid fa-spinner fa-spin text-blue-200"></i> <span>Hazırlanıyor...</span>`;
            }
            showNotice("Word dosyası hazırlanıyor...", "info");

            const projItems = seedData?.projects?.[targetProjId]?.items || [];
            const item = projItems.find(it => it.id === targetItemId || (targetProjId === "proje-siyer" && String(it.year) === targetItemId));
            const rawDocName = targetProjId === "proje-siyer" && item?.year ? String(item.year) : (item?.title || targetItemId || "Arastirma_Metni");
            const fallbackName = `${rawDocName.replace(/[<>:"/\\\\|?*\\x00-\\x1f]/g, "").trim()}.docx`;

            try {
                const res = await fetch(`/api/tubitak-records?projectId=${encodeURIComponent(targetProjId)}&exportDocx=single&itemId=${encodeURIComponent(targetItemId)}&fresh=true`, {
                    headers: { "Authorization": `Bearer ${currentSession.token}` }
                });

                if (!res.ok) {
                    let errMsg = "Word belgesi oluşturulamadı.";
                    try {
                        const errJson = await res.json();
                        if (errJson?.error) errMsg = errJson.error;
                    } catch (e) {}

                    if (res.status === 404 || errMsg.includes("bulunamadı") || errMsg.includes("henüz")) {
                        showNotice("Bu araştırma için henüz indirilebilecek veri bulunmuyor.", "warning");
                    } else if (res.status === 403) {
                        showNotice("Bu araştırmayı indirme yetkiniz bulunmuyor.", "error");
                    } else {
                        showNotice(errMsg, "error");
                    }
                    return;
                }

                let downloadFilename = fallbackName;
                const disposition = res.headers.get("Content-Disposition");
                if (disposition && disposition.includes("filename*=UTF-8''")) {
                    try {
                        const parts = disposition.split("filename*=UTF-8''");
                        if (parts[1]) downloadFilename = decodeURIComponent(parts[1].split(';')[0].trim().replace(/^["']|["']$/g, ''));
                    } catch (e) {}
                }

                const blob = await res.blob();
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = downloadFilename;
                document.body.appendChild(a);
                a.click();
                a.remove();
                setTimeout(() => URL.revokeObjectURL(url), 1000);
                showNotice(`"${downloadFilename}" Word belgesi başarıyla indirildi.`, "success");
            } catch (err) {
                showNotice("Word indirme bağlantı hatası: " + err.message, "error");
            } finally {
                if (btnEl) {
                    btnEl.disabled = false;
                    btnEl.innerHTML = origHtml;
                }
            }
        },

        async downloadMonumentWord(itemId, btnEl, projectId) {
            return this.downloadStudentWord(itemId, btnEl, projectId);
        },"""

        if old_download_func in norm_content:
            norm_content = norm_content.replace(old_download_func, new_download_func)
            print(f"Replaced downloadMonumentWord with downloadStudentWord in {research_js_path}")
        else:
            print(f"Notice: old_download_func not directly matched in {research_js_path}, searching...")

        # Also ensure downloadStudentWord is exported in RotaliTubitak
        if "downloadStudentWord," not in norm_content:
            norm_content = norm_content.replace(
                "downloadMonumentWord,",
                "downloadStudentWord,\n        downloadMonumentWord,"
            )

        with open(research_js_path, "w", encoding="utf-8") as f:
            f.write(norm_content)
        print(f"Saved {research_js_path}")

    print("Step 2 complete.")

if __name__ == "__main__":
    patch_all()
