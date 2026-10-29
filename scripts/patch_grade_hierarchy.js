const fs = require('fs');
const path = require('path');

const appJsPath = path.join(__dirname, '..', 'js', 'app.js');
let appJs = fs.readFileSync(appJsPath, 'utf8');

// ============================================================
// 1. UPDATE renderGradeDetail: Default subtab & 5 Category Cards
// ============================================================

// A. Replace subTab resolution in renderGradeDetail
const oldSubTabRegex = /let subTab = parts\[1\] \|\| savedSubTab \|\| "ders-notu";\s*if \(subTab === "uniteler"\) subTab = "ders-notu";/;
const newSubTabCode = `let subTab = parts[1] || (savedSubTab && savedSubTab !== "ders-notu" ? savedSubTab : "videolar");
    if (!parts[1] && (!savedSubTab || savedSubTab === "ders-notu")) {
        subTab = "videolar";
    }
    if (subTab === "uniteler") subTab = "videolar";`;

if (appJs.match(oldSubTabRegex)) {
    appJs = appJs.replace(oldSubTabRegex, newSubTabCode);
    console.log("Updated subTab resolution in renderGradeDetail");
} else {
    console.log("Warning: oldSubTabRegex not found or already replaced");
}

// B. Replace the category cards in renderGradeDetail
const categoryCardsOldStart = '<!-- ALT BÖLÜM KUTULARI (KOMPAKT DİZİLİM) -->';
const categoryCardsOldEnd = '<!-- SEÇİLEN ALT BÖLÜMÜN İÇERİĞİ -->';

const startIndex = appJs.indexOf(categoryCardsOldStart);
const endIndex = appJs.indexOf(categoryCardsOldEnd);

