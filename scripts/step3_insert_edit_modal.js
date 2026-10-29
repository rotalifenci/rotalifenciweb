const fs = require('fs');
const path = require('path');

const appPath = path.resolve(__dirname, '../js/app.js');
let appJs = fs.readFileSync(appPath, 'utf8');

const targetStr = '// ✏️ PROJE KARTINI DÜZENLEME MODALI (Başlık, Rozet ve Fikirler)';
const idxTarget = appJs.indexOf(targetStr);

if (idxTarget === -1) {
    console.error('Target not found!');
    process.exit(1);
}

const editModalCode = `// =============================================================
// ✏️ AB KOD HAFTASI ETKİNLİK DÜZENLEME MODALI (YÖNETİCİ ÖZEL)
// =============================================================
window.openEditCodeWeekModal = function(act) {
    if (!act) return;
    let modal = document.getElementById("edit-codeweek-modal");
    if (!modal) {
        modal = document.createElement("div");
        modal.id = "edit-codeweek-modal";
        modal.className = "fixed inset-0 z-[9997] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 transition-all duration-300 animate-in fade-in";
        modal.onclick = function(e) {
            if (e.target === this) window.closeEditCodeWeekModal();
        };
        document.body.appendChild(modal);
    }

    const sectionsText = Array.isArray(act.sections) ? act.sections.join("\\n") : "";

    modal.innerHTML = \`
        <div class="bg-white rounded-3xl p-5 sm:p-7 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 relative animate-in zoom-in-95 duration-200" onclick="event.stopPropagation()">
            <!-- Üst Başlık -->
            <div class="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
                <div class="flex items-center gap-3">
                    <span class="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center text-lg shadow-md shadow-amber-500/25 shrink-0">
                        <i class="fa-solid fa-pen-to-square"></i>
                    </span>
                    <div>
                        <h4 class="text-base sm:text-lg font-black text-slate-900 leading-tight">Etkinlik Kartını Düzenle</h4>
                        <p class="text-xs text-slate-500 font-medium">Bu etkinlik için metinleri, adımları, kazanımı ve görseli özelleştirin</p>
                    </div>
                </div>
                <button type="button" onclick="window.closeEditCodeWeekModal()" class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer">
                    <i class="fa-solid fa-xmark text-sm"></i>
                </button>
            </div>

            <form onsubmit="window.handleSaveCodeWeekActivity(event, '\${act.id}')" class="space-y-4">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                        <label class="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">Etkinlik Başlığı</label>
                        <input type="text" id="edit-cw-title" value="\${(act.title || '').replace(/"/g, '&quot;')}" required class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all">
                    </div>
                    <div>
                        <label class="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">Rozet / Başlık Etiketi</label>
                        <input type="text" id="edit-cw-badge" value="\${(act.badge || '').replace(/"/g, '&quot;')}" required class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all">
                    </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                    <div class="sm:col-span-2">
                        <label class="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">Alt Başlık / Çağrı Cümlesi</label>
                        <input type="text" id="edit-cw-subtitle" value="\${(act.subtitle || '').replace(/"/g, '&quot;')}" class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all">
                    </div>
                    <div>
                        <label class="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">Sınıf Seviyesi</label>
                        <select id="edit-cw-grade" class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all">
                            <option value="5" \${act.grade === '5' ? 'selected' : ''}>5. Sınıf</option>
                            <option value="6" \${act.grade === '6' ? 'selected' : ''}>6. Sınıf</option>
                            <option value="7" \${act.grade === '7' ? 'selected' : ''}>7. Sınıf</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label class="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">Hedef Fen & Algoritma Kazanımı</label>
                    <input type="text" id="edit-cw-outcome" value="\${(act.outcome || '').replace(/"/g, '&quot;')}" required class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all">
                </div>

                <div>
                    <label class="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">Detaylı Açıklama</label>
                    <textarea id="edit-cw-desc" rows="2" class="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all">\${(act.description || '').replace(/</g, '&lt;')}</textarea>
                </div>

                <div>
                    <label class="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">Görsel Dosya Yolu / URL</label>
                    <input type="text" id="edit-cw-image" value="\${(act.image || '').replace(/"/g, '&quot;')}" class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all">
                </div>

                <div>
                    <label class="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">Etkinlik Adımları / Soru Başlıkları (Her satıra bir adım yazın)</label>
                    <textarea id="edit-cw-sections" rows="4" class="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all leading-relaxed">\${sectionsText.replace(/</g, '&lt;')}</textarea>
                </div>

                <div>
                    <label class="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">Slogan / Motto</label>
                    <input type="text" id="edit-cw-motto" value="\${(act.motto || '').replace(/"/g, '&quot;')}" class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all">
                </div>

                <div class="flex items-center justify-between gap-3 pt-3 border-t border-slate-100 flex-wrap">
                    <button type="button" onclick="window.resetCodeWeekActivity('\${act.id}')" class="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl transition-colors border border-rose-200 flex items-center gap-1.5 cursor-pointer">
                        <i class="fa-solid fa-rotate-left"></i>
                        <span>Varsayılana Dön</span>
                    </button>
                    <div class="flex items-center gap-2">
                        <button type="button" onclick="window.closeEditCodeWeekModal()" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer">
                            İptal
                        </button>
                        <button type="submit" class="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-amber-500/25 flex items-center gap-1.5 active:scale-95 cursor-pointer">
                            <i class="fa-solid fa-check"></i>
                            <span>Değişiklikleri Kaydet</span>
                        </button>
                    </div>
                </div>
            </form>
        </div>
    \`;
    document.body.style.overflow = "hidden";
};

window.closeEditCodeWeekModal = function() {
    const modal = document.getElementById("edit-codeweek-modal");
    if (modal) modal.remove();
    document.body.style.overflow = "";
};

window.handleSaveCodeWeekActivity = function(event, actId) {
    if (event) event.preventDefault();
    const title = document.getElementById("edit-cw-title")?.value.trim();
    const badge = document.getElementById("edit-cw-badge")?.value.trim();
    const subtitle = document.getElementById("edit-cw-subtitle")?.value.trim();
    const grade = document.getElementById("edit-cw-grade")?.value.trim();
    const outcome = document.getElementById("edit-cw-outcome")?.value.trim();
    const desc = document.getElementById("edit-cw-desc")?.value.trim();
    const image = document.getElementById("edit-cw-image")?.value.trim();
    const sectionsRaw = document.getElementById("edit-cw-sections")?.value || "";
    const motto = document.getElementById("edit-cw-motto")?.value.trim();

    const sections = sectionsRaw.split("\\n").map(s => s.trim()).filter(Boolean);

    let customMap = {};
    try {
        const stored = localStorage.getItem("rotali_custom_codeweek_activities");
        if (stored) customMap = JSON.parse(stored);
    } catch(e) {}

    customMap[actId] = {
        title,
        badge,
        subtitle,
        grade,
        outcome,
        description: desc,
        image,
        sections,
        motto
    };

    localStorage.setItem("rotali_custom_codeweek_activities", JSON.stringify(customMap));
    window.CODEWEEK_ACTIVITIES = window.getCodeWeekActivitiesWithCustom();
    window.dispatchEvent(new CustomEvent('rotali-codeweek-updated'));

    window.closeEditCodeWeekModal();
    if (typeof showToast === 'function') {
        showToast("Etkinlik başarıyla güncellendi!", "success");
    } else {
        alert("Etkinlik başarıyla güncellendi!");
    }
};

window.resetCodeWeekActivity = function(actId) {
    if (!confirm("Bu etkinliği orijinal varsayılan haline döndürmek istediğinize emin misiniz?")) return;
    let customMap = {};
    try {
        const stored = localStorage.getItem("rotali_custom_codeweek_activities");
        if (stored) customMap = JSON.parse(stored);
    } catch(e) {}

    delete customMap[actId];
    localStorage.setItem("rotali_custom_codeweek_activities", JSON.stringify(customMap));
    window.CODEWEEK_ACTIVITIES = window.getCodeWeekActivitiesWithCustom();
    window.dispatchEvent(new CustomEvent('rotali-codeweek-updated'));

    window.closeEditCodeWeekModal();
    if (typeof showToast === 'function') {
        showToast("Etkinlik varsayılan haline döndürüldü.", "info");
    } else {
        alert("Etkinlik varsayılan haline döndürüldü.");
    }
};

`;

appJs = appJs.slice(0, idxTarget) + editModalCode + appJs.slice(idxTarget);
fs.writeFileSync(appPath, appJs, 'utf8');
console.log('Successfully inserted openEditCodeWeekModal');
