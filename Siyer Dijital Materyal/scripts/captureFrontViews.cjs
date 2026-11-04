const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

async function captureFrontViews() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9243',
    '--disable-gpu',
    '--window-size=1280,720',
    'http://localhost:5173/'
  ]);

  await new Promise(r => setTimeout(r, 2500));

  const jsonStr = await new Promise((res, rej) => {
    http.get('http://127.0.0.1:9243/json', r => {
      let d = '';
      r.on('data', c => d += c);
      r.on('end', () => res(d));
    }).on('error', rej);
  });

  const pages = JSON.parse(jsonStr);
  const target = pages.find(p => p.url.includes('5173'));
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
    const msg = JSON.parse(e.data);
    if (msg.id && pending.has(msg.id)) {
      pending.get(msg.id)(msg.result);
      pending.delete(msg.id);
    }
  };
  await new Promise(r => ws.onopen = r);
  await send('Runtime.enable');
  await send('Page.enable');
  await send('Input.enable');

  // 1. Aybüke Front View
  await send('Runtime.evaluate', {
    expression: `
      localStorage.setItem('dijital_siyer_progress_v1', JSON.stringify({ currentYear: 571, completedYears: [], unlockedValues: [], character: 'aybuke' }));
      window.location.reload();
    `
  });
  await new Promise(r => setTimeout(r, 2200));

  await send('Runtime.evaluate', {
    expression: `
      const b = Array.from(document.querySelectorAll('button')).find(el => el.innerText.includes('Başla'));
      if (b) b.click();
    `
  });
  await new Promise(r => setTimeout(r, 2000));

  // Press S (backward) to turn character to face the camera!
  console.log('Turning Aybüke towards camera...');
  await send('Input.dispatchKeyEvent', { type: 'keyDown', code: 'KeyS', key: 's' });
  await new Promise(r => setTimeout(r, 450));
  await send('Input.dispatchKeyEvent', { type: 'keyUp', code: 'KeyS', key: 's' });
  await new Promise(r => setTimeout(r, 600));

  const shotAybukeFront = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('C:/Users/my pc/.gemini/antigravity/brain/03f413f9-7691-4ee7-91af-b86ce64f3df4/aybuke_front_facing_fixed.png', Buffer.from(shotAybukeFront.data, 'base64'));

  // 2. Eren Front View
  await send('Runtime.evaluate', {
    expression: `
      localStorage.setItem('dijital_siyer_progress_v1', JSON.stringify({ currentYear: 571, completedYears: [], unlockedValues: [], character: 'eren' }));
      window.location.reload();
    `
  });
  await new Promise(r => setTimeout(r, 2200));

  await send('Runtime.evaluate', {
    expression: `
      const b = Array.from(document.querySelectorAll('button')).find(el => el.innerText.includes('Başla'));
      if (b) b.click();
    `
  });
  await new Promise(r => setTimeout(r, 2000));

  console.log('Turning Eren towards camera...');
  await send('Input.dispatchKeyEvent', { type: 'keyDown', code: 'KeyS', key: 's' });
  await new Promise(r => setTimeout(r, 450));
  await send('Input.dispatchKeyEvent', { type: 'keyUp', code: 'KeyS', key: 's' });
  await new Promise(r => setTimeout(r, 600));

  const shotErenFront = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('C:/Users/my pc/.gemini/antigravity/brain/03f413f9-7691-4ee7-91af-b86ce64f3df4/eren_front_facing_fixed.png', Buffer.from(shotErenFront.data, 'base64'));

  console.log('Front facing screenshots saved!');
  ws.close();
  chrome.kill();
}

captureFrontViews().catch(console.error);