if (startIndex !== -1 && endIndex !== -1) {
    const newCategoryCardsHtml = `<!-- 5 ANA KATEGORİ (MEB & KULLANICI HİYERARŞİK DİZİLİMİ) -->
                    <div class="pt-3 border-t border-white/20">
                        <div class="grid grid-cols-2 sm:grid-cols-3 \${grade.number === 8 || grade.isLGS ? "lg:grid-cols-6" : "lg:grid-cols-5"} gap-2 sm:gap-2.5">
                            
                            <!-- 1. Videolar -->
                            <a href="#grade/\${grade.id}/videolar" onclick="switchGradeSubTab('\${grade.id}', 'videolar', event)" class="group p-2.5 rounded-2xl transition-all flex flex-col items-center justify-center text-center gap-1.5 cursor-pointer select-none no-underline \${subTab === 'videolar' ? 'bg-white text-slate-900 shadow-xl scale-[1.03] ring-2 ring-white/70' : 'bg-white/15 hover:bg-white/25 backdrop-blur-md text-white border border-white/15'}">
                                <div class="relative w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center text-base \${subTab === 'videolar' ? 'bg-rose-600 text-white shadow-md' : 'bg-white/20 text-white'}">
                                    <i class="fa-solid fa-circle-play"></i>
                                    \${getTabCustomCount('videolar') > 0 ? \`<span class="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-rose-400 border-2 border-white shadow-sm animate-pulse"></span>\` : ''}
                                </div>
                                <span class="text-[11px] font-black tracking-tight uppercase leading-tight flex items-center justify-center gap-1">
                                    <span>🎥 VİDEOLAR</span>
                                    \${getTabCustomCount('videolar') > 0 ? \`<span class="px-1.5 py-0.2 rounded-full text-[9px] font-black \${subTab === 'videolar' ? 'bg-rose-100 text-rose-800' : 'bg-white/30 text-white'}">\${getTabCustomCount('videolar')}</span>\` : ''}
                                </span>
                            </a>

                            <!-- 2. Etkinlikler -->
                            <a href="#grade/\${grade.id}/etkinlikler" onclick="switchGradeSubTab('\${grade.id}', 'etkinlikler', event)" class="group p-2.5 rounded-2xl transition-all flex flex-col items-center justify-center text-center gap-1.5 cursor-pointer select-none no-underline \${subTab === 'etkinlikler' ? 'bg-white text-slate-900 shadow-xl scale-[1.03] ring-2 ring-white/70' : 'bg-white/15 hover:bg-white/25 backdrop-blur-md text-white border border-white/15'}">
                                <div class="relative w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center text-base \${subTab === 'etkinlikler' ? 'bg-emerald-600 text-white shadow-md' : 'bg-white/20 text-white'}">
                                    <i class="fa-solid fa-puzzle-piece"></i>
                                    \${getTabCustomCount('etkinlikler') > 0 ? \`<span class="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white shadow-sm animate-pulse"></span>\` : ''}
                                </div>
                                <span class="text-[11px] font-black tracking-tight uppercase leading-tight flex items-center justify-center gap-1">
                                    <span>🧩 ETKİNLİKLER</span>
                                    \${getTabCustomCount('etkinlikler') > 0 ? \`<span class="px-1.5 py-0.5 rounded-full text-[9px] font-black \${subTab === 'etkinlikler' ? 'bg-emerald-100 text-emerald-800' : 'bg-white/30 text-white'}">\${getTabCustomCount('etkinlikler')}</span>\` : ''}
                                </span>
                            </a>

                            <!-- 3. Test / Deneme -->
                            <a href="#grade/\${grade.id}/soru-bankasi" onclick="switchGradeSubTab('\${grade.id}', 'soru-bankasi', event)" class="group p-2.5 rounded-2xl transition-all flex flex-col items-center justify-center text-center gap-1.5 cursor-pointer select-none no-underline \${subTab === 'soru-bankasi' ? 'bg-white text-slate-900 shadow-xl scale-[1.03] ring-2 ring-white/70' : 'bg-white/15 hover:bg-white/25 backdrop-blur-md text-white border border-white/15'}">
                                <div class="relative w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center text-base \${subTab === 'soru-bankasi' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white/20 text-white'}">
                                    <i class="fa-solid fa-book-open-reader"></i>
                                    \${getTabCustomCount('soru-bankasi') > 0 ? \`<span class="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-indigo-400 border-2 border-white shadow-sm animate-pulse"></span>\` : ''}
                                </div>
                                <span class="text-[11px] font-black tracking-tight uppercase leading-tight flex items-center justify-center gap-1">
                                    <span>📝 TEST / DENEME</span>
                                    \${getTabCustomCount('soru-bankasi') > 0 ? \`<span class="px-1.5 py-0.5 rounded-full text-[9px] font-black \${subTab === 'soru-bankasi' ? 'bg-indigo-100 text-indigo-800' : 'bg-white/30 text-white'}">\${getTabCustomCount('soru-bankasi')}</span>\` : ''}
                                </span>
                            </a>

                            <!-- 4. Yazılıya Hazırlık -->
                            <a href="#grade/\${grade.id}/denemeler" onclick="switchGradeSubTab('\${grade.id}', 'denemeler', event)" class="group p-2.5 rounded-2xl transition-all flex flex-col items-center justify-center text-center gap-1.5 cursor-pointer select-none no-underline \${subTab === 'denemeler' ? 'bg-white text-slate-900 shadow-xl scale-[1.03] ring-2 ring-white/70' : 'bg-white/15 hover:bg-white/25 backdrop-blur-md text-white border border-white/15'}">
                                <div class="relative w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center text-base \${subTab === 'denemeler' ? 'bg-purple-600 text-white shadow-md' : 'bg-white/20 text-white'}">
                                    <i class="fa-solid fa-bullseye"></i>
                                    \${getTabCustomCount('denemeler') > 0 ? \`<span class="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-purple-400 border-2 border-white shadow-sm animate-pulse"></span>\` : ''}
                                </div>
                                <span class="text-[11px] font-black tracking-tight uppercase leading-tight flex items-center justify-center gap-1">
                                    <span>🎯 YAZILIYA HAZIRLIK</span>
                                    \${getTabCustomCount('denemeler') > 0 ? \`<span class="px-1.5 py-0.5 rounded-full text-[9px] font-black \${subTab === 'denemeler' ? 'bg-purple-100 text-purple-800' : 'bg-white/30 text-white'}">\${getTabCustomCount('denemeler')}</span>\` : ''}
                                </span>
                            </a>

                            <!-- 5. Eğitsel Oyun -->
                            <a href="#grade/\${grade.id}/egitsel-oyunlar" onclick="switchGradeSubTab('\${grade.id}', 'egitsel-oyunlar', event)" class="group p-2.5 rounded-2xl transition-all flex flex-col items-center justify-center text-center gap-1.5 cursor-pointer select-none no-underline \${subTab === 'egitsel-oyunlar' ? 'bg-white text-slate-900 shadow-xl scale-[1.03] ring-2 ring-white/70' : 'bg-white/15 hover:bg-white/25 backdrop-blur-md text-white border border-white/15'}">
                                <div class="relative w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center text-base \${subTab === 'egitsel-oyunlar' ? 'bg-fuchsia-600 text-white shadow-md' : 'bg-white/20 text-white'}">
                                    <i class="fa-solid fa-gamepad"></i>
                                    \${getTabCustomCount('egitsel-oyunlar') > 0 ? \`<span class="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-fuchsia-400 border-2 border-white shadow-sm animate-pulse"></span>\` : ''}
                                </div>
                                <span class="text-[11px] font-black tracking-tight uppercase leading-tight flex items-center justify-center gap-1">
                                    <span>🎮 EĞİTSEL OYUN</span>
                                    \${getTabCustomCount('egitsel-oyunlar') > 0 ? \`<span class="px-1.5 py-0.5 rounded-full text-[9px] font-black \${subTab === 'egitsel-oyunlar' ? 'bg-fuchsia-100 text-fuchsia-800' : 'bg-white/30 text-white'}">\${getTabCustomCount('egitsel-oyunlar')}</span>\` : ''}
                                </span>
                            </a>

                            \${grade.number === 8 || grade.isLGS ? \`
                            <!-- 6. LGS Pusulası (8. Sınıfa Özel) -->
                            <a href="#grade/\${grade.id}/lgs" onclick="switchGradeSubTab('\${grade.id}', 'lgs', event)" class="group p-2.5 rounded-2xl transition-all flex flex-col items-center justify-center text-center gap-1.5 cursor-pointer select-none no-underline \${subTab === 'lgs' || subTab === 'lgs-pusulasi' ? 'bg-white text-slate-900 shadow-xl scale-[1.03] ring-2 ring-white/70' : 'bg-white/15 hover:bg-white/25 backdrop-blur-md text-white border border-white/15'}">
                                <div class="relative w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center text-base \${subTab === 'lgs' || subTab === 'lgs-pusulasi' ? 'bg-red-600 text-white shadow-md' : 'bg-white/20 text-white'}">
                                    <i class="fa-solid fa-graduation-cap"></i>
                                    \${getTabCustomCount('lgs') > 0 ? \`<span class="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-400 border-2 border-white shadow-sm animate-pulse"></span>\` : ''}
                                </div>
                                <span class="text-[11px] font-black tracking-tight uppercase leading-tight flex items-center justify-center gap-1">
                                    <span>🧭 LGS PUSULASI</span>
                                    \${getTabCustomCount('lgs') > 0 ? \`<span class="px-1.5 py-0.5 rounded-full text-[9px] font-black \${subTab === 'lgs' || subTab === 'lgs-pusulasi' ? 'bg-red-100 text-red-800' : 'bg-white/30 text-white'}">\${getTabCustomCount('lgs')}</span>\` : ''}
                                </span>
                            </a>
                            \` : ''}
                        </div>

                        <!-- Ek Destek Kaynakları (Ders Kitabı & Bilimin Rotası) -->
                        <div class="flex items-center justify-end gap-2 mt-2 pt-2 border-t border-white/15">
                            <span class="text-[10px] text-white/70 font-bold uppercase tracking-wider hidden sm:inline">Diğer Kaynaklar:</span>
                            <a href="#grade/\${grade.id}/ders-notu" onclick="switchGradeSubTab('\${grade.id}', 'ders-notu', event)" class="px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 \${(subTab === 'ders-notu' || subTab === 'ders-sunumu') ? 'bg-white text-slate-900 shadow-sm font-black' : 'bg-white/10 hover:bg-white/20 text-white/90'}">
                                <i class="fa-solid fa-book-bookmark text-[9px]"></i> <span>Ders Kitabı & Sunumlar</span>
                            </a>
                            <a href="#grade/\${grade.id}/bilim-insanlari" onclick="switchGradeSubTab('\${grade.id}', 'bilim-insanlari', event)" class="px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 \${subTab === 'bilim-insanlari' ? 'bg-white text-slate-900 shadow-sm font-black' : 'bg-white/10 hover:bg-white/20 text-white/90'}">
                                <i class="fa-solid fa-telescope text-[9px]"></i> <span>Bilimin Rotası</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            `;
    appJs = appJs.substring(0, startIndex) + newCategoryCardsHtml + appJs.substring(endIndex);
    console.log("Successfully updated 5 Category Cards in renderGradeDetail");
} else {
    console.log("Warning: category cards markers not found:", { startIndex, endIndex });
}

