const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

async function testFront() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9242',
    '--disable-gpu',
    '--window-size=1280,720',
    'http://localhost:5173/'
  ]);

  await new Promise(r => setTimeout(r, 2500));

  const jsonStr = await new Promise((res, rej) => {
    http.get('http://127.0.0.1:9242/json', r => {
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

  // Start game with Aybuke
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

  // Open 3D Incele modal
  await send('Runtime.evaluate', {
    expression: `
      const b = Array.from(document.querySelectorAll('button')).find(el => el.innerText.includes('3D İncele'));
      if (b) b.click();
    `
  });
  await new Promise(r => setTimeout(r, 1500));

  const shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('public/assets/aybuke_inspector_view.png', Buffer.from(shot.data, 'base64'));
  fs.writeFileSync('C:/Users/my pc/.gemini/antigravity/brain/03f413f9-7691-4ee7-91af-b86ce64f3df4/aybuke_inspector_view.png', Buffer.from(shot.data, 'base64'));

  // Switch to Eren in inspector
  await send('Runtime.evaluate', {
    expression: `
      const b = Array.from(document.querySelectorAll('button')).find(el => el.innerText.includes('Eren'));
      if (b) b.click();
    `
  });
  await new Promise(r => setTimeout(r, 1200));

  const shotEren = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('public/assets/eren_inspector_view.png', Buffer.from(shotEren.data, 'base64'));
  fs.writeFileSync('C:/Users/my pc/.gemini/antigravity/brain/03f413f9-7691-4ee7-91af-b86ce64f3df4/eren_inspector_view.png', Buffer.from(shotEren.data, 'base64'));

  console.log('Inspector screenshots saved successfully!');
  ws.close();
  chrome.kill();
}
testFront().catch(console.error);
