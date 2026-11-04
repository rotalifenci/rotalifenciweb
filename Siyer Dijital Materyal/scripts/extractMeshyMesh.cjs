const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

async function extractMeshyMesh() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9879;

  console.log('Starting Chrome on https://www.meshy.ai/s/5LR698 ...');
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=' + port,
    '--disable-gpu',
    '--window-size=1280,720',
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

  console.log('Waiting 8 seconds for 3D viewer to initialize...');
  await new Promise(r => setTimeout(r, 8000));

  // Find canvas and WebGL context
  const evalRes = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const canvas = document.querySelector('canvas');
        if (!canvas) return { error: 'No canvas found' };

        // Try getting WebGL context
        const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
        if (!gl) return { error: 'No WebGL context' };

        // Check if there are THREE objects or meshes in memory
        let objects = [];
        // Traverse window
        for (const k of Object.keys(window)) {
          try {
            const val = window[k];
            if (val && typeof val === 'object' && val.isMesh) {
              objects.push(k);
            }
          } catch(e) {}
        }

        return {
          canvasW: canvas.width,
          canvasH: canvas.height,
          hasGL: !!gl,
          objects
        };
      })()
    `,
    returnByValue: true
  });

  console.log('Evaluation result:', evalRes.result.value);
  chrome.kill();
}

extractMeshyMesh().catch(console.error);
