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

    // 1. In renderSiyerActiveYearForm: Add status banner above Siyer informational banner
    if (!code.includes('renderItemStatusBanner(item, getItemStatus(yearId)')) {
        code = code.replace(
            '<!-- Siyer Bilgilendirme Bannerı -->',
            `\${renderItemStatusBanner(item, getItemStatus(yearId), null, canEditItem)}\n\n        <!-- Siyer Bilgilendirme Bannerı -->`
        );
    }

    // 2. In selectItem: Remember last active item locally and on server
    if (!code.includes('action: "save_last_active"')) {
        code = code.replace(
            'activeItemId = itemId;',
            `activeItemId = itemId;\n            if (currentSession?.studentId) {\n                try {\n                    localStorage.setItem(\`rotali_last_active_\${activeProjectId}_\${currentSession.studentId}\`, itemId);\n                    if (currentSession.token) {\n                        fetch("/api/tubitak-records", {\n                            method: "POST",\n                            headers: { "Content-Type": "application/json", "Authorization": \`Bearer \${currentSession.token}\` },\n                            body: JSON.stringify({ action: "save_last_active", projectId: activeProjectId, itemId })\n                        }).catch(() => {});\n                    }\n                } catch (e) {}\n            }`
        );
    }

    // 3. In handleLogout: Check for unsaved changes before logout
    const oldLogoutRegex = /handleLogout\(\)\s*\{[\s\S]*?showNotice\("Güvenli çıkış yapıldı\.", "info"\);\s*\}/;
    const newLogoutCode = `async handleLogout() {
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
        }`;
    if (code.match(oldLogoutRegex)) {
        code = code.replace(oldLogoutRegex, newLogoutCode);
    }

    // 4. In handleLogin: Restore last active item from server or local storage
    if (!code.includes('const rememberedLastItem =')) {
        code = code.replace(
            'renderMainContainer(document.getElementById("tubitak-research-container"));\n                    showNotice(`Hoş geldiniz, ${data.studentName}!`, "success");',
            `const rememberedLastItem = (runtimeStudentState && runtimeStudentState[data.studentId]?.itemId) || localStorage.getItem(\`rotali_last_active_\${data.projectId}_\${data.studentId}\`);\n                    const projItems = seedData?.projects?.[data.projectId]?.items || [];\n                    if (rememberedLastItem && projItems.some(it => it.id === rememberedLastItem)) {\n                        activeItemId = rememberedLastItem;\n                    } else if (projItems.length > 0) {\n                        activeItemId = projItems[0].id;\n                    }\n                    renderMainContainer(document.getElementById("tubitak-research-container"));\n                    showNotice(\`Hoş geldiniz, \${data.studentName}! Son çalıştığınız konu başarıyla yüklendi.\`, "success");`
        );
    }

    // 5. Dynamic student selector helpers on window.RotaliTubitak
    if (!code.includes('onLoginPasswordInput')) {
        const studentSelectHelpers = `
        onLoginPasswordInput(val) {
            const selectEl = document.getElementById("login-student-select");
            const selectContainer = document.getElementById("login-student-selector-container");
            if (!selectEl) return;
            const clean = String(val || "").trim().toLowerCase();
            let projKey = null;
            if (clean === "tarih1071" || clean.startsWith("tarih") || clean.startsWith("sivas") || clean === "tubitak-eser") projKey = "proje-tarih";
            else if (clean === "bilim1453" || clean.startsWith("bilim") || clean.startsWith("islam") || clean === "tubitak-bilim") projKey = "proje-bilim";
            else if (clean === "siyer571" || clean.startsWith("siyer") || clean.startsWith("kronoloji") || clean === "tubitak-siyer") projKey = "proje-siyer";

            if (projKey && seedData?.projects?.[projKey]?.studentTeam) {
                const team = seedData.projects[projKey].studentTeam;
                selectEl.innerHTML = '<option value="">-- Takımınızdaki Adınızı Seçiniz --</option>' +
                    team.map(s => \`<option value="\${s.id}" data-name="\${escapeHtml(s.name)}">\${escapeHtml(s.name)} (\${s.groupLabel || 'Araştırmacı'})</option>\`).join("") +
                    '<option value="custom">👤 Listede Yokum (Manuel Ad Gir)</option>';
                if (selectContainer) selectContainer.classList.remove("hidden");
            } else {
                if (selectContainer) selectContainer.classList.add("hidden");
            }
        },

        onLoginStudentSelect(val) {
            const selectEl = document.getElementById("login-student-select");
            const nameEl = document.getElementById("login-student-name");
            const pinEl = document.getElementById("login-student-pin");
            if (!selectEl || !nameEl) return;
            if (val && val !== "custom") {
                const selectedOpt = selectEl.options[selectEl.selectedIndex];
                const studentName = selectedOpt.getAttribute("data-name") || selectedOpt.textContent;
                nameEl.value = studentName.split(' (')[0].trim();
                if (pinEl) pinEl.value = val;
            } else if (val === "custom") {
                nameEl.value = "";
                nameEl.focus();
            }
        },
`;
        code = code.replace(
            'saveCurrentItemDraft,',
            `saveCurrentItemDraft,\n        finalizeCurrentItem,\n${studentSelectHelpers}`
        );
    }

    // 6. In renderLoginModal: Add dynamic student selector HTML
    if (!code.includes('id="login-student-selector-container"')) {
        code = code.replace(
            '<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">',
            `<div id="login-student-selector-container" class="hidden">
                        <label class="block text-xs font-black uppercase tracking-wider text-amber-300 mb-1.5 flex items-center justify-between">
                            <span>👤 Takım Üyesi Seçiniz</span>
                            <span class="text-[10px] text-slate-400 lowercase">otomatik eşleştirme</span>
                        </label>
                        <select id="login-student-select" onchange="window.RotaliTubitak.onLoginStudentSelect(this.value)" class="w-full px-4 py-2.5 bg-slate-800/95 border border-amber-400/50 rounded-2xl text-xs font-bold text-white focus:outline-none transition-all">
                            <option value="">-- Takımınızdaki Adınızı Seçiniz --</option>
                        </select>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">`
        );
        code = code.replace(
            'id="login-password" placeholder="Takım proje şifrenizi veya öğretmen parolanızı giriniz"',
            'id="login-password" oninput="window.RotaliTubitak.onLoginPasswordInput(this.value)" placeholder="Takım proje şifrenizi veya öğretmen parolanızı giriniz"'
        );
    }

    fs.writeFileSync(filePath, code, 'utf8');
    console.log("Successfully patched part 3 in:", filePath);
});
