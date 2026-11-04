const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

async function ripWebGLMesh() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9911;
  const tempProfile = path.join(process.env.TEMP || 'C:\\Windows\\Temp', 'chrome_rip_' + Date.now());

  console.log('Launching Chrome with WebGL hooks...');
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=' + port,
    '--user-data-dir=' + tempProfile,
    '--disable-gpu',
    'about:blank'
  ]);

  await new Promise(r => setTimeout(r, 4000));

  let jsonStr = '';
  for (let retry = 0; retry < 10; retry++) {
    try {
      jsonStr = await new Promise((resolve, reject) => {
        http.get('http://127.0.0.1:' + port + '/json', res => {
          let d = ''; res.on('data', c => d += c); res.on('end', () => resolve(d));
        }).on('error', reject);
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

  // Inject WebGL interceptor before any scripts run
  await send('Page.addScriptToEvaluateOnNewDocument', {
    source: `
      window.__capturedBuffers = [];
      window.__capturedTextures = [];

      const origBufferData = WebGLRenderingContext.prototype.bufferData;
      WebGLRenderingContext.prototype.bufferData = function(target, data, usage) {
        if (data && data.byteLength > 20000) {
          window.__capturedBuffers.push({
            target: target === 34962 ? 'ARRAY_BUFFER' : (target === 34963 ? 'ELEMENT_ARRAY_BUFFER' : target),
            byteLength: data.byteLength,
            type: data.constructor.name,
            dataBase64: (() => {
              // Only save if it's substantial
              const bytes = new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
              let binary = '';
              const len = Math.min(bytes.length, 5000000);
              for (let i = 0; i < len; i++) {
                binary += String.fromCharCode(bytes[i]);
              }
              return btoa(binary);
            })()
          });
        }
        return origBufferData.apply(this, arguments);
      };

      if (typeof WebGL2RenderingContext !== 'undefined') {
        const origBufferData2 = WebGL2RenderingContext.prototype.bufferData;
        WebGL2RenderingContext.prototype.bufferData = function(target, data, usage) {
          if (data && data.byteLength > 20000) {
            window.__capturedBuffers.push({
              target: target === 34962 ? 'ARRAY_BUFFER' : (target === 34963 ? 'ELEMENT_ARRAY_BUFFER' : target),
              byteLength: data.byteLength,
              type: data.constructor.name,
              dataBase64: (() => {
                const bytes = new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
                let binary = '';
                const len = Math.min(bytes.length, 5000000);
                for (let i = 0; i < len; i++) {
                  binary += String.fromCharCode(bytes[i]);
                }
                return btoa(binary);
              })()
            });
          }
          return origBufferData2.apply(this, arguments);
        };
      }
    `
  });

  console.log('Navigating to Meshy page...');
  await send('Page.navigate', { url: 'https://www.meshy.ai/s/5LR698' });

  // Wait for 3D model to load and render
  await new Promise(r => setTimeout(r, 12000));

  const result = await send('Runtime.evaluate', {
    expression: `
      (() => {
        return (window.__capturedBuffers || []).map(b => ({
          target: b.target,
          byteLength: b.byteLength,
          type: b.type,
          hasData: !!b.dataBase64
        }));
      })()
    `,
    returnByValue: true
  });

  console.log('Captured buffers:', result.result.value);
  chrome.kill();
}

ripWebGLMesh().catch(console.error);
