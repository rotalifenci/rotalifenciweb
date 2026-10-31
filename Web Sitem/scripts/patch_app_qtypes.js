const fs = require('fs');

function patchAppJs(filePath) {
  if (!fs.existsSync(filePath)) return;
  let code = fs.readFileSync(filePath, 'utf8');

  // 1. Helper function: resolveMaterialQType
  if (!code.includes('function resolveMaterialQType(')) {
    const helperCode = `
// 📌 4 Soru Türü Çözümleyici (Maarif Modeli: Çoktan Seçmeli, Kısa Cevaplı, Açık Uçlu, Kavram Haritası)
function resolveMaterialQType(item) {
    if (!item) return 'multiple_choice';
    const text = \`\${item.title || ''} \${item.description || ''} \${item.format || ''} \${item.category || ''} \${item.fileUrl || ''} \${item.question_type || ''}\`.toLowerCase();
    if (text.includes('kavram harita') || text.includes('concept_map')) return 'concept_map';
    if (text.includes('kısa cevap') || text.includes('kisa cevap') || text.includes('boşluk doldurma') || text.includes('bosluk doldurma') || text.includes('short_answer')) return 'short_answer';
    if (text.includes('açık uçlu') || text.includes('acik uclu') || text.includes('klasik') || text.includes('open_ended')) return 'open_ended';
    return 'multiple_choice';
}
window.resolveMaterialQType = resolveMaterialQType;

// 📌 4 Soru Türüne Göre Materyal Filtreleme Motoru
function filterMaterialsByQType(unitNum, qtype, gradeNum, subTab) {
    const unitEl = document.querySelector(\`.unit-accordion-card[data-unit="\${unitNum}"]\`) || 
                   document.querySelector(\`#hub-container-\${subTab}-\${gradeNum}-unit-\${unitNum}\`) ||
                   document.querySelector(\`[data-unit="\${unitNum}"]\`);
    if (!unitEl) return;

    // Buton aktifliklerini güncelle
    const buttons = unitEl.querySelectorAll('.qtype-filter-btn');
    buttons.forEach(btn => {
        const isMatch = (btn.getAttribute('data-qtype') === String(qtype));
        if (isMatch) {
            btn.className = "qtype-filter-btn px-2.5 py-1 rounded-lg text-[11px] font-black bg-blue-600 text-white shadow-xs transition-all flex items-center gap-1 shrink-0 cursor-pointer";
        } else {
            btn.className = "qtype-filter-btn px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/80 transition-all flex items-center gap-1 shrink-0 cursor-pointer";
        }
    });

    // Kartları filtrele
    const cards = unitEl.querySelectorAll('.unit-material-card');
    let visibleCount = 0;
    cards.forEach(card => {
        const cardQType = card.getAttribute('data-qtype') || 'multiple_choice';
        if (qtype === 'all' || cardQType === qtype) {
            // Eğer aynı zamanda bir alt konu filtresi varsa onu da gözet
            const activeSubtopicBtn = unitEl.querySelector('.subtopic-filter-btn.bg-blue-600');
            const activeSub = activeSubtopicBtn ? activeSubtopicBtn.getAttribute('data-subtopic') : 'all';
            if (activeSub && activeSub !== 'all') {
                const cardSubs = (card.getAttribute('data-subtopics') || '').split(',').map(s => s.trim());
                if (cardSubs.includes(String(activeSub)) || cardSubs.includes('all')) {
                    card.style.display = '';
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                }
            } else {
                card.style.display = '';
                visibleCount++;
            }
        } else {
            card.style.display = 'none';
        }
    });
}
window.filterMaterialsByQType = filterMaterialsByQType;
`;
    // Add before filterMaterialsBySubtopic
    const targetIdx = code.indexOf('function filterMaterialsBySubtopic(');
    if (targetIdx !== -1) {
      code = code.substring(0, targetIdx) + helperCode + '\n' + code.substring(targetIdx);
    }
  }

  // 2. Render 4 question type buttons inside the MEB Ünite Alt Başlıkları card
  const subtopicContainerMarker = '</div>\n                                    </div>\n                                    `;\n                                })()}';
  const newQTypeButtonsBar = `
                                        <!-- 📌 4 Soru Türü Butonları (Çoktan Seçmeli, Kısa Cevaplı, Açık Uçlu, Kavram Haritası) -->
                                        <div class="mt-2.5 pt-2.5 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-thin qtype-pill-container" data-unit="\${unitNum}">
                                            <span class="text-[11px] font-bold text-slate-500 shrink-0 mr-1 flex items-center gap-1">
                                                <i class="fa-solid fa-list-check text-blue-600 text-xs"></i>
                                                <span>Soru Türü:</span>
                                            </span>
                                            <!-- Tümü -->
                                            <button type="button"
                                                    onclick="filterMaterialsByQType('\${unitNum}', 'all', '\${grade.number}', '\${normSubTab}')"
                                                    data-qtype="all"
                                                    class="qtype-filter-btn px-2.5 py-1 rounded-lg text-[11px] font-black bg-blue-600 text-white shadow-xs transition-all flex items-center gap-1 shrink-0 cursor-pointer">
                                                <span>Tümü</span>
                                            </button>
                                            <!-- 🔘 Çoktan Seçmeli -->
                                            <button type="button"
                                                    onclick="filterMaterialsByQType('\${unitNum}', 'multiple_choice', '\${grade.number}', '\${normSubTab}')"
                                                    data-qtype="multiple_choice"
                                                    class="qtype-filter-btn px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/80 transition-all flex items-center gap-1 shrink-0 cursor-pointer">
                                                <span>🔘 Çoktan Seçmeli</span>
                                            </button>
                                            <!-- ✏️ Kısa Cevaplı -->
                                            <button type="button"
                                                    onclick="filterMaterialsByQType('\${unitNum}', 'short_answer', '\${grade.number}', '\${normSubTab}')"
                                                    data-qtype="short_answer"
                                                    class="qtype-filter-btn px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/80 transition-all flex items-center gap-1 shrink-0 cursor-pointer">
                                                <span>✏️ Kısa Cevaplı</span>
                                            </button>
                                            <!-- 📝 Açık Uçlu -->
                                            <button type="button"
                                                    onclick="filterMaterialsByQType('\${unitNum}', 'open_ended', '\${grade.number}', '\${normSubTab}')"
                                                    data-qtype="open_ended"
                                                    class="qtype-filter-btn px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/80 transition-all flex items-center gap-1 shrink-0 cursor-pointer">
                                                <span>📝 Açık Uçlu</span>
                                            </button>
                                            <!-- 🗺️ Kavram Haritası -->
                                            <button type="button"
                                                    onclick="filterMaterialsByQType('\${unitNum}', 'concept_map', '\${grade.number}', '\${normSubTab}')"
                                                    data-qtype="concept_map"
                                                    class="qtype-filter-btn px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/80 transition-all flex items-center gap-1 shrink-0 cursor-pointer">
                                                <span>🗺️ Kavram Haritası</span>
                                            </button>
                                        </div>
  `;

  if (!code.includes('qtype-filter-btn') && code.includes(subtopicContainerMarker)) {
    code = code.replace(subtopicContainerMarker, newQTypeButtonsBar + '\n' + subtopicContainerMarker);
  }

  // 3. Add data-qtype attribute to unit-material-card
  if (!code.includes('data-qtype="${resolveMaterialQType(item)}"')) {
    code = code.replace(
      'data-subtopics="${cardSubtopicsStr}"',
      'data-subtopics="${cardSubtopicsStr}" data-qtype="${typeof resolveMaterialQType === \'function\' ? resolveMaterialQType(item) : \'multiple_choice\'}"'
    );
  }

  fs.writeFileSync(filePath, code, 'utf8');
  console.log('Successfully patched app.js:', filePath);
}

patchAppJs('js/app.js');
if (fs.existsSync('../js/app.js')) {
  patchAppJs('../js/app.js');
}
