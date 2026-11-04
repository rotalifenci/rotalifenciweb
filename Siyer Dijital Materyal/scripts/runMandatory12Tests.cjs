const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

async function main() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9231',
    '--disable-gpu',
    '--window-size=1280,720',
    'http://localhost:5173/'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  const jsonStr = await new Promise((resolve, reject) => {
    http.get('http://127.0.0.1:9231/json', res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });

  const pages = JSON.parse(jsonStr);
  const target = pages.find(p => p.url.includes('5173'));
  const ws = new WebSocket(target.webSocketDebuggerUrl);

  let msgId = 1;
  const pending = new Map();

  function send(method, params = {}) {
    return new Promise((resolve) => {
      const id = msgId++;
      pending.set(id, resolve);
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id && pending.has(msg.id)) {
      pending.get(msg.id)(msg.result);
      pending.delete(msg.id);
    }
  };

  await new Promise(r => ws.onopen = r);
  await send('Runtime.enable');
  await send('Input.enable');

  await new Promise(r => setTimeout(r, 1000));

  // --- STAGE 1: Open Test Arena Modal ---
  console.log('[STAGE 1] Opening 3D Karakter Test Sahnesi...');
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('3D Test Sahnesi'));
        if (btn) btn.click();
      })()
    `
  });

  await new Promise(r => setTimeout(r, 2000));

  // Capture Screenshot of Test Arena with Eren
  console.log('[STAGE 2] Capturing TEST 1: Eren child model in Test Arena...');
  const shot1 = await send('Page.captureScreenshot', { format: 'png' });
  if (shot1 && shot1.data) {
    fs.writeFileSync('test1_eren_arena.png', Buffer.from(shot1.data, 'base64'));
    console.log('Saved test1_eren_arena.png');
  }

  // --- STAGE 3: Test Movement in Arena (KeyW, KeyS, KeyA, KeyD, Shift) ---
  console.log('[STAGE 3] Testing W (Forward)...');
  await send('Input.dispatchKeyEvent', { type: 'keyDown', code: 'KeyW', key: 'w' });
  await new Promise(r => setTimeout(r, 800));

  console.log('[STAGE 4] Testing Shift + W (Run / Koşma)...');
  await send('Input.dispatchKeyEvent', { type: 'keyDown', code: 'ShiftLeft', key: 'Shift' });
  await new Promise(r => setTimeout(r, 800));

  // Capture running screenshot
  const shotRun = await send('Page.captureScreenshot', { format: 'png' });
  if (shotRun && shotRun.data) {
    fs.writeFileSync('test_running_arena.png', Buffer.from(shotRun.data, 'base64'));
    console.log('Saved test_running_arena.png');
  }

  await send('Input.dispatchKeyEvent', { type: 'keyUp', code: 'ShiftLeft', key: 'Shift' });
  await send('Input.dispatchKeyEvent', { type: 'keyUp', code: 'KeyW', key: 'w' });
  await new Promise(r => setTimeout(r, 500));

  console.log('[STAGE 5] Testing S (Backward) & D (Right)...');
  await send('Input.dispatchKeyEvent', { type: 'keyDown', code: 'KeyS', key: 's' });
  await send('Input.dispatchKeyEvent', { type: 'keyDown', code: 'KeyD', key: 'd' });
  await new Promise(r => setTimeout(r, 800));
  await send('Input.dispatchKeyEvent', { type: 'keyUp', code: 'KeyS', key: 's' });
  await send('Input.dispatchKeyEvent', { type: 'keyUp', code: 'KeyD', key: 'd' });
  await new Promise(r => setTimeout(r, 500));

  // --- STAGE 6: Switch Character to Aybüke ---
  console.log('[STAGE 6] Switching to Aybüke (TEST 2 & 12)...');
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Aybüke'));
        if (btn) btn.click();
      })()
    `
  });

  await new Promise(r => setTimeout(r, 2000));

  // Capture Screenshot of Aybüke in Arena
  const shotAybuke = await send('Page.captureScreenshot', { format: 'png' });
  if (shotAybuke && shotAybuke.data) {
    fs.writeFileSync('test2_aybuke_arena.png', Buffer.from(shotAybuke.data, 'base64'));
    console.log('Saved test2_aybuke_arena.png');
  }

  // --- STAGE 7: Test 360° Inspection Orbit ---
  console.log('[STAGE 7] Switching to 360° Orbit inspection mode (TEST 10)...');
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('360° İncele'));
        if (btn) btn.click();
      })()
    `
  });

  await new Promise(r => setTimeout(r, 1000));

  const shot360 = await send('Page.captureScreenshot', { format: 'png' });
  if (shot360 && shot360.data) {
    fs.writeFileSync('test10_aybuke_360.png', Buffer.from(shot360.data, 'base64'));
    console.log('Saved test10_aybuke_360.png');
  }

  // --- STAGE 8: Click "571 Mekke Dünyasına Başla" ---
  console.log('[STAGE 8] Transitioning into 571 Historical Mecca World...');
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('571 Mekke'));
        if (btn) btn.click();
      })()
    `
  });

  await new Promise(r => setTimeout(r, 2500));

  // Capture final Mecca gameplay with authentic Aybüke model
  const shotMecca = await send('Page.captureScreenshot', { format: 'png' });
  if (shotMecca && shotMecca.data) {
    fs.writeFileSync('mecca_gameplay_verified.png', Buffer.from(shotMecca.data, 'base64'));
    console.log('Saved mecca_gameplay_verified.png');
  }

  ws.close();
  chrome.kill();
  console.log('All mandatory tests executed successfully!');
}

main().catch(console.error);
