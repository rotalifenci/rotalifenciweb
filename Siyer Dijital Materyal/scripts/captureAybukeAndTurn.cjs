const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

async function run() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9265',
    '--disable-gpu',
    '--window-size=1280,720',
    'http://localhost:5173/?screen=game_3d&char=aybuke'
  ]);
  await new Promise(r => setTimeout(r, 2500));
  const jsonStr = await new Promise((res, rej) => http.get('http://127.0.0.1:9265/json', r => {
    let d = ''; r.on('data', c => d += c); r.on('end', () => res(d));
  }).on('error', rej));
  const target = JSON.parse(jsonStr).find(p => p.url.includes('5173'));
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  let id = 1; const pending = new Map();
  function send(method, params = {}) {
    return new Promise(res => {
      const i = id++; pending.set(i, res); ws.send(JSON.stringify({ id: i, method, params }));
    });
  }
  ws.onmessage = e => { const r = JSON.parse(e.data); if (r.id && pending.has(r.id)) { pending.get(r.id)(r.result); pending.delete(r.id); } };
  await new Promise(r => ws.onopen = r);
  await send('Page.enable');
  await send('Runtime.enable');
  await new Promise(r => setTimeout(r, 2500));

  // 1. Capture Aybüke in the new Mecca environment
  const shot1 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('C:\\Users\\my pc\\.gemini\\antigravity\\brain\\03f413f9-7691-4ee7-91af-b86ce64f3df4\\verified_aybuke_new_mecca.png', Buffer.from(shot1.data, 'base64'));
  console.log('Saved verified_aybuke_new_mecca.png');

  // 2. Dispatch right arrow / D key to turn character and camera towards Mount Abu Qubays
  await send('Input.dispatchKeyEvent', { type: 'keyDown', code: 'KeyD', key: 'd' });
  await new Promise(r => setTimeout(r, 900));
  await send('Input.dispatchKeyEvent', { type: 'keyUp', code: 'KeyD', key: 'd' });
  await new Promise(r => setTimeout(r, 1500));

  const shot2 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('C:\\Users\\my pc\\.gemini\\antigravity\\brain\\03f413f9-7691-4ee7-91af-b86ce64f3df4\\verified_mecca_east_turning.png', Buffer.from(shot2.data, 'base64'));
  console.log('Saved verified_mecca_east_turning.png');

  ws.close();
  chrome.kill();
  process.exit(0);
}
run().catch(console.error);
