const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

async function testFullscreen() {
  const artifactDir = 'C:\\Users\\my pc\\.gemini\\antigravity\\brain\\03f413f9-7691-4ee7-91af-b86ce64f3df4';
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9245;

  console.log('Launching headless Chrome on port ' + port);
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=' + port,
    '--disable-gpu',
    '--window-size=1280,720',
    'http://localhost:5173/'
  ]);

  await new Promise(r => setTimeout(r, 2500));

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

  async function evaluate(exp) {
    const res = await send('Runtime.evaluate', { expression: exp, returnByValue: true, awaitPromise: true });
    return res && res.result ? res.result.value : null;
  }

  async function takeScreenshot(fileName) {
    const shot = await send('Page.captureScreenshot', { format: 'png' });
    if (shot && shot.data) {
      fs.writeFileSync(`${artifactDir}\\${fileName}`, Buffer.from(shot.data, 'base64'));
      console.log('Saved:', fileName);
    }
  }

  await new Promise(r => setTimeout(r, 2000));
  await takeScreenshot('fullscreen_menu_initial.png');

  // Click Eren
  await evaluate(`
    const eren = document.querySelector('button[aria-label="Eren Karakterini Seç"]');
    if (eren) eren.click();
  `);
  await new Promise(r => setTimeout(r, 800));
  await takeScreenshot('fullscreen_menu_eren_selected.png');

  // Click Aybuke
  await evaluate(`
    const aybuke = document.querySelector('button[aria-label="Aybüke Karakterini Seç"]');
    if (aybuke) aybuke.click();
  `);
  await new Promise(r => setTimeout(r, 800));
  await takeScreenshot('fullscreen_menu_aybuke_selected.png');

  ws.close();
  chrome.kill();
  process.exit(0);
}

testFullscreen().catch(err => {
  console.error(err);
  process.exit(1);
});
