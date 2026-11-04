const fs = require('fs');
const path = require('path');
const http = require('http');
const { spawn } = require('child_process');

async function main() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9244',
    '--disable-gpu',
    '--window-size=1280,720',
    'about:blank'
  ]);

  await new Promise(r => setTimeout(r, 1200));

  function getJson(urlPath) {
    return new Promise((res, rej) => {
      http.get(`http://127.0.0.1:9244${urlPath}`, (r) => {
        let d = '';
        r.on('data', c => d += c);
        r.on('end', () => res(JSON.parse(d)));
      }).on('error', rej);
    });
  }

  const targets = await getJson('/json');
  const target = targets.find(p => p.type === 'page') || targets[0];
  const wsUrl = target.webSocketDebuggerUrl;
  const ws = new WebSocket(wsUrl);
  await new Promise(res => ws.onopen = res);

  let id = 1;
  const pending = new Map();
  ws.onmessage = (e) => {
    const msg = JSON.parse(e.data);
    if (msg.id && pending.has(msg.id)) {
      pending.get(msg.id)(msg.result);
      pending.delete(msg.id);
    }
  };

  function send(method, params = {}) {
    return new Promise((res) => {
      const curId = id++;
      pending.set(curId, res);
      ws.send(JSON.stringify({ id: curId, method, params }));
    });
  }

  await send('Page.enable');
  await send('Runtime.enable');

  // 1. AYBÜKE GAMEPLAY
  console.log('Navigating to Aybuke 3D gameplay...');
  await send('Page.navigate', { url: 'http://localhost:5173/?screen=game_3d&char=aybuke' });
  await new Promise(r => setTimeout(r, 2500));

  let shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('aybuke_gameplay_clean.png', Buffer.from(shot.data, 'base64'));
  console.log('Saved aybuke_gameplay_clean.png');

  // Turn Aybüke around 180 degrees to face camera
  console.log('Turning Aybüke around to face the camera...');
  await send('Runtime.evaluate', {
    expression: `
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 's', code: 'KeyS', bubbles: true }));
    `
  });
  await new Promise(r => setTimeout(r, 800));
  await send('Runtime.evaluate', {
    expression: `
      window.dispatchEvent(new KeyboardEvent('keyup', { key: 's', code: 'KeyS', bubbles: true }));
    `
  });
  await new Promise(r => setTimeout(r, 600));

  shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('aybuke_front_clean.png', Buffer.from(shot.data, 'base64'));
  console.log('Saved aybuke_front_clean.png');

  // 2. EREN GAMEPLAY
  console.log('Navigating to Eren 3D gameplay...');
  await send('Page.navigate', { url: 'http://localhost:5173/?screen=game_3d&char=eren' });
  await new Promise(r => setTimeout(r, 2500));

  shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('eren_gameplay_clean.png', Buffer.from(shot.data, 'base64'));
  console.log('Saved eren_gameplay_clean.png');

  // Turn Eren around to face camera
  console.log('Turning Eren around to face the camera...');
  await send('Runtime.evaluate', {
    expression: `
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 's', code: 'KeyS', bubbles: true }));
    `
  });
  await new Promise(r => setTimeout(r, 800));
  await send('Runtime.evaluate', {
    expression: `
      window.dispatchEvent(new KeyboardEvent('keyup', { key: 's', code: 'KeyS', bubbles: true }));
    `
  });
  await new Promise(r => setTimeout(r, 600));

  shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('eren_front_clean.png', Buffer.from(shot.data, 'base64'));
  console.log('Saved eren_front_clean.png');

  ws.close();
  chrome.kill();
  console.log('Verification captures completed!');
}

main().catch(console.error);
