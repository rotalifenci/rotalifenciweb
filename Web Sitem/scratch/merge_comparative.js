const fs = require('fs');

let code = fs.readFileSync('js/tubitak-research.js', 'utf8');
const compCode = fs.readFileSync('scratch/comparative_module.js', 'utf8');

// 1. Insert comparative module code right before '// 11. Olay Dinleyicileri'
const target1 = '// 11. Olay Dinleyicileri ve Dışa Aktarılan Arayüz (window.RotaliTubitak)';
if (!code.includes(target1)) {
  console.error('Target 1 not found!');
  process.exit(1);
}
code = code.replace(target1, compCode + '\n\n    ' + target1);

// 2. Add renderTeacherComparisonsManagement into teacher modal
const target2 = '${renderProje1TeacherStudentTracking()}';
if (!code.includes(target2)) {
  console.error('Target 2 not found!');
  process.exit(1);
}
code = code.replace(target2, target2 + '\n\n                <!-- Karşılaştırmalı Tarih Araştırmaları Yönetimi & Rubrik -->\n                ${renderTeacherComparisonsManagement()}');

// 3. Expose methods on window.RotaliTubitak
const target3 = 'openTeacherDashboardModal,';
const windowMethods = `
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
                const url = \`/api/tubitak-records?exportDocx=comparison&comparisonId=\${encodeURIComponent(targetId)}\`;
                const res = await fetch(url, {
                    headers: { "Authorization": \`Bearer \${currentSession.token}\` }
                });
                if (!res.ok) {
                    const errJson = await res.json().catch(() => ({}));
                    throw new Error(errJson.error || "Sunucu hatası");
                }
                const blob = await res.blob();
                const disp = res.headers.get("Content-Disposition") || "";
                let filename = "Karsilastirmali_Tarih_Raporu.docx";
                const match = disp.match(/filename\\*=UTF-8''([^;]+)/) || disp.match(/filename="?([^";]+)"?/);
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
        },`;

code = code.replace(target3, target3 + windowMethods);

// Syntax test
new Function(code);
console.log('Syntax check passed!');
fs.writeFileSync('js/tubitak-research.js', code, 'utf8');
console.log('Successfully updated js/tubitak-research.js!');
