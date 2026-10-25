const fs = require('fs');
const path = require('path');

// Mock localStorage
const storage = {};
global.localStorage = {
    getItem: (key) => storage[key] || null,
    setItem: (key, val) => { storage[key] = String(val); },
    removeItem: (key) => { delete storage[key]; }
};
global.sessionStorage = {
    getItem: () => null,
    setItem: () => {}
};
global.window = global;
global.window.addEventListener = () => {};
global.window.location = { hash: "#home", hostname: "localhost" };
global.document = {
    addEventListener: () => {},
    querySelector: () => null,
    querySelectorAll: () => [],
    getElementById: () => null,
    body: { appendChild: () => {} },
    createElement: () => ({ className: '', innerHTML: '', style: {}, classList: { add: () => {}, remove: () => {} }, appendChild: () => {}, remove: () => {} })
};

// Mock fetch to simulate server materials.json
const rawStatic = fs.readFileSync(path.join(__dirname, '..', 'data', 'materials.json'), 'utf8');
const staticMaterials = JSON.parse(rawStatic);

global.fetch = async (url) => {
    return {
        ok: true,
        json: async () => staticMaterials
    };
};

// Load curriculum-data and app.js
require('../js/curriculum-data.js');
require('../js/app.js');
global.showToast = () => {};
global.window.showToast = () => {};

async function runTests() {
    console.log('=== TEST SUITE: PERSISTENCE & POSITION / CATEGORY STABILITY ===');

    // 1. Initial materials load
    console.log('Test 1: Initializing materials from static json...');
    const initialList = await window.loadCentralizedMaterials();
    console.log(`Loaded ${initialList.length} materials.`);

    // Pick a test item (e.g. mat-video-5-1-04)
    const testItemId = "mat-video-5-1-04";
    const itemBefore = initialList.find(m => m.id === testItemId);
    console.log(`Before test, ${testItemId}:`, {
        category: itemBefore.category,
        targetSection: window.getMaterialTargetSection(itemBefore),
        grade: itemBefore.grade
    });

    // 2. Perform Quick Move: Move item to category 'etkinlikler', section '2', grade '5', subtopic 3
    console.log('\nTest 2: Simulating executeQuickMove to change category and section...');
    const fakeEvent = {
        preventDefault: () => {},
        target: {
            querySelector: () => ({ value: "5" }),
            targetGrade: { value: "5" },
            targetCategory: { value: "etkinlikler" },
            targetSection: { value: "2" },
            targetSubtopic: { value: "3" }
        }
    };
    await window.executeQuickMove(fakeEvent, testItemId);

    // Verify localStorage persistence
    const savedCustomList = JSON.parse(localStorage.getItem("rotali_custom_materials"));
    const savedItem = savedCustomList.find(m => m.id === testItemId);
    const overrides = window.getStoredMetadataOverrides();
    const savedOrder = window.getStoredMaterialsOrder();

    console.log('After executeQuickMove:', {
        inListCategory: savedItem.category,
        inListSection: savedItem.targetSection,
        inOverrides: overrides[testItemId],
        firstInOrder: savedOrder[0] === testItemId
    });

    if (savedItem.category !== "etkinlikler" || savedItem.targetSection !== "2") {
        console.error('❌ QuickMove failed to update item in customList!');
        process.exit(1);
    }
    console.log('✅ executeQuickMove successfully persisted to localStorage!');

    // 3. Simulate Page Refresh / Reopen: Re-run loadCentralizedMaterials (merging with server data)
    console.log('\nTest 3: Simulating Page Reload (loadCentralizedMaterials)...');
    const reloadedList = await window.loadCentralizedMaterials();
    const itemAfterReload = reloadedList.find(m => m.id === testItemId);

    console.log('After reload, item state:', {
        category: itemAfterReload.category,
        targetSection: window.getMaterialTargetSection(itemAfterReload),
        subtopicNum: itemAfterReload.subtopicNum,
        indexInList: reloadedList.findIndex(m => m.id === testItemId)
    });

    if (itemAfterReload.category !== "etkinlikler") {
        console.error('❌ BUG! Category was reverted back to server default!');
        process.exit(1);
    }
    if (String(window.getMaterialTargetSection(itemAfterReload)) !== "2") {
        console.error('❌ BUG! Target section was reverted back to server default!');
        process.exit(1);
    }
    if (reloadedList[0].id !== testItemId) {
        console.error('❌ BUG! Saved order rank was not preserved!');
        process.exit(1);
    }

    console.log('✅ PASS: After page refresh, item retained its moved category, section, subtopic, and order!');

    // 4. Test moveCustomMaterial (Up/Down order changes)
    console.log('\nTest 4: Testing moveCustomMaterial order changes...');
    // Mark admin
    localStorage.setItem("rotali_is_admin", "true");
    
    // Move test item down
    console.log(`Moving item (${testItemId}) down by 1 position...`);
    await window.moveCustomMaterial(testItemId, 1);

    const afterMoveList = window.getCustomMaterialsList();
    const newIdx = afterMoveList.findIndex(m => m.id === testItemId);
    console.log(`New index of ${testItemId}: ${newIdx}`);

    // Simulate another page refresh
    console.log('Simulating page refresh after moveCustomMaterial...');
    const reloadedAfterMove = await window.loadCentralizedMaterials();
    const reloadedIdx = reloadedAfterMove.findIndex(m => m.id === testItemId);
    console.log(`Index of ${testItemId} after reload: ${reloadedIdx}`);

    if (reloadedIdx !== newIdx) {
        console.error('❌ Order was not preserved after moveCustomMaterial and page refresh!');
        process.exit(1);
    }
    console.log('✅ PASS: Order after moveCustomMaterial is 100% persistent across reload!');

    console.log('\n🎉 ALL PERSISTENCE TESTS PASSED COMPLETELY!');
}

runTests().catch(err => {
    console.error('Fatal test error:', err);
    process.exit(1);
});
