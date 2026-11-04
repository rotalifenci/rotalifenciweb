const http = require('http');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

async function verify() {
  const artifactDir = 'C:\\Users\\my pc\\.gemini\\antigravity\\brain\\03f413f9-7691-4ee7-91af-b86ce64f3df4';
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const tempProfile = path.join(process.env.TEMP || 'C:\\Windows\\Temp', 'chrome_vfy_' + Date.now());
  const port = 9666;

  console.log('Launching headless Chrome...');
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=' + port,
    '--user-data-dir=' + tempProfile,
    '--disable-gpu',
    '--window-size=1280,720',
    'http://localhost:5173/'
  ]);

  await new Promise(r => setTimeout(r, 4500));

  let jsonStr = '';
  for (let retry = 0; retry < 25; retry++) {
    try {
      jsonStr = await new Promise((res, rej) => {
        const req = http.get(`http://127.0.0.1:${port}/json`, r => {
          let d = '';
          r.on('data', c => d += c);
          r.on('end', () => res(d));
        });
        req.on('error', rej);
        req.setTimeout(2000, () => { req.destroy(); rej(new Error('timeout')); });
      });
      if (jsonStr && jsonStr.trim().startsWith('[')) break;
    } catch {
      await new Promise(r => setTimeout(r, 1000));
    }
  }

  const pages = JSON.parse(jsonStr);
  const target = pages.find(p => p.url.includes('5173')) || pages[0];
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  let msgId = 1;
  const pending = new Map();
  function send(method, params = {}) {
    return new Promise(resolve => {
      const id = msgId++;
      pending.set(id, resolve);
      ws.send(JSON.stringify({ id, method, params }));
    });
  }
  ws.onmessage = e => {
    const res = JSON.parse(e.data);
    if (res.id && pending.has(res.id)) {
      const cb = pending.get(res.id);
      pending.delete(res.id);
      cb(res.result);
    }
  };

  await send('Page.enable');
  await send('Runtime.enable');
  const sleep = ms => new Promise(r => setTimeout(r, ms));

  async function takeScreenshot(fileName) {
    const res = await send('Page.captureScreenshot', { format: 'png' });
    if (res && res.data) {
      const buf = Buffer.from(res.data, 'base64');
      fs.writeFileSync(path.join(__dirname, '..', fileName), buf);
      if (fs.existsSync(artifactDir)) {
        fs.writeFileSync(path.join(artifactDir, fileName), buf);
      }
      console.log(`Saved screenshot: ${fileName}`);
    }
  }

  // 1. Capture Main Menu Single Screen
  console.log('1. Capturing Main Menu Single Screen...');
  await sleep(2500);
  await takeScreenshot('verified_menu_single_screen.png');

  // 2. Select Aybüke on Main Menu
  console.log('2. Selecting Aybüke on Main Menu...');
  await send('Runtime.evaluate', {
    expression: `
      const aybukeEl = document.querySelector('[title="Aybüke\\'yi Seçmek İçin Tıkla"]');
      if (aybukeEl) aybukeEl.click();
    `
  });
  await sleep(1000);
  await takeScreenshot('verified_menu_aybuke_selected.png');

  // 3. Navigate into Gameplay with Eren
  console.log('3. Navigating to Gameplay with Eren...');
  await send('Page.navigate', { url: 'http://localhost:5173/?screen=game_3d&char=eren' });
  await sleep(3500);

  // Rotate camera to side/three-quarter view to clearly see the legs walking
  await send('Runtime.evaluate', {
    expression: `
      const dbg = window.__debugGame;
      if (dbg) {
        dbg.cameraAngleH = 0.85; // Side-angle view
        dbg.cameraAngleV = 0.18;
        dbg.cameraDistance = 4.2;
      }
    `
  });
  await sleep(1000);
  await takeScreenshot('verified_eren_idle_stance.png');

  // Press W to start walking and capture while walking
  console.log('4. Walking forward and capturing walking stride animation...');
  await send('Input.dispatchKeyEvent', { type: 'keyDown', code: 'KeyW', key: 'w', windowsVirtualKeyCode: 87 });
  await sleep(650);
  await takeScreenshot('verified_eren_walking_stride_1.png');
  await sleep(350);
  await takeScreenshot('verified_eren_walking_stride_2.png');
  await send('Input.dispatchKeyEvent', { type: 'keyUp', code: 'KeyW', key: 'w', windowsVirtualKeyCode: 87 });

  // 5. Navigate into Gameplay with Aybüke
  console.log('5. Navigating to Gameplay with Aybüke...');
  await send('Page.navigate', { url: 'http://localhost:5173/?screen=game_3d&char=aybuke' });
  await sleep(3500);

  await send('Runtime.evaluate', {
    expression: `
      const dbg = window.__debugGame;
      if (dbg) {
        dbg.cameraAngleH = 0.85;
        dbg.cameraAngleV = 0.18;
        dbg.cameraDistance = 4.2;
      }
    `
  });
  await sleep(1000);

  // Press W to walk with Aybüke
  console.log('6. Walking with Aybüke and capturing stride...');
  await send('Input.dispatchKeyEvent', { type: 'keyDown', code: 'KeyW', key: 'w', windowsVirtualKeyCode: 87 });
  await sleep(650);
  await takeScreenshot('verified_aybuke_walking_stride.png');
  await send('Input.dispatchKeyEvent', { type: 'keyUp', code: 'KeyW', key: 'w', windowsVirtualKeyCode: 87 });

  console.log('All verification captures completed successfully!');
  chrome.kill();
  process.exit(0);
}

verify().catch(e => {
  console.error(e);
  process.exit(1);
});
