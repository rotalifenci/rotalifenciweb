const { spawn } = require('child_process');
const http = require('http');

async function inspectWebGL() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9898;
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
  await new Promise(r => setTimeout(r, 6000));

  const inspection = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const canvases = Array.from(document.querySelectorAll('canvas'));
        const hasThree = typeof THREE !== 'undefined' || typeof window.__THREE__ !== 'undefined';
        const hasBabylon = typeof BABYLON !== 'undefined';
        
        // Check window properties for scene or viewer
        const winKeys = Object.keys(window).filter(k => 
          k.toLowerCase().includes('three') || 
          k.toLowerCase().includes('scene') || 
          k.toLowerCase().includes('viewer') || 
          k.toLowerCase().includes('mesh') ||
          k.toLowerCase().includes('model')
        );

        return {
          canvasesCount: canvases.length,
          canvasesInfo: canvases.map(c => ({ w: c.width, h: c.height, class: c.className })),
          hasThree,
          hasBabylon,
          winKeys
        };
      })()
    `,
    returnByValue: true
  });

  console.log('Inspection:', JSON.stringify(inspection.result.value, null, 2));
  chrome.kill();
}

inspectWebGL().catch(console.error);
