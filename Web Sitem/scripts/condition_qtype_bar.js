const fs = require('fs');

['js/app.js', '../js/app.js'].forEach(filePath => {
  if (!fs.existsSync(filePath)) return;
  let code = fs.readFileSync(filePath, 'utf8');

  const oldBlock = `                                        <!-- 📌 4 Soru Türü Filtreleme Butonları (Çoktan Seçmeli, Kısa Cevaplı, Açık Uçlu, Kavram Haritası) -->
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
                                            <!-- 🎯 Etkinlik -->
                                            <button type="button"
                                                    onclick="filterMaterialsByQType('\${unitNum}', 'activity', '\${grade.number}', '\${normSubTab}')"
                                                    data-qtype="activity"
                                                    class="qtype-filter-btn px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/80 transition-all flex items-center gap-1 shrink-0 cursor-pointer hover:border-slate-300">
                                                <span>🎯 Etkinlik</span>
                                            </button>
                                        </div>`;

  const newBlock = `                                        <!-- 📌 4 Soru Türü Filtreleme Butonları (Sadece Testler ve Yazılıya Hazırlık Bölümlerinde Gösterilir) -->
                                        \${(normSubTab === 'soru-bankasi' || normSubTab === 'denemeler' || subTab === 'soru-bankasi' || subTab === 'denemeler') ? \`
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
                                            <!-- 🎯 Etkinlik -->
                                            <button type="button"
                                                    onclick="filterMaterialsByQType('\${unitNum}', 'activity', '\${grade.number}', '\${normSubTab}')"
                                                    data-qtype="activity"
                                                    class="qtype-filter-btn px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/80 transition-all flex items-center gap-1 shrink-0 cursor-pointer hover:border-slate-300">
                                                <span>🎯 Etkinlik</span>
                                            </button>
                                        </div>
                                        \` : ''}`;

  const hasCRLF = code.includes('\r\n');
  const target = hasCRLF ? oldBlock.replace(/\n/g, '\r\n') : oldBlock;
  const rep = hasCRLF ? newBlock.replace(/\n/g, '\r\n') : newBlock;

  if (code.includes(target)) {
    code = code.replace(target, rep);
    fs.writeFileSync(filePath, code, 'utf8');
    console.log('Successfully conditioned qtype filter in:', filePath);
  } else {
    console.log('Target not matched in:', filePath);
  }
});
