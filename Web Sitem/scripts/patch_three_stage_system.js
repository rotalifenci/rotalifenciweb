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

    // 1. State variables
    if (!code.includes('runtimeFinalized')) {
        code = code.replace(
            'let runtimeAssignments = {};',
            `let runtimeAssignments = {};\n    let runtimeFinalized = {};\n    let runtimeStudentState = {};\n    let lastSavedTimeString = "";\n    let teacherFilterStatus = "all";`
        );
    }

    // 2. syncProjectData: receive finalized & studentState
    if (!code.includes('if (data.finalized) runtimeFinalized')) {
        code = code.replace(
            'if (data.siyerEvents) runtimeSiyerEvents = { ...data.siyerEvents };',
            `if (data.finalized) runtimeFinalized = { ...runtimeFinalized, ...data.finalized };\n                    if (data.studentState) runtimeStudentState = { ...runtimeStudentState, ...data.studentState };\n                    if (data.siyerEvents) runtimeSiyerEvents = { ...data.siyerEvents };`
        );
    }

    // 3. isItemEditableByCurrentUser: lock when in_review or approved
    const oldEditableRegex = /function isItemEditableByCurrentUser\(item\)\s*\{[\s\S]*?return true;\s*\}/;
    const newEditableCode = `function isItemEditableByCurrentUser(item) {
        if (!currentSession || !item) return false;
        if (currentSession.role === "teacher") return true;
        if (activeProjectId !== "proje-tarih" && activeProjectId !== "proje-bilim" && activeProjectId !== "proje-siyer") return true;

        const myStuId = resolveCurrentUserStudentId(activeProjectId);
        const assignedStuId = getItemAssignedStudentId(item, activeProjectId);
        if (myStuId && assignedStuId && myStuId !== assignedStuId) {
            return false;
        }

        // KESİNLEŞTİRME KİLİDİ: İncelemede veya onaylanmışsa öğrenci doğrudan düzenleyemez
        // Öğretmen 'Düzeltme İstendi' verirse kilit açılır ve öğrenci tekrar düzenleyebilir!
        const status = getItemStatus(item.id);
        if (status === "in_review" || status === "approved") {
            return false;
        }

        return true;
    }`;
    if (code.match(oldEditableRegex)) {
        code = code.replace(oldEditableRegex, newEditableCode);
    }

    // 4. getItemStatus: incorporate runtimeFinalized
    if (!code.includes('const finalMeta = runtimeFinalized?.[itemId];')) {
        code = code.replace(
            'let hasCorrection = false;',
            `let hasCorrection = false;\n        const finalMeta = runtimeFinalized?.[itemId];\n        if (finalMeta?.status === "in_review") hasInReview = true;\n        if (finalMeta?.status === "approved") hasApproved = true;\n        if (finalMeta?.status === "correction_requested") hasCorrection = true;`
        );
    }

    // 5. updateUIAutosaveBadge: comprehensive states & timestamps
    const oldBadgeRegex = /function updateUIAutosaveBadge\(state\)\s*\{[\s\S]*?text\.className = "text-xs font-black text-rose-700";\s*\}\s*\}/;
    const newBadgeCode = `function updateUIAutosaveBadge(state, customMsg, customTime) {
        saveState = state;
        const dot = document.getElementById("autosave-dot");
        const text = document.getElementById("autosave-text");
        const timeEl = document.getElementById("autosave-time");
        if (!dot || !text) return;

        if (state === "saved") {
            lastSavedTimeString = customTime || new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        }

        switch (state) {
            case "saving":
                dot.className = "w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse";
                text.textContent = customMsg || "Otomatik kaydediliyor...";
                text.className = "text-xs font-black text-blue-700";
                if (timeEl) timeEl.textContent = "";
                break;
            case "saved":
                dot.className = "w-2.5 h-2.5 rounded-full bg-emerald-500";
                text.textContent = customMsg || "Tüm değişiklikler kaydedildi";
                text.className = "text-xs font-black text-emerald-700";
                if (timeEl) timeEl.textContent = lastSavedTimeString ? \`(\${lastSavedTimeString})\` : "";
                break;
            case "dirty":
                dot.className = "w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping";
                text.textContent = customMsg || "Kaydedilmemiş değişiklikler";
                text.className = "text-xs font-black text-amber-700";
                break;
            case "error":
                dot.className = "w-2.5 h-2.5 rounded-full bg-rose-500";
                text.textContent = customMsg || "Kayıt başarısız";
                text.className = "text-xs font-black text-rose-700";
                break;
            case "waiting_connection":
            case "offline":
                dot.className = "w-2.5 h-2.5 rounded-full bg-amber-500";
                text.textContent = customMsg || "Çevrimdışı – senkronizasyon bekliyor";
                text.className = "text-xs font-black text-amber-700";
                break;
            case "in_review":
                dot.className = "w-2.5 h-2.5 rounded-full bg-purple-500";
                text.textContent = customMsg || "İncelemeye Gönderildi";
                text.className = "text-xs font-black text-purple-700";
                break;
            case "correction_requested":
                dot.className = "w-2.5 h-2.5 rounded-full bg-orange-500";
                text.textContent = customMsg || "Düzeltme İstendi";
                text.className = "text-xs font-black text-orange-700";
                break;
            case "approved":
                dot.className = "w-2.5 h-2.5 rounded-full bg-emerald-600";
                text.textContent = customMsg || "Onaylandı";
                text.className = "text-xs font-black text-emerald-700";
                break;
            default:
                dot.className = "w-2.5 h-2.5 rounded-full bg-slate-400";
                text.textContent = customMsg || state;
                text.className = "text-xs font-black text-slate-600";
                break;
        }
    }`;
    if (code.match(oldBadgeRegex)) {
        code = code.replace(oldBadgeRegex, newBadgeCode);
    }

    fs.writeFileSync(filePath, code, 'utf8');
    console.log("Successfully patched core variables & functions in:", filePath);
});