// ============================================================
// 2. UPDATE renderGradeUnitBasedHub: MEB Curriculum & Subtopics Bar
// ============================================================

// Replace unitList calculation in renderGradeUnitBasedHub
const unitListPattern = /const unitList = unitTitlesMap\[gNum\] \|\| unitTitlesMap\["6"\];/;
const newUnitListCode = `const currGradeMeb = (typeof MEB_CURRICULUM !== "undefined" && MEB_CURRICULUM[gNum]) ? MEB_CURRICULUM[gNum] : null;
    const unitList = (currGradeMeb && Array.isArray(currGradeMeb.units)) ? currGradeMeb.units.map(u => u.name) : (unitTitlesMap[gNum] || unitTitlesMap["6"]);`;

if (appJs.includes('const unitList = unitTitlesMap[gNum] || unitTitlesMap["6"];')) {
    appJs = appJs.replace(unitListPattern, newUnitListCode);
    console.log("Updated unitList calculation to use MEB_CURRICULUM");
}

// Check where accordion body starts in renderGradeUnitBasedHub:
// `<div id="${accordionId}" class="unit-card-body accordion-body-collapsible ${isOpenInitial ? '' : 'hidden'} border-t border-slate-100 p-4 sm:p-6 bg-slate-50/50">`
const accordionBodyMarker = '<div id="${accordionId}" class="unit-card-body accordion-body-collapsible ${isOpenInitial ? \'\' : \'hidden\'} border-t border-slate-100 p-4 sm:p-6 bg-slate-50/50">';

