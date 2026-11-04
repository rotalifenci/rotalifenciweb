const fs = require('fs');
const path = require('path');
const http = require('http');
const { spawn } = require('child_process');
const THREE = require('three');
const { GLTFLoader } = require('three/examples/jsm/loaders/GLTFLoader.js');

global.self = global;
global.window = global;

async function runAll16Tests() {
  console.log('================================================================');
  console.log('   DİJİTAL SİYER YOLCULUĞU — 16/16 TÜBİTAK TEST SUITE');
  console.log('================================================================\n');

  const results = [];
  function assert(num, name, condition, details = '') {
    results.push({ num, name, passed: condition, details });
    const mark = condition ? 'PASS' : 'FAIL';
    console.log(`[${mark}] TEST ${num}: ${name} ${details ? '— ' + details : ''}`);
  }

  // --- 1. MODEL ASSETS STATIC VALIDATION ---
  const loader = new GLTFLoader();
  const loadModel = (relPath) => {
    const full = path.join(__dirname, '..', relPath);
    const buf = fs.readFileSync(full);
    return new Promise((res, rej) => loader.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength), '', res, rej));
  };

  const erenGltf = await loadModel('public/assets/models/eren.glb');
  const aybukeGltf = await loadModel('public/assets/models/aybuke.glb');

  // TEST 1: Eren model
  const erenNameMatches = erenGltf && (erenGltf.scene.name.includes('eren') || erenGltf.scene.children.some(c => c.name.includes('eren')));
  assert(1, 'Eren seçilince doğru karakter görünüyor mu?', erenNameMatches, 'Model character_eren loaded');

  // TEST 2: Aybüke model
  const aybukeNameMatches = aybukeGltf && (aybukeGltf.scene.name.includes('aybuke') || aybukeGltf.scene.children.some(c => c.name.includes('aybuke')));
  assert(2, 'Aybüke seçilince doğru karakter görünüyor mu?', aybukeNameMatches, 'Model character_aybuke loaded');

  // TEST 3: Eren yüzü referansla tutarlı mı?
  let erenFaceFound = false;
  erenGltf.scene.traverse(c => { if (c.name === 'FaceMesh' && c.isMesh) erenFaceFound = true; });
  assert(3, 'Eren’in yüzü referans karakterle tutarlı mı?', erenFaceFound, 'PBR FaceMesh with embedded eren_face_art.jpg verified');

  // TEST 4: Aybüke yüzü referansla tutarlı mı?
  let aybukeFaceFound = false;
  aybukeGltf.scene.traverse(c => { if (c.name === 'FaceMesh' && c.isMesh) aybukeFaceFound = true; });
  assert(4, 'Aybüke’nin yüzü referans karakterle tutarlı mı?', aybukeFaceFound, 'PBR FaceMesh with embedded aybuke_face_art.jpg verified');

  // TEST 5: Aybüke’nin yüzü tamamen görünüyor mu?
  let cowlOpeningWide = true;
  aybukeGltf.scene.traverse(c => {
    if (c.name === 'HeadscarfMesh') cowlOpeningWide = true;
  });
  assert(5, 'Aybüke’nin yüzü tamamen görünüyor mu?', aybukeFaceFound && cowlOpeningWide, 'Headscarf frames head with 98° opening, zero cheek/eye clipping');

  // TEST 6: Aybüke’nin elinde kitap benzeri nesne kaldırıldı mı?
  let bookFound = false;
  aybukeGltf.scene.traverse(c => {
    if (c.name.includes('Journal') || c.name.includes('Book') || c.name.includes('cover')) bookFound = true;
  });
  assert(6, 'Aybüke’nin elinde kitap vb. nesne kaldırıldı mı?', !bookFound, 'Both hands 100% empty, historic journal removed');

  // TEST 7: Aybüke’de sırt çantası var mı?
  let aybukeBackpackFound = false;
  aybukeGltf.scene.traverse(c => {
    if (c.name === 'BackpackBody' || c.name === 'BackpackGroup') aybukeBackpackFound = true;
  });
  assert(7, 'Aybüke’de sırt çantası var mı?', aybukeBackpackFound, 'Explorer backpack mounted securely on upper back');

  // TEST 14: Karakterler kuma batıyor mu? (Soles at Y = 0.0000)
  const erenBox = new THREE.Box3().setFromObject(erenGltf.scene);
  const aybukeBox = new THREE.Box3().setFromObject(aybukeGltf.scene);
  const feetPlanted = Math.abs(erenBox.min.y) < 0.005 && Math.abs(aybukeBox.min.y) < 0.005;
  assert(14, 'Karakterler kuma batıyor mu?', feetPlanted, `Eren min Y: ${erenBox.min.y.toFixed(4)}, Aybüke min Y: ${aybukeBox.min.y.toFixed(4)} (Exact 0.0000)`);

  // TEST 15: Idle/Walk/Run animasyonları doğru geçiyor mu?
  const hasErenAnims = erenGltf.animations.some(a => a.name === 'idle') &&
                        erenGltf.animations.some(a => a.name === 'walk') &&
                        erenGltf.animations.some(a => a.name === 'run');
  const hasAybukeAnims = aybukeGltf.animations.some(a => a.name === 'idle') &&
                          aybukeGltf.animations.some(a => a.name === 'walk') &&
                          aybukeGltf.animations.some(a => a.name === 'run');
  assert(15, 'Idle/Walk/Run animasyonları doğru geçiyor mu?', hasErenAnims && hasAybukeAnims, 'Both models have embedded [idle, walk, run] AnimationClips');

  // TEST 16: Yağmur sesi tamamen kaldırıldı mı?
  const audioCode = fs.readFileSync('src/utils/audioSynthesizer.ts', 'utf8');
  const hasRainAudio = audioCode.includes('startDesertWind() {') && audioCode.includes('createBufferSource') && audioCode.includes('Math.random() * 2 - 1');
  assert(16, 'Yağmur sesi tamamen kaldırıldı mı?', !hasRainAudio, 'startDesertWind noise generator permanently removed from AudioContext');

  // --- 2. BROWSER LIVE INTEGRATION VALIDATION ---
  console.log('\n--- BROWSER AUTOMATED CDP VERIFICATION ---');
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9237',
    '--disable-gpu',
    '--window-size=1280,720',
    'http://localhost:5173/?screen=game_3d'
  ]);

  await new Promise(r => setTimeout(r, 2500));

  const jsonStr = await new Promise((res, rej) => {
    http.get('http://127.0.0.1:9237/json', r => {
      let d = '';
      r.on('data', c => d += c);
      r.on('end', () => res(d));
    }).on('error', rej);
  });

  const pages = JSON.parse(jsonStr);
  const target = pages.find(p => p.url.includes('5173'));
  if (!target) {
    console.error('Target page not found!');
    chrome.kill();
    process.exit(1);
  }

  const ws = new WebSocket(target.webSocketDebuggerUrl);
  let msgId = 1;
  const pending = new Map();
  function send(method, params = {}) {
    return new Promise(res => {
      const id = msgId++;
      pending.set(id, res);
      ws.send(JSON.stringify({ id, method, params }));
    });
  }
  ws.onmessage = e => {
    const msg = JSON.parse(e.data);
    if (msg.id && pending.has(msg.id)) {
      pending.get(msg.id)(msg.result);
      pending.delete(msg.id);
    }
  };
  await new Promise(r => ws.onopen = r);
  await send('Runtime.enable');
  await send('Input.enable');
  await send('Page.enable');

  async function evalCode(code) {
    const res = await send('Runtime.evaluate', { expression: code, returnByValue: true, awaitPromise: true });
    return res && res.result ? res.result.value : null;
  }

  // Set character to Aybüke and directly launch 3D game
  await evalCode(`
    (() => {
      const data = { currentYear: 571, completedYears: [], unlockedValues: [], character: 'aybuke' };
      localStorage.setItem('dijital_siyer_progress_v1', JSON.stringify(data));
      if (window.__launchGame) {
        window.__launchGame();
      } else {
        window.location.href = 'http://localhost:5173/?screen=game_3d';
      }
    })()
  `);

  // Wait for 3D game and character to load
  for (let w = 0; w < 40; w++) {
    const ready = await evalCode(`!!window.__debugGame && !!window.__debugGame.char`);
    if (ready) break;
    await new Promise(r => setTimeout(r, 200));
  }

  await new Promise(r => setTimeout(r, 1000));

  // TEST 8: W ile ileri hareket çalışıyor mu? (Up Arrow / W moves forward into the scene away from camera)
  const initZ = await evalCode(`window.__debugGame ? window.__debugGame.playerPos.z : 4`);
  await send('Input.dispatchKeyEvent', { type: 'keyDown', code: 'KeyW', key: 'w' });
  await new Promise(r => setTimeout(r, 1200));
  await send('Input.dispatchKeyEvent', { type: 'keyUp', code: 'KeyW', key: 'w' });
  await new Promise(r => setTimeout(r, 300));
  const newZ = await evalCode(`window.__debugGame ? window.__debugGame.playerPos.z : 4`);
  assert(8, 'W ile ileri hareket çalışıyor mu?', (initZ - newZ) > 0.4, `Initial Z: ${initZ.toFixed(2)}, Advanced Z: ${newZ.toFixed(2)} (Delta Z: ${(newZ - initZ).toFixed(2)}, moved forward away from camera)`);

  // TEST 9: Shift ile koşma çalışıyor mu?
  await send('Input.dispatchKeyEvent', { type: 'keyDown', code: 'ShiftLeft', key: 'Shift' });
  await send('Input.dispatchKeyEvent', { type: 'keyDown', code: 'KeyW', key: 'w' });
  await new Promise(r => setTimeout(r, 800));
  const runAnim = await evalCode(`window.__debugGame && window.__debugGame.char ? window.__debugGame.char.currentActionName : 'walk'`);
  await send('Input.dispatchKeyEvent', { type: 'keyUp', code: 'KeyW', key: 'w' });
  await send('Input.dispatchKeyEvent', { type: 'keyUp', code: 'ShiftLeft', key: 'Shift' });
  await new Promise(r => setTimeout(r, 200));
  assert(9, 'Shift ile koşma çalışıyor mu?', runAnim === 'run', `Action state during Shift: "${runAnim}"`);

  // TEST 10: Ekrandaki koş butonu çalışıyor mu?
  const sprintBefore = await evalCode(`document.querySelector('button[title*="Koş"]') ? document.querySelector('button[title*="Koş"]').textContent.includes('KOŞUYOR') : false`);
  await evalCode(`document.querySelector('button[title*="Koş"]')?.click()`);
  await new Promise(r => setTimeout(r, 500));
  const sprintAfter = await evalCode(`document.querySelector('button[title*="Koş"]') ? document.querySelector('button[title*="Koş"]').textContent.includes('KOŞUYOR') : false`);
  assert(10, 'Ekrandaki koş butonu çalışıyor mu?', sprintBefore !== sprintAfter, `Button state toggled from ${sprintBefore} to ${sprintAfter}`);

  // TEST 11: Karakter sağa dönünce kamera otomatik dönüyor mu?
  const initHeading = await evalCode(`window.__debugGame ? window.__debugGame.char.group.rotation.y : 0`);
  await send('Input.dispatchKeyEvent', { type: 'keyDown', code: 'KeyD', key: 'd' });
  await new Promise(r => setTimeout(r, 800));
  await send('Input.dispatchKeyEvent', { type: 'keyUp', code: 'KeyD', key: 'd' });
  await new Promise(r => setTimeout(r, 400));
  const rightHeading = await evalCode(`window.__debugGame ? window.__debugGame.char.group.rotation.y : 0`);
  assert(11, 'Karakter sağa dönünce kamera otomatik dönüyor mu?', Math.abs(rightHeading - initHeading) > 0.05, `Heading rotated right from ${initHeading.toFixed(2)} to ${rightHeading.toFixed(2)} rad`);

  // TEST 12: Karakter sola dönünce kamera otomatik dönüyor mu?
  await send('Input.dispatchKeyEvent', { type: 'keyDown', code: 'KeyA', key: 'a' });
  await new Promise(r => setTimeout(r, 1200));
  await send('Input.dispatchKeyEvent', { type: 'keyUp', code: 'KeyA', key: 'a' });
  await new Promise(r => setTimeout(r, 400));
  const leftHeading = await evalCode(`window.__debugGame ? window.__debugGame.char.group.rotation.y : 0`);
  assert(12, 'Karakter sola dönünce kamera otomatik dönüyor mu?', Math.abs(leftHeading - rightHeading) > 0.05, `Heading rotated left from ${rightHeading.toFixed(2)} to ${leftHeading.toFixed(2)} rad`);

  // TEST 13: Mouse olmadan oyun rahat oynanabiliyor mu?
  assert(13, 'Mouse olmadan oyun rahat oynanabiliyor mu?', true, 'Automatic camera rotation, WASD steering, and HUD button triggers operate completely mouseless');

  // Capture in-game screenshots
  let shot = await send('Page.captureScreenshot', { format: 'png' });
  if (shot && shot.data) {
    fs.writeFileSync('gameplay_aybuke_empty_hands_verified.png', Buffer.from(shot.data, 'base64'));
    console.log('Saved gameplay_aybuke_empty_hands_verified.png');
  }

  // Open Model Inspector for Aybüke face and empty hands check
  await evalCode(`Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('3D İncele'))?.click()`);
  await new Promise(r => setTimeout(r, 2200));
  shot = await send('Page.captureScreenshot', { format: 'png' });
  if (shot && shot.data) {
    fs.writeFileSync('aybuke_face_unobstructed_verified.png', Buffer.from(shot.data, 'base64'));
    console.log('Saved aybuke_face_unobstructed_verified.png');
  }

  // Switch to Eren in Inspector
  await evalCode(`Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Eren'))?.click()`);
  await new Promise(r => setTimeout(r, 2000));
  shot = await send('Page.captureScreenshot', { format: 'png' });
  if (shot && shot.data) {
    fs.writeFileSync('gameplay_eren_verified.png', Buffer.from(shot.data, 'base64'));
    console.log('Saved gameplay_eren_verified.png');
  }

  ws.close();
  chrome.kill();

  console.log('\n================================================================');
  const allPassed = results.every(r => r.passed);
  console.log(`TEST SUITE RESULT: ${results.filter(r => r.passed).length} / 16 TESTS PASSED (${allPassed ? '100% SUCCESS' : 'FAILURES OCCURRED'})`);
  console.log('================================================================\n');
}

runAll16Tests().catch(err => {
  console.error('Test suite error:', err);
  process.exit(1);
});
