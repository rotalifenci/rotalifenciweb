const fs = require('fs');

// 1. Update data/materials.json and ../data/materials.json
function updateMaterialsJson(p) {
  if (!fs.existsSync(p)) return;
  const list = JSON.parse(fs.readFileSync(p, 'utf8'));
  let changed = 0;
  list.forEach(m => {
    if (m.category === 'soru-bankasi') {
      m.category = 'denemeler';
      changed++;
    }
  });
  fs.writeFileSync(p, JSON.stringify(list, null, 2), 'utf8');
  console.log(`Updated ${changed} materials in ${p}`);
}

updateMaterialsJson('data/materials.json');
if (fs.existsSync('../data/materials.json')) {
  updateMaterialsJson('../data/materials.json');
}

// 2. Patch js/app.js and ../js/app.js
function patchApp(filePath) {
  if (!fs.existsSync(filePath)) return;
  let code = fs.readFileSync(filePath, 'utf8');

  // A. matchesSubTabCategory: soru-bankasi returns false, all test items go to denemeler
  const oldTargetMatch = `    if (target === "soru-bankasi") {
        return itemCat === "soru-bankasi" || itemCat === "soru" || itemCat === "test" || itemCat === "denemeler" || itemCat === "deneme" || format.includes("yaprak test") || format.includes("açık uçlu");
    }
    if (target === "denemeler") {
        return itemCat === "denemeler" || itemCat === "deneme" || itemCat === "soru-bankasi" || itemCat === "test" || format.includes("açık uçlu") || format.includes("yaprak test") || format.includes("yazılı");
    }`;

  const newTargetMatch = `    if (target === "soru-bankasi") {
        // Kullanıcı talimatı: Yaprak test / Test / Deneme bölümündeki tüm içerikler kaldırıldı, tüm sınav ve test içerikleri sadece Yazılıya Hazırlık bölümünde gösterilir.
        return false;
    }
    if (target === "denemeler") {
        return itemCat === "denemeler" || itemCat === "deneme" || itemCat === "soru-bankasi" || itemCat === "test" || itemCat === "yaprak-test" || format.includes("açık uçlu") || format.includes("yaprak test") || format.includes("yazılı") || format.includes("test") || format.includes("sınav");
    }`;

  if (code.includes(oldTargetMatch)) {
    code = code.replace(oldTargetMatch, newTargetMatch);
    console.log('Successfully updated matchesSubTabCategory in', filePath);
  } else {
    // Try regex replace if formatting differed
    code = code.replace(
      /if\s*\(\s*target\s*===\s*["']soru-bankasi["']\s*\)\s*\{[\s\S]*?\}\s*if\s*\(\s*target\s*===\s*["']denemeler["']\s*\)\s*\{[\s\S]*?\}/,
      newTargetMatch
    );
    console.log('Regex-updated matchesSubTabCategory in', filePath);
  }

  // B. MEB Ünite Alt Başlıkları kartının altına 4 Soru Türü butonlarını yerleştir
  const subtopicContainerRegex = /<!-- Numaralı Alt Başlıklar \(Örn: 1\. Güneş'in Yapısı ve Özellikleri\) -->[\s\S]*?<\/div>\s*<\/div>\s*`;\s*\}\)\(\)\}/;

  const match = code.match(subtopicContainerRegex);
  if (match) {
    const fullMatch = match[0];
    if (!fullMatch.includes('qtype-filter-btn')) {
      const qTypeSnippet = `
                                        <!-- 📌 4 Soru Türü Filtreleme Butonları (Çoktan Seçmeli, Kısa Cevaplı, Açık Uçlu, Kavram Haritası) -->
                                        <div class="mt-2.5 pt-2.5 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-thin qtype-pill-container" data-unit="\${unitNum}">
                                            <span class="text-[11px] font-bold text-slate-500 shrink-0 mr-1 flex items-center gap-1">
                                                <i class="fa-solid fa-layer-group text-blue-600 text-xs"></i>
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
                                                    class="qtype-filter-btn px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/80 transition-all flex items-center gap-1 shrink-0 cursor-pointer hover:border-slate-300">
                                                <span>🔘 Çoktan Seçmeli</span>
                                            </button>
                                            <!-- ✏️ Kısa Cevaplı -->
                                            <button type="button"
                                                    onclick="filterMaterialsByQType('\${unitNum}', 'short_answer', '\${grade.number}', '\${normSubTab}')"
                                                    data-qtype="short_answer"
                                                    class="qtype-filter-btn px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/80 transition-all flex items-center gap-1 shrink-0 cursor-pointer hover:border-slate-300">
                                                <span>✏️ Kısa Cevaplı</span>
                                            </button>
                                            <!-- 📝 Açık Uçlu -->
                                            <button type="button"
                                                    onclick="filterMaterialsByQType('\${unitNum}', 'open_ended', '\${grade.number}', '\${normSubTab}')"
                                                    data-qtype="open_ended"
                                                    class="qtype-filter-btn px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/80 transition-all flex items-center gap-1 shrink-0 cursor-pointer hover:border-slate-300">
                                                <span>📝 Açık Uçlu</span>
                                            </button>
                                            <!-- 🗺️ Kavram Haritası -->
                                            <button type="button"
                                                    onclick="filterMaterialsByQType('\${unitNum}', 'concept_map', '\${grade.number}', '\${normSubTab}')"
                                                    data-qtype="concept_map"
                                                    class="qtype-filter-btn px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/80 transition-all flex items-center gap-1 shrink-0 cursor-pointer hover:border-slate-300">
                                                <span>🗺️ Kavram Haritası</span>
                                            </button>
                                        </div>
                                    </div>
                                    \`;
                                })()}`;

      const replacement = fullMatch.replace(/<\/div>\s*<\/div>\s*`;\s*\}\)\(\)\}/, qTypeSnippet);
      code = code.replace(fullMatch, replacement);
      console.log('Successfully inserted qtype-filter-btn into subtopics bar in', filePath);
    }
  }

  // C. Ensure data-qtype is on card
  if (!code.includes('data-qtype="${resolveMaterialQType(item)}"')) {
    code = code.replace(
      'data-subtopics="${subtopicsAttr}"',
      'data-subtopics="${subtopicsAttr}" data-qtype="${typeof resolveMaterialQType === \'function\' ? resolveMaterialQType(item) : \'multiple_choice\'}"'
    );
  }

  fs.writeFileSync(filePath, code, 'utf8');
}

patchApp('js/app.js');
if (fs.existsSync('../js/app.js')) {
  patchApp('../js/app.js');
}
