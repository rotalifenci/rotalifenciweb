const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

async function testFront() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9248',
    '--disable-gpu',
    '--window-size=1280,720',
    'http://localhost:5173/?screen=game_3d&char=aybuke'
  ]);
  await new Promise(r => setTimeout(r, 2500));
  const json = await new Promise((res, rej) => {
    http.get('http://127.0.0.1:9248/json', r => {
      let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
    }).on('error', rej);
  });
  const page = json.find(p => p.url.includes('5173'));
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);
  let id = 1;
  const send = (m, p = {}) => new Promise(res => {
    const cur = id++;
    const handler = e => {
      const msg = JSON.parse(e.data);
      if (msg.id === cur) { ws.removeEventListener('message', handler); res(msg.result); }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id: cur, method: m, params: p }));
  });
  await send('Page.enable');
  await send('Runtime.enable');

  // Rotate camera to front
  await send('Runtime.evaluate', {
    expression: `
      const dbg = window.__debugGame;
      if (dbg) {
        dbg.camera.position.set(0, dbg.playerPos.y + 1.15, 2.3);
        dbg.camera.lookAt(0, dbg.playerPos.y + 1.0, 4.0);
      }
    `
  });
  await new Promise(r => setTimeout(r, 600));
  const shotAybuke = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('C:/Users/my pc/.gemini/antigravity/brain/03f413f9-7691-4ee7-91af-b86ce64f3df4/aybuke_face_closeup_current.png', Buffer.from(shotAybuke.data, 'base64'));

  // Now Eren
  await send('Page.navigate', { url: 'http://localhost:5173/?screen=game_3d&char=eren' });
  await new Promise(r => setTimeout(r, 2500));
  await send('Runtime.evaluate', {
    expression: `
      const dbg = window.__debugGame;
      if (dbg) {
        dbg.camera.position.set(0, dbg.playerPos.y + 1.15, 2.3);
        dbg.camera.lookAt(0, dbg.playerPos.y + 1.0, 4.0);
      }
    `
  });
  await new Promise(r => setTimeout(r, 600));
  const shotEren = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('C:/Users/my pc/.gemini/antigravity/brain/03f413f9-7691-4ee7-91af-b86ce64f3df4/eren_face_closeup_current.png', Buffer.from(shotEren.data, 'base64'));

  console.log('Closeups captured!');
  chrome.kill();
  process.exit(0);
}
testFront();
