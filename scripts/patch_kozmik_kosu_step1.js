const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, '../oyunlar/kozmik-kosu-3d.html');
let html = fs.readFileSync(targetFile, 'utf8');

// 1. Replace HTML question HUD with Live In-Game Question Banner
const oldHudMarkerStart = '<!-- ❓ 3D BİLİMSEL SORU KARTI (10 Saniyelik Bekleme & 2 Şıklı Seçenek A - B) -->';
const oldHudMarkerEnd = '<!-- 💡 Bilimsel Açıklama / Geri Bildirim Toastı (Geçitten sonra) -->';

const hudStartIdx = html.indexOf(oldHudMarkerStart);
const hudEndIdx = html.indexOf(oldHudMarkerEnd);

if (hudStartIdx === -1 || hudEndIdx === -1) {
  console.error('Could not find HUD markers in HTML!');
  process.exit(1);
}

const newHudHtml = `<!-- ❓ 3D BİLİMSEL SORU GEÇİDİ ÜST BANNER (OYUNU DURDURMAZ, KOŞARAK SEÇİLİR) -->
        <div id="live-question-banner" class="fixed top-12 sm:top-14 left-1/2 -translate-x-1/2 z-40 w-[95vw] max-w-xl transition-all duration-300 pointer-events-none opacity-0 -translate-y-4">
            <div class="bg-slate-950/92 backdrop-blur-md border-2 border-cyan-400/80 rounded-2xl p-2.5 sm:p-3.5 shadow-[0_0_30px_rgba(6,182,212,0.4)] text-white text-center">
                <div class="flex items-center justify-between gap-2 border-b border-cyan-500/30 pb-1.5 mb-1.5">
                    <span class="text-[9px] sm:text-[10px] font-orbitron font-extrabold text-cyan-300 uppercase tracking-widest flex items-center gap-1.5">
                        <i class="fa-solid fa-arrows-split-up-and-left text-amber-400"></i> BİLİMSEL KAPI GEÇİDİ — DOĞRU KAPIDAN GEÇ!
                    </span>
                    <span class="text-[9px] font-mono text-slate-300 bg-slate-900 px-2 py-0.5 rounded-full border border-slate-700" id="live-q-badge">Soru 1 / 50</span>
                </div>
                <h3 class="text-xs sm:text-sm md:text-base font-black text-white leading-snug mb-2" id="live-q-text">
                    Soru yükleniyor...
                </h3>
                <!-- 2 Kapı İpucu Şeritleri -->
                <div class="grid grid-cols-2 gap-2 text-left">
                    <div class="p-1.5 sm:p-2 rounded-xl bg-cyan-950/80 border border-cyan-400/60 flex items-center gap-2">
                        <span class="w-6 h-6 rounded-lg bg-cyan-500 text-slate-950 font-orbitron font-black text-xs flex items-center justify-center shrink-0">A</span>
                        <div class="min-w-0">
                            <span class="text-[9px] text-cyan-300 font-bold block uppercase tracking-wider">⬅️ SOL KAPI</span>
                            <span class="text-xs font-black text-white truncate block" id="live-opt-a-text">Seçenek A</span>
                        </div>
                    </div>
                    <div class="p-1.5 sm:p-2 rounded-xl bg-amber-950/80 border border-amber-400/60 flex items-center gap-2">
                        <span class="w-6 h-6 rounded-lg bg-amber-500 text-slate-950 font-orbitron font-black text-xs flex items-center justify-center shrink-0">B</span>
                        <div class="min-w-0">
                            <span class="text-[9px] text-amber-300 font-bold block uppercase tracking-wider">SAĞ KAPI ➡️</span>
                            <span class="text-xs font-black text-white truncate block" id="live-opt-b-text">Seçenek B</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        `;

html = html.substring(0, hudStartIdx) + newHudHtml + html.substring(hudEndIdx);
console.log('✔ Replaced Question HUD in HTML');

// 2. Remove GAME.isPausedForQuestion check from keydown listener
const oldKeydownCheck = `            // Soru bekleme anında A, B, 1, 2 veya Ok tuşlarıyla cevap verme
            if (GAME.isPausedForQuestion) {
                const k = e.key.toLowerCase();
                if (k === 'a' || k === '1' || e.key === 'ArrowLeft') {
                    e.preventDefault();
                    handleQuestionAnswerChoice(0);
                    return;
                } else if (k === 'b' || k === '2' || e.key === 'ArrowRight') {
                    e.preventDefault();
                    handleQuestionAnswerChoice(1);
                    return;
                }
            }

            if (GAME.state !== 'playing') return;`;

const newKeydownCheck = `            if (GAME.state !== 'playing') return;`;

if (html.includes(oldKeydownCheck)) {
  html = html.replace(oldKeydownCheck, newKeydownCheck);
  console.log('✔ Removed isPausedForQuestion block in keydown listener');
} else {
  console.log('⚠ Could not find exact oldKeydownCheck');
}

fs.writeFileSync(targetFile, html, 'utf8');
