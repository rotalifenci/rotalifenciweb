const fs = require('fs');
const http = require('http');
const { spawn } = require('child_process');

async function snapFronts() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9258',
    '--disable-gpu',
    '--window-size=1280,720',
    'http://localhost:5173/?screen=game_3d&char=aybuke'
  ]);

  await new Promise(r => setTimeout(r, 2200));

  const jsonStr = await new Promise((res, rej) => {
    http.get('http://127.0.0.1:9258/json', r => {
      let d = '';
      r.on('data', c => d += c);
      r.on('end', () => res(d));
    }).on('error', rej);
  });

  const pages = JSON.parse(jsonStr);
  const target = pages.find(p => p.url.includes('5173'));
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  let msgId = 1;
  const pending = new Map();
  function send(method, params = {}) {
    return new Promise(res => {
      const id = msgId++;
      pending.set(id, res);
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

  await send('Runtime.enable');
  await send('Page.enable');

  // Open 3D Inspector Modal
  await send('Runtime.evaluate', {
    expression: "(() => { const btns = Array.from(document.querySelectorAll('button')); const b = btns.find(x => x.textContent && x.textContent.includes('3D') && x.textContent.includes('İncele')); if (b) b.click(); })()"
  });
  await new Promise(r => setTimeout(r, 1800));

  // Disable auto-rotate and click front preset
  await send('Runtime.evaluate', {
    expression: "(() => { const btns = Array.from(document.querySelectorAll('button')); const stopBtn = btns.find(x => x.textContent && x.textContent.includes('Dönüşü Durdur')); if (stopBtn) stopBtn.click(); const frontBtn = btns.find(x => x.textContent && x.textContent.includes('Önden')); if (frontBtn) frontBtn.click(); })()"
  });
  await new Promise(r => setTimeout(r, 1200));

  let shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('aybuke_front_inspector_perfect.png', Buffer.from(shot.data, 'base64'));
  console.log('Saved aybuke_front_inspector_perfect.png');

  // Switch to Eren
  await send('Runtime.evaluate', {
    expression: "(() => { const btns = Array.from(document.querySelectorAll('button')); const erenBtn = btns.find(x => x.textContent && x.textContent.includes('Eren')); if (erenBtn) erenBtn.click(); })()"
  });
  await new Promise(r => setTimeout(r, 1500));

  await send('Runtime.evaluate', {
    expression: "(() => { const btns = Array.from(document.querySelectorAll('button')); const frontBtn = btns.find(x => x.textContent && x.textContent.includes('Önden')); if (frontBtn) frontBtn.click(); })()"
  });
  await new Promise(r => setTimeout(r, 1200));

  shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('eren_front_inspector_perfect.png', Buffer.from(shot.data, 'base64'));
  console.log('Saved eren_front_inspector_perfect.png');

  ws.close();
  chrome.kill();
}

snapFronts().catch(console.error);
