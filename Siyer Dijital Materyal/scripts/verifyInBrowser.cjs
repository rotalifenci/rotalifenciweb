const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

async function main() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9225',
    '--disable-gpu',
    '--window-size=1280,720',
    'http://localhost:5173/'
  ]);

  await new Promise(r => setTimeout(r, 2200));

  const jsonStr = await new Promise((resolve, reject) => {
    http.get('http://127.0.0.1:9225/json', res => {
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
    return;
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

  // Click "Başla" button
  console.log('Clicking "Başla" button...');
  await send('Runtime.evaluate', {
    expression: `Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Başla'))?.click()`
  });

  await new Promise(r => setTimeout(r, 2500));

  // Capture idle gameplay screenshot
  let shot = await send('Page.captureScreenshot', { format: 'png' });
  if (shot && shot.data) {
    fs.writeFileSync('verified_gameplay_3d.png', Buffer.from(shot.data, 'base64'));
    console.log('Saved verified_gameplay_3d.png');
  }

  // Walk forward with KeyW
  console.log('Walking forward with KeyW...');
  await send('Input.dispatchKeyEvent', { type: 'keyDown', code: 'KeyW', key: 'w' });
  await new Promise(r => setTimeout(r, 1200));

  shot = await send('Page.captureScreenshot', { format: 'png' });
  if (shot && shot.data) {
    fs.writeFileSync('verified_walking_3d.png', Buffer.from(shot.data, 'base64'));
    console.log('Saved verified_walking_3d.png');
  }

  // Sprint with Shift
  console.log('Sprinting forward with Shift...');
  await send('Input.dispatchKeyEvent', { type: 'keyDown', code: 'ShiftLeft', key: 'Shift' });
  await new Promise(r => setTimeout(r, 1000));

  shot = await send('Page.captureScreenshot', { format: 'png' });
  if (shot && shot.data) {
    fs.writeFileSync('verified_running_3d.png', Buffer.from(shot.data, 'base64'));
    console.log('Saved verified_running_3d.png');
  }

  // Release keys
  await send('Input.dispatchKeyEvent', { type: 'keyUp', code: 'ShiftLeft', key: 'Shift' });
  await send('Input.dispatchKeyEvent', { type: 'keyUp', code: 'KeyW', key: 'w' });

  // Get debug telemetry
  const telemetry = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const dbg = window.__debugGame;
        if (!dbg) return { error: 'No debugGame' };
        return {
          playerPos: { x: dbg.playerPos.x, y: dbg.playerPos.y, z: dbg.playerPos.z },
          cameraPos: { x: dbg.camera.position.x, y: dbg.camera.position.y, z: dbg.camera.position.z },
          currentAction: dbg.char.currentActionName,
          isLoaded: dbg.char.isLoaded
        };
      })()
    `,
    returnByValue: true
  });

  console.log('TELEMETRY AFTER MOVEMENT:', JSON.stringify(telemetry, null, 2));

  ws.close();
  chrome.kill();
}

main().catch(console.error);
