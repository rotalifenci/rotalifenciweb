const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

async function verifyAll() {
  const artifactDir = 'C:\\Users\\my pc\\.gemini\\antigravity\\brain\\03f413f9-7691-4ee7-91af-b86ce64f3df4';
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9260;

  console.log('Launching headless Chrome to verify characters, ground, and 3D mountains...');
  const chrome = spawn(chromePath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--disable-gpu',
    '--window-size=1280,720',
    'http://localhost:5173/?screen=game_3d&char=aybuke'
  ]);

  await new Promise(r => setTimeout(r, 2500));

  let jsonStr = '';
  for (let retry = 0; retry < 5; retry++) {
    try {
      jsonStr = await new Promise((resolve, reject) => {
        http.get(`http://127.0.0.1:${port}/json`, res => {
          let data = '';
          res.on('data', chunk => data += chunk);
          res.on('end', () => resolve(data));
        }).on('error', reject);
      });
      break;
    } catch {
      await new Promise(r => setTimeout(r, 800));
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

  // 1. AYBÜKE IN GAMEPLAY (facing Kaaba, realistic mountains, smooth ground)
  await sleep(2500);
  console.log('1. Capturing Aybuke gameplay & realistic mountains...');
  await takeScreenshot('final_aybuke_gameplay_3d.png');

  // 2. AYBÜKE FRONT VIEW & CLOSEUP (Setting camera in front)
  console.log('2. Orbiting camera to view Aybuke face from front...');
  await send('Runtime.evaluate', {
    expression: `
      window.__forceFrontView = true;
      const dbg = window.__debugGame;
      if (dbg) {
        dbg.cameraDistance = 3.6;
        dbg.cameraAngleV = 0.16;
      }
    `
  });
  await sleep(600);
  await takeScreenshot('final_aybuke_front_face_view.png');

  // Close-up on Aybüke smiling face & headdress
  await send('Runtime.evaluate', {
    expression: `
      window.__forceFrontView = true;
      const dbg = window.__debugGame;
      if (dbg) {
        dbg.cameraDistance = 1.9;
        dbg.cameraAngleV = 0.08;
      }
    `
  });
  await sleep(600);
  await takeScreenshot('final_aybuke_face_closeup.png');

  // 3. EREN IN GAMEPLAY
  console.log('3. Navigating to Eren...');
  await send('Page.navigate', { url: 'http://localhost:5173/?screen=game_3d&char=eren' });
  await sleep(2500);
  await takeScreenshot('final_eren_gameplay_3d.png');

  // 4. EREN FRONT VIEW & CLOSEUP
  console.log('4. Orbiting camera to view Eren from front...');
  await send('Runtime.evaluate', {
    expression: `
      window.__forceFrontView = true;
      const dbg = window.__debugGame;
      if (dbg) {
        dbg.cameraDistance = 3.6;
        dbg.cameraAngleV = 0.16;
      }
    `
  });
  await sleep(600);
  await takeScreenshot('final_eren_front_face_view.png');

  await send('Runtime.evaluate', {
    expression: `
      window.__forceFrontView = true;
      const dbg = window.__debugGame;
      if (dbg) {
        dbg.cameraDistance = 1.9;
        dbg.cameraAngleV = 0.08;
      }
    `
  });
  await sleep(600);
  await takeScreenshot('final_eren_face_closeup.png');

  // 5. PANORAMIC 3D MOUNTAIN VISTAS (East and West)
  console.log('5. Capturing 3D Mountain Massifs (East and West)...');
  await send('Runtime.evaluate', {
    expression: `
      const dbg = window.__debugGame;
      if (dbg) {
        dbg.cameraAngleH = Math.PI * 0.5; // Look East at Jabal Abu Qubays
        dbg.cameraDistance = 7.5;
        dbg.cameraAngleV = 0.22;
      }
    `
  });
  await sleep(600);
  await takeScreenshot('final_mecca_jabal_abu_qubays.png');

  await send('Runtime.evaluate', {
    expression: `
      const dbg = window.__debugGame;
      if (dbg) {
        dbg.cameraAngleH = -Math.PI * 0.5; // Look West at Jabal Qu'ayqi'an
        dbg.cameraDistance = 7.5;
        dbg.cameraAngleV = 0.22;
      }
    `
  });
  await sleep(600);
  await takeScreenshot('final_mecca_jabal_quayqian.png');

  console.log('All final verification captures completed!');
  chrome.kill();
  process.exit(0);
}

verifyAll().catch(e => {
  console.error(e);
  process.exit(1);
});
