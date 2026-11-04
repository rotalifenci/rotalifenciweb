const http = require('http');
const { spawn } = require('child_process');
const fs = require('fs');

async function runVerification() {
  const artifactDir = 'C:\\Users\\my pc\\.gemini\\antigravity\\brain\\03f413f9-7691-4ee7-91af-b86ce64f3df4';
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9238;

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
  for (let i = 0; i < 15; i++) {
    try {
      jsonStr = await new Promise((res, rej) => {
        const req = http.get(`http://127.0.0.1:${port}/json`, r => {
          let d = '';
          r.on('data', c => d += c);
          r.on('end', () => res(d));
        });
        req.on('error', rej);
      });
      if (jsonStr) break;
    } catch {
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
      pending.get(res.id)(res.result);
      pending.delete(res.id);
    }
  };

  await send('Runtime.enable');
  await send('Page.enable');
  await send('DOM.enable');

  async function evaluate(exp) {
    const res = await send('Runtime.evaluate', { expression: exp, returnByValue: true });
    return res && res.result ? res.result.value : null;
  }

  async function takeScreenshot(fileName) {
    const shot = await send('Page.captureScreenshot', { format: 'png' });
    if (shot && shot.data) {
      fs.writeFileSync(`${artifactDir}\\${fileName}`, Buffer.from(shot.data, 'base64'));
      console.log('Saved:', fileName);
    }
  }

  const sleep = ms => new Promise(r => setTimeout(r, ms));

  console.log('--- TEST 1: Initial Page Load (Unselected) ---');
  await sleep(2500);
  await takeScreenshot('menu_test_01_initial_unselected.png');

  console.log('--- TEST 2: Click Başla Without Selecting (Expect Warning Toast) ---');
  await evaluate(`
    const basla = document.querySelector('button[aria-label="Oyuna Başla"]');
    if (basla) basla.click();
  `);
  await sleep(600);
  await takeScreenshot('menu_test_02_warning_shown.png');

  console.log('--- TEST 3: Click Eren (Expect Golden Glow & Eren Selected Pill) ---');
  await evaluate(`
    const eren = document.querySelector('button[aria-label="Eren Karakterini Seç"]');
    if (eren) eren.click();
  `);
  await sleep(800);
  await takeScreenshot('menu_test_03_eren_selected.png');

  console.log('--- TEST 4: Click Aybüke (Expect Switch to Aybüke) ---');
  await evaluate(`
    const aybuke = document.querySelector('button[aria-label="Aybüke Karakterini Seç"]');
    if (aybuke) aybuke.click();
  `);
  await sleep(800);
  await takeScreenshot('menu_test_04_aybuke_selected.png');

  console.log('--- TEST 5: Click Eren then Click Başla (Expect Transition to 3D Timeline Hub) ---');
  await evaluate(`
    const eren = document.querySelector('button[aria-label="Eren Karakterini Seç"]');
    if (eren) eren.click();
  `);
  await sleep(600);
  await evaluate(`
    const basla = document.querySelector('button[aria-label="Oyuna Başla"]');
    if (basla) basla.click();
  `);
  await sleep(4000);
  await takeScreenshot('menu_test_05_timeline_hub_launched_with_eren.png');

  console.log('--- TEST 6: Mobile Responsiveness (375x667) ---');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 375,
    height: 667,
    deviceScaleFactor: 2,
    mobile: true
  });
  await evaluate(`
    window.location.href = 'http://localhost:5173/';
  `);
  await sleep(3500);
  await evaluate(`
    const eren = document.querySelector('button[aria-label="Eren Karakterini Seç"]');
    if (eren) eren.click();
  `);
  await sleep(800);
  await takeScreenshot('menu_test_06_mobile_responsive_alignment.png');

  console.log('Verification completed successfully!');
  ws.close();
  chrome.kill();
  process.exit(0);
}

runVerification().catch(err => {
  console.error(err);
  process.exit(1);
});
