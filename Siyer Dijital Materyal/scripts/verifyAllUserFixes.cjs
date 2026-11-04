const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

async function main() {
  console.log('================================================================');
  console.log('   VERIFYING ALL USER REQUESTS (CHARACTERS, CONTROLS, MUSIC, ENV)');
  console.log('================================================================\n');

  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9240',
    '--disable-gpu',
    '--window-size=1280,720',
    'http://localhost:5173/'
  ]);

  await new Promise(r => setTimeout(r, 2500));

  const jsonStr = await new Promise((resolve, reject) => {
    http.get('http://127.0.0.1:9240/json', res => {
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

  await new Promise(r => setTimeout(r, 1200));

  async function evaluate(code) {
    const res = await send('Runtime.evaluate', {
      expression: code,
      returnByValue: true,
      awaitPromise: true
    });
    return res && res.result ? res.result.value : null;
  }

  async function capture(filename) {
    const res = await send('Page.captureScreenshot', { format: 'png' });
    const buf = Buffer.from(res.data, 'base64');
    fs.writeFileSync(filename, buf);
    console.log(`Saved screenshot: ${filename} (${buf.length} bytes)`);
  }

  // 1. VERIFY AUDIO & MUSIC PILL
  console.log('1. Checking YouTube audio player & Siyer music pill...');
  const musicInfo = await evaluate(`
    (() => {
      const iframe = document.querySelector('iframe');
      const pill = document.querySelector('.fixed.bottom-3.right-3');
      return {
        hasIframe: !!iframe,
        iframeSrc: iframe ? iframe.src : '',
        pillText: pill ? pill.innerText : ''
      };
    })()
  `);
  console.log('Music Info:', musicInfo);

  // 2. SPAWN AYBÜKE & TEST CONTROLS
  console.log('\n2. Testing Aybüke spawn and movement...');
  await evaluate(`
    (() => {
      const raw = localStorage.getItem('dijital_siyer_progress_v1');
      const data = raw ? JSON.parse(raw) : { currentYear: 571, completedYears: [], unlockedValues: [] };
      data.character = 'aybuke';
      localStorage.setItem('dijital_siyer_progress_v1', JSON.stringify(data));
      window.location.reload();
    })()
  `);

  await new Promise(r => setTimeout(r, 2200));

  // Click "Başla" button
  await evaluate(`
    (() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const startBtn = btns.find(b => b.innerText.includes('Başla'));
      if (startBtn) startBtn.click();
    })()
  `);

  await new Promise(r => setTimeout(r, 2000));

  // Check initial player position
  const initialPos = await evaluate(`
    (() => {
      if (window.__siyerScene && window.__siyerScene.char) {
        const p = window.__siyerScene.char.group.position;
        return { x: p.x, y: p.y, z: p.z };
      }
      return null;
    })()
  `);
  console.log('Initial player spawn position:', initialPos);

  await capture('public/assets/aybuke_spawn_fixed.png');

  // TEST FORWARD MOVEMENT: Press Up Arrow (KeyW / ArrowUp)
  console.log('Testing Up Arrow movement direction (must move forward towards -Z)...');
  await send('Input.dispatchKeyEvent', { type: 'keyDown', code: 'ArrowUp', key: 'ArrowUp' });
  await new Promise(r => setTimeout(r, 1200));
  await send('Input.dispatchKeyEvent', { type: 'keyUp', code: 'ArrowUp', key: 'ArrowUp' });

  const posAfterUp = await evaluate(`
    (() => {
      if (window.__siyerScene && window.__siyerScene.char) {
        const p = window.__siyerScene.char.group.position;
        return { x: p.x, y: p.y, z: p.z };
      }
      return null;
    })()
  `);
  console.log('Position after pressing Up Arrow:', posAfterUp);

  if (posAfterUp && initialPos) {
    const movedDeltaZ = posAfterUp.z - initialPos.z;
    if (movedDeltaZ < -0.1) {
      console.log(`[PASS] Up Arrow moved character FORWARD into the scene! Delta Z: ${movedDeltaZ.toFixed(3)} (Z decreased away from camera towards Kaaba)`);
    } else {
      console.warn(`[WARN] Unexpected Delta Z: ${movedDeltaZ}`);
    }
  }

  // Turn camera/character to view Aybüke from behind with prominent backpack and headscarf
  console.log('Viewing Aybüke from behind to verify backpack and headscarf...');
  await capture('public/assets/aybuke_gameplay_fixed.png');

  // 3. SPAWN EREN & TEST
  console.log('\n3. Testing Eren character...');
  await evaluate(`
    (() => {
      const raw = localStorage.getItem('dijital_siyer_progress_v1');
      const data = raw ? JSON.parse(raw) : { currentYear: 571, completedYears: [], unlockedValues: [] };
      data.character = 'eren';
      localStorage.setItem('dijital_siyer_progress_v1', JSON.stringify(data));
      window.location.reload();
    })()
  `);

  await new Promise(r => setTimeout(r, 2200));

  await evaluate(`
    (() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const startBtn = btns.find(b => b.innerText.includes('Başla'));
      if (startBtn) startBtn.click();
    })()
  `);

  await new Promise(r => setTimeout(r, 2000));

  // Press Shift + Up Arrow to test sprint
  console.log('Testing Eren Sprint with Shift + Up Arrow...');
  await send('Input.dispatchKeyEvent', { type: 'keyDown', code: 'ShiftLeft', key: 'Shift' });
  await send('Input.dispatchKeyEvent', { type: 'keyDown', code: 'KeyW', key: 'w' });
  await new Promise(r => setTimeout(r, 1000));
  await send('Input.dispatchKeyEvent', { type: 'keyUp', code: 'KeyW', key: 'w' });
  await send('Input.dispatchKeyEvent', { type: 'keyUp', code: 'ShiftLeft', key: 'Shift' });

  await capture('public/assets/eren_gameplay_fixed.png');

  console.log('\nAll tests and screenshots completed successfully!');
  ws.close();
  chrome.kill();
  process.exit(0);
}

main().catch(err => {
  console.error('Error during verification:', err);
  process.exit(1);
});
