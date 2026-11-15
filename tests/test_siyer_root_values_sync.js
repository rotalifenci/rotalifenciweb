const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('--- RUNNING SIYER ROOT VALUES SYNCHRONIZATION TESTS ---');

const SIYER_ROOT_VALUES = [
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

function normalizeRootValueName(name) {
    if (!name || typeof name !== 'string') return null;
    const clean = name.trim().toLocaleLowerCase('tr-TR').replace(/[\s\-_]+/g, '');
    const match = SIYER_ROOT_VALUES.find(val => val.toLocaleLowerCase('tr-TR').replace(/[\s\-_]+/g, '') === clean);
    return match || null;
}

function parseSelectedRootValues(contentStr) {
    if (!contentStr || typeof contentStr !== 'string') return [];
    const lines = contentStr.split('\n');
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
    const lines = contentStr.split('\n');
    const firstLine = lines[0].trim();
    const selectedInFirstLine = parseSelectedRootValues(firstLine);
    if (selectedInFirstLine.length > 0 || firstLine === '') {
        return lines.slice(1).join('\n').trim();
    }
    return contentStr.trim();
}

function renderSiyerRootValueChipsHtml(itemId, criterionKey, selectedValues, canEdit) {
    return SIYER_ROOT_VALUES.map(val => {
        const isSelected = Array.isArray(selectedValues) && selectedValues.includes(val);
        return `
        <button type="button" 
            ${!canEdit ? 'disabled' : ''}
            onclick="window.RotaliTubitak.toggleSiyerRootValue('${itemId}', '${criterionKey}', '${val}')"
            class="px-2.5 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1 cursor-pointer select-none ${
                isSelected 
                    ? 'bg-emerald-600 text-white shadow-xs border border-emerald-600 ring-2 ring-emerald-400/30' 
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-300'
            } ${!canEdit ? 'opacity-60 cursor-not-allowed' : ''}"
            title="${isSelected ? 'Kök Değer Seçimini Kaldır' : 'Kök Değer Olarak Ekle'}">
            <span class="text-[10px]">${isSelected ? '✓' : '+'}</span>
            <span>${val}</span>
        </button>
        `;
    }).join('');
}

// Simulated environment
const runtimeRecords = {};
const undoStacks = {};
const redoStacks = {};
let activeProjectId = "proje-siyer";
let currentSession = { role: "student", studentName: "Ali Veli" };
const fakeDom = {};

function toggleSiyerRootValue(itemId, criterionKey, valName) {
    const recordKey = `${itemId}__${criterionKey}`;
    const existing = runtimeRecords[recordKey];
    const currentVal = fakeDom[`input-${itemId}__${criterionKey}`] !== undefined 
        ? fakeDom[`input-${itemId}__${criterionKey}`] 
        : (existing ? existing.content : "");

    if (!undoStacks[recordKey]) undoStacks[recordKey] = [];
    undoStacks[recordKey].push(currentVal);
    redoStacks[recordKey] = [];

    let selected = parseSelectedRootValues(currentVal);
    const extraNotes = extractSiyerRootValueNotes(currentVal);

    const canonicalVal = normalizeRootValueName(valName) || valName;
    if (selected.includes(canonicalVal)) {
        selected = selected.filter(v => v !== canonicalVal);
    } else {
        selected.push(canonicalVal);
    }

    const valuesLine = selected.join(', ');
    let newContent = '';
    if (valuesLine && extraNotes) {
        newContent = `${valuesLine}\n${extraNotes}`;
    } else if (valuesLine) {
        newContent = valuesLine;
    } else if (extraNotes) {
        newContent = `\n${extraNotes}`;
    } else {
        newContent = '';
    }

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

    fakeDom[`input-${itemId}__${criterionKey}`] = newContent;
    fakeDom[`chips-container-${itemId}__${criterionKey}`] = renderSiyerRootValueChipsHtml(itemId, criterionKey, selected, true);
    return newContent;
}

function performUndo(criterionKey, targetItemId) {
    const recordKey = `${targetItemId}__${criterionKey}`;
    const stack = undoStacks[recordKey] || [];
    if (stack.length === 0) return false;

    const currentVal = runtimeRecords[recordKey]?.content || "";
    if (!redoStacks[recordKey]) redoStacks[recordKey] = [];
    redoStacks[recordKey].push(currentVal);

    const previousVal = stack.pop();
    if (!runtimeRecords[recordKey]) {
        runtimeRecords[recordKey] = {
            id: recordKey,
            projectId: activeProjectId,
            itemId: targetItemId,
            criterionKey: criterionKey,
            content: previousVal
        };
    } else {
        runtimeRecords[recordKey].content = previousVal;
    }

    fakeDom[`input-${targetItemId}__${criterionKey}`] = previousVal;
    const selected = parseSelectedRootValues(previousVal);
    fakeDom[`chips-container-${targetItemId}__${criterionKey}`] = renderSiyerRootValueChipsHtml(targetItemId, criterionKey, selected, true);
    return true;
}

function performRedo(criterionKey, targetItemId) {
    const recordKey = `${targetItemId}__${criterionKey}`;
    const stack = redoStacks[recordKey] || [];
    if (stack.length === 0) return false;

    const currentVal = runtimeRecords[recordKey]?.content || "";
    if (!undoStacks[recordKey]) undoStacks[recordKey] = [];
    undoStacks[recordKey].push(currentVal);

    const nextVal = stack.pop();
    if (!runtimeRecords[recordKey]) {
        runtimeRecords[recordKey] = {
            id: recordKey,
            projectId: activeProjectId,
            itemId: targetItemId,
            criterionKey: criterionKey,
            content: nextVal
        };
    } else {
        runtimeRecords[recordKey].content = nextVal;
    }

    fakeDom[`input-${targetItemId}__${criterionKey}`] = nextVal;
    const selected = parseSelectedRootValues(nextVal);
    fakeDom[`chips-container-${targetItemId}__${criterionKey}`] = renderSiyerRootValueChipsHtml(targetItemId, criterionKey, selected, true);
    return true;
}

// -------------------------------------------------------------
// TEST 1: Normalization
// -------------------------------------------------------------
console.log('Testing Normalization...');
assert.strictEqual(normalizeRootValueName('Adalet'), 'Adalet');
assert.strictEqual(normalizeRootValueName('adalet'), 'Adalet');
assert.strictEqual(normalizeRootValueName('Öz denetim'), 'Öz denetim');
assert.strictEqual(normalizeRootValueName('Özdenetim'), 'Öz denetim');
assert.strictEqual(normalizeRootValueName('özdenetim'), 'Öz denetim');
assert.strictEqual(normalizeRootValueName('YARDIMSEVERLİK'), 'Yardımseverlik');
assert.strictEqual(normalizeRootValueName('Rastgele cümle burada'), null);
console.log('✓ Normalization tests passed.');

// -------------------------------------------------------------
// TEST 2: Parsing selected values without interference from notes
// -------------------------------------------------------------
console.log('Testing parseSelectedRootValues...');
const mixedContent = "Sevgi, Saygı, Dürüstlük\nDoğumuyla birlikte insanlığa merhamet ve sevgi gelmiştir.";
const parsedInitial = parseSelectedRootValues(mixedContent);
assert.deepStrictEqual(parsedInitial, ["Sevgi", "Saygı", "Dürüstlük"]);

// When Sevgi is removed from line 1:
const afterRemoveSevgi = "Saygı, Dürüstlük\nDoğumuyla birlikte insanlığa merhamet ve sevgi gelmiştir.";
const parsedAfterRemove = parseSelectedRootValues(afterRemoveSevgi);
assert.deepStrictEqual(parsedAfterRemove, ["Saygı", "Dürüstlük"]);
assert(!parsedAfterRemove.includes("Sevgi"), "Sevgi must NOT be selected even though line 2 has 'sevgi'!");

// When all values removed:
const allRemoved = "\nDoğumuyla birlikte insanlığa merhamet ve sevgi gelmiştir.";
const parsedAllRemoved = parseSelectedRootValues(allRemoved);
assert.deepStrictEqual(parsedAllRemoved, [], "All values removed must result in empty array!");
console.log('✓ parseSelectedRootValues tests passed.');

// -------------------------------------------------------------
// TEST 3: extractSiyerRootValueNotes preserves notes perfectly
// -------------------------------------------------------------
console.log('Testing extractSiyerRootValueNotes...');
const note1 = extractSiyerRootValueNotes(mixedContent);
assert.strictEqual(note1, "Doğumuyla birlikte insanlığa merhamet ve sevgi gelmiştir.");

const note2 = extractSiyerRootValueNotes(allRemoved);
assert.strictEqual(note2, "Doğumuyla birlikte insanlığa merhamet ve sevgi gelmiştir.");

const note3 = extractSiyerRootValueNotes("Adalet, Sevgi");
assert.strictEqual(note3, "");
console.log('✓ extractSiyerRootValueNotes tests passed.');

// -------------------------------------------------------------
// TEST 4: Toggle Root Value (Selecting and Unselecting)
// -------------------------------------------------------------
console.log('Testing toggleSiyerRootValue...');
const yearId = "siyer-571";
const critKey = "c2_kok_deger";

// Start with existing real database content:
runtimeRecords[`${yearId}__${critKey}`] = {
    id: `${yearId}__${critKey}`,
    content: "Sevgi, Saygı, Dürüstlük\nDoğumuyla birlikte insanlığa merhamet ve sevgi gelmiştir."
};
fakeDom[`input-${yearId}__${critKey}`] = runtimeRecords[`${yearId}__${critKey}`].content;

// 1. Unselect "Sevgi"
let res = toggleSiyerRootValue(yearId, critKey, "Sevgi");
assert.strictEqual(res, "Saygı, Dürüstlük\nDoğumuyla birlikte insanlığa merhamet ve sevgi gelmiştir.");
assert.strictEqual(runtimeRecords[`${yearId}__${critKey}`].content, res);

// Verify chip HTML for Sevgi is now white with '+'
let chipsHtml = fakeDom[`chips-container-${yearId}__${critKey}`];
assert(chipsHtml.includes('bg-white hover:bg-slate-100 text-slate-700 border border-slate-300'), "Unselected chip must be white!");
assert(chipsHtml.includes('<span class="text-[10px]">+</span>\n            <span>Sevgi</span>'), "Sevgi chip must have '+' icon!");
assert(chipsHtml.includes('title="Kök Değer Olarak Ekle"'), "Sevgi chip title must say 'Kök Değer Olarak Ekle'!");

// Verify Saygı is still green with '✓'
assert(chipsHtml.includes('<span class="text-[10px]">✓</span>\n            <span>Saygı</span>'), "Saygı chip must have '✓' icon!");

// 2. Click "Sevgi" again to re-select
res = toggleSiyerRootValue(yearId, critKey, "Sevgi");
assert.strictEqual(res, "Saygı, Dürüstlük, Sevgi\nDoğumuyla birlikte insanlığa merhamet ve sevgi gelmiştir.");
chipsHtml = fakeDom[`chips-container-${yearId}__${critKey}`];
assert(chipsHtml.includes('<span class="text-[10px]">✓</span>\n            <span>Sevgi</span>'), "Sevgi chip must have '✓' icon again!");
assert(chipsHtml.includes('title="Kök Değer Seçimini Kaldır"'), "Sevgi chip title must say 'Kök Değer Seçimini Kaldır'!");

// 3. Unselect all values one by one
toggleSiyerRootValue(yearId, critKey, "Saygı");
toggleSiyerRootValue(yearId, critKey, "Dürüstlük");
res = toggleSiyerRootValue(yearId, critKey, "Sevgi");
assert.strictEqual(res, "\nDoğumuyla birlikte insanlığa merhamet ve sevgi gelmiştir.");
chipsHtml = fakeDom[`chips-container-${yearId}__${critKey}`];
assert(!chipsHtml.includes('bg-emerald-600'), "All chips must be white when none selected!");
assert(!chipsHtml.includes('<span class="text-[10px]">✓</span>'), "No chips must have '✓' when none selected!");
console.log('✓ toggleSiyerRootValue tests passed.');

// -------------------------------------------------------------
// TEST 5: Undo and Redo Synchronization
// -------------------------------------------------------------
console.log('Testing Undo & Redo Integration...');
// We are currently at empty values.
// Now add "Adalet":
toggleSiyerRootValue(yearId, critKey, "Adalet");
assert(fakeDom[`chips-container-${yearId}__${critKey}`].includes('<span class="text-[10px]">✓</span>\n            <span>Adalet</span>'));

// Now add "Sabır":
toggleSiyerRootValue(yearId, critKey, "Sabır");
assert(fakeDom[`chips-container-${yearId}__${critKey}`].includes('<span class="text-[10px]">✓</span>\n            <span>Sabır</span>'));

// Now UNDO (Sabır should disappear and chip turn white)
let undoRes = performUndo(critKey, yearId);
assert(undoRes === true);
chipsHtml = fakeDom[`chips-container-${yearId}__${critKey}`];
assert(chipsHtml.includes('<span class="text-[10px]">+</span>\n            <span>Sabır</span>'), "Undo must revert Sabır chip to '+'!");
assert(chipsHtml.includes('<span class="text-[10px]">✓</span>\n            <span>Adalet</span>'), "Undo must keep Adalet chip as '✓'!");

// Now REDO (Sabır should reappear and chip turn green)
let redoRes = performRedo(critKey, yearId);
assert(redoRes === true);
chipsHtml = fakeDom[`chips-container-${yearId}__${critKey}`];
assert(chipsHtml.includes('<span class="text-[10px]">✓</span>\n            <span>Sabır</span>'), "Redo must advance Sabır chip to '✓'!");
assert(chipsHtml.includes('<span class="text-[10px]">✓</span>\n            <span>Adalet</span>'), "Redo must keep Adalet chip as '✓'!");
console.log('✓ Undo and Redo integration tests passed.');

// -------------------------------------------------------------
// TEST 6: Event Isolation (Event 1, Event 2, Event 3)
// -------------------------------------------------------------
console.log('Testing 3 Events Isolation on fresh Year 572...');
const testYear = "siyer-572";
const ev1Key = "c2_kok_deger";
const ev2Key = "c2_kok_deger_2";
const ev3Key = "c2_kok_deger_3";

toggleSiyerRootValue(testYear, ev1Key, "Adalet");
toggleSiyerRootValue(testYear, ev2Key, "Dostluk");
toggleSiyerRootValue(testYear, ev3Key, "Vatanseverlik");

const ev1Parsed = parseSelectedRootValues(runtimeRecords[`${testYear}__${ev1Key}`].content);
const ev2Parsed = parseSelectedRootValues(runtimeRecords[`${testYear}__${ev2Key}`].content);
const ev3Parsed = parseSelectedRootValues(runtimeRecords[`${testYear}__${ev3Key}`].content);

assert(ev1Parsed.includes("Adalet") && !ev1Parsed.includes("Dostluk") && !ev1Parsed.includes("Vatanseverlik"), "Event 1 must only have Adalet!");
assert(ev2Parsed.includes("Dostluk") && !ev2Parsed.includes("Adalet") && !ev2Parsed.includes("Vatanseverlik"), "Event 2 must only have Dostluk!");
assert(ev3Parsed.includes("Vatanseverlik") && !ev3Parsed.includes("Adalet") && !ev3Parsed.includes("Dostluk"), "Event 3 must only have Vatanseverlik!");

// Now unselect Adalet from Event 1:
toggleSiyerRootValue(testYear, ev1Key, "Adalet");
const ev1AfterUnselect = parseSelectedRootValues(runtimeRecords[`${testYear}__${ev1Key}`].content);
const ev2After = parseSelectedRootValues(runtimeRecords[`${testYear}__${ev2Key}`].content);
const ev3After = parseSelectedRootValues(runtimeRecords[`${testYear}__${ev3Key}`].content);

assert.strictEqual(ev1AfterUnselect.length, 0, "Event 1 must have 0 selected values!");
assert(ev2After.includes("Dostluk"), "Event 2 must still have Dostluk!");
assert(ev3After.includes("Vatanseverlik"), "Event 3 must still have Vatanseverlik!");
console.log('✓ 3 Events isolation tests passed.');

console.log('ALL TESTS PASSED SUCCESSFULLY! 100% verified.');
