const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

async function main() {
  console.log('Starting visual verification of New Historical Mecca Environment...');

  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9255;
  const chrome = spawn(chromePath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--disable-gpu',
    '--window-size=1280,720',
    'http://localhost:5173/?screen=game_3d&char=eren'
  ]);

  await new Promise(r => setTimeout(r, 3000));

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
      await new Promise(r => setTimeout(r, 1000));
    }
  }

  if (!jsonStr) {
    console.error('Could not connect to Chrome CDP!');
    chrome.kill();
    process.exit(1);
  }

  const pages = JSON.parse(jsonStr);
  const target = pages.find(p => p.url.includes('5173')) || pages[0];
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

  ws.onmessage = e => {
    const res = JSON.parse(e.data);
    if (res.id && pending.has(res.id)) {
      const cb = pending.get(res.id);
      pending.delete(res.id);
      cb(res.result);
    }
  };

  await new Promise(resolve => (ws.onopen = resolve));
  await send('Page.enable');
  await send('Runtime.enable');

  // Helper: wait
  const sleep = ms => new Promise(r => setTimeout(r, ms));

  async function takeScreenshot(fileName) {
    const res = await send('Page.captureScreenshot', { format: 'png' });
    if (res && res.data) {
      const outPath = path.join(__dirname, '..', fileName);
      fs.writeFileSync(outPath, Buffer.from(res.data, 'base64'));
      console.log(`Saved screenshot: ${fileName}`);

      // Also copy to brain artifact dir
      const artifactDir = 'C:\\Users\\my pc\\.gemini\\antigravity\\brain\\03f413f9-7691-4ee7-91af-b86ce64f3df4';
      if (fs.existsSync(artifactDir)) {
        fs.writeFileSync(path.join(artifactDir, fileName), Buffer.from(res.data, 'base64'));
      }
    }
  }

  // 1. Initial view facing Kaaba and northern mountains
  await sleep(2500);
  console.log('1. Capturing in-game view facing Kaaba & historical buildings...');
  await takeScreenshot('verified_new_mecca_kaaba.png');

  // 2. High overview / wide landscape view
  console.log('2. Elevating camera for panoramic Mecca valley overview...');
  await send('Runtime.evaluate', {
    expression: `
      if (window.__debugGame && window.__debugGame.camera) {
        window.__debugGame.camera.position.set(0, 22, 28);
        window.__debugGame.camera.lookAt(0, 2, -10);
      }
    `
  });
  await sleep(1000);
  await takeScreenshot('verified_new_mecca_panoramic.png');

  // 3. View looking at Eastern Mountain (Jabal Abu Qubays) and residential quarter
  console.log('3. Looking at Eastern Mountain Massif (Jabal Abu Qubays) & Banu Hashim quarter...');
  await send('Runtime.evaluate', {
    expression: `
      if (window.__debugGame && window.__debugGame.camera) {
        window.__debugGame.camera.position.set(-8, 6, 8);
        window.__debugGame.camera.lookAt(45, 12, -5);
      }
    `
  });
  await sleep(1000);
  await takeScreenshot('verified_new_mecca_mountains_east.png');

  // 4. View of Western Mountain (Jabal Qu'ayqi'an) & Market Stalls
  console.log('4. Looking at Western Mountain (Jabal Qu\'ayqi\'an) & Market stalls...');
  await send('Runtime.evaluate', {
    expression: `
      if (window.__debugGame && window.__debugGame.camera) {
        window.__debugGame.camera.position.set(8, 5, 6);
        window.__debugGame.camera.lookAt(-45, 10, -5);
      }
    `
  });
  await sleep(1000);
  await takeScreenshot('verified_new_mecca_market_west.png');

  // 5. Kaaba close-up view showing plinth, basalt masonry, and Hatim
  console.log('5. Close-up view of Kaaba plinth, door, and Hatim...');
  await send('Runtime.evaluate', {
    expression: `
      if (window.__debugGame && window.__debugGame.camera) {
        window.__debugGame.camera.position.set(5, 3.2, -4);
        window.__debugGame.camera.lookAt(0, 3.0, -10);
      }
    `
  });
  await sleep(1000);
  await takeScreenshot('verified_new_mecca_kaaba_plinth_closeup.png');

  console.log('\nAll new Mecca environment verification screenshots captured successfully!');
  ws.close();
  chrome.kill();
  process.exit(0);
}

main().catch(err => {
  console.error('Error during verification:', err);
  process.exit(1);
});
