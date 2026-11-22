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

    // Add correctionCount & draftCount in openTeacherDashboardModal
    if (!code.includes('let correctionCount =')) {
        code = code.replace(
            'let approvedCount = Object.values(runtimeRecords).filter(r => r.status === "approved").length;',
            `let approvedCount = Object.values(runtimeRecords).filter(r => r.status === "approved").length;\n        let correctionCount = Object.values(runtimeRecords).filter(r => r.status === "correction_requested").length;\n        let draftCount = Object.values(runtimeRecords).filter(r => !r.status || r.status === "draft").length;`
        );
    }

    // Add filter buttons bar above stats
    if (!code.includes('id="teacher-filter-bar"')) {
        code = code.replace(
            '<!-- İstatistik Kartları -->',
            `<!-- Durum Filtre Çubuğu (Taslak, İncelemede, Düzeltme İstendi, Onaylandı) -->
            <div id="teacher-filter-bar" class="px-6 py-2.5 bg-slate-100 border-b border-slate-200 flex items-center gap-2 overflow-x-auto">
                <span class="text-[11px] font-black text-slate-500 uppercase shrink-0">Filtre:</span>
                <button type="button" onclick="window.RotaliTubitak.setTeacherFilterStatus('all')" class="px-3 py-1 rounded-xl text-xs font-black transition-all cursor-pointer \${teacherFilterStatus === 'all' ? 'bg-slate-900 text-white shadow-sm' : 'bg-white text-slate-700 hover:bg-slate-200'}">
                    Tümü (\${totalRecords})
                </button>
                <button type="button" onclick="window.RotaliTubitak.setTeacherFilterStatus('in_review')" class="px-3 py-1 rounded-xl text-xs font-black transition-all cursor-pointer \${teacherFilterStatus === 'in_review' ? 'bg-purple-600 text-white shadow-sm' : 'bg-purple-50 text-purple-800 hover:bg-purple-100'}">
                    İncelemede (\${inReviewCount})
                </button>
                <button type="button" onclick="window.RotaliTubitak.setTeacherFilterStatus('correction_requested')" class="px-3 py-1 rounded-xl text-xs font-black transition-all cursor-pointer \${teacherFilterStatus === 'correction_requested' ? 'bg-amber-600 text-white shadow-sm' : 'bg-amber-50 text-amber-900 hover:bg-amber-100'}">
                    Düzeltme İstendi (\${correctionCount})
                </button>
                <button type="button" onclick="window.RotaliTubitak.setTeacherFilterStatus('approved')" class="px-3 py-1 rounded-xl text-xs font-black transition-all cursor-pointer \${teacherFilterStatus === 'approved' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'}">
                    Onaylanan (\${approvedCount})
                </button>
                <button type="button" onclick="window.RotaliTubitak.setTeacherFilterStatus('draft')" class="px-3 py-1 rounded-xl text-xs font-black transition-all cursor-pointer \${teacherFilterStatus === 'draft' ? 'bg-slate-700 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-200'}">
                    Taslaklar (\${draftCount})
                </button>
            </div>

            <!-- İstatistik Kartları -->`
        );
    }

    // Expose setTeacherFilterStatus on window.RotaliTubitak
    if (!code.includes('setTeacherFilterStatus(status)')) {
        code = code.replace(
            'openTeacherDashboardModal,',
            `openTeacherDashboardModal,\n        setTeacherFilterStatus(status) {\n            teacherFilterStatus = status || "all";\n            openTeacherDashboardModal();\n        },`
        );
    }

    fs.writeFileSync(filePath, code, 'utf8');
    console.log("Successfully patched teacher filters in:", filePath);
});