if (appJs.includes(accordionBodyMarker)) {
    const subtopicBarInsertion = `<div id="\${accordionId}" class="unit-card-body accordion-body-collapsible \${isOpenInitial ? '' : 'hidden'} border-t border-slate-100 p-4 sm:p-6 bg-slate-50/50">
                                <!-- 📌 MEB MÜFREDATI ALT BAŞLIKLARI VE KONU NUMARALANDIRMASI -->
                                \${(() => {
                                    const subtopics = (typeof getUnitSubtopics === "function") ? getUnitSubtopics(grade.number, unitNum) : [];
                                    if (!subtopics || subtopics.length === 0) return '';
                                    return \`
                                    <div class="mb-5 bg-white rounded-2xl p-3 sm:p-4 border border-slate-200/90 shadow-xs">
                                        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2.5 px-0.5">
                                            <div class="flex items-center gap-2">
                                                <span class="w-2.5 h-2.5 rounded-full bg-blue-600 shadow-xs"></span>
                                                <h5 class="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                                                    <span>MEB Ünite Alt Başlıkları</span>
                                                    <span class="px-2 py-0.2 rounded-full bg-blue-50 text-blue-700 text-[10px] font-black border border-blue-200">\${subtopics.length} Alt Başlık</span>
                                                </h5>
                                            </div>
                                            <span class="text-[11px] font-semibold text-slate-400">Konuya tıklayarak filtreleyebilirsiniz</span>
                                        </div>

                                        <!-- Alt Başlık Butonları (Yatay Kaydırılabilir ve Tıklanabilir) -->
                                        <div class="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin subtopic-pill-container" data-unit="\${unitNum}">
                                            <!-- Tüm Konular Butonu -->
                                            <button type="button" 
                                                    onclick="filterMaterialsBySubtopic('\${unitNum}', 'all', '\${grade.number}', '\${normSubTab}')"
                                                    data-subtopic="all"
                                                    class="subtopic-filter-btn px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shrink-0 bg-slate-900 text-white shadow-xs cursor-pointer">
                                                <i class="fa-solid fa-layer-group text-[11px]"></i>
                                                <span>Tüm Konular</span>
                                                <span class="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] bg-white/20 text-white font-bold">\${totalItems.length}</span>
                                            </button>

                                            <!-- Numaralı Alt Başlıklar (Örn: 1. Güneş'in Yapısı ve Özellikleri) -->
                                            \${subtopics.map(sub => {
                                                const matchCount = totalItems.filter(item => isMaterialMatchingSubtopic(item, sub)).length;
                                                return \`
                                                <button type="button"
                                                        onclick="filterMaterialsBySubtopic('\${unitNum}', '\${sub.num}', '\${grade.number}', '\${normSubTab}')"
                                                        data-subtopic="\${sub.num}"
                                                        class="subtopic-filter-btn px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/80 cursor-pointer hover:border-slate-300">
                                                    <span class="w-5 h-5 rounded-lg bg-blue-100 text-blue-800 font-black text-[11px] flex items-center justify-center shrink-0 shadow-xs">\${sub.num}</span>
                                                    <span class="truncate max-w-[210px] sm:max-w-none">\${sub.title}</span>
                                                    \${matchCount > 0 ? \`<span class="px-1.5 py-0.2 rounded-full text-[10px] bg-blue-50 text-blue-700 font-black border border-blue-200 shadow-2xs">\${matchCount}</span>\` : ''}
                                                </button>
                                                \`;
                                            }).join('')}
                                        </div>
                                    </div>
                                    \`;
                                })()}`;

    appJs = appJs.replace(accordionBodyMarker, subtopicBarInsertion);
    console.log("Successfully injected Subtopics Bar into renderGradeUnitBasedHub accordion body");
} else {
    console.log("Warning: accordionBodyMarker not found in renderGradeUnitBasedHub");
}

