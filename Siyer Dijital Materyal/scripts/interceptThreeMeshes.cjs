const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

async function interceptMeshes() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9882;

  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=' + port,
    '--disable-gpu',
    'about:blank'
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
  const ws = new WebSocket(pages[0].webSocketDebuggerUrl);
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

  // Intercept Three.js Mesh and Scene creation via prototype
  await send('Page.addScriptToEvaluateOnNewDocument', {
    source: `
      window.__capturedThreeMeshes = [];
      window.__capturedScenes = [];

      let origMesh = Object.getOwnPropertyDescriptor(Object.prototype, 'isMesh');
      Object.defineProperty(Object.prototype, 'isMesh', {
        set: function(val) {
          this._isMeshVal = val;
          if (val) {
            window.__capturedThreeMeshes.push(this);
          }
        },
        get: function() {
          return this._isMeshVal;
        },
        configurable: true
      });

      Object.defineProperty(Object.prototype, 'isScene', {
        set: function(val) {
          this._isSceneVal = val;
          if (val) {
            window.__capturedScenes.push(this);
          }
        },
        get: function() {
          return this._isSceneVal;
        },
        configurable: true
      });
    `
  });

  console.log('Navigating to Meshy page...');
  await send('Page.navigate', { url: 'https://www.meshy.ai/s/5LR698' });

  // Wait 12 seconds for viewer to load model
  await new Promise(r => setTimeout(r, 12000));

  const result = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const meshes = window.__capturedThreeMeshes || [];
        const scenes = window.__capturedScenes || [];
        return {
          meshCount: meshes.length,
          sceneCount: scenes.length,
          meshes: meshes.map(m => ({
            name: m.name,
            type: m.type,
            hasGeo: !!m.geometry,
            vertCount: m.geometry && m.geometry.attributes && m.geometry.attributes.position ? m.geometry.attributes.position.count : 0
          }))
        };
      })()
    `,
    returnByValue: true
  });

  console.log('Interception result:', JSON.stringify(result.result.value, null, 2));
  chrome.kill();
}

interceptMeshes().catch(console.error);
