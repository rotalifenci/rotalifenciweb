const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

async function main() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9230',
    '--disable-gpu',
    '--window-size=1280,720',
    'http://localhost:5173/'
  ]);

  await new Promise(r => setTimeout(r, 2500));

  const jsonStr = await new Promise((resolve, reject) => {
    http.get('http://127.0.0.1:9230/json', res => {
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

  console.log('Setting character to aybuke in dijital_siyer_progress_v1...');
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
  console.log('Clicking "Başla" for Aybüke...');
  await evaluate(`Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Başla'))?.click()`);

  await new Promise(r => setTimeout(r, 2600));

  // Screenshot initial spawn in Mecca
  let shot = await send('Page.captureScreenshot', { format: 'png' });
  if (shot && shot.data) {
    fs.writeFileSync('mecca_aybuke_verified_final.png', Buffer.from(shot.data, 'base64'));
    console.log('Saved mecca_aybuke_verified_final.png');
  }

  // Inspect character
  const charDetails = await evaluate(`
    (() => {
      const dbg = window.__debugGame;
      if (!dbg || !dbg.char) return { error: 'No debug char' };

      let hasBook = false;
      let hasBackpack = false;
      let leftHandCount = 0;
      let rightHandCount = 0;

      dbg.char.group.traverse(obj => {
        if (obj.name === 'LeftHand') {
          leftHandCount = obj.children.length;
        }
        if (obj.name === 'RightHand') {
          rightHandCount = obj.children.length;
        }
        if (obj.isMesh && obj.geometry && obj.geometry.parameters) {
          const p = obj.geometry.parameters;
          // Book dimensions in old script: 0.15 x 0.20
          if (p.width === 0.15 && p.height === 0.20) hasBook = true;
          // Backpack dimensions in new script: 0.23 x 0.27
          if (p.width === 0.23 && p.height === 0.27) hasBackpack = true;
        }
      });

      return {
        characterType: dbg.char.type,
        hasBook,
        hasBackpack,
        leftHandCount,
        rightHandCount,
        posY: dbg.playerPos.y,
        currentAction: dbg.char.currentActionName
      };
    })()
  `);
  console.log('AYBÜKE CHARACTER DETAILS:', JSON.stringify(charDetails, null, 2));

  // Click "Koş" button
  console.log('Toggling Sprint...');
  await evaluate(`
    (() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('KOŞ'));
      if (btn) btn.click();
    })()
  `);

  await new Promise(r => setTimeout(r, 300));

  // Run forward with Aybüke
  console.log('Running forward with Aybüke...');
  await send('Input.dispatchKeyEvent', { type: 'keyDown', code: 'KeyW', key: 'w' });
  await new Promise(r => setTimeout(r, 1000));

  const runDetails = await evaluate(`
    (() => {
      const dbg = window.__debugGame;
      return {
        currentAction: dbg.char.currentActionName,
        posZ: dbg.playerPos.z,
        posY: dbg.playerPos.y
      };
    })()
  `);
  console.log('AYBÜKE RUNNING:', JSON.stringify(runDetails, null, 2));

  shot = await send('Page.captureScreenshot', { format: 'png' });
  if (shot && shot.data) {
    fs.writeFileSync('mecca_aybuke_running_final.png', Buffer.from(shot.data, 'base64'));
    console.log('Saved mecca_aybuke_running_final.png');
  }

  await send('Input.dispatchKeyEvent', { type: 'keyUp', code: 'KeyW', key: 'w' });

  // Test automatic camera rotation when Aybüke turns left
  console.log('Turning Left with Aybüke (A key)...');
  await send('Input.dispatchKeyEvent', { type: 'keyDown', code: 'KeyA', key: 'a' });
  await new Promise(r => setTimeout(r, 1200));
  await send('Input.dispatchKeyEvent', { type: 'keyUp', code: 'KeyA', key: 'a' });
  await new Promise(r => setTimeout(r, 500));

  const turnDetails = await evaluate(`
    (() => {
      const dbg = window.__debugGame;
      return {
        camX: dbg.camera.position.x,
        camZ: dbg.camera.position.z,
        headingY: dbg.char.group.rotation.y
      };
    })()
  `);
  console.log('AYBÜKE TURNED (Camera auto-followed):', turnDetails);

  shot = await send('Page.captureScreenshot', { format: 'png' });
  if (shot && shot.data) {
    fs.writeFileSync('mecca_aybuke_turned_final.png', Buffer.from(shot.data, 'base64'));
    console.log('Saved mecca_aybuke_turned_final.png');
  }

  // Open 360 Model Inspector to capture front view of Aybüke
  console.log('Opening Model Inspector for Aybüke 360 view...');
  await evaluate(`
    (() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('3D İncele'));
      if (btn) btn.click();
    })()
  `);

  await new Promise(r => setTimeout(r, 2000));

  shot = await send('Page.captureScreenshot', { format: 'png' });
  if (shot && shot.data) {
    fs.writeFileSync('aybuke_inspector_final.png', Buffer.from(shot.data, 'base64'));
    console.log('Saved aybuke_inspector_final.png');
  }

  ws.close();
  chrome.kill();
  console.log('Aybüke verification finished successfully!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
