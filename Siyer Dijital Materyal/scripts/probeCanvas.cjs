const { spawn } = require('child_process');
const http = require('http');

async function probeCanvas() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9880;

  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=' + port,
    '--disable-gpu',
    'https://www.meshy.ai/s/5LR698'
  ]);

  await new Promise(r => setTimeout(r, 4500));

  let jsonStr = '';
  for (let i = 0; i < 8; i++) {
    try {
      jsonStr = await new Promise((resolve, reject) => {
        const req = http.get('http://127.0.0.1:' + port + '/json', res => {
          let d = ''; res.on('data', c => d += c); res.on('end', () => resolve(d));
        });
        req.on('error', reject);
        req.setTimeout(1500, () => { req.destroy(); reject(new Error('timeout')); });
      });
      if (jsonStr && jsonStr.trim().startsWith('[')) break;
    } catch {
      await new Promise(r => setTimeout(r, 800));
    }
  }

  const pages = JSON.parse(jsonStr);
  const target = pages.find(p => p.url.includes('meshy.ai')) || pages[0];
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  let msgId = 1;
  function send(method, params = {}) {
    return new Promise(resolve => {
      const id = msgId++;
      const handler = e => {
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
  await new Promise(r => setTimeout(r, 9000));

  const probe = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const canvas = document.querySelector('canvas');
        if (!canvas) return { error: 'No canvas' };

        // Check canvas properties
        const canvasKeys = Object.keys(canvas);
        const hasR3F = '__r3f' in canvas;
        
        // Check window.__THREE__
        let threeVersion = window.__THREE__;

        // Check if we can find any WebGLBuffers
        const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');

        return {
          canvasKeys,
          hasR3F,
          threeVersion,
          r3fKeys: hasR3F ? Object.keys(canvas.__r3f) : null
        };
      })()
    `,
    returnByValue: true
  });

  console.log('Canvas probe:', probe.result.value);
  chrome.kill();
}

probeCanvas().catch(console.error);
