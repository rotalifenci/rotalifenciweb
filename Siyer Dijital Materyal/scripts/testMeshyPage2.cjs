const { spawn } = require('child_process');
const http = require('http');

async function check() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9899;
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=' + port,
    '--disable-gpu',
    'https://www.meshy.ai/s/5LR698'
  ]);

  await new Promise(r => setTimeout(r, 4000));
  const res = await new Promise((resolve) => {
    http.get('http://127.0.0.1:' + port + '/json', r => {
      let d = ''; r.on('data', c => d += c); r.on('end', () => resolve(d));
    });
  });

  const pages = JSON.parse(res);
  const target = pages.find(p => p.url.includes('meshy.ai')) || pages[0];
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  let msgId = 1;
  function send(method, params = {}) {
    return new Promise(resolve => {
      const id = msgId++;
      const handler = (e) => {
        const d = JSON.parse(e.data);
        if (d.id === id) {
          ws.removeEventListener('message', handler);
          resolve(d.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  await send('Page.enable');
  await send('Runtime.enable');
  await new Promise(r => setTimeout(r, 4000));

  const result = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const all = Array.from(document.querySelectorAll('*'));
        return all
          .filter(el => el.textContent && (el.textContent.includes('Download') || el.textContent.includes('İndir') || el.textContent.includes('GLB')))
          .map(el => ({ tag: el.tagName, text: el.textContent.trim().slice(0, 50), class: el.className }))
          .slice(0, 20);
      })()
    `,
    returnByValue: true
  });
  console.log('Download elements:', result.result.value);
  chrome.kill();
}
check().catch(console.error);
