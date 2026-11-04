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

  await new Promise(r => setTimeout(r, 2000));

  const jsonStr = await new Promise((resolve, reject) => {
    http.get('http://127.0.0.1:9230/json', res => {
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

  // Click "Başla"
  console.log('Clicking Başla...');
  await send('Runtime.evaluate', {
    expression: `Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Başla'))?.click()`
  });

  await new Promise(r => setTimeout(r, 2000));

  // Capture HUD with Exit Button
  const shot1 = await send('Page.captureScreenshot', { format: 'png' });
  if (shot1 && shot1.data) {
    fs.writeFileSync('hud_with_exit.png', Buffer.from(shot1.data, 'base64'));
    console.log('Saved hud_with_exit.png');
  }

  // Click Exit ("Çıkış") Button
  console.log('Clicking Çıkış button in HUD...');
  const exitClickRes = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Çıkış'));
        if (btn) {
          btn.click();
          return 'Clicked Çıkış!';
        }
        return 'Çıkış button not found!';
      })()
    `
  });
  console.log('Exit button click result:', exitClickRes);

  await new Promise(r => setTimeout(r, 1000));

  // Capture Exit Confirmation Modal
  const shot2 = await send('Page.captureScreenshot', { format: 'png' });
  if (shot2 && shot2.data) {
    fs.writeFileSync('exit_confirm_modal.png', Buffer.from(shot2.data, 'base64'));
    console.log('Saved exit_confirm_modal.png');
  }

  // Click "Çıkış Yap" in modal
  console.log('Clicking "Çıkış Yap" to return to Main Menu...');
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Çıkış Yap'));
        if (btn) btn.click();
      })()
    `
  });

  await new Promise(r => setTimeout(r, 1200));

  // Capture Main Menu returned
  const shot3 = await send('Page.captureScreenshot', { format: 'png' });
  if (shot3 && shot3.data) {
    fs.writeFileSync('menu_returned.png', Buffer.from(shot3.data, 'base64'));
    console.log('Saved menu_returned.png');
  }

  ws.close();
  chrome.kill();
}

main().catch(console.error);
