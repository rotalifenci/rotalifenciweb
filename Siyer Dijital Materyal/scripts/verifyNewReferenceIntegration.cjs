const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

async function verifyIntegration() {
  const artifactDir = 'C:\\Users\\my pc\\.gemini\\antigravity\\brain\\03f413f9-7691-4ee7-91af-b86ce64f3df4';
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9876;
  const tempProfile = path.join(process.env.TEMP || 'C:\\Windows\\Temp', 'chrome_cdp_profile_' + Date.now());

  console.log('Launching headless Chrome to verify Eren & Aybüke integration against new references...');
  const chrome = spawn(chromePath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${tempProfile}`,
    '--disable-gpu',
    '--window-size=1280,720',
    'http://localhost:5173/'
  ]);

  await new Promise(r => setTimeout(r, 4500));

  let jsonStr = '';
  for (let retry = 0; retry < 25; retry++) {
    try {
      jsonStr = await new Promise((resolve, reject) => {
        const req = http.get(`http://127.0.0.1:${port}/json`, res => {
          let data = '';
          res.on('data', chunk => data += chunk);
          res.on('end', () => resolve(data));
        });
        req.on('error', reject);
        req.setTimeout(2000, () => { req.destroy(); reject(new Error('timeout')); });
      });
      if (jsonStr && jsonStr.trim().startsWith('[')) break;
    } catch {
      await new Promise(r => setTimeout(r, 1000));
    }
  }

  if (!jsonStr || !jsonStr.trim().startsWith('[')) {
    throw new Error('Failed to retrieve targets from Chrome CDP: ' + jsonStr);
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

  // 1. MAIN MENU CHARACTER SELECTION
  console.log('1. Capturing Main Menu Character Selection screen...');
  await sleep(2500);
  await takeScreenshot('verified_menu_character_selection.png');

  // 2. OPEN MODEL INSPECTOR FOR EREN
  console.log('2. Opening Model Inspector for Eren...');
  await send('Runtime.evaluate', {
    expression: `
      // Click on "3D Karakter İncele" button
      const btns = Array.from(document.querySelectorAll('button'));
      const inspectBtn = btns.find(b => b.textContent && b.textContent.includes('3D Karakter İncele'));
      if (inspectBtn) inspectBtn.click();
    `
  });
  await sleep(3000);

  // 2a. Eren Front View Side-by-Side
  console.log('2a. Eren Front View with Reference...');
  await takeScreenshot('verified_eren_inspector_front.png');

  // 2b. Eren 45 Degree View
  console.log('2b. Eren 45° Angle View...');
  await send('Runtime.evaluate', {
    expression: `
      const btns = Array.from(document.querySelectorAll('button'));
      const isoBtn = btns.find(b => b.textContent && b.textContent.includes('45°'));
      if (isoBtn) isoBtn.click();
    `
  });
  await sleep(1500);
  await takeScreenshot('verified_eren_inspector_45deg.png');

  // 2c. Eren Back View (Backpack & gear)
  console.log('2c. Eren Back View (Backpack)...');
  await send('Runtime.evaluate', {
    expression: `
      const btns = Array.from(document.querySelectorAll('button'));
      const backBtn = btns.find(b => b.textContent && b.textContent.includes('Arka Görünüm'));
      if (backBtn) backBtn.click();
    `
  });
  await sleep(1500);
  await takeScreenshot('verified_eren_inspector_back.png');

  // 3. SWITCH INSPECTOR TO AYBÜKE
  console.log('3. Switching Inspector to Aybüke...');
  await send('Runtime.evaluate', {
    expression: `
      const aybukeBtn = document.querySelector('[data-char-tab="aybuke"]');
      if (aybukeBtn) aybukeBtn.click();
    `
  });
  await sleep(3000);

  // 3a. Aybüke Front View Side-by-Side
  console.log('3a. Aybüke Front View with Reference...');
  await send('Runtime.evaluate', {
    expression: `
      const btns = Array.from(document.querySelectorAll('button'));
      const frontBtn = btns.find(b => b.textContent && b.textContent.includes('Önden Görünüm'));
      if (frontBtn) frontBtn.click();
    `
  });
  await sleep(1500);
  await takeScreenshot('verified_aybuke_inspector_front.png');

  // 3b. Aybüke 45 Degree View
  console.log('3b. Aybüke 45° Angle View...');
  await send('Runtime.evaluate', {
    expression: `
      const btns = Array.from(document.querySelectorAll('button'));
      const isoBtn = btns.find(b => b.textContent && b.textContent.includes('45°'));
      if (isoBtn) isoBtn.click();
    `
  });
  await sleep(1500);
  await takeScreenshot('verified_aybuke_inspector_45deg.png');

  // 3c. Aybüke Back View (Backpack & headscarf drape)
  console.log('3c. Aybüke Back View (Backpack & Drape)...');
  await send('Runtime.evaluate', {
    expression: `
      const btns = Array.from(document.querySelectorAll('button'));
      const backBtn = btns.find(b => b.textContent && b.textContent.includes('Arka Görünüm'));
      if (backBtn) backBtn.click();
    `
  });
  await sleep(1500);
  await takeScreenshot('verified_aybuke_inspector_back.png');

  // 4. GAMEPLAY VIEW WITH AYBÜKE
  console.log('4. Navigating to Gameplay with Aybüke in 571 Mecca...');
  await send('Page.navigate', { url: 'http://localhost:5173/?screen=game_3d&char=aybuke' });
  await sleep(4000);
  await takeScreenshot('verified_aybuke_gameplay_3d.png');

  // Orbit camera in front of Aybüke in gameplay
  await send('Runtime.evaluate', {
    expression: `
      window.__forceFrontView = true;
      const dbg = window.__debugGame;
      if (dbg) {
        dbg.cameraDistance = 3.2;
        dbg.cameraAngleV = 0.16;
      }
    `
  });
  await sleep(1500);
  await takeScreenshot('verified_aybuke_gameplay_front.png');

  // 5. GAMEPLAY VIEW WITH EREN
  console.log('5. Navigating to Gameplay with Eren in 571 Mecca...');
  await send('Page.navigate', { url: 'http://localhost:5173/?screen=game_3d&char=eren' });
  await sleep(4000);
  await takeScreenshot('verified_eren_gameplay_3d.png');

  // Orbit camera in front of Eren in gameplay
  await send('Runtime.evaluate', {
    expression: `
      window.__forceFrontView = true;
      const dbg = window.__debugGame;
      if (dbg) {
        dbg.cameraDistance = 3.2;
        dbg.cameraAngleV = 0.16;
      }
    `
  });
  await sleep(1500);
  await takeScreenshot('verified_eren_gameplay_front.png');

  console.log('All verification captures completed successfully!');
  chrome.kill();
  process.exit(0);
}

verifyIntegration().catch(e => {
  console.error(e);
  process.exit(1);
});
