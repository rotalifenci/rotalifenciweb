const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

async function extractGLBFromMeshy() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9883;

  console.log('Launching Chrome to intercept decrypted GLB blob...');
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

  // Intercept URL.createObjectURL on new document
  await send('Page.addScriptToEvaluateOnNewDocument', {
    source: `
      window.__capturedBlobs = [];
      const origCreateObjectURL = URL.createObjectURL;
      URL.createObjectURL = function(obj) {
        const url = origCreateObjectURL.apply(this, arguments);
        if (obj instanceof Blob) {
          window.__capturedBlobs.push({
            url: url,
            size: obj.size,
            type: obj.type
          });

          // If it's a model or large binary blob (> 500KB), read it as base64!
          if (obj.size > 200000 || obj.type.includes('gltf') || obj.type.includes('model')) {
            const reader = new FileReader();
            reader.onload = function() {
              window.__modelGLBBase64 = reader.result;
              window.__modelGLBSize = obj.size;
              console.log('CAPTURED GLB BLOB! Size:', obj.size);
            };
            reader.readAsDataURL(obj);
          }
        }
        return url;
      };
    `
  });

  console.log('Reloading page with interceptor active...');
  await send('Page.reload');

  // Wait 15 seconds for Meshy loader to fetch, decrypt and createObjectURL
  for (let s = 1; s <= 15; s++) {
    await new Promise(r => setTimeout(r, 1000));
    process.stdout.write('.');
  }
  console.log('\nChecking for captured GLB...');

  const checkRes = await send('Runtime.evaluate', {
    expression: `
      (() => {
        return {
          blobs: window.__capturedBlobs || [],
          hasGLB: !!window.__modelGLBBase64,
          glbLength: window.__modelGLBBase64 ? window.__modelGLBBase64.length : 0,
          glbSize: window.__modelGLBSize || 0
        };
      })()
    `,
    returnByValue: true
  });

  console.log('Blob report:', checkRes.result.value);

  if (checkRes.result.value.hasGLB) {
    const dataRes = await send('Runtime.evaluate', {
      expression: `window.__modelGLBBase64`,
      returnByValue: true
    });

    const dataUrl = dataRes.result.value;
    const base64Data = dataUrl.replace(/^data:[^;]+;base64,/, '');
    const glbBuffer = Buffer.from(base64Data, 'base64');

    console.log('SUCCESS! Extracted GLB buffer length:', glbBuffer.length);
    console.log('Header magic (first 4 bytes):', glbBuffer.slice(0, 4).toString('ascii'));

    // Save directly to project models!
    const erenPublic = path.join(__dirname, '..', 'public', 'models', 'eren.glb');
    const erenPublicAssets = path.join(__dirname, '..', 'public', 'assets', 'models', 'eren.glb');
    const erenDist = path.join(__dirname, '..', 'dist', 'models', 'eren.glb');
    const erenDistAssets = path.join(__dirname, '..', 'dist', 'assets', 'models', 'eren.glb');

    [erenPublic, erenPublicAssets, erenDist, erenDistAssets].forEach(p => {
      const dir = path.dirname(p);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(p, glbBuffer);
    });

    console.log('Saved decrypted Meshy model to all eren.glb locations!');
  }

  chrome.kill();
}

extractGLBFromMeshy().catch(console.error);