// Also update the card grid container in renderGradeUnitBasedHub to have class "unit-materials-grid"
appJs = appJs.replace(
    '<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">',
    '<div class="unit-materials-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">'
);

// Add data-subtopics and unit-material-card to card outer div
const cardOuterOld = '<div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-slate-400 hover:shadow-md transition-all flex flex-col justify-between group">';
const cardOuterNew = `\${(() => {
    const subtopics = (typeof getUnitSubtopics === "function") ? getUnitSubtopics(grade.number, unitNum) : [];
    const matched = subtopics.filter(s => isMaterialMatchingSubtopic(item, s)).map(s => s.num);
    const subtopicsAttr = matched.length > 0 ? matched.join(',') : 'all';
    return \`<div data-unit="\${unitNum}" data-subtopics="\${subtopicsAttr}" class="unit-material-card bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-slate-400 hover:shadow-md transition-all flex flex-col justify-between group">\`;
})()}`;

if (appJs.includes(cardOuterOld)) {
    appJs = appJs.replace(cardOuterOld, cardOuterNew);
    console.log("Successfully updated material card with data-subtopics attribute and unit-material-card class");
} else {
    console.log("Warning: cardOuterOld not found");
}

// ============================================================
// 3. ADD CLIENT-SIDE filterMaterialsBySubtopic FUNCTION TO app.js
// ============================================================
if (!appJs.includes('function filterMaterialsBySubtopic(')) {
    const filterFunctionCode = `
// 📌 Müfredat Alt Başlıklarına Göre Materyal Filtreleme Motoru
function filterMaterialsBySubtopic(unitNum, subtopicNum, gradeNum, subTab) {
    const unitEl = document.querySelector(\`.unit-accordion-card[data-unit="\${unitNum}"]\`) || 
                   document.querySelector(\`#hub-container-\${subTab}-\${gradeNum}-unit-\${unitNum}\`) ||
                   document.querySelector(\`[data-unit="\${unitNum}"]\`);
    if (!unitEl) return;

    // 1. Alt başlık butonlarının aktiflik durumunu güncelle
    const buttons = unitEl.querySelectorAll('.subtopic-filter-btn');
    buttons.forEach(btn => {
        const isMatch = (btn.getAttribute('data-subtopic') === String(subtopicNum));
        if (isMatch) {
            btn.className = "subtopic-filter-btn px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shrink-0 bg-blue-600 text-white shadow-md cursor-pointer";
        } else {
            btn.className = "subtopic-filter-btn px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/80 cursor-pointer hover:border-slate-300";
        }
    });

    // 2. Materyal kartlarını alt başlıkla eşleşmeye göre filtrele
    const cards = unitEl.querySelectorAll('.unit-material-card');
    let visibleCount = 0;
    cards.forEach(card => {
        if (subtopicNum === 'all') {
            card.style.display = '';
            visibleCount++;
        } else {
            const cardSubs = (card.getAttribute('data-subtopics') || '').split(',').map(s => s.trim());
            if (cardSubs.includes(String(subtopicNum)) || cardSubs.includes('all')) {
                card.style.display = '';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        }
    });

    // 3. Bu alt başlığa ait materyal yoksa bilgilendirici boş durum kutusu göster
    let emptyState = unitEl.querySelector('.subtopic-empty-state');
    if (visibleCount === 0) {
        if (!emptyState) {
            emptyState = document.createElement('div');
            emptyState.className = 'subtopic-empty-state col-span-full py-8 text-center bg-white rounded-2xl border border-dashed border-slate-200 p-6 flex flex-col items-center justify-center';
            const gridEl = unitEl.querySelector('.unit-materials-grid');
            if (gridEl) gridEl.appendChild(emptyState);
        }
        emptyState.innerHTML = \`
            <div class="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg mb-2 shadow-xs">
                <i class="fa-solid fa-sparkles"></i>
            </div>
            <h5 class="text-xs font-black text-slate-800 mb-1">Bu alt başlığa ait içerikler yakında ekleniyor</h5>
            <p class="text-[11px] text-slate-500 mb-3 font-medium">Bu konuya özel içerik henüz yüklenmedi. Tüm ünite içeriklerini görmek için yukarıdan 'Tüm Konular'a tıklayabilirsiniz.</p>
            <button type="button" onclick="filterMaterialsBySubtopic('\${unitNum}', 'all', '\${gradeNum}', '\${subTab}')" class="px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-xl transition-colors border border-blue-200 inline-flex items-center gap-1.5 cursor-pointer">
                <i class="fa-solid fa-layer-group text-[10px]"></i> Tüm Konuları Göster
            </button>
        \`;
        emptyState.style.display = '';
    } else if (emptyState) {
        emptyState.style.display = 'none';
    }
}
window.filterMaterialsBySubtopic = filterMaterialsBySubtopic;
`;
    appJs += '\n' + filterFunctionCode;
    console.log("Appended filterMaterialsBySubtopic to app.js");
}

// Save modified app.js to both locations
fs.writeFileSync(appJsPath, appJs, 'utf8');
const parentAppJsPath = path.join(__dirname, '..', '..', 'js', 'app.js');
fs.writeFileSync(parentAppJsPath, appJs, 'utf8');
console.log("Saved updated app.js to both Web Sitem/js/app.js and ../js/app.js");
