const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

async function main() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9229',
    '--disable-gpu',
    '--window-size=1280,720',
    'http://localhost:5173/'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  const jsonStr = await new Promise((resolve, reject) => {
    http.get('http://127.0.0.1:9229/json', res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });

  const pages = JSON.parse(jsonStr);
  const target = pages.find(p => p.url.includes('5173'));
  const ws = new WebSocket(target.webSocketDebuggerUrl);

  let msgId = 1;
  const pending = new Map();

  function send(method, params = {}) {
    return new Promise((resolve) => {
      const id = msgId++;
      pending.set(id, resolve);
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id && pending.has(msg.id)) {
      pending.get(msg.id)(msg.result);
      pending.delete(msg.id);
    }
  };

  await new Promise(r => ws.onopen = r);
  await send('Runtime.enable');

  await new Promise(r => setTimeout(r, 1000));

  // Find and click Aybüke
  const clickRes = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const h2 = Array.from(document.querySelectorAll('h2')).find(el => el.textContent.includes('Aybüke'));
        if (h2) {
          h2.closest('[class*="cursor-pointer"]')?.click();
          return 'Clicked Aybüke card!';
        }
        return 'Aybüke not found!';
      })()
    `
  });
  console.log('Pick Aybüke:', clickRes);

  await new Promise(r => setTimeout(r, 600));

  await send('Runtime.evaluate', {
    expression: `Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Başla'))?.click()`
  });

  await new Promise(r => setTimeout(r, 2500));

  const shot = await send('Page.captureScreenshot', { format: 'png' });
  if (shot && shot.data) {
    fs.writeFileSync('aybuke_debug.png', Buffer.from(shot.data, 'base64'));
    console.log('Saved aybuke_debug.png');
  }

  ws.close();
  chrome.kill();
}

main().catch(console.error);
