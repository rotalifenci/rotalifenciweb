const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const ARTIFACT_DIR = 'C:\\Users\\my pc\\.gemini\\antigravity\\brain\\03f413f9-7691-4ee7-91af-b86ce64f3df4';
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const cdpPort = 9265;
const previewPort = 4173;

async function run() {
  console.log('🚀 Spawning Vite preview on port ' + previewPort + '...');
  const server = spawn('npx.cmd', ['vite', 'preview', '--port', String(previewPort), '--strictPort'], {
    shell: true
  });

  server.stdout.on('data', d => console.log('[Vite Preview]:', d.toString().trim()));
  server.stderr.on('data', d => console.error('[Vite Preview Err]:', d.toString().trim()));

  // Wait for preview server to be responsive
  let serverReady = false;
  for (let i = 0; i < 20; i++) {
    try {
      await new Promise((res, rej) => {
        const req = http.get(`http://127.0.0.1:${previewPort}/`, r => {
          if (r.statusCode === 200) res(true);
          else rej(new Error('Status ' + r.statusCode));
        });
        req.on('error', rej);
      });
      serverReady = true;
      break;
    } catch {
      await new Promise(r => setTimeout(r, 500));
    }
  }

  if (!serverReady) {
    console.error('❌ Failed to connect to Vite preview server!');
    server.kill();
    return;
  }
  console.log('✅ Vite preview server ready!');

  console.log('🚀 Launching headless Chrome...');
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=' + cdpPort,
    '--disable-gpu',
    '--window-size=1920,1080',
    `http://127.0.0.1:${previewPort}/`
  ]);

  try {
    await new Promise(r => setTimeout(r, 2000));

    let jsonStr = '';
    for (let i = 0; i < 15; i++) {
      try {
        jsonStr = await new Promise((res, rej) => {
          const req = http.get(`http://127.0.0.1:${cdpPort}/json`, r => {
            let d = '';
            r.on('data', c => d += c);
            r.on('end', () => res(d));
          });
          req.on('error', rej);
        });
        if (jsonStr) break;
      } catch {
        await new Promise(r => setTimeout(r, 400));
      }
    }

    const pages = JSON.parse(jsonStr);
    const target = pages.find(p => p.url.includes(String(previewPort))) || pages[0];
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

    ws.onmessage = evt => {
      const msg = JSON.parse(evt.data);
      if (msg.id && pending.has(msg.id)) {
        const res = pending.get(msg.id);
        pending.delete(msg.id);
        res(msg.result);
      }
    };

    await send('Page.enable');
    await send('Runtime.enable');

    // 1. Desktop 1920x1080 Main Menu
    console.log('1️⃣ Desktop 1920x1080 Main Menu...');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1,
      mobile: false
    });
    await new Promise(r => setTimeout(r, 2000));
    let shot = await send('Page.captureScreenshot');
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'resp_01_desktop_mainmenu.png'), Buffer.from(shot.data, 'base64'));
    console.log('Saved resp_01_desktop_mainmenu.png');

    // Click Eren Hotzone (centered in Eren's card on the left side)
    console.log('Clicking Eren hotzone (400, 540)...');
    await send('Input.dispatchMouseEvent', {
      type: 'mousePressed',
      x: 350,
      y: 500,
      button: 'left',
      clickCount: 1
    });
    await send('Input.dispatchMouseEvent', {
      type: 'mouseReleased',
      x: 350,
      y: 500,
      button: 'left',
      clickCount: 1
    });
    await new Promise(r => setTimeout(r, 1000));
    shot = await send('Page.captureScreenshot');
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'resp_02_desktop_eren_selected.png'), Buffer.from(shot.data, 'base64'));
    console.log('Saved resp_02_desktop_eren_selected.png');

    // 2. Mobile 390x844 Main Menu
    console.log('2️⃣ Mobile 390x844 Main Menu...');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true
    });
    await new Promise(r => setTimeout(r, 1500));
    shot = await send('Page.captureScreenshot');
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'resp_03_mobile_mainmenu.png'), Buffer.from(shot.data, 'base64'));
    console.log('Saved resp_03_mobile_mainmenu.png');

    // 3. Mobile 390x844 Gameplay: VERIFY NO AUDIO OVERLAP WITH ACTION BUTTONS
    console.log('3️⃣ Mobile 390x844 Gameplay: launching 3D game...');
    await send('Runtime.evaluate', {
      expression: 'if (typeof window.__launchGame === "function") window.__launchGame();'
    });
    await new Promise(r => setTimeout(r, 3000));
    shot = await send('Page.captureScreenshot');
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'resp_04_mobile_gameplay_no_overlap.png'), Buffer.from(shot.data, 'base64'));
    console.log('Saved resp_04_mobile_gameplay_no_overlap.png');

    // 4. Smartboard D-Pad Mode on 1920x1080
    console.log('4️⃣ Testing Smartboard D-Pad Mode on 1920x1080...');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1,
      mobile: false
    });
    // Launch timeline hub
    await send('Runtime.evaluate', {
      expression: 'if (typeof window.__launchTimeline === "function") window.__launchTimeline();'
    });
    await new Promise(r => setTimeout(r, 2500));

    // Click Tahta D-Pad toggle button
    await send('Runtime.evaluate', {
      expression: `
        const btn = Array.from(document.querySelectorAll('button')).find(b => (b.title && b.title.includes('Akıllı Tahta')) || b.textContent.includes('Tahta D-Pad'));
        if (btn) btn.click();
      `
    });
    await new Promise(r => setTimeout(r, 1200));
    shot = await send('Page.captureScreenshot');
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'resp_05_smartboard_dpad_mode.png'), Buffer.from(shot.data, 'base64'));
    console.log('Saved resp_05_smartboard_dpad_mode.png');

    // 5. Open Settings Modal
    console.log('5️⃣ Testing Settings Modal...');
    await send('Runtime.evaluate', {
      expression: `
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.title && b.title.includes('Grafik'));
        if (btn) btn.click();
      `
    });
    await new Promise(r => setTimeout(r, 1000));
    shot = await send('Page.captureScreenshot');
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'resp_06_settings_smartboard_modal.png'), Buffer.from(shot.data, 'base64'));
    console.log('Saved resp_06_settings_smartboard_modal.png');

    console.log('🎉 ALL SCREENSHOTS CAPTURED SUCCESSFULLY!');
    ws.close();
  } catch (err) {
    console.error('Test error:', err);
  } finally {
    chrome.kill();
    server.kill();
  }
}

run();
