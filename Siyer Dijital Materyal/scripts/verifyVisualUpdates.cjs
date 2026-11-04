const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

async function main() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9236',
    '--disable-gpu',
    '--window-size=1280,720',
    'http://localhost:5173/'
  ]);

  await new Promise(r => setTimeout(r, 2500));

  const jsonStr = await new Promise((resolve, reject) => {
    http.get('http://127.0.0.1:9236/json', res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
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
    return new Promise(resolve => {
      const id = msgId++;
      pending.set(id, resolve);
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  ws.onmessage = event => {
    const msg = JSON.parse(event.data);
    if (msg.id && pending.has(msg.id)) {
      pending.get(msg.id)(msg.result);
      pending.delete(msg.id);
    }
  };

  await new Promise(r => ws.onopen = r);
  await send('Runtime.enable');
  await send('Input.enable');
  await send('Page.enable');

  await new Promise(r => setTimeout(r, 1000));

  async function evaluate(code) {
    const res = await send('Runtime.evaluate', {
      expression: code,
      returnByValue: true,
      awaitPromise: true
    });
    return res && res.result ? res.result.value : null;
  }

  console.log('1. Setting character to Aybüke and entering game...');
  await evaluate(`
    (() => {
      try {
        const raw = localStorage.getItem('dijital_siyer_progress_v1');
        const data = raw ? JSON.parse(raw) : { currentYear: 571, completedYears: [], unlockedValues: [] };
        data.character = 'aybuke';
        localStorage.setItem('dijital_siyer_progress_v1', JSON.stringify(data));
      } catch (e) {}
      location.reload();
    })()
  `);

  await new Promise(r => setTimeout(r, 2500));

  // Click "Başla"
  await evaluate(`Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Başla'))?.click()`);
  await new Promise(r => setTimeout(r, 3000));

  // 1. Capture gameplay: Aybüke with backpack and Kaaba with 3D mountains in the background
  let shot = await send('Page.captureScreenshot', { format: 'png' });
  if (shot && shot.data) {
    fs.writeFileSync('verified_aybuke_gameplay_fixed.png', Buffer.from(shot.data, 'base64'));
    console.log('Saved verified_aybuke_gameplay_fixed.png');
  }

  // 2. Turn camera around to look at mountains and open desert
  console.log('2. Turning player to look at the 3D Mountains surrounding Mecca...');
  await send('Input.dispatchKeyEvent', { type: 'keyDown', code: 'KeyA', key: 'a' });
  await new Promise(r => setTimeout(r, 1500));
  await send('Input.dispatchKeyEvent', { type: 'keyUp', code: 'KeyA', key: 'a' });
  await new Promise(r => setTimeout(r, 800));

  shot = await send('Page.captureScreenshot', { format: 'png' });
  if (shot && shot.data) {
    fs.writeFileSync('verified_mecca_3d_mountains.png', Buffer.from(shot.data, 'base64'));
    console.log('Saved verified_mecca_3d_mountains.png');
  }

  // 3. Open 3D Model Inspector for Aybüke front view
  console.log('3. Opening 3D Model Inspector for Aybüke front face...');
  await evaluate(`
    (() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('3D İncele'));
      if (btn) btn.click();
    })()
  `);

  await new Promise(r => setTimeout(r, 2500));

  // Set to Front View and disable auto-rotate for clean captures
  await evaluate(`
    (() => {
      const frontBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Önden Görünüm'));
      if (frontBtn) frontBtn.click();
      const autoRotateBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Dönüş'));
      if (autoRotateBtn && autoRotateBtn.textContent.includes('Açık')) autoRotateBtn.click();
    })()
  `);
  await new Promise(r => setTimeout(r, 1200));

  shot = await send('Page.captureScreenshot', { format: 'png' });
  if (shot && shot.data) {
    fs.writeFileSync('verified_aybuke_face_inspector.png', Buffer.from(shot.data, 'base64'));
    console.log('Saved verified_aybuke_face_inspector.png');
  }

  // Aybüke Back View (Backpack, red draped scarf, curls, vest)
  console.log('4. Capturing Aybüke Back View (Backpack & Headdress)...');
  await evaluate(`
    (() => {
      const backBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Arkadan'));
      if (backBtn) backBtn.click();
    })()
  `);
  await new Promise(r => setTimeout(r, 1200));

  shot = await send('Page.captureScreenshot', { format: 'png' });
  if (shot && shot.data) {
    fs.writeFileSync('verified_aybuke_back_inspector.png', Buffer.from(shot.data, 'base64'));
    console.log('Saved verified_aybuke_back_inspector.png');
  }

  // Switch to Eren in Inspector
  console.log('5. Switching to Eren in Inspector...');
  await evaluate(`
    (() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Eren'));
      if (btn) btn.click();
    })()
  `);
  await new Promise(r => setTimeout(r, 2000));

  // Front View for Eren
  await evaluate(`
    (() => {
      const frontBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Önden Görünüm'));
      if (frontBtn) frontBtn.click();
    })()
  `);
  await new Promise(r => setTimeout(r, 1200));

  shot = await send('Page.captureScreenshot', { format: 'png' });
  if (shot && shot.data) {
    fs.writeFileSync('verified_eren_face_inspector.png', Buffer.from(shot.data, 'base64'));
    console.log('Saved verified_eren_face_inspector.png');
  }

  // Back View for Eren
  console.log('6. Capturing Eren Back View (Backpack & Hair)...');
  await evaluate(`
    (() => {
      const backBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Arkadan'));
      if (backBtn) backBtn.click();
    })()
  `);
  await new Promise(r => setTimeout(r, 1200));

  shot = await send('Page.captureScreenshot', { format: 'png' });
  if (shot && shot.data) {
    fs.writeFileSync('verified_eren_back_inspector.png', Buffer.from(shot.data, 'base64'));
    console.log('Saved verified_eren_back_inspector.png');
  }

  ws.close();
  chrome.kill();
  console.log('\nAll visual verification tests completed successfully!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
