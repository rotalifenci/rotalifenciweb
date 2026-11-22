const fs = require('fs');
const path = require('path');

function patchFile(filePath) {
    console.log(`Patching ${filePath}...`);
    let content = fs.readFileSync(filePath, 'utf8');

    // 1. SIYER_ROOT_VALUES & renderSiyerActiveYearForm
    const targetAnchor = '    // Aktif Araştırma Formu (Kriterler, Toolbar, Geri Al, İleri Al, Kaydetme Durumu)\n    function renderActiveItemForm(item, projData) {';
    const targetAnchorCRLF = '    // Aktif Araştırma Formu (Kriterler, Toolbar, Geri Al, İleri Al, Kaydetme Durumu)\r\n    function renderActiveItemForm(item, projData) {';

    const siyerCode = `    const SIYER_ROOT_VALUES = [
        "Adalet",
        "Dostluk",
        "Dürüstlük",
        "Öz denetim",
        "Sabır",
        "Saygı",
        "Sevgi",
        "Sorumluluk",
        "Vatanseverlik",
        "Yardımseverlik"
    ];

    function parseSelectedRootValues(contentStr) {
        if (!contentStr || typeof contentStr !== 'string') return [];
        return SIYER_ROOT_VALUES.filter(val => {
            const regex = new RegExp('(^|[\\\\s,;•\\\\n])' + val.replace(' ', '\\\\s*') + '([\\\\s,;•\\\\n]|$)', 'i');
            return regex.test(contentStr);
        });
    }

    function renderSiyerRootValueChipsHtml(itemId, criterionKey, selectedValues, canEdit) {
        return SIYER_ROOT_VALUES.map(val => {
            const isSelected = Array.isArray(selectedValues) && selectedValues.includes(val);
            return \`
            <button type="button" 
                \${!canEdit ? 'disabled' : ''}
                onclick="window.RotaliTubitak.toggleSiyerRootValue('\${itemId}', '\${criterionKey}', '\${escapeHtml(val)}')"
                class="px-2.5 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1 cursor-pointer select-none \${
                    isSelected 
                        ? 'bg-emerald-600 text-white shadow-xs border border-emerald-600 ring-2 ring-emerald-400/30' 
                        : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-300'
                } \${!canEdit ? 'opacity-60 cursor-not-allowed' : ''}"
                title="\${isSelected ? 'Kök Değer Seçimini Kaldır' : 'Kök Değer Olarak Ekle'}">
                <span class="text-[10px]">\${isSelected ? '✓' : '+'}</span>
                <span>\${escapeHtml(val)}</span>
            </button>
            \`;
        }).join('');
    }

    function getSiyerFieldValAndMeta(yearId, criterionKey, legacyKey) {
        const key1 = \`\${yearId}__\${criterionKey}\`;
        let rec = runtimeRecords[key1];
        if ((!rec || !rec.content) && legacyKey && runtimeRecords[legacyKey]) {
            rec = runtimeRecords[legacyKey];
        }
        const content = rec && typeof rec.content === 'string' ? rec.content : '';
        const version = rec ? rec.version : 1;
        const lastEditor = rec ? rec.studentName : 'Sistem';
        return { content, version, lastEditor, recordKey: key1 };
    }

    function renderSiyerActiveYearForm(item, canEditItem) {
        const yearId = item.id;
        const isTeacher = currentSession?.role === "teacher";

        const eventsConfig = [
            {
                num: 1,
                title: "1. OLAY",
                badge: "Ana Olay",
                badgeClass: "bg-amber-100 text-amber-800 border-amber-200",
                olayKey: "c1_olay",
                olayLegacyKey: null,
                olayPlaceholder: "Seçilen yılda meydana gelen birinci siyer olayını, tarihsel gelişimini ve önemli ayrıntılarını yazınız (belirsizse kaynaklardaki farklılıkları açıklayınız)...",
                kokKey: "c2_kok_deger",
                kokLegacyKey: null,
                kaynakKey: "c3_kaynakca",
                kaynakLegacyKey: null,
                kaynakPlaceholder: "1. Olay için yararlanılan kaynak, eser/makale adı, müellif ve sayfa bilgilerini yazınız..."
            },
            {
                num: 2,
                title: "2. OLAY",
                badge: "İsteğe bağlı",
                badgeClass: "bg-slate-100 text-slate-600 border-slate-200",
                olayKey: "c1_olay_2",
                olayLegacyKey: \`\${yearId}__ev_2__c1_olay\`,
                olayPlaceholder: "Aynı yılda meydana gelen ikinci siyer olayını, tarihsel gelişimini ve ayrıntılarını yazınız (bu yılda ikinci bir olay tespit edilmediyse boş bırakınız)...",
                kokKey: "c2_kok_deger_2",
                kokLegacyKey: \`\${yearId}__ev_2__c2_kok_deger\`,
                kaynakKey: "c3_kaynakca_2",
                kaynakLegacyKey: \`\${yearId}__ev_2__c3_kaynakca\`,
                kaynakPlaceholder: "2. Olay için yararlanılan kaynak, eser/makale adı, müellif ve sayfa bilgilerini yazınız..."
            },
            {
                num: 3,
                title: "3. OLAY",
                badge: "İsteğe bağlı",
                badgeClass: "bg-slate-100 text-slate-600 border-slate-200",
                olayKey: "c1_olay_3",
                olayLegacyKey: \`\${yearId}__ev_3__c1_olay\`,
                olayPlaceholder: "Aynı yılda meydana gelen üçüncü siyer olayını, tarihsel gelişimini ve ayrıntılarını yazınız (bu yılda üçüncü bir olay tespit edilmediyse boş bırakınız)...",
                kokKey: "c2_kok_deger_3",
                kokLegacyKey: \`\${yearId}__ev_3__c2_kok_deger\`,
                kaynakKey: "c3_kaynakca_3",
                kaynakLegacyKey: \`\${yearId}__ev_3__c3_kaynakca\`,
                kaynakPlaceholder: "3. Olay için yararlanılan kaynak, eser/makale adı, müellif ve sayfa bilgilerini yazınız..."
            }
        ];

        const allEventIds = getSiyerYearEventIds(yearId);
        const archivedExtraIds = allEventIds.filter(id => {
            const evNum = parseInt(String(id).split('__ev_')[1], 10);
            return evNum > 3;
        });

        return \`
        <!-- Siyer Bilgilendirme Bannerı -->
        <div class="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 flex items-start gap-3">
            <div class="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                <i class="fa-solid fa-moon text-xs"></i>
            </div>
            <div class="text-xs text-slate-700 leading-relaxed">
                <strong class="text-emerald-950 font-black">Siyer ve Değerler Eğitimi Araştırma Kuralı:</strong>
                Her yıl için yalnızca 3 olay alanı bulunmaktadır. Bir yılda yalnızca bir veya iki tarihsel olay tespit edilmişse diğer alanlar boş bırakılabilir. Sistem tarihsel olay uydurulmasını kesinlikle teşvik etmez. Her olay için 10 kök değerden uygun olanları seçebilir ve olayın kaynakçasını girebilirsiniz.
            </div>
        </div>

        <!-- 3 Olay Kartı Listesi -->
        <div class="space-y-6">
            \${eventsConfig.map(ev => {
                const olayMeta = getSiyerFieldValAndMeta(yearId, ev.olayKey, ev.olayLegacyKey);
                const kokMeta = getSiyerFieldValAndMeta(yearId, ev.kokKey, ev.kokLegacyKey);
                const kaynakMeta = getSiyerFieldValAndMeta(yearId, ev.kaynakKey, ev.kaynakLegacyKey);
                const selectedKokValues = parseSelectedRootValues(kokMeta.content);

                return \`
                <div class="p-4 sm:p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-5 transition-all focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-400/20">
                    <!-- Kart Başlığı -->
                    <div class="flex items-center justify-between gap-3 pb-3 border-b border-slate-100 flex-wrap">
                        <div class="flex items-center gap-2">
                            <span class="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 font-black flex items-center justify-center text-sm shadow-2xs">
                                \${ev.num}
                            </span>
                            <div>
                                <h4 class="text-sm sm:text-base font-black text-slate-900">\${ev.title}</h4>
                                <span class="text-[10px] text-slate-500 font-medium">\${ev.num === 1 ? 'Yılda gerçekleşen ana siyer olayı' : 'Varsa ek olay (yoksa boş bırakınız)'}</span>
                            </div>
                        </div>
                        <span class="px-2.5 py-1 rounded-full text-[11px] font-black border uppercase tracking-wider \${ev.badgeClass}">
                            \${ev.badge}
                        </span>
                    </div>

                    <!-- 1. Olay Açıklaması -->
                    <div class="space-y-2">
                        <div class="flex items-center justify-between gap-2">
                            <label for="input-\${ev.olayKey}" class="text-xs sm:text-sm font-black text-slate-800 flex items-center gap-1.5">
                                <i class="fa-solid fa-feather-pointed text-amber-600"></i>
                                <span>Olay Açıklaması ve Tarihsel Gelişim</span>
                            </label>
                            <!-- Geri Al / İleri Al -->
                            <div class="flex items-center gap-1">
                                <button type="button" \${!canEditItem ? 'disabled' : ''} onclick="window.RotaliTubitak.handleUndo('\${ev.olayKey}')" class="w-7 h-7 rounded-lg bg-slate-50 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 border border-slate-300 flex items-center justify-center text-xs transition-colors cursor-pointer" title="Bu Alanı Geri Al ↶">↶</button>
                                <button type="button" \${!canEditItem ? 'disabled' : ''} onclick="window.RotaliTubitak.handleRedo('\${ev.olayKey}')" class="w-7 h-7 rounded-lg bg-slate-50 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 border border-slate-300 flex items-center justify-center text-xs transition-colors cursor-pointer" title="Bu Alanı İleri Al ↷">↷</button>
                            </div>
                        </div>
                        <textarea
                            id="input-\${ev.olayKey}"
                            rows="3"
                            \${!canEditItem ? 'readonly disabled' : ''}
                            style="resize: vertical; min-height: 84px;"
                            placeholder="\${escapeHtml(ev.olayPlaceholder)}"
                            oninput="window.RotaliTubitak.onFieldChange('\${ev.olayKey}', this.value, this)"
                            onblur="window.RotaliTubitak.onFieldBlur('\${ev.olayKey}', this.value)"
                            class="tubitak-criterion-textarea resize-y w-full px-3.5 py-2.5 \${canEditItem ? 'bg-white text-slate-800' : 'bg-slate-100 text-slate-500 cursor-not-allowed'} border border-slate-200 rounded-xl text-xs sm:text-sm font-medium placeholder-slate-400 focus:outline-none transition-colors leading-relaxed custom-scrollbar"
                        >\${escapeHtml(olayMeta.content)}</textarea>
                        <div class="flex items-center justify-between text-[10px] text-slate-400 font-semibold pt-0.5">
                            <span>Sürüm v\${olayMeta.version} • \${escapeHtml(olayMeta.lastEditor)}</span>
                            <span id="char-count-\${ev.olayKey}">\${formatFieldStats(olayMeta.content)}</span>
                        </div>
                    </div>

                    <!-- 2. Kök Değerler Bölümü (10 Kök Değer Seçeneği) -->
                    <div class="p-3.5 sm:p-4 rounded-xl bg-slate-50/90 border border-slate-200 space-y-3">
                        <div class="flex items-center justify-between gap-2 flex-wrap">
                            <div>
                                <label class="text-xs font-black text-slate-800 flex items-center gap-1.5">
                                    <i class="fa-solid fa-seedling text-emerald-600"></i>
                                    <span>İlişkili Kök Değerler</span>
                                    <span class="text-[10px] font-semibold text-slate-400">(İsteğe bağlı – birden fazla seçilebilir)</span>
                                </label>
                                <p class="text-[10px] text-slate-500 mt-0.5">Olayla bağlantılı kök değer(ler)i seçmek için butonlara tıklayınız:</p>
                            </div>
                            <!-- Kök Değer Geri Al / İleri Al -->
                            <div class="flex items-center gap-1">
                                <button type="button" \${!canEditItem ? 'disabled' : ''} onclick="window.RotaliTubitak.handleUndo('\${ev.kokKey}')" class="w-6 h-6 rounded-lg bg-white hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 border border-slate-300 flex items-center justify-center text-[11px] transition-colors cursor-pointer" title="Kök Değerleri Geri Al ↶">↶</button>
                                <button type="button" \${!canEditItem ? 'disabled' : ''} onclick="window.RotaliTubitak.handleRedo('\${ev.kokKey}')" class="w-6 h-6 rounded-lg bg-white hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 border border-slate-300 flex items-center justify-center text-[11px] transition-colors cursor-pointer" title="Kök Değerleri İleri Al ↷">↷</button>
                            </div>
                        </div>

                        <!-- 10 Kök Değer Butonları -->
                        <div id="chips-container-\${yearId}__\${ev.kokKey}" class="flex items-center gap-1.5 flex-wrap">
                            \${renderSiyerRootValueChipsHtml(yearId, ev.kokKey, selectedKokValues, canEditItem)}
                        </div>

                        <!-- Kök Değer Notu / Olayla İlişkisi -->
                        <div class="pt-1">
                            <label for="input-\${ev.kokKey}" class="block text-[11px] font-bold text-slate-600 mb-1">
                                Kök Değer Notu / Olayla İlişkisi (İsteğe bağlı açıklama):
                            </label>
                            <textarea
                                id="input-\${ev.kokKey}"
                                rows="2"
                                \${!canEditItem ? 'readonly disabled' : ''}
                                style="resize: vertical; min-height: 52px;"
                                placeholder="Olayla kök değer arasındaki bağlantıyı açıklayınız (isteğe bağlı)..."
                                oninput="window.RotaliTubitak.onFieldChange('\${ev.kokKey}', this.value, this)"
                                onblur="window.RotaliTubitak.onFieldBlur('\${ev.kokKey}', this.value)"
                                class="tubitak-criterion-textarea resize-y w-full px-3 py-2 \${canEditItem ? 'bg-white text-slate-800' : 'bg-slate-100 text-slate-500 cursor-not-allowed'} border border-slate-200 rounded-xl text-xs font-medium placeholder-slate-400 focus:outline-none transition-colors leading-relaxed"
                            >\${escapeHtml(kokMeta.content)}</textarea>
                            <div class="flex items-center justify-between text-[10px] text-slate-400 font-semibold pt-0.5">
                                <span>Sürüm v\${kokMeta.version} • \${escapeHtml(kokMeta.lastEditor)}</span>
                                <span id="char-count-\${ev.kokKey}">\${formatFieldStats(kokMeta.content)}</span>
                            </div>
                        </div>
                    </div>

                    <!-- 3. Olay Kaynakçası -->
                    <div class="space-y-1.5">
                        <div class="flex items-center justify-between gap-2">
                            <label for="input-\${ev.kaynakKey}" class="text-xs font-black text-slate-800 flex items-center gap-1.5">
                                <i class="fa-solid fa-book-bookmark text-blue-600"></i>
                                <span>Olay Kaynakçası</span>
                                <span class="text-[10px] font-semibold text-slate-400">(İsteğe bağlı)</span>
                            </label>
                            <div class="flex items-center gap-1">
                                <button type="button" \${!canEditItem ? 'disabled' : ''} onclick="window.RotaliTubitak.handleUndo('\${ev.kaynakKey}')" class="w-6 h-6 rounded-lg bg-slate-50 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 border border-slate-300 flex items-center justify-center text-[11px] transition-colors cursor-pointer" title="Kaynakçayı Geri Al ↶">↶</button>
                                <button type="button" \${!canEditItem ? 'disabled' : ''} onclick="window.RotaliTubitak.handleRedo('\${ev.kaynakKey}')" class="w-6 h-6 rounded-lg bg-slate-50 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 border border-slate-300 flex items-center justify-center text-[11px] transition-colors cursor-pointer" title="Kaynakçayı İleri Al ↷">↷</button>
                            </div>
                        </div>
                        <input
                            type="text"
                            id="input-\${ev.kaynakKey}"
                            value="\${escapeHtml(kaynakMeta.content)}"
                            \${!canEditItem ? 'readonly disabled' : ''}
                            placeholder="\${escapeHtml(ev.kaynakPlaceholder)}"
                            oninput="window.RotaliTubitak.onFieldChange('\${ev.kaynakKey}', this.value, this)"
                            onblur="window.RotaliTubitak.onFieldBlur('\${ev.kaynakKey}', this.value)"
                            class="tubitak-criterion-textarea w-full px-3.5 py-2 \${canEditItem ? 'bg-white text-slate-800' : 'bg-slate-100 text-slate-500 cursor-not-allowed'} border border-slate-200 rounded-xl text-xs font-medium placeholder-slate-400 focus:outline-none transition-colors"
                        />
                        <div class="flex items-center justify-between text-[10px] text-slate-400 font-semibold">
                            <span>Sürüm v\${kaynakMeta.version} • \${escapeHtml(kaynakMeta.lastEditor)}</span>
                            <span id="char-count-\${ev.kaynakKey}">\${formatFieldStats(kaynakMeta.content)}</span>
                        </div>
                    </div>
                </div>
                \`;
            }).join('')}
        </div>

        \${isTeacher && archivedExtraIds.length > 0 ? \`
        <!-- Öğretmen Arşivi: Geçmişte 3'ten Fazla Eklenen Olaylar (Salt Okunur) -->
        <div class="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3">
            <div class="flex items-center justify-between text-xs font-black text-amber-900">
                <span><i class="fa-solid fa-box-archive mr-1.5 text-amber-600"></i>Öğretmen Arşivi: Geçmiş Ek Kayıtlar (\${archivedExtraIds.length} Kayıt)</span>
                <span class="text-[10px] font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">Salt Okunur Arşiv</span>
            </div>
            <p class="text-[11px] text-amber-800">
                Bu yıl için geçmişte 3'ten fazla oluşturulmuş ek olay kayıtları veri kaybını önlemek amacıyla veritabanında korunmaktadır; öğrenci arayüzünde ise sistem kuralı gereği yalnızca ilk 3 olay görüntülenir.
            </p>
            <div class="space-y-2">
                \${archivedExtraIds.map(evId => {
                    const rec = runtimeRecords[\`\${evId}__c1_olay\`];
                    const content = rec?.content || '(Boş metin)';
                    return \`
                    <div class="p-2.5 rounded-xl bg-white border border-amber-200 text-xs">
                        <span class="font-bold text-slate-700">\${evId}:</span>
                        <p class="text-slate-600 mt-0.5 italic">\${escapeHtml(content)}</p>
                    </div>
                    \`;
                }).join('')}
            </div>
        </div>
        \` : ''}
        \`;
    }\n\n`;

    if (!content.includes('const SIYER_ROOT_VALUES =')) {
        if (content.includes(targetAnchorCRLF)) {
            content = content.replace(targetAnchorCRLF, siyerCode.replace(/\n/g, '\r\n') + targetAnchorCRLF);
            console.log('Inserted siyerCode before CRLF anchor');
        } else if (content.includes(targetAnchor)) {
            content = content.replace(targetAnchor, siyerCode + targetAnchor);
            console.log('Inserted siyerCode before LF anchor');
        } else {
            console.error('Target anchor not found for siyerCode!');
        }
    }

    // 2. In renderActiveItemForm: branch for proje-siyer
    const oldFormPattern = '<div class="space-y-5">\n            ${criteriaList.map((crit, idx) => {';
    const oldFormPatternCRLF = '<div class="space-y-5">\r\n            ${criteriaList.map((crit, idx) => {';
    const newFormReplacement = '<div class="space-y-5">\n            ${activeProjectId === \'proje-siyer\' ? renderSiyerActiveYearForm(item, canEditItem) : criteriaList.map((crit, idx) => {';

    if (content.includes(oldFormPatternCRLF)) {
        content = content.replace(oldFormPatternCRLF, newFormReplacement.replace(/\n/g, '\r\n'));
        console.log('Replaced form pattern CRLF');
    } else if (content.includes(oldFormPattern)) {
        content = content.replace(oldFormPattern, newFormReplacement);
        console.log('Replaced form pattern LF');
    } else {
        console.log('Form pattern check: already patched or different');
    }

    // 3. onFieldChange: update chips in real-time
    const oldOnFieldChange = 'queueAutoSave(criterionKey, val, effItemId);';
    const newOnFieldChange = `if (activeProjectId === "proje-siyer" && criterionKey.includes("kok_deger")) {
                const chipsEl = document.getElementById(\`chips-container-\${effItemId}__\${criterionKey}\`);
                if (chipsEl) {
                    const parsed = parseSelectedRootValues(val);
                    chipsEl.innerHTML = renderSiyerRootValueChipsHtml(effItemId, criterionKey, parsed, isItemEditableByCurrentUser(activeItem));
                }
            }
            queueAutoSave(criterionKey, val, effItemId);`;

    if (!content.includes('chipsEl.innerHTML = renderSiyerRootValueChipsHtml')) {
        content = content.replace(oldOnFieldChange, newOnFieldChange);
        console.log('Updated onFieldChange with chip live update');
    }

    // 4. toggleSiyerRootValue on window.RotaliTubitak
    const toggleFuncCode = `
        toggleSiyerRootValue(itemId, criterionKey, valName) {
            const recordKey = \`\${itemId}__\${criterionKey}\`;
            const existing = runtimeRecords[recordKey];
            const currentVal = existing ? existing.content : "";
            let selected = parseSelectedRootValues(currentVal);

            if (selected.includes(valName)) {
                selected = selected.filter(v => v !== valName);
            } else {
                selected.push(valName);
            }

            let lines = currentVal.split('\\n');
            let extraNotes = '';
            if (lines.length > 1) {
                extraNotes = lines.slice(1).join('\\n').trim();
            } else if (currentVal) {
                const cleaned = currentVal
                    .replace(/Adalet|Dostluk|Dürüstlük|Öz denetim|Sabır|Saygı|Sevgi|Sorumluluk|Vatanseverlik|Yardımseverlik/gi, '')
                    .replace(/[,;\\s•]/g, '').trim();
                if (cleaned.length > 0) {
                    extraNotes = currentVal.trim();
                }
            }

            let newContent = selected.join(', ');
            if (extraNotes && !newContent.includes(extraNotes)) {
                newContent = newContent ? \`\${newContent}\\n\${extraNotes}\` : extraNotes;
            }

            if (!runtimeRecords[recordKey]) {
                runtimeRecords[recordKey] = {
                    id: recordKey,
                    projectId: "proje-siyer",
                    itemId: itemId,
                    criterionKey: criterionKey,
                    content: newContent,
                    version: 1,
                    status: "draft",
                    studentName: currentSession?.studentName || "Öğrenci",
                    updatedAt: new Date().toISOString()
                };
            } else {
                runtimeRecords[recordKey].content = newContent;
            }

            const inputEl = document.getElementById(\`input-\${itemId}__\${criterionKey}\`) || document.getElementById(\`input-\${criterionKey}\`);
            if (inputEl) {
                inputEl.value = newContent;
                autoGrowTextarea(inputEl);
            }

            const countEl = document.getElementById(\`char-count-\${itemId}__\${criterionKey}\`) || document.getElementById(\`char-count-\${criterionKey}\`);
            if (countEl) countEl.textContent = formatFieldStats(newContent);

            const container = document.getElementById(\`chips-container-\${itemId}__\${criterionKey}\`);
            if (container) {
                container.innerHTML = renderSiyerRootValueChipsHtml(itemId, criterionKey, selected, isItemEditableByCurrentUser(activeItem));
            }

            queueAutoSave(criterionKey, newContent, itemId);
        },
`;

    if (!content.includes('toggleSiyerRootValue(itemId, criterionKey, valName)')) {
        const rotaliAnchor = 'openTeacherDashboardModal,';
        if (content.includes(rotaliAnchor)) {
            content = content.replace(rotaliAnchor, rotaliAnchor + toggleFuncCode);
            console.log('Added toggleSiyerRootValue to RotaliTubitak');
        }
    }

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Successfully patched ${filePath}`);
}

patchFile(path.join(__dirname, '../js/tubitak-research.js'));
patchFile(path.join(__dirname, '../../js/tubitak-research.js'));
