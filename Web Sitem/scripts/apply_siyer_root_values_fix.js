const fs = require('fs');
const path = require('path');

function patchFile(filePath) {
    if (!fs.existsSync(filePath)) {
        console.error(`File not found: ${filePath}`);
        return false;
    }
    let rawContent = fs.readFileSync(filePath, 'utf8');
    const hasCRLF = rawContent.includes('\r\n');
    let content = rawContent.replace(/\r\n/g, '\n');
    const originalLength = content.length;

    // 1. Patch performUndo and performRedo
    const oldUndoRedoTarget = `    // 6. Geri Al ↶ & İleri Al ↷ Fonksiyonları
    function performUndo(criterionKey, targetItemId = activeItemId) {
        if (!targetItemId) return;
        const recordKey = \`\${targetItemId}__\${criterionKey}\`;
        const stack = undoStacks[recordKey] || [];
        if (stack.length === 0) {
            showNotice("Geri alınacak başka değişiklik yok.", "info");
            return;
        }

        const currentVal = runtimeRecords[recordKey]?.content || "";
        if (!redoStacks[recordKey]) redoStacks[recordKey] = [];
        redoStacks[recordKey].push(currentVal);

        const previousVal = stack.pop();
        const textarea = document.getElementById(\`input-\${targetItemId}__\${criterionKey}\`) || document.getElementById(\`input-\${criterionKey}\`);
        if (textarea) {
            textarea.value = previousVal;
            autoGrowTextarea(textarea);
        }
        const countEl = document.getElementById(\`char-count-\${targetItemId}__\${criterionKey}\`) || document.getElementById(\`char-count-\${criterionKey}\`);
        if (countEl) countEl.textContent = formatFieldStats(previousVal);

        queueAutoSave(criterionKey, previousVal, targetItemId);
        showNotice("Değişiklik geri alındı ↶", "success");
    }

    function performRedo(criterionKey, targetItemId = activeItemId) {
        if (!targetItemId) return;
        const recordKey = \`\${targetItemId}__\${criterionKey}\`;
        const stack = redoStacks[recordKey] || [];
        if (stack.length === 0) {
            showNotice("İleri alınacak işlem bulunmuyor.", "info");
            return;
        }

        const currentVal = runtimeRecords[recordKey]?.content || "";
        if (!undoStacks[recordKey]) undoStacks[recordKey] = [];
        undoStacks[recordKey].push(currentVal);

        const nextVal = stack.pop();
        const textarea = document.getElementById(\`input-\${targetItemId}__\${criterionKey}\`) || document.getElementById(\`input-\${criterionKey}\`);
        if (textarea) {
            textarea.value = nextVal;
            autoGrowTextarea(textarea);
        }
        const countEl = document.getElementById(\`char-count-\${targetItemId}__\${criterionKey}\`) || document.getElementById(\`char-count-\${criterionKey}\`);
        if (countEl) countEl.textContent = formatFieldStats(nextVal);

        queueAutoSave(criterionKey, nextVal, targetItemId);
        showNotice("Değişiklik yinelendi ↷", "success");
    }`;

    const newUndoRedo = `    // 6. Geri Al ↶ & İleri Al ↷ Fonksiyonları
    function performUndo(criterionKey, targetItemId = activeItemId) {
        if (!targetItemId) return;
        const recordKey = \`\${targetItemId}__\${criterionKey}\`;
        const stack = undoStacks[recordKey] || [];
        if (stack.length === 0) {
            showNotice("Geri alınacak başka değişiklik yok.", "info");
            return;
        }

        const currentVal = runtimeRecords[recordKey]?.content || "";
        if (!redoStacks[recordKey]) redoStacks[recordKey] = [];
        redoStacks[recordKey].push(currentVal);

        const previousVal = stack.pop();
        if (!runtimeRecords[recordKey]) {
            runtimeRecords[recordKey] = {
                id: recordKey,
                projectId: activeProjectId || "proje-siyer",
                itemId: targetItemId,
                criterionKey: criterionKey,
                content: previousVal,
                version: 1,
                status: "draft",
                studentName: currentSession?.studentName || "Öğrenci",
                updatedAt: new Date().toISOString()
            };
        } else {
            runtimeRecords[recordKey].content = previousVal;
            runtimeRecords[recordKey].updatedAt = new Date().toISOString();
        }

        const textarea = document.getElementById(\`input-\${targetItemId}__\${criterionKey}\`) || document.getElementById(\`input-\${criterionKey}\`);
        if (textarea) {
            textarea.value = previousVal;
            autoGrowTextarea(textarea);
        }
        const countEl = document.getElementById(\`char-count-\${targetItemId}__\${criterionKey}\`) || document.getElementById(\`char-count-\${criterionKey}\`);
        if (countEl) countEl.textContent = formatFieldStats(previousVal);

        if (activeProjectId === "proje-siyer" || criterionKey.includes("kok_deger")) {
            updateSiyerRootValueChipsUI(targetItemId, criterionKey, previousVal);
        }

        queueAutoSave(criterionKey, previousVal, targetItemId);
        showNotice("Değişiklik geri alındı ↶", "success");
    }

    function performRedo(criterionKey, targetItemId = activeItemId) {
        if (!targetItemId) return;
        const recordKey = \`\${targetItemId}__\${criterionKey}\`;
        const stack = redoStacks[recordKey] || [];
        if (stack.length === 0) {
            showNotice("İleri alınacak işlem bulunmuyor.", "info");
            return;
        }

        const currentVal = runtimeRecords[recordKey]?.content || "";
        if (!undoStacks[recordKey]) undoStacks[recordKey] = [];
        undoStacks[recordKey].push(currentVal);

        const nextVal = stack.pop();
        if (!runtimeRecords[recordKey]) {
            runtimeRecords[recordKey] = {
                id: recordKey,
                projectId: activeProjectId || "proje-siyer",
                itemId: targetItemId,
                criterionKey: criterionKey,
                content: nextVal,
                version: 1,
                status: "draft",
                studentName: currentSession?.studentName || "Öğrenci",
                updatedAt: new Date().toISOString()
            };
        } else {
            runtimeRecords[recordKey].content = nextVal;
            runtimeRecords[recordKey].updatedAt = new Date().toISOString();
        }

        const textarea = document.getElementById(\`input-\${targetItemId}__\${criterionKey}\`) || document.getElementById(\`input-\${criterionKey}\`);
        if (textarea) {
            textarea.value = nextVal;
            autoGrowTextarea(textarea);
        }
        const countEl = document.getElementById(\`char-count-\${targetItemId}__\${criterionKey}\`) || document.getElementById(\`char-count-\${criterionKey}\`);
        if (countEl) countEl.textContent = formatFieldStats(nextVal);

        if (activeProjectId === "proje-siyer" || criterionKey.includes("kok_deger")) {
            updateSiyerRootValueChipsUI(targetItemId, criterionKey, nextVal);
        }

        queueAutoSave(criterionKey, nextVal, targetItemId);
        showNotice("Değişiklik yinelendi ↷", "success");
    }`;

    if (!content.includes(oldUndoRedoTarget)) {
        console.error('Could not find oldUndoRedoTarget in ' + filePath);
        return false;
    }
    content = content.replace(oldUndoRedoTarget, newUndoRedo);

    // 2. Patch parseSelectedRootValues & renderSiyerRootValueChipsHtml & add helpers
    const oldParseTarget = `    function parseSelectedRootValues(contentStr) {
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
    }`;

    const newParseAndHelpers = `    function normalizeRootValueName(name) {
        if (!name || typeof name !== 'string') return null;
        const clean = name.trim().toLocaleLowerCase('tr-TR').replace(/[\\s\\-_]+/g, '');
        const match = SIYER_ROOT_VALUES.find(val => val.toLocaleLowerCase('tr-TR').replace(/[\\s\\-_]+/g, '') === clean);
        return match || null;
    }

    function parseSelectedRootValues(contentStr) {
        if (!contentStr || typeof contentStr !== 'string') return [];
        const lines = contentStr.split('\\n');
        const firstLine = lines[0].trim();
        if (!firstLine) return [];

        const tokens = firstLine.split(/[,;•]+/).map(t => t.trim()).filter(Boolean);
        const selected = [];
        for (const tok of tokens) {
            const canonical = normalizeRootValueName(tok);
            if (canonical && !selected.includes(canonical)) {
                selected.push(canonical);
            }
        }

        if (selected.length === 0 && lines.length > 1) {
            for (const line of lines) {
                const trimmed = line.trim();
                const canonical = normalizeRootValueName(trimmed);
                if (canonical && !selected.includes(canonical)) {
                    selected.push(canonical);
                } else if (trimmed.length > 0) {
                    break;
                }
            }
        }
        return selected;
    }

    function extractSiyerRootValueNotes(contentStr) {
        if (!contentStr || typeof contentStr !== 'string') return '';
        const lines = contentStr.split('\\n');
        const firstLine = lines[0].trim();
        const selectedInFirstLine = parseSelectedRootValues(firstLine);
        if (selectedInFirstLine.length > 0 || firstLine === '') {
            return lines.slice(1).join('\\n').trim();
        }
        return contentStr.trim();
    }

    function updateSiyerRootValueChipsUI(itemId, criterionKey, content) {
        const container = document.getElementById(\`chips-container-\${itemId}__\${criterionKey}\`);
        if (!container) return;
        const selected = parseSelectedRootValues(content);
        const pId = activeProjectId || "proje-siyer";
        const items = seedData?.projects?.[pId]?.items || [];
        const baseId = String(itemId).split('__')[0];
        const targetItem = items.find(it => it.id === baseId || it.id === itemId) || null;
        const canEdit = targetItem ? isItemEditableByCurrentUser(targetItem) : (currentSession?.role === 'teacher' || currentSession?.role === 'student');
        container.innerHTML = renderSiyerRootValueChipsHtml(itemId, criterionKey, selected, canEdit);
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
    }`;

    if (!content.includes(oldParseTarget)) {
        console.error('Could not find oldParseTarget in ' + filePath);
        return false;
    }
    content = content.replace(oldParseTarget, newParseAndHelpers);

    // 3. Patch renderSiyerActiveYearForm handlers to pass yearId explicitly
    content = content.replace(
        "onclick=\"window.RotaliTubitak.handleUndo('${ev.olayKey}')\"",
        "onclick=\"window.RotaliTubitak.handleUndo('${ev.olayKey}', '${yearId}')\""
    );
    content = content.replace(
        "onclick=\"window.RotaliTubitak.handleRedo('${ev.olayKey}')\"",
        "onclick=\"window.RotaliTubitak.handleRedo('${ev.olayKey}', '${yearId}')\""
    );
    content = content.replace(
        "oninput=\"window.RotaliTubitak.onFieldChange('${ev.olayKey}', this.value, this)\"",
        "oninput=\"window.RotaliTubitak.onFieldChange('${ev.olayKey}', this.value, this, '${yearId}')\""
    );
    content = content.replace(
        "onblur=\"window.RotaliTubitak.onFieldBlur('${ev.olayKey}', this.value)\"",
        "onblur=\"window.RotaliTubitak.onFieldBlur('${ev.olayKey}', this.value, '${yearId}')\""
    );

    content = content.replace(
        "onclick=\"window.RotaliTubitak.handleUndo('${ev.kokKey}')\"",
        "onclick=\"window.RotaliTubitak.handleUndo('${ev.kokKey}', '${yearId}')\""
    );
    content = content.replace(
        "onclick=\"window.RotaliTubitak.handleRedo('${ev.kokKey}')\"",
        "onclick=\"window.RotaliTubitak.handleRedo('${ev.kokKey}', '${yearId}')\""
    );
    content = content.replace(
        "oninput=\"window.RotaliTubitak.onFieldChange('${ev.kokKey}', this.value, this)\"",
        "oninput=\"window.RotaliTubitak.onFieldChange('${ev.kokKey}', this.value, this, '${yearId}')\""
    );
    content = content.replace(
        "onblur=\"window.RotaliTubitak.onFieldBlur('${ev.kokKey}', this.value)\"",
        "onblur=\"window.RotaliTubitak.onFieldBlur('${ev.kokKey}', this.value, '${yearId}')\""
    );

    content = content.replace(
        "onclick=\"window.RotaliTubitak.handleUndo('${ev.kaynakKey}')\"",
        "onclick=\"window.RotaliTubitak.handleUndo('${ev.kaynakKey}', '${yearId}')\""
    );
    content = content.replace(
        "onclick=\"window.RotaliTubitak.handleRedo('${ev.kaynakKey}')\"",
        "onclick=\"window.RotaliTubitak.handleRedo('${ev.kaynakKey}', '${yearId}')\""
    );
    content = content.replace(
        "oninput=\"window.RotaliTubitak.onFieldChange('${ev.kaynakKey}', this.value, this)\"",
        "oninput=\"window.RotaliTubitak.onFieldChange('${ev.kaynakKey}', this.value, this, '${yearId}')\""
    );
    content = content.replace(
        "onblur=\"window.RotaliTubitak.onFieldBlur('${ev.kaynakKey}', this.value)\"",
        "onblur=\"window.RotaliTubitak.onFieldBlur('${ev.kaynakKey}', this.value, '${yearId}')\""
    );

    // 4. Patch onFieldChange and onFieldBlur
    const oldFieldChangeTarget = `            if (activeProjectId === "proje-siyer" && criterionKey.includes("kok_deger")) {
                const chipsEl = document.getElementById(\`chips-container-\${effItemId}__\${criterionKey}\`);
                if (chipsEl) {
                    const parsed = parseSelectedRootValues(val);
                    chipsEl.innerHTML = renderSiyerRootValueChipsHtml(effItemId, criterionKey, parsed, isItemEditableByCurrentUser(activeItem));
                }
            }`;

    const newFieldChange = `            if (activeProjectId === "proje-siyer" && criterionKey.includes("kok_deger")) {
                updateSiyerRootValueChipsUI(effItemId, criterionKey, val);
            }`;

    if (!content.includes(oldFieldChangeTarget)) {
        console.error('Could not find oldFieldChangeTarget in ' + filePath);
        return false;
    }
    content = content.replace(oldFieldChangeTarget, newFieldChange);

    const oldFieldBlurTarget = `            if (runtimeRecords[recordKey]) {
                runtimeRecords[recordKey].content = val;
            }
            await executeSave(criterionKey, val, effItemId);`;

    const newFieldBlur = `            if (runtimeRecords[recordKey]) {
                runtimeRecords[recordKey].content = val;
            }
            if (activeProjectId === "proje-siyer" && criterionKey.includes("kok_deger")) {
                updateSiyerRootValueChipsUI(effItemId, criterionKey, val);
            }
            await executeSave(criterionKey, val, effItemId);`;

    if (!content.includes(oldFieldBlurTarget)) {
        console.error('Could not find oldFieldBlurTarget in ' + filePath);
        return false;
    }
    content = content.replace(oldFieldBlurTarget, newFieldBlur);

    // 5. Patch toggleSiyerRootValue
    const oldToggleTarget = `        toggleSiyerRootValue(itemId, criterionKey, valName) {
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

            const baseItemId = String(itemId).split('__')[0];
            const p = projectData?.projects?.[activeProjectId] || projectData?.projects?.['proje-siyer'];
            const targetItem = p?.items?.find(it => it.id === baseItemId) || null;
            const canEdit = targetItem ? isItemEditableByCurrentUser(targetItem) : (currentSession?.role === 'teacher' || currentSession?.role === 'student');

            const container = document.getElementById(\`chips-container-\${itemId}__\${criterionKey}\`);
            if (container) {
                container.innerHTML = renderSiyerRootValueChipsHtml(itemId, criterionKey, selected, canEdit);
            }

            queueAutoSave(criterionKey, newContent, itemId);
        },`;

    const newToggle = `        toggleSiyerRootValue(itemId, criterionKey, valName) {
            const recordKey = \`\${itemId}__\${criterionKey}\`;
            const existing = runtimeRecords[recordKey];
            
            const inputEl = document.getElementById(\`input-\${itemId}__\${criterionKey}\`) || document.getElementById(\`input-\${criterionKey}\`);
            const currentVal = inputEl ? inputEl.value : (existing ? existing.content : "");

            // 1. Geri al yığınına mevcut durumu ekle
            if (!undoStacks[recordKey]) undoStacks[recordKey] = [];
            undoStacks[recordKey].push(currentVal);
            redoStacks[recordKey] = [];

            // 2. Kök değerleri ve isteğe bağlı notları ayrıştır
            let selected = parseSelectedRootValues(currentVal);
            const extraNotes = extractSiyerRootValueNotes(currentVal);

            // 3. Seçim durumunu tersine çevir
            const canonicalVal = normalizeRootValueName(valName) || valName;
            if (selected.includes(canonicalVal)) {
                selected = selected.filter(v => v !== canonicalVal);
            } else {
                selected.push(canonicalVal);
            }

            // 4. Yeni içeriği tek doğruluk kaynağı olarak oluştur
            const valuesLine = selected.join(', ');
            let newContent = '';
            if (valuesLine && extraNotes) {
                newContent = \`\${valuesLine}\\n\${extraNotes}\`;
            } else if (valuesLine) {
                newContent = valuesLine;
            } else if (extraNotes) {
                newContent = \`\\n\${extraNotes}\`;
            } else {
                newContent = '';
            }

            // 5. Yerel kayıt durumunu (runtimeRecords) anında güncelle
            if (!runtimeRecords[recordKey]) {
                runtimeRecords[recordKey] = {
                    id: recordKey,
                    projectId: activeProjectId || "proje-siyer",
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
                runtimeRecords[recordKey].updatedAt = new Date().toISOString();
            }

            // 6. DOM Textarea ve karakter sayısını güncelle
            if (inputEl) {
                inputEl.value = newContent;
                autoGrowTextarea(inputEl);
            }
            const countEl = document.getElementById(\`char-count-\${itemId}__\${criterionKey}\`) || document.getElementById(\`char-count-\${criterionKey}\`);
            if (countEl) countEl.textContent = formatFieldStats(newContent);

            // 7. Butonların görsel durumunu (yeşil ✓ / beyaz +) anında senkronize et
            updateSiyerRootValueChipsUI(itemId, criterionKey, newContent);

            // 8. Otomatik kaydı kuyruğa al (Debounced AutoSave)
            queueAutoSave(criterionKey, newContent, itemId);
        },`;

    if (!content.includes(oldToggleTarget)) {
        console.error('Could not find oldToggleTarget in ' + filePath);
        return false;
    }
    content = content.replace(oldToggleTarget, newToggle);

    if (hasCRLF) {
        content = content.replace(/\n/g, '\r\n');
    }

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Successfully patched ${filePath} (${originalLength} -> ${content.length} bytes)`);
    return true;
}

const file1 = path.resolve(__dirname, '../js/tubitak-research.js');
const file2 = path.resolve(__dirname, '../../js/tubitak-research.js');

console.log('Patching file 1:', file1);
const res1 = patchFile(file1);

console.log('Patching file 2:', file2);
const res2 = patchFile(file2);

if (res1 && res2) {
    console.log('Both mirrors patched successfully!');
} else {
    console.error('Patching failed!');
    process.exit(1);
}
