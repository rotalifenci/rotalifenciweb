const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const fs = require('fs');

async function testMeshyDownload() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9888;
  const tempProfile = path.join(process.env.TEMP || 'C:\\Windows\\Temp', 'chrome_meshy_' + Date.now());

  console.log('Launching Chrome to inspect Meshy page...');
  const chrome = spawn(chromePath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${tempProfile}`,
    '--disable-gpu',
    '--window-size=1280,720',
    'https://www.meshy.ai/s/5LR698'
  ]);

  await new Promise(r => setTimeout(r, 4000));

  let jsonStr = '';
  for (let retry = 0; retry < 12; retry++) {
    try {
      jsonStr = await new Promise((resolve, reject) => {
        http.get(`http://127.0.0.1:${port}/json`, res => {
          let data = '';
          res.on('data', chunk => data += chunk);
          res.on('end', () => resolve(data));
        }).on('error', reject);
      });
      if (jsonStr && jsonStr.trim().startsWith('[')) break;
    } catch {
      await new Promise(r => setTimeout(r, 1000));
    }
  }

  const pages = JSON.parse(jsonStr);
  const target = pages.find(p => p.url.includes('meshy.ai')) || pages[0];
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  let msgId = 1;
  const pending = new Map();
  function send(method, params = {}) {
    return new Promise(resolve => {
      const id = msgId++;
      pending.set(id, resolve);
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  const networkUrls = [];
  ws.onmessage = e => {
    const res = JSON.parse(e.data);
    if (res.method === 'Network.requestWillBeSent') {
      const u = res.params.request.url;
      if (u.includes('glb') || u.includes('models') || u.includes('download') || u.includes('task')) {
        networkUrls.push(u);
      }
    }
    if (res.id && pending.has(res.id)) {
      const cb = pending.get(res.id);
      pending.delete(res.id);
      cb(res.result);
    }
  };

  await send('Network.enable');
  await send('Page.enable');
  await send('Runtime.enable');

  await new Promise(r => setTimeout(r, 6000));

  // Find buttons on the page
  const pageEval = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const btns = Array.from(document.querySelectorAll('button, a'));
        return btns.map(b => ({
          tag: b.tagName,
          text: b.innerText,
          href: b.href,
          ariaLabel: b.getAttribute('aria-label')
        }));
      })()
    `,
    returnByValue: true
  });

  console.log('Buttons on page:', pageEval.result.value);
  console.log('Captured network URLs:', networkUrls);

  chrome.kill();
}

testMeshyDownload().catch(console.error);
