const http = require('http');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

async function verify() {
  const artifactDir = 'C:\\Users\\my pc\\.gemini\\antigravity\\brain\\03f413f9-7691-4ee7-91af-b86ce64f3df4';
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9236;

  console.log('Launching headless Chrome on port ' + port + '...');
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=' + port,
    '--disable-gpu',
    '--window-size=1280,720',
    'http://localhost:5173/'
  ]);

  await new Promise(r => setTimeout(r, 3000));

  let jsonStr = '';
  for (let retry = 0; retry < 15; retry++) {
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
      if (jsonStr && jsonStr.trim().startsWith('[')) {
        console.log(`Connected to Chrome debugging port on attempt ${retry + 1}`);
        break;
      }
    } catch (err) {
      await new Promise(r => setTimeout(r, 500));
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
    const buf = Buffer.from(res.data, 'base64');
    const outPath = path.join(artifactDir, fileName);
    fs.writeFileSync(outPath, buf);
    console.log(`Saved screenshot: ${fileName}`);
  }

  async function evaluate(expr) {
    const res = await send('Runtime.evaluate', { expression: expr, returnByValue: true });
    return res && res.result ? res.result.value : null;
  }

  console.log('--- Step 1: Capture Main Menu with New Eren ---');
  await sleep(2500);
  await takeScreenshot('verified_new_main_menu.png');

  console.log('--- Step 2: Launch 3D Timeline Hub with New Eren ---');
  await evaluate(`
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('BAŞLA'));
    if (btn) btn.click();
    else if (window.__launchTimeline) window.__launchTimeline();
  `);
  await sleep(4000);

  // Front camera view of new Eren
  await evaluate(`
    if (window.__setTimelineCameraAngle) window.__setTimelineCameraAngle(Math.PI, 0.12);
  `);
  await sleep(1500);
  await takeScreenshot('verified_new_eren_3d_front.png');

  console.log('--- Step 3: Animate Walking with New Eren ---');
  // Reset camera to 3/4 angle
  await evaluate(`
    if (window.__setTimelineCameraAngle) window.__setTimelineCameraAngle(Math.PI * 0.85, 0.18);
  `);
  await evaluate(`
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'w', code: 'KeyW', bubbles: true }));
  `);
  await sleep(1800);
  await takeScreenshot('verified_new_eren_3d_walking.png');
  await evaluate(`
    window.dispatchEvent(new KeyboardEvent('keyup', { key: 'w', code: 'KeyW', bubbles: true }));
  `);
  await sleep(800);

  console.log('--- Step 4: Enter Historical Scene (Year 571) ---');
  await evaluate(`
    if (window.__launchYear) window.__launchYear(571);
  `);
  await sleep(3500);
  await takeScreenshot('verified_new_eren_in_historical_scene.png');

  console.log('Verification finished successfully!');
  chrome.kill();
  process.exit(0);
}

verify().catch(e => {
  console.error('Error during verification:', e);
  process.exit(1);
});
