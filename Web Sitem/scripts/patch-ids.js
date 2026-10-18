const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, '..', 'oyunlar', 'gunes-dunya-ay-3d.html');
let content = fs.readFileSync(targetPath, 'utf8');

// 1. Add id="moon-phase-pip-panel" to the moon phase section in the side drawer
content = content.replace(
    '<!-- 5. DÜNYA\'DAN AY GÖRÜNÜMÜ (EVRE PENCERESİ - ARTIK MENÜDE!) -->\n            <div class="space-y-2 pt-2 border-t border-white/10">',
    '<!-- 5. DÜNYA\'DAN AY GÖRÜNÜMÜ (EVRE PENCERESİ - ARTIK MENÜDE!) -->\n            <div id="moon-phase-pip-panel" class="space-y-2 pt-2 border-t border-white/10">'
);

// 2. Add id="btn-teacher-mode"
content = content.replace(
    '<button onclick="toggleTeacherMode(); closeSideMenu();" class="p-2.5 rounded-xl bg-slate-900 border border-amber-500/30 hover:bg-amber-600 text-slate-200 hover:text-white font-black text-[11px] flex items-center justify-center gap-1.5 transition-all cursor-pointer">',
    '<button id="btn-teacher-mode" onclick="toggleTeacherMode(); closeSideMenu();" class="p-2.5 rounded-xl bg-slate-900 border border-amber-500/30 hover:bg-amber-600 text-slate-200 hover:text-white font-black text-[11px] flex items-center justify-center gap-1.5 transition-all cursor-pointer">'
);

// 3. Add tidal lock buttons inside Ay section
const moonSectionOld = `                    <label class="flex items-center justify-between p-2 rounded-lg bg-purple-950/40 border border-purple-500/30 hover:bg-purple-950/60 transition-colors cursor-pointer text-xs">
                        <span class="font-bold text-purple-200 text-[11px] flex items-center gap-1">
                            <i class="fa-solid fa-thumbtack text-rose-400"></i> "Aynı Yüz" Türk Bayrağı & Çizgi
                        </span>
                        <input type="checkbox" id="chk-same-face" onchange="toggleSameFaceMarker()" checked class="w-4 h-4 rounded text-purple-400 accent-purple-400 cursor-pointer">
                    </label>
                </div>`;

const moonSectionNew = `                    <label class="flex items-center justify-between p-2 rounded-lg bg-purple-950/40 border border-purple-500/30 hover:bg-purple-950/60 transition-colors cursor-pointer text-xs">
                        <span class="font-bold text-purple-200 text-[11px] flex items-center gap-1">
                            <i class="fa-solid fa-thumbtack text-rose-400"></i> "Aynı Yüz" Türk Bayrağı & Çizgi
                        </span>
                        <input type="checkbox" id="chk-same-face" onchange="toggleSameFaceMarker()" checked class="w-4 h-4 rounded text-purple-400 accent-purple-400 cursor-pointer">
                    </label>

                    <!-- Kütleçekim Kilidi Seçici -->
                    <div class="mt-1 pt-1.5 border-t border-slate-700/50 flex items-center justify-between text-xs">
                        <span class="text-[10px] text-slate-300 font-bold">Ay Kilit Durumu:</span>
                        <div class="flex items-center gap-1">
                            <button type="button" id="btn-lock-real" onclick="setTidalLockMode('locked')" class="py-1 px-2 rounded-lg text-[10px] font-black bg-emerald-600 text-white border border-emerald-400 shadow-sm cursor-pointer transition-all">1 Tur (Gerçek)</button>
                            <button type="button" id="btn-lock-unlocked" onclick="setTidalLockMode('unlocked')" class="py-1 px-2 rounded-lg text-[10px] font-bold bg-slate-800 text-slate-300 hover:text-white border border-white/15 cursor-pointer transition-all">Dönmesiz</button>
                        </div>
                    </div>
                </div>`;

content = content.replace(moonSectionOld, moonSectionNew);

// Remove unused togglePanelCollapse from script or keep it harmless
fs.writeFileSync(targetPath, content, 'utf8');
console.log('Successfully updated IDs and tidal lock controls!');
